import React, { useState } from 'react';
import { PersonalRecord, ProgressLog, UserProfile } from '../types';
import { 
  TrendingUp, 
  Calendar, 
  PlusCircle, 
  Trophy, 
  Activity, 
  Flame, 
  ChevronRight, 
  Sparkles, 
  Scale, 
  Trash2,
  CheckCircle2,
  X
} from 'lucide-react';

interface ProgressViewProps {
  user: UserProfile;
  logs: ProgressLog[];
  prs: PersonalRecord[];
  onSaveLogs: (logs: ProgressLog[]) => void;
  onSavePRs: (prs: PersonalRecord[]) => void;
  onOpenLogModal: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  user,
  logs,
  prs,
  onSaveLogs,
  onSavePRs,
  onOpenLogModal,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [showAddPRModal, setShowAddPRModal] = useState(false);
  const [newPR, setNewPR] = useState({
    exercise: 'Barbell Bench Press',
    weightKg: 100,
    reps: 5,
    date: new Date().toISOString().slice(0, 10),
  });

  const displayedLogs = selectedTimeframe === 'weekly' ? logs.slice(-7) : logs.slice(-30);
  const latestLog = logs[logs.length - 1];
  const firstLog = logs[0];
  const totalWeightChange = latestLog && firstLog ? Number((latestLog.weightKg - firstLog.weightKg).toFixed(1)) : 0;

  // Streak calculation: count consecutive completed workouts from latest
  const streak = logs.reduce((acc, log) => (log.workoutCompleted ? acc + 1 : acc), 0);

  // Chart coordinate calculations
  const weights = displayedLogs.map((l) => l.weightKg);
  const minW = Math.min(...weights, user.targetWeightKg) - 1;
  const maxW = Math.max(...weights, user.targetWeightKg) + 1;
  const rangeW = maxW - minW || 1;

  const points = displayedLogs.map((l, idx) => {
    const x = (idx / (displayedLogs.length - 1 || 1)) * 560 + 20;
    const y = 140 - ((l.weightKg - minW) / rangeW) * 110;
    return { x, y, weight: l.weightKg, date: l.date.slice(5), fullDate: l.date, steps: l.steps, cals: l.caloriesConsumed };
  });

  const svgPathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const handleAddPR = (e: React.FormEvent) => {
    e.preventDefault();
    const created: PersonalRecord = {
      id: `pr-${Date.now()}`,
      exercise: newPR.exercise,
      weightKg: Number(newPR.weightKg),
      reps: Number(newPR.reps),
      date: newPR.date,
    };
    onSavePRs([...prs, created]);
    setShowAddPRModal(false);
  };

