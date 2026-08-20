import { FormulaDefinition } from '../../types/laboratory';

export const OTHER_CALCULATORS: FormulaDefinition[] = [
  // PROTEÍNAS
  {
    id: 'relacion_albumina_globulina',
    category: 'proteinas',
    name: 'Relación Albúmina / Globulina (Cociente A/G)',
    shortName: 'Relación A/G (Proteínas)',
    formulaEquation: 'Globulinas = Proteínas Totales - Albúmina | Relación A/G = Albúmina / Globulinas',
    formulaDisplay: 'Globulinas Séricas (g/dL) = Proteínas Totales (g/dL) - Albúmina (g/dL)\nRelación A/G = Albúmina (g/dL) / Globulinas (g/dL)',
    description: 'Evalúa el balance relativo entre la síntesis hepática de albúmina y la producción de globulinas e inmunoglobulinas.',
    clinicalSignificance: 'Normal: 1.2 a 2.2.\n- Relación A/G Invertida (< 1.0): Típica de gammapatías monoclonales (Mieloma Múltiple, Macroglobulinemia de Waldenström), hepatopatías crónicas (cirrosis con hipoalbuminemia e hipergammaglobulinemia policlonal), o enfermedades autoinmunes (Lupus).',
    tags: ['albumina', 'globulinas', 'relacion a/g', 'mieloma', 'cirrosis', 'proteinograma'],
    inputs: [
      { id: 'total_proteins', name: 'Proteínas Totales', symbol: 'PT', unit: 'g/dL', defaultValue: 7.2, min: 2.0, max: 15.0, step: 0.1 },
      { id: 'albumin', name: 'Albúmina Sérica', symbol: 'Alb', unit: 'g/dL', defaultValue: 4.2, min: 1.0, max: 8.0, step: 0.1 }
    ],
    calculate: (inputs) => {
      const pt = Number(inputs.total_proteins);
      const alb = Number(inputs.albumin);

      if (!pt || !alb || pt <= alb) {
        return { results: [], interpretation: 'Las Proteínas Totales deben ser mayores que la Albúmina.' };
      }

      const glob = Number((pt - alb).toFixed(2));
      const agRatio = Number((alb / glob).toFixed(2));

      let status: 'low' | 'normal' | 'high' = 'normal';
      let label = 'Normal (1.20 - 2.20)';
      let interp = '';

      if (agRatio < 1.0) {
        status = 'low';
        label = 'Relación A/G Invertida (< 1.00)';
        interp = `⚠️ Relación A/G invertida (${agRatio} < 1.0). Indica exceso de globulinas o déficit severo de albúmina. Solicitar urgente Proteinograma Electroforético en suero e inmunofijación para descartar gammapatía monoclonal (Mieloma múltiple) o hepatopatía crónica avanzada.`;
      } else if (agRatio < 1.2) {
        status = 'low';
        label = 'Límite Bajo (1.00 - 1.19)';
        interp = 'Relación A/G discretamente disminuida. Descartar procesos inflamatorios crónicos o hepatopatía leve.';
      } else {
        status = 'normal';
        interp = `Relación A/G normal (${agRatio}). Balance fisiológico conservado entre fracciones proteicas.`;
      }

      return {
        results: [
          { id: 'ag_ratio', name: 'Relación Albúmina / Globulina (A/G)', value: agRatio, unit: 'ratio', referenceRange: '1.20 - 2.20', status, statusLabel: label },
          { id: 'globulins', name: 'Globulinas Totales Calculadas', value: glob, unit: 'g/dL', referenceRange: '2.0 - 3.5 g/dL', status: glob > 3.5 ? 'high' : 'normal' }
        ],
        interpretation: interp,
        steps: [
          `Globulinas = ${pt} - ${alb} = ${glob} g/dL`,
          `Relación A/G = ${alb} / ${glob} = ${agRatio}`
        ]
      };
    }
  },

  // MARCADORES TUMORALES
  {
    id: 'densidad_porcentaje_psa',
    category: 'marcadores_tumorales',
    name: 'Densidad de PSA (PSAD) y Porcentaje de PSA Libre (% fPSA)',
    shortName: 'Densidad y % PSA Libre',
    formulaEquation: 'PSAD = PSA Total (ng/mL) / Volumen Prostático (cc) | % PSA Libre = (PSA Libre / PSA Total) × 100',
    formulaDisplay: 'Densidad de PSA (PSAD) = PSA Total (ng/mL) / Volumen Prostático ecográfico (cc)\n% PSA Libre = [ PSA Libre (ng/mL) / PSA Total (ng/mL) ] × 100',
    description: 'Estratificación del riesgo de adenocarcinoma prostático frente a Hiperplasia Prostática Benigna (HPB), especialmente en pacientes con PSA Total en zona gris (4.0 - 10.0 ng/mL).',
    clinicalSignificance: 'Criterios urológicos:\n- PSAD > 0.15 ng/mL/cc: Mayor sospecha de malignidad prostática (justifica biopsia ecodirigida).\n- % PSA Libre < 10%: Alto riesgo de cáncer (~56% probabilidad).\n- % PSA Libre 10 - 25%: Riesgo intermedio.\n- % PSA Libre > 25%: Bajo riesgo (~8% probabilidad, sugiere HPB).',
    tags: ['psa', 'psad', 'psa libre', 'prostata', 'hpb', 'cancer de prostata', 'urologia'],
    inputs: [
      { id: 'psa_total', name: 'PSA Total', symbol: 'tPSA', unit: 'ng/mL', defaultValue: 6.2, min: 0.1, max: 200, step: 0.1 },
      { id: 'psa_free', name: 'PSA Libre', symbol: 'fPSA', unit: 'ng/mL', defaultValue: 0.8, min: 0.01, max: 50, step: 0.01 },
      { id: 'prostate_vol', name: 'Volumen Prostático (Ecografía transrectal/abdominal)', symbol: 'Volumen', unit: 'cc (o cm³)', defaultValue: 35, min: 5, max: 250, step: 1 }
    ],
    calculate: (inputs) => {
      const tpsa = Number(inputs.psa_total);
      const fpsa = Number(inputs.psa_free);
      const vol = Number(inputs.prostate_vol);

      if (!tpsa || tpsa <= 0) {
        return { results: [], interpretation: 'Ingrese el valor de PSA Total.' };
      }

      const results: any[] = [];
      let interp = '';

      if (fpsa) {
        const pctFree = Number(((fpsa / tpsa) * 100).toFixed(1));
        let freeStatus: 'normal' | 'high' | 'critical-high' | 'low' = 'normal';
        let freeLabel = '';

        if (pctFree < 10) {
          freeStatus = 'critical-high';
          freeLabel = 'Alto Riesgo de Cáncer de Próstata (< 10%)';
        } else if (pctFree <= 25) {
          freeStatus = 'high';
          freeLabel = 'Riesgo Intermedio (10 - 25%)';
        } else {
          freeStatus = 'normal';
          freeLabel = 'Bajo Riesgo / Sugiere HPB Benigna (> 25%)';
        }

        results.push({
          id: 'free_psa_pct',
          name: 'Porcentaje de PSA Libre (% fPSA)',
          value: pctFree,
          unit: '%',
          referenceRange: '> 25% (Favorable) | < 10% (Sospecha alta)',
          status: freeStatus,
          statusLabel: freeLabel
        });

        interp += `% PSA Libre: ${pctFree}%. ${pctFree < 15 ? 'Baja proporción de PSA libre orienta a mayor riesgo de malignidad.' : 'Proporción favorable que apoya hiperplasia benigna.'} `;
      }

      if (vol) {
        const psad = Number((tpsa / vol).toFixed(3));
        const psadStatus = psad > 0.15 ? 'high' : 'normal';

        results.push({
          id: 'psad',
          name: 'Densidad de PSA (PSAD)',
          value: psad,
          unit: 'ng/mL/cc',
          referenceRange: '< 0.15 ng/mL/cc',
          status: psadStatus,
          statusLabel: psad > 0.15 ? 'PSAD Elevada (> 0.15) - Sospecha' : 'PSAD Normal (≤ 0.15)'
        });

        interp += `Densidad de PSA: ${psad} ng/mL/cc (${psad > 0.15 ? 'Elevada, sugiere masa tumoral activa' : 'Normal, el incremento de PSA es proporcional al volumen prostático benigno'}).`;
      }

      return {
        results,
        interpretation: interp || 'Estratificación calculada correctamente.',
        steps: [
          fpsa ? `% PSA Libre = (${fpsa} / ${tpsa}) × 100 = ${((fpsa / tpsa) * 100).toFixed(1)}%` : '',
          vol ? `PSAD = ${tpsa} / ${vol} = ${(tpsa / vol).toFixed(3)} ng/mL/cc` : ''
        ].filter(Boolean)
      };
    }
  },

  // COAGULACIÓN
  {
    id: 'inr_ratio_tp',
    category: 'coagulacion',
    name: 'INR (International Normalized Ratio) y Corrección de TP',
    shortName: 'INR (Tiempo de Protrombina)',
    formulaEquation: 'INR = ( TP Paciente / TP Control Normal )^ISI',
    formulaDisplay: 'INR = [ TP Paciente (segundos) / TP Pool Control Normal (segundos) ] ^ ISI del reactivo',
    description: 'Estandarización internacional del Tiempo de Protrombina según el Índice de Sensibilidad Internacional (ISI) de la tromboplastina utilizada.',
    clinicalSignificance: 'Monitoreo de Anticoagulación Oral con antagonistas de vitamina K (Warfarina, Acenocumarol):\n- Sin tratamiento: 0.8 - 1.2\n- Rango terapéutico estándar (Fibrilación auricular, TVP, TEP): 2.0 - 3.0\n- Prótesis valvulares mecánicas mitrales / Alto riesgo: 2.5 - 3.5\n- INR > 4.5: Riesgo hemorrágico severo (ajustar dosis o considerar Vitamina K).',
    tags: ['inr', 'tp', 'warfarina', 'sintrom', 'anticoagulacion', 'tromboplastina', 'isi'],
    inputs: [
      { id: 'pt_patient', name: 'Tiempo de Protrombina del Paciente', symbol: 'TP_paciente', unit: 'segundos', defaultValue: 28.5, min: 5, max: 150, step: 0.1 },
      { id: 'pt_control', name: 'TP del Pool Normal Control (MNPT)', symbol: 'TP_control', unit: 'segundos', defaultValue: 12.0, min: 8, max: 18, step: 0.1 },
      { id: 'isi', name: 'Índice de Sensibilidad Internacional (ISI del reactivo)', symbol: 'ISI', unit: 'índice', defaultValue: 1.05, min: 0.8, max: 1.8, step: 0.01 }
    ],
    calculate: (inputs) => {
      const ptP = Number(inputs.pt_patient);
      const ptC = Number(inputs.pt_control);
      const isi = Number(inputs.isi);

      if (!ptP || !ptC || !isi || ptC <= 0) {
        return { results: [], interpretation: 'Ingrese los tiempos de protrombina y el ISI del reactivo.' };
      }

      const ratio = ptP / ptC;
      const inr = Number(Math.pow(ratio, isi).toFixed(2));

      let status: 'normal' | 'low' | 'high' | 'critical-high' = 'normal';
      let label = 'Normal sin anticoagulación (0.8 - 1.2)';
      let interp = '';

      if (inr < 1.5) {
        status = 'normal';
        interp = 'INR en rango normal no anticoagulado (0.8 - 1.2) o subterapéutico si está bajo tratamiento con anticoagulantes orales.';
      } else if (inr >= 2.0 && inr <= 3.0) {
        status = 'normal';
        label = 'En Rango Terapéutico Estándar (2.0 - 3.0)';
        interp = 'INR en rango terapéutico óptimo para profilaxis y tratamiento de trombosis venosa profunda, embolia pulmonar y fibrilación auricular.';
      } else if (inr > 3.0 && inr <= 4.5) {
        status = 'high';
        label = 'Supraterapéutico Moderado (3.1 - 4.5)';
        interp = 'INR moderadamente prolongado. Evaluar indicación específica (ej. válvula mecánica: 2.5-3.5) o ajustar dosis del anticoagulante.';
      } else {
        status = 'critical-high';
        label = '⚠️ INR Crítico / Alto Riesgo Hemorrágico (> 4.5)';
        interp = 'INR marcadamente elevado. Alto riesgo de sangrado espontáneo mayor. Suspender anticoagulante y evaluar administración de Vitamina K1 o complejo protrombínico.';
      }

      return {
        results: [
          { id: 'inr', name: 'INR (International Normalized Ratio)', value: inr, unit: 'índice', referenceRange: '0.80 - 1.20 (No tratado) | 2.00 - 3.00 (Anticoagulado)', status, statusLabel: label },
          { id: 'pt_ratio', name: 'Ratio TP (Paciente / Control)', value: Number(ratio.toFixed(2)), unit: 'ratio', status: 'info' }
        ],
        interpretation: interp,
        steps: [
          `Ratio TP = ${ptP} s / ${ptC} s = ${ratio.toFixed(3)}`,
          `INR = (${ratio.toFixed(3)})^${isi} = ${inr}`
        ]
      };
    }
  },
  {
    id: 'prueba_mezclas_rosner_lupico',
    category: 'coagulacion',
    name: 'Prueba de Mezclas de Plasma e Índice de Rosner (ICA - Anticoagulante Lúpico)',
    shortName: 'Índice de Rosner (Mezclas TTPa)',
    formulaEquation: 'Índice Rosner (ICA) % = [ (TTPa Mezcla 1:1 - TTPa Control Normal) / TTPa Paciente ] × 100',
    formulaDisplay: 'ICA (%) = [ ( TTPa Mezcla 1:1 - TTPa Pool Normal ) / TTPa Paciente ] × 100',
    description: 'Diferencia si un tiempo de TTPa prolongado se debe a una deficiencia de factores de coagulación o a la presencia de un inhibidor circulante (Anticoagulante Lúpico o anticuerpos contra Factor VIII).',
    clinicalSignificance: 'Interpretación del Índice de Rosner (ICA):\n- ICA < 11% (o < 12%): Corrección del TTPa. Indica Déficit de Factores de la coagulación (Factores VIII, IX, XI, XII).\n- ICA > 15%: Falta de Corrección. Confirma la presencia de un Inhibidor Circulante (ej. Anticoagulante Lúpico en Síndrome Antifosfolípido o inhibidor específico adquirido).',
    tags: ['rosner', 'anticoagulante lupico', 'mezclas', 'ttpa', 'ica', 'saf', 'hemostasia'],
    inputs: [
      { id: 'ttpa_patient', name: 'TTPa del Paciente', symbol: 'TTPa_paciente', unit: 'segundos', defaultValue: 58.0, min: 20, max: 150, step: 0.5 },
      { id: 'ttpa_control', name: 'TTPa del Pool Normal Control', symbol: 'TTPa_control', unit: 'segundos', defaultValue: 30.0, min: 20, max: 40, step: 0.5 },
      { id: 'ttpa_mix', name: 'TTPa de la Mezcla 1:1 (Plasma Paciente + Plasma Control)', symbol: 'TTPa_mezcla', unit: 'segundos', defaultValue: 49.0, min: 20, max: 150, step: 0.5 }
    ],
    calculate: (inputs) => {
      const p = Number(inputs.ttpa_patient);
      const c = Number(inputs.ttpa_control);
      const m = Number(inputs.ttpa_mix);

      if (!p || !c || !m || p <= c) {
        return { results: [], interpretation: 'El TTPa del paciente debe estar prolongado respecto al control normal.' };
      }

      const ica = Number((((m - c) / p) * 100).toFixed(1));

      let status: 'normal' | 'high' = 'normal';
      let label = '';
      let interp = '';

      if (ica < 12.0) {
        status = 'normal';
        label = 'ICA < 12% (Corrección: Sugiere Déficit de Factores)';
        interp = `Índice de Rosner (ICA) = ${ica}%. La mezcla 1:1 normalizó el TTPa al aportar los factores faltantes. Sugiere deficiencia congénita o adquirida de factores de la vía intrínseca (VIII, IX, XI, XII). Proceder a dosaje individual de factores.`;
      } else if (ica <= 15.0) {
        status = 'normal';
        label = 'ICA 12 - 15% (Zona Gris / Indeterminada)';
        interp = `Índice de Rosner en zona intermedia (${ica}%). Realizar incubación a 37°C durante 1-2 horas para descartar inhibidores tiempo-dependientes (anti-Factor VIII).`;
      } else {
        status = 'high';
        label = 'ICA > 15% (No Corrige: Sugiere Inhibidor Circulante / Anticoagulante Lúpico)';
        interp = `⚠️ Índice de Rosner (ICA) = ${ica}% (> 15%). El plasma normal NO logró corregir la prolongación del TTPa. Confirma la presencia de un Inhibidor Circulante. Altamente sugestivo de Anticoagulante Lúpico (SAF) o inhibidor específico. Proceder con pruebas confirmatorias de fosfolípidos dependientes (dRVVT confirmatorio).`;
      }

      return {
        results: [
          { id: 'rosner_ica', name: 'Índice de Circulante Anticoagulante (ICA de Rosner)', value: ica, unit: '%', referenceRange: '< 12% (Corrección) | > 15% (Inhibidor)', status, statusLabel: label }
        ],
        interpretation: interp,
        steps: [
          `ICA = [ (${m} s - ${c} s) / ${p} s ] × 100 = [ ${(m - c).toFixed(1)} / ${p} ] × 100 = ${ica}%`
        ]
      };
    }
  },

  // INMUNOLOGÍA & SEROLOGÍA
  {
    id: 'indice_signal_cutoff_sco',
    category: 'inmunologia',
    name: 'Índice de Corte (Signal / Cut-Off - S/CO) en Inmunoensayos (ELISA/CLIA)',
    shortName: 'Índice S/CO (Inmunoensayos)',
    formulaEquation: 'Índice S/CO = Densidad Óptica o RLU de la Muestra / Valor de Cut-Off',
    formulaDisplay: 'Índice S/CO = Señal de la Muestra (DO / RLU) / Valor Umbral de Corte (Cut-Off)',
    description: 'Estandarización de resultados cualitativos y semicuantitativos en serología infecciosa (VIH, Hepatitis B, Hepatitis C, Chagas, Sífilis, Toxoplasmosis).',
    clinicalSignificance: 'Clasificación estandarizada:\n- S/CO < 0.90: Resultado NO REACTIVO / Negativo.\n- S/CO 0.90 - 1.10: ZONA GRIS / Indeterminado (Repetir muestra por duplicado y solicitar nueva muestra en 15-30 días).\n- S/CO > 1.10: Resultado REACTIVO / Positivo (Requiere algoritmo confirmatorio suplementario según normativa nacional).',
    tags: ['sco', 'cut-off', 'elisa', 'clia', 'serologia', 'vih', 'hepatitis', 'reactivo'],
    inputs: [
      { id: 'signal_sample', name: 'Señal de la Muestra (DO o Quimioluminiscencia RLU)', symbol: 'Señal Muestra', unit: 'DO / RLU', defaultValue: 2.45, min: 0.001, max: 1000, step: 0.01 },
      { id: 'cutoff_value', name: 'Valor de Cut-Off (Cálculo del kit)', symbol: 'Cut-Off', unit: 'DO / RLU', defaultValue: 0.35, min: 0.001, max: 1000, step: 0.01 }
    ],
    calculate: (inputs) => {
      const sample = Number(inputs.signal_sample);
      const co = Number(inputs.cutoff_value);

      if (!sample || !co || co <= 0) {
        return { results: [], interpretation: 'Ingrese la lectura de la muestra y el Cut-off.' };
      }

      const sco = Number((sample / co).toFixed(2));

      let status: 'normal' | 'high' | 'critical-high' = 'normal';
      let label = 'No Reactivo (S/CO < 0.90)';
      let interp = '';

      if (sco < 0.90) {
        status = 'normal';
        interp = `Índice S/CO = ${sco}. Resultado NO REACTIVO. No se detectan anticuerpos/antígenos por encima del límite de corte del ensayo.`;
      } else if (sco <= 1.10) {
        status = 'high';
        label = 'Zona Gris / Indeterminado (0.90 - 1.10)';
        interp = `⚠️ Índice S/CO = ${sco}. Resultado en ZONA GRIS / INDETERMINADO. Repetir la determinación por duplicado en el mismo ensayo. Si persiste dudoso, recomendar nueva muestra a las 2-4 semanas.`;
      } else {
        status = 'critical-high';
        label = 'REACTIVO / Positivo (S/CO > 1.10)';
        interp = `⚠️ Índice S/CO = ${sco}. Resultado REACTIVO (POSITIVO). Aplicar el algoritmo confirmatorio correspondiente (ej. Western Blot, PCR / Carga Viral, o Inmunoblot) según la patología.`;
      }

      return {
        results: [
          { id: 'sco_index', name: 'Índice Signal / Cut-Off (S/CO)', value: sco, unit: 'índice', referenceRange: '< 0.90 (No Reactivo) | > 1.10 (Reactivo)', status, statusLabel: label }
        ],
        interpretation: interp,
        steps: [`Índice S/CO = ${sample} / ${co} = ${sco}`]
      };
    }
  },
  {
    id: 'evaluacion_desempeno_diagnostico_tabla2x2',
    category: 'serologia',
    name: 'Evaluación de Rendimiento Diagnóstico (Sensibilidad, Especificidad, VPP, VPN, Likelihood Ratio)',
    shortName: 'Tabla 2x2 Desempeño Diagnóstico',
    formulaEquation: 'Sensibilidad = VP / (VP + FN) | Especificidad = VN / (VN + FP) | VPP = VP / (VP + FP) | VPN = VN / (VN + FN)',
    formulaDisplay: 'Sensibilidad = VP / ( VP + FN )\nEspecificidad = VN / ( VN + FP )\nValor Predictivo Positivo (VPP) = VP / ( VP + FP )\nValor Predictivo Negativo (VPN) = VN / ( VN + FN )\nLikelihood Ratio Positivo (LR+) = Sensibilidad / ( 1 - Especificidad )\nLikelihood Ratio Negativo (LR-) = ( 1 - Sensibilidad ) / Especificidad',
    description: 'Valida nuevas pruebas diagnósticas, kits de reactivos serológicos o moleculares frente a un Gold Standard.',
    clinicalSignificance: 'Mide la exactitud intrínseca del método analítico y su impacto clínico en función de la prevalencia.',
    tags: ['sensibilidad', 'especificidad', 'vpp', 'vpn', 'tabla 2x2', 'gold standard', 'epidemiologia'],
    inputs: [
      { id: 'vp', name: 'Verdaderos Positivos (VP)', symbol: 'VP', unit: 'pacientes', defaultValue: 95, min: 0, max: 100000, step: 1 },
      { id: 'fp', name: 'Falsos Positivos (FP)', symbol: 'FP', unit: 'pacientes', defaultValue: 5, min: 0, max: 100000, step: 1 },
      { id: 'fn', name: 'Falsos Negativos (FN)', symbol: 'FN', unit: 'pacientes', defaultValue: 3, min: 0, max: 100000, step: 1 },
      { id: 'vn', name: 'Verdaderos Negativos (VN)', symbol: 'VN', unit: 'pacientes', defaultValue: 197, min: 0, max: 100000, step: 1 }
    ],
    calculate: (inputs) => {
      const vp = Number(inputs.vp);
      const fp = Number(inputs.fp);
      const fn = Number(inputs.fn);
      const vn = Number(inputs.vn);

      const totalEnfermos = vp + fn;
      const totalSanos = fp + vn;
      const totalTestPos = vp + fp;
      const totalTestNeg = fn + vn;
      const totalGeneral = vp + fp + fn + vn;

      if (totalEnfermos <= 0 || totalSanos <= 0 || totalGeneral <= 0) {
        return { results: [], interpretation: 'Ingrese valores en los cuatro cuadrantes de la tabla 2x2.' };
      }

      const sens = Number(((vp / totalEnfermos) * 100).toFixed(1));
      const espec = Number(((vn / totalSanos) * 100).toFixed(1));
      const vpp = totalTestPos > 0 ? Number(((vp / totalTestPos) * 100).toFixed(1)) : 0;
      const vpn = totalTestNeg > 0 ? Number(((vn / totalTestNeg) * 100).toFixed(1)) : 0;
      const exactitud = Number((((vp + vn) / totalGeneral) * 100).toFixed(1));
      const prevalencia = Number(((totalEnfermos / totalGeneral) * 100).toFixed(1));

      // Likelihood Ratios
      const lrPos = espec < 100 ? Number((sens / 100 / (1 - espec / 100)).toFixed(2)) : 999;
      const lrNeg = espec > 0 ? Number(((1 - sens / 100) / (espec / 100)).toFixed(2)) : 0;

      return {
        results: [
          { id: 'sens', name: 'Sensibilidad (Capacidad de detectar enfermos)', value: sens, unit: '%', referenceRange: '> 90% (Alta)', status: 'info' },
          { id: 'espec', name: 'Especificidad (Capacidad de detectar sanos)', value: espec, unit: '%', referenceRange: '> 95% (Alta)', status: 'info' },
          { id: 'vpp', name: 'Valor Predictivo Positivo (VPP)', value: vpp, unit: '%', status: 'info' },
          { id: 'vpn', name: 'Valor Predictivo Negativo (VPN)', value: vpn, unit: '%', status: 'info' },
          { id: 'lr_pos', name: 'Cociente de Probabilidad Positivo (LR+)', value: lrPos, unit: 'ratio', referenceRange: '> 10 (Excelente)', status: lrPos > 10 ? 'high' : 'normal' as any },
          { id: 'lr_neg', name: 'Cociente de Probabilidad Negativo (LR-)', value: lrNeg, unit: 'ratio', referenceRange: '< 0.1 (Excelente)', status: lrNeg < 0.1 ? 'normal' : 'info' as any },
          { id: 'exactitud', name: 'Exactitud Diagnóstica Global (Accuracy)', value: exactitud, unit: '%', status: 'info' }
        ],
        interpretation: `Rendimiento Diagnóstico: Sensibilidad del ${sens}% y Especificidad del ${espec}%. LR+ de ${lrPos} (un resultado positivo multiplica la probabilidad de tener la enfermedad) y LR- de ${lrNeg}. Prevalencia muestral calculada: ${prevalencia}%.`,
        steps: [
          `Sensibilidad = ${vp} / (${vp} + ${fn}) = ${sens}%`,
          `Especificidad = ${vn} / (${vn} + ${fp}) = ${espec}%`,
          `VPP = ${vp} / (${vp} + ${fp}) = ${vpp}%`,
          `VPN = ${vn} / (${vn} + ${fn}) = ${vpn}%`,
          `LR+ = (${sens/100}) / (1 - ${espec/100}) = ${lrPos}`
        ]
      };
    }
  },

  // MICROBIOLOGÍA
  {
    id: 'recuento_ufc_microbiologia',
    category: 'microbiologia',
    name: 'Recuento de Unidades Formadoras de Colonias (UFC/mL en Placa / Urocultivo)',
    shortName: 'Recuento de UFC/mL',
    formulaEquation: 'UFC/mL = Colonias contadas / (Volumen sembrado en mL × Dilución)',
    formulaDisplay: 'UFC/mL = Nº de colonias contadas / [ Volumen de inóculo (mL) × Factor de dilución ]\n*Con Asa calibrada en Urocultivo:\n- Asa de 1 µL (0.001 mL) → Multiplicar colonias × 1,000\n- Asa de 10 µL (0.01 mL) → Multiplicar colonias × 100',
    description: 'Cuantificación bacteriana en urocultivos, cultivos cuantitativos de LBA (Lavado broncoalveolar) y control microbiológico ambiental.',
    clinicalSignificance: 'Criterios de Kass en Urocultivo:\n- ≥ 100,000 UFC/mL (10⁵): Bacteriuria significativa / Infección del Tracto Urinario (ITU) confirmada.\n- 10,000 - 100,000 UFC/mL: Probable ITU si es en orina de catéter, embarazada o síntoma agudo con germen único.\n- < 10,000 UFC/mL con flora mixta: Probable contaminación por flora perineal.',
    tags: ['ufc', 'urocultivo', 'microbiologia', 'colonias', 'asa calibrada', 'itu', 'bacteriuria'],
    inputs: [
      { id: 'colonies', name: 'Número de colonias contadas en la placa', symbol: 'Nº Colonias', unit: 'colonias', defaultValue: 125, min: 1, max: 500, step: 1 },
      { id: 'method', name: 'Método de siembra', symbol: 'Método', unit: '', type: 'select', options: ['Asa Calibrada 1 µL (Factor ×1,000)', 'Asa Calibrada 10 µL (Factor ×100)', 'Siembra en placa por dilución (mL)'], defaultValue: 'Asa Calibrada 1 µL (Factor ×1,000)' },
      { id: 'vol_ml', name: 'Volumen sembrado en mL (si eligió dilución)', symbol: 'Volumen', unit: 'mL', defaultValue: 0.1, min: 0.001, max: 1.0, step: 0.01 },
      { id: 'dil_factor', name: 'Factor de dilución (ej. 10^-3 = 0.001)', symbol: 'Dilución', unit: 'fracción', defaultValue: 1.0, min: 0.000001, max: 1.0, step: 0.001 }
    ],
    calculate: (inputs) => {
      const col = Number(inputs.colonies);
      const method = inputs.method || 'Asa Calibrada 1 µL (Factor ×1,000)';

      if (!col || col <= 0) {
        return { results: [], interpretation: 'Ingrese el número de colonias observadas.' };
      }

      let ufc = 0;
      let stepFormula = '';

      if (method.includes('1 µL')) {
        ufc = col * 1000;
        stepFormula = `UFC/mL = ${col} colonias × 1,000 (Asa 1 µL) = ${ufc.toLocaleString()} UFC/mL`;
      } else if (method.includes('10 µL')) {
        ufc = col * 100;
        stepFormula = `UFC/mL = ${col} colonias × 100 (Asa 10 µL) = ${ufc.toLocaleString()} UFC/mL`;
      } else {
        const v = Number(inputs.vol_ml) || 0.1;
        const d = Number(inputs.dil_factor) || 1.0;
        ufc = Math.round(col / (v * d));
        stepFormula = `UFC/mL = ${col} / (${v} mL × ${d}) = ${ufc.toLocaleString()} UFC/mL`;
      }

      let status: 'normal' | 'high' | 'critical-high' = 'normal';
      let label = '';
      let interp = '';

      if (ufc >= 100000) {
        status = 'critical-high';
        label = 'Bacteriuria Significativa (≥ 10⁵ UFC/mL)';
        interp = `Recuento de ${ufc.toLocaleString()} UFC/mL (≥ 10⁵ UFC/mL). Criterio positivo de ITU franca según Criterios de Kass. Proceder a tipificación bacteriana y antibiograma (Kirby-Bauer / CMI).`;
      } else if (ufc >= 10000) {
        status = 'high';
        label = 'Recuento Intermedio (10⁴ - 10⁵ UFC/mL)';
        interp = `Recuento de ${ufc.toLocaleString()} UFC/mL. Significativo en muestras por punción suprapúbica, cateterismo vesical o en pacientes sintomáticos con leucocituria.`;
      } else {
        status = 'normal';
        label = 'Recuento Bajo (< 10⁴ UFC/mL)';
        interp = `Recuento de ${ufc.toLocaleString()} UFC/mL. Si no hay piuria ni síntomas, suele representar arrastre o colonización saprófita.`;
      }

      return {
        results: [
          { id: 'ufc_ml', name: 'Recuento Bacteriano Cuantitativo', value: ufc.toLocaleString(), unit: 'UFC/mL', referenceRange: '< 10,000 UFC/mL (No significativo)', status, statusLabel: label },
          { id: 'ufc_log', name: 'Densidad Logarítmica', value: (Math.log10(ufc)).toFixed(2), unit: 'Log₁₀ UFC/mL', status: 'info' }
        ],
        interpretation: interp,
        steps: [stepFormula]
      };
    }
  },

  // SOLUCIONES & REACTIVOS & CONTROL DE CALIDAD
  {
    id: 'molaridad_preparacion_soluciones',
    category: 'soluciones_qc',
    name: 'Preparación de Reactivos: Molaridad, Normalidad y Masa Requerida',
    shortName: 'Molaridad & Masa de Soluto',
    formulaEquation: 'Masa (g) = Molaridad (mol/L) × PM (g/mol) × Volumen (L) | Normalidad = Molaridad × Valencia',
    formulaDisplay: 'Masa de reactivo a pesar (g) = Molaridad deseada (M) × Peso Molecular (g/mol) × Volumen deseado (L)\n*Para soluciones a partir de reactivos con Pureza (%) y Densidad (g/mL):\nVolumen concentrado (mL) = Masa pura requerida (g) / [ Densidad (g/mL) × ( Pureza % / 100 ) ]',
    description: 'Cálculo analítico para preparación exacta de soluciones amortiguadoras (buffers), estándares de calibración y reactivos químicos de laboratorio.',
    clinicalSignificance: 'Garantiza la exactitud metrológica en la preparación de soluciones patrón en el laboratorio.',
    tags: ['molaridad', 'normalidad', 'soluciones', 'reactivos', 'peso molecular', 'pureza', 'quimica analitica'],
    inputs: [
      { id: 'molarity', name: 'Molaridad deseada (M)', symbol: 'Molaridad', unit: 'mol/L (M)', defaultValue: 0.5, min: 0.001, max: 20, step: 0.01 },
      { id: 'mol_weight', name: 'Peso Molecular del reactivo (PM / Peso Fórmula)', symbol: 'PM', unit: 'g/mol', defaultValue: 58.44, min: 1, max: 2000, step: 0.01 },
      { id: 'volume_ml', name: 'Volumen final deseado', symbol: 'Volumen', unit: 'mL', defaultValue: 500, min: 1, max: 50000, step: 50 },
      { id: 'purity', name: 'Pureza del reactivo (% p/p, opcional si sólido 100%)', symbol: 'Pureza', unit: '%', defaultValue: 100, min: 1, max: 100, step: 1 },
      { id: 'valence', name: 'Valencia / Equivalentes por mol (para Normalidad)', symbol: 'Valencia', unit: 'eq/mol', defaultValue: 1, min: 1, max: 6, step: 1 }
    ],
    calculate: (inputs) => {
      const m = Number(inputs.molarity);
      const pm = Number(inputs.mol_weight);
      const vMl = Number(inputs.volume_ml);
      const purity = Number(inputs.purity) || 100;
      const val = Number(inputs.valence) || 1;

      if (!m || !pm || !vMl || m <= 0 || pm <= 0 || vMl <= 0) {
        return { results: [], interpretation: 'Complete la molaridad, peso molecular y volumen deseado.' };
      }

      const vL = vMl / 1000;
      const pureMass = m * pm * vL;
      const realMassToWeigh = Number((pureMass / (purity / 100)).toFixed(3));
      const normality = Number((m * val).toFixed(3));

      return {
        results: [
          { id: 'mass_weigh', name: 'Masa de reactivo a pesar', value: realMassToWeigh, unit: 'gramos (g)', status: 'info' },
          { id: 'normality', name: 'Normalidad de la solución (N)', value: normality, unit: 'N (eq/L)', status: 'info' },
          { id: 'mass_pure', name: 'Masa neta de soluto activo puro', value: Number(pureMass.toFixed(3)), unit: 'g', status: 'info' }
        ],
        interpretation: `Procedimiento de preparación: Pesar con precisión analítica ${realMassToWeigh} g del reactivo (pureza ${purity}%). Disolver en una porción de agua destilada / desionizada y enrasar en matraz aforado hasta completar exactamente ${vMl} mL.`,
        steps: [
          `Volumen en Litros = ${vMl} mL / 1000 = ${vL} L`,
          `Masa pura = ${m} mol/L × ${pm} g/mol × ${vL} L = ${pureMass.toFixed(3)} g`,
          purity < 100 ? `Masa ajustada por pureza = ${pureMass.toFixed(3)} g / (${purity}/100) = ${realMassToWeigh} g` : '',
          `Normalidad = ${m} M × ${val} eq/mol = ${normality} N`
        ].filter(Boolean)
      };
    }
  },
  {
    id: 'control_calidad_westgard_sigma',
    category: 'soluciones_qc',
    name: 'Control de Calidad Interno: Coeficiente de Variación (CV%), Reglas de Westgard y Sigma-metría',
    shortName: 'Control Calidad & Reglas Westgard',
    formulaEquation: 'CV (%) = ( SD / Media ) × 100 | Sigma = ( TEa% - Sesgo% ) / CV%',
    formulaDisplay: '1. Coeficiente de Variación (CV%) = [ Desviación Estándar (SD) / Media (X̄) ] × 100\n2. Error Sistemático / Sesgo (Bias %) = [ |Media Obtenida - Valor Asignado| / Valor Asignado ] × 100\n3. Métrica Seis Sigma = [ Error Total Permitido (TEa %) - Sesgo (%) ] / CV (%)\n4. Evaluación de Reglas de Westgard (1_2s, 1_3s, 2_2s, R_4s, 4_1s, 10_x)',
    description: 'Herramienta de aseguramiento y garantía de calidad analítica para validación de corridas en analizadores de laboratorio clínico.',
    clinicalSignificance: 'Clasificación de Rendimiento Sigma:\n- ≥ 6.0 σ: Rendimiento Clase Mundial (World Class Quality - excelente estabilidad).\n- 5.0 - 5.9 σ: Excelente.\n- 4.0 - 4.9 σ: Bueno.\n- 3.0 - 3.9 σ: Mínimo aceptable para diagnóstico clínico.\n- < 3.0 σ: Rendimiento Inaceptable (requiere re-calibración, cambio de lote de reactivos o mantenimiento técnico).',
    tags: ['control de calidad', 'westgard', 'seis sigma', 'levey jennings', 'cv%', 'sesgo', 'tea', 'calibracion'],
    inputs: [
      { id: 'mean_obs', name: 'Media obtenida del control (X̄)', symbol: 'Media', unit: 'unidades', defaultValue: 100.2, min: 0.1, max: 10000, step: 0.1 },
      { id: 'sd_obs', name: 'Desviación Estándar observada (SD)', symbol: 'SD', unit: 'unidades', defaultValue: 2.1, min: 0.001, max: 1000, step: 0.01 },
      { id: 'target_val', name: 'Valor diana / Asignado por el fabricante del suero control', symbol: 'Target', unit: 'unidades', defaultValue: 100.0, min: 0.1, max: 10000, step: 0.1 },
      { id: 'tea_pct', name: 'Error Total Permitido (TEa % de CLIA o Ricos/SEQC)', symbol: 'TEa', unit: '%', defaultValue: 10.0, min: 1.0, max: 50.0, step: 0.5 }
    ],
    calculate: (inputs) => {
      const mean = Number(inputs.mean_obs);
      const sd = Number(inputs.sd_obs);
      const target = Number(inputs.target_val);
      const tea = Number(inputs.tea_pct);

      if (!mean || !sd || !target || !tea || mean <= 0 || sd <= 0 || target <= 0) {
        return { results: [], interpretation: 'Complete la media, SD, valor target y TEa%.' };
      }

      const cv = Number(((sd / mean) * 100).toFixed(2));
      const biasPct = Number(((Math.abs(mean - target) / target) * 100).toFixed(2));
      const sigma = Number(((tea - biasPct) / cv).toFixed(2));

      let sigmaStatus: 'normal' | 'low' | 'critical-low' | 'high' = 'normal';
      let sigmaLabel = '';
      let interp = '';

      if (sigma >= 6.0) {
        sigmaStatus = 'normal';
        sigmaLabel = 'Clase Mundial (≥ 6.0 σ)';
        interp = `Excelente rendimiento Seis Sigma (${sigma} σ). Desempeño de Clase Mundial. Se recomienda regla única simple 1_3s con mínima tasa de falsos rechazos.`;
      } else if (sigma >= 4.0) {
        sigmaStatus = 'normal';
        sigmaLabel = 'Rendimiento Bueno (4.0 - 5.9 σ)';
        interp = `Buen rendimiento analítico (${sigma} σ). Aplicar multirreglas de Westgard (1_3s, 2_2s, R_4s).`;
      } else if (sigma >= 3.0) {
        sigmaStatus = 'low';
        sigmaLabel = 'Rendimiento Marginal / Aceptable (3.0 - 3.9 σ)';
        interp = `Rendimiento marginal (${sigma} σ). Control de calidad estricto con múltiples niveles de control e inspección de calibración.`;
      } else {
        sigmaStatus = 'critical-low';
        sigmaLabel = '⚠️ Inaceptable (< 3.0 σ)';
        interp = `⚠️ Rendimiento inaceptable (${sigma} σ < 3.0). El método no garantiza la seguridad analítica requerida para el error total permitido (${tea}%). Detener corridas de pacientes, recalibrar el método o revisar mantenimiento del equipo.`;
      }

      return {
        results: [
          { id: 'sigma_score', name: 'Métrica Seis Sigma (Sigma)', value: sigma, unit: 'σ', referenceRange: '≥ 4.0 σ (Deseable) | ≥ 6.0 σ (Excelente)', status: sigmaStatus, statusLabel: sigmaLabel },
          { id: 'cv_pct', name: 'Coeficiente de Variación (CV%) [Imprecisión]', value: cv, unit: '%', status: 'info' },
          { id: 'bias_pct', name: 'Sesgo / Bias (%) [Inexactitud]', value: biasPct, unit: '%', status: 'info' }
        ],
        interpretation: interp,
        steps: [
          `CV% = (${sd} / ${mean}) × 100 = ${cv}%`,
          `Sesgo% = [ |${mean} - ${target}| / ${target} ] × 100 = ${biasPct}%`,
          `Sigma = (${tea}% - ${biasPct}%) / ${cv}% = ${sigma} σ`
        ]
      };
    }
  }
];
