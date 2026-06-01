from __future__ import annotations

import json
from typing import Any

from fastapi import APIRouter, Form

from app.schemas.phase4 import (
    CommandAnalyzeResponse,
    MCPAnalyzeResponse,
    ToolAnalyzeResponse,
)
from app.services.command_analyzer import analyze_command
from app.services.mcp_analyzer import analyze_mcp_servers
from app.services.tool_analyzer import analyze_tools, get_missing_critical

router = APIRouter()


def _parse_json(text: str) -> dict[str, Any] | None:
    """Try to parse JSON/JSONC text, return dict or None."""
    try:
        return json.loads(text)  # type: ignore[no-any-return]
    except (json.JSONDecodeError, TypeError):
        return None


@router.post("/api/command/analyze", response_model=CommandAnalyzeResponse)
async def analyze_command_endpoint(
    content: str = Form(default=""),
    filename: str = Form(default="command.md"),
) -> CommandAnalyzeResponse:
    """Analyze a slash command .md file."""
    report = analyze_command(content, filename)
    return CommandAnalyzeResponse(status="ok", report=report)


@router.post("/api/mcp/analyze", response_model=MCPAnalyzeResponse)
async def analyze_mcp_endpoint(
    content: str = Form(default=""),
) -> MCPAnalyzeResponse:
    """Analyze MCP server entries from an opencode.json (or just the mcp section)."""
    config = _parse_json(content)
    mcp_section = config.get("mcp") if config else None
    # If the content itself is just the mcp object (not wrapped in top-level config)
    if config and isinstance(config, dict):
        # Check if this looks like a raw mcp section
        first_val = next(iter(config.values()), None)
        if isinstance(first_val, dict) and "type" in first_val:
            mcp_section = config

    servers = analyze_mcp_servers(mcp_section)
    overall = sum(s.score for s in servers) // max(len(servers), 1)
    return MCPAnalyzeResponse(
        status="ok",
        server_count=len(servers),
        servers=servers,
        overall_score=overall,
    )


@router.post("/api/tool/analyze", response_model=ToolAnalyzeResponse)
async def analyze_tool_endpoint(
    content: str = Form(default=""),
) -> ToolAnalyzeResponse:
    """Analyze tool permissions from an opencode.json (or just the permission section)."""
    config = _parse_json(content)
    permissions = None

    if config:
        permissions = config.get("permission")
        if isinstance(permissions, dict) and "bash" in permissions:
            # looks like a raw permission section
            pass
        else:
            permissions = permissions

    tools = analyze_tools(permissions)
    missing = get_missing_critical(tools)
    overall = 100 - min(len(missing) * 20, 100)
    return ToolAnalyzeResponse(
        status="ok",
        tool_count=len(tools),
        tools=tools,
        missing_critical=missing,
        overall_score=overall,
    )
