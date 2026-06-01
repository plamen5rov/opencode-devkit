import type { SkillTemplate } from "@/types/skill"

export const SKILL_TEMPLATES: SkillTemplate[] = [
  {
    id: "tool-setup",
    name: "Tool Setup",
    description: "Guide for setting up and using a development tool (MCP, CLI, etc.)",
    suggested_name: "tool-name",
    frontmatter: [
      "---",
      "name: tool-name",
      "description: Guide for setting up and using <tool>.",
      " Use when the user asks about <tool>,",
      " <tool> is failing,",
      " or <tool> needs configuration.",
      "license: MIT",
      "compatibility: opencode",
      "---",
    ].join("\n"),
    sections: [
      {
        title: "Prerequisites",
        description: "List what must be installed or configured before using the tool.",
        example: "## Prerequisites\n- Python 3.10+\n- Node.js 18+",
      },
      {
        title: "Setup",
        description: "Step-by-step setup instructions.",
        example: "## Setup\n1. Install with `pip install <tool>`\n2. Add to `opencode.json`:\n```json\n...\n```",
      },
      {
        title: "Usage",
        description: "When and how to use the tool in OpenCode.",
        example: "## Usage\nCall `<tool>` when:\n- User asks about X\n- Error Y appears",
      },
      {
        title: "Troubleshooting",
        description: "Common problems and fixes.",
        example: "## Troubleshooting\n- **Problem**: <error>\n  Fix: <solution>",
      },
      {
        title: "Limitations",
        description: "Known restrictions, missing features, or workarounds.",
        example: "## Limitations\n- <tool> does not support X\n- Workaround: use Y instead",
      },
    ],
  },
  {
    id: "workflow",
    name: "Workflow Automation",
    description: "Define a multi-step automated workflow (commit, release, deploy, etc.)",
    suggested_name: "your-workflow",
    frontmatter: [
      "---",
      "name: your-workflow",
      "description: Automate <workflow> steps.",
      " Use when the user asks to <action>,",
      " after <event>,",
      " or needs help with <process>.",
      "---",
    ].join("\n"),
    sections: [
      {
        title: "When to Use",
        description: "Specific triggers or conditions for this workflow.",
        example: "## When to Use\n- User asks to deploy\n- After merging to main",
      },
      {
        title: "Steps",
        description: "Ordered list of steps the agent should follow.",
        example: "## Steps\n1. Verify the working tree is clean\n2. Run tests\n3. Tag and push",
      },
      {
        title: "Safety Checks",
        description: "What to verify before executing the workflow.",
        example: "## Safety Checks\n- Confirm the target branch\n- Check CI status\n- Verify permissions",
      },
    ],
  },
  {
    id: "analyzer",
    name: "Code / Config Analyzer",
    description: "Analyze files for issues, patterns, or compliance (lint, security, best practices)",
    suggested_name: "your-analyzer",
    frontmatter: [
      "---",
      "name: your-analyzer",
      "description: Analyze <file-type> for <what-to-check>.",
      " Use when reviewing <file-type>,",
      " auditing <context>,",
      " or ensuring <standard> compliance.",
      "---",
    ].join("\n"),
    sections: [
      {
        title: "What It Checks",
        description: "List of rules, checks, or patterns the analyzer looks for.",
        example: "## What It Checks\n| Rule | Description |\n|------|-------------|\n| R1   | Check for X |",
      },
      {
        title: "How to Run",
        description: "Commands or steps to execute the analysis.",
        example: "## How to Run\n```bash\n<command> --check\n```",
      },
      {
        title: "Output Format",
        description: "What the results look like and how to read them.",
        example: "## Output Format\n```\nERROR: file.md:10: missing blank line around heading\n```",
      },
    ],
  },
  {
    id: "code-generation",
    name: "Code Generation",
    description: "Generate boilerplate or scaffold code following conventions",
    suggested_name: "scaffold-name",
    frontmatter: [
      "---",
      "name: scaffold-name",
      "description: Generate <type-of-code> with <framework/convention>.",
      " Use when creating new <component>,",
      " scaffolding <project-type>,",
      " or adding <feature>.",
      "---",
    ].join("\n"),
    sections: [
      {
        title: "Conventions",
        description: "Coding standards, style guide, or patterns to follow.",
        example: "## Conventions\n- Use TypeScript strict mode\n- Follow feature-folder structure\n- Export named functions",
      },
      {
        title: "Template",
        description: "The boilerplate code or file structure.",
        example: [
          "## Template",
          "```tsx",
          "import { useState } from 'react'",
          "",
          "export function Component() {",
          "  return <div />",
          "}",
          "```",
        ].join("\n"),
      },
      {
        title: "Customization Points",
        description: "What the user can customize (name, options, etc.).",
        example: "## Customization\n- `<NAME>` — component name\n- `<PATH>` — target file path",
      },
    ],
  },
  {
    id: "documentation",
    name: "Documentation Guide",
    description: "Guide for writing, reviewing, or maintaining documentation",
    suggested_name: "doc-guide",
    frontmatter: [
      "---",
      "name: doc-guide",
      "description: Apply documentation standards",
      " when writing or editing <file-types>.",
      " Ensures <standard> compliance.",
      "---",
    ].join("\n"),
    sections: [
      {
        title: "Rules",
        description: "Documentation rules or checklist in table format.",
        example: "## Rules\n| Rule | Requirement |\n|------|-------------|\n| MD022 | Blank line around headings |",
      },
      {
        title: "Examples",
        description: "Correct vs incorrect examples.",
        example: "## Examples\n```markdown\nCorrect:\n\n## Section\n\nText.\n```",
      },
    ],
  },
]
