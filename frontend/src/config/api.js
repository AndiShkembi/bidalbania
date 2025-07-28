// API Configuration for different environments
const getApiUrl = () => {
  // Check if we're in development or production
  const isDevelopment = import.meta.env.DEV;
  
  // Get the current hostname and protocol
  const hostname = window.location.hostname;
  const protocol = window.location.protocol; // Get current protocol (http: or https:)
  
  // If we're accessing from a specific IP, use that IP for the API
  if (hostname === '192.168.1.237') {
    return 'http://192.168.1.237:7700/api';
  }
  
  // If we're accessing from the server IP, use that IP for the API
  if (hostname === '161.35.211.94') {
    return 'http://161.35.211.94:7700/api';
  }
  
  // If we're accessing from the domain, always use HTTP for API (no SSL on port 7700)
  if (hostname === 'bidalbania.al' || hostname === 'www.bidalbania.al') {
    return 'http://bidalbania.al:7700/api';
  }
  
  // For localhost or development
  if (isDevelopment || hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:7700/api';
  }
  
  // For production, always use HTTP for API (no SSL on port 7700)
  return 'http://bidalbania.al:7700/api';
};

export const API_URL = getApiUrl();

// Axios configuration
export const apiConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
};

console.log('API URL configured as:', API_URL); 