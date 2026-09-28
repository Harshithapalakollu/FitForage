import { DailyMealPlan, DietaryPreference, Meal } from '../types';

export const MEALS_DATABASE: Meal[] = [
  // BREAKFAST
  {
    id: 'bf-1',
    name: 'Scrambled Eggs on Sourdough & Avocado',
    mealType: 'breakfast',
    calories: 420,
    protein: 26,
    carbs: 34,
    fats: 18,
    dietary: ['non_vegetarian', 'eggetarian'],
    highProtein: true,
    description: '3 whole farm eggs softly scrambled with sea salt, served over toasted whole-grain sourdough with 50g sliced avocado.',
    ingredients: ['3 pasture-raised eggs', '1 slice artisanal sourdough', '50g avocado', '1 tsp extra virgin olive oil', 'Pinch of black pepper & sea salt'],
    prepTimeMins: 10,
  },
  {
    id: 'bf-2',
    name: 'High-Protein Rolled Oats with Whey & Berries',
    mealType: 'breakfast',
    calories: 390,
    protein: 32,
    carbs: 52,
    fats: 6,
    dietary: ['vegetarian', 'eggetarian'],
    highProtein: true,
    description: 'Warm rolled oats simmered in unsweetened almond milk, stirred with whey protein isolate and topped with fresh blueberries and chia seeds.',
    ingredients: ['60g rolled oats', '1 scoop (30g) vanilla whey protein', '200ml unsweetened almond milk', '50g fresh blueberries', '5g chia seeds'],
    prepTimeMins: 8,
  },
  {
    id: 'bf-3',
    name: 'Tofu Scramble with Spinach & Whole Grain Toast',
    mealType: 'breakfast',
    calories: 350,
    protein: 24,
    carbs: 32,
    fats: 14,
    dietary: ['vegan', 'vegetarian'],
    highProtein: true,
    description: 'Crumbled organic firm tofu sautéed with turmeric, nutritional yeast, baby spinach, and cherry tomatoes.',
    ingredients: ['150g firm tofu', '1 cup baby spinach', '5 cherry tomatoes', '1 tbsp nutritional yeast', '1 slice whole grain bread', 'Turmeric & cumin'],
    prepTimeMins: 12,
  },
  {
    id: 'bf-4',
    name: 'Egg White Frittata with Mushrooms & Herbs',
    mealType: 'breakfast',
    calories: 260,
    protein: 28,
    carbs: 12,
    fats: 8,
    dietary: ['non_vegetarian', 'eggetarian'],
    lowCalorie: true,
    highProtein: true,
    description: 'Fluffy baked egg white skillet loaded with button mushrooms, bell peppers, and fresh parsley.',
    ingredients: ['6 liquid egg whites (180g)', '1 whole egg', '80g sliced cremini mushrooms', '1/2 bell pepper', 'Fresh herbs'],
    prepTimeMins: 15,
  },

  // MID-MORNING SNACK
  {
    id: 'mm-1',
    name: '0% Fat Greek Yogurt with Honey & Walnuts',
    mealType: 'mid_morning',
    calories: 220,
    protein: 20,
    carbs: 18,
    fats: 7,
    dietary: ['vegetarian', 'eggetarian'],
    highProtein: true,
    description: 'Thick strained authentic Greek yogurt with 1 tsp raw organic honey and crushed English walnut halves.',
    ingredients: ['170g plain Greek yogurt (0% fat)', '1 tsp raw honey', '12g walnut halves'],
    prepTimeMins: 2,
  },
  {
    id: 'mm-2',
    name: 'Plant Protein Shake with Banana & Flaxseed',
    mealType: 'mid_morning',
    calories: 240,
    protein: 25,
    carbs: 28,
    fats: 4,
    dietary: ['vegan', 'vegetarian'],
    highProtein: true,
    description: 'Smooth blend of pea/rice protein isolate, half a banana, ground golden flaxseed, and ice cold water.',
    ingredients: ['1 scoop (30g) pea/rice protein', '1/2 ripe banana', '1 tbsp ground flaxseed', '300ml cold water'],
    prepTimeMins: 3,
  },
  {
    id: 'mm-3',
    name: 'Hard-Boiled Eggs & Crisp Apple Slices',
    mealType: 'mid_morning',
    calories: 210,
    protein: 13,
    carbs: 20,
    fats: 9,
    dietary: ['non_vegetarian', 'eggetarian'],
    lowCalorie: true,
    description: 'Two pastured hard-boiled eggs with a sprinkle of smoked paprika alongside crisp Gala apple wedges.',
    ingredients: ['2 large hard-boiled eggs', '1 medium fresh apple', 'Paprika & black pepper'],
    prepTimeMins: 5,
  },

  // LUNCH
  {
    id: 'lu-1',
    name: 'Herb-Grilled Chicken Breast, Quinoa & Steamed Broccoli',
    mealType: 'lunch',
    calories: 520,
    protein: 48,
    carbs: 46,
    fats: 12,
    dietary: ['non_vegetarian'],
    highProtein: true,
    description: 'Juicy rosemary & lemon grilled chicken breast served over fluffy tri-color quinoa and garlic steamed broccoli florets.',
    ingredients: ['180g lean chicken breast', '140g cooked tri-color quinoa', '120g fresh steamed broccoli', '1 tsp olive oil', 'Fresh lemon & rosemary'],
    prepTimeMins: 20,
  },
  {
    id: 'lu-2',
    name: 'Spiced Paneer Tikka Bowl with Brown Basmati Rice & Dal',
    mealType: 'lunch',
    calories: 540,
    protein: 34,
    carbs: 58,
    fats: 18,
    dietary: ['vegetarian', 'eggetarian'],
    highProtein: true,
    description: 'Oven-roasted cottage cheese (paneer) marinated in Greek yogurt and spices, paired with yellow lentil dal and steamed brown basmati rice.',
    ingredients: ['120g low-fat paneer', '120g yellow moong dal cooked', '100g cooked brown basmati rice', 'Roasted capsicum & onions', 'Indian spices'],
    prepTimeMins: 25,
  },
  {
    id: 'lu-3',
    name: 'Pan-Seared Salmon Fillet with Sweet Potato Mash & Asparagus',
    mealType: 'lunch',
    calories: 550,
    protein: 42,
    carbs: 38,
    fats: 22,
    dietary: ['non_vegetarian'],
    highProtein: true,
    description: 'Wild Alaskan salmon seared with crispy skin, served with roasted mashed sweet potatoes and grilled tender asparagus spears.',
    ingredients: ['160g wild salmon fillet', '150g baked sweet potato', '100g grilled asparagus', '1 tsp extra virgin olive oil', 'Dill & lemon'],
    prepTimeMins: 20,
  },
  {
    id: 'lu-4',
    name: 'Tempeh & Lentil Power Bowl with Tahini Drizzle',
    mealType: 'lunch',
    calories: 490,
    protein: 32,
    carbs: 54,
    fats: 15,
    dietary: ['vegan', 'vegetarian'],
    highProtein: true,
    description: 'Marinated roasted organic tempeh cubes over warm brown lentils, steamed kale, roasted carrots, and 1 tbsp lemon tahini dressing.',
    ingredients: ['120g organic tempeh', '100g cooked brown lentils', '1 cup steamed kale', '1 tbsp raw sesame tahini', 'Lemon & sea salt'],
    prepTimeMins: 20,
  },

  // EVENING SNACK
  {
    id: 'es-1',
    name: 'Roasted Almonds & Pumpkin Seeds with Green Tea',
    mealType: 'evening_snack',
    calories: 180,
    protein: 7,
    carbs: 6,
    fats: 15,
    dietary: ['vegan', 'vegetarian', 'eggetarian', 'non_vegetarian'],
    lowCalorie: true,
    description: 'Lightly dry-roasted raw California almonds and pepitas paired with freshly brewed sencha green tea.',
    ingredients: ['20g raw almonds', '10g raw pumpkin seeds', 'Freshly brewed loose-leaf green tea'],
    prepTimeMins: 2,
  },
  {
    id: 'es-2',
    name: 'Cottage Cheese (Paneer/Curd) with Cucumber & Chaat Masala',
    mealType: 'evening_snack',
    calories: 160,
    protein: 18,
    carbs: 8,
    fats: 4,
    dietary: ['vegetarian', 'eggetarian'],
    highProtein: true,
    lowCalorie: true,
    description: 'Fresh light curd / cottage cheese cubed with crisp Persian cucumber discs and zesty roasted cumin masala.',
    ingredients: ['120g low-fat cottage cheese', '1 Persian cucumber', 'Pinch of roasted cumin & chaat masala'],
    prepTimeMins: 3,
  },
  {
    id: 'es-3',
    name: 'Whey Protein Isolate Shake with Unsweetened Cocoa',
    mealType: 'evening_snack',
    calories: 140,
    protein: 26,
    carbs: 3,
    fats: 1.5,
    dietary: ['vegetarian', 'eggetarian', 'non_vegetarian'],
    highProtein: true,
    lowCalorie: true,
    description: 'Post-workout rapid absorption whey protein isolate shaken with cold water and a dash of raw cacao powder.',
    ingredients: ['1 scoop (30g) chocolate whey isolate', '1 tsp dark unsweetened cacao', '300ml ice water'],
    prepTimeMins: 2,
  },

  // DINNER
  {
    id: 'di-1',
    name: 'Baked White Fish (Cod/Tilapia) with Quinoa & Steamed Zucchini',
    mealType: 'dinner',
    calories: 440,
    protein: 44,
    carbs: 38,
    fats: 9,
    dietary: ['non_vegetarian'],
    highProtein: true,
    lowCalorie: true,
    description: 'Tender oven-baked white fish fillet crusted with thyme, accompanied by fluffy quinoa and charred zucchini rounds.',
    ingredients: ['200g lean white fish fillet', '120g cooked quinoa', '150g roasted zucchini slices', '1 tsp olive oil', 'Lemon slice & fresh thyme'],
    prepTimeMins: 22,
  },
  {
    id: 'di-2',
    name: 'Tofu & Vegetable Green Curry with Cauliflower-Jasmine Rice',
    mealType: 'dinner',
    calories: 430,
    protein: 26,
    carbs: 42,
    fats: 16,
    dietary: ['vegan', 'vegetarian'],
    highProtein: true,
    description: 'Aromatic light coconut green curry loaded with pressed firm tofu, baby bok choy, snap peas, and 50/50 blend of jasmine and riced cauliflower.',
    ingredients: ['160g extra-firm tofu', '60ml light coconut milk', '1 cup mixed green vegetables', '80g cooked jasmine rice', '80g riced cauliflower'],
    prepTimeMins: 20,
  },
  {
    id: 'di-3',
    name: 'Grilled Lean Beef Sirloin with Roasted Baby Potatoes & Green Beans',
    mealType: 'dinner',
    calories: 520,
    protein: 46,
    carbs: 36,
    fats: 18,
    dietary: ['non_vegetarian'],
    highProtein: true,
    description: 'Grass-fed lean sirloin steak seared to medium, paired with rosemary roasted mini potatoes and tender green beans.',
    ingredients: ['170g trimmed grass-fed sirloin', '130g roasted baby potatoes', '100g steamed haricots verts', '1 tsp grass-fed butter'],
    prepTimeMins: 25,
  },
  {
    id: 'di-4',
    name: 'Spiced Black Lentil & Paneer Skillet with Steamed Spinach',
    mealType: 'dinner',
    calories: 470,
    protein: 31,
    carbs: 48,
    fats: 14,
    dietary: ['vegetarian', 'eggetarian'],
    highProtein: true,
    description: 'Simmered protein-rich black beluga lentils infused with ginger and garlic, tossed with low-fat paneer cubes and wilted spinach.',
    ingredients: ['100g cooked beluga black lentils', '90g light paneer cubes', '100g fresh spinach', 'Tomato puree, ginger & turmeric'],
    prepTimeMins: 20,
  },
];

