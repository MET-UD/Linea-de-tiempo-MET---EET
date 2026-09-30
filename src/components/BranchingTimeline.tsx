import React, { useState } from 'react';
import { TimelineEvent, TIMELINE_EVENTS } from '../data/timelineData';

interface BranchingTimelineProps {
  onSelectNode: (event: TimelineEvent) => void;
}

interface TimelinePoint {
  year: number;
  x: number;
  isAbove: boolean;
  isCyan: boolean;
}

export const BranchingTimeline: React.FC<BranchingTimelineProps> = ({ onSelectNode }) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Group events by program and year
  const eventsByProgramYear = React.useMemo(() => {
    const map = new Map<string, TimelineEvent[]>();
    TIMELINE_EVENTS.forEach((ev) => {
      const prog = ev.program || 'especializacion';
      const key = `${prog}-${ev.year}`;
      const list = map.get(key) || [];
      list.push(ev);
      map.set(key, list);

      // Also map by year only as fallback
      const yearKey = `any-${ev.year}`;
      const yearList = map.get(yearKey) || [];
      yearList.push(ev);
      map.set(yearKey, yearList);
    });
    return map;
  }, []);

  const handleNodeClick = (
    year: number,
    program: 'especializacion' | 'maestria' | 'ediet' | 'didactec',
    labelTitle?: string,
    displayLabel?: string
  ) => {
    // 1. Try exact program + year match
    const exact = eventsByProgramYear.get(`${program}-${year}`);
    if (exact && exact.length > 0) {
      onSelectNode(exact[0]);
      return;
    }

    // 2. Try any event in that year
    const anyYear = eventsByProgramYear.get(`any-${year}`);
    if (anyYear && anyYear.length > 0) {
      const matchProg = anyYear.find((e) => e.program === program);
      if (matchProg) {
        onSelectNode(matchProg);
        return;
      }
      onSelectNode(anyYear[0]);
      return;
    }

    // 3. Fallback contextual milestone for program
    const programLabels: Record<string, string> = {
      especializacion: 'Especialización en Educación en Tecnología',
      didactec: 'Grupo de investigación DIDACTEC',
      ediet: 'Encuentro de Docentes e Investigadores en Educación en Tecnología (EDIET)',
      maestria: 'Maestría en Educación en Tecnología',
    };

    const syntheticEvent: TimelineEvent = {
      id: `synthetic-${program}-${year}`,
      year,
      yearDisplay: displayLabel || String(year),
      title: labelTitle || `Hito Académico e Investigativo (${displayLabel || year})`,
      category: 'institucional',
      categoryLabel: programLabels[program],
      program,
      period: year < 2000 ? '1991-1999' : year < 2010 ? '2000-2009' : year < 2019 ? '2010-2018' : '2019-2026',
      periodLabel: 'Trayectoria Histórica e Intelectual',
      summary: `Desarrollo de actividades curriculares, investigativas y de extensión en ${programLabels[program]}.`,
      fullText: `En el año ${displayLabel || year}, el programa ${programLabels[program]} consolidó sus avances institucionales, proyectos de investigación y formación posgradual en la Universidad Distrital Francisco José de Caldas.`,
      highlight: false,
    };
    onSelectNode(syntheticEvent);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // EXACT COORDINATES MATCHING Linea de tiempo.png
  // ──────────────────────────────────────────────────────────────────────────

  const Y_DIDACTEC = 230;
  const Y_EET = 420;
  const Y_EDIET = 600;
  const Y_MET = 770;

  const X_1991 = 380;
  const X_1999 = 760;
  const X_2013 = 1432;
  const X_2026 = 2056;

  // Spacing helper: exactly 48px per year from 1999 to 2026
  const getYearX = (year: number) => {
    if (year >= 1991 && year <= 1999) {
      return X_1991 + ((year - 1991) / 8) * (X_1999 - X_1991);
    }
    return X_1999 + (year - 1999) * 48;
  };

  // 1. DIDACTEC Points (2000 to 2025)
  const didactecCyanYears = new Set([2000, 2005, 2010, 2012, 2014, 2018, 2020, 2021, 2022, 2024]);
  const didactecPoints: TimelinePoint[] = Array.from({ length: 26 }, (_, i) => {
    const yr = 2000 + i;
    return {
      year: yr,
      x: getYearX(yr),
      isAbove: yr % 2 !== 0,
      isCyan: didactecCyanYears.has(yr),
    };
  });

  // 2. EET Pre-1999 Points (1992 to 1998)
  const eetPre1999CyanYears = new Set([1992, 1997]);
  const eetPre1999Points: TimelinePoint[] = Array.from({ length: 7 }, (_, i) => {
    const yr = 1992 + i;
    return {
      year: yr,
      x: getYearX(yr),
      isAbove: yr % 2 !== 0,
      isCyan: eetPre1999CyanYears.has(yr),
    };
  });

  // 3. EET 1999 to 2013 Points (2000 to 2012)
  const eetMidCyanYears = new Set([2000, 2001, 2002, 2010, 2011, 2012]);
  const eet1999To2013Points: TimelinePoint[] = Array.from({ length: 13 }, (_, i) => {
    const yr = 2000 + i;
    return {
      year: yr,
      x: getYearX(yr),
      isAbove: yr % 2 !== 0,
      isCyan: eetMidCyanYears.has(yr),
    };
  });

  // 4. EET 2013 to 2026 Points (2014 to 2025)
  const eetPostCyanYears = new Set([2014, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]);
  const eetPost2013Points: TimelinePoint[] = Array.from({ length: 12 }, (_, i) => {
    const yr = 2014 + i;
    return {
      year: yr,
      x: getYearX(yr),
      isAbove: yr % 2 !== 0,
      isCyan: eetPostCyanYears.has(yr),
    };
  });

  // 5. EDIET Points (2014 to 2025)
  const edietCyanYears = new Set([2014, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]);
  const edietPoints: TimelinePoint[] = Array.from({ length: 12 }, (_, i) => {
    const yr = 2014 + i;
    return {
      year: yr,
      x: getYearX(yr),
      isAbove: yr % 2 !== 0,
      isCyan: edietCyanYears.has(yr),
    };
  });

  // 6. MET Points (2014 to 2025)
  const metCyanYears = new Set([2014, 2015, 2016, 2018, 2020, 2021, 2023, 2025]);
  const metPoints: TimelinePoint[] = Array.from({ length: 12 }, (_, i) => {
    const yr = 2014 + i;
    return {
      year: yr,
      x: getYearX(yr),
      isAbove: yr % 2 !== 0,
      isCyan: metCyanYears.has(yr),
    };
  });

  // Helper de renderizado de puntos
  const renderTrackPoint = (
    item: TimelinePoint,
    yTrack: number,
    program: 'especializacion' | 'maestria' | 'ediet' | 'didactec',
    keyPrefix: string
  ) => {
    if (!item.isCyan) {
      return (
        <g
          key={`${keyPrefix}-${item.year}`}
          className="pointer-events-none select-none"
          aria-hidden="true"
        >
          <circle cx={item.x} cy={yTrack} r="5" fill="#b0b8c1" />
          <text
            x={item.x}
            y={item.isAbove ? yTrack - 16 : yTrack + 26}
            textAnchor="middle"
            fontSize="13.5"
            fontWeight="normal"
            fill="#b0b8c1"
            className="tabular-nums"
          >
            {item.year}
          </text>
        </g>
      );
    }

    return (
      <g
        key={`${keyPrefix}-${item.year}`}
        className="cursor-pointer group"
        onClick={() => handleNodeClick(item.year, program)}
      >
        {/* Glow halo when hovered */}
        <circle
          cx={item.x}
          cy={yTrack}
          r="12"
          fill="#00a0e9"
          className="opacity-0 group-hover:opacity-20 transition-opacity duration-200 pointer-events-none"
        />
        <circle
          cx={item.x}
          cy={yTrack}
          r="6.5"
          fill="#00a0e9"
          className="transition-transform duration-150 group-hover:scale-125"
          filter="url(#subtle-glow)"
        />
        <text
          x={item.x}
          y={item.isAbove ? yTrack - 16 : yTrack + 26}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="#00a0e9"
          className="tabular-nums transition-colors group-hover:fill-sky-600"
        >
          {item.year}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center select-none py-6 sm:py-10">
      {/* ─────────────────────────────────────────────────────────────
          CONTENEDOR LIGHTBOX CON EFECTOS GRÁFICOS, DESTELLOS Y SOMBRAS
         ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-[2040px] bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_25px_70px_-15px_rgba(0,160,233,0.16),0_10px_30px_-10px_rgba(15,23,42,0.07),0_0_90px_rgba(0,160,233,0.08)] p-3 sm:p-6 lg:p-8 overflow-hidden">
        {/* Destello de luz superior en gradiente cian (Top Flare) */}
        <div className="absolute top-0 inset-x-12 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] pointer-events-none" />

        {/* Destello de luz inferior suave (Bottom Flare) */}
        <div className="absolute bottom-0 inset-x-24 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

        {/* Orbes de luz ambientales difuminados dentro del marco (Lightbox Glows) */}
        <div
          aria-hidden="true"
          className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-400/12 rounded-full blur-[110px] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-400/12 rounded-full blur-[110px] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-200/10 rounded-full blur-[130px] pointer-events-none"
        />

        <div className="w-full overflow-x-auto flex items-center justify-center relative z-10">
          <svg
            viewBox="90 120 2010 740"
            className="w-full h-auto min-w-[1050px] max-w-[1920px] overflow-visible"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {/* ─────────────────────────────────────────────────────────────
                DEFINICIÓN DE SOMBRAS Y FILTROS TIPO LIGHTBOX
               ───────────────────────────────────────────────────────────── */}
            <defs>
              {/* Sombra suave multicapa para las tarjetas (Lightbox Card Shadow) */}
              <filter id="lightbox-card-shadow" x="-10%" y="-10%" width="125%" height="130%">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#00a0e9" floodOpacity="0.10" />
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.05" />
              </filter>

              {/* Sombra circular para los nodos principales */}
              <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00a0e9" floodOpacity="0.16" />
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.05" />
              </filter>

              {/* Destello sutil para puntos cian */}
              <filter id="subtle-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#00a0e9" floodOpacity="0.30" />
              </filter>
            </defs>

            {/* ─────────────────────────────────────────────────────────────
                1. CONEXIONES VERTICALES DE RAMIFICACIÓN HISTÓRICA (1999 Y 2013)
               ───────────────────────────────────────────────────────────── */}

            {/* Conexión Vertical 1999: de EET (Y=420) a DIDACTEC (Y=230) */}
            <line
              x1={X_1999}
              y1={Y_EET - 24}
              x2={X_1999}
              y2={Y_DIDACTEC + 24}
              stroke="#b0b8c1"
              strokeWidth="2.5"
            />

            {/* Conexión Vertical 2013: de EET (Y=420) pasando por EDIET (Y=600) hasta MET (Y=770) */}
            <line
              x1={X_2013}
              y1={Y_EET + 24}
              x2={X_2013}
              y2={Y_MET - 24}
              stroke="#b0b8c1"
              strokeWidth="2.5"
            />

            {/* ─────────────────────────────────────────────────────────────
                2. LÍNEAS HORIZONTALES POR CADA PISTA
               ───────────────────────────────────────────────────────────── */}

            {/* Pista 1: DIDACTEC (Desde 1999 hasta 2026) */}
            <line
              x1={X_1999 + 24}
              y1={Y_DIDACTEC}
              x2={X_2026 - 24}
              y2={Y_DIDACTEC}
              stroke="#b0b8c1"
              strokeWidth="2.5"
            />

            {/* Pista 2: EET (Desde 1991 pasando por 1999 y 2013 hasta 2026) */}
            <line
              x1={X_1991 + 24}
              y1={Y_EET}
              x2={X_1999 - 24}
              y2={Y_EET}
              stroke="#b0b8c1"
              strokeWidth="2.5"
            />
            <line
              x1={X_1999 + 24}
              y1={Y_EET}
              x2={X_2013 - 24}
              y2={Y_EET}
              stroke="#b0b8c1"
              strokeWidth="2.5"
            />
            <line
              x1={X_2013 + 24}
              y1={Y_EET}
              x2={X_2026 - 24}
              y2={Y_EET}
              stroke="#b0b8c1"
              strokeWidth="2.5"
            />

            {/* Pista 3: EDIET (Desde 2013 hasta 2026) */}
            <line
              x1={X_2013 + 24}
              y1={Y_EDIET}
              x2={X_2026 - 24}
              y2={Y_EDIET}
              stroke="#b0b8c1"
              strokeWidth="2.5"
            />

            {/* Pista 4: MET (Desde 2013 hasta 2026) */}
            <line
              x1={X_2013 + 24}
              y1={Y_MET}
              x2={X_2026 - 24}
              y2={Y_MET}
              stroke="#b0b8c1"
              strokeWidth="2.5"
            />

            {/* ─────────────────────────────────────────────────────────────
                3. TARJETAS / BLOQUES TEMÁTICOS CON SOMBRAS SUAVES LIGHTBOX
               ───────────────────────────────────────────────────────────── */}

            {/* Tarjeta 1: DIDACTEC */}
            <g
              className="cursor-pointer group"
              onClick={() => handleNodeClick(1999, 'didactec', 'Grupo de investigación DIDACTEC')}
              filter="url(#lightbox-card-shadow)"
            >
              <rect
                x="476"
                y="178"
                width="260"
                height="104"
                rx="16"
                fill="#ffffff"
                stroke="#00a0e9"
                strokeWidth="2"
                className="transition-all duration-200 group-hover:stroke-sky-600"
              />
              <text
                x="506"
                y="228"
                fill="#00a0e9"
                fontSize="23"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                DIDACTEC
              </text>
              <text
                x="506"
                y="256"
                fill="#1e293b"
                fontSize="15"
                fontWeight="normal"
              >
                Grupo de investigación
              </text>
            </g>

            {/* Tarjeta 2: EET */}
            <g
              className="cursor-pointer group"
              onClick={() => handleNodeClick(1991, 'especializacion', 'Especialización en Educación en Tecnología')}
              filter="url(#lightbox-card-shadow)"
            >
              <rect
                x="120"
                y="367"
                width="236"
                height="106"
                rx="16"
                fill="#ffffff"
                stroke="#00a0e9"
                strokeWidth="2"
                className="transition-all duration-200 group-hover:stroke-sky-600"
              />
              <text
                x="148"
                y="414"
                fill="#00a0e9"
                fontSize="23"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                EET
              </text>
              <text
                x="148"
                y="438"
                fill="#1e293b"
                fontSize="14"
                fontWeight="normal"
              >
                Especialización en
              </text>
              <text
                x="148"
                y="458"
                fill="#1e293b"
                fontSize="14"
                fontWeight="normal"
              >
                Educación en Tecnología
              </text>
            </g>

            {/* Tarjeta 3: EDIET */}
            <g
              className="cursor-pointer group"
              onClick={() => handleNodeClick(2013, 'ediet', 'Encuentro de Docentes e Investigadores en Educación en Tecnología (EDIET)')}
              filter="url(#lightbox-card-shadow)"
            >
              <rect
                x="1138"
                y="547"
                width="270"
                height="106"
                rx="16"
                fill="#ffffff"
                stroke="#00a0e9"
                strokeWidth="2"
                className="transition-all duration-200 group-hover:stroke-sky-600"
              />
              <text
                x="1164"
                y="585"
                fill="#00a0e9"
                fontSize="22"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                EDIET
              </text>
              <text
                x="1164"
                y="608"
                fill="#1e293b"
                fontSize="13.5"
                fontWeight="normal"
              >
                Encuentro de Docentes e
              </text>
              <text
                x="1164"
                y="627"
                fill="#1e293b"
                fontSize="13.5"
                fontWeight="normal"
              >
                Investigadores en Educación
              </text>
              <text
                x="1164"
                y="646"
                fill="#1e293b"
                fontSize="13.5"
                fontWeight="normal"
              >
                en Tecnología
              </text>
            </g>

            {/* Tarjeta 4: MET */}
            <g
              className="cursor-pointer group"
              onClick={() => handleNodeClick(2013, 'maestria', 'Maestría en Educación en Tecnología')}
              filter="url(#lightbox-card-shadow)"
            >
              <rect
                x="1138"
                y="718"
                width="270"
                height="104"
                rx="16"
                fill="#ffffff"
                stroke="#00a0e9"
                strokeWidth="2"
                className="transition-all duration-200 group-hover:stroke-sky-600"
              />
              <text
                x="1164"
                y="758"
                fill="#00a0e9"
                fontSize="22"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                MET
              </text>
              <text
                x="1164"
                y="784"
                fill="#1e293b"
                fontSize="14"
                fontWeight="normal"
              >
                Maestría en Educación
              </text>
              <text
                x="1164"
                y="804"
                fill="#1e293b"
                fontSize="14"
                fontWeight="normal"
              >
                en Tecnología
              </text>
            </g>

            {/* ─────────────────────────────────────────────────────────────
                4. NODOS CIRCULARES DESTACADOS (1991, 1999, 2013, 2026)
               ───────────────────────────────────────────────────────────── */}

            {/* Nodo 1991 (EET) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleNodeClick(1991, 'especializacion')}
              onMouseEnter={() => setHoveredNodeId('node-1991')}
              onMouseLeave={() => setHoveredNodeId(null)}
              filter="url(#node-shadow)"
            >
              <circle
                cx={X_1991}
                cy={Y_EET}
                r="24"
                fill="#ffffff"
                stroke="#00a0e9"
                strokeWidth="2.5"
                className="transition-transform group-hover:scale-110"
                style={{ transformOrigin: `${X_1991}px ${Y_EET}px` }}
              />
              <text
                x={X_1991}
                y={Y_EET + 5}
                textAnchor="middle"
                fontSize="15"
                fontWeight="bold"
                fill="#00a0e9"
                className="tabular-nums"
              >
                1991
              </text>
            </g>

            {/* Nodo 1999 (DIDACTEC) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleNodeClick(1999, 'didactec')}
              onMouseEnter={() => setHoveredNodeId('node-did-1999')}
              onMouseLeave={() => setHoveredNodeId(null)}
              filter="url(#node-shadow)"
            >
              <circle
                cx={X_1999}
                cy={Y_DIDACTEC}
                r="24"
                fill="#ffffff"
                stroke="#00a0e9"
                strokeWidth="2.5"
                className="transition-transform group-hover:scale-110"
                style={{ transformOrigin: `${X_1999}px ${Y_DIDACTEC}px` }}
              />
              <text
                x={X_1999}
                y={Y_DIDACTEC + 5}
                textAnchor="middle"
                fontSize="15"
                fontWeight="bold"
                fill="#00a0e9"
                className="tabular-nums"
              >
                1999
              </text>
            </g>

            {/* Nodo 1999 (EET) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleNodeClick(1999, 'especializacion')}
              onMouseEnter={() => setHoveredNodeId('node-esp-1999')}
              onMouseLeave={() => setHoveredNodeId(null)}
              filter="url(#node-shadow)"
            >
              <circle
                cx={X_1999}
                cy={Y_EET}
                r="24"
                fill="#ffffff"
                stroke="#00a0e9"
                strokeWidth="2.5"
                className="transition-transform group-hover:scale-110"
                style={{ transformOrigin: `${X_1999}px ${Y_EET}px` }}
              />
              <text
                x={X_1999}
                y={Y_EET + 5}
                textAnchor="middle"
                fontSize="15"
                fontWeight="bold"
                fill="#00a0e9"
                className="tabular-nums"
              >
                1999
              </text>
            </g>

            {/* Nodo 2013 (EET) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleNodeClick(2013, 'especializacion')}
              onMouseEnter={() => setHoveredNodeId('node-esp-2013')}
              onMouseLeave={() => setHoveredNodeId(null)}
              filter="url(#node-shadow)"
            >
              <circle
                cx={X_2013}
                cy={Y_EET}
                r="24"
                fill="#ffffff"
                stroke="#00a0e9"
                strokeWidth="2.5"
                className="transition-transform group-hover:scale-110"
                style={{ transformOrigin: `${X_2013}px ${Y_EET}px` }}
              />
              <text
                x={X_2013}
                y={Y_EET + 5}
                textAnchor="middle"
                fontSize="15"
                fontWeight="bold"
                fill="#00a0e9"
                className="tabular-nums"
              >
                2013
              </text>
            </g>

            {/* Nodo 2013 (EDIET) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleNodeClick(2013, 'ediet')}
              onMouseEnter={() => setHoveredNodeId('node-ediet-2013')}
              onMouseLeave={() => setHoveredNodeId(null)}
              filter="url(#node-shadow)"
            >
              <circle
                cx={X_2013}
                cy={Y_EDIET}
                r="24"
                fill="#ffffff"
                stroke="#00a0e9"
                strokeWidth="2.5"
                className="transition-transform group-hover:scale-110"
                style={{ transformOrigin: `${X_2013}px ${Y_EDIET}px` }}
              />
              <text
                x={X_2013}
                y={Y_EDIET + 5}
                textAnchor="middle"
                fontSize="15"
                fontWeight="bold"
                fill="#00a0e9"
                className="tabular-nums"
              >
                2013
              </text>
            </g>

            {/* Nodo 2013 (MET) */}
            <g
              className="cursor-pointer group"
              onClick={() => handleNodeClick(2013, 'maestria')}
              onMouseEnter={() => setHoveredNodeId('node-met-2013')}
              onMouseLeave={() => setHoveredNodeId(null)}
              filter="url(#node-shadow)"
            >
              <circle
                cx={X_2013}
                cy={Y_MET}
                r="24"
                fill="#ffffff"
                stroke="#00a0e9"
                strokeWidth="2.5"
                className="transition-transform group-hover:scale-110"
                style={{ transformOrigin: `${X_2013}px ${Y_MET}px` }}
              />
              <text
                x={X_2013}
                y={Y_MET + 5}
                textAnchor="middle"
                fontSize="15"
                fontWeight="bold"
                fill="#00a0e9"
                className="tabular-nums"
              >
                2013
              </text>
            </g>

            {/* Nodos Terminales 2026 */}
            {[
              { id: '2026-did', y: Y_DIDACTEC, prog: 'didactec' as const },
              { id: '2026-eet', y: Y_EET, prog: 'especializacion' as const },
              { id: '2026-ediet', y: Y_EDIET, prog: 'ediet' as const },
              { id: '2026-met', y: Y_MET, prog: 'maestria' as const },
            ].map((node) => (
              <g
                key={node.id}
                className="cursor-pointer group"
                onClick={() => handleNodeClick(2026, node.prog)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                filter="url(#node-shadow)"
              >
                <circle
                  cx={X_2026}
                  cy={node.y}
                  r="24"
                  fill="#ffffff"
                  stroke="#00a0e9"
                  strokeWidth="2.5"
                  className="transition-transform group-hover:scale-110"
                  style={{ transformOrigin: `${X_2026}px ${node.y}px` }}
                />
                <text
                  x={X_2026}
                  y={node.y + 5}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="bold"
                  fill="#00a0e9"
                  className="tabular-nums"
                >
                  2026
                </text>
              </g>
            ))}

            {/* ─────────────────────────────────────────────────────────────
                5. PUNTOS Y ETIQUETAS DE AÑOS EXACTAS DE CADA PISTA
               ───────────────────────────────────────────────────────────── */}

            {/* PISTA 1: DIDACTEC (2000 a 2025) */}
            {didactecPoints.map((item) =>
              renderTrackPoint(item, Y_DIDACTEC, 'didactec', 'did')
            )}

            {/* PISTA 2: EET Pre-1999 (1992 a 1998) */}
            {eetPre1999Points.map((item) =>
              renderTrackPoint(item, Y_EET, 'especializacion', 'eet-pre')
            )}

            {/* PISTA 2: EET 1999 a 2013 (2000 a 2012) */}
            {eet1999To2013Points.map((item) =>
              renderTrackPoint(item, Y_EET, 'especializacion', 'eet-mid')
            )}

            {/* PISTA 2: EET 2013 a 2026 (2014 a 2025) */}
            {eetPost2013Points.map((item) =>
              renderTrackPoint(item, Y_EET, 'especializacion', 'eet-post')
            )}

            {/* PISTA 3: EDIET (2014 a 2025) */}
            {edietPoints.map((item) =>
              renderTrackPoint(item, Y_EDIET, 'ediet', 'ediet')
            )}

            {/* PISTA 4: MET (2014 a 2025) */}
            {metPoints.map((item) =>
              renderTrackPoint(item, Y_MET, 'maestria', 'met')
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
