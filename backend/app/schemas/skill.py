from __future__ import annotations

from pydantic import BaseModel, Field


class SkillFrontmatter(BaseModel):
    name: str | None = Field(default=None, description="Skill name from frontmatter")
    description: str | None = Field(default=None, description="Skill description")
    license: str | None = Field(default=None, description="License field if present")
    compatibility: str | None = Field(default=None, description="Compatibility field")
    metadata: dict[str, str] | None = Field(
        default=None, description="Metadata key-value pairs if present"
    )


class NameValidation(BaseModel):
    valid: bool = Field(description="Whether the name passes all rules")
    value: str | None = Field(default=None, description="The name from frontmatter")
    issues: list[str] = Field(default_factory=list, description="Specific name rule violations")


class FrontmatterReport(BaseModel):
    present: bool = Field(description="Whether YAML frontmatter delimiters were found")
    valid_yaml: bool = Field(description="Whether the frontmatter parsed as valid YAML")
    parse_error: str | None = Field(default=None, description="Error if YAML parse failed")
    fields: SkillFrontmatter = Field(
        default_factory=lambda: SkillFrontmatter(), description="Parsed frontmatter fields"
    )
    name_validation: NameValidation = Field(
        default_factory=lambda: NameValidation(valid=False, value=None)
    )
    missing_required: list[str] = Field(
        default_factory=list, description="Required fields that are missing"
    )
    unknown_fields: list[str] = Field(
        default_factory=list, description="Fields not in the known set"
    )


class ContentQualityReport(BaseModel):
    has_content: bool = Field(description="Whether markdown content exists after frontmatter")
    word_count: int = Field(default=0, description="Total word count of content body")
    sections: list[str] = Field(default_factory=list, description="Headings found in content")
    has_when_to_use: bool = Field(description="Whether a trigger/usage section exists")
    has_examples: bool = Field(description="Whether the content includes code or examples")
    issues: list[str] = Field(default_factory=list, description="Quality issues found")
    score: int = Field(default=0, description="Content quality score 0-100")


class FileStructureReport(BaseModel):
    filename: str = Field(default="", description="The file name (should be SKILL.md)")
    filename_ok: bool = Field(description="Whether filename is exactly SKILL.md")
    directory_matches_name: bool | None = Field(
        default=None, description="Whether dir name matches frontmatter name (None if unknown)"
    )
    issues: list[str] = Field(default_factory=list, description="File structure issues found")


class CompletenessReport(BaseModel):
    overall_score: int = Field(default=0, description="Overall completeness score 0-100")
    summary: str = Field(description="One-line summary of report")
    frontmatter: FrontmatterReport = Field(
        default_factory=lambda: FrontmatterReport(present=False, valid_yaml=False)
    )
    content_quality: ContentQualityReport = Field(
        default_factory=lambda: ContentQualityReport(
            has_content=False, has_when_to_use=False, has_examples=False
        )
    )
    file_structure: FileStructureReport = Field(
        default_factory=lambda: FileStructureReport(filename_ok=False)
    )


class SkillAnalyzeResponse(BaseModel):
    status: str = Field(default="ok")
    report: CompletenessReport = Field(
        default_factory=lambda: CompletenessReport(overall_score=0, summary="")
    )


class TemplateSection(BaseModel):
    title: str = Field(description="Section heading text")
    description: str = Field(description="What to put in this section")
    example: str = Field(description="Example markdown for this section")


class SkillTemplate(BaseModel):
    id: str = Field(description="Template identifier e.g. 'tool-setup'")
    name: str = Field(description="Human-readable template name")
    description: str = Field(description="When to use this template")
    suggested_name: str = Field(description="Suggested skill name pattern")
    frontmatter: str = Field(description="YAML frontmatter template")
    sections: list[TemplateSection] = Field(
        default_factory=list, description="Content section templates"
    )


class SkillTemplateResponse(BaseModel):
    status: str = Field(default="ok")
    templates: list[SkillTemplate] = Field(default_factory=list)
