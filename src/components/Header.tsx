
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Video, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  return (
    <header className="bg-whisper-900 text-white shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          WhisperShroud
        </Link>
        
        <nav className="hidden md:flex items-center space-x-2">
          <Link 
            to="/chat" 
            className={`nav-link ${location.pathname === '/chat' ? 'nav-link-active' : ''}`}
          >
            <span className="flex items-center gap-2">
              <MessageSquare size={18} />
              Chat
            </span>
          </Link>
          
          <Link 
            to="/video" 
            className={`nav-link ${location.pathname.startsWith('/video') ? 'nav-link-active' : ''}`}
          >
            <span className="flex items-center gap-2">
              <Video size={18} />
              Video
            </span>
          </Link>
          
          <Link 
            to="/settings" 
            className={`nav-link ${location.pathname === '/settings' ? 'nav-link-active' : ''}`}
          >
            <span className="flex items-center gap-2">
              <Settings size={18} />
              Settings
            </span>
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={logout}
            className="text-white hover:bg-whisper-700"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-whisper-900 p-2 flex items-center justify-around z-10">
        <Link to="/chat" className={`p-3 rounded-full ${location.pathname === '/chat' ? 'bg-whisper-700' : ''}`}>
          <MessageSquare size={22} />
        </Link>
        
        <Link to="/video" className={`p-3 rounded-full ${location.pathname.startsWith('/video') ? 'bg-whisper-700' : ''}`}>
          <Video size={22} />
        </Link>
        
        <Link to="/settings" className={`p-3 rounded-full ${location.pathname === '/settings' ? 'bg-whisper-700' : ''}`}>
          <Settings size={22} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
