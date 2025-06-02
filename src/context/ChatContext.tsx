
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { detectInappropriateContent } from '@/utils/moderation';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  selfDestruct: boolean;
  destructTime: number;
  isInappropriate?: boolean;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string, selfDestruct: boolean, destructTime: number) => void;
  clearMessages: () => void;
  isSelfDestructEnabled: boolean;
  setIsSelfDestructEnabled: (value: boolean) => void;
  destructTime: number;
  setDestructTime: (value: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSelfDestructEnabled, setIsSelfDestructEnabled] = useState(true);
  const [destructTime, setDestructTime] = useState(5); // Default 5 seconds
  const { user } = useAuth();

  // Load settings from localStorage
  useEffect(() => {
    const storedSelfDestruct = localStorage.getItem('isSelfDestructEnabled');
    if (storedSelfDestruct !== null) {
      setIsSelfDestructEnabled(storedSelfDestruct === 'true');
    }

    const storedDestructTime = localStorage.getItem('destructTime');
    if (storedDestructTime !== null) {
      setDestructTime(parseInt(storedDestructTime, 10));
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('isSelfDestructEnabled', isSelfDestructEnabled.toString());
    localStorage.setItem('destructTime', destructTime.toString());
  }, [isSelfDestructEnabled, destructTime]);

  // Handle self-destructing messages
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    messages.forEach((message) => {
      if (message.selfDestruct) {
        const timeLeft = message.destructTime - (Date.now() - message.timestamp);
        
        if (timeLeft > 0) {
          const timeout = setTimeout(() => {
            setMessages((prevMessages) => 
              prevMessages.filter((m) => m.id !== message.id)
            );
          }, timeLeft);
          
          timeouts.push(timeout);
        } else {
          // Remove already expired messages
          setMessages((prevMessages) => 
            prevMessages.filter((m) => m.id !== message.id)
          );
        }
      }
    });
    
    // Cleanup timeouts on component unmount
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [messages]);

  const sendMessage = (text: string, selfDestruct: boolean, destructTime: number) => {
    if (!user) return;
    
    // Check for inappropriate content
    const isInappropriate = detectInappropriateContent(text);
    
    const newMessage: Message = {
      id: uuidv4(),
      text,
      senderId: user.id,
      senderName: user.username,
      timestamp: Date.now(),
      selfDestruct,
      destructTime: destructTime * 1000, // Convert seconds to milliseconds
      isInappropriate
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    if (isInappropriate) {
      toast.error("Your message contains inappropriate content", {
        description: "Please follow our community guidelines.",
        duration: 3000,
      });
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        sendMessage, 
        clearMessages, 
        isSelfDestructEnabled, 
        setIsSelfDestructEnabled,
        destructTime,
        setDestructTime
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
