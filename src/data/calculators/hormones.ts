import { FormulaDefinition } from '../../types/laboratory';

export const HORMONE_CALCULATORS: FormulaDefinition[] = [
  {
    id: 'homa_ir',
    category: 'hormonas',
    name: 'Índice HOMA-IR (Evaluación de Resistencia a la Insulina)',
    shortName: 'HOMA-IR',
    formulaEquation: 'HOMA-IR = [ Glucosa en ayunas (mg/dL) × Insulina en ayunas (µUI/mL) ] / 405',
    formulaDisplay: 'HOMA-IR = [ Glucosa (mg/dL) × Insulina (µUI/mL) ] / 405\n*Si glucosa está en mmol/L: [ Glucosa (mmol/L) × Insulina (µUI/mL) ] / 22.5',
    description: 'Homeostatic Model Assessment of Insulin Resistance. Evalúa el grado de resistencia insulínica periférica a partir de muestras basales en ayunas.',
    clinicalSignificance: 'HOMA-IR < 2.0: Sensibilidad normal a la insulina.\n- 2.0 - 2.5: Sospecha / Límite de resistencia insulínica.\n- > 2.5 - 3.0: Resistencia a la insulina manifiesta (asociado a síndrome metabólico, esteatosis hepática, SOP, riesgo cardiovascular).',
    tags: ['homa-ir', 'resistencia a insulina', 'diabetes', 'metabolico', 'insulina', 'glucosa'],
    inputs: [
      { id: 'glucose', name: 'Glucosa en ayunas', symbol: 'Glucosa', unit: 'mg/dL', defaultValue: 90, min: 40, max: 400, step: 1 },
      { id: 'insulin', name: 'Insulina basal en ayunas', symbol: 'Insulina', unit: 'µUI/mL', defaultValue: 10.0, min: 0.5, max: 200, step: 0.1 }
    ],
    calculate: (inputs) => {
      const g = Number(inputs.glucose);
      const ins = Number(inputs.insulin);

      if (!g || !ins || g <= 0 || ins <= 0) {
        return { results: [], interpretation: 'Ingrese la glucemia basal y la concentración de insulina en ayunas.' };
      }

      const homaIr = Number(((g * ins) / 405).toFixed(2));

      // HOMA-β (función de célula beta): 20 * Ins / ((Gluc/18) - 3.5)
      const glucMmol = g / 18;
      let homaBeta: number | null = null;
      if (glucMmol > 3.5) {
        homaBeta = Number(((20 * ins) / (glucMmol - 3.5)).toFixed(1));
      }

      // QUICKI: 1 / (log(Ins) + log(Gluc))
      const quicki = Number((1 / (Math.log10(ins) + Math.log10(g))).toFixed(3));

      let status: 'normal' | 'high' | 'critical-high' = 'normal';
      let label = 'Sensibilidad a la insulina normal (< 2.0)';
      let interp = '';

      if (homaIr < 2.0) {
        status = 'normal';
        interp = 'HOMA-IR dentro de límites normales. Buena sensibilidad tisular a la acción de la insulina.';
      } else if (homaIr <= 2.9) {
        status = 'high';
        label = 'Resistencia a la Insulina Leve / Moderada (2.0 - 2.9)';
        interp = 'HOMA-IR elevado. Sugiere resistencia a la insulina incipiente. Correlacionar con circunferencia de cintura, triglicéridos y antecedentes familiares.';
      } else {
        status = 'critical-high';
        label = 'Resistencia a la Insulina Manifiesta (≥ 3.0)';
        interp = 'HOMA-IR francamente elevado. Alta probabilidad de síndrome metabólico, esteatohepatitis no alcohólica (NASH) y riesgo cardiometabólico incrementado.';
      }

      const results = [
        { id: 'homa_ir', name: 'Índice HOMA-IR', value: homaIr, unit: 'índice', referenceRange: '< 2.0 (Óptimo) | < 2.5 (Normal)', status, statusLabel: label },
        { id: 'quicki', name: 'Índice QUICKI', value: quicki, unit: 'índice', referenceRange: '> 0.330 (Sensibilidad conservada)', status: quicki < 0.330 ? 'low' : 'normal' as any }
      ];

      if (homaBeta !== null) {
        results.push({
          id: 'homa_beta',
          name: 'Función Celular Beta (HOMA-β)',
          value: homaBeta,
          unit: '%',
          referenceRange: '100% (Rango normal: 70 - 150%)',
          status: 'info' as any
        });
      }

      return {
        results,
        interpretation: interp,
        steps: [
          `HOMA-IR = (${g} × ${ins}) / 405 = ${homaIr}`,
          `QUICKI = 1 / [ log₁₀(${ins}) + log₁₀(${g}) ] = ${quicki}`,
          homaBeta !== null ? `HOMA-β = (20 × ${ins}) / [ (${g}/18) - 3.5 ] = ${homaBeta}%` : ''
        ].filter(Boolean)
      };
    }
  },
  {
    id: 'relacion_lh_fsh',
    category: 'hormonas',
    name: 'Relación LH / FSH (Hormona Luteinizante / Folículo Estimulante)',
    shortName: 'Relación LH/FSH',
    formulaEquation: 'Relación = LH (mUI/mL) / FSH (mUI/mL)',
    formulaDisplay: 'Relación LH / FSH = LH en fase folicular temprana (mUI/mL) / FSH (mUI/mL)',
    description: 'Cociente hormonal utilizado en ginecología y endocrinología reproductiva.',
    clinicalSignificance: 'En fase folicular temprana (días 2-4 del ciclo), una relación LH/FSH > 2.0 a 3.0 apoya fuertemente la sospecha diagnóstica de Síndrome de Ovario Poliquístico (SOP) en el contexto clínico adecuado.',
    tags: ['lh', 'fsh', 'sop', 'ovario poliquistico', 'fertilidad', 'endocrino'],
    inputs: [
      { id: 'lh', name: 'LH (Hormona Luteinizante)', symbol: 'LH', unit: 'mUI/mL', defaultValue: 14.5, min: 0.1, max: 150, step: 0.1 },
      { id: 'fsh', name: 'FSH (Hormona Folículo Estimulante)', symbol: 'FSH', unit: 'mUI/mL', defaultValue: 5.2, min: 0.1, max: 150, step: 0.1 }
    ],
    calculate: (inputs) => {
      const lh = Number(inputs.lh);
      const fsh = Number(inputs.fsh);

      if (!lh || !fsh || fsh <= 0) {
        return { results: [], interpretation: 'Ingrese los valores séricos de LH y FSH.' };
      }

      const ratio = Number((lh / fsh).toFixed(2));

      let status: 'normal' | 'high' = 'normal';
      let interp = '';

      if (ratio > 2.0) {
        status = 'high';
        interp = `Relación LH/FSH invertida (${ratio}:1 > 2:1). En fase folicular temprana, este patrón es altamente compatible con Síndrome de Ovario Poliquístico (SOP). Correlacionar con ecografía ovárica y signos de hiperandrogenismo.`;
      } else {
        status = 'normal';
        interp = `Relación LH/FSH normal (${ratio}:1 ≤ 2:1). Relación equilibrada fisiológica en fase folicular temprana.`;
      }

      return {
        results: [
          { id: 'ratio_lh_fsh', name: 'Relación LH / FSH', value: ratio, unit: 'ratio', referenceRange: '1.0 - 2.0 (Fase folicular)', status, statusLabel: ratio > 2.0 ? 'Elevada (> 2.0) - Compatible SOP' : 'Normal (≤ 2.0)' }
        ],
        interpretation: interp,
        steps: [`Relación LH/FSH = ${lh} / ${fsh} = ${ratio}`]
      };
    }
  },
  {
    id: 'indice_tiroxina_libre',
    category: 'hormonas',
    name: 'Índice de Tiroxina Libre (FTI / ITL)',
    shortName: 'Índice FTI (Tiroides)',
    formulaEquation: 'FTI = T4 Total (µg/dL) × (% Captación T3 / 100)',
    formulaDisplay: 'FTI = T4 Total (µg/dL) × [ T3 Uptake (%) / 100 ]',
    description: 'Estima la fracción de tiroxina biológicamente activa libre de unión proteica en suero.',
    clinicalSignificance: 'Corrige las alteraciones de T4 total provocadas por cambios en los niveles de TBG (Globulina fijadora de tiroxina) en embarazo, uso de anticonceptivos orales o hepatopatía.',
    tags: ['tiroides', 't4', 'fti', 't3 uptake', 'tbg', 'endocrino'],
    inputs: [
      { id: 't4_total', name: 'T4 Total', symbol: 'T4 Total', unit: 'µg/dL', defaultValue: 8.5, min: 0.5, max: 30, step: 0.1 },
      { id: 't3_uptake', name: 'Captación de T3 (T3 Uptake)', symbol: 'T3U', unit: '%', defaultValue: 30.0, min: 5, max: 60, step: 0.5 }
    ],
    calculate: (inputs) => {
      const t4 = Number(inputs.t4_total);
      const t3u = Number(inputs.t3_uptake);

      if (!t4 || !t3u) {
        return { results: [], interpretation: 'Ingrese T4 Total y T3 Uptake.' };
      }

      const fti = Number((t4 * (t3u / 100)).toFixed(2));
      let status: 'low' | 'normal' | 'high' = 'normal';

      if (fti < 1.3) status = 'low';
      else if (fti > 4.2) status = 'high';

      return {
        results: [
          { id: 'fti', name: 'Índice de Tiroxina Libre (FTI)', value: fti, unit: 'índice', referenceRange: '1.30 - 4.20', status, statusLabel: fti < 1.3 ? 'Hipotiroidismo' : fti > 4.2 ? 'Hipertiroidismo' : 'Eutiroidismo' }
        ],
        interpretation: `FTI = ${fti}. ${fti < 1.3 ? 'Sugiere Hipotiroidismo clínico o subclínico.' : fti > 4.2 ? 'Sugiere Hipertiroidismo / Tirotoxicosis.' : 'Función tiroidea normal.'}`,
        steps: [`FTI = ${t4} × (${t3u} / 100) = ${fti}`]
      };
    }
  }
];
