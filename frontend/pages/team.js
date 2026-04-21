import PublicLayout from '../components/public/Layout';
import api from '../lib/api';

export default function TeamPage({ members }) {
  return (
    <PublicLayout title="Our Team" description="Meet the talented team behind Karyarambha.">
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Team</h1>
          <p className="text-primary-100 text-xl max-w-2xl mx-auto">The talented people driving innovation at Karyarambha.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {members.map((member) => (
              <div key={member.id} className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-700 text-3xl flex items-center justify-center mx-auto mb-4">
                  {member.photoUrl
                    ? <img src={member.photoUrl} alt={member.name} className="w-24 h-24 rounded-full object-cover" />
                    : member.name.charAt(0)
                  }
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-primary-600 text-sm">{member.designation}</p>
                {member.bio && <p className="text-gray-500 text-xs mt-2">{member.bio}</p>}
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary-500 text-xs mt-2 inline-block hover:underline">
                    LinkedIn →
                  </a>
                )}
              </div>
            ))}
            {members.length === 0 && (
              <p className="text-gray-400 col-span-4 text-center py-8">Team information not available.</p>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

export async function getServerSideProps() {
  try {
    const res = await api.get('/team');
    return { props: { members: res.data.data.members } };
  } catch {
    return { props: { members: [] } };
  }
}
