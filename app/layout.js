import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});

export const metadata = {
  title: 'Vitalis — Know what\u2019s wrong. Know who to see. Know what\u2019s safe.',
  description:
    'Vitalis routes your symptoms to the right specialist, checks medication interactions, and tracks your condition day to day — with AI pattern insights.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-body bg-paper text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
