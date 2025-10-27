import React from 'react';
import { CalendarDays, Settings, User } from 'lucide-react';

export default function Header({ role, user, onLogout }) {
  return (
    <header className="w-full border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600 text-white">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Smart Timetable</h1>
            <p className="text-xs text-slate-500 -mt-0.5">Generate and share schedules instantly</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {role && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 border text-slate-700">
              <User className="w-4 h-4" />
              <span className="text-sm capitalize">{role}</span>
              {user?.name && <span className="text-sm text-slate-500">• {user.name}</span>}
            </div>
          )}
          <button
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            onClick={onLogout}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
