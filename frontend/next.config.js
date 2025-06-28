/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    // In production (Vercel), API calls go to the same domain
    // In development, they go to the backend URL
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // Production: API calls stay on same domain
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ];
    } else {
      // Development: API calls go to backend URL
      return [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
      ];
    }
  },
}

module.exports = nextConfig 