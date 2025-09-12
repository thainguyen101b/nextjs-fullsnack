import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(todos)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description } = body ?? {}
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'title is required' }, { status: 400 })
    }
    const todo = await prisma.todo.create({
      data: {
        title,
        description: description ?? null,
      },
    })
    return NextResponse.json(todo, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}
