import React, { useState } from 'react';
import { 
  ActiveTab, 
  DailyMealPlan, 
  PersonalRecord, 
  ProgressLog, 
  UserProfile, 
  WorkoutPlan 
} from '../types';
import { 
  calculateBMI, 
  calculateBMR, 
  calculateMacros, 
  calculateTargetCalories, 
  calculateTDEE, 
  calculateWaterIntake 
} from '../utils/calculators';
import { GOAL_LABELS } from '../data/workoutTemplates';
import { MOTIVATIONAL_QUOTES } from '../data/tipsData';
import { 
  Flame, 
  Target, 
  TrendingUp, 
  Utensils, 
  Dumbbell, 
  Zap, 
  CheckCircle2, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  RefreshCw, 
  PlusCircle, 
  ShieldAlert,
  Droplet
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  activePlan: WorkoutPlan;
  activeMealPlan: DailyMealPlan;
  logs: ProgressLog[];
  prs: PersonalRecord[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAssessment: () => void;
  onOpenLogModal: () => void;
  onStartActiveWorkout: (workoutDayIndex: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  activePlan,
  activeMealPlan,
  logs,
  prs,
  setActiveTab,
  onOpenAssessment,
  onOpenLogModal,
  onStartActiveWorkout,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Calculations
  const bmiInfo = calculateBMI(user.weightKg, user.heightCm);
  const bmr = calculateBMR(user.weightKg, user.heightCm, user.age, user.gender);
  const tdee = calculateTDEE(bmr, user.activityLevel);
  const { targetCalories, deltaLabel } = calculateTargetCalories(tdee, user.primaryGoal);
  const macros = calculateMacros(targetCalories, user.weightKg, user.primaryGoal);
  const water = calculateWaterIntake(user.weightKg, user.preferredDuration);

  // Today's log if available
  const todayLog = logs[logs.length - 1];
  const weightDelta = Number((user.weightKg - user.targetWeightKg).toFixed(1));

  // Determine current day of week (0 = Sunday, 1 = Monday ...)
  const todayDayOfWeek = new Date().getDay();
  // Today's planned workout index mapped to daysPerWeek
  const todayWorkoutIndex = (todayDayOfWeek > 0 && todayDayOfWeek <= activePlan.days.length)
    ? todayDayOfWeek - 1
    : 0;
  const todayWorkout = activePlan.days[todayWorkoutIndex] || activePlan.days[0];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  // SVG Chart points for weight history
  const recentLogs = logs.slice(-7);
  const weights = recentLogs.map((l) => l.weightKg);
  const minW = Math.min(...weights, user.targetWeightKg) - 1;
  const maxW = Math.max(...weights, user.targetWeightKg) + 1;
  const rangeW = maxW - minW || 1;

  const chartPoints = recentLogs.map((l, idx) => {
    const x = (idx / (recentLogs.length - 1 || 1)) * 280 + 10;
    const y = 90 - ((l.weightKg - minW) / rangeW) * 70;
    return { x, y, weight: l.weightKg, date: l.date.slice(5) };
  });

  const svgPathD = chartPoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  return (
    <div className="space-y-8 pb-12">
      {/* 1. TOP HERO DASHBOARD BANNER */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#121622] via-[#0E121B] to-[#141926] border border-[#1F273A] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-[#CCFF00] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00]" />
              <span>Athlete Dashboard</span>
              <span aria-hidden="true">·</span>
              <span>{GOAL_LABELS[user.primaryGoal]?.title || 'Fitness Protocol'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {deltaLabel} · {user.workoutDaysPerWeek} training sessions scheduled this week.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenLogModal}
              className="px-4 py-2.5 rounded-lg bg-[#CCFF00] text-black text-xs font-bold hover:bg-[#b8e600] transition-colors flex items-center gap-1.5 shadow-md shadow-[#CCFF00]/15"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Day</span>
            </button>
            <button
              onClick={onOpenAssessment}
              className="px-4 py-2.5 rounded-lg bg-[#181E2C] text-slate-200 text-xs font-semibold hover:bg-[#20283A] border border-[#273248] transition-colors"
            >
              Edit Assessment
            </button>
          </div>
        </div>

        {/* Motivational message pill with refresh */}
        <div className="mt-5 pt-4 border-t border-[#1C2333] flex items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 italic text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
            <span>"{currentQuote.quote}" — <span className="text-slate-400 not-italic">{currentQuote.author}</span></span>
          </div>
          <button
            onClick={handleNextQuote}
            className="p-1 rounded text-slate-500 hover:text-white transition-colors"
            title="Next quote"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. CORE BIOMETRICS KEY STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Goal Card */}
        <div className="p-4 rounded-xl bg-[#10141E] border border-[#1B2233]">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">CURRENT GOAL</span>
          <span className="text-sm font-bold text-white block truncate">
            {GOAL_LABELS[user.primaryGoal]?.title.split('(')[0] || 'Muscle'}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Level: {user.fitnessLevel}</span>
        </div>

        {/* Weight & Target */}
        <div className="p-4 rounded-xl bg-[#10141E] border border-[#1B2233]">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">CURRENT WEIGHT</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-white font-mono tabular-nums">{user.weightKg}</span>
            <span className="text-xs text-slate-400">kg</span>
          </div>
          <span className="text-[10px] text-[#CCFF00] font-mono tabular-nums mt-1 block">
            Target: {user.targetWeightKg} kg ({weightDelta > 0 ? `-${weightDelta}kg` : `+${Math.abs(weightDelta)}kg`})
          </span>
        </div>

        {/* BMI */}
        <div className="p-4 rounded-xl bg-[#10141E] border border-[#1B2233]">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">BODY MASS INDEX</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-white font-mono tabular-nums">{bmiInfo.bmi}</span>
          </div>
          <span className="text-[10px] font-semibold mt-1 block" style={{ color: bmiInfo.category.color }}>
            {bmiInfo.category.label}
          </span>
        </div>

        {/* Calorie Target */}
        <div className="p-4 rounded-xl bg-[#10141E] border border-[#1B2233]">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">DAILY CALORIES</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-[#CCFF00] font-mono tabular-nums">{targetCalories}</span>
            <span className="text-xs text-slate-400">kcal</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block font-mono tabular-nums">BMR {bmr} · TDEE {tdee}</span>
        </div>

        {/* Protein Target */}
        <div className="p-4 rounded-xl bg-[#10141E] border border-[#1B2233]">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">DAILY PROTEIN</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-emerald-400 font-mono tabular-nums">{macros.proteinGrams}</span>
            <span className="text-xs text-slate-400">g</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block font-mono tabular-nums">
            {((macros.proteinCals / targetCalories) * 100).toFixed(0)}% of total intake
          </span>
        </div>

        {/* Hydration */}
        <div className="p-4 rounded-xl bg-[#10141E] border border-[#1B2233]">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">HYDRATION GOAL</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-sky-400 font-mono tabular-nums">{water.liters}</span>
            <span className="text-xs text-slate-400">L</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block font-mono tabular-nums">~{water.glasses} glasses / day</span>
        </div>
      </div>

      {/* 3. TODAY'S WORKOUT & TODAY'S MEAL SUGGESTIONS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Workout Card */}
        <div className="p-5 rounded-2xl bg-[#10131E] border border-[#1C2335] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#181E2E] text-[#CCFF00]">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Today's Workout</h3>
                  <p className="text-xs text-slate-400">{todayWorkout.dayName} · {todayWorkout.focus}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-[#CCFF00] bg-[#16201B] border border-[#233527] px-2.5 py-1 rounded">
                {user.preferredDuration} MINS
              </span>
            </div>

            {/* Exercises list preview */}
            <div className="space-y-2 mt-4">
              {todayWorkout.exercises.slice(0, 4).map((ex, i) => (
                <div key={ex.id || i} className="p-2.5 rounded-lg bg-[#131826] border border-[#1B2233] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[11px] w-4">{i + 1}.</span>
                    <span className="font-semibold text-slate-100">{ex.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                    <span className="capitalize text-slate-300">{ex.targetMuscle}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#CCFF00]">{ex.sets} sets × {ex.reps}</span>
                  </div>
                </div>
              ))}
              {todayWorkout.exercises.length > 4 && (
                <p className="text-[11px] text-slate-400 text-center pt-1 font-mono">
                  + {todayWorkout.exercises.length - 4} more exercises in this session
                </p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1C2335] flex items-center justify-between gap-3">
            <button
              onClick={() => onStartActiveWorkout(todayWorkoutIndex)}
              className="flex-1 py-2.5 px-4 rounded-lg bg-[#CCFF00] text-black font-bold text-xs hover:bg-[#b8e600] transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#CCFF00]/15"
            >
              <Zap className="w-4 h-4" />
              <span>Start Workout Mode</span>
            </button>
            <button
              onClick={() => setActiveTab('workouts')}
              className="py-2.5 px-3 rounded-lg bg-[#161C2A] text-slate-300 text-xs font-semibold hover:text-white border border-[#222B3D] transition-colors"
            >
              View Plan
            </button>
          </div>
        </div>

        {/* Today's Meal Suggestions Card */}
        <div className="p-5 rounded-2xl bg-[#10131E] border border-[#1C2335] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#181E2E] text-emerald-400">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Today's Meal Suggestions</h3>
                  <p className="text-xs text-slate-400 capitalize">
                    {user.dietaryPreference.replace('_', ' ')} · {activeMealPlan.totalCalories} kcal planned
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('nutrition')}
                className="text-xs font-semibold text-emerald-400 hover:underline"
              >
                Generate Plan
              </button>
            </div>

            {/* Meal Slots Snapshot */}
            <div className="space-y-2 mt-4">
              {[
                { slot: 'Breakfast', meal: activeMealPlan.meals.breakfast },
                { slot: 'Lunch', meal: activeMealPlan.meals.lunch },
                { slot: 'Dinner', meal: activeMealPlan.meals.dinner },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#131826] border border-[#1B2233] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                      {item.slot}
                    </span>
                    <span className="font-semibold text-slate-100 truncate block max-w-[200px] sm:max-w-[240px]">
                      {item.meal.name}
                    </span>
                  </div>
                  <div className="text-right font-mono text-[11px]">
                    <span className="text-white font-bold tabular-nums">{item.meal.calories} kcal</span>
                    <span className="text-slate-400 text-[10px] block tabular-nums">{item.meal.protein}g P</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Macro preview bar */}
            <div className="mt-4 pt-3 border-t border-[#1C2335] space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-emerald-400">Protein: {macros.proteinGrams}g</span>
                <span className="text-sky-400">Carbs: {macros.carbsGrams}g</span>
                <span className="text-amber-400">Fat: {macros.fatGrams}g</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#181D2A] overflow-hidden flex">
                <div className="h-full bg-emerald-400" style={{ width: `${(macros.proteinCals / targetCalories) * 100}%` }} />
                <div className="h-full bg-sky-400" style={{ width: `${(macros.carbsCals / targetCalories) * 100}%` }} />
                <div className="h-full bg-amber-400" style={{ width: `${(macros.fatCals / targetCalories) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              onClick={() => setActiveTab('nutrition')}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
            >
              <span>Explore full meal plan & recipes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. WEEKLY WORKOUT SCHEDULE SPLIT */}
      <div className="p-5 rounded-2xl bg-[#10131E] border border-[#1C2335] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#CCFF00]" />
            <h3 className="text-base font-bold text-white">Weekly Workout Schedule ({user.workoutDaysPerWeek} Days/Week)</h3>
          </div>
          <button
            onClick={() => setActiveTab('workouts')}
            className="text-xs font-semibold text-[#CCFF00] hover:underline"
          >
            Adjust Split
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {activePlan.days.map((day, idx) => {
            const isToday = idx === todayWorkoutIndex;
            return (
              <div
                key={day.dayNumber}
                onClick={() => onStartActiveWorkout(idx)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isToday
                    ? 'bg-[#151D28] border-[#CCFF00]/50 shadow-md shadow-[#CCFF00]/10'
                    : 'bg-[#131724] border-[#1C2333] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                  <span className={isToday ? 'text-[#CCFF00] font-bold' : 'text-slate-400'}>
                    Day {day.dayNumber}
                  </span>
                  {isToday && (
                    <span className="text-[10px] bg-[#CCFF00] text-black px-1.5 py-0.5 rounded font-bold">
                      TODAY
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white truncate">{day.dayName.split(':')[1] || day.dayName}</h4>
                <p className="text-[11px] text-slate-400 truncate mt-1">{day.focus}</p>
                <div className="mt-3 pt-2 border-t border-[#1C2333] flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{day.exercises.length} Exercises</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. INTERACTIVE CHARTS & PROGRESS SUMMARY (Weight, Consistency, Calories, Strength) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Weight Progression Chart */}
        <div className="p-4 rounded-xl bg-[#10141E] border border-[#1C2335] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Weight Progression</span>
            <span className="text-[10px] font-mono text-emerald-400">7-Day Trend</span>
          </div>

          <div className="h-28 w-full relative flex items-center justify-center">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
              {/* Target Line */}
              <line
                x1="10"
                y1={90 - ((user.targetWeightKg - minW) / rangeW) * 70}
                x2="290"
                y2={90 - ((user.targetWeightKg - minW) / rangeW) * 70}
                stroke="#CCFF00"
                strokeDasharray="4 4"
                strokeWidth="1.5"
                opacity="0.6"
              />
              {/* Progress Line */}
              <path
                d={svgPathD}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Data Dots */}
              {chartPoints.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  className="fill-[#090A0F] stroke-[#38BDF8] stroke-2 hover:r-5 transition-all cursor-pointer"
                >
                  <title>{`${pt.date}: ${pt.weight} kg`}</title>
                </circle>
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1C2335]">
            <span>Start: {recentLogs[0]?.weightKg || user.weightKg} kg</span>
            <span className="text-[#CCFF00]">Target: {user.targetWeightKg} kg</span>
          </div>
        </div>

        {/* Workout Consistency */}
        <div className="p-4 rounded-xl bg-[#10141E] border border-[#1C2335] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Workout Consistency</span>
            <span className="text-[10px] font-mono text-[#CCFF00]">5-Day Streak</span>
          </div>

          <div className="grid grid-cols-7 gap-1 pt-3">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayChar, i) => {
              const completed = i !== 2 && i < 6; // Mock consistency
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-full aspect-square rounded-md flex items-center justify-center text-[10px] font-bold ${
                      completed
                        ? 'bg-[#CCFF00] text-black'
                        : i === 6
                        ? 'bg-[#181E2E] text-slate-500 border border-dashed border-slate-600'
                        : 'bg-[#151924] text-slate-400'
                    }`}
                  >
                    {completed ? '✓' : ''}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">{dayChar}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 pt-1 border-t border-[#1C2335] font-mono">
            85% adherence rate this month.
          </p>
        </div>

        {/* Calories Consumed vs Target */}
        <div className="p-4 rounded-xl bg-[#10141E] border border-[#1C2335] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Today's Calories</span>
            <span className="text-[10px] font-mono text-slate-400">Target: {targetCalories}</span>
          </div>

          <div className="py-2 space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {todayLog?.caloriesConsumed || 2150}
              </span>
              <span className="text-xs font-mono text-emerald-400">
                {Math.max(0, targetCalories - (todayLog?.caloriesConsumed || 2150))} left
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#181D2A] overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${Math.min(100, ((todayLog?.caloriesConsumed || 2150) / targetCalories) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1C2335]">
            <span>Protein: {macros.proteinGrams}g</span>
            <span>Carbs: {macros.carbsGrams}g</span>
            <span>Fat: {macros.fatGrams}g</span>
          </div>
        </div>

        {/* Strength Progression (PRs) */}
        <div className="p-4 rounded-xl bg-[#10141E] border border-[#1C2335] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Strength PRs</span>
            <button
              onClick={() => setActiveTab('progress')}
              className="text-[10px] font-mono text-[#CCFF00] hover:underline"
            >
              All Records
            </button>
          </div>

          <div className="space-y-1.5 pt-1">
            {prs.slice(0, 3).map((pr) => (
              <div key={pr.id} className="flex items-center justify-between text-xs py-1 border-b border-[#181E2E] last:border-0 font-mono">
                <span className="text-slate-300 truncate max-w-[120px]">{pr.exercise}</span>
                <span className="font-bold text-white tabular-nums">
                  {pr.weightKg} kg <span className="text-slate-400 text-[10px]">× {pr.reps}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#CCFF00]">
            <span>Recent: Bench Press 105kg</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
