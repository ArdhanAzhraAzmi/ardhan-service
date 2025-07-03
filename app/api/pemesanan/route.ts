import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST: Tambah pesanan
export async function POST(req: Request) {
  const body = await req.json();
  const { layanan_id, nama_layanan, user_email, alamat, catatan } = body;

  try {
    const [result] = await db.execute(
      `INSERT INTO pemesanan (layanan_id, nama_layanan, user_email, alamat, catatan, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [layanan_id, nama_layanan, user_email, alamat, catatan, "pending"]
    );

    return NextResponse.json({ message: "Pesanan berhasil dibuat" });
  } catch (error) {
    console.error("Gagal menambah pesanan:", error);
    return NextResponse.json(
      { message: "Gagal membuat pesanan" },
      { status: 500 }
    );
  }
}

// GET: Ambil semua data pemesanan
export async function GET() {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM pemesanan ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Gagal mengambil data pesanan:", error);
    return NextResponse.json({ message: "Gagal" }, { status: 500 });
  }
}
