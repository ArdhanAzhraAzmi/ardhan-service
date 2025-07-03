// FILE: app/api/pemesanan/user/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET pesanan berdasarkan email user
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "Email diperlukan" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await db.execute(
      `SELECT * FROM pemesanan WHERE user_email = ? ORDER BY created_at DESC`,
      [email]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Gagal mengambil data pesanan user:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
