import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

// Koneksi ke MySQL
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ardhan_service",
});

export async function POST(req: Request) {
  try {
    const { email, password, nama } = await req.json();

    if (!email || !password || !nama) {
      return NextResponse.json(
        { error: "Nama, email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const [existing]: any = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (nama, email, password) VALUES (?, ?, ?)",
      [nama, email, hashedPassword]
    );

    return NextResponse.json({ message: "Berhasil mendaftar" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal mendaftar" }, { status: 500 });
  }
}
