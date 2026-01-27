import { ReactElement } from 'react';

import Website from '@/layouts/Website';

/**
 * Root layout component for ReflectivAI
 *
 * This is a full-screen application layout without header/footer.
 * The chat interface takes up the entire viewport.
 *
 * @param children - Child routes to render (typically <Outlet /> from react-router-dom)
 */
interface RootLayoutProps {
  children: ReactElement;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Website>
      {children}
    </Website>
  );
}
