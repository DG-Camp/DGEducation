import React, { useState } from 'react';
import { LessonAttachment, LessonResourceLink } from '../../../shared/types';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Github, 
  FileCode, 
  FolderArchive, 
  Link as LinkIcon,
  Check
} from 'lucide-react';

interface LessonResourcesProps {
  attachments?: LessonAttachment[];
  resources?: LessonResourceLink[];
}

export const LessonResources: React.FC<LessonResourcesProps> = ({
  attachments = [],
  resources = []
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'zip':
        return <FolderArchive className="w-5 h-5 text-amber-500" />;
      case 'code':
        return <FileCode className="w-5 h-5 text-indigo-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <Github className="w-5 h-5 text-slate-800" />;
      case 'doc':
        return <FileText className="w-5 h-5 text-sky-500" />;
      default:
        return <ExternalLink className="w-5 h-5 text-indigo-500" />;
    }
  };

  const handleDownload = (att: LessonAttachment) => {
    setDownloadingId(att.id);
    // Simulate safe download action without window.alert
    setTimeout(() => {
      setDownloadingId(null);
    }, 1800);
  };

  return (
    <div id="lesson-resources-container" className="space-y-6">
      {/* Downloadable files */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-600" />
          Yuklab Olinadigan Materiallar
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Dars uchun kerakli PDF qo‘llanmalar, slaydlar va boshlang‘ich kod shablonlari.
        </p>

        {attachments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {attachments.map(att => (
              <div 
                key={att.id}
                className="bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 rounded-xl p-4 flex items-center justify-between gap-3 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                    {getFileIcon(att.fileType)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition">
                      {att.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {att.fileSize} • {att.fileType.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownload(att)}
                  className={`p-2 rounded-lg border transition shrink-0 shadow-xs cursor-pointer ${
                    downloadingId === att.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white hover:bg-blue-600 text-slate-600 hover:text-white border-slate-200 hover:border-blue-600'
                  }`}
                  title={downloadingId === att.id ? 'Yuklandi' : 'Yuklab olish'}
                >
                  {downloadingId === att.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            Ushbu dars uchun qo‘shimcha fayllar biriktirilmagan.
          </div>
        )}
      </div>

      {/* External References & Docs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-blue-600" />
          Foydali Manbalar & Hujjatlar
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Mavzuga oid rasmiy dokumentatsiyalar va GitHub omborlari.
        </p>

        {resources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {resources.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 rounded-xl p-4 flex items-center justify-between gap-3 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                    {getLinkIcon(res.type)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition">
                      {res.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 truncate block">
                      {res.url}
                    </span>
                  </div>
                </div>

                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition shrink-0" />
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            Qo‘shimcha havolalar mavjud emas.
          </div>
        )}
      </div>
    </div>
  );
};
