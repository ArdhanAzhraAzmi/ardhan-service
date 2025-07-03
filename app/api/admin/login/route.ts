import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

// Koneksi ke database
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ardhan_service",
});

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Ambil data admin berdasarkan username
    const [rows]: any = await db.execute(
      "SELECT * FROM admin WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Username tidak ditemukan" },
        { status: 401 }
      );
    }

    const admin = rows[0];

    // Cek password
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // Autentikasi berhasil
    return NextResponse.json({
      message: "Login admin berhasil",
      userType: "admin",
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat login" },
      { status: 500 }
    );
  }
}
