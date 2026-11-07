#!/usr/bin/env bash
# Copy the Documents folder to the backup drive.
set -euo pipefail
rsync -a --delete "$HOME/Documents/" /mnt/backup/documents/
