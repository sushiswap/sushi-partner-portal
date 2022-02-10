/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "app.sushi.com",
      "res.cloudinary.com",
      "raw.githubusercontent.com",
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
