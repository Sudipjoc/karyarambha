import PublicLayout from '../components/public/Layout';
import Link from 'next/link';
import api from '../lib/api';

export default function BlogPage({ blogs }) {
  return (
    <PublicLayout title="Blog" description="Read the latest articles, tips and insights from the Karyarambha team.">
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Insights</h1>
          <p className="text-primary-100 text-xl">Expert thoughts on technology, business, and innovation.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="card border border-gray-100 hover:shadow-xl transition-shadow group">
                {blog.featuredImage && (
                  <img src={blog.featuredImage} alt={blog.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                )}
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 mb-2">{blog.title}</h2>
                {blog.excerpt && <p className="text-gray-500 text-sm line-clamp-3 mb-3">{blog.excerpt}</p>}
                {blog.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {blog.tags.split(',').slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-primary-50 text-primary-700 text-xs px-2 py-0.5 rounded-full">{tag.trim()}</span>
                    ))}
                  </div>
                )}
                <div className="text-xs text-gray-400">
                  {blog.author?.name} · {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : ''}
                </div>
              </Link>
            ))}
            {blogs.length === 0 && (
              <p className="text-gray-400 col-span-3 text-center py-8">No blog posts published yet.</p>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

export async function getServerSideProps() {
  try {
    const res = await api.get('/blogs?limit=20');
    return { props: { blogs: res.data.data.blogs } };
  } catch {
    return { props: { blogs: [] } };
  }
}
