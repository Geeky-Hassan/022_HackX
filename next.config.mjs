/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/visualize/:path*",
        destination: `${process.env.PRODUCTION_CHATBOT_API_URL}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
  transpilePackages: ["shiki"],
};

export default nextConfig;
