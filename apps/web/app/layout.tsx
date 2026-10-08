import type { Metadata } from "next"
import { Geist_Mono, Public_Sans } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { seoConfig } from "@/lib/seo/config"
import { cn } from "@workspace/ui/lib/utils"

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.url),
  title: {
    default: "Fomobot — WhatsApp Bots, Automation & Messaging API",
    template: "%s | Fomobot",
  },
  description: seoConfig.description,
  applicationName: seoConfig.name,
  icons: { icon: "/icon.png" },
  openGraph: {
    siteName: seoConfig.name,
    type: "website",
    locale: seoConfig.locale,
    images: [{ url: seoConfig.ogImage, width: 1200, height: 630, alt: seoConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    site: seoConfig.twitterHandle,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", publicSans.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
