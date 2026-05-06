# Backend Integration Test Plan

## Overview
This test plan covers the backend API integration tests for the Team Collaboration SaaS.

## Tech Stack
- **Test Framework**: Jest with supertest
- **Database**: SQLite via `team-db` CLI
- **Auth**: JWT-based authentication

---

## 1. Auth Endpoints

### 1.1 Register (`POST /api/auth/register`)
**Happy Path:**
- Register with valid email, password, and name → 201 + token returned

**Edge Cases:**
- Missing required fields (email, password, name) → 400
- Duplicate email registration → 400
- Empty string values → 400

### 1.2 Login (`POST /api/auth/login`)
**Happy Path:**
- Login with correct credentials → 200 + token returned

**Edge Cases:**
- Wrong password → 401
- Non-existent email → 401
- Missing email or password → 400
- Empty credentials → 400

### 1.3 Get Current User (`GET /api/auth/me`)
**Happy Path:**
- Valid JWT → 200 + user object returned

**Edge Cases:**
- No token provided → 401
- Invalid/expired token → 401
- Malformed authorization header → 401

---

## 2. Organizations

### 2.1 List Organizations (`GET /api/orgs`)
**Happy Path:**
- Authenticated user with org memberships → 200 + array of orgs

**Edge Cases:**
- No organizations → 200 + empty array

### 2.2 Create Organization (`POST /api/orgs`)
**Happy Path:**
- Create org with valid name and slug → 201 + org object

**Edge Cases:**
- Duplicate slug → 400
- Missing fields → 400
- Unauthorized (no token) → 401

### 2.3 Get Organization (`GET /api/orgs/:slug`)
**Happy Path:**
- Valid slug where user is member → 200 + org details

**Edge Cases:**
- Non-existent slug → 404
- User not a member → 403

---

## 3. Projects

### 3.1 List Projects (`GET /api/orgs/:slug/projects`)
**Happy Path:**
- List projects in org user belongs to → 200 + project array

**Edge Cases:**
- Non-existent org → 404
- User not member of org → 403

### 3.2 Create Project (`POST /api/orgs/:slug/projects`)
**Happy Path:**
- Create project with valid name, description → 201 + project object

**Edge Cases:**
- Missing required fields → 400
- User not admin of org → 403
- Org doesn't exist → 404

### 3.3 Get Project (`GET /api/projects/:id`)
**Happy Path:**
- Valid project ID in org user belongs to → 200 + project

**Edge Cases:**
- Non-existent project → 404
- User not org member → 403

---

## 4. Tasks

### 4.1 List Tasks (`GET /api/projects/:id/tasks`)
**Happy Path:**
- List tasks in project user has access to → 200 + task array

**Edge Cases:**
- Non-existent project → 404
- User no access → 403

### 4.2 Create Task (`POST /api/projects/:id/tasks`)
**Happy Path:**
- Create task with title, description, status, priority → 201 + task

**Edge Cases:**
- Missing title → 400
- Invalid status value → 400
- Project doesn't exist → 404

### 4.3 Update Task (`PATCH /api/tasks/:id`)
**Happy Path:**
- Update status, assignee, due_date → 200 + updated task

**Edge Cases:**
- Non-existent task → 404
- Invalid status enum → 400
- User not authorized → 403

### 4.4 Delete Task (`DELETE /api/tasks/:id`)
**Happy Path:**
- Delete existing task → 200

**Edge Cases:**
- Non-existent task → 404
- User not authorized → 403

---

## 5. Error Handling

### 5.1 Validation Errors
- Missing required fields returns 400 with descriptive message
- Invalid field types return 400

### 5.2 Authentication Errors
- No token returns 401 with "No token provided"
- Invalid token returns 401 with "Invalid token"

### 5.3 Authorization Errors
- Accessing resource without permission returns 403

### 5.4 Not Found Errors
- Non-existent resources return 404

---

## 6. Test Data Management
- Each test creates unique users/orgs/projects using timestamps
- Test data cleanup handled by database transaction rollback
- Use sequential naming to avoid conflicts