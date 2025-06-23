import './globals.css';
import { ReactNode } from 'react';
import Providers from './providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground font-sans min-h-screen">
        <Providers>
          <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
