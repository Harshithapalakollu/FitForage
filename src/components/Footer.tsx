import React from 'react';
import { ActiveTab } from '../types';
import { Dumbbell, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="border-t border-[#1A1F2C] bg-[#07090E] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#CCFF00] to-[#99CC00] flex items-center justify-center text-black font-bold">
                <Dumbbell className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-mono">
                FIT<span className="text-[#CCFF00]">FORGE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Train Smarter. Eat Better. Become Stronger. A comprehensive digital fitness platform engineered for high-performance hypertrophy, conditioning, and nutrition science.
            </p>
          </div>

          {/* Quick Nav Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block font-bold">
                Platform Modules
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors">
                    Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('workouts')} className="hover:text-white transition-colors">
                    Workout Planner
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('nutrition')} className="hover:text-white transition-colors">
                    Goal Nutrition
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('exercises')} className="hover:text-white transition-colors">
                    Exercise Library
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block font-bold">
                Athletic Tools
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActiveTab('calculators')} className="hover:text-white transition-colors">
                    Fitness Calculators
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('progress')} className="hover:text-white transition-colors">
                    Progress & PRs
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('timer')} className="hover:text-white transition-colors">
                    Workout Stopwatch
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('challenges')} className="hover:text-white transition-colors">
                    30-Day Challenges
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block font-bold">
                Evidence Protocols
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActiveTab('tips')} className="hover:text-white transition-colors">
                    Daily Fitness Tips
                  </button>
                </li>
                <li>
                  <span className="text-slate-500">Mifflin-St Jeor Energy</span>
                </li>
                <li>
                  <span className="text-slate-500">Progressive Overload</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-[#0B0E16] border border-[#171D2B] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-300 block">General Wellness & Non-Medical Notice</span>
            <p className="text-[11px] leading-relaxed text-slate-400">
              The workout routines, macronutrient breakdowns, calorie targets, and hydration calculations generated on FitForge are intended solely for general fitness, wellness, and educational purposes. FitForge does not provide medical diagnoses, treatment plans, or dietary therapy. Users with cardiovascular conditions, joint injuries, pregnancy, or medical histories must consult with a qualified physician before undertaking strenuous physical exertion.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-[#141926] flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px] font-mono">
          <p>© {new Date().getFullYear()} FitForge Platform. Built for dedication, consistency, and strength.</p>
          <p>No shortcuts. Just iron and discipline.</p>
        </div>
      </div>
    </footer>
  );
};
