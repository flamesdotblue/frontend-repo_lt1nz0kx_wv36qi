import React from 'react';
import { daySlots } from './AdminPanel';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TimetableGrid({ timetable, title, highlightFacultyId }) {
  return (
    <div className="w-full border rounded-xl bg-white overflow-hidden">
      <div className="px-4 py-3 border-b bg-slate-50">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500">Breaks and lunch are shown inline. Empty cells indicate free periods.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-slate-600 border-b bg-white sticky left-0">Time</th>
              {weekdays.map((d) => (
                <th key={d} className="px-3 py-2 text-left text-slate-600 border-b">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daySlots.map((slot) => (
              <tr key={slot.key} className="align-top">
                <td className="px-3 py-2 border-r bg-white sticky left-0">
                  <div className="font-medium text-slate-800">{slot.label}</div>
                  <div className="text-xs text-slate-500">{slot.start} – {slot.end}</div>
                </td>
                {weekdays.map((day) => {
                  const cell = timetable?.[day]?.[slot.key];
                  if(slot.type !== 'class'){
                    return (
                      <td key={day} className="px-3 py-2 border-b">
                        <div className={`px-2 py-1 inline-block rounded-md text-xs ${slot.type==='lunch' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>{slot.type === 'lunch' ? 'Lunch' : 'Short Break'}</div>
                      </td>
                    );
                  }
                  if(!cell || cell.kind === 'free'){
                    return (
                      <td key={day} className="px-3 py-2 border-b text-slate-400">Free</td>
                    );
                  }
                  const isMine = highlightFacultyId && cell.facultyId === highlightFacultyId;
                  return (
                    <td key={day} className={`px-3 py-2 border-b ${isMine ? 'bg-indigo-50' : ''}`}>
                      <div className="font-medium text-slate-800">{cell.subject}</div>
                      <div className="text-xs text-slate-500">Room: {cell.room}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
