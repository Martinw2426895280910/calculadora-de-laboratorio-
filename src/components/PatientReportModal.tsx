import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Trash2, 
  FileText, 
  Download, 
  User, 
  Calendar, 
  Sparkles,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { PatientRecord, SavedCalculation } from '../types/laboratory';

interface PatientReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientRecord;
  setPatient: React.Dispatch<React.SetStateAction<PatientRecord>>;
  savedCalculations: SavedCalculation[];
  onRemoveCalculation: (id: string) => void;
  onClearAll: () => void;
}

export const PatientReportModal: React.FC<PatientReportModalProps> = ({
  isOpen,
  onClose,
  patient,
  setPatient,
  savedCalculations,
  onRemoveCalculation,
  onClearAll
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let report = `======================================================\n`;
    report += `INFORME DE LABORATORIO CLÍNICO & BIOQUÍMICA MÉDICA\n`;
    report += `Calculadora de Dr Martin W.\n`;
    report += `======================================================\n`;
    report += `Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    report += `Paciente: ${patient.name || 'No especificado'}\n`;
    report += `Edad: ${patient.age || 'N/A'} años | Sexo: ${patient.gender === 'male' ? 'Masculino' : 'Femenino'} | ID/Historia: ${patient.idNumber || 'N/A'}\n`;
    report += `Peso: ${patient.weight || 'N/A'} kg | Talla: ${patient.height || 'N/A'} cm\n`;
    report += `------------------------------------------------------\n\n`;

    savedCalculations.forEach((calc, idx) => {
      report += `[${idx + 1}] ${calc.formulaName.toUpperCase()}\n`;
      report += `Hora: ${calc.timestamp}\n`;
      report += `Resultados:\n`;
      calc.results.forEach(r => {
        report += `  • ${r.name}: ${r.value} ${r.unit} (Ref: ${r.referenceRange || 'N/A'})\n`;
      });
      if (calc.interpretation) {
        report += `Interpretación Clínica:\n  ${calc.interpretation}\n`;
      }
      report += `\n------------------------------------------------------\n\n`;
    });

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Informe Analítico de Laboratorio Clínico
              </h3>
              <p className="text-xs text-slate-400">
                Calculadora de Dr Martin W. • {savedCalculations.length} cálculos registrados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar Texto'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-900">
          
          {/* Patient Data Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-400" />
                Datos del Paciente
              </span>
              <span className="text-[11px] text-slate-500">
                Modifique los campos si desea personalizar el informe
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={patient.name}
                  onChange={(e) => setPatient(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">ID / Historia Clínica</label>
                <input
                  type="text"
                  value={patient.idNumber}
                  onChange={(e) => setPatient(prev => ({ ...prev, idNumber: e.target.value }))}
                  placeholder="Ej. HC-94820"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Edad (años)</label>
                <input
                  type="number"
                  value={patient.age}
                  onChange={(e) => setPatient(prev => ({ ...prev, age: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Sexo</label>
                <select
                  value={patient.gender}
                  onChange={(e) => setPatient(prev => ({ ...prev, gender: e.target.value as any }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                >
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>
            </div>
          </div>

          {/* Saved Calculations List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Determinaciones y Cálculos Registrados ({savedCalculations.length})
              </h4>
              {savedCalculations.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vaciar Informe</span>
                </button>
              )}
            </div>

            {savedCalculations.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                No hay cálculos guardados todavía. En cualquier calculadora, haga clic en el botón <strong className="text-teal-400">+ Al Informe</strong> para añadir sus resultados aquí.
              </div>
            ) : (
              <div className="space-y-3">
                {savedCalculations.map((calc, idx) => (
                  <div
                    key={calc.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h5 className="text-sm font-bold text-white">
                          {calc.formulaName}
                        </h5>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {calc.timestamp}
                        </span>
                        <button
                          onClick={() => onRemoveCalculation(calc.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Eliminar de informe"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Results Table */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {calc.results.map((res) => (
                        <div key={res.id} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
                          <div>
                            <span className="text-slate-300 font-semibold block">{res.name}</span>
                            {res.referenceRange && (
                              <span className="text-[10px] text-slate-500">Ref: {res.referenceRange}</span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold font-mono text-sky-400">
                              {typeof res.value === 'number' ? res.value.toLocaleString() : res.value}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 ml-1">
                              {res.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Interpretation */}
                    {calc.interpretation && (
                      <div className="p-2.5 rounded-lg bg-slate-900 text-xs text-slate-300 border border-slate-800 leading-relaxed whitespace-pre-line">
                        <strong className="text-teal-400 text-[11px] uppercase tracking-wider block mb-1">
                          Interpretación Clínica:
                        </strong>
                        {calc.interpretation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Software de Laboratorio Clínico y Bioquímica Médica</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
