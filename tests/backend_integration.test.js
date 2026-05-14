/**
 * Backend Integration Test Suite
 * Tests all API endpoints: auth, orgs, projects, tasks, time tracking
 * 
 * Run with: cd /tmp/cto.1/backend && npm test
 */

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('Auth API Endpoints', () => {
  beforeAll(async () => {
    await db.initDb();
  });

  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Test User'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body.user).toHaveProperty('name', testUser.name);
      expect(res.body.user).toHaveProperty('id');
    });

    it('should reject registration with missing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ password: 'test', name: 'Test' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject registration with missing password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', name: 'Test' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject duplicate email registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'test' });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });
      
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/auth/me', () => {
    let loginToken;

    beforeAll(async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });
      loginToken = loginRes.body.token;
    });

    it('should return user info with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${loginToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('email', testUser.email);
    });

    it('should reject request without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');
      
      expect(res.statusCode).toEqual(401);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(res.statusCode).toEqual(401);
    });
  });
});

describe('Organization API Endpoints', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await db.initDb();
    const testUser = {
      email: `org-user-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Org User'
    };
    const regRes = await request(app).post('/api/auth/register').send(testUser);
    token = regRes.body.token;
    userId = regRes.body.user.id;
  });

  describe('POST /api/orgs', () => {
    it('should create an organization', async () => {
      const org = {
        name: 'Test Organization',
        slug: `test-org-${Date.now()}`
      };

      const res = await request(app)
        .post('/api/orgs')
        .set('Authorization', `Bearer ${token}`)
        .send(org);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('slug', org.slug);
      expect(res.body).toHaveProperty('name', org.name);
    });

    it('should reject create without auth', async () => {
      const res = await request(app)
        .post('/api/orgs')
        .send({ name: 'Test', slug: 'test' });
      
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/orgs', () => {
    it('should list user organizations', async () => {
      const res = await request(app)
        .get('/api/orgs')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/orgs/:slug', () => {
    let orgSlug;

    beforeAll(async () => {
      orgSlug = `get-org-${Date.now()}`;
      await request(app)
        .post('/api/orgs')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Get Org', slug: orgSlug });
    });

    it('should get organization by slug', async () => {
      const res = await request(app)
        .get(`/api/orgs/${orgSlug}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('slug', orgSlug);
    });

    it('should return 404 for non-existent org', async () => {
      const res = await request(app)
        .get('/api/orgs/non-existent-org')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST /api/orgs/:slug/projects', () => {
    let orgSlug;

    beforeAll(async () => {
      orgSlug = `proj-org-${Date.now()}`;
      await request(app)
        .post('/api/orgs')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Project Org', slug: orgSlug });
    });

    it('should create a project in an organization', async () => {
      const project = {
        name: 'Test Project',
        description: 'Test Project Description'
      };

      const res = await request(app)
        .post(`/api/orgs/${orgSlug}/projects`)
        .set('Authorization', `Bearer ${token}`)
        .send(project);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', project.name);
      expect(res.body).toHaveProperty('id');
    });

    it('should list projects in an organization', async () => {
      const res = await request(app)
        .get(`/api/orgs/${orgSlug}/projects`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

describe('Task API Endpoints', () => {
  let token;
  let projectId;
  let orgSlug;
  let userToken;

  beforeAll(async () => {
    await db.initDb();
    const testUser = {
      email: `task-user-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Task User'
    };
    const regRes = await request(app).post('/api/auth/register').send(testUser);
    token = regRes.body.token;
    userToken = token;

    orgSlug = `task-org-${Date.now()}`;
    await request(app)
      .post('/api/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Task Org', slug: orgSlug });

    const projRes = await request(app)
      .post(`/api/orgs/${orgSlug}/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Task Project', description: 'Test Project' });
    
    projectId = projRes.body.id;
  });

  describe('POST /api/tasks', () => {
    it('should create a task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          project_id: projectId,
          title: 'New Task',
          description: 'Task Description'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('title', 'New Task');
    });

    it('should reject task without project_id', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'No Project Task' });
      
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('GET /api/tasks', () => {
    it('should list tasks for a project', async () => {
      const res = await request(app)
        .get(`/api/tasks?project_id=${projectId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should require project_id query param', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /api/tasks/:id/comments', () => {
    let taskId;

    beforeAll(async () => {
      const tasksRes = await request(app)
        .get(`/api/tasks?project_id=${projectId}`)
        .set('Authorization', `Bearer ${token}`);
      taskId = tasksRes.body[0].id;
    });

    it('should add a comment to a task', async () => {
      const res = await request(app)
        .post(`/api/tasks/${taskId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Test Comment' });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('content', 'Test Comment');
    });
  });

  describe('GET /api/tasks/:id/activity', () => {
    let taskId;

    beforeAll(async () => {
      const tasksRes = await request(app)
        .get(`/api/tasks?project_id=${projectId}`)
        .set('Authorization', `Bearer ${token}`);
      taskId = tasksRes.body[0].id;
    });

    it('should get activity for a task', async () => {
      const res = await request(app)
        .get(`/api/tasks/${taskId}/activity`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    let taskId;

    beforeAll(async () => {
      const tasksRes = await request(app)
        .get(`/api/tasks?project_id=${projectId}`)
        .set('Authorization', `Bearer ${token}`);
      taskId = tasksRes.body[0].id;
    });

    it('should update a task', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Task Title', status: 'in-progress' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('title', 'Updated Task Title');
    });
  });
});

describe('Project API Endpoints', () => {
  let token;
  let projectId;
  let orgSlug;

  beforeAll(async () => {
    await db.initDb();
    const testUser = {
      email: `proj-user-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Project User'
    };
    const regRes = await request(app).post('/api/auth/register').send(testUser);
    token = regRes.body.token;

    orgSlug = `proj-org-${Date.now()}`;
    await request(app)
      .post('/api/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Project Org', slug: orgSlug });

    const projRes = await request(app)
      .post(`/api/orgs/${orgSlug}/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Project', description: 'Test Description' });
    
    projectId = projRes.body.id;
  });

  describe('GET /api/projects/:id', () => {
    it('should get project by id', async () => {
      const res = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', projectId);
    });

    it('should return 404 for non-existent project', async () => {
      const res = await request(app)
        .get('/api/projects/non-existent-id')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
    });
  });
});

describe('Health Check', () => {
  it('GET /health should return ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});