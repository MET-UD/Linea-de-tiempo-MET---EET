import React from 'react';
import { BookOpen, Calendar, Award, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'timeline' | 'catalog' | 'stats';
  onSelectTab: (tab: 'timeline' | 'catalog' | 'stats') => void;
  onOpenQuickSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab, onOpenQuickSearch }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in serif display face */}
        <a 
          href="#top" 
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-stone-900 hover:text-stone-700 transition-colors truncate max-w-xs sm:max-w-md"
        >
          Especialización en Educación en Tecnología
        </a>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectTab('timeline')}
            className={`transition-colors flex items-center gap-1.5 pb-0.5 border-b-2 ${
              activeTab === 'timeline' 
                ? 'text-stone-900 border-amber-800 font-semibold' 
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-stone-500" />
            Línea Cronológica
          </button>
          <button
            onClick={() => onSelectTab('catalog')}
            className={`transition-colors flex items-center gap-1.5 pb-0.5 border-b-2 ${
              activeTab === 'catalog' 
                ? 'text-stone-900 border-amber-800 font-semibold' 
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-stone-500" />
            Archivo & Bibliografía
          </button>
          <button
            onClick={() => onSelectTab('stats')}
            className={`transition-colors flex items-center gap-1.5 pb-0.5 border-b-2 ${
              activeTab === 'stats' 
                ? 'text-stone-900 border-amber-800 font-semibold' 
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Award className="w-4 h-4 text-stone-500" />
            Egresados e Impacto
          </button>
        </nav>

        {/* Zone 3: Primary action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQuickSearch}
            className="px-3.5 py-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap"
            title="Buscar en la línea de tiempo"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Buscar Hito</span>
          </button>
        </div>
      </div>
    </header>
  );
};
