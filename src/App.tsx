import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  Course,
  Comment,
  initialComments,
  initialCourses,
  initialProgress,
  seedUsers,
  User,
  ProgressState,
  Lesson,
} from './data';

type Section = 'journey' | 'catalog' | 'lesson' | 'progress' | 'discussion' | 'admin' | 'leaderboard';
type AuthMode = 'login' | 'register';

const storageKeys = {
  user: 'dge:user',
  progress: 'dge:progress',
  comments: 'dge:comments',
  courses: 'dge:courses',
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const uid = () => Math.random().toString(36).slice(2, 10);

const cloneCourses = (courses: Course[]) => JSON.parse(JSON.stringify(courses)) as Course[];

const loadJson = <T,>(key: string, fallback: T): T => {
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

function App() {
  const [courses, setCourses] = useState<Course[]>(() => {
    if (typeof window === 'undefined') return initialCourses;
    return loadJson<Course[]>(storageKeys.courses, initialCourses);
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    return loadJson<User | null>(storageKeys.user, null);
  });
  const [progress, setProgress] = useState<ProgressState>(() => {
    if (typeof window === 'undefined') return initialProgress;
    return loadJson<ProgressState>(storageKeys.progress, initialProgress);
  });
  const [comments, setComments] = useState<Comment[]>(() => {
    if (typeof window === 'undefined') return initialComments;
    return loadJson<Comment[]>(storageKeys.comments, initialComments);
  });
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [section, setSection] = useState<Section>('journey');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Course['category']>('All');
  const [search, setSearch] = useState('');
  const [activeCourseId, setActiveCourseId] = useState(courses[0]?.id ?? '');
  const [activeLessonId, setActiveLessonId] = useState(courses[0]?.lessons[0]?.id ?? '');
  const [authDraft, setAuthDraft] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [authMessage, setAuthMessage] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizFeedback, setQuizFeedback] = useState<{ score: number; passed: boolean } | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [adminCourseDraft, setAdminCourseDraft] = useState({
    title: '',
    category: 'Programming' as Course['category'],
    level: 'Beginner' as Course['level'],
    description: '',
  });
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [adminLessonDraft, setAdminLessonDraft] = useState({
    courseId: courses[0]?.id ?? '',
    title: '',
    duration: '12 min',
    type: 'Reading' as Lesson['type'],
    summary: '',
  });
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.courses, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.progress, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.comments, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem(storageKeys.user, JSON.stringify(currentUser));
    } else {
      window.localStorage.removeItem(storageKeys.user);
    }
  }, [currentUser]);

  useEffect(() => {
    if (courses.length && !courses.some((course) => course.id === activeCourseId)) {
      setActiveCourseId(courses[0].id);
      setActiveLessonId(courses[0].lessons[0]?.id ?? '');
    }
  }, [courses, activeCourseId]);

  const activeCourse = courses.find((course) => course.id === activeCourseId) ?? courses[0];
  const activeLesson = activeCourse?.lessons.find((lesson) => lesson.id === activeLessonId) ?? activeCourse?.lessons[0];

  useEffect(() => {
    if (!activeCourse) return;
    if (!activeCourse.lessons.some((lesson) => lesson.id === activeLessonId)) {
      setActiveLessonId(activeCourse.lessons[0]?.id ?? '');
    }
  }, [activeCourse, activeLessonId]);

  const visibleCourses = useMemo(() => {
    const term = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesSearch =
        !term ||
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term) ||
        course.lessons.some((lesson) => lesson.title.toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });
  }, [courses, search, selectedCategory]);

  const currentUserComments = comments.filter((comment) => comment.lessonId === activeLesson?.id);
  const totalLessons = courses.reduce((count, course) => count + course.lessons.length, 0);
  const completedCount = progress.completedLessonIds.length;
  const completionPercent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;
  const totalXp = currentUser?.xp ?? 0;
  const leaderboard = useMemo(() => {
    const scored = [
      ...(currentUser
        ? [currentUser]
        : []),
      ...seedUsers.filter((user) => currentUser?.email !== user.email),
    ].map((user) => ({
      ...user,
      score: user.xp + progress.completedLessonIds.length * 50 + Object.values(progress.quizScores).reduce((sum, score) => sum + score, 0),
    }));

    const unique = Array.from(new Map(scored.map((entry) => [entry.email, entry])).values());
    return unique.sort((a, b) => b.score - a.score).slice(0, 10);
  }, [currentUser, progress]);

  const userRank = useMemo(() => {
    if (!currentUser) return null;
    const all = [
      ...leaderboard,
      {
        ...currentUser,
        score: currentUser.xp + progress.completedLessonIds.length * 50 + Object.values(progress.quizScores).reduce((sum, score) => sum + score, 0),
      },
    ].sort((a, b) => b.score - a.score);
    return all.findIndex((entry) => entry.email === currentUser.email) + 1;
  }, [currentUser, leaderboard, progress]);

  const handleAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const baseValidation = authDraft.email.includes('@') && authDraft.password.length >= 6;

    if (!baseValidation) {
      setAuthMessage('Please use a valid email and a password with at least 6 characters.');
      return;
    }

    if (authMode === 'register') {
      const user: User = {
        name: authDraft.name.trim() || 'New Learner',
        email: authDraft.email.trim().toLowerCase(),
        password: authDraft.password,
        role: authDraft.email.toLowerCase().includes('admin') ? 'admin' : 'student',
        joinedAt: new Date().toISOString(),
        xp: 100,
      };
      setCurrentUser(user);
      setAuthMessage('Account created and session stored locally.');
      setSection('journey');
      return;
    }

    const matched =
      seedUsers.find(
        (user) => user.email.toLowerCase() === authDraft.email.trim().toLowerCase() && user.password === authDraft.password,
      ) ??
      (currentUser?.email === authDraft.email.trim().toLowerCase() && currentUser.password === authDraft.password
        ? currentUser
        : null);

    if (!matched) {
      setAuthMessage('No matching account found. Try amina@digitalgen.edu / password123 or admin@digitalgen.edu / admin123.');
      return;
    }

    setCurrentUser(matched);
    setAuthMessage(`Welcome back, ${matched.name}.`);
    setSection('journey');
  };

  const completeLesson = (lessonId: string) => {
    if (!activeCourse || !currentUser) return;
    setProgress((prev) => {
      const completed = prev.completedLessonIds.includes(lessonId)
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lessonId];
      return { ...prev, completedLessonIds: completed };
    });
    setCurrentUser((prev) => (prev ? { ...prev, xp: prev.xp + 40 } : prev));
    setQuizFeedback(null);
  };

  const completeLessonAndAdvance = () => {
    if (!activeCourse || !activeLesson) return;
    completeLesson(activeLesson.id);
    const index = activeCourse.lessons.findIndex((lesson) => lesson.id === activeLesson.id);
    const next = activeCourse.lessons[index + 1];
    if (next) {
      setActiveLessonId(next.id);
    }
  };

  const submitQuiz = () => {
    if (!activeLesson) return;
    const correct = activeLesson.questions.reduce((sum, question, index) => sum + (quizAnswers[`${activeLesson.id}-${index}`] === question.answerIndex ? 1 : 0), 0);
    const score = Math.round((correct / activeLesson.questions.length) * 100);
    const passed = score >= 70;

    setQuizFeedback({ score, passed });
    setProgress((prev) => ({ ...prev, quizScores: { ...prev.quizScores, [activeLesson.id]: score } }));
    if (passed) {
      setCurrentUser((prev) => (prev ? { ...prev, xp: prev.xp + 60 } : prev));
    }
  };

  const retryQuiz = () => {
    if (!activeLesson) return;
    setQuizAnswers((prev) => {
      const next = { ...prev };
      activeLesson.questions.forEach((_, index) => {
        delete next[`${activeLesson.id}-${index}`];
      });
      return next;
    });
    setQuizFeedback(null);
  };

  const addComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeLesson || !currentUser || !commentDraft.trim()) return;
    const comment: Comment = {
      id: uid(),
      lessonId: activeLesson.id,
      author: currentUser.name,
      text: commentDraft.trim(),
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [comment, ...prev]);
    setCommentDraft('');
  };

  const deleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };

  const addCourse = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = adminCourseDraft.title.trim();
    if (!title || !adminCourseDraft.description.trim()) return;
    if (editingCourseId) {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === editingCourseId
            ? {
                ...course,
                title,
                category: adminCourseDraft.category,
                level: adminCourseDraft.level,
                description: adminCourseDraft.description.trim(),
              }
            : course,
        ),
      );
      setEditingCourseId(null);
    } else {
      const course: Course = {
        id: uid(),
        title,
        category: adminCourseDraft.category,
        level: adminCourseDraft.level,
        description: adminCourseDraft.description.trim(),
        accent: adminCourseDraft.category === 'AI' ? 'indigo' : adminCourseDraft.category === 'Design' ? 'blue' : 'green',
        lessons: [
          {
            id: uid(),
            title: 'Welcome Lesson',
            duration: '8 min',
            type: 'Reading',
            summary: 'A starter lesson created from the admin panel.',
            body: ['This lesson was added through the admin workflow and immediately appears in the catalog.'],
            highlights: ['Admin-created content', 'Persisted locally', 'Ready to edit'],
            videoLabel: 'Admin lesson preview',
            questions: [
              { prompt: 'Was this lesson created from the admin panel?', options: ['Yes', 'No'], answerIndex: 0 },
            ],
          },
        ],
      };
      setCourses((prev) => [course, ...prev]);
      setAdminLessonDraft((draft) => ({ ...draft, courseId: course.id }));
    }
    setAdminCourseDraft({ title: '', category: 'Programming', level: 'Beginner', description: '' });
  };

  const addLesson = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const targetCourseId = adminLessonDraft.courseId;
    if (!targetCourseId || !adminLessonDraft.title.trim() || !adminLessonDraft.summary.trim()) return;
    if (editingLessonId) {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === targetCourseId
            ? {
                ...course,
                lessons: course.lessons.map((lesson) =>
                  lesson.id === editingLessonId
                    ? {
                        ...lesson,
                        title: adminLessonDraft.title.trim(),
                        duration: adminLessonDraft.duration,
                        type: adminLessonDraft.type,
                        summary: adminLessonDraft.summary.trim(),
                      }
                    : lesson,
                ),
              }
            : course,
        ),
      );
      setEditingLessonId(null);
    } else {
      const newLesson: Lesson = {
        id: uid(),
        title: adminLessonDraft.title.trim(),
        duration: adminLessonDraft.duration,
        type: adminLessonDraft.type,
        summary: adminLessonDraft.summary.trim(),
        body: [
          'This lesson was added via the admin workflow.',
          'It inherits the same design system and path behavior as the rest of the site.',
        ],
        highlights: ['Persistent', 'Shared tokens', 'Path ready'],
        videoLabel: 'Admin lesson preview',
        questions: [
          { prompt: 'Is this an admin-created lesson?', options: ['Yes', 'No'], answerIndex: 0 },
          { prompt: 'Does it follow the shared design system?', options: ['Yes', 'No'], answerIndex: 0 },
        ],
      };

      setCourses((prev) =>
        prev.map((course) =>
          course.id === targetCourseId ? { ...course, lessons: [...course.lessons, newLesson] } : course,
        ),
      );
    }
    setAdminLessonDraft({ ...adminLessonDraft, title: '', summary: '' });
  };

  const editCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setAdminCourseDraft({
      title: course.title,
      category: course.category,
      level: course.level,
      description: course.description,
    });
    setSection('admin');
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== courseId));
    if (activeCourseId === courseId) {
      const nextCourse = courses.find((course) => course.id !== courseId);
      if (nextCourse) {
        setActiveCourseId(nextCourse.id);
        setActiveLessonId(nextCourse.lessons[0]?.id ?? '');
      }
    }
  };

  const editLesson = (courseId: string, lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setAdminLessonDraft({
      courseId,
      title: lesson.title,
      duration: lesson.duration,
      type: lesson.type,
      summary: lesson.summary,
    });
    setSection('admin');
  };

  const deleteLesson = (courseId: string, lessonId: string) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, lessons: course.lessons.filter((lesson) => lesson.id !== lessonId) } : course,
      ),
    );
    if (activeLessonId === lessonId) {
      const course = courses.find((item) => item.id === courseId);
      setActiveLessonId(course?.lessons.find((lesson) => lesson.id !== lessonId)?.id ?? '');
    }
  };

  const exportCertificate = (course: Course) => {
    if (!currentUser) return;
    const certificateDate = formatDate(new Date().toISOString());
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850">
        <rect width="1200" height="850" fill="#f7f9fb"/>
        <rect x="42" y="42" width="1116" height="766" rx="28" fill="#ffffff" stroke="#c2c6d8" stroke-width="2"/>
        <rect x="72" y="72" width="1056" height="706" rx="22" fill="none" stroke="#0050cb" stroke-width="6" stroke-dasharray="18 16"/>
        <text x="600" y="180" text-anchor="middle" font-family="Hanken Grotesk, Arial, sans-serif" font-size="28" fill="#0050cb" font-weight="700" letter-spacing="6">DIGITAL GENERATION EDU</text>
        <text x="600" y="280" text-anchor="middle" font-family="Hanken Grotesk, Arial, sans-serif" font-size="64" fill="#191c1e" font-weight="800">Certificate of Completion</text>
        <text x="600" y="370" text-anchor="middle" font-family="Hanken Grotesk, Arial, sans-serif" font-size="30" fill="#424656">This certifies that</text>
        <text x="600" y="450" text-anchor="middle" font-family="Hanken Grotesk, Arial, sans-serif" font-size="54" fill="#0050cb" font-weight="800">${currentUser.name}</text>
        <text x="600" y="530" text-anchor="middle" font-family="Hanken Grotesk, Arial, sans-serif" font-size="30" fill="#424656">has completed</text>
        <text x="600" y="610" text-anchor="middle" font-family="Hanken Grotesk, Arial, sans-serif" font-size="46" fill="#006c49" font-weight="700">${course.title}</text>
        <text x="600" y="690" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="24" fill="#4345d1">${certificateDate}</text>
      </svg>
    `;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${currentUser.name.replace(/\s+/g, '-').toLowerCase()}-${course.id}-certificate.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const completedCourses = courses.filter((course) => course.lessons.every((lesson) => progress.completedLessonIds.includes(lesson.id)));

  return (
    <div className="app-shell">
      <aside className="hero-panel">
        <div className="brand-mark">DG</div>
        <p className="eyebrow">Digital Generation Edu</p>
        <h1>Learning as a path, not a pile of cards.</h1>
        <p className="lede">
          Courses, lessons, progress, and certificates all move along the same roadmap so the journey always feels
          coherent.
        </p>

        <div className="path-stack">
          <PathNode step="01" title="Discover" detail="Browse the catalog and pick a trail." state="active" />
          <PathNode step="02" title="Learn" detail="Open lessons, watch, read, and practice." state="idle" />
          <PathNode step="03" title="Prove" detail="Pass quizzes, complete progress, unlock rewards." state="complete" />
        </div>

        <div className="hero-metrics">
          <Metric label="Lessons complete" value={`${completedCount}/${totalLessons}`} />
          <Metric label="Current XP" value={`${totalXp}`} mono />
          <Metric label="Completion" value={`${completionPercent}%`} mono />
        </div>
      </aside>

      <main className="content-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Digital Generation Edu</p>
            <h2>{sectionLabel(section)}</h2>
          </div>
          <nav className="nav-tabs">
            {(['journey', 'catalog', 'lesson', 'progress', 'discussion', 'admin', 'leaderboard'] as Section[]).map((item) => (
              <button key={item} className={section === item ? 'tab active' : 'tab'} onClick={() => setSection(item)}>
                {sectionLabel(item)}
              </button>
            ))}
          </nav>
        </header>

        <section className="status-strip">
          <div className="status-card primary">
            <span className="chip">Path</span>
            <strong>{activeCourse?.title ?? 'No course selected'}</strong>
            <span>{activeLesson?.title ?? 'Select a lesson to continue'}</span>
          </div>
          <div className="status-card">
            <span className="chip">User</span>
            <strong>{currentUser?.name ?? 'Guest learner'}</strong>
            <span>{currentUser?.role ?? 'Browse mode'}</span>
          </div>
          <div className="status-card">
            <span className="chip">Rank</span>
            <strong>{userRank ? `#${userRank}` : 'Unranked'}</strong>
            <span>{currentUser ? 'Leaderboard position' : 'Login to appear'}</span>
          </div>
        </section>

        {section === 'journey' && (
          <section className="hero-grid">
            <Card title="Sign in or Register" subtitle="Local demo authentication with password validation and session persistence.">
              <form className="stack" onSubmit={handleAuthSubmit}>
                <div className="segmented">
                  <button type="button" className={authMode === 'login' ? 'segment active' : 'segment'} onClick={() => setAuthMode('login')}>
                    Login
                  </button>
                  <button type="button" className={authMode === 'register' ? 'segment active' : 'segment'} onClick={() => setAuthMode('register')}>
                    Register
                  </button>
                </div>
                {authMode === 'register' && (
                  <label className="field">
                    <span>Name</span>
                    <input value={authDraft.name} onChange={(e) => setAuthDraft((draft) => ({ ...draft, name: e.target.value }))} placeholder="Your name" />
                  </label>
                )}
                <label className="field">
                  <span>Email</span>
                  <input value={authDraft.email} onChange={(e) => setAuthDraft((draft) => ({ ...draft, email: e.target.value }))} placeholder="name@example.com" />
                </label>
                <label className="field">
                  <span>Password</span>
                  <input
                    type="password"
                    value={authDraft.password}
                    onChange={(e) => setAuthDraft((draft) => ({ ...draft, password: e.target.value }))}
                    placeholder="At least 6 characters"
                  />
                </label>
                <button className="primary-button" type="submit">
                  {authMode === 'register' ? 'Create account' : 'Continue learning'}
                </button>
                {authMessage && <p className="message">{authMessage}</p>}
              </form>
            </Card>

            <Card title="Catalog highlights" subtitle="A path-based preview of the whole platform.">
              <div className="highlights">
                {courses.map((course, index) => (
                  <button key={course.id} className={course.id === activeCourseId ? 'highlight active' : 'highlight'} onClick={() => { setActiveCourseId(course.id); setSection('catalog'); }}>
                    <span className="highlight-index">0{index + 1}</span>
                    <span className="highlight-title">{course.title}</span>
                    <span className="highlight-detail">{course.category} · {course.level}</span>
                  </button>
                ))}
              </div>
            </Card>
          </section>
        )}

        {section === 'catalog' && (
          <section className="stack">
            <Card
              title="Course catalog"
              subtitle="Filter by category or search by course and lesson names. Click a card to open its path."
              headerAction={
                <input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses..." />
              }
            >
              <div className="filter-row">
                {(['All', 'Programming', 'Design', 'AI'] as const).map((category) => (
                  <button key={category} className={selectedCategory === category ? 'filter active' : 'filter'} onClick={() => setSelectedCategory(category)}>
                    {category}
                  </button>
                ))}
              </div>
              <div className="course-grid">
                {visibleCourses.length ? visibleCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    completed={course.lessons.every((lesson) => progress.completedLessonIds.includes(lesson.id))}
                    active={activeCourseId === course.id}
                    onClick={() => {
                      setActiveCourseId(course.id);
                      setActiveLessonId(course.lessons[0]?.id ?? '');
                      setSection('lesson');
                    }}
                  />
                )) : <EmptyState title="No courses match your filter" description="Try a different category or search term." />}
              </div>
            </Card>
          </section>
        )}

        {section === 'lesson' && activeCourse && activeLesson && (
          <section className="lesson-layout">
            <Card title={`${activeCourse.title} path`} subtitle="Use the roadmap on the left to move between lessons.">
              <div className="lesson-path">
                {activeCourse.lessons.map((lesson, index) => {
                  const completed = progress.completedLessonIds.includes(lesson.id);
                  const active = lesson.id === activeLesson.id;
                  const locked = index > 0 && !progress.completedLessonIds.includes(activeCourse.lessons[index - 1].id);
                  return (
                    <button
                      key={lesson.id}
                      className={active ? 'lesson-node active' : completed ? 'lesson-node complete' : 'lesson-node'}
                      disabled={locked}
                      onClick={() => setActiveLessonId(lesson.id)}
                    >
                      <span className="lesson-node-step">{String(index + 1).padStart(2, '0')}</span>
                      <span className="lesson-node-title">{lesson.title}</span>
                      <span className="lesson-node-meta">{lesson.duration} · {lesson.type}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            <div className="stack">
              <Card
                title={activeLesson.title}
                subtitle={activeLesson.summary}
                headerAction={<span className="chip mono">{activeLesson.duration}</span>}
              >
                <div className="lesson-video">
                  <span>{activeLesson.videoLabel}</span>
                </div>
                <div className="lesson-body">
                  {activeLesson.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                <div className="highlights compact">
                  {activeLesson.highlights.map((item) => (
                    <span className="mini-pill" key={item}>{item}</span>
                  ))}
                </div>
                <div className="button-row">
                  <button className="ghost-button" onClick={() => {
                    const index = activeCourse.lessons.findIndex((lesson) => lesson.id === activeLesson.id);
                    const prev = activeCourse.lessons[index - 1];
                    if (prev) setActiveLessonId(prev.id);
                  }}>
                    Previous lesson
                  </button>
                  <button className="primary-button" onClick={completeLessonAndAdvance}>
                    Mark complete
                  </button>
                  <button className="success-button" onClick={() => setSection('progress')}>
                    View progress
                  </button>
                </div>
              </Card>

              <Card title="Lesson quiz" subtitle="Submit answers to calculate a score and unlock the success state.">
                <div className="quiz-list">
                  {activeLesson.questions.map((question, questionIndex) => (
                    <div key={question.prompt} className="quiz-question">
                      <p>{question.prompt}</p>
                      <div className="quiz-options">
                        {question.options.map((option, optionIndex) => {
                          const selected = quizAnswers[`${activeLesson.id}-${questionIndex}`] === optionIndex;
                          return (
                            <button
                              key={option}
                              className={selected ? 'option active' : 'option'}
                              onClick={() => setQuizAnswers((prev) => ({ ...prev, [`${activeLesson.id}-${questionIndex}`]: optionIndex }))}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="button-row">
                  <button className="primary-button" onClick={submitQuiz}>
                    Submit quiz
                  </button>
                  <button className="ghost-button" onClick={retryQuiz}>
                    Retry
                  </button>
                </div>
                {quizFeedback && (
                  <div className={quizFeedback.passed ? 'feedback success' : 'feedback danger'}>
                    <strong>{quizFeedback.score}%</strong>
                    <span>{quizFeedback.passed ? 'Passed. Lesson progress updated.' : 'Not yet. Review the lesson and try again.'}</span>
                  </div>
                )}
              </Card>
            </div>
          </section>
        )}

        {section === 'progress' && (
          <section className="stack">
            <Card title="Progress dashboard" subtitle="Progress bars, completed courses, and certificate unlock states share the same roadmap language.">
              <div className="progress-list">
                {courses.map((course) => {
                  const courseLessonCount = course.lessons.length;
                  const completed = course.lessons.filter((lesson) => progress.completedLessonIds.includes(lesson.id)).length;
                  const percent = Math.round((completed / courseLessonCount) * 100);
                  const done = percent === 100;
                  return (
                    <div className="progress-card" key={course.id}>
                      <div className="progress-head">
                        <div>
                          <h3>{course.title}</h3>
                          <p>{course.category} · {course.level}</p>
                        </div>
                        <span className={done ? 'chip success mono' : 'chip mono'}>{percent}%</span>
                      </div>
                      <div className="progress-track">
                        <span style={{ width: `${percent}%` }} />
                      </div>
                      <div className="progress-foot">
                        <span>{completed} of {courseLessonCount} lessons complete</span>
                        {done ? (
                          <button className="success-button" onClick={() => exportCertificate(course)}>
                            Download certificate
                          </button>
                        ) : (
                          <button className="ghost-button" onClick={() => {
                            setActiveCourseId(course.id);
                            setActiveLessonId(course.lessons[completed]?.id ?? course.lessons[0]?.id ?? '');
                            setSection('lesson');
                          }}>
                            Continue path
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="progress-summary-grid">
              <Card title="Completed courses" subtitle="Unlocked courses are ready for certificates.">
                <div className="stack tight">
                  {completedCourses.length ? completedCourses.map((course) => (
                    <div className="summary-row" key={course.id}>
                      <strong>{course.title}</strong>
                      <span className="chip success">Unlocked</span>
                    </div>
                  )) : <EmptyState title="No completed courses yet" description="Finish all lessons in a course to unlock its certificate." />}
                </div>
              </Card>
              <Card title="Current learner stats" subtitle="Metrics are intentionally styled as data, not prose.">
                <div className="stat-grid">
                  <Metric label="Completed lessons" value={`${completedCount}`} mono />
                  <Metric label="Average quiz score" value={`${Math.round(Object.values(progress.quizScores).reduce((sum, score) => sum + score, 0) / Math.max(Object.keys(progress.quizScores).length, 1) || 0)}%`} mono />
                  <Metric label="Certificates ready" value={`${completedCourses.length}`} mono />
                  <Metric label="Rank" value={userRank ? `#${userRank}` : '—'} mono />
                </div>
              </Card>
            </div>
          </section>
        )}

        {section === 'discussion' && activeLesson && (
          <section className="stack">
            <Card title="Discussion" subtitle="Each lesson has a simple comment thread with delete support for your own posts.">
              <form className="comment-form" onSubmit={addComment}>
                <label className="field">
                  <span>Comment</span>
                  <textarea rows={3} value={commentDraft} onChange={(e) => setCommentDraft(e.target.value)} placeholder="Add a note, question, or suggestion..." />
                </label>
                <button className="primary-button" type="submit">
                  Post comment
                </button>
              </form>
              <div className="comment-list">
                {currentUserComments.length ? currentUserComments.map((comment) => (
                  <div className="comment-card" key={comment.id}>
                    <div className="comment-head">
                      <strong>{comment.author}</strong>
                      <span className="chip mono">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p>{comment.text}</p>
                    {currentUser?.name === comment.author && (
                      <button className="ghost-button small" onClick={() => deleteComment(comment.id)}>
                        Delete
                      </button>
                    )}
                  </div>
                )) : <EmptyState title="No comments yet" description="Be the first learner to leave a note on this lesson." />}
              </div>
            </Card>
          </section>
        )}

        {section === 'admin' && (
          <section className="stack">
            <Card title="Admin panel" subtitle="Add courses and lessons locally. The panel is only useful for the admin role.">
              {currentUser?.role === 'admin' ? (
                <>
                <div className="admin-grid">
                  <form className="stack" onSubmit={addCourse}>
                    <h3>{editingCourseId ? 'Edit course' : 'New course'}</h3>
                    <label className="field"><span>Title</span><input value={adminCourseDraft.title} onChange={(e) => setAdminCourseDraft((draft) => ({ ...draft, title: e.target.value }))} /></label>
                    <label className="field"><span>Category</span>
                      <select value={adminCourseDraft.category} onChange={(e) => setAdminCourseDraft((draft) => ({ ...draft, category: e.target.value as Course['category'] }))}>
                        <option>Programming</option>
                        <option>Design</option>
                        <option>AI</option>
                      </select>
                    </label>
                    <label className="field"><span>Level</span>
                      <select value={adminCourseDraft.level} onChange={(e) => setAdminCourseDraft((draft) => ({ ...draft, level: e.target.value as Course['level'] }))}>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </label>
                    <label className="field"><span>Description</span><textarea rows={3} value={adminCourseDraft.description} onChange={(e) => setAdminCourseDraft((draft) => ({ ...draft, description: e.target.value }))} /></label>
                    <div className="button-row">
                      <button className="primary-button" type="submit">{editingCourseId ? 'Save course' : 'Add course'}</button>
                      {editingCourseId && (
                        <button className="ghost-button" type="button" onClick={() => {
                          setEditingCourseId(null);
                          setAdminCourseDraft({ title: '', category: 'Programming', level: 'Beginner', description: '' });
                        }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  <form className="stack" onSubmit={addLesson}>
                    <h3>{editingLessonId ? 'Edit lesson' : 'New lesson'}</h3>
                    <label className="field"><span>Course</span>
                      <select value={adminLessonDraft.courseId} onChange={(e) => setAdminLessonDraft((draft) => ({ ...draft, courseId: e.target.value }))}>
                        {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                      </select>
                    </label>
                    <label className="field"><span>Title</span><input value={adminLessonDraft.title} onChange={(e) => setAdminLessonDraft((draft) => ({ ...draft, title: e.target.value }))} /></label>
                    <label className="field"><span>Duration</span><input value={adminLessonDraft.duration} onChange={(e) => setAdminLessonDraft((draft) => ({ ...draft, duration: e.target.value }))} /></label>
                    <label className="field"><span>Type</span>
                      <select value={adminLessonDraft.type} onChange={(e) => setAdminLessonDraft((draft) => ({ ...draft, type: e.target.value as Lesson['type'] }))}>
                        <option>Reading</option>
                        <option>Video</option>
                        <option>Practice</option>
                      </select>
                    </label>
                    <label className="field"><span>Summary</span><textarea rows={3} value={adminLessonDraft.summary} onChange={(e) => setAdminLessonDraft((draft) => ({ ...draft, summary: e.target.value }))} /></label>
                    <div className="button-row">
                      <button className="primary-button" type="submit">{editingLessonId ? 'Save lesson' : 'Add lesson'}</button>
                      {editingLessonId && (
                        <button className="ghost-button" type="button" onClick={() => {
                          setEditingLessonId(null);
                          setAdminLessonDraft({ courseId: courses[0]?.id ?? '', title: '', duration: '12 min', type: 'Reading', summary: '' });
                        }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
                <div className="stack" style={{ marginTop: '18px' }}>
                  <h3>Manage existing content</h3>
                  {courses.map((course) => (
                    <div className="quiz-question" key={course.id}>
                      <div className="progress-head">
                        <div>
                          <strong>{course.title}</strong>
                          <p>{course.category} · {course.level}</p>
                        </div>
                        <div className="button-row">
                          <button className="ghost-button small" type="button" onClick={() => editCourse(course)}>Edit</button>
                          <button className="ghost-button small" type="button" onClick={() => deleteCourse(course.id)}>Delete</button>
                        </div>
                      </div>
                      <div className="stack tight" style={{ marginTop: '12px' }}>
                        {course.lessons.map((lesson) => (
                          <div className="summary-row" key={lesson.id}>
                            <div>
                              <strong>{lesson.title}</strong>
                              <p>{lesson.duration} · {lesson.type}</p>
                            </div>
                            <div className="button-row">
                              <button className="ghost-button small" type="button" onClick={() => editLesson(course.id, lesson)}>Edit</button>
                              <button className="ghost-button small" type="button" onClick={() => deleteLesson(course.id, lesson.id)}>Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                </>
              ) : (
                <EmptyState title="Admin access only" description="Sign in with the admin account to manage courses and lessons." />
              )}
            </Card>
          </section>
        )}

        {section === 'leaderboard' && (
          <section className="stack">
            <Card title="Leaderboard" subtitle="Top learners are ranked by total XP, completed lessons, and quiz performance.">
              <div className="leaderboard">
                {leaderboard.map((entry, index) => (
                  <div className="leader-row" key={entry.email}>
                    <div className="rank-badge mono">#{index + 1}</div>
                    <div>
                      <strong>{entry.name}</strong>
                      <p>{entry.role}</p>
                    </div>
                    <div className="leader-score mono">{entry.score}</div>
                  </div>
                ))}
              </div>
              {currentUser && (
                <div className="feedback">
                  <strong>Your rank: {userRank ? `#${userRank}` : '—'}</strong>
                  <span>{currentUser.name} is tracked with local progress and quiz scoring.</span>
                </div>
              )}
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}

function sectionLabel(section: Section) {
  const map: Record<Section, string> = {
    journey: 'Journey',
    catalog: 'Catalog',
    lesson: 'Lesson',
    progress: 'Progress',
    discussion: 'Discussion',
    admin: 'Admin',
    leaderboard: 'Leaderboard',
  };
  return map[section];
}

function PathNode({ step, title, detail, state }: { step: string; title: string; detail: string; state: 'active' | 'idle' | 'complete' }) {
  return (
    <div className={`path-node ${state}`}>
      <div className="path-dot">{state === 'complete' ? '✓' : step}</div>
      <div className="path-copy">
        <span>{title}</span>
        <p>{detail}</p>
      </div>
    </div>
  );
}

function Metric({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong className={mono ? 'mono' : ''}>{value}</strong>
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
  headerAction,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}) {
  return (
    <article className="card">
      <div className="card-head">
        <div>
          <p className="eyebrow">Module</p>
          <h3>{title}</h3>
          <span>{subtitle}</span>
        </div>
        {headerAction}
      </div>
      {children}
    </article>
  );
}

function CourseCard({
  course,
  onClick,
  active,
  completed,
}: {
  course: Course;
  onClick: () => void;
  active: boolean;
  completed: boolean;
}) {
  return (
    <button className={active ? 'course-card active' : 'course-card'} onClick={onClick}>
      <div className="course-top">
        <span className={`chip ${completed ? 'success' : ''}`}>{completed ? 'Completed' : course.category}</span>
        <span className="chip mono">{course.level}</span>
      </div>
      <h4>{course.title}</h4>
      <p>{course.description}</p>
      <div className="mini-path">
        {course.lessons.map((lesson, index) => (
          <span key={lesson.id} className={index === 0 ? 'mini-node active' : 'mini-node'} />
        ))}
      </div>
      <div className="course-foot">
        <span>{course.lessons.length} lessons</span>
        <span>Open path</span>
      </div>
    </button>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export default App;
