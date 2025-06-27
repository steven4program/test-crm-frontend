# GitHub Repository Setup Guide

## Quick Setup Commands

### 1. Create GitHub Repository
```bash
# Using GitHub CLI (recommended)
gh repo create react-crm-frontend --public --description "React CRM Frontend with TypeScript, Vite, and CI/CD pipeline"

# Or create manually at: https://github.com/new
```

### 2. Initialize and Push to GitHub
```bash
# If not already a git repository
git init

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/react-crm-frontend.git

# Stage all files
git add .

# Initial commit
git commit -m "feat: initial commit - React CRM with CI/CD pipeline

- React 18 + TypeScript + Vite setup
- Tailwind CSS styling with custom design system
- Authentication system with role-based access control
- GitHub Actions CI/CD pipeline configuration
- Vercel deployment configuration
- ESLint and TypeScript strict mode
- Responsive CRM interface with user management"

# Push to GitHub
git push -u origin main
```

### 3. Verify Repository Contents
After pushing, your repository should contain:
```
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD pipeline
├── doc/
│   ├── ci-cd-plan.md             # Implementation plan
│   ├── deployment-guide.md       # Deployment instructions
│   ├── design-doc.md             # Existing design documentation
│   └── github-setup.md           # This file
├── src/                          # React application source
├── public/                       # Static assets
├── vercel.json                   # Vercel deployment configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.ts                # Vite build configuration
├── CLAUDE.md                     # Project instructions for Claude
└── README.md                     # Project documentation
```

## Branch Protection Setup

### Configure Main Branch Protection
1. Go to repository Settings → Branches
2. Click "Add rule" for `main` branch
3. Configure the following settings:

**Required Settings:**
- ✅ Require a pull request before merging
- ✅ Require approvals: 1
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging

**Status Checks to Require:**
- `test-and-build (18.x)`
- `test-and-build (20.x)`
- `security-audit`
- `Vercel` (will appear after first deployment)

**Additional Options:**
- ✅ Restrict pushes that create files larger than 100 MB
- ✅ Include administrators (recommended for team consistency)

## Repository Settings Configuration

### General Settings
1. Go to Settings → General
2. Configure:
   - **Description**: "React CRM Frontend with TypeScript, Vite, and CI/CD pipeline"
   - **Website**: (will be your Vercel URL after deployment)
   - **Topics**: `react`, `typescript`, `vite`, `crm`, `tailwindcss`, `github-actions`, `vercel`

### Features to Enable
- ✅ Issues
- ✅ Pull requests
- ✅ Discussions (optional, for team communication)
- ❌ Wiki (documentation is in `/doc` folder)
- ❌ Projects (unless using GitHub Projects)

### Security & Analysis
1. Go to Settings → Security & analysis
2. Enable:
   - ✅ Dependency graph
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ Secret scanning alerts (for public repos)

## Environment Secrets Setup

### Required GitHub Secrets
Go to Settings → Secrets and variables → Actions and add:

```bash
# Vercel deployment secrets (get from Vercel CLI)
VERCEL_TOKEN=your_vercel_personal_access_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

### Getting Vercel Credentials
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to project and link
cd /path/to/your/project
vercel

# Get project info (after linking)
cat .vercel/project.json
```

## Collaboration Setup

### Team Permissions
If working with a team:
1. Go to Settings → Manage access
2. Add collaborators with appropriate permissions:
   - **Admin**: Full repository access
   - **Write**: Can push to branches, create PRs
   - **Read**: Can view repository and create issues

### PR Template (Optional)
Create `.github/pull_request_template.md`:
```markdown
## Changes Made
- [ ] Feature addition
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation update

## Description
Brief description of changes made.

## Testing
- [ ] Tested locally
- [ ] All CI checks pass
- [ ] Preview deployment reviewed

## Screenshots (if applicable)
Add screenshots of UI changes.
```

### Issue Templates (Optional)
Create `.github/ISSUE_TEMPLATE/bug_report.md` and `feature_request.md` for structured issue reporting.

## First Deployment Test

### Verify CI/CD Pipeline
1. Make a small change (e.g., update README.md)
2. Create a feature branch:
   ```bash
   git checkout -b test/verify-pipeline
   git add .
   git commit -m "test: verify CI/CD pipeline"
   git push origin test/verify-pipeline
   ```
3. Create a Pull Request
4. Verify that GitHub Actions run successfully
5. Check that Vercel creates a preview deployment
6. Merge PR and verify production deployment

### Expected CI/CD Flow
1. **PR Creation**: Triggers CI pipeline and preview deployment
2. **CI Checks**: 
   - ESLint code quality check
   - TypeScript compilation
   - Build process
   - Security audit
3. **Preview Deployment**: Vercel creates preview URL
4. **Code Review**: Team reviews changes
5. **Merge**: Triggers production deployment
6. **Production**: Live application updates

## Monitoring & Maintenance

### Regular Tasks
- Monitor Dependabot alerts for security updates
- Review and merge dependency updates
- Check GitHub Actions usage limits (if applicable)
- Monitor Vercel deployment metrics

### Backup Strategy
- Repository is backed up on GitHub
- Download repository archive periodically for local backup
- Document any external dependencies or configurations

## Troubleshooting

### Common Setup Issues

**Remote Already Exists:**
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/react-crm-frontend.git
```

**Authentication Issues:**
```bash
# Use GitHub CLI for easier authentication
gh auth login

# Or configure Git with personal access token
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Large Files Warning:**
```bash
# Check for large files
find . -type f -size +50M

# Remove from git if accidentally added
git rm --cached large_file.ext
git commit -m "remove large file"
```

## Next Steps

After completing this setup:
1. ✅ Repository created and code pushed
2. ✅ Branch protection configured
3. ✅ Vercel credentials added to secrets
4. 🔄 Test the complete CI/CD pipeline
5. 🔄 Deploy to production
6. 📝 Share repository URL with team
7. 📊 Monitor first few deployments

Your repository is now ready for collaborative development with automated CI/CD!