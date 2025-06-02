
import React, { useState, useRef } from 'react';
import { Send, Clock } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isSelfDestructEnabled, destructTime } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message, isSelfDestructEnabled, destructTime);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2 p-2">
      <div className="relative flex-1">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="w-full bg-accent/40 border border-accent rounded-lg py-2 px-4 outline-none focus:ring-1 focus:ring-whisper-500 resize-none h-12 max-h-32 min-h-[48px] transition-all duration-200 ease-in-out"
          style={{ paddingRight: '3rem' }}
        />
        {isSelfDestructEnabled && (
          <div className="absolute right-3 bottom-3 text-xs text-muted-foreground flex items-center">
            <Clock size={14} className="mr-1 text-whisper-400" />
            <span>{destructTime}s</span>
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="default"
        className={cn(
          "bg-whisper-500 hover:bg-whisper-600 rounded-full p-3 h-12 w-12 flex items-center justify-center",
          !message.trim() && "opacity-50 cursor-not-allowed"
        )}
        disabled={!message.trim()}
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default MessageInput;
