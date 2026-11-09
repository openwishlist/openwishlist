import { type VitePWAOptions } from 'vite-plugin-pwa';

export const pwaConfig: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    // Without this the service worker answers navigations to the backend, such as the OIDC
    // callback, with index.html, and the request never reaches the server.
    navigateFallbackDenylist: [/^\/api\//, /^\/media\//],
  },
  manifest: {
    name: 'OpenWishlist',
    short_name: 'OpenWishlist',
    description: 'A private wishlist manager',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '/app',
    icons: [
      {
        src: 'openwishlist-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ]
  }
};
