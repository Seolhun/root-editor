pnpm run changeset:add
pnpm run changeset:version
pnpm i # To update pre-release version in the package.json for lockfile
git add .
git commit -m "chore: add pre-release version"
pnpm run build