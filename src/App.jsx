import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import AuthTabs from './components/AuthTabs';
import AdminPanel from './components/AdminPanel';
import TimetableGrid from './components/TimetableGrid';

function uid(prefix='id'){
  return `${prefix}_${Math.random().toString(36).slice(2,9)}`;
}

export default function App(){
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  const [faculties, setFaculties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [timetable, setTimetable] = useState(null);

  // Auto-create a sample student per subject (e.g., subject cohorts) for demo login
  React.useEffect(() => {
    const subs = subjects.map((s) => ({ id: `stu_${s.id}`, name: `${s.name} Cohort` }));
    setStudents(subs);
  }, [subjects]);

  const onLogin = (r, u) => {
    setRole(r);
    setUser(u);
  };
  const onLogout = () => {
    setRole(null);
    setUser(null);
  };

  const myFacultyId = role === 'faculty' ? user?.id : null;

  const filteredForFaculty = useMemo(() => {
    if(!timetable || !myFacultyId) return null;
    const t = {};
    Object.keys(timetable).forEach(day => {
      t[day] = {};
      Object.keys(timetable[day]).forEach(slotKey => {
        const cell = timetable[day][slotKey];
        if(cell.kind === 'class'){
          if(cell.facultyId === myFacultyId){
            t[day][slotKey] = cell;
          } else {
            t[day][slotKey] = { ...cell, kind: 'free' };
          }
        } else {
          t[day][slotKey] = cell; // breaks/lunch
        }
      });
    });
    return t;
  }, [timetable, myFacultyId]);

  const title = useMemo(() => {
    if(role === 'admin') return 'Master Timetable';
    if(role === 'faculty') return `My Teaching Timetable`;
    if(role === 'student') return `Class Timetable`;
    return '';
  }, [role]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Header role={role} user={user} onLogout={onLogout} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {!role && (
          <section className="max-w-2xl mx-auto">
            <AuthTabs faculties={faculties} students={students} onLogin={onLogin} />
          </section>
        )}

        {role === 'admin' && (
          <>
            <AdminPanel
              faculties={faculties}
              rooms={rooms}
              subjects={subjects}
              setFaculties={setFaculties}
              setRooms={setRooms}
              setSubjects={setSubjects}
              onGenerate={(t) => setTimetable(t)}
            />

            {timetable ? (
              <TimetableGrid timetable={timetable} title={title} />
            ) : (
              <div className="text-center text-slate-600">Generate a timetable to preview it here.</div>
            )}
          </>
        )}

        {role === 'faculty' && (
          <>
            {timetable ? (
              <TimetableGrid timetable={filteredForFaculty} title={title} highlightFacultyId={user?.id} />
            ) : (
              <div className="text-center text-slate-600">Waiting for admin to generate a timetable…</div>
            )}
          </>
        )}

        {role === 'student' && (
          <>
            {timetable ? (
              <TimetableGrid timetable={timetable} title={title} />
            ) : (
              <div className="text-center text-slate-600">Waiting for admin to generate a timetable…</div>
            )}
          </>
        )}

        <section className="mt-8 text-xs text-slate-500 text-center">
          Note: This demo focuses on the interface and immediate sharing behavior. Authentication and data persistence can be added next.
        </section>
      </main>
    </div>
  );
}
