# Team Collaboration SaaS Architecture

## 1. Tech Stack
- **Backend**: Node.js with Express.js
- **Frontend**: React with Vite
- **Database**: SQLite (via Turso for production/sync)
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS (recommended)

## 2. Database Schema

### `users`
| Column | Type | Description |
| --- | --- | --- |
| id | UUID/String | Primary Key |
| email | String | Unique email address |
| password_hash | String | Hashed password |
| name | String | Full name |
| created_at | Timestamp | Record creation time |
| updated_at | Timestamp | Last update time |

### `organizations`
| Column | Type | Description |
| --- | --- | --- |
| id | UUID/String | Primary Key |
| name | String | Organization name |
| slug | String | Unique URL-friendly identifier |
| created_at | Timestamp | Record creation time |
| updated_at | Timestamp | Last update time |

### `organization_members`
| Column | Type | Description |
| --- | --- | --- |
| organization_id | UUID/String | Foreign Key to organizations |
| user_id | UUID/String | Foreign Key to users |
| role | String | 'admin' or 'member' |
| joined_at | Timestamp | When the user joined the org |

### `projects`
| Column | Type | Description |
| --- | --- | --- |
| id | UUID/String | Primary Key |
| organization_id | UUID/String | Foreign Key to organizations |
| name | String | Project name |
| description | Text | Project description |
| created_at | Timestamp | Record creation time |
| updated_at | Timestamp | Last update time |

### `app_tasks`
| Column | Type | Description |
| --- | --- | --- |
| id | UUID/String | Primary Key |
| project_id | UUID/String | Foreign Key to projects |
| title | String | Task title |
| description | Text | Task description |
| status | String | 'todo', 'in-progress', 'done' |
| priority | String | 'low', 'medium', 'high' |
| assigned_to | UUID/String | Foreign Key to users (optional) |
| due_date | Timestamp | Optional due date |
| created_at | Timestamp | Record creation time |
| updated_at | Timestamp | Last update time |

## 3. API Contracts (REST)

### Auth
- `POST /api/auth/register`: Create a new user account.
- `POST /api/auth/login`: Authenticate user and return JWT.
- `GET /api/auth/me`: Get current authenticated user details.

### Organizations
- `GET /api/orgs`: List organizations user belongs to.
- `POST /api/orgs`: Create a new organization.
- `GET /api/orgs/:slug`: Get organization details.
- `POST /api/orgs/:slug/members`: Add a member to an organization (Admin only).

### Projects
- `GET /api/orgs/:slug/projects`: List projects in an organization.
- `POST /api/orgs/:slug/projects`: Create a new project in an organization (Plan limits apply).
- `GET /api/projects/:id`: Get project details.

### Tasks
- `GET /api/tasks?project_id=...`: List tasks in a project.
- `POST /api/tasks`: Create a new task (send `project_id` in body).
- `GET /api/tasks/:id`: Get task details.
- `PATCH /api/tasks/:id`: Update a task.
- `DELETE /api/tasks/:id`: Delete a task.
- `POST /api/tasks/:id/comments`: Add a comment to a task.
- `GET /api/tasks/:id/comments`: Get comments for a task.
- `GET /api/tasks/:id/activity`: Get activity log for a task.

### Billing
- `GET /api/billing/plan`: Get current plan and subscription details.
- `POST /api/billing/upgrade`: Upgrade or change plan (mocked).
- `POST /api/billing/cancel`: Cancel subscription and revert to free plan.

## 4. Plan Limits
- **Free**: 3 projects per organization.
- **Pro**: 20 projects per organization.
- **Enterprise**: 1000 projects per organization.

## 4. Project Folder Structure

```
/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Database models/queries
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Auth, error handling, etc.
│   │   ├── services/       # Business logic
│   │   ├── db/             # Database connection/migration
│   │   └── app.js          # Express app entry point
│   ├── tests/              # Backend tests
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context (Auth, etc.)
│   │   ├── api/            # API client (Axios/Fetch)
│   │   ├── utils/          # Helpers
│   │   └── App.jsx         # Main React component
│   ├── .env.example
│   └── package.json
└── README.md
```
