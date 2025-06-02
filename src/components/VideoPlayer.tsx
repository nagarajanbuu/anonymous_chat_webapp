
import React, { useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  isLocal?: boolean;
  username?: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  stream,
  muted = false,
  isLocal = false,
  username = 'Anonymous',
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const hasVideoTrack = stream?.getVideoTracks().length && stream?.getVideoTracks()[0].enabled;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg bg-black/80",
      className
    )}>
      {stream ? (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted={muted}
          />
          
          {!hasVideoTrack && (
            <div className="absolute inset-0 flex items-center justify-center bg-accent">
              <div className="bg-whisper-500 p-5 rounded-full">
                <User className="h-10 w-10 text-white" />
              </div>
            </div>
          )}
          
          <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-sm text-white">
            {isLocal ? 'You' : username}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full bg-accent">
          <div className="bg-whisper-500 p-5 rounded-full">
            <User className="h-10 w-10 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
