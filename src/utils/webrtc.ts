
// WebRTC utility functions for peer connections

/**
 * Creates a new RTCPeerConnection with the provided ICE servers
 * @param iceServers Array of ICE server configurations
 * @returns A new RTCPeerConnection instance
 */
export const createPeerConnection = (iceServers: RTCIceServer[]) => {
  return new RTCPeerConnection({
    iceServers,
  });
};

/**
 * Adds media tracks from a stream to a peer connection
 * @param peerConnection The RTCPeerConnection to add tracks to
 * @param stream The MediaStream containing the tracks to add
 */
export const addTracksToConnection = (
  peerConnection: RTCPeerConnection,
  stream: MediaStream
) => {
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });
};

/**
 * Creates an offer and sets it as the local description
 * @param peerConnection The RTCPeerConnection to create the offer from
 * @returns The created offer (RTCSessionDescriptionInit)
 */
export const createAndSendOffer = async (
  peerConnection: RTCPeerConnection
): Promise<RTCSessionDescriptionInit> => {
  const offer = await peerConnection.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  });
  await peerConnection.setLocalDescription(offer);
  return offer;
};

/**
 * Sets a remote offer as the remote description and creates an answer
 * @param peerConnection The RTCPeerConnection to set the offer on
 * @param offerSdp The offer to set as the remote description
 * @returns The created answer (RTCSessionDescriptionInit)
 */
export const receiveAndSetRemoteOffer = async (
  peerConnection: RTCPeerConnection,
  offerSdp: RTCSessionDescriptionInit
): Promise<RTCSessionDescriptionInit> => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offerSdp));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  return answer;
};

/**
 * Sets a remote answer as the remote description
 * @param peerConnection The RTCPeerConnection to set the answer on
 * @param answerSdp The answer to set as the remote description
 */
export const receiveAndSetRemoteAnswer = async (
  peerConnection: RTCPeerConnection,
  answerSdp: RTCSessionDescriptionInit
) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answerSdp));
};

/**
 * Configures the onicecandidate event handler for a peer connection
 * @param peerConnection The RTCPeerConnection to configure
 * @param onIceCandidate Callback function to handle ICE candidates
 */
export const handleICECandidate = async (
  peerConnection: RTCPeerConnection,
  onIceCandidate: (candidate: RTCIceCandidate | null) => void
) => {
  peerConnection.onicecandidate = (event) => {
    onIceCandidate(event.candidate);
  };
};

/**
 * Adds a remote ICE candidate to a peer connection
 * @param peerConnection The RTCPeerConnection to add the candidate to
 * @param candidate The ICE candidate to add
 */
export const addRemoteIceCandidate = async (
  peerConnection: RTCPeerConnection,
  candidate: RTCIceCandidate
) => {
  if (candidate) {
    await peerConnection.addIceCandidate(candidate);
  }
};

/**
 * Generates a random room ID for a video call
 * @returns A string in the format "ww-xxxxxxxx" where x is a random alphanumeric character
 */
export const generateRoomId = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'ww-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Interface for remote user information
 */
export interface RemoteUser {
  id: string;
  username?: string;
  stream: MediaStream | null;
  connection: RTCPeerConnection;
}