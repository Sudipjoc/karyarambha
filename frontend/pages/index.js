import PublicLayout from '../components/public/Layout';
import Link from 'next/link';
import api from '../lib/api';

export default function Home({ services, testimonials, blogs, heroBlocks, aboutBlocks }) {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {heroBlocks.map((block) => (
            <div key={block.id}>
              {block.blockType === 'heading' && (
                <h1 className="text-4xl md:text-6xl font-bold mb-6">{block.title}</h1>
              )}
              {block.blockType === 'paragraph' && (
                <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">{block.content}</p>
              )}
            </div>
          ))}
          {heroBlocks.length === 0 && (
            <>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Transform Your Digital Presence</h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
                We build innovative IT solutions that drive business growth.
              </p>
            </>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services" className="btn-primary text-lg px-8 py-3 rounded-full">
              Our Services
            </Link>
            <Link href="/contact" className="btn-secondary text-lg px-8 py-3 rounded-full">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50+', label: 'Projects Delivered' },
              { value: '30+', label: 'Happy Clients' },
              { value: '5+', label: 'Years Experience' },
              { value: '15+', label: 'Team Members' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {aboutBlocks.map((block) => (
              <div key={block.id}>
                {block.blockType === 'heading' && (
                  <>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{block.title}</h2>
                    <p className="text-primary-600 font-medium mb-4">{block.content}</p>
                  </>
                )}
                {block.blockType === 'paragraph' && (
                  <p className="text-gray-600 text-lg">{block.content}</p>
                )}
              </div>
            ))}
            {aboutBlocks.length === 0 && (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">About Karyarambha</h2>
                <p className="text-gray-600 text-lg">
                  Leading IT company based in Kathmandu, Nepal, delivering innovative software solutions.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Services</h2>
            <p className="text-gray-500 mt-2">Comprehensive IT solutions tailored for your business</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="card border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="text-4xl mb-4">{service.icon || '🔧'}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.title}</h3>
                <p className="text-gray-500 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services" className="btn-primary">View All Services</Link>
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      {blogs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Latest Insights</h2>
              <p className="text-gray-500 mt-2">Tips, trends, and insights from our experts</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} className="card border border-gray-100 hover:shadow-lg transition-shadow group">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 mb-2">{blog.title}</h3>
                  {blog.excerpt && <p className="text-gray-500 text-sm line-clamp-3">{blog.excerpt}</p>}
                  <p className="text-xs text-gray-400 mt-3">
                    {blog.author?.name} · {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : ''}
                  </p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/blog" className="btn-secondary">Read All Posts</Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-primary-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">What Our Clients Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-primary-800 rounded-xl p-6">
                  <div className="flex mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-primary-100 mb-4 italic">"{t.content}"</p>
                  <div>
                    <p className="font-semibold">{t.clientName}</p>
                    {t.company && <p className="text-primary-300 text-sm">{t.company}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Project?</h2>
          <p className="text-gray-700 mb-8 text-lg">Let&apos;s discuss how Karyarambha can help you achieve your goals.</p>
          <Link href="/contact" className="bg-gray-900 text-white font-semibold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors">
            Get Free Consultation
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}

export async function getServerSideProps() {
  try {
    const [servicesRes, testimonialsRes, blogsRes, heroRes, aboutRes] = await Promise.allSettled([
      api.get('/services'),
      api.get('/testimonials'),
      api.get('/blogs?limit=3'),
      api.get('/content?section=hero'),
      api.get('/content?section=about'),
    ]);

    return {
      props: {
        services: servicesRes.status === 'fulfilled' ? servicesRes.value.data.data.services : [],
        testimonials: testimonialsRes.status === 'fulfilled' ? testimonialsRes.value.data.data.testimonials : [],
        blogs: blogsRes.status === 'fulfilled' ? blogsRes.value.data.data.blogs : [],
        heroBlocks: heroRes.status === 'fulfilled' ? heroRes.value.data.data.blocks : [],
        aboutBlocks: aboutRes.status === 'fulfilled' ? aboutRes.value.data.data.blocks : [],
      },
    };
  } catch {
    return { props: { services: [], testimonials: [], blogs: [], heroBlocks: [], aboutBlocks: [] } };
  }
}
