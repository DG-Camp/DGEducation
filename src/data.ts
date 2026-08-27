export type Role = 'student' | 'admin';

export type User = {
  name: string;
  email: string;
  password: string;
  role: Role;
  joinedAt: string;
  xp: number;
};

export type Category = 'Programming' | 'Design' | 'AI';
export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export type Question = {
  prompt: string;
  options: string[];
  answerIndex: number;
};

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  type: 'Video' | 'Reading' | 'Practice';
  summary: string;
  body: string[];
  highlights: string[];
  videoLabel: string;
  questions: Question[];
};

export type Course = {
  id: string;
  title: string;
  category: Category;
  level: Level;
  description: string;
  accent: string;
  lessons: Lesson[];
};

export type Comment = {
  id: string;
  lessonId: string;
  author: string;
  text: string;
  createdAt: string;
};

export type ProgressState = {
  completedLessonIds: string[];
  quizScores: Record<string, number>;
};

export const seedUsers: User[] = [
  {
    name: 'Amina Rahimova',
    email: 'amina@digitalgen.edu',
    password: 'password123',
    role: 'student',
    joinedAt: '2024-03-12',
    xp: 1240,
  },
  {
    name: 'Admin Mentor',
    email: 'admin@digitalgen.edu',
    password: 'admin123',
    role: 'admin',
    joinedAt: '2024-01-08',
    xp: 2490,
  },
];

const lesson = (
  id: string,
  title: string,
  duration: string,
  type: Lesson['type'],
  summary: string,
  body: string[],
  highlights: string[],
  videoLabel: string,
  questions: Question[],
): Lesson => ({
  id,
  title,
  duration,
  type,
  summary,
  body,
  highlights,
  videoLabel,
  questions,
});

