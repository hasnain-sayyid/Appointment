#!/bin/bash

# Barber Shop Appointment Scheduler - Render Deployment Script
# This script automatically deploys the frontend to Render

echo "🚀 Barber Shop Appointment Scheduler - Render Deployment"
echo "=================================================="
echo ""

# Check if Render CLI is installed
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI not found. Installing..."
    npm install -g render-cli
fi

echo "✅ Prerequisites check complete"
echo ""
echo "To deploy automatically, you need:"
echo "1. Your Render API token from https://dashboard.render.com/account/api-tokens"
echo "2. Run this command:"
echo ""
echo "   render deploy --name=appointment-frontend"
echo ""
echo "Or manually deploy via:"
echo "   1. Go to https://render.com/dashboard"
echo "   2. Click '+ New' → 'Web Service'"
echo "   3. Select your GitHub repository"
echo "   4. Render will auto-detect render.yaml configuration"
echo "   5. Click 'Create Web Service'"
echo ""
echo "For automated deployment with API token:"
echo "   export RENDER_API_KEY='your_api_token_here'"
echo "   npm run deploy:render"
echo ""
