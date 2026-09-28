import { Challenge, DailyMealPlan, PersonalRecord, ProgressLog, UserProfile, WorkoutPlan } from '../types';
import { DEMO_PROFILES, INITIAL_PRS, INITIAL_PROGRESS_LOGS } from '../data/mockProfiles';
import { INITIAL_CHALLENGES } from '../data/challengesData';
import { generateWorkoutPlan } from '../data/workoutTemplates';
import { generateDailyMealPlan } from '../data/mealData';
import { calculateBMR, calculateMacros, calculateTargetCalories, calculateTDEE } from './calculators';

const KEYS = {
  USER: 'fitforge_active_user',
  ALL_USERS: 'fitforge_all_users',
  LOGS: 'fitforge_progress_logs',
  PRS: 'fitforge_personal_records',
  CHALLENGES: 'fitforge_challenges',
  ACTIVE_PLAN: 'fitforge_active_workout_plan',
  ACTIVE_MEAL_PLAN: 'fitforge_active_meal_plan',
  SAVED_TIPS: 'fitforge_saved_tips',
};

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEMO_PROFILES[0];
  try {
    const raw = localStorage.getItem(KEYS.USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse user profile', e);
  }
  // Default to Alex Rivera
  saveUserProfile(DEMO_PROFILES[0]);
  return DEMO_PROFILES[0];
}

export function saveUserProfile(user: UserProfile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
    // Also save in user directory
    const all = loadAllProfiles();
    const existingIndex = all.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      all[existingIndex] = user;
    } else {
      all.push(user);
    }
    localStorage.setItem(KEYS.ALL_USERS, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}

export function loadAllProfiles(): UserProfile[] {
  if (typeof window === 'undefined') return DEMO_PROFILES;
  try {
    const raw = localStorage.getItem(KEYS.ALL_USERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to parse all profiles', e);
  }
  return DEMO_PROFILES;
}

export function loadProgressLogs(): ProgressLog[] {
  if (typeof window === 'undefined') return INITIAL_PROGRESS_LOGS;
  try {
    const raw = localStorage.getItem(KEYS.LOGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load progress logs', e);
  }
  return INITIAL_PROGRESS_LOGS;
}

export function saveProgressLogs(logs: ProgressLog[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs', e);
  }
}

export function loadPersonalRecords(): PersonalRecord[] {
  if (typeof window === 'undefined') return INITIAL_PRS;
  try {
    const raw = localStorage.getItem(KEYS.PRS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load PRs', e);
  }
  return INITIAL_PRS;
}

export function savePersonalRecords(prs: PersonalRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.PRS, JSON.stringify(prs));
  } catch (e) {
    console.error('Failed to save PRs', e);
  }
}

export function loadChallenges(): Challenge[] {
  if (typeof window === 'undefined') return INITIAL_CHALLENGES;
  try {
    const raw = localStorage.getItem(KEYS.CHALLENGES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load challenges', e);
  }
  return INITIAL_CHALLENGES;
}

export function saveChallenges(challenges: Challenge[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(challenges));
  } catch (e) {
    console.error('Failed to save challenges', e);
  }
}

export function loadActiveWorkoutPlan(user: UserProfile): WorkoutPlan {
  if (typeof window === 'undefined') return generateWorkoutPlan(user.primaryGoal, user.workoutDaysPerWeek, user.fitnessLevel);
  try {
    const raw = localStorage.getItem(KEYS.ACTIVE_PLAN);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.days) return parsed;
    }
  } catch (e) {
    console.error('Failed to load active workout plan', e);
  }
  const defaultPlan = generateWorkoutPlan(user.primaryGoal, user.workoutDaysPerWeek, user.fitnessLevel);
  saveActiveWorkoutPlan(defaultPlan);
  return defaultPlan;
}

export function saveActiveWorkoutPlan(plan: WorkoutPlan) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.ACTIVE_PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error('Failed to save workout plan', e);
  }
}

export function loadActiveMealPlan(user: UserProfile): DailyMealPlan {
  const bmr = calculateBMR(user.weightKg, user.heightCm, user.age, user.gender);
  const tdee = calculateTDEE(bmr, user.activityLevel);
  const { targetCalories } = calculateTargetCalories(tdee, user.primaryGoal);
  const macros = calculateMacros(targetCalories, user.weightKg, user.primaryGoal);

  if (typeof window === 'undefined') return generateDailyMealPlan(user.dietaryPreference, targetCalories, macros.proteinGrams);
  try {
    const raw = localStorage.getItem(KEYS.ACTIVE_MEAL_PLAN);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.meals) return parsed;
    }
  } catch (e) {
    console.error('Failed to load meal plan', e);
  }
  const defaultMealPlan = generateDailyMealPlan(user.dietaryPreference, targetCalories, macros.proteinGrams);
  saveActiveMealPlan(defaultMealPlan);
  return defaultMealPlan;
}

export function saveActiveMealPlan(plan: DailyMealPlan) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.ACTIVE_MEAL_PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error('Failed to save meal plan', e);
  }
}

export function loadSavedTips(): string[] {
  if (typeof window === 'undefined') return ['tip-1', 'tip-3'];
  try {
    const raw = localStorage.getItem(KEYS.SAVED_TIPS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved tips', e);
  }
  return ['tip-1', 'tip-3'];
}

export function saveSavedTips(tipIds: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.SAVED_TIPS, JSON.stringify(tipIds));
  } catch (e) {
    console.error('Failed to save tips', e);
  }
}

export function resetAllDataToDemo() {
  if (typeof window === 'undefined') return;
  localStorage.clear();
  saveUserProfile(DEMO_PROFILES[0]);
  saveProgressLogs(INITIAL_PROGRESS_LOGS);
  savePersonalRecords(INITIAL_PRS);
  saveChallenges(INITIAL_CHALLENGES);
}
