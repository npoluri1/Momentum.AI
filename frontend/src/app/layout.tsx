import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Taskade',
    default: 'AI App Builder: Vibe Code Apps, AI Agents & Workflow Automations | Taskade',
  },
  description:
    'AI-powered workspace platform. Build apps, deploy AI agents, automate workflows from one prompt. Projects hold memory. Agents think. Automations execute.',
  keywords: [
    'AI app builder',
    'AI agents',
    'workflow automation',
    'vibe coding',
    'project management',
    'CRM',
    'workspace',
    'no-code',
  ],
  openGraph: {
    title: 'AI App Builder: Vibe Code Apps, AI Agents & Workflow Automations | Taskade',
    description:
      'AI-powered workspace platform. Build apps, deploy AI agents, automate workflows from one prompt.',
    type: 'website',
    siteName: 'Taskade',
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
