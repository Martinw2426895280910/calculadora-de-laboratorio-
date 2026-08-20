import { FormulaDefinition } from '../../types/laboratory';

export const URINE_CALCULATORS: FormulaDefinition[] = [
  {
    id: 'fena_excrecion_fraccional_sodio',
    category: 'orina',
    name: 'Excreción Fraccional de Sodio (FENa)',
    shortName: 'FENa (Falla Renal)',
    formulaEquation: 'FENa (%) = [ (Na Urinario × Creatinina Sérica) / (Na Sérico × Creatinina Urinaria) ] × 100',
    formulaDisplay: 'FENa (%) = [ ( Na_u × Cr_s ) / ( Na_s × Cr_u ) ] × 100',
    description: 'Diferencia la Falla Renal Aguda de origen prerrenal (hipoperfusión) de la Necrosis Tubular Aguda intrínseca (NTA).',
    clinicalSignificance: 'Interpretación en fracaso renal agudo oligúrico:\n- FENa < 1.0%: Etiología Prerrenal (túbulo renal ávido por reabsorber sodio ante hipovolemia o hipoperfusión).\n- FENa 1.0 - 2.0%: Zona intermedia / Indeterminada.\n- FENa > 2.0%: Necrosis Tubular Aguda (NTA) o daño parenquimatoso intrínseco (incapacidad tubular de concentrar y reabsorber sodio).\n*Nota: Si el paciente está recibiendo diuréticos, el FENa pierde validez; use FEUrea en su lugar.',
    tags: ['fena', 'sodio urinario', 'falla renal aguda', 'prerrenal', 'necrosis tubular', 'nefrologia'],
    inputs: [
      { id: 'na_u', name: 'Sodio en Orina (Na_u)', symbol: 'Na_u', unit: 'mEq/L (mmol/L)', defaultValue: 15, min: 1, max: 300, step: 1 },
      { id: 'na_s', name: 'Sodio Sérico (Na_s)', symbol: 'Na_s', unit: 'mEq/L (mmol/L)', defaultValue: 138, min: 90, max: 180, step: 1 },
      { id: 'cr_s', name: 'Creatinina Sérica (Cr_s)', symbol: 'Cr_s', unit: 'mg/dL', defaultValue: 2.4, min: 0.2, max: 20, step: 0.1 },
      { id: 'cr_u', name: 'Creatinina en Orina (Cr_u)', symbol: 'Cr_u', unit: 'mg/dL', defaultValue: 120, min: 5, max: 600, step: 1 }
    ],
    calculate: (inputs) => {
      const nau = Number(inputs.na_u);
      const nas = Number(inputs.na_s);
      const crs = Number(inputs.cr_s);
      const cru = Number(inputs.cr_u);

      if (!nau || !nas || !crs || !cru || nas <= 0 || cru <= 0) {
        return { results: [], interpretation: 'Ingrese todos los electrolitos y creatininas en suero y orina.' };
      }

      const fena = Number((((nau * crs) / (nas * cru)) * 100).toFixed(2));

      let status: 'low' | 'normal' | 'high' = 'normal';
      let label = '';
      let interp = '';

      if (fena < 1.0) {
        status = 'low';
        label = 'FENa < 1.0% (Patrón Prerrenal)';
        interp = 'FENa < 1.0%: Fuerte evidencia de Insuficiencia Renal Aguda Prerrenal (hipovolemia, deshidratación, insuficiencia cardíaca, cirrosis). Los túbulos renales conservan su capacidad de reabsorción.';
      } else if (fena <= 2.0) {
        status = 'normal';
        label = 'FENa 1.0 - 2.0% (Zona Indeterminada)';
        interp = 'FENa en rango intermedio (1.0 - 2.0%). Puede corresponder a glomerulonefritis aguda, nefropatía obstructiva o fase de transición.';
      } else {
        status = 'high';
        label = 'FENa > 2.0% (Necrosis Tubular Aguda / Renal)';
        interp = 'FENa > 2.0%: Diagnóstico compatible con Daño Renal Intrínseco / Necrosis Tubular Aguda (NTA isquémica o nefrotóxica). Hay pérdida de la integridad de reabsorción tubular de sodio.';
      }

      return {
        results: [
          { id: 'fena', name: 'Excreción Fraccional de Sodio (FENa)', value: fena, unit: '%', referenceRange: '< 1.0% (Prerrenal) | > 2.0% (NTA/Intrínseca)', status, statusLabel: label }
        ],
        interpretation: interp,
        steps: [
          `FENa = [ (${nau} × ${crs}) / (${nas} × ${cru}) ] × 100 = [ ${(nau * crs).toFixed(1)} / ${(nas * cru).toFixed(1)} ] × 100 = ${fena}%`
        ]
      };
    }
  },
  {
    id: 'fe_urea_excrecion_fraccional',
    category: 'orina',
    name: 'Excreción Fraccional de Urea (FEUrea)',
    shortName: 'FEUrea (Uso con Diuréticos)',
    formulaEquation: 'FEUrea (%) = [ (Urea Urinaria × Creatinina Sérica) / (Urea Sérica × Creatinina Urinaria) ] × 100',
    formulaDisplay: 'FEUrea (%) = [ ( Urea_u × Cr_s ) / ( Urea_s × Cr_u ) ] × 100\n*También aplicable usando BUN_u y BUN_s en las mismas unidades.',
    description: 'Prueba de elección para diferenciar azotemia prerrenal de NTA cuando el paciente ha recibido tratamiento diurético.',
    clinicalSignificance: 'Los diuréticos actúan aumentando la natriuresis (invalida el FENa), pero el transporte de urea en el túbulo proximal permanece dependiente del flujo: FEUrea < 35% indica causa prerrenal; FEUrea > 50% indica daño tubular intrínseco.',
    tags: ['feurea', 'urea', 'diureticos', 'falla renal', 'furosemida', 'nefrologia'],
    inputs: [
      { id: 'urea_u', name: 'Urea (o BUN) en Orina', symbol: 'Urea_u', unit: 'mg/dL', defaultValue: 800, min: 10, max: 4000, step: 10 },
      { id: 'urea_s', name: 'Urea (o BUN) Sérica', symbol: 'Urea_s', unit: 'mg/dL', defaultValue: 75, min: 5, max: 400, step: 1 },
      { id: 'cr_s', name: 'Creatinina Sérica', symbol: 'Cr_s', unit: 'mg/dL', defaultValue: 2.2, min: 0.2, max: 20, step: 0.1 },
      { id: 'cr_u', name: 'Creatinina en Orina', symbol: 'Cr_u', unit: 'mg/dL', defaultValue: 110, min: 5, max: 600, step: 1 }
    ],
    calculate: (inputs) => {
      const uu = Number(inputs.urea_u);
      const us = Number(inputs.urea_s);
      const crs = Number(inputs.cr_s);
      const cru = Number(inputs.cr_u);

      if (!uu || !us || !crs || !cru || us <= 0 || cru <= 0) {
        return { results: [], interpretation: 'Complete todos los valores de urea y creatinina.' };
      }

      const feurea = Number((((uu * crs) / (us * cru)) * 100).toFixed(1));

      let status: 'low' | 'normal' | 'high' = 'normal';
      let label = '';
      let interp = '';

      if (feurea < 35.0) {
        status = 'low';
        label = 'FEUrea < 35% (Patrón Prerrenal)';
        interp = 'FEUrea < 35%: Causa Prerrenal confirmada, incluso en presencia de tratamiento con diuréticos de asa o tiazidas.';
      } else if (feurea <= 50.0) {
        status = 'normal';
        label = 'FEUrea 35 - 50% (Zona Indeterminada)';
        interp = 'FEUrea intermedia. Correlacionar con sedimento urinario y evolución clínica.';
      } else {
        status = 'high';
        label = 'FEUrea > 50% (Necrosis Tubular Aguda)';
        interp = 'FEUrea > 50%: Sugiere Daño Tubular Renal Intrínseco (NTA).';
      }

      return {
        results: [
          { id: 'feurea', name: 'Excreción Fraccional de Urea (FEUrea)', value: feurea, unit: '%', referenceRange: '< 35% (Prerrenal) | > 50% (NTA)', status, statusLabel: label }
        ],
        interpretation: interp,
        steps: [
          `FEUrea = [ (${uu} × ${crs}) / (${us} × ${cru}) ] × 100 = ${feurea}%`
        ]
      };
    }
  },
  {
    id: 'uacr_albumina_creatinina_orina',
    category: 'orina',
    name: 'Cociente Albúmina / Creatinina en Orina (ACR / UACR)',
    shortName: 'ACR (Microalbuminuria)',
    formulaEquation: 'ACR (mg/g) = [ Albúmina urinaria (mg/L) / Creatinina urinaria (g/L) ] o [ Alb (mg/dL) / Cr (mg/dL) ] × 1000',
    formulaDisplay: 'ACR (mg/g de creatinina) = [ Albúmina en orina (mg/L) / Creatinina en orina (g/L) ]\n*Equivalente a mg de albúmina por gramo de creatinina.',
    description: 'Gold standard para la detección temprana y seguimiento de nefropatía diabética, daño renal hipertenso y estratificación de riesgo cardiovascular.',
    clinicalSignificance: 'Clasificación KDIGO de Albuminuria:\n- A1: < 30 mg/g (Normal a levemente incrementada / Normoalbuminuria)\n- A2: 30 - 300 mg/g (Microalbuminuria / Aumento moderado)\n- A3: > 300 mg/g (Macroalbuminuria / Aumento severo o rango nefrótico si > 2200 mg/g).',
    tags: ['acr', 'uacr', 'microalbuminuria', 'diabetes', 'nefropatia', 'orina'],
    inputs: [
      { id: 'alb_u', name: 'Albúmina en Orina (muestra matutina/al azar)', symbol: 'Alb_u', unit: 'mg/L (o µg/mL)', defaultValue: 45, min: 0.1, max: 10000, step: 0.5 },
      { id: 'cr_u_mgdl', name: 'Creatinina en Orina', symbol: 'Cr_u', unit: 'mg/dL', defaultValue: 100, min: 5, max: 600, step: 1 }
    ],
    calculate: (inputs) => {
      const albu = Number(inputs.alb_u);
      const cruMgdl = Number(inputs.cr_u_mgdl);

      if (!albu || !cruMgdl || cruMgdl <= 0) {
        return { results: [], interpretation: 'Ingrese la concentración de albúmina y creatinina en orina.' };
      }

      // Convert Cr de mg/dL a g/L: mg/dL * 0.01 = g/L
      const cruGl = cruMgdl / 100;
      const acr = Number((albu / cruGl).toFixed(1)); // mg/g
      const acrSi = Number((acr * 0.113).toFixed(2)); // mg/mmol

      let status: 'normal' | 'high' | 'critical-high' = 'normal';
      let category = '';
      let interp = '';

      if (acr < 30) {
        status = 'normal';
        category = 'A1: Normoalbuminuria (< 30 mg/g)';
        interp = 'ACR normal (< 30 mg/g). Sin evidencia de daño endotelial o glomerular significativo.';
      } else if (acr <= 300) {
        status = 'high';
        category = 'A2: Microalbuminuria / Daño Leve-Moderado (30 - 300 mg/g)';
        interp = 'Microalbuminuria confirmada (30 - 300 mg/g). Indica nefropatía incipiente, riesgo cardiovascular incrementado y daño en la barrera de filtración glomerular. Iniciar o ajustar IECA/ARA-II/iSGLT2.';
      } else {
        status = 'critical-high';
        category = 'A3: Macroalbuminuria / Daño Severo (> 300 mg/g)';
        interp = 'Macroalbuminuria (> 300 mg/g). Daño renal establecido con alta tasa de progresión a insuficiencia renal crónica.';
      }

      return {
        results: [
          { id: 'acr', name: 'Cociente Albúmina / Creatinina (ACR)', value: acr, unit: 'mg/g de creatinina', referenceRange: '< 30 mg/g (A1)', status, statusLabel: category },
          { id: 'acr_si', name: 'ACR en Unidades SI', value: acrSi, unit: 'mg/mmol', referenceRange: '< 3.0 mg/mmol', status }
        ],
        interpretation: interp,
        steps: [
          `Creatinina urinaria = ${cruMgdl} mg/dL = ${cruGl} g/L`,
          `ACR = ${albu} mg/L / ${cruGl} g/L = ${acr} mg/g`,
          `ACR (SI) = ${acr} × 0.113 = ${acrSi} mg/mmol`
        ]
      };
    }
  },
  {
    id: 'upcr_proteina_creatinina_orina',
    category: 'orina',
    name: 'Cociente Proteínas Totales / Creatinina en Orina (UPCR)',
    shortName: 'UPCR (Proteinuria en muestra aislada)',
    formulaEquation: 'UPCR = Proteínas Urinarias (mg/dL) / Creatinina Urinaria (mg/dL)',
    formulaDisplay: 'UPCR (mg/mg o g/g) = Proteínas en orina (mg/dL) / Creatinina en orina (mg/dL)\n*Estima la proteinuria en 24 horas: Excreción ≈ UPCR × 1.0 a 1.2 g/24h',
    description: 'Excelente correlación con la recolección de 24 horas de proteínas sin los errores de recolección temporal.',
    clinicalSignificance: 'Normal: < 0.20 mg/mg (< 200 mg/g). Proteinuria significativa: 0.2 - 2.0 mg/mg. Rango nefrótico: > 3.0 - 3.5 mg/mg (equivalente a > 3.5 g/24h).',
    tags: ['upcr', 'proteinuria', 'sindrome nefrotico', 'preeclampsia', 'embarazo'],
    inputs: [
      { id: 'prot_u', name: 'Proteínas en Orina al azar', symbol: 'Prot_u', unit: 'mg/dL', defaultValue: 30, min: 1, max: 2000, step: 1 },
      { id: 'cr_u', name: 'Creatinina en Orina', symbol: 'Cr_u', unit: 'mg/dL', defaultValue: 100, min: 5, max: 600, step: 1 }
    ],
    calculate: (inputs) => {
      const pu = Number(inputs.prot_u);
      const cru = Number(inputs.cr_u);

      if (!pu || !cru || cru <= 0) {
        return { results: [], interpretation: 'Ingrese proteínas y creatinina en orina.' };
      }

      const upcr = Number((pu / cru).toFixed(2));
      const est24h = Number((upcr * 1000).toFixed(0)); // mg/24h aprox

      let status: 'normal' | 'high' | 'critical-high' = 'normal';
      let label = 'Normal (< 0.20 mg/mg)';
      let interp = '';

      if (upcr < 0.2) {
        status = 'normal';
        interp = 'UPCR normal. Excreción proteica estimada < 200 mg/24h.';
      } else if (upcr < 3.0) {
        status = 'high';
        label = 'Proteinuria No Nefrótica (0.20 - 2.99 mg/mg)';
        interp = `Proteinuria moderada presente (estimada ≈ ${est24h} mg/24h). Descartar preeclampsia en embarazadas (UPCR ≥ 0.3), nefritis o nefropatía secundaria.`;
      } else {
        status = 'critical-high';
        label = 'Proteinuria en Rango Nefrótico (≥ 3.0 mg/mg)';
        interp = `Proteinuria masiva en rango nefrótico (estimada ≈ ${(est24h/1000).toFixed(1)} g/24h). Alto riesgo de hipoalbuminemia, edemas/anasarca y trombosis.`;
      }

      return {
        results: [
          { id: 'upcr', name: 'Cociente Proteína / Creatinina (UPCR)', value: upcr, unit: 'mg/mg (o g/g)', referenceRange: '< 0.20 mg/mg', status, statusLabel: label },
          { id: 'est_24h', name: 'Proteinuria Estimada en 24h', value: est24h, unit: 'mg/24h aprox', referenceRange: '< 150 mg/24h', status }
        ],
        interpretation: interp,
        steps: [
          `UPCR = ${pu} mg/dL / ${cru} mg/dL = ${upcr} mg/mg`,
          `Estimación de 24 horas ≈ ${upcr} × 1000 = ${est24h} mg/24h`
        ]
      };
    }
  }
];
