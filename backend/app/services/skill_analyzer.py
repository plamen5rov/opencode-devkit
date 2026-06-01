from __future__ import annotations

import re
from typing import Any

import yaml

from app.data.templates import SKILL_TEMPLATES
from app.schemas.skill import (
    CompletenessReport,
    ContentQualityReport,
    FileStructureReport,
    FrontmatterReport,
    NameValidation,
    SkillFrontmatter,
    SkillTemplate,
)

KNOWN_FRONTMATTER_FIELDS = {"name", "description", "license", "compatibility", "metadata"}

VALID_NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
NAME_MIN_LEN = 1
NAME_MAX_LEN = 64

SECTION_TRIGGER_PATTERNS = re.compile(
    r"#+\s*(trigger|when\s+to\s+use|usage|when\s+this\s+skill)",
    re.IGNORECASE,
)


def _validate_name(name: str | None) -> NameValidation:
    if not name:
        return NameValidation(valid=False, value=None, issues=["missing name"])
    issues: list[str] = []
    if len(name) < NAME_MIN_LEN:
        issues.append(f"name must be at least {NAME_MIN_LEN} character(s)")
    if len(name) > NAME_MAX_LEN:
        issues.append(f"name must be at most {NAME_MAX_LEN} characters (got {len(name)})")
    if name[0] == "-" or name[-1] == "-":
        issues.append("name must not start or end with '-'")
    if "--" in name:
        issues.append("name must not contain consecutive '--'")
    if not VALID_NAME_RE.match(name):
        issues.append("name must be lowercase alphanumeric with single hyphen separators")
    return NameValidation(valid=len(issues) == 0, value=name, issues=issues)


def _parse_frontmatter(text: str) -> FrontmatterReport:
    """Extract and validate YAML frontmatter from SKILL.md text."""
    stripped = text.lstrip()
    if not stripped.startswith("---"):
        return FrontmatterReport(present=False, valid_yaml=False, fields=SkillFrontmatter())

    second = stripped.find("---", 3)
    if second == -1:
        return FrontmatterReport(
            present=True,
            valid_yaml=False,
            parse_error="Unterminated frontmatter: missing closing ---",
            fields=SkillFrontmatter(),
        )

    raw_yaml = stripped[3:second].strip()
    if not raw_yaml:
        return FrontmatterReport(
            present=True,
            valid_yaml=False,
            parse_error="Empty frontmatter block",
            fields=SkillFrontmatter(),
        )

    try:
        parsed: Any = yaml.safe_load(raw_yaml)
    except yaml.YAMLError as e:
        return FrontmatterReport(
            present=True,
            valid_yaml=False,
            parse_error=f"YAML parse error: {e}",
            fields=SkillFrontmatter(),
        )

    if not isinstance(parsed, dict):
        return FrontmatterReport(
            present=True,
            valid_yaml=False,
            parse_error=f"Frontmatter must be a YAML mapping, got {type(parsed).__name__}",
            fields=SkillFrontmatter(),
        )

    metadata: dict[str, str] | None = None
    raw_meta = parsed.get("metadata")
    if isinstance(raw_meta, dict):
        metadata = {str(k): str(v) for k, v in raw_meta.items()}

    fields = SkillFrontmatter(
        name=str(parsed["name"]) if "name" in parsed else None,
        description=str(parsed["description"]) if "description" in parsed else None,
        license=str(parsed.get("license")) if "license" in parsed else None,
        compatibility=str(parsed.get("compatibility")) if "compatibility" in parsed else None,
        metadata=metadata,
    )

    missing_required = []
    if fields.name is None:
        missing_required.append("name")
    if fields.description is None:
        missing_required.append("description")

    unknown_fields = [k for k in parsed if k not in KNOWN_FRONTMATTER_FIELDS]

    name_val = _validate_name(fields.name)

    return FrontmatterReport(
        present=True,
        valid_yaml=True,
        fields=fields,
        name_validation=name_val,
        missing_required=missing_required,
        unknown_fields=unknown_fields,
    )


