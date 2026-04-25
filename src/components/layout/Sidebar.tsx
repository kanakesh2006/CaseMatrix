"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from '@/context/AuthContext';

import {
  Gavel,
  MessageSquare,
  Info,
  MapPin,
  Upload,
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Search,
  LogIn,
  UserPlus
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Cases", href: "/cases", icon: Briefcase },
  { label: "Witnesses", href: "/witnesses/1234", icon: Users },
  { label: "Search", href: "/search", icon: Search },
  { label: "Appoint Lawyer", href: "/lawyers", icon: Gavel },
  { label: "Chatbot", href: "/chatbot", icon: MessageSquare },
  { label: "Courts Near Me", href: "/courts", icon: MapPin },
  { label: "Upload Evidence", href: "/evidence/new", icon: Upload },
  { label: "About Us", href: "/about", icon: Info },
  { label: "Login", href: "/login", icon: LogIn },
  { label: "Register", href: "/register", icon: UserPlus },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { close } = useSidebar();
  const { user } = useAuth();

  // Role-based nav items
  const filteredNavItems = navItems.filter(item => {
    if (!user) {
      // Only show login/register if not logged in
      return item.label === 'Login' || item.label === 'Register';
    }
    if (item.label === 'Login' || item.label === 'Register') return false;
    if (user.role === 'judge') {
      // Judges see everything except login/register
      return true;
    }
    if (user.role === 'lawyer') {
      // Lawyers see all except Dashboard and Appoint Lawyer
      return item.label !== 'Dashboard' && item.label !== 'Appoint Lawyer';
    }
    // Regular users see only allowed features
    return [
      'Appoint Lawyer',
      'Chatbot',
      'About Us',
      'Courts Near Me',
      'Upload Evidence',
    ].includes(item.label);
  });

  return (
    <aside className="h-full w-64 bg-zinc-950 text-zinc-300 shadow-2xl border-r border-zinc-800 flex flex-col">
      {/* Brand Logo */}
      <div 
        onClick={() => router.push('/')}
        className="px-6 py-8 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
          C
        </div>
        <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">CaseMatrix</span>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        <ul className="space-y-1.5">
          {filteredNavItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/") || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <button
                  onClick={() => { router.push(item.href); close(); }}
                  className={`w-full group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out
                    ${active
                      ? 'bg-blue-600/10 text-blue-500'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
                >
                  <Icon className={`h-5 w-5 transition-colors ${active ? 'text-blue-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} strokeWidth={active ? 2.5 : 2} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer Section */}
      <div className="p-6 border-t border-zinc-900 mt-auto">
        <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl">
          <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center">
            <LayoutDashboard className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-medium text-zinc-200">v2.0 Beta</span>
            <span className="text-[10px] text-zinc-500">CaseMatrixDB</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
