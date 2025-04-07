#!/bin/bash

# Sample usage:
# ./build.sh "Your commit message here"

# Check if a commit message was provided as an argument.
if [ "$#" -lt 1 ]; then
  echo "Usage: ./build.sh \"Your commit message\""
  exit 1
fi

commitMessage="$1"

echo "===================================="
echo "Adding changes to Git..."
git add .
if [ $? -ne 0 ]; then
  echo "Error during git add."
  exit 1
fi

echo "===================================="
echo "Committing changes with message: $commitMessage"
git commit -m "$commitMessage"
if [ $? -ne 0 ]; then
  echo "Error during git commit."
  exit 1
fi

echo "===================================="
echo "Pushing changes to remote repository..."
git push
if [ $? -ne 0 ]; then
  echo "Error during git push."
  exit 1
fi

echo "===================================="
echo "Building the project..."
pnpm run build
if [ $? -ne 0 ]; then
  echo "Error during build."
  exit 1
fi

echo "===================================="
echo "Deploying to GitHub Pages..."
pnpm run deploy
if [ $? -ne 0 ]; then
  echo "Error during deploy."
  exit 1
fi

echo "===================================="
echo "Build and deployment complete!"