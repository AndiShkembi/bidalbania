// API Configuration for different environments
const getApiUrl = () => {
  // Check if we're in development or production
  const isDevelopment = import.meta.env.DEV;
  
  // Get the current hostname and protocol
  const hostname = window.location.hostname;
  const protocol = window.location.protocol; // Get current protocol (http: or https:)
  
  // Check if we're running locally (development environment)
  const isLocalEnvironment = isDevelopment || 
                            hostname === 'localhost' || 
                            hostname === '127.0.0.1' ||
                            window.location.port === '8080' ||
                            window.location.port === '3000' ||
                            window.location.port === '5173';
  
  // Development environment (use localhost)
  if (isLocalEnvironment) {
    console.log('🔧 Development mode: Using localhost API');
    return 'http://localhost:7700/api';
  }
  
  // Specific IP addresses (for testing)
  if (hostname === '192.168.1.237') {
    console.log('🌐 Local network: Using IP API');
    return 'http://192.168.1.237:7700/api';
  }
  
  if (hostname === '161.35.211.94') {
    console.log('🌐 Server IP: Using server IP API');
    return 'http://161.35.211.94:7700/api';
  }
  
  // Production environment (domain with port 7700)
  if (hostname === 'bidalbania.al' || hostname === 'www.bidalbania.al') {
    console.log('🚀 Production mode: Using domain API with port 7700');
    return 'https://bidalbania.al:7700/api';
  }
  
  // Fallback for production
  console.log('🚀 Production fallback: Using domain API with port 7700');
  return 'https://bidalbania.al:7700/api';
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