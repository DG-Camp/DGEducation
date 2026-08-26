import { Course } from '../types';

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-react-fullstack',
    title: 'Zamonaviy React & TypeScript Masterclass',
    slug: 'react-typescript-masterclass',
    shortDescription: 'Frontend dasturlashda React 19, TypeScript va Tailwind CSS bilan professional ilovalar yaratish.',
    description: 'Ushbu kursda siz React ekotizimining eng so‘nggi imkoniyatlari — Hooks, State Management, Custom Hooklar, TypeScript turlari, optimallashtirish va to‘liq loyiha qurishni o‘rganasiz.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop',
    category: 'Dasturlash',
    level: 'O\'rta',
    instructor: {
      name: 'Davlatyor Xaitov',
      title: 'Senior Frontend Engineer & DG Mentor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      bio: '6+ yillik tajribaga ega dasturchi va xalqaro loyihalar yetakchisi.'
    },
    durationHours: 18,
    modulesCount: 3,
    lessonsCount: 6,
    modules: [
      {
        id: 'mod-1',
        courseId: 'course-react-fullstack',
        title: '1-Modul: React Asoslari & TypeScript integratsiyasi',
        description: 'React arxitekturasi, JSX, komponentlar, props va TypeScript interfeyslari.',
        order: 1,
        lessons: [
          {
            id: 'lesson-1-1',
            moduleId: 'mod-1',
            courseId: 'course-react-fullstack',
            title: '1.1 React 19 & TypeScript loyihani sozlash va arxitektura',
            description: 'Vite yordamida tezkor React loyihasini ko‘tarish, TypeScript qoidalarini sozlash va loyiha papka strukturasini to‘g‘ri shakllantirish.',
            type: 'video',
            durationMinutes: 14,
            order: 1,
            videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
            videoDurationSeconds: 840,
            contentMarkdown: `### 🚀 Darsning Asosiy Maqsadi

Ushbu darsda zamonaviy frontend dasturlashda standart bo'lgan **Vite** va **TypeScript** juftligi bilan to'g'ri loyiha strukturasini qurishni o'rganamiz.

#### 1. Loyiha yaratish buyrug'i:
\`\`\`bash
npm create vite@latest dg-education-app -- --template react-ts
cd dg-education-app
npm install
npm run dev
\`\`\`

#### 2. Nega TypeScript?
- **Tip xavfsizligi:** Kompilyatsiya vaqtidayoq xatolarni aniqlaydi.
- **Auto-completion (IntelliSense):** VS Code va zamonaviy editorlarda tezkor va xatosiz kod yozish imkoni.
- **Refactoring:** Katta loyihalarda komponent va interfeyslarni xavfsiz o'zgartirish.

#### 3. Papka Strukturasi qoidasi (Feature-based architecture):
- \`src/modules/\` — Har bir mustaqil funksional modul o'z papkasida (auth, lessons, quiz, etc.)
- \`src/shared/\` — Hamma uchun umumiy komponentlar, turlar va yordamchi funksiyalar.
`,
            codeSnippet: {
              language: 'typescript',
              filename: 'src/modules/lessons/types.ts',
              code: `export interface LessonHeaderProps {
  title: string;
  courseTitle: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onOpenQuiz: () => void;
}`
            },
            attachments: [
              {
                id: 'att-1',
                title: 'React_TypeScript_CheatSheet_2026.pdf',
                fileSize: '2.4 MB',
                fileType: 'pdf',
                downloadUrl: '#'
              },
              {
                id: 'att-2',
                title: 'starter-template-code.zip',
                fileSize: '450 KB',
                fileType: 'zip',
                downloadUrl: '#'
              }
            ],
            resources: [
              {
                title: 'Vite Rasmiy Hujjatlari',
                url: 'https://vite.dev',
                type: 'doc'
              },
              {
                title: 'TypeScript React Cheatsheet',
                url: 'https://react-typescript-cheatsheet.netlify.app',
                type: 'article'
              },
              {
                title: 'Loyiha GitHub Repozitoriyasi',
                url: 'https://github.com/DG-Camp/DGEducation',
                type: 'github'
              }
            ],
            quiz: {
              id: 'quiz-1-1',
              lessonId: 'lesson-1-1',
              title: '1.1 Dars Testi: React & TypeScript Asoslari',
              description: 'Darsda o‘rganilgan tushunchalarni mustahkamlash uchun 4 ta savoldan iborat test.',
              passPercentage: 70,
              timeLimitMinutes: 5,
              questions: [
                {
                  id: 'q1',
                  question: 'React komponentiga props uzatilganda TypeScript-da qaysi usul eng to‘g‘ri hisoblanadi?',
                  options: [
                    { id: 'opt-a', text: 'Props uchun interface yoki type e\'lon qilib, komponent parametriga biriktirish', isCorrect: true },
                    { id: 'opt-b', text: 'Props ga har doim `any` tipini berish', isCorrect: false },
                    { id: 'opt-c', text: 'Hech qanday tip yozmaslik', isCorrect: false },
                    { id: 'opt-d', text: 'Faqat string tiplardan foydalanish', isCorrect: false }
                  ],
                  explanation: 'TypeScript-da props xavfsizligini ta\'minlash uchun har bir komponentga mos interface yoki type yaratish eng yaxshi amaliyotdir.'
                },
                {
                  id: 'q2',
                  question: 'Quyidagi kodda TypeScript qanday xatolik beradi?',
                  codeSnippet: `interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button = ({ label, onClick, disabled }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};`,
                  codeLanguage: 'typescript',
                  options: [
                    { id: 'opt-2a', text: '`disabled` xossasi ButtonProps interfeysida mavjud emas', isCorrect: true },
                    { id: 'opt-2b', text: '`onClick` funksiyasiga argument berilmagan', isCorrect: false },
                    { id: 'opt-2c', text: 'React import qilinmagan', isCorrect: false },
                    { id: 'opt-2d', text: 'Hech qanday xato bermaydi', isCorrect: false }
                  ],
                  explanation: 'ButtonProps interfeysida `disabled?: boolean` e\'lon qilinmagan bo\'lsa, uni destrukturizatsiya qilishda TypeScript xato ko\'rsatadi.'
                },
                {
                  id: 'q3',
                  question: 'Vite vositasining Create React App (CRA) dan asosiy ustunligi nimada?',
                  options: [
                    { id: 'opt-3a', text: 'Native ES Modules va esbuild asosida juda tez yuklanishi va engil arxitekturasi', isCorrect: true },
                    { id: 'opt-3b', text: 'Faqat backend kod yozish imkoniyati', isCorrect: false },
                    { id: 'opt-3c', text: 'Faqat Angular freymvorkini qo\'llab-quvvatlashi', isCorrect: false },
                    { id: 'opt-3d', text: 'Brauzersiz ishlashi', isCorrect: false }
                  ],
                  explanation: 'Vite Native ESM va esbuild orqali ishlab chiqish rejimida bir necha millisekundda ishga tushadi va HMR juda tez ishlaydi.'
                },
                {
                  id: 'q4',
                  question: 'Feature-based papka strukturasining asosiy maqsadi nima?',
                  options: [
                    { id: 'opt-4a', text: 'Har bir modulni (auth, lessons, quiz) mustaqil va oson birlashtiriladigan qilish', isCorrect: true },
                    { id: 'opt-4b', text: 'Fayllar sonini kamaytirish', isCorrect: false },
                    { id: 'opt-4c', text: 'HTML fayllarni bitta papkaga yig\'ish', isCorrect: false },
                    { id: 'opt-4d', text: 'TypeScript fayllarni o\'chirish', isCorrect: false }
                  ],
                  explanation: 'Feature-based strukturada har bir o\'quvchi yoki dasturchi o\'z modulida mustaqil ishlab, merge conflictlarni minimallashtiradi.'
                }
              ]
            }
          },
          {
            id: 'lesson-1-2',
            moduleId: 'mod-1',
            courseId: 'course-react-fullstack',
            title: '1.2 useState, useEffect & Custom Hooklar bilan holat boshqaruvi',
            description: 'Murakkab komponent holatlarini boshqarish, asinxron ma’lumotlarni yuklash va qayta ishlatiluvchi custom hooklar yaratish.',
            type: 'video',
            durationMinutes: 18,
            order: 2,
            videoUrl: 'https://www.youtube.com/embed/0ZJgIjIuY7U',
            videoDurationSeconds: 1080,
            contentMarkdown: `### ⚡ Hooklar va Holat Boshqaruvi

React-da interaktiv ilova qurish uchun eng asosiy vosita bu **Hooklar**dir.

#### Custom Hook namunasi (\`useLessonProgress\`):
\`\`\`typescript
export function useLessonProgress(courseId: string) {
  const [completed, setCompleted] = useState<string[]>(() => {
    const saved = localStorage.getItem(\`progress_\${courseId}\`);
    return saved ? JSON.parse(saved) : [];
  });

  const toggleComplete = (lessonId: string) => {
    setCompleted(prev => {
      const next = prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId];
      localStorage.setItem(\`progress_\${courseId}\`, JSON.stringify(next));
      return next;
    });
  };

  return { completed, toggleComplete };
}
\`\`\`

#### Diqqat qilinishi kerak bo'lgan jihatlar:
1. \`useEffect\` ichida keraksiz qayta renderlarning oldini olish (dependency array nazorati).
2. LocalStorage sinxronizatsiyasi.
`,
            codeSnippet: {
              language: 'typescript',
              filename: 'src/modules/lessons/hooks/useLesson.ts',
              code: `import { useState, useEffect } from 'react';

export const useQuizTimer = (initialMinutes: number, onTimeUp: () => void) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp]);

  return secondsLeft;
};`
            },
            attachments: [
              {
                id: 'att-3',
                title: 'react-hooks-reference.pdf',
                fileSize: '1.8 MB',
                fileType: 'pdf',
                downloadUrl: '#'
              }
            ],
            quiz: {
              id: 'quiz-1-2',
              lessonId: 'lesson-1-2',
              title: '1.2 Dars Testi: React Hooks & State',
              description: 'Hooklar ishlash mexanizmi va lifecycle qoidalarini sinab ko‘ring.',
              passPercentage: 70,
              timeLimitMinutes: 4,
              questions: [
                {
                  id: 'q2-1',
                  question: '`useEffect` ga bo‘sh massiv `[]` dependency sifatida berilsa, qachon ishga tushadi?',
                  options: [
                    { id: 'opt-2-1a', text: 'Komponent ilk marta mount bo‘lganda faqat bir marta', isCorrect: true },
                    { id: 'opt-2-1b', text: 'Har safar har qanday state o‘zgarganda', isCorrect: false },
                    { id: 'opt-2-1c', text: 'Faqat komponent unmount bo‘lganda', isCorrect: false },
                    { id: 'opt-2-1d', text: 'Hech qachon ishga tushmaydi', isCorrect: false }
                  ],
                  explanation: 'Bo\'sh dependency array `[]` berilsa, effect faqat komponent birinchi marta ekranga chiqarilganda ishlaydi.'
                },
                {
                  id: 'q2-2',
                  question: 'Custom hook nomlanishi qanday qoidaga bo‘ysunishi shart?',
                  options: [
                    { id: 'opt-2-2a', text: 'Nomi kichik `use` so‘zi bilan boshlanishi shart (masalan, `useAuth`)', isCorrect: true },
                    { id: 'opt-2-2b', text: 'Nomi `get` so‘zi bilan boshlanishi shart', isCorrect: false },
                    { id: 'opt-2-2c', text: 'Katta harflar bilan yozilishi shart', isCorrect: false },
                    { id: 'opt-2-2d', text: 'Hech qanday cheklov yo‘q', isCorrect: false }
                  ],
                  explanation: 'React linter va runtime qoidalariga ko\'ra custom hooklar `use` prefiksi bilan boshlanishi shart.'
                },
                {
                  id: 'q2-3',
                  question: 'State yangilanganda avvalgi qiymatga tayanish uchun qaysi sintaksis to‘g‘ri?',
                  options: [
                    { id: 'opt-2-3a', text: '`setCount(prev => prev + 1)`', isCorrect: true },
                    { id: 'opt-2-3b', text: '`count = count + 1`', isCorrect: false },
                    { id: 'opt-2-3c', text: '`setCount(count++)`', isCorrect: false },
                    { id: 'opt-2-3d', text: '`update(count)`', isCorrect: false }
                  ],
                  explanation: 'Asinxron holat o\'zgarishlarida eng so\'nggi holatni olish uchun functional updater `prev => prev + 1` ishlatiladi.'
                }
              ]
            }
          }
        ]
      },
      {
        id: 'mod-2',
        courseId: 'course-react-fullstack',
        title: '2-Modul: Dars Ko‘rish Sahifasi & Interaktiv Quiz Moduli',
        description: 'LMS platformasida video player, dars navigatsiyasi va ball hisoblovchi test moduli integratsiyasi.',
        order: 2,
        lessons: [
          {
            id: 'lesson-2-1',
            moduleId: 'mod-2',
            courseId: 'course-react-fullstack',
            title: '2.1 Dars ko‘rish sahifasi (5.3 Modul): Layout, Video & Mundarija',
            description: 'Dars sahifasida video kontent, "Oldingi dars" / "Keyingi dars" tugmalari va real vaqtda progressni sinxronlashtirish.',
            type: 'video',
            durationMinutes: 22,
            order: 1,
            videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
            videoDurationSeconds: 1320,
            contentMarkdown: `### 📖 5.3 Dars Ko‘rish Sahifasi Talablari

Bu sahifa foydalanuvchining ta'lim olish tajribasidagi eng markaziy qismdir.

#### Asosiy Funksionalliklar:
1. **Video & Matnli Kontent:** O'quvchi videoni ko'rishi, dars matnini o'qishi va berilgan kod namunalaridan nusxa olishi mumkin.
2. **Navigatsiya Boshqaruvi:** 
   - "⬅️ Oldingi dars" va "Keyingi dars ➡️" tugmalari.
   - Klaviaturadan chap/o'ng o'q tugmalari orqali darslararo o'tish imkoniyati.
3. **Mundarija (Curriculum Sidebar):**
   - Barcha modullar va darslar holati (Tugallangan ✅, Joriy ⏳, Qulflangan 🔒).
   - Har bir darsning davomiyligi va turi ko'rsatiladi.
4. **Darsni "Tugallandi" deb belgilash:**
   - Foydalanuvchi tugmani bosganda progress instant yangilanadi.
`,
            codeSnippet: {
              language: 'typescript',
              filename: 'src/modules/lessons/LessonViewPage.tsx',
              code: `const handleNextLesson = () => {
  if (currentIndex < allLessons.length - 1) {
    setSelectedLessonId(allLessons[currentIndex + 1].id);
  }
};`
            },
            attachments: [
              {
                id: 'att-4',
                title: 'Lesson_View_Architecture_Spec.pdf',
                fileSize: '3.1 MB',
                fileType: 'pdf',
                downloadUrl: '#'
              }
            ],
            quiz: {
              id: 'quiz-2-1',
              lessonId: 'lesson-2-1',
              title: '2.1 Dars Testi: Dars Ko‘rish Sahifasi Arxitekturasi',
              description: '5.3 Dars ko‘rish sahifasi talablari va UI/UX qoidalarini tekshiruvchi test.',
              passPercentage: 70,
              timeLimitMinutes: 5,
              questions: [
                {
                  id: 'q3-1',
                  question: 'Dars ko‘rish sahifasida progress qanday yangilanishi kerak?',
                  options: [
                    { id: 'opt-3-1a', text: 'Dars "tugallandi" deb belgilanganda yoki test 70%+ topshirilganda interfeys orqali progress moduli bilan sinxronlashadi', isCorrect: true },
                    { id: 'opt-3-1b', text: 'Faqat sahifa qayta yuklanganda', isCorrect: false },
                    { id: 'opt-3-1c', text: 'Faqat admin qo‘lda ruxsat berganda', isCorrect: false },
                    { id: 'opt-3-1d', text: 'Progress saqlanmaydi', isCorrect: false }
                  ],
                  explanation: 'Hujjat talabiga muvofiq, dars tugallanganda yoki test muvaffaqiyatli topshirilganda progress avtomatik ravishda yangilanadi.'
                },
                {
                  id: 'q3-2',
                  question: 'Dars mundarijasi (Sidebar) foydalanuvchiga nimalarni ko‘rsatishi lozim?',
                  options: [
                    { id: 'opt-3-2a', text: 'Modullar, darslar ro‘yxati, har bir darsning davomiyligi, turi va tugatilganlik holati', isCorrect: true },
                    { id: 'opt-3-2b', text: 'Faqat kurs narxini', isCorrect: false },
                    { id: 'opt-3-2c', text: 'Faqat o\'qituvchining telefon raqamini', isCorrect: false },
                    { id: 'opt-3-2d', text: 'Faqat oxirgi darsni', isCorrect: false }
                  ],
                  explanation: 'Curriculum sidebar o\'quvchiga butun kurs xaritasini, o\'z qadami va qolgan darslar hajmini tushunishga yordam beradi.'
                },
                {
                  id: 'q3-3',
                  question: 'Oxirgi darsga yetganda "Keyingi dars" tugmasi o‘rnida qanday amaliyot yaxshiroq?',
                  options: [
                    { id: 'opt-3-3a', text: 'Modul yakuniy testini ochish yoki kurs tugatilganligi va sertifikat olish imkoniyatini taklif qilish', isCorrect: true },
                    { id: 'opt-3-3b', text: 'Xatolik sahifasiga yo‘naltirish', isCorrect: false },
                    { id: 'opt-3-3c', text: 'Tugmani butunlay o‘chirib, brauzerni qotirish', isCorrect: false },
                    { id: 'opt-3-3d', text: 'Kursni boshidan boshlash', isCorrect: false }
                  ],
                  explanation: 'Kurs yoki modulning oxirgi darsida foydalanuvchiga sertifikat yoki yakuniy test taklif qilinishi maqsadga muvofiq.'
                }
              ]
            }
          },
          {
            id: 'lesson-2-2',
            moduleId: 'mod-2',
            courseId: 'course-react-fullstack',
            title: '2.2 Test/Quiz moduli (5.4 Modul): Ball hisoblash, 70% chegara va izohlar',
            description: 'Interaktiv test algoritmi, foiz hisoblash, to‘g‘ri/noto‘g‘ri javoblar vizualizatsiyasi va qayta topshirish imkoniyati.',
            type: 'quiz',
            durationMinutes: 15,
            order: 2,
            contentMarkdown: `### 🎯 5.4 Test/Quiz Moduli Spetsifikatsiyasi

Har bir dars yoki modul yakunida o'quvchining bilimini tekshirish uchun test o'tkaziladi.

#### Qoidalar:
- **3-5 ta savol:** Har bir savolda to'g'ri va chalg'ituvchi variantlar mavjud.
- **70%+ O'tish chegarasi:** O'quvchi 70% yoki undan yuqori ball to'plasa, test muvaffaqiyatli deb hisoblanadi (Passed 🎉).
- **Tahlil (Explanation):** Natijalar ko'rsatilganda, har bir savol bo'yicha to'g'ri javob sababi tushuntiriladi.
- **Qayta topshirish (Retake):** Agar ball yetarli bo'lmasa, o'quvchi testni qayta topshirishi mumkin.
`,
            quiz: {
              id: 'quiz-2-2',
              lessonId: 'lesson-2-2',
              title: '2.2 Test/Quiz Amaliy Bilim Sinovi',
              description: 'Quiz modulining ishlash mexanizmlari bo‘yicha 4 ta savol.',
              passPercentage: 70,
              timeLimitMinutes: 5,
              questions: [
                {
                  id: 'q4-1',
                  question: 'DG Education loyihasi talabiga ko‘ra, testdan muvaffaqiyatli o‘tish uchun minimal necha foiz kerak?',
                  options: [
                    { id: 'opt-4-1a', text: '70% yoki undan yuqori', isCorrect: true },
                    { id: 'opt-4-1b', text: '50%', isCorrect: false },
                    { id: 'opt-4-1c', text: '90%', isCorrect: false },
                    { id: 'opt-4-1d', text: '100% bo\'lishi shart', isCorrect: false }
                  ],
                  explanation: '5.4 Test/Quiz moduli talabiga asosan o\'tish foizi kamida 70% etib belgilangan.'
                },
                {
                  id: 'q4-2',
                  question: 'Agar o‘quvchi testda 50% ball to‘plasa, tizim nima qilishi kerak?',
                  options: [
                    { id: 'opt-4-2a', text: 'O‘tmaganlik holatini ko‘rsatish va "Qayta urinish" (Retake) tugmasini taqdim etish', isCorrect: true },
                    { id: 'opt-4-2b', text: 'Foydalanuvchini platformadan chetlashtirish', isCorrect: false },
                    { id: 'opt-4-2c', text: 'Hech narsa ko\'rsatmaslik', isCorrect: false },
                    { id: 'opt-4-2d', text: 'Sertifikat berish', isCorrect: false }
                  ],
                  explanation: '70% dan kam to\'plagan foydalanuvchiga xatolarini tahlil qilish va qayta topshirish imkoniyati beriladi.'
                },
                {
                  id: 'q4-3',
                  question: 'Har bir savol tekshirilgandan so‘ng o‘quvchiga nimani ko‘rsatish o‘quv samaradorligini oshiradi?',
                  options: [
                    { id: 'opt-4-3a', text: 'To‘g‘ri javob va uning batafsil tushuntirishini (Explanation)', isCorrect: true },
                    { id: 'opt-4-3b', text: 'Faqat "Xato" so‘zini', isCorrect: false },
                    { id: 'opt-4-3c', text: 'Hech qanday izohsiz keyingi sahifaga o\'tish', isCorrect: false },
                    { id: 'opt-4-3d', text: 'O\'qituvchiga jarima yozish', isCorrect: false }
                  ],
                  explanation: 'Savol izohi (explanation) o\'quvchiga nima uchun bu javob to\'g\'ri ekanligini tushunishga va bilimni mustahkamlashga yordam beradi.'
                },
                {
                  id: 'q4-4',
                  question: 'Kod sintaksisi berilgan savollarda eng yaxshi UI amaliyot qaysi?',
                  options: [
                    { id: 'opt-4-4a', text: 'Sintaksis ranglari (Syntax Highlighting) va monospaced shriftda kod blokini chiroyli ko‘rsatish', isCorrect: true },
                    { id: 'opt-4-4b', text: 'Kodni oddiy matn qilib bitta qatorga yozish', isCorrect: false },
                    { id: 'opt-4-4c', text: 'Kodni rasm qilib yuklamaslik', isCorrect: false },
                    { id: 'opt-4-4d', text: 'Kodni yashirish', isCorrect: false }
                  ],
                  explanation: 'Syntax highlighting va JetBrains Mono kabi monospace shriftlar dasturlash savollarini o\'qishni ancha qulaylashtiradi.'
                }
              ]
            }
          }
        ]
      },
      {
        id: 'mod-3',
        courseId: 'course-react-fullstack',
        title: '3-Modul: Loyihani Birlashtirish & CI/CD',
        description: 'Git branchlar, Pull Requestlar, Code Review va yakuniy production build.',
        order: 3,
        lessons: [
          {
            id: 'lesson-3-1',
            moduleId: 'mod-3',
            courseId: 'course-react-fullstack',
            title: '3.1 Git Workflow & Jamoaviy PR Review amaliyoti',
            description: 'Feature branchlardan main ga Pull Request ochish, merge conflictlarni hal qilish va production deploy.',
            type: 'video',
            durationMinutes: 16,
            order: 1,
            videoUrl: 'https://www.youtube.com/embed/RGOj5yH7evk',
            videoDurationSeconds: 960,
            contentMarkdown: `### 👥 Jamoaviy Git Workflow

Loyihada birgalikda ishlash qoidalari:
1. Hech kim \`main\` ga to'g'ridan-to'g'ri push qilmaydi.
2. Har bir modul uchun \`feature/<modul-nomi>\` (masalan: \`feature/lessons\`, \`feature/quiz\`) ochiladi.
3. PR ochilganda kamida bitta jamoadosh tasdiqlashi shart.
`,
            quiz: {
              id: 'quiz-3-1',
              lessonId: 'lesson-3-1',
              title: '3.1 Git & PR Qoidalari Testi',
              description: 'Jamoaviy Git qoidalari bo‘yicha bilimingizni sinang.',
              passPercentage: 70,
              timeLimitMinutes: 4,
              questions: [
                {
                  id: 'q5-1',
                  question: 'Feature branch nomlash standarti qanday bo‘lishi kerak?',
                  options: [
                    { id: 'opt-5-1a', text: '`feature/<modul-nomi>` (masalan `feature/lessons`)', isCorrect: true },
                    { id: 'opt-5-1b', text: '`mening-kodim-123`', isCorrect: false },
                    { id: 'opt-5-1c', text: '`test-branch`', isCorrect: false },
                    { id: 'opt-5-1d', text: '`main-2`', isCorrect: false }
                  ],
                  explanation: 'Loyihada branch nomlash tartibi `feature/<modul-nomi>` qoidasiga bo\'ysunadi.'
                },
                {
                  id: 'q5-2',
                  question: 'Commit xabarida yangi funksionallik qo‘shilganda qaysi prefiks ishlatiladi?',
                  options: [
                    { id: 'opt-5-2a', text: '`feat:` (masalan `feat: quiz natijasini hisoblash`)', isCorrect: true },
                    { id: 'opt-5-2b', text: '`update:`', isCorrect: false },
                    { id: 'opt-5-2c', text: '`new:`', isCorrect: false },
                    { id: 'opt-5-2d', text: '`done:`', isCorrect: false }
                  ],
                  explanation: 'Conventional Commits standartida yangi imkoniyatlar uchun `feat:` prefiksi qabul qilingan.'
                }
              ]
            }
          },
          {
            id: 'lesson-3-2',
            moduleId: 'mod-3',
            courseId: 'course-react-fullstack',
            title: '3.2 Yakuniy Loyiha Taqdimoti & Sertifikatga Tayyorgarlik',
            description: 'Barcha modullarni testdan o‘tkazish, barcha testlarni 70%+ ga topshirib sertifikat olish.',
            type: 'article',
            durationMinutes: 10,
            order: 2,
            contentMarkdown: `### 🎓 Tabriklaymiz! Siz barcha darslarni muvaffaqiyatli yakunladingiz!

Endi siz:
- React va TypeScript asoslarida to'liq professional dars ko'rish sahifasini qura olasiz;
- Test va Quiz modulini mustaqil loyihalashtirib, natijalarni hisoblashni o'zlashtirdingiz;
- Jamoaviy Git madaniyatiga egasiz.

**Keyingi qadam:** Barcha testlarni yakunlab, kurs sertifikatingizni oling!
`
          }
        ]
      }
    ]
  },
  {
    id: 'course-python-ai',
    title: 'Sun\'iy Intellekt & Python Asoslari',
    slug: 'python-ai-basics',
    shortDescription: 'Python tili, NumPy, Pandas va Machine Learning asoslarini interaktiv darslar va testlar bilan o‘rganing.',
    description: 'Zamonaviy Sun\'iy Intellekt dunyosiga ilk qadam. Python sintaksisi, ma\'lumotlar tahlili va neyron tarmoqlar asoslari.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    category: 'Sun\'iy Intellekt',
    level: 'Boshlang\'ich',
    instructor: {
      name: 'Azizbek Rahimov',
      title: 'AI Researcher & Data Scientist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      bio: 'Oliy toifali AI tadqiqotchi va xalqaro data-science loyihalari mentori.'
    },
    durationHours: 12,
    modulesCount: 2,
    lessonsCount: 3,
    modules: [
      {
        id: 'mod-py-1',
        courseId: 'course-python-ai',
        title: '1-Modul: Python Sintaksisi va Funksiyalar',
        description: 'O‘zgaruvchilar, sikllar, funksiyalar va OOP asoslari.',
        order: 1,
        lessons: [
          {
            id: 'lesson-py-1-1',
            moduleId: 'mod-py-1',
            courseId: 'course-python-ai',
            title: '1.1 Python Kirish & Ma\'lumotlar turlari',
            description: 'Python muhitini sozlash, o‘zgaruvchilar, list, dict va tuple bilan ishlash.',
            type: 'video',
            durationMinutes: 15,
            order: 1,
            videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
            videoDurationSeconds: 900,
            contentMarkdown: `### 🐍 Python Asoslari

Python — Sun'iy Intellekt va ma'lumotlar tahlilida dunyodagi eng ommabop dasturlash tili.

\`\`\`python
# List comprehension namunasi
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers if x % 2 == 0]
print(squares) # [4, 16]
\`\`\`
`,
            quiz: {
              id: 'quiz-py-1-1',
              lessonId: 'lesson-py-1-1',
              title: 'Python Ma\'lumotlar Turlari Testi',
              passPercentage: 70,
              timeLimitMinutes: 5,
              questions: [
                {
                  id: 'qpy-1',
                  question: 'Pythonda `list` va `tuple` ning asosiy farqi nimada?',
                  options: [
                    { id: 'opt-p1', text: '`list` o‘zgaruvchan (mutable), `tuple` esa o‘zgarmas (immutable)', isCorrect: true },
                    { id: 'opt-p2', text: '`tuple` faqat sonlarni saqlaydi', isCorrect: false },
                    { id: 'opt-p3', text: 'Hech qanday farqi yo‘q', isCorrect: false }
                  ],
                  explanation: 'Pythonda tuple yaratilgandan keyin elementlari o\'zgartirib bo\'lmaydi (immutable).'
                }
              ]
            }
          }
        ]
      }
    ]
  }
];
