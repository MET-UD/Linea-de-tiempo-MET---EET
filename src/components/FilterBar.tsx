import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { TimelineCategory, TimelinePeriod, CATEGORY_CONFIG, PERIOD_CONFIG } from '../data/timelineData';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: TimelineCategory | 'all';
  onSelectCategory: (category: TimelineCategory | 'all') => void;
  selectedPeriod: TimelinePeriod | 'all';
  onSelectPeriod: (period: TimelinePeriod | 'all') => void;
  selectedYear: number | null;
  onClearAllFilters: () => void;
  totalFilteredCount: number;
  totalEventsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedPeriod,
  onSelectPeriod,
  selectedYear,
  onClearAllFilters,
  totalFilteredCount,
  totalEventsCount,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedPeriod !== 'all' ||
    selectedYear !== null;

  return (
    <div className="bg-[#FAF7F0] border-b border-stone-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Search Row & Period Segmented Control */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar autor, libro, norma (ej. DIDACTEC, Molina, 1 a 1, SNIES)..."
              className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Period Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-stone-500 mr-1 hidden sm:inline whitespace-nowrap">
              Periodo:
            </span>
            <button
              onClick={() => onSelectPeriod('all')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedPeriod === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-300'
              }`}
            >
              Todos (1991–2026)
            </button>
            {(Object.keys(PERIOD_CONFIG) as TimelinePeriod[]).map((p) => {
              const cfg = PERIOD_CONFIG[p];
              const isSelected = selectedPeriod === p;
              return (
                <button
                  key={p}
                  onClick={() => onSelectPeriod(p)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-900 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-300'
                  }`}
                  title={cfg.description}
                >
                  {cfg.years}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Buttons & Active Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center gap-1 text-stone-500 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span className="font-semibold text-[11px] uppercase tracking-wider">Eje temático:</span>
            </div>

            <button
              onClick={() => onSelectCategory('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              Todos
            </button>

            {(Object.keys(CATEGORY_CONFIG) as TimelineCategory[]).map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-amber-800 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Result Count and Clear Filters */}
          <div className="flex items-center gap-2 text-stone-500 text-xs">
            <span>
              Mostrando <strong className="text-stone-800 font-semibold">{totalFilteredCount}</strong> de {totalEventsCount} hitos
            </span>
            {hasActiveFilters && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <button
                  onClick={onClearAllFilters}
                  className="text-amber-800 hover:text-amber-950 underline underline-offset-2 font-medium"
                >
                  Restablecer filtros
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
