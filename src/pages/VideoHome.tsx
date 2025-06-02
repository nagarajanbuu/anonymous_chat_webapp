
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, UserPlus } from 'lucide-react';
import { useVideo } from '@/context/VideoContext';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const VideoHome = () => {
  const [roomId, setRoomId] = useState('');
  const { joinVideoCall } = useVideo();
  const { allowVideoCalls } = useSettings();
  const navigate = useNavigate();

  const handleStartNewCall = async () => {
    if (!allowVideoCalls) {
      toast.error("Video calls are disabled in settings");
      return;
    }

    try {
      const newRoomId = await joinVideoCall();
      navigate(`/video/room/${newRoomId}`);
    } catch (error) {
      console.error('Failed to start video call:', error);
      toast.error("Failed to start video call", {
        description: "Please check camera and microphone permissions"
      });
    }
  };

  const handleJoinCall = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!allowVideoCalls) {
      toast.error("Video calls are disabled in settings");
      return;
    }

    if (!roomId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }

    try {
      navigate(`/video/room/${roomId}`);
    } catch (error) {
      console.error('Failed to join video call:', error);
      toast.error("Failed to join video call");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-whisper-900 p-4">
      <div className="max-w-md w-full mx-auto bg-card rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="h-16 w-16 bg-whisper-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="h-8 w-8 text-whisper-500" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Secure Video Calls</h1>
          <p className="text-muted-foreground">End-to-end encrypted, anonymous video chat</p>
        </div>

        <div className="space-y-6">
          <Button
            onClick={handleStartNewCall}
            className="w-full bg-whisper-500 hover:bg-whisper-600 py-6 text-white"
            disabled={!allowVideoCalls}
          >
            <Video className="mr-2 h-5 w-5" />
            Start New Video Call
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or Join Existing</span>
            </div>
          </div>

          <form onSubmit={handleJoinCall} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter room ID (e.g., ww-12345678)"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="bg-accent/40 border-accent"
                disabled={!allowVideoCalls}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/80 text-white"
              disabled={!roomId.trim() || !allowVideoCalls}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Join Video Call
            </Button>
          </form>
        </div>
      </div>

      {!allowVideoCalls && (
        <div className="mt-4 bg-danger/10 text-danger max-w-md w-full mx-auto p-3 rounded-lg text-center text-sm">
          Video calls are disabled in your settings. Enable them in Settings to continue.
        </div>
      )}

      <div className="max-w-md w-full mx-auto mt-6 text-center text-xs text-muted-foreground">
        <p>All video calls are peer-to-peer and encrypted.</p>
        <p>We do not store any call data or metadata.</p>
      </div>
    </div>
  );
};

export default VideoHome;
