import React, { useState } from 'react';
import { ActiveTab, UserProfile } from '../types';
import { 
  Dumbbell, 
  LayoutDashboard, 
  Flame, 
  Utensils, 
  BookOpen, 
  Calculator, 
  TrendingUp, 
  Timer, 
  Trophy, 
  Lightbulb, 
  User, 
  PlusCircle, 
  Menu, 
  X,
  Bot,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserProfile;
  onOpenAssessment: () => void;
  onOpenLogModal: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onOpenChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAssessment,
  onOpenLogModal,
  onOpenProfile,
  onOpenAuth,
  onOpenChat,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Flame className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'workouts', label: 'Workouts', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'nutrition', label: 'Nutrition', icon: <Utensils className="w-4 h-4" /> },
    { id: 'exercises', label: 'Exercises', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'calculators', label: 'Calculators', icon: <Calculator className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'timer', label: 'Timer', icon: <Timer className="w-4 h-4" /> },
    { id: 'challenges', label: 'Challenges', icon: <Trophy className="w-4 h-4" /> },
    { id: 'tips', label: 'Tips', icon: <Lightbulb className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Bar adhering to Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#090A0F]/90 backdrop-blur-md border-b border-[#1A1F2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#CCFF00] to-[#99CC00] flex items-center justify-center text-black shadow-lg shadow-[#CCFF00]/20 group-hover:scale-105 transition-transform duration-150">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-mono">
              FIT<span className="text-[#CCFF00]">FORGE</span>
            </span>
          </button>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            {navLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap text-xs xl:text-sm font-medium ${
                    isActive
                      ? 'bg-[#181D29] text-[#CCFF00] border border-[#2B354C]'
                      : 'text-slate-400 hover:text-white hover:bg-[#121622]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Log today's progress quick button */}
            <button
              onClick={onOpenLogModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-[#CCFF00] hover:bg-[#b8e600] rounded-md transition-colors whitespace-nowrap shadow-sm shadow-[#CCFF00]/10"
              title="Log daily progress"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Day</span>
            </button>

            {/* Quick Timer Shortcut */}
            <button
              onClick={() => handleNavClick('timer')}
              className={`p-2 rounded-md transition-colors border ${
                activeTab === 'timer'
                  ? 'bg-[#181D29] text-[#CCFF00] border-[#2B354C]'
                  : 'bg-[#10131C] text-slate-400 border-[#1B202D] hover:text-white hover:bg-[#161B27]'
              }`}
              title="Workout Stopwatch & Rest Timer"
            >
              <Timer className="w-4 h-4" />
            </button>

            {/* AI Coach Trigger */}
            <button
              onClick={() => {
                if (onOpenChat) {
                  onOpenChat();
                } else {
                  const btn = document.querySelector('.chat-toggle') as HTMLElement;
                  if (btn) btn.click();
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#121622] hover:bg-[#181D29] border border-[#232A3B] hover:border-[#CCFF00]/50 text-slate-200 transition-colors group"
              title="Ask FitForge AI Coach (n8n)"
            >
              <Bot className="w-4 h-4 text-[#CCFF00] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-200 font-mono">
                Coach
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse"></span>
            </button>

            {/* User Profile / Account Switcher */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-md bg-[#121622] hover:bg-[#191F30] border border-[#1E2536] text-slate-200 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xs font-bold text-black uppercase">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden md:inline-block text-xs font-medium max-w-[100px] truncate text-slate-300">
                {currentUser.name}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-md hover:bg-[#151924]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#1A1F2C] bg-[#0C0F17] px-4 pt-3 pb-5 space-y-1">
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md text-left ${
                    activeTab === item.id
                      ? 'bg-[#181D29] text-[#CCFF00] font-semibold'
                      : 'text-slate-300 hover:bg-[#141822]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1C2230] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogModal();
                }}
                className="w-full py-2.5 px-3 rounded-md bg-[#CCFF00] text-black text-xs font-bold flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Log Today's Progress
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAssessment();
                  }}
                  className="flex-1 py-2 px-3 rounded-md bg-[#161B27] text-slate-200 text-xs font-medium border border-[#232B3E]"
                >
                  Assessment Form
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="flex-1 py-2 px-3 rounded-md bg-[#161B27] text-slate-200 text-xs font-medium border border-[#232B3E]"
                >
                  Account / Switch
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar for quick thumb navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090A0F]/95 backdrop-blur-md border-t border-[#1C2230] px-2 py-1 flex items-center justify-around">
        {[
          { id: 'home' as ActiveTab, label: 'Home', icon: <Flame className="w-4 h-4" /> },
          { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'workouts' as ActiveTab, label: 'Workouts', icon: <Dumbbell className="w-4 h-4" /> },
          { id: 'nutrition' as ActiveTab, label: 'Nutrition', icon: <Utensils className="w-4 h-4" /> },
          { id: 'progress' as ActiveTab, label: 'Progress', icon: <TrendingUp className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#CCFF00]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span className="mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
