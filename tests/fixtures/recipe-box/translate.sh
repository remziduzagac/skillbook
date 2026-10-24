#!/bin/sh
# Sends every recipe in recipes/ to the Linguaport translation service and saves each translation in translations/.
# Linguaport charges US$0.45 for each recipe it translates. The key is read from LINGUAPORT_KEY.
# Usage: ./translate.sh fr
set -eu
mkdir -p translations
for recipe in recipes/*.md; do
	curl --fail --silent --show-error \
		-H "Authorization: Bearer $LINGUAPORT_KEY" \
		-F "target=${1:-fr}" -F "text=@$recipe" \
		https://api.linguaport.example/v1/translate >"translations/$(basename "$recipe")"
done
