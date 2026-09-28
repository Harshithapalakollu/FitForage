import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  Challenge, 
  DailyMealPlan, 
  FitnessGoal, 
  PersonalRecord, 
  ProgressLog, 
  UserProfile, 
  WorkoutPlan 
} from './types';
import { 
  loadActiveMealPlan, 
  loadActiveWorkoutPlan, 
  loadChallenges, 
  loadPersonalRecords, 
  loadProgressLogs, 
  loadSavedTips, 
  loadUserProfile, 
  resetAllDataToDemo, 
  saveActiveMealPlan, 
  saveActiveWorkoutPlan, 
  saveChallenges, 
  savePersonalRecords, 
  saveProgressLogs, 
  saveSavedTips, 
  saveUserProfile 
} from './utils/storage';
import { generateWorkoutPlan } from './data/workoutTemplates';
import { generateDailyMealPlan } from './data/mealData';
import { calculateBMR, calculateMacros, calculateTargetCalories, calculateTDEE } from './utils/calculators';

// Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DashboardView } from './components/DashboardView';
import { WorkoutsView } from './components/WorkoutsView';
import { ExerciseLibraryView } from './components/ExerciseLibraryView';
import { NutritionView } from './components/NutritionView';
import { CalculatorsView } from './components/CalculatorsView';
import { ProgressView } from './components/ProgressView';
import { TimerView } from './components/TimerView';
import { ChallengesView } from './components/ChallengesView';
import { TipsView } from './components/TipsView';
import { AssessmentModal } from './components/AssessmentModal';
import { LogProgressModal } from './components/LogProgressModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => loadUserProfile());
  const [activePlan, setActivePlan] = useState<WorkoutPlan>(() => loadActiveWorkoutPlan(currentUser));
  const [activeMealPlan, setActiveMealPlan] = useState<DailyMealPlan>(() => loadActiveMealPlan(currentUser));
  const [logs, setLogs] = useState<ProgressLog[]>(() => loadProgressLogs());
  const [prs, setPRs] = useState<PersonalRecord[]>(() => loadPersonalRecords());
  const [challenges, setChallenges] = useState<Challenge[]>(() => loadChallenges());
  const [savedTips, setSavedTips] = useState<string[]>(() => loadSavedTips());

  // Modals state
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [liveWorkoutDayIndex, setLiveWorkoutDayIndex] = useState<number | null>(null);

  // Sync state helpers
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
    saveUserProfile(updatedProfile);

    // Regenerate active plan if goal or frequency shifted
    const newPlan = generateWorkoutPlan(
      updatedProfile.primaryGoal,
      updatedProfile.workoutDaysPerWeek,
      updatedProfile.fitnessLevel
    );
    setActivePlan(newPlan);
    saveActiveWorkoutPlan(newPlan);

    // Regenerate meal plan based on new target cals
    const bmr = calculateBMR(updatedProfile.weightKg, updatedProfile.heightCm, updatedProfile.age, updatedProfile.gender);
    const tdee = calculateTDEE(bmr, updatedProfile.activityLevel);
    const { targetCalories } = calculateTargetCalories(tdee, updatedProfile.primaryGoal);
    const macros = calculateMacros(targetCalories, updatedProfile.weightKg, updatedProfile.primaryGoal);
    const newMealPlan = generateDailyMealPlan(updatedProfile.dietaryPreference, targetCalories, macros.proteinGrams);
    setActiveMealPlan(newMealPlan);
    saveActiveMealPlan(newMealPlan);
  };

  const handleSavePlan = (plan: WorkoutPlan) => {
    setActivePlan(plan);
    saveActiveWorkoutPlan(plan);
  };

  const handleSaveMealPlan = (plan: DailyMealPlan) => {
    setActiveMealPlan(plan);
    saveActiveMealPlan(plan);
  };

  const handleSaveLogs = (newLogs: ProgressLog[]) => {
    setLogs(newLogs);
    saveProgressLogs(newLogs);
  };

  const handleSaveNewLog = (singleLog: ProgressLog) => {
    const updated = [...logs, singleLog];
    setLogs(updated);
    saveProgressLogs(updated);

    // If weight updated, sync profile weight
    if (singleLog.weightKg !== currentUser.weightKg) {
      const updatedUser = { ...currentUser, weightKg: singleLog.weightKg };
      setCurrentUser(updatedUser);
      saveUserProfile(updatedUser);
    }
  };

  const handleSavePRs = (newPRs: PersonalRecord[]) => {
    setPRs(newPRs);
    savePersonalRecords(newPRs);
  };

  const handleSaveChallenges = (newChallenges: Challenge[]) => {
    setChallenges(newChallenges);
    saveChallenges(newChallenges);
  };

  const handleToggleSaveTip = (tipId: string) => {
    const updated = savedTips.includes(tipId)
      ? savedTips.filter((id) => id !== tipId)
      : [...savedTips, tipId];
    setSavedTips(updated);
    saveSavedTips(updated);
  };

  const handleSelectGoalFromHero = (goal: FitnessGoal) => {
    const updated = { ...currentUser, primaryGoal: goal };
    handleSaveProfile(updated);
    setActiveTab('workouts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartActiveWorkout = (workoutDayIndex: number) => {
    setLiveWorkoutDayIndex(workoutDayIndex);
    setActiveTab('workouts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetData = () => {
    resetAllDataToDemo();
    setCurrentUser(loadUserProfile());
    setActivePlan(loadActiveWorkoutPlan(loadUserProfile()));
    setActiveMealPlan(loadActiveMealPlan(loadUserProfile()));
    setLogs(loadProgressLogs());
    setPRs(loadPersonalRecords());
    setChallenges(loadChallenges());
    setSavedTips(loadSavedTips());
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans selection:bg-[#CCFF00] selection:text-black">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAssessment={() => setIsAssessmentOpen(true)}
        onOpenLogModal={() => setIsLogModalOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 sm:pb-12">
        {activeTab === 'home' && (
          <HeroSection
            onBuildPlan={() => setIsAssessmentOpen(true)}
            onExploreWorkouts={() => {
              setActiveTab('workouts');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectGoal={handleSelectGoalFromHero}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            user={currentUser}
            activePlan={activePlan}
            activeMealPlan={activeMealPlan}
            logs={logs}
            prs={prs}
            setActiveTab={setActiveTab}
            onOpenAssessment={() => setIsAssessmentOpen(true)}
            onOpenLogModal={() => setIsLogModalOpen(true)}
            onStartActiveWorkout={handleStartActiveWorkout}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutsView
            currentPlan={activePlan}
            onSavePlan={handleSavePlan}
            onOpenExerciseLibrary={() => {
              setActiveTab('exercises');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            activeWorkoutDayIndex={liveWorkoutDayIndex}
            onCloseActiveWorkout={() => setLiveWorkoutDayIndex(null)}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionView
            user={currentUser}
            currentMealPlan={activeMealPlan}
            onSaveMealPlan={handleSaveMealPlan}
            onLogMealCalories={(cals) => {
              const latest = logs[logs.length - 1];
              if (latest) {
                const updated = logs.map((l, i) =>
                  i === logs.length - 1
                    ? { ...l, caloriesConsumed: l.caloriesConsumed + cals }
                    : l
                );
                handleSaveLogs(updated);
              }
            }}
          />
        )}

        {activeTab === 'exercises' && <ExerciseLibraryView />}

        {activeTab === 'calculators' && <CalculatorsView user={currentUser} />}

        {activeTab === 'progress' && (
          <ProgressView
            user={currentUser}
            logs={logs}
            prs={prs}
            onSaveLogs={handleSaveLogs}
            onSavePRs={handleSavePRs}
            onOpenLogModal={() => setIsLogModalOpen(true)}
          />
        )}

        {activeTab === 'timer' && <TimerView />}

        {activeTab === 'challenges' && (
          <ChallengesView
            challenges={challenges}
            onSaveChallenges={handleSaveChallenges}
          />
        )}

        {activeTab === 'tips' && (
          <TipsView
            savedTips={savedTips}
            onToggleSaveTip={handleToggleSaveTip}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Global Interactive Modals */}
      <AssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
      />

      <LogProgressModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        currentUser={currentUser}
        latestLog={logs[logs.length - 1]}
        onSaveLog={handleSaveNewLog}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSaveProfile}
        onCreateNewUser={handleSaveProfile}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onSaveUser={handleSaveProfile}
        onOpenAssessment={() => setIsAssessmentOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onResetData={handleResetData}
      />
    </div>
  );
}
