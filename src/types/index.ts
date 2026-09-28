export type FitnessGoal =
  | 'build_muscle'
  | 'lose_fat'
  | 'six_pack_abs'
  | 'improve_strength'
  | 'improve_endurance'
  | 'general_fitness'
  | 'improve_flexibility'
  | 'athletic_performance';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type EquipmentType = 'full_gym' | 'dumbbells' | 'home_equipment' | 'bodyweight';
export type DietaryPreference = 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'athlete';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  fitnessLevel: FitnessLevel;
  workoutExperience: string;
  workoutDaysPerWeek: 3 | 4 | 5 | 6;
  preferredDuration: 30 | 45 | 60 | 75 | 90;
  equipment: EquipmentType;
  primaryGoal: FitnessGoal;
  dietaryPreference: DietaryPreference;
  foodAllergies: string[];
  sleepHours: number;
  activityLevel: ActivityLevel;
  unitSystem: 'metric' | 'imperial';
  joinedDate: string;
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'core'
  | 'full_body'
  | 'cardio';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ExerciseType = 'compound' | 'isolation' | 'isometric' | 'plyometric' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: MuscleGroup;
  secondaryMuscles?: string[];
  equipment: 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'bands' | 'cardio';
  difficulty: ExerciseDifficulty;
  type: ExerciseType;
  sets: number;
  reps: string;
  restSeconds: number;
  durationMins?: number;
  instructions: string[];
  commonMistakes: string[];
  alternativeExercise: string;
  caloriesBurnedEst?: number;
}

export interface WorkoutDay {
  dayNumber: number;
  dayName: string;
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  goalId: FitnessGoal;
  title: string;
  description: string;
  daysPerWeek: 3 | 4 | 5 | 6;
  difficulty: FitnessLevel;
  days: WorkoutDay[];
}

export interface Meal {
  id: string;
  name: string;
  mealType: 'breakfast' | 'mid_morning' | 'lunch' | 'evening_snack' | 'dinner';
  calories: number;
  protein: number; // grams
  carbs: number;   // grams
  fats: number;    // grams
  dietary: DietaryPreference[];
  highProtein?: boolean;
  lowCalorie?: boolean;
  description: string;
  ingredients: string[];
  prepTimeMins?: number;
}

export interface DailyMealPlan {
  id: string;
  title: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  meals: {
    breakfast: Meal;
    mid_morning: Meal;
    lunch: Meal;
    evening_snack: Meal;
    dinner: Meal;
  };
}

export interface ProgressLog {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  armsCm?: number;
  thighsCm?: number;
  steps: number;
  caloriesConsumed: number;
  waterLiters: number;
  workoutCompleted: boolean;
  workoutName?: string;
  notes?: string;
}

export interface PersonalRecord {
  id: string;
  exercise: string;
  weightKg: number;
  reps: number;
  date: string;
}

export interface Challenge {
  id: string;
  title: string;
  targetDescription: string;
  totalDays: number;
  completedDays: number[]; // e.g. [1, 2, 3, 4]
  dailyGoal: string;
  category: 'strength' | 'core' | 'endurance' | 'habit';
  badgeIcon: string;
}

export interface FitnessTip {
  id: string;
  category: 'training' | 'nutrition' | 'hydration' | 'sleep' | 'recovery' | 'mobility' | 'technique';
  title: string;
  content: string;
  actionableCue: string;
  readTime: string;
}

export type ActiveTab =
  | 'home'
  | 'dashboard'
  | 'workouts'
  | 'nutrition'
  | 'exercises'
  | 'calculators'
  | 'progress'
  | 'timer'
  | 'challenges'
  | 'tips';
