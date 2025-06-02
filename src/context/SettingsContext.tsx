
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  enhancedPrivacyMode: boolean;
  setEnhancedPrivacyMode: (value: boolean) => void;
  allowVideoCalls: boolean;
  setAllowVideoCalls: (value: boolean) => void;
  enableNotifications: boolean;
  setEnableNotifications: (value: boolean) => void;
  clearAllData: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [enhancedPrivacyMode, setEnhancedPrivacyMode] = useState(true);
  const [allowVideoCalls, setAllowVideoCalls] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const storedEnhancedPrivacy = localStorage.getItem('enhancedPrivacyMode');
    if (storedEnhancedPrivacy !== null) {
      setEnhancedPrivacyMode(storedEnhancedPrivacy === 'true');
    }

    const storedAllowVideoCalls = localStorage.getItem('allowVideoCalls');
    if (storedAllowVideoCalls !== null) {
      setAllowVideoCalls(storedAllowVideoCalls === 'true');
    }

    const storedEnableNotifications = localStorage.getItem('enableNotifications');
    if (storedEnableNotifications !== null) {
      setEnableNotifications(storedEnableNotifications === 'true');
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('enhancedPrivacyMode', enhancedPrivacyMode.toString());
  }, [enhancedPrivacyMode]);

  useEffect(() => {
    localStorage.setItem('allowVideoCalls', allowVideoCalls.toString());
  }, [allowVideoCalls]);

  useEffect(() => {
    localStorage.setItem('enableNotifications', enableNotifications.toString());
    if (enableNotifications) {
      requestNotificationPermission();
    }
  }, [enableNotifications]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
      }
    }
  };

  const clearAllData = () => {
    // Clear all locally stored data
    localStorage.clear();
    
    // Reset all settings to defaults
    setEnhancedPrivacyMode(true);
    setAllowVideoCalls(true);
    setEnableNotifications(false);
  };

  return (
    <SettingsContext.Provider
      value={{
        enhancedPrivacyMode,
        setEnhancedPrivacyMode,
        allowVideoCalls,
        setAllowVideoCalls,
        enableNotifications,
        setEnableNotifications,
        clearAllData,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
