from __future__ import annotations

from pydantic import BaseModel, Field

# --- Command Analyzer ---


class CommandFrontmatter(BaseModel):
    description: str | None = Field(default=None)
    agent: str | None = Field(default=None)
    model: str | None = Field(default=None)
    subtask: bool | None = Field(default=None)


class CommandReport(BaseModel):
    name: str = Field(description="Command name derived from filename")
    description: str | None = Field(default=None)
    frontmatter_valid: bool = Field(description="YAML frontmatter parsed successfully")
    frontmatter_error: str | None = Field(default=None)
    fields: CommandFrontmatter = Field(default_factory=CommandFrontmatter)
    missing_required: list[str] = Field(default_factory=list)
    has_content: bool = Field(description="Has markdown body after frontmatter")
    content_word_count: int = Field(default=0)
    uses_arguments: bool = Field(description="Uses $ARGUMENTS or $1/$2")
    uses_shell: bool = Field(description="Uses !`command` for shell output")
    uses_file_refs: bool = Field(description="Uses @filename references")
    issues: list[str] = Field(default_factory=list)
    score: int = Field(default=0, description="Quality score 0-100")


class CommandAnalyzeResponse(BaseModel):
    status: str = Field(default="ok")
    report: CommandReport = Field(
        default_factory=lambda: CommandReport(
            name="",
            frontmatter_valid=False,
            has_content=False,
            uses_arguments=False,
            uses_shell=False,
            uses_file_refs=False,
        )
    )


# --- MCP Analyzer ---


class MCPServerReport(BaseModel):
    name: str = Field(description="Server name key")
    type: str | None = Field(default=None)
    type_valid: bool = Field(default=False)
    has_command: bool = Field(default=False)
    has_url: bool = Field(default=False)
    has_enabled: bool = Field(default=False)
    security_issues: list[str] = Field(default_factory=list)
    config_issues: list[str] = Field(default_factory=list)
    score: int = Field(default=0, description="Configuration score 0-100")


class MCPAnalyzeResponse(BaseModel):
    status: str = Field(default="ok")
    server_count: int = Field(default=0)
    servers: list[MCPServerReport] = Field(default_factory=list)
    overall_score: int = Field(default=0)


# --- Tool Analyzer ---


class ToolPermissionReport(BaseModel):
    tool_name: str = Field(description="Tool or pattern name")
    permission: str | None = Field(default=None, description="allow | ask | deny | None")
    is_wildcard: bool = Field(default=False)
    is_security_sensitive: bool = Field(default=False)
    recommendation: str | None = Field(default=None)


class ToolAnalyzeResponse(BaseModel):
    status: str = Field(default="ok")
    tool_count: int = Field(default=0)
    tools: list[ToolPermissionReport] = Field(default_factory=list)
    missing_critical: list[str] = Field(default_factory=list)
    overall_score: int = Field(default=0)
