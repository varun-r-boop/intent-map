# Intent Map CDN Static Files

This directory contains the static files ready for CDN deployment.

## 📁 Contents

- `client-snippet/index.js` - Main tracking script
- `heatmap-overlay/overlay.js` - Heatmap overlay script
- `index.html` - CDN root page with usage instructions

## 🚀 CDN Deployment Options

### Option 1: Netlify (Free)
1. Push this folder to GitHub
2. Connect to Netlify
3. Deploy from `cdn-static` folder
4. Get URL like: `https://your-app.netlify.app`

### Option 2: Vercel (Free)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Get URL like: `https://your-app.vercel.app`

### Option 3: GitHub Pages (Free)
1. Push to GitHub
2. Enable Pages from Settings
3. Get URL like: `https://username.github.io/intent-map`

### Option 4: AWS CloudFront + S3
1. Upload to S3 bucket
2. Create CloudFront distribution
3. Get URL like: `https://d1234567890.cloudfront.net`

## 📝 Usage After CDN Deployment

Once deployed, use in your websites like this:

```html
<!-- Replace YOUR_CDN_URL with your actual CDN URL -->
<script>
window.IntentMapConfig = {
    apiEndpoint: 'https://your-api-server.com/api',
    trackingEnabled: true,
    trackClicks: true,
    trackScrolls: true,
    debug: false
};
</script>
<script src="https://YOUR_CDN_URL/client-snippet/index.js"></script>
```

## 🔧 Configuration

Make sure to:
1. Deploy your API server separately (Heroku, Railway, etc.)
2. Update CORS settings to allow your website domains
3. Set correct `apiEndpoint` in your tracking configuration

## 📊 Heatmap Overlay

For heatmap overlay bookmarklet:

```javascript
javascript:(function(){
    var script = document.createElement('script');
    script.src = 'https://YOUR_CDN_URL/heatmap-overlay/overlay.js';
    script.setAttribute('data-auto-init', 'true');
    document.head.appendChild(script);
})();
``` 