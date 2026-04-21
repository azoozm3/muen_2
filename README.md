# Mu'en

Mu'en is a full-stack medical support platform built with React, Vite, Express, MongoDB, and Mongoose.

## Main roles
- Patient
- Doctor
- Nurse
- Volunteer
- Admin

## Core flows
- Emergency requests
- Doctor appointments
- Nurse requests
- Volunteer requests
- Ratings and reviews
- Admin dashboards
- PayPal payments
- Zoom online appointments

## Stack
- Frontend: React, Vite, Wouter, TanStack Query, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth/session: express-session + connect-mongo
- Payments: PayPal
- Video: Zoom

## Run locally

1. Copy `.env.example` to `.env`
2. Add your real environment values
3. Install dependencies
4. Start the app

```bash
npm install
npm run dev
```

Default local server:
- App: `http://localhost:5000`

## Notes
- Do not commit `.env`
- Use fresh `npm install` instead of sharing `node_modules`
- PayPal falls back to mock mode when credentials are missing
- Runtime seeding is disabled by default; run `npm run seed` explicitly for sample data
