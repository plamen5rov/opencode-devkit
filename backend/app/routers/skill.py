from __future__ import annotations

from fastapi import APIRouter, Form, Request

from app.schemas.skill import SkillAnalyzeResponse, SkillTemplateResponse
from app.services.skill_analyzer import analyze_skill, get_templates

router = APIRouter(prefix="/api/skill", tags=["skill"])


@router.post("/analyze", response_model=SkillAnalyzeResponse)
async def analyze_skill_endpoint(
    request: Request,
    content: str = Form(default=""),
    filename: str = Form(default="SKILL.md"),
) -> SkillAnalyzeResponse:
    """Analyze a SKILL.md file and return a completeness report."""
    report = analyze_skill(content, filename)
    return SkillAnalyzeResponse(status="ok", report=report)


@router.get("/templates", response_model=SkillTemplateResponse)
async def get_skill_templates() -> SkillTemplateResponse:
    """Return built-in skill templates for the template maker."""
    return SkillTemplateResponse(status="ok", templates=get_templates())
