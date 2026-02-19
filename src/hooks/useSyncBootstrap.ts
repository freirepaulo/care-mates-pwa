"use client";

import { syncEngine } from "@/lib/sync-engine";
import { reconcileWithServer } from "@/util/helpers";
import { useEffect, useState } from "react";

const SYNC_INTERVAL_MS = 5000;

export function useSyncBootstrap() {
  const [serverCount, setServerCount] = useState<number | null>(null);

  useEffect(() => {
    async function bootstrap() {
      await syncEngine.processQueue();
      const count = await reconcileWithServer();
      setServerCount(count);
    }

    bootstrap();
  }, []);

  useEffect(() => {
    if (navigator.storage?.persist) {
      navigator.storage.persist().then((granted) => {
        if (process.env.NODE_ENV === "development") {
          console.log("Persistent storage granted:", granted);
        }
      });
    }
  }, []);

  useEffect(() => {
    async function trySync() {
      if (!navigator.onLine) return;
      await syncEngine.processQueue();
      const count = await reconcileWithServer();
      setServerCount(count);
    }

    trySync();

    const handleOnline = () => {
      trySync();
    };

    window.addEventListener("online", handleOnline);
    const interval = setInterval(trySync, SYNC_INTERVAL_MS);

    return () => {
      window.removeEventListener("online", handleOnline);
      clearInterval(interval);
    };
  }, []);

  return serverCount;
}
