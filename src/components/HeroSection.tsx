import React from 'react';
import { ArrowDown, GraduationCap, Award, BookCheck, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onScrollToTimeline: () => void;
  totalEvents: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToTimeline, totalEvents }) => {
  return (
    <section className="relative border-b border-stone-200 bg-[#FAF7F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Narrative Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean unboxed metadata with typographic separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-600 tracking-wide uppercase">
              <span>Universidad Distrital Francisco José de Caldas</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>Facultad de Ciencias y Educación</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>Posgrado Oficial</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-900 leading-tight text-balance">
                Línea de Tiempo Histórica e Intelectual
              </h1>
              <p className="font-serif italic text-lg sm:text-xl text-stone-700">
                Especialización en Educación en Tecnología (1991 – 2026)
              </p>
            </div>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Memoria cronológica de tres décadas y media de innovación pedagógica, investigación en didáctica de la tecnología con el grupo DIDACTEC, producción académica de vanguardia, acreditación de alta calidad y consolidación en modalidades presencial y virtual.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-200">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-amber-800">
                  <GraduationCap className="w-4 h-4" />
                  <span className="font-serif text-2xl font-semibold text-stone-900 tabular-nums">387</span>
                </div>
                <div className="text-xs text-stone-500">Egresados Totales</div>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-sky-800">
                  <Award className="w-4 h-4" />
                  <span className="font-serif text-2xl font-semibold text-stone-900">Cat. A</span>
                </div>
                <div className="text-xs text-stone-500">DIDACTEC Minciencias</div>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-serif text-2xl font-semibold text-stone-900">Alta Calidad</span>
                </div>
                <div className="text-xs text-stone-500">Res. 9717 MEN</div>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <BookCheck className="w-4 h-4" />
                  <span className="font-serif text-2xl font-semibold text-stone-900 tabular-nums">{totalEvents}</span>
                </div>
                <div className="text-xs text-stone-500">Hitos Documentados</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onScrollToTimeline}
                className="px-5 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Explorar Cronología Interactiva</span>
                <ArrowDown className="w-4 h-4" />
              </button>
              <span className="text-xs text-stone-500">
                Haz clic en cualquier año o nodo para consultar la documentación completa
              </span>
            </div>
          </div>

          {/* Archival Visual Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-stone-300 shadow-sm bg-stone-100 group">
              <img
                src="/src/assets/images/udistrital_academic_archive_1790709650559.jpg"
                alt="Archivo histórico y pedagógico de la Especialización en Educación en Tecnología"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 object-cover filter contrast-[1.03] transition-transform duration-500 group-hover:scale-102"
                onError={(e) => {
                  // Fallback container per zero-broken-image policy
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.img-fallback') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div 
                className="img-fallback hidden w-full h-72 sm:h-80 bg-stone-200 items-center justify-center p-6 text-center text-stone-600"
              >
                <div className="space-y-2">
                  <GraduationCap className="w-10 h-10 mx-auto text-amber-800 opacity-60" />
                  <p className="font-serif text-sm">Archivo Institucional de Educación en Tecnología</p>
                  <p className="text-xs text-stone-500">Universidad Distrital Francisco José de Caldas</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 text-white text-xs space-y-0.5">
                <p className="font-serif italic font-medium">Memoria pedagógica e investigativa</p>
                <p className="text-[11px] text-stone-200 opacity-90">Facultad de Ciencias y Educación · Desde 1991</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
