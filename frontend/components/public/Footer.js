import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-3">Karyarambha</h3>
            <p className="text-sm">Your trusted technology partner in Nepal. We deliver innovative IT solutions that drive business growth.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-white transition-colors">Web Development</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Mobile Apps</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">UI/UX Design</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">IT Consulting</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/team" className="hover:text-white transition-colors">Our Team</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 info@karyarambha.com</li>
              <li>📞 +977-1-1234567</li>
              <li>📍 Kathmandu, Nepal</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-700 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Karyarambha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
