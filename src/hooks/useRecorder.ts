"use client";

import { db } from "@/lib/db";
import { RecorderService } from "@/lib/recorder";
import { Recording } from "@/types/recording";
import { useCallback, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<RecorderService | null>(null);

  const start = useCallback(async () => {
    try {
      recorderRef.current = new RecorderService();
      await recorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Mic permission denied", error);
    }
  }, []);

  const stop = useCallback(async () => {
    if (!recorderRef.current) return;

    const blob = await recorderRef.current.stop();
    recorderRef.current = null;
    setIsRecording(false);

    const newRecording: Recording = {
      id: uuidv4(),
      filename: `recording-${Date.now()}.webm`,
      duration: 0,
      fileSize: blob.size,
      recordedAt: new Date().toISOString(),
      status: "local",
      uploadAttempts: 0,
      blob,
    };

    await db.recordings.add(newRecording);
  }, []);

  return { isRecording, start, stop };
}
