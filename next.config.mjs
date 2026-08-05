/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      // Cloudinary — for product images uploaded via admin
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Google profile pictures — for auth
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Firebase Storage
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
  // Allow cross-origin requests from the local backend during development
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};

export default nextConfig;
