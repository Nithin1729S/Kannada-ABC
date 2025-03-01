import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Shapes } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Connect Dots - Interactive Shape Drawing',
  description: 'Connect numbered dots in sequence to create beautiful shapes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Shapes className="text-primary" size={24} />
              <span className="font-bold text-xl">ConnectDots</span>
            </Link>
            <nav>
              <ul className="flex gap-6">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/shapes" className="hover:text-primary transition-colors">
                    Shapes
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        {children}
        
        <footer className="bg-muted py-8 border-t border-border mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Shapes className="text-primary" size={20} />
                <span className="font-bold">ConnectDots</span>
              </div>
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} ConnectDots. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}