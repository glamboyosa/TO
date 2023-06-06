import "@/styles/globals.css"
import { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"

import QueryProvider from "./query-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/rob.png",
    shortcut: "/rob-16x16.png",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "https://to.glamboyosa.xyz",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen  font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={false}
            forcedTheme="dark"
          >
            <QueryProvider>
              <div className=" flex min-h-screen flex-col items-center justify-center">
                <SiteHeader />
                <div className="">{children}</div>
              </div>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
