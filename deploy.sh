#!/bin/bash

oldDir=$(pwd)

function cleanup() {
    rm -rf archives >/dev/null 2>&1
}

cleanup
mkdir archives

for d in $(find . -type d); do
  if [ -f "$d/manifest.json" ]; then
    dir_name=$(basename "$d")
    echo "Processing $dir_name..."
    cd "$d"
    zip -r "$dir_name.zip" .
    mv "$dir_name.zip" "$oldDir/archives/."
    cd $oldDir
    echo "$dir_name completed."
    echo ""
  fi
done

cleanup