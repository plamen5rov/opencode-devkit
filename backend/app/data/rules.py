from __future__ import annotations

from typing import Any

from app.schemas.config import MissingSetting, SecurityIssue

SECURITY_RULES: list[dict[str, Any]] = [
    {
        "check": lambda c: not c.get("permission"),
        "issue": SecurityIssue(
            severity="high",
            setting="permission",
            title="No permission rules configured",
            description=(
                "Without a permission config, OpenCode defaults to allowing all "
                "tool operations. Any agent can run shell commands, edit files, "
                "and make network requests without approval."
            ),
            remediation='Add a "permission" section with at minimum a catch-all "ask" rule:\n'
            '"permission": {"*": "ask"}',
            learn_more_url="https://opencode.ai/docs/permissions",
        ),
    },
    {
        "check": lambda c: (
            c.get("permission", {}).get("*") == "allow"
            or (isinstance(c.get("permission"), str) and c.get("permission") == "allow")
        ),
        "issue": SecurityIssue(
            severity="critical",
            setting="permission.*",
            title="All permissions set to 'allow'",
            description=(
                "Setting all permissions to 'allow' means any tool can run without approval. "
                "This is equivalent to having no permission config at all, leaving the system "
                "vulnerable to malicious or accidental destructive operations."
            ),
            remediation="Change the catch-all rule to 'ask' and whitelist only trusted commands:\n"
            '"permission": {"*": "ask", "bash": {"*": "ask", "git *": "allow"}}',
            learn_more_url="https://opencode.ai/docs/permissions",
        ),
    },
    {
        "check": lambda c: _bash_is_allow_all(c),
        "issue": SecurityIssue(
            severity="critical",
            setting="permission.bash",
            title="Bash tool allows all commands",
            description=(
                "When the bash permission allows all commands, an agent can execute "
                "arbitrary shell commands including destructive operations like "
                "'rm -rf', 'curl | sh', or credential exfiltration."
            ),
            remediation="Restrict bash to specific safe commands:\n"
            '"permission": {"bash": {"*": "ask", "git *": "allow", "npm *": "allow"}}',
            learn_more_url="https://opencode.ai/docs/permissions#granular-rules-object-syntax",
        ),
    },
    {
        "check": lambda c: c.get("share") == "auto",
        "issue": SecurityIssue(
            severity="medium",
            setting="share",
            title="Auto-sharing conversations enabled",
            description=(
                "Auto-sharing sends every new conversation to a web URL. This may "
                "inadvertently expose sensitive code, credentials, or internal discussions."
            ),
            remediation='Change to "manual" (share only when explicitly asked) or "disabled":\n'
            '"share": "manual"',
            learn_more_url="https://opencode.ai/docs/share",
        ),
    },
    {
        "check": lambda c: c.get("autoupdate") is True,
        "issue": SecurityIssue(
            severity="medium",
            setting="autoupdate",
            title="Automatic updates enabled",
            description=(
                "OpenCode will download and apply updates automatically on startup. "
                "In controlled environments, unvetted updates may introduce breaking "
                "changes or unapproved functionality."
            ),
            remediation='Use "notify" to receive update notifications without auto-install:\n'
            '"autoupdate": "notify"',
            learn_more_url="https://opencode.ai/docs/config#autoupdate",
        ),
    },
    {
        "check": lambda c: not c.get("snapshot", True),
        "issue": SecurityIssue(
            severity="low",
            setting="snapshot",
            title="Snapshots disabled",
            description=(
                "Without snapshots, file changes made by agents cannot be rolled back "
                "within the session. A buggy or malicious agent could permanently damage "
                "project files with no undo option."
            ),
            remediation='Enable snapshots (the default) or explicitly set:\n"snapshot": true',
            learn_more_url="https://opencode.ai/docs/config#snapshot",
        ),
    },
    {
        "check": lambda c: _has_api_keys_in_config(c),
        "issue": SecurityIssue(
            severity="critical",
            setting="provider.*.options.apiKey",
            title="API keys hardcoded in config",
            description=(
                "Hardcoding API keys in your opencode.json is dangerous — if committed "
                "to a public repo, anyone can use your credentials to make API calls "
                "on your behalf and accrue charges."
            ),
            remediation="Use environment variable substitution instead:\n"
            '"apiKey": "{env:ANTHROPIC_API_KEY}"',
            learn_more_url="https://opencode.ai/docs/config#env-vars",
        ),
    },
    {
        "check": lambda c: (
            "mcp" in c
            and any(
                isinstance(v, dict) and v.get("type") == "remote" and v.get("enabled", False)
                for v in (c.get("mcp") or {}).values()
            )
        ),
        "issue": SecurityIssue(
            severity="medium",
            setting="mcp.*.enabled",
            title="Remote MCP servers enabled",
            description=(
                "Remote MCP servers connect to external services that may have access "
                "to sensitive data or operations. Ensure each enabled server is trusted "
                "and needed."
            ),
            remediation=(
                "Review enabled MCP servers and disable any that are not necessary. "
                "Set enabled: false for unused servers."
            ),
            learn_more_url="https://opencode.ai/docs/mcp-servers",
        ),
    },
]

