import React, { useState } from 'react';
import { 
  X, 
  Delete, 
  RotateCcw, 
  Copy, 
  Check, 
  ArrowDownLeft, 
  Calculator,
  Percent,
  Divide
} from 'lucide-react';

interface LabQuickKeypadProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertValue?: (val: number) => void;
  focusedInputName?: string;
}

export const LabQuickKeypad: React.FC<LabQuickKeypadProps> = ({
  isOpen,
  onClose,
  onInsertValue,
  focusedInputName
}) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    setDisplay(prev => {
      if (prev === '0' && digit !== '.') return digit;
      if (digit === '.' && prev.includes('.')) return prev;
      return prev + digit;
    });
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleDelete = () => {
    setDisplay(prev => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const handleCalculate = () => {
    try {
      const fullExpr = equation + display;
      // Sanitize equation for safe execution
      const sanitized = fullExpr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');
      
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      const formatted = Number(Number(result).toFixed(4)).toString();
      setEquation(fullExpr + ' =');
      setDisplay(formatted);
    } catch (err) {
      setDisplay('Error');
    }
  };

  const handleSqrt = () => {
    const num = parseFloat(display);
    if (num >= 0) {
      const res = Math.sqrt(num);
      setDisplay(Number(res.toFixed(4)).toString());
      setEquation(`√(${num})`);
    } else {
      setDisplay('Error');
    }
  };

  const handleInverse = () => {
    const num = parseFloat(display);
    if (num !== 0) {
      setDisplay(Number((1 / num).toFixed(4)).toString());
      setEquation(`1/(${num})`);
    } else {
      setDisplay('Error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    const val = parseFloat(display);
    if (!isNaN(val) && onInsertValue) {
      onInsertValue(val);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 sm:w-80 bg-slate-900 border border-sky-500/50 rounded-2xl shadow-2xl shadow-slate-950/80 overflow-hidden text-white backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
      
      {/* Top Header */}
      <div className="bg-slate-950 px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-200">Teclado de Laboratorio</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Screen / Display */}
      <div className="p-3.5 bg-slate-950/80 border-b border-slate-800/80">
        <div className="text-[11px] text-slate-400 font-mono h-4 overflow-hidden text-right">
          {equation}
        </div>
        <div className="text-2xl sm:text-3xl font-mono font-bold text-sky-300 text-right tracking-tight overflow-x-auto py-1">
          {display}
        </div>

        {/* Quick action bar */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-800/60 text-[11px]">
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>

          {onInsertValue && focusedInputName && (
            <button
              onClick={handleInsert}
              className="text-teal-300 hover:text-teal-200 font-semibold flex items-center gap-1 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30 transition-all hover:bg-teal-500/20"
            >
              <ArrowDownLeft className="w-3 h-3" />
              <span>Insertar en {focusedInputName}</span>
            </button>
          )}
        </div>
      </div>

      {/* Keypad Grid (Mirroring standard lab calculator layout) */}
      <div className="p-3 grid grid-cols-4 gap-1.5 bg-slate-900">
        {/* Row 1: Sci Functions */}
        <button
          onClick={handleClear}
          className="h-10 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-xs hover:bg-rose-500/30 transition-all"
        >
          C
        </button>
        <button
          onClick={handleDelete}
          className="h-10 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs hover:bg-slate-700 flex items-center justify-center transition-all"
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={handleSqrt}
          className="h-10 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs hover:bg-slate-700 transition-all"
        >
          √x
        </button>
        <button
          onClick={() => handleOperator('÷')}
          className="h-10 rounded-lg bg-sky-600/30 text-sky-300 border border-sky-500/40 font-bold text-sm hover:bg-sky-600/50 flex items-center justify-center transition-all"
        >
          <Divide className="w-4 h-4" />
        </button>

        {/* Row 2: 7 8 9 × */}
        <button
          onClick={() => handleDigit('7')}
          className="h-11 rounded-lg bg-slate-800/90 text-white border border-slate-700/80 font-bold text-base hover:bg-slate-700 hover:border-slate-600 transition-all"
        >
          7
        </button>
        <button
          onClick={() => handleDigit('8')}
          className="h-11 rounded-lg bg-slate-800/90 text-white border border-slate-700/80 font-bold text-base hover:bg-slate-700 hover:border-slate-600 transition-all"
        >
          8
        </button>
        <button
          onClick={() => handleDigit('9')}
          className="h-11 rounded-lg bg-slate-800/90 text-white border border-slate-700/80 font-bold text-base hover:bg-slate-700 hover:border-slate-600 transition-all"
        >
          9
        </button>
        <button
          onClick={() => handleOperator('×')}
          className="h-11 rounded-lg bg-sky-600/30 text-sky-300 border border-sky-500/40 font-bold text-base hover:bg-sky-600/50 transition-all"
        >
          ×
        </button>

        {/* Row 3: 4 5 6 - */}
        <button
          onClick={() => handleDigit('4')}
          className="h-11 rounded-lg bg-slate-800/90 text-white border border-slate-700/80 font-bold text-base hover:bg-slate-700 hover:border-slate-600 transition-all"
        >
          4
        </button>
        <button
          onClick={() => handleDigit('5')}
          className="h-11 rounded-lg bg-slate-800/90 text-white border border-slate-700/80 font-bold text-base hover:bg-slate-700 hover:border-slate-600 transition-all"
        >
          5
        </button>
        <button
          onClick={() => handleDigit('6')}
          className="h-11 rounded-lg bg-slate-800/90 text-white border border-slate-700/80 font-bold text-base hover:bg-slate-700 hover:border-slate-600 transition-all"
        >
          6
        </button>
        <button
          onClick={() => handleOperator('−')}
          className="h-11 rounded-lg bg-sky-600/30 text-sky-300 border border-sky-500/40 font-bold text-base hover:bg-sky-600/50 transition-all"
        >
          −
        </button>

        {/* Row 4: 1 2 3 + */}
        <button
          onClick={() => handleDigit('1')}
          className="h-11 rounded-lg bg-slate-800/90 text-white border border-slate-700/80 font-bold text-base hover:bg-slate-700 hover:border-slate-600 transition-all"
        >
          1
        </button>
        <button
          onClick={() => handleDigit('2')}
          className="h-11 rounded-lg bg-slate-800/90 text-white border border-slate-700/80 font-bold text-base hover:bg-slate-700 hover:border-slate-600 transition-all"
        >
          2
        </button>
        <button
          onClick={() => handleDigit('3')}
          className="h-11 rounded-lg bg-slate-800/90 text-white border border-slate-700/80 font-bold text-base hover:bg-slate-700 hover:border-slate-600 transition-all"
        >
          3
        </button>
        <button
          onClick={() => handleOperator('+')}
          className="h-11 rounded-lg bg-sky-600/30 text-sky-300 border border-sky-500/40 font-bold text-base hover:bg-sky-600/50 transition-all"
        >
          +
        </button>

        {/* Row 5: 0 . = (Green button as in reference) */}
        <button
          onClick={() => handleDigit('0')}
          className="h-11 rounded-lg bg-slate-800/90 text-white border border-slate-700/80 font-bold text-base hover:bg-slate-700 hover:border-slate-600 transition-all col-span-1"
        >
          0
        </button>
        <button
          onClick={() => handleDigit('.')}
          className="h-11 rounded-lg bg-slate-800/90 text-white border border-slate-700/80 font-bold text-base hover:bg-slate-700 hover:border-slate-600 transition-all"
        >
          .
        </button>
        <button
          onClick={handleInverse}
          className="h-11 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs hover:bg-slate-700 transition-all"
        >
          1/x
        </button>
        <button
          id="btn-keypad-equals"
          onClick={handleCalculate}
          className="h-11 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-lg border border-emerald-300 shadow-md shadow-emerald-500/30 transition-all flex items-center justify-center"
        >
          =
        </button>
      </div>
    </div>
  );
};
