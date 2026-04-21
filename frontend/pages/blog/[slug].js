import PublicLayout from '../../components/public/Layout';
import api from '../../lib/api';

export default function BlogPost({ blog }) {
  if (!blog) return (
    <PublicLayout title="Not Found">
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Blog post not found.</h1>
      </div>
    </PublicLayout>
  );

  return (
    <PublicLayout title={blog.metaTitle || blog.title} description={blog.metaDescription}>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-8">
          {blog.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.split(',').map((tag) => (
                <span key={tag} className="bg-primary-50 text-primary-700 text-xs px-3 py-1 rounded-full">{tag.trim()}</span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>By {blog.author?.name}</span>
            <span>·</span>
            <span>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
          </div>
        </header>

        {blog.featuredImage && (
          <img src={blog.featuredImage} alt={blog.title} className="w-full rounded-xl mb-8 max-h-96 object-cover" />
        )}

        <div
          className="prose max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </PublicLayout>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const res = await api.get(`/blogs/post/${params.slug}`);
    return { props: { blog: res.data.data.blog } };
  } catch {
    return { props: { blog: null } };
  }
}
