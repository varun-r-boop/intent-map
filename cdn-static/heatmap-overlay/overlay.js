// Heatmap Overlay Script
// This script overlays heatmap data on web pages to visualize user interactions

(function() {
    'use strict';
    
    class HeatmapOverlay {
        constructor(options = {}) {
            this.options = {
                apiEndpoint: options.apiEndpoint || 'https://your-api-domain.com/api',
                intensity: options.intensity || 0.7,
                radius: options.radius || 50,
                colors: options.colors || ['blue', 'cyan', 'lime', 'yellow', 'red'],
                ...options
            };
            
            this.canvas = null;
            this.ctx = null;
            this.heatmapData = [];
            this.isVisible = false;
            
            this.init();
        }
        
        init() {
            this.createCanvas();
            this.createControls();
            this.loadHeatmapData();
        }
        
        createCanvas() {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'heatmap-overlay';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                z-index: 9999;
                display: none;
            `;
            
            this.ctx = this.canvas.getContext('2d');
            document.body.appendChild(this.canvas);
            
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
        }
        
        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        createControls() {
            const controls = document.createElement('div');
            controls.id = 'heatmap-controls';
            controls.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px;
                border-radius: 8px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                z-index: 10000;
                display: none;
            `;
            
            controls.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <strong>Heatmap Controls</strong>
                </div>
                <div>
                    <label>
                        <input type="checkbox" id="toggle-heatmap"> Show Heatmap
                    </label>
                </div>
                <div style="margin-top: 10px;">
                    <label>
                        Intensity: <input type="range" id="intensity-slider" min="0.1" max="1" step="0.1" value="${this.options.intensity}">
                    </label>
                </div>
                <div style="margin-top: 10px;">
                    <button id="refresh-heatmap">Refresh Data</button>
                </div>
            `;
            
            document.body.appendChild(controls);
            
            // Event listeners
            document.getElementById('toggle-heatmap').addEventListener('change', (e) => {
                this.toggleHeatmap(e.target.checked);
            });
            
            document.getElementById('intensity-slider').addEventListener('input', (e) => {
                this.options.intensity = parseFloat(e.target.value);
                if (this.isVisible) this.renderHeatmap();
            });
            
            document.getElementById('refresh-heatmap').addEventListener('click', () => {
                this.loadHeatmapData();
            });
            
            // Keyboard shortcut (Ctrl+H)
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'h') {
                    e.preventDefault();
                    controls.style.display = controls.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
        
        async loadHeatmapData() {
            try {
                const response = await fetch(`${this.options.apiEndpoint}/heatmap?url=${encodeURIComponent(window.location.href)}`);
                const data = await response.json();
                this.heatmapData = data.interactions || [];
                
                if (this.isVisible) {
                    this.renderHeatmap();
                }
            } catch (error) {
                console.error('Error loading heatmap data:', error);
            }
        }
        
        toggleHeatmap(show) {
            this.isVisible = show;
            this.canvas.style.display = show ? 'block' : 'none';
            
            if (show) {
                this.renderHeatmap();
            }
        }
        
        renderHeatmap() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            if (this.heatmapData.length === 0) {
                return;
            }
            
            // Create gradient for heatmap points
            this.heatmapData.forEach(point => {
                const gradient = this.ctx.createRadialGradient(
                    point.x, point.y, 0,
                    point.x, point.y, this.options.radius
                );
                
                const intensity = Math.min(point.intensity || 1, 1) * this.options.intensity;
                gradient.addColorStop(0, `rgba(255, 0, 0, ${intensity})`);
                gradient.addColorStop(0.5, `rgba(255, 255, 0, ${intensity * 0.5})`);
                gradient.addColorStop(1, `rgba(0, 0, 255, 0)`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, this.options.radius, 0, Math.PI * 2);
                this.ctx.fill();
            });
        }
        
        destroy() {
            if (this.canvas) {
                this.canvas.remove();
            }
            
            const controls = document.getElementById('heatmap-controls');
            if (controls) {
                controls.remove();
            }
        }
    }
    
    // Initialize heatmap overlay
    window.HeatmapOverlay = HeatmapOverlay;
    
    // Auto-initialize if script is loaded with data-auto-init attribute
    const script = document.currentScript;
    if (script && script.hasAttribute('data-auto-init')) {
        new HeatmapOverlay();
    }
    
})(); 