from __future__ import annotations

import re
from typing import Any

import yaml

from app.schemas.phase4 import CommandFrontmatter, CommandReport

KNOWN_COMMAND_FIELDS = {"description", "agent", "model", "subtask"}

ARGUMENT_PATTERN = re.compile(r"\$ARGUMENTS|\$\d+")


def analyze_command(raw: str, filename: str) -> CommandReport:
    """Parse a slash command .md file and return a quality report."""
    name = filename.replace(".md", "") if filename.lower().endswith(".md") else filename
    issues: list[str] = []

    stripped = raw.lstrip()
    frontmatter_valid = False
    frontmatter_error: str | None = None
    fields = CommandFrontmatter()
    missing_required: list[str] = []

    body = stripped
    if stripped.startswith("---"):
        second = stripped.find("---", 3)
        if second == -1:
            frontmatter_error = "Unterminated frontmatter"
        else:
            raw_yaml = stripped[3:second].strip()
            body = stripped[second + 3 :].strip()
            if raw_yaml:
                try:
                    parsed: Any = yaml.safe_load(raw_yaml)
                    if isinstance(parsed, dict):
                        frontmatter_valid = True
                        if "description" in parsed:
                            fields.description = str(parsed["description"])
                        else:
                            missing_required.append("description")
                        if "agent" in parsed:
                            fields.agent = str(parsed["agent"])
                        if "model" in parsed:
                            fields.model = str(parsed["model"])
                        if "subtask" in parsed:
                            fields.subtask = bool(parsed["subtask"])
                        unknown = [k for k in parsed if k not in KNOWN_COMMAND_FIELDS]
                        if unknown:
                            issues.append(f"Unknown frontmatter fields: {', '.join(unknown)}")
                    else:
                        frontmatter_error = "Frontmatter must be a YAML mapping"
                except yaml.YAMLError as e:
                    frontmatter_error = f"YAML parse error: {e}"
            else:
                frontmatter_error = "Empty frontmatter block"
    else:
        frontmatter_error = "No YAML frontmatter found (must start with ---)"

    has_content = bool(body.strip())
    content_word_count = len(body.split()) if has_content else 0
    uses_arguments = bool(ARGUMENT_PATTERN.search(body))
    uses_shell = "!`" in body
    uses_file_refs = "@" in body and not body.strip().startswith("```")

    if not has_content:
        issues.append("No command body (prompt text) after frontmatter")
    elif content_word_count < 10:
        issues.append("Command body is very short (<10 words) — add more detail")

    if not uses_arguments and not uses_shell and not uses_file_refs:
        issues.append("Command body does not use $ARGUMENTS, !`shell`, or @file references")

    score = 0
    if frontmatter_valid:
        score += 30
        if not missing_required:
            score += 15
    if has_content:
        score += 15
    if content_word_count >= 20:
        score += 15
    if uses_arguments:
        score += 10
    if uses_shell:
        score += 10
    if uses_file_refs:
        score += 5

    score = max(0, min(100, score))

    return CommandReport(
        name=name,
        description=fields.description,
        frontmatter_valid=frontmatter_valid,
        frontmatter_error=frontmatter_error,
        fields=fields,
        missing_required=missing_required,
        has_content=has_content,
        content_word_count=content_word_count,
        uses_arguments=uses_arguments,
        uses_shell=uses_shell,
        uses_file_refs=uses_file_refs,
        issues=issues,
        score=score,
    )
