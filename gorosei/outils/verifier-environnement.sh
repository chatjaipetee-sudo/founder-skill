#!/bin/bash
# Checks that a new session has the same environment as the one it replaces.
# Usage : bash gorosei/outils/verifier-environnement.sh   (prints one line per check, OK or A VOIR)
set -uo pipefail
cd "$(dirname "$0")/../.." || exit 1
WORK=claude/founder-skill-installer-gadcwh
bad=0
ok()  { echo "OK      $1"; }
nok() { echo "A VOIR  $1"; bad=$((bad+1)); }

b=$(git branch --show-current)
[ "$b" = "$WORK" ] && ok "branche $b" || nok "branche $b (le travail complet est sur $WORK)"
git fetch -q origin "$b" 2>/dev/null
if [ "$(git rev-parse HEAD)" = "$(git rev-parse "origin/$b" 2>/dev/null)" ]; then ok "à jour avec GitHub"; else nok "pas identique à origin/$b"; fi
[ -f gorosei/PASSATION.md ] && ok "passation : $(git log -1 --format=%cd --date=format:'%d/%m/%Y %H:%M' -- gorosei/PASSATION.md)" || nok "gorosei/PASSATION.md absent"
[ -f CLAUDE.md ] && ok "CLAUDE.md présent" || nok "CLAUDE.md absent"

n=$(ls -d .claude/skills/*/ 2>/dev/null | wc -l); [ "$n" -ge 62 ] && ok "$n skills dans .claude/skills" || nok "$n skills dans .claude/skills (62 attendues)"
n=$(ls .claude/agents/*.md 2>/dev/null | wc -l); [ "$n" -ge 267 ] && ok "$n agents dans .claude/agents" || nok "$n agents dans .claude/agents (267 attendus)"
n=$(ls -d skills/founder-*/ 2>/dev/null | wc -l); [ "$n" -eq 11 ] && ok "11 skills founder" || nok "$n skills founder (11 attendues)"
for f in .claude/skills/dg/SKILL.md .claude/skills/harvey/SKILL.md .claude/skills/replication/SKILL.md .claude/workflows/gorosei-prospection.js .claude/workflows/gorosei-analyse.js gorosei/registre.md gorosei/harvey/harvey/gate.py; do
  [ -f "$f" ] && ok "$f" || nok "$f manquant"
done
n=$(grep -c '^| G-' gorosei/registre.md 2>/dev/null); ok "registre : $n entrées"
for e in Stop SessionStart; do
  jq -e ".hooks.$e" .claude/settings.json >/dev/null 2>&1 && ok "hook $e déclaré" || nok "hook $e absent de .claude/settings.json"
done

python3 -m unittest discover -s tests -q >/dev/null 2>&1 && ok "tests du dépôt" || nok "tests du dépôt en échec (python3 -m unittest discover -s tests)"
r=$(cd gorosei/harvey && python3 -c "
import importlib.util
s=importlib.util.spec_from_file_location('gate','harvey/gate.py'); g=importlib.util.module_from_spec(s); s.loader.exec_module(g)
print('ok' if g.pre_send_check('contact@exemple.fr','un essai simple','Bonjour, ceci est un essai. Pour ne plus recevoir de message, répondez stop.').ok else 'bloque')" 2>&1)
[ "$r" = "ok" ] && ok "porte de contrôle Harvey" || nok "porte de contrôle Harvey : $r"
command -v graphify >/dev/null 2>&1 && ok "graphify installé" || nok "graphify absent (pip install graphifyy)"
code=$(curl -s -o /dev/null -m 15 -w '%{http_code}' https://www.lachaume.com/ 2>/dev/null)
case "$code" in 2*|3*) ok "réseau complet (site d'un fleuriste joignable)";; *) nok "réseau : site d'un fleuriste injoignable ($code), l'accès réseau complet est peut-être coupé";; esac

echo "---"
echo "À vérifier par Claude (pas faisable en shell) : connecteur Gmail (ToolSearch \"Gmail\", puis list_drafts sur support.maisonvitura@gmail.com), connecteur Google Drive, pages claude.ai listées dans la passation."
[ "$bad" -eq 0 ] && echo "RÉSULTAT : environnement identique" || echo "RÉSULTAT : $bad point(s) à voir"
exit 0
