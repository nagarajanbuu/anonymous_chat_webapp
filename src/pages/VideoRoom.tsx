
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useVideo } from '@/context/VideoContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import VideoPlayer from '@/components/VideoPlayer';
import VideoControls from '@/components/VideoControls';
import RoomLink from '@/components/RoomLink';
import { Button } from '@/components/ui/button';

const VideoRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { isVideoCallActive, localStream, remoteStream, joinVideoCall, currentRoomId } = useVideo();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const setupCall = async () => {
      if (!roomId) {
        toast.error("Invalid room ID");
        navigate('/video');
        return;
      }

      try {
        setIsLoading(true);
        await joinVideoCall(roomId);
      } catch (error) {
        console.error('Failed to join video call:', error);
        toast.error("Failed to join video call", {
          description: "Please check camera and microphone permissions"
        });
        navigate('/video');
      } finally {
        setIsLoading(false);
      }
    };

    if (!isVideoCallActive) {
      setupCall();
    } else {
      setIsLoading(false);
    }
  }, [roomId, isVideoCallActive, joinVideoCall, navigate]);

  const handleBack = () => {
    navigate('/video');
  };
  
  const handleShareLink = () => {
    setIsLinkModalOpen(true);
    toast.info("Share this link to invite others to your call");
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-whisper-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-whisper-500/20 rounded-full flex items-center justify-center mb-4">
            <div className="h-6 w-6 bg-whisper-500/50 rounded-full"></div>
          </div>
          <div className="h-5 w-32 bg-whisper-500/20 rounded"></div>
          <div className="mt-2 h-4 w-48 bg-whisper-500/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-whisper-900">
      <div className="bg-whisper-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack} className="text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-medium">Secure Video Call</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1.5 bg-whisper-800/50 text-white border-whisper-700"
            onClick={handleShareLink}
          >
            <Share2 className="h-4 w-4" />
            Share Link
          </Button>

          <div className="bg-green-500/20 px-2 py-0.5 rounded-full text-green-400 flex items-center text-xs">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
            <span>TLS Encrypted</span>
          </div>
        </div>
      </div>

      {isLinkModalOpen && (
        <div className="px-4 pt-4">
          <RoomLink roomId={currentRoomId} />
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto block text-xs text-muted-foreground mt-1"
            onClick={() => setIsLinkModalOpen(false)}
          >
            Dismiss
          </Button>
        </div>
      )}

      <div className="flex-1 relative p-4 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {/* Local video */}
          <div className="relative h-full min-h-[300px] rounded-lg overflow-hidden">
            <VideoPlayer 
              stream={localStream} 
              muted 
              isLocal 
              username={user?.username} 
              className="w-full h-full"
            />
          </div>

          {/* Remote video */}
          <div className="relative h-full min-h-[300px] rounded-lg overflow-hidden">
            <VideoPlayer 
              stream={remoteStream} 
              username="Remote User" 
              className="w-full h-full"
            />
          </div>
        </div>
        
        <VideoControls onInviteClick={handleShareLink} />
        
        <div className="text-center text-xs text-whisper-300 mt-2">
          <p className="flex items-center justify-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
            End-to-end encrypted video call with TLS. Your IP address and personal data are protected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoRoom;
