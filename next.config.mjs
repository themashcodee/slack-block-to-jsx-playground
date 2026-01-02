/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.slack-edge.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.githubassets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**", // Allow any HTTPS domain for user-provided logos
      },
    ],
  },
};

export default nextConfig;
