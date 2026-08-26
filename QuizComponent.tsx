import React, { useState, useEffect } from 'react';
import { Quiz, QuizAttempt, QuizQuestion, QuizComponentProps } from './types';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  AlertCircle, 
  Sparkles, 
  Code2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizComponent: React.FC<QuizComponentProps> = ({
  quiz,
  onComplete,
  onClose,
  onContinueNextLesson,
  previousAttempt
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(
    previousAttempt ? previousAttempt.selectedAnswers : {}
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!previousAttempt);
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(previousAttempt || null);

  // Timer state
  const totalSeconds = (quiz.timeLimitMinutes || 5) * 60;
  const [secondsLeft, setSecondsLeft] = useState<number>(totalSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(!previousAttempt);

  // Reset when quiz changes or previousAttempt updates
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(previousAttempt ? previousAttempt.selectedAnswers : {});
    setIsSubmitted(!!previousAttempt);
    setAttemptResult(previousAttempt || null);
    setSecondsLeft((quiz.timeLimitMinutes || 5) * 60);
    setIsTimerRunning(!previousAttempt);
  }, [quiz.id, previousAttempt]);

  const currentQuestion: QuizQuestion | undefined = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  useEffect(() => {
    if (!isTimerRunning || isSubmitted) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, isSubmitted, selectedAnswers]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const calculateResults = (): QuizAttempt => {
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      const selectedOptId = selectedAnswers[q.id];
      const correctOpt = q.options.find(opt => opt.isCorrect);
      if (selectedOptId && correctOpt && selectedOptId === correctOpt.id) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= quiz.passPercentage;

    const attempt: QuizAttempt = {
      quizId: quiz.id,
      lessonId: quiz.lessonId,
      score: correctCount,
      totalQuestions,
      percentage,
      passed,
      selectedAnswers: { ...selectedAnswers },
      completedAt: new Date().toISOString()
    };

    return attempt;
  };

  const handleSubmitQuiz = () => {
    setIsTimerRunning(false);
    const result = calculateResults();
    setAttemptResult(result);
    setIsSubmitted(true);
    onComplete(result);

    if (result.passed) {
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      } catch {
        // Ignore fallback
      }
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setAttemptResult(null);
    setCurrentQuestionIndex(0);
    setSecondsLeft(totalSeconds);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentQuestion && !isSubmitted) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-sm text-slate-500">
        Ushbu dars uchun savollar topilmadi.
      </div>
    );
  }

  return (
    <div id="quiz-container" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-100">
              5.4 Test Moduli
            </span>
            <span className="text-xs text-slate-500 font-medium">
              O‘tish bali: <strong className="text-slate-800">{quiz.passPercentage}%</strong>
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5">
            {quiz.title}
          </h2>
        </div>

        {/* Timer */}
        {!isSubmitted && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold border ${
            secondsLeft < 60 
              ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' 
              : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}>
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{formatTime(secondsLeft)}</span>
          </div>
        )}
      </div>

      {/* SUBMITTED / RESULTS STATE */}
      {isSubmitted && attemptResult ? (
        <div id="quiz-result-view" className="py-6 space-y-6">
          {/* Summary Banner */}
          <div className={`p-6 rounded-xl border ${
            attemptResult.passed 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
              : 'bg-rose-50/80 border-rose-200 text-rose-950'
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  attemptResult.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {attemptResult.passed ? <Award className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">
                    {attemptResult.passed ? 'Testdan muvaffaqiyatli o‘tdingiz!' : 'Testdan o‘ta olmadingiz'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Natija: <strong>{attemptResult.score} / {attemptResult.totalQuestions}</strong> ({attemptResult.percentage}%).
                    {attemptResult.passed 
                      ? ' Dars tugallandi deb belgilandi.' 
                      : ` O‘tish uchun kamida ${quiz.passPercentage}% kerak.`}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  id="btn-quiz-retake"
                  onClick={handleRetake}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Qayta topshirish
                </button>
                {onContinueNextLesson && (
                  <button
                    id="btn-quiz-next-lesson"
                    onClick={onContinueNextLesson}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
                  >
                    Keyingi dars
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Review List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Savollar tahlili ({attemptResult.score}/{attemptResult.totalQuestions})
            </h4>

            {quiz.questions.map((q, qIndex) => {
              const selectedOptId = attemptResult.selectedAnswers[q.id];
              const correctOpt = q.options.find(opt => opt.isCorrect);
              const isCorrect = selectedOptId === correctOpt?.id;

              return (
                <div 
                  key={q.id}
                  id={`review-question-${q.id}`}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {qIndex + 1}
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900">{q.question}</p>
                        {q.codeSnippet && (
                          <pre className="mt-2 p-2.5 rounded-lg bg-slate-900 text-xs font-mono text-slate-100 border border-slate-200 overflow-x-auto">
                            <code>{q.codeSnippet}</code>
                          </pre>
                        )}
                      </div>
                    </div>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> To‘g‘ri
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">
                        <XCircle className="w-3 h-3 text-rose-600" /> Noto‘g‘ri
                      </span>
                    )}
                  </div>

                  {/* Options status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt) => {
                      const isChosen = selectedOptId === opt.id;
                      const isRightAnswer = opt.isCorrect;

                      let optStyle = 'bg-white border-slate-200 text-slate-600';
                      if (isRightAnswer) {
                        optStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold';
                      } else if (isChosen && !isRightAnswer) {
                        optStyle = 'bg-rose-50 border-rose-300 text-rose-900 line-through';
                      }

                      return (
                        <div 
                          key={opt.id}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${optStyle}`}
                        >
                          <span>{opt.text}</span>
                          {isRightAnswer && <span className="text-[10px] text-emerald-700 font-bold ml-2">To‘g‘ri</span>}
                          {isChosen && !isRightAnswer && <span className="text-[10px] text-rose-700 font-bold ml-2">Tanlangan</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-blue-950">Izoh:</strong> {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ACTIVE QUESTION TEST STATE */
        <div id="active-question-view" className="py-5 space-y-5">
          {/* Question Navigation Bar (Pills) */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Savol {currentQuestionIndex + 1} / {totalQuestions}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {quiz.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = !!selectedAnswers[q.id];
                return (
                  <button
                    key={q.id}
                    id={`btn-question-pill-${idx}`}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : isAnswered
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Question Box */}
          {currentQuestion && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {currentQuestion.question}
              </h3>

              {currentQuestion.codeSnippet && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-2xs">
                  <div className="bg-slate-800 px-3 py-1.5 text-xs font-mono text-slate-300 flex items-center gap-1.5 border-b border-slate-700">
                    <Code2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Kod ({currentQuestion.codeLanguage || 'code'})</span>
                  </div>
                  <pre className="p-3.5 text-xs font-mono text-slate-100 overflow-x-auto leading-relaxed">
                    <code>{currentQuestion.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Multiple Choice Options */}
              <div className="space-y-2.5 pt-1">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
                  const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                  return (
                    <button
                      key={opt.id}
                      id={`btn-option-${opt.id}`}
                      onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-center gap-3 group cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500 font-medium'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50/80 shadow-2xs'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center shrink-0 transition ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:text-slate-900'
                      }`}>
                        {letter}
                      </span>
                      <span className="text-xs sm:text-sm flex-1">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls Bar */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              id="btn-quiz-prev"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Oldingi
            </button>

            <div className="text-xs text-slate-500 font-medium">
              Javob berildi: <span className="text-slate-900 font-bold">{answeredCount}</span> / {totalQuestions}
            </div>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                id="btn-quiz-next"
                onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                Keyingi
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="btn-quiz-submit"
                onClick={handleSubmitQuiz}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                Testni yakunlash
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
