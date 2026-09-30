import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-stone-200 bg-[#F5F2EB] py-8 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-serif font-medium text-stone-900 text-sm">
            Especialización en Educación en Tecnología
          </p>
          <p className="text-stone-500">
            Universidad Distrital Francisco José de Caldas · Facultad de Ciencias y Educación · Bogotá, Colombia
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-stone-400">1991 – 2026 · Memoria Institucional</span>
          <button
            onClick={scrollToTop}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200/80 rounded transition-colors flex items-center gap-1.5"
            title="Volver al inicio"
          >
            <span>Subir</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
