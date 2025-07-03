import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.query("DELETE FROM layanan WHERE id = ?", [params.id]);
    return new Response(null, { status: 204 }); // 204: No Content
  } catch (error) {
    console.error("DELETE /api/admin/layanan/[id] error:", error);
    return NextResponse.json({ error: "Gagal hapus layanan." }, { status: 500 });
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
    if (!layanan) {
      return NextResponse.json({ error: "Layanan tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json(layanan);
  } catch (error) {
    console.error("GET /api/admin/layanan/[id] error:", error);
    return NextResponse.json({ error: "Gagal mengambil data layanan." }, { status: 500 });
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
    return NextResponse.json({ message: "Layanan berhasil diupdate." });
  } catch (error) {
    console.error("PUT /api/admin/layanan/[id] error:", error);
    return NextResponse.json({ error: "Gagal mengupdate layanan." }, { status: 500 });
  }
}
