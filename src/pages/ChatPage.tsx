
import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import { Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const ChatPage = () => {
  const { 
    isSelfDestructEnabled, 
    setIsSelfDestructEnabled, 
    destructTime, 
    setDestructTime 
  } = useChat();

  return (
    <div className="flex flex-col h-screen bg-whisper-900">
      <div className="bg-card p-4 shadow-md flex items-center justify-between">
        <h1 className="text-xl font-semibold">Anonymous Chat</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground mr-1">Self-destruct</span>
          <Switch
            checked={isSelfDestructEnabled}
            onCheckedChange={setIsSelfDestructEnabled}
          />
          
          {isSelfDestructEnabled && (
            <div className="flex items-center gap-2 ml-2">
              <Clock className="h-4 w-4 text-whisper-400" />
              <select
                value={destructTime}
                onChange={(e) => setDestructTime(Number(e.target.value))}
                className="bg-accent text-sm rounded py-1 px-2 outline-none border border-accent"
              >
                <option value={5}>5s</option>
                <option value={10}>10s</option>
                <option value={30}>30s</option>
              </select>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative flex-1 overflow-hidden flex flex-col">
        <MessageList />
        <MessageInput />
        
        <div className="bg-whisper-900/80 p-2 text-center text-xs text-whisper-300">
          <p className="flex items-center justify-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
            Your messages are end-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
