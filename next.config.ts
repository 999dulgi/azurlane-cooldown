import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    basePath: '/azurlane-cooldown',
    output: 'export',
    /* config options here */
    images: {
        remotePatterns: [
            new URL('https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/**'),
            new URL('https://placeholder.co/**'),
        ],
        unoptimized: true,
    },
};

export default nextConfig;
