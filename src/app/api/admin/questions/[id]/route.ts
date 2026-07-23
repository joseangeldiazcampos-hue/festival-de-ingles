/**
 * Admin API – Single Question
 * PUT    /api/admin/questions/[id]   → update a question
 * DELETE /api/admin/questions/[id]   → delete a question
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const body = await req.json();
  const { text, optionA, optionB, optionC, optionD, correctOption, order } = body;

  if (correctOption && !["A", "B", "C", "D"].includes(correctOption)) {
    return NextResponse.json({ error: "correctOption must be A, B, C, or D" }, { status: 400 });
  }

  try {
    const question = await prisma.question.update({
      where: { id },
      data: {
        ...(text !== undefined && { text }),
        ...(optionA !== undefined && { optionA }),
        ...(optionB !== undefined && { optionB }),
        ...(optionC !== undefined && { optionC }),
        ...(optionD !== undefined && { optionD }),
        ...(correctOption !== undefined && { correctOption }),
        ...(order !== undefined && { order }),
      },
    });
    return NextResponse.json(question);
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;

  try {
    await prisma.question.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
