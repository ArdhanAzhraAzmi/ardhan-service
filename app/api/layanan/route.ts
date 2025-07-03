import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nama = formData.get("nama")?.toString() || "";
    const deskripsi = formData.get("deskripsi")?.toString() || "";
    const hargaStr = formData.get("harga")?.toString() || "0";
    const harga = parseInt(hargaStr, 10);
    const file = formData.get("gambar") as File;

    if (!file || !file.name) {
      return NextResponse.json(
        { error: "Gambar tidak ditemukan." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/\s+/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");

    await fs.mkdir(uploadDir, { recursive: true });
    const filepath = path.join(uploadDir, filename);
    await fs.writeFile(filepath, buffer);

    const imagePath = `/uploads/${filename}`;

    await db.query(
      "INSERT INTO layanan (nama, deskripsi, harga, gambar) VALUES (?, ?, ?, ?)",
      [nama, deskripsi, harga, imagePath]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/layanan error:", err);
    return NextResponse.json(
      { error: "Gagal menambahkan layanan." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM layanan ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/layanan error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data." },
      { status: 500 }
    );
  }
}
