import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gohood.city'
  
  // Define static routes
  const routes = [
    '',
    '/signin',
    '/registration',
    '/become-landlord',
    '/rent',
    '/account',
    '/contacts',
    '/cities',
    '/terms',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
} 