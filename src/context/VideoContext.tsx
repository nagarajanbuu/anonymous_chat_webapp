import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

// Import the webRTC utility functions instead of using simple-peer directly
import { 
  createPeerConnection,
  addTracksToConnection,
  createAndSendOffer,
  receiveAndSetRemoteOffer,
  receiveAndSetRemoteAnswer,
  handleICECandidate,
  addRemoteIceCandidate,
  generateRoomId
} from '@/utils/webrtc';

// Define the signaling server URL - use env variable if available or default to secure connection
const SIGNALING_SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL || 'https://packing-judgment-sea-ko.trycloudflare.com';

interface VideoContextType {
  isVideoCallActive: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  currentRoomId: string | null;
  isAudioMuted: boolean;
  isVideoEnabled: boolean;
  joinVideoCall: (roomId?: string) => Promise<string>;
  leaveVideoCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if getUserMedia is supported
  const isGetUserMediaSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  useEffect(() => {
    // Only connect to socket if we're in a browser environment
    if (typeof window !== 'undefined') {
      try {
        socketRef.current = io(SIGNALING_SERVER_URL, {
          transports: ['websocket'],
          secure: true,
          rejectUnauthorized: false, // Allow self-signed certificates in dev
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        if (socketRef.current) {
          socketRef.current.on('connect', () => {
            console.log('Connected to signaling server');
          });

          socketRef.current.on('connect_error', (error) => {
            console.error('Connection error:', error);
            toast.error('Failed to connect to signaling server');
          });

          socketRef.current.on('error', (error) => {
            console.error('Socket error:', error);
          });
        }
      } catch (error) {
        console.error('Socket connection error:', error);
      }

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, []);

  const initializePeerConnection = (stream: MediaStream, initiator: boolean) => {
    try {
      // Define ICE servers
      const iceServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
      ];

      // Create peer connection
      const peerConnection = createPeerConnection(iceServers);
      peerConnectionRef.current = peerConnection;

      // Add tracks to the peer connection
      addTracksToConnection(peerConnection, stream);

      // Set up event handlers for the peer connection
      peerConnection.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
        
        if (peerConnection.iceConnectionState === 'failed' || 
            peerConnection.iceConnectionState === 'disconnected') {
          toast.error('Connection failed or disconnected');
        } else if (peerConnection.iceConnectionState === 'connected') {
          toast.success('Connected with peer');
        }
      };

      // Handle ICE candidates
      handleICECandidate(peerConnection, (candidate) => {
        if (socketRef.current && candidate) {
          socketRef.current.emit('ice-candidate', { 
            candidate, 
            roomId: currentRoomId 
          });
        }
      });

      // Set up socket event handlers for signaling
      if (socketRef.current) {
        // Handle incoming ICE candidates
        socketRef.current.on('ice-candidate', ({ candidate }) => {
          if (peerConnectionRef.current && candidate) {
            addRemoteIceCandidate(peerConnectionRef.current, candidate);
          }
        });

        // If initiator, create and send an offer
        if (initiator && peerConnectionRef.current) {
          createAndSendOffer(peerConnectionRef.current)
            .then(offer => {
              if (socketRef.current) {
                socketRef.current.emit('offer', { 
                  offer, 
                  roomId: currentRoomId 
                });
              }
            })
            .catch(err => {
              console.error('Error creating offer:', err);
              toast.error('Failed to create connection offer');
            });
        }

        // Handle incoming offers
        socketRef.current.on('offer', async ({ offer }) => {
          if (peerConnectionRef.current) {
            try {
              const answer = await receiveAndSetRemoteOffer(
                peerConnectionRef.current, 
                offer
              );
              
              if (socketRef.current) {
                socketRef.current.emit('answer', { 
                  answer, 
                  roomId: currentRoomId 
                });
              }
            } catch (error) {
              console.error('Error handling offer:', error);
              toast.error('Failed to establish connection');
            }
          }
        });

        // Handle incoming answers
        socketRef.current.on('answer', async ({ answer }) => {
          if (peerConnectionRef.current) {
            try {
              await receiveAndSetRemoteAnswer(
                peerConnectionRef.current, 
                answer
              );
            } catch (error) {
              console.error('Error handling answer:', error);
              toast.error('Failed to establish connection');
            }
          }
        });
      }
    } catch (error) {
      console.error('Error initializing peer connection:', error);
      toast.error('Failed to establish connection');
    }
  };

  const joinVideoCall = async (roomId?: string) => {
    try {
      const newRoomId = roomId || generateRoomId();
      
      // Check if getUserMedia is supported
      if (!isGetUserMediaSupported()) {
        toast.error("Media devices not supported", {
          description: "Your browser doesn't support camera/microphone access"
        });
        throw new Error("getUserMedia not supported");
      }

      // Request permissions with error handling
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
      
      setLocalStream(stream);
      setIsVideoCallActive(true);
      setCurrentRoomId(newRoomId);

      if (socketRef.current) {
        socketRef.current.emit('join-room', newRoomId);
      }

      initializePeerConnection(stream, !roomId);

      toast.success("Video call started", {
        description: `Room ID: ${newRoomId}`,
      });
      
      return newRoomId;
    } catch (error: any) {
      console.error('Error accessing media devices:', error);
      let errorMessage = "Could not access camera or microphone";
      
      // Provide more specific error messages
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = "Camera or microphone permission denied";
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = "No camera or microphone found";
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = "Camera or microphone is already in use";
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = "Camera constraints not satisfied";
      }
      
      toast.error("Failed to start video call", {
        description: errorMessage
      });
      throw error;
    }
  };
  
  const leaveVideoCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    if (socketRef.current) {
      socketRef.current.emit('leave-room', currentRoomId);
    }
    
    setLocalStream(null);
    setRemoteStream(null);
    setIsVideoCallActive(false);
    setCurrentRoomId(null);
    
    toast.info("Left video call");
    
    navigate('/chat');
  };
  
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
    }
  };
  
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };
  
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, []);
  
  return (
    <VideoContext.Provider
      value={{
        isVideoCallActive,
        localStream,
        remoteStream,
        currentRoomId,
        isAudioMuted,
        isVideoEnabled,
        joinVideoCall,
        leaveVideoCall,
        toggleMute,
        toggleVideo
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
