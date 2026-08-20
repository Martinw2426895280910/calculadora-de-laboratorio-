import React from 'react';
import { 
  FlaskConical, 
  Search, 
  FileText, 
  Calculator, 
  BookOpen, 
  ArrowLeftRight, 
  Activity, 
  User, 
  ShieldCheck,
  Printer
} from 'lucide-react';
import { PatientRecord } from '../types/laboratory';

interface HeaderProps {
  activeTab: 'calculators' | 'converter' | 'reference' | 'interpreter' | 'report';
  setActiveTab: (tab: 'calculators' | 'converter' | 'reference' | 'interpreter' | 'report') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  patient: PatientRecord;
  onOpenPatientModal: () => void;
  onToggleKeypad: () => void;
  isKeypadOpen: boolean;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  patient,
  onOpenPatientModal,
  onToggleKeypad,
  isKeypadOpen,
  savedCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div 
              onClick={() => setActiveTab('calculators')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-400 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-sky-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                    <span>Calculadora de Dr Martin W.</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      BIOQUÍMICA PRO
                    </span>
                  </h1>
                </div>
                <p className="text-[11px] text-slate-400">
                  Laboratorio Clínico & Análisis Diagnóstico
                </p>
              </div>
            </div>

            {/* Mobile Keypad & Patient Buttons */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                id="btn-mobile-keypad"
                onClick={onToggleKeypad}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                  isKeypadOpen 
                    ? 'bg-sky-500 text-white border-sky-400' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Teclado Numérico"
              >
                <Calculator className="w-4 h-4" />
              </button>
              
              <button
                id="btn-mobile-patient"
                onClick={onOpenPatientModal}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 relative text-xs flex items-center"
                title="Informe del Paciente"
              >
                <User className="w-4 h-4" />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full md:max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar fórmulas (ej. VCM, CKD-EPI, Anion Gap, LDL, HOMA, FENa)..."
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-200 text-xs sm:text-sm rounded-lg pl-9 pr-8 py-2 outline-none transition-all placeholder:text-slate-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Tools & Patient Summary */}
          <div className="hidden md:flex items-center gap-2">
            <button
              id="btn-quick-keypad-toggle"
              onClick={onToggleKeypad}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm ${
                isKeypadOpen 
                  ? 'bg-sky-600 text-white border-sky-400 shadow-sky-500/20' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Teclado Numérico</span>
            </button>

            <button
              id="btn-patient-report-open"
              onClick={onOpenPatientModal}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-2 transition-all relative"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Informe ({savedCount})</span>
              {savedCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Mirroring reference utilities) */}
        <div className="flex items-center gap-1 sm:gap-2 mt-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
          <button
            id="nav-tab-calculators"
            onClick={() => setActiveTab('calculators')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'calculators'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 border border-sky-400'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Fórmulas de Cálculo</span>
          </button>

          <button
            id="nav-tab-interpreter"
            onClick={() => setActiveTab('interpreter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'interpreter'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-300" />
            <span>Interpretar Resultados</span>
          </button>

          <button
            id="nav-tab-converter"
            onClick={() => setActiveTab('converter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'converter'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 border border-teal-400'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-teal-300" />
            <span>Conversor de Unidades</span>
          </button>

          <button
            id="nav-tab-reference"
            onClick={() => setActiveTab('reference')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'reference'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 border border-amber-400'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Normas y Valores de Referencia</span>
          </button>

          <button
            id="nav-tab-report"
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'report'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 border border-rose-400'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-rose-300" />
            <span>Generar Informe ({savedCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
