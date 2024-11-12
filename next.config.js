/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const url = isProd ? 'https://www.brewtriv.com' : 'http://localhost:3000';


const nextConfig = {
    metadataBase: new URL(url),
    assetPrefix: url,
    env: {
        key: process.env.key,
        STRIPE_TEST_PUBLISHABLE_KEY: process.env.STRIPE_TEST_PUBLISHABLE_KEY,
        STRIPE_TEST_SECRET_KEY: process.env.STRIPE_TEST_SECRET_KEY,
        url: url
    },
    async redirects() {
        return [
            // Basic redirect
            {
                source: '/',
                destination: '/daily',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
