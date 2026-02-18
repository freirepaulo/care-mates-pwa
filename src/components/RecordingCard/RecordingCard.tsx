"use client";

import { db } from "@/lib/db";
import { syncEngine } from "@/lib/sync-engine";
import { Recording } from "@/types/recording";
import { useEffect, useMemo, useState } from "react";
interface Props {
  recording: Recording;
}

export const RecordingCard = ({ recording }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioUrl = useMemo(
    () => URL.createObjectURL(recording.blob),
    [recording.blob],
  );

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function handleDelete() {
    syncEngine.cancelUpload(recording.id);
    await db.recordings.delete(recording.id);
  }

  function getStatusColor() {
    switch (recording.status) {
      case "local":
        return "bg-gray-400";
      case "uploading":
        return "bg-yellow-500";
      case "synced":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-800">{recording.filename}</p>
          <p className="text-sm text-gray-500">
            {new Date(recording.recordedAt).toLocaleString()}
          </p>
        </div>

        <span
          className={`text-xs text-white px-3 py-1 rounded-full ${
            isPlaying ? "bg-blue-600" : getStatusColor()
          }`}
        >
          {isPlaying ? "playing" : recording.status}
        </span>
      </div>

      <audio
        controls
        src={audioUrl}
        className="w-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex justify-end gap-4">
        {recording.status === "failed" && (
          <button
            onClick={() => syncEngine.retryOne(recording.id)}
            className="text-sm text-blue-600 hover:underline"
          >
            Retry
          </button>
        )}

        <button
          onClick={handleDelete}
          className="text-sm text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
