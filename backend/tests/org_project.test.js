const request = require('supertest');
const app = require('../src/app');

describe('Organizations and Projects API', () => {
  let token;
  let userId;
  const testUser = {
    email: `org-test-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Org Test User'
  };

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    token = res.body.token;
    userId = res.body.user.id;
  });

  const testOrg = {
    name: 'Test Organization',
    slug: `test-org-${Date.now()}`
  };

  it('should create a new organization', async () => {
    const res = await request(app)
      .post('/api/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send(testOrg);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('slug', testOrg.slug);
  });

  it('should list organizations for user', async () => {
    const res = await request(app)
      .get('/api/orgs')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(o => o.slug === testOrg.slug)).toBe(true);
  });

  it('should create a project in an organization', async () => {
    const testProject = {
      name: 'Test Project',
      description: 'Test Project Description'
    };

    const res = await request(app)
      .post(`/api/orgs/${testOrg.slug}/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send(testProject);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', testProject.name);
    expect(res.body).toHaveProperty('id');
  });

  it('should list projects in an organization', async () => {
    const res = await request(app)
      .get(`/api/orgs/${testOrg.slug}/projects`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
