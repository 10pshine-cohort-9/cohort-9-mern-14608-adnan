# Notes App

A full-stack notes application built for the 10Pearls Shine Program (Cohort 9, MERN track).
Users can sign up, log in, and create, edit, and delete notes with a rich text editor
every note is scoped to its owner.

Built entirely in TypeScript instead of plain JavaScript, since the repo's CodeRabbit
configuration flags missing types as HIGH severity.

---

## Tech Stack

### Backend
- **Node.js** + **Express**, written in TypeScript using native ES modules
- **MongoDB** + **Mongoose**
- **JWT** authentication stored in an httpOnly cookie
- **bcrypt** for password hashing
- **Pino** for structured logging
- **express-validator** for input validation
- **express-rate-limit** on auth endpoints
- **Mocha** + **Chai** + **Supertest** for integration testing
- **c8** for code coverage (emits `backend/coverage/lcov.info`)

### Frontend
- **React 19** + **TypeScript**, built with **Vite**
- **Tailwind CSS v4**
- **shadcn/ui** built on **Base UI** (not Radix) with **hugeicons**
- **react-router** (not `react-router-dom`, discontinued in v8)
- **ky** for HTTP requests (not axios, axios had a supply chain compromise and a
  separate critical CVE; ky is smaller, fetch-based, and has no dependencies)
- **Tiptap** for the rich text note editor
- **Jest** + **Testing Library** for component testing (collects coverage via
  `collectCoverage: true`, emitting `frontend/coverage/lcov.info`)

### Tooling
- **SonarQube** for static code quality analysis
- **CodeRabbit** for automated PR review

---

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # env validation, db connection, logger (createLogger factory)
│   │   ├── controllers/     # route handlers
│   │   ├── middleware/      # auth, validation, error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routers
│   │   ├── types/           # ambient type augmentations
│   │   ├── utils/           # helpers (JWT signing, custom errors)
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # entrypoint (startup validation + controlled exit path)
│   └── test/                 # Mocha/Chai/Supertest integration tests
├── frontend/
│   ├── src/
│   │   ├── components/       # shared UI (shadcn components, ProtectedRoute, ThemeToggle)
│   │   ├── context/           # auth context + provider
│   │   ├── hooks/              # useAuth
│   │   ├── lib/                 # ky http client, cn() utility
│   │   ├── pages/                # Login, Signup, Dashboard, NoteEditor, Profile
│   │   ├── test-utils/            # test-only mocks (react-router)
│   │   └── App.tsx
│   └── test files live alongside components in __tests__/ folders
├── SonarQube-Report/        # Quality Gate report (html/pdf/json) + dashboard screenshots
└── sonar-project.properties  # SonarQube analysis config (sources, LCOV paths, exclusions)
```

---

## Getting Started

### Prerequisites
- Node.js 22.22.0+
- A MongoDB connection string (local MongoDB or MongoDB Atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

```
CLIENT_URL=http://localhost:5173
JWT_EXPIRES_IN=7d
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
MONGO_URI=<your MongoDB connection string>
NODE_ENV=development
PORT=5000
```

```bash
npm run dev       # start dev server with hot reload
npm run build     # compile TypeScript to dist/
npm start         # run the compiled build
npm test          # run the Mocha/Chai/Supertest suite
```

Backend runs on `http://localhost:5000`. Health check: `GET /api/health`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Fill in `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev        # start Vite dev server
npm run build      # production build
npm run typecheck  # check TypeScript types
npm test           # run the Jest suite
```

Frontend runs on `http://localhost:5173`. Requires the backend running for auth/notes
to work.

### Running Both

```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend && npm run dev
```

Then open `http://localhost:5173`.

---

## API Reference

All responses follow `{ success: boolean, data?, message?, errors? }`.

### Auth

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Log in, sets the JWT cookie |
| POST | `/api/auth/logout` | Yes | Clears the JWT cookie |
| GET | `/api/auth/me` | Yes | Get the current user |

### Notes

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| GET | `/api/notes` | Yes | List the current user's notes |
| GET | `/api/notes/:id` | Yes | Get a single note (must be owned by the user) |
| POST | `/api/notes` | Yes | Create a note |
| PUT | `/api/notes/:id` | Yes | Update a note (must be owned by the user) |
| DELETE | `/api/notes/:id` | Yes | Delete a note (must be owned by the user) |

Auth is via an httpOnly cookie. The frontend never handles the token directly, it
just sends requests with `credentials: "include"`.

---

## Database Schema

**User**
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | primary key |
| `name` | String | required |
| `email` | String | required, unique |
| `password` | String | hashed with bcrypt, never returned in responses |
| `createdAt` / `updatedAt` | Date | automatic |

**Note**
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | primary key |
| `title` | String | required |
| `content` | String | HTML from the rich text editor |
| `user` | ObjectId | foreign key → `User._id`, indexed |
| `createdAt` / `updatedAt` | Date | automatic |

One user has many notes (one-to-many). Every note query is scoped by the authenticated
user's ID at the database level.

---

## Security Notes

- Passwords hashed with bcrypt before being saved
- JWT stored in an httpOnly cookie, never exposed to JavaScript
- Rate limiting on `/api/auth/register` and `/api/auth/login`
- `helmet` for baseline security headers
- Request/response logging with sensitive headers (cookies, authorization) redacted
- Global error handler returns generic messages in production, full detail only in
  development/test
- Environment variables validated at startup. The app refuses to start with a
  missing or too-short `JWT_SECRET` or a missing `MONGO_URI`

---

## Branching & Workflow

Following the 10Pearls Shine branching strategy:

- `main`: production-ready code
- `develop`: integration branch
- `feature/backend/<name>` / `feature/frontend/<name>`: feature branches
- `bugfix/backend/<name>` / `bugfix/frontend/<name>`: bugfix branches

Every PR targets `develop` and goes through CodeRabbit's automated review before
merging. Feature branches are stacked (each one branches off the previous unmerged
branch rather than waiting) and rebased onto `develop` once earlier PRs merge.

---

## Testing

```bash
cd backend && npm test    # Mocha/Chai/Supertest - real API + database integration tests
cd frontend && npm test   # Jest + Testing Library - component tests
```

Both `npm test` runs also emit LCOV coverage (`backend/coverage/lcov.info` and
`frontend/coverage/lcov.info`) that feed the SonarQube analysis. The generated
`coverage/` directories are gitignored.

Backend tests connect to the same `MONGO_URI` as development but scope all cleanup to
accounts created by the test run itself (matched by a unique per-test email), so they
never touch unrelated data.

---

## Code Quality

- **CodeRabbit** reviews every PR automatically, flags missing TypeScript types,
  async code without error handling, and React component/prop issues, per this repo's
  `.coderabbit.yaml`.
- **SonarQube** (self-hosted): the **Quality Gate is currently passing**:
  `new_coverage` 85.7%, `new_duplicated_lines_density` 0.0%, `new_violations` 0.
  - Backend coverage is produced by `c8`; frontend coverage by Jest with
    `collectCoverage: true`.
  - `sonar-project.properties` at the repo root wires both LCOV reports and the
    source/coverage exclusions.
  - Run it locally:
    ```bash
    docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community
    npm install -g sonar-scanner
    sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.token=$SONAR_TOKEN
    ```
  - The latest passing scan's dashboard screenshots (new-code and overall views) and
    gate summary live in `SonarQube-Report/` (`quality-gate-report.pdf` +
    `screenshots/`).
