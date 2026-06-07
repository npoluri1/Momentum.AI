'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname() || '';

  const hideOnPaths = ['/workspace', '/dashboard', '/admin', '/auth', '/settings', '/projects', '/agents', '/automations', '/crm', '/analytics', '/trash', '/notifications'];
  const shouldHide = hideOnPaths.some(p => pathname.startsWith(p));

  if (shouldHide) return null;

  return <Footer />;
}
