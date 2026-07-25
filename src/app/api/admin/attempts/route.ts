/**
 * DELETE /api/admin/attempts
 * Deletes ALL quiz attempts from the database.
 * Protected — requires admin session.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { count } = await prisma.attempt.deleteMany({});
    return NextResponse.json({ success: true, deleted: count });
  } catch {
    return NextResponse.json({ error: "Failed to delete attempts" }, { status: 500 });
  }
}
