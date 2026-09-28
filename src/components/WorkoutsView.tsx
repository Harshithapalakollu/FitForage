import React, { useState } from 'react';
import { Exercise, FitnessGoal, FitnessLevel, WorkoutDay, WorkoutPlan } from '../types';
import { generateWorkoutPlan, GOAL_LABELS } from '../data/workoutTemplates';
import { soundEffects } from '../utils/soundEffects';
import { 
  Dumbbell, 
  Calendar, 
  Clock, 
  Flame, 
  CheckCircle, 
  Info, 
  Play, 
  RotateCcw, 
  AlertCircle, 
  Sparkles, 
  Shuffle,
  ChevronDown,
  ChevronUp,
  X,
  Volume2
} from 'lucide-react';

interface WorkoutsViewProps {
  currentPlan: WorkoutPlan;
  onSavePlan: (plan: WorkoutPlan) => void;
  onOpenExerciseLibrary: () => void;
  activeWorkoutDayIndex?: number | null;
  onCloseActiveWorkout?: () => void;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({
  currentPlan,
  onSavePlan,
  onOpenExerciseLibrary,
  activeWorkoutDayIndex: initialActiveDayIndex,
  onCloseActiveWorkout,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal>(currentPlan.goalId);
  const [selectedDays, setSelectedDays] = useState<3 | 4 | 5 | 6>(currentPlan.daysPerWeek);
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel>(currentPlan.difficulty);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  // Active Workout Tracking Modal state
  const [activeWorkoutDay, setActiveWorkoutDay] = useState<WorkoutDay | null>(
    typeof initialActiveDayIndex === 'number' && currentPlan.days[initialActiveDayIndex]
      ? currentPlan.days[initialActiveDayIndex]
      : null
  );
  const [completedSets, setCompletedSets] = useState<Record<string, number[]>>({});
  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null);
  const [restTimerActive, setRestTimerActive] = useState<boolean>(false);

  // Rest Timer Interval
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restTimerActive && restTimerSeconds !== null && restTimerSeconds > 0) {
      interval = setInterval(() => {
        setRestTimerSeconds((prev) => {
          if (prev === null || prev <= 1) {
            soundEffects.chime();
            setRestTimerActive(false);
            return 0;
          }
          if (prev <= 4) {
            soundEffects.beep(750, 100);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimerActive, restTimerSeconds]);

  const handleGeneratePlan = () => {
    const newPlan = generateWorkoutPlan(selectedGoal, selectedDays, selectedLevel);
    onSavePlan(newPlan);
  };

  const toggleExerciseDetails = (id: string) => {
    setExpandedExerciseId((prev) => (prev === id ? null : id));
  };

  const handleStartWorkout = (day: WorkoutDay) => {
    setActiveWorkoutDay(day);
    setCompletedSets({});
    setRestTimerSeconds(null);
    setRestTimerActive(false);
  };

  const handleToggleSet = (exerciseId: string, setIndex: number, restSeconds: number) => {
    setCompletedSets((prev) => {
      const current = prev[exerciseId] || [];
      const exists = current.includes(setIndex);
      const updated = exists ? current.filter((s) => s !== setIndex) : [...current, setIndex];
      
      // If marking as completed, trigger rest timer
      if (!exists) {
        soundEffects.beep(880, 150);
        setRestTimerSeconds(restSeconds);
        setRestTimerActive(true);
      }
      return { ...prev, [exerciseId]: updated };
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. PLAN GENERATOR CONFIGURATION BAR */}
      <div className="p-6 rounded-2xl bg-[#10141E] border border-[#1E2536] space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A2130] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#CCFF00] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Adaptive Routine Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Workout Plan Generator</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Choose your focus and frequency to generate a structured resistance split.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenExerciseLibrary}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#171D2B] hover:bg-[#202738] border border-[#263148] rounded-lg transition-colors whitespace-nowrap"
            >
              Browse Exercise Library
            </button>
            <button
              onClick={handleGeneratePlan}
              className="px-4 py-2 text-xs font-bold text-black bg-[#CCFF00] hover:bg-[#b8e600] rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-[#CCFF00]/15 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Generate Routine</span>
            </button>
          </div>
        </div>

        {/* Configuration Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Goal Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Primary Goal Focus
            </label>
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value as FitnessGoal)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
            >
              <option value="build_muscle">Build Muscle (Hypertrophy)</option>
              <option value="lose_fat">Lose Fat & Metabolic Shred</option>
              <option value="six_pack_abs">Six-Pack / Core Definition</option>
              <option value="improve_strength">Improve Strength & Heavy Compound</option>
              <option value="improve_endurance">Improve Endurance & Stamina</option>
              <option value="general_fitness">General Fitness & Longevity</option>
              <option value="improve_flexibility">Improve Flexibility & Mobility</option>
              <option value="athletic_performance">Athletic Performance & Power</option>
            </select>
          </div>

          {/* Days Per Week Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Frequency: Days Per Week
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6].map((days) => (
                <button
                  key={days}
                  onClick={() => setSelectedDays(days as 3 | 4 | 5 | 6)}
                  className={`py-2 rounded-lg text-xs font-mono font-bold border transition-colors ${
                    selectedDays === days
                      ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                      : 'bg-[#141824] text-slate-300 border-[#222B3D] hover:border-slate-500'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Experience Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as FitnessLevel)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
            >
              <option value="beginner">Beginner (Foundations & Safety)</option>
              <option value="intermediate">Intermediate (Progressive Overload)</option>
              <option value="advanced">Advanced (High Volume & Intensity)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE PLAN OVERVIEW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00]" />
            <h3 className="text-xl font-bold text-white">{currentPlan.title}</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">{currentPlan.description}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Calendar className="w-4 h-4 text-[#CCFF00]" />
          <span>{currentPlan.days.length} Days Split</span>
        </div>
      </div>

      {/* 3. DAYS ACCORDION & EXERCISE CARDS */}
      <div className="space-y-6">
        {currentPlan.days.map((day, dayIndex) => (
          <div key={day.dayNumber} className="rounded-2xl bg-[#0F131D] border border-[#1C2335] overflow-hidden">
            
            {/* Day Header Bar */}
            <div className="p-4 sm:p-5 bg-[#121622] border-b border-[#1A202E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#CCFF00] bg-[#162016] border border-[#243525] px-2 py-0.5 rounded">
                    Day {day.dayNumber}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white">{day.dayName}</h4>
                </div>
                <p className="text-xs text-slate-400">Focus: {day.focus} · {day.exercises.length} Exercises Planned</p>
              </div>

              <button
                onClick={() => handleStartWorkout(day)}
                className="px-4 py-2 text-xs font-bold text-black bg-[#CCFF00] hover:bg-[#b8e600] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#CCFF00]/15 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Start Day {day.dayNumber} Session</span>
              </button>
            </div>

            {/* Exercises Grid */}
            <div className="p-4 sm:p-5 space-y-3">
              {day.exercises.map((ex, exIdx) => {
                const isExpanded = expandedExerciseId === `${day.dayNumber}-${ex.id}`;
                return (
                  <div
                    key={`${day.dayNumber}-${ex.id}`}
                    className="p-4 rounded-xl bg-[#131724] border border-[#1F273A] hover:border-[#2C3752] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#1A2030] flex items-center justify-center text-xs font-mono font-bold text-slate-300 shrink-0 mt-0.5">
                          {exIdx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-white">{ex.name}</h5>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">
                              [{ex.equipment}]
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                            <span className="capitalize text-slate-300">{ex.targetMuscle}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#CCFF00] font-semibold">{ex.sets} Sets × {ex.reps}</span>
                            <span aria-hidden="true">·</span>
                            <span>Rest: {ex.restSeconds}s</span>
                            <span aria-hidden="true">·</span>
                            <span className="capitalize">{ex.difficulty}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => toggleExerciseDetails(`${day.dayNumber}-${ex.id}`)}
                          className="px-3 py-1.5 rounded-lg bg-[#181E2E] text-slate-300 text-xs font-semibold hover:text-white hover:bg-[#20283C] transition-colors flex items-center gap-1"
                        >
                          <span>{isExpanded ? 'Hide Guide' : 'Form & Instructions'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Detailed Instructions Accordion */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[#1C2335] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Step by step */}
                        <div className="space-y-1.5 md:col-span-2">
                          <span className="font-bold text-slate-200 block uppercase tracking-wider font-mono text-[11px]">
                            Proper Execution Instructions:
                          </span>
                          <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed">
                            {ex.instructions.map((step, sIdx) => (
                              <li key={sIdx}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        {/* Common Mistakes & Alternatives */}
                        <div className="space-y-3 bg-[#0D1018] p-3 rounded-lg border border-[#192132]">
                          <div>
                            <span className="font-bold text-amber-400 block uppercase tracking-wider font-mono text-[10px]">
                              Avoid These Mistakes:
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] mt-1">
                              {ex.commonMistakes.map((mistake, mIdx) => (
                                <li key={mIdx}>{mistake}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-2 border-t border-[#181F30]">
                            <span className="font-bold text-[#CCFF00] block uppercase tracking-wider font-mono text-[10px]">
                              Alternative Movement:
                            </span>
                            <p className="text-slate-300 text-[11px] mt-0.5">{ex.alternativeExercise}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 4. ACTIVE WORKOUT SESSION TRACKER MODAL */}
      {activeWorkoutDay && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-3xl bg-[#0D1017] border border-[#222B3D] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#1C2233] bg-[#121622] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-pulse" />
                  <h3 className="text-base sm:text-lg font-bold text-white">Live Workout: {activeWorkoutDay.dayName}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Check off sets as you complete them to track rest intervals</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveWorkoutDay(null);
                    if (onCloseActiveWorkout) onCloseActiveWorkout();
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A202E]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Rest Timer Banner */}
            {restTimerSeconds !== null && (
              <div className={`px-5 py-3 flex items-center justify-between font-mono text-xs transition-colors ${
                restTimerSeconds === 0 ? 'bg-emerald-950/80 text-emerald-300 border-b border-emerald-800' : 'bg-[#181E2E] text-white border-b border-[#242E44]'
              }`}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#CCFF00]" />
                  <span>REST TIMER: </span>
                  <span className="text-base font-bold text-[#CCFF00] tabular-nums">
                    {Math.floor(restTimerSeconds / 60)}:{(restTimerSeconds % 60).toString().padStart(2, '0')}
                  </span>
                  {restTimerSeconds === 0 && <span className="text-emerald-400 font-bold ml-2">REST OVER — READY!</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setRestTimerSeconds((prev) => (prev ? prev + 30 : 30));
                      setRestTimerActive(true);
                    }}
                    className="px-2 py-1 rounded bg-[#202738] text-[11px] text-slate-300 hover:text-white"
                  >
                    +30s
                  </button>
                  <button
                    onClick={() => {
                      setRestTimerActive(false);
                      setRestTimerSeconds(null);
                    }}
                    className="px-2 py-1 rounded bg-[#202738] text-[11px] text-slate-300 hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Body: Checkable Sets */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {activeWorkoutDay.exercises.map((ex, exIndex) => {
                const exSets = Array.from({ length: ex.sets }, (_, i) => i + 1);
                const completedForEx = completedSets[ex.id] || [];

                return (
                  <div key={ex.id} className="p-4 rounded-xl bg-[#121622] border border-[#1E2536] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{ex.name}</h4>
                        <span className="text-xs text-slate-400 font-mono">
                          Target: {ex.reps} · Rest {ex.restSeconds}s
                        </span>
                      </div>
                      <span className="text-xs font-mono text-[#CCFF00]">
                        {completedForEx.length}/{ex.sets} Sets Completed
                      </span>
                    </div>

                    {/* Set Buttons */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {exSets.map((s) => {
                        const isDone = completedForEx.includes(s);
                        return (
                          <button
                            key={s}
                            onClick={() => handleToggleSet(ex.id, s, ex.restSeconds)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                              isDone
                                ? 'bg-[#CCFF00] text-black shadow-sm shadow-[#CCFF00]/20'
                                : 'bg-[#181E2E] text-slate-300 hover:bg-[#20283C] border border-[#273248]'
                            }`}
                          >
                            <CheckCircle className={`w-3.5 h-3.5 ${isDone ? 'stroke-black' : 'stroke-slate-500'}`} />
                            <span>Set {s}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#1C2233] bg-[#121622] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Log completed workouts in Progress tab
              </span>
              <button
                onClick={() => {
                  soundEffects.bell();
                  setActiveWorkoutDay(null);
                  if (onCloseActiveWorkout) onCloseActiveWorkout();
                }}
                className="px-5 py-2 rounded-lg bg-[#CCFF00] text-black text-xs font-bold hover:bg-[#b8e600] transition-colors"
              >
                Finish Workout Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
