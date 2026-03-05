import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YT Bot Dashboard | Automation Control',
  description: 'Professional YouTube automation control panel',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-blue-500/30">
        <div className="blob top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="blob bottom-0 right-0 translate-x-1/2 translate-y-1/2"></div>
        {children}
      </body>
    </html>
  );
}
