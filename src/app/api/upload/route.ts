import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const id = formData.get("id");

    // simulate network delay
    await new Promise((res) => setTimeout(res, 1000));

    console.log("Uploaded:", id, file?.name);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
