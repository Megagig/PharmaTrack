import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PageTransition } from '../animations/PageTransition';
import './PublicLayoutStyles.css';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
