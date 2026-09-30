import React from 'react';
import { ArrowUpRight, BookOpen, FileText, User, GraduationCap, Award } from 'lucide-react';
import { TimelineEvent, CATEGORY_CONFIG } from '../data/timelineData';

interface EventCardProps {
  event: TimelineEvent;
  onOpenDetails: (event: TimelineEvent) => void;
  isHighlighted?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onOpenDetails, isHighlighted }) => {
  const catCfg = CATEGORY_CONFIG[event.category];

  return (
    <article
      onClick={() => onOpenDetails(event)}
      className={`group relative bg-white rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden p-5 sm:p-6 ${
        isHighlighted
          ? 'border-amber-700/80 shadow-md ring-1 ring-amber-700/30 bg-[#FFFDF9]'
          : 'border-stone-200 hover:border-stone-400 hover:shadow-sm'
      }`}
    >
      {/* Category colored top accent indicator bar */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1 ${
          event.category === 'institucional' ? 'bg-amber-700' :
          event.category === 'investigacion' ? 'bg-sky-700' :
          event.category === 'publicacion' ? 'bg-emerald-700' :
          event.category === 'redes' ? 'bg-indigo-700' : 'bg-rose-700'
        }`} 
      />

      <div className="space-y-3.5">
        {/* Unboxed Metadata Line with typographic separators */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-stone-500">
            <span className="font-serif font-bold text-base text-amber-900 tabular-nums">
              {event.yearDisplay}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="font-medium text-stone-700">{catCfg.label}</span>
            <span aria-hidden="true" className="text-stone-300 hidden sm:inline">·</span>
            <span className="text-stone-400 hidden sm:inline">{event.periodLabel}</span>
          </div>

          <div className="flex items-center gap-1 text-stone-400 group-hover:text-amber-800 transition-colors text-xs font-medium">
            <span>Ver detalles</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h3 className="font-serif text-lg sm:text-xl font-medium tracking-tight text-stone-900 group-hover:text-amber-950 transition-colors leading-snug">
            {event.title}
          </h3>
          {event.subtitle && (
            <p className="font-serif italic text-xs sm:text-sm text-stone-600 line-clamp-1">
              {event.subtitle}
            </p>
          )}
        </div>

        {/* Excerpt Summary */}
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
          {event.summary}
        </p>

        {/* Bibliographic snippet if present */}
        {event.bibliographic && (
          <div className="pt-2 border-t border-stone-100 text-xs text-stone-500 space-y-1">
            {event.bibliographic.authors && (
              <div className="flex items-center gap-1.5 line-clamp-1">
                <User className="w-3 h-3 text-stone-400 shrink-0" />
                <span className="text-stone-700 font-medium truncate">
                  {event.bibliographic.authors.slice(0, 3).join(', ')}
                  {event.bibliographic.authors.length > 3 && ` y ${event.bibliographic.authors.length - 3} más`}
                </span>
              </div>
            )}
            {event.bibliographic.isbn && (
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-500">
                <BookOpen className="w-3 h-3 text-stone-400 shrink-0" />
                <span>ISBN: {event.bibliographic.isbn}</span>
              </div>
            )}
          </div>
        )}

        {/* Administrative resolution if present */}
        {event.resolution && (
          <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-xs text-amber-900 font-mono">
            <FileText className="w-3 h-3 text-amber-700 shrink-0" />
            <span className="truncate">{event.resolution}</span>
          </div>
        )}

        {/* Egresados Stats snippet if present (2026) */}
        {event.stats && (
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-amber-800" />
              <span><strong>378</strong> Presencial · <strong>9</strong> Virtual</span>
            </div>
            <span className="font-bold font-serif text-sm text-stone-900">Total: 387</span>
          </div>
        )}
      </div>
    </article>
  );
};
