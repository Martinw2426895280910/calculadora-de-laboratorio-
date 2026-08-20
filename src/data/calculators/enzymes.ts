import { FormulaDefinition } from '../../types/laboratory';

export const ENZYMES_CALCULATORS: FormulaDefinition[] = [
  {
    id: 'cociente_de_ritis_ast_alt',
    category: 'enzimas',
    name: 'Cociente de De Ritis (Relación AST/ALT)',
    shortName: 'Cociente AST/ALT (De Ritis)',
    formulaEquation: 'Cociente De Ritis = AST (GOT) [UI/L] / ALT (GPT) [UI/L]',
    formulaDisplay: 'Cociente AST/ALT = AST (UI/L) / ALT (UI/L)',
    description: 'Relación enzimática clásica descrita por Fernando De Ritis en 1957 para orientar el origen del daño hepático.',
    clinicalSignificance: 'Orientación diagnóstica:\n- AST/ALT > 2.0: Muy sugestivo de Hepatopatía Alcohólica (déficit de piridoxal-5-fosfato que disminuye la ALT y daño mitocondrial que libera AST), o Cirrosis establecida.\n- AST/ALT < 1.0: Típico de Daño Hepatocelular Agudo por Hepatitis Viral (A, B, C), Esteatosis Hepática No Alcohólica (NAFLD/NASH), o hepatitis autoinmune.\n- AST/ALT ≈ 1.0: Hepatitis crónica, isquemia hepática.',
    tags: ['de ritis', 'ast', 'alt', 'transaminasas', 'hepatitis', 'alcohol', 'higado'],
    inputs: [
      { id: 'ast', name: 'AST / GOT (Aspartato Aminotransferasa)', symbol: 'AST', unit: 'UI/L', defaultValue: 120, min: 1, max: 10000, step: 1 },
      { id: 'alt', name: 'ALT / GPT (Alanina Aminotransferasa)', symbol: 'ALT', unit: 'UI/L', defaultValue: 55, min: 1, max: 10000, step: 1 }
    ],
    calculate: (inputs) => {
      const ast = Number(inputs.ast);
      const alt = Number(inputs.alt);

      if (!ast || !alt || alt <= 0) {
        return { results: [], interpretation: 'Ingrese las concentraciones séricas de AST y ALT.' };
      }

      const ratio = Number((ast / alt).toFixed(2));

      let status: 'normal' | 'high' = 'normal';
      let label = '';
      let interp = '';

      if (ratio > 2.0) {
        status = 'high';
        label = 'AST/ALT > 2.0 (Sospecha Hepatopatía Alcohólica / Cirrosis)';
        interp = `Cociente de De Ritis elevado (${ratio} > 2.0). Sugiere fuertemente hepatitis alcohólica, cirrosis hepática avanzada o necrosis celular con daño mitocondrial severo. Correlacionar con GGT, VCM y bilirrubina.`;
      } else if (ratio < 1.0) {
        status = 'normal';
        label = 'AST/ALT < 1.0 (Patrón Hepatocelular / NAFLD / Viral)';
        interp = `Cociente de De Ritis < 1.0 (${ratio}). Predominio de ALT sobre AST, clásico en esteatosis hepática no alcohólica (hígado graso), hepatitis viral aguda o toxicidad medicamentosa leve.`;
      } else {
        status = 'normal';
        label = 'AST/ALT 1.0 - 2.0 (Zona Mixta / Hepatitis Crónica)';
        interp = `Cociente De Ritis en rango intermedio (${ratio}). Frecuente en hepatitis crónica o progresión hacia fibrosis.`;
      }

      return {
        results: [
          { id: 'de_ritis', name: 'Cociente de De Ritis (AST/ALT)', value: ratio, unit: 'ratio', referenceRange: '< 1.0 (Hígado Graso / Viral) | > 2.0 (Alcohólica)', status, statusLabel: label }
        ],
        interpretation: interp,
        steps: [`Cociente = ${ast} UI/L / ${alt} UI/L = ${ratio}`]
      };
    }
  },
  {
    id: 'fib4_score_fibrosis',
    category: 'enzimas',
    name: 'Índice de Fibrosis Hepática FIB-4 y Score APRI',
    shortName: 'FIB-4 & APRI (Fibrosis Hepática)',
    formulaEquation: 'FIB-4 = (Edad × AST) / [ Plaquetas (10^9/L) × √ALT ] | APRI = [ (AST / ULN) / Plaquetas ] × 100',
    formulaDisplay: 'FIB-4 = [ Edad (años) × AST (UI/L) ] / [ Plaquetas (×10⁹/L) × √ALT (UI/L) ]\nAPRI = [ ( AST / Límite Superior Normal de AST ) / Plaquetas (×10⁹/L) ] × 100',
    description: 'Scores no invasivos validados internacionalmente por la OMS y EASL para evaluar fibrosis y cirrosis en NAFLD, Hepatitis B y C.',
    clinicalSignificance: 'Puntos de corte FIB-4:\n- < 1.30 (< 2.0 en > 65 años): Alto valor predictivo negativo para descartar fibrosis avanzada (F0-F1).\n- 1.30 - 2.67: Zona gris o indeterminada.\n- > 2.67: Alto riesgo de fibrosis avanzada o cirrosis (F3-F4), requiere elastografía o biopsia.',
    tags: ['fib4', 'apri', 'fibrosis hepatica', 'cirrosis', 'esteatosis', 'plaquetas'],
    inputs: [
      { id: 'age', name: 'Edad del paciente', symbol: 'Edad', unit: 'años', defaultValue: 52, min: 18, max: 100, step: 1 },
      { id: 'ast', name: 'AST (GOT)', symbol: 'AST', unit: 'UI/L', defaultValue: 68, min: 5, max: 1000, step: 1 },
      { id: 'alt', name: 'ALT (GPT)', symbol: 'ALT', unit: 'UI/L', defaultValue: 72, min: 5, max: 1000, step: 1 },
      { id: 'platelets', name: 'Plaquetas', symbol: 'Plaquetas', unit: '×10⁹/L (o miles/µL)', defaultValue: 180, min: 10, max: 1000, step: 5 },
      { id: 'ast_uln', name: 'Límite Superior Normal de AST del laboratorio (ULN)', symbol: 'AST ULN', unit: 'UI/L', defaultValue: 40, min: 20, max: 60, step: 1 }
    ],
    calculate: (inputs) => {
      const age = Number(inputs.age);
      const ast = Number(inputs.ast);
      const alt = Number(inputs.alt);
      const plt = Number(inputs.platelets);
      const uln = Number(inputs.ast_uln) || 40;

      if (!age || !ast || !alt || !plt || alt <= 0 || plt <= 0) {
        return { results: [], interpretation: 'Complete todos los datos requeridos.' };
      }

      const fib4 = Number(((age * ast) / (plt * Math.sqrt(alt))).toFixed(2));
      const apri = Number((((ast / uln) / plt) * 100).toFixed(2));

      let fibStatus: 'normal' | 'low' | 'high' | 'critical-high' = 'normal';
      let fibLabel = '';
      let interp = '';

      if (fib4 < 1.30) {
        fibStatus = 'normal';
        fibLabel = 'Bajo Riesgo de Fibrosis Avanzada (< 1.30)';
        interp = `FIB-4 de ${fib4}: Descarta con alta seguridad (~90% VPN) fibrosis avanzada o cirrosis (estadios F0-F1).`;
      } else if (fib4 <= 2.67) {
        fibStatus = 'high';
        fibLabel = 'Riesgo Intermedio / Zona Gris (1.30 - 2.67)';
        interp = `FIB-4 de ${fib4}: Resultado indeterminado. Se recomienda realizar elastografía hepática (FibroScan) para mayor precisión.`;
      } else {
        fibStatus = 'critical-high';
        fibLabel = 'Alto Riesgo de Fibrosis Avanzada / Cirrosis (> 2.67)';
        interp = `FIB-4 de ${fib4}: Alto riesgo de fibrosis avanzada o cirrosis hepática (estadios F3-F4). Derivar a hepatología.`;
      }

      return {
        results: [
          { id: 'fib4', name: 'Índice FIB-4', value: fib4, unit: 'score', referenceRange: '< 1.30 (Bajo riesgo) | > 2.67 (Alto riesgo)', status: fibStatus, statusLabel: fibLabel },
          { id: 'apri', name: 'Índice APRI', value: apri, unit: 'score', referenceRange: '< 0.50 (Descarta cirrosis) | > 1.50 (Sugiere cirrosis)', status: apri > 1.5 ? 'critical-high' : apri > 0.5 ? 'high' : 'normal' }
        ],
        interpretation: interp,
        steps: [
          `FIB-4 = (${age} × ${ast}) / [ ${plt} × √${alt} ] = ${(age * ast).toFixed(0)} / ${(plt * Math.sqrt(alt)).toFixed(1)} = ${fib4}`,
          `APRI = [ (${ast} / ${uln}) / ${plt} ] × 100 = [ ${(ast/uln).toFixed(2)} / ${plt} ] × 100 = ${apri}`
        ]
      };
    }
  },
  {
    id: 'indice_ck_mb',
    category: 'enzimas',
    name: 'Índice Relativo CK-MB / Fracción Miocárdica',
    shortName: 'Índice Relativo CK-MB',
    formulaEquation: 'Índice CK-MB (%) = [ CK-MB (UI/L) / CK Total (UI/L) ] × 100',
    formulaDisplay: 'Índice Relativo CK-MB (%) = [ Actividad CK-MB (UI/L) / CK Total (UI/L) ] × 100',
    description: 'Diferencia el origen del aumento de la Creatina Kinasa entre daño muscular esquelético (rabdomiólisis, traumatismo) y daño miocárdico (isquemia/infarto).',
    clinicalSignificance: 'Índice CK-MB > 2.5 - 3.0% (hasta 5% según método) sugiere origen miocárdico si la CK total está elevada. En traumatismo o ejercicio extremo con rabdomiólisis la CK total es muy alta pero el índice relativo suele ser < 2.5%.',
    tags: ['ck-mb', 'ck total', 'infarto', 'rabdomiolisis', 'corazon', 'musculo'],
    inputs: [
      { id: 'ck_total', name: 'CK Total (Creatina Kinasa)', symbol: 'CK Total', unit: 'UI/L', defaultValue: 450, min: 20, max: 100000, step: 10 },
      { id: 'ck_mb', name: 'CK-MB (Fracción Masa o Actividad)', symbol: 'CK-MB', unit: 'UI/L (o ng/mL)', defaultValue: 28, min: 1, max: 2000, step: 1 }
    ],
    calculate: (inputs) => {
      const ckt = Number(inputs.ck_total);
      const ckmb = Number(inputs.ck_mb);

      if (!ckt || !ckmb || ckt <= 0) {
        return { results: [], interpretation: 'Ingrese CK Total y CK-MB.' };
      }

      const ratio = Number(((ckmb / ckt) * 100).toFixed(1));

      let status: 'normal' | 'high' | 'critical-high' = 'normal';
      let interp = '';

      if (ratio >= 3.0) {
        status = 'critical-high';
        interp = `Índice CK-MB elevado (${ratio}% ≥ 3.0%). Con CK Total elevada, orienta a lesión de miocardio (infarto agudo de miocardio, miocarditis). Correlacionar urgentemente con Troponina I/T ultrasensible y ECG.`;
      } else {
        status = 'normal';
        interp = `Índice CK-MB de ${ratio}% (< 3.0%). Sugiere que la elevación de CK proviene predominantemente de músculo esquelético (ejercicio extenuante, inyecciones intramusculares, traumatismo o miositis).`;
      }

      return {
        results: [
          { id: 'ckmb_index', name: 'Índice Relativo CK-MB', value: ratio, unit: '%', referenceRange: '< 3.0% (Músculo esquelético) | ≥ 3.0% (Miocárdico)', status, statusLabel: ratio >= 3.0 ? 'Sugiere Origen Cardíaco' : 'Sugiere Origen Esquelético' }
        ],
        interpretation: interp,
        steps: [`Índice = (${ckmb} / ${ckt}) × 100 = ${ratio}%`]
      };
    }
  }
];
