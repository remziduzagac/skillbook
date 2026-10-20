#!/bin/sh
# Sends a newsletter draft by email to everyone on the mailing list in mailer.env. A sent email cannot be recalled.
# Usage: ./send-newsletter.sh drafts/october.md
set -eu
. ./mailer.env
draft=$1
echo "$(date '+%Y-%m-%d %H:%M') sent $draft to $MAILER_LIST" >>sent.log
curl --fail --silent --show-error \
	-H "Authorization: Bearer $MAILER_KEY" \
	-F "list=$MAILER_LIST" -F "from=$SEND_FROM" -F "body=@$draft" \
	"$MAILER_URL"
