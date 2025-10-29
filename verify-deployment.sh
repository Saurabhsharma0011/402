#!/bin/bash

# x402OS Pre-Deployment Verification Script
# Run this before deploying to ensure all assets are ready

echo "🚀 x402OS Pre-Deployment Verification"
echo "======================================"
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "✅ In correct directory"
echo ""

# Verify Twitter screenshots exist
echo "📸 Checking Twitter Screenshots..."
MISSING_IMAGES=0
for i in {1..13}; do
    if [ ! -f "public/twitter${i}.png" ]; then
        echo "❌ Missing: twitter${i}.png"
        MISSING_IMAGES=$((MISSING_IMAGES + 1))
    else
        echo "✅ Found: twitter${i}.png"
    fi
done

if [ $MISSING_IMAGES -eq 0 ]; then
    echo "✅ All 13 Twitter screenshots found!"
else
    echo "❌ Missing $MISSING_IMAGES images!"
    exit 1
fi
echo ""

# Verify other critical assets
echo "🖼️  Checking Other Assets..."
CRITICAL_ASSETS=(
    "public/osososo.jpg"
    "public/solanapay.png"
    "public/osososo-modified.png"
    "app/icon.png"
    "app/apple-icon.png"
)

for asset in "${CRITICAL_ASSETS[@]}"; do
    if [ -f "$asset" ]; then
        echo "✅ Found: $asset"
    else
        echo "❌ Missing: $asset"
    fi
done
echo ""

# Check critical component files
echo "📁 Checking Component Files..."
COMPONENTS=(
    "components/os/Desktop.tsx"
    "components/apps/XFeedApp.tsx"
    "components/faucet/X402Faucet.tsx"
    "hooks/useX402Balance.ts"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo "✅ Found: $component"
    else
        echo "❌ Missing: $component"
    fi
done
echo ""

# Check for logout button in Desktop.tsx
echo "🚪 Checking Logout Button..."
if grep -q "🚪 Logout" components/os/Desktop.tsx; then
    echo "✅ Logout button found in Desktop.tsx"
else
    echo "❌ Logout button NOT found in Desktop.tsx"
fi
echo ""

# Check XFeedApp for correct image paths
echo "📰 Checking x402feed Image Paths..."
if grep -q "/twitter1.png" components/apps/XFeedApp.tsx; then
    echo "✅ x402feed using correct image paths"
else
    echo "❌ x402feed image paths may be incorrect"
fi
echo ""

# Check environment variables
echo "🔐 Checking Environment Variables..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    
    # Check for critical variables
    if grep -q "NEXT_PUBLIC_PRIVY_APP_ID" .env.local; then
        echo "✅ PRIVY_APP_ID configured"
    else
        echo "⚠️  PRIVY_APP_ID not found"
    fi
    
    if grep -q "NEXT_PUBLIC_SOLANA_RPC_URL" .env.local; then
        echo "✅ SOLANA_RPC_URL configured"
    else
        echo "⚠️  SOLANA_RPC_URL not found"
    fi
else
    echo "⚠️  .env.local file not found (remember to add variables to Vercel)"
fi
echo ""

# Check if .gitignore includes .env.local
echo "🔒 Checking .gitignore..."
if [ -f ".gitignore" ] && grep -q ".env.local" .gitignore; then
    echo "✅ .env.local is in .gitignore (good!)"
else
    echo "⚠️  .env.local should be in .gitignore"
fi
echo ""

# Try to build the project
echo "🏗️  Testing Build..."
echo "Running: npm run build"
echo ""

if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Check errors above."
    echo "Run 'npm run build' manually to see detailed errors."
    exit 1
fi
echo ""

# Final summary
echo "======================================"
echo "✅ Pre-Deployment Verification Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Commit your changes: git add . && git commit -m 'Ready for deployment'"
echo "2. Push to repository: git push origin main"
echo "3. Add environment variables to Vercel (if not already done)"
echo "4. Deploy: vercel --prod"
echo "5. Test deployed site using DEPLOYMENT_CHECKLIST.md"
echo ""
echo "🎉 Your x402OS is ready for deployment!"
echo "======================================"
