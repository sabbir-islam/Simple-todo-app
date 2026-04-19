"use client";
import React, { useState, useEffect } from "react";
import {
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdDelete,
  MdEdit,
  MdStar,
  MdStarBorder,
} from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch tasks on mount
  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const importantTasks = tasks.filter(
    (t) => t.important && !t.completed,
  ).length;

  const addTask = async () => {
    const trimmed = newTask.trim();
    if (!trimmed) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    });
    const task = await res.json();
    setTasks([task, ...tasks]);
    setNewTask("");
  };

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

  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditText(task.title);
  };

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTask();
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === "Enter") saveEdit(id);
    if (e.key === "Escape") setEditId(null);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-heading">Dashboard</h1>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Stats Cards */}
      <h1 className="dashboard-heading text-black">Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card stat-card--total">
          <span className="stat-number">{totalTasks}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-card stat-card--pending">
          <span className="stat-number">{pendingTasks}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card stat-card--completed">
          <span className="stat-number">{completedTasks}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card stat-card--important">
          <span className="stat-number">{importantTasks}</span>
          <span className="stat-label">Important</span>
        </div>
      </div>

      {/* Add Task */}
      <div className="add-task-bar">
        <input
          type="text"
          className="add-task-input"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="add-task-btn" onClick={addTask}>
          <IoAddCircle size={22} />
          Add
        </button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${task.completed ? "task-item--done" : ""}`}
          >
            <button
              className="task-check-btn"
              onClick={() => toggleComplete(task.id)}
              aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
            >
              {task.completed ? (
                <MdCheckCircle size={22} className="check-icon--done" />
              ) : (
                <MdRadioButtonUnchecked size={22} />
              )}
            </button>

            {editId === task.id ? (
              <input
                className="task-edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                onBlur={() => saveEdit(task.id)}
                autoFocus
              />
            ) : (
              <span className="task-title">{task.title}</span>
            )}

            <div className="task-actions">
              <button
                className="task-action-btn"
                onClick={() => toggleImportant(task.id)}
                aria-label="Toggle important"
              >
                {task.important ? (
                  <MdStar size={20} className="star-icon--active" />
                ) : (
                  <MdStarBorder size={20} />
                )}
              </button>
              <button
                className="task-action-btn"
                onClick={() => startEdit(task)}
                aria-label="Edit task"
              >
                <MdEdit size={18} />
              </button>
              <button
                className="task-action-btn task-action-btn--delete"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
              >
                <MdDelete size={18} />
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="task-empty">No tasks yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
