import React from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  X,
  Plus,
} from 'lucide-react';
import { useVideo } from '@/context/VideoContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoControlsProps {
  onInviteClick?: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({ onInviteClick }) => {
  const {
    isAudioMuted,
    isVideoEnabled,
    toggleMute,
    toggleVideo,
    leaveVideoCall,
  } = useVideo();

  return (
    <div className="flex justify-center items-center gap-4 p-4">
      {/* Mute / Unmute */}
      <Button
        onClick={toggleMute}
        className={cn(
          'rounded-full w-12 h-12 flex items-center justify-center',
          isAudioMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-secondary hover:bg-secondary/80'
        )}
      >
        {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>

      {/* Enable / Disable Video */}
      <Button
        onClick={toggleVideo}
        className={cn(
          'rounded-full w-12 h-12 flex items-center justify-center',
          !isVideoEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-secondary hover:bg-secondary/80'
        )}
      >
        {!isVideoEnabled ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
      </Button>

      {/* Invite Button */}
      {onInviteClick && (
        <Button
          onClick={onInviteClick}
          className="bg-primary hover:bg-primary/80 rounded-full w-12 h-12 flex items-center justify-center"
        >
          <Plus className="h-5 w-5" />
        </Button>
      )}

      {/* Leave Call */}
      <Button
        onClick={leaveVideoCall}
        className="bg-red-600 hover:bg-red-700 rounded-full w-12 h-12 flex items-center justify-center"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default VideoControls;
