import { CategoryInfo, LabCategory } from '../types/laboratory';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'hematologia',
    name: 'Hematología',
    shortName: 'Hemato',
    iconName: 'Droplet',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    description: 'Índices hematimétricos, reticulocitos, IPR, cámara de Neubauer y recuentos celulares.',
    count: 5
  },
  {
    id: 'quimica_clinica',
    name: 'Química Clínica',
    shortName: 'Química',
    iconName: 'FlaskConical',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
    description: 'Filtrado glomerular (CKD-EPI, MDRD, Cockcroft), osmolaridad, aclaramiento y superficie corporal.',
    count: 5
  },
  {
    id: 'hormonas',
    name: 'Hormonas',
    shortName: 'Hormonas',
    iconName: 'Activity',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    description: 'HOMA-IR, HOMA-β, índice QUICKI, relación LH/FSH, tiroides y cortisol.',
    count: 4
  },
  {
    id: 'orina',
    name: 'Orina',
    shortName: 'Orina',
    iconName: 'TestTube2',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    description: 'FENa, FEUrea, FEK, cociente Albúmina/Creatinina (ACR) y UPCR.',
    count: 4
  },
  {
    id: 'gases_arteriales',
    name: 'Gases Arteriales',
    shortName: 'Gases',
    iconName: 'Wind',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    description: 'Gasometría arterial, Anion Gap, Delta-Delta, fórmula de Winter y gradiente A-a.',
    count: 4
  },
  {
    id: 'electrolitos',
    name: 'Electrolitos',
    shortName: 'Electrolitos',
    iconName: 'Zap',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Sodio corregido por glucosa, calcio corregido, déficit de agua libre, sodio y potasio.',
    count: 4
  },
  {
    id: 'enzimas',
    name: 'Enzimas',
    shortName: 'Enzimas',
    iconName: 'Cog',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    description: 'Cociente AST/ALT (De Ritis), APRI score, FIB-4 y fracción CK-MB.',
    count: 3
  },
  {
    id: 'lipidos',
    name: 'Lípidos',
    shortName: 'Lípidos',
    iconName: 'HeartPulse',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    description: 'LDL por Friedewald, Martin-Hopkins y Sampson (NIH), No-HDL y ratios de Castelli.',
    count: 3
  },
  {
    id: 'proteinas',
    name: 'Proteínas',
    shortName: 'Proteínas',
    iconName: 'Dna',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'Relación Albúmina/Globulina (A/G), proteinograma electroforético y fracciones séricas.',
    count: 2
  },
  {
    id: 'marcadores_tumorales',
    name: 'Marcadores Tumorales',
    shortName: 'Marcadores',
    iconName: 'Ribbon',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    description: 'Densidad de PSA, porcentaje de PSA Libre y tiempo de duplicación tumoral (PSADT).',
    count: 2
  },
  {
    id: 'coagulacion',
    name: 'Coagulación',
    shortName: 'Coagulación',
    iconName: 'ShieldAlert',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    description: 'INR, ratio TTPa, e índice de Rosner (prueba de mezclas para anticoagulante lúpico).',
    count: 3
  },
  {
    id: 'inmunologia',
    name: 'Inmunología',
    shortName: 'Inmuno',
    iconName: 'Crosshair',
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    description: 'Índice de corte (Signal/Cut-Off S/CO), diluciones seriadas y avidez de IgG.',
    count: 2
  },
  {
    id: 'serologia',
    name: 'Serología & Diagnóstico',
    shortName: 'Serología',
    iconName: 'Microscope',
    color: 'text-blue-500',
    bgColor: 'bg-blue-600/10',
    borderColor: 'border-blue-600/30',
    description: 'Evaluación diagnóstica: Sensibilidad, Especificidad, VPP, VPN y Likelihood Ratios.',
    count: 2
  },
  {
    id: 'microbiologia',
    name: 'Microbiología',
    shortName: 'Microbio',
    iconName: 'Bacteria',
    color: 'text-lime-400',
    bgColor: 'bg-lime-500/10',
    borderColor: 'border-lime-500/30',
    description: 'Recuento de colonias (UFC/mL) con placa o asa calibrada, escala McFarland.',
    count: 2
  },
  {
    id: 'soluciones_qc',
    name: 'Soluciones & QC',
    shortName: 'Soluciones',
    iconName: 'Layers',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    description: 'Molaridad, diluciones C1V1=C2V2, control de calidad y Reglas de Westgard.',
    count: 3
  }
];
