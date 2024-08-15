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
      {
        protocol: "https",
        hostname: "s4.anilist.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
