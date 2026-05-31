# OpenCode DevKit Project

A modular AI-assisted development layer for analyzing, auditing, and optimizing OpenCode configurations.

---

## Purpose

The general purpose of this document is to describe the projects as a start idea and to be used as a base for developing a concrete project structure and corresponding instructions files, such as:

- AGENTS.md;
- TASKS.md;
- PROJECT.md;
- ARCHITECTURE.md;
- TODO.md;
- README.md.

AGENTS.md and README.md are a must and have to be in the root directory.

All other .md files are optional and should be saved in /docs/project/ directory - together with all feature instructions for the current project.

Other instruction files could be added lately. How about a CHANGELOG.md - separate log file to keep track of what was done (changed, edited, deleted) on every session and PHASES.md - to list a roadmap of all planed features and what phases to be done?

Give your best advice should that - or any other - be a seaparete file or included in any of the others.

## Other structure requirements

/docs/knowledge/ - directory for markdown files from the official opencode docs - to be used as knoledge base for crerating the different app's features

/docs/library/ - directory for markdown and other files to be used as samples for opencode's skills, commands, tools, etc.

Every type of add-ons in the /docs/library/ directory should have it's own subdirectory: /docs/library/skills, /docs/library/commands, etc.

All these files are kept in this directory, so they are not mixed up with the core setting files for skills, commands, etc. (maybe a different naming convention is also a good idea?) that reside in the .opencode directory.

## Tech stack

For the backend - Python (FastAPI).
Frontend: React (Vite, TypeScript, Tailwind and shadcn/ui)

## Features

1. Homescreen (Dashboard) that unites all metrics from all other features. It's elements are:

- Header with the app's name and logo, "Clear All Data" button and "Settings"
- Left sidebar with menu for all features (with icons). When a feature is clicked the central screen shows its own settings and options.
- Central screen that shows in a visualy distinctive way which features are already implemented and which are not yet.

2. JSON Config (might think of a better name) - has an upload and code paste option for an opencode.json file and analyzes and suggest:

- which options (settings) are a security risk - and why (brief description and "Learn more" hy perlink) to online resource with more info on the subject;
- which options (settings) are missing and why they are importants (brief description and "Learn more" hy perlink) to online resource with more info on the subject;
- diff option that compares the initial opencode.json file with the final modified version and lists all modification made and the gains they give.

3. Skill analyzer & maker - analyzes currents skills and profides a matrix for crerating new ones - with options with description and examples

4. Same analyzer & maker features for:

- tools, commands, mcp servers, etc.

## Project's phases

The projects starts with Phase I : "Initial phase" that includes:

- initial setup by user (creation of project's directory, the /knowledge/ subdirectort, Python virtual environment and github repo - all done by the user before OpenCode is started inside project's directory)
- intital setup by OpenCode: review current docs after the "/init" command and edit AGENTS.md if needed
- install FastAPI, Vite + React and all other needed software packages
- create /library/ and all other needed subdirectories

Phase II: implement the JSON Config feature

Phase III, IV, V... and so on should be for implementing a separate feature from the features list that can be edited and updated over time.

Every time this is done - update the features list - all other corresponding files, such as TODO or others, should be updated too.

This principle - update all documents linked to the one you've just edited - should be a major rule and probably should be in the AGENTS.md file.

## Other requirements

Ask me any question at any time - if you are not clear with any part of the above text and include this principal in the core AGENTS.md so the LLM never assuems and guesses - but asks!
