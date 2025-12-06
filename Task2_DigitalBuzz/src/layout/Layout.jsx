import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Bot, MessageSquare, Menu, X } from "lucide-react";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Navigation items for the 3 main features
  const navItems = [
    { name: "Firebase Notifications", path: "/notifications", icon: Bell },
    { name: "AI Tool", path: "/ai-tool", icon: Bot },
    { name: "Mini Chat App", path: "/chat", icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <Link
            to="/notifications"
            className="text-xl font-bold text-gray-800 hover:text-blue-600 transition"
            onClick={() => setSidebarOpen(false)}
          >
            DIGITALBUZZ
          </Link>
          <button
            className="lg:hidden text-gray-600 hover:text-gray-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 lg:ml-64 w-full">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-white shadow-sm px-4 lg:px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <button
              className="lg:hidden text-gray-600 hover:text-gray-800"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {navItems.find((item) => item.path === location.pathname)?.name ||
                "React Task Dashboard"}
            </h1>
          </div>

          {/* Right-side */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 hidden sm:block">
              React Task Dashboard
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-400">
              <span className="text-xs font-semibold text-gray-600">U</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
