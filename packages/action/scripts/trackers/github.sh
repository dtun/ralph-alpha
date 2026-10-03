#!/usr/bin/env bash
# Tracker contract:
#   tracker_preflight             -> exit 0 if the tracker can be read and written
#   tracker_fetch <id> <out_json> -> write {title, body, comments: [{body}]} to out_json
#   tracker_comment <id> <body>   -> post a markdown comment on the issue
#   tracker_ref <id>              -> how a human writes the id, e.g. "#12"
#   tracker_closes_line <id>      -> PR body line that closes the issue on merge
#
# GitHub Issues, through gh. gh is also how Ralph pushes and opens the PR, but
# that is the code host's job, not the tracker's, and stays in ralph.sh.

tracker_preflight() {
  command -v gh >/dev/null 2>&1 || { echo "error: 'gh' not found on this runner." >&2; return 1; }
}

tracker_fetch() {
  gh issue view "$1" --json title,body,comments > "$2"
}

tracker_comment() {
  gh issue comment "$1" --body "$2" > /dev/null
}

tracker_ref() {
  echo "#$1"
}

tracker_closes_line() {
  echo "Closes #$1"
}
