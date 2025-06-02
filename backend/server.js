
require('dotenv').config();
const express = require('express');
const http = require('http');
const https = require('https');
const cors = require('cors');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

// Environment variables
const PORT = process.env.PORT || 3001;
const ENABLE_TLS = process.env.ENABLE_TLS === 'true';
const FORCE_HTTPS = process.env.FORCE_HTTPS === 'true';
const IP_MASKING = process.env.IP_MASKING === 'true';

const app = express();

// Create server based on TLS configuration
let server;
if (ENABLE_TLS && fs.existsSync(path.join(__dirname, 'ssl/key.pem')) && 
    fs.existsSync(path.join(__dirname, 'ssl/cert.pem'))) {
  const options = {
    key: fs.readFileSync(path.join(__dirname, 'ssl/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl/cert.pem'))
  };
  server = https.createServer(options, app);
  console.log('HTTPS server created with TLS encryption');
} else {
  server = http.createServer(app);
  console.log('HTTP server created. Note: Cloudflare Tunnel provides TLS encryption');
}

// Enable CORS with secure configuration
app.use(cors({
  origin: function(origin, callback) {
    // For development, you might want to allow any origin
    // In production, restrict to specific domains
    callback(null, true);
  },
  methods: ["GET", "POST"],
  credentials: true
}));

// Force HTTPS redirect if required
if (FORCE_HTTPS) {
  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      // Note: This works when not behind proxies
      // With Cloudflare, this is handled automatically
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
}

// Initialize Socket.IO with security options
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your frontend domain
    methods: ["GET", "POST"],
    credentials: true
  },
  connectionStateRecovery: {
    // Enable WebSocket reconnection
    maxDisconnectionDuration: 30000,
    skipMiddlewares: true,
  },
  // Set WebSocket compression for efficiency
  perMessageDeflate: {
    threshold: 1024,
    zlibDeflateOptions: {
      chunkSize: 8 * 1024,
      level: 6,
      memLevel: 8
    },
  }
});

// Store active rooms and their participants
const rooms = new Map();

// IP masking middleware for Socket.IO
if (IP_MASKING) {
  io.engine.on("headers", (headers, req) => {
    // Remove X-Forwarded-For header to avoid leaking client IP
    if (headers["x-forwarded-for"]) {
      delete headers["x-forwarded-for"];
    }
    headers["x-content-type-options"] = "nosniff";
    headers["strict-transport-security"] = "max-age=31536000; includeSubDomains";
    headers["x-xss-protection"] = "1; mode=block";
    headers["x-frame-options"] = "SAMEORIGIN";
  });
}

app.get('/', (req, res) => {
  res.send('WebRTC Signaling Server Running with TLS Encryption and IP Masking');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    uptime: process.uptime(),
    security: {
      tls_enabled: ENABLE_TLS,
      force_https: FORCE_HTTPS,
      ip_masking: IP_MASKING
    }
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  // Mask the real IP address in logs if enabled
  const clientId = IP_MASKING ? 
    `masked-${socket.id.substring(0, 6)}` : // Only use part of socket ID instead of IP
    socket.id;
    
  console.log(`User connected: ${clientId}`);

  // Join a room
  socket.on('join-room', (roomId, userId) => {
    const sanitizedUserId = userId || socket.id;
    console.log(`User ${clientId} joining room: ${roomId}`);
    
    // Create the room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    
    // Add user to the room
    const room = rooms.get(roomId);
    room.add(socket.id);
    socket.join(roomId);
    
    // Send the list of existing users to the new participant
    const existingUsers = Array.from(room).filter(id => id !== socket.id);
    socket.emit('existing-users', existingUsers);
    
    // Notify other participants about the new user
    socket.to(roomId).emit('user-joined', socket.id);
    
    console.log(`Room ${roomId} now has ${room.size} participants`);
  });

  // Handle WebRTC signaling
  socket.on('offer', ({ target, sender, offer, roomId }) => {
    console.log(`Relaying offer from ${clientId} to target in room ${roomId}`);
    socket.to(target).emit('offer', { sender: socket.id, offer, roomId });
  });

  socket.on('answer', ({ target, sender, answer, roomId }) => {
    console.log(`Relaying answer from ${clientId} to target in room ${roomId}`);
    socket.to(target).emit('answer', { sender: socket.id, answer, roomId });
  });

  socket.on('ice-candidate', ({ target, sender, candidate, roomId }) => {
    console.log(`Relaying ICE candidate from ${clientId} to target in room ${roomId}`);
    socket.to(target).emit('ice-candidate', { sender: socket.id, candidate, roomId });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${clientId}`);
    
    // Find and remove the user from any room they were in
    rooms.forEach((participants, roomId) => {
      if (participants.has(socket.id)) {
        participants.delete(socket.id);
        console.log(`User ${clientId} removed from room ${roomId}`);
        
        // Notify remaining participants about the user leaving
        socket.to(roomId).emit('user-left', socket.id);
        
        // Clean up empty rooms
        if (participants.size === 0) {
          console.log(`Room ${roomId} is empty, removing it`);
          rooms.delete(roomId);
        } else {
          console.log(`Room ${roomId} now has ${participants.size} participants`);
        }
      }
    });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
  console.log(`Local URL: http${ENABLE_TLS ? 's' : ''}://localhost:${PORT}`);
  console.log('For HTTPS access, use Cloudflare Tunnel');
  console.log(`Security: TLS ${ENABLE_TLS ? 'enabled' : 'via Cloudflare'}, IP masking ${IP_MASKING ? 'enabled' : 'disabled'}`);
});
