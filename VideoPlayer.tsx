import React, { useState } from 'react';
import { Lesson } from '../../../shared/types';
import { 
  Play, 
  Maximize2, 
  Volume2, 
  Clock, 
  FileText, 
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';

interface VideoPlayerProps {
  lesson: Lesson;
  isTheaterMode?: boolean;
  onToggleTheater?: () => void;
  onMarkAsWatched?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  lesson,
  isTheaterMode,
  onToggleTheater,
  onMarkAsWatched
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (lesson.type !== 'video' || !lesson.videoUrl) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Matnli dars & Amaliyot</h3>
        <p className="text-sm text-slate-500 max-w-md">
          Ushbu dars uchun video talab etilmaydi. Quyidagi dars matni, kod namunalari va test orqali bilimingizni oshiring.
        </p>
      </div>
    );
  }

  return (
    <div id="lesson-video-player-wrapper" className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-md group">
      {/* 16:9 Aspect ratio responsive container */}
      <div className="relative aspect-video w-full bg-black">
        <iframe
          id="lesson-video-iframe"
          className="w-full h-full border-0"
          src={`${lesson.videoUrl}?autoplay=0&rel=0&modestbranding=1`}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Video Quick Controls & Metadata Bar */}
      <div className="px-4 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Davomiyligi: {lesson.durationMinutes} daqiqa
          </span>
          <span className="hidden sm:inline-block text-slate-300">•</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-600 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            HD Sifat
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onToggleTheater && (
            <button
              id="btn-toggle-theater"
              onClick={onToggleTheater}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition font-medium border border-slate-200"
              title="Kengaytirilgan ko'rinish"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Teatr rejimi</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
