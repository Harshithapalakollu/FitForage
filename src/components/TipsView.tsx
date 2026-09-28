import React, { useState } from 'react';
import { FITNESS_TIPS } from '../data/tipsData';
import { FitnessTip } from '../types';
import { 
  Lightbulb, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Dumbbell, 
  Utensils, 
  Droplet, 
  Moon, 
  HeartPulse, 
  Compass, 
  CheckCircle2 
} from 'lucide-react';

interface TipsViewProps {
  savedTips: string[];
  onToggleSaveTip: (tipId: string) => void;
}

export const TipsView: React.FC<TipsViewProps> = ({
  savedTips,
  onToggleSaveTip,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FitnessTip['category'] | 'all'>('all');

  const categories: { id: FitnessTip['category'] | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Knowledge', icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { id: 'training', label: 'Training', icon: <Dumbbell className="w-3.5 h-3.5" /> },
    { id: 'nutrition', label: 'Nutrition', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'hydration', label: 'Hydration', icon: <Droplet className="w-3.5 h-3.5" /> },
    { id: 'sleep', label: 'Sleep & CNS', icon: <Moon className="w-3.5 h-3.5" /> },
    { id: 'recovery', label: 'Recovery', icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { id: 'mobility', label: 'Mobility', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'technique', label: 'Technique', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  const filteredTips = selectedCategory === 'all'
    ? FITNESS_TIPS
    : FITNESS_TIPS.filter((t) => t.category === selectedCategory);

  const tipOfTheDay = FITNESS_TIPS[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-[#1A2130] pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#CCFF00] uppercase tracking-wider mb-1">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Evidence-Based Athletic Protocol</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Daily Fitness Tips</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Concise, scientifically validated training principles, recovery strategies, and nutritional optimization.
        </p>
      </div>

      {/* Tip of the Day Spotlight */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#121824] via-[#0E131E] to-[#141A28] border border-[#212C42] space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#CCFF00] uppercase font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Spotlight Protocol of the Day</span>
          </div>
          <button
            onClick={() => onToggleSaveTip(tipOfTheDay.id)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
          >
            {savedTips.includes(tipOfTheDay.id) ? (
              <BookmarkCheck className="w-4 h-4 text-[#CCFF00]" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            <span>{savedTips.includes(tipOfTheDay.id) ? 'Saved' : 'Save Tip'}</span>
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white max-w-2xl">
          {tipOfTheDay.title}
        </h2>

        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          {tipOfTheDay.content}
        </p>

        <div className="p-4 rounded-xl bg-[#090C14] border border-[#1A2336] flex items-start gap-3">
          <span className="text-xs font-mono font-bold text-[#CCFF00] uppercase shrink-0 mt-0.5">
            Actionable Cue:
          </span>
          <span className="text-xs text-white font-medium">
            {tipOfTheDay.actionableCue}
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#10131E] border border-[#1C2335] rounded-xl overflow-x-auto scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              selectedCategory === c.id
                ? 'bg-[#182030] text-[#CCFF00] border border-[#2D3954] shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#141824]'
            }`}
          >
            {c.icon}
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Tips Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTips.map((tip) => {
          const isSaved = savedTips.includes(tip.id);
          return (
            <div
              key={tip.id}
              className="p-5 rounded-2xl bg-[#0F131D] border border-[#1D2538] hover:border-[#2C3852] transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#CCFF00] font-bold uppercase">{tip.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{tip.readTime}</span>
                    <button
                      onClick={() => onToggleSaveTip(tip.id)}
                      className="text-slate-500 hover:text-white transition-colors"
                      title={isSaved ? 'Remove Bookmark' : 'Bookmark Tip'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-[#CCFF00]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{tip.title}</h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {tip.content}
                </p>
              </div>

              <div className="pt-3 border-t border-[#192132] bg-[#0A0D14] -mx-5 -mb-5 p-4 rounded-b-2xl flex items-start gap-2">
                <span className="text-[10px] font-mono font-bold text-[#CCFF00] uppercase shrink-0 mt-0.5">
                  Action Cue:
                </span>
                <span className="text-xs text-slate-300">{tip.actionableCue}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
