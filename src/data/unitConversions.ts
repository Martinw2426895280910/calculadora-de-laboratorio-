import { UnitConversionItem } from '../types/laboratory';

export const UNIT_CONVERSIONS: UnitConversionItem[] = [
  // Glucosa y Metabolismo
  {
    id: 'glucose',
    analyte: 'Glucosa (Glucemia)',
    category: 'Química Clínica',
    molecularWeight: 180.16,
    conventionalUnit: 'mg/dL',
    siUnit: 'mmol/L',
    factorConvToSI: 0.0555,
    formula: 'mg/dL × 0.0555 = mmol/L | mmol/L × 18.016 = mg/dL',
    notes: 'Valor normal en ayunas: 70 - 99 mg/dL (3.9 - 5.5 mmol/L)'
  },
  {
    id: 'hba1c',
    analyte: 'Hemoglobina Glicosilada (HbA1c)',
    category: 'Química Clínica / Hormonas',
    conventionalUnit: '% (NGSP)',
    siUnit: 'mmol/mol (IFCC)',
    factorConvToSI: 10.93, // Special formula: (HbA1c% - 2.15) * 10.929
    formula: '(HbA1c% - 2.15) × 10.929 = mmol/mol',
    notes: 'Normal: <5.7% (<39 mmol/mol), Prediabetes: 5.7-6.4%, Diabetes: ≥6.5%'
  },
  {
    id: 'urea',
    analyte: 'Urea',
    category: 'Química Clínica',
    molecularWeight: 60.06,
    conventionalUnit: 'mg/dL',
    siUnit: 'mmol/L',
    factorConvToSI: 0.1665,
    formula: 'mg/dL × 0.1665 = mmol/L | mmol/L × 6.006 = mg/dL',
    notes: 'Para convertir BUN a Urea: BUN × 2.14 = Urea (mg/dL)'
  },
  {
    id: 'bun',
    analyte: 'Nitrógeno Ureico en Sangre (BUN)',
    category: 'Química Clínica',
    molecularWeight: 28.01,
    conventionalUnit: 'mg/dL',
    siUnit: 'mmol/L',
    factorConvToSI: 0.357,
    formula: 'mg/dL × 0.357 = mmol/L | mmol/L × 2.80 = mg/dL',
    notes: 'BUN = Urea / 2.14'
  },
  {
    id: 'creatinine',
    analyte: 'Creatinina Sérica',
    category: 'Química Clínica',
    molecularWeight: 113.12,
    conventionalUnit: 'mg/dL',
    siUnit: 'µmol/L',
    factorConvToSI: 88.4,
    formula: 'mg/dL × 88.4 = µmol/L | µmol/L ÷ 88.4 = mg/dL',
    notes: 'Adultos: 0.6 - 1.2 mg/dL (53 - 106 µmol/L)'
  },
  {
    id: 'uric_acid',
    analyte: 'Ácido Úrico',
    category: 'Química Clínica',
    molecularWeight: 168.11,
    conventionalUnit: 'mg/dL',
    siUnit: 'µmol/L',
    factorConvToSI: 59.48,
    formula: 'mg/dL × 59.48 = µmol/L | µmol/L ÷ 59.48 = mg/dL',
    notes: 'Hombres: 3.4 - 7.0 mg/dL, Mujeres: 2.4 - 6.0 mg/dL'
  },
  {
    id: 'cholesterol_total',
    analyte: 'Colesterol Total',
    category: 'Lípidos',
    molecularWeight: 386.65,
    conventionalUnit: 'mg/dL',
    siUnit: 'mmol/L',
    factorConvToSI: 0.02586,
    formula: 'mg/dL × 0.02586 = mmol/L | mmol/L × 38.67 = mg/dL',
    notes: 'Deseable: <200 mg/dL (<5.18 mmol/L)'
  },
  {
    id: 'cholesterol_hdl',
    analyte: 'Colesterol HDL',
    category: 'Lípidos',
    molecularWeight: 386.65,
    conventionalUnit: 'mg/dL',
    siUnit: 'mmol/L',
    factorConvToSI: 0.02586,
    formula: 'mg/dL × 0.02586 = mmol/L | mmol/L × 38.67 = mg/dL',
    notes: 'Óptimo: >50 mg/dL mujeres, >40 mg/dL hombres'
  },
  {
    id: 'cholesterol_ldl',
    analyte: 'Colesterol LDL',
    category: 'Lípidos',
    molecularWeight: 386.65,
    conventionalUnit: 'mg/dL',
    siUnit: 'mmol/L',
    factorConvToSI: 0.02586,
    formula: 'mg/dL × 0.02586 = mmol/L | mmol/L × 38.67 = mg/dL',
    notes: 'Óptimo: <100 mg/dL (<2.59 mmol/L)'
  },
  {
    id: 'triglycerides',
    analyte: 'Triglicéridos',
    category: 'Lípidos',
    molecularWeight: 885.4,
    conventionalUnit: 'mg/dL',
    siUnit: 'mmol/L',
    factorConvToSI: 0.01129,
    formula: 'mg/dL × 0.01129 = mmol/L | mmol/L × 88.54 = mg/dL',
    notes: 'Normal: <150 mg/dL (<1.70 mmol/L)'
  },
  {
    id: 'bilirubin_total',
    analyte: 'Bilirrubina Total / Fraccionada',
    category: 'Química Clínica / Enzimas',
    molecularWeight: 584.66,
    conventionalUnit: 'mg/dL',
    siUnit: 'µmol/L',
    factorConvToSI: 17.1,
    formula: 'mg/dL × 17.1 = µmol/L | µmol/L ÷ 17.1 = mg/dL',
    notes: 'Total: 0.2 - 1.2 mg/dL (3.4 - 20.5 µmol/L)'
  },
  {
    id: 'calcium_total',
    analyte: 'Calcio Total',
    category: 'Electrolitos',
    molecularWeight: 40.08,
    conventionalUnit: 'mg/dL',
    siUnit: 'mmol/L',
    factorConvToSI: 0.2495,
    formula: 'mg/dL × 0.2495 = mmol/L | mmol/L × 4.008 = mg/dL (o mg/dL ÷ 2 = mEq/L)',
    notes: 'Normal: 8.5 - 10.5 mg/dL (2.12 - 2.62 mmol/L / 4.3 - 5.3 mEq/L)'
  },
  {
    id: 'calcium_ionic',
    analyte: 'Calcio Iónico (Libre)',
    category: 'Electrolitos',
    molecularWeight: 40.08,
    conventionalUnit: 'mg/dL',
    siUnit: 'mmol/L',
    factorConvToSI: 0.25,
    formula: 'mg/dL × 0.25 = mmol/L | mmol/L × 4.0 = mg/dL',
    notes: 'Normal: 4.5 - 5.3 mg/dL (1.12 - 1.32 mmol/L)'
  },
  {
    id: 'phosphorus',
    analyte: 'Fósforo Inorgánico (Fosfatos)',
    category: 'Electrolitos',
    molecularWeight: 30.97,
    conventionalUnit: 'mg/dL',
    siUnit: 'mmol/L',
    factorConvToSI: 0.3229,
    formula: 'mg/dL × 0.3229 = mmol/L | mmol/L × 3.097 = mg/dL',
    notes: 'Adultos: 2.5 - 4.5 mg/dL (0.81 - 1.45 mmol/L)'
  },
  {
    id: 'magnesium',
    analyte: 'Magnesio Sérico',
    category: 'Electrolitos',
    molecularWeight: 24.31,
    conventionalUnit: 'mg/dL',
    siUnit: 'mmol/L',
    factorConvToSI: 0.4114,
    formula: 'mg/dL × 0.4114 = mmol/L | mg/dL × 0.823 = mEq/L',
    notes: 'Normal: 1.7 - 2.4 mg/dL (0.7 - 1.0 mmol/L / 1.4 - 2.0 mEq/L)'
  },
  {
    id: 'sodium',
    analyte: 'Sodio (Na+)',
    category: 'Electrolitos',
    molecularWeight: 22.99,
    conventionalUnit: 'mEq/L',
    siUnit: 'mmol/L',
    factorConvToSI: 1.0,
    formula: '1 mEq/L = 1 mmol/L',
    notes: 'Normal: 135 - 145 mEq/L (mmol/L)'
  },
  {
    id: 'potassium',
    analyte: 'Potasio (K+)',
    category: 'Electrolitos',
    molecularWeight: 39.10,
    conventionalUnit: 'mEq/L',
    siUnit: 'mmol/L',
    factorConvToSI: 1.0,
    formula: '1 mEq/L = 1 mmol/L',
    notes: 'Normal: 3.5 - 5.1 mEq/L (mmol/L)'
  },
  {
    id: 'chloride',
    analyte: 'Cloro (Cl-)',
    category: 'Electrolitos',
    molecularWeight: 35.45,
    conventionalUnit: 'mEq/L',
    siUnit: 'mmol/L',
    factorConvToSI: 1.0,
    formula: '1 mEq/L = 1 mmol/L',
    notes: 'Normal: 96 - 106 mEq/L (mmol/L)'
  },
  {
    id: 'iron_serum',
    analyte: 'Hierro Sérico (Sideremia)',
    category: 'Hematología / Química',
    molecularWeight: 55.85,
    conventionalUnit: 'µg/dL',
    siUnit: 'µmol/L',
    factorConvToSI: 0.1791,
    formula: 'µg/dL × 0.1791 = µmol/L | µmol/L ÷ 0.1791 = µg/dL',
    notes: 'Hombres: 65 - 175 µg/dL, Mujeres: 50 - 170 µg/dL'
  },
  {
    id: 'ferritin',
    analyte: 'Ferritina Sérica',
    category: 'Hematología / Proteínas',
    conventionalUnit: 'ng/mL',
    siUnit: 'µg/L',
    factorConvToSI: 1.0,
    formula: '1 ng/mL = 1 µg/L = 1 pmol/L (× 2.247)',
    notes: 'Hombres: 30 - 400 ng/mL, Mujeres: 15 - 150 ng/mL'
  },
  {
    id: 'tsh',
    analyte: 'Hormona Tiroestimulante (TSH)',
    category: 'Hormonas',
    conventionalUnit: 'µUI/mL',
    siUnit: 'mUI/L',
    factorConvToSI: 1.0,
    formula: '1 µUI/mL = 1 mUI/L',
    notes: 'Normal adultos: 0.4 - 4.5 µUI/mL (mUI/L)'
  },
  {
    id: 'free_t4',
    analyte: 'Tiroxina Libre (T4 Libre)',
    category: 'Hormonas',
    molecularWeight: 776.87,
    conventionalUnit: 'ng/dL',
    siUnit: 'pmol/L',
    factorConvToSI: 12.87,
    formula: 'ng/dL × 12.87 = pmol/L | pmol/L ÷ 12.87 = ng/dL',
    notes: 'Normal: 0.8 - 1.8 ng/dL (10 - 23 pmol/L)'
  },
  {
    id: 'total_t4',
    analyte: 'Tiroxina Total (T4 Total)',
    category: 'Hormonas',
    molecularWeight: 776.87,
    conventionalUnit: 'µg/dL',
    siUnit: 'nmol/L',
    factorConvToSI: 12.87,
    formula: 'µg/dL × 12.87 = nmol/L | nmol/L ÷ 12.87 = µg/dL',
    notes: 'Normal: 4.5 - 12.0 µg/dL (58 - 154 nmol/L)'
  },
  {
    id: 'free_t3',
    analyte: 'Triyodotironina Libre (T3 Libre)',
    category: 'Hormonas',
    molecularWeight: 650.97,
    conventionalUnit: 'pg/mL',
    siUnit: 'pmol/L',
    factorConvToSI: 1.536,
    formula: 'pg/mL × 1.536 = pmol/L | pmol/L ÷ 1.536 = pg/mL',
    notes: 'Normal: 2.0 - 4.4 pg/mL (3.1 - 6.8 pmol/L)'
  },
  {
    id: 'cortisol_serum',
    analyte: 'Cortisol Sérico (Matutino)',
    category: 'Hormonas',
    molecularWeight: 362.46,
    conventionalUnit: 'µg/dL',
    siUnit: 'nmol/L',
    factorConvToSI: 27.59,
    formula: 'µg/dL × 27.59 = nmol/L | nmol/L ÷ 27.59 = µg/dL',
    notes: '8:00 AM: 6 - 23 µg/dL (165 - 635 nmol/L)'
  },
  {
    id: 'insulin',
    analyte: 'Insulina Basal en Ayunas',
    category: 'Hormonas',
    conventionalUnit: 'µUI/mL',
    siUnit: 'pmol/L',
    factorConvToSI: 6.945,
    formula: 'µUI/mL × 6.945 = pmol/L | pmol/L ÷ 6.945 = µUI/mL',
    notes: 'En ayunas: 2.6 - 24.9 µUI/mL (18 - 173 pmol/L)'
  },
  {
    id: 'psa_total',
    analyte: 'Antígeno Prostático Específico (PSA Total)',
    category: 'Marcadores Tumorales',
    conventionalUnit: 'ng/mL',
    siUnit: 'µg/L',
    factorConvToSI: 1.0,
    formula: '1 ng/mL = 1 µg/L',
    notes: '<4.0 ng/mL generalmente considerado normal según edad'
  },
  {
    id: 'cea',
    analyte: 'Antígeno Carcinoembrionario (CEA)',
    category: 'Marcadores Tumorales',
    conventionalUnit: 'ng/mL',
    siUnit: 'µg/L',
    factorConvToSI: 1.0,
    formula: '1 ng/mL = 1 µg/L',
    notes: 'No fumadores: <3.0 ng/mL, Fumadores: <5.0 ng/mL'
  },
  {
    id: 'afp',
    analyte: 'Alfa-fetoproteína (AFP)',
    category: 'Marcadores Tumorales',
    conventionalUnit: 'ng/mL',
    siUnit: 'UI/mL',
    factorConvToSI: 0.83,
    formula: 'ng/mL × 0.83 = UI/mL | 1 ng/mL = 1 µg/L',
    notes: 'Normal adultos: <8.5 ng/mL (<7.0 UI/mL)'
  },
  {
    id: 'proteins_total',
    analyte: 'Proteínas Totales',
    category: 'Proteínas',
    conventionalUnit: 'g/dL',
    siUnit: 'g/L',
    factorConvToSI: 10.0,
    formula: 'g/dL × 10 = g/L | g/L ÷ 10 = g/dL',
    notes: 'Normal: 6.4 - 8.3 g/dL (64 - 83 g/L)'
  },
  {
    id: 'albumin',
    analyte: 'Albúmina Sérica',
    category: 'Proteínas',
    molecularWeight: 66500,
    conventionalUnit: 'g/dL',
    siUnit: 'g/L',
    factorConvToSI: 10.0,
    formula: 'g/dL × 10 = g/L | g/dL × 150.4 = µmol/L',
    notes: 'Normal: 3.5 - 5.2 g/dL (35 - 52 g/L)'
  },
  {
    id: 'lactate',
    analyte: 'Ácido Láctico / Lactato Sérico',
    category: 'Gases Arteriales / Química',
    molecularWeight: 90.08,
    conventionalUnit: 'mg/dL',
    siUnit: 'mmol/L',
    factorConvToSI: 0.111,
    formula: 'mg/dL × 0.111 = mmol/L | mmol/L × 9.008 = mg/dL',
    notes: 'Normal en reposo: 4.5 - 19.8 mg/dL (0.5 - 2.2 mmol/L). Crítico: >4.0 mmol/L'
  },
  {
    id: 'fibrinogen',
    analyte: 'Fibrinógeno Plasmático',
    category: 'Coagulación',
    conventionalUnit: 'mg/dL',
    siUnit: 'g/L',
    factorConvToSI: 0.01,
    formula: 'mg/dL × 0.01 = g/L | g/L × 100 = mg/dL',
    notes: 'Normal: 200 - 400 mg/dL (2.0 - 4.0 g/L)'
  },
  {
    id: 'hemoglobin',
    analyte: 'Hemoglobina (Hb)',
    category: 'Hematología',
    conventionalUnit: 'g/dL',
    siUnit: 'g/L',
    factorConvToSI: 10.0,
    formula: 'g/dL × 10 = g/L | g/dL × 0.6206 = mmol/L',
    notes: 'Hombres: 13.8 - 17.2 g/dL, Mujeres: 12.1 - 15.1 g/dL'
  },
  {
    id: 'vitamin_d',
    analyte: 'Vitamina D (25-OH Vitamina D)',
    category: 'Hormonas / Vitaminas',
    molecularWeight: 400.6,
    conventionalUnit: 'ng/mL',
    siUnit: 'nmol/L',
    factorConvToSI: 2.496,
    formula: 'ng/mL × 2.496 = nmol/L | nmol/L ÷ 2.496 = ng/mL',
    notes: 'Suficiencia: 30 - 100 ng/mL (75 - 250 nmol/L)'
  },
  {
    id: 'vitamin_b12',
    analyte: 'Vitamina B12 (Cobalamina)',
    category: 'Hematología / Vitaminas',
    molecularWeight: 1355.4,
    conventionalUnit: 'pg/mL',
    siUnit: 'pmol/L',
    factorConvToSI: 0.738,
    formula: 'pg/mL × 0.738 = pmol/L | pmol/L ÷ 0.738 = pg/mL',
    notes: 'Normal: 200 - 900 pg/mL (148 - 664 pmol/L)'
  },
  {
    id: 'folate',
    analyte: 'Ácido Fólico Sérico',
    category: 'Hematología / Vitaminas',
    molecularWeight: 441.4,
    conventionalUnit: 'ng/mL',
    siUnit: 'nmol/L',
    factorConvToSI: 2.266,
    formula: 'ng/mL × 2.266 = nmol/L | nmol/L ÷ 2.266 = ng/mL',
    notes: 'Normal: >4.0 ng/mL (>9.1 nmol/L)'
  }
];
