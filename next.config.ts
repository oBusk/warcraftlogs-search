import { type NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        staleTimes: {
            dynamic: 60,
            static: 180,
        },
    },
    logging: {
        fetches: {
            fullUrl: true,
            hmrRefreshes: true,
        },
    },
};

export default nextConfig;
