# Movies Reviews Service

Node.js + TypeScript REST API for reviews (many-to-one with movies). Validates movies via the Movies service and stores reviews in MongoDB.

## Stack
- Node.js (ESM), Express 5, Mongoose 9, Zod for validation
- Jest + Supertest + mongodb-memory-server for integration tests
- Axios for movie existence check, CORS enabled

## Prerequisites
- Node.js 18+
- MongoDB instance (or in-memory via `USE_IN_MEMORY_DB=true`)
- Running Movies service reachable at `MOVIES_SERVICE_URL`

## Setup
1) Install deps: `npm install`
2) Configure environment (`.env` example):
   - `PORT=3000`
   - `NODE_ENV=dev`
   - `MONGO_URI=mongodb://admin:secret@localhost:27017/movies_reviews?authSource=admin`
   - `MOVIES_SERVICE_URL=http://localhost:8080/api/movies`
   - `SKIP_MOVIES_VALIDATION=true` (optional, useful for local/testing)
   - `USE_IN_MEMORY_DB=true` (optional, starts ephemeral MongoDB in `src/server.ts`)
3) Build for prod: `npm run build`

## Run
- Dev (TS, live reload): `npm run dev`
- Prod (after build): `npm start`
- Lint: `npm run lint`
- Tests (integration): `npm test`

## Data Model (Review)
- `movieId`: string, required, indexed
- `author`: string, required
- `comment`: string, optional (if present 1..2000 chars)
- `rating`: number 0–10, required
- `createdAt`: auto timestamp (can be provided as ISO string; `updatedAt` disabled)

## API (base path: `/api`)
- `POST /reviews`
  - Body: `{ movieId, author, comment?, rating, createdAt? }`
  - Validates movie existence via `MOVIES_SERVICE_URL` unless `SKIP_MOVIES_VALIDATION=true`.
  - Responses: 201 created; 400 validation/movie not found.
- `GET /reviews`
  - Query: `movieId` (required), `size` (1–100, default 10), `from` (offset, default 0)
  - Returns reviews for the movie sorted by `createdAt` desc.
- `POST /reviews/_counts`
  - Body: `{ movieIds: [string|number, ...] }`
  - Returns map of `{ [movieId]: count }` using aggregation (no review fetch).

## Testing Notes
- Jest config: `jest.config.js`, uses ESM preset and `src/tests/setup.ts`.
- Tests spin up an in-memory MongoDB and mock the Movies service with axios spies (`reviews.test.ts`).
- Collections are cleared after each test run.

## Additional Notes
- Mongo indexes on `movieId` and `createdAt` support sorting/filtering.
- Global error handler returns `{ message }` with status code; unknown errors => 500.
