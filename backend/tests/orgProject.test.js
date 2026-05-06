const request = require('supertest');
const app = require('../src/app');

describe('Organization and Project Endpoints', () => {
  let token;
  let user;
  let orgSlug = `test-org-${Date.now()}`;

  beforeAll(async () => {
    // Register and login a user to get token
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User'
    };
    const res = await request(app).post('/api/auth/register').send(testUser);
    token = res.body.token;
    user = res.body.user;
  });

  it('should create an organization', async () => {
    const res = await request(app)
      .post('/api/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Org', slug: orgSlug });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('slug', orgSlug);
  });

  it('should list organizations for user', async () => {
    const res = await request(app)
      .get('/api/orgs')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.some(o => o.slug === orgSlug)).toBeTruthy();
  });

  it('should create a project in an organization', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgSlug}/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Project', description: 'Test Description' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test Project');
  });

  it('should list projects in an organization', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgSlug}/projects`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
});
