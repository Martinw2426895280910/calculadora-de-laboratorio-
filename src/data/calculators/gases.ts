import { FormulaDefinition } from '../../types/laboratory';

export const GASES_CALCULATORS: FormulaDefinition[] = [
  {
    id: 'gasometria_anion_gap_completo',
    category: 'gases_arteriales',
    name: 'Gasometría Arterial Integral, Anion Gap y Compensación Ácido-Base',
    shortName: 'Gasometría & Anion Gap',
    formulaEquation: 'Anion Gap = Na - (Cl + HCO3) | AG Corregido = AG + 2.5 × (4.0 - Albúmina) | Winter: pCO2 = 1.5 × HCO3 + 8 ± 2',
    formulaDisplay: '1. Anion Gap = Na⁺ - ( Cl⁻ + HCO₃⁻ )\n2. AG Corregido por Albúmina = AG + 2.5 × ( 4.0 - Albúmina g/dL )\n3. Relación Delta/Delta = ( AG - 12 ) / ( 24 - HCO₃⁻ )\n4. Fórmulas de Compensación Respiratoria y Metabólica',
    description: 'Análisis diagnóstico sistemático del equilibrio ácido-base, detección de trastornos simples y mixtos, acidosis metabólica con AG elevado o normal.',
    clinicalSignificance: 'El Anion Gap normal es de 8 a 12 mEq/L. Un AG elevado indica acumulación de ácidos orgánicos no medidos (Cetoacidosis, Láctico, Uremia, Intoxicaciones como Salicilatos, Metanol, Etilenglicol). La corrección por hipoalbuminemia es crucial en pacientes críticos.',
    tags: ['gasometria', 'anion gap', 'winter', 'delta-delta', 'acidosis', 'alcalosis', 'uci'],
    inputs: [
      { id: 'ph', name: 'pH Arterial', symbol: 'pH', unit: 'unidades', defaultValue: 7.28, min: 6.8, max: 7.8, step: 0.01 },
      { id: 'pco2', name: 'pCO2 Arterial', symbol: 'pCO₂', unit: 'mmHg', defaultValue: 28, min: 10, max: 120, step: 1 },
      { id: 'hco3', name: 'Bicarbonato (HCO3-)', symbol: 'HCO₃⁻', unit: 'mEq/L', defaultValue: 13, min: 2, max: 60, step: 0.5 },
      { id: 'na', name: 'Sodio Sérico (Na+)', symbol: 'Na⁺', unit: 'mEq/L', defaultValue: 138, min: 100, max: 180, step: 1 },
      { id: 'cl', name: 'Cloro Sérico (Cl-)', symbol: 'Cl⁻', unit: 'mEq/L', defaultValue: 102, min: 60, max: 140, step: 1 },
      { id: 'albumin', name: 'Albúmina sérica (opcional)', symbol: 'Alb', unit: 'g/dL', defaultValue: 3.0, min: 1.0, max: 5.5, step: 0.1 }
    ],
    calculate: (inputs) => {
      const ph = Number(inputs.ph);
      const pco2 = Number(inputs.pco2);
      const hco3 = Number(inputs.hco3);
      const na = Number(inputs.na);
      const cl = Number(inputs.cl);
      const alb = Number(inputs.albumin) || 4.0;

      if (!ph || !pco2 || !hco3 || !na || !cl) {
        return { results: [], interpretation: 'Complete pH, pCO2, HCO3, Sodio y Cloro.' };
      }

      // Anion Gap
      const ag = Number((na - (cl + hco3)).toFixed(1));
      // AG corregido por albúmina: AG + 2.5 * (4.0 - alb)
      const agCorr = Number((ag + 2.5 * (4.0 - alb)).toFixed(1));

      // Trastorno Primario
      let primaryDisorder = '';
      let compensationAnalysis = '';
      let deltaAnalysis = '';

      if (ph < 7.35) {
        // Acidemia
        if (hco3 < 22 && pco2 <= 45) {
          primaryDisorder = 'Acidosis Metabólica Primaria';
          // Regla de Winter: pCO2 esperada = 1.5 * HCO3 + 8 (+- 2)
          const winterPco2 = Number((1.5 * hco3 + 8).toFixed(1));
          const minWinter = winterPco2 - 2;
          const maxWinter = winterPco2 + 2;

          if (pco2 >= minWinter && pco2 <= maxWinter) {
            compensationAnalysis = `Compensación respiratoria adecuada (pCO₂ esperada por Winter = ${winterPco2} ± 2 mmHg, actual: ${pco2} mmHg). Trastorno simple compensado.`;
          } else if (pco2 > maxWinter) {
            compensationAnalysis = `pCO₂ (${pco2} mmHg) superior a lo esperado por Winter (${winterPco2} ± 2 mmHg). Trastorno Mixto: Acidosis Metabólica + Acidosis Respiratoria agregada.`;
          } else {
            compensationAnalysis = `pCO₂ (${pco2} mmHg) inferior a lo esperado por Winter. Trastorno Mixto: Acidosis Metabólica + Alcalosis Respiratoria concomitante.`;
          }

          // Delta / Delta si AG elevado (>12)
          if (agCorr > 12 && hco3 < 24) {
            const deltaAg = agCorr - 12;
            const deltaHco3 = 24 - hco3;
            const deltaRatio = Number((deltaAg / deltaHco3).toFixed(2));

            if (deltaRatio < 0.4) {
              deltaAnalysis = `Delta/Delta (${deltaRatio}) < 0.4: Acidosis metabólica hiperclorémica (AG normal) pura o predominante.`;
            } else if (deltaRatio < 0.8) {
              deltaAnalysis = `Delta/Delta (${deltaRatio}) 0.4 - 0.8: Trastorno mixto de Acidosis Metabólica con Anion Gap Elevado + Acidosis Metabólica Hiperclorémica (con AG normal).`;
            } else if (deltaRatio <= 2.0) {
              deltaAnalysis = `Delta/Delta (${deltaRatio}) 0.8 - 2.0: Acidosis Metabólica con Anion Gap Elevado Pura (ej. Cetoacidosis, Acidosis Láctica, Uremia o Intoxicación).`;
            } else {
              deltaAnalysis = `Delta/Delta (${deltaRatio}) > 2.0: Acidosis Metabólica con AG Elevado + Alcalosis Metabólica preexistente (o retención crónica de HCO3).`;
            }
          }
        } else if (pco2 > 45) {
          primaryDisorder = 'Acidosis Respiratoria Primaria';
          // delta HCO3 aguda: 0.1 * delta pCO2; cronica: 0.35 * delta pCO2
          const deltaPco2 = pco2 - 40;
          const expHco3Aguda = Number((24 + 0.1 * deltaPco2).toFixed(1));
          const expHco3Cronica = Number((24 + 0.35 * deltaPco2).toFixed(1));
          compensationAnalysis = `Acidosis Respiratoria: HCO₃⁻ esperado en cuadro agudo = ${expHco3Aguda} mEq/L; en cuadro crónico = ${expHco3Cronica} mEq/L (actual: ${hco3} mEq/L).`;
        } else {
          primaryDisorder = 'Acidemia no clasificada simple';
        }
      } else if (ph > 7.45) {
        // Alcalemia
        if (hco3 > 26) {
          primaryDisorder = 'Alcalosis Metabólica Primaria';
          const expPco2 = Number((0.7 * (hco3 - 24) + 40).toFixed(1));
          compensationAnalysis = `pCO₂ esperada = ${expPco2} ± 2 mmHg (actual: ${pco2} mmHg).`;
        } else if (pco2 < 35) {
          primaryDisorder = 'Alcalosis Respiratoria Primaria';
          const deltaPco2 = 40 - pco2;
          const expHco3Aguda = Number((24 - 0.2 * deltaPco2).toFixed(1));
          compensationAnalysis = `Alcalosis Respiratoria: HCO₃⁻ esperado = ${expHco3Aguda} mEq/L (actual: ${hco3} mEq/L).`;
        } else {
          primaryDisorder = 'Alcalemia no clasificada simple';
        }
      } else {
        primaryDisorder = 'pH en rango normal (7.35 - 7.45) - Posible equilibrio fisiológico o trastorno ácido-base mixto compensado';
      }

      const results = [
        { id: 'ag', name: 'Anion Gap Medido', value: ag, unit: 'mEq/L', referenceRange: '8.0 - 12.0 mEq/L', status: ag > 12 ? 'high' : ag < 8 ? 'low' : 'normal' as any },
        { id: 'ag_corr', name: 'Anion Gap Corregido por Albúmina', value: agCorr, unit: 'mEq/L', referenceRange: '8.0 - 12.0 mEq/L', status: agCorr > 12 ? 'critical-high' : 'normal' as any, statusLabel: agCorr > 12 ? 'AG Elevado (> 12)' : 'AG Normal' }
      ];

      return {
        results,
        interpretation: `Diagnóstico Gasométrico: ${primaryDisorder}.\n• ${compensationAnalysis}\n${deltaAnalysis ? `• ${deltaAnalysis}` : ''}`,
        steps: [
          `Anion Gap = ${na} - (${cl} + ${hco3}) = ${ag} mEq/L`,
          `AG Corregido = ${ag} + 2.5 × (4.0 - ${alb}) = ${agCorr} mEq/L`,
          primaryDisorder.includes('Metabólica') ? `Fórmula de Winter: pCO₂ = (1.5 × ${hco3}) + 8 = ${(1.5 * hco3 + 8).toFixed(1)} mmHg (Rango: ${(1.5 * hco3 + 6).toFixed(1)} - ${(1.5 * hco3 + 10).toFixed(1)})` : ''
        ].filter(Boolean)
      };
    }
  },
  {
    id: 'gradiente_alveolo_arterial_o2',
    category: 'gases_arteriales',
    name: 'Gradiente Alvéolo-Arterial de Oxígeno (P(A-a)O2) e Índice Kirby (PaO2/FiO2)',
    shortName: 'Gradiente A-a & PaO2/FiO2',
    formulaEquation: 'PAO2 = [ FiO2 × (Patm - 47) ] - ( pCO2 / 0.8 ) | Gradiente A-a = PAO2 - PaO2',
    formulaDisplay: 'PAO₂ = [ FiO₂ × ( 760 - 47 ) ] - [ pCO₂ / 0.8 ]\nGradiente P(A-a)O₂ = PAO₂ - PaO₂\nGradiente Esperado por Edad = ( Edad / 4 ) + 4 (o Edad × 0.3)\nÍndice de Kirby (PaFi) = PaO₂ / FiO₂',
    description: 'Evalúa la eficiencia de la membrana alvéolo-capilar en la oxigenación arterial y clasifica el Síndrome de Dificultad Respiratoria Aguda (SDRA).',
    clinicalSignificance: 'Diferencia hipoxemia por hipoventilación pura (Gradiente A-a normal) de hipoxemia por alteración V/Q, Shunt o alteración de la difusión (Gradiente A-a elevado).\nCriterios de Berlín (PaFi con PEEP ≥ 5):\n- > 300: Normal\n- 201 - 300: SDRA Leve\n- 101 - 200: SDRA Moderado\n- ≤ 100: SDRA Severo.',
    tags: ['gradiente a-a', 'pafi', 'kirby', 'sdra', 'oxigenacion', 'fio2', 'hipoxemia'],
    inputs: [
      { id: 'po2', name: 'pO2 Arterial (PaO2)', symbol: 'PaO₂', unit: 'mmHg', defaultValue: 75, min: 20, max: 500, step: 1 },
      { id: 'pco2', name: 'pCO2 Arterial', symbol: 'pCO₂', unit: 'mmHg', defaultValue: 40, min: 10, max: 120, step: 1 },
      { id: 'fio2', name: 'Fracción Inspirada de O2 (FiO2)', symbol: 'FiO₂', unit: 'fracción (ej. 0.21 aire ambiente)', defaultValue: 0.21, min: 0.21, max: 1.0, step: 0.01 },
      { id: 'age', name: 'Edad del paciente', symbol: 'Edad', unit: 'años', defaultValue: 60, min: 1, max: 110, step: 1 },
      { id: 'patm', name: 'Presión Atmosférica (760 a nivel del mar)', symbol: 'Patm', unit: 'mmHg', defaultValue: 760, min: 450, max: 800, step: 5 }
    ],
    calculate: (inputs) => {
      const po2 = Number(inputs.po2);
      const pco2 = Number(inputs.pco2);
      const fio2 = Number(inputs.fio2);
      const age = Number(inputs.age) || 50;
      const patm = Number(inputs.patm) || 760;

      if (!po2 || !pco2 || !fio2) {
        return { results: [], interpretation: 'Ingrese PaO2, pCO2 y FiO2.' };
      }

      // Presión Alveolar de O2: PAO2 = [FiO2 * (Patm - 47)] - (pCO2 / 0.8)
      const paO2 = Number((fio2 * (patm - 47) - pco2 / 0.8).toFixed(1));
      const gradAa = Number((paO2 - po2).toFixed(1));
      const expGrad = Number((age / 4 + 4).toFixed(1));
      const pafi = Math.round(po2 / fio2);

      let pafiLabel = '';
      let pafiStatus: 'normal' | 'low' | 'critical-low' = 'normal';

      if (pafi > 300) {
        pafiLabel = 'Normal / Sin SDRA (> 300)';
        pafiStatus = 'normal';
      } else if (pafi > 200) {
        pafiLabel = 'SDRA Leve (201 - 300)';
        pafiStatus = 'low';
      } else if (pafi > 100) {
        pafiLabel = 'SDRA Moderado (101 - 200)';
        pafiStatus = 'critical-low';
      } else {
        pafiLabel = 'SDRA Severo (≤ 100)';
        pafiStatus = 'critical-low';
      }

      let gradStatus: 'normal' | 'high' = gradAa > expGrad + 5 ? 'high' : 'normal';

      return {
        results: [
          { id: 'grad_aa', name: 'Gradiente Alvéolo-Arterial P(A-a)O2', value: gradAa, unit: 'mmHg', referenceRange: `< ${expGrad} mmHg (para ${age} años)`, status: gradStatus, statusLabel: gradStatus === 'high' ? 'Gradiente Elevado' : 'Gradiente Normal' },
          { id: 'pafi', name: 'Índice PaO2 / FiO2 (Kirby)', value: pafi, unit: 'mmHg', referenceRange: '> 300 mmHg', status: pafiStatus, statusLabel: pafiLabel },
          { id: 'pao2_alv', name: 'Presión Alveolar de O2 (PAO2)', value: paO2, unit: 'mmHg', status: 'info' }
        ],
        interpretation: `PaFi: ${pafi} (${pafiLabel}). Gradiente A-a: ${gradAa} mmHg (esperado para la edad: ~${expGrad} mmHg). ${gradStatus === 'high' ? 'Gradiente A-a ensanchado: Indica defecto de difusión, desequilibrio V/Q o shunt intrapulmonar (ej. neumonía, edema pulmonar, TEP, SDRA).' : 'Gradiente A-a conservado: Si hay hipoxemia, orienta a hipoventilación pura o baja FiO2 ambiental.'}`,
        steps: [
          `PAO₂ = [ ${fio2} × (${patm} - 47) ] - (${pco2} / 0.8) = ${paO2} mmHg`,
          `Gradiente A-a = ${paO2} - ${po2} = ${gradAa} mmHg`,
          `PaO₂ / FiO₂ = ${po2} / ${fio2} = ${pafi}`
        ]
      };
    }
  }
];
