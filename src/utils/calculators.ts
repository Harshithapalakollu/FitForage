import { ActivityLevel, FitnessGoal } from '../types';

export interface BMICategory {
  label: string;
  color: string;
  healthyRangeMin: number;
  healthyRangeMax: number;
  description: string;
}

export function calculateBMI(weightKg: number, heightCm: number): {
  bmi: number;
  category: BMICategory;
  healthyWeightMin: number;
  healthyWeightMax: number;
} {
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? Number((weightKg / (heightM * heightM)).toFixed(1)) : 0;
  
  const healthyWeightMin = Number((18.5 * heightM * heightM).toFixed(1));
  const healthyWeightMax = Number((24.9 * heightM * heightM).toFixed(1));

  let category: BMICategory;
  if (bmi < 18.5) {
    category = {
      label: 'Underweight',
      color: '#38BDF8', // Sky
      healthyRangeMin: 18.5,
      healthyRangeMax: 24.9,
      description: 'Your weight is below the normal recommendation. Consider a surplus with strength training.',
    };
  } else if (bmi < 25) {
    category = {
      label: 'Normal weight',
      color: '#10B981', // Emerald
      healthyRangeMin: 18.5,
      healthyRangeMax: 24.9,
      description: 'Your weight is within the recommended healthy range for your height.',
    };
  } else if (bmi < 30) {
    category = {
      label: 'Overweight',
      color: '#F59E0B', // Amber
      healthyRangeMin: 18.5,
      healthyRangeMax: 24.9,
      description: 'Above optimal weight for height. A moderate deficit and resistance training can assist.',
    };
  } else {
    category = {
      label: 'Obese',
      color: '#EF4444', // Red
      healthyRangeMin: 18.5,
      healthyRangeMax: 24.9,
      description: 'Significantly elevated weight. We recommend consulting a healthcare professional for guidance.',
    };
  }

  return { bmi, category, healthyWeightMin, healthyWeightMax };
}

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' | 'other'
): number {
  // Mifflin-St Jeor Equation
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'female') {
    return Math.round(base - 161);
  } else {
    return Math.round(base + 5);
  }
}

export const activityMultipliers: Record<ActivityLevel, { multiplier: number; label: string; desc: string }> = {
  sedentary: { multiplier: 1.2, label: 'Sedentary', desc: 'Little or no exercise, desk job' },
  lightly_active: { multiplier: 1.375, label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  moderately_active: { multiplier: 1.55, label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
  very_active: { multiplier: 1.725, label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
  athlete: { multiplier: 1.9, label: 'Extremely Active / Athlete', desc: 'Physical job or 2x/day training' },
};

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const mult = activityMultipliers[activityLevel]?.multiplier || 1.375;
  return Math.round(bmr * mult);
}

export function calculateTargetCalories(tdee: number, goal: FitnessGoal): {
  targetCalories: number;
  delta: number;
  deltaLabel: string;
} {
  switch (goal) {
    case 'lose_fat':
    case 'six_pack_abs':
      // 20% deficit
      return {
        targetCalories: Math.round(tdee * 0.8),
        delta: Math.round(tdee * -0.2),
        deltaLabel: 'Deficit (-20%) for steady, healthy fat loss',
      };
    case 'build_muscle':
    case 'improve_strength':
    case 'athletic_performance':
      // 10% surplus
      return {
        targetCalories: Math.round(tdee * 1.1),
        delta: Math.round(tdee * 0.1),
        deltaLabel: 'Surplus (+10%) for muscular hypertrophy and power',
      };
    case 'general_fitness':
    case 'improve_endurance':
    case 'improve_flexibility':
    default:
      // Maintenance
      return {
        targetCalories: tdee,
        delta: 0,
        deltaLabel: 'Maintenance for stamina, energy balance and body recomposition',
      };
  }
}

export function calculateMacros(
  targetCalories: number,
  weightKg: number,
  goal: FitnessGoal
): {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  proteinCals: number;
  carbsCals: number;
  fatCals: number;
} {
  // Protein multiplier based on goal (g per kg of bodyweight)
  let proteinPerKg = 1.8;
  if (goal === 'build_muscle' || goal === 'six_pack_abs' || goal === 'improve_strength') {
    proteinPerKg = 2.0;
  } else if (goal === 'lose_fat') {
    proteinPerKg = 2.2; // higher protein preserves lean mass in a deficit
  } else if (goal === 'improve_endurance') {
    proteinPerKg = 1.6;
  }

  const proteinGrams = Math.round(weightKg * proteinPerKg);
  const proteinCals = proteinGrams * 4;

  // Fat recommendation: ~25% of total calories
  const fatCals = Math.round(targetCalories * 0.25);
  const fatGrams = Math.round(fatCals / 9);

  // Carbs: Remaining calories
  const remainingCals = Math.max(0, targetCalories - (proteinCals + fatCals));
  const carbsGrams = Math.round(remainingCals / 4);
  const carbsCals = carbsGrams * 4;

  return {
    proteinGrams,
    carbsGrams,
    fatGrams,
    proteinCals,
    carbsCals,
    fatCals,
  };
}

export function calculateWaterIntake(weightKg: number, workoutMinsPerDay: number = 45): {
  liters: number;
  glasses: number;
  explanation: string;
} {
  // Baseline: 35ml per kg of bodyweight + 350ml per 30 mins of moderate/intense exercise
  const baseLiters = weightKg * 0.035;
  const exerciseLiters = (workoutMinsPerDay / 30) * 0.35;
  const totalLiters = Number((baseLiters + exerciseLiters).toFixed(1));
  const glasses = Math.round(totalLiters / 0.25); // 250ml glass

  return {
    liters: totalLiters,
    glasses,
    explanation: `Based on your body mass (${weightKg} kg) and ${workoutMinsPerDay} mins average training session.`,
  };
}

export function calculateIdealWeight(heightCm: number, gender: 'male' | 'female' | 'other'): {
  devineKg: number;
  robinsonKg: number;
  bmiRangeMinKg: number;
  bmiRangeMaxKg: number;
} {
  const heightM = heightCm / 100;
  const inchesOver5Ft = Math.max(0, (heightCm / 2.54) - 60);

  let devineKg = 0;
  let robinsonKg = 0;

  if (gender === 'female') {
    devineKg = Number((45.5 + 2.3 * inchesOver5Ft).toFixed(1));
    robinsonKg = Number((49 + 1.7 * inchesOver5Ft).toFixed(1));
  } else {
    devineKg = Number((50 + 2.3 * inchesOver5Ft).toFixed(1));
    robinsonKg = Number((52 + 1.9 * inchesOver5Ft).toFixed(1));
  }

  const bmiRangeMinKg = Number((18.5 * heightM * heightM).toFixed(1));
  const bmiRangeMaxKg = Number((24.9 * heightM * heightM).toFixed(1));

  return {
    devineKg,
    robinsonKg,
    bmiRangeMinKg,
    bmiRangeMaxKg,
  };
}

export function kgToLbs(kg: number): number {
  return Number((kg * 2.20462).toFixed(1));
}

export function lbsToKg(lbs: number): number {
  return Number((lbs / 2.20462).toFixed(1));
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54);
}
