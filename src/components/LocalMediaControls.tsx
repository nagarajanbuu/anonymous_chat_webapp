import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocalMediaControlsProps {
  username?: string;
  onStreamChange?: (stream: MediaStream | null) => void;
  className?: string;
}

const LocalMediaControls: React.FC<LocalMediaControlsProps> = ({
  username = 'You',
  onStreamChange,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  // Initialize media stream on mount
  useEffect(() => {
    async function startMedia() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setStream(mediaStream);
        onStreamChange?.(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
        setStream(null);
        onStreamChange?.(null);
      }
    }

    startMedia();

    return () => {
      // Clean up tracks on unmount
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Update video element srcObject whenever stream changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Toggle mic on/off
  const toggleMic = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    });
    // Notify parent about updated stream
    onStreamChange?.(stream);
  };

  // Toggle video on/off
  const toggleVideo = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setVideoOn(track.enabled);
    });
    onStreamChange?.(stream);
  };

  return (
    <div className={cn("relative rounded-lg bg-black/80 w-full max-w-md mx-auto", className)}>
      {stream ? (
        <>
          <video
            ref={videoRef}
            className="w-full h-64 object-cover rounded"
            autoPlay
            playsInline
            muted
          />
          {!videoOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-accent/80 rounded">
              <User className="h-16 w-16 text-white opacity-80" />
            </div>
          )}

          <div className="absolute bottom-4 left-4 flex gap-4">
            <button
              onClick={toggleMic}
              className="bg-black/70 hover:bg-black/90 p-2 rounded-full"
              aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
              title={micOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {micOn ? <Mic className="text-white" /> : <MicOff className="text-red-500" />}
            </button>

            <button
              onClick={toggleVideo}
              className="bg-black/70 hover:bg-black/90 p-2 rounded-full"
              aria-label={videoOn ? 'Turn off camera' : 'Turn on camera'}
              title={videoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {videoOn ? <Video className="text-white" /> : <VideoOff className="text-red-500" />}
            </button>
          </div>

          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-sm text-white select-none">
            {username}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-accent rounded">
          <User className="h-16 w-16 text-white opacity-80" />
          <p className="mt-2 text-white">No camera or microphone access</p>
        </div>
      )}
    </div>
  );
};

export default LocalMediaControls;
