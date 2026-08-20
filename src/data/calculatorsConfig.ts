import { FormulaDefinition, LabCategory } from '../types/laboratory';
import { HEMATOLOGY_CALCULATORS } from './calculators/hematology';
import { CHEMISTRY_CALCULATORS } from './calculators/chemistry';
import { HORMONE_CALCULATORS } from './calculators/hormones';
import { URINE_CALCULATORS } from './calculators/urine';
import { GASES_CALCULATORS } from './calculators/gases';
import { ELECTROLYTES_CALCULATORS } from './calculators/electrolytes';
import { ENZYMES_CALCULATORS } from './calculators/enzymes';
import { LIPIDS_CALCULATORS } from './calculators/lipids';
import { OTHER_CALCULATORS } from './calculators/others';

export const ALL_CALCULATORS: FormulaDefinition[] = [
  ...HEMATOLOGY_CALCULATORS,
  ...CHEMISTRY_CALCULATORS,
  ...HORMONE_CALCULATORS,
  ...URINE_CALCULATORS,
  ...GASES_CALCULATORS,
  ...ELECTROLYTES_CALCULATORS,
  ...ENZYMES_CALCULATORS,
  ...LIPIDS_CALCULATORS,
  ...OTHER_CALCULATORS
];

export function getCalculatorsByCategory(category: LabCategory): FormulaDefinition[] {
  return ALL_CALCULATORS.filter(c => c.category === category);
}

export function getCalculatorById(id: string): FormulaDefinition | undefined {
  return ALL_CALCULATORS.find(c => c.id === id);
}

export function searchCalculators(query: string): FormulaDefinition[] {
  if (!query || !query.trim()) return ALL_CALCULATORS;
  const q = query.toLowerCase().trim();
  return ALL_CALCULATORS.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.shortName.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.tags.some(tag => tag.toLowerCase().includes(q))
  );
}
