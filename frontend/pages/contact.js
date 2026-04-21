import PublicLayout from '../components/public/Layout';

export default function ContactPage() {
  return (
    <PublicLayout title="Contact Us" description="Get in touch with Karyarambha for your IT needs.">
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-primary-100 text-xl">Let&apos;s discuss your project. We&apos;d love to hear from you.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent! We will get back to you soon.'); }}>
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" className="input" placeholder="Your name" required />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" className="input" placeholder="your@email.com" required />
                </div>
                <div>
                  <label className="label">Subject</label>
                  <input type="text" className="input" placeholder="How can we help?" required />
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea className="input" rows={5} placeholder="Describe your project..." required />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4">Get In Touch</h3>
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-3"><span className="text-2xl">📧</span><span>info@karyarambha.com</span></p>
                  <p className="flex items-center gap-3"><span className="text-2xl">📞</span><span>+977-1-1234567</span></p>
                  <p className="flex items-center gap-3"><span className="text-2xl">📍</span><span>Kathmandu, Nepal</span></p>
                  <p className="flex items-center gap-3"><span className="text-2xl">🕐</span><span>Mon–Fri: 9 AM – 6 PM NPT</span></p>
                </div>
              </div>
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-3">Follow Us</h3>
                <div className="flex gap-4 text-primary-600">
                  <a href="#" className="hover:underline text-sm">LinkedIn</a>
                  <a href="#" className="hover:underline text-sm">Twitter</a>
                  <a href="#" className="hover:underline text-sm">Facebook</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
