"use client";

import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";

export function useRecordings() {
  return useLiveQuery(
    () => db.recordings.orderBy("recordedAt").reverse().toArray(),
    [],
  );
}
