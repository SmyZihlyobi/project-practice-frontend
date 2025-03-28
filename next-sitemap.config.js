module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin'],
      },
    ],

    additionalSitemaps: [`${process.env.NEXT_PUBLIC_FRONTEND_URL}/sitemap.xml`],
  },
};
