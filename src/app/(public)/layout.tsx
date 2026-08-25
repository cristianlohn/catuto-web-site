import * as React from 'react'
import Script from 'next/script'
import { getSiteSettings } from '@/lib/site-settings'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { JsonLd } from '@/components/public/JsonLd'
import { FloatingWhatsApp } from '@/components/public/FloatingWhatsApp'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Script do Catuto Analytics Pixel */}
      <Script src="/catuto-pixel.js" strategy="afterInteractive" />

      <JsonLd settings={settings} />
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />

      {/* Botão Flutuante Oficial do WhatsApp */}
      <FloatingWhatsApp
        whatsappNumber={settings.whatsapp}
        defaultMessage={settings.whatsapp_message}
      />
    </div>
  )
}
