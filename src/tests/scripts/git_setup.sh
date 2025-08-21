#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Define the full path to the new repository directory inside the temp folder
REPO_DIR="$SCRIPT_DIR/temp/test_repo"
BRANCH_NAME="feature/new-content"
FILE_NAME="project_notes.txt"

# --- 1. Create a new directory and initialize a Git repo ---
echo "--- Creating directory '$REPO_DIR' and initializing Git repository ---"
mkdir -p "$REPO_DIR"
cd "$REPO_DIR"

# Initialize a new Git repository
git init

# --- 2. Create a text file ---
echo "--- Creating initial file: $FILE_NAME ---"
echo "# Project Notes" > "$FILE_NAME"

# --- 3. Make 3-4 commits on the main branch with meaningful messages ---
# Note: Conventional Commits standard is used (e.g., feat, fix, chore)

echo "--- Committing changes to the 'main' branch ---"
# First commit
git add .
git commit -m "feat: initial project setup"

# Second commit - Add a section
echo "" >> "$FILE_NAME"
echo "## To-Do List" >> "$FILE_NAME"
git add .
git commit -m "feat: add to-do list section"

# Third commit - Fix a typo
sed -i 's/To-Do List/To-do List/' "$FILE_NAME"
git add .
git commit -m "fix: correct typo in section header"

# Fourth commit - Add a chore message
echo "" >> "$FILE_NAME"
echo "This is just some maintenance." >> "$FILE_NAME"
git add .
git commit -m "chore: add maintenance note"

# --- 4. Create a new branch and switch to it ---
echo "--- Creating and switching to a new branch: '$BRANCH_NAME' ---"
git checkout -b "$BRANCH_NAME"

# --- 5. Make similar 3-4 commits on the new branch ---
echo "--- Committing changes to the '$BRANCH_NAME' branch ---"
# First commit on the new branch
echo "" >> "$FILE_NAME"
echo "- Implement feature X" >> "$FILE_NAME"
git add .
git commit -m "feat: implement a new feature"

# Second commit on the new branch
echo "- Refactor module Y" >> "$FILE_NAME"
git add .
git commit -m "refactor: refactor module Y for better performance"

# Third commit on the new branch
echo "" >> "$FILE_NAME"
echo "New section is finished!" >> "$FILE_NAME"
git add .
git commit -m "docs: update documentation on new feature"

echo "--- Script finished successfully! ---"
echo "You are currently in the '$BRANCH_NAME' branch."
echo "Your new repository is in the '$REPO_DIR' directory."
echo "You can view the commit history with 'git log --oneline --graph --all'."