  const handleDeletePR = (id: string) => {
    onSavePRs(prs.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A2130] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#CCFF00] uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Telemetry & Transformation Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Progress Tracker</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Analyze weight evolution, body circumference differentials, and personal record strength milestones.
          </p>
        </div>

        <button
          onClick={onOpenLogModal}
          className="px-5 py-2.5 rounded-lg bg-[#CCFF00] text-black text-xs font-bold hover:bg-[#b8e600] transition-colors flex items-center gap-2 shadow-md shadow-[#CCFF00]/15 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Today's Progress</span>
        </button>
      </div>

      {/* 1. METRICS HIGH-LEVEL SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-4 rounded-xl bg-[#10141E] border border-[#1B2233]">
          <span className="text-[11px] text-slate-400 block mb-1">NET WEIGHT CHANGE</span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold tabular-nums ${totalWeightChange <= 0 ? 'text-emerald-400' : 'text-[#CCFF00]'}`}>
              {totalWeightChange > 0 ? `+${totalWeightChange}` : totalWeightChange}
            </span>
            <span className="text-xs text-slate-400">kg</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Since first recorded log</span>
        </div>

        <div className="p-4 rounded-xl bg-[#10141E] border border-[#1B2233]">
          <span className="text-[11px] text-slate-400 block mb-1">WORKOUT STREAK</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-[#CCFF00] tabular-nums">{streak}</span>
            <span className="text-xs text-slate-400">sessions</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Logged sessions completed</span>
        </div>

        <div className="p-4 rounded-xl bg-[#10141E] border border-[#1B2233]">
          <span className="text-[11px] text-slate-400 block mb-1">DAILY AVERAGE STEPS</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-sky-400 tabular-nums">
              {Math.round(displayedLogs.reduce((a, b) => a + b.steps, 0) / (displayedLogs.length || 1))}
            </span>
            <span className="text-xs text-slate-400">steps</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Active metabolic thermogenesis</span>
        </div>

        <div className="p-4 rounded-xl bg-[#10141E] border border-[#1B2233]">
          <span className="text-[11px] text-slate-400 block mb-1">ACTIVE PR MILESTONES</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-amber-400 tabular-nums">{prs.length}</span>
            <span className="text-xs text-slate-400">records</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Validated compound personal bests</span>
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE SVG CHART (WEIGHT TREND) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0F131D] border border-[#1D2538] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Body Mass Trend Analysis</h3>
            <p className="text-xs text-slate-400">
              Yellow dashed guide reflects target weight ({user.targetWeightKg} kg)
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#141824] rounded-lg border border-[#222B3D]">
            <button
              onClick={() => setSelectedTimeframe('weekly')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                selectedTimeframe === 'weekly' ? 'bg-[#1F273A] text-[#CCFF00]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setSelectedTimeframe('monthly')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                selectedTimeframe === 'monthly' ? 'bg-[#1F273A] text-[#CCFF00]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {/* SVG Chart Container */}
        <div className="w-full h-52 sm:h-64 relative bg-[#090C14] rounded-xl border border-[#182030] p-4 flex items-center justify-center">
          <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible">
            {/* Horizontal Grid lines */}
            {[30, 70, 110, 140].map((y) => (
              <line key={y} x1="20" y1={y} x2="580" y2={y} stroke="#1A2132" strokeWidth="1" strokeDasharray="3 3" />
            ))}

            {/* Target Weight Guideline */}
            <line
              x1="20"
              y1={140 - ((user.targetWeightKg - minW) / rangeW) * 110}
              x2="580"
              y2={140 - ((user.targetWeightKg - minW) / rangeW) * 110}
              stroke="#CCFF00"
              strokeDasharray="5 5"
              strokeWidth="1.5"
              opacity="0.7"
            />

            {/* Progress Path */}
            <path
              d={svgPathD}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Dots with hover tooltip title */}
            {points.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  className="fill-[#090C14] stroke-[#38BDF8] stroke-2 hover:r-6 transition-all cursor-pointer"
                >
                  <title>{`${pt.fullDate}: ${pt.weight} kg (${pt.steps} steps)`}</title>
                </circle>
                <text
                  x={pt.x}
                  y="155"
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {pt.date}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-[#1C2335]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
              <span>Recorded Weight</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-[#CCFF00]" />
              <span>Target Weight ({user.targetWeightKg} kg)</span>
            </span>
          </div>
          <span>Current: {latestLog?.weightKg || user.weightKg} kg</span>
        </div>
      </div>

      {/* 3. BODY MEASUREMENTS & PERSONAL RECORDS (PRs) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Body Measurements Card */}
        <div className="p-5 rounded-2xl bg-[#0F131D] border border-[#1D2538] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Body Circumference Tracker</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Centimeters (cm)</span>
          </div>

          <div className="space-y-2">
            {[
              { part: 'Chest Circumference', value: latestLog?.chestCm || 102, delta: '+1.5cm' },
              { part: 'Waist (Navel)', value: latestLog?.waistCm || 82, delta: '-2.0cm' },
              { part: 'Hips / Glutes', value: latestLog?.hipsCm || 99, delta: '+0.5cm' },
              { part: 'Upper Arms (Flexed)', value: latestLog?.armsCm || 37.5, delta: '+1.0cm' },
              { part: 'Thighs (Quad Midpoint)', value: latestLog?.thighsCm || 59.5, delta: '+1.5cm' },
            ].map((m, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#131724] border border-[#1C2335] flex items-center justify-between font-mono text-xs">
                <span className="text-slate-300 font-sans text-xs">{m.part}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white tabular-nums">{m.value} cm</span>
                  <span className={`text-[10px] ${m.delta.startsWith('-') ? 'text-emerald-400' : 'text-[#CCFF00]'}`}>
                    {m.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 font-mono pt-1">
            Measurements updated via the "Log Today's Progress" action.
          </p>
        </div>

        {/* Personal Records Board */}
        <div className="p-5 rounded-2xl bg-[#0F131D] border border-[#1D2538] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Personal Records (PR) Hall</h3>
            </div>
            <button
              onClick={() => setShowAddPRModal(true)}
              className="px-3 py-1 rounded bg-[#182030] text-[#CCFF00] hover:bg-[#202B40] text-xs font-semibold border border-[#2B3956]"
            >
              + Add PR
            </button>
          </div>

          <div className="space-y-2">
            {prs.map((pr) => (
              <div
                key={pr.id}
                className="p-3 rounded-lg bg-[#131724] border border-[#1C2335] flex items-center justify-between font-mono text-xs"
              >
                <div>
                  <h5 className="font-bold text-white font-sans text-xs">{pr.exercise}</h5>
                  <span className="text-[10px] text-slate-400">{pr.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#CCFF00] tabular-nums block">
                      {pr.weightKg} kg
                    </span>
                    <span className="text-[10px] text-slate-400 tabular-nums">× {pr.reps} reps</span>
                  </div>
                  <button
                    onClick={() => handleDeletePR(pr.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove PR"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 font-mono pt-1">
            Always record clean, strict repetitions with full range of motion.
          </p>
        </div>
      </div>

      {/* 4. RECENT LOGS HISTORY TABLE */}
      <div className="p-5 rounded-2xl bg-[#0F131D] border border-[#1D2538] space-y-4">
        <h3 className="text-base font-bold text-white">Daily Workout & Metric Logs</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1C2335] text-slate-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Weight</th>
                <th className="py-2.5 px-3">Steps</th>
                <th className="py-2.5 px-3">Calories</th>
                <th className="py-2.5 px-3">Water</th>
                <th className="py-2.5 px-3">Workout Status</th>
                <th className="py-2.5 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171D2B]">
              {logs.slice().reverse().map((log) => (
                <tr key={log.id} className="hover:bg-[#131724] transition-colors">
                  <td className="py-2.5 px-3 text-white font-bold">{log.date}</td>
                  <td className="py-2.5 px-3 tabular-nums">{log.weightKg} kg</td>
                  <td className="py-2.5 px-3 tabular-nums">{log.steps.toLocaleString()}</td>
                  <td className="py-2.5 px-3 tabular-nums">{log.caloriesConsumed} kcal</td>
                  <td className="py-2.5 px-3 tabular-nums">{log.waterLiters} L</td>
                  <td className="py-2.5 px-3">
                    {log.workoutCompleted ? (
                      <span className="text-emerald-400 font-semibold">✓ {log.workoutName || 'Completed'}</span>
                    ) : (
                      <span className="text-slate-500">Rest / Recovery</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans max-w-[200px] truncate">
                    {log.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New PR Modal */}
      {showAddPRModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0D1017] border border-[#20283C] rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1C2335] pb-3">
              <h3 className="text-base font-bold text-white">Record New Personal Record</h3>
              <button onClick={() => setShowAddPRModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPR} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 font-mono uppercase mb-1">
                  Exercise Name
                </label>
                <input
                  type="text"
                  required
                  value={newPR.exercise}
                  onChange={(e) => setNewPR({ ...newPR, exercise: e.target.value })}
                  placeholder="e.g. Barbell Back Squat"
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-mono uppercase mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newPR.weightKg}
                    onChange={(e) => setNewPR({ ...newPR, weightKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 font-mono uppercase mb-1">
                    Reps Completed
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newPR.reps}
                    onChange={(e) => setNewPR({ ...newPR, reps: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 font-mono uppercase mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={newPR.date}
                  onChange={(e) => setNewPR({ ...newPR, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs font-mono focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPRModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-black bg-[#CCFF00] rounded-lg hover:bg-[#b8e600]"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
