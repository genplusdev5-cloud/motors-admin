/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/en/dashboard',

        permanent: true,
        locale: false
      },

      {
        source: '/:lang(en|fr|ar)',
        destination: '/:lang/dashboard',

        permanent: true,
        locale: false
      },

     {
      source:'/:path*',
      has:[
        {
          type:'header',
          key:'accept',
          value:'text/html',
        },
      ],
      destination:'/en/:path*',
      permanent:true,

        locale:false
          },
    ]
  },
  allowedDevOrigins: ['192.168.1.34', 'localhost:3000'],
  webpack: (config) => {
    return config
  }
}

export default nextConfig
