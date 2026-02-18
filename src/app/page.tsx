"use client";

import { RecordingCard } from "@/components/RecordingCard";
import { RecordButton } from "@/components/RecordButton";
import { SyncStatusBadge } from "@/components/SyncStatusBadge";
import { useRecordings } from "@/hooks/useRecordings";
import { useRecorder } from "@/hooks/useRecorder";
import { useSyncBootstrap } from "@/hooks/useSyncBootstrap";

export default function Home() {
  const serverCount = useSyncBootstrap();
  const { isRecording, start, stop } = useRecorder();
  const recordings = useRecordings();

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">CareMates Recorder</h1>

        <RecordButton
          isRecording={isRecording}
          onStart={start}
          onStop={stop}
        />

        {serverCount !== null && <SyncStatusBadge serverCount={serverCount} />}

        <div className="space-y-4">
          {recordings?.map((recording) => (
            <RecordingCard key={recording.id} recording={recording} />
          ))}
        </div>
      </div>
    </main>
  );
}
