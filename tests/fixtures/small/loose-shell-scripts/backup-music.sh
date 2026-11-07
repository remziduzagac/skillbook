#!/usr/bin/env bash
# Copy the music library to the backup drive.
set -euo pipefail
rsync -a "$HOME/Music/" /mnt/backup/music/
