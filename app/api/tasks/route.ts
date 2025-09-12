import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { taskDate: "desc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description, taskDate, note, categoryId } = body ?? {};
    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "description is required" },
        { status: 400 }
      );
    }
    if (!taskDate) {
      return NextResponse.json(
        { error: "task date is required" },
        { status: 400 }
      );
    }
    const task = await prisma.task.create({
      data: {
        description,
        taskDate,
        note: note ?? null,
        categoryId: categoryId ?? null,
      },
    });
    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
}
