import { FormulaDefinition } from '../../types/laboratory';

export const HEMATOLOGY_CALCULATORS: FormulaDefinition[] = [
  {
    id: 'indices_hematimetricos',
    category: 'hematologia',
    name: 'Índices Hematimétricos Primarios (VCM, HCM, CHCM)',
    shortName: 'VCM / HCM / CHCM',
    formulaEquation: 'VCM = (Hto × 10) / GR | HCM = (Hb × 10) / GR | CHCM = (Hb × 100) / Hto',
    formulaDisplay: 'VCM = (Hto % × 10) / GR (10⁶/µL)\nHCM = (Hb g/dL × 10) / GR (10⁶/µL)\nCHCM = (Hb g/dL × 100) / Hto %',
    description: 'Calcula el tamaño (VCM), contenido de hemoglobina (HCM) y concentración media de hemoglobina (CHCM) por eritrocito.',
    clinicalSignificance: 'Permite la clasificación morfológica de las anemias en microcíticas (<80 fL), normocíticas (80-100 fL) o macrocíticas (>100 fL), e hipocrómicas o normocrómicas.',
    tags: ['hematimetria', 'vcm', 'hcm', 'chcm', 'anemia', 'eritrocitos'],
    inputs: [
      { id: 'hb', name: 'Hemoglobina (Hb)', symbol: 'Hb', unit: 'g/dL', defaultValue: 14.0, min: 2, max: 25, step: 0.1 },
      { id: 'hto', name: 'Hematocrito (Hto)', symbol: 'Hto', unit: '%', defaultValue: 42.0, min: 5, max: 75, step: 0.1 },
      { id: 'gr', name: 'Glóbulos Rojos (Eritrocitos)', symbol: 'GR', unit: '×10⁶/µL (millones/mm³)', defaultValue: 4.80, min: 0.5, max: 10, step: 0.01 }
    ],
    calculate: (inputs) => {
      const hb = Number(inputs.hb);
      const hto = Number(inputs.hto);
      const gr = Number(inputs.gr);

      if (!hb || !hto || !gr || gr <= 0 || hto <= 0) {
        return {
          results: [],
          interpretation: 'Ingrese valores válidos para Hemoglobina, Hematocrito y Glóbulos Rojos.'
        };
      }

      const vcm = Number(((hto * 10) / gr).toFixed(1));
      const hcm = Number(((hb * 10) / gr).toFixed(1));
      const chcm = Number(((hb * 100) / hto).toFixed(1));

      let vcmStatus: 'low' | 'normal' | 'high' = 'normal';
      let vcmLabel = 'Normocitosis (80-100 fL)';
      if (vcm < 80) { vcmStatus = 'low'; vcmLabel = 'Microcitosis (< 80 fL)'; }
      else if (vcm > 100) { vcmStatus = 'high'; vcmLabel = 'Macrocitosis (> 100 fL)'; }

      let hcmStatus: 'low' | 'normal' | 'high' = 'normal';
      let hcmLabel = 'Normocromía (27-33 pg)';
      if (hcm < 27) { hcmStatus = 'low'; hcmLabel = 'Hipocromía (< 27 pg)'; }
      else if (hcm > 33) { hcmStatus = 'high'; hcmLabel = 'Hipercromía (> 33 pg)'; }

      let chcmStatus: 'low' | 'normal' | 'high' = 'normal';
      let chcmLabel = 'Normal (32-36 g/dL)';
      if (chcm < 32) { chcmStatus = 'low'; chcmLabel = 'Hipocromía (< 32 g/dL)'; }
      else if (chcm > 36) { chcmStatus = 'high'; chcmLabel = 'Esferocitosis / Crioaglutininas (> 36 g/dL)'; }

      let conclusion = '';
      if (vcm < 80 && hcm < 27) {
        conclusion = 'Patrón Microcítico Hipocrómico: Sugiere Anemia Ferropénica, Talasemia menor o Anemia de Enfermedades Crónicas en fase tardía.';
      } else if (vcm > 100) {
        conclusion = 'Patrón Macrocítico: Sugiere déficit de Vitamina B12 o Ácido Fólico (Megaloblástica), hepatopatía, hipotiroidismo o reticulocitosis marcada.';
      } else if (vcm >= 80 && vcm <= 100 && hcm >= 27) {
        conclusion = 'Patrón Normocítico Normocrómico: Sugiere Anemia de Enfermedades Crónicas, hemorragia aguda, anemia hemolítica o aplasia medular.';
      } else {
        conclusion = 'Índices dentro de rangos normales de referencia.';
      }

      return {
        results: [
          { id: 'vcm', name: 'Volumen Corpuscular Medio (VCM)', value: vcm, unit: 'fL', referenceRange: '80.0 - 100.0 fL', status: vcmStatus, statusLabel: vcmLabel },
          { id: 'hcm', name: 'Hemoglobina Corpuscular Media (HCM)', value: hcm, unit: 'pg', referenceRange: '27.0 - 33.0 pg', status: hcmStatus, statusLabel: hcmLabel },
          { id: 'chcm', name: 'Concentración de Hb Corpuscular Media (CHCM)', value: chcm, unit: 'g/dL', referenceRange: '32.0 - 36.0 g/dL', status: chcmStatus, statusLabel: chcmLabel }
        ],
        interpretation: conclusion,
        steps: [
          `VCM = (${hto} × 10) / ${gr} = ${vcm} fL`,
          `HCM = (${hb} × 10) / ${gr} = ${hcm} pg`,
          `CHCM = (${hb} × 100) / ${hto} = ${chcm} g/dL`
        ]
      };
    }
  },
  {
    id: 'reticulocitos_ipr',
    category: 'hematologia',
    name: 'Reticulocitos Corregidos e Índice de Producción Reticulocitaria (IPR)',
    shortName: 'IPR / Retic Corregidos',
    formulaEquation: 'Retic Corregido = %Retic × (Hto / Hto Normal) | IPR = Retic Corregido / Factor de Maduración',
    formulaDisplay: '% Retic Corregido = % Reticulocitos observados × (Hto paciente / 45)\nIPR = % Retic Corregido / Tiempo de Maduración (días)',
    description: 'Evalúa la respuesta regenerativa efectiva de la médula ósea ante un estado anémico.',
    clinicalSignificance: 'IPR > 2.0 indica respuesta medular adecuada y regenerativa (hemólisis, hemorragia). IPR < 2.0 en presencia de anemia indica respuesta hipoproliferativa o arregenerativa (falla medular, ferropenia, déficit vitamínico).',
    tags: ['reticulocitos', 'ipr', 'anemia regenerativa', 'eritropoyesis'],
    inputs: [
      { id: 'retic_pct', name: 'Reticulocitos observados', symbol: '% Retic', unit: '%', defaultValue: 1.5, min: 0.1, max: 30, step: 0.1 },
      { id: 'hto', name: 'Hematocrito del paciente', symbol: 'Hto', unit: '%', defaultValue: 30.0, min: 5, max: 65, step: 0.5 },
      { id: 'hto_normal', name: 'Hematocrito normal de referencia', symbol: 'Hto Ref', unit: '%', defaultValue: 45.0, min: 35, max: 50, step: 1 }
    ],
    calculate: (inputs) => {
      const reticPct = Number(inputs.retic_pct);
      const hto = Number(inputs.hto);
      const htoNormal = Number(inputs.hto_normal) || 45;

      if (!reticPct || !hto) {
        return { results: [], interpretation: 'Complete los datos de reticulocitos y hematocrito.' };
      }

      const reticCorregido = Number((reticPct * (hto / htoNormal)).toFixed(2));

      // Factor de maduración según hematocrito:
      // Hto >= 36% -> 1.0 día
      // Hto 26-35% -> 1.5 días
      // Hto 16-25% -> 2.0 días
      // Hto < 16%  -> 2.5 días
      let factorMaduracion = 1.0;
      if (hto >= 36) factorMaduracion = 1.0;
      else if (hto >= 26) factorMaduracion = 1.5;
      else if (hto >= 16) factorMaduracion = 2.0;
      else factorMaduracion = 2.5;

      const ipr = Number((reticCorregido / factorMaduracion).toFixed(2));

      let iprStatus: 'low' | 'normal' | 'high' = 'normal';
      let iprLabel = '';
      let interpretation = '';

      if (ipr >= 2.0) {
        iprStatus = 'high';
        iprLabel = 'Anemia Regenerativa (IPR ≥ 2.0)';
        interpretation = 'Médula ósea con excelente respuesta hiperproliferativa. Típico de hemorragia aguda reciente o hemólisis activa.';
      } else {
        iprStatus = 'low';
        iprLabel = 'Anemia Arregenerativa / Hipoproliferativa (IPR < 2.0)';
        interpretation = 'Respuesta eritropoyética medular inadecuada para el grado de anemia. Sugiere ferropenia, déficit de B12/folato, aplasia medular, síndrome mielodisplásico o insuficiencia renal (déficit de EPO).';
      }

      return {
        results: [
          { id: 'retic_corr', name: 'Reticulocitos Corregidos', value: reticCorregido, unit: '%', referenceRange: '1.0 - 2.0 %', status: reticCorregido < 1 ? 'low' : 'normal' },
          { id: 'maduracion', name: 'Tiempo de Maduración en sangre periférica', value: factorMaduracion, unit: 'días', referenceRange: '1.0 - 2.5 días' },
          { id: 'ipr', name: 'Índice de Producción Reticulocitaria (IPR)', value: ipr, unit: 'índice', referenceRange: '> 2.0 en anemia', status: iprStatus, statusLabel: iprLabel }
        ],
        interpretation,
        steps: [
          `% Retic Corregido = ${reticPct}% × (${hto}% / ${htoNormal}%) = ${reticCorregido}%`,
          `Factor de maduración para Hto ${hto}% = ${factorMaduracion} días`,
          `IPR = ${reticCorregido}% / ${factorMaduracion} = ${ipr}`
        ]
      };
    }
  },
  {
    id: 'correccion_leucocitos_eritroblastos',
    category: 'hematologia',
    name: 'Corrección de Leucocitos por Eritroblastos (Normoblastos)',
    shortName: 'Leucocitos Corregidos',
    formulaEquation: 'Leucocitos Corregidos = (Leucocitos contados × 100) / (100 + Eritroblastos / 100 leucos)',
    formulaDisplay: 'Leucocitos Corregidos (/µL) = [ Leucocitos Automatizados (/µL) × 100 ] / [ 100 + Nº Eritroblastos contados en 100 leucocitos ]',
    description: 'Corrige el recuento de leucocitos cuando los analizadores automatizados cuentan los eritroblastos nucleados como glóbulos blancos.',
    clinicalSignificance: 'Obligatorio cuando se observan ≥5 eritroblastos por cada 100 leucocitos en el frotis de sangre periférica, para evitar pseudoleucocitosis.',
    tags: ['leucocitos', 'eritroblastos', 'normoblastos', 'frotis', 'leucocitosis'],
    inputs: [
      { id: 'leucos_raw', name: 'Leucocitos contados (analizador)', symbol: 'WBC', unit: '/µL', defaultValue: 18500, min: 500, max: 200000, step: 100 },
      { id: 'eritroblastos', name: 'Eritroblastos (por 100 leucocitos en frotis)', symbol: 'NRBC/100 WBC', unit: '/100 leucos', defaultValue: 15, min: 1, max: 300, step: 1 }
    ],
    calculate: (inputs) => {
      const raw = Number(inputs.leucos_raw);
      const nrbc = Number(inputs.eritroblastos);

      if (!raw || nrbc === undefined) {
        return { results: [], interpretation: 'Ingrese el recuento automatizado y el número de eritroblastos.' };
      }

      const corrected = Math.round((raw * 100) / (100 + nrbc));
      const difference = raw - corrected;

      return {
        results: [
          { id: 'corrected_wbc', name: 'Leucocitos Reales Corregidos', value: corrected, unit: '/µL', referenceRange: '4,500 - 11,000 /µL', status: corrected > 11000 ? 'high' : corrected < 4500 ? 'low' : 'normal' },
          { id: 'excess', name: 'Glóbulos nucleados sobreestimados', value: difference, unit: '/µL', status: 'info' }
        ],
        interpretation: `El recuento real del paciente es de ${corrected.toLocaleString()} leucocitos/µL. El analizador estaba sobreestimando ${difference.toLocaleString()} células/µL debido a la presencia de eritroblastos nucleados en sangre periférica.`,
        steps: [
          `Leucocitos Corregidos = (${raw} × 100) / (100 + ${nrbc}) = ${corrected} /µL`
        ]
      };
    }
  },
  {
    id: 'camara_neubauer',
    category: 'hematologia',
    name: 'Cámara de Neubauer (Recuento Celular en Hemocitómetro)',
    shortName: 'Cámara de Neubauer',
    formulaEquation: 'Células/µL = (Células contadas × Dilución) / (Nº Cuadrantes × 0.1 mm³)',
    formulaDisplay: 'Células/µL = [ Total de células contadas × Factor de Dilución ] / [ Nº de cuadrantes grandes × 0.1 mm³ de volumen ]',
    description: 'Cálculo de concentración celular para sangre, LCR, líquido sinovial, pleural, ascítico o peritoneal usando la cámara de Neubauer estándar (profundidad 0.1 mm).',
    clinicalSignificance: 'Procedimiento estándar en hematología y citología de líquidos biológicos para conteo de eritrocitos, leucocitos, plaquetas o espermatozoides.',
    tags: ['neubauer', 'hemocitometro', 'lcr', 'liquido sinovial', 'celulas'],
    inputs: [
      { id: 'cells_counted', name: 'Total de células contadas', symbol: 'N', unit: 'células', defaultValue: 120, min: 1, max: 2000, step: 1 },
      { id: 'squares', name: 'Número de cuadrantes grandes contados (1 mm² c/u)', symbol: 'Cuadrantes', unit: 'cuadrantes', defaultValue: 4, min: 1, max: 9, step: 1 },
      { id: 'dilution', name: 'Factor de Dilución (ej. 1:20 = 20, directa = 1)', symbol: 'FD', unit: 'dilución', defaultValue: 20, min: 1, max: 1000, step: 1 }
    ],
    calculate: (inputs) => {
      const count = Number(inputs.cells_counted);
      const squares = Number(inputs.squares);
      const dilution = Number(inputs.dilution);

      if (!count || !squares || !dilution) {
        return { results: [], interpretation: 'Complete los parámetros de la cámara de Neubauer.' };
      }

      // Volumen por cuadrante grande = 1 mm * 1 mm * 0.1 mm = 0.1 mm³ (0.1 µL)
      const concentration = Math.round((count * dilution) / (squares * 0.1));

      return {
        results: [
          { id: 'concentration_ul', name: 'Concentración Celular', value: concentration, unit: 'células/µL (o mm³)', status: 'info' },
          { id: 'concentration_l', name: 'Concentración Celular (SI)', value: (concentration / 1000).toFixed(2), unit: '×10⁶/L', status: 'info' }
        ],
        interpretation: `Concentración obtenida: ${concentration.toLocaleString()} células/µL (mm³). Recuerde verificar la regla de inclusión de bordes (contar células en bordes superior e izquierdo, omitir en inferior y derecho).`,
        steps: [
          `Volumen total evaluado = ${squares} cuadrantes × 0.1 mm³ = ${(squares * 0.1).toFixed(2)} mm³`,
          `Células/µL = (${count} × ${dilution}) / ${(squares * 0.1).toFixed(2)} = ${concentration.toLocaleString()} células/µL`
        ]
      };
    }
  },
  {
    id: 'relacion_neutrofilo_linfocito',
    category: 'hematologia',
    name: 'Relación Neutrófilo/Linfocito (NLR) y Plaquetas/Linfocito (PLR)',
    shortName: 'NLR / PLR (Inflamación)',
    formulaEquation: 'NLR = Neutrófilos Absolutos / Linfocitos Absolutos | PLR = Plaquetas / Linfocitos',
    formulaDisplay: 'NLR = Neutrófilos Absolutos (/µL) / Linfocitos Absolutos (/µL)\nPLR = Plaquetas (/µL) / Linfocitos Absolutos (/µL)',
    description: 'Biomarcadores hematológicos costo-efectivos de inflamación sistémica, estrés fisiológico y pronóstico inmunológico.',
    clinicalSignificance: 'NLR > 3.0 se asocia con respuesta inflamatoria sistémica, sepsis, gravedad en infecciones bacterianas, COVID-19 y pronóstico oncológico desfavorable.',
    tags: ['nlr', 'plr', 'inflamacion', 'sepsis', 'covid', 'leucograma'],
    inputs: [
      { id: 'neutrophils', name: 'Neutrófilos absolutos (o %)', symbol: 'Neu', unit: '/µL (o %)', defaultValue: 6500, min: 100, max: 80000, step: 50 },
      { id: 'lymphocytes', name: 'Linfocitos absolutos (o %)', symbol: 'Linf', unit: '/µL (o %)', defaultValue: 1800, min: 50, max: 50000, step: 50 },
      { id: 'platelets', name: 'Plaquetas totales', symbol: 'PLT', unit: '/µL', defaultValue: 250000, min: 5000, max: 1500000, step: 1000 }
    ],
    calculate: (inputs) => {
      const neu = Number(inputs.neutrophils);
      const linf = Number(inputs.lymphocytes);
      const plt = Number(inputs.platelets);

      if (!neu || !linf || linf <= 0) {
        return { results: [], interpretation: 'Ingrese los neutrófilos y linfocitos.' };
      }

      const nlr = Number((neu / linf).toFixed(2));
      const plr = plt ? Number((plt / linf).toFixed(1)) : 0;

      let nlrStatus: 'normal' | 'high' | 'critical-high' = 'normal';
      let nlrLabel = 'Normal (< 3.0)';
      let interp = '';

      if (nlr < 3.0) {
        nlrStatus = 'normal';
        interp = 'NLR normal: Sin evidencia de respuesta inflamatoria sistémica marcada.';
      } else if (nlr <= 6.0) {
        nlrStatus = 'high';
        nlrLabel = 'Inflamación Leve a Moderada (3.0 - 6.0)';
        interp = 'NLR moderadamente elevado: Sugiere estrés fisiológico, infección bacteriana o inflamación sistémica activa.';
      } else {
        nlrStatus = 'critical-high';
        nlrLabel = 'Inflamación Severa / Alto Riesgo (> 6.0)';
        interp = 'NLR marcadamente elevado: Alto riesgo de sepsis, tormenta de citoquinas o descompensación crítica.';
      }

      return {
        results: [
          { id: 'nlr', name: 'Relación Neutrófilo/Linfocito (NLR)', value: nlr, unit: 'ratio', referenceRange: '1.0 - 3.0', status: nlrStatus, statusLabel: nlrLabel },
          { id: 'plr', name: 'Relación Plaqueta/Linfocito (PLR)', value: plr, unit: 'ratio', referenceRange: '80 - 180', status: plr > 180 ? 'high' : 'normal' }
        ],
        interpretation: interp,
        steps: [
          `NLR = ${neu} / ${linf} = ${nlr}`,
          `PLR = ${plt} / ${linf} = ${plr}`
        ]
      };
    }
  }
];
