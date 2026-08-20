export type LabCategory =
  | 'hematologia'
  | 'quimica_clinica'
  | 'hormonas'
  | 'orina'
  | 'gases_arteriales'
  | 'electrolitos'
  | 'enzimas'
  | 'lipidos'
  | 'proteinas'
  | 'marcadores_tumorales'
  | 'coagulacion'
  | 'inmunologia'
  | 'serologia'
  | 'microbiologia'
  | 'soluciones_qc';

export interface CategoryInfo {
  id: LabCategory;
  name: string;
  shortName: string;
  iconName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  count: number;
}

export interface CalculationInput {
  id: string;
  name: string;
  symbol: string;
  unit: string;
  options?: string[];
  defaultValue?: number | string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
  type?: 'number' | 'select' | 'radio';
}

export interface CalculationResult {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  referenceRange?: string;
  status?: 'low' | 'normal' | 'high' | 'critical-low' | 'critical-high' | 'info';
  statusLabel?: string;
  interpretation?: string;
  details?: string[];
}

export interface FormulaDefinition {
  id: string;
  category: LabCategory;
  name: string;
  shortName: string;
  formulaEquation: string;
  formulaDisplay: string;
  description: string;
  clinicalSignificance: string;
  inputs: CalculationInput[];
  calculate: (inputs: Record<string, any>) => {
    results: CalculationResult[];
    interpretation: string;
    warnings?: string[];
    steps?: string[];
  };
  references?: string[];
  tags: string[];
}

export interface ReferenceValueItem {
  id: string;
  analyte: string;
  category: string;
  sampleType: string;
  tubeColor?: string;
  conventionalRange: string;
  conventionalUnit?: string;
  siRange?: string;
  siUnit?: string;
  conversionFactor?: number;
  conversionFormula?: string;
  criticalValues?: string;
  criticalRange?: string;
  clinicalNotes?: string;
  clinicalSignificance?: string;
  fastingRequired?: boolean | string;
}

export interface UnitConversionItem {
  id: string;
  analyte: string;
  category: string;
  molecularWeight?: number;
  conventionalUnit: string;
  siUnit: string;
  factorToSI?: number;
  factorConvToSI?: number;
  formula?: string;
  description?: string;
  notes?: string;
}

export type UnitConversion = UnitConversionItem;

export interface SavedCalculation {
  id: string;
  formulaName: string;
  timestamp: string;
  inputsSummary?: Record<string, any>;
  results: CalculationResult[];
  interpretation?: string;
}

export interface PatientRecord {
  idNumber?: string;
  name?: string;
  age: number;
  gender: 'male' | 'female';
  weight?: number;
  height?: number;
  notes?: string;
}
