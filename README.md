# Intent Map

A comprehensive intent mapping and user behavior analytics platform that tracks user interactions, generates heatmaps, and provides detailed analytics for websites.

## 🚀 Features

- **Real-time Tracking**: Track clicks, scrolls, mouse movements, and page views
- **Heatmap Visualization**: Generate interactive heatmaps for any webpage
- **Analytics Dashboard**: Beautiful dashboard with comprehensive analytics
- **Session Management**: Track user sessions with automatic session handling
- **API-First Design**: RESTful API for integration with any frontend
- **Bookmarklet Support**: Overlay heatmaps on any website with a simple bookmarklet
- **Privacy-Focused**: No PII collection by default

## 📁 Project Structure

```
├── client-snippet/         # Embeddable tracking script
│   └── index.js            # Main tracking script
├── server/                 # API server (Node.js + Express + MongoDB)
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── dashboard/             # React dashboard
│   ├── components/        # React components
│   ├── pages/            # Dashboard pages
│   └── App.js            # Main React app
├── heatmap-overlay/       # Heatmap overlay script
│   └── overlay.js         # Overlay visualization script
└── README.md
```

## 🛠️ Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Modern web browser

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start MongoDB (if local)
# mongod

# Start the API server
npm run dev
```

The server will start on `http://localhost:3000`

### 2. Dashboard Setup

```bash
# Navigate to dashboard directory
cd dashboard

# Install dependencies
npm install

# Start the dashboard
npm start
```

The dashboard will start on `http://localhost:3001`

### 3. Integrate Tracking

Add this script to your website's `<head>` section:

```html
<!-- Intent Map Tracking Script -->
<script>
window.IntentMapConfig = {
    apiEndpoint: 'http://localhost:3000/api',
    trackingEnabled: true,
    trackClicks: true,
    trackScrolls: true,
    trackMousemove: false,
    debug: false
};
</script>
<script src="http://localhost:3000/client-snippet/index.js"></script>
```

## 📊 API Endpoints

### Tracking
- `POST /api/track` - Store single tracking event
- `POST /api/track/bulk` - Store multiple tracking events
- `GET /api/track/events` - Get events for a page
- `GET /api/track/analytics` - Get page analytics
- `GET /api/track/pages` - Get all pages with analytics

### Analytics
- `GET /api/analytics/summary` - Get overall analytics summary
- `GET /api/analytics/timeline` - Get events timeline
- `GET /api/analytics/top-pages` - Get top performing pages

### Heatmaps
- `GET /api/heatmap` - Get heatmap data for a page
- `GET /api/heatmap/multi` - Get multi-type heatmap data
- `GET /api/heatmap/scroll` - Get scroll heatmap data
- `GET /api/heatmap/zones` - Get click density zones

## 🔧 Configuration

### Client Configuration

```javascript
window.IntentMapConfig = {
    apiEndpoint: 'http://localhost:3000/api',  // API endpoint
    trackingEnabled: true,                      // Enable/disable tracking
    trackClicks: true,                         // Track click events
    trackScrolls: true,                        // Track scroll events
    trackMousemove: false,                     // Track mouse movement
    batchSize: 10,                            // Events per batch
    flushInterval: 5000,                      // Flush interval (ms)
    debug: false                              // Debug logging
};
```

### Server Environment

Create a `.env` file in the server directory:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/intent-map
ALLOWED_ORIGINS=http://localhost:3001
```

## 🎯 Usage Examples

### Basic Tracking

```javascript
// The script automatically tracks events, but you can also manually track
IntentMap.flush(); // Force send queued events
IntentMap.stop();  // Stop tracking
IntentMap.init();  // Resume tracking
```

### Heatmap Overlay

Create a bookmarklet with this code:

```javascript
javascript:(function(){
    var script = document.createElement('script');
    script.src = 'http://localhost:3000/heatmap-overlay/overlay.js';
    script.setAttribute('data-auto-init', 'true');
    document.head.appendChild(script);
})();
```

### API Usage

```javascript
// Get analytics summary
const response = await fetch('/api/analytics/summary?domain=example.com&dateRange=7');
const data = await response.json();

// Get heatmap data
const heatmapResponse = await fetch('/api/heatmap?domain=example.com&pathname=/&eventType=click');
const heatmapData = await heatmapResponse.json();
```

## 🏗️ Development

### Running in Development

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start API server
cd server && npm run dev

# Terminal 3: Start dashboard
cd dashboard && npm start
```

### Building for Production

```bash
# Build dashboard
cd dashboard && npm run build

# Server runs with NODE_ENV=production
cd server && NODE_ENV=production npm start
```

## 🔒 Privacy & Security

- **No PII Collection**: Only collects interaction data, no personal information
- **Session-based**: Uses client-generated session IDs
- **CORS Protection**: Configurable CORS origins
- **Rate Limiting**: Built-in rate limiting on all endpoints
- **Data Retention**: Configurable data retention policies

## 📈 Data Collected

- Mouse click coordinates and target elements
- Scroll positions and scroll depth percentages
- Page URLs and pathnames  
- Session IDs (client-generated UUIDs)
- Timestamps and viewport dimensions
- User agent information
- Referrer information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `mongod`
   - Check connection string in environment variables

2. **CORS Errors**
   - Add your domain to `ALLOWED_ORIGINS` environment variable
   - Ensure proper CORS configuration in server

3. **No Data in Dashboard**
   - Verify tracking script is loaded correctly
   - Check browser network tab for API calls
   - Ensure correct API endpoint in configuration

4. **Heatmap Not Showing**
   - Verify domain and pathname are correct
   - Check if there's tracking data for the specified criteria
   - Ensure heatmap overlay script loads correctly

### Debug Mode

Enable debug mode in the client configuration:

```javascript
window.IntentMapConfig = {
    debug: true
};
```

This will log all tracking events to the browser console.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Review the API documentation
