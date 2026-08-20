import { FormulaDefinition } from '../../types/laboratory';

export const ELECTROLYTES_CALCULATORS: FormulaDefinition[] = [
  {
    id: 'sodio_corregido_hiperglucemia',
    category: 'electrolitos',
    name: 'Sodio Corregido por Hiperglucemia (Fórmulas de Katz y Hillier)',
    shortName: 'Sodio Corregido por Glucosa',
    formulaEquation: 'Katz: Na_corr = Na + 0.016 × (Glucosa - 100) | Hillier: Na + 0.024 × (Glucosa - 100)',
    formulaDisplay: 'Ecuación de Katz (estándar):\nNa⁺ Corregido (mEq/L) = Na⁺ Medido + [ 0.016 × ( Glucosa mg/dL - 100 ) ]\n\nEcuación de Hillier (recomendada en hiperglucemias marcadas > 400 mg/dL):\nNa⁺ Corregido (mEq/L) = Na⁺ Medido + [ 0.024 × ( Glucosa mg/dL - 100 ) ]',
    description: 'Calcula la concentración real de sodio plasmático corrigiendo el efecto de traslocación osmótica de agua del espacio intracelular al extracelular causado por la hiperglucemia.',
    clinicalSignificance: 'Crucial en el manejo de Cetoacidosis Diabética (CAD) y Estado Hiperosmolar Hiperglucémico (EHH) para elegir el tipo de fluido de reposición (Solución Salina al 0.9% vs al 0.45%).',
    tags: ['sodio corregido', 'glucosa', 'cetoacidosis', 'ehh', 'katz', 'hillier', 'diabetes'],
    inputs: [
      { id: 'na_measured', name: 'Sodio Sérico Medido', symbol: 'Na⁺ Medido', unit: 'mEq/L (mmol/L)', defaultValue: 130, min: 90, max: 180, step: 1 },
      { id: 'glucose', name: 'Glucosa Sérica (Glucemia)', symbol: 'Glucosa', unit: 'mg/dL', defaultValue: 450, min: 100, max: 2000, step: 10 }
    ],
    calculate: (inputs) => {
      const na = Number(inputs.na_measured);
      const gluc = Number(inputs.glucose);

      if (!na || !gluc) {
        return { results: [], interpretation: 'Ingrese el Sodio medido y la Glucemia.' };
      }

      if (gluc <= 100) {
        return {
          results: [{ id: 'na_corr', name: 'Sodio Corregido', value: na, unit: 'mEq/L', referenceRange: '135 - 145 mEq/L', status: na < 135 ? 'low' : na > 145 ? 'high' : 'normal' }],
          interpretation: 'La glucosa no se encuentra elevada (> 100 mg/dL), por lo que el sodio medido no requiere corrección osmótica.'
        };
      }

      const diff = gluc - 100;
      const katz = Number((na + 0.016 * diff).toFixed(1));
      const hillier = Number((na + 0.024 * diff).toFixed(1));

      let status: 'low' | 'normal' | 'high' = 'normal';
      if (katz < 135) status = 'low';
      else if (katz > 145) status = 'high';

      return {
        results: [
          { id: 'na_katz', name: 'Sodio Corregido (Katz: factor 1.6)', value: katz, unit: 'mEq/L', referenceRange: '135 - 145 mEq/L', status, statusLabel: katz < 135 ? 'Hiponatremia real' : katz > 145 ? 'Hipernatremia real' : 'Eunatremia real' },
          { id: 'na_hillier', name: 'Sodio Corregido (Hillier: factor 2.4)', value: hillier, unit: 'mEq/L', referenceRange: '135 - 145 mEq/L', status: hillier > 145 ? 'high' : hillier < 135 ? 'low' : 'normal' }
        ],
        interpretation: `Sodio corregido: ${katz} mEq/L (Katz) / ${hillier} mEq/L (Hillier). ${katz >= 135 && katz <= 145 ? 'La hiponatremia medida era un artefacto osmótico (pseudohiponatremia hiperglucémica), el sodio real es normal.' : katz > 145 ? 'Existe hipernatremia real enmascarada por el flujo osmótico de agua.' : 'Persiste hiponatremia real verdadera.'}`,
        steps: [
          `Diferencia de glucosa = ${gluc} - 100 = ${diff} mg/dL`,
          `Katz = ${na} + [ 0.016 × ${diff} ] = ${na} + ${(0.016 * diff).toFixed(1)} = ${katz} mEq/L`,
          `Hillier = ${na} + [ 0.024 × ${diff} ] = ${na} + ${(0.024 * diff).toFixed(1)} = ${hillier} mEq/L`
        ]
      };
    }
  },
  {
    id: 'calcio_corregido_albumina',
    category: 'electrolitos',
    name: 'Calcio Total Corregido por Albúmina (Fórmula de Payne)',
    shortName: 'Calcio Corregido por Albúmina',
    formulaEquation: 'Calcio Corregido = Calcio Total Medido (mg/dL) + 0.8 × [ 4.0 - Albúmina Sérica (g/dL) ]',
    formulaDisplay: 'Ca Corregido (mg/dL) = Ca Total (mg/dL) + [ 0.8 × ( 4.0 - Albúmina g/dL ) ]\n*Si albúmina en g/L: Ca (mg/dL) + 0.08 × ( 40 - Albúmina g/L )',
    description: 'Aproximadamente el 40-50% del calcio sérico circula unido a la albúmina. Una disminución en la albúmina reduce falsamente el calcio total sin afectar el calcio iónico biológicamente activo.',
    clinicalSignificance: 'Obligatorio en pacientes desnutridos, cirróticos, nefróticos o internados en UCI. Evita falsos diagnósticos de hipocalcemia o desenmascara hipercalcemias ocultas.',
    tags: ['calcio corregido', 'albumina', 'payne', 'hipocalcemia', 'hipercalcemia', 'electrolitos'],
    inputs: [
      { id: 'ca_measured', name: 'Calcio Total Medido', symbol: 'Ca Total', unit: 'mg/dL', defaultValue: 7.8, min: 3.0, max: 20.0, step: 0.1 },
      { id: 'albumin', name: 'Albúmina Sérica', symbol: 'Albúmina', unit: 'g/dL', defaultValue: 2.5, min: 0.5, max: 6.0, step: 0.1 }
    ],
    calculate: (inputs) => {
      const ca = Number(inputs.ca_measured);
      const alb = Number(inputs.albumin);

      if (!ca || !alb) {
        return { results: [], interpretation: 'Ingrese el Calcio total y la Albúmina sérica.' };
      }

      const caCorr = Number((ca + 0.8 * (4.0 - alb)).toFixed(2));
      const caCorrMmol = Number((caCorr * 0.2495).toFixed(2));

      let status: 'low' | 'normal' | 'high' = 'normal';
      let label = 'Normocalcemia (8.5 - 10.5 mg/dL)';
      let interp = '';

      if (caCorr < 8.5) {
        status = 'low';
        label = 'Hipocalcemia Verdadera (< 8.5 mg/dL)';
        interp = 'Hipocalcemia real confirmada tras corrección por hipoalbuminemia. Evaluar magnesio, fósforo y PTH.';
      } else if (caCorr <= 10.5) {
        status = 'normal';
        interp = 'Calcio corregido dentro de límites normales. La hipocalcemia inicial correspondía a pseudohipocalcemia por déficit de albúmina.';
      } else {
        status = 'high';
        label = 'Hipercalcemia Oculta (> 10.5 mg/dL)';
        interp = 'Hipercalcemia desenmascarada tras corregir por hipoalbuminemia. Descartar hiperparatiroidismo primario o malignidad.';
      }

      return {
        results: [
          { id: 'ca_corr', name: 'Calcio Total Corregido (Payne)', value: caCorr, unit: 'mg/dL', referenceRange: '8.5 - 10.5 mg/dL', status, statusLabel: label },
          { id: 'ca_corr_si', name: 'Calcio Corregido (SI)', value: caCorrMmol, unit: 'mmol/L', referenceRange: '2.12 - 2.62 mmol/L', status }
        ],
        interpretation: interp,
        steps: [
          `Diferencia de Albúmina = 4.0 - ${alb} = ${(4.0 - alb).toFixed(2)} g/dL`,
          `Calcio Corregido = ${ca} + [ 0.8 × ${(4.0 - alb).toFixed(2)} ] = ${ca} + ${(0.8 * (4.0 - alb)).toFixed(2)} = ${caCorr} mg/dL`
        ]
      };
    }
  },
  {
    id: 'deficit_agua_libre',
    category: 'electrolitos',
    name: 'Déficit de Agua Libre en Hipernatremia',
    shortName: 'Déficit de Agua Libre',
    formulaEquation: 'Déficit de Agua (L) = ACT × [ (Na Sérico / 140) - 1 ]',
    formulaDisplay: 'Déficit de Agua Libre (Litros) = Agua Corporal Total (L) × [ ( Na⁺ Actual / 140 ) - 1 ]\nAgua Corporal Total (ACT):\n- Hombres: 0.6 × Peso (kg) [Ancianos: 0.5]\n- Mujeres: 0.5 × Peso (kg) [Ancianas: 0.45]',
    description: 'Calcula la cantidad de agua libre requerida para retornar la concentración sérica de sodio a la normalidad en pacientes hipernatrémicos.',
    clinicalSignificance: 'Regla de seguridad: La corrección de sodio no debe superar 10-12 mEq/L en 24 horas (máx 0.5 mEq/L/h) para prevenir edema cerebral y convulsiones.',
    tags: ['deficit de agua', 'hipernatremia', 'sodio', 'deshidratacion', 'act'],
    inputs: [
      { id: 'na_measured', name: 'Sodio Sérico Actual', symbol: 'Na⁺', unit: 'mEq/L', defaultValue: 158, min: 146, max: 200, step: 1 },
      { id: 'weight', name: 'Peso corporal', symbol: 'Peso', unit: 'kg', defaultValue: 70, min: 20, max: 200, step: 1 },
      { id: 'group', name: 'Grupo demográfico', symbol: 'Grupo', unit: '', type: 'select', options: ['Hombre Adulto (0.6)', 'Mujer Adulta (0.5)', 'Hombre Anciano (0.5)', 'Mujer Anciana (0.45)', 'Niño (0.6)'], defaultValue: 'Hombre Adulto (0.6)' }
    ],
    calculate: (inputs) => {
      const na = Number(inputs.na_measured);
      const weight = Number(inputs.weight);
      const grp = inputs.group || 'Hombre Adulto (0.6)';

      if (!na || !weight || na <= 140) {
        return { results: [], interpretation: 'Esta fórmula aplica para concentraciones de Sodio sérico > 140 mEq/L.' };
      }

      let factor = 0.6;
      if (grp.includes('Mujer Adulta') || grp.includes('Hombre Anciano')) factor = 0.5;
      else if (grp.includes('Mujer Anciana')) factor = 0.45;
      else if (grp.includes('Niño')) factor = 0.6;

      const act = Number((weight * factor).toFixed(1));
      const deficit = Number((act * (na / 140 - 1)).toFixed(2));

      return {
        results: [
          { id: 'water_deficit', name: 'Déficit Total de Agua Libre', value: deficit, unit: 'Litros (L)', status: 'high', statusLabel: 'Hipernatremia / Deshidratación Hipertónica' },
          { id: 'act', name: 'Agua Corporal Total (ACT) estimada', value: act, unit: 'Litros (L)', status: 'info' }
        ],
        interpretation: `Déficit calculado: ${deficit} Litros de agua libre. Administrar junto con las pérdidas basales en 48 a 72 horas. Monitorear natremia cada 4-6 horas para no exceder una disminución > 10 mEq/L/día.`,
        steps: [
          `ACT = ${weight} kg × ${factor} = ${act} L`,
          `Déficit = ${act} × [ (${na} / 140) - 1 ] = ${act} × ${(na/140 - 1).toFixed(4)} = ${deficit} Litros`
        ]
      };
    }
  },
  {
    id: 'deficit_sodio_hiponatremia',
    category: 'electrolitos',
    name: 'Déficit de Sodio en Hiponatremia',
    shortName: 'Déficit de Sodio',
    formulaEquation: 'Déficit de Na (mEq) = ACT × ( Na Deseado - Na Actual )',
    formulaDisplay: 'Déficit de Sodio (mEq) = Agua Corporal Total (L) × [ Na⁺ Deseado - Na⁺ Actual ]\n*Velocidad segura recomendada: No aumentar más de 8 - 10 mEq/L en 24h para evitar el Síndrome de Desmielinización Osmótica (Mielinólisis Pontina).',
    description: 'Calcula los miliequivalentes de sodio requeridos para elevar la natremia a un objetivo seguro en hiponatremias sintomáticas o severas.',
    clinicalSignificance: 'Tratamiento de emergencia con Cloruro de Sodio hipertónico al 3% (513 mEq/L de Na) en crisis convulsivas o coma por hiponatremia aguda.',
    tags: ['deficit de sodio', 'hiponatremia', 'mielinolisis', 'cloruro de sodio 3%', 'electrolitos'],
    inputs: [
      { id: 'na_actual', name: 'Sodio Sérico Actual', symbol: 'Na⁺ Actual', unit: 'mEq/L', defaultValue: 118, min: 90, max: 134, step: 1 },
      { id: 'na_target', name: 'Sodio Sérico Deseado (Objetivo seguro)', symbol: 'Na⁺ Objetivo', unit: 'mEq/L', defaultValue: 126, min: 100, max: 140, step: 1 },
      { id: 'weight', name: 'Peso corporal', symbol: 'Peso', unit: 'kg', defaultValue: 65, min: 20, max: 200, step: 1 },
      { id: 'gender', name: 'Sexo / Grupo', symbol: 'Grupo', unit: '', type: 'select', options: ['Hombre (0.6)', 'Mujer (0.5)', 'Hombre Anciano (0.5)', 'Mujer Anciana (0.45)'], defaultValue: 'Hombre (0.6)' }
    ],
    calculate: (inputs) => {
      const naAct = Number(inputs.na_actual);
      const naTgt = Number(inputs.na_target);
      const weight = Number(inputs.weight);
      const grp = inputs.gender || 'Hombre (0.6)';

      if (!naAct || !naTgt || !weight || naAct >= naTgt) {
        return { results: [], interpretation: 'El Sodio Actual debe ser menor al Sodio Objetivo deseado.' };
      }

      let factor = 0.6;
      if (grp.includes('Mujer') && !grp.includes('Anciana')) factor = 0.5;
      else if (grp.includes('Hombre Anciano')) factor = 0.5;
      else if (grp.includes('Mujer Anciana')) factor = 0.45;

      const act = Number((weight * factor).toFixed(1));
      const deltaNa = naTgt - naAct;
      const deficit = Math.round(act * deltaNa);
      // Vol NaCl 3% (513 mEq/L) = deficit / 0.513 mL
      const volNacl3 = Math.round(deficit / 0.513);

      return {
        results: [
          { id: 'na_deficit', name: 'Déficit de Sodio Requerido', value: deficit, unit: 'mEq', status: 'critical-low', statusLabel: 'Hiponatremia Severa' },
          { id: 'vol_nacl_3', name: 'Volumen equivalente de NaCl al 3%', value: volNacl3, unit: 'mL de SS 3%', status: 'info' },
          { id: 'act', name: 'Agua Corporal Total (ACT)', value: act, unit: 'Litros', status: 'info' }
        ],
        interpretation: `Déficit para elevar natremia en ${deltaNa} mEq/L: ${deficit} mEq de Na (equivalente a ${volNacl3} mL de solución salina hipertónica al 3%). ADVERTENCIA: No elevar más de 8 mEq/L en 24h para prevenir daño neurológico permanente.`,
        steps: [
          `ACT = ${weight} kg × ${factor} = ${act} L`,
          `Déficit de Na = ${act} × (${naTgt} - ${naAct}) = ${deficit} mEq`,
          `Volumen NaCl 3% (513 mEq/L) = ${deficit} / 0.513 = ${volNacl3} mL`
        ]
      };
    }
  }
];
