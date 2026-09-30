import React, { useRef, useEffect } from 'react';
import { TimelineEvent, TIMELINE_EVENTS } from '../data/timelineData';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface CleanDateTimelineProps {
  selectedYear: number | null;
  onSelectYear: (year: number) => void;
}

export const CleanDateTimeline: React.FC<CleanDateTimelineProps> = ({
  selectedYear,
  onSelectYear,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Group events by unique years
  const yearGroupMap = React.useMemo(() => {
    const map = new Map<number, { yearDisplay: string; events: TimelineEvent[] }>();
    TIMELINE_EVENTS.forEach((ev) => {
      const existing = map.get(ev.year) || { yearDisplay: ev.yearDisplay, events: [] };
      existing.events.push(ev);
      map.set(ev.year, existing);
    });
    return map;
  }, []);

  const uniqueYears = React.useMemo(() => {
    return Array.from(yearGroupMap.keys()).sort((a, b) => a - b);
  }, [yearGroupMap]);

  // Center selected year button in horizontal scroll
  useEffect(() => {
    if (selectedYear && scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector(
        `[data-year="${selectedYear}"]`
      ) as HTMLElement;
      if (activeEl) {
        const container = scrollContainerRef.current;
        const scrollLeft =
          activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [selectedYear]);

  const handleScrollRail = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -380 : 380,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* ─────────────────────────────────────────────────────────────
          LÍNEA DE TIEMPO INTERACTIVA CON LÍNEA AZUL CONTINUA Y BRILLANTE
         ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/95 px-4 sm:px-8 py-8 sm:py-12 shadow-2xl shadow-cyan-500/10 overflow-hidden">
        {/* Luminous light flare running across the top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-95" />
        {/* Ambient cyan light glow */}
        <div className="absolute -top-20 left-1/3 w-[500px] h-40 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-1/4 w-[400px] h-40 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Timeline Rail Container with scroll buttons */}
        <div className="relative py-4 sm:py-6">
          {/* Scroll arrow Left */}
          <button
            onClick={() => handleScrollRail('left')}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm border border-cyan-200 shadow-lg shadow-cyan-500/15 items-center justify-center text-cyan-700 hover:bg-cyan-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Desplazar fechas a la izquierda"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Scroll arrow Right */}
          <button
            onClick={() => handleScrollRail('right')}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm border border-cyan-200 shadow-lg shadow-cyan-500/15 items-center justify-center text-cyan-700 hover:bg-cyan-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Desplazar fechas a la derecha"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="w-full overflow-x-auto py-6 px-4 sm:px-14 scroll-smooth"
          >
            {/* Inner track that has the FULL width of all items (min-w-max) */}
            <div className="relative min-w-max flex items-start gap-8 sm:gap-11 px-8 py-5">
              
              {/* ─────────────────────────────────────────────────────────
                  LÍNEA AZUL CONTINUA QUE ATRAVIESA EXACTAMENTE LOS PUNTOS
                 ───────────────────────────────────────────────────────── */}
              <div 
                className="absolute top-[36px] left-8 right-8 h-[4px] -translate-y-1/2 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 rounded-full shadow-[0_0_16px_#06b6d4,0_0_30px_rgba(6,182,212,0.8)] pointer-events-none z-0" 
              />

              {uniqueYears.map((yr) => {
                const isSelected = selectedYear === yr;
                const displayLabel = yr === 2021 ? '2021-2022' : String(yr);
                const data = yearGroupMap.get(yr);
                const count = data?.events.length || 0;

                return (
                  <div
                    key={yr}
                    data-year={yr}
                    className="flex flex-col items-center shrink-0 relative z-10 group"
                  >
                    {/* Clickable Point / Dot directly intersected by the blue line */}
                    <button
                      onClick={() => onSelectYear(yr)}
                      aria-label={`Abrir información de la fecha ${displayLabel}`}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 border-2 border-white scale-125 shadow-[0_0_24px_rgba(6,182,212,1)] ring-4 ring-cyan-300/60'
                          : 'bg-white border-2 border-cyan-400 hover:border-cyan-500 hover:scale-120 hover:shadow-[0_0_16px_rgba(6,182,212,0.8)] active:scale-95'
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          isSelected ? 'bg-white shadow-[0_0_8px_#ffffff]' : 'bg-cyan-600 group-hover:bg-cyan-400'
                        }`}
                      />
                    </button>

                    {/* Clickable Date Text */}
                    <button
                      onClick={() => onSelectYear(yr)}
                      className={`mt-3 font-sans text-sm sm:text-base font-semibold tabular-nums transition-all px-3 py-1 rounded-xl cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                          : 'text-slate-600 hover:text-cyan-800 hover:bg-cyan-50/80'
                      }`}
                    >
                      {displayLabel}
                    </button>

                    {/* Multiple count indicator dot if more than 1 item */}
                    {count > 1 && (
                      <span className="text-[10px] text-cyan-600 font-mono mt-0.5 opacity-80 font-medium">
                        +{count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Clean subtle instruction banner at the bottom of the timeline card */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
          <span>Haz clic en cualquiera de las fechas o puntos para abrir el visor con su información completa</span>
        </div>
      </section>
    </div>
  );
};
