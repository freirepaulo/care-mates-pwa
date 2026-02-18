# CareMates PWA – Offline-First Audio Recorder

Public URL: https://care-mates-pwa-6hhc.vercel.app/

## Overview

CareMates PWA is an offline-first Progressive Web App that allows users to record audio, store recordings locally using IndexedDB, and automatically synchronize them with a backend when connectivity is restored. The system is designed with resilience, data integrity, and real-world synchronization patterns in mind.

## Tech Stack

Frontend:

- Next.js 16 (App Router)
- React 19
- TypeScript
- TailwindCSS
- IndexedDB (Dexie)
- PWA (Service Worker + Manifest)

Backend:

- Next.js API Routes
- SQLite (better-sqlite3)
- Idempotent upload handling

## Architecture

The application follows an offline-first approach.

When a recording is created:

- The audio Blob is stored locally in IndexedDB
- The recording is marked with status "local"
- The UI updates immediately without requiring network access

When the device reconnects:

- A synchronization engine processes pending recordings
- Uploads are sent to POST /api/upload
- Status transitions from "local" to "uploading" to "synced"
- Failed uploads can be retried safely

The backend uses SQLite for persistence. Metadata is stored in /data/recordings.db in a table called "recordings" containing:

- id
- filename
- uploadedAt

Uploads are idempotent. If a recording with the same ID already exists, the API safely returns success without duplicating data.

## Client–Server Reconciliation

On application startup:

1. Pending uploads are processed
2. The client fetches GET /api/recordings
3. Local IndexedDB state is reconciled with server state
4. Confirmed items are marked as "synced"

The UI displays a status indicator such as:

Synced with server (X items)

This guarantees consistency between client and backend.

## API Endpoints

POST /api/upload  
Accepts FormData with:

- file
- id  
  Performs validation, idempotency check, and SQLite persistence.

GET /api/recordings  
Returns all persisted recordings for reconciliation and auditing.

## Running Locally

Install dependencies:

npm install

Run development server:

npm run dev

Open in browser:

http://localhost:3000

The SQLite database file is automatically created inside the /data directory.

## Deployment

Deployed on Vercel:

https://care-mates-pwa-6hhc.vercel.app/

Node version is fixed in package.json:

"engines": {
"node": "20.19.0"
}

## Summary

This project demonstrates:

- Offline-first architecture
- Robust synchronization logic
- Idempotent API design
- Client–server reconciliation
- Progressive Web App capabilities
- Graceful handling of network instability

The system prioritizes reliability and data integrity while maintaining a clean and lightweight architecture.
