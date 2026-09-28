import React, { useState } from 'react';
import { UserProfile } from '../types';
import { DEMO_PROFILES } from '../data/mockProfiles';
import { X, Lock, Mail, User, Check, KeyRound, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onCreateNewUser: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot_password';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onCreateNewUser,
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleDemoSelect = (user: UserProfile) => {
    onSelectUser(user);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if matches demo profile email
    const match = DEMO_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (match) {
      onSelectUser(match);
    } else {
      // Create user session with standard defaults
      const newUser: UserProfile = {
        ...DEMO_PROFILES[0],
        id: `user-${Date.now()}`,
        name: email.split('@')[0] || 'Fitness Athlete',
        email: email,
      };
      onCreateNewUser(newUser);
    }
    onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      ...DEMO_PROFILES[0],
      id: `user-${Date.now()}`,
      name: name.trim() || 'New Athlete',
      email: email,
    };
    onCreateNewUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#0D1017] border border-[#20283C] rounded-2xl shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C2335] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#CCFF00] flex items-center justify-center text-black font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">
              {mode === 'login' ? 'Sign In to FitForge' : mode === 'signup' ? 'Create FitForge Account' : 'Reset Password'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Profile Switcher */}
        <div className="p-3.5 rounded-xl bg-[#121622] border border-[#1E2536] space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
            Instant Demo Account Switcher:
          </span>
          <div className="space-y-1.5">
            {DEMO_PROFILES.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleDemoSelect(profile)}
                className={`w-full p-2 rounded-lg flex items-center justify-between text-left text-xs transition-colors ${
                  currentUser.id === profile.id
                    ? 'bg-[#182130] text-[#CCFF00] border border-[#2D3C58]'
                    : 'bg-[#141824] text-slate-300 hover:text-white border border-[#1E2536]'
                }`}
              >
                <div>
                  <span className="font-bold block">{profile.name}</span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    {profile.fitnessLevel} · {profile.primaryGoal.replace('_', ' ')}
                  </span>
                </div>
                {currentUser.id === profile.id && <Check className="w-4 h-4 text-[#CCFF00]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Forms */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rivera@fitforge.app"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono text-slate-300 uppercase">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot_password')}
                  className="text-[11px] text-[#CCFF00] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#CCFF00] text-black font-bold text-xs hover:bg-[#b8e600] transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#CCFF00]/15"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#CCFF00] font-semibold hover:underline"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@fitforge.app"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#CCFF00] text-black font-bold text-xs hover:bg-[#b8e600] transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#CCFF00]/15"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#CCFF00] font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {mode === 'forgot_password' && (
          <div className="space-y-4">
            {forgotSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-center space-y-2">
                <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Reset Link Sent</h4>
                <p className="text-xs text-slate-300">
                  We've simulated sending a password reset verification link to your registered email.
                </p>
                <button
                  onClick={() => {
                    setForgotSubmitted(false);
                    setMode('login');
                  }}
                  className="mt-2 text-xs font-semibold text-[#CCFF00] underline"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSubmitted(true);
                }}
                className="space-y-4"
              >
                <p className="text-xs text-slate-300">
                  Enter your email address and we will dispatch a secure recovery token to restore your access.
                </p>
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@fitforge.app"
                    className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-[#222B3D] text-white text-xs focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#CCFF00] text-black font-bold text-xs hover:bg-[#b8e600] transition-colors"
                >
                  Send Recovery Link
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
