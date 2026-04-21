process.env.NODE_ENV = 'test';
process.env.USE_SQLITE = 'true';
process.env.JWT_SECRET = 'test_secret_key';
process.env.JWT_EXPIRES_IN = '1h';

const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../models');

let adminToken, pmToken, employeeToken;
let taskId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create admin
  const adminRes = await request(app).post('/api/auth/register/public').send({
    name: 'Test Admin', email: 'testadmin@test.com', password: 'Test@1234',
  });
  // Manually set role in DB
  const { User } = require('../models');
  await User.update({ role: 'admin' }, { where: { email: 'testadmin@test.com' } });
  const adminLogin = await request(app).post('/api/auth/login').send({ email: 'testadmin@test.com', password: 'Test@1234' });
  adminToken = adminLogin.body.data.token;

  // Create PM via admin
  const pmRes = await request(app)
    .post('/api/auth/register')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Test PM', email: 'testpm@test.com', password: 'Test@1234', role: 'project_manager' });
  const pmLogin = await request(app).post('/api/auth/login').send({ email: 'testpm@test.com', password: 'Test@1234' });
  pmToken = pmLogin.body.data.token;

  // Create employee
  const empRes = await request(app).post('/api/auth/register/public').send({
    name: 'Test Employee', email: 'testemployee@test.com', password: 'Test@1234',
  });
  const empLogin = await request(app).post('/api/auth/login').send({ email: 'testemployee@test.com', password: 'Test@1234' });
  employeeToken = empLogin.body.data.token;
});

afterAll(async () => {
  await sequelize.close();
});

// ─── Auth ────────────────────────────────────────────────
describe('Auth', () => {
  it('should return health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should login successfully', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'testadmin@test.com', password: 'Test@1234',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'testadmin@test.com', password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });

  it('should return current user with valid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('testadmin@test.com');
    expect(res.body.data.user.password).toBeUndefined();
  });
});

// ─── RBAC ─────────────────────────────────────────────────
describe('RBAC', () => {
  it('employee should not access admin user list', async () => {
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${employeeToken}`);
    expect(res.status).toBe(403);
  });

  it('admin should access user list', async () => {
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.users).toBeDefined();
  });

  it('unauthenticated request should be rejected', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });
});

// ─── Tasks ────────────────────────────────────────────────
describe('Tasks', () => {
  it('admin can create a task', async () => {
    const { User } = require('../models');
    const emp = await User.findOne({ where: { email: 'testemployee@test.com' } });

    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Task',
        description: 'A sample task',
        priority: 'high',
        deadline: '2025-12-31',
        assignedTo: emp.id,
      });
    expect(res.status).toBe(201);
    expect(res.body.data.task.title).toBe('Test Task');
    taskId = res.body.data.task.id;
  });

  it('employee can see their assigned tasks', async () => {
    const res = await request(app).get('/api/tasks').set('Authorization', `Bearer ${employeeToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.tasks)).toBe(true);
  });

  it('employee can update status of their own task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ status: 'in_progress' });
    expect(res.status).toBe(200);
    expect(res.body.data.task.status).toBe('in_progress');
  });

  it('employee cannot delete a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${employeeToken}`);
    expect(res.status).toBe(403);
  });
});

// ─── Services ─────────────────────────────────────────────
describe('Services', () => {
  let serviceId;

  it('public can fetch services', async () => {
    const res = await request(app).get('/api/services');
    expect(res.status).toBe(200);
  });

  it('admin can create a service', async () => {
    const res = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Cloud Solutions', description: 'AWS/GCP/Azure cloud services.', icon: '☁️', order: 1 });
    expect(res.status).toBe(201);
    serviceId = res.body.data.service.id;
  });

  it('admin can update a service', async () => {
    const res = await request(app)
      .put(`/api/services/${serviceId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Cloud Solutions Updated' });
    expect(res.status).toBe(200);
  });

  it('admin can delete a service', async () => {
    const res = await request(app)
      .delete(`/api/services/${serviceId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});

// ─── Blogs ────────────────────────────────────────────────
describe('Blogs', () => {
  let blogId;

  it('admin can create a blog', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Blog Post',
        content: 'This is a test blog post content.',
        excerpt: 'A brief excerpt.',
        status: 'published',
      });
    expect(res.status).toBe(201);
    blogId = res.body.data.blog.id;
  });

  it('public can fetch published blogs', async () => {
    const res = await request(app).get('/api/blogs');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.blogs)).toBe(true);
  });

  it('slug is auto-generated', async () => {
    const res = await request(app).get('/api/blogs');
    expect(res.body.data.blogs[0].slug).toBeTruthy();
  });

  it('admin can delete a blog', async () => {
    const res = await request(app)
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});

// ─── Content Blocks ───────────────────────────────────────
describe('Content Blocks', () => {
  let blockId;

  it('admin can create a content block', async () => {
    const res = await request(app)
      .post('/api/content')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ section: 'hero', blockType: 'heading', title: 'Welcome', content: 'Hero content', order: 1 });
    expect(res.status).toBe(201);
    blockId = res.body.data.block.id;
  });

  it('public can fetch active content blocks', async () => {
    const res = await request(app).get('/api/content');
    expect(res.status).toBe(200);
  });

  it('admin can update a block', async () => {
    const res = await request(app)
      .put(`/api/content/${blockId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Updated Welcome' });
    expect(res.status).toBe(200);
  });
});

// ─── Admin Audit Trail ────────────────────────────────────
describe('Admin Audit Trail', () => {
  it('admin can view audit trail', async () => {
    const res = await request(app)
      .get('/api/admin/audit-trail')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.logs)).toBe(true);
  });

  it('employee cannot access audit trail', async () => {
    const res = await request(app)
      .get('/api/admin/audit-trail')
      .set('Authorization', `Bearer ${employeeToken}`);
    expect(res.status).toBe(403);
  });

  it('admin can view dashboard stats', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard-stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totalUsers).toBeDefined();
  });
});
