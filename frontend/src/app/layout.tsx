import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Momentum.AI',
    default: 'Momentum.AI: AI-Native Workspace Platform',
  },
  description:
    'AI-powered enterprise workspace platform. Build apps, deploy AI agents, automate workflows from one prompt. Projects hold memory. Agents think. Automations execute.',
  keywords: [
    'AI app builder',
    'AI agents',
    'workflow automation',
    'enterprise workspace',
    'project management',
    'CRM',
    'workspace',
    'no-code',
  ],
  openGraph: {
    title: 'Momentum.AI: AI-Native Workspace Platform',
    description:
      'AI-powered enterprise workspace platform. Build apps, deploy AI agents, automate workflows from one prompt.',
    type: 'website',
    siteName: 'Momentum.AI',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-surface-950 text-surface-900 dark:text-surface-100">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
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
