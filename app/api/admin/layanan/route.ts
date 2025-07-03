import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nama = formData.get("nama")?.toString() || "";
    const deskripsi = formData.get("deskripsi")?.toString() || "";
    const harga = parseInt(formData.get("harga")?.toString() || "0", 10);
    const gambar = formData.get("gambar") as File;

    if (!gambar || !gambar.name) {
      return NextResponse.json(
        { error: "Gambar tidak ditemukan." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await gambar.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const safeFileName = `${timestamp}_${gambar.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadDir, safeFileName);
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/uploads/${safeFileName}`;

    await db.query(
      "INSERT INTO layanan (nama, deskripsi, harga, gambar) VALUES (?, ?, ?, ?)",
      [nama, deskripsi, harga, imageUrl]
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
