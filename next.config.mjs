/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/en/admin/dashboard',

        permanent: true,
        locale: false
      },

      {
        source: '/:lang(en|fr|ar)',
        destination: '/:lang/admin/dashboard',
        permanent: true,
        locale: false
      },
      {
        source: '/:path((?!api|_next/static|_next/image|favicon.ico|images|public|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|\\.well-known).*)',
        has: [
          {
            type: 'header',
            key: 'accept',
            value: 'text/html',
          },
        ],
        destination: '/en/admin/:path',
        permanent: true,
        locale: false
      },
    ]
  },
  allowedDevOrigins: ['192.168.1.34', 'localhost:3000'],
  webpack: (config) => {
    return config
  }
}

export default nextConfig
