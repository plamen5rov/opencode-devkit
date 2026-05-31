from __future__ import annotations

import json
import re
from copy import deepcopy
from typing import Any

from jsonschema import ValidationError as JsonSchemaValidationError
from jsonschema import validate

from app.data.rules import OPTIMIZATIONS, RECOMMENDED_SETTINGS, SECURITY_RULES
from app.data.schema import OPENCODE_CONFIG_SCHEMA
from app.schemas.config import (
    ConfigAuditResult,
    ConfigDiffResult,
    DiffusionEntry,
    MissingSetting,
    Optimization,
    SchemaValidationError,
    SecurityIssue,
)


def _strip_jsonc_comments(text: str) -> str:
    """Strip single-line and block comments from JSONC, plus trailing commas."""
    text = re.sub(r"/\*[\s\S]*?\*/", "", text)
    text = re.sub(r"//.*", "", text)
    text = re.sub(r",\s*([}\]])", r"\1", text)
    return text


def parse_config(raw: str) -> tuple[dict[str, Any] | None, list[str]]:
    """Parse a raw JSON/JSONC string into a dict. Returns (parsed, errors)."""
    errors: list[str] = []
    try:
        cleaned = _strip_jsonc_comments(raw.strip())
        config = json.loads(cleaned)
        return config, errors
    except json.JSONDecodeError as e:
        errors.append(f"JSON parse error at line {e.lineno}, col {e.colno}: {e.msg}")
    return None, errors


def _format_schema_errors(errors: list[JsonSchemaValidationError]) -> list[SchemaValidationError]:
    result: list[SchemaValidationError] = []
    for err in errors:
        path = err.json_path if err.json_path else "/"
        result.append(SchemaValidationError(path=path, message=err.message))
    return result


def analyze_config(config: dict[str, Any]) -> ConfigAuditResult:
    """Run schema validation, all security checks, missing-setting checks, and optimizations."""
    schema_errors: list[SchemaValidationError] = []
    security_issues: list[SecurityIssue] = []
    missing_settings: list[MissingSetting] = []
    optimizations: list[Optimization] = []

    try:
        validate(instance=config, schema=OPENCODE_CONFIG_SCHEMA)
    except JsonSchemaValidationError as e:
        schema_errors = _format_schema_errors(
            sorted(e.context, key=lambda x: x.json_path) if e.context else [e]
        )

    for rule in SECURITY_RULES:
        try:
            if rule["check"](config):
                security_issues.append(rule["issue"])
        except Exception:
            pass

    for rule in RECOMMENDED_SETTINGS:
        try:
            if rule["check"](config):
                missing_settings.append(rule["setting"])
        except Exception:
            pass

    for rule in OPTIMIZATIONS:
        try:
            if rule["check"](config):
                rec = rule["recommendation"]
                orig = config.get(rec["setting"])
                optimizations.append(
                    Optimization(
                        setting=rec["setting"],
                        original=orig,
                        recommended=rec["recommended"],
                        reason=rec["reason"],
                    )
                )
        except Exception:
            pass

    security_summary: dict[str, int] = {}
    for issue in security_issues:
        severity = issue.severity
        security_summary[severity] = security_summary.get(severity, 0) + 1

    opt_config = deepcopy(config)
    for rule in OPTIMIZATIONS:
        try:
            if rule["check"](config):
                rec = rule["recommendation"]
                opt_config[rec["setting"]] = rec["recommended"]
        except Exception:
            pass

    return ConfigAuditResult(
        is_valid_jsonc=True,
        validation_errors=[],
        schema_errors=schema_errors,
        security_issues=security_issues,
        security_summary=security_summary,
        missing_settings=missing_settings,
        optimizations=optimizations,
        optimized_config=opt_config,
    )


def compute_diff(original: dict[str, Any], modified: dict[str, Any]) -> ConfigDiffResult:
    """Compute a diff between two config dicts."""
    entries: list[DiffusionEntry] = []

    def _diff(
        a: Any,
        b: Any,
        path: str = "",
    ) -> None:
        if isinstance(a, dict) and isinstance(b, dict):
            all_keys = set(a.keys()) | set(b.keys())
            for key in sorted(all_keys):
                subpath = f"{path}.{key}" if path else key
                if key not in b:
                    entries.append(
                        DiffusionEntry(
                            path=subpath,
                            change="removed",
                            original=a[key],
                            modified=None,
                            description=f"Removed '{subpath}'",
                        )
                    )
                elif key not in a:
                    entries.append(
                        DiffusionEntry(
                            path=subpath,
                            change="added",
                            original=None,
                            modified=b[key],
                            description=f"Added '{subpath}'",
                        )
                    )
                else:
                    _diff(a[key], b[key], subpath)
        elif a != b:
            entries.append(
                DiffusionEntry(
                    path=path,
                    change="changed",
                    original=a,
                    modified=b,
                    description=f"Changed '{path}'",
                )
            )

    _diff(original, modified)
    return ConfigDiffResult(changes=entries)
