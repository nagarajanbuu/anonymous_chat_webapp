
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If already authenticated, redirect to chat
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) return;
    
    try {
      setIsLoading(true);
      // For anonymous chat, signup is the same as login (just storing a username)
      login(username);
      navigate('/chat');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-whisper-900 p-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-whisper-500">Create Account</h1>
          <p className="text-muted-foreground mt-2">Choose a username to get started</p>
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
            <p className="text-xs text-muted-foreground">
              This username will be visible to others in chats.
            </p>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-whisper-500 hover:bg-whisper-600 text-white"
            disabled={isLoading || !username.trim()}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account? 
            <Link to="/login" className="text-whisper-500 hover:underline ml-1">
              Log in
            </Link>
          </p>
        </div>
        
        <div className="mt-8 p-4 bg-secondary/20 rounded-lg text-sm">
          <p className="text-muted-foreground">
            Your privacy is our priority. We do not collect any personal information,
            and all communications are end-to-end encrypted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
