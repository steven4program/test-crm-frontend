# Deployment Guide

## Overview
This guide covers the complete CI/CD pipeline setup for the React CRM Frontend application using GitHub Actions and Vercel.

## Prerequisites
- GitHub account
- Vercel account
- Node.js 18+ installed locally
- Git configured locally

## 1. GitHub Repository Setup

### Initial Repository Creation
1. Create a new repository on GitHub:
   ```bash
   # Option 1: Using GitHub CLI (if installed)
   gh repo create react-crm-frontend --public --description "React CRM Frontend with TypeScript and Vite"
   
   # Option 2: Create manually at https://github.com/new
   ```

2. Push existing code to GitHub:
   ```bash
   # Initialize git (if not already done)
   git init
   
   # Add GitHub remote
   git remote add origin https://github.com/YOUR_USERNAME/react-crm-frontend.git
   
   # Add all files
   git add .
   
   # Initial commit
   git commit -m "feat: initial commit - React CRM with CI/CD pipeline"
   
   # Push to GitHub
   git push -u origin main
   ```

### Configure Branch Protection
1. Go to repository Settings → Branches
2. Add rule for `main` branch:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

## 2. Vercel Deployment Setup

### Connect Vercel to GitHub
1. Visit [vercel.com](https://vercel.com) and sign in
2. Click "New Project" 
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm ci`

### Get Vercel Credentials for GitHub Actions
1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Navigate to project directory and run: `vercel`
4. Get credentials:
   ```bash
   # Get your Vercel token
   vercel whoami
   # Note the token from your account settings
   
   # Get project and org IDs
   cat .vercel/project.json
   ```

### Configure GitHub Secrets
Go to repository Settings → Secrets and variables → Actions, add:
- `VERCEL_TOKEN`: Your Vercel personal access token
- `VERCEL_ORG_ID`: From `.vercel/project.json`
- `VERCEL_PROJECT_ID`: From `.vercel/project.json`

## 3. CI/CD Pipeline Features

### Automated Testing & Building
The GitHub Actions workflow (`.github/workflows/ci.yml`) includes:

- **Multi-Node Testing**: Tests on Node.js 18.x and 20.x
- **Code Quality**: ESLint checks
- **Type Safety**: TypeScript compilation verification
- **Build Process**: Vite production build
- **Security Audit**: npm audit for vulnerabilities
- **Bundle Analysis**: Build size and composition analysis

### Deployment Strategy
- **Preview Deployments**: Automatic deployment on pull requests
- **Production Deployments**: Automatic deployment on push to `main`
- **Build Artifacts**: Saved for 7 days for debugging

### Security Headers
The `vercel.json` configuration includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` for camera, microphone, geolocation

## 4. Development Workflow

### Creating Features
1. Create feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```

2. Make changes and commit:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

3. Create pull request:
   - GitHub will automatically trigger CI pipeline
   - Vercel will create preview deployment
   - Review checks must pass before merge

### Deployment Process
1. **PR Preview**: Each PR gets a unique preview URL
2. **Code Review**: Team reviews code and preview deployment
3. **CI Checks**: All tests, linting, and builds must pass
4. **Merge to Main**: Triggers production deployment
5. **Production**: Live at your Vercel production URL

## 5. Monitoring & Maintenance

### Build Status
- Check GitHub Actions tab for build status
- Review Vercel dashboard for deployment status
- Monitor deployment logs for issues

### Performance Monitoring
- Vercel provides built-in analytics
- Core Web Vitals monitoring
- Deployment metrics and logs

### Security Maintenance
- Regular dependency updates
- Monitor npm audit results
- Review security alerts on GitHub

## 6. Troubleshooting

### Common Issues

**Build Failures**:
```bash
# Test build locally
npm run build

# Check TypeScript errors
npx tsc --noEmit

# Run linting
npm run lint
```

**Deployment Issues**:
- Verify Vercel credentials in GitHub secrets
- Check Vercel dashboard for deployment logs
- Ensure `vercel.json` configuration is correct

**Environment Variables**:
- Add variables in Vercel dashboard
- Reference in GitHub Actions if needed
- Use different values for preview vs production

### Local Testing
```bash
# Start development server
npm run dev

# Build and preview locally
npm run build
npm run preview

# Run all quality checks
npm run lint
npx tsc --noEmit
npm run build
```

## 7. Environment Variables

### Vercel Dashboard Configuration
For environment variables needed by the application:
1. Go to Vercel project dashboard
2. Settings → Environment Variables
3. Add variables for different environments:
   - Production
   - Preview
   - Development

### GitHub Actions Secrets
For CI/CD pipeline secrets:
1. Repository Settings → Secrets and variables → Actions
2. Add repository secrets (never commit these to code)

## 8. Custom Domain (Optional)

### Adding Custom Domain
1. Go to Vercel project dashboard
2. Settings → Domains
3. Add your custom domain
4. Configure DNS records as instructed
5. Vercel automatically provisions SSL certificate

### Domain Configuration
- **Production**: `yourdomain.com`
- **Preview**: `feature-branch.yourdomain.com` (optional)
- **Vercel Default**: `project-name.vercel.app`

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **GitHub Actions**: https://docs.github.com/en/actions
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html
- **Project Issues**: Create issue in GitHub repository