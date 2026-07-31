// ProofTube Persistent Background Service Worker (v1.0-alpha)
// Handles Nostr Wallet Connect (NWC), WebLN fallbacks, and minute 01:00 L402 pre-fetching

const CACHE_NAME = 'prooftube-v1';
const L402_KEY_CACHE = 'prooftube-l402-keys';

self.addEventListener('install', (event) => {
  console.log('[ProofTube SW] Service Worker installed.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[ProofTube SW] Service Worker activated.');
  event.waitUntil(clients.claim());
});

// Listener for background messages from the Dual-Canvas Player
self.addEventListener('message', async (event) => {
  const { type, payload } = event.data;

  if (type === 'PREFETCH_L402_KEY') {
    const { videoId, challengeUrl } = payload;
    console.log(`[ProofTube SW] Pre-fetching L402 challenge at minute 01:00 for Video: ${videoId}`);
    
    try {
      // Background fetch to proxy for L402 Macaroon & Invoice
      const response = await fetch(challengeUrl, { method: 'GET' });
      if (response.status === 402) {
        const authHeader = response.headers.get('WWW-Authenticate');
        console.log('[ProofTube SW] Received L402 Challenge:', authHeader);
        
        // Notify client app to trigger silent background settlement
        event.ports[0].postMessage({
          status: 'CHALLENGE_RECEIVED',
          authHeader,
          videoId
        });
      }
    } catch (err) {
      console.error('[ProofTube SW] Pre-fetch failed:', err);
    }
  }
});
