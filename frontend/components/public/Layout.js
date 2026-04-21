import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout({ children, title, description }) {
  const pageTitle = title ? `${title} | Karyarambha` : 'Karyarambha - IT Solutions Nepal';
  const pageDescription = description || 'Karyarambha is a leading IT company in Nepal offering web development, mobile apps, UI/UX design, and digital marketing services.';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
