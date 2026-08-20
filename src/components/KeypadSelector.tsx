import React from 'react';
import { 
  Droplet, 
  FlaskConical, 
  Activity, 
  TestTube2, 
  Wind, 
  Zap, 
  Cog, 
  HeartPulse, 
  Dna, 
  Ribbon, 
  ShieldAlert, 
  Crosshair, 
  Microscope, 
  Binary, 
  Layers
} from 'lucide-react';
import { LabCategory, CategoryInfo } from '../types/laboratory';
import { CATEGORIES } from '../data/categories';

interface KeypadSelectorProps {
  selectedCategory: LabCategory | 'all';
  onSelectCategory: (cat: LabCategory | 'all') => void;
}

export const KeypadSelector: React.FC<KeypadSelectorProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  // Map string icon names to Lucide icons
  const getIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Droplet': return <Droplet className={className} />;
      case 'FlaskConical': return <FlaskConical className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'TestTube2': return <TestTube2 className={className} />;
      case 'Wind': return <Wind className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Cog': return <Cog className={className} />;
      case 'HeartPulse': return <HeartPulse className={className} />;
      case 'Dna': return <Dna className={className} />;
      case 'Ribbon': return <Ribbon className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'Crosshair': return <Crosshair className={className} />;
      case 'Microscope': return <Microscope className={className} />;
      case 'Bacteria': return <Binary className={className} />;
      case 'Layers': return <Layers className={className} />;
      default: return <FlaskConical className={className} />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300">
            Especialidades de Análisis Clínicos
          </h2>
        </div>
        <button
          id="btn-category-all"
          onClick={() => onSelectCategory('all')}
          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
            selectedCategory === 'all'
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
              : 'text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Ver Todas
        </button>
      </div>

      {/* Grid of 15 buttons mirroring the reference keypad */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-2.5">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`category-btn-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border text-center transition-all duration-200 group relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-sky-500 shadow-lg shadow-sky-500/10 scale-[1.02] ring-1 ring-sky-500/50'
                  : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800/90 hover:border-slate-700'
              }`}
            >
              {/* Icon Container with glowing background */}
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110 ${cat.bgColor} border ${cat.borderColor}`}>
                {getIcon(cat.iconName, `w-4 h-4 sm:w-5 sm:h-5 ${cat.color}`)}
              </div>

              {/* Title */}
              <span className={`text-[11px] sm:text-xs font-bold leading-tight line-clamp-1 ${
                isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
              }`}>
                {cat.name}
              </span>

              {/* Formula count badge */}
              <span className="text-[10px] text-slate-500 mt-0.5 font-medium">
                {cat.count} fórmulas
              </span>

              {/* Active Indicator Bar */}
              {isSelected && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-sky-500 to-teal-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
