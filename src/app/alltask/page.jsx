"use client";
import React, { useEffect, useState } from "react";
import {
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdDelete,
  MdEdit,
  MdStar,
  MdStarBorder,
} from "react-icons/md";

export default function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // ─── Fetch all tasks on page load ───
  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ─── Toggle completed ───
  const toggleComplete = async (id) => {
    const task = tasks.find((t) => t.id === id);
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    const updated = await res.json();
    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
  };

  // ─── Toggle important ───
  const toggleImportant = async (id) => {
    const task = tasks.find((t) => t.id === id);
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ important: !task.important }),
    });
    const updated = await res.json();
    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
  };

  // ─── Delete task ───
  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // ─── Save edited title ───
  const saveEdit = async (id) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    });
    const updated = await res.json();
    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
    setEditId(null);
    setEditText("");
  };

  // ─── Loading state ───
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-500 text-center">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 ">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 text-black">All Tasks</h1>

      {/* Task List */}
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl
                       hover:shadow-md transition-shadow"
          >
            {/* Complete Toggle */}
            <button
              onClick={() => toggleComplete(task.id)}
              className="shrink-0"
            >
              {task.completed ? (
                <MdCheckCircle size={24} className="text-green-500" />
              ) : (
                <MdRadioButtonUnchecked size={24} className="text-gray-400" />
              )}
            </button>

            {/* Title or Edit Input */}
            {editId === task.id ? (
              <input
                className="flex-1 px-3 py-1 border-2 border-indigo-500 rounded-md
                           outline-none text-sm"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(task.id);
                  if (e.key === "Escape") setEditId(null);
                }}
                onBlur={() => saveEdit(task.id)}
                autoFocus
              />
            ) : (
              <span
                className={`flex-1 text-sm ${
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {task.title}
              </span>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {/* Important */}
              <button
                onClick={() => toggleImportant(task.id)}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              >
                {task.important ? (
                  <MdStar size={20} className="text-yellow-500" />
                ) : (
                  <MdStarBorder size={20} className="text-gray-400" />
                )}
              </button>

              {/* Edit */}
              <button
                onClick={() => {
                  setEditId(task.id);
                  setEditText(task.title);
                }}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
              >
                <MdEdit size={18} />
              </button>

              {/* Delete */}
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-500
                           transition-colors text-gray-500"
              >
                <MdDelete size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {tasks.length === 0 && (
          <p className="text-center text-black py-10">No tasks yet.</p>
        )}
      </div>
    </div>
  );
}
