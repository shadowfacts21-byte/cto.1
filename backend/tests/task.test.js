const request = require('supertest');
const app = require('../src/app');

describe('Task Endpoints', () => {
  let token;
  let projectId;
  let orgSlug = `task-org-${Date.now()}`;

  beforeAll(async () => {
    // Register and login a user to get token
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User'
    };
    const regRes = await request(app).post('/api/auth/register').send(testUser);
    token = regRes.body.token;

    // Create org
    await request(app)
      .post('/api/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Task Org', slug: orgSlug });

    // Create project
    const projRes = await request(app)
      .post(`/api/orgs/${orgSlug}/projects`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Task Project', description: 'Test Project' });
    
    projectId = projRes.body.id;
  });

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

  it('should list tasks for a project', async () => {
    const res = await request(app)
      .get(`/api/tasks?project_id=${projectId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should add a comment to a task', async () => {
    const tasksRes = await request(app)
      .get(`/api/tasks?project_id=${projectId}`)
      .set('Authorization', `Bearer ${token}`);
    
    const taskId = tasksRes.body[0].id;

    const res = await request(app)
      .post(`/api/tasks/${taskId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Test Comment' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('content', 'Test Comment');
  });

  it('should get activity for a task', async () => {
    const tasksRes = await request(app)
      .get(`/api/tasks?project_id=${projectId}`)
      .set('Authorization', `Bearer ${token}`);
    
    const taskId = tasksRes.body[0].id;

    const res = await request(app)
      .get(`/api/tasks/${taskId}/activity`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
});
