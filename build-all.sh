#!/usr/bin/env bash
# Build script for C# Interview Prep - generates both study site and flash cards

set -e

echo ""
echo "🚀 C# Interview Prep - Build All Sites"
echo "═══════════════════════════════════════"
echo ""

# Get the repository root
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Track build results
SUCCESS_COUNT=0
FAILED_COUNT=0

# ============================================
# Build Study Site
# ============================================
echo "📚 Building Study Site..."
echo "──────────────────────────"

STUDY_SITE_PATH="$REPO_ROOT/study-site"
STUDY_BUILD_SCRIPT="$STUDY_SITE_PATH/build.js"

if [ -f "$STUDY_BUILD_SCRIPT" ]; then
    cd "$STUDY_SITE_PATH"
    if node build.js; then
        echo "✅ Study site built successfully!"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "❌ Study site build failed!"
        FAILED_COUNT=$((FAILED_COUNT + 1))
    fi
else
    echo "⚠️  Study site build script not found at: $STUDY_BUILD_SCRIPT"
fi

echo ""

# ============================================
# Build Flash Cards
# ============================================
echo "🎴 Building Flash Cards..."
echo "──────────────────────────"

FLASH_CARD_PATH="$REPO_ROOT/flash-card-web-site"
FLASH_CARD_BUILD_SCRIPT="$FLASH_CARD_PATH/build.js"

if [ -f "$FLASH_CARD_BUILD_SCRIPT" ]; then
    cd "$FLASH_CARD_PATH"
    if node build.js; then
        echo "✅ Flash cards built successfully!"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "❌ Flash cards build failed!"
        FAILED_COUNT=$((FAILED_COUNT + 1))
    fi
else
    echo "⚠️  Flash card build script not found at: $FLASH_CARD_BUILD_SCRIPT"
fi

# ============================================
# Summary
# ============================================
echo ""
echo "═══════════════════════════════════════"
echo "📊 Build Summary"
echo "═══════════════════════════════════════"
echo ""

TOTAL_COUNT=$((SUCCESS_COUNT + FAILED_COUNT))
echo "Total: $TOTAL_COUNT builds"
echo "  • Successful: $SUCCESS_COUNT"
if [ $FAILED_COUNT -gt 0 ]; then
    echo "  • Failed: $FAILED_COUNT"
fi

# ============================================
# Next Steps
# ============================================
if [ $FAILED_COUNT -eq 0 ] && [ $SUCCESS_COUNT -gt 0 ]; then
    echo ""
    echo "🎉 All builds completed successfully!"
    echo ""
    echo "📂 Build outputs:"
    echo "   • Study Site:    study-site/dist/"
    echo "   • Flash Cards:   flash-card-web-site/flash-card-data.js"
    echo ""
    echo "🚀 Next steps:"
    echo "   • Test study site:    cd study-site/dist && npx serve ."
    echo "   • Test flash cards:   cd flash-card-web-site && npx serve ."
elif [ $FAILED_COUNT -gt 0 ]; then
    echo ""
    echo "⚠️  Some builds did not complete successfully."
    echo "Review the output above for details."
    exit 1
fi

echo ""
