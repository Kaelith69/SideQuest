// js/map.js
// We assume maplibre-gl is loaded globally via script tag in index.html for simplicity
// or available as 'maplibregl'
// Ideally we would import it if we were using a bundler but here we rely on the global.

import { showToast } from './ui.js';

let map;
let userMarker;
const defaultLocation = { lng: -0.1276, lat: 51.5074 }; // London (fallback)

export let currentUserLocation = null;
let locationListeners = [];
let taskMarkers = []; // Keep track of markers to clear them

// Add this function to allow tasks.js to listen to location updates
export function onUserLocationUpdate(callback) {
    locationListeners.push(callback);
    // If we already have a location, fire immediately
    if (currentUserLocation) {
        callback(currentUserLocation);
    }
}

function notifyLocationUpdates(loc) {
    currentUserLocation = loc;
    locationListeners.forEach(cb => cb(loc));
}

export function initMap(user) {
    if (map) return; // Already initialized

    // Basic style - you can use OpenStreetMap raster tiles for free
    const style = {
        "version": 8,
        "sources": {
            "osm": {
                "type": "raster",
                "tiles": ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
                "tileSize": 256,
                "attribution": "&copy; OpenStreetMap Contributors",
                "maxzoom": 19
            }
        },
        "layers": [
            {
                "id": "osm",
                "type": "raster",
                "source": "osm"
            }
        ]
    };

    map = new maplibregl.Map({
        container: 'map',
        style: style,
        center: [defaultLocation.lng, defaultLocation.lat],
        zoom: 13,
        attributionControl: false
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    // Geolocation
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const loc = { lat: latitude, lng: longitude };

            map.flyTo({
                center: [longitude, latitude],
                zoom: 15
            });
            addUserMarker(longitude, latitude);

            // Notify listeners
            notifyLocationUpdates(loc);

        }, error => {
            console.error("Error getting location", error);
            // Fallback: Notify with default location so tasks appear
            notifyLocationUpdates({ lat: defaultLocation.lat, lng: defaultLocation.lng });
        }, {
            timeout: 10000,
            maximumAge: 60000
        });

        // Watch for updates
        navigator.geolocation.watchPosition(position => {
            const { latitude, longitude } = position.coords;
            updateUserMarker(longitude, latitude);
            notifyLocationUpdates({ lat: latitude, lng: longitude });
        }, error => {
            // Watch error; usually ignorable if we handled initial
        }, {
            timeout: 10000,
            maximumAge: 60000
        });
    } else {
        // No Geolocation support
        notifyLocationUpdates({ lat: defaultLocation.lat, lng: defaultLocation.lng });
    }

    map.on('load', () => {
        console.log("Map loaded");
    });
}

function addUserMarker(lng, lat) {
    const el = document.createElement('div');
    el.className = 'user-marker';

    userMarker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);
}

function updateUserMarker(lng, lat) {
    if (userMarker) {
        userMarker.setLngLat([lng, lat]);
    } else {
        addUserMarker(lng, lat);
    }
}

// Support function to clear markers
export function clearMarkers() {
    taskMarkers.forEach(m => m.remove());
    taskMarkers = [];
}

export function addMarker(task, onClick) {
    if (!map) return;

    const el = document.createElement('div');
    el.className = 'custom-marker';

    // Icon based on category
    let icon = '📦'; // Delivery
    if (task.category === 'Help') icon = '🤝';
    if (task.category === 'Social') icon = '🎉';
    if (task.category === 'Other') icon = '📌';

    el.textContent = icon;

    const marker = new maplibregl.Marker({ element: el })
        .setLngLat([task.location.lng, task.location.lat])
        .addTo(map);

    el.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent map click
        onClick(task);
    });

    taskMarkers.push(marker);
    return marker;
}

export function getMapCenter() {
    return map ? map.getCenter() : defaultLocation;
}

// Haversine Distance Calculation (km)
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

export function flyToUserLocation() {
    if (map && currentUserLocation) {
        map.flyTo({
            center: [currentUserLocation.lng, currentUserLocation.lat],
            zoom: 15
        });
    } else {
        showToast("User location not available yet.", 'info');
    }
}
