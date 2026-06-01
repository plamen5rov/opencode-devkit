from __future__ import annotations

from app.schemas.skill import SkillTemplate, TemplateSection

SKILL_TEMPLATES: list[SkillTemplate] = [
    SkillTemplate(
        id="tool-setup",
        name="Tool Setup",
        description="Guide for setting up and using a development tool (MCP, CLI, etc.)",
        suggested_name="tool-name",
        frontmatter=(
            "---\n"
            "name: tool-name\n"
            "description: Guide for setting up and using <tool>."
            " Use when the user asks about <tool>,"
            " <tool> is failing,"
            " or <tool> needs configuration.\n"
            "license: MIT\n"
            "compatibility: opencode\n"
            "---"
        ),
        sections=[
            TemplateSection(
                title="Prerequisites",
                description="List what must be installed or configured before using the tool.",
                example="## Prerequisites\n- Python 3.10+\n- Node.js 18+",
            ),
            TemplateSection(
                title="Setup",
                description="Step-by-step setup instructions.",
                example=(
                    "## Setup\n"
                    "1. Install with `pip install <tool>`\n"
                    "2. Add to `opencode.json`:\n"
                    "```json\n...\n```"
                ),
            ),
            TemplateSection(
                title="Usage",
                description="When and how to use the tool in OpenCode.",
                example=("## Usage\nCall `<tool>` when:\n- User asks about X\n- Error Y appears"),
            ),
            TemplateSection(
                title="Troubleshooting",
                description="Common problems and fixes.",
                example=("## Troubleshooting\n- **Problem**: <error>\n  Fix: <solution>"),
            ),
            TemplateSection(
                title="Limitations",
                description="Known restrictions, missing features, or workarounds.",
                example=(
                    "## Limitations\n- <tool> does not support X\n- Workaround: use Y instead"
                ),
            ),
        ],
    ),
    SkillTemplate(
        id="workflow",
        name="Workflow Automation",
        description="Define a multi-step automated workflow (commit, release, deploy, etc.)",
        suggested_name="your-workflow",
        frontmatter=(
            "---\n"
            "name: your-workflow\n"
            "description: Automate <workflow> steps."
            " Use when the user asks to <action>,"
            " after <event>,"
            " or needs help with <process>.\n"
            "---"
        ),
        sections=[
            TemplateSection(
                title="When to Use",
                description="Specific triggers or conditions for this workflow.",
                example="## When to Use\n- User asks to deploy\n- After merging to main",
            ),
            TemplateSection(
                title="Steps",
                description="Ordered list of steps the agent should follow.",
                example=(
                    "## Steps\n1. Verify the working tree is clean\n2. Run tests\n3. Tag and push"
                ),
            ),
            TemplateSection(
                title="Safety Checks",
                description="What to verify before executing the workflow.",
                example=(
                    "## Safety Checks\n"
                    "- Confirm the target branch\n"
                    "- Check CI status\n"
                    "- Verify permissions"
                ),
            ),
        ],
    ),
    SkillTemplate(
        id="analyzer",
        name="Code / Config Analyzer",
        description=(
            "Analyze files for issues, patterns, or compliance (lint, security, best practices)"
        ),
        suggested_name="your-analyzer",
        frontmatter=(
            "---\n"
            "name: your-analyzer\n"
            "description: Analyze <file-type> for <what-to-check>."
            " Use when reviewing <file-type>,"
            " auditing <context>,"
            " or ensuring <standard> compliance.\n"
            "---"
        ),
        sections=[
            TemplateSection(
                title="What It Checks",
                description="List of rules, checks, or patterns the analyzer looks for.",
                example=(
                    "## What It Checks\n"
                    "| Rule | Description |\n"
                    "|------|-------------|\n"
                    "| R1   | Check for X |"
                ),
            ),
            TemplateSection(
                title="How to Run",
                description="Commands or steps to execute the analysis.",
                example="## How to Run\n```bash\n<command> --check\n```",
            ),
            TemplateSection(
                title="Output Format",
                description="What the results look like and how to read them.",
                example=(
                    "## Output Format\n"
                    "```\n"
                    "ERROR: file.md:10: missing blank line around heading\n"
                    "```"
                ),
            ),
        ],
    ),
    SkillTemplate(
        id="code-generation",
        name="Code Generation",
        description="Generate boilerplate or scaffold code following conventions",
        suggested_name="scaffold-name",
        frontmatter=(
            "---\n"
            "name: scaffold-name\n"
            "description: Generate <type-of-code> with <framework/convention>."
            " Use when creating new <component>,"
            " scaffolding <project-type>,"
            " or adding <feature>.\n"
            "---"
        ),
        sections=[
            TemplateSection(
                title="Conventions",
                description="Coding standards, style guide, or patterns to follow.",
                example=(
                    "## Conventions\n"
                    "- Use TypeScript strict mode\n"
                    "- Follow feature-folder structure\n"
                    "- Export named functions"
                ),
            ),
            TemplateSection(
                title="Template",
                description="The boilerplate code or file structure.",
                example=(
                    "## Template\n"
                    "```tsx\n"
                    "import { useState } from 'react'\n"
                    "\n"
                    "export function Component() {\n"
                    "  return <div />\n"
                    "}\n"
                    "```"
                ),
            ),
            TemplateSection(
                title="Customization Points",
                description="What the user can customize (name, options, etc.).",
                example=(
                    "## Customization\n- `<NAME>` — component name\n- `<PATH>` — target file path"
                ),
            ),
        ],
    ),
    SkillTemplate(
        id="documentation",
        name="Documentation Guide",
        description="Guide for writing, reviewing, or maintaining documentation",
        suggested_name="doc-guide",
        frontmatter=(
            "---\n"
            "name: doc-guide\n"
            "description: Apply documentation standards"
            " when writing or editing <file-types>."
            " Ensures <standard> compliance.\n"
            "---"
        ),
        sections=[
            TemplateSection(
                title="Rules",
                description="Documentation rules or checklist in table format.",
                example=(
                    "## Rules\n"
                    "| Rule | Requirement |\n"
                    "|------|-------------|\n"
                    "| MD022 | Blank line around headings |"
                ),
            ),
            TemplateSection(
                title="Examples",
                description="Correct vs incorrect examples.",
                example=("## Examples\n```markdown\nCorrect:\n\n## Section\n\nText.\n```"),
            ),
        ],
    ),
]
