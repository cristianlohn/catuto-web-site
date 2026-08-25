import { SiteSettings } from '@/types/database'

interface JsonLdProps {
  settings: SiteSettings
}

export function JsonLd({ settings }: JsonLdProps) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: settings.company_name,
    alternateName: settings.trade_name || 'Catuto Tech Solutions',
    url: 'https://catuto.com.br',
    logo: settings.logo_url || 'https://catuto.com.br/logo.png',
    description: settings.meta_description || settings.tagline,
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address || 'Av. Paulista',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    sameAs: [
      settings.instagram_url,
      settings.linkedin_url,
      settings.github_url,
    ].filter(Boolean),
    priceRange: '$$$$',
    knowsAbout: [
      'Desenvolvimento de Websites B2B',
      'Landing Pages de Alta Conversão',
      'Next.js & React',
      'Supabase & PostgreSQL',
      'SEO Técnico & Core Web Vitals',
      'Monitoramento de Uptime 24/7',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  )
}
