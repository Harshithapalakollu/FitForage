import React, { useState } from 'react';
import { 
  ActivityLevel, 
  DietaryPreference, 
  EquipmentType, 
  FitnessGoal, 
  FitnessLevel, 
  UserProfile 
} from '../types';
import { calculateBMI, calculateBMR, calculateMacros, calculateTargetCalories, calculateTDEE } from '../utils/calculators';
import { X, Check, Dumbbell, Sparkles } from 'lucide-react';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...currentUser });
  const [activeStep, setActiveStep] = useState<number>(1);
  const totalSteps = 3;

  if (!isOpen) return null;

  const handleGoalSelect = (goal: FitnessGoal) => {
    setFormData((prev) => ({ ...prev, primaryGoal: goal }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  // Preview calculations
  const bmiInfo = calculateBMI(formData.weightKg, formData.heightCm);
  const bmr = calculateBMR(formData.weightKg, formData.heightCm, formData.age, formData.gender);
  const tdee = calculateTDEE(bmr, formData.activityLevel);
  const { targetCalories } = calculateTargetCalories(tdee, formData.primaryGoal);
  const macros = calculateMacros(targetCalories, formData.weightKg, formData.primaryGoal);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#0D1017] border border-[#1E2536] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1A202E] flex items-center justify-between bg-[#11141E]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#CCFF00] flex items-center justify-center text-black font-bold">
                <Dumbbell className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-white">Fitness Assessment & Profile</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Step {activeStep} of {totalSteps}: {activeStep === 1 ? 'Biometrics & Body Data' : activeStep === 2 ? 'Training & Equipment' : 'Nutrition & Lifestyle'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A202E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator bar */}
        <div className="w-full bg-[#151A25] h-1">
          <div 
            className="bg-[#CCFF00] h-1 transition-all duration-300"
            style={{ width: `${(activeStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[72vh]">
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                    placeholder="e.g. Alex Rivera"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                    placeholder="alex@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="95"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="120"
                    max="230"
                    required
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="35"
                    max="250"
                    required
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="35"
                    max="250"
                    required
                    value={formData.targetWeightKg}
                    onChange={(e) => setFormData({ ...formData, targetWeightKg: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              {/* Instant Biometrics Calculation Preview */}
              <div className="p-3.5 rounded-xl bg-[#121622] border border-[#1D2436] flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Calculated BMI: </span>
                  <span className="font-mono font-bold text-white text-sm tabular-nums">{bmiInfo.bmi}</span>
                  <span className="ml-2 font-medium" style={{ color: bmiInfo.category.color }}>({bmiInfo.category.label})</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Base BMR: </span>
                  <span className="font-mono font-bold text-[#CCFF00] tabular-nums">{bmr} kcal</span>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Primary Fitness Goal
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'build_muscle' as FitnessGoal, label: 'Build Muscle' },
                    { id: 'lose_fat' as FitnessGoal, label: 'Lose Fat' },
                    { id: 'six_pack_abs' as FitnessGoal, label: 'Six-Pack Abs' },
                    { id: 'improve_strength' as FitnessGoal, label: 'Strength' },
                    { id: 'improve_endurance' as FitnessGoal, label: 'Endurance' },
                    { id: 'general_fitness' as FitnessGoal, label: 'General Fitness' },
                    { id: 'improve_flexibility' as FitnessGoal, label: 'Flexibility' },
                    { id: 'athletic_performance' as FitnessGoal, label: 'Athletic' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleGoalSelect(g.id)}
                      className={`p-2.5 rounded-lg text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                        formData.primaryGoal === g.id
                          ? 'bg-[#18212D] text-[#CCFF00] border-[#CCFF00]'
                          : 'bg-[#131722] text-slate-300 border-[#22293B] hover:border-slate-500'
                      }`}
                    >
                      <span>{g.label}</span>
                      {formData.primaryGoal === g.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Fitness Level
                  </label>
                  <select
                    value={formData.fitnessLevel}
                    onChange={(e) => setFormData({ ...formData, fitnessLevel: e.target.value as FitnessLevel })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="beginner">Beginner (&lt; 1 year)</option>
                    <option value="intermediate">Intermediate (1 - 3 years)</option>
                    <option value="advanced">Advanced (3+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Workout Days Per Week
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 4, 5, 6].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setFormData({ ...formData, workoutDaysPerWeek: days as 3 | 4 | 5 | 6 })}
                        className={`py-2 rounded-lg text-xs font-mono font-bold border transition-colors ${
                          formData.workoutDaysPerWeek === days
                            ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                            : 'bg-[#141824] text-slate-300 border-[#222B3D]'
                        }`}
                      >
                        {days} Days
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Preferred Session Duration
                  </label>
                  <select
                    value={formData.preferredDuration}
                    onChange={(e) => setFormData({ ...formData, preferredDuration: Number(e.target.value) as 30 | 45 | 60 | 75 | 90 })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="30">30 minutes (Express)</option>
                    <option value="45">45 minutes (Standard)</option>
                    <option value="60">60 minutes (Standard Gym)</option>
                    <option value="75">75 minutes (High Volume)</option>
                    <option value="90">90 minutes (Full Power)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Available Equipment
                  </label>
                  <select
                    value={formData.equipment}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value as EquipmentType })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="full_gym">Full Commercial Gym (Barbells, Cables, Machines)</option>
                    <option value="dumbbells">Dumbbells & Bench Only</option>
                    <option value="home_equipment">Home Gym (Bands, Kettlebells, Pullup Bar)</option>
                    <option value="bodyweight">Bodyweight / Calisthenics Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Workout Experience Description
                </label>
                <input
                  type="text"
                  value={formData.workoutExperience}
                  onChange={(e) => setFormData({ ...formData, workoutExperience: e.target.value })}
                  placeholder="e.g. 2 years regular lifting with some HIIT cardio"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Dietary Preference
                  </label>
                  <select
                    value={formData.dietaryPreference}
                    onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value as DietaryPreference })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="non_vegetarian">Non-Vegetarian (Chicken, Fish, Eggs, Meat)</option>
                    <option value="vegetarian">Vegetarian (Dairy, Dal, Paneer, Grains)</option>
                    <option value="eggetarian">Eggetarian (Vegetarian + Eggs)</option>
                    <option value="vegan">Vegan (100% Plant-Based, Tofu, Legumes)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Daily Activity Level (NEAT)
                  </label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="sedentary">Sedentary (Desk job, minimal daily walking)</option>
                    <option value="lightly_active">Lightly Active (1-3 days light exercise)</option>
                    <option value="moderately_active">Moderately Active (3-5 days moderate workouts)</option>
                    <option value="very_active">Very Active (6-7 days hard training)</option>
                    <option value="athlete">Athlete (Physical job or twice daily workouts)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Sleep Duration (Hours / Night)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="4"
                    max="12"
                    value={formData.sleepHours}
                    onChange={(e) => setFormData({ ...formData, sleepHours: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm font-mono tabular-nums focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Food Allergies or Restrictions
                  </label>
                  <input
                    type="text"
                    value={formData.foodAllergies.join(', ')}
                    onChange={(e) => setFormData({ ...formData, foodAllergies: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="e.g. Peanuts, Lactose, Gluten, None"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              {/* Calculated Summary Box */}
              <div className="p-4 rounded-xl bg-[#111622] border border-[#212A3D] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#CCFF00]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Your Calibrated Output Targets</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                  <div className="p-2 rounded bg-[#0A0D14] border border-[#192132]">
                    <span className="text-[10px] text-slate-400 block">Daily Target</span>
                    <span className="text-sm font-bold text-white tabular-nums">{targetCalories} kcal</span>
                  </div>
                  <div className="p-2 rounded bg-[#0A0D14] border border-[#192132]">
                    <span className="text-[10px] text-slate-400 block">Protein Target</span>
                    <span className="text-sm font-bold text-[#CCFF00] tabular-nums">{macros.proteinGrams} g</span>
                  </div>
                  <div className="p-2 rounded bg-[#0A0D14] border border-[#192132]">
                    <span className="text-[10px] text-slate-400 block">Maintenance TDEE</span>
                    <span className="text-sm font-bold text-slate-300 tabular-nums">{tdee} kcal</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-[#1C2233] flex items-center justify-between">
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#171C28] rounded-lg transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {activeStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-5 py-2 text-xs font-bold text-black bg-[#CCFF00] hover:bg-[#b8e600] rounded-lg transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-black bg-[#CCFF00] hover:bg-[#b8e600] rounded-lg shadow-lg shadow-[#CCFF00]/20 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile & Update Dashboard</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
