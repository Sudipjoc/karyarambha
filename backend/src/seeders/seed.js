require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { sequelize, User, Service, TeamMember, Testimonial, ContentBlock, Blog } = require('../models');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('Database synced.');

  // Admin user
  const admin = await User.create({
    name: process.env.ADMIN_NAME || 'Super Admin',
    email: process.env.ADMIN_EMAIL || 'admin@karyarambha.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@1234',
    role: 'admin',
  });

  // Project manager
  const pm = await User.create({
    name: 'Ramesh Sharma',
    email: 'pm@karyarambha.com',
    password: 'PM@1234',
    role: 'project_manager',
  });

  // Employee
  await User.create({
    name: 'Sita Thapa',
    email: 'employee@karyarambha.com',
    password: 'Employee@1234',
    role: 'employee',
  });

  console.log('Users seeded.');

  // Services
  const services = [
    { title: 'Web Development', description: 'We build modern, responsive web applications using the latest technologies including React, Next.js, and Node.js.', icon: '💻', order: 1 },
    { title: 'Mobile App Development', description: 'Native and cross-platform mobile apps for iOS and Android using Flutter and React Native.', icon: '📱', order: 2 },
    { title: 'UI/UX Design', description: 'Beautiful, user-centric designs that enhance user experience and drive conversions.', icon: '🎨', order: 3 },
    { title: 'Digital Marketing', description: 'SEO, social media marketing, and content strategy to grow your online presence.', icon: '📈', order: 4 },
    { title: 'Cloud Solutions', description: 'AWS, Azure, and GCP cloud infrastructure design, deployment, and management.', icon: '☁️', order: 5 },
    { title: 'IT Consulting', description: 'Expert technology consulting to align your IT strategy with your business goals.', icon: '🔧', order: 6 },
  ];
  await Service.bulkCreate(services);
  console.log('Services seeded.');

  // Team members
  await TeamMember.bulkCreate([
    { name: 'Anish Koirala', designation: 'CEO & Founder', bio: 'Visionary leader with 10+ years in IT industry.', order: 1 },
    { name: 'Ramesh Sharma', designation: 'Project Manager', bio: 'Experienced PM with a passion for agile delivery.', order: 2 },
    { name: 'Priya Joshi', designation: 'Lead Developer', bio: 'Full-stack wizard specializing in React and Node.js.', order: 3 },
    { name: 'Sita Thapa', designation: 'UI/UX Designer', bio: 'Creative designer with an eye for pixel-perfect UI.', order: 4 },
  ]);
  console.log('Team members seeded.');

  // Testimonials
  await Testimonial.bulkCreate([
    { clientName: 'Bikash Patel', company: 'TechStart Nepal', content: 'Karyarambha delivered our project on time and exceeded our expectations. Highly recommended!', rating: 5 },
    { clientName: 'Sunita Maharjan', company: 'GrowBiz Pvt. Ltd.', content: 'The team is professional and the quality of work is top-notch. Will definitely work with them again.', rating: 5 },
    { clientName: 'Raj Kumar', company: 'Sunrise Enterprises', content: 'Great communication throughout the project. Our website looks amazing!', rating: 4 },
  ]);
  console.log('Testimonials seeded.');

  // Content blocks for the homepage
  await ContentBlock.bulkCreate([
    { section: 'hero', blockType: 'heading', title: 'Transform Your Digital Presence', content: 'We build innovative IT solutions that drive business growth.', order: 1, createdBy: admin.id, updatedBy: admin.id },
    { section: 'hero', blockType: 'paragraph', title: null, content: 'From web development to digital marketing – Karyarambha is your trusted technology partner in Nepal.', order: 2, createdBy: admin.id, updatedBy: admin.id },
    { section: 'about', blockType: 'heading', title: 'About Karyarambha', content: 'Delivering Excellence Since 2019', order: 1, createdBy: admin.id, updatedBy: admin.id },
    { section: 'about', blockType: 'paragraph', title: null, content: 'Karyarambha is a leading IT company based in Kathmandu, Nepal. We specialize in delivering custom software solutions, digital transformation, and technology consulting services to businesses of all sizes.', order: 2, createdBy: admin.id, updatedBy: admin.id },
    { section: 'contact', blockType: 'heading', title: 'Get In Touch', content: "Let's discuss how we can help your business grow.", order: 1, createdBy: admin.id, updatedBy: admin.id },
    { section: 'contact', blockType: 'card', title: 'Contact Info', content: 'Email: info@karyarambha.com\nPhone: +977-1-1234567\nAddress: Kathmandu, Nepal', order: 2, createdBy: admin.id, updatedBy: admin.id },
  ]);
  console.log('Content blocks seeded.');

  // Sample blog post
  const { default: slugify } = await import('slugify').catch(() => ({ default: require('slugify') }));
  const blogTitle = 'Getting Started with Modern Web Development in Nepal';
  await Blog.create({
    title: blogTitle,
    slug: slugify(blogTitle, { lower: true, strict: true }),
    content: `<h2>Introduction</h2><p>Web development in Nepal has seen tremendous growth in recent years. Companies like Karyarambha are leading the charge in adopting modern technologies...</p><h2>Key Technologies</h2><ul><li>React.js for frontend development</li><li>Node.js for backend APIs</li><li>PostgreSQL for database management</li><li>Next.js for server-side rendering</li></ul>`,
    excerpt: 'Explore the landscape of modern web development in Nepal and how businesses are leveraging technology to grow.',
    status: 'published',
    authorId: admin.id,
    metaTitle: blogTitle,
    metaDescription: 'Explore modern web development trends in Nepal with Karyarambha.',
    tags: 'web development,nepal,technology,react,nodejs',
    publishedAt: new Date(),
  });
  console.log('Blog seeded.');

  console.log('\n✅ Seed complete!');
  console.log('Admin login: admin@karyarambha.com / Admin@1234');
  console.log('PM login: pm@karyarambha.com / PM@1234');
  console.log('Employee login: employee@karyarambha.com / Employee@1234');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
