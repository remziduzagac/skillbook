#!/usr/bin/env bash
# Warn when the backup drive is nearly full.
set -euo pipefail

log() {
	printf '%s %s\n' "$(date '+%F %T')" "$*" >>"$HOME/logs/backup.log"
}

used=$(df --output=pcent /mnt/backup | tail -n 1 | tr -dc '0-9')
if [ "$used" -gt 90 ]; then
	log "backup drive is ${used}% full"
fi
