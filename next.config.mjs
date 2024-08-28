/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { esmExternals: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kuqogiiqvyhenylwgeck.supabase.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/api/:path*'
            : '/api/',
      },
    ]
  },
};

export default nextConfig;