export const initialCourses: Course[] = [
  {
    id: 'ux-path',
    title: 'UX Path Foundations',
    category: 'Design',
    level: 'Beginner',
    description: 'A guided path through layout, hierarchy, color, and accessible interaction design.',
    accent: 'blue',
    lessons: [
      lesson(
        'ux-1',
        'Design Principles',
        '10 min',
        'Video',
        'The mental model behind purposeful interfaces.',
        [
          'We start with a map, not a menu. Good design reduces uncertainty and points users to the next step.',
          'Use hierarchy to make the active step obvious. Everything else should support the path.',
        ],
        ['Hierarchy over decoration', 'Clear next-step actions', 'Readable contrast'],
        'Path video preview',
        [
          { prompt: 'What should a learning interface emphasize first?', options: ['Decoration', 'Next step', 'Random variety'], answerIndex: 1 },
          { prompt: 'What makes progress feel trustworthy?', options: ['Hidden status', 'Clear milestones', 'More shadows'], answerIndex: 1 },
          { prompt: 'Which font treatment is best for scores?', options: ['JetBrains Mono', 'A script font', 'A decorative serif'], answerIndex: 0 },
        ],
      ),
      lesson(
        'ux-2',
        'Grid Systems & Layout',
        '15 min',
        'Practice',
        'Structure content using a stable grid and path connectors.',
        [
          'On desktop, use a fixed centered grid. On mobile, keep the path anchored to the left to preserve reading space.',
          'Path nodes and connectors should visually imply movement from lesson to lesson.',
        ],
        ['Fixed grid on desktop', 'Vertical path on mobile', 'Smooth connector lines'],
        'Grid system preview',
        [
          { prompt: 'Where should the mobile path line sit?', options: ['Center of the screen', 'Left margin', 'Bottom edge'], answerIndex: 1 },
          { prompt: 'What should locked lessons look like?', options: ['Dimmed and recessed', 'Louder than active steps', 'Full color and flashing'], answerIndex: 0 },
          { prompt: 'Which state should use the success green?', options: ['Locked state', 'Completion state', 'Search filters'], answerIndex: 1 },
        ],
      ),
      lesson(
        'ux-3',
        'Color Theory',
        '20 min',
        'Reading',
        'Use a restrained palette to keep attention on learning.',
        [
          'Growth blue is for primary actions and active steps.',
          'Progress green is reserved for completion, pass states, and unlocked rewards.',
          'Tertiary indigo is reserved for technical data and score chips.',
        ],
        ['Blue for motion', 'Green for success', 'Indigo for data'],
        'Color palette preview',
        [
          { prompt: 'Which color should mean progress?', options: ['Growth blue', 'Progress green', 'Neutral gray'], answerIndex: 1 },
          { prompt: 'What should data metrics use?', options: ['JetBrains Mono chips', 'Body text only', 'Tiny italics'], answerIndex: 0 },
          { prompt: 'How should completed cards feel?', options: ['Unlocked and calm', 'Noisy and animated', 'Hidden entirely'], answerIndex: 0 },
        ],
      ),
    ],
  },
  {
    id: 'ai-basics',
    title: 'AI Essentials',
    category: 'AI',
    level: 'Intermediate',
    description: 'Build confidence with prompts, model thinking, and applied AI workflows.',
    accent: 'indigo',
    lessons: [
      lesson(
        'ai-1',
        'Prompt Crafting',
        '12 min',
        'Video',
        'Write instructions that produce clearer model outputs.',
        [
          'Good prompts specify role, context, output format, and constraints.',
          'Treat prompting as iterative: draft, test, refine, and measure.',
        ],
        ['Role + context + constraints', 'Iterate with examples', 'Keep outputs observable'],
        'Prompt preview',
        [
          { prompt: 'What improves model output the most?', options: ['Vague direction', 'Specific constraints', 'More exclamation marks'], answerIndex: 1 },
          { prompt: 'A strong prompt should include what?', options: ['Only a topic', 'A desired output format', 'A random joke'], answerIndex: 1 },
          { prompt: 'Prompting is best treated as:', options: ['One-and-done', 'An iterative process', 'A hidden magic trick'], answerIndex: 1 },
        ],
      ),
      lesson(
        'ai-2',
        'Model Safety',
        '18 min',
        'Reading',
        'Understand boundaries, failure modes, and careful use.',
        [
          'The goal is not just capability but reliable, appropriate usage.',
          'Good product design makes limitations visible so users can self-correct quickly.',
        ],
        ['Clear limits', 'Visible error states', 'Trustworthy guidance'],
        'Safety preview',
        [
          { prompt: 'Why surface model limits?', options: ['To reduce trust', 'To help users self-correct', 'To hide errors'], answerIndex: 1 },
          { prompt: 'Which state should be clear?', options: ['Pass/fail feedback', 'Only success', 'Only loading'], answerIndex: 0 },
          { prompt: 'What belongs in technical data chips?', options: ['Ranks and scores', 'Long paragraphs', 'Hidden notes'], answerIndex: 0 },
        ],
      ),
    ],
  },
  {
    id: 'web-dev',
    title: 'Web Craft Bootcamp',
    category: 'Programming',
    level: 'Advanced',
    description: 'Learn layout, responsive patterns, and interactive product thinking through a practical path.',
    accent: 'green',
    lessons: [
      lesson(
        'web-1',
        'Semantic HTML',
        '14 min',
        'Reading',
        'Build interfaces that read clearly for people and machines.',
        [
          'Use semantic tags to establish a stable content structure.',
          'When a site is a journey, headings and landmarks become the map.',
        ],
        ['Landmarks matter', 'Structure is meaning', 'Accessibility first'],
        'HTML preview',
        [
          { prompt: 'What does semantic HTML improve?', options: ['Only visuals', 'Structure and accessibility', 'File size'], answerIndex: 1 },
          { prompt: 'What should headings provide?', options: ['Randomness', 'A content map', 'Animation timing'], answerIndex: 1 },
          { prompt: 'Which is a good interface habit?', options: ['Hide everything', 'Expose clear landmarks', 'Use no labels'], answerIndex: 1 },
        ],
      ),
      lesson(
        'web-2',
        'Responsive Systems',
        '19 min',
        'Practice',
        'Translate path logic across mobile and desktop.',
        [
          'Responsive design should preserve hierarchy while adjusting layout.',
          'The path metaphor survives by moving the line, not the meaning.',
        ],
        ['Hierarchy survives', 'Layout adapts', 'Path line shifts left on mobile'],
        'Responsive preview',
        [
          { prompt: 'What should stay consistent across breakpoints?', options: ['Meaning and hierarchy', 'Every pixel', 'Nothing'], answerIndex: 0 },
          { prompt: 'What is the mobile path rule?', options: ['Put the line at center', 'Shift it left', 'Remove it entirely'], answerIndex: 1 },
          { prompt: 'What should a complete lesson unlock?', options: ['A certificate only after 100%', 'Nothing', 'A random banner'], answerIndex: 0 },
        ],
      ),
      lesson(
        'web-3',
        'Product Polish',
        '16 min',
        'Video',
        'Finish with state clarity, motion, and usable feedback.',
        [
          'Polish is not decoration. It is the difference between uncertain and confident use.',
          'Empty states, pass states, and locked states should all read instantly.',
        ],
        ['Feedback is polish', 'Empty states need care', 'Motion should be calm'],
        'Polish preview',
        [
          { prompt: 'What makes the UI feel trustworthy?', options: ['Clear feedback', 'Hidden logic', 'Busy motion'], answerIndex: 0 },
          { prompt: 'What state should be visibly locked?', options: ['Certificate before completion', 'All progress badges', 'Profile names'], answerIndex: 0 },
          { prompt: 'What should the design system avoid?', options: ['Shared tokens', 'Ad hoc parallel styles', 'Meaningful spacing'], answerIndex: 1 },
        ],
      ),
    ],
  },
];

export const initialComments: Comment[] = [
  {
    id: 'c1',
    lessonId: 'ux-2',
    author: 'Nodir',
    text: 'The left-side path line on mobile is really clear. Nice choice.',
    createdAt: '2026-08-25T10:30:00Z',
  },
  {
    id: 'c2',
    lessonId: 'ux-2',
    author: 'Amina Rahimova',
    text: 'I like that the active step feels heavier without using extra shadows.',
    createdAt: '2026-08-25T11:15:00Z',
  },
];

export const initialProgress: ProgressState = {
  completedLessonIds: ['ux-1', 'ai-1'],
  quizScores: {
    'ux-1': 100,
    'ai-1': 67,
  },
};
