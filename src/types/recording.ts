export type RecordingStatus = "local" | "uploading" | "synced" | "failed";

export interface Recording {
  id: string;
  filename: string;
  duration: number;
  fileSize: number;
  recordedAt: string;
  status: RecordingStatus;
  uploadAttempts: number;
  lastError?: string;
  blob: Blob;
}
