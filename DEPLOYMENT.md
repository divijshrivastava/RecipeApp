# Deployment Guide

## Production Build

The application has been built successfully. The production files are in `dist/recipe-app/browser/`.

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd dist/recipe-app/browser
   vercel
   ```

   Or deploy from root:
   ```bash
   vercel --cwd dist/recipe-app/browser
   ```

3. **Follow the prompts** to link your project and deploy.

**Alternative: GitHub Integration**
- Push your code to GitHub
- Go to [vercel.com](https://vercel.com)
- Import your repository
- Set build command: `npm run build -- --configuration production`
- Set output directory: `dist/recipe-app/browser`
- Deploy!

### Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   cd dist/recipe-app/browser
   netlify deploy --prod
   ```

**Alternative: Drag & Drop**
- Go to [app.netlify.com](https://app.netlify.com)
- Drag and drop the `dist/recipe-app/browser` folder
- Your site will be live!

**GitHub Integration:**
- Push to GitHub
- Connect repository on Netlify
- Build command: `npm run build -- --configuration production`
- Publish directory: `dist/recipe-app/browser`

### Option 3: GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**:
   ```json
   "scripts": {
     "deploy": "ng build --configuration production --base-href /RecipeApp/ && npx gh-pages -d dist/recipe-app/browser"
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages** in repository settings:
   - Go to Settings > Pages
   - Select `gh-pages` branch
   - Select `/ (root)` folder

### Option 4: Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and initialize**:
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure**:
   - Public directory: `dist/recipe-app/browser`
   - Single-page app: Yes
   - Overwrite index.html: No

4. **Deploy**:
   ```bash
   firebase deploy
   ```

### Option 5: AWS S3 + CloudFront

1. **Install AWS CLI** and configure
2. **Create S3 bucket** and enable static website hosting
3. **Upload files**:
   ```bash
   aws s3 sync dist/recipe-app/browser s3://your-bucket-name --delete
   ```
4. **Configure CloudFront** for CDN (optional but recommended)

## Pre-Deployment Checklist

- [ ] Update `environment.prod.ts` with production Appwrite credentials
- [ ] Ensure `appwriteStorageBucketId` is set correctly
- [ ] Test the production build locally
- [ ] Verify all routes work correctly
- [ ] Check that images load properly
- [ ] Test form submissions
- [ ] Verify authentication flow

## Environment Variables

Make sure your production environment file (`src/environments/environment.prod.ts`) has:
- `appwriteEndpoint`: Your Appwrite endpoint URL
- `appwriteProjectId`: Your Appwrite project ID
- `appwriteDatabaseId`: Your Appwrite database ID
- `appwriteRecipeCollectionId`: Your collection ID
- `appwriteStorageBucketId`: Your storage bucket ID

## Build Command

For all platforms, use:
```bash
npm run build -- --configuration production
```

Output directory: `dist/recipe-app/browser`

## Important Notes

1. **Base Href**: If deploying to a subdirectory (like GitHub Pages), you may need to add `--base-href /your-repo-name/` to the build command.

2. **404 Handling**: For SPA routing, configure your hosting platform to redirect all routes to `index.html`.

3. **CORS**: Ensure your Appwrite project allows requests from your deployment domain.

4. **HTTPS**: Most platforms provide HTTPS by default. Ensure your Appwrite endpoint supports HTTPS.

## Quick Deploy Commands

**Vercel** (from project root):
```bash
vercel --cwd dist/recipe-app/browser
```

**Netlify** (from project root):
```bash
netlify deploy --prod --dir=dist/recipe-app/browser
```

**Firebase** (after init):
```bash
firebase deploy --only hosting
```

