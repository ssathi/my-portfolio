/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',          // static HTML export — deploy anywhere
  images: { unoptimized: true }, // required for static export
};

export default nextConfig;
