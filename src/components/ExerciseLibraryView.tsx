import React, { useState, useMemo } from 'react';
import { EXERCISES_DATABASE } from '../data/exercisesData';
import { Exercise, ExerciseDifficulty, ExerciseType, MuscleGroup } from '../types';
import { Search, Filter, Dumbbell, AlertTriangle, ArrowRight, BookOpen, X, ChevronDown } from 'lucide-react';

export const ExerciseLibraryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ExerciseDifficulty | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ExerciseType | 'all'>('all');
  const [modalExercise, setModalExercise] = useState<Exercise | null>(null);

  const filteredExercises = useMemo(() => {
    return EXERCISES_DATABASE.filter((ex) => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ex.name.toLowerCase().includes(q);
        const matchesMuscle = ex.targetMuscle.toLowerCase().includes(q);
        const matchesEq = ex.equipment.toLowerCase().includes(q);
        if (!matchesName && !matchesMuscle && !matchesEq) return false;
      }

      // Muscle
      if (selectedMuscle !== 'all' && ex.targetMuscle !== selectedMuscle) return false;

      // Equipment
      if (selectedEquipment !== 'all' && ex.equipment !== selectedEquipment) return false;

      // Difficulty
      if (selectedDifficulty !== 'all' && ex.difficulty !== selectedDifficulty) return false;

      // Type
      if (selectedType !== 'all' && ex.type !== selectedType) return false;

      return true;
    });
  }, [searchQuery, selectedMuscle, selectedEquipment, selectedDifficulty, selectedType]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMuscle('all');
    setSelectedEquipment('all');
    setSelectedDifficulty('all');
    setSelectedType('all');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1A2130] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#CCFF00] uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Encyclopedia of Biomechanics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Exercise Library</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore {EXERCISES_DATABASE.length} compound and isolation movements with execution cues, error warnings, and movement substitutes.
          </p>
        </div>

        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-slate-400 hover:text-white underline self-start md:self-auto"
        >
          Reset All Filters
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-xl bg-[#10141E] border border-[#1D2436] space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises by name, muscle group, or equipment (e.g. Bench, Squat, Dumbbell)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-sm focus:outline-none focus:border-[#CCFF00]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Muscle Group */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Muscle Group</label>
            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value as MuscleGroup | 'all')}
              className="w-full px-2.5 py-1.5 rounded-md bg-[#141824] border border-[#222B3D] text-white text-xs focus:outline-none focus:border-[#CCFF00]"
            >
              <option value="all">All Muscles</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="shoulders">Shoulders</option>
              <option value="biceps">Biceps</option>
              <option value="triceps">Triceps</option>
              <option value="legs">Legs</option>
              <option value="core">Core / Abs</option>
              <option value="cardio">Cardio</option>
            </select>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Equipment</label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-md bg-[#141824] border border-[#222B3D] text-white text-xs focus:outline-none focus:border-[#CCFF00]"
            >
              <option value="all">All Equipment</option>
              <option value="barbell">Barbell</option>
              <option value="dumbbell">Dumbbell</option>
              <option value="machine">Machine</option>
              <option value="cable">Cable</option>
              <option value="bodyweight">Bodyweight</option>
              <option value="cardio">Cardio Equipment</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as ExerciseDifficulty | 'all')}
              className="w-full px-2.5 py-1.5 rounded-md bg-[#141824] border border-[#222B3D] text-white text-xs focus:outline-none focus:border-[#CCFF00]"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Exercise Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ExerciseType | 'all')}
              className="w-full px-2.5 py-1.5 rounded-md bg-[#141824] border border-[#222B3D] text-white text-xs focus:outline-none focus:border-[#CCFF00]"
            >
              <option value="all">All Types</option>
              <option value="compound">Compound (Multi-Joint)</option>
              <option value="isolation">Isolation (Single-Joint)</option>
              <option value="isometric">Isometric (Static Hold)</option>
              <option value="cardio">Cardio / Conditioning</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exercises Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Showing {filteredExercises.length} movements</span>
        </div>

        {filteredExercises.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[#10131D] border border-[#1C2333]">
            <Dumbbell className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-white font-bold text-sm">No exercises matched your filters</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the muscle group or search term.</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 text-xs font-bold text-black bg-[#CCFF00] rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((ex) => (
              <div
                key={ex.id}
                onClick={() => setModalExercise(ex)}
                className="group p-5 rounded-xl bg-[#10141F] hover:bg-[#151A29] border border-[#1C2436] hover:border-[#2C3852] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                    <span className="text-[#CCFF00] font-bold uppercase">{ex.targetMuscle}</span>
                    <span className="text-slate-400 capitalize">{ex.equipment}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#CCFF00] transition-colors">
                    {ex.name}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {ex.instructions[0]}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-[#181E2E] border border-[#232B3E]">
                      {ex.sets} sets × {ex.reps}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#181E2E] border border-[#232B3E] capitalize">
                      {ex.difficulty}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#192030] flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-200">
                  <span>View execution guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Exercise Modal */}
      {modalExercise && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0D1017] border border-[#20283C] rounded-2xl shadow-2xl p-6 space-y-6">
            
            <div className="flex items-start justify-between border-b border-[#1C2335] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#CCFF00] uppercase">
                  <span>{modalExercise.targetMuscle}</span>
                  <span aria-hidden="true">·</span>
                  <span>{modalExercise.equipment}</span>
                  <span aria-hidden="true">·</span>
                  <span>{modalExercise.type}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">{modalExercise.name}</h2>
              </div>
              <button
                onClick={() => setModalExercise(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A202E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target & Prescription Box */}
            <div className="grid grid-cols-3 gap-2.5 text-xs font-mono text-center">
              <div className="p-3 rounded-lg bg-[#121622] border border-[#1D2536]">
                <span className="text-slate-400 block text-[10px]">RECOMMENDED SETS</span>
                <span className="text-sm font-bold text-white">{modalExercise.sets} Sets</span>
              </div>
              <div className="p-3 rounded-lg bg-[#121622] border border-[#1D2536]">
                <span className="text-slate-400 block text-[10px]">REPETITIONS</span>
                <span className="text-sm font-bold text-[#CCFF00]">{modalExercise.reps}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#121622] border border-[#1D2536]">
                <span className="text-slate-400 block text-[10px]">REST PERIOD</span>
                <span className="text-sm font-bold text-white">{modalExercise.restSeconds} Seconds</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Step-by-Step Biomechanical Instructions:
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
                {modalExercise.instructions.map((step, idx) => (
                  <li key={idx} className="pl-1">{step}</li>
                ))}
              </ol>
            </div>

            {/* Common Mistakes */}
            <div className="p-3.5 rounded-xl bg-[#171212] border border-[#381F1F] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Common Mistakes to Avoid</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                {modalExercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
                ))}
              </ul>
            </div>

            {/* Alternative Exercise */}
            <div className="p-3.5 rounded-xl bg-[#111622] border border-[#1C263A] text-xs">
              <span className="text-[10px] font-mono text-[#CCFF00] block uppercase tracking-wider">
                Recommended Exercise Alternative:
              </span>
              <p className="text-slate-200 font-semibold mt-0.5">{modalExercise.alternativeExercise}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalExercise(null)}
                className="px-5 py-2 rounded-lg bg-[#181E2E] hover:bg-[#202738] text-white text-xs font-semibold"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
