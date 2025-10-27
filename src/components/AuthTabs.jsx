import React, { useMemo, useState } from 'react';

export default function AuthTabs({ faculties, students, onLogin }) {
  const [activeTab, setActiveTab] = useState('admin');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const canFacultyLogin = useMemo(() => faculties.length > 0, [faculties]);
  const canStudentLogin = useMemo(() => students.length > 0, [students]);

  return (
    <div className="w-full bg-white border rounded-xl overflow-hidden">
      <div className="grid grid-cols-3 text-center">
        {['admin', 'faculty', 'student'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-sm font-medium uppercase tracking-wide transition border-b ${
              activeTab === tab ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-5">
        {activeTab === 'admin' && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Admin can add faculty, rooms, and subjects, and generate the weekly timetable.</p>
            <button
              onClick={() => onLogin('admin', { name: 'Administrator' })}
              className="w-full py-2.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Continue as Admin
            </button>
          </div>
        )}

        {activeTab === 'faculty' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Select Faculty</label>
            <select
              className="w-full border rounded-md px-3 py-2 bg-white"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              <option value="">-- Choose --</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <button
              onClick={() => selectedFaculty && onLogin('faculty', faculties.find(f => f.id === selectedFaculty))}
              disabled={!canFacultyLogin || !selectedFaculty}
              className="w-full py-2.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Login as Faculty
            </button>
            {!canFacultyLogin && (
              <p className="text-xs text-amber-600">Admin must add at least one faculty account first.</p>
            )}
          </div>
        )}

        {activeTab === 'student' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Select Student</label>
            <select
              className="w-full border rounded-md px-3 py-2 bg-white"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">-- Choose --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              onClick={() => selectedStudent && onLogin('student', students.find(s => s.id === selectedStudent))}
              disabled={!canStudentLogin || !selectedStudent}
              className="w-full py-2.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Login as Student
            </button>
            {!canStudentLogin && (
              <p className="text-xs text-slate-500">Sample students are auto-created when you add subjects.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
