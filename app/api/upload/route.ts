import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// Misalnya simpan di public/uploads
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { error: "File tidak ditemukan" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = Date.now() + "_" + file.name;
  const filePath = path.join(process.cwd(), "public", "uploads", fileName);

  await fs.writeFile(filePath, buffer);

  // return path to be saved in DB
  return NextResponse.json({ url: `/uploads/${fileName}` });
}
