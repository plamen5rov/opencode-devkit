from __future__ import annotations

from typing import Any

from app.schemas.phase4 import ToolPermissionReport

BUILT_IN_TOOLS = {
    "bash",
    "edit",
    "write",
    "read",
    "glob",
    "grep",
    "webfetch",
    "websearch",
    "skill",
    "todowrite",
    "question",
    "lsp",
    "apply_patch",
    "task",
}

SECURITY_SENSITIVE_TOOLS = {"bash", "edit", "write", "apply_patch", "webfetch"}

PERMISSION_VALUES = {"allow", "ask", "deny"}


def analyze_tools(permissions: dict[str, Any] | None) -> list[ToolPermissionReport]:
    """Analyze tool permission entries from an opencode.json config."""
    if not permissions or not isinstance(permissions, dict):
        return []

    tools: list[ToolPermissionReport] = []

    for key, value in permissions.items():
        # Skip "bash" if value is a dict (sub-permission rules)
        if isinstance(value, dict):
            tools.append(
                ToolPermissionReport(
                    tool_name=key,
                    permission=None,
                    is_wildcard="*" in key,
                    is_security_sensitive=key in SECURITY_SENSITIVE_TOOLS or key == "bash",
                    recommendation="Sub-permission rules detected — review individual entries",
                )
            )
            continue

        perm = str(value) if isinstance(value, str) else None
        is_wildcard = "*" in key
        is_sensitive = (
            key in SECURITY_SENSITIVE_TOOLS or key in BUILT_IN_TOOLS and key.startswith("bash")
        )

        recommendation: str | None = None
        if perm and perm not in PERMISSION_VALUES:
            recommendation = f"'{perm}' is not a valid permission (use allow/ask/deny)"
        elif is_sensitive and perm == "allow":
            recommendation = f"'{key}' is security-sensitive — consider changing to 'ask'"
        elif is_sensitive and perm is None:
            recommendation = f"'{key}' is security-sensitive — add an explicit permission"

        tools.append(
            ToolPermissionReport(
                tool_name=key,
                permission=perm if perm in PERMISSION_VALUES else perm,
                is_wildcard=is_wildcard,
                is_security_sensitive=is_sensitive,
                recommendation=recommendation,
            )
        )

    return tools


def get_missing_critical(tools: list[ToolPermissionReport]) -> list[str]:
    """Identify security-sensitive tools that have no explicit permission rule."""
    covered = {t.tool_name for t in tools}
    missing: list[str] = []
    for tool in sorted(SECURITY_SENSITIVE_TOOLS):
        # Check if tool is covered by any rule (exact or wildcard)
        covered_by_wildcard = any(
            name.endswith("*") and tool.startswith(name[:-1]) for name in covered
        )
        if tool not in covered and not covered_by_wildcard:
            missing.append(tool)
    return missing
