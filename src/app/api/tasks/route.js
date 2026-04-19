import pool from "../../../../lib/db";
import { NextResponse } from "next/server";

// GET all tasks
export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, completed, important FROM tasks ORDER BY created_at DESC",
    );
    const tasks = rows.map((row) => ({
      ...row,
      completed: !!row.completed,
      important: !!row.important,
    }));
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

// POST create a task
export async function POST(request) {
  try {
    const { title } = await request.json();
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const [result] = await pool.query("INSERT INTO tasks (title) VALUES (?)", [
      title.trim(),
    ]);
    return NextResponse.json(
      {
        id: result.insertId,
        title: title.trim(),
        completed: false,
        important: false,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}
