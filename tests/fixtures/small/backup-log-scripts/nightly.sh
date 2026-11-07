#!/usr/bin/env bash
# Run every night from cron.
set -euo pipefail

./backup-home.sh
./backup-music.sh
./check-disk.sh
./rotate-exports.sh
# The vault box has no copy of these scripts, so send the script over the connection.
ssh vault 'bash -s' <remote-prune.sh
