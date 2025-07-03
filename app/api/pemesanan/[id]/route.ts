import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { status } = await req.json();

  try {
    const [result] = await db.execute(
      "UPDATE pemesanan SET status = ? WHERE id = ?",
      [status, id]
    );

    return NextResponse.json({ message: "Status diperbarui" });
  } catch (error) {
    console.error("Gagal update status:", error);
    return NextResponse.json({ message: "Gagal update" }, { status: 500 });
  }
}
