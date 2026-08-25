import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const fontSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const fontHeading = Space_Grotesk({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
})

const fontMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Catuto Digital Solutions | Websites B2B de Alta Conversão & Engenharia Web',
    template: '%s | Catuto',
  },
  description:
    'Desenvolvimento de websites institucionais B2B, landing pages de alta conversão e plataformas de alta performance.',
  metadataBase: new URL('https://catuto.com.br'),
  icons: {
    icon: '/brand/catuto-symbol.webp',
    shortcut: '/brand/catuto-symbol.webp',
    apple: '/brand/catuto-symbol.webp',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090d16] text-zinc-100 font-sans selection:bg-emerald-600/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  )
}
