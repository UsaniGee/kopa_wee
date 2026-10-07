@AGENTS.md

# AXON

This project uses [AXON](https://github.com/atopwebtechnologies/axon) for spec-driven development. Always read `axon/index.md` first when starting AXON work — it links to the product definition, guidelines, tech stack, workflow, code style guides, and the pathways registry.

AXON skills live in `.claude/skills/axon-*` (symlinks into `.cursor/plugins/axon/`, which is gitignored — run `scripts/install-axon-cursor.sh` if they are missing). Map user intent to the matching skill:

| User says | Skill |
| --- | --- |
| Initialize AXON | `axon-initialize` |
| Craft a pathway for ... | `axon-craft` |
| Immerse in the pathway / continue work | `axon-immerse` |
| Design frontend | `axon-compose` (also auto-activates inside `axon-immerse` for frontend work) |
| Investigate progress / status | `axon-investigate` |
| Inspect / review completed work | `axon-inspect` |
| Revert a pathway, phase, or task | `axon-revert` |

Workflow: Context → Craft → Immerse (↔ Compose) → Investigate → Inspect → Revert.

- Pathway artifacts live in `axon/pathways/<pathway_id>/` (`spec.md`, `plan.md`, `metadata.json`, `index.md`) and are registered in `axon/pathways.md`.
- Follow `axon/workflow.md` and the applicable files in `axon/code_styleguides/`.
- When a skill asks for structured user input, use the AskUserQuestion tool, one question at a time.
