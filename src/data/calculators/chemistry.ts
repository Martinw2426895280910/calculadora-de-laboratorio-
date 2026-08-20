import { FormulaDefinition, CalculationResult } from '../../types/laboratory';

export const CHEMISTRY_CALCULATORS: FormulaDefinition[] = [
  {
    id: 'ckd_epi_2021',
    category: 'quimica_clinica',
    name: 'Tasa de Filtración Glomerular Estimada (eGFR CKD-EPI 2021)',
    shortName: 'eGFR CKD-EPI 2021',
    formulaEquation: 'eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^-1.200 × 0.9938^Edad × (1.012 si mujer)',
    formulaDisplay: 'Ecuación oficial KDIGO / NKF 2021 (sin variable de raza):\n- Mujeres: κ = 0.7, α = -0.241, factor = 1.012\n- Hombres: κ = 0.9, α = -0.302, factor = 1.000',
    description: 'Estándar internacional recomendado por KDIGO para estimar la función renal a partir de creatinina sérica estandarizada por IDMS, edad y sexo.',
    clinicalSignificance: 'Clasificación de Enfermedad Renal Crónica (ERC):\n- G1: ≥ 90 mL/min/1.73m² (Normal/Alto)\n- G2: 60-89 (Levemente disminuido)\n- G3a: 45-59 (Disminución leve a moderada)\n- G3b: 30-44 (Disminución moderada a severa)\n- G4: 15-29 (Disminución severa)\n- G5: < 15 (Falla renal terminal)',
    tags: ['ckd-epi', 'egfr', 'filtrado glomerular', 'creatinina', 'renal', 'kdigo'],
    inputs: [
      { id: 'creatinine', name: 'Creatinina Sérica', symbol: 'Scr', unit: 'mg/dL', defaultValue: 1.0, min: 0.2, max: 20, step: 0.05 },
      { id: 'age', name: 'Edad del paciente', symbol: 'Edad', unit: 'años', defaultValue: 55, min: 18, max: 120, step: 1 },
      { id: 'gender', name: 'Sexo biológico', symbol: 'Sexo', unit: '', type: 'select', options: ['Masculino', 'Femenino'], defaultValue: 'Masculino' }
    ],
    calculate: (inputs) => {
      const scr = Number(inputs.creatinine);
      const age = Number(inputs.age);
      const isFemale = inputs.gender === 'Femenino';

      if (!scr || !age || scr <= 0 || age < 18) {
        return { results: [], interpretation: 'La ecuación CKD-EPI 2021 aplica para adultos ≥ 18 años con creatinina válida.' };
      }

      const kappa = isFemale ? 0.7 : 0.9;
      const alpha = isFemale ? -0.241 : -0.302;
      const genderFactor = isFemale ? 1.012 : 1.0;

      const scrDividedByKappa = scr / kappa;
      const minVal = Math.min(scrDividedByKappa, 1);
      const maxVal = Math.max(scrDividedByKappa, 1);

      const egfr = Math.round(
        142 *
        Math.pow(minVal, alpha) *
        Math.pow(maxVal, -1.200) *
        Math.pow(0.9938, age) *
        genderFactor
      );

      let stage = '';
      let status: 'normal' | 'low' | 'critical-low' = 'normal';

      if (egfr >= 90) {
        stage = 'Estadio G1: Función renal normal o alta (≥ 90 mL/min/1.73m²)';
        status = 'normal';
      } else if (egfr >= 60) {
        stage = 'Estadio G2: Función renal levemente disminuida (60 - 89 mL/min/1.73m²)';
        status = 'normal';
      } else if (egfr >= 45) {
        stage = 'Estadio G3a: Disminución leve a moderada (45 - 59 mL/min/1.73m²)';
        status = 'low';
      } else if (egfr >= 30) {
        stage = 'Estadio G3b: Disminución moderada a severa (30 - 44 mL/min/1.73m²)';
        status = 'low';
      } else if (egfr >= 15) {
        stage = 'Estadio G4: Disminución severa (15 - 29 mL/min/1.73m²)';
        status = 'critical-low';
      } else {
        stage = 'Estadio G5: Falla renal terminal / Uremia (< 15 mL/min/1.73m²)';
        status = 'critical-low';
      }

      return {
        results: [
          { id: 'egfr', name: 'Filtrado Glomerular Estimado (eGFR)', value: egfr, unit: 'mL/min/1.73 m²', referenceRange: '≥ 90 mL/min/1.73 m²', status, statusLabel: stage }
        ],
        interpretation: `Resultado: ${egfr} mL/min/1.73m². Clasificación KDIGO: ${stage}. ${egfr < 60 ? 'Se recomienda correlacionar con albuminuria (ACR) y evaluar progresión.' : 'Función conservada.'}`,
        steps: [
          `κ = ${kappa}, α = ${alpha}, Factor sexo = ${genderFactor}`,
          `eGFR = 142 × min(${scr}/${kappa}, 1)^(${alpha}) × max(${scr}/${kappa}, 1)^(-1.2) × 0.9938^${age} × ${genderFactor} = ${egfr} mL/min/1.73m²`
        ]
      };
    }
  },
  {
    id: 'cockcroft_gault',
    category: 'quimica_clinica',
    name: 'Aclaramiento de Creatinina Estimado (Cockcroft-Gault)',
    shortName: 'Cockcroft-Gault (CrCl)',
    formulaEquation: 'CrCl = [ (140 - Edad) × Peso (kg) ] / [ 72 × Creatinina (mg/dL) ] × (0.85 si mujer)',
    formulaDisplay: 'CrCl (mL/min) = [ (140 - Edad) × Peso (kg) ] / [ 72 × Scr (mg/dL) ] × (0.85 en mujeres)',
    description: 'Fórmula clásica para la estimación de aclaramiento de creatinina, ampliamente utilizada para el ajuste de dosis farmacológicas según ficha técnica.',
    clinicalSignificance: 'Estándar para ajuste de antibióticos (vancomicina, aminoglucósidos), anticoagulantes orales directos (DOACs) y quimioterápicos.',
    tags: ['cockcroft', 'crcl', 'ajuste de dosis', 'farmacia clinica', 'creatinina'],
    inputs: [
      { id: 'age', name: 'Edad del paciente', symbol: 'Edad', unit: 'años', defaultValue: 60, min: 18, max: 110, step: 1 },
      { id: 'weight', name: 'Peso corporal', symbol: 'Peso', unit: 'kg', defaultValue: 70, min: 25, max: 250, step: 0.5 },
      { id: 'creatinine', name: 'Creatinina Sérica', symbol: 'Scr', unit: 'mg/dL', defaultValue: 1.2, min: 0.2, max: 20, step: 0.05 },
      { id: 'gender', name: 'Sexo', symbol: 'Sexo', unit: '', type: 'select', options: ['Masculino', 'Femenino'], defaultValue: 'Masculino' }
    ],
    calculate: (inputs) => {
      const age = Number(inputs.age);
      const weight = Number(inputs.weight);
      const scr = Number(inputs.creatinine);
      const isFemale = inputs.gender === 'Femenino';

      if (!age || !weight || !scr || scr <= 0) {
        return { results: [], interpretation: 'Ingrese datos válidos de edad, peso y creatinina.' };
      }

      let crcl = ((140 - age) * weight) / (72 * scr);
      if (isFemale) {
        crcl *= 0.85;
      }
      crcl = Number(crcl.toFixed(1));

      return {
        results: [
          { id: 'crcl', name: 'Aclaramiento de Creatinina (CrCl)', value: crcl, unit: 'mL/min', referenceRange: '90 - 130 mL/min (H), 80 - 125 mL/min (M)', status: crcl < 60 ? 'low' : 'normal' }
        ],
        interpretation: `Aclaramiento estimado de Cockcroft-Gault: ${crcl} mL/min. Utilice este valor para verificar tablas de dosificación y guías farmacológicas de medicamentos de eliminación renal.`,
        steps: [
          `CrCl = [ (140 - ${age}) × ${weight} ] / [ 72 × ${scr} ] ${isFemale ? '× 0.85' : ''} = ${crcl} mL/min`
        ]
      };
    }
  },
  {
    id: 'osmolaridad_serica',
    category: 'quimica_clinica',
    name: 'Osmolaridad Sérica Calculada y Brecha Osmolar (Osmolar Gap)',
    shortName: 'Osmolaridad & Osmolar Gap',
    formulaEquation: 'Osm Calculada = 2 × Na + (Glucosa / 18) + (BUN / 2.8) | Gap = Osm Medida - Osm Calculada',
    formulaDisplay: 'Osmolaridad Calculada (mOsm/kg) = 2 × Na⁺ (mEq/L) + [ Glucosa (mg/dL) / 18 ] + [ BUN (mg/dL) / 2.8 ]\n*Si usa Urea (mg/dL): Urea / 6.0\nBrecha Osmolar (Gap) = Osmolaridad Medida (osmómetro) - Osmolaridad Calculada',
    description: 'Calcula la osmolaridad plasmática efectiva e identifica la presencia de solutos osmóticamente activos no medidos (brecha osmolar).',
    clinicalSignificance: 'Brecha osmolar > 10 mOsm/kg indica presencia de sustancias tóxicas o exógenas como Metanol, Etilenglicol, Isopropanol, Manitol, Acetona o Etanol.',
    tags: ['osmolaridad', 'osmolar gap', 'toxicologia', 'metanol', 'electrolitos', 'cetoacidosis'],
    inputs: [
      { id: 'na', name: 'Sodio Sérico (Na+)', symbol: 'Na⁺', unit: 'mEq/L', defaultValue: 140, min: 90, max: 180, step: 1 },
      { id: 'glucose', name: 'Glucosa', symbol: 'Glucosa', unit: 'mg/dL', defaultValue: 100, min: 10, max: 1500, step: 1 },
      { id: 'bun', name: 'BUN (o Urea / 2.14)', symbol: 'BUN', unit: 'mg/dL', defaultValue: 14, min: 1, max: 200, step: 1 },
      { id: 'measured_osm', name: 'Osmolaridad Medida (Osmómetro, opcional)', symbol: 'Osm Medida', unit: 'mOsm/kg', defaultValue: 290, min: 200, max: 500, step: 1 }
    ],
    calculate: (inputs) => {
      const na = Number(inputs.na);
      const gluc = Number(inputs.glucose);
      const bun = Number(inputs.bun);
      const measured = Number(inputs.measured_osm);

      if (!na || !gluc || !bun) {
        return { results: [], interpretation: 'Ingrese Sodio, Glucosa y BUN para el cálculo.' };
      }

      const calcOsm = Number((2 * na + gluc / 18 + bun / 2.8).toFixed(1));
      const results: CalculationResult[] = [
        { id: 'calc_osm', name: 'Osmolaridad Sérica Calculada', value: calcOsm, unit: 'mOsm/kg', referenceRange: '275 - 295 mOsm/kg', status: calcOsm > 295 ? 'high' : calcOsm < 275 ? 'low' : 'normal' }
      ];

      let interp = `Osmolaridad Calculada: ${calcOsm} mOsm/kg. `;

      if (measured) {
        const gap = Number((measured - calcOsm).toFixed(1));
        const gapStatus = gap > 10 ? 'critical-high' : 'normal';
        results.push({
          id: 'osm_gap',
          name: 'Brecha Osmolar (Osmolar Gap)',
          value: gap,
          unit: 'mOsm/kg',
          referenceRange: '< 10 mOsm/kg',
          status: gapStatus as any,
          statusLabel: gap > 10 ? 'Brecha Osmolar Elevada (> 10)' : 'Normal (< 10)'
        });

        if (gap > 10) {
          interp += `⚠️ ALERTA: Brecha Osmolar ELEVADA (${gap} mOsm/kg). Sospechar intoxicación por alcoholes tóxicos (Metanol, Etilenglicol), administración de Manitol o cetoacidosis severa.`;
        } else {
          interp += `Brecha Osmolar normal (${gap} mOsm/kg). No sugiere presencia significativa de osmoles exógenos no medidos.`;
        }
      }

      return {
        results,
        interpretation: interp,
        steps: [
          `Osm Calculada = (2 × ${na}) + (${gluc} / 18) + (${bun} / 2.8) = ${calcOsm} mOsm/kg`,
          measured ? `Osmolar Gap = ${measured} (medida) - ${calcOsm} (calculada) = ${(measured - calcOsm).toFixed(1)} mOsm/kg` : ''
        ].filter(Boolean)
      };
    }
  },
  {
    id: 'superficie_corporal',
    category: 'quimica_clinica',
    name: 'Superficie Corporal (Ecuaciones de Mosteller y DuBois)',
    shortName: 'Superficie Corporal (BSA)',
    formulaEquation: 'Mosteller: BSA = √[ (Peso × Altura) / 3600 ] | DuBois: 0.007184 × Peso^0.425 × Altura^0.725',
    formulaDisplay: 'Mosteller BSA (m²) = √ [ Peso (kg) × Altura (cm) / 3600 ]\nDuBois BSA (m²) = 0.007184 × Peso^0.425 × Altura^0.725',
    description: 'Calcula el área de superficie corporal requerida para indexar depuraciones renales (mL/min/1.73m²), dosis oncológicas e índices cardíacos.',
    clinicalSignificance: 'El valor promedio estándar en adultos es 1.73 m². Es indispensable para corregir la depuración de creatinina en orina de 24h.',
    tags: ['superficie corporal', 'bsa', 'mosteller', 'dubois', 'antropometria'],
    inputs: [
      { id: 'weight', name: 'Peso corporal', symbol: 'Peso', unit: 'kg', defaultValue: 70, min: 2, max: 250, step: 0.5 },
      { id: 'height', name: 'Altura / Talla', symbol: 'Altura', unit: 'cm', defaultValue: 170, min: 30, max: 240, step: 1 }
    ],
    calculate: (inputs) => {
      const w = Number(inputs.weight);
      const h = Number(inputs.height);

      if (!w || !h) {
        return { results: [], interpretation: 'Ingrese peso en kg y altura en cm.' };
      }

      const mosteller = Number(Math.sqrt((w * h) / 3600).toFixed(2));
      const dubois = Number((0.007184 * Math.pow(w, 0.425) * Math.pow(h, 0.725)).toFixed(2));
      const imc = Number((w / Math.pow(h / 100, 2)).toFixed(1));

      return {
        results: [
          { id: 'bsa_mosteller', name: 'Superficie Corporal (Mosteller)', value: mosteller, unit: 'm²', referenceRange: '1.60 - 1.90 m² (media 1.73)', status: 'info' },
          { id: 'bsa_dubois', name: 'Superficie Corporal (DuBois & DuBois)', value: dubois, unit: 'm²', referenceRange: '1.60 - 1.90 m²', status: 'info' },
          { id: 'bmi', name: 'Índice de Masa Corporal (IMC)', value: imc, unit: 'kg/m²', referenceRange: '18.5 - 24.9 kg/m²', status: imc > 25 ? 'high' : imc < 18.5 ? 'low' : 'normal' }
        ],
        interpretation: `Superficie Corporal calculada: ${mosteller} m² (Mosteller) / ${dubois} m² (DuBois). Factor de corrección para depuración renal: (1.73 / ${mosteller}) = ${(1.73 / mosteller).toFixed(2)}.`,
        steps: [
          `Mosteller = √[ (${w} × ${h}) / 3600 ] = ${mosteller} m²`,
          `DuBois = 0.007184 × ${w}^0.425 × ${h}^0.725 = ${dubois} m²`,
          `IMC = ${w} / (${(h/100).toFixed(2)})² = ${imc} kg/m²`
        ]
      };
    }
  },
  {
    id: 'aclaramiento_creatinina_24h',
    category: 'quimica_clinica',
    name: 'Depuración de Creatinina en Orina de 24 Horas',
    shortName: 'Depuración Creatinina 24h',
    formulaEquation: 'CrCl = [ Ucr (mg/dL) × Vol (mL) ] / [ Pcr (mg/dL) × 1440 min ] × (1.73 / SC)',
    formulaDisplay: 'CrCl Medido (mL/min) = [ Creatinina Urinaria (mg/dL) × Volumen 24h (mL) ] / [ Creatinina Sérica (mg/dL) × 1440 min ]\nCrCl Corregido por SC = CrCl Medido × ( 1.73 / Superficie Corporal m² )',
    description: 'Método directo cuantitativo de depuración renal de creatinina en muestra de orina recolectada cronometrada de 24 horas.',
    clinicalSignificance: 'Mide con exactitud el aclaramiento renal real, independientemente de fórmulas teóricas, útil en amputados, masa muscular atípica o desnutrición severa.',
    tags: ['depuracion creatinina', 'orina 24h', 'clearance', 'superficie corporal', 'renal'],
    inputs: [
      { id: 'u_cr', name: 'Creatinina en Orina de 24h', symbol: 'Ucr', unit: 'mg/dL', defaultValue: 100, min: 5, max: 500, step: 1 },
      { id: 'u_vol', name: 'Volumen de Orina recolectado en 24h', symbol: 'Vol 24h', unit: 'mL', defaultValue: 1500, min: 100, max: 10000, step: 50 },
      { id: 'p_cr', name: 'Creatinina Sérica (en sangre)', symbol: 'Pcr', unit: 'mg/dL', defaultValue: 1.0, min: 0.2, max: 20, step: 0.05 },
      { id: 'bsa', name: 'Superficie Corporal del paciente (SC)', symbol: 'SC', unit: 'm²', defaultValue: 1.73, min: 0.5, max: 3.5, step: 0.01 }
    ],
    calculate: (inputs) => {
      const ucr = Number(inputs.u_cr);
      const vol = Number(inputs.u_vol);
      const pcr = Number(inputs.p_cr);
      const bsa = Number(inputs.bsa) || 1.73;

      if (!ucr || !vol || !pcr || pcr <= 0) {
        return { results: [], interpretation: 'Ingrese Creatinina urinaria, volumen de 24h y creatinina sérica.' };
      }

      const crclRaw = Number(((ucr * vol) / (pcr * 1440)).toFixed(1));
      const crclCorr = Number((crclRaw * (1.73 / bsa)).toFixed(1));
      const excretionTotal = Number(((ucr * vol) / 100).toFixed(0)); // mg/24h

      return {
        results: [
          { id: 'crcl_corr', name: 'Depuración de Creatinina Corregida (1.73m²)', value: crclCorr, unit: 'mL/min/1.73 m²', referenceRange: '90 - 130 mL/min (H), 80 - 125 mL/min (M)', status: crclCorr < 60 ? 'low' : 'normal' },
          { id: 'crcl_raw', name: 'Depuración No Corregida', value: crclRaw, unit: 'mL/min', status: 'info' },
          { id: 'excretion_total', name: 'Creatininuria Total 24h', value: excretionTotal, unit: 'mg/24h', referenceRange: '1000 - 2000 mg/24h (H), 800 - 1800 mg/24h (M)' }
        ],
        interpretation: `Depuración corregida por superficie corporal: ${crclCorr} mL/min/1.73m². Excreción total de creatinina: ${excretionTotal} mg/24h (permite verificar si la recolección fue adecuada: 15-25 mg/kg/día).`,
        steps: [
          `CrCl Medido = (${ucr} × ${vol}) / (${pcr} × 1440) = ${crclRaw} mL/min`,
          `CrCl Corregido = ${crclRaw} × (1.73 / ${bsa}) = ${crclCorr} mL/min/1.73m²`
        ]
      };
    }
  }
];
