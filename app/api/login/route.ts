import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = (rows as any[])[0];

    if (!user) {
      return NextResponse.json(
        { error: "Email tidak ditemukan." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Password salah." }, { status: 401 });
    }

    // ✅ Return dengan role
    return NextResponse.json({
      message: "Login berhasil",
      userId: user.id,
      role: user.role,
    });
  } catch (err) {
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}
