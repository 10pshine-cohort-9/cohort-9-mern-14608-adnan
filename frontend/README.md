# Frontend

React + TypeScript + Vite frontend for the Notes App.

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui (Base UI), react-router, ky, Tiptap

## Setup

```bash
npm install
cp .env.example .env
```

Set `VITE_API_URL` in `.env` to point at the backend (default: `http://localhost:5000/api`).

## Scripts

```bash
npm run dev       # start dev server
npm run build     # production build
npm test          # run Jest tests
```

Runs on `http://localhost:5173`. Requires the backend running for auth/notes to work.
