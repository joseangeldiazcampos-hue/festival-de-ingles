/**
 * DELETE /api/admin/attempts/[id]
 * Deletes a single quiz attempt by its ID.
 * Protected — requires admin session.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing attempt ID" }, { status: 400 });
  }

  try {
    await prisma.attempt.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Attempt not found or already deleted" }, { status: 404 });
  }
}
