import React, { useState } from 'react';
import { ActivityLevel, FitnessGoal, UserProfile } from '../types';
import { 
  activityMultipliers, 
  calculateBMI, 
  calculateBMR, 
  calculateIdealWeight, 
  calculateMacros, 
  calculateTargetCalories, 
  calculateTDEE, 
  calculateWaterIntake 
} from '../utils/calculators';
import { 
  Calculator, 
  Activity, 
  Flame, 
  Droplet, 
  Scale, 
  PieChart, 
  Zap, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface CalculatorsViewProps {
  user: UserProfile;
}

type CalculatorTab = 'bmi' | 'bmr' | 'tdee' | 'calories' | 'macros' | 'water' | 'ideal_weight';

export const CalculatorsView: React.FC<CalculatorsViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('bmi');

  // 1. BMI state
  const [bmiWeight, setBmiWeight] = useState<number>(user.weightKg);
  const [bmiHeight, setBmiHeight] = useState<number>(user.heightCm);
  const [bmiResult, setBmiResult] = useState<ReturnType<typeof calculateBMI> | null>(null);

  // 2. BMR state
  const [bmrWeight, setBmrWeight] = useState<number>(user.weightKg);
  const [bmrHeight, setBmrHeight] = useState<number>(user.heightCm);
  const [bmrAge, setBmrAge] = useState<number>(user.age);
  const [bmrGender, setBmrGender] = useState<'male' | 'female' | 'other'>(user.gender);
  const [bmrResult, setBmrResult] = useState<number | null>(null);

  // 3. TDEE state
  const [tdeeBmr, setTdeeBmr] = useState<number>(1800);
  const [tdeeActivity, setTdeeActivity] = useState<ActivityLevel>(user.activityLevel);
  const [tdeeResult, setTdeeResult] = useState<number | null>(null);

  // 4. Daily Calorie Estimator state
  const [calTdee, setCalTdee] = useState<number>(2400);
  const [calGoal, setCalGoal] = useState<FitnessGoal>(user.primaryGoal);
  const [calResult, setCalResult] = useState<ReturnType<typeof calculateTargetCalories> | null>(null);

  // 5. Macro Calculator state
  const [macroCals, setMacroCals] = useState<number>(2400);
  const [macroWeight, setMacroWeight] = useState<number>(user.weightKg);
  const [macroGoal, setMacroGoal] = useState<FitnessGoal>(user.primaryGoal);
  const [macroResult, setMacroResult] = useState<ReturnType<typeof calculateMacros> | null>(null);

  // 6. Water Intake state
  const [waterWeight, setWaterWeight] = useState<number>(user.weightKg);
  const [waterWorkoutMins, setWaterWorkoutMins] = useState<number>(user.preferredDuration);
  const [waterResult, setWaterResult] = useState<ReturnType<typeof calculateWaterIntake> | null>(null);

  // 7. Ideal Weight state
  const [idealHeight, setIdealHeight] = useState<number>(user.heightCm);
  const [idealGender, setIdealGender] = useState<'male' | 'female' | 'other'>(user.gender);
  const [idealResult, setIdealResult] = useState<ReturnType<typeof calculateIdealWeight> | null>(null);

  const navItems: { id: CalculatorTab; label: string; icon: React.ReactNode }[] = [
    { id: 'bmi', label: 'BMI Calculator', icon: <Scale className="w-4 h-4" /> },
    { id: 'bmr', label: 'BMR Calculator', icon: <Flame className="w-4 h-4" /> },
    { id: 'tdee', label: 'TDEE Calculator', icon: <Activity className="w-4 h-4" /> },
    { id: 'calories', label: 'Calorie Estimator', icon: <Zap className="w-4 h-4" /> },
    { id: 'macros', label: 'Macro Calculator', icon: <PieChart className="w-4 h-4" /> },
    { id: 'water', label: 'Water Estimator', icon: <Droplet className="w-4 h-4" /> },
    { id: 'ideal_weight', label: 'Ideal Weight', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-[#1A2130] pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#CCFF00] uppercase tracking-wider mb-1">
          <Calculator className="w-3.5 h-3.5" />
          <span>Biometric & Energy Science Suite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Fitness Calculators</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate your metabolic baseline, energy expenditure, optimal macro distributions, and weight goals.
        </p>
      </div>

      {/* Segmented Selector */}
      <div className="flex items-center gap-1.5 p-1 bg-[#10131E] border border-[#1C2335] rounded-xl overflow-x-auto scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === item.id
                ? 'bg-[#182030] text-[#CCFF00] border border-[#2D3954] shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#141824]'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* ACTIVE CALCULATOR CARD */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0F131D] border border-[#1D2538] max-w-3xl">
        
        {/* 1. BMI CALCULATOR */}
        {activeTab === 'bmi' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Body Mass Index (BMI) Calculator</h2>
              <p className="text-xs text-slate-400 mt-1">
                Evaluates body weight relative to stature based on the World Health Organization (WHO) framework.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={bmiWeight}
                  onChange={(e) => setBmiWeight(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={bmiHeight}
                  onChange={(e) => setBmiHeight(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setBmiResult(calculateBMI(bmiWeight, bmiHeight))}
                className="px-5 py-2.5 rounded-lg bg-[#CCFF00] text-black text-xs font-bold hover:bg-[#b8e600] transition-colors"
              >
                Calculate BMI
              </button>
              <button
                onClick={() => setBmiResult(null)}
                className="px-4 py-2.5 rounded-lg bg-[#161B27] text-slate-400 hover:text-white text-xs font-semibold"
              >
                Clear Result
              </button>
            </div>

            {bmiResult && (
              <div className="p-4 rounded-xl bg-[#121622] border border-[#20293D] space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-mono block">YOUR CALCULATED BMI</span>
                    <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                      {bmiResult.bmi}
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-md"
                    style={{ backgroundColor: `${bmiResult.category.color}20`, color: bmiResult.category.color }}
                  >
                    {bmiResult.category.label}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {bmiResult.category.description}
                </p>

                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-[#1C2335]">
                  Healthy weight range for your height ({bmiHeight}cm):{' '}
                  <span className="text-white font-bold tabular-nums">
                    {bmiResult.healthyWeightMin} kg - {bmiResult.healthyWeightMax} kg
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. BMR CALCULATOR */}
        {activeTab === 'bmr' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Basal Metabolic Rate (BMR) Calculator</h2>
              <p className="text-xs text-slate-400 mt-1">
                Calculates the energy (calories) burned at complete rest via the Mifflin-St Jeor equation.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={bmrWeight}
                  onChange={(e) => setBmrWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  value={bmrHeight}
                  onChange={(e) => setBmrHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">Age</label>
                <input
                  type="number"
                  value={bmrAge}
                  onChange={(e) => setBmrAge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">Gender</label>
                <select
                  value={bmrGender}
                  onChange={(e) => setBmrGender(e.target.value as 'male' | 'female' | 'other')}
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setBmrResult(calculateBMR(bmrWeight, bmrHeight, bmrAge, bmrGender))}
                className="px-5 py-2.5 rounded-lg bg-[#CCFF00] text-black text-xs font-bold hover:bg-[#b8e600] transition-colors"
              >
                Calculate BMR
              </button>
              <button
                onClick={() => setBmrResult(null)}
                className="px-4 py-2.5 rounded-lg bg-[#161B27] text-slate-400 hover:text-white text-xs font-semibold"
              >
                Clear Result
              </button>
            </div>

            {bmrResult !== null && (
              <div className="p-4 rounded-xl bg-[#121622] border border-[#20293D] space-y-2">
                <span className="text-xs text-slate-400 font-mono block">YOUR BASAL METABOLIC RATE</span>
                <span className="text-3xl font-extrabold text-[#CCFF00] font-mono tabular-nums">
                  {bmrResult} kcal / day
                </span>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  This represents the baseline energy expenditure needed to sustain autonomic life functions (heartbeat, respiration, brain activity, cellular maintenance) if you remained in bed all day.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3. TDEE CALCULATOR */}
        {activeTab === 'tdee' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Total Daily Energy Expenditure (TDEE)</h2>
              <p className="text-xs text-slate-400 mt-1">
                Estimates the total calories you burn daily including physical activity, digestion, and exercise.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                  Your BMR (kcal)
                </label>
                <input
                  type="number"
                  value={tdeeBmr}
                  onChange={(e) => setTdeeBmr(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                  Activity Level
                </label>
                <select
                  value={tdeeActivity}
                  onChange={(e) => setTdeeActivity(e.target.value as ActivityLevel)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                >
                  {Object.entries(activityMultipliers).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.label} (×{info.multiplier})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setTdeeResult(calculateTDEE(tdeeBmr, tdeeActivity))}
                className="px-5 py-2.5 rounded-lg bg-[#CCFF00] text-black text-xs font-bold hover:bg-[#b8e600] transition-colors"
              >
                Calculate TDEE
              </button>
              <button
                onClick={() => setTdeeResult(null)}
                className="px-4 py-2.5 rounded-lg bg-[#161B27] text-slate-400 hover:text-white text-xs font-semibold"
              >
                Clear Result
              </button>
            </div>

            {tdeeResult !== null && (
              <div className="p-4 rounded-xl bg-[#121622] border border-[#20293D] space-y-2">
                <span className="text-xs text-slate-400 font-mono block">ESTIMATED MAINTENANCE TDEE</span>
                <span className="text-3xl font-extrabold text-[#CCFF00] font-mono tabular-nums">
                  {tdeeResult} kcal / day
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Consuming approximately this number of calories daily will keep your body weight stable. To lose fat, target a deficit (-20%); to build muscle, target a surplus (+10%).
                </p>
              </div>
            )}
          </div>
        )}

        {/* 4. DAILY CALORIE ESTIMATOR */}
        {activeTab === 'calories' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Daily Calorie Target Estimator</h2>
              <p className="text-xs text-slate-400 mt-1">
                Computes energy surplus or deficit based on your physical goal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                  Your Maintenance TDEE (kcal)
                </label>
                <input
                  type="number"
                  value={calTdee}
                  onChange={(e) => setCalTdee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                  Goal Focus
                </label>
                <select
                  value={calGoal}
                  onChange={(e) => setCalGoal(e.target.value as FitnessGoal)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                >
                  <option value="lose_fat">Fat Loss (-20% Deficit)</option>
                  <option value="build_muscle">Muscle Hypertrophy (+10% Surplus)</option>
                  <option value="six_pack_abs">Six-Pack Core (-20% Deficit)</option>
                  <option value="improve_strength">Strength Power (+10% Surplus)</option>
                  <option value="general_fitness">General Fitness (Maintenance)</option>
                  <option value="improve_endurance">Endurance & Stamina (Maintenance)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCalResult(calculateTargetCalories(calTdee, calGoal))}
                className="px-5 py-2.5 rounded-lg bg-[#CCFF00] text-black text-xs font-bold hover:bg-[#b8e600] transition-colors"
              >
                Estimate Calorie Target
              </button>
              <button
                onClick={() => setCalResult(null)}
                className="px-4 py-2.5 rounded-lg bg-[#161B27] text-slate-400 hover:text-white text-xs font-semibold"
              >
                Clear Result
              </button>
            </div>

            {calResult && (
              <div className="p-4 rounded-xl bg-[#121622] border border-[#20293D] space-y-2">
                <span className="text-xs text-slate-400 font-mono block">RECOMMENDED DAILY CALORIES</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#CCFF00] font-mono tabular-nums">
                    {calResult.targetCalories} kcal
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ({calResult.delta > 0 ? `+${calResult.delta}` : calResult.delta} kcal delta)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {calResult.deltaLabel}. Track your weekly weight averages to ensure adjustments remain within 0.5% - 1.0% body mass change per week.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 5. MACRO CALCULATOR */}
        {activeTab === 'macros' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Macronutrient Split Calculator</h2>
              <p className="text-xs text-slate-400 mt-1">
                Calculates precise grams of protein, carbohydrate, and dietary fat for muscular preservation and glycogen replenishment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                  Target Calories (kcal)
                </label>
                <input
                  type="number"
                  value={macroCals}
                  onChange={(e) => setMacroCals(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                  Body Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={macroWeight}
                  onChange={(e) => setMacroWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                  Goal
                </label>
                <select
                  value={macroGoal}
                  onChange={(e) => setMacroGoal(e.target.value as FitnessGoal)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                >
                  <option value="build_muscle">Build Muscle</option>
                  <option value="lose_fat">Lose Fat</option>
                  <option value="improve_strength">Improve Strength</option>
                  <option value="improve_endurance">Endurance</option>
                  <option value="general_fitness">General Fitness</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setMacroResult(calculateMacros(macroCals, macroWeight, macroGoal))}
                className="px-5 py-2.5 rounded-lg bg-[#CCFF00] text-black text-xs font-bold hover:bg-[#b8e600] transition-colors"
              >
                Calculate Macros
              </button>
              <button
                onClick={() => setMacroResult(null)}
                className="px-4 py-2.5 rounded-lg bg-[#161B27] text-slate-400 hover:text-white text-xs font-semibold"
              >
                Clear Result
              </button>
            </div>

            {macroResult && (
              <div className="p-4 rounded-xl bg-[#121622] border border-[#20293D] space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center font-mono">
                  <div className="p-3 rounded-lg bg-[#161D2B] border border-[#222F46]">
                    <span className="text-[10px] text-emerald-400 uppercase block font-bold">Protein</span>
                    <span className="text-xl font-bold text-white tabular-nums">{macroResult.proteinGrams}g</span>
                    <span className="text-[10px] text-slate-400 block">{macroResult.proteinCals} kcal</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#161D2B] border border-[#222F46]">
                    <span className="text-[10px] text-sky-400 uppercase block font-bold">Carbs</span>
                    <span className="text-xl font-bold text-white tabular-nums">{macroResult.carbsGrams}g</span>
                    <span className="text-[10px] text-slate-400 block">{macroResult.carbsCals} kcal</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#161D2B] border border-[#222F46]">
                    <span className="text-[10px] text-amber-400 uppercase block font-bold">Fats</span>
                    <span className="text-xl font-bold text-white tabular-nums">{macroResult.fatGrams}g</span>
                    <span className="text-[10px] text-slate-400 block">{macroResult.fatCals} kcal</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Protein is locked at optimal clinical intake ({macroGoal === 'lose_fat' ? '2.2g/kg' : '2.0g/kg'}) to preserve muscle; dietary fats supply hormonal substrate; carbohydrates fuel glycolytic power.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 6. WATER INTAKE ESTIMATOR */}
        {activeTab === 'water' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Daily Water Intake Estimator</h2>
              <p className="text-xs text-slate-400 mt-1">
                Computes optimal hydration volume according to body mass and training perspiration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                  Body Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={waterWeight}
                  onChange={(e) => setWaterWeight(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                  Workout Duration (Mins/Day)
                </label>
                <input
                  type="number"
                  value={waterWorkoutMins}
                  onChange={(e) => setWaterWorkoutMins(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setWaterResult(calculateWaterIntake(waterWeight, waterWorkoutMins))}
                className="px-5 py-2.5 rounded-lg bg-[#CCFF00] text-black text-xs font-bold hover:bg-[#b8e600] transition-colors"
              >
                Estimate Water
              </button>
              <button
                onClick={() => setWaterResult(null)}
                className="px-4 py-2.5 rounded-lg bg-[#161B27] text-slate-400 hover:text-white text-xs font-semibold"
              >
                Clear Result
              </button>
            </div>

            {waterResult && (
              <div className="p-4 rounded-xl bg-[#121622] border border-[#20293D] space-y-2">
                <span className="text-xs text-slate-400 font-mono block">RECOMMENDED WATER INTAKE</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-cyan-400 font-mono tabular-nums">
                    {waterResult.liters} Liters
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    (~{waterResult.glasses} standard 250ml glasses)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {waterResult.explanation} Hydration maintains intracellular cell volume, lubricates joints, and prevents neuromuscular cramping.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 7. IDEAL WEIGHT RANGE ESTIMATOR */}
        {activeTab === 'ideal_weight' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Ideal Weight Range Estimator</h2>
              <p className="text-xs text-slate-400 mt-1">
                Calculates scientific ideal weight ranges based on classic physiological formulas (Devine, Robinson) and WHO BMI norms.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={idealHeight}
                  onChange={(e) => setIdealHeight(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                  Gender
                </label>
                <select
                  value={idealGender}
                  onChange={(e) => setIdealGender(e.target.value as 'male' | 'female' | 'other')}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIdealResult(calculateIdealWeight(idealHeight, idealGender))}
                className="px-5 py-2.5 rounded-lg bg-[#CCFF00] text-black text-xs font-bold hover:bg-[#b8e600] transition-colors"
              >
                Estimate Ideal Weight
              </button>
              <button
                onClick={() => setIdealResult(null)}
                className="px-4 py-2.5 rounded-lg bg-[#161B27] text-slate-400 hover:text-white text-xs font-semibold"
              >
                Clear Result
              </button>
            </div>

            {idealResult && (
              <div className="p-4 rounded-xl bg-[#121622] border border-[#20293D] space-y-3 font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-[#161D2B] border border-[#212E46]">
                    <span className="text-[10px] text-slate-400 block">DEVINE FORMULA</span>
                    <span className="text-xl font-bold text-white tabular-nums">{idealResult.devineKg} kg</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#161D2B] border border-[#212E46]">
                    <span className="text-[10px] text-slate-400 block">ROBINSON FORMULA</span>
                    <span className="text-xl font-bold text-white tabular-nums">{idealResult.robinsonKg} kg</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#161D2B] border border-[#212E46]">
                    <span className="text-[10px] text-[#CCFF00] block">WHO HEALTHY BMI SPAN</span>
                    <span className="text-sm font-bold text-white tabular-nums">
                      {idealResult.bmiRangeMinKg} - {idealResult.bmiRangeMaxKg} kg
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                  Ideal weight is influenced by skeletal frame size, muscular hypertrophy, and body fat percentage. Athletes with high muscle mass commonly exceed these numbers while remaining exceptionally lean.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
