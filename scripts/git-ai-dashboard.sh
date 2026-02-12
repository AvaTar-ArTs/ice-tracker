#!/bin/bash
# Git AI Management Superpower Script

set -e

# Git AI Management Dashboard
# Provides comprehensive oversight of Git AI across repositories

show_help() {
    echo "Git AI Management Dashboard"
    echo "==========================="
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  status     - Show Git AI status across repositories"
    echo "  setup      - Set up Git AI in a new repository"
    echo "  diagnose   - Diagnose Git AI issues"
    echo "  api-check  - Verify API key configurations"
    echo "  report     - Generate AI attribution report"
    echo "  help       - Show this help message"
}

show_status() {
    echo "🔍 Git AI Status Report"
    echo "======================"
    if command -v git-ai &> /dev/null; then
        echo "✅ Git AI is installed"
        git-ai status 2>/dev/null || echo "⚠️  No recent AI activity detected"
        echo ""
        git-ai stats 2>/dev/null || echo "📊 Run git-ai stats in a repository to see attribution"
    else
        echo "❌ Git AI is not installed"
        echo "Run: curl -fsSL https://usegitai.com/install.sh | bash"
    fi
}

setup_git_ai() {
    echo "🔧 Setting up Git AI in current repository..."
    if [ -d ".git" ]; then
        echo "Installing Git AI hooks..."
        git-ai install-hooks
        echo "✅ Git AI hooks installed in $(pwd)"
    else
        echo "❌ Not in a git repository"
        exit 1
    fi
}

diagnose_issues() {
    echo "🏥 Git AI Diagnostic Report"
    echo "=========================="
    
    echo "Checking Git AI installation..."
    if command -v git-ai &> /dev/null; then
        echo "✅ Git AI is installed at: $(which git-ai)"
    else
        echo "❌ Git AI is not installed"
        return 1
    fi
    
    echo ""
    echo "Checking for common issues..."
    
    # Check if in a git repository
    if [ ! -d ".git" ]; then
        echo "⚠️  Warning: Not in a git repository"
        echo "   Navigate to a git repository to check repository-specific issues"
        return 0
    fi
    
    # Check Git AI status
    echo "Checking Git AI status..."
    git-ai status || echo "⚠️  Git AI status check failed"
    
    # Check for the Gemini hook issue specifically
    echo "Testing Git AI hooks installation..."
    temp_output=$(mktemp)
    git-ai install-hooks > "$temp_output" 2>&1 || true
    if grep -q "JSON error: key must be a string at line 2 column 3" "$temp_output"; then
        echo "⚠️  Known issue detected: Gemini hooks failing with JSON error"
        echo "   This is a cosmetic issue that doesn't affect Git AI functionality"
    fi
    rm "$temp_output"
    
    echo "✅ Diagnostic complete"
}

check_api_configs() {
    echo "🔑 API Configuration Check"
    echo "========================="
    
    if [ -d "$HOME/.env.d" ]; then
        echo "✅ API configuration directory found: $HOME/.env.d"
        
        # Count API config files
        api_count=$(ls $HOME/.env.d/*api*.env $HOME/.env.d/*key*.env $HOME/.env.d/*env 2>/dev/null | wc -l)
        echo "📁 Found $api_count API configuration files"
        
        # Check for Gemini API key specifically
        if grep -q "GEMINI_API_KEY" $HOME/.env.d/llm-apis.env 2>/dev/null; then
            echo "✅ Gemini API key is configured"
        else
            echo "⚠️  Gemini API key not found in llm-apis.env"
        fi
        
        # Check for GitHub tokens
        if grep -q "GITHUB_TOKEN" $HOME/.env.d/github.env 2>/dev/null; then
            echo "✅ GitHub tokens are configured"
        else
            echo "⚠️  GitHub tokens not found in github.env"
        fi
    else
        echo "❌ API configuration directory not found: $HOME/.env.d"
        echo "   This may affect Git AI's ability to track certain AI contributions"
    fi
}

generate_report() {
    echo "📊 Git AI Attribution Report"
    echo "============================"
    
    if [ ! -d ".git" ]; then
        echo "⚠️  Not in a git repository"
        echo "   Navigate to a git repository to generate attribution report"
        return 0
    fi
    
    echo "Current repository: $(basename $(pwd))"
    echo ""
    
    # Show Git AI stats if available
    if command -v git-ai &> /dev/null; then
        git-ai stats || echo "No Git AI stats available in this repository"
    else
        echo "Git AI not installed - cannot generate attribution report"
    fi
}

case "${1:-help}" in
    "status")
        show_status
        ;;
    "setup")
        setup_git_ai
        ;;
    "diagnose")
        diagnose_issues
        ;;
    "api-check")
        check_api_configs
        ;;
    "report")
        generate_report
        ;;
    "help"|*)
        show_help
        ;;
esac