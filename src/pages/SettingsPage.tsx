
import React from 'react';
import { useSettings } from '@/context/SettingsContext';
import { useChat } from '@/context/ChatContext';
import { Shield, Bell, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { 
    enhancedPrivacyMode, 
    setEnhancedPrivacyMode, 
    allowVideoCalls, 
    setAllowVideoCalls,
    enableNotifications,
    setEnableNotifications,
    clearAllData
  } = useSettings();
  
  const { 
    isSelfDestructEnabled, 
    setIsSelfDestructEnabled,
  } = useChat();

  const handleClearData = () => {
    clearAllData();
    toast.success('All data cleared successfully');
  };

  return (
    <div className="container max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid gap-8">
        {/* Privacy Settings */}
        <div className="bg-card rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-whisper-500" />
            <h2 className="text-xl font-semibold">Privacy Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Self-Destructing Messages</p>
                <p className="text-sm text-muted-foreground">Messages will automatically delete after the set timer</p>
              </div>
              <Switch 
                checked={isSelfDestructEnabled} 
                onCheckedChange={setIsSelfDestructEnabled}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Video Calls</p>
                <p className="text-sm text-muted-foreground">Enable or disable anonymous video calls</p>
              </div>
              <Switch 
                checked={allowVideoCalls} 
                onCheckedChange={setAllowVideoCalls}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enhanced Privacy Mode</p>
                <p className="text-sm text-muted-foreground">Additional encryption and IP address protection</p>
              </div>
              <Switch 
                checked={enhancedPrivacyMode} 
                onCheckedChange={setEnhancedPrivacyMode}
              />
            </div>
          </div>
        </div>
        
        {/* Notifications */}
        <div className="bg-card rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-whisper-500" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications for new messages</p>
              </div>
              <Switch 
                checked={enableNotifications} 
                onCheckedChange={setEnableNotifications}
              />
            </div>
          </div>
        </div>
        
        {/* Security Status */}
        <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-400 mb-4">Security Status</h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-green-400">End-to-end encryption active</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-green-400">IP address protection enabled</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-green-400">SSL/TLS secure connection</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-green-400">No personal data stored</p>
            </div>
          </div>
        </div>
        
        {/* Data Management */}
        <div className="bg-card rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trash className="h-5 w-5 text-danger" />
            <h2 className="text-xl font-semibold">Data Management</h2>
          </div>
          
          <p className="mb-4 text-sm text-muted-foreground">
            This action will permanently delete all your settings and message history from this device.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">Clear All Data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your settings and message history from this device.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData} className="bg-danger">
                  Yes, clear all data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
