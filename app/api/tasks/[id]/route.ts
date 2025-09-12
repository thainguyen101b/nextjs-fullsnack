import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function toId(param: string) {
  const id = Number(param);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = toId(params.id);
  if (!id) return NextResponse.json({ error: "invalid id" }, { status: 400 });
  const task = prisma.task.findUnique({ where: { id } });
  if (!task) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(task);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = toId(params.id);
  if (!id) return NextResponse.json({ error: "invalid id" }, { status: 400 });
  const body = await req.json();
  const data: {
    description?: string;
    taskDate?: Date;
    note?: string;
    categoryId?: number;
  } = {};
  if (typeof body.description === "string") data.description = body.description;
  if (typeof body.taskDate === "string") data.taskDate = body.taskDate;
  if (typeof body.note === "string" || body.note === null)
    data.note = body.note;
  if (typeof body.categoryId === "number" || body.categoryId === null)
    data.categoryId = body.categoryId;
  try {
    const updated = await prisma.task.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = toId(params.id);
  if (!id) return NextResponse.json({ error: "invalid id" }, { status: 400 });
  try {
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}
