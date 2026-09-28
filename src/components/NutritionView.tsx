import React, { useState } from 'react';
import { DailyMealPlan, DietaryPreference, Meal, UserProfile } from '../types';
import { generateDailyMealPlan, getFilteredMeals, MEALS_DATABASE } from '../data/mealData';
import { 
  calculateBMR, 
  calculateMacros, 
  calculateTargetCalories, 
  calculateTDEE, 
  calculateWaterIntake 
} from '../utils/calculators';
import mealPrepImg from '../assets/images/fitforge_meal_prep_1790578644400.jpg';
import { 
  Utensils, 
  Flame, 
  Droplet, 
  RotateCcw, 
  ShieldAlert, 
  Check, 
  Clock, 
  Sparkles, 
  PlusCircle, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface NutritionViewProps {
  user: UserProfile;
  currentMealPlan: DailyMealPlan;
  onSaveMealPlan: (plan: DailyMealPlan) => void;
  onLogMealCalories?: (calories: number) => void;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  user,
  currentMealPlan,
  onSaveMealPlan,
  onLogMealCalories,
}) => {
  const [selectedPreference, setSelectedPreference] = useState<DietaryPreference>(user.dietaryPreference);
  const [filterHighProtein, setFilterHighProtein] = useState<boolean>(false);
  const [filterLowCalorie, setFilterLowCalorie] = useState<boolean>(false);
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const [loggedMealIds, setLoggedMealIds] = useState<string[]>([]);

  // Scientific Targets
  const bmr = calculateBMR(user.weightKg, user.heightCm, user.age, user.gender);
  const tdee = calculateTDEE(bmr, user.activityLevel);
  const { targetCalories, deltaLabel } = calculateTargetCalories(tdee, user.primaryGoal);
  const macros = calculateMacros(targetCalories, user.weightKg, user.primaryGoal);
  const water = calculateWaterIntake(user.weightKg, user.preferredDuration);

  const handleRegenerate = () => {
    const newPlan = generateDailyMealPlan(selectedPreference, targetCalories, macros.proteinGrams);
    onSaveMealPlan(newPlan);
  };

  const handleLogMeal = (meal: Meal) => {
    if (!loggedMealIds.includes(meal.id)) {
      setLoggedMealIds((prev) => [...prev, meal.id]);
      if (onLogMealCalories) {
        onLogMealCalories(meal.calories);
      }
    }
  };

  const mealSlots: { key: keyof DailyMealPlan['meals']; label: string; time: string }[] = [
    { key: 'breakfast', label: 'Breakfast', time: '08:00 AM' },
    { key: 'mid_morning', label: 'Mid-Morning Snack', time: '11:00 AM' },
    { key: 'lunch', label: 'Lunch', time: '01:30 PM' },
    { key: 'evening_snack', label: 'Evening Snack', time: '05:00 PM' },
    { key: 'dinner', label: 'Dinner', time: '08:30 PM' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. NUTRITION TARGETS BANNER */}
      <div className="relative rounded-2xl border border-[#1E2536] bg-[#0E111A] overflow-hidden">
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src={mealPrepImg}
            alt="Healthy Fitness Meal Prep"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F] via-[#090A0F]/85 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 max-w-4xl space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Targeted Macronutrient Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Goal-Calibrated Nutrition Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
              {deltaLabel}. Formulated to optimize muscular recovery, lean mass preservation, and metabolic vigor.
            </p>
          </div>

          {/* Targets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
            <div className="p-3.5 rounded-xl bg-[#0F131D]/90 backdrop-blur-sm border border-[#1D2538]">
              <span className="text-[10px] text-slate-400 block mb-0.5">CALORIE TARGET</span>
              <span className="text-xl font-bold text-white tabular-nums">{targetCalories}</span>
              <span className="text-[10px] text-slate-400 block">kcal / day</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0F131D]/90 backdrop-blur-sm border border-[#1D2538]">
              <span className="text-[10px] text-emerald-400 block mb-0.5">PROTEIN</span>
              <span className="text-xl font-bold text-emerald-400 tabular-nums">{macros.proteinGrams}g</span>
              <span className="text-[10px] text-slate-400 block">{macros.proteinCals} kcal</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0F131D]/90 backdrop-blur-sm border border-[#1D2538]">
              <span className="text-[10px] text-sky-400 block mb-0.5">CARBOHYDRATES</span>
              <span className="text-xl font-bold text-sky-400 tabular-nums">{macros.carbsGrams}g</span>
              <span className="text-[10px] text-slate-400 block">{macros.carbsCals} kcal</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0F131D]/90 backdrop-blur-sm border border-[#1D2538]">
              <span className="text-[10px] text-amber-400 block mb-0.5">HEALTHY FATS</span>
              <span className="text-xl font-bold text-amber-400 tabular-nums">{macros.fatGrams}g</span>
              <span className="text-[10px] text-slate-400 block">{macros.fatCals} kcal</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0F131D]/90 backdrop-blur-sm border border-[#1D2538] col-span-2 sm:col-span-1">
              <span className="text-[10px] text-cyan-400 block mb-0.5">WATER TARGET</span>
              <span className="text-xl font-bold text-cyan-400 tabular-nums">{water.liters}L</span>
              <span className="text-[10px] text-slate-400 block">~{water.glasses} glasses</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER & GENERATION CONTROL BAR */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#10141E] border border-[#1C2335] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 uppercase mr-1">Diet Preference:</span>
          {[
            { id: 'non_vegetarian' as DietaryPreference, label: 'Non-Vegetarian' },
            { id: 'vegetarian' as DietaryPreference, label: 'Vegetarian' },
            { id: 'eggetarian' as DietaryPreference, label: 'Eggetarian' },
            { id: 'vegan' as DietaryPreference, label: 'Vegan' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedPreference(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPreference === item.id
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-[#141824] text-slate-300 hover:text-white border border-[#222B3D]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterHighProtein(!filterHighProtein)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              filterHighProtein
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                : 'bg-[#141824] text-slate-400 border-[#222B3D]'
            }`}
          >
            High Protein Only
          </button>

          <button
            onClick={() => setFilterLowCalorie(!filterLowCalorie)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              filterLowCalorie
                ? 'bg-amber-950 text-amber-300 border-amber-600'
                : 'bg-[#141824] text-slate-400 border-[#222B3D]'
            }`}
          >
            Low Calorie Only
          </button>

          <button
            onClick={handleRegenerate}
            className="px-4 py-1.5 text-xs font-bold text-black bg-[#CCFF00] hover:bg-[#b8e600] rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-[#CCFF00]/15 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Generate Meal Plan</span>
          </button>
        </div>
      </div>

      {/* 3. 5-MEAL DAILY PLAN LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>DAILY MEAL TIMETABLE · TOTAL {currentMealPlan.totalCalories} KCAL</span>
          <span className="text-emerald-400">{currentMealPlan.totalProtein}g Total Protein</span>
        </div>

        <div className="space-y-3">
          {mealSlots.map((slot, idx) => {
            const meal = currentMealPlan.meals[slot.key];
            const isExpanded = expandedMealId === meal.id;
            const isLogged = loggedMealIds.includes(meal.id);

            return (
              <div
                key={slot.key}
                className="p-4 sm:p-5 rounded-xl bg-[#10141F] border border-[#1C2436] hover:border-[#2C3852] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-[#161D2C] flex items-center justify-center text-xs font-mono font-bold text-emerald-400 shrink-0 mt-0.5">
                      {idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold bg-[#14231E] border border-[#203D32] px-2 py-0.5 rounded">
                          {slot.label} ({slot.time})
                        </span>
                        {meal.highProtein && (
                          <span className="text-[10px] font-mono text-[#CCFF00]">High Protein</span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white">{meal.name}</h3>

                      <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                        {meal.description}
                      </p>
                    </div>
                  </div>

                  {/* Macro values & action */}
                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right font-mono text-xs">
                      <span className="text-white font-extrabold text-sm tabular-nums block">
                        {meal.calories} kcal
                      </span>
                      <div className="text-[10px] text-slate-400 space-x-1.5 tabular-nums">
                        <span className="text-emerald-400">{meal.protein}g P</span>
                        <span className="text-sky-400">{meal.carbs}g C</span>
                        <span className="text-amber-400">{meal.fats}g F</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLogMeal(meal)}
                        disabled={isLogged}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                          isLogged
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 cursor-default'
                            : 'bg-[#181E2E] text-slate-200 hover:text-white hover:bg-[#20283C] border border-[#263148]'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isLogged ? 'Logged' : 'Log Meal'}</span>
                      </button>

                      <button
                        onClick={() => setExpandedMealId(isExpanded ? null : meal.id)}
                        className="p-1.5 rounded-lg bg-[#151926] text-slate-400 hover:text-white"
                        title="View ingredients"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Ingredients & Prep details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#1C2335] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-bold">
                        Ingredients Required:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {meal.ingredients.map((ing, iIdx) => (
                          <li key={iIdx}>{ing}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#0C0F17] p-3 rounded-lg border border-[#1A2132] space-y-1">
                      <span className="font-mono text-[10px] text-[#CCFF00] uppercase tracking-wider block font-bold">
                        Preparation Time:
                      </span>
                      <p className="text-slate-300">{meal.prepTimeMins || 15} minutes approx.</p>
                      <p className="text-[11px] text-slate-400 pt-1">
                        Season with fresh herbs, unrefined sea salt, and black pepper.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. HEALTH DISCLAIMER */}
      <div className="p-4 rounded-xl bg-[#10141E] border border-[#1E2536] flex items-start gap-3.5 text-xs text-slate-400">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-slate-300 font-semibold">Nutritional Information Disclaimer</p>
          <p className="leading-relaxed">
            Nutritional estimates and meal suggestions provided by FitForge are intended solely as general lifestyle and wellness guidance, not medical dietetics. 
            Do not use these values to diagnose, treat, or manage specific clinical ailments, metabolic conditions, or eating disorders. 
            Always consult a registered dietitian or licensed medical practitioner before adopting drastic caloric restrictions.
          </p>
        </div>
      </div>
    </div>
  );
};
