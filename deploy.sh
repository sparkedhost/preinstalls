#!/bin/bash

oldDir=$(pwd)

rm -rf out >/dev/null 2>&1
mkdir out

for d in $(find . -type d); do
  if [ -f "$d/manifest.json" ]; then
    dir_name=$(basename "$d")
    echo "Processing $dir_name..."
    cd "$d"
    zip -r "$dir_name.zip" .
    mv "$dir_name.zip" "$oldDir/out/."
    cd $oldDir
    echo "$dir_name completed."
    echo ""
  fi
done

echo "Copying minecraft-java/core-configs"
cp -r minecraft-java/core-configs/* "out/."

echo "Copying additional-configs/pteroignore"
cp "additional-configs/pteroignore/.pteroignore" "out/."