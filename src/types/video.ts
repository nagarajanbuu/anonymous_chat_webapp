import { Socket } from 'socket.io-client';
import { RemoteUser } from '@/utils/webrtc';

export interface VideoContextType {
  isVideoCallActive: boolean;
  localStream: MediaStream | null;
  remoteStreams: RemoteUser[];
  currentRoomId: string | null;
  isAudioMuted: boolean;
  isVideoEnabled: boolean;
  joinVideoCall: (roomId?: string) => Promise<string>;
  leaveVideoCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
}

export interface VideoProviderProps {
  children: React.ReactNode;
}

export interface SignalingState {
  socket: Socket | null;
  peerConnections: Map<string, RTCPeerConnection>;
}