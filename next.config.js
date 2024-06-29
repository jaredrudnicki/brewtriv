/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
    basePath: '/',
    env: {
        key: 'rudnickey',
        url: isProd ? "https://www.brewtriv.com" : "http://localhost:3000"
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
