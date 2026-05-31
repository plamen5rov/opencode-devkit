from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class SecurityIssue(BaseModel):
    severity: str = Field(description="critical | high | medium | low")
    setting: str = Field(description="The config key or path, e.g. 'permission.bash'")
    title: str = Field(description="Short title for the issue")
    description: str = Field(description="Why this is a security concern")
    remediation: str = Field(description="How to fix it")
    learn_more_url: str | None = Field(default=None, description="Link to documentation")


class MissingSetting(BaseModel):
    severity: str = Field(description="recommended | optional")
    setting: str = Field(description="The config key path, e.g. 'small_model'")
    title: str = Field(description="Short title")
    description: str = Field(description="Why this setting is important")
    example: str = Field(description="Example configuration snippet")
    learn_more_url: str | None = Field(default=None, description="Link to documentation")


class Optimization(BaseModel):
    setting: str = Field(description="The config key path")
    original: Any = Field(default=None, description="Original value if present")
    recommended: Any = Field(description="Recommended value")
    reason: str = Field(description="Why this change is beneficial")


class SchemaValidationError(BaseModel):
    path: str = Field(
        description="JSON pointer path to the error location, e.g. '/permission/bash'"
    )
    message: str = Field(description="Human-readable error message")


class ConfigAuditResult(BaseModel):
    is_valid_jsonc: bool = Field(description="Whether input is valid JSON/JSONC")
    validation_errors: list[str] = Field(default_factory=list)
    schema_errors: list[SchemaValidationError] = Field(default_factory=list)
    security_issues: list[SecurityIssue] = Field(default_factory=list)
    security_summary: dict[str, int] = Field(default_factory=dict)
    missing_settings: list[MissingSetting] = Field(default_factory=list)
    optimizations: list[Optimization] = Field(default_factory=list)
    optimized_config: dict[str, Any] | None = Field(default=None)


class ConfigAuditResponse(BaseModel):
    status: str = "ok"
    result: ConfigAuditResult


class ConfigDiffRequest(BaseModel):
    original: dict[str, Any] = Field(description="Original config object")
    modified: dict[str, Any] = Field(description="Modified config object")


class DiffusionEntry(BaseModel):
    path: str = Field(description="Dot-separated key path, e.g. 'permission.bash'")
    change: str = Field(description="added | removed | changed")
    original: Any = Field(default=None)
    modified: Any = Field(default=None)
    description: str = Field(description="Human-readable description of the change")


class ConfigDiffResult(BaseModel):
    changes: list[DiffusionEntry]


class ConfigDiffResponse(BaseModel):
    status: str = "ok"
    result: ConfigDiffResult
