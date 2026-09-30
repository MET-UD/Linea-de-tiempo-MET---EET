import React, { useState, useMemo } from 'react';
import { BranchingTimeline } from './components/BranchingTimeline';
import { DateLightbox } from './components/DateLightbox';
import { TIMELINE_EVENTS, TimelineEvent } from './data/timelineData';

export default function App() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<'especializacion' | 'maestria' | 'ediet' | 'didactec' | null>(null);
  const [activeEvents, setActiveEvents] = useState<TimelineEvent[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Group events by unique years for next/prev navigation
  const yearGroupMap = useMemo(() => {
    const map = new Map<number, { yearDisplay: string; events: TimelineEvent[] }>();
    TIMELINE_EVENTS.forEach((ev) => {
      const existing = map.get(ev.year) || { yearDisplay: ev.yearDisplay, events: [] };
      existing.events.push(ev);
      map.set(ev.year, existing);
    });
    return map;
  }, []);

  const uniqueYears = useMemo(() => {
    return Array.from(yearGroupMap.keys()).sort((a, b) => a - b);
  }, [yearGroupMap]);

  // Handle clicking a node in the branching timeline
  const handleSelectNode = (event: TimelineEvent) => {
    setSelectedYear(event.year);
    const prog = event.program || null;
    setSelectedProgram(prog);

    const allForYear = yearGroupMap.get(event.year)?.events || [];
    const filtered = prog ? allForYear.filter((e) => e.program === prog) : allForYear;

    if (filtered.length > 0) {
      setActiveEvents(filtered);
    } else {
      setActiveEvents([event]);
    }
    setIsLightboxOpen(true);
  };

  // Only navigate among years where the selected program actually has events
  const navYears = useMemo(() => {
    if (!selectedProgram) return uniqueYears;
    const filtered = uniqueYears.filter((yr) =>
      yearGroupMap.get(yr)?.events.some((e) => e.program === selectedProgram)
    );
    return filtered.length > 0 ? filtered : uniqueYears;
  }, [selectedProgram, uniqueYears, yearGroupMap]);

  // Lightbox navigation
  const currentIndex = selectedYear ? navYears.indexOf(selectedYear) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < navYears.length - 1;

  const handlePrevYear = () => {
    if (hasPrev) {
      const prevYr = navYears[currentIndex - 1];
      setSelectedYear(prevYr);
      const data = yearGroupMap.get(prevYr);
      if (data) {
        const filtered = selectedProgram
          ? data.events.filter((e) => e.program === selectedProgram)
          : data.events;
        setActiveEvents(filtered.length > 0 ? filtered : data.events);
      }
    }
  };

  const handleNextYear = () => {
    if (hasNext) {
      const nextYr = navYears[currentIndex + 1];
      setSelectedYear(nextYr);
      const data = yearGroupMap.get(nextYr);
      if (data) {
        const filtered = selectedProgram
          ? data.events.filter((e) => e.program === selectedProgram)
          : data.events;
        setActiveEvents(filtered.length > 0 ? filtered : data.events);
      }
    }
  };

  const currentYearDisplay = useMemo(() => {
    if (!selectedYear) return '';
    if (activeEvents.length > 0 && activeEvents[0].yearDisplay) {
      return activeEvents[0].yearDisplay;
    }
    return String(selectedYear);
  }, [selectedYear, activeEvents]);

  return (
    <div className="min-h-screen w-screen overflow-x-auto overflow-y-auto bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-10 selection:bg-cyan-200 selection:text-cyan-900 relative">
      {/* ─────────────────────────────────────────────────────────────
          DESTELLOS Y SOMBRAS AMBIENTALES ESTILO LIGHTBOX EXHIBIT
         ───────────────────────────────────────────────────────────── */}
      {/* Destello de haz superior cian */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-cyan-400/18 rounded-full blur-[150px] pointer-events-none"
      />

      {/* Destello de resplandor inferior azul cielo */}
      <div
        aria-hidden="true"
        className="fixed bottom-0 right-1/4 translate-x-1/4 translate-y-1/3 w-[800px] h-[550px] bg-sky-400/16 rounded-full blur-[150px] pointer-events-none"
      />

      {/* Halo etéreo central detrás del contenedor de la línea de tiempo */}
      <div
        aria-hidden="true"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[650px] bg-cyan-100/35 rounded-full blur-[160px] pointer-events-none"
      />

      {/* ─────────────────────────────────────────────────────────────
          LÍNEA DE TIEMPO (ESQUEMA EXACTO A LA IMAGEN)
         ───────────────────────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-[2040px] flex items-center justify-center my-auto">
        <BranchingTimeline onSelectNode={handleSelectNode} />
      </main>

      {/* ─────────────────────────────────────────────────────────────
          LIGHTBOX MODAL CON LA INFORMACIÓN DETALLADA (FORMATO NEGRO + EXPLICACIÓN)
         ───────────────────────────────────────────────────────────── */}
      {isLightboxOpen && selectedYear && activeEvents.length > 0 && (
        <DateLightbox
          year={selectedYear}
          yearDisplay={currentYearDisplay}
          events={activeEvents}
          onClose={() => setIsLightboxOpen(false)}
          onNextYear={handleNextYear}
          onPrevYear={handlePrevYear}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      )}
    </div>
  );
}
