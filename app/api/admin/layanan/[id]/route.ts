import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.query("DELETE FROM layanan WHERE id = ?", [params.id]);
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [rows] = await db.query("SELECT * FROM layanan WHERE id = ?", [
      params.id,
    ]);
    const layanan = Array.isArray(rows) ? rows[0] : null;
    if (!layanan)
      return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
    return NextResponse.json(layanan);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { nama, deskripsi, harga } = await req.json();
    await db.query(
      "UPDATE layanan SET nama = ?, deskripsi = ?, harga = ? WHERE id = ?",
      [nama, deskripsi, harga, params.id]
    );
    return NextResponse.json({ message: "Berhasil diupdate" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}
