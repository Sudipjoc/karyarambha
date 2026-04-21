import Head from 'next/head';
import AdminSidebar from './Sidebar';

export default function AdminLayout({ children, title }) {
  return (
    <>
      <Head>
        <title>{title ? `${title} | Karyarambha Admin` : 'Karyarambha Admin'}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </>
  );
}
