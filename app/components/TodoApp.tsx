"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type Todo = {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

const schema = z.object({
  title: z.string().min(1, "Todo title is required"),
  description: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function load() {
    setLoading(true);
    const res = await fetch("/api/todos", { cache: "no-store" });
    const data = await res.json();
    setTodos(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(data: FormData) {
    await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    reset();
    await load();
  }

  async function toggle(id: number, completed: boolean) {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    await load();
  }

  async function remove(id: number) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    await load();
  }

  async function rename(id: number, current: string) {
    const next = prompt("Enter new name:", current);
    if (next == null) return;
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: next }),
    });
    await load();
  }

  function toggleTextExpand(id: number) {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Next.js full snack CRUD (Todo)
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow rounded-lg p-6 mb-8 space-y-4"
      >
        <div>
          <input
            type="text"
            placeholder="Title ..."
            {...register("title")}
            className="w-full border rounded p-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <textarea
            placeholder="Description ..."
            {...register("description")}
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

      {loading ? (
        <p>Loading...</p>
      ) : todos.length === 0 ? (
        <p>No todos yet</p>
      ) : (
        <ul className="space-y-1">
          {todos.map((t) => (
            <li key={t.id} className="flex items-center gap-2">
              <div className="flex-1">
                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggle(t.id, t.completed)}
                  />
                  <span
                    className={`flex-1 text-lg ${
                      expandedIds.includes(t.id)
                        ? "whitespace-normal"
                        : "truncate w-80"
                    } ${t.completed ? "line-through text-gray-500" : ""}`}
                  >
                    {t.title}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault(); // tránh ảnh hưởng label
                      e.stopPropagation(); // tránh trigger toggle checkbox
                      toggleTextExpand(t.id);
                    }}
                    className="ml-2 text-xs text-blue-600 hover:underline"
                  >
                    {expandedIds.includes(t.id) ? "Collapse" : "Expand"}
                  </button>
                </label>
                {t.description && (
                  <p className="truncate w-80 text-sm text-gray-400">
                    {t.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-sky-700 text-white"
                  onClick={() => rename(t.id, t.title)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 rounded border border-red-700 text-red-700 hover:text-white hover:border-transparent hover:bg-red-700 transition"
                  onClick={() => remove(t.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
