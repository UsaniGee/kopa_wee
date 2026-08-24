#!/usr/bin/env bash
# Install AXON plugin for Cursor IDE in the current project.
# See: https://github.com/atopwebtechnologies/axon

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AXON_DIR="${ROOT}/.cursor/plugins/axon"
AXON_REPO="https://github.com/atopwebtechnologies/axon.git"
SKILLS=(axon-initialize axon-craft axon-immerse axon-compose axon-investigate axon-inspect axon-revert)

mkdir -p "${ROOT}/.cursor/plugins" "${ROOT}/.cursor/skills" "${ROOT}/.cursor/rules"
mkdir -p "${ROOT}/.agents/skills" "${ROOT}/.agents/plugins"

if [[ -d "${AXON_DIR}/.git" ]]; then
  echo "Updating AXON plugin..."
  git -C "${AXON_DIR}" pull --ff-only
else
  echo "Cloning AXON plugin..."
  git clone --depth 1 "${AXON_REPO}" "${AXON_DIR}"
fi

for skill in "${SKILLS[@]}"; do
  ln -sfn "../plugins/axon/skills/${skill}" "${ROOT}/.cursor/skills/${skill}"
  ln -sfn "../../.cursor/plugins/axon/skills/${skill}" "${ROOT}/.agents/skills/${skill}"
done

ln -sfn ".cursor/plugins/axon" "${ROOT}/.agents/plugins/axon"

echo "AXON installed for Cursor."
echo "  Skills:  .cursor/skills/axon-*"
echo "  Plugin:  .cursor/plugins/axon"
echo "  Rule:    .cursor/rules/axon.mdc"
echo ""
echo "Restart your Cursor agent session, then try:"
echo "  Initialize AXON for this project"
echo "  Craft a pathway for ..."
echo "  Immerse in the active pathway"