export function getFilteredMeals(
  preference: DietaryPreference,
  options?: { highProtein?: boolean; lowCalorie?: boolean }
): Meal[] {
  return MEALS_DATABASE.filter(m => {
    // Dietary check
    const matchesDiet = m.dietary.includes(preference);
    if (!matchesDiet) return false;

    if (options?.highProtein && !m.highProtein) return false;
    if (options?.lowCalorie && !m.lowCalorie) return false;

    return true;
  });
}

export function generateDailyMealPlan(
  preference: DietaryPreference,
  targetCalories: number,
  targetProtein: number
): DailyMealPlan {
  const getMealFor = (type: Meal['mealType']): Meal => {
    const list = MEALS_DATABASE.filter(m => m.mealType === type && m.dietary.includes(preference));
    if (list.length > 0) {
      // Pick random or first
      return list[Math.floor(Math.random() * list.length)];
    }
    // Fallback if none match
    const fallback = MEALS_DATABASE.filter(m => m.mealType === type);
    return fallback[0] || MEALS_DATABASE[0];
  };

  const breakfast = getMealFor('breakfast');
  const mid_morning = getMealFor('mid_morning');
  const lunch = getMealFor('lunch');
  const evening_snack = getMealFor('evening_snack');
  const dinner = getMealFor('dinner');

  const totalCalories = breakfast.calories + mid_morning.calories + lunch.calories + evening_snack.calories + dinner.calories;
  const totalProtein = breakfast.protein + mid_morning.protein + lunch.protein + evening_snack.protein + dinner.protein;
  const totalCarbs = breakfast.carbs + mid_morning.carbs + lunch.carbs + evening_snack.carbs + dinner.carbs;
  const totalFats = breakfast.fats + mid_morning.fats + lunch.fats + evening_snack.fats + dinner.fats;

  return {
    id: `mealplan-${Date.now()}`,
    title: `Custom Balanced Plan (${preference.replace('_', ' ').toUpperCase()})`,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFats,
    meals: {
      breakfast,
      mid_morning,
      lunch,
      evening_snack,
      dinner,
    },
  };
}
