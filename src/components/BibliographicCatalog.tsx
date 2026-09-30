import React, { useState } from 'react';
import { TimelineEvent } from '../data/timelineData';
import { BookOpen, Copy, Check, Search, Filter, ExternalLink, Calendar, User } from 'lucide-react';

interface BibliographicCatalogProps {
  events: TimelineEvent[];
  onSelectEvent: (event: TimelineEvent) => void;
}

export const BibliographicCatalog: React.FC<BibliographicCatalogProps> = ({ events, onSelectEvent }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter only publications and research reports
  const publications = React.useMemo(() => {
    return events.filter((e) => e.category === 'publicacion' || e.bibliographic);
  }, [events]);

  const filteredPubs = React.useMemo(() => {
    if (!filterQuery.trim()) return publications;
    const q = filterQuery.toLowerCase();
    return publications.filter((p) => {
      const titleMatch = p.title.toLowerCase().includes(q);
      const authorsMatch = p.bibliographic?.authors?.some((a) => a.toLowerCase().includes(q));
      const kwMatch = p.bibliographic?.keywords?.some((k) => k.toLowerCase().includes(q));
      const yearMatch = p.yearDisplay.includes(q);
      const editorialMatch = p.bibliographic?.editorial?.toLowerCase().includes(q);
      return titleMatch || authorsMatch || kwMatch || yearMatch || editorialMatch;
    });
  }, [publications, filterQuery]);

  const handleCopyCitation = (event: TimelineEvent) => {
    const b = event.bibliographic;
    let citation = '';
    if (b?.authors) citation += `${b.authors.join(', ')}. `;
    citation += `"${event.title}". `;
    if (b?.editorial) citation += `Editorial: ${b.editorial}, `;
    citation += `${event.yearDisplay}. `;
    if (b?.isbn) citation += `ISBN: ${b.isbn}. `;
    if (b?.pages) citation += `Págs: ${b.pages}.`;

    navigator.clipboard.writeText(citation);
    setCopiedId(event.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Catalog Intro & Search */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-stone-900">
              Acervo Bibliográfico y Producción Editorial
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Publicaciones científicas, modelos de teleeducación, monografías y libros publicados por los docentes e investigadores del programa.
            </p>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filtrar por autor, tema, ISBN..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700/30 text-stone-800"
            />
          </div>
        </div>

        <div className="text-xs text-stone-500 pt-1 border-t border-stone-100 flex items-center justify-between">
          <span>Total obras catalogadas: <strong>{filteredPubs.length}</strong></span>
          <span className="text-[11px] text-stone-400">Haz clic en cualquier obra para ver su contexto en la línea de tiempo</span>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPubs.map((pub) => {
          const b = pub.bibliographic;
          const isCopied = copiedId === pub.id;

          return (
            <div
              key={pub.id}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:border-amber-700 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Year and copy action */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-serif font-bold text-amber-900 text-base tabular-nums">
                    {pub.yearDisplay}
                  </span>
                  <button
                    onClick={() => handleCopyCitation(pub)}
                    className="text-stone-500 hover:text-stone-800 flex items-center gap-1 text-[11px] font-medium bg-stone-50 hover:bg-stone-100 px-2 py-1 rounded border border-stone-200 transition-colors"
                    title="Copiar cita bibliográfica en formato estándar"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copiada</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar Cita</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => onSelectEvent(pub)}
                  className="font-serif text-base font-semibold text-stone-900 group-hover:text-amber-950 cursor-pointer leading-snug"
                >
                  {pub.title}
                </h3>

                {/* Authors */}
                {b?.authors && (
                  <div className="text-xs text-stone-700">
                    <span className="font-semibold text-stone-500 block mb-0.5">Autores:</span>
                    <p className="line-clamp-2">{b.authors.join(' · ')}</p>
                  </div>
                )}

                {/* Publisher & ISBN */}
                <div className="text-xs text-stone-600 space-y-1 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  {b?.editorial && (
                    <div className="truncate">
                      <span className="font-medium text-stone-500">Editorial: </span>
                      <span>{b.editorial}</span>
                    </div>
                  )}
                  {b?.isbn && (
                    <div className="font-mono text-[11px] text-stone-500">
                      <span>ISBN: </span>
                      <span>{b.isbn}</span>
                    </div>
                  )}
                  {b?.keywords && (
                    <div className="text-[11px] text-stone-500 pt-1 line-clamp-1">
                      <span className="font-medium">Palabras clave: </span>
                      <span>{b.keywords.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* View full details button */}
              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 text-[11px]">
                  {pub.periodLabel}
                </span>
                <button
                  onClick={() => onSelectEvent(pub)}
                  className="text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1"
                >
                  <span>Ver detalle completo</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