RECOMMENDED_SETTINGS: list[dict[str, Any]] = [
    {
        "check": lambda c: not c.get("model"),
        "setting": MissingSetting(
            severity="recommended",
            setting="model",
            title="No primary model configured",
            description=(
                "Specifying a model ensures consistent behavior across sessions. "
                "Without it, OpenCode falls back to its default, which may change "
                "across versions."
            ),
            example='"model": "anthropic/claude-sonnet-4-5"',
            learn_more_url="https://opencode.ai/docs/config#models",
        ),
    },
    {
        "check": lambda c: not c.get("small_model"),
        "setting": MissingSetting(
            severity="optional",
            setting="small_model",
            title="No small model configured",
            description=(
                "A small model handles lightweight tasks like title generation, "
                "reducing cost and latency for simple operations."
            ),
            example='"small_model": "anthropic/claude-haiku-4-5"',
            learn_more_url="https://opencode.ai/docs/config#models",
        ),
    },
    {
        "check": lambda c: not c.get("instructions"),
        "setting": MissingSetting(
            severity="recommended",
            setting="instructions",
            title="No instructions configured",
            description=(
                "Instructions files (AGENTS.md, CONTRIBUTING.md) give the model "
                "project-specific context, conventions, and rules. Without them, "
                "agents work with generic guidance only."
            ),
            example='"instructions": ["AGENTS.md", "CONTRIBUTING.md"]',
            learn_more_url="https://opencode.ai/docs/config#instructions",
        ),
    },
    {
        "check": lambda c: not c.get("permission"),
        "setting": MissingSetting(
            severity="recommended",
            setting="permission",
            title="No permission rules configured",
            description=(
                "Permission rules let you control which tools agents can use and "
                "when they need approval. The default is permissive — better to "
                "define explicit boundaries."
            ),
            example='"permission": {"*": "ask", "bash": {"*": "ask", "git *": "allow"}}',
            learn_more_url="https://opencode.ai/docs/permissions",
        ),
    },
    {
        "check": lambda c: not c.get("compaction"),
        "setting": MissingSetting(
            severity="optional",
            setting="compaction",
            title="No compaction settings configured",
            description=(
                "Compaction controls how context is managed when the token limit "
                "is reached. Tuning these can improve performance in long sessions."
            ),
            example='"compaction": {"auto": true, "prune": true, "reserved": 10000}',
            learn_more_url="https://opencode.ai/docs/config#compaction",
        ),
    },
    {
        "check": lambda c: not c.get("watcher"),
        "setting": MissingSetting(
            severity="optional",
            setting="watcher",
            title="No watcher ignore patterns configured",
            description=(
                "The file watcher monitors project files for changes. Excluding "
                "noisy directories like node_modules/ reduces CPU usage."
            ),
            example='"watcher": {"ignore": ["node_modules/**", "dist/**", ".git/**"]}',
            learn_more_url="https://opencode.ai/docs/config#watcher",
        ),
    },
    {
        "check": lambda c: not c.get("server"),
        "setting": MissingSetting(
            severity="optional",
            setting="server",
            title="No server config",
            description=(
                "If you use 'opencode serve' or 'opencode web', configuring server "
                "settings (port, CORS, mDNS) is important for correct operation."
            ),
            example='"server": {"port": 4096, "cors": ["http://localhost:5173"]}',
            learn_more_url="https://opencode.ai/docs/config#server",
        ),
    },
]

OPTIMIZATIONS: list[dict[str, Any]] = [
    {
        "check": lambda c: c.get("autoupdate") is True,
        "recommendation": {
            "setting": "autoupdate",
            "recommended": "notify",
            "reason": (
                "Use notify instead of true to receive update alerts without automatic installs"
            ),
        },
    },
    {
        "check": lambda c: (
            c.get("permission", {}) == {} and not isinstance(c.get("permission"), str)
        ),
        "recommendation": {
            "setting": "permission",
            "recommended": {"*": "ask"},
            "reason": "Add explicit permission defaults for safety",
        },
    },
    {
        "check": lambda c: not _strip_legacy_schema(c.get("$schema")),
        "recommendation": {
            "setting": "$schema",
            "recommended": "https://opencode.ai/config.json",
            "reason": "Adding $schema enables IDE validation and autocompletion",
        },
    },
]


def _bash_is_allow_all(config: dict[str, Any]) -> bool:
    perm = config.get("permission", {})
    if isinstance(perm, dict) and isinstance(perm.get("bash"), dict):
        return bool(perm["bash"].get("*") == "allow")
    return False


def _has_api_keys_in_config(config: dict[str, Any]) -> bool:
    providers = config.get("provider", {})
    if isinstance(providers, dict):
        for _provider_name, provider_cfg in providers.items():
            if isinstance(provider_cfg, dict):
                options = provider_cfg.get("options", {})
                if isinstance(options, dict) and isinstance(options.get("apiKey"), str):
                    return True
    return False


def _strip_legacy_schema(schema_val: str | None) -> bool:
    if schema_val is None:
        return False
    return bool(isinstance(schema_val, str) and schema_val.endswith("/config.json"))
