/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이미지 최적화 설정 (Netlify 호환)
  images: {
    unoptimized: true,
  },

  // TypeScript 설정
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint 설정
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
