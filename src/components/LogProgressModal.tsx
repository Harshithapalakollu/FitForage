import React, { useState } from 'react';
import { ProgressLog, UserProfile } from '../types';
import { PlusCircle, X, Check, Dumbbell, Scale, Flame, Droplet } from 'lucide-react';

interface LogProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  latestLog?: ProgressLog;
  onSaveLog: (log: ProgressLog) => void;
}

export const LogProgressModal: React.FC<LogProgressModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  latestLog,
  onSaveLog,
}) => {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [weightKg, setWeightKg] = useState<number>(latestLog?.weightKg || currentUser.weightKg);
  const [steps, setSteps] = useState<number>(10000);
  const [caloriesConsumed, setCaloriesConsumed] = useState<number>(2450);
  const [waterLiters, setWaterLiters] = useState<number>(3.0);
  const [workoutCompleted, setWorkoutCompleted] = useState<boolean>(true);
  const [workoutName, setWorkoutName] = useState<string>('Upper Body Hypertrophy');
  const [chestCm, setChestCm] = useState<number>(latestLog?.chestCm || 102);
  const [waistCm, setWaistCm] = useState<number>(latestLog?.waistCm || 82);
  const [hipsCm, setHipsCm] = useState<number>(latestLog?.hipsCm || 99);
  const [armsCm, setArmsCm] = useState<number>(latestLog?.armsCm || 37.5);
  const [thighsCm, setThighsCm] = useState<number>(latestLog?.thighsCm || 59.5);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: ProgressLog = {
      id: `log-${Date.now()}`,
      date,
      weightKg: Number(weightKg),
      steps: Number(steps),
      caloriesConsumed: Number(caloriesConsumed),
      waterLiters: Number(waterLiters),
      workoutCompleted,
      workoutName: workoutCompleted ? workoutName : undefined,
      chestCm: Number(chestCm),
      waistCm: Number(waistCm),
      hipsCm: Number(hipsCm),
      armsCm: Number(armsCm),
      thighsCm: Number(thighsCm),
      notes: notes.trim() || undefined,
    };
    onSaveLog(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#0D1017] border border-[#20283C] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1A202E] flex items-center justify-between bg-[#121622]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#CCFF00] flex items-center justify-center text-black font-bold">
              <PlusCircle className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">Log Today's Progress</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A202E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Date & Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-300 uppercase mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs font-mono focus:outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-300 uppercase mb-1">
                Body Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
              />
            </div>
          </div>

          {/* Daily Activity (Steps, Calories, Water) */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-300 uppercase mb-1">
                Steps Taken
              </label>
              <input
                type="number"
                required
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-300 uppercase mb-1">
                Calories Consumed
              </label>
              <input
                type="number"
                required
                value={caloriesConsumed}
                onChange={(e) => setCaloriesConsumed(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-300 uppercase mb-1">
                Water (Liters)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={waterLiters}
                onChange={(e) => setWaterLiters(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
              />
            </div>
          </div>

          {/* Workout Completed Toggle */}
          <div className="p-3.5 rounded-xl bg-[#121622] border border-[#1E2536] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Did you complete a workout session today?</span>
              <button
                type="button"
                onClick={() => setWorkoutCompleted(!workoutCompleted)}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-md transition-colors ${
                  workoutCompleted ? 'bg-[#CCFF00] text-black' : 'bg-[#181E2E] text-slate-400'
                }`}
              >
                {workoutCompleted ? 'YES ✓' : 'REST DAY'}
              </button>
            </div>

            {workoutCompleted && (
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                  Workout / Session Focus
                </label>
                <input
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g. Chest & Triceps Hypertrophy"
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            )}
          </div>

          {/* Body Measurements (Optional) */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-slate-300 uppercase block">
              Body Circumferences (Optional, cm)
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-0.5">Chest</label>
                <input
                  type="number"
                  step="0.5"
                  value={chestCm}
                  onChange={(e) => setChestCm(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded bg-[#141824] border border-[#222B3D] text-white text-xs font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-0.5">Waist</label>
                <input
                  type="number"
                  step="0.5"
                  value={waistCm}
                  onChange={(e) => setWaistCm(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded bg-[#141824] border border-[#222B3D] text-white text-xs font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-0.5">Hips</label>
                <input
                  type="number"
                  step="0.5"
                  value={hipsCm}
                  onChange={(e) => setHipsCm(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded bg-[#141824] border border-[#222B3D] text-white text-xs font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-0.5">Arms</label>
                <input
                  type="number"
                  step="0.5"
                  value={armsCm}
                  onChange={(e) => setArmsCm(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded bg-[#141824] border border-[#222B3D] text-white text-xs font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-0.5">Thighs</label>
                <input
                  type="number"
                  step="0.5"
                  value={thighsCm}
                  onChange={(e) => setThighsCm(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded bg-[#141824] border border-[#222B3D] text-white text-xs font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-mono font-semibold text-slate-300 uppercase mb-1">
              Personal Training / Nutrition Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Energy was high today, crushed bench press sets with solid pause..."
              className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs focus:outline-none focus:border-[#CCFF00]"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-[#1C2233] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-black bg-[#CCFF00] hover:bg-[#b8e600] rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-[#CCFF00]/15"
            >
              <Check className="w-4 h-4" />
              <span>Save Today's Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
