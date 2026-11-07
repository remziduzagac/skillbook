#!/usr/bin/env bash
# Runs on the vault box. nightly.sh sends it over ssh.
set -euo pipefail

log() {
	printf '%s %s\n' "$(date '+%F %T')" "$*" >>"$HOME/logs/backup.log"
}

log "pruning snapshots older than 30 days"
find /srv/vault/snapshots -maxdepth 1 -mtime +30 -exec rm -r {} +
log "snapshots pruned"
