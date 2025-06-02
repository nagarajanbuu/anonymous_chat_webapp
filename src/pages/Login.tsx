
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Login = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the previous location if it exists, otherwise default to chat
  const from = location.state?.from?.pathname || '/chat';
  
  useEffect(() => {
    // If already authenticated, redirect to the intended destination
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) return;
    
    try {
      setIsLoading(true);
      login(username);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-whisper-900 p-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-whisper-500">WhisperShroud</h1>
          <p className="text-muted-foreground mt-2">Enter your preferred username to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="bg-accent/40 border-accent"
              disabled={isLoading}
              required
              maxLength={20}
              minLength={3}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-whisper-500 hover:bg-whisper-600 text-white"
            disabled={isLoading || !username.trim()}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account? 
            <Link to="/signup" className="text-whisper-500 hover:underline ml-1">
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="mt-8 p-4 bg-secondary/20 rounded-lg text-sm">
          <p className="text-muted-foreground">
            By continuing, you agree to our commitment to privacy and anonymous communication. 
            No personal information is stored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
