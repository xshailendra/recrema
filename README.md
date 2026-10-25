# Recrema

Recrema is a circular economy solution that upcycles spent coffee grounds into ingredients for cosmetics, pharmaceuticals, and other applications.

The repository contains two independent applications:

```text
frontend/  Next.js web application
backend/   Express and TypeScript API
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to the backend API base URL.

## Backend

```bash
cd backend
npm install
npm run dev
```

Configure the backend environment in `backend/.env`. The backend reads variables including `CLIENT_URL`, `NODE_ENV`, `COOKIE_NAME`, `JWT_SECRET`, and `MONGODB_URI`.

Build either application independently by running `npm run build` from its directory. The frontend and backend each have their own package manifest and lockfile.
