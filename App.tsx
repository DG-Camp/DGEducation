import React, { useState } from 'react';
import { MOCK_COURSES } from './shared/data/mockCourses';
import { LessonViewPage } from './modules/lessons/LessonViewPage';
import { Course } from './shared/types';
import { 
  BookOpen, 
  Layers, 
  ChevronDown, 
  GraduationCap,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [courses] = useState<Course[]>(MOCK_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(MOCK_COURSES[0]?.id || '');
  const [showCourseSelector, setShowCourseSelector] = useState<boolean>(false);

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Global Bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-900">Digital Generation Edu</span>
          <span className="text-slate-300">/</span>
          <span className="text-blue-600 font-semibold hidden sm:inline">5.3 Dars Ko‘rish & 5.4 Test/Quiz Moduli</span>
        </div>

        {/* Simple Course Switcher */}
        <div className="relative">
          <button
            id="btn-course-switcher-dropdown"
            onClick={() => setShowCourseSelector(!showCourseSelector)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 border border-slate-200 transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span className="max-w-[140px] sm:max-w-xs truncate">{activeCourse?.title}</span>
            <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${showCourseSelector ? 'rotate-180' : ''}`} />
          </button>

          {showCourseSelector && (
            <div 
              id="course-dropdown-menu"
              className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Mavjud Kurslar ({courses.length})
              </div>
              {courses.map(course => {
                const isSelected = course.id === activeCourse?.id;
                return (
                  <button
                    key={course.id}
                    id={`btn-select-course-${course.id}`}
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setShowCourseSelector(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <BookOpen className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{course.title}</div>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                        {course.category} • {course.lessonsCount} ta dars
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Main 5.3 & 5.4 Combined View */}
      <main className="flex-1 flex flex-col">
        {activeCourse ? (
          <LessonViewPage key={activeCourse.id} course={activeCourse} />
        ) : (
          <div className="p-8 text-center text-slate-500">Kurs topilmadi.</div>
        )}
      </main>
    </div>
  );
}
