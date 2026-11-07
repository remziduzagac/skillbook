#!/usr/bin/env bash
# Delete database exports older than 60 days from the backup drive.
set -euo pipefail

log() {
	printf '%s %s\n' "$(date '+%F %T')" "$*" >>"$HOME/logs/backup.log"
}

log "rotating exports"
find /mnt/backup/exports -name '*.sql' -mtime +60 -delete
log "exports rotated"
