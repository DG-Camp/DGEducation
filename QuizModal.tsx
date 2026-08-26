import React from 'react';
import { QuizModalProps } from './types';
import { QuizComponent } from './QuizComponent';
import { X } from 'lucide-react';

export const QuizModal: React.FC<QuizModalProps> = ({
  quiz,
  isOpen,
  onClose,
  onComplete,
  onContinueNextLesson,
  previousAttempt
}) => {
  if (!isOpen) return null;

  return (
    <div id="quiz-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl my-8">
        <button
          id="btn-close-quiz-modal"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shadow-md transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <QuizComponent
          quiz={quiz}
          onComplete={onComplete}
          onClose={onClose}
          onContinueNextLesson={onContinueNextLesson}
          previousAttempt={previousAttempt}
        />
      </div>
    </div>
  );
};