def _analyze_content(text: str) -> ContentQualityReport:
    """Analyze the markdown content after frontmatter."""
    stripped = text.lstrip()
    content = ""
    if stripped.startswith("---"):
        second = stripped.find("---", 3)
        if second != -1:
            content = stripped[second + 3 :].strip()

    if not content:
        return ContentQualityReport(
            has_content=False,
            word_count=0,
            sections=[],
            has_when_to_use=False,
            has_examples=False,
            issues=["No content after frontmatter — skill has no instructions"],
            score=0,
        )

    words = content.split()
    word_count = len(words)

    sections = re.findall(r"^(#{1,6})\s+(.+)$", content, re.MULTILINE)
    headings = [h[1] for h in sections]

    has_when_to_use = bool(SECTION_TRIGGER_PATTERNS.search(content))
    has_examples = "```" in content or "example" in content.lower()

    issues: list[str] = []
    score = 40

    if word_count < 50:
        issues.append("Content is very short (<50 words) — consider adding more detail")
    elif word_count >= 200:
        score += 20
    elif word_count >= 100:
        score += 10

    if len(headings) == 0:
        issues.append("No headings found — structure your skill with sections")
    elif len(headings) >= 3:
        score += 10

    if not has_when_to_use:
        issues.append(
            "No trigger/usage section found — "
            "add a section describing when the skill should be loaded"
        )
    else:
        score += 15

    if not has_examples:
        issues.append("No code examples found — examples help agents understand the skill")
    else:
        score += 15

    score = max(0, min(100, score))

    return ContentQualityReport(
        has_content=True,
        word_count=word_count,
        sections=headings,
        has_when_to_use=has_when_to_use,
        has_examples=has_examples,
        issues=issues,
        score=score,
    )


def _analyze_file_structure(filename: str, expected_dir_name: str | None) -> FileStructureReport:
    """Check file structure conventions."""
    issues: list[str] = []
    filename_ok = filename == "SKILL.md"
    if not filename_ok:
        issues.append(f"File should be named SKILL.md (got {filename})")

    dir_matches = None
    if expected_dir_name:
        dir_matches = filename_ok and expected_dir_name == expected_dir_name  # pass-through
    # Note: we can't verify directory name from just the file content
    # The user would need to provide it separately

    return FileStructureReport(
        filename=filename,
        filename_ok=filename_ok,
        directory_matches_name=dir_matches,
        issues=issues,
    )


def analyze_skill(raw: str, filename: str = "SKILL.md") -> CompletenessReport:
    """Full SKILL.md analysis."""
    fm_report = _parse_frontmatter(raw)
    content_report = _analyze_content(raw)
    file_report = _analyze_file_structure(filename, fm_report.fields.name)

    score = 0
    if fm_report.valid_yaml:
        score += 30
        if not fm_report.missing_required:
            score += 15
        if fm_report.name_validation.valid:
            score += 15
    elif fm_report.present:
        score += 10

    score += content_report.score // 2
    score = max(0, min(100, score))

    parts: list[str] = []
    if fm_report.valid_yaml and not fm_report.missing_required and fm_report.name_validation.valid:
        parts.append("Frontmatter is valid and complete")
    elif fm_report.present:
        parts.append("Frontmatter needs fixes")
    else:
        parts.append("Frontmatter is missing")

    if content_report.score >= 60:
        parts.append("content is well-structured")
    elif content_report.has_content:
        parts.append("content needs improvement")
    else:
        parts.append("no content")

    summary = "; ".join(parts)

    return CompletenessReport(
        overall_score=score,
        summary=summary,
        frontmatter=fm_report,
        content_quality=content_report,
        file_structure=file_report,
    )


def get_templates() -> list[SkillTemplate]:
    """Return the list of built-in skill templates."""
    return SKILL_TEMPLATES
