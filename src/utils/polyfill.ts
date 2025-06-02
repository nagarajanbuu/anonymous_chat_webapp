
// Polyfills for Node.js environment variables in the browser
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.global = window;
  // @ts-ignore
  window.process = window.process || { env: {} };
}

export {};
