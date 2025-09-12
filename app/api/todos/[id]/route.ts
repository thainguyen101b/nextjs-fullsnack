import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function toId(param: string) {
  const id = Number(param)
  if (!Number.isInteger(id) || id <= 0) return null
  return id
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = toId(params.id)
  if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const todo = prisma.todo.findUnique({ where: { id } })
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(todo)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = toId(params.id)
  if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const body = await req.json()
  const data: {
    title?: string
    description?: string | null
    completed?: boolean
  } = {}

  if (typeof body.title === 'string') data.title = body.title
  if (typeof body.description === 'string' || body.description === null)
    data.description = body.description
  if (typeof body.completed === 'boolean') data.completed = body.completed

  try {
    const updated = await prisma.todo.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = toId(params.id)
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  try {
    await prisma.todo.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
