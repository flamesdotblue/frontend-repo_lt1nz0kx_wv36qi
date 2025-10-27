import React, { useMemo, useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Fixed day structure: 7 classes, 2 short breaks, 1 lunch, 9:15 → 3:50
export const daySlots = [
  { key: 'P1', label: 'Period 1', start: '09:15', end: '10:00', type: 'class' },
  { key: 'P2', label: 'Period 2', start: '10:00', end: '10:45', type: 'class' },
  { key: 'B1', label: 'Short Break', start: '10:45', end: '10:55', type: 'break' },
  { key: 'P3', label: 'Period 3', start: '10:55', end: '11:40', type: 'class' },
  { key: 'P4', label: 'Period 4', start: '11:40', end: '12:25', type: 'class' },
  { key: 'L', label: 'Lunch', start: '12:25', end: '13:05', type: 'lunch' },
  { key: 'P5', label: 'Period 5', start: '13:05', end: '13:50', type: 'class' },
  { key: 'B2', label: 'Short Break', start: '13:50', end: '14:00', type: 'break' },
  { key: 'P6', label: 'Period 6', start: '14:00', end: '14:45', type: 'class' },
  { key: 'P7', label: 'Period 7', start: '14:45', end: '15:50', type: 'class' },
];

function uid(prefix='id'){
  return `${prefix}_${Math.random().toString(36).slice(2,9)}`;
}

export default function AdminPanel({ faculties, rooms, subjects, setFaculties, setRooms, setSubjects, onGenerate }) {
  const [fName, setFName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectFaculty, setSubjectFaculty] = useState('');

  const canGenerate = useMemo(() => faculties.length > 0 && rooms.length > 0 && subjects.length > 0, [faculties, rooms, subjects]);

  const addFaculty = () => {
    if(!fName.trim()) return;
    setFaculties(prev => [...prev, { id: uid('fac'), name: fName.trim() }]);
    setFName('');
  };

  const addRoom = () => {
    if(!roomName.trim()) return;
    setRooms(prev => [...prev, { id: uid('room'), name: roomName.trim() }]);
    setRoomName('');
  };

  const addSubject = () => {
    if(!subjectName.trim() || !subjectFaculty) return;
    setSubjects(prev => [...prev, { id: uid('sub'), name: subjectName.trim(), facultyId: subjectFaculty }]);
    setSubjectName('');
    setSubjectFaculty('');
  };

  const generate = () => {
    // Build timetable for Mon-Sat with constraints
    // For simplicity: assign subjects round-robin across days and slots, ensure a subject's faculty isn't double-booked at the same slot by distributing
    const days = weekdays;
    const t = {};
    const classSlots = daySlots.filter(s => s.type === 'class');

    // Shuffle helper for variety
    const shuffle = (arr) => arr.map(v => ({v, r: Math.random()})).sort((a,b)=>a.r-b.r).map(({v})=>v);

    const subjList = shuffle(subjects);
    const roomList = shuffle(rooms);

    let subjIndex = 0;
    let roomIndex = 0;

    // Track faculty occupancy per day/slot
    const busy = {};

    days.forEach(day => {
      t[day] = {};
      daySlots.forEach(slot => {
        if(slot.type !== 'class'){
          t[day][slot.key] = { ...slot, kind: slot.type };
          return;
        }
        // find next subject whose faculty is free at this (day, slot)
        let attempts = 0;
        let assigned = null;
        while(attempts < subjList.length){
          const s = subjList[(subjIndex + attempts) % subjList.length];
          const facKey = `${day}_${slot.key}_${s.facultyId}`;
          if(!busy[facKey]){
            busy[facKey] = true;
            assigned = s;
            subjIndex = (subjIndex + attempts + 1) % subjList.length;
            break;
          }
          attempts++;
        }
        const room = roomList[roomIndex % roomList.length];
        roomIndex++;
        if(assigned){
          t[day][slot.key] = { ...slot, kind: 'class', subjectId: assigned.id, subject: assigned.name, facultyId: assigned.facultyId, room: room.name };
        } else {
          t[day][slot.key] = { ...slot, kind: 'free' };
        }
      });
    });

    onGenerate(t);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <section className="p-4 border rounded-xl bg-white">
          <h3 className="font-semibold mb-3">Add Faculty</h3>
          <div className="flex gap-2">
            <input value={fName} onChange={(e)=>setFName(e.target.value)} placeholder="Name" className="flex-1 border rounded-md px-3 py-2" />
            <button onClick={addFaculty} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800"><Plus className="w-4 h-4"/>Add</button>
          </div>
          <p className="mt-2 text-xs text-slate-500">Only Admin can create faculty accounts.</p>
          <ul className="mt-3 text-sm text-slate-700 space-y-1 max-h-32 overflow-auto">
            {faculties.map(f => (<li key={f.id}>• {f.name}</li>))}
          </ul>
        </section>

        <section className="p-4 border rounded-xl bg-white">
          <h3 className="font-semibold mb-3">Add Rooms</h3>
          <div className="flex gap-2">
            <input value={roomName} onChange={(e)=>setRoomName(e.target.value)} placeholder="e.g., Room 101" className="flex-1 border rounded-md px-3 py-2" />
            <button onClick={addRoom} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800"><Plus className="w-4 h-4"/>Add</button>
          </div>
          <ul className="mt-3 text-sm text-slate-700 space-y-1 max-h-32 overflow-auto">
            {rooms.map(r => (<li key={r.id}>• {r.name}</li>))}
          </ul>
        </section>

        <section className="p-4 border rounded-xl bg-white">
          <h3 className="font-semibold mb-3">Add Subjects</h3>
          <div className="grid grid-cols-1 gap-2">
            <input value={subjectName} onChange={(e)=>setSubjectName(e.target.value)} placeholder="Subject name" className="border rounded-md px-3 py-2" />
            <select value={subjectFaculty} onChange={(e)=>setSubjectFaculty(e.target.value)} className="border rounded-md px-3 py-2">
              <option value="">Assign Faculty…</option>
              {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <button onClick={addSubject} className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800">
              <Plus className="w-4 h-4"/>Add Subject
            </button>
          </div>
          <ul className="mt-3 text-sm text-slate-700 space-y-1 max-h-32 overflow-auto">
            {subjects.map(s => (<li key={s.id}>• {s.name} — <span className="text-slate-500">{faculties.find(f=>f.id===s.facultyId)?.name || 'Unassigned'}</span></li>))}
          </ul>
        </section>
      </div>

      <div className="lg:col-span-2">
        <section className="p-6 border rounded-xl bg-gradient-to-br from-indigo-50 to-white h-full flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">Generate Weekly Timetable</h3>
              <p className="text-sm text-slate-600 mt-1">Mon–Sat • 7 periods/day • 2 short breaks • 1 lunch • 9:15am–3:50pm</p>
            </div>
            <button
              onClick={generate}
              disabled={!canGenerate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4"/> Generate
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-3 text-center text-xs text-slate-700">
            {weekdays.map(d => (
              <div key={d} className="px-3 py-2 rounded-md border bg-white">{d}</div>
            ))}
          </div>

          <div className="mt-4 text-sm text-slate-600">
            Tip: Add at least one faculty, one room, and one subject to enable generation. Timetables are shared instantly to all dashboards.
          </div>
        </section>
      </div>
    </div>
  );
}
