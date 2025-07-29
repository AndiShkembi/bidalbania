#!/bin/bash

echo "🔒 Adding Content Security Policy to all HTML files..."
echo "===================================================="

echo ""
echo "📋 Step 1: Finding all HTML files..."
echo "-----------------------------------"

# Find all HTML files
HTML_FILES=$(find . -name "*.html" -type f)

if [ -z "$HTML_FILES" ]; then
    echo "❌ No HTML files found"
    exit 1
fi

echo "✅ Found HTML files:"
echo "$HTML_FILES" | sed 's/^/  /'

echo ""
echo "📋 Step 2: Adding CSP meta tag to each file..."
echo "---------------------------------------------"

CSP_ADDED=0
CSP_EXISTS=0

for file in $HTML_FILES; do
    echo "🔍 Processing: $file"
    
    # Check if CSP already exists
    if grep -q "Content-Security-Policy" "$file"; then
        echo "  ⚠️  CSP already exists in $file"
        ((CSP_EXISTS++))
        continue
    fi
    
    # Add CSP meta tag after charset meta tag
    if sed -i.bak '/<meta charset="UTF-8"/a\
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">' "$file"; then
        echo "  ✅ CSP added to $file"
        ((CSP_ADDED++))
    else
        echo "  ❌ Failed to add CSP to $file"
    fi
done

echo ""
echo "📋 Step 3: Summary..."
echo "-------------------"

echo "✅ Files with CSP added: $CSP_ADDED"
echo "⚠️  Files that already had CSP: $CSP_EXISTS"
echo "📁 Total HTML files processed: $(echo "$HTML_FILES" | wc -l)"

echo ""
echo "🔒 Content Security Policy Details:"
echo "----------------------------------"
echo "Meta tag added: <meta http-equiv=\"Content-Security-Policy\" content=\"upgrade-insecure-requests\">"
echo ""
echo "📋 What this CSP does:"
echo "  • Automatically upgrades HTTP requests to HTTPS"
echo "  • Prevents mixed content warnings"
echo "  • Improves security by forcing secure connections"
echo "  • Works with your existing SSL certificate"

echo ""
echo "🌐 Files updated:"
echo "----------------"
for file in $HTML_FILES; do
    if grep -q "Content-Security-Policy" "$file"; then
        echo "✅ $file"
    else
        echo "❌ $file (failed to update)"
    fi
done

echo ""
echo "🔧 Next Steps:"
echo "-------------"
echo "1. Test your website to ensure it loads correctly"
echo "2. Check browser console for any CSP violations"
echo "3. If you have external resources (images, scripts, etc.),"
echo "   you may need to update them to use HTTPS"
echo ""
echo "💡 Benefits of this CSP:"
echo "  • No more mixed content errors"
echo "  • Better security"
echo "  • Improved user experience"
echo "  • SEO benefits (HTTPS is preferred by search engines)"

echo ""
echo "⚠️  Important Notes:"
echo "------------------"
echo "• This CSP will force all HTTP requests to HTTPS"
echo "• Make sure all your external resources support HTTPS"
echo "• Test thoroughly in different browsers"
echo "• Monitor for any CSP violations in browser console"

echo ""
echo "🎉 CSP implementation complete!"
echo "==============================" 