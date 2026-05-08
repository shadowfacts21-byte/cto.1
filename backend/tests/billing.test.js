const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('Billing and Plan Limits', () => {
  let token;
  let userId;
  let orgSlug = `billing-org-${Date.now()}`;

  jest.setTimeout(30000); // Increase timeout for slow DB sync

  beforeAll(async () => {
    // Register and login
    const testUser = {
      email: `billing-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Billing User'
    };
    const regRes = await request(app).post('/api/auth/register').send(testUser);
    token = regRes.body.token;
    userId = regRes.body.user.id;

    // Create org
    await request(app)
      .post('/api/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Billing Org', slug: orgSlug });
  });

  it('should get default free plan', async () => {
    const res = await request(app)
      .get('/api/billing/plan')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.plan).toEqual('free');
  });

  it('should upgrade to pro plan', async () => {
    const res = await request(app)
      .post('/api/billing/upgrade')
      .set('Authorization', `Bearer ${token}`)
      .send({ plan: 'pro' });
    
    expect(res.statusCode).toEqual(200);
    
    const planRes = await request(app)
      .get('/api/billing/plan')
      .set('Authorization', `Bearer ${token}`);
    expect(planRes.body.plan).toEqual('pro');
  });

  it('should enforce project limits on free plan', async () => {
    // Downgrade to free
    await request(app)
      .post('/api/billing/cancel')
      .set('Authorization', `Bearer ${token}`);

    // Create 3 projects (limit for free is 3)
    for (let i = 1; i <= 3; i++) {
      const res = await request(app)
        .post(`/api/orgs/${orgSlug}/projects`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `Project ${i}` });
      expect(res.statusCode).toEqual(201);
    }

    // Attempt to create 4th project
    const res4 = await request(app)
      .post(`/api/orgs/${orgSlug}/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Project 4' });
    
    expect(res4.statusCode).toEqual(403);
    expect(res4.body.error).toMatch(/Plan limit reached/);
  });
});
