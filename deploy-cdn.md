# 🌐 CDN Deployment Guide for Intent Map

This guide will help you deploy your Intent Map tracking scripts to a CDN for global access.

## 📋 Prerequisites

1. **API Server**: Deploy your server first (see Server Deployment section)
2. **Domain**: Have your website domain ready for CORS configuration
3. **Git Repository**: Your code should be in a Git repository

## 🚀 Deployment Options

### Option 1: Netlify (Recommended - Free)

**Step 1: Prepare Repository**
```bash
# Add and commit your cdn-static folder
git add cdn-static/
git commit -m "Add CDN static files"
git push origin main
```

**Step 2: Deploy to Netlify**
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Set these build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `cdn-static`
5. Click "Deploy site"

**Step 3: Custom Domain (Optional)**
1. In Netlify dashboard, go to "Domain settings"
2. Add your custom domain (e.g., `cdn.yourdomain.com`)

Your CDN URL will be: `https://your-app.netlify.app`

### Option 2: Vercel (Free)

**Step 1: Install Vercel CLI**
```bash
npm i -g vercel
```

**Step 2: Deploy**
```bash
cd cdn-static
vercel --prod
```

**Step 3: Set Custom Domain**
```bash
vercel domains add cdn.yourdomain.com
```

Your CDN URL will be: `https://your-app.vercel.app`

### Option 3: GitHub Pages (Free)

**Step 1: Create gh-pages branch**
```bash
git checkout -b gh-pages
git add cdn-static/
git commit -m "CDN files for GitHub Pages"
git push origin gh-pages
```

**Step 2: Enable Pages**
1. Go to your GitHub repository
2. Settings → Pages
3. Source: Deploy from branch
4. Branch: `gh-pages`
5. Folder: `/ (root)`

Your CDN URL will be: `https://username.github.io/intent-map`

### Option 4: AWS CloudFront + S3

**Step 1: Create S3 Bucket**
```bash
aws s3 mb s3://intent-map-cdn
aws s3 sync cdn-static/ s3://intent-map-cdn --acl public-read
```

**Step 2: Create CloudFront Distribution**
```bash
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

**Step 3: Configure CORS**
Add CORS policy to S3 bucket:
```json
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "HEAD"],
            "AllowedOrigins": ["*"],
            "MaxAgeSeconds": 3000
        }
    ]
}
```

## 🔧 Server Deployment

Deploy your API server to one of these platforms:

### Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set these environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_url
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-website.com,https://your-cdn-url.com
   ```

### Heroku
```bash
# Install Heroku CLI
heroku create intent-map-api
heroku config:set MONGODB_URI=your_mongodb_atlas_url
heroku config:set NODE_ENV=production
heroku config:set ALLOWED_ORIGINS=https://your-website.com
git subtree push --prefix server heroku main
```

### DigitalOcean App Platform
1. Create new app
2. Connect GitHub repository
3. Set source directory to `server/`
4. Add environment variables

## 📝 Usage in Your Website

Once deployed, add this to your website:

```html
<!-- Replace with your actual URLs -->
<script>
window.IntentMapConfig = {
    apiEndpoint: 'https://your-api-server.railway.app/api',
    trackingEnabled: true,
    trackClicks: true,
    trackScrolls: true,
    debug: false // Set to true for testing
};
</script>
<script src="https://your-cdn-url.netlify.app/client-snippet/index.js"></script>
```

## 🔍 Testing Your Deployment

### Test CDN URLs
```bash
# Test tracking script
curl -I https://your-cdn-url.com/client-snippet/index.js

# Test heatmap overlay
curl -I https://your-cdn-url.com/heatmap-overlay/overlay.js
```

### Test API Server
```bash
# Test health endpoint
curl https://your-api-server.com/health

# Should return: {"status":"OK","mongodb":"connected",...}
```

### Test Integration
1. Add the script to a test page
2. Open browser dev tools
3. Look for console messages:
   ```
   Intent Map: Initializing tracking
   Intent Map: Tracking initialized with session: sess_xxx
   ```
4. Click around and check Network tab for `/api/track` requests

## ⚙️ Configuration Updates

### Update CORS Origins
In your server's `.env`:
```env
ALLOWED_ORIGINS=https://your-website.com,https://another-site.com,https://your-cdn-url.com
```

### Update CDN URLs
Replace in your website code:
- `apiEndpoint`: Your API server URL
- Script `src`: Your CDN URL

## 🔒 Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **CORS Configuration**: Only allow necessary domains
3. **Rate Limiting**: Server has built-in rate limiting
4. **Content Security Policy**: Add CSP headers if needed

## 📊 Monitoring

### CDN Performance
- Check CDN analytics dashboard
- Monitor script load times
- Verify global availability

### API Server Health
- Monitor `/health` endpoint
- Check MongoDB connection status
- Monitor request/response times

## 🆘 Troubleshooting

### Script Not Loading
- Check CDN URL is accessible
- Verify CORS headers are set
- Check browser network tab for errors

### API Requests Failing
- Verify API server is running
- Check CORS configuration
- Confirm correct `apiEndpoint` URL

### No Data in Dashboard
- Check API server logs
- Verify MongoDB connection
- Test tracking script configuration

## 🎯 Production Checklist

- [ ] API server deployed and running
- [ ] CDN deployed with tracking scripts
- [ ] CORS configured for your domains
- [ ] HTTPS enabled on all endpoints
- [ ] Environment variables set correctly
- [ ] Database connection working
- [ ] Test tracking on your website
- [ ] Dashboard accessible
- [ ] Monitoring/logging configured

Your Intent Map is now globally accessible via CDN! 🎉 