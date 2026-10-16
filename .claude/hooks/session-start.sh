#!/bin/bash
# Installs Graphify at the start of each cloud session (the founder has no computer).
set -uo pipefail
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
command -v graphify >/dev/null 2>&1 || pip install -q graphifyy >/dev/null 2>&1 || exit 0
graphify install >/dev/null 2>&1 || true
exit 0
