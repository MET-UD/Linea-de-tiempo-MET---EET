import React from 'react';
import { GraduationCap, Award, ShieldCheck, Globe, Users, BookOpen, Layers } from 'lucide-react';
import { TimelineEvent } from '../data/timelineData';

interface ImpactStatsProps {
  onSelectEventById: (id: string) => void;
}

export const ImpactStats: React.FC<ImpactStatsProps> = ({ onSelectEventById }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Intro Header */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900">
          Métricas de Consolidación e Impacto Académico
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
          Balance de logros institucionales, reconocimiento científico por Minciencias, acreditación oficial del Ministerio de Educación Nacional y cifras consolidadas de graduados al 2026.
        </p>
      </div>

      {/* Primary Figures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Egresados Totales */}
        <div 
          onClick={() => onSelectEventById('ev-2026-egresados-consolidados')}
          className="bg-white p-6 rounded-xl border border-stone-200 hover:border-amber-700 transition-all cursor-pointer group shadow-2xs flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <GraduationCap className="w-6 h-6" />
            </div>

            <div>
              <div className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 tabular-nums">
                387
              </div>
              <h3 className="font-medium text-stone-800 text-base mt-1">Egresados Titulados</h3>
              <p className="text-xs text-stone-500 mt-1">
                Especialistas en Educación en Tecnología ejerciendo en el sistema educativo colombiano.
              </p>
            </div>

            {/* Breakdown */}
            <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-600">Modalidad Presencial (Histórico):</span>
                <span className="font-bold text-stone-900 font-serif tabular-nums text-sm">378</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sky-700 font-medium">Modalidad Virtual (SNIES 116205):</span>
                <span className="font-bold text-sky-900 font-serif tabular-nums text-sm">9</span>
              </div>
            </div>
          </div>

          <div className="pt-4 text-[11px] text-amber-800 font-medium group-hover:underline flex items-center justify-end gap-1">
            Ver hito oficial 2026 →
          </div>
        </div>

        {/* Card 2: DIDACTEC Minciencias */}
        <div 
          onClick={() => onSelectEventById('ev-2024-didactec-categoria-a')}
          className="bg-white p-6 rounded-xl border border-stone-200 hover:border-sky-700 transition-all cursor-pointer group shadow-2xs flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-800">
              <Award className="w-6 h-6" />
            </div>

            <div>
              <div className="font-serif text-4xl sm:text-5xl font-bold text-sky-950">
                Cat. A
              </div>
              <h3 className="font-medium text-stone-800 text-base mt-1">DIDACTEC en Minciencias</h3>
              <p className="text-xs text-stone-500 mt-1">
                Grupo de investigación insignia (Didáctica de la Tecnología), reconocido y mantenido en la categoría A.
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
              <p>• Fundado en 1999 como eje investigativo del posgrado.</p>
              <p>• Pionero del modelo 1 a 1 en Castilla La Nueva (Premio Riviecie).</p>
            </div>
          </div>

          <div className="pt-4 text-[11px] text-sky-800 font-medium group-hover:underline flex items-center justify-end gap-1">
            Ver reconocimiento Minciencias →
          </div>
        </div>

        {/* Card 3: Alta Calidad MEN */}
        <div 
          onClick={() => onSelectEventById('ev-2019-acreditacion-alta-calidad')}
          className="bg-white p-6 rounded-xl border border-stone-200 hover:border-emerald-700 transition-all cursor-pointer group shadow-2xs flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-emerald-950">
                Alta Calidad
              </div>
              <h3 className="font-medium text-stone-800 text-base mt-1">Resolución 9717 de 2019</h3>
              <p className="text-xs text-stone-500 mt-1">
                Acreditación oficial otorgada por el Ministerio de Educación Nacional de Colombia.
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
              <p>• Registro calificado renovado: Res. 017487 de 2020.</p>
              <p>• Registro virtual SNIES 116205: Res. 010820 de 2023.</p>
            </div>
          </div>

          <div className="pt-4 text-[11px] text-emerald-800 font-medium group-hover:underline flex items-center justify-end gap-1">
            Ver resolución ministerial →
          </div>
        </div>
      </div>

      {/* Network & Collaborative Ecosystem */}
      <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-xl border border-stone-200 space-y-6">
        <h3 className="font-serif text-xl font-medium text-stone-900">
          Redes Académicas y Ecosistema de Cooperación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={() => onSelectEventById('ev-2021-repetic')}
            className="p-4 bg-white rounded-lg border border-stone-200 hover:border-indigo-600 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-indigo-900 font-semibold text-sm mb-1">
              <Globe className="w-4 h-4" />
              <span>Red REPETIC</span>
            </div>
            <p className="text-xs text-stone-600">
              Red de Profesorado de Educación Tecnológica e Informática de Colombia (vinculación 2021-2022).
            </p>
          </div>

          <div 
            onClick={() => onSelectEventById('ev-2018-aia-cts')}
            className="p-4 bg-white rounded-lg border border-stone-200 hover:border-indigo-600 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-indigo-900 font-semibold text-sm mb-1">
              <Users className="w-4 h-4" />
              <span>Red AIA-CTS</span>
            </div>
            <p className="text-xs text-stone-600">
              Asociación Iberoamericana de Ciencia, Tecnología y Sociedad en la Educación en Ciencias (vinculación 2018).
            </p>
          </div>

          <div 
            onClick={() => onSelectEventById('ev-2013-ediet-1')}
            className="p-4 bg-white rounded-lg border border-stone-200 hover:border-indigo-600 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-indigo-900 font-semibold text-sm mb-1">
              <Layers className="w-4 h-4" />
              <span>Congreso EDIET</span>
            </div>
            <p className="text-xs text-stone-600">
              Encuentro de Educadores e Investigadores en Educación en Tecnología (creado en 2013).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
