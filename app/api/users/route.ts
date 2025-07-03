import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT id, nama, email, created_at FROM users");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Gagal mengambil data pengguna:", error);
    return NextResponse.json({ message: "Gagal" }, { status: 500 });
  }
}
