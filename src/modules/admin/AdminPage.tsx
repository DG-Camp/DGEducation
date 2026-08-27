import { useState, useEffect, type FormEvent } from 'react';
import { Course, Lesson, User, initialCourses } from '../../data';
import './admin.css';

// ─── helpers ────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);

const STORAGE_COURSES = 'dge:courses';
const STORAGE_USER    = 'dge:user';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// ─── types ───────────────────────────────────────────────────────────────────
type CourseDraft = {
  title: string;
  category: Course['category'];
  level: Course['level'];
  description: string;
};

type LessonDraft = {
  courseId: string;
  title: string;
  duration: string;
  type: Lesson['type'];
  summary: string;
};

type AdminTab = 'courses' | 'lessons';

const EMPTY_COURSE: CourseDraft = {
  title: '',
  category: 'Programming',
  level: 'Beginner',
  description: '',
};

// ─── component ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [courses, setCourses]               = useState<Course[]>(() => load(STORAGE_COURSES, initialCourses));
  const [currentUser]                       = useState<User | null>(() => load(STORAGE_USER, null));
  const [tab, setTab]                       = useState<AdminTab>('courses');
  const [courseDraft, setCourseDraft]       = useState<CourseDraft>(EMPTY_COURSE);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [lessonDraft, setLessonDraft]       = useState<LessonDraft>({
    courseId: '',
    title: '',
    duration: '10 min',
    type: 'Reading',
    summary: '',
  });
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [toast, setToast]                   = useState<string | null>(null);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm]   = useState<{ type: 'course' | 'lesson'; courseId: string; lessonId?: string } | null>(null);

  // Sync to localStorage whenever courses change
  useEffect(() => {
    localStorage.setItem(STORAGE_COURSES, JSON.stringify(courses));
  }, [courses]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  // ── course actions ──────────────────────────────────────────────────────────
  const submitCourse = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = courseDraft.title.trim();
    const desc  = courseDraft.description.trim();
    if (!title || !desc) return;

    if (editingCourseId) {
      setCourses(prev =>
        prev.map(c =>
          c.id === editingCourseId
            ? { ...c, title, category: courseDraft.category, level: courseDraft.level, description: desc }
            : c,
        ),
      );
      setToast('✅ Course updated');
      setEditingCourseId(null);
    } else {
      const accentMap: Record<Course['category'], string> = {
        AI: 'indigo',
        Design: 'blue',
        Programming: 'green',
      };
      const newCourse: Course = {
        id: uid(),
        title,
        category: courseDraft.category,
        level: courseDraft.level,
        description: desc,
        accent: accentMap[courseDraft.category],
        lessons: [
          {
            id: uid(),
            title: 'Welcome Lesson',
            duration: '5 min',
            type: 'Reading',
            summary: 'First lesson created from the admin panel.',
            body: ['This lesson was added through the admin panel and appears in the catalog immediately.'],
            highlights: ['Admin content', 'Locally stored', 'Ready to edit'],
            videoLabel: 'Welcome lesson preview',
            questions: [
              { prompt: 'Was this lesson created from the admin panel?', options: ['Yes', 'No'], answerIndex: 0 },
            ],
          },
        ],
      };
      setCourses(prev => [newCourse, ...prev]);
      setToast('✅ New course added');
    }
    setCourseDraft(EMPTY_COURSE);
  };

  const startEditCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setCourseDraft({ title: course.title, category: course.category, level: course.level, description: course.description });
    setTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelCourseEdit = () => {
    setEditingCourseId(null);
    setCourseDraft(EMPTY_COURSE);
  };

  const confirmDeleteCourse = (courseId: string) => {
    setDeleteConfirm({ type: 'course', courseId });
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setToast('🗑️ Course deleted');
    setDeleteConfirm(null);
    if (expandedCourseId === courseId) setExpandedCourseId(null);
  };

  // ── lesson actions ──────────────────────────────────────────────────────────
  const submitLesson = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title   = lessonDraft.title.trim();
    const summary = lessonDraft.summary.trim();
    if (!lessonDraft.courseId || !title || !summary) return;

    if (editingLessonId) {
      setCourses(prev =>
        prev.map(c =>
          c.id === lessonDraft.courseId
            ? {
                ...c,
                lessons: c.lessons.map(l =>
                  l.id === editingLessonId
                    ? { ...l, title, duration: lessonDraft.duration, type: lessonDraft.type, summary }
                    : l,
                ),
              }
            : c,
        ),
      );
      setToast('✅ Lesson updated');
      setEditingLessonId(null);
    } else {
      const newLesson: Lesson = {
        id: uid(),
        title,
        duration: lessonDraft.duration,
        type: lessonDraft.type,
        summary,
        body: ['This lesson was added via the admin workflow.', 'Main content can be edited later.'],
        highlights: ['Persistent', 'Shared design system', 'Path ready'],
        videoLabel: 'Admin lesson preview',
        questions: [
          { prompt: 'Was this lesson created by an admin?', options: ['Yes', 'No'], answerIndex: 0 },
          { prompt: 'Does it follow the shared design system?', options: ['Yes', 'No'], answerIndex: 0 },
        ],
      };
      setCourses(prev =>
        prev.map(c =>
          c.id === lessonDraft.courseId ? { ...c, lessons: [...c.lessons, newLesson] } : c,
        ),
      );
      setToast('✅ New lesson added');
    }
    setLessonDraft(prev => ({ ...prev, title: '', summary: '' }));
  };

  const startEditLesson = (courseId: string, lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setLessonDraft({ courseId, title: lesson.title, duration: lesson.duration, type: lesson.type, summary: lesson.summary });
    setTab('lessons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelLessonEdit = () => {
    setEditingLessonId(null);
    setLessonDraft(prev => ({ ...prev, title: '', summary: '' }));
  };

  const confirmDeleteLesson = (courseId: string, lessonId: string) => {
    setDeleteConfirm({ type: 'lesson', courseId, lessonId });
  };

  const deleteLesson = (courseId: string, lessonId: string) => {
    setCourses(prev =>
      prev.map(c =>
        c.id === courseId ? { ...c, lessons: c.lessons.filter(l => l.id !== lessonId) } : c,
      ),
    );
    setToast('🗑️ Lesson deleted');
    setDeleteConfirm(null);
  };

  const totalLessons = courses.reduce((n, c) => n + c.lessons.length, 0);

  // ── access guard ───────────────────────────────────────────────────────────
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="adm-guard">
        <div className="adm-guard-icon">🔒</div>
        <h2>Admin access required</h2>
        <p>
          Sign in with an admin account to access this page.
          <br />
          Demo: <code>admin@digitalgen.edu</code> / <code>admin123</code>
        </p>
      </div>
    );
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="adm-root">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="adm-header">
        <div className="adm-header-left">
          <span className="adm-badge">ADMIN</span>
          <div>
            <h1 className="adm-title">Admin Panel</h1>
            <p className="adm-subtitle">Manage courses and lessons</p>
          </div>
        </div>
        <div className="adm-stats">
          <div className="adm-stat">
            <span className="adm-stat-value">{courses.length}</span>
            <span className="adm-stat-label">Courses</span>
          </div>
          <div className="adm-stat">
            <span className="adm-stat-value">{totalLessons}</span>
            <span className="adm-stat-label">Lessons</span>
          </div>
          <div className="adm-stat">
            <span className="adm-stat-value adm-user-name">{currentUser.name.split(' ')[0]}</span>
            <span className="adm-stat-label">Admin</span>
          </div>
        </div>
      </header>

      {/* ── Tab nav ────────────────────────────────────────────── */}
      <div className="adm-tabs">
        <button
          className={`adm-tab${tab === 'courses' ? ' active' : ''}`}
          onClick={() => setTab('courses')}
        >
          📚 Courses
        </button>
        <button
          className={`adm-tab${tab === 'lessons' ? ' active' : ''}`}
          onClick={() => setTab('lessons')}
        >
          📄 Lessons
        </button>
      </div>

      <div className="adm-body">
        {/* ═══════════════ COURSES TAB ═══════════════ */}
        {tab === 'courses' && (
          <div className="adm-two-col">
            {/* Form */}
            <section className="adm-card">
              <h2 className="adm-card-title">
                {editingCourseId ? '✏️ Edit course' : '➕ Add new course'}
              </h2>

              <form className="adm-form" onSubmit={submitCourse}>
                <label className="adm-field">
                  <span>Title *</span>
                  <input
                    value={courseDraft.title}
                    onChange={e => setCourseDraft(d => ({ ...d, title: e.target.value }))}
                    placeholder="e.g. Getting Started with Python"
                    required
                  />
                </label>

                <label className="adm-field">
                  <span>Category</span>
                  <select
                    value={courseDraft.category}
                    onChange={e => setCourseDraft(d => ({ ...d, category: e.target.value as Course['category'] }))}
                  >
                    <option>Programming</option>
                    <option>Design</option>
                    <option>AI</option>
                  </select>
                </label>

                <label className="adm-field">
                  <span>Level</span>
                  <select
                    value={courseDraft.level}
                    onChange={e => setCourseDraft(d => ({ ...d, level: e.target.value as Course['level'] }))}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </label>

                <label className="adm-field">
                  <span>Description *</span>
                  <textarea
                    rows={3}
                    value={courseDraft.description}
                    onChange={e => setCourseDraft(d => ({ ...d, description: e.target.value }))}
                    placeholder="Short description of the course..."
                    required
                  />
                </label>

                <div className="adm-row">
                  <button className="adm-btn primary" type="submit">
                    {editingCourseId ? 'Save changes' : 'Add course'}
                  </button>
                  {editingCourseId && (
                    <button className="adm-btn ghost" type="button" onClick={cancelCourseEdit}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* Course list */}
            <section className="adm-card adm-course-list-card">
              <h2 className="adm-card-title">📋 Existing courses ({courses.length})</h2>
              <div className="adm-course-list">
                {courses.map(course => {
                  const expanded = expandedCourseId === course.id;
                  return (
                    <div className="adm-course-item" key={course.id}>
                      <div className="adm-course-row">
                        <div className="adm-course-info">
                          <span className={`adm-accent-dot accent-${course.accent}`} />
                          <div>
                            <strong className="adm-course-name">{course.title}</strong>
                            <span className="adm-course-meta">
                              {course.category} · {course.level} · {course.lessons.length} lessons
                            </span>
                          </div>
                        </div>
                        <div className="adm-row tight">
                          <button
                            className="adm-icon-btn"
                            title="View lessons"
                            onClick={() => setExpandedCourseId(expanded ? null : course.id)}
                          >
                            {expanded ? '▲' : '▼'}
                          </button>
                          <button className="adm-icon-btn edit" title="Tahrirlash" onClick={() => startEditCourse(course)}>
                            ✏️
                          </button>
                          <button className="adm-icon-btn danger" title="O'chirish" onClick={() => confirmDeleteCourse(course.id)}>
                            🗑️
                          </button>
                        </div>
                      </div>

                      {expanded && (
                        <div className="adm-lesson-sub">
                          {course.lessons.length === 0 ? (
                            <p className="adm-empty-sub">No lessons yet</p>
                          ) : (
                            course.lessons.map(lesson => (
                              <div className="adm-lesson-row" key={lesson.id}>
                                <div>
                                  <strong>{lesson.title}</strong>
                                  <span className="adm-course-meta">{lesson.duration} · {lesson.type}</span>
                                </div>
                                <div className="adm-row tight">
                                  <button className="adm-icon-btn edit" onClick={() => startEditLesson(course.id, lesson)}>✏️</button>
                                  <button className="adm-icon-btn danger" onClick={() => confirmDeleteLesson(course.id, lesson.id)}>🗑️</button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ═══════════════ LESSONS TAB ═══════════════ */}
        {tab === 'lessons' && (
          <div className="adm-two-col">
            {/* Form */}
            <section className="adm-card">
              <h2 className="adm-card-title">
                {editingLessonId ? '✏️ Edit lesson' : '➕ Add new lesson'}
              </h2>

              <form className="adm-form" onSubmit={submitLesson}>
                <label className="adm-field">
                  <span>Course *</span>
                  <select
                    value={lessonDraft.courseId}
                    onChange={e => setLessonDraft(d => ({ ...d, courseId: e.target.value }))}
                    required
                  >
                    <option value="">— Select a course —</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </label>

                <label className="adm-field">
                  <span>Title *</span>
                  <input
                    value={lessonDraft.title}
                    onChange={e => setLessonDraft(d => ({ ...d, title: e.target.value }))}
                    placeholder="e.g. CSS Grid Basics"
                    required
                  />
                </label>

                <div className="adm-two-inline">
                  <label className="adm-field">
                    <span>Duration</span>
                    <input
                      value={lessonDraft.duration}
                      onChange={e => setLessonDraft(d => ({ ...d, duration: e.target.value }))}
                      placeholder="10 min"
                    />
                  </label>
                  <label className="adm-field">
                    <span>Type</span>
                    <select
                      value={lessonDraft.type}
                      onChange={e => setLessonDraft(d => ({ ...d, type: e.target.value as Lesson['type'] }))}
                    >
                      <option>Reading</option>
                      <option>Video</option>
                      <option>Practice</option>
                    </select>
                  </label>
                </div>

                <label className="adm-field">
                  <span>Summary *</span>
                  <textarea
                    rows={3}
                    value={lessonDraft.summary}
                    onChange={e => setLessonDraft(d => ({ ...d, summary: e.target.value }))}
                    placeholder="Short description of the lesson..."
                    required
                  />
                </label>

                <div className="adm-row">
                  <button className="adm-btn primary" type="submit">
                    {editingLessonId ? 'Save changes' : 'Add lesson'}
                  </button>
                  {editingLessonId && (
                    <button className="adm-btn ghost" type="button" onClick={cancelLessonEdit}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* All lessons list */}
            <section className="adm-card adm-course-list-card">
              <h2 className="adm-card-title">📋 All lessons ({totalLessons})</h2>
              <div className="adm-course-list">
                {courses.map(course =>
                  course.lessons.map(lesson => (
                    <div className="adm-lesson-full-row" key={lesson.id}>
                      <div className="adm-lesson-full-info">
                        <div className={`adm-lesson-full-type adm-type-${lesson.type.toLowerCase()}`}>{lesson.type}</div>
                        <div>
                          <strong>{lesson.title}</strong>
                          <span className="adm-course-meta">{course.title} · {lesson.duration}</span>
                        </div>
                      </div>
                      <div className="adm-row tight">
                        <button className="adm-icon-btn edit" onClick={() => startEditLesson(course.id, lesson)}>✏️</button>
                        <button className="adm-icon-btn danger" onClick={() => confirmDeleteLesson(course.id, lesson.id)}>🗑️</button>
                      </div>
                    </div>
                  )),
                )}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* ── Delete confirm modal ───────────────────────────────── */}
      {deleteConfirm && (
        <div className="adm-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-icon">⚠️</div>
            <h3>Confirm deletion</h3>
            <p>
              {deleteConfirm.type === 'course'
                ? 'Delete this course and all its lessons?'
                : 'Delete this lesson?'}
            </p>
            <div className="adm-row center">
              <button
                className="adm-btn danger"
                onClick={() =>
                  deleteConfirm.type === 'course'
                    ? deleteCourse(deleteConfirm.courseId)
                    : deleteLesson(deleteConfirm.courseId, deleteConfirm.lessonId!)
                }
              >
                Yes, delete
              </button>
              <button className="adm-btn ghost" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ─────────────────────────────────────────────── */}
      {toast && <div className="adm-toast">{toast}</div>}
    </div>
  );
}
