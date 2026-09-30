import React from 'react';
import { TimelineEvent, CATEGORY_CONFIG } from '../data/timelineData';
import { ArrowRight, BookOpen, GraduationCap, FileText, Award, Calendar, CheckCircle2 } from 'lucide-react';

interface InteractiveTimelineTrackProps {
  events: TimelineEvent[];
  selectedEventId: string | null;
  onSelectEvent: (event: TimelineEvent) => void;
}

export const InteractiveTimelineTrack: React.FC<InteractiveTimelineTrackProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
}) => {
  // Group events by year for chronological sequencing
  const eventsByYear = React.useMemo(() => {
    const map = new Map<number, TimelineEvent[]>();
    events.forEach((ev) => {
      const list = map.get(ev.year) || [];
      list.push(ev);
      map.set(ev.year, list);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="py-16 text-center text-stone-500 bg-white rounded-xl border border-stone-200 p-8 space-y-3">
        <Calendar className="w-10 h-10 mx-auto text-stone-400 opacity-60" />
        <h3 className="font-serif text-lg text-stone-800 font-medium">No se encontraron hitos</h3>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
          Prueba cambiando el término de búsqueda o seleccionando otro periodo o eje temático.
        </p>
      </div>
    );
  }

  return (
    <div className="relative py-4">
      {/* Central continuous timeline spine/rail */}
      <div className="absolute top-6 bottom-6 left-6 sm:left-8 md:left-28 w-[2px] bg-stone-300 pointer-events-none" />

      <div className="space-y-8 sm:space-y-10">
        {eventsByYear.map(([year, yearEvents]) => {
          const isYearActive = yearEvents.some((e) => e.id === selectedEventId);

          return (
            <div key={year} className="relative group/year">
              {/* Year marker point / node header */}
              <div className="flex items-start gap-3 sm:gap-6">
                {/* Year Label (Desktop Left Column) */}
                <div className="hidden md:block w-20 text-right shrink-0 pt-0.5">
                  <span
                    className={`font-serif text-lg font-bold tabular-nums transition-colors ${
                      isYearActive ? 'text-amber-900' : 'text-stone-700'
                    }`}
                  >
                    {year === 2021 ? '2021-22' : year}
                  </span>
                </div>

                {/* Clickable Node / Point on the Spine */}
                <div className="relative z-10 shrink-0 mt-1">
                  <button
                    onClick={() => onSelectEvent(yearEvents[0])}
                    aria-label={`Ver información del año ${year}`}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 cursor-pointer shadow-xs ${
                      isYearActive
                        ? 'bg-amber-900 border-white text-white ring-4 ring-amber-700/30 scale-110'
                        : 'bg-white border-stone-400 hover:border-amber-800 hover:scale-105 text-stone-700'
                    }`}
                    title={`Haz clic para ver la información de ${year}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-current" />
                  </button>
                </div>

                {/* Year Content and Milestone Cards */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Mobile Year Badge */}
                  <div className="md:hidden flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-amber-900 tabular-nums">
                      {year === 2021 ? '2021-2022' : year}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      ({yearEvents.length} {yearEvents.length === 1 ? 'hito' : 'hitos'})
                    </span>
                  </div>

                  {/* List of events belonging to this year */}
                  <div className="space-y-3">
                    {yearEvents.map((ev, idx) => {
                      const isSelected = ev.id === selectedEventId;
                      const catCfg = CATEGORY_CONFIG[ev.category];

                      return (
                        <div
                          key={ev.id}
                          onClick={() => onSelectEvent(ev)}
                          className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer text-left relative overflow-hidden group/card ${
                            isSelected
                              ? 'bg-[#FFFDF9] border-amber-700 shadow-md ring-1 ring-amber-700/40'
                              : 'bg-white border-stone-200/90 hover:border-stone-400 hover:shadow-xs'
                          }`}
                        >
                          {/* Accent line on left */}
                          <div
                            className={`absolute left-0 top-0 bottom-0 w-1 ${
                              ev.category === 'institucional'
                                ? 'bg-amber-700'
                                : ev.category === 'investigacion'
                                ? 'bg-sky-700'
                                : ev.category === 'publicacion'
                                ? 'bg-emerald-700'
                                : ev.category === 'redes'
                                ? 'bg-indigo-700'
                                : 'bg-rose-700'
                            }`}
                          />

                          <div className="pl-2 space-y-2">
                            {/* Card Header metadata */}
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2 text-stone-500">
                                <span className="font-semibold text-stone-800">
                                  {catCfg.label}
                                </span>
                                {yearEvents.length > 1 && (
                                  <>
                                    <span aria-hidden="true" className="text-stone-300">·</span>
                                    <span className="text-stone-400">
                                      Registro {idx + 1} de {yearEvents.length}
                                    </span>
                                  </>
                                )}
                              </div>

                              <span
                                className={`text-[11px] font-medium flex items-center gap-1 transition-colors ${
                                  isSelected ? 'text-amber-900 font-semibold' : 'text-stone-400 group-hover/card:text-stone-700'
                                }`}
                              >
                                {isSelected ? 'Hito seleccionado' : 'Ver ficha completa'}
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>

                            {/* Title & Subtitle */}
                            <div className="space-y-0.5">
                              <h4
                                className={`font-serif text-base sm:text-lg font-medium leading-snug transition-colors ${
                                  isSelected ? 'text-amber-950 font-semibold' : 'text-stone-900 group-hover/card:text-stone-950'
                                }`}
                              >
                                {ev.title}
                              </h4>
                              {ev.subtitle && (
                                <p className="font-serif italic text-xs sm:text-sm text-stone-600 line-clamp-1">
                                  {ev.subtitle}
                                </p>
                              )}
                            </div>

                            {/* Summary description preview */}
                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2">
                              {ev.summary}
                            </p>

                            {/* Additional indicator footer */}
                            {ev.resolution && (
                              <div className="pt-1 text-[11px] font-mono text-amber-900 flex items-center gap-1">
                                <FileText className="w-3 h-3 text-amber-700 shrink-0" />
                                <span className="truncate">{ev.resolution}</span>
                              </div>
                            )}

                            {ev.bibliographic?.authors && (
                              <div className="pt-1 text-[11px] text-stone-500 truncate flex items-center gap-1">
                                <BookOpen className="w-3 h-3 text-stone-400 shrink-0" />
                                <span>{ev.bibliographic.authors.join(', ')}</span>
                              </div>
                            )}

                            {ev.stats && (
                              <div className="pt-1 flex items-center gap-3 text-xs text-stone-700 font-medium">
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="w-3.5 h-3.5 text-amber-800" />
                                  378 presencial · 9 virtual
                                </span>
                                <span className="font-serif font-bold text-stone-900">
                                  Total: 387 egresados
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
