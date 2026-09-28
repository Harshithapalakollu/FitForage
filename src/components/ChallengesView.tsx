import React from 'react';
import { Challenge } from '../types';
import { soundEffects } from '../utils/soundEffects';
import { 
  Trophy, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Award, 
  Shield, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ChallengesViewProps {
  challenges: Challenge[];
  onSaveChallenges: (challenges: Challenge[]) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  challenges,
  onSaveChallenges,
}) => {
  const handleToggleDay = (challengeId: string, dayNumber: number) => {
    const updated = challenges.map((c) => {
      if (c.id !== challengeId) return c;
      const completed = c.completedDays.includes(dayNumber);
      const newDays = completed
        ? c.completedDays.filter((d) => d !== dayNumber)
        : [...c.completedDays, dayNumber].sort((a, b) => a - b);
      
      if (!completed) {
        soundEffects.beep(880, 120);
        if (newDays.length === c.totalDays) {
          soundEffects.chime();
        }
      }
      return { ...c, completedDays: newDays };
    });
    onSaveChallenges(updated);
  };

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'Shield': return <Shield className="w-5 h-5 text-sky-400" />;
      case 'Award': return <Award className="w-5 h-5 text-emerald-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-orange-400" />;
      default: return <Trophy className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-[#1A2130] pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#CCFF00] uppercase tracking-wider mb-1">
          <Trophy className="w-3.5 h-3.5" />
          <span>Gamified Habit Engineering</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Fitness Challenges</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Commit to disciplined 30-day movement protocols. Check off each day to forge neuromuscular conditioning.
        </p>
      </div>

      {/* Challenges Grid */}
      <div className="space-y-6">
        {challenges.map((c) => {
          const percent = Math.round((c.completedDays.length / c.totalDays) * 100);
          const isComplete = c.completedDays.length === c.totalDays;

          // Compute current streak from consecutive completed days
          let currentStreak = 0;
          for (let i = 1; i <= c.totalDays; i++) {
            if (c.completedDays.includes(i)) {
              currentStreak++;
            } else {
              break;
            }
          }

          return (
            <div
              key={c.id}
              className={`p-6 rounded-2xl border transition-all ${
                isComplete
                  ? 'bg-[#121915] border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                  : 'bg-[#0F131D] border-[#1E2538]'
              }`}
            >
              {/* Challenge Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2233] pb-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#161B28] shrink-0 mt-0.5">
                    {getBadgeIcon(c.badgeIcon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{c.title}</h3>
                      {isComplete && (
                        <span className="text-[10px] font-mono font-bold bg-emerald-500 text-black px-2 py-0.5 rounded">
                          COMPLETED 🏆
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{c.targetDescription}</p>
                    <div className="mt-2 text-xs font-mono text-[#CCFF00]">
                      <span className="text-slate-400">Daily Target: </span>
                      {c.dailyGoal}
                    </div>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="flex items-center gap-4 self-end sm:self-center font-mono text-xs">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">PROGRESS</span>
                    <span className="text-base font-bold text-white tabular-nums">
                      {c.completedDays.length} / {c.totalDays} Days ({percent}%)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">STREAK</span>
                    <span className="text-base font-bold text-[#CCFF00] tabular-nums">
                      {currentStreak} Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[#181D2A] overflow-hidden my-4">
                <div
                  className="h-full bg-gradient-to-r from-[#CCFF00] to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Day-by-day Checkbox Grid (1 to 30) */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Interactive Check-In Grid (Tap day to toggle):
                </span>
                <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-15 gap-1.5 pt-1">
                  {Array.from({ length: c.totalDays }, (_, i) => i + 1).map((day) => {
                    const done = c.completedDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => handleToggleDay(c.id, day)}
                        className={`h-9 rounded-lg flex flex-col items-center justify-center font-mono text-xs font-bold transition-all border ${
                          done
                            ? 'bg-[#CCFF00] text-black border-[#CCFF00] shadow-sm shadow-[#CCFF00]/20'
                            : 'bg-[#141824] text-slate-400 border-[#222B3D] hover:border-slate-500'
                        }`}
                        title={`Day ${day}: Click to toggle`}
                      >
                        <span className="text-[10px] tabular-nums">{day}</span>
                        {done && <span className="text-[8px] leading-none">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
