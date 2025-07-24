# Git Workflow Guide for wa4lo7k - Next.js/TypeScript Collaboration

## Overview
This workflow enables safe collaboration on your Next.js/TypeScript project (https://github.com/cobzeu/Prop-Firm.git) by ensuring you only modify your own files while preserving your friend's work.

## Project Structure Understanding
Your project has these key directories:
- `app/` - Next.js app router pages and layouts
- `components/` - Reusable React components
- `lib/` - Utility functions and configurations
- `public/` - Static assets

**File Ownership Guidelines:**
- **Your Areas**: `app/dashboard/`, `components/dashboard/`, `components/ui/`, `components/sections/`
- **Friend's Areas**: `app/admin/`, `components/admin/`, `lib/admin-*`
- **Shared Areas**: `app/globals.css`, `app/layout.tsx` (coordinate changes)

## Prerequisites
- Git is installed and configured
- You have access to the GitHub repository
- Your current repository is already cloned

## Step 1: Configure Your Git Identity

Ensure your commits are attributed to your wa4lo7k GitHub account:

```bash
# Set your Git identity (run once per repository)
git config user.name "wa4lo7k"
git config user.email "145761859+wa4lo7k@users.noreply.github.com"

# Verify your configuration
git config --list | grep user
```

**Expected Output:**
```
user.name=wa4lo7k
user.email=145761859+wa4lo7k@users.noreply.github.com
```

## Step 2: Check File Ownership Before Starting

Before making changes, verify which files are safe to modify:

```bash
# Check recent commits to see who last modified files
git log --oneline --name-only -10

# Check specific file history
git log --oneline app/dashboard/page.tsx
git log --oneline components/admin/AdminProtectedRoute.tsx

# See current file status
git status
```

## Step 3: Create and Switch to Your Feature Branch

Always work on a separate branch with the wa4lo7k/ prefix:

```bash
# Create and switch to a new branch (use descriptive names)
git checkout -b wa4lo7k/dashboard-improvements

# Alternative: Create branch first, then switch
git branch wa4lo7k/dashboard-improvements
git checkout wa4lo7k/dashboard-improvements

# Verify you're on the correct branch
git branch
```

**Branch Naming Examples:**
- `wa4lo7k/dashboard-ui-updates`
- `wa4lo7k/trading-panel-fixes`
- `wa4lo7k/responsive-design`
- `wa4lo7k/button-component-styling`

## Step 4: Make Your Changes Safely

Work only on files in your designated areas:

**Safe Files to Modify:**
```bash
# Dashboard pages and components
app/dashboard/page.tsx
app/dashboard/layout.tsx
components/dashboard/dashboard-overview.tsx
components/dashboard/order-selector.tsx

# UI components
components/ui/button.tsx
components/ui/card.tsx
components/ui/dialog.tsx

# Public sections
components/sections/hero.tsx
components/sections/pricing.tsx
```

**Files to AVOID (Friend's Areas):**
```bash
# Admin-related files
app/admin/*
components/admin/*
lib/admin-*

# Shared files (coordinate first)
app/layout.tsx
app/globals.css
```

## Step 5: Check What Files You've Modified

Before staging, carefully review your changes:

```bash
# See all modified files with status
git status

# See detailed changes in specific files
git diff app/dashboard/page.tsx
git diff components/ui/button.tsx

# Check if you accidentally modified admin files
git diff --name-only | grep admin
```

**Safety Check - If admin files appear, reset them:**
```bash
# Reset accidentally modified admin files
git checkout -- app/admin/page.tsx
git checkout -- components/admin/AdminProtectedRoute.tsx
```

## Step 6: Stage Only Your Modified Files

**CRITICAL:** Only stage files you've intentionally modified:

```bash
# Stage specific files one by one (safest approach)
git add app/dashboard/page.tsx
git add components/ui/button.tsx
git add components/dashboard/dashboard-overview.tsx

# Or stage multiple related files at once
git add app/dashboard/page.tsx components/dashboard/dashboard-overview.tsx

# Verify what's staged before committing
git status
```

**Real Project Examples:**
```bash
# Example 1: Dashboard improvements
git add app/dashboard/page.tsx
git add app/dashboard/layout.tsx
git add components/dashboard/dashboard-overview.tsx
git add components/dashboard/order-selector.tsx

# Example 2: UI component updates
git add components/ui/button.tsx
git add components/ui/card.tsx
git add components/ui/dialog.tsx

# Example 3: Landing page sections
git add components/sections/hero.tsx
git add components/sections/pricing.tsx
git add components/sections/how-it-works.tsx
```

**NEVER use these commands (they stage everything):**
```bash
# DON'T USE THESE - they can stage your friend's files
git add .
git add -A
git add --all
```

## Step 7: Double-Check Staged Files

Before committing, verify you're only committing your files:

```bash
# See exactly what files are staged
git diff --cached --name-only

# See detailed changes in staged files
git diff --cached

# If you see admin files, unstage them immediately
git reset HEAD app/admin/page.tsx
```

## Step 8: Commit Your Changes

Create a descriptive commit message:

```bash
# Commit with a clear, detailed message
git commit -m "Improve dashboard trading interface and UI components

- Enhanced dashboard overview with real-time data display
- Updated button component with new hover states
- Improved responsive design for mobile trading panel
- Fixed order selector dropdown styling issues"

# Verify your commit
git log --oneline -1
git show --name-only HEAD
```

## Step 9: Push Your Branch to GitHub

Push your branch WITHOUT pulling/merging from main:

```bash
# Push your branch to GitHub (first time)
git push -u origin wa4lo7k/dashboard-improvements

# For subsequent pushes to the same branch
git push

# Verify the push was successful
git status
```

## Step 10: Create a Pull Request on GitHub

1. **Navigate to Repository:**
   - Go to https://github.com/cobzeu/Prop-Firm
   - You'll see a banner: "Compare & pull request" for your branch

2. **Create the PR:**
   - Click "Compare & pull request"
   - **Title:** Use a clear, descriptive title
   - **Description:** Detail what you changed and why
   - **Base branch:** `main` (default)
   - **Compare branch:** `wa4lo7k/dashboard-improvements`

3. **PR Template Example:**
   ```
   ## Changes Made
   - Enhanced dashboard trading interface
   - Updated button component styling
   - Improved mobile responsiveness

   ## Files Modified
   - app/dashboard/page.tsx
   - components/ui/button.tsx
   - components/dashboard/dashboard-overview.tsx

   ## Testing
   - Tested on desktop and mobile
   - Verified no admin functionality affected
   ```

4. **Create the PR:**
   - Click "Create pull request"

## Step 11: Handle Review and Merge Process

**Your friend can:**
- Review your changes
- Request modifications
- Approve and merge your PR
- Test the changes in a staging environment

**If changes are requested:**
```bash
# Make additional changes on the same branch
git checkout wa4lo7k/dashboard-improvements
# ... make changes ...
git add modified-files
git commit -m "Address review feedback: fix button alignment"
git push
# The PR will automatically update
```

## Error Handling and Common Issues

### Authentication Failures
```bash
# If push fails due to authentication, try these solutions:

# Option 1: Update remote URL with username
git remote set-url origin https://wa4lo7k@github.com/cobzeu/Prop-Firm.git

# Option 2: Use SSH (if you have SSH keys configured)
git remote set-url origin git@github.com:cobzeu/Prop-Firm.git

# Option 3: Check current remote URL
git remote -v

# Option 4: Use GitHub CLI (if installed)
gh auth login
```

### Accidentally Staged Wrong Files
```bash
# Unstage specific files (most common)
git reset HEAD app/admin/page.tsx
git reset HEAD components/admin/AdminProtectedRoute.tsx

# Unstage all files and start over
git reset HEAD

# See what's staged vs unstaged
git status

# Completely discard changes to specific files
git checkout -- app/admin/page.tsx
```

### Accidentally Modified Admin Files
```bash
# Check if you modified admin files
git status | grep admin
git diff --name-only | grep admin

# Reset admin files to original state
git checkout -- app/admin/
git checkout -- components/admin/
git checkout -- lib/admin-database.ts

# Verify admin files are clean
git status
```

### Need to Switch Branches with Uncommitted Changes
```bash
# Save your work temporarily
git stash push -m "WIP: dashboard improvements"

# Switch branches
git checkout main

# Return to your branch and restore changes
git checkout wa4lo7k/dashboard-improvements
git stash pop

# List all stashes if needed
git stash list
```

### Branch is Behind Main (Update Needed)
```bash
# Only do this if you need latest changes from main
# WARNING: This can cause conflicts

# Step 1: Commit your current work first
git add your-modified-files
git commit -m "Save current progress"

# Step 2: Update main branch
git checkout main
git pull origin main

# Step 3: Return to your branch and merge
git checkout wa4lo7k/dashboard-improvements
git merge main

# Step 4: Resolve conflicts if any, then push
git push
```

## File Ownership Prevention Methods

### Method 1: Pre-Commit Check Script
Create a simple script to check file ownership:

```bash
# Create a pre-commit check script
cat > check-files.sh << 'EOF'
#!/bin/bash
# Check if any admin files are being committed
ADMIN_FILES=$(git diff --cached --name-only | grep -E "(admin|Admin)")
if [ ! -z "$ADMIN_FILES" ]; then
    echo "ERROR: You're trying to commit admin files:"
    echo "$ADMIN_FILES"
    echo "Please unstage these files with: git reset HEAD <filename>"
    exit 1
fi
echo "File check passed - no admin files detected"
EOF

chmod +x check-files.sh

# Run before each commit
./check-files.sh && git commit -m "Your message"
```

### Method 2: Git Diff Check
```bash
# Always check what you're about to commit
git diff --cached --name-only

# Look for admin patterns
git diff --cached --name-only | grep -i admin

# If admin files appear, unstage them
git reset HEAD app/admin/page.tsx
```

### Method 3: File Ownership Documentation
Update your README.md with clear ownership:

```markdown
## File Ownership
- **wa4lo7k**: app/dashboard/, components/dashboard/, components/ui/, components/sections/
- **Friend**: app/admin/, components/admin/, lib/admin-*
- **Shared**: app/layout.tsx, app/globals.css (coordinate changes)
```

## Best Practices for Collaboration

### 1. Communication Protocol
```bash
# Before starting work, check what your friend is working on
git log --oneline --author="friend-username" -5
git log --oneline --since="1 week ago" --name-only

# Communicate via:
# - GitHub issues for feature planning
# - PR comments for code review
# - Direct messages for urgent coordination
```

### 2. Safe File Modification Rules
```bash
# YOUR SAFE ZONES (modify freely):
app/dashboard/
components/dashboard/
components/ui/
components/sections/
public/ (for your assets)

# FRIEND'S ZONES (never modify):
app/admin/
components/admin/
lib/admin-*

# SHARED ZONES (coordinate first):
app/layout.tsx
app/globals.css
package.json
```

### 3. Daily Workflow Best Practices
```bash
# Start of day routine
git status                          # Check current state
git checkout main                   # Switch to main
# DON'T pull unless coordinated     # Avoid: git pull origin main
git checkout -b wa4lo7k/new-feature # Create feature branch

# During work
git status                          # Check frequently
git diff --name-only               # See what you've changed
./check-files.sh                   # Run ownership check

# End of day routine
git add specific-files             # Stage only your files
git commit -m "Descriptive message"
git push -u origin wa4lo7k/new-feature
# Create PR on GitHub
```

### 4. Commands to AVOID (Prevent Conflicts)
```bash
# NEVER USE THESE:
git pull                    # Can overwrite your changes
git add .                   # Stages everything including friend's files
git add -A                  # Same as above
git add --all              # Same as above
git merge main             # Can cause conflicts
git rebase                 # Advanced, can cause issues
git push --force           # Can overwrite friend's work
```

## Quick Reference Commands

### Essential Daily Commands
```bash
# Check current status and branch
git status
git branch

# Create and switch to new feature branch
git checkout -b wa4lo7k/feature-name

# Check file ownership before staging
git diff --name-only
git diff --name-only | grep -i admin  # Should return nothing

# Stage specific files (NEVER use git add .)
git add app/dashboard/page.tsx
git add components/ui/button.tsx

# Commit with descriptive message
git commit -m "Your detailed commit message"

# Push branch to GitHub
git push -u origin wa4lo7k/feature-name

# Switch between branches
git checkout branch-name

# See recent commits
git log --oneline -5
```

### Safety Check Commands
```bash
# Before committing - verify staged files
git diff --cached --name-only

# Check for admin files in staged changes
git diff --cached --name-only | grep -i admin

# Unstage admin files if found
git reset HEAD app/admin/page.tsx

# Reset admin files to original state
git checkout -- app/admin/
```

## Complete Example Workflow

### Scenario: Improving Dashboard Trading Interface

```bash
# 1. Start with clean state
git status
git checkout main

# 2. Create feature branch
git checkout -b wa4lo7k/dashboard-trading-improvements

# 3. Make your changes to these files:
# - app/dashboard/page.tsx (add new trading widgets)
# - components/dashboard/dashboard-overview.tsx (update layout)
# - components/ui/button.tsx (improve trading buttons)
# - components/ui/card.tsx (enhance card styling)

# 4. Check what you've modified
git status
git diff --name-only

# Expected output:
# app/dashboard/page.tsx
# components/dashboard/dashboard-overview.tsx
# components/ui/button.tsx
# components/ui/card.tsx

# 5. Safety check - ensure no admin files
git diff --name-only | grep -i admin
# Should return nothing

# 6. Stage only your modified files
git add app/dashboard/page.tsx
git add components/dashboard/dashboard-overview.tsx
git add components/ui/button.tsx
git add components/ui/card.tsx

# 7. Verify staged files
git diff --cached --name-only

# 8. Commit with detailed message
git commit -m "Enhance dashboard trading interface and UI components

- Added real-time trading widgets to dashboard page
- Improved dashboard overview layout for better UX
- Enhanced button component with new trading-specific styles
- Updated card component with better visual hierarchy
- Improved responsive design for mobile trading

Files modified:
- app/dashboard/page.tsx
- components/dashboard/dashboard-overview.tsx
- components/ui/button.tsx
- components/ui/card.tsx"

# 9. Push to GitHub
git push -u origin wa4lo7k/dashboard-trading-improvements

# 10. Create PR on GitHub
# Go to https://github.com/cobzeu/Prop-Firm
# Click "Compare & pull request"
# Fill in PR details and create
```

### After PR is Merged - Cleanup

```bash
# Switch back to main
git checkout main

# Optionally update main (coordinate with friend first)
# git pull origin main

# Delete your feature branch locally
git branch -d wa4lo7k/dashboard-trading-improvements

# Delete remote branch (optional, GitHub can do this automatically)
git push origin --delete wa4lo7k/dashboard-trading-improvements
```

## Summary

This workflow ensures:
- ✅ Only your modified files are committed
- ✅ Your friend's admin files remain untouched
- ✅ Changes are properly attributed to wa4lo7k
- ✅ Safe collaboration without conflicts
- ✅ Clear documentation and communication
- ✅ Easy rollback if issues occur

**Remember:** When in doubt, check `git status` and `git diff --name-only` before staging any files. Communication with your friend is key to successful collaboration!
