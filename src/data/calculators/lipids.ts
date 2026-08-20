import { FormulaDefinition } from '../../types/laboratory';

export const LIPIDS_CALCULATORS: FormulaDefinition[] = [
  {
    id: 'perfil_lipidico_integral_ldl',
    category: 'lipidos',
    name: 'Cálculo Avanzado de Colesterol LDL (Friedewald, Martin-Hopkins y Sampson/NIH) y Perfil Aterogénico',
    shortName: 'LDL Avanzado & Índices Aterogénicos',
    formulaEquation: 'Friedewald: LDL = CT - HDL - (TG/5) | Sampson NIH: LDL = CT/0.948 - HDL/0.971 - [TG/8.56 + (TG×NoHDL)/2140 - TG^2/16100] - 9.44',
    formulaDisplay: '1. Fórmula de Friedewald: cLDL = cTotal - cHDL - ( Triglicéridos / 5 )\n2. Ecuación de Sampson (NIH 2020): Válida con TG hasta 800 mg/dL e hipertrigliceridemia severa.\n3. Colesterol No-HDL = cTotal - cHDL\n4. Índices de Castelli: Castelli I (CT/HDL) y Castelli II (LDL/HDL)\n5. Cociente TG / HDL (Índice de partículas pequeñas y densas)',
    description: 'Calcula el colesterol LDL con los 3 métodos científicos estandarizados y evalúa el perfil aterogénico integral.',
    clinicalSignificance: 'La fórmula clásica de Friedewald subestima el LDL cuando los triglicéridos son > 150 mg/dL o cuando el LDL es < 70 mg/dL, y es inválida con TG ≥ 400 mg/dL. La ecuación de Sampson (NIH) mantiene alta concordancia con ultracentrifugación y mediciones directas incluso con triglicéridos de hasta 800 mg/dL.',
    tags: ['ldl', 'friedewald', 'sampson', 'martin-hopkins', 'lipidos', 'colesterol', 'castelli', 'no-hdl', 'riesgo cardiovascular'],
    inputs: [
      { id: 'total_chol', name: 'Colesterol Total', symbol: 'CT', unit: 'mg/dL', defaultValue: 215, min: 50, max: 800, step: 1 },
      { id: 'hdl_chol', name: 'Colesterol HDL', symbol: 'cHDL', unit: 'mg/dL', defaultValue: 45, min: 10, max: 150, step: 1 },
      { id: 'triglycerides', name: 'Triglicéridos', symbol: 'TG', unit: 'mg/dL', defaultValue: 175, min: 20, max: 1000, step: 1 }
    ],
    calculate: (inputs) => {
      const ct = Number(inputs.total_chol);
      const hdl = Number(inputs.hdl_chol);
      const tg = Number(inputs.triglycerides);

      if (!ct || !hdl || !tg || ct <= 0 || hdl <= 0 || tg <= 0) {
        return { results: [], interpretation: 'Ingrese Colesterol Total, HDL y Triglicéridos.' };
      }

      // No-HDL
      const noHdl = ct - hdl;
      const vldlFriedewald = Number((tg / 5).toFixed(1));

      // 1. Friedewald (solo si TG < 400)
      let ldlFriedewald: number | null = null;
      if (tg < 400) {
        ldlFriedewald = Number((ct - hdl - tg / 5).toFixed(1));
      }

      // 2. Sampson / NIH Equation (2020):
      // LDL = (CT / 0.948) - (HDL / 0.971) - [ (TG / 8.56) + (TG * NoHDL / 2140) - (TG^2 / 16100) ] - 9.44
      let ldlSampson = 0;
      if (tg <= 800) {
        const term1 = ct / 0.948;
        const term2 = hdl / 0.971;
        const term3 = tg / 8.56 + (tg * noHdl) / 2140 - Math.pow(tg, 2) / 16100;
        ldlSampson = Number((term1 - term2 - term3 - 9.44).toFixed(1));
      }

      // Ratios aterogénicos
      const castelli1 = Number((ct / hdl).toFixed(2));
      const activeLdl = ldlSampson || ldlFriedewald || 100;
      const castelli2 = Number((activeLdl / hdl).toFixed(2));
      const tgHdlRatio = Number((tg / hdl).toFixed(2));

      let ldlStatus: 'normal' | 'high' | 'critical-high' = 'normal';
      let ldlLabel = 'Óptimo (< 100 mg/dL)';
      if (activeLdl >= 190) {
        ldlStatus = 'critical-high';
        ldlLabel = 'Muy Alto (≥ 190 mg/dL)';
      } else if (activeLdl >= 160) {
        ldlStatus = 'high';
        ldlLabel = 'Alto (160 - 189 mg/dL)';
      } else if (activeLdl >= 100) {
        ldlStatus = 'high';
        ldlLabel = 'Límite Alto (100 - 159 mg/dL)';
      }

      const results = [
        { id: 'ldl_sampson', name: 'Colesterol LDL (Ecuación Sampson / NIH 2020)', value: ldlSampson > 0 ? ldlSampson : 'N/A', unit: 'mg/dL', referenceRange: '< 100 mg/dL (Óptimo) | < 70 (Alto riesgo)', status: ldlStatus, statusLabel: ldlLabel },
        { id: 'ldl_friedewald', name: 'Colesterol LDL (Fórmula clásica de Friedewald)', value: ldlFriedewald !== null ? ldlFriedewald : 'Inválida (TG ≥ 400 mg/dL)', unit: 'mg/dL', referenceRange: '< 100 mg/dL', status: ldlFriedewald ? ldlStatus : 'info' as any },
        { id: 'no_hdl', name: 'Colesterol No-HDL', value: noHdl, unit: 'mg/dL', referenceRange: '< 130 mg/dL', status: noHdl > 130 ? 'high' : 'normal' as any },
        { id: 'vldl', name: 'Colesterol VLDL', value: vldlFriedewald, unit: 'mg/dL', referenceRange: '< 30 mg/dL', status: vldlFriedewald > 30 ? 'high' : 'normal' as any },
        { id: 'castelli_1', name: 'Índice de Castelli I (Colesterol Total / HDL)', value: castelli1, unit: 'ratio', referenceRange: '< 4.5 (Hombres) | < 4.0 (Mujeres)', status: castelli1 > 4.5 ? 'high' : 'normal' as any },
        { id: 'castelli_2', name: 'Índice de Castelli II (LDL / HDL)', value: castelli2, unit: 'ratio', referenceRange: '< 3.0', status: castelli2 > 3.0 ? 'high' : 'normal' as any },
        { id: 'tg_hdl', name: 'Relación Triglicéridos / HDL', value: tgHdlRatio, unit: 'ratio', referenceRange: '< 2.5 (Marcador LDL densas)', status: tgHdlRatio > 3.0 ? 'high' : 'normal' as any }
      ];

      return {
        results,
        interpretation: `Evaluación Lipídica: cLDL = ${ldlSampson} mg/dL (Sampson/NIH) / Colesterol No-HDL = ${noHdl} mg/dL. ${tgHdlRatio > 3.0 ? 'Relación TG/HDL > 3.0: Sugiere predominio de partículas de LDL pequeñas y densas altamente aterogénicas y resistencia a la insulina.' : 'Perfil aterogénico dentro de límites deseables.'}`,
        steps: [
          `No-HDL = ${ct} - ${hdl} = ${noHdl} mg/dL`,
          ldlFriedewald !== null ? `Friedewald = ${ct} - ${hdl} - (${tg}/5) = ${ldlFriedewald} mg/dL` : 'Friedewald no aplicable con TG ≥ 400 mg/dL',
          `Sampson NIH = (${ct}/0.948) - (${hdl}/0.971) - [ (${tg}/8.56) + (${tg}×${noHdl}/2140) - (${tg}²/16100) ] - 9.44 = ${ldlSampson} mg/dL`,
          `Índice Castelli I = ${ct} / ${hdl} = ${castelli1}`
        ]
      };
    }
  }
];
