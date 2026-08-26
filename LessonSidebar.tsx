import React, { useState } from 'react';
import { Course, CourseModule, Lesson, QuizAttempt } from '../../../shared/types';
import { 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  BookOpen, 
  Award,
  Sparkles,
  Lock
} from 'lucide-react';

interface LessonSidebarProps {
  course: Course;
  currentLessonId: string;
  completedLessonIds: string[];
  quizScores: Record<string, QuizAttempt>;
  onSelectLesson: (lessonId: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  course,
  currentLessonId,
  completedLessonIds,
  quizScores,
  onSelectLesson,
  isOpen,
  onToggleOpen
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() => {
    // Open all modules by default
    const map: Record<string, boolean> = {};
    course.modules.forEach(m => { map[m.id] = true; });
    return map;
  });

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = completedLessonIds.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const toggleModule = (modId: string) => {
    setOpenModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.type === 'video') return <PlayCircle className="w-4 h-4 shrink-0" />;
    if (lesson.type === 'quiz') return <HelpCircle className="w-4 h-4 shrink-0" />;
    return <FileText className="w-4 h-4 shrink-0" />;
  };

  return (
    <aside 
      id="lesson-curriculum-sidebar"
      className={`bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden transition-all duration-300 ${
        isOpen ? 'w-80 sm:w-96' : 'w-0 hidden lg:flex lg:w-80'
      }`}
    >
      {/* Header & Course Progress */}
      <div className="p-5 border-b border-slate-200 shrink-0 bg-white">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Darslar Mundarijasi
          </h3>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            {completedCount}/{totalLessons} dars
          </span>
        </div>

        {/* Course Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Umumiy kurs progressi</span>
            <span className="font-bold text-blue-600">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Search input in lessons */}
        <div className="relative mt-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Darslarni qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Modules & Lessons Scrollable List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {course.modules.map((mod, modIdx) => {
          const isExpanded = openModules[mod.id] ?? true;
          const filteredLessons = mod.lessons.filter(l => 
            l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.description.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (searchQuery && filteredLessons.length === 0) {
            return null;
          }

          const moduleCompletedCount = mod.lessons.filter(l => completedLessonIds.includes(l.id)).length;
          const isModuleDone = moduleCompletedCount === mod.lessons.length && mod.lessons.length > 0;

          return (
            <div key={mod.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              {/* Module Header Button */}
              <button
                id={`btn-module-accordion-${mod.id}`}
                onClick={() => toggleModule(mod.id)}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100/80 transition"
              >
                <div className="flex items-center gap-2.5">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {mod.title}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {moduleCompletedCount}/{mod.lessons.length} tugallandi
                    </span>
                  </div>
                </div>

                {isModuleDone && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </button>

              {/* Lessons List in Module */}
              {isExpanded && (
                <div className="divide-y divide-slate-100 p-1">
                  {filteredLessons.map((lesson) => {
                    const isCurrent = lesson.id === currentLessonId;
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const quizAttempt = quizScores[lesson.id];

                    return (
                      <button
                        key={lesson.id}
                        id={`sidebar-lesson-${lesson.id}`}
                        onClick={() => onSelectLesson(lesson.id)}
                        className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition text-xs relative ${
                          isCurrent
                            ? 'bg-blue-50 text-blue-900 border border-blue-200 shadow-xs'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {/* Status Icon */}
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`} />
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`${isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
                              {getLessonIcon(lesson)}
                            </span>
                            <span className={`font-medium line-clamp-1 ${isCurrent ? 'font-bold text-slate-900' : 'text-slate-800'}`}>
                              {lesson.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                            <span>{lesson.durationMinutes} daqiqa</span>

                            {/* Quiz status badge if applicable */}
                            {lesson.quiz && (
                              <span className="flex items-center gap-1">
                                • 
                                {quizAttempt ? (
                                  <span className={`font-semibold ${quizAttempt.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    Test: {quizAttempt.percentage}% {quizAttempt.passed ? '✅' : '❌'}
                                  </span>
                                ) : (
                                  <span className="text-blue-600 font-medium">Test bor</span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
