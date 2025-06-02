
# WebRTC Signaling Server with TLS & IP Masking

This is a secure signaling server for WebRTC video calls, designed to work with Cloudflare Tunnel to provide HTTPS access with TLS encryption and IP address masking.

## Security Features

- **TLS Encryption**: Supports local TLS certificates and/or Cloudflare Tunnel for secure HTTPS
- **IP Address Masking**: Prevents leaking of user IP addresses in signaling data
- **CORS Protection**: Controls which domains can access the signaling server
- **HTTPS Enforcement**: Option to redirect all traffic to HTTPS
- **Secure Headers**: Implements security headers to prevent common attacks

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [Cloudflare account](https://dash.cloudflare.com/sign-up) (Free tier works)
- [cloudflared CLI](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/)

## Installation

1. Clone this repository:
   ```
   git clone [repository-url]
   cd webrtc-signaling-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the example:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your settings:
   ```
   PORT=3001
   TUNNEL_URL=your-custom-subdomain.example.com
   ENABLE_TLS=true
   FORCE_HTTPS=true
   IP_MASKING=true
   ```

## Setting Up TLS Certificates (Optional)

If you want to use local TLS (in addition to Cloudflare's TLS):

1. Generate self-signed certificates (for development):
   ```
   npm run generate-certs
   ```

   This will create a `ssl` directory with `key.pem` and `cert.pem` files.

2. For production, obtain real certificates from Let's Encrypt or another certificate authority.

## Setting Up Cloudflare Tunnel

1. Install the `cloudflared` CLI tool:
   - Mac: `brew install cloudflared`
   - Windows: Download from [Cloudflare's website](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/)
   - Linux: Follow [these instructions](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/)

2. Log in to Cloudflare:
   ```
   cloudflared tunnel login
   ```

3. Create a tunnel:
   ```
   cloudflared tunnel create webrtc-signaling
   ```

4. Note the tunnel ID shown after creation, and update the `cloudflared-config.yml` file:
   - Replace `your-tunnel-id` with your actual tunnel ID
   - Replace `your-custom-subdomain.example.com` with your desired hostname
   - Make sure the path to your credentials file is correct (it's created in `~/.cloudflared/` by default)

5. Route DNS to your tunnel:
   ```
   cloudflared tunnel route dns webrtc-signaling your-custom-subdomain.example.com
   ```

## Running the Server

1. Start the signaling server:
   ```
   npm start
   ```

2. In a separate terminal, start the Cloudflare Tunnel:
   ```
   cloudflared tunnel --config cloudflared-config.yml run webrtc-signaling
   ```

3. Your server should now be accessible at `https://your-custom-subdomain.example.com` with full TLS encryption and IP address masking.

## Verifying Security Features

1. Check the server status and security settings:
   ```
   curl https://your-custom-subdomain.example.com/api/health
   ```

2. The response should include security status:
   ```json
   {
     "status": "ok",
     "uptime": 123.45,
     "security": {
       "tls_enabled": true,
       "force_https": true,
       "ip_masking": true
     }
   }
   ```

## Integration with Frontend

Update your frontend WebRTC code to connect to your signaling server:

```javascript
const socket = io('https://your-custom-subdomain.example.com', {
  transports: ['websocket'],
  secure: true
});
```

## Security Best Practices

1. **In Production:**
   - Use a real domain and TLS certificate
   - Restrict CORS to only your frontend domain
   - Implement authentication for room access
   - Rotate SSL certificates regularly

2. **For Video Calls:**
   - Use Cloudflare's recommended TURN servers or set up your own
   - Enable encryption on WebRTC connections (this happens by default in modern browsers)
   - Consider implementing room authentication

## Socket.IO Events

### Client to Server:

- `join-room`: Join a specific room
  ```javascript
  socket.emit('join-room', roomId, userId);
  ```

- `offer`: Send a WebRTC offer to another user
  ```javascript
  socket.emit('offer', { target, sender, offer, roomId });
  ```

- `answer`: Send a WebRTC answer to another user
  ```javascript
  socket.emit('answer', { target, sender, answer, roomId });
  ```

- `ice-candidate`: Send ICE candidates to another user
  ```javascript
  socket.emit('ice-candidate', { target, sender, candidate, roomId });
  ```

### Server to Client:

- `existing-users`: List of users already in the room
- `user-joined`: Notification when a new user joins
- `user-left`: Notification when a user leaves
- `offer`: Incoming WebRTC offer
- `answer`: Incoming WebRTC answer
- `ice-candidate`: Incoming ICE candidate

## Troubleshooting

- **Cannot connect to server**: Make sure both the Express server and Cloudflare Tunnel are running
- **WebRTC connection fails**: Check that ICE candidates are being exchanged correctly
- **Cloudflare Tunnel errors**: Verify your tunnel configuration and credentials
- **TLS certificate issues**: Ensure certificates are properly generated and located in the `ssl` directory

## License

This project is licensed under the MIT License - see the LICENSE file for details.
