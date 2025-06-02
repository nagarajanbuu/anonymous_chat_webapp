
import React from 'react';
import { Shield, Lock } from 'lucide-react';

const PrivacyInfo: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-whisper-900/50 to-whisper-900/95 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-whisper-500/20 p-4 rounded-full">
          <Shield className="h-8 w-8 text-whisper-500" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-6">Your Privacy Matters</h2>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="bg-whisper-500/10 p-2 rounded-full mr-3">
            <Lock className="h-5 w-5 text-whisper-400" />
          </div>
          <div>
            <h3 className="font-medium text-lg">End-to-End Encryption</h3>
            <p className="text-muted-foreground">All your messages are encrypted and can only be read by you and your recipients.</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-whisper-500/10 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-whisper-400">
              <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7H2Z" />
              <path d="M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z" />
              <path d="M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-lg">Anonymous Communication</h3>
            <p className="text-muted-foreground">No personal data is required to use this service. Your identity remains protected.</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-whisper-500/10 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-whisper-400">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h.01" />
              <path d="M10 7h7" />
              <path d="M7 12h.01" />
              <path d="M10 12h7" />
              <path d="M7 17h.01" />
              <path d="M10 17h3" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-lg">No Data Storage</h3>
            <p className="text-muted-foreground">Messages can self-destruct and no message history is stored on our servers.</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-whisper-500/10 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-whisper-400">
              <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8c0 1.4.4 2.8 1 4l-.8 4.8c-.1.5.3.9.8.8l4.8-.8c1.2.6 2.6 1 4 1 4.4 0 8-3.6 8-8" />
              <path d="M8 9h8" />
              <path d="M8 13h6" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-lg">Direct Peer-to-Peer Video</h3>
            <p className="text-muted-foreground">Video calls connect directly between participants with no intermediary servers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyInfo;
