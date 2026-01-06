import { type NextConfig } from "next";

const nextConfig: NextConfig = {
    logging: {
        fetches: {
            fullUrl: true,
            hmrRefreshes: true,
        },
    },
    reactCompiler: true,
    cacheComponents: true,
    cacheLife: {
        /**
         * Represents caching for things that doesn't change until a new expansion is released.
         *
         * E.g classes.
         */
        expansion: {
            stale: 60 * 60, // 1 hour
            revalidate: 60 * 60 * 24, // 24 hours
            expire: 60 * 60 * 24 * 365, // 365 days
        },
        /**
         * Represents caching for data that can change every patch.
         *
         * E.g. zones, encounters.
         */
        patch: {
            stale: 60 * 60, // 1 hour
            revalidate: 60 * 60 * 24, // 24 hours
            expire: 60 * 60 * 24 * 30, // 30 days
        },
        /**
         * Represents caching for rankings, that can update throughout the day.
         *
         * Still a very generous expire, but with a shorter revalidate.
         */
        rankings: {
            stale: 10 * 60, // 10 minutes
            revalidate: 60 * 60, // 1 hour
            expire: 60 * 60 * 24 * 30, // 30 days
        },
    },
};

export default nextConfig;
