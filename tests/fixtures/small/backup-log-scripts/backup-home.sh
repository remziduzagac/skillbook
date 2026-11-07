#!/usr/bin/env bash
# Copy the Documents folder to the backup drive.
set -euo pipefail

log() {
	printf '%s %s\n' "$(date '+%F %T')" "$*" >>"$HOME/logs/backup.log"
}

log "backing up Documents"
rsync -a --delete "$HOME/Documents/" /mnt/backup/documents/
log "Documents done"
