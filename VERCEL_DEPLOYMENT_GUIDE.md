# FlashFundX Vercel Deployment Guide

## 🚀 Quick Fix for 404 Error

The 404 error on Vercel is caused by the Next.js application being in the `Frontend` subdirectory instead of the root. Here are the solutions:

## ✅ Solution 1: Vercel Dashboard Configuration (Recommended)

### Step 1: Update Build Settings in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **General**
3. Update the following settings:

```
Framework Preset: Next.js
Root Directory: Frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Step 2: Environment Variables

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## ✅ Solution 2: Manual Vercel CLI Deployment (Alternative)

If the dashboard method doesn't work, you can deploy directly from the Frontend directory:

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to Frontend directory
cd Frontend

# Deploy from Frontend directory
vercel --prod
```

## 🔧 Manual Deployment Steps

### Option A: Redeploy from Vercel Dashboard

1. Go to your Vercel project
2. Click **Deployments** tab
3. Click **Redeploy** on the latest deployment
4. Select **Use existing Build Cache: No**
5. Click **Redeploy**

### Option B: Trigger New Deployment

1. Make a small change to any file in the Frontend directory
2. Commit and push to GitHub:

```bash
git add .
git commit -m "fix: Update Vercel configuration for Frontend subdirectory"
git push origin main
```

## 🔍 Troubleshooting

### If you still get 404 errors:

1. **Check Build Logs**: Go to Vercel Dashboard → Deployments → Click on latest deployment → View Build Logs
2. **Verify Root Directory**: Ensure "Root Directory" is set to "Frontend" in Vercel settings
3. **Check Framework Detection**: Vercel should auto-detect Next.js framework

### Common Issues:

#### Issue 1: "No package.json found"
**Solution**: Set Root Directory to "Frontend" in Vercel settings

#### Issue 2: "Build failed"
**Solution**: Check that all dependencies are in Frontend/package.json

#### Issue 3: "404 on all routes"
**Solution**: Ensure Output Directory is set to ".next" (not "Frontend/.next")

## 📁 Project Structure

Your project structure should look like this:

```
FlashFundXxx/
├── Frontend/                 # Next.js application
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and configs
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── next.config.mjs      # Next.js configuration
│   └── tsconfig.json        # TypeScript config
├── supabase/                # Backend Edge Functions
├── vercel.json              # Vercel configuration
├── .vercelignore           # Files to ignore during deployment
└── README.md
```

## ✅ Verification Steps

After deployment, verify these work:

1. **Homepage**: `https://your-domain.vercel.app/` should load
2. **Login Page**: `https://your-domain.vercel.app/login` should work
3. **Dashboard**: `https://your-domain.vercel.app/dashboard` should work
4. **API Routes**: `https://your-domain.vercel.app/api/user-data` should respond

## 🔗 Useful Links

- **Vercel Next.js Documentation**: https://vercel.com/docs/frameworks/nextjs
- **Vercel Build Configuration**: https://vercel.com/docs/projects/project-configuration
- **Next.js App Router**: https://nextjs.org/docs/app

## 🆘 If Nothing Works

If you're still getting 404 errors after trying the above:

1. **Delete and recreate the Vercel project**:
   - Go to Vercel Dashboard → Settings → Advanced → Delete Project
   - Import the project again from GitHub
   - Set Root Directory to "Frontend" during import

2. **Contact Support**:
   - Check Vercel Status: https://vercel-status.com/
   - Vercel Community: https://github.com/vercel/vercel/discussions

## 📝 Notes

- The build is successful locally (verified with `npm run build`)
- All 51 pages are being generated correctly
- The issue is purely a deployment configuration problem
- Once fixed, the site should work perfectly on Vercel
