#!/usr/bin/env sh
set -e

npm run build

rm -rf /Users/raymond_lx/Documents/MyWebServer/rayxuln.github.io/melongarden/*
cp -rf /Users/raymond_lx/Documents/MyWebServer/MelonGarden/melongarden/dist/* /Users/raymond_lx/Documents/MyWebServer/rayxuln.github.io/melongarden/
if [ "$1" == "gh" ];then
echo "Pushing to Github"
cd /Users/raymond_lx/Documents/MyWebServer/rayxuln.github.io/melongarden/
git add .
git commit -m"Auto deploy bash script by Raiix"
git push
echo "Done!"
else
echo "No pusing, just locally. Done!"
fi