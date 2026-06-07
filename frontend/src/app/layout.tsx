import type { Metadata, Viewport } from 'next';
import { Inter, Comfortaa, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import ConditionalFooter from '@/components/layout/ConditionalFooter';
import { PWAInstallPrompt } from '@/components/layout/PWAInstallPrompt';
import { ServiceWorkerRegister } from '@/components/layout/ServiceWorkerRegister';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const comfortaa = Comfortaa({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-comfortaa',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});


export const metadata: Metadata = {
  title: {
    template: '%s | Momentum AI',
    default: 'Momentum AI: AI Apps, Agents & Workflows in One Workspace',
  },
  description:
    'One prompt. One living system. Build apps, deploy AI agents, automate workflows. Projects hold memory. Agents think. Automations execute.',
  keywords: ['AI app builder', 'AI agents', 'workflow automation', 'workspace', 'project management', 'CRM', 'no-code'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Momentum AI',
    statusBarStyle: 'black-translucent',
  },
  applicationName: 'Momentum AI',
  other: {
    'theme-color': '#0a0a0f',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icons/icon-1024x1024.png', sizes: '1024x1024', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-167x167.png', sizes: '167x167', type: 'image/png' },
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: { url: '/icons/icon-96x96.png', type: 'image/png' },
  },
  openGraph: {
    title: 'Momentum AI: AI-Native Workspace Platform',
    description: 'One prompt. One living system. Build apps, deploy AI agents, automate workflows.',
    type: 'website',
    siteName: 'Momentum AI',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${comfortaa.variable} ${jetbrainsMono.variable} min-h-screen bg-white dark:bg-[#0a0a0f] text-surface-900 dark:text-surface-100`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          <ConditionalFooter />
          <ServiceWorkerRegister />
          <PWAInstallPrompt />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
