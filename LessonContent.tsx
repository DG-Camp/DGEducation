import React, { useState } from 'react';
import { Lesson } from '../../../shared/types';
import { 
  Code2, 
  Copy, 
  Check, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  Terminal,
  ExternalLink
} from 'lucide-react';

interface LessonContentProps {
  lesson: Lesson;
  onOpenQuiz?: () => void;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
}

export const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  onOpenQuiz,
  isCompleted,
  onToggleComplete
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Helper to parse simple markdown chunks for clean display
  const renderFormattedMarkdown = (markdown?: string) => {
    if (!markdown) return null;

    const sections = markdown.split('\n\n');

    return (
      <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
        {sections.map((section, idx) => {
          if (section.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl font-bold text-slate-900 pt-3 pb-1 border-b border-slate-200 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                {section.replace('### ', '')}
              </h3>
            );
          }
          if (section.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-base font-semibold text-blue-700 pt-2">
                {section.replace('#### ', '')}
              </h4>
            );
          }
          if (section.startsWith('```')) {
            const lines = section.split('\n');
            const lang = lines[0].replace('```', '') || 'bash';
            const codeBody = lines.slice(1, lines.length - 1).join('\n');

            return (
              <div key={idx} className="my-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                <div className="bg-slate-800 px-4 py-2 text-xs font-mono text-slate-300 flex items-center justify-between border-b border-slate-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    {lang}
                  </span>
                  <button
                    onClick={() => handleCopyCode(codeBody)}
                    className="hover:text-white flex items-center gap-1 transition"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? 'Nusxalandi' : 'Nusxa olish'}
                  </button>
                </div>
                <pre className="p-4 text-xs sm:text-sm font-mono text-slate-100 overflow-x-auto leading-relaxed">
                  <code>{codeBody}</code>
                </pre>
              </div>
            );
          }
          if (section.startsWith('- ') || section.startsWith('* ')) {
            const listItems = section.split('\n');
            return (
              <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2 text-slate-700">
                {listItems.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: item.replace(/^[-*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>').replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 text-xs font-mono border border-slate-200">$1</code>') }} />
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <p key={idx} className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{
              __html: section
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
                .replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 text-xs font-mono border border-slate-200">$1</code>')
            }} />
          );
        })}
      </div>
    );
  };

  return (
    <div id="lesson-content-container" className="space-y-6">
      {/* Lesson Title & Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          {lesson.description}
        </p>

        {/* Action badges */}
        <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-slate-200">
          <button
            id="btn-mark-lesson-complete-inline"
            onClick={onToggleComplete}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition border ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
            {isCompleted ? 'Dars tugallandi' : 'Tugallandi deb belgilash'}
          </button>

          {lesson.quiz && onOpenQuiz && (
            <button
              id="btn-open-quiz-from-content"
              onClick={onOpenQuiz}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-2 transition"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              Dars Testi (Quiz)ga o‘tish
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Text Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        {renderFormattedMarkdown(lesson.contentMarkdown)}

        {/* Dedicated Code Snippet if present */}
        {lesson.codeSnippet && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-600" />
              Darsdagi asosiy kod ({lesson.codeSnippet.filename || 'Example.ts'})
            </h4>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
              <div className="bg-slate-800 px-4 py-2 text-xs font-mono text-slate-300 flex items-center justify-between border-b border-slate-700">
                <span className="font-semibold text-blue-400">{lesson.codeSnippet.filename || `${lesson.codeSnippet.language} snippet`}</span>
                <button
                  onClick={() => handleCopyCode(lesson.codeSnippet!.code)}
                  className="hover:text-white flex items-center gap-1.5 transition text-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Nusxalandi!' : 'Kodni nusxalash'}
                </button>
              </div>
              <pre className="p-4 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                <code>{lesson.codeSnippet.code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
