#!/bin/bash
# Prepares each session: installs Graphify in the cloud (the founder has no computer),
# then tells Claude where the project state lives so a new session resumes instead of restarting.
set -uo pipefail
DIR="${CLAUDE_PROJECT_DIR:-.}"
if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  command -v graphify >/dev/null 2>&1 || pip install -q graphifyy >/dev/null 2>&1
  command -v graphify >/dev/null 2>&1 && { graphify install >/dev/null 2>&1 || true; }
fi
WORK=claude/founder-skill-installer-gadcwh
branch=$(git -C "$DIR" branch --show-current 2>/dev/null)
if [ -f "$DIR/gorosei/PASSATION.md" ]; then
  when=$(git -C "$DIR" log -1 --format=%cd --date=format:'%d/%m/%Y %H:%M' -- gorosei/PASSATION.md 2>/dev/null)
  msg="Projet Maison Vitura (Gorosei). Branche : ${branch:-inconnue}. Passation enregistrée le ${when:-?}. Avant de répondre au fondateur, lis gorosei/PASSATION.md en entier. Si le message demande la réplication ou la reprise, suis la skill replication."
else
  msg="Projet Maison Vitura (Gorosei) : ce checkout (branche ${branch:-inconnue}) n'a pas la passation. Le travail complet est sur la branche $WORK : lance git fetch origin $WORK && git checkout $WORK, puis lis gorosei/PASSATION.md."
fi
jq -n --arg c "$msg" '{hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: $c}}'
exit 0
