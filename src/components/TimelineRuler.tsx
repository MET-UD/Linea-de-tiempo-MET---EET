import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { TimelineEvent } from '../data/timelineData';

interface TimelineRulerProps {
  events: TimelineEvent[];
  selectedYear: number | null;
  onSelectYear: (year: number) => void;
  onResetYearFilter: () => void;
  isAutoTouring: boolean;
  onToggleAutoTour: () => void;
}

export const TimelineRuler: React.FC<TimelineRulerProps> = ({
  events,
  selectedYear,
  onSelectYear,
  onResetYearFilter,
  isAutoTouring,
  onToggleAutoTour,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Group events by year to know event counts and highlights
  const yearDataMap = React.useMemo(() => {
    const map = new Map<number, { events: TimelineEvent[]; hasHighlight: boolean }>();
    events.forEach((ev) => {
      const existing = map.get(ev.year) || { events: [], hasHighlight: false };
      existing.events.push(ev);
      if (ev.highlight) existing.hasHighlight = true;
      map.set(ev.year, existing);
    });
    return map;
  }, [events]);

  const uniqueYears = React.useMemo(() => {
    return Array.from(yearDataMap.keys()).sort((a, b) => a - b);
  }, [yearDataMap]);

  // Center selected year in scrubber
  useEffect(() => {
    if (selectedYear && scrollContainerRef.current) {
      const activeBtn = scrollContainerRef.current.querySelector(
        `[data-year="${selectedYear}"]`
      ) as HTMLElement;
      if (activeBtn) {
        const container = scrollContainerRef.current;
        const scrollLeft =
          activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [selectedYear]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleNextYear = () => {
    if (!uniqueYears.length) return;
    if (selectedYear === null) {
      onSelectYear(uniqueYears[0]);
      return;
    }
    const currentIndex = uniqueYears.indexOf(selectedYear);
    if (currentIndex < uniqueYears.length - 1) {
      onSelectYear(uniqueYears[currentIndex + 1]);
    } else {
      onSelectYear(uniqueYears[0]);
    }
  };

  const handlePrevYear = () => {
    if (!uniqueYears.length) return;
    if (selectedYear === null) {
      onSelectYear(uniqueYears[uniqueYears.length - 1]);
      return;
    }
    const currentIndex = uniqueYears.indexOf(selectedYear);
    if (currentIndex > 0) {
      onSelectYear(uniqueYears[currentIndex - 1]);
    } else {
      onSelectYear(uniqueYears[uniqueYears.length - 1]);
    }
  };

  return (
    <div className="bg-[#FAF7F0] border-b border-stone-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px]">
              Eje Cronológico Interactivo
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Haz clic en un año para filtrar sus hitos</span>
            {selectedYear !== null && (
              <button
                onClick={onResetYearFilter}
                className="ml-2 text-amber-800 hover:text-amber-900 font-medium underline underline-offset-2 transition-colors"
              >
                Ver todos los años
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-tour button */}
            <button
              onClick={onToggleAutoTour}
              className={`px-2.5 py-1 rounded text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                isAutoTouring
                  ? 'bg-amber-800 text-white border-amber-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
              title={isAutoTouring ? 'Pausar recorrido automático' : 'Iniciar recorrido cronológico guiado'}
            >
              {isAutoTouring ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pausar Recorrido</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Recorrido Guiado</span>
                </>
              )}
            </button>

            {/* Stepper buttons */}
            <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden shadow-xs">
              <button
                onClick={handlePrevYear}
                className="p-1.5 hover:bg-stone-100 text-stone-700 transition-colors"
                title="Año anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-stone-200" />
              <button
                onClick={handleNextYear}
                className="p-1.5 hover:bg-stone-100 text-stone-700 transition-colors"
                title="Siguiente año"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Rail Container */}
        <div className="relative flex items-center">
          {/* Scroll Left Button */}
          <button
            onClick={() => handleScroll('left')}
            className="hidden sm:flex absolute -left-3 z-10 w-7 h-7 rounded-full bg-white/95 border border-stone-300 shadow-sm items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors"
            aria-label="Desplazar a la izquierda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Timeline Track with Connecting Line */}
          <div
            ref={scrollContainerRef}
            className="w-full overflow-x-auto py-3 px-2 flex items-center gap-2 sm:gap-3 scroll-smooth no-scrollbar relative"
          >
            {/* Continuous background hairline connecting rail */}
            <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-stone-300 -translate-y-1/2 z-0 pointer-events-none" />

            {uniqueYears.map((yr) => {
              const info = yearDataMap.get(yr);
              const count = info?.events.length || 0;
              const isSelected = selectedYear === yr;
              const hasHighlight = info?.hasHighlight;

              return (
                <button
                  key={yr}
                  data-year={yr}
                  onClick={() => onSelectYear(yr)}
                  className={`relative z-10 flex flex-col items-center group shrink-0 px-2.5 py-1.5 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-amber-900 text-white shadow-md scale-105 ring-2 ring-amber-700/50'
                      : 'bg-white hover:bg-amber-50/80 text-stone-700 border border-stone-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-serif text-sm font-semibold tracking-tight tabular-nums">
                      {yr === 2021 ? '2021-22' : yr}
                    </span>
                    {count > 1 && (
                      <span
                        className={`text-[10px] font-sans px-1 py-0.2 rounded-full tabular-nums font-bold ${
                          isSelected ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-600'
                        }`}
                        title={`${count} publicaciones o hitos en este año`}
                      >
                        +{count}
                      </span>
                    )}
                  </div>

                  {/* Dot indicator on the rail */}
                  <div
                    className={`w-2 h-2 mt-1 rounded-full transition-transform ${
                      isSelected
                        ? 'bg-amber-300 scale-125'
                        : hasHighlight
                        ? 'bg-amber-700 group-hover:scale-125'
                        : 'bg-stone-400 group-hover:bg-stone-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => handleScroll('right')}
            className="hidden sm:flex absolute -right-3 z-10 w-7 h-7 rounded-full bg-white/95 border border-stone-300 shadow-sm items-center justify-center text-stone-700 hover:bg-stone-50 transition-colors"
            aria-label="Desplazar a la derecha"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
