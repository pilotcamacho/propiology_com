import type { Metadata } from 'next';
import './globals.css';
import AmplifyProvider from '@/components/providers/AmplifyProvider';

export const metadata: Metadata = {
  title: 'Propiology',
  description: 'Your Personal OS for behavioral transformation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AmplifyProvider>{children}</AmplifyProvider>;
}
