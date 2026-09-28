import React, { useState } from 'react';
import { UserProfile } from '../types';
import { calculateBMI, calculateBMR, calculateTDEE } from '../utils/calculators';
import { X, User, Save, RotateCcw, Download, LogOut, Check } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveUser: (user: UserProfile) => void;
  onOpenAssessment: () => void;
  onOpenAuth: () => void;
  onResetData: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
  onOpenAssessment,
  onOpenAuth,
  onResetData,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [weightKg, setWeightKg] = useState(currentUser.weightKg);
  const [targetWeightKg, setTargetWeightKg] = useState(currentUser.targetWeightKg);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>(currentUser.unitSystem);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      ...currentUser,
      name,
      weightKg: Number(weightKg),
      targetWeightKg: Number(targetWeightKg),
      unitSystem,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentUser, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `fitforge_profile_${currentUser.name.toLowerCase().replace(/\s+/g, '_')}.json`);
    dlAnchorElem.click();
  };

  const bmi = calculateBMI(currentUser.weightKg, currentUser.heightCm);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#0D1017] border border-[#20283C] rounded-2xl shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C2335] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold uppercase text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{currentUser.name}</h2>
              <span className="text-xs text-slate-400 font-mono">{currentUser.email}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats overview */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-[#121622] border border-[#1E2536] text-center font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">BMI</span>
            <span className="font-bold text-white tabular-nums">{bmi.bmi}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">GOAL</span>
            <span className="font-bold text-[#CCFF00] capitalize truncate block">
              {currentUser.primaryGoal.replace('_', ' ')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">DAYS / WEEK</span>
            <span className="font-bold text-white tabular-nums">{currentUser.workoutDaysPerWeek} Days</span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs focus:outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Current Weight (kg)
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

            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Target Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-300 font-mono">Unit Preference</span>
            <div className="flex rounded-lg bg-[#141824] p-1 border border-[#222B3D]">
              <button
                type="button"
                onClick={() => setUnitSystem('metric')}
                className={`px-3 py-1 text-xs font-mono rounded font-semibold transition-colors ${
                  unitSystem === 'metric' ? 'bg-[#1F283C] text-[#CCFF00]' : 'text-slate-400'
                }`}
              >
                Metric (kg/cm)
              </button>
              <button
                type="button"
                onClick={() => setUnitSystem('imperial')}
                className={`px-3 py-1 text-xs font-mono rounded font-semibold transition-colors ${
                  unitSystem === 'imperial' ? 'bg-[#1F283C] text-[#CCFF00]' : 'text-slate-400'
                }`}
              >
                Imperial (lbs/ft)
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#1C2335]">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAssessment();
              }}
              className="text-xs text-[#CCFF00] hover:underline font-semibold"
            >
              Retake Full Assessment
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-black bg-[#CCFF00] hover:bg-[#b8e600] rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-[#CCFF00]/15"
            >
              {savedNotice ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedNotice ? 'Saved!' : 'Save Settings'}</span>
            </button>
          </div>
        </form>

        {/* Data Management & Actions */}
        <div className="pt-4 border-t border-[#1C2335] space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
            Account & Data Controls:
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg bg-[#141824] text-slate-300 hover:text-white border border-[#222B3D] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Data JSON</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#141824] text-slate-300 hover:text-white border border-[#222B3D] flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Switch Account</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Reset all progress and sample data to factory demo?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-[#1A1315] text-rose-300 hover:text-rose-200 border border-[#3A1E24] flex items-center gap-1.5 ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
