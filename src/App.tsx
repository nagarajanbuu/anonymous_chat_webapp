
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ChatPage from "./pages/ChatPage";
import VideoHome from "./pages/VideoHome";
import VideoRoom from "./pages/VideoRoom";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

// Components
import Header from "./components/Header";
import RequireAuth from "./components/RequireAuth";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { VideoProvider } from "./context/VideoContext";
import { SettingsProvider } from "./context/SettingsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SettingsProvider>
          <BrowserRouter>
            <ChatProvider>
              <VideoProvider>
                <Toaster />
                <Sonner />
                <Header />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  
                  <Route 
                    path="/chat" 
                    element={
                      <RequireAuth>
                        <ChatPage />
                      </RequireAuth>
                    } 
                  />
                  
                  <Route 
                    path="/video" 
                    element={
                      <RequireAuth>
                        <VideoHome />
                      </RequireAuth>
                    } 
                  />
                  
                  <Route 
                    path="/video/room/:roomId" 
                    element={
                      <RequireAuth>
                        <VideoRoom />
                      </RequireAuth>
                    } 
                  />
                  
                  <Route 
                    path="/settings" 
                    element={
                      <RequireAuth>
                        <SettingsPage />
                      </RequireAuth>
                    } 
                  />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </VideoProvider>
            </ChatProvider>
          </BrowserRouter>
        </SettingsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
