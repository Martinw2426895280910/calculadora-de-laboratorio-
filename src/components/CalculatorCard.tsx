import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  RotateCcw, 
  Copy, 
  Check, 
  PlusCircle, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  FileText,
  FlaskConical,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { FormulaDefinition, CalculationResult } from '../types/laboratory';

interface CalculatorCardProps {
  formula: FormulaDefinition;
  onAddToReport: (formulaName: string, results: CalculationResult[], interpretation: string, inputsSummary: Record<string, any>) => void;
  onFocusInput?: (inputId: string, inputName: string) => void;
  activeFocusedInput?: string;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  formula,
  onAddToReport,
  onFocusInput,
  activeFocusedInput
}) => {
  // Initialize input state with default values
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    formula.inputs.forEach(inp => {
      initial[inp.id] = inp.defaultValue !== undefined ? inp.defaultValue : '';
    });
    return initial;
  });

  const [showSignificance, setShowSignificance] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);

  // Recalculate whenever inputs change
  const calculation = formula.calculate(inputs);

  // Reset inputs when formula changes
  useEffect(() => {
    const initial: Record<string, any> = {};
    formula.inputs.forEach(inp => {
      initial[inp.id] = inp.defaultValue !== undefined ? inp.defaultValue : '';
    });
    setInputs(initial);
    setAdded(false);
  }, [formula.id]);

  const handleInputChange = (id: string, value: any) => {
    setInputs(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleReset = () => {
    const initial: Record<string, any> = {};
    formula.inputs.forEach(inp => {
      initial[inp.id] = inp.defaultValue !== undefined ? inp.defaultValue : '';
    });
    setInputs(initial);
  };

  const handleCopyResults = () => {
    if (!calculation.results.length) return;
    const text = `--- ${formula.name} ---\n` +
      calculation.results.map(r => `${r.name}: ${r.value} ${r.unit} [${r.referenceRange || 'Ref: N/A'}]`).join('\n') +
      `\n\nInterpretación Clínica:\n${calculation.interpretation}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToReport = () => {
    if (!calculation.results.length) return;
    onAddToReport(formula.name, calculation.results, calculation.interpretation, inputs);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const getStatusBadge = (status?: string, label?: string) => {
    switch (status) {
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" />
            {label || 'Normal'}
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3" />
            {label || 'Disminuido (Bajo)'}
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/40">
            <AlertTriangle className="w-3 h-3" />
            {label || 'Elevado (Alto)'}
          </span>
        );
      case 'critical-low':
      case 'critical-high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/25 text-rose-300 border border-rose-500/50 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            {label || '⚠️ Valor Crítico'}
          </span>
        );
      default:
        return label ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/40">
            {label}
          </span>
        ) : null;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-slate-100 transition-all">
      
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {formula.category.replace('_', ' ')}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {formula.name}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            {formula.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            id={`btn-reset-${formula.id}`}
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors"
            title="Restablecer valores por defecto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          
          <button
            id={`btn-copy-${formula.id}`}
            onClick={handleCopyResults}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>

          <button
            id={`btn-save-report-${formula.id}`}
            onClick={handleSaveToReport}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              added
                ? 'bg-emerald-600 text-white border border-emerald-400 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white border border-teal-400/50 shadow-teal-500/20'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{added ? '✓ Agregado al Informe' : '+ Al Informe'}</span>
          </button>
        </div>
      </div>

      {/* Formula Mathematical Formula Box */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 font-mono text-xs text-sky-300 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-slate-500 font-sans font-semibold">Fórmula:</span>
          <span className="font-bold text-sky-200">{formula.formulaEquation}</span>
        </div>
      </div>

      {/* Main Grid: Inputs Left, Live Results Right */}
      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Parámetros de Entrada
            </span>
            <span className="text-[11px] text-slate-500">
              {formula.inputs.length} variables
            </span>
          </div>

          <div className="space-y-3">
            {formula.inputs.map((inp) => {
              const isFocused = activeFocusedInput === inp.id;
              return (
                <div 
                  key={inp.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isFocused 
                      ? 'bg-slate-850 border-sky-500 shadow-sm ring-1 ring-sky-500/40' 
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <label 
                      htmlFor={`input-${formula.id}-${inp.id}`}
                      className="text-xs font-semibold text-slate-200 flex items-center gap-1.5"
                    >
                      <span>{inp.name}</span>
                      {inp.symbol && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-sky-400 border border-slate-700">
                          {inp.symbol}
                        </span>
                      )}
                    </label>
                    {inp.unit && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {inp.unit}
                      </span>
                    )}
                  </div>

                  {inp.type === 'select' ? (
                    <select
                      id={`input-${formula.id}-${inp.id}`}
                      value={inputs[inp.id]}
                      onChange={(e) => handleInputChange(inp.id, e.target.value)}
                      onFocus={() => onFocusInput && onFocusInput(inp.id, inp.name)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white rounded-lg px-3 py-2 text-xs sm:text-sm outline-none transition-colors"
                    >
                      {inp.options?.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-900 text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : inp.type === 'radio' ? (
                    <div className="flex items-center gap-4 pt-1">
                      {inp.options?.map((opt) => (
                        <label key={opt} className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer">
                          <input
                            type="radio"
                            name={`radio-${formula.id}-${inp.id}`}
                            value={opt}
                            checked={inputs[inp.id] === opt}
                            onChange={() => handleInputChange(inp.id, opt)}
                            className="accent-sky-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        id={`input-${formula.id}-${inp.id}`}
                        type="number"
                        step={inp.step || 'any'}
                        min={inp.min}
                        max={inp.max}
                        value={inputs[inp.id]}
                        onChange={(e) => handleInputChange(inp.id, e.target.value)}
                        onFocus={() => onFocusInput && onFocusInput(inp.id, inp.name)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white font-mono text-sm sm:text-base rounded-lg px-3 py-2 outline-none transition-colors"
                      />
                      {inp.min !== undefined && inp.max !== undefined && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 pointer-events-none">
                          Rango: {inp.min} - {inp.max}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Results & Clinical Interpretation */}
        <div className="lg:col-span-6 space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                Resultados Calculados
              </span>
              <span className="text-[11px] text-slate-500">
                En tiempo real
              </span>
            </div>

            {/* Results Cards */}
            {calculation.results.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-slate-500 text-xs">
                Ingrese los parámetros para visualizar los resultados
              </div>
            ) : (
              <div className="space-y-2.5">
                {calculation.results.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 shadow-md flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-300">
                          {res.name}
                        </h4>
                        {res.referenceRange && (
                          <span className="text-[11px] text-slate-400">
                            Valor de Referencia: <strong className="text-slate-300">{res.referenceRange}</strong>
                          </span>
                        )}
                      </div>
                      {getStatusBadge(res.status, res.statusLabel)}
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-sky-400">
                        {typeof res.value === 'number' ? res.value.toLocaleString() : res.value}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {res.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Clinical Diagnostic Interpretation Box */}
            {calculation.interpretation && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/30 text-xs space-y-1.5 shadow-inner">
                <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-[11px] uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5" />
                  <span>Interpretación Diagnóstica:</span>
                </div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-xs">
                  {calculation.interpretation}
                </p>
              </div>
            )}
          </div>

          {/* Mathematical Step-by-Step Breakdown Toggle */}
          {calculation.steps && calculation.steps.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="text-[11px] text-slate-400 hover:text-sky-300 font-semibold flex items-center justify-between w-full p-2 rounded-lg bg-slate-950/40 border border-slate-800/80 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-sky-400" />
                  <span>Desglose Matemático Paso a Paso</span>
                </span>
                {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showSteps && (
                <div className="mt-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-emerald-400/90 space-y-1 overflow-x-auto">
                  {calculation.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-slate-600 select-none">{idx + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Clinical Significance Collapsible Footer */}
      {formula.clinicalSignificance && (
        <div className="border-t border-slate-800/80 bg-slate-950/40 px-4 sm:px-5 py-2.5">
          <button
            onClick={() => setShowSignificance(!showSignificance)}
            className="text-xs text-slate-400 hover:text-slate-200 font-semibold flex items-center justify-between w-full transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Importancia Clínica y Perlas Diagnósticas</span>
            </span>
            {showSignificance ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showSignificance && (
            <div className="mt-2.5 text-xs text-slate-300 leading-relaxed whitespace-pre-line p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
              {formula.clinicalSignificance}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
