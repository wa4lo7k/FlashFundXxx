#!/bin/bash

# Pre-commit file ownership check for wa4lo7k
# This script prevents accidentally committing admin files

echo "🔍 Checking file ownership before commit..."

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only)

if [ -z "$STAGED_FILES" ]; then
    echo "❌ No files staged for commit"
    exit 1
fi

echo "📁 Staged files:"
echo "$STAGED_FILES"
echo ""

# Check for admin files
ADMIN_FILES=$(echo "$STAGED_FILES" | grep -E "(admin|Admin)")
if [ ! -z "$ADMIN_FILES" ]; then
    echo "🚨 ERROR: You're trying to commit admin files!"
    echo "❌ Admin files found:"
    echo "$ADMIN_FILES"
    echo ""
    echo "🔧 To fix this, unstage admin files with:"
    echo "$ADMIN_FILES" | sed 's/^/git reset HEAD /'
    echo ""
    echo "💡 Remember: Only modify files in your designated areas:"
    echo "   ✅ app/dashboard/"
    echo "   ✅ components/dashboard/"
    echo "   ✅ components/ui/"
    echo "   ✅ components/sections/"
    echo ""
    echo "   ❌ app/admin/"
    echo "   ❌ components/admin/"
    echo "   ❌ lib/admin-*"
    exit 1
fi

# Check for other restricted patterns
RESTRICTED_FILES=$(echo "$STAGED_FILES" | grep -E "(lib/admin-|supabase/)")
if [ ! -z "$RESTRICTED_FILES" ]; then
    echo "⚠️  WARNING: You're modifying restricted files:"
    echo "$RESTRICTED_FILES"
    echo ""
    echo "🤝 Please coordinate with your friend before modifying these files"
    echo "Continue? (y/N): "
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Commit cancelled"
        exit 1
    fi
fi

# Success message
echo "✅ File ownership check passed!"
echo "🎯 Safe to commit - no admin files detected"
echo ""
echo "📝 Files ready for commit:"
echo "$STAGED_FILES" | sed 's/^/   ✓ /'
echo ""
