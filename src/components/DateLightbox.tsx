import React, { useEffect } from 'react';
import { TimelineEvent } from '../data/timelineData';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateLightboxProps {
  year: number | null;
  yearDisplay: string;
  events: TimelineEvent[];
  onClose: () => void;
  onNextYear: () => void;
  onPrevYear: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const getCleanExplanation = (title: string, fullText: string): string => {
  const trimmedText = fullText.trim();
  const lowerTitle = title.toLowerCase().trim();
  const lowerText = trimmedText.toLowerCase();

  if (lowerText.startsWith(lowerTitle)) {
    const after = trimmedText.slice(lowerTitle.length).trim();
    if (after.startsWith(':') || after.startsWith('-') || after.startsWith('—') || after.startsWith('.')) {
      return after.slice(1).trim();
    }
  }
  return trimmedText;
};

export const DateLightbox: React.FC<DateLightboxProps> = ({
  year,
  yearDisplay,
  events,
  onClose,
  onNextYear,
  onPrevYear,
  hasPrev,
  hasNext,
}) => {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNextYear();
      if (e.key === 'ArrowLeft' && hasPrev) onPrevYear();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNextYear, onPrevYear, hasNext, hasPrev]);

  if (!year || events.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Lightbox Dialog Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/90 shadow-2xl shadow-cyan-500/20 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top luminous cyan glow flare */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        
        {/* Subtle decorative glow orbs inside the dialog */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Lightbox Header */}
        <div className="relative p-5 sm:p-6 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-sans font-extrabold text-2xl sm:text-4xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 bg-clip-text text-transparent tabular-nums drop-shadow-xs">
              {yearDisplay}
            </span>
            {events.length > 1 && (
              <>
                <span className="h-5 w-[1.5px] bg-slate-200" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {events.length} registros
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Prev / Next buttons inside lightbox */}
            <div className="flex items-center border border-slate-200/80 rounded-xl bg-white shadow-2xs overflow-hidden">
              <button
                onClick={onPrevYear}
                disabled={!hasPrev}
                className={`p-2 transition-colors ${
                  hasPrev
                    ? 'text-cyan-800 hover:bg-cyan-50 cursor-pointer'
                    : 'text-slate-300 opacity-50 cursor-not-allowed'
                }`}
                title="Fecha anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-slate-200" />
              <button
                onClick={onNextYear}
                disabled={!hasNext}
                className={`p-2 transition-colors ${
                  hasNext
                    ? 'text-cyan-800 hover:bg-cyan-50 cursor-pointer'
                    : 'text-slate-300 opacity-50 cursor-not-allowed'
                }`}
                title="Siguiente fecha"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
              aria-label="Cerrar lightbox"
              title="Cerrar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lightbox Scrollable Body: Únicamente el texto en negrilla, dos puntos y la explicación */}
        <div className="relative p-5 sm:p-8 overflow-y-auto space-y-5">
          {events.map((ev) => {
            return (
              <article
                key={ev.id}
                className="relative bg-slate-50/80 rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs hover:border-cyan-300/80 transition-all overflow-hidden"
              >
                {/* Luminous blue top hairline */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 rounded-t-2xl" />

                {/* Main content: Formato regular sin negrilla */}
                <div className="p-5 sm:p-6 bg-white rounded-xl border border-slate-200/80 text-slate-700 text-sm sm:text-base font-normal leading-relaxed shadow-2xs">
                  <p className="font-normal text-slate-700 whitespace-pre-line leading-relaxed">
                    {ev.fullText}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Lightbox Footer Bar with keyboard instructions and close button */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Usa las flechas ← / → del teclado para navegar entre fechas</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors font-medium shadow-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
