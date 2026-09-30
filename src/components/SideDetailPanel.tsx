import React, { useState } from 'react';
import { X, Calendar, BookOpen, Copy, Check, ChevronLeft, ChevronRight, FileText, User, GraduationCap, Award, ExternalLink } from 'lucide-react';
import { TimelineEvent, CATEGORY_CONFIG } from '../data/timelineData';

interface SideDetailPanelProps {
  selectedEvent: TimelineEvent | null;
  eventsForYear?: TimelineEvent[];
  onSelectEvent: (event: TimelineEvent) => void;
  onClose: () => void;
  onNextEvent?: () => void;
  onPrevEvent?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const SideDetailPanel: React.FC<SideDetailPanelProps> = ({
  selectedEvent,
  eventsForYear = [],
  onSelectEvent,
  onClose,
  onNextEvent,
  onPrevEvent,
  hasPrev,
  hasNext,
}) => {
  const [copied, setCopied] = useState(false);

  if (!selectedEvent) return null;

  const categoryCfg = CATEGORY_CONFIG[selectedEvent.category];

  const handleCopy = () => {
    let text = `${selectedEvent.yearDisplay} - ${selectedEvent.title}\n\n${selectedEvent.fullText}`;
    if (selectedEvent.bibliographic) {
      const b = selectedEvent.bibliographic;
      if (b.authors) text += `\n\nAutores: ${b.authors.join(', ')}`;
      if (b.editorial) text += `\nEditorial: ${b.editorial}`;
      if (b.isbn) text += `\nISBN: ${b.isbn}`;
      if (b.keywords) text += `\nPalabras clave: ${b.keywords.join(', ')}`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside 
      className="bg-[#FCFAF6] border-l border-stone-200 h-full flex flex-col shadow-xl md:shadow-none animate-in slide-in-from-right-4 duration-200"
      aria-label="Panel de detalles del hito"
    >
      {/* Panel Top Bar */}
      <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#F5F2EB] flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-2xl text-amber-900 tabular-nums">
            {selectedEvent.yearDisplay}
          </span>
          <span aria-hidden="true" className="text-stone-300">/</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 truncate max-w-[180px]">
            {categoryCfg.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded shadow-2xs transition-colors flex items-center gap-1"
            title="Copiar información"
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
            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-200/70 rounded transition-colors"
            title="Cerrar panel lateral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Multiple events for this year selector tabs */}
      {eventsForYear.length > 1 && (
        <div className="px-4 py-2.5 bg-amber-50/50 border-b border-stone-200 shrink-0">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-900 mb-1.5 flex items-center justify-between">
            <span>Hitos registrados en el año {selectedEvent.year}:</span>
            <span className="text-stone-500 font-normal">({eventsForYear.length} eventos)</span>
          </div>
          <div className="flex flex-col gap-1">
            {eventsForYear.map((ev, idx) => (
              <button
                key={ev.id}
                onClick={() => onSelectEvent(ev)}
                className={`text-left px-2.5 py-1.5 rounded text-xs transition-colors truncate flex items-center gap-2 ${
                  ev.id === selectedEvent.id
                    ? 'bg-amber-800 text-white font-medium shadow-2xs'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                <span className="font-mono text-[10px] opacity-75">{idx + 1}.</span>
                <span className="truncate">{ev.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-stone-800">
        {/* Title and Subtitle */}
        <div className="space-y-1.5">
          <h2 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-stone-900 leading-snug">
            {selectedEvent.title}
          </h2>
          {selectedEvent.subtitle && (
            <p className="font-serif italic text-sm text-stone-600">
              {selectedEvent.subtitle}
            </p>
          )}
          <div className="pt-1 text-xs text-stone-500 flex items-center gap-2">
            <span>Periodo: <strong>{selectedEvent.periodLabel}</strong></span>
          </div>
        </div>

        {/* Administrative resolution if applicable */}
        {selectedEvent.resolution && (
          <div className="p-3 bg-amber-50/90 border-l-3 border-amber-700 rounded-r-md text-xs text-amber-950 flex items-start gap-2">
            <FileText className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Acto Administrativo / Marco Normativo:</span>
              <span className="font-mono text-xs">{selectedEvent.resolution}</span>
            </div>
          </div>
        )}

        {/* Full description box */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Descripción Completa del Hito
          </h3>
          <div className="font-sans text-xs sm:text-sm leading-relaxed text-stone-700 whitespace-pre-line bg-white p-4 rounded-lg border border-stone-200 shadow-2xs">
            {selectedEvent.fullText}
          </div>
        </div>

        {/* SubItems breakdown (e.g. 2000 1-to-1 or 2026 egresados) */}
        {selectedEvent.subItems && selectedEvent.subItems.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Componentes Detallados
            </h3>
            <div className="space-y-2">
              {selectedEvent.subItems.map((sub, i) => (
                <div key={i} className="p-3 bg-white border border-stone-200 rounded-lg space-y-1">
                  <h4 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-800" />
                    {sub.subtitle}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed pl-3">
                    {sub.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Graduate stats (2026) */}
        {selectedEvent.stats && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Consolidación de Graduados
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-white border border-stone-200 rounded-lg text-center">
                <div className="text-[11px] text-stone-500">Presencial</div>
                <div className="font-serif text-xl font-bold text-stone-900 tabular-nums">
                  {selectedEvent.stats.presencial}
                </div>
                <div className="text-[10px] text-stone-400">Egresados</div>
              </div>

              <div className="p-2.5 bg-white border border-stone-200 rounded-lg text-center">
                <div className="text-[11px] text-stone-500">Virtual</div>
                <div className="font-serif text-xl font-bold text-sky-900 tabular-nums">
                  {selectedEvent.stats.virtual}
                </div>
                <div className="text-[10px] text-sky-600">SNIES 116205</div>
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-center">
                <div className="text-[11px] text-amber-800 font-semibold">Total</div>
                <div className="font-serif text-xl font-bold text-amber-950 tabular-nums">
                  {selectedEvent.stats.total}
                </div>
                <div className="text-[10px] text-amber-700">Comunidad</div>
              </div>
            </div>
          </div>
        )}

        {/* Bibliographic fields if present */}
        {selectedEvent.bibliographic && (
          <div className="space-y-2.5 border-t border-stone-200 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Ficha Bibliográfica Catalogada
            </h3>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-3.5 text-xs space-y-2">
              {selectedEvent.bibliographic.authors && (
                <div>
                  <span className="font-semibold text-stone-600 block">Autoría:</span>
                  <span className="text-stone-800 font-medium">
                    {selectedEvent.bibliographic.authors.join(' · ')}
                  </span>
                </div>
              )}

              {selectedEvent.bibliographic.editorial && (
                <div>
                  <span className="font-semibold text-stone-600">Editorial: </span>
                  <span className="text-stone-800">{selectedEvent.bibliographic.editorial}</span>
                </div>
              )}

              {selectedEvent.bibliographic.isbn && (
                <div>
                  <span className="font-semibold text-stone-600">ISBN: </span>
                  <span className="text-stone-800 font-mono">{selectedEvent.bibliographic.isbn}</span>
                </div>
              )}

              {selectedEvent.bibliographic.pages && (
                <div>
                  <span className="font-semibold text-stone-600">Páginas: </span>
                  <span className="text-stone-800">{selectedEvent.bibliographic.pages}</span>
                </div>
              )}

              {selectedEvent.bibliographic.keywords && (
                <div className="pt-1 border-t border-stone-200">
                  <span className="font-semibold text-stone-600">Palabras Clave: </span>
                  <span className="text-stone-700">
                    {selectedEvent.bibliographic.keywords.join(', ')}
                  </span>
                </div>
              )}

              {selectedEvent.bibliographic.areas && (
                <div className="pt-1 border-t border-stone-200">
                  <span className="font-semibold text-stone-600">Áreas de Conocimiento: </span>
                  <span className="text-stone-700">
                    {selectedEvent.bibliographic.areas.join('; ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Key actors */}
        {selectedEvent.keyActors && selectedEvent.keyActors.length > 0 && (
          <div className="space-y-2 border-t border-stone-200 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Docentes e Instancias
            </h3>
            <div className="flex flex-wrap gap-1.5 text-xs text-stone-700">
              {selectedEvent.keyActors.map((actor, idx) => (
                <span key={idx} className="bg-white border border-stone-300 px-2 py-0.5 rounded text-[11px]">
                  {actor}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="p-3 border-t border-stone-200 bg-[#F5F2EB] flex items-center justify-between text-xs shrink-0">
        <button
          onClick={onPrevEvent}
          disabled={!hasPrev}
          className={`px-2.5 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
            hasPrev
              ? 'text-stone-800 hover:bg-stone-200'
              : 'text-stone-400 opacity-50 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <span className="text-[11px] text-stone-500">
          Usa ← / → para avanzar
        </span>

        <button
          onClick={onNextEvent}
          disabled={!hasNext}
          className={`px-2.5 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
            hasNext
              ? 'text-stone-800 hover:bg-stone-200'
              : 'text-stone-400 opacity-50 cursor-not-allowed'
          }`}
        >
          <span>Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
