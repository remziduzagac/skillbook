#!/usr/bin/env bash
# Copy the music library to the backup drive.
set -euo pipefail

log() {
	printf '%s %s\n' "$(date '+%F %T')" "$*" >>"$HOME/logs/backup.log"
}

log "backing up Music"
rsync -a "$HOME/Music/" /mnt/backup/music/
log "Music done"
