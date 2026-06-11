import type { MetadataRoute } from 'next';

// PWA manifest (v1.1 Phase 4) — installable; /review is the dead-time
// mobile entry point.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Second Brain',
    short_name: 'Brainify',
    description: 'Personal learning OS — proactive AI study companion',
    start_url: '/review',
    display: 'standalone',
    background_color: '#FAF8F4',
    theme_color: '#FAF8F4',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
