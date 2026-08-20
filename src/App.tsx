import React, { useState } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  KeypadSelector 
} from './components/KeypadSelector';
import { 
  CalculatorCard 
} from './components/CalculatorCard';
import { 
  LabQuickKeypad 
} from './components/LabQuickKeypad';
import { 
  UnitConverterView 
} from './components/UnitConverterView';
import { 
  ReferenceValuesView 
} from './components/ReferenceValuesView';
import { 
  ClinicalInterpreterView 
} from './components/ClinicalInterpreterView';
import { 
  PatientReportModal 
} from './components/PatientReportModal';
import { 
  ALL_CALCULATORS, 
  getCalculatorsByCategory, 
  searchCalculators 
} from './data/calculatorsConfig';
import { 
  LabCategory, 
  PatientRecord, 
  SavedCalculation, 
  CalculationResult 
} from './types/laboratory';
import { 
  FlaskConical, 
  Search, 
  Sparkles, 
  HelpCircle, 
  FileSpreadsheet, 
  Layers, 
  Calculator,
  ExternalLink,
  Info
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'calculators' | 'converter' | 'reference' | 'interpreter' | 'report'>('calculators');
  const [selectedCategory, setSelectedCategory] = useState<LabCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Patient and saved calculations state
  const [patient, setPatient] = useState<PatientRecord>({
    idNumber: 'HC-10029',
    name: 'Paciente de Muestra',
    age: 48,
    gender: 'male',
    weight: 72,
    height: 172
  });

  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const [focusedInputInfo, setFocusedInputInfo] = useState<{ id: string; name: string } | null>(null);

  // Filter calculators according to category or search
  const visibleCalculators = searchQuery.trim()
    ? searchCalculators(searchQuery)
    : selectedCategory === 'all'
    ? ALL_CALCULATORS
    : getCalculatorsByCategory(selectedCategory);

  const handleAddToReport = (
    formulaName: string, 
    results: CalculationResult[], 
    interpretation: string, 
    inputsSummary: Record<string, any>
  ) => {
    const newCalc: SavedCalculation = {
      id: 'calc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      formulaName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inputsSummary,
      results,
      interpretation
    };

    setSavedCalculations(prev => [newCalc, ...prev]);
  };

  const handleRemoveCalculation = (id: string) => {
    setSavedCalculations(prev => prev.filter(c => c.id !== id));
  };

  const handleClearAllCalculations = () => {
    setSavedCalculations([]);
  };

  const handleSelectCategory = (cat: LabCategory | 'all') => {
    setSelectedCategory(cat);
    setSearchQuery('');
    setActiveTab('calculators');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* Main App Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        patient={patient}
        onOpenPatientModal={() => setIsReportOpen(true)}
        onToggleKeypad={() => setIsKeypadOpen(!isKeypadOpen)}
        isKeypadOpen={isKeypadOpen}
        savedCount={savedCalculations.length}
      />

      {/* Main Workspace View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* TAB 1: Calculators & Laboratory Formulas */}
        {activeTab === 'calculators' && (
          <div className="space-y-6">
            
            {/* The 15 Category Keypad from the uploaded device reference */}
            <KeypadSelector
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* Results Title and Counter */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  {searchQuery 
                    ? `Resultados de Búsqueda: "${searchQuery}" (${visibleCalculators.length})` 
                    : selectedCategory === 'all' 
                    ? `Todas las Fórmulas Bioquímicas (${visibleCalculators.length})` 
                    : `Fórmulas de ${selectedCategory.replace('_', ' ').toUpperCase()} (${visibleCalculators.length})`
                  }
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Cálculo instantáneo validado
              </span>
            </div>

            {/* List of Formula Calculators */}
            {visibleCalculators.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <Search className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-300">No se encontraron fórmulas</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Pruebe con otros términos de búsqueda como "VCM", "CKD-EPI", "Anion Gap", "LDL", "HOMA", "De Ritis" o seleccione una especialidad en el teclado.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition-colors"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {visibleCalculators.map((formula) => (
                  <CalculatorCard
                    key={formula.id}
                    formula={formula}
                    onAddToReport={handleAddToReport}
                    onFocusInput={(id, name) => setFocusedInputInfo({ id, name })}
                    activeFocusedInput={focusedInputInfo?.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Multi-system Clinical Interpreter */}
        {activeTab === 'interpreter' && (
          <ClinicalInterpreterView
            patient={patient}
            onAddToReport={handleAddToReport}
          />
        )}

        {/* TAB 3: Biochemical Unit Converter */}
        {activeTab === 'converter' && (
          <UnitConverterView />
        )}

        {/* TAB 4: Reference Values & Norms */}
        {activeTab === 'reference' && (
          <ReferenceValuesView />
        )}

        {/* TAB 5: Patient Report View */}
        {activeTab === 'report' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Generador de Informes de Laboratorio
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Revise los cálculos acumulados, edite datos del paciente e imprima en formato oficial de laboratorio clínico.
                </p>
              </div>
              <button
                onClick={() => setIsReportOpen(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/20 transition-all"
              >
                Abrir Modal de Informe
              </button>
            </div>
            
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <PatientReportModal
                isOpen={true}
                onClose={() => setActiveTab('calculators')}
                patient={patient}
                setPatient={setPatient}
                savedCalculations={savedCalculations}
                onRemoveCalculation={handleRemoveCalculation}
                onClearAll={handleClearAllCalculations}
              />
            </div>
          </div>
        )}

      </main>

      {/* Floating Scientific Lab Quick Keypad (mirroring reference image) */}
      <LabQuickKeypad
        isOpen={isKeypadOpen}
        onClose={() => setIsKeypadOpen(false)}
        focusedInputName={focusedInputInfo?.name}
      />

      {/* Patient Report Modal */}
      <PatientReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        patient={patient}
        setPatient={setPatient}
        savedCalculations={savedCalculations}
        onRemoveCalculation={handleRemoveCalculation}
        onClearAll={handleClearAllCalculations}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-850 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-400">Calculadora de Laboratorio Bioquímico Clínico</span>
          </div>
          <span>
            Basado en ecuaciones estandarizadas (KDIGO, IFCC, OMS, CLSI, Sampson NIH, Friedewald, CKD-EPI 2021)
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
