'use client';

// Registers the PWA service worker (v1.1 Phase 4). Renders nothing.

import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // PWA is progressive — app works without it
      });
    }
  }, []);
  return null;
}
