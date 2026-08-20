import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  AlertTriangle, 
  Info, 
  Clock, 
  Pipette, 
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { REFERENCE_VALUES } from '../data/referenceValues';
import { ReferenceValueItem } from '../types/laboratory';

export const ReferenceValuesView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSample, setSelectedSample] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'Todas las Especialidades' },
    { id: 'hematologia', name: 'Hematología' },
    { id: 'quimica', name: 'Química Clínica' },
    { id: 'lipidos', name: 'Lípidos' },
    { id: 'electrolitos', name: 'Electrolitos' },
    { id: 'gases', name: 'Gases Arteriales' },
    { id: 'orina', name: 'Orina' },
    { id: 'hormonas', name: 'Hormonas' },
    { id: 'coagulacion', name: 'Coagulación' },
    { id: 'enzimas', name: 'Enzimas Hepáticas' }
  ];

  const filtered = REFERENCE_VALUES.filter(item => {
    const matchesSearch = 
      item.analyte.toLowerCase().includes(search.toLowerCase()) ||
      item.conventionalRange.toLowerCase().includes(search.toLowerCase()) ||
      (item.siRange && item.siRange.toLowerCase().includes(search.toLowerCase())) ||
      (item.clinicalSignificance && item.clinicalSignificance.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSample = selectedSample === 'all' || item.sampleType.toLowerCase().includes(selectedSample.toLowerCase());

    return matchesSearch && matchesCat && matchesSample;
  });

  const getTubeBadge = (tube?: string) => {
    if (!tube) return null;
    let colorClass = 'bg-slate-800 text-slate-300 border-slate-700';
    if (tube.includes('Lila') || tube.includes('EDTA')) {
      colorClass = 'bg-purple-900/40 text-purple-300 border-purple-700/50';
    } else if (tube.includes('Rojo') || tube.includes('Amarillo') || tube.includes('Suero')) {
      colorClass = 'bg-red-900/40 text-red-300 border-red-700/50';
    } else if (tube.includes('Celeste') || tube.includes('Citrato')) {
      colorClass = 'bg-sky-900/40 text-sky-300 border-sky-700/50';
    } else if (tube.includes('Verde') || tube.includes('Heparina')) {
      colorClass = 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50';
    } else if (tube.includes('Gris') || tube.includes('Fluoruro')) {
      colorClass = 'bg-gray-800 text-gray-300 border-gray-600';
    }

    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${colorClass}`}>
        <Pipette className="w-3 h-3" />
        {tube}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Valores de Referencia e Intervalos Biológicos
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Compendio metrológico de intervalos biológicos de referencia para adultos sanos, condiciones preanalíticas de toma de muestra y valores de alarma crítica (Panic Values).
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-5">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por analito, rango o patología..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs rounded-xl pl-9 pr-4 py-2.5 text-white outline-none"
            />
          </div>

          <div className="sm:col-span-6">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs rounded-xl px-3 py-2.5 text-white outline-none"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Database Table / Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold uppercase tracking-wider">
          <span>Resultados ({filtered.length} analitos)</span>
          <span>Click en cualquier fila para expandir detalles</span>
        </div>

        <div className="space-y-2.5">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md transition-all hover:border-slate-700"
              >
                {/* Main Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-850/60"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">
                        {item.analyte}
                      </h4>
                      {getTubeBadge(item.tubeColor)}
                      {item.fastingRequired && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          {item.fastingRequired}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 block">
                      Muestra: <strong className="text-slate-300">{item.sampleType}</strong>
                    </span>
                  </div>

                  {/* Ranges Preview */}
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-amber-300 block">
                        {item.conventionalRange}
                      </span>
                      {item.siRange && (
                        <span className="text-[11px] font-mono text-teal-400 block">
                          SI: {item.siRange}
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 bg-slate-950/70 border-t border-slate-800/80 space-y-3 text-xs">
                    
                    {/* Critical Panic Range */}
                    {item.criticalRange && (
                      <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold uppercase tracking-wider block text-[11px]">
                            Valores de Alarma / Pánico Crítico:
                          </strong>
                          <span>{item.criticalRange}</span>
                        </div>
                      </div>
                    )}

                    {/* Clinical Significance */}
                    {item.clinicalSignificance && (
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 space-y-1">
                        <div className="flex items-center gap-1.5 text-sky-400 font-bold uppercase tracking-wider text-[11px]">
                          <Info className="w-3.5 h-3.5" />
                          <span>Relevancia Clínica y Patologías:</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-line text-slate-300">
                          {item.clinicalSignificance}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
