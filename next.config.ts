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
         * Represents caching for rankings.
         *
         * Rankings drift as new logs are uploaded, but for finding test logs a
         * day-old result set is fine. A long revalidate keeps each key from
         * being rewritten more than once a day, and `revalidate === expire`
         * disables stale-while-revalidate so a stale key blocks for one fresh
         * fetch instead of triggering a background rewrite on every access.
         */
        rankings: {
            stale: 60 * 60, // 1 hour
            revalidate: 60 * 60 * 24, // 24 hours
            expire: 60 * 60 * 24, // 24 hours
        },
    },
};

export default nextConfig;
