import React, { useState, useEffect, useRef } from 'react';
import { soundEffects } from '../utils/soundEffects';
import { 
  Timer as TimerIcon, 
  Play, 
  Pause, 
  RotateCcw, 
  Flag, 
  Clock, 
  Zap, 
  Volume2, 
  Sparkles,
  Layers
} from 'lucide-react';

type TimerMode = 'stopwatch' | 'countdown' | 'rest' | 'tabata';

export const TimerView: React.FC = () => {
  const [activeMode, setActiveMode] = useState<TimerMode>('rest');

  // 1. STOPWATCH STATE
  const [swTimeMs, setSwTimeMs] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [swLaps, setSwLaps] = useState<number[]>([]);

  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      if (swRunning) {
        const delta = now - lastTime;
        setSwTimeMs((prev) => prev + delta);
        lastTime = now;
        animFrame = requestAnimationFrame(loop);
      }
    };

    if (swRunning) {
      lastTime = performance.now();
      animFrame = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [swRunning]);

  const handleSwLap = () => {
    setSwLaps((prev) => [swTimeMs, ...prev]);
  };

  const handleSwReset = () => {
    setSwRunning(false);
    setSwTimeMs(0);
    setSwLaps([]);
  };

  // 2. COUNTDOWN TIMER STATE
  const [cdInitialSeconds, setCdInitialSeconds] = useState(300); // 5 mins
  const [cdSecondsLeft, setCdSecondsLeft] = useState(300);
  const [cdRunning, setCdRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cdRunning && cdSecondsLeft > 0) {
      interval = setInterval(() => {
        setCdSecondsLeft((prev) => {
          if (prev <= 1) {
            soundEffects.chime();
            setCdRunning(false);
            return 0;
          }
          if (prev <= 4) {
            soundEffects.beep(750, 100);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cdRunning, cdSecondsLeft]);

  // 3. REST TIMER STATE (Quick Presets: 30s, 60s, 90s, 120s, 180s)
  const [restDuration, setRestDuration] = useState(60);
  const [restSecondsLeft, setRestSecondsLeft] = useState(60);
  const [restRunning, setRestRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restRunning && restSecondsLeft > 0) {
      interval = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 1) {
            soundEffects.bell();
            setRestRunning(false);
            return 0;
          }
          if (prev <= 4) {
            soundEffects.beep(880, 120);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restRunning, restSecondsLeft]);

  const handleStartRestPreset = (seconds: number) => {
    setRestDuration(seconds);
    setRestSecondsLeft(seconds);
    setRestRunning(true);
    soundEffects.beep(660, 100);
  };

  // 4. TABATA / HIIT INTERVAL TIMER STATE
  const [tabataWorkSec, setTabataWorkSec] = useState(20);
  const [tabataRestSec, setTabataRestSec] = useState(10);
  const [tabataTotalSets, setTabataTotalSets] = useState(8);
  const [tabataCurrentSet, setTabataCurrentSet] = useState(1);
  const [tabataPhase, setTabataPhase] = useState<'work' | 'rest'>('work');
  const [tabataSecLeft, setTabataSecLeft] = useState(20);
  const [tabataRunning, setTabataRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (tabataRunning) {
      interval = setInterval(() => {
        setTabataSecLeft((prev) => {
          if (prev <= 1) {
            if (tabataPhase === 'work') {
              // Switch to rest
              soundEffects.bell();
              setTabataPhase('rest');
              return tabataRestSec;
            } else {
              // Rest ended, advance set or finish
              if (tabataCurrentSet >= tabataTotalSets) {
                soundEffects.chime();
                setTabataRunning(false);
                return 0;
              } else {
                soundEffects.beep(880, 200);
                setTabataCurrentSet((s) => s + 1);
                setTabataPhase('work');
                return tabataWorkSec;
              }
            }
          }
          if (prev <= 4) {
            soundEffects.beep(600, 80);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tabataRunning, tabataPhase, tabataCurrentSet, tabataTotalSets, tabataWorkSec, tabataRestSec]);

  const handleResetTabata = () => {
    setTabataRunning(false);
    setTabataCurrentSet(1);
    setTabataPhase('work');
    setTabataSecLeft(tabataWorkSec);
  };

  // Formatter utilities
  const formatMs = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-[#1A2130] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#CCFF00] uppercase tracking-wider mb-1">
            <TimerIcon className="w-3.5 h-3.5" />
            <span>Industrial Chronometer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Gym & Workout Timer</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            High-contrast digital timers with audio synthesize chimes for sets, intervals, and rest discipline.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-[#121A16] border border-[#1E2E25] px-3 py-1.5 rounded-lg self-start sm:self-auto">
          <Volume2 className="w-4 h-4" />
          <span>Audio Synthesizer Active</span>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-2 p-1.5 bg-[#10131E] border border-[#1C2335] rounded-xl max-w-xl">
        {[
          { id: 'rest' as TimerMode, label: 'Rest Timer', icon: <Clock className="w-4 h-4" /> },
          { id: 'stopwatch' as TimerMode, label: 'Stopwatch', icon: <TimerIcon className="w-4 h-4" /> },
          { id: 'countdown' as TimerMode, label: 'Countdown', icon: <RotateCcw className="w-4 h-4" /> },
          { id: 'tabata' as TimerMode, label: 'Tabata / HIIT', icon: <Zap className="w-4 h-4" /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMode(item.id)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeMode === item.id
                ? 'bg-[#182030] text-[#CCFF00] border border-[#2D3954] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* 1. REST TIMER VIEW */}
      {activeMode === 'rest' && (
        <div className="p-6 sm:p-10 rounded-2xl bg-[#0F131D] border border-[#1E2538] max-w-2xl mx-auto text-center space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
              REST INTERVAL CONTROLLER
            </span>
            <div className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tight text-white tabular-nums">
              {formatSeconds(restSecondsLeft)}
            </div>
            {restSecondsLeft === 0 && (
              <span className="text-sm font-mono font-bold text-emerald-400 mt-2 block animate-pulse">
                REST OVER — BEGIN NEXT SET!
              </span>
            )}
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">
              Quick Set Presets (Single Tap Launch):
            </span>
            <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
              {[30, 60, 90, 120, 180].map((sec) => (
                <button
                  key={sec}
                  onClick={() => handleStartRestPreset(sec)}
                  className={`py-2 rounded-lg font-mono text-xs font-bold transition-all border ${
                    restDuration === sec && restRunning
                      ? 'bg-[#CCFF00] text-black border-[#CCFF00] shadow-md shadow-[#CCFF00]/20'
                      : 'bg-[#141824] text-slate-300 border-[#222B3D] hover:border-slate-500'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                if (!restRunning) soundEffects.beep(750, 100);
                setRestRunning(!restRunning);
              }}
              className="px-8 py-3 rounded-xl bg-[#CCFF00] text-black font-extrabold text-sm hover:bg-[#b8e600] transition-colors flex items-center gap-2 shadow-lg shadow-[#CCFF00]/20"
            >
              {restRunning ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black" />}
              <span>{restRunning ? 'PAUSE' : 'START REST'}</span>
            </button>

            <button
              onClick={() => {
                setRestRunning(false);
                setRestSecondsLeft(restDuration);
              }}
              className="p-3 rounded-xl bg-[#161C2A] text-slate-300 hover:text-white border border-[#242D40] transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. STOPWATCH VIEW */}
      {activeMode === 'stopwatch' && (
        <div className="p-6 sm:p-10 rounded-2xl bg-[#0F131D] border border-[#1E2538] max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
              PRECISION STOPWATCH
            </span>
            <div className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight text-white tabular-nums">
              {formatMs(swTimeMs)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                if (!swRunning) soundEffects.beep(880, 100);
                setSwRunning(!swRunning);
              }}
              className="px-8 py-3 rounded-xl bg-[#CCFF00] text-black font-extrabold text-sm hover:bg-[#b8e600] transition-colors flex items-center gap-2 shadow-lg shadow-[#CCFF00]/20"
            >
              {swRunning ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black" />}
              <span>{swRunning ? 'PAUSE' : 'START'}</span>
            </button>

            <button
              onClick={handleSwLap}
              disabled={!swRunning}
              className="px-5 py-3 rounded-xl bg-[#161C2A] text-slate-300 hover:text-white disabled:opacity-40 border border-[#242D40] transition-colors flex items-center gap-1.5 font-bold text-xs"
            >
              <Flag className="w-4 h-4" />
              <span>LAP</span>
            </button>

            <button
              onClick={handleSwReset}
              className="p-3 rounded-xl bg-[#161C2A] text-slate-300 hover:text-white border border-[#242D40] transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Laps List */}
          {swLaps.length > 0 && (
            <div className="pt-4 border-t border-[#1C2335] space-y-2">
              <span className="text-xs font-mono text-slate-400 block uppercase">Recorded Split Laps:</span>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2">
                {swLaps.map((lapMs, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#141824] border border-[#1E2536] flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-slate-400">Lap #{swLaps.length - idx}</span>
                    <span className="font-bold text-white tabular-nums">{formatMs(lapMs)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. COUNTDOWN TIMER VIEW */}
      {activeMode === 'countdown' && (
        <div className="p-6 sm:p-10 rounded-2xl bg-[#0F131D] border border-[#1E2538] max-w-2xl mx-auto text-center space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
              COUNTDOWN CHRONO
            </span>
            <div className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tight text-white tabular-nums">
              {formatSeconds(cdSecondsLeft)}
            </div>
          </div>

          {/* Time Config Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">
              Target Duration:
            </span>
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
              {[
                { label: '2 Mins', sec: 120 },
                { label: '5 Mins', sec: 300 },
                { label: '10 Mins', sec: 600 },
                { label: '15 Mins', sec: 900 },
              ].map((item) => (
                <button
                  key={item.sec}
                  onClick={() => {
                    setCdRunning(false);
                    setCdInitialSeconds(item.sec);
                    setCdSecondsLeft(item.sec);
                  }}
                  className={`py-2 rounded-lg font-mono text-xs font-bold transition-all border ${
                    cdInitialSeconds === item.sec
                      ? 'bg-[#1E273A] text-[#CCFF00] border-[#3B4C72]'
                      : 'bg-[#141824] text-slate-300 border-[#222B3D] hover:border-slate-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                if (!cdRunning) soundEffects.beep(880, 100);
                setCdRunning(!cdRunning);
              }}
              className="px-8 py-3 rounded-xl bg-[#CCFF00] text-black font-extrabold text-sm hover:bg-[#b8e600] transition-colors flex items-center gap-2 shadow-lg shadow-[#CCFF00]/20"
            >
              {cdRunning ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black" />}
              <span>{cdRunning ? 'PAUSE' : 'START COUNTDOWN'}</span>
            </button>

            <button
              onClick={() => {
                setCdRunning(false);
                setCdSecondsLeft(cdInitialSeconds);
              }}
              className="p-3 rounded-xl bg-[#161C2A] text-slate-300 hover:text-white border border-[#242D40] transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. TABATA / HIIT TIMER VIEW */}
      {activeMode === 'tabata' && (
        <div className={`p-6 sm:p-10 rounded-2xl border max-w-2xl mx-auto text-center space-y-8 transition-colors ${
          tabataRunning
            ? tabataPhase === 'work'
              ? 'bg-[#151D14] border-emerald-500/50'
              : 'bg-[#1F1710] border-amber-500/50'
            : 'bg-[#0F131D] border-[#1E2538]'
        }`}>
          <div>
            <div className="flex items-center justify-center gap-2 mb-2 font-mono">
              <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                tabataPhase === 'work' ? 'bg-emerald-500 text-black' : 'bg-amber-500 text-black'
              }`}>
                {tabataPhase === 'work' ? 'WORK PHASE 🔥' : 'REST PHASE ❄️'}
              </span>
              <span className="text-xs text-slate-400">
                SET {tabataCurrentSet} OF {tabataTotalSets}
              </span>
            </div>

            <div className="text-7xl sm:text-8xl font-black font-mono tracking-tight text-white tabular-nums">
              {tabataSecLeft}s
            </div>
          </div>

          {/* Tabata Settings (When stopped) */}
          {!tabataRunning && (
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#141824] border border-[#20283A]">
                <span className="text-slate-400 block text-[10px] mb-1">WORK (SEC)</span>
                <input
                  type="number"
                  value={tabataWorkSec}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setTabataWorkSec(v);
                    setTabataSecLeft(v);
                  }}
                  className="w-full text-center bg-transparent font-bold text-white text-base focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#141824] border border-[#20283A]">
                <span className="text-slate-400 block text-[10px] mb-1">REST (SEC)</span>
                <input
                  type="number"
                  value={tabataRestSec}
                  onChange={(e) => setTabataRestSec(Number(e.target.value))}
                  className="w-full text-center bg-transparent font-bold text-white text-base focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#141824] border border-[#20283A]">
                <span className="text-slate-400 block text-[10px] mb-1">ROUNDS</span>
                <input
                  type="number"
                  value={tabataTotalSets}
                  onChange={(e) => setTabataTotalSets(Number(e.target.value))}
                  className="w-full text-center bg-transparent font-bold text-white text-base focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                if (!tabataRunning) soundEffects.bell();
                setTabataRunning(!tabataRunning);
              }}
              className="px-8 py-3 rounded-xl bg-[#CCFF00] text-black font-extrabold text-sm hover:bg-[#b8e600] transition-colors flex items-center gap-2 shadow-lg shadow-[#CCFF00]/20"
            >
              {tabataRunning ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black" />}
              <span>{tabataRunning ? 'PAUSE INTERVAL' : 'START TABATA'}</span>
            </button>

            <button
              onClick={handleResetTabata}
              className="p-3 rounded-xl bg-[#161C2A] text-slate-300 hover:text-white border border-[#242D40] transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
