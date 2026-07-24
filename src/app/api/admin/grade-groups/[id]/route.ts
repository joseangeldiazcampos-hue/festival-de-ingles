/**
 * Admin API — Single Grade Group
 * PUT    /api/admin/grade-groups/[id]   — update a grade group
 * DELETE /api/admin/grade-groups/[id]   — delete a grade group
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
  const { name, slug, emoji, description, grades, levels, isActive, order } = body;

  try {
    const gradeGroup = await prisma.gradeGroup.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(emoji !== undefined && { emoji }),
        ...(description !== undefined && { description }),
        ...(grades !== undefined && { grades }),
        ...(levels !== undefined && { levels }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
      },
    });
    return NextResponse.json(gradeGroup);
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Grade group not found" }, { status: 404 });
    }
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
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
    await prisma.gradeGroup.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Grade group not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
