import { useEffect } from 'react';

/**
 * Custom hook for handling Content Security Policy
 * Automatically upgrades HTTP requests to HTTPS
 */
export const useCSP = () => {
  useEffect(() => {
    // Add CSP meta tag if it doesn't exist
    const addCSPMetaTag = () => {
      const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      
      if (!existingCSP) {
        const cspMeta = document.createElement('meta');
        cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
        cspMeta.setAttribute('content', 'upgrade-insecure-requests');
        
        // Insert after charset meta tag
        const charsetMeta = document.querySelector('meta[charset]');
        if (charsetMeta) {
          charsetMeta.parentNode.insertBefore(cspMeta, charsetMeta.nextSibling);
        } else {
          // Fallback: insert in head
          document.head.insertBefore(cspMeta, document.head.firstChild);
        }
        
        console.log('CSP meta tag added dynamically');
      }
    };

    // Upgrade HTTP URLs to HTTPS (but not for port 7700)
    const upgradeToHTTPS = (url) => {
      if (url && url.startsWith('http://')) {
        // Don't upgrade if URL contains port 7700 (no SSL certificate)
        if (url.includes(':7700')) {
          console.log(`CSP: Skipping HTTPS upgrade for port 7700 (no SSL): ${url}`);
          return url;
        }
        return url.replace('http://', 'https://');
      }
      return url;
    };

    // Override fetch to automatically upgrade HTTP to HTTPS
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
      const upgradedUrl = upgradeToHTTPS(url);
      
      // Log if URL was upgraded
      if (upgradedUrl !== url) {
        console.log(`CSP: Upgraded HTTP to HTTPS: ${url} → ${upgradedUrl}`);
      }
      
      return originalFetch(upgradedUrl, options);
    };

    // Override XMLHttpRequest to automatically upgrade HTTP to HTTPS
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      const upgradedUrl = upgradeToHTTPS(url);
      
      // Log if URL was upgraded
      if (upgradedUrl !== url) {
        console.log(`CSP: Upgraded HTTP to HTTPS: ${url} → ${upgradedUrl}`);
      }
      
      return originalXHROpen.call(this, method, upgradedUrl, ...args);
    };

    // Add CSP meta tag
    addCSPMetaTag();

    // Cleanup function
    return () => {
      // Restore original fetch
      window.fetch = originalFetch;
      // Restore original XMLHttpRequest
      XMLHttpRequest.prototype.open = originalXHROpen;
    };
  }, []);

  // Helper function to upgrade URLs
  const upgradeURL = (url) => {
    if (url && url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  };

  return { upgradeURL };
};

/**
 * Utility function to check if CSP is enabled
 */
export const isCSPEnabled = () => {
  return !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
};

/**
 * Utility function to get CSP content
 */
export const getCSPContent = () => {
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  return cspMeta ? cspMeta.getAttribute('content') : null;
}; 