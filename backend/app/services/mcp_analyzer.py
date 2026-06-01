from __future__ import annotations

from typing import Any

from app.schemas.phase4 import MCPServerReport

SECRET_PATTERNS = [
    "password",
    "passwd",
    "secret",
    "api_key",
    "apikey",
    "token",
    "credential",
    "private_key",
]


def _has_hardcoded_secrets(obj: dict[str, Any]) -> bool:
    """Check if a dict's keys or values contain obvious secret patterns."""
    for k, v in obj.items():
        kl = k.lower()
        for pat in SECRET_PATTERNS:
            if pat in kl:
                return True
        if isinstance(v, str):
            vl = v.lower()
            # Skip env var references like {env:FOO}
            if vl.startswith("{env:"):
                continue
            # Check value length — long strings might be tokens
            if len(v) > 20 and any(pat in kl for pat in SECRET_PATTERNS):
                return True
    return False


def _check_env_for_secrets(env: dict[str, Any] | None) -> list[str]:
    """Check environment variables for hardcoded secrets."""
    issues: list[str] = []
    if not env:
        return issues
    for k, v in env.items():
        v_str = str(v)
        if v_str.startswith("{env:"):
            continue
        if len(v_str) > 20 or any(
            pat in k.lower() for pat in ["token", "secret", "password", "key", "credential"]
        ):
            issues.append(
                f"Environment variable '{k}' may contain a hardcoded secret."
                " Use ${{env:NAME}} instead"
            )
    return issues


def analyze_mcp_servers(mcp_config: dict[str, Any] | None) -> list[MCPServerReport]:
    """Analyze all MCP server entries in an opencode.json config."""
    if not mcp_config or not isinstance(mcp_config, dict):
        return []

    servers: list[MCPServerReport] = []

    for name, config in mcp_config.items():
        if not isinstance(config, dict):
            servers.append(
                MCPServerReport(
                    name=str(name),
                    config_issues=["Server config must be an object"],
                    score=0,
                )
            )
            continue

        report = MCPServerReport(name=str(name))
        config_issues: list[str] = []
        security_issues: list[str] = []

        server_type = config.get("type")
        report.type = str(server_type) if server_type else None

        if server_type == "local":
            report.type_valid = True
            cmd = config.get("command")
            if isinstance(cmd, list) and len(cmd) > 0:
                report.has_command = True
            else:
                config_issues.append("Local MCP server requires a 'command' array")

            env = config.get("environment")
            if isinstance(env, dict):
                security_issues.extend(_check_env_for_secrets(env))
            elif env is not None:
                config_issues.append("'environment' must be an object if present")

        elif server_type == "remote":
            report.type_valid = True
            url = config.get("url")
            if isinstance(url, str) and url:
                report.has_url = True
            else:
                config_issues.append("Remote MCP server requires a 'url' string")

            headers = config.get("headers")
            if isinstance(headers, dict):
                if _has_hardcoded_secrets(headers):
                    security_issues.append(
                        "Headers may contain hardcoded secrets."
                        " Use ${{env:NAME}} for sensitive values"
                    )
            elif headers is not None:
                config_issues.append("'headers' must be an object if present")

            oauth = config.get("oauth")
            if isinstance(oauth, dict) and _has_hardcoded_secrets(oauth):
                security_issues.append(
                    "OAuth config may contain hardcoded secrets. Use ${{env:NAME}} for clientSecret"
                )

        else:
            if server_type is None:
                config_issues.append("Missing required field 'type' (must be 'local' or 'remote')")
            else:
                report.type_valid = False
                config_issues.append(
                    f"Unknown MCP type '{server_type}' (must be 'local' or 'remote')"
                )

        if "enabled" in config:
            report.has_enabled = True
        else:
            config_issues.append(
                "Missing 'enabled' field — set to true/false explicitly for clarity"
            )

        timeout = config.get("timeout")
        if timeout is not None and (not isinstance(timeout, int | float) or timeout <= 0):
            config_issues.append("'timeout' must be a positive number (ms)")

        score = 0
        if report.type_valid:
            score += 25
        if report.has_command or report.has_url:
            score += 25
        if report.has_enabled:
            score += 25
        if not security_issues:
            score += 25
        else:
            score += 25
            score -= min(len(security_issues) * 10, 25)

        score = max(0, min(100, score))

        report.config_issues = config_issues
        report.security_issues = security_issues
        report.score = score

        servers.append(report)

    return servers
