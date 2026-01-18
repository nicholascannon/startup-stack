#!/bin/bash
set -e

NEW_NAME=$1
if [ -z "$NEW_NAME" ]; then
  echo "Usage: ./init-project.sh my-new-project"
  exit 1
fi

# Replace in all files (excluding .git, node_modules, dist)
find . -type f \
  -not -path './.git/*' \
  -not -path './node_modules/*' \
  -not -path './packages/*/node_modules/*' \
  -not -path './packages/*/dist/*' \
  -not -name 'package-lock.json' \
  -exec sed -i '' "s/startup-stack/$NEW_NAME/g" {} +

# Regenerate lock file
rm -f package-lock.json
npm install

# Self-destruct before commit so it's not in repo history
rm -- "$0"

# Reset git
rm -rf .git
git init
git add .
git commit -m "Initial commit"

echo ""
echo "✓ Project renamed to $NEW_NAME"
echo ""
echo "Next steps:"
echo "  1. Create a new GitHub repo and push:"
echo "     git remote add origin git@github.com:youruser/$NEW_NAME.git"
echo "     git push -u origin main"
echo ""
echo "  2. Create Fly.io app:"
echo "     flyctl apps create $NEW_NAME"
echo ""
echo "  3. Set up GitHub secrets for deployment:"
echo "     - FLY_API_TOKEN"
echo "     - SENTRY_DSN (optional)"
echo ""
echo "  4. Update any other external service configs (Sentry project name, etc.)"
