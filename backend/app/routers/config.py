from __future__ import annotations

from fastapi import APIRouter, Request

from app.schemas.config import (
    ConfigAuditResponse,
    ConfigAuditResult,
    ConfigDiffRequest,
    ConfigDiffResponse,
)
from app.services.config_analyzer import analyze_config, compute_diff, parse_config

router = APIRouter(prefix="/api/config", tags=["config"])


@router.post("/audit", response_model=ConfigAuditResponse)
async def audit_config(request: Request) -> ConfigAuditResponse:
    """Parse and audit an opencode.json file (raw text in body)."""
    raw = (await request.body()).decode("utf-8")
    config, errors = parse_config(raw)

    if config is None:
        return ConfigAuditResponse(
            status="ok",
            result=ConfigAuditResult(
                is_valid_jsonc=False,
                validation_errors=errors,
                schema_errors=[],
            ),
        )

    result = analyze_config(config)
    return ConfigAuditResponse(status="ok", result=result)


@router.post("/diff", response_model=ConfigDiffResponse)
async def diff_config(body: ConfigDiffRequest) -> ConfigDiffResponse:
    """Compute diff between original and modified configs."""
    result = compute_diff(original=body.original, modified=body.modified)
    return ConfigDiffResponse(status="ok", result=result)
