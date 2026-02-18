import { db } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET() {
  const recordings = db
    .prepare("SELECT * FROM recordings ORDER BY uploadedAt DESC")
    .all();

  return NextResponse.json(recordings);
}
