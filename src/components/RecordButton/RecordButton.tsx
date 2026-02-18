"use client";

interface RecordButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const RecordButton = ({
  isRecording,
  onStart,
  onStop,
}: RecordButtonProps) => {
  return (
    <button
      onClick={isRecording ? onStop : onStart}
      className={`w-full py-3 rounded-xl shadow transition ${
        isRecording
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
    >
      {isRecording ? "⏹ Stop Recording" : "🎤 Start Recording"}
    </button>
  );
};
