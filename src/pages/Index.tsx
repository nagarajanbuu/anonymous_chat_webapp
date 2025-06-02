import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MessageSquare, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PrivacyInfo from '@/components/PrivacyInfo';

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-whisper-900 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Stay Anonymous,</span>
              <span className="block text-whisper-500">Stay Connected</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              Connect with others through secure, anonymous text
              and video chat. No personal data required.
            </p>
            
            <Button 
              onClick={handleGetStarted}
              className="bg-whisper-500 hover:bg-whisper-600 text-white px-8 py-6 text-lg font-medium rounded-md transition-colors"
            >
              Get Started
            </Button>
          </div>
          
          <div className="bg-whisper-900/50 p-6 rounded-xl border border-whisper-700/50 shadow-xl">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-whisper-800/50 rounded-lg p-5 flex">
                <div className="bg-whisper-500/20 p-3 rounded-full mr-4">
                  <MessageSquare className="h-6 w-6 text-whisper-400" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Secure Messaging</h3>
                  <p className="text-gray-400">End-to-end encrypted messages that self-destruct</p>
                </div>
              </div>
              
              <div className="bg-whisper-800/50 rounded-lg p-5 flex">
                <div className="bg-whisper-500/20 p-3 rounded-full mr-4">
                  <Video className="h-6 w-6 text-whisper-400" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Anonymous Video</h3>
                  <p className="text-gray-400">Private video calls with no trace</p>
                </div>
              </div>
              
              <div className="bg-whisper-800/50 rounded-lg p-5 flex">
                <div className="bg-whisper-500/20 p-3 rounded-full mr-4">
                  <Shield className="h-6 w-6 text-whisper-400" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Privacy First</h3>
                  <p className="text-gray-400">No personal data stored</p>
                </div>
              </div>
              
              <p className="text-center text-gray-400 text-sm mt-2">
                Join thousands of privacy-conscious users
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
