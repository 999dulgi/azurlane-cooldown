import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            new URL('https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/**'),
            new URL('https://placeholder.co/**'),
        ],
        unoptimized: true,
    },
    basePath: isProd ? '/azurlane-cooldown' : undefined,
    output: isProd ? 'export' : undefined,
};

export default nextConfig;
