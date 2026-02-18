import { db } from "@/lib/db";
import { Recording } from "@/types/recording";

class SyncEngine {
  private isProcessing = false;
  private activeUploads = new Map<string, AbortController>();

  async processQueue() {
    if (this.isProcessing) return;
    if (!navigator.onLine) return;

    this.isProcessing = true;

    const queued = await db.recordings
      .where("status")
      .anyOf("local", "failed")
      .toArray();

    for (const recording of queued) {
      await this.uploadWithRetry(recording);
    }

    this.isProcessing = false;
  }

  private async uploadWithRetry(recording: Recording) {
    try {
      await db.recordings.update(recording.id, {
        status: "uploading",
      });

      await this.upload(recording);

      await db.recordings.update(recording.id, {
        status: "synced",
        lastError: undefined,
      });

      // delete local blob after success
      await db.recordings.delete(recording.id);
    } catch (error: any) {
      const attempts = recording.uploadAttempts + 1;

      if (attempts >= 3) {
        await db.recordings.update(recording.id, {
          status: "failed",
          uploadAttempts: attempts,
          lastError: error.message,
        });
        return;
      }

      await db.recordings.update(recording.id, {
        status: "failed",
        uploadAttempts: attempts,
        lastError: error.message,
      });

      await this.delay(this.backoff(attempts));
      await this.uploadWithRetry({
        ...recording,
        uploadAttempts: attempts,
      });
    }
  }

  private async upload(recording: Recording) {
    const controller = new AbortController();
    this.activeUploads.set(recording.id, controller);

    const formData = new FormData();
    formData.append("file", recording.blob, recording.filename);
    formData.append("id", recording.id);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    this.activeUploads.delete(recording.id);

    if (!response.ok) {
      throw new Error("Upload failed");
    }
  }

  private backoff(attempt: number) {
    return Math.min(1000 * 2 ** attempt, 8000);
  }

  private delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async retryOne(id: string) {
    const recording = await db.recordings.get(id);
    if (!recording) return;
    await this.uploadWithRetry(recording);
  }

  cancelUpload(id: string) {
    const controller = this.activeUploads.get(id);
    if (controller) {
      controller.abort();
      this.activeUploads.delete(id);
    }
  }
}

export const syncEngine = new SyncEngine();
