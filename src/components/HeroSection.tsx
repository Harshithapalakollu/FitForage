import React from 'react';
import { ActiveTab, FitnessGoal } from '../types';
import { 
  Dumbbell, 
  Flame, 
  Utensils, 
  BookOpen, 
  TrendingUp, 
  Calculator, 
  Lightbulb, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Target,
  HeartPulse,
  Activity,
  Compass,
  Trophy,
  Bot
} from 'lucide-react';
import heroImg from '../assets/images/fitforge_hero_gym_1790578630936.jpg';

interface HeroSectionProps {
  onBuildPlan: () => void;
  onExploreWorkouts: () => void;
  onSelectGoal: (goal: FitnessGoal) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBuildPlan,
  onExploreWorkouts,
  onSelectGoal,
  setActiveTab,
}) => {
  const features = [
    {
      icon: <Dumbbell className="w-5 h-5 text-[#CCFF00]" />,
      title: 'Personalized Workout Plans',
      desc: 'Targeted multi-day splits tailored to your equipment, experience, and hypertrophy goals.',
      tab: 'workouts' as ActiveTab,
    },
    {
      icon: <Utensils className="w-5 h-5 text-emerald-400" />,
      title: 'Goal-Based Nutrition',
      desc: 'Precise macro distributions, calculated calorie deficits/surpluses, and balanced meal timing.',
      tab: 'nutrition' as ActiveTab,
    },
    {
      icon: <BookOpen className="w-5 h-5 text-sky-400" />,
      title: 'Exercise Library',
      desc: 'Comprehensive form guides, cue breakdowns, muscle focus targets, and movement alternatives.',
      tab: 'exercises' as ActiveTab,
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
      title: 'Progress Tracking',
      desc: 'Log body weight trends, circumferences, personal records (PRs), and daily step targets.',
      tab: 'progress' as ActiveTab,
    },
    {
      icon: <Calculator className="w-5 h-5 text-violet-400" />,
      title: 'Fitness Calculator',
      desc: 'Scientific BMI, BMR, TDEE, macro split, water requirement, and ideal body mass tools.',
      tab: 'calculators' as ActiveTab,
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-rose-400" />,
      title: 'Daily Fitness Tips',
      desc: 'Evidence-backed guidance covering biomechanics, recovery, sleep architecture, and nutrition.',
      tab: 'tips' as ActiveTab,
    },
  ];

  const goalCards: {
    id: FitnessGoal;
    title: string;
    description: string;
    icon: React.ReactNode;
    tag: string;
  }[] = [
    {
      id: 'build_muscle',
      title: 'Build Muscle',
      description: 'Progressive overload, high tension volume, and hypertrophy-optimized compound lifting.',
      icon: <Dumbbell className="w-6 h-6 text-[#CCFF00]" />,
      tag: 'Hypertrophy Focus',
    },
    {
      id: 'lose_fat',
      title: 'Lose Fat',
      description: 'Preserve metabolically active lean muscle while sustaining an energetic calorie deficit.',
      icon: <Flame className="w-6 h-6 text-orange-400" />,
      tag: 'Lean Cut',
    },
    {
      id: 'six_pack_abs',
      title: 'Get Six-Pack Abs',
      description: 'Targeted rectus abdominis, oblique rotational work, and visceral core conditioning.',
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      tag: 'Core Definition',
    },
    {
      id: 'improve_strength',
      title: 'Improve Strength',
      description: 'Maximal neuromuscular recruitment across squat, bench press, deadlift, and overhead press.',
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      tag: 'Heavy Compound',
    },
    {
      id: 'improve_endurance',
      title: 'Improve Endurance',
      description: 'Elevate VO2 max, lactate threshold, cardiovascular stamina, and work capacity.',
      icon: <HeartPulse className="w-6 h-6 text-rose-400" />,
      tag: 'Cardio Stamina',
    },
    {
      id: 'general_fitness',
      title: 'General Fitness',
      description: 'Comprehensive functional strength, joint longevity, posture, and vibrant daily energy.',
      icon: <Activity className="w-6 h-6 text-cyan-400" />,
      tag: 'Total Health',
    },
    {
      id: 'improve_flexibility',
      title: 'Improve Flexibility',
      description: 'Unlock tight hip flexors, ankle dorsiflexion, spinal decompression, and dynamic mobility.',
      icon: <Compass className="w-6 h-6 text-teal-400" />,
      tag: 'Mobility & Joints',
    },
    {
      id: 'athletic_performance',
      title: 'Athletic Performance',
      description: 'Explosive power, sprinting mechanics, deceleration stability, and multi-directional speed.',
      icon: <Trophy className="w-6 h-6 text-yellow-400" />,
      tag: 'Speed & Agility',
    },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-2xl border border-[#1E2536] bg-[#0E111A]">
        {/* Background Visual with Measured Dark Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="FitForge Gym Workout"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30 lg:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F] via-[#090A0F]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E111A] via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl px-6 py-16 sm:px-12 sm:py-24 lg:py-28">
          {/* Unboxed natural kicker */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#CCFF00] uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
            <span>Modern Fitness Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Science-Backed Protocols</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-2xl leading-[1.1] [text-wrap:balance]">
            Train Smarter. Eat Better. <span className="text-[#CCFF00]">Become Stronger.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
            FitForge designs custom resistance programs, calculated nutrition frameworks, 
            and precision progress tracking calibrated to your body, equipment, and personal ambitions.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onBuildPlan}
              className="px-6 py-3 text-sm font-bold text-black bg-[#CCFF00] hover:bg-[#bbf000] rounded-lg transition-all shadow-lg shadow-[#CCFF00]/20 flex items-center gap-2 group whitespace-nowrap"
            >
              <span>Build My Fitness Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreWorkouts}
              className="px-6 py-3 text-sm font-semibold text-slate-200 hover:text-white bg-[#161B27] hover:bg-[#1E2536] border border-[#2B354C] rounded-lg transition-colors whitespace-nowrap"
            >
              Explore Workouts
            </button>

            <button
              onClick={() => {
                const officialBtn = document.querySelector('.chat-toggle') as HTMLElement;
                if (officialBtn) {
                  officialBtn.click();
                } else {
                  const pillBtn = document.querySelector('[title="Open FitForge AI Coach"]') as HTMLElement;
                  if (pillBtn) pillBtn.click();
                }
              }}
              className="px-5 py-3 text-sm font-semibold text-[#CCFF00] hover:text-white bg-[#101420] hover:bg-[#181D29] border border-[#2B354C] hover:border-[#CCFF00]/60 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
              title="Chat with n8n AI Coach"
            >
              <Bot className="w-4 h-4 text-[#CCFF00]" />
              <span>Ask AI Coach</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse"></span>
            </button>
          </div>

          {/* Clean proof metric strip */}
          <div className="mt-12 pt-8 border-t border-[#1C2233] flex flex-wrap items-center gap-8 text-xs text-slate-400 font-mono">
            <div>
              <span className="text-white font-bold text-base tabular-nums">40+</span>
              <span className="ml-1.5 text-slate-400">Gym & Home Exercises</span>
            </div>
            <div>
              <span className="text-white font-bold text-base tabular-nums">8</span>
              <span className="ml-1.5 text-slate-400">Targeted Goal Splits</span>
            </div>
            <div>
              <span className="text-white font-bold text-base tabular-nums">100%</span>
              <span className="ml-1.5 text-slate-400">Customized Calculations</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURE CARDS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#1A1F2C] pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Engineered For Physical Transformation</h2>
            <p className="text-sm text-slate-400 mt-1">Everything needed to plan, execute, and document your fitness evolution.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab(feat.tab)}
              className="group p-5 rounded-xl bg-[#10131D] hover:bg-[#141926] border border-[#1C2333] hover:border-[#2C3750] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#181D2B] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-[#CCFF00] transition-colors">
                  {feat.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#181D2B] flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-200">
                <span>Open module</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CHOOSE YOUR GOAL SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#1A1F2C] pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Choose Your Goal</h2>
            <p className="text-sm text-slate-400 mt-1">Select your primary objective to activate calibrated training volume and nutritional ratios.</p>
          </div>
          <span className="text-xs font-mono text-[#CCFF00]">8 Curated Paths</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {goalCards.map((card) => (
            <div
              key={card.id}
              onClick={() => onSelectGoal(card.id)}
              className="group relative p-5 rounded-xl bg-[#10131D] hover:bg-[#151A28] border border-[#1C2333] hover:border-[#CCFF00]/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-[#181D2A] group-hover:bg-[#1E2536] transition-colors">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {card.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#CCFF00] transition-colors">
                  {card.title}
                </h3>

                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#181D2B] flex items-center justify-between text-xs font-semibold text-[#CCFF00]">
                <span>Select & Generate</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HEALTH & SAFETY DISCLAIMER BANNER */}
      <div className="p-4 rounded-xl bg-[#10131C] border border-[#1E2536] flex items-start gap-3.5 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-slate-300 font-semibold">General Wellness & Safety Advisory</p>
          <p className="leading-relaxed">
            FitForge workout routines and nutritional calculations are designed for general fitness and informational purposes. 
            They do not constitute medical diagnosis or advice. Beginners should start with light resistance to master exercise mechanics. 
            If you have pre-existing cardiovascular conditions, joint injuries, or health considerations, consult a licensed healthcare physician prior to beginning.
          </p>
        </div>
      </div>
    </div>
  );
};
