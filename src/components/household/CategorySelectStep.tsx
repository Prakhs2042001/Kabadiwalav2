import React from 'react';
import {
  FileText,
  Package,
  Wrench,
  Cpu,
  Check,
  ArrowRight,
  ArrowLeft,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { WasteCategoryType } from '../../types';
import { WASTE_CATEGORIES } from '../../data/seedData';

interface CategorySelectStepProps {
  selectedCategories: WasteCategoryType[];
  onToggleCategory: (category: WasteCategoryType) => void;
  onContinue: () => void;
  onBack: () => void;
  totalMatchingKabadiwalas: number;
}

export const CategorySelectStep: React.FC<CategorySelectStepProps> = ({
  selectedCategories,
  onToggleCategory,
  onContinue,
  onBack,
  totalMatchingKabadiwalas
}) => {
  const getCategoryIcon = (category: WasteCategoryType) => {
    switch (category) {
      case 'Paper':
        return <span className="text-2xl">📄</span>;
      case 'Plastic':
        return <span className="text-2xl">🧴</span>;
      case 'Metal':
        return <span className="text-2xl">🔩</span>;
      case 'E-Waste':
        return <span className="text-2xl">💻</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Breadcrumb & Step Info */}
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E0D5C3] hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Location</span>
        </button>

        <span className="text-xs font-mono font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
          Step 2 of 4 — Scrap Selection
        </span>
      </div>

      {/* Heading */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-[#240A39]">
          What type of waste do you want to sell?
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Select one or more categories. We will filter nearby Kabadiwalas who accept all your selected materials.
        </p>
      </div>

      {/* Selected Categories Indicator Bar */}
      {selectedCategories.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold">Selected Scrap Types:</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs font-bold bg-[#240A39] text-amber-300 px-2.5 py-0.5 rounded-md flex items-center gap-1"
                >
                  <span>{cat}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCategory(cat);
                    }}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="text-xs font-mono font-bold text-[#240A39]">
            {totalMatchingKabadiwalas} Matching Kabadiwala{totalMatchingKabadiwalas === 1 ? '' : 's'} Found
          </div>
        </div>
      )}

      {/* Large Visual Cards (Multi-Select) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {WASTE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategories.includes(cat.name);

          return (
            <div
              key={cat.id}
              onClick={() => onToggleCategory(cat.name)}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between relative group ${
                isSelected
                  ? 'border-[#240A39] bg-white shadow-md ring-2 ring-[#240A39]/10'
                  : 'border-[#E0D5C3] bg-white hover:border-[#240A39] hover:bg-stone-50/50'
              }`}
            >
              {/* Checkmark Badge */}
              <div className="absolute top-5 right-5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#240A39] text-amber-400 shadow-sm'
                      : 'border-2 border-slate-300 bg-white group-hover:border-slate-400'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              <div className="space-y-4 pr-8">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center">
                  {getCategoryIcon(cat.name)}
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-black text-xl text-slate-900 group-hover:text-[#240A39]">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Common Items Preview */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                    Common items:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.examples.map((item, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-stone-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className={isSelected ? 'text-[#240A39]' : 'text-slate-500'}>
                  {isSelected ? '✓ Selected for comparison' : '+ Click to add'}
                </span>
                <span className="font-mono text-slate-400">Doorstep pickup</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E0D5C3]">
        <div className="text-xs text-slate-600 text-center sm:text-left">
          {selectedCategories.length === 0 ? (
            <span className="text-amber-800 font-medium flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              Please select at least one waste category to see matching rates.
            </span>
          ) : (
            <span className="text-emerald-800 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Ready to compare {selectedCategories.join(' + ')} rates!
            </span>
          )}
        </div>

        <button
          onClick={onContinue}
          disabled={selectedCategories.length === 0}
          className="w-full sm:w-auto h-12 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#240A39] font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Compare Local Rates & Nearby Kabadiwalas</span>
          <ArrowRight className="w-4 h-4 text-[#240A39]" />
        </button>
      </div>
    </div>
  );
};
