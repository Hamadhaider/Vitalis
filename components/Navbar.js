'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/specialist', label: 'Specialist Router' },
  { href: '/medications', label: 'Medication Checker' },
  { href: '/logger', label: 'Daily Logger' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6 flex-wrap">
        <Link href="/" className="flex items-center gap-2 focus-ring">
          <svg width="22" height="22" viewBox="0 0 22 22" className="text-pine" fill="none">
            <path
              d="M1 11h5l2-6 3 12 2-8 1.5 2H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-display italic text-xl tracking-tight">Vitalis</span>
        </Link>
        <ul className="flex items-center gap-1 text-sm">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`focus-ring px-3 py-2 rounded-full transition-colors ${
                    active
                      ? 'bg-pine text-paper'
                      : 'text-ink/70 hover:text-ink hover:bg-pine-50'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
