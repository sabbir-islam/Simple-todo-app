import pool from "../../../../../lib/db";
import { NextResponse } from "next/server";

// PUT update a task
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const fields = [];
    const values = [];

    if (body.title !== undefined) {
      if (!body.title.trim()) {
        return NextResponse.json(
          { error: "Title cannot be empty" },
          { status: 400 },
        );
      }
      fields.push("title = ?");
      values.push(body.title.trim());
    }
    if (body.completed !== undefined) {
      fields.push("completed = ?");
      values.push(body.completed);
    }
    if (body.important !== undefined) {
      fields.push("important = ?");
      values.push(body.important);
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    values.push(Number(id));
    await pool.query(
      `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    const [rows] = await pool.query(
      "SELECT id, title, completed, important FROM tasks WHERE id = ?",
      [Number(id)],
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    const task = {
      ...rows[0],
      completed: !!rows[0].completed,
      important: !!rows[0].important,
    };
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}

// DELETE a task
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [
      Number(id),
    ]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}
