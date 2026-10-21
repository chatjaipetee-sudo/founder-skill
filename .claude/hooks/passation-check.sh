#!/bin/bash
# Keeps gorosei/PASSATION.md, the handoff file a new session restarts from, in step with the work.
# Stop hook: when a commit landed after the last update of PASSATION.md, ask Claude once to update it.
set -uo pipefail
input=$(cat)
[ "$(printf '%s' "$input" | jq -r '.stop_hook_active // false' 2>/dev/null)" = "true" ] && exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
P=gorosei/PASSATION.md
git ls-files --error-unmatch "$P" >/dev/null 2>&1 || exit 0
last_p=$(git log -1 --format=%ct -- "$P")
last_work=$(git log -1 --format=%ct -- . ":(exclude)$P" ":(exclude)CLAUDE.md")
[ -n "$last_p" ] && [ -n "$last_work" ] && [ "$last_work" -gt "$last_p" ] || exit 0
subject=$(git log -1 --format=%s -- . ":(exclude)$P" ":(exclude)CLAUDE.md")
reason="Passation en retard : le commit « $subject » est plus récent que gorosei/PASSATION.md. Mets à jour la passation (date en tête, état du projet, journal, prochaines étapes, carte du dépôt si un fichier a été ajouté), lance les tests (python3 -m unittest discover -s tests), puis commit et push. Si ce commit ne change rien pour la reprise, ajoute au moins une ligne au journal."
jq -n --arg r "$reason" '{decision: "block", reason: $r}'
