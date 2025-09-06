#!/bin/bash

# Setup script for Copilot Coding Agent
# Install dependencies and prepare the Node.js environment.
# Run this before running tests or the dev server.

set -e  # Exit on any error

echo "🔧 Setting up Node.js environment for Copilot Coding Agent..."

# Check if we have the correct Node.js version
REQUIRED_NODE_VERSION="22"
CURRENT_NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$CURRENT_NODE_VERSION" != "$REQUIRED_NODE_VERSION" ]; then
    echo "⚠️  Current Node.js version: v$(node --version | cut -d'v' -f2)"
    echo "📋 Required Node.js version: ${REQUIRED_NODE_VERSION}.x (as specified in package.json)"
    
    # Check if nvm is available
    if command -v nvm >/dev/null 2>&1; then
        echo "📦 nvm detected, attempting to install and use Node.js ${REQUIRED_NODE_VERSION}..."
        nvm install ${REQUIRED_NODE_VERSION}
        nvm use ${REQUIRED_NODE_VERSION}
    elif command -v fnm >/dev/null 2>&1; then
        echo "📦 fnm detected, attempting to install and use Node.js ${REQUIRED_NODE_VERSION}..."
        fnm install ${REQUIRED_NODE_VERSION}
        fnm use ${REQUIRED_NODE_VERSION}
    elif command -v volta >/dev/null 2>&1; then
        echo "📦 volta detected, installing Node.js version from package.json..."
        volta install node@${REQUIRED_NODE_VERSION}
    else
        echo "⚠️  No Node.js version manager detected (nvm, fnm, or volta)"
        echo "⚠️  Continuing with current version, but you may see warnings..."
        echo "💡 Consider installing Node.js ${REQUIRED_NODE_VERSION}.x for the best experience"
    fi
fi

echo "📦 Installing npm dependencies..."
npm install

echo "✅ Setup complete! Node.js environment ready for development."
echo ""
echo "🚀 Available commands:"
echo "  npm run dev       - Start development server"
echo "  npm run build     - Build for production"
echo "  npm run lint      - Check code style and errors"
echo "  npm run lint-fix  - Auto-fix code style issues"
echo "  npm run test      - Run tests"
echo "  npm run test-ci   - Run tests in CI mode"
