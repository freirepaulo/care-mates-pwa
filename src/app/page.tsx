"use client";

import { RecordingCard } from "@/components/RecordingCard";
import { db } from "@/lib/db";
import { RecorderService } from "@/lib/recorder";
import { syncEngine } from "@/lib/sync-engine";
import { Recording } from "@/types/recording";
import { reconcileWithServer } from "@/util/helpers";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [serverCount, setServerCount] = useState<number | null>(null);
  const recorderRef = useRef<RecorderService | null>(null);

  const recordings = useLiveQuery(
    () => db.recordings.orderBy("recordedAt").reverse().toArray(),
    [],
  );

  useEffect(() => {
    async function bootstrap() {
      await syncEngine.processQueue();

      const count = await reconcileWithServer();
      setServerCount(count);
    }

    bootstrap();

    const requestPersistence = async () => {
      if (navigator.storage && navigator.storage.persist) {
        const granted = await navigator.storage.persist();
        console.log("Persistent storage granted:", granted);
      }
    };

    requestPersistence();

    const trySync = async () => {
      if (navigator.onLine) {
        await syncEngine.processQueue();
      }
    };

    trySync();

    const handleOnline = () => {
      trySync();
    };

    window.addEventListener("online", handleOnline);

    const interval = setInterval(() => {
      trySync();
    }, 5000);

    return () => {
      window.removeEventListener("online", handleOnline);
      clearInterval(interval);
    };
  }, []);

  async function handleStart() {
    try {
      recorderRef.current = new RecorderService();
      await recorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Mic permission denied", error);
    }
  }

  async function handleStop() {
    if (!recorderRef.current) return;

    const blob = await recorderRef.current.stop();
    setIsRecording(false);

    const newRecording: Recording = {
      id: uuidv4(),
      filename: `recording-${Date.now()}.webm`,
      duration: 0, // we'll improve later
      fileSize: blob.size,
      recordedAt: new Date().toISOString(),
      status: "local",
      uploadAttempts: 0,
      blob,
    };

    await db.recordings.add(newRecording);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">CareMates Recorder</h1>

        <button
          onClick={isRecording ? handleStop : handleStart}
          className={`w-full py-3 rounded-xl shadow transition ${
            isRecording
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isRecording ? "⏹ Stop Recording" : "🎤 Start Recording"}
        </button>

        {serverCount !== null && (
          <div className="mb-4 flex justify-center">
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
              🟢 Synced with server ({serverCount} items)
            </div>
          </div>
        )}

        <div className="space-y-4">
          {recordings?.map((recording) => (
            <RecordingCard key={recording.id} recording={recording} />
          ))}
        </div>
      </div>
    </main>
  );
}
