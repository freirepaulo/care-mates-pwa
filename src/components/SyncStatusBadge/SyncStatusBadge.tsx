"use client";

interface SyncStatusBadgeProps {
  serverCount: number;
}

export const SyncStatusBadge = ({ serverCount }: SyncStatusBadgeProps) => {
  return (
    <div className="mb-4 flex justify-center">
      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
        🟢 Synced with server ({serverCount} items)
      </div>
    </div>
  );
};
