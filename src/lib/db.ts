import { Recording } from "@/types/recording";
import Dexie, { Table } from "dexie";

class AppDatabase extends Dexie {
  recordings!: Table<Recording>;

  constructor() {
    super("CareMatesDB");

    this.version(1).stores({
      recordings: "id, status, recordedAt",
    });
  }
}

export const db = new AppDatabase();
