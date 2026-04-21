import PublicLayout from '../components/public/Layout';
import api from '../lib/api';

export default function ServicesPage({ services }) {
  return (
    <PublicLayout title="Our Services" description="Explore Karyarambha's comprehensive IT services including web development, mobile apps, UI/UX design, and digital marketing.">
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-primary-100 text-xl max-w-2xl mx-auto">
            Comprehensive technology solutions to take your business to the next level.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="card border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="text-5xl mb-6">{service.icon || '🔧'}</div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h2>
                <p className="text-gray-500">{service.description}</p>
              </div>
            ))}
            {services.length === 0 && (
              <p className="text-gray-400 col-span-3 text-center py-8">No services found.</p>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

export async function getServerSideProps() {
  try {
    const res = await api.get('/services');
    return { props: { services: res.data.data.services } };
  } catch {
    return { props: { services: [] } };
  }
}
