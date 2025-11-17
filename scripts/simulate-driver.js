#!/usr/bin/env node
/**
 * Driver GPS Simulator for Testing Live Tracking
 * 
 * Simulates a delivery driver's GPS position updates via Socket.IO
 * 
 * Usage:
 *   node scripts/simulate-driver.js <orderId> <riderEmail> <password>
 * 
 * Example:
 *   node scripts/simulate-driver.js 123 rider@kiyumart.com rider123
 */

import { io } from 'socket.io-client';
import fetch from 'node-fetch';

const API_URL = process.env.API_URL || 'http://localhost:5000';

// Route simulation: Lagos delivery route (Ikeja to Victoria Island)
const ROUTE_COORDINATES = [
  { lat: 6.6018, lng: 3.3515 }, // Start: Ikeja
  { lat: 6.5964, lng: 3.3667 },
  { lat: 6.5885, lng: 3.3789 },
  { lat: 6.5789, lng: 3.3901 },
  { lat: 6.5665, lng: 3.4012 },
  { lat: 6.5501, lng: 3.4134 },
  { lat: 6.5345, lng: 3.4256 },
  { lat: 6.5234, lng: 3.4389 },
  { lat: 6.5123, lng: 3.4512 },
  { lat: 6.5012, lng: 3.4645 },
  { lat: 6.4901, lng: 3.4778 },
  { lat: 6.4789, lng: 3.4901 },
  { lat: 6.4678, lng: 3.5034 },
  { lat: 6.4567, lng: 3.5167 },
  { lat: 6.4456, lng: 3.5289 },
  { lat: 6.4345, lng: 3.5412 },
  { lat: 6.4281, lng: 3.4106 }  // End: Victoria Island
];

async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.token;
}

async function simulateDriverRoute(orderId, token) {
  console.log(`🚗 Starting driver simulation for order #${orderId}...`);
  
  const socket = io(API_URL, {
    auth: { token },
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log('✅ Connected to Socket.IO server');
    console.log(`🔑 Socket ID: ${socket.id}`);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error.message);
    process.exit(1);
  });

  socket.on('disconnect', () => {
    console.log('⚠️ Disconnected from server');
  });

  // Wait for connection
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('\n📍 Starting GPS simulation...\n');

  for (let i = 0; i < ROUTE_COORDINATES.length; i++) {
    const position = ROUTE_COORDINATES[i];
    const progress = Math.round((i / (ROUTE_COORDINATES.length - 1)) * 100);
    
    console.log(`📍 Point ${i + 1}/${ROUTE_COORDINATES.length} | Progress: ${progress}% | Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}`);

    socket.emit('rider_location_update', {
      orderId,
      latitude: position.lat,
      longitude: position.lng,
      timestamp: new Date().toISOString()
    });

    // Simulate movement delay (5 seconds between updates)
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log('\n✅ Delivery route simulation complete!');
  console.log('🏁 Driver has reached destination.\n');

  socket.close();
  process.exit(0);
}

// Main execution
const [orderId, email, password] = process.argv.slice(2);

if (!orderId || !email || !password) {
  console.error('Usage: node scripts/simulate-driver.js <orderId> <riderEmail> <password>');
  console.error('Example: node scripts/simulate-driver.js 123 rider@kiyumart.com rider123');
  process.exit(1);
}

login(email, password)
  .then(token => simulateDriverRoute(orderId, token))
  .catch(error => {
    console.error('❌ Simulation failed:', error.message);
    process.exit(1);
  });
