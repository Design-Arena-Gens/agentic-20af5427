import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '../components/Navbar';

export const metadata = {
  title: 'Akari Nihongo - JLPT Mastery',
  description: 'Anime-themed JLPT learning platform with planner, diff, and translator',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen anime-bg">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative">
            <div className="absolute inset-0 pointer-events-none anime-grid-overlay" />
            <Navbar />
            <main className="relative z-10 container max-w-6xl mx-auto px-4 py-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
