// app/api/layanan/[id]/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type Params = {
  params: {
    id: string;
  };
};

// GET /api/layanan/:id
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const id = params.id;
    const [rows]: any = await db.query("SELECT * FROM layanan WHERE id = ?", [
      id,
    ]);
    const layanan = rows[0];

    if (!layanan) {
      return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(layanan);
  } catch (error) {
    console.error("GET /api/layanan/[id] error:", error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// PUT /api/layanan/:id
export async function PUT(req: NextRequest, context: any) {
  try {
    const { id } = context.params;

    const formData = await req.formData();
    const nama = formData.get("nama") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const harga = parseInt(formData.get("harga") as string, 10);
    const gambar = formData.get("gambar");

    let imagePath: string | null = null;

    if (
      gambar &&
      typeof gambar === "object" &&
      "arrayBuffer" in gambar &&
      gambar.size > 0
    ) {
      const buffer = Buffer.from(await gambar.arrayBuffer());
      const timestamp = Date.now();
      const filename = `${timestamp}-${gambar.name.replace(/\s+/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);
      imagePath = `/uploads/${filename}`;

      // update dengan gambar baru
      await db.query(
        "UPDATE layanan SET nama = ?, deskripsi = ?, harga = ?, gambar = ? WHERE id = ?",
        [nama, deskripsi, harga, imagePath, id]
      );
    } else {
      // update tanpa gambar baru (gambar lama dipertahankan)
      await db.query(
        "UPDATE layanan SET nama = ?, deskripsi = ?, harga = ? WHERE id = ?",
        [nama, deskripsi, harga, id]
      );
    }

    return NextResponse.json({ message: "Berhasil diupdate" });
  } catch (error) {
    console.error("PUT /api/layanan/[id] error:", error);
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}

// DELETE /api/layanan/:id
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const id = params.id;

    await db.query("DELETE FROM layanan WHERE id = ?", [id]);
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/layanan/[id] error:", error);
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}
