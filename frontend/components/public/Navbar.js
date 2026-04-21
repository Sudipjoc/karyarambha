import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/team', label: 'Team' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-700">Karyarambha</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                {l.label}
              </Link>
            ))}
            <Link href="/admin" className="btn-primary text-sm">
              Admin
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block px-4 py-3 text-gray-700 hover:bg-gray-50">
              {l.label}
            </Link>
          ))}
          <Link href="/admin" className="block px-4 py-3 text-primary-600 font-semibold">
            Admin Portal →
          </Link>
        </div>
      )}
    </nav>
  );
}
