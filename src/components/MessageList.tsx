
import React, { useEffect, useRef } from 'react';
import { useChat, Message as MessageType } from '@/context/ChatContext';
import Message from './Message';
import { cn } from '@/lib/utils';

const MessageList = () => {
  const { messages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={cn(
      "flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent",
      messages.length === 0 && "flex items-center justify-center"
    )}>
      {messages.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p className="mb-2 text-lg font-medium">No messages yet</p>
          <p className="text-sm">Start a conversation securely and anonymously</p>
        </div>
      ) : (
        messages.map((message: MessageType) => (
          <Message key={message.id} message={message} />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
