
import React, { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface RoomLinkProps {
  roomId: string | null;
}

const RoomLink: React.FC<RoomLinkProps> = ({ roomId }) => {
  const [copied, setCopied] = useState(false);
  
  if (!roomId) return null;
  
  const roomUrl = `${window.location.origin}/video/room/${roomId}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomUrl).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy link");
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my secure video call',
          text: 'Join my encrypted video call on Whisper Shroud',
          url: roomUrl
        });
        toast.success("Shared successfully");
      } catch (error) {
        console.error('Share failed:', error);
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="bg-whisper-900/30 p-4 rounded-lg border border-whisper-800">
      <div className="mb-2 text-sm font-medium">
        Share this link to invite others to your secure call:
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="bg-whisper-800/50 rounded py-2 px-3 text-sm flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
          {roomUrl}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCopyLink}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 bg-whisper-800/30"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </Button>
          
          {navigator.share && (
            <Button
              onClick={handleShare}
              variant="default"
              size="sm"
              className="flex items-center gap-1.5 bg-whisper-500"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          )}
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        Anyone with this link can join your encrypted video call.
      </div>
    </div>
  );
};

export default RoomLink;
