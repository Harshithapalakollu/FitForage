import { FitnessGoal, FitnessLevel, WorkoutDay, WorkoutPlan } from '../types';
import { EXERCISES_DATABASE } from './exercisesData';

const findEx = (id: string) => EXERCISES_DATABASE.find(e => e.id === id) || EXERCISES_DATABASE[0];

export const GOAL_LABELS: Record<FitnessGoal, { title: string; subtitle: string; icon: string }> = {
  build_muscle: {
    title: 'Build Muscle (Hypertrophy)',
    subtitle: 'Maximize muscular hypertrophy with progressive volume and compound overload',
    icon: 'Dumbbell',
  },
  lose_fat: {
    title: 'Lose Fat & Shred',
    subtitle: 'High energy expenditure, metabolic conditioning and lean tissue preservation',
    icon: 'Flame',
  },
  six_pack_abs: {
    title: 'Six-Pack / Core Definition',
    subtitle: 'Targeted rectus abdominis, obliques, and transverse core strengthening',
    icon: 'Target',
  },
  improve_strength: {
    title: 'Improve Strength & Power',
    subtitle: 'Heavy compound barbell lifts (Squat, Bench, Deadlift) and neurological adaptation',
    icon: 'Zap',
  },
  improve_endurance: {
    title: 'Improve Endurance & Stamina',
    subtitle: 'High-rep pacing, circuit intervals, and cardiovascular efficiency',
    icon: 'HeartPulse',
  },
  general_fitness: {
    title: 'General Fitness & Longevity',
    subtitle: 'Balanced functional movements, cardiovascular health, and whole-body resilience',
    icon: 'Activity',
  },
  improve_flexibility: {
    title: 'Improve Flexibility & Mobility',
    subtitle: 'Joint range of motion, dynamic stability, and injury prevention',
    icon: 'Compass',
  },
  athletic_performance: {
    title: 'Athletic Performance',
    subtitle: 'Explosive power, agility, multi-planar speed, and total physical output',
    icon: 'Trophy',
  },
};

