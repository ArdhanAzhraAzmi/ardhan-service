// pages/api/user-pesanan.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email tidak valid" });
  }

  try {
    const [rows] = await db.execute(
      "SELECT * FROM pemesanan WHERE user_email = ? ORDER BY created_at DESC",
      [email]
    );
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Gagal mengambil pesanan user:", error);
    return res.status(500).json({ error: "Terjadi kesalahan" });
  }
}
