
// Simple encryption/decryption functions
// In a real implementation, this would use a proper end-to-end encryption library

export const generateEncryptionKey = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Simple XOR encryption (for demo purposes only)
// Real app would use a proper encryption library like libsodium or TweetNaCl
export const encryptMessage = (message: string, key: string): string => {
  const keyBytes = Array.from(key).map(char => char.charCodeAt(0));
  const messageBytes = Array.from(message).map(char => char.charCodeAt(0));
  
  const encryptedBytes = messageBytes.map((byte, i) => 
    byte ^ keyBytes[i % keyBytes.length]
  );
  
  // Convert to base64 for transmission
  const encryptedArray = new Uint8Array(encryptedBytes);
  return btoa(String.fromCharCode(...encryptedArray));
};

export const decryptMessage = (encryptedMessage: string, key: string): string => {
  try {
    // Convert from base64
    const encryptedBytes = Uint8Array.from(atob(encryptedMessage), char => char.charCodeAt(0));
    const keyBytes = Array.from(key).map(char => char.charCodeAt(0));
    
    const decryptedBytes = Array.from(encryptedBytes).map((byte, i) => 
      byte ^ keyBytes[i % keyBytes.length]
    );
    
    return String.fromCharCode(...decryptedBytes);
  } catch (error) {
    console.error('Failed to decrypt message:', error);
    return '[Encrypted Message]';
  }
};

// Generate a random session ID
export const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
