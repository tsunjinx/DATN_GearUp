#!/bin/bash

# Fix-All Script - Resolves ESLint and Prettier issues in the codebase

echo "🔎 Running comprehensive linting and formatting fix..."

# Step 1: Run ESLint fix
echo "🛠️  Step 1: Running ESLint fix..."
npx eslint --ext .js,.jsx,.ts,.tsx,.vue src/ --fix

# Step 2: Run Prettier fix
echo "🧹 Step 2: Running Prettier fix..."
npx prettier --write "src/**/*.{js,jsx,ts,tsx,vue,css,scss,md}"

# Step 3: Run ESLint check to see what's left
echo "🔍 Step 3: Checking remaining ESLint issues..."
npx eslint --ext .js,.jsx,.ts,.tsx,.vue src/

# Step 4: Run Prettier check to see what's left
echo "🔍 Step 4: Checking remaining Prettier issues..."
npx prettier --check "src/**/*.{js,jsx,ts,tsx,vue,css,scss,md}"

echo "✅ Automatic fixes applied. Review any remaining issues above."
echo "If there are still issues, you may need to fix some manually."
