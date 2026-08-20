import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Search, 
  RotateCcw, 
  Copy, 
  Check, 
  FlaskConical, 
  Info,
  Sliders
} from 'lucide-react';
import { UNIT_CONVERSIONS } from '../data/unitConversions';
import { UnitConversion, UnitConversionItem } from '../types/laboratory';

export const UnitConverterView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<UnitConversion>(UNIT_CONVERSIONS[0]);
  
  const getFactor = (item: UnitConversionItem) => item.factorToSI || item.factorConvToSI || 1;

  const [convValue, setConvValue] = useState<number>(100);
  const [siValue, setSiValue] = useState<number>(() => {
    const factor = UNIT_CONVERSIONS[0].factorToSI || UNIT_CONVERSIONS[0].factorConvToSI || 1;
    return Number((100 * factor).toFixed(3));
  });

  const [copied, setCopied] = useState(false);

  // Filter conversions
  const filtered = UNIT_CONVERSIONS.filter(item => {
    const matchesSearch = 
      item.analyte.toLowerCase().includes(search.toLowerCase()) ||
      item.conventionalUnit.toLowerCase().includes(search.toLowerCase()) ||
      item.siUnit.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSelectAnalyte = (item: UnitConversion) => {
    setSelectedItem(item);
    const factor = getFactor(item);
    // Set a sensible default value
    const defaultVal = item.category === 'electrolitos' ? 140 : item.category === 'quimica' ? 100 : 20;
    setConvValue(defaultVal);
    setSiValue(Number((defaultVal * factor).toFixed(3)));
  };

  const handleConvChange = (val: number) => {
    setConvValue(val);
    const factor = getFactor(selectedItem);
    setSiValue(Number((val * factor).toFixed(4)));
  };

  const handleSiChange = (val: number) => {
    setSiValue(val);
    const factor = getFactor(selectedItem);
    setConvValue(Number((val / factor).toFixed(4)));
  };

  const handleCopy = () => {
    const factor = getFactor(selectedItem);
    const text = `${selectedItem.analyte}: ${convValue} ${selectedItem.conventionalUnit} = ${siValue} ${selectedItem.siUnit} (Factor SI: ×${factor})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'quimica', name: 'Química Clínica' },
    { id: 'lipidos', name: 'Lípidos' },
    { id: 'electrolitos', name: 'Electrolitos' },
    { id: 'hormonas', name: 'Hormonas' },
    { id: 'hematologia', name: 'Hematología' }
  ];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Conversor Universal de Unidades Bioquímicas
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Conversión bidireccional exacta entre Unidades Convencionales y el Sistema Internacional (SI) basada en pesos moleculares oficiales de la IUPAC y la IFCC.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copiado al Portapapeles' : 'Copiar Conversión'}</span>
            </button>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 border border-teal-400'
                  : 'bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Converter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Conversion Card */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Analito Seleccionado
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {selectedItem.analyte}
              </h3>
            </div>
            {selectedItem.molecularWeight && (
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                PM: {selectedItem.molecularWeight} g/mol
              </span>
            )}
          </div>

          {/* Dual Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            
            {/* Conventional Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Unidad Convencional
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={convValue}
                  onChange={(e) => handleConvChange(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white font-mono text-xl sm:text-2xl font-bold rounded-lg px-3 py-2.5 outline-none transition-colors"
                />
              </div>
              <span className="text-xs font-semibold text-teal-300 block">
                {selectedItem.conventionalUnit}
              </span>
            </div>

            {/* SI Unit Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-teal-500/40 space-y-2 ring-1 ring-teal-500/20">
              <label className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                Sistema Internacional (SI)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={siValue}
                  onChange={(e) => handleSiChange(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-teal-600 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-teal-300 font-mono text-xl sm:text-2xl font-bold rounded-lg px-3 py-2.5 outline-none transition-colors"
                />
              </div>
              <span className="text-xs font-semibold text-teal-300 block">
                {selectedItem.siUnit}
              </span>
            </div>
          </div>

          {/* Mathematical Factor Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono">
            <div className="flex items-center gap-2 text-teal-400 font-bold font-sans">
              <Info className="w-4 h-4" />
              <span>Factor de Conversión Metrológico:</span>
            </div>
            <div className="text-slate-300">
              • Convencional → SI: Multiplicar por <strong className="text-teal-300">{getFactor(selectedItem)}</strong>
            </div>
            <div className="text-slate-300">
              • SI → Convencional: Dividir por <strong className="text-teal-300">{getFactor(selectedItem)}</strong> (o multiplicar por {(1 / getFactor(selectedItem)).toFixed(4)})
            </div>
            {selectedItem.description && (
              <div className="pt-2 border-t border-slate-800/80 font-sans text-slate-400">
                {selectedItem.description}
              </div>
            )}
          </div>
        </div>

        {/* Right: Searchable List of All Analytes */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar analito (ej. Glucosa, Creatinina, Colesterol)..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 text-xs rounded-xl pl-9 pr-4 py-2 text-white outline-none"
            />
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Catálogo de Analitos ({filtered.length})
          </div>

          <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {filtered.map(item => {
              const isSelected = selectedItem.id === item.id;
              const factor = getFactor(item);
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectAnalyte(item)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-500/15 border-teal-500 text-white font-bold ring-1 ring-teal-500/30'
                      : 'bg-slate-950/40 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">{item.analyte}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {item.conventionalUnit} ⇄ {item.siUnit}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-teal-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    ×{factor}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
