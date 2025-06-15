// Intent Map Client Tracking Script
// This embeddable script tracks user interactions and sends data to the Intent Map API

(function() {
    'use strict';
    
    // Configuration - can be overridden by setting window.IntentMapConfig before loading this script
    const CONFIG = {
        apiEndpoint: window.IntentMapConfig?.apiEndpoint || 'https://9b55-2405-201-e016-e800-d114-5d21-766-65cb.ngrok-free.app/api',
        trackingEnabled: window.IntentMapConfig?.trackingEnabled !== false,
        batchSize: window.IntentMapConfig?.batchSize || 10,
        flushInterval: window.IntentMapConfig?.flushInterval || 5000,
        trackClicks: window.IntentMapConfig?.trackClicks !== false,
        trackScrolls: window.IntentMapConfig?.trackScrolls !== false,
        trackMousemove: window.IntentMapConfig?.trackMousemove || false,
        throttleMousemove: window.IntentMapConfig?.throttleMousemove || 0.05,
        debug: window.IntentMapConfig?.debug || false
    };
    
    // Global state
    let sessionId = null;
    let eventQueue = [];
    let flushTimer = null;
    let isTracking = false;
    
    // Generate or retrieve session ID
    function getSessionId() {
        if (sessionId) return sessionId;
        
        // Try to get existing session from localStorage
        const stored = localStorage.getItem('intent-map-session');
        if (stored) {
            try {
                const session = JSON.parse(stored);
                // Session expires after 30 minutes of inactivity
                if (Date.now() - session.lastActivity < 30 * 60 * 1000) {
                    sessionId = session.id;
                    return sessionId;
                }
            } catch (error) {
                // Invalid stored session, create new one
            }
        }
        
        // Generate new session ID
        sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Store session
        localStorage.setItem('intent-map-session', JSON.stringify({
            id: sessionId,
            lastActivity: Date.now()
        }));
        
        return sessionId;
    }
    
    // Update session activity
    function updateSessionActivity() {
        if (sessionId) {
            localStorage.setItem('intent-map-session', JSON.stringify({
                id: sessionId,
                lastActivity: Date.now()
            }));
        }
    }
    
    // Calculate scroll depth percentage
    function calculateScrollDepth() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        const windowHeight = window.innerHeight;
        const scrollDepth = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
        return Math.min(scrollDepth, 100);
    }
    
    // Create event data object
    function createEventData(eventType, eventData = {}) {
        updateSessionActivity();
        
        return {
            sessionId: getSessionId(),
            eventType,
            pageUrl: window.location.href,
            pathname: window.location.pathname,
            timestamp: Date.now(),
            referrer: document.referrer || null,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            ...eventData
        };
    }
    
    // Add event to queue
    function queueEvent(eventData) {
        if (!CONFIG.trackingEnabled || !isTracking) return;
        
        eventQueue.push(eventData);
        
        if (CONFIG.debug) {
            console.log('Intent Map: Queued event', eventData);
        }
        
        // Flush immediately if batch size reached
        if (eventQueue.length >= CONFIG.batchSize) {
            flushEvents();
        } else if (!flushTimer) {
            // Set timer to flush events
            flushTimer = setTimeout(flushEvents, CONFIG.flushInterval);
        }
    }
    
    // Send events to API
    function flushEvents() {
        if (eventQueue.length === 0) return;
        
        clearTimeout(flushTimer);
        flushTimer = null;
        
        const events = [...eventQueue];
        eventQueue = [];
        
        if (CONFIG.debug) {
            console.log('Intent Map: Flushing events', events);
        }
        
        // Use bulk endpoint for multiple events, single endpoint for one event
        const endpoint = events.length > 1 ? '/track/bulk' : '/track';
        const payload = events.length > 1 ? { events } : events[0];
        
        fetch(`${CONFIG.apiEndpoint}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            keepalive: true // Ensure request completes even if page unloads
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        }).then(data => {
            if (CONFIG.debug) {
                console.log('Intent Map: Events sent successfully', data);
            }
        }).catch(error => {
            if (CONFIG.debug) {
                console.error('Intent Map: Error sending events', error);
            }
            // Re-queue events on failure (with limit to prevent infinite growth)
            if (eventQueue.length < CONFIG.batchSize * 2) {
                eventQueue.unshift(...events);
            }
        });
    }
    
    // Event handlers
    function handleClick(event) {
        if (!CONFIG.trackClicks) return;
        
        const eventData = createEventData('click', {
            x: event.clientX + window.pageXOffset,
            y: event.clientY + window.pageYOffset,
            target: event.target.tagName.toLowerCase(),
            scrollDepth: calculateScrollDepth(),
            scrollY: window.pageYOffset
        });
        
        queueEvent(eventData);
    }
    
    function handleScroll() {
        if (!CONFIG.trackScrolls) return;
        
        const eventData = createEventData('scroll', {
            scrollY: window.pageYOffset,
            scrollDepth: calculateScrollDepth()
        });
        
        queueEvent(eventData);
    }
    
    let mousemoveThrottle = 0;
    function handleMouseMove(event) {
        if (!CONFIG.trackMousemove) return;
        
        // Throttle mousemove events
        mousemoveThrottle++;
        if (mousemoveThrottle % Math.round(1 / CONFIG.throttleMousemove) !== 0) {
            return;
        }
        
        const eventData = createEventData('mousemove', {
            x: event.clientX + window.pageXOffset,
            y: event.clientY + window.pageYOffset,
            scrollDepth: calculateScrollDepth(),
            scrollY: window.pageYOffset
        });
        
        queueEvent(eventData);
    }
    
    function handleResize() {
        const eventData = createEventData('resize', {
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        });
        
        queueEvent(eventData);
    }
    
    function handleVisibilityChange() {
        const eventData = createEventData(document.hidden ? 'blur' : 'focus');
        queueEvent(eventData);
    }
    
    // Initialize tracking
    function initIntentTracking() {
        if (isTracking) return;
        
        isTracking = true;
        
        if (CONFIG.debug) {
            console.log('Intent Map: Initializing tracking', CONFIG);
        }
        
        // Initialize session
        getSessionId();
        
        // Add event listeners
        if (CONFIG.trackClicks) {
            document.addEventListener('click', handleClick, true);
        }
        
        if (CONFIG.trackScrolls) {
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(handleScroll, 100);
            }, { passive: true });
        }
        
        if (CONFIG.trackMousemove) {
            document.addEventListener('mousemove', handleMouseMove, { passive: true });
        }
        
        window.addEventListener('resize', handleResize, { passive: true });
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Flush events before page unload
        window.addEventListener('beforeunload', flushEvents);
        window.addEventListener('pagehide', flushEvents);
        
        // Track initial page load
        queueEvent(createEventData('pageview'));
        
        if (CONFIG.debug) {
            console.log('Intent Map: Tracking initialized with session:', sessionId);
        }
    }
    
    // Stop tracking
    function stopIntentTracking() {
        if (!isTracking) return;
        
        isTracking = false;
        
        // Remove event listeners
        document.removeEventListener('click', handleClick, true);
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', flushEvents);
        window.removeEventListener('pagehide', flushEvents);
        
        // Flush remaining events
        flushEvents();
        
        if (CONFIG.debug) {
            console.log('Intent Map: Tracking stopped');
        }
    }
    
    // Public API
    window.IntentMap = {
        init: initIntentTracking,
        stop: stopIntentTracking,
        flush: flushEvents,
        getSessionId: getSessionId,
        isTracking: () => isTracking,
        config: CONFIG
    };
    
    // Auto-initialize if not disabled
    if (window.IntentMapConfig?.autoInit !== false) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initIntentTracking);
        } else {
            initIntentTracking();
        }
    }
    
})(); 