# 🩺 CareMates Recorder – Offline-First PWA

A lightweight Progressive Web App (PWA) that allows caregivers to record patient admission audio offline and automatically synchronize recordings once connectivity is restored.

This application was built as part of the CareMates coding challenge.

---

## 🚀 Live Demo

🔗 **Deployed URL:**  
https://your-deployment-url.com

🔗 **GitHub Repository:**  
https://github.com/your-username/care-mates-pwa

---

## 🎯 Core Features

### 🎤 Recording Management

- Record audio using the MediaRecorder API
- Store recordings locally using IndexedDB
- Display recordings with metadata:
  - Filename
  - Timestamp
  - Status
- Local playback
- Delete recordings
- Proper microphone cleanup after recording stops

---

### 🔄 Offline-First Sync Engine

- Persistent upload queue stored in IndexedDB
- Automatic connectivity detection (online/offline)
- Automatic background sync when connection is restored
- Sequential upload processing
- Exponential backoff retry strategy (max 3 attempts)
- Manual retry for failed uploads
- Abort upload if user deletes recording during upload
- Delete local recording after successful upload

---

### 📱 PWA Features

- Service Worker with app shell caching
- Installable on desktop and mobile
- Offline UI support
- Persistent storage request
- Production-ready configuration using `next-pwa`

---

## 🧠 Architecture Overview

The application follows an offline-first architecture:

UI (React)  
↓  
RecorderService (MediaRecorder API)  
↓  
IndexedDB (Dexie)  
↓  
SyncEngine (Queue Processor)  
↓  
Next.js API Upload Endpoint

### Why IndexedDB?

- Supports large audio blobs
- Asynchronous
- Persistent across sessions
- Survives browser refresh

---

## 🔁 Sync Strategy

**Queue definition:**  
Recordings with status `"local"` or `"failed"`

**Sync flow:**

1. When online, process queue sequentially
2. Update status to `"uploading"`
3. On success → delete from IndexedDB
4. On failure → retry with exponential backoff

**Backoff formula:**

delay = min(1000 \* 2^attempt, 8000)

**Max retries:** 3

---

## ⚠️ Edge Cases Handled

- Offline recording
- Page reload while offline
- Delete during upload (AbortController)
- Retry after network failure
- Memory cleanup using `URL.revokeObjectURL`
- Microphone track cleanup
- Persistent storage request

---

## 🛠 Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- Dexie (IndexedDB wrapper)
- next-pwa
- MediaRecorder API

---

## 📦 Installation

Install dependencies:

yarn install

Run in development mode:

yarn dev

Production build (PWA enabled):

yarn build  
yarn start

---

## 🧪 Suggested Testing Scenarios

1. Record while offline
2. Close and reopen the browser
3. Restore connectivity and verify automatic sync
4. Simulate server failure and verify retry behavior
5. Delete during upload and ensure request abort

---

## 🔐 Idempotency Strategy

Each recording uses a UUID as identifier.  
The backend receives both the `recording.id` and the audio file, allowing safe reprocessing and preventing duplicate uploads.

---

## 📈 Possible Improvements

- Upload progress indicator
- Integration with cloud storage (S3, Supabase, etc.)
- Background Sync API usage
- Authentication layer
- Audio compression before upload

---

## 👤 Author

Your Name  
your.email@example.com
