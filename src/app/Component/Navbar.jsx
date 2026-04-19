"use client";
import React, { useState } from "react";
import { MdDashboard, MdChecklist, MdStar, MdSettings } from "react-icons/md";
import { FaBars, FaTimes, FaCalendarAlt, FaTrashAlt } from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";
import Link from "next/link";

function Navbar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="sidebar-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} />}

      {/* Sidebar */}
      <aside
        className={`sidebar ${collapsed ? "sidebar--collapsed" : ""} ${mobileOpen ? "sidebar--open" : ""}`}
      >
        {/* Header */}
        <div className="sidebar-header">
          {!collapsed && <h2 className="sidebar-title">My Todo</h2>}
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Collapse sidebar"
          >
            <FaBars size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link
                href="/dashboard"
                className="sidebar-link"
                onClick={closeMobile}
                title={collapsed ? "Dashboard" : ""}
              >
                <span className="sidebar-icon">
                  <MdDashboard size={20} />
                </span>
                {!collapsed && <span className="sidebar-label">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="sidebar-link"
                onClick={closeMobile}
                title={collapsed ? "All Tasks" : ""}
              >
                <span className="sidebar-icon">
                  <MdChecklist size={20} />
                </span>
                {!collapsed && <span className="sidebar-label">All Tasks</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="sidebar-link"
                onClick={closeMobile}
                title={collapsed ? "Add Task" : ""}
              >
                <span className="sidebar-icon">
                  <IoAddCircle size={20} />
                </span>
                {!collapsed && <span className="sidebar-label">Add Task</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="sidebar-link"
                onClick={closeMobile}
                title={collapsed ? "Important" : ""}
              >
                <span className="sidebar-icon">
                  <MdStar size={20} />
                </span>
                {!collapsed && <span className="sidebar-label">Important</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="sidebar-link"
                onClick={closeMobile}
                title={collapsed ? "Calendar" : ""}
              >
                <span className="sidebar-icon">
                  <FaCalendarAlt size={20} />
                </span>
                {!collapsed && <span className="sidebar-label">Calendar</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="sidebar-link"
                onClick={closeMobile}
                title={collapsed ? "Trash" : ""}
              >
                <span className="sidebar-icon">
                  <FaTrashAlt size={18} />
                </span>
                {!collapsed && <span className="sidebar-label">Trash</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="sidebar-link"
                onClick={closeMobile}
                title={collapsed ? "Settings" : ""}
              >
                <span className="sidebar-icon">
                  <MdSettings size={20} />
                </span>
                {!collapsed && <span className="sidebar-label">Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Navbar;
