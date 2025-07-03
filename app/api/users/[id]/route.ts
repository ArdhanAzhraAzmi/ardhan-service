// app/api/user/[id]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const [result] = await db.query("DELETE FROM users WHERE id = ?", [userId]);

    return NextResponse.json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus user:", error);
    return NextResponse.json({ message: "Gagal menghapus user" }, { status: 500 });
  }
}