export function generateWorkoutPlan(
  goal: FitnessGoal,
  daysPerWeek: 3 | 4 | 5 | 6,
  level: FitnessLevel = 'intermediate'
): WorkoutPlan {
  let days: WorkoutDay[] = [];

  if (goal === 'build_muscle') {
    if (daysPerWeek === 3) {
      days = [
        {
          dayNumber: 1,
          dayName: 'Day 1: Upper Body Hypertrophy',
          focus: 'Chest, Back & Shoulders',
          exercises: [
            findEx('bench-press'),
            findEx('lat-pulldown'),
            findEx('incline-dumbbell-press'),
            findEx('seated-cable-row'),
            findEx('lateral-raises'),
          ],
        },
        {
          dayNumber: 2,
          dayName: 'Day 2: Lower Body & Glutes',
          focus: 'Quads, Hamstrings & Calves',
          exercises: [
            findEx('barbell-back-squat'),
            findEx('romanian-deadlift'),
            findEx('leg-press'),
            findEx('walking-lunges'),
            findEx('standing-calf-raises'),
          ],
        },
        {
          dayNumber: 3,
          dayName: 'Day 3: Arms & Core Sculpt',
          focus: 'Biceps, Triceps & Abdominals',
          exercises: [
            findEx('overhead-shoulder-press'),
            findEx('barbell-bicep-curl'),
            findEx('tricep-rope-pushdown'),
            findEx('hammer-curls'),
            findEx('plank'),
          ],
        },
      ];
    } else if (daysPerWeek === 4) {
      days = [
        {
          dayNumber: 1,
          dayName: 'Day 1: Upper Power',
          focus: 'Chest & Back Compound Force',
          exercises: [findEx('bench-press'), findEx('pull-ups'), findEx('incline-dumbbell-press'), findEx('seated-cable-row')],
        },
        {
          dayNumber: 2,
          dayName: 'Day 2: Lower Power',
          focus: 'Squat & Posterior Chain',
          exercises: [findEx('barbell-back-squat'), findEx('romanian-deadlift'), findEx('leg-press'), findEx('standing-calf-raises')],
        },
        {
          dayNumber: 3,
          dayName: 'Day 3: Upper Hypertrophy',
          focus: 'Shoulders, Arms & Detail',
          exercises: [findEx('overhead-shoulder-press'), findEx('cable-chest-fly'), findEx('lateral-raises'), findEx('barbell-bicep-curl'), findEx('tricep-rope-pushdown')],
        },
        {
          dayNumber: 4,
          dayName: 'Day 4: Lower Volume & Core',
          focus: 'Lunges, Quads & Core Stability',
          exercises: [findEx('walking-lunges'), findEx('leg-press'), findEx('hanging-leg-raises'), findEx('russian-twists')],
        },
      ];
    } else if (daysPerWeek === 5) {
      days = [
        { dayNumber: 1, dayName: 'Day 1: Push (Chest & Triceps)', focus: 'Chest focus', exercises: [findEx('bench-press'), findEx('incline-dumbbell-press'), findEx('tricep-rope-pushdown'), findEx('push-ups')] },
        { dayNumber: 2, dayName: 'Day 2: Pull (Back & Biceps)', focus: 'Lats & mid back', exercises: [findEx('pull-ups'), findEx('lat-pulldown'), findEx('seated-cable-row'), findEx('barbell-bicep-curl')] },
        { dayNumber: 3, dayName: 'Day 3: Legs (Quad Dominant)', focus: 'Squats & Presses', exercises: [findEx('barbell-back-squat'), findEx('leg-press'), findEx('walking-lunges'), findEx('standing-calf-raises')] },
        { dayNumber: 4, dayName: 'Day 4: Shoulders & Arms', focus: 'Delts & Biceps/Triceps', exercises: [findEx('overhead-shoulder-press'), findEx('lateral-raises'), findEx('hammer-curls'), findEx('skull-crushers')] },
        { dayNumber: 5, dayName: 'Day 5: Posterior Chain & Core', focus: 'Hamstrings & Abs', exercises: [findEx('romanian-deadlift'), findEx('hanging-leg-raises'), findEx('plank'), findEx('bicycle-crunches')] },
      ];
    } else {
      // 6 Days PPL (Push/Pull/Legs 2x)
      days = [
        { dayNumber: 1, dayName: 'Day 1: Push A', focus: 'Heavy Chest & Delts', exercises: [findEx('bench-press'), findEx('overhead-shoulder-press'), findEx('incline-dumbbell-press'), findEx('tricep-rope-pushdown')] },
        { dayNumber: 2, dayName: 'Day 2: Pull A', focus: 'Heavy Back & Biceps', exercises: [findEx('pull-ups'), findEx('seated-cable-row'), findEx('face-pulls'), findEx('barbell-bicep-curl')] },
        { dayNumber: 3, dayName: 'Day 3: Legs A', focus: 'Heavy Squat & Quads', exercises: [findEx('barbell-back-squat'), findEx('leg-press'), findEx('walking-lunges'), findEx('standing-calf-raises')] },
        { dayNumber: 4, dayName: 'Day 4: Push B', focus: 'Incline & Lateral Shoulders', exercises: [findEx('incline-dumbbell-press'), findEx('push-ups'), findEx('lateral-raises'), findEx('skull-crushers')] },
        { dayNumber: 5, dayName: 'Day 5: Pull B', focus: 'Lat Pulldown & Posterior Chain', exercises: [findEx('lat-pulldown'), findEx('romanian-deadlift'), findEx('hammer-curls'), findEx('hanging-leg-raises')] },
        { dayNumber: 6, dayName: 'Day 6: Legs B & Core', focus: 'Hamstrings, Calves & Abs', exercises: [findEx('romanian-deadlift'), findEx('leg-press'), findEx('plank'), findEx('bicycle-crunches')] },
      ];
    }
  } else if (goal === 'six_pack_abs') {
    days = Array.from({ length: daysPerWeek }, (_, i) => ({
      dayNumber: i + 1,
      dayName: `Day ${i + 1}: Core & Metabolic Conditioning`,
      focus: i % 2 === 0 ? 'Upper & Lower Rectus Abdominis' : 'Obliques, Transverse & Fat Burn',
      exercises: i % 2 === 0
        ? [findEx('hanging-leg-raises'), findEx('plank'), findEx('push-ups'), findEx('jump-rope-intervals')]
        : [findEx('russian-twists'), findEx('bicycle-crunches'), findEx('rowing-machine'), findEx('walking-lunges')],
    }));
  } else if (goal === 'lose_fat') {
    days = Array.from({ length: daysPerWeek }, (_, i) => ({
      dayNumber: i + 1,
      dayName: `Day ${i + 1}: Circuit Fat Incineration`,
      focus: 'High Heart Rate & Full Body Burn',
      exercises: [
        findEx('jump-rope-intervals'),
        findEx('push-ups'),
        findEx('walking-lunges'),
        findEx('lat-pulldown'),
        findEx('plank'),
      ],
    }));
  } else if (goal === 'improve_strength') {
    days = Array.from({ length: daysPerWeek }, (_, i) => ({
      dayNumber: i + 1,
      dayName: `Day ${i + 1}: Heavy Compound Load`,
      focus: i === 0 ? 'Bench & Press' : i === 1 ? 'Squat Focus' : i === 2 ? 'Deadlift Power' : 'Accessory Overload',
      exercises: i === 0
        ? [findEx('bench-press'), findEx('overhead-shoulder-press'), findEx('tricep-rope-pushdown')]
        : i === 1
        ? [findEx('barbell-back-squat'), findEx('leg-press'), findEx('standing-calf-raises')]
        : [findEx('barbell-deadlift'), findEx('pull-ups'), findEx('barbell-bicep-curl')],
    }));
  } else {
    // General fitness / beginner / endurance
    days = Array.from({ length: daysPerWeek }, (_, i) => ({
      dayNumber: i + 1,
      dayName: `Day ${i + 1}: Full Body Balance`,
      focus: 'Mobility, Strength & Heart Health',
      exercises: [
        findEx('push-ups'),
        findEx('lat-pulldown'),
        findEx('walking-lunges'),
        findEx('overhead-shoulder-press'),
        findEx('plank'),
      ],
    }));
  }

  const meta = GOAL_LABELS[goal] || GOAL_LABELS.general_fitness;

  return {
    id: `plan-${goal}-${daysPerWeek}d`,
    goalId: goal,
    title: `${meta.title} (${daysPerWeek} Days/Week)`,
    description: meta.subtitle,
    daysPerWeek,
    difficulty: level,
    days,
  };
}
