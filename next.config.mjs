/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gogocdn.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.noitatnemucod.net",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
