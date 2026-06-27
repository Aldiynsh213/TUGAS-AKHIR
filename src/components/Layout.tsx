import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
