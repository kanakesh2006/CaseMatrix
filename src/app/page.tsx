"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { motion } from "framer-motion";
import { 
  Briefcase, 
  FileText, 
  Users, 
  Calendar, 
  Search, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [apiStats, setApiStats] = useState({
    totalCases: "0",
    activeHearings: "0",
    pendingEvidence: "0",
    registeredWitnesses: "0"
  });

  useEffect(() => {
    setMounted(true);
    
    // Fetch dynamic stats from the database
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setApiStats({
          totalCases: data.totalCases.toString(),
          activeHearings: data.activeHearings.toString(),
          pendingEvidence: data.pendingEvidence.toString(),
          registeredWitnesses: data.registeredWitnesses.toString(),
        });
      })
      .catch(err => console.error("Failed to fetch stats:", err));
  }, []);

  const stats = [
    { label: "Total Cases", value: apiStats.totalCases, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Active Hearings", value: apiStats.activeHearings, icon: Calendar, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Pending Evidence", value: apiStats.pendingEvidence, icon: FileText, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Registered Witnesses", value: apiStats.registeredWitnesses, icon: Users, color: "text-emerald-600", bg: "bg-emerald-100" },
  ];

  const quickLinks = [
    {
      title: "View All Cases",
      description: "Browse and filter the complete case registry",
      icon: Briefcase,
      color: "from-blue-500 to-indigo-600",
      path: "/cases",
    },
    {
      title: "Upload Evidence",
      description: "Securely attach new documents to active cases",
      icon: FileText,
      color: "from-emerald-500 to-teal-600",
      path: "/evidence/new",
    },
    {
      title: "Manage Witnesses",
      description: "Update statements and witness contact details",
      icon: Users,
      color: "from-orange-400 to-rose-500",
      path: "/witnesses/1234",
    },
    {
      title: "Hearing Calendar",
      description: "View upcoming court dates and schedules",
      icon: Calendar,
      color: "from-purple-500 to-violet-600",
      path: "/calendar",
    },
  ];

  const activities = [
    { type: "new", title: "New case added", target: "State vs. John Doe", time: "2 hours ago", icon: AlertCircle, color: "text-blue-500" },
    { type: "upload", title: "Evidence uploaded", target: "Case #1234: Document_A.pdf", time: "4 hours ago", icon: CheckCircle2, color: "text-emerald-500" },
    { type: "add", title: "Witness added", target: "Jane Smith (Case #1234)", time: "Yesterday", icon: Users, color: "text-purple-500" },
    { type: "schedule", title: "Hearing scheduled", target: "Case #5678: Aug 25 at 10:00 AM", time: "Yesterday", icon: Clock, color: "text-orange-500" },
    { type: "update", title: "Status changed", target: "Case #7890 to 'Pending Review'", time: "2 days ago", icon: TrendingUp, color: "text-zinc-500" },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50/50 pb-12">
      <div className="container-responsive py-8">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Welcome back, Legal Team
            </h1>
            <p className="mt-2 text-zinc-500">
              Here is what's happening with your cases today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-200">
            <Calendar className="h-4 w-4 text-blue-500" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div key={index} variants={item} className="glass rounded-2xl p-6 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-zinc-900">{stat.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-emerald-600">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span className="font-medium">+4% from last month</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {/* Left Column (Quick Actions) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-900">Quick Actions</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickLinks.map((link, index) => (
                  <motion.div 
                    variants={item}
                    key={index}
                    onClick={() => router.push(link.path)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl glass p-6 hover-lift border border-zinc-200/50"
                  >
                    <div className={`absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br ${link.color} opacity-10 transition-transform duration-500 group-hover:scale-150 blur-2xl`}></div>
                    <div className="relative z-10 flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${link.color} text-white shadow-md`}>
                        <link.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{link.title}</h3>
                        <p className="mt-1 text-sm text-zinc-500 leading-relaxed">{link.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Search Block */}
              <motion.div variants={item} className="mt-6 rounded-2xl bg-zinc-900 p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-64 w-64 bg-blue-500 opacity-20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Global Case Search</h3>
                  <p className="text-zinc-400 mb-6 max-w-md">Instantly locate cases, evidence, or witnesses across the entire CaseMatrix database.</p>
                  <button
                    onClick={() => router.push('/search')}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-500 hover:shadow-blue-500/25 hover:-translate-y-0.5"
                  >
                    <Search className="h-4 w-4" />
                    Launch Search Engine
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Column (Recent Activity) */}
            <motion.div variants={item} className="glass rounded-2xl p-6 border border-zinc-200/50">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-900">Recent Activity</h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
              </div>
              
              <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-4 before:h-full before:w-[2px] before:bg-zinc-100">
                {activities.map((activity, idx) => (
                  <div key={idx} className="relative flex gap-4">
                    <div className="absolute left-4 top-5 -ml-[3px] h-2 w-2 rounded-full bg-zinc-300 ring-4 ring-white"></div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-200 z-10">
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex flex-col pt-1">
                      <p className="text-sm font-medium text-zinc-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-zinc-600 mt-0.5">
                        {activity.target}
                      </p>
                      <span className="text-xs text-zinc-400 mt-1">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
