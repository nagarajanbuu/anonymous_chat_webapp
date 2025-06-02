
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Message as MessageType } from '@/context/ChatContext';
import { cn } from '@/lib/utils';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { user } = useAuth();
  const isSent = user?.id === message.senderId;
  const [timeLeft, setTimeLeft] = useState<number | null>(
    message.selfDestruct ? 
    Math.max(0, Math.floor((message.timestamp + message.destructTime - Date.now()) / 1000)) : 
    null
  );

  useEffect(() => {
    if (!message.selfDestruct) return;

    const interval = setInterval(() => {
      const newTimeLeft = Math.max(0, Math.floor((message.timestamp + message.destructTime - Date.now()) / 1000));
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [message]);

  const progressPercentage = timeLeft !== null && message.destructTime > 0
    ? (timeLeft * 1000 / message.destructTime) * 100
    : null;

  return (
    <div className={cn(
      "flex mb-4",
      isSent ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "relative rounded-lg max-w-xs sm:max-w-md md:max-w-lg break-words p-3",
        isSent ? "bg-whisper-500 text-white rounded-br-none" : "bg-secondary text-white rounded-bl-none",
        message.isInappropriate && "border-2 border-danger"
      )}>
        {!isSent && (
          <div className="text-xs text-whisper-200 mb-1">
            {message.senderName}
          </div>
        )}
        
        <div className="mb-1">{message.text}</div>
        
        <div className="text-xs opacity-70 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {message.selfDestruct && timeLeft !== null && timeLeft > 0 && ` • ${timeLeft}s`}
        </div>
        
        {message.isInappropriate && (
          <div className="mt-1 text-xs text-danger bg-danger/10 p-1 rounded">
            ⚠️ This message may contain inappropriate content
          </div>
        )}
        
        {message.selfDestruct && progressPercentage !== null && (
          <div className="absolute bottom-0 left-0 h-1 bg-red-500 rounded-bl-lg" style={{ width: `${progressPercentage}%` }}></div>
        )}
      </div>
    </div>
  );
};

export default Message;
