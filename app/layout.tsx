import type { Metadata } from 'next'
import { Inter, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { BottomNav } from '@/components/bottom-nav'
import { CustomCursor } from '@/components/custom-cursor'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const syne = Syne({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'Research Tracker',
  description: 'Map knowledge gaps, track signals, and find unsolved problems in academic research.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${syne.variable} font-sans bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary cursor-none`}>
        <ThemeProvider defaultTheme="system" enableSystem attribute="class">
          {children}
          <BottomNav />
          <CustomCursor />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
