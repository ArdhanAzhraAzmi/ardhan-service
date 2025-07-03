import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }   // <-- harus persis seperti ini
) {
  try {
    const { id } = context.params;
    const [rows] = await db.query("SELECT * FROM layanan WHERE id = ?", [id]);
    const layanan = Array.isArray(rows) ? rows[0] : null;
    if (!layanan)
      return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
    return NextResponse.json(layanan);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    await db.query("DELETE FROM layanan WHERE id = ?", [id]);
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const { nama, deskripsi, harga } = await req.json();
    await db.query(
      "UPDATE layanan SET nama = ?, deskripsi = ?, harga = ? WHERE id = ?",
      [nama, deskripsi, harga, id]
    );
    return NextResponse.json({ message: "Berhasil diupdate" });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}
