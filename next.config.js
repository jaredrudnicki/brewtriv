/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const url = isProd ? 'https://www.brewtriv.com' : 'http://localhost:3000';


const nextConfig = {
    metadataBase: new URL(url),
    assetPrefix: url,
    env: {
        key: process.env.key,
        url: url
    },
    async redirects() {
        return [
          // Basic redirect
          {
            source: '/',
            destination: '/quizzes',
            permanent: true,
          },
        ]
    },
};

module.exports = nextConfig;
