'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

type Todo = {
  id: number
  title: string
  description?: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
}

const schema = yup.object().shape({
  title: yup.string().required('Tiêu đề là bắt buộc'),
  description: yup.string().nullable(),
})

type FormData = yup.InferType<typeof schema>

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  async function load() {
    setLoading(true)
    const res = await fetch('/api/todos', { cache: 'no-store' })
    const data = await res.json()
    setTodos(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function onSubmit(data: FormData) {
    await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    reset()
    await load()
  }

  async function toggle(id: number, completed: boolean) {
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    })
  }

  async function remove(id: number) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    await load()
  }

  async function rename(id: number, current: string) {
    const next = prompt('Enter new name:', current)
    if (next == null) return
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: next }),
    })
    await load()
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Next.js full snack CRUD (Todo)
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow rounded-lg p-6 mb-8 space-y-4"
      >
        <div>
          <input
            type="text"
            placeholder="Title ..."
            {...register('title')}
            className="w-full border rounded p-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <textarea
            placeholder="Description ..."
            {...register('description')}
            className="w-full border rounded p-2 min-h-[80px]"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Todo
        </button>
      </form>
    </div>
  )
}
