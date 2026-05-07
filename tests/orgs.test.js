const request = require('supertest');

// Helper to register a user and return token + user data
const createTestUser = async () => {
  const email = `qa-org-test-${Date.now()}@example.com`;
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email,
      password: 'password123',
      name: 'Org Test User'
    });
  return { token: res.body.token, user: res.body.user };
};

// Helper to create an org with the given user token
const createTestOrg = async (token, orgName, orgSlug) => {
  const res = await request(app)
    .post('/api/orgs')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: orgName, slug: orgSlug });
  return res.body;
};

// Helper to create a project in an org
const createTestProject = async (token, orgSlug, projectName, projectDescription) => {
  const res = await request(app)
    .post(`/api/orgs/${orgSlug}/projects`)
    .set('Authorization', `Bearer ${token}`)
    .send({ name: projectName, description: projectDescription });
  return res.body;
};

describe('Organization Endpoints', () => {
  let user1, user2, org1;

  beforeEach(async () => {
    user1 = await createTestUser();
    user2 = await createTestUser();
    org1 = await createTestOrg(user1.token, 'Test Organization', `test-org-${Date.now()}`);
  });

  describe('POST /api/orgs', () => {
    it('should create a new organization successfully', async () => {
      const res = await request(app)
        .post('/api/orgs')
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ name: 'New Org', slug: `new-org-${Date.now()}` });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'New Org');
      expect(res.body).toHaveProperty('slug');
    });

    it('should fail when name is missing', async () => {
      const res = await request(app)
        .post('/api/orgs')
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ slug: `no-name-${Date.now()}` });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should fail when slug is missing', async () => {
      const res = await request(app)
        .post('/api/orgs')
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ name: 'No Slug Org' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should fail with duplicate slug', async () => {
      await request(app)
        .post('/api/orgs')
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ name: 'First Org', slug: `dup-slug-${Date.now()}` });

      const res = await request(app)
        .post('/api/orgs')
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ name: 'Second Org', slug: `dup-slug-${Date.now()}` });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toMatch(/already taken/i);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/orgs')
        .send({ name: 'Unauthenticated Org', slug: `unauth-${Date.now()}` });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/orgs', () => {
    it('should list organizations for authenticated user', async () => {
      const res = await request(app)
        .get('/api/orgs')
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      // User1 should have at least org1
      expect(res.body.some(org => org.slug === org1.slug)).toBe(true);
    });

    it('should return empty array for user with no orgs', async () => {
      const res = await request(app)
        .get('/api/orgs')
        .set('Authorization', `Bearer ${user2.token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it('should fail without authentication', async () => {
      const res = await request(app).get('/api/orgs');

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/orgs/:slug', () => {
    it('should get organization details for member', async () => {
      const res = await request(app)
        .get(`/api/orgs/${org1.slug}`)
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Test Organization');
      expect(res.body).toHaveProperty('slug', org1.slug);
    });

    it('should return 403 for non-member', async () => {
      const res = await request(app)
        .get(`/api/orgs/${org1.slug}`)
        .set('Authorization', `Bearer ${user2.token}`);

      expect(res.statusCode).toEqual(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('should return 404 for non-existent org', async () => {
      const res = await request(app)
        .get('/api/orgs/non-existent-org')
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.statusCode).toEqual(404);
    });
  });
});

describe('Project Endpoints', () => {
  let user1, user2, org1, project1;

  beforeEach(async () => {
    user1 = await createTestUser();
    user2 = await createTestUser();
    org1 = await createTestOrg(user1.token, 'Project Test Org', `proj-org-${Date.now()}`);
    project1 = await createTestProject(user1.token, org1.slug, 'Test Project', 'A test project');
  });

  describe('POST /api/orgs/:slug/projects', () => {
    it('should create a project as org admin', async () => {
      const res = await request(app)
        .post(`/api/orgs/${org1.slug}/projects`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ name: 'New Project', description: 'A new project' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'New Project');
    });

    it('should fail when name is missing', async () => {
      const res = await request(app)
        .post(`/api/orgs/${org1.slug}/projects`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ description: 'No name project' });

      expect(res.statusCode).toEqual(400);
    });

    it('should return 403 for non-admin user', async () => {
      // Add user2 as member (non-admin)
      await request(app)
        .post(`/api/orgs/${org1.slug}/members`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ user_id: user2.user.id, role: 'member' });

      const res = await request(app)
        .post(`/api/orgs/${org1.slug}/projects`)
        .set('Authorization', `Bearer ${user2.token}`)
        .send({ name: 'Unauthorized Project' });

      expect(res.statusCode).toEqual(403);
    });

    it('should return 404 for non-existent org', async () => {
      const res = await request(app)
        .post('/api/orgs/non-existent/projects')
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ name: 'Project in Ghost Org' });

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('GET /api/orgs/:slug/projects', () => {
    it('should list projects in org for member', async () => {
      const res = await request(app)
        .get(`/api/orgs/${org1.slug}/projects`)
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some(p => p.name === 'Test Project')).toBe(true);
    });

    it('should return 403 for non-member', async () => {
      const res = await request(app)
        .get(`/api/orgs/${org1.slug}/projects`)
        .set('Authorization', `Bearer ${user2.token}`);

      expect(res.statusCode).toEqual(403);
    });

    it('should return 404 for non-existent org', async () => {
      const res = await request(app)
        .get('/api/orgs/non-existent/projects')
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should get project details for org member', async () => {
      const res = await request(app)
        .get(`/api/projects/${project1.id}`)
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Test Project');
    });

    it('should return 403 for non-member', async () => {
      const res = await request(app)
        .get(`/api/projects/${project1.id}`)
        .set('Authorization', `Bearer ${user2.token}`);

      expect(res.statusCode).toEqual(403);
    });

    it('should return 404 for non-existent project', async () => {
      const res = await request(app)
        .get('/api/projects/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.statusCode).toEqual(404);
    });
  });
});