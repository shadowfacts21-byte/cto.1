# Test Plan - Team Collaboration SaaS (Orbit)

## Project Overview
A team collaboration SaaS with:
- **Backend**: Node.js/Express with SQLite (sql.js)
- **Frontend**: React with TypeScript, Tailwind CSS
- **Auth**: JWT-based authentication

## Repository Structure
```
/tmp/cto.1/
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app
│   │   ├── routes/             # API routes
│   │   ├── controllers/        # Route handlers
│   │   ├── models/             # Database models
│   │   ├── middleware/         # Auth middleware
│   │   └── db/                 # SQLite database
│   └── tests/                  # Integration tests
└── frontend/
    └── src/
        ├── components/         # UI components
        ├── pages/              # Page components
        ├── context/            # React context
        └── services/           # API services
```

## Test Coverage

### Backend API Tests (Jest + Supertest)
**Location**: `/home/team/shared/tests/backend_integration.test.js`

#### Auth Endpoints
| Endpoint | Tests |
|----------|-------|
| POST /api/auth/register | Valid registration, missing fields, duplicate email |
| POST /api/auth/login | Valid login, invalid password, non-existent email |
| GET /api/auth/me | Valid token, no token, invalid token |

#### Organization Endpoints
| Endpoint | Tests |
|----------|-------|
| POST /api/orgs | Create org, reject without auth |
| GET /api/orgs | List user orgs |
| GET /api/orgs/:slug | Get by slug, 404 for non-existent |

#### Project Endpoints
| Endpoint | Tests |
|----------|-------|
| POST /api/orgs/:slug/projects | Create project |
| GET /api/orgs/:slug/projects | List projects |
| GET /api/projects/:id | Get by id, 404 for non-existent |

#### Task Endpoints
| Endpoint | Tests |
|----------|-------|
| POST /api/tasks | Create task, reject without project_id |
| GET /api/tasks | List by project, require project_id |
| PATCH /api/tasks/:id | Update task |
| POST /api/tasks/:id/comments | Add comment |
| GET /api/tasks/:id/activity | Get activity |
| GET /api/tasks/:id/comments | Get comments |

#### Health Check
| Endpoint | Tests |
|----------|-------|
| GET /health | Returns status ok |

### Frontend Component Tests (Vitest + React Testing Library)
**Location**: `/home/team/shared/tests/frontend_component.test.js`

#### Login Page
- Email and password input fields
- Submit button presence
- Password visibility toggle
- Email format validation
- Loading state during submission
- Error message display on failure
- Button disabled state when loading

#### Register Page
- Name, email, password, confirm password fields
- Password requirement validation (8+ chars, uppercase, number)
- Password matching validation
- Loading state during registration

#### Modal Component
- Open/close behavior based on isOpen prop
- onClose called when backdrop clicked
- onClose called when close button clicked
- Title display

#### Header Component
- User avatar with initial
- User name display
- Logout button functionality
- Navigation links (logo → /, settings → /settings)

#### ProtectedRoute Component
- Redirect to /login when not authenticated
- Allow access when authenticated

#### Button Interactions
- Click handlers work
- Disabled buttons don't respond to clicks
- Hover state changes

#### Form Submissions
- authService.login called on login submit
- authService.register called on register submit

#### AuthContext
- Login stores token and user in localStorage
- Logout removes token and user from localStorage
- Token persistence on mount

## Integration Test Flows

### User Registration Flow
1. POST /api/auth/register with valid data → 201 + token
2. GET /api/auth/me with token → 200 + user info

### Full User Journey
1. Register new user
2. Login to get token
3. Create organization
4. Create project in organization
5. Create task in project
6. Add comment to task
7. View task activity

## Running Tests

### Backend Tests
```bash
cd /tmp/cto.1/backend
npm test
```

### Frontend Tests (requires dependencies)
```bash
cd /tmp/cto.1/frontend
npm install vitest @testing-library/react @testing-library/jest-dom jsdom
npm test
```

## Known Issues

1. **Database Initialization**: The db.initDb() must be called before tests
2. **Async DB Operations**: Some tests may timeout if DB operations are slow
3. **Test Isolation**: Each test file should use unique email slugs to avoid conflicts

## Recommendations

1. **Setup test database**: Use a separate test database file for isolation
2. **Add time tracking tests**: The project structure suggests time tracking exists at /api/time/*
3. **Add team/guest routes tests**: guestRoutes.js suggests team invitation functionality
4. **Frontend E2E tests**: Consider Playwright for full E2E testing
5. **API mocking**: For frontend unit tests, use MSW (Mock Service Worker) instead of vi.mock()