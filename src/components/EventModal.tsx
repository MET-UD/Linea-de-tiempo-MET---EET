import React, { useEffect, useState } from 'react';
import { X, Calendar, BookOpen, Check, Copy, ChevronLeft, ChevronRight, Award, User, Tag, FileText } from 'lucide-react';
import { TimelineEvent, CATEGORY_CONFIG } from '../data/timelineData';

interface EventModalProps {
  event: TimelineEvent | null;
  onClose: () => void;
  onNextEvent?: () => void;
  onPrevEvent?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  onClose,
  onNextEvent,
  onPrevEvent,
  hasPrev,
  hasNext,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNextEvent && hasNext) onNextEvent();
      if (e.key === 'ArrowLeft' && onPrevEvent && hasPrev) onPrevEvent();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNextEvent, onPrevEvent, hasNext, hasPrev]);

  if (!event) return null;

  const categoryCfg = CATEGORY_CONFIG[event.category];

  const handleCopyCitation = () => {
    let textToCopy = `${event.yearDisplay}: ${event.title}\n${event.fullText}`;
    if (event.bibliographic) {
      const b = event.bibliographic;
      if (b.authors) textToCopy += `\nAutores: ${b.authors.join(', ')}`;
      if (b.editorial) textToCopy += `\nEditorial: ${b.editorial}`;
      if (b.isbn) textToCopy += `\nISBN: ${b.isbn}`;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-2xl bg-[#FCFAF6] rounded-xl border border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#F5F2EB] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <span className="font-serif font-bold text-lg text-amber-900 tabular-nums">
              {event.yearDisplay}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="font-medium text-stone-700">{categoryCfg.label}</span>
            <span aria-hidden="true" className="text-stone-300 hidden sm:inline">·</span>
            <span className="text-stone-500 hidden sm:inline">{event.periodLabel}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyCitation}
              className="px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-200/70 rounded transition-colors flex items-center gap-1"
              title="Copiar texto o cita"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copiar</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-200/70 rounded-md transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-800">
          {/* Title and subtitle */}
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-900 leading-snug">
              {event.title}
            </h2>
            {event.subtitle && (
              <p className="font-serif italic text-base sm:text-lg text-stone-600">
                {event.subtitle}
              </p>
            )}
          </div>

          {/* Institutional Resolution Banner if present */}
          {event.resolution && (
            <div className="p-3 bg-amber-50/80 border-l-3 border-amber-700 rounded-r-lg text-xs sm:text-sm text-amber-950 flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Acto Administrativo / Marco Normativo:</span>
                <span className="font-mono text-xs">{event.resolution}</span>
              </div>
            </div>
          )}

          {/* Full description */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Descripción y Contexto Documental
            </h3>
            <div className="font-sans text-sm sm:text-base leading-relaxed text-stone-700 whitespace-pre-line bg-white/70 p-4 rounded-lg border border-stone-200/80">
              {event.fullText}
            </div>
          </div>

          {/* SubItems if present (e.g. Year 2000 multi-initiatives or 2026 graduate categories) */}
          {event.subItems && event.subItems.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Ejes Detallados del Hito
              </h3>
              <div className="space-y-3">
                {event.subItems.map((sub, i) => (
                  <div key={i} className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                    <h4 className="text-xs sm:text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-800" />
                      {sub.subtitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-3">
                      {sub.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Graduate Stats if present (2026) */}
          {event.stats && (
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Métricas de Graduación Acumuladas
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-white border border-stone-200 rounded-lg text-center">
                  <div className="text-xs text-stone-500">Modalidad Presencial</div>
                  <div className="font-serif text-2xl font-bold text-stone-900 tabular-nums">
                    {event.stats.presencial}
                  </div>
                  <div className="text-[11px] text-stone-400">Graduados</div>
                </div>

                <div className="p-3.5 bg-white border border-stone-200 rounded-lg text-center">
                  <div className="text-xs text-stone-500">Modalidad Virtual</div>
                  <div className="font-serif text-2xl font-bold text-sky-900 tabular-nums">
                    {event.stats.virtual}
                  </div>
                  <div className="text-[11px] text-sky-600 font-medium">SNIES 116205</div>
                </div>

                <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-lg text-center">
                  <div className="text-xs text-amber-800 font-semibold">Total Histórico</div>
                  <div className="font-serif text-2xl font-bold text-amber-950 tabular-nums">
                    {event.stats.total}
                  </div>
                  <div className="text-[11px] text-amber-800 font-medium">Especialistas</div>
                </div>
              </div>
            </div>
          )}

          {/* Bibliographic Details if present */}
          {event.bibliographic && (
            <div className="pt-2 space-y-3 border-t border-stone-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Ficha Bibliográfica Catalogada
              </h3>
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-xs space-y-2.5">
                {event.bibliographic.authors && (
                  <div>
                    <span className="font-semibold text-stone-600 block">Autoría:</span>
                    <span className="text-stone-800 font-medium">
                      {event.bibliographic.authors.join(' · ')}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-stone-200/60">
                  {event.bibliographic.editorial && (
                    <div>
                      <span className="font-semibold text-stone-600">Editorial: </span>
                      <span className="text-stone-800">{event.bibliographic.editorial}</span>
                    </div>
                  )}
                  {event.bibliographic.isbn && (
                    <div>
                      <span className="font-semibold text-stone-600">ISBN: </span>
                      <span className="text-stone-800 font-mono">{event.bibliographic.isbn}</span>
                    </div>
                  )}
                  {event.bibliographic.pages && (
                    <div>
                      <span className="font-semibold text-stone-600">Páginas / Volumen: </span>
                      <span className="text-stone-800">{event.bibliographic.pages}</span>
                    </div>
                  )}
                </div>

                {event.bibliographic.keywords && (
                  <div className="pt-1 border-t border-stone-200/60">
                    <span className="font-semibold text-stone-600">Palabras Clave: </span>
                    <span className="text-stone-700">
                      {event.bibliographic.keywords.join(', ')}
                    </span>
                  </div>
                )}

                {event.bibliographic.areas && (
                  <div className="pt-1 border-t border-stone-200/60">
                    <span className="font-semibold text-stone-600">Áreas de Conocimiento: </span>
                    <span className="text-stone-700">
                      {event.bibliographic.areas.join('; ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key actors / committee members */}
          {event.keyActors && event.keyActors.length > 0 && (
            <div className="pt-2 space-y-2 border-t border-stone-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Docentes, Investigadores e Instancias Participantes
              </h3>
              <div className="flex flex-wrap gap-2 text-xs text-stone-700">
                {event.keyActors.map((actor, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-stone-300 px-2.5 py-1 rounded-md"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 py-3 border-t border-stone-200 bg-[#F5F2EB] flex items-center justify-between text-xs">
          <button
            onClick={onPrevEvent}
            disabled={!hasPrev}
            className={`px-3 py-1.5 rounded flex items-center gap-1 font-medium transition-colors ${
              hasPrev
                ? 'text-stone-800 hover:bg-stone-200'
                : 'text-stone-400 opacity-50 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Hito anterior</span>
          </button>

          <span className="text-stone-400 hidden sm:inline">
            Usa las flechas ← / → del teclado para navegar
          </span>

          <button
            onClick={onNextEvent}
            disabled={!hasNext}
            className={`px-3 py-1.5 rounded flex items-center gap-1 font-medium transition-colors ${
              hasNext
                ? 'text-stone-800 hover:bg-stone-200'
                : 'text-stone-400 opacity-50 cursor-not-allowed'
            }`}
          >
            <span>Siguiente hito</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
