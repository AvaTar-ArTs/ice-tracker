#!/bin/bash
# Git AI Superpower Agent
# Advanced automation and management for Git AI across repositories

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/../logs/git-ai-agent.log"

# Initialize logging
mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Enhanced multi-repository scanner
scan_repositories() {
    echo "🔍 Scanning repositories for Git AI status..."
    log_message "Starting repository scan"
    
    # Define common project directories to scan
    declare -a search_paths=(
        "$HOME/projects"
        "$HOME/dev"
        "$HOME/code"
        "$PWD"
    )
    
    for path in "${search_paths[@]}"; do
        if [ -d "$path" ]; then
            while IFS= read -r -d '' repo_dir; do
                repo_name=$(basename "$repo_dir")
                echo ""
                echo "Repository: $repo_name"
                echo "Path: $repo_dir"
                
                # Temporarily switch to repo directory to check Git AI status
                (
                    cd "$repo_dir"
                    if command -v git-ai &> /dev/null && [ -d ".git" ]; then
                        echo "Git AI Status:"
                        git-ai status 2>/dev/null | head -10 || echo "  No recent AI activity"
                        echo ""
                    else
                        echo "  Git AI not active or not a git repo"
                        echo ""
                    fi
                )
            done < <(find "$path" -maxdepth 3 -name ".git" -type d -print0)
        fi
    done
    
    log_message "Repository scan completed"
}

# Automated fixer for common Git AI issues
automated_fixer() {
    echo "🤖 Running Git AI automated fixer..."
    log_message "Starting automated fixer"
    
    issues_fixed=0
    
    # Check if Git AI is installed
    if ! command -v git-ai &> /dev/null; then
        echo "  Installing Git AI..."
        curl -fsSL https://usegitai.com/install.sh | bash
        ((issues_fixed++))
    fi
    
    # Check if in a git repository
    if [ -d ".git" ]; then
        echo "  Attempting to install Git AI hooks (with error handling)..."
        # Try to install hooks, suppress the Gemini error
        output=$(git-ai install-hooks 2>&1)
        echo "$output"
        
        if echo "$output" | grep -q "JSON error: key must be a string at line 2 column 3"; then
            echo "  ⚠️  Known Gemini hook issue detected (this is OK, Git AI still works)"
            log_message "Known Gemini hook issue acknowledged"
        else
            echo "  ✅ Hooks installed successfully"
            ((issues_fixed++))
        fi
    fi
    
    echo "  Fixed $issues_fixed issues"
    log_message "Automated fixer completed - fixed $issues_fixed issues"
}

# API key validator with security checks
validate_api_security() {
    echo "🛡️  Validating API key security..."
    log_message "Starting API security validation"
    
    security_issues=0
    
    if [ -d "$HOME/.env.d" ]; then
        # Check file permissions on sensitive files
        sensitive_files=$(find $HOME/.env.d -name "*.env" -o -name "*.json" | head -20)
        for file in $sensitive_files; do
            perms=$(stat -c "%a" "$file" 2>/dev/null || stat -f "%OLp" "$file" 2>/dev/null)
            if [ "$perms" != "600" ] && [ "$perms" != "640" ] && [[ "$perms" != *"6???" ]]; then
                echo "  ⚠️  File $file has potentially insecure permissions ($perms)"
                ((security_issues++))
            fi
        done
        
        # Check if Gemini API key is properly configured
        if [ -f "$HOME/.env.d/llm-apis.env" ]; then
            if grep -q "GEMINI_API_KEY=AIza" "$HOME/.env.d/llm-apis.env"; then
                echo "  ✅ Gemini API key is configured"
            else
                echo "  ⚠️  Gemini API key may not be properly configured"
                ((security_issues++))
            fi
        fi
    else
        echo "  ⚠️  API configuration directory not found at $HOME/.env.d"
        ((security_issues++))
    fi
    
    echo "  Found $security_issues potential security issues"
    log_message "Security validation completed - found $security_issues issues"
}

# Advanced attribution analyzer
analyze_attribution_trends() {
    echo "📈 Analyzing Git AI attribution trends..."
    log_message "Starting attribution trend analysis"
    
    if [ -d ".git" ] && command -v git-ai &> /dev/null; then
        echo "  Current repository attribution:"
        git-ai stats || echo "  No stats available in this repository"
        
        # Show recent commits with AI attribution
        echo ""
        echo "  Recent AI-attributed commits:"
        git-ai show HEAD~5..HEAD 2>/dev/null | grep -E "(gemini|cursor|claude|copilot)" | head -10 || echo "  No recent AI-attributed commits found"
    else
        echo "  Not in a git repository or Git AI not installed"
    fi
    
    log_message "Attribution analysis completed"
}

# Main command router
show_help() {
    echo "🤖 Git AI Superpower Agent"
    echo "========================="
    echo "Advanced automation and management for Git AI"
    echo ""
    echo "Commands:"
    echo "  scan          - Scan all repositories for Git AI status"
    echo "  fix           - Run automated fixer for common issues"
    echo "  security      - Validate API key security"
    echo "  analyze       - Analyze attribution trends"
    echo "  all           - Run all diagnostic tools"
    echo "  logs          - Show recent agent logs"
    echo "  help          - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 scan              # Scan all repos"
    echo "  $0 fix               # Auto-fix issues"
    echo "  $0 all               # Complete diagnostics"
}

show_logs() {
    echo "📋 Recent Agent Logs"
    echo "=================="
    tail -20 "$LOG_FILE" || echo "No logs found"
}

case "${1:-help}" in
    "scan")
        scan_repositories
        ;;
    "fix")
        automated_fixer
        ;;
    "security")
        validate_api_security
        ;;
    "analyze")
        analyze_attribution_trends
        ;;
    "all")
        echo "🚀 Running complete Git AI diagnostics..."
        echo ""
        validate_api_security
        echo ""
        automated_fixer
        echo ""
        scan_repositories
        echo ""
        analyze_attribution_trends
        echo ""
        echo "✅ Complete diagnostics finished"
        ;;
    "logs")
        show_logs
        ;;
    "help"|*)
        show_help
        ;;
esac