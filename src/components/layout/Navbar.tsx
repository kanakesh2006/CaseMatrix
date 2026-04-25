"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

import { Search, Bell, Menu } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const { toggle } = useSidebar();

  return (
    <nav className="flex h-16 items-center justify-between bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 px-6 z-50 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Toggle menu"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 
          onClick={() => router.push('/')}
          className="text-xl font-extrabold tracking-tight md:hidden bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
        >
          CaseMatrix
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center sm:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search cases..."
            className="w-64 rounded-full bg-zinc-800/80 px-10 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none ring-1 ring-zinc-700 focus:bg-zinc-800 focus:ring-blue-500 transition-all"
          />
        </div>

        <button
          className="hidden sm:inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={() => router.push('/cases/new')}
        >
          + New Case
        </button>

        <div className="h-6 w-px bg-zinc-800 mx-1 hidden sm:block"></div>

        <button className="text-zinc-400 hover:text-zinc-200 transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border-2 border-zinc-900"></span>
        </button>

        {/* Profile/Login status */}
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={() => router.push('/login')}
        >
          U
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
