export type LessonType = 'video' | 'article' | 'quiz' | 'practice';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  codeLanguage?: string;
  options: QuizOption[];
  explanation: string;
  points?: number;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  passPercentage: number; // typically 70
  timeLimitMinutes?: number; // e.g. 5
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  quizId: string;
  lessonId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  selectedAnswers: Record<string, string>; // questionId -> optionId
  completedAt: string;
}

export interface LessonAttachment {
  id: string;
  title: string;
  fileSize: string;
  fileType: 'pdf' | 'zip' | 'code' | 'doc' | 'link';
  downloadUrl: string;
  description?: string;
}

export interface LessonResourceLink {
  title: string;
  url: string;
  type: 'github' | 'doc' | 'tool' | 'article';
}

export interface LessonNote {
  id: string;
  lessonId: string;
  timestamp?: number; // video timestamp in seconds
  content: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  description: string;
  type: LessonType;
  durationMinutes: number;
  order: number;
  videoUrl?: string; // YouTube embed URL or MP4 stream
  videoDurationSeconds?: number;
  contentMarkdown?: string;
  codeSnippet?: {
    language: string;
    code: string;
    filename?: string;
  };
  attachments?: LessonAttachment[];
  resources?: LessonResourceLink[];
  quiz?: Quiz;
  isCompleted?: boolean;
  isLocked?: boolean;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  category: 'Dasturlash' | 'Dizayn' | 'Sun\'iy Intellekt' | 'Ma\'lumotlar Bazasi';
  level: 'Boshlang\'ich' | 'O\'rta' | 'Yuqori';
  instructor: {
    name: string;
    title: string;
    avatar: string;
    bio?: string;
  };
  durationHours: number;
  modulesCount: number;
  lessonsCount: number;
  modules: CourseModule[];
}

export interface UserLessonProgress {
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
  completedAt?: string;
  lastWatchTimeSeconds?: number;
  quizAttempt?: QuizAttempt;
}

export interface CourseProgressState {
  courseId: string;
  completedLessonIds: string[];
  lastVisitedLessonId?: string;
  quizScores: Record<string, QuizAttempt>; // lessonId -> attempt
  notes: Record<string, LessonNote[]>; // lessonId -> notes
}
