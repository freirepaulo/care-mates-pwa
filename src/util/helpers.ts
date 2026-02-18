import { db } from "@/lib/db";

export async function reconcileWithServer() {
  const res = await fetch("/api/recordings");
  const serverRecordings = await res.json();

  const localRecordings = await db.recordings.toArray();

  for (const local of localRecordings) {
    const existsOnServer = serverRecordings.find(
      (server: any) => server.id === local.id,
    );

    if (existsOnServer && local.status !== "synced") {
      await db.recordings.update(local.id, {
        status: "synced",
      });
    }
  }

  return serverRecordings.length;
}
