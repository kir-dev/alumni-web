/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "*.vercel-storage.com"
            },
        ],
    }
};

export default nextConfig;
