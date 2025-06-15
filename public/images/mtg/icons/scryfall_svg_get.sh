#!/bin/bash

# check for dependencies (inkscape and curl)
if ! command -v inkscape > /dev/null 2>&1; then
  echo "Inkscape is not installed!"
  exit 1
fi
if ! command -v curl > /dev/null 2>&1; then
  echo "Curl is not installed!"
  exit 1
fi

# cd to this folder
cd "$(dirname "$0")" || exit

# Silence! curl
imageData="$(curl https://api.scryfall.com/symbology -s)"
echo "$imageData" | jq -c '.data[]' | while read -r imageObj; do
  symbol="$(echo "$imageObj" | jq '.symbol' | tr '[:upper:]' '[:lower:]' | sed 's/{//g' | sed 's/}//g' | sed 's/\///g' | sed 's/"//g')"
  src="$(echo "$imageObj" | jq '.svg_uri' | sed 's/"//g')"

  echo "Downloading icon: $symbol from $src"
  # download file
  curl -o temp.svg "$src" -s
  echo "Converting icon $symbol"
  # convert image to png (100x100 to match b/w icons)
  # Width is omitted because half mana symbols exist
  inkscape -h 128 temp.svg -o "standard/$symbol.png"
  rm temp.svg
done