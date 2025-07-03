import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
    }

    const [rows] = await db.query("SELECT * FROM layanan WHERE id = ?", [id]);
    const layanan = Array.isArray(rows) ? rows[0] : null;

    if (!layanan) {
      return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(layanan);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
    }

    const { nama, deskripsi, harga } = await req.json();
    await db.query(
      "UPDATE layanan SET nama = ?, deskripsi = ?, harga = ? WHERE id = ?",
      [nama, deskripsi, harga, id]
    );
    return NextResponse.json({ message: "Berhasil diupdate" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });
    }

    await db.query("DELETE FROM layanan WHERE id = ?", [id]);
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}
