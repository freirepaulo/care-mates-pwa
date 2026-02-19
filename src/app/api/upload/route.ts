import { db } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const id = formData.get("id") as string;

    if (!file || !id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const existing = db
      .prepare("SELECT id FROM recordings WHERE id = ?")
      .get(id);

    if (existing) {
      return NextResponse.json({
        success: true,
        duplicate: true,
      });
    }

    db.prepare(
      `
      INSERT INTO recordings (id, filename, uploadedAt)
      VALUES (?, ?, ?)
    `,
    ).run(id, file.name, new Date().toISOString());

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    );
  }
}
