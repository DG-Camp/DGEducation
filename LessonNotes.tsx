import React, { useState, useEffect } from 'react';
import { LessonNote } from '../../../shared/types';
import { 
  PenTool, 
  Plus, 
  Trash2, 
  Download, 
  StickyNote, 
  Check, 
  Calendar
} from 'lucide-react';

interface LessonNotesProps {
  lessonId: string;
  lessonTitle: string;
  notes: LessonNote[];
  onAddNote: (content: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const LessonNotes: React.FC<LessonNotesProps> = ({
  lessonId,
  lessonTitle,
  notes,
  onAddNote,
  onDeleteNote
}) => {
  const [newNoteText, setNewNoteText] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(newNoteText.trim());
    setNewNoteText('');
  };

  const handleExportNotes = () => {
    const textContent = `Dars: ${lessonTitle}\nEslatmalar:\n\n` + 
      notes.map((n, i) => `${i + 1}. [${new Date(n.createdAt).toLocaleDateString()}] ${n.content}`).join('\n\n');
    
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Konspekt_${lessonId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="lesson-notes-container" className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-emerald-600" />
              Mening Dars Konspektim
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dars davomida eng muhim fikrlar, qoidalar va kod parchalarini saqlab boring.
            </p>
          </div>

          {notes.length > 0 && (
            <button
              onClick={handleExportNotes}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition"
              title="Konspektni fayl qilib yuklash"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              Yuklab olish (.txt)
            </button>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} className="space-y-3">
          <textarea
            id="note-textarea-input"
            rows={3}
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Yangi eslatma yoki fikringizni yozing..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition"
          />

          <div className="flex justify-end">
            <button
              id="btn-save-note"
              type="submit"
              disabled={!newNoteText.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Eslatmani saqlash
            </button>
          </div>
        </form>

        {/* Saved notes list */}
        <div className="space-y-3 mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Saqlangan Eslatmalar ({notes.length})
          </h4>

          {notes.length > 0 ? (
            <div className="space-y-2.5">
              {notes.map(note => (
                <div 
                  key={note.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start justify-between gap-3 group hover:border-slate-300 transition"
                >
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition opacity-80 group-hover:opacity-100"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              Hozircha hech qanday eslatma yo‘q. Yuqoridagi maydonga yozing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
