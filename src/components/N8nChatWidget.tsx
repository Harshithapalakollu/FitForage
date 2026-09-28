import React, { useEffect, useState } from 'react';
import { Bot, MessageSquare, Sparkles, X, Send, RefreshCw, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

export const N8N_WEBHOOK_URL = 'https://harshithapalakollu.app.n8n.cloud/webhook/b6c77597-8385-4dc7-b76d-6eba839390c7/chat';

interface N8nChatWidgetProps {
  currentUser?: UserProfile;
}

export const N8nChatWidget: React.FC<N8nChatWidgetProps> = ({ currentUser }) => {
  const [officialLoaded, setOfficialLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: `Hey ${currentUser?.name ? currentUser.name.split(' ')[0] : 'Athlete'}! ⚡ I am your FitForge AI Coach powered by n8n. Ask me anything about your current workout split, exercise technique, meal prep macros, or recovery strategy!`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Initialize official @n8n/chat embed
  useEffect(() => {
    // Avoid double initialization
    if ((window as any).__fitforgeN8nChatInit) {
      setOfficialLoaded(true);
      return;
    }

    try {
      const script = document.createElement('script');
      script.type = 'module';
      script.id = 'n8n-chat-script';
      script.innerHTML = `
        import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
        try {
          createChat({
            webhookUrl: '${N8N_WEBHOOK_URL}',
            webhookConfig: {
              method: 'POST',
            },
            mode: 'window',
            showWelcomeScreen: false,
            defaultLanguage: 'en',
            initialMessages: [
              'Hey athlete! ⚡ Welcome to FitForge AI Coach.',
              'I can help you review your workout splits, recommend calorie & protein targets, check exercise form, or break through strength plateaus.'
            ],
            i18n: {
              en: {
                title: 'FitForge AI Coach',
                subtitle: 'n8n Automated Fitness Intelligence',
                footer: 'FitForge • Powered by n8n',
                getStarted: 'Start Coaching Session',
                inputPlaceholder: 'Ask about workouts, form, or nutrition...'
              }
            }
          });
          window.__fitforgeN8nChatInit = true;
        } catch (e) {
          console.warn('n8n createChat init warning:', e);
        }
      `;
      document.head.appendChild(script);
      setOfficialLoaded(true);
    } catch (err) {
      console.warn('Official @n8n/chat script tag could not be appended:', err);
    }
  }, []);

  // Quick suggestion prompts
  const suggestions = [
    'How do I calculate my daily protein target?',
    'What is the best 4-day split for muscle hypertrophy?',
    'How to prevent lower back pain during deadlifts?',
    'Suggest high-protein vegetarian snacks',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    const userMsgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = { sender: 'user' as const, text, time: userMsgTime };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsSending(true);
    setErrorStatus(null);

    // Profile context payload to pass to n8n webhook
    const payload = {
      action: 'sendMessage',
      chatInput: text,
      sessionId: `fitforge-user-${currentUser?.name?.toLowerCase().replace(/\s+/g, '-') || 'athlete'}`,
      metadata: {
        userName: currentUser?.name || 'Athlete',
        age: currentUser?.age || 26,
        gender: currentUser?.gender || 'male',
        weightKg: currentUser?.weightKg || 78,
        heightCm: currentUser?.heightCm || 178,
        goal: currentUser?.primaryGoal || 'build_muscle',
        fitnessLevel: currentUser?.fitnessLevel || 'intermediate',
        dietPreference: currentUser?.dietaryPreference || 'non_vegetarian',
      },
    };

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with HTTP ${response.status}`);
      }

      const raw = await response.text();
      let botResponse = '';

      try {
        const json = JSON.parse(raw);
        if (json.output) {
          botResponse = json.output;
        } else if (json.text) {
          botResponse = json.text;
        } else if (Array.isArray(json) && json[0]?.text) {
          botResponse = json[0].text;
        } else if (json.message) {
          botResponse = json.message;
        } else {
          botResponse = typeof json === 'string' ? json : JSON.stringify(json, null, 2);
        }
      } catch {
        botResponse = raw || 'Response received from n8n coach.';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      console.error('FitForge n8n webhook request error:', err);
      setErrorStatus(
        'Note: n8n returned a network notice. If your n8n workflow is in "Test/Draft" mode, ensure you click "Execute workflow" or activate the workflow in n8n Cloud!'
      );
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `I received your prompt ("${text}"). To connect live, make sure your n8n workflow at "${N8N_WEBHOOK_URL}" is set to Active (Production) in n8n.cloud!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating FitForge AI Coach Trigger Pill (visible if user wants quick in-app modal or official widget) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 pointer-events-auto">
        <button
          onClick={() => {
            // Check if official n8n toggle button is in DOM, click it or toggle in-app modal
            const n8nToggleBtn = document.querySelector('.chat-toggle') as HTMLElement;
            if (n8nToggleBtn) {
              n8nToggleBtn.click();
            } else {
              setModalOpen(!modalOpen);
            }
          }}
          className="group flex items-center gap-2.5 px-4 py-3 bg-[#0C101A] border border-[#2B354C] hover:border-[#CCFF00] rounded-full text-white shadow-2xl shadow-black/80 hover:shadow-[#CCFF00]/20 transition-all duration-200"
          title="Open FitForge AI Coach"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CCFF00] to-[#99CC00] text-black flex items-center justify-center font-bold shadow-md shadow-[#CCFF00]/30 group-hover:scale-110 transition-transform">
            <Bot className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="text-left pr-1">
            <div className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5 font-mono">
              AI COACH
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
            </div>
            <div className="text-[10px] text-slate-400">n8n Connected</div>
          </div>
        </button>
      </div>

      {/* In-App Direct Fallback Chat Modal (if user toggles or official script is pending) */}
      {modalOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-full max-w-[390px] bg-[#0C101A] border border-[#232A3B] rounded-2xl shadow-2xl shadow-black/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-[#090A0F] border-b border-[#1E2536] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#CCFF00] text-black flex items-center justify-center font-bold shadow-md shadow-[#CCFF00]/20">
                <Bot className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  FITFORGE AI COACH
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    n8n
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Personalized Workout & Nutrition AI</p>
              </div>
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-[#181D29] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Webhook Endpoint Banner */}
          <div className="px-4 py-2 bg-[#121622] border-b border-[#1A1F2C] text-[11px] text-slate-400 flex items-center justify-between">
            <span className="truncate max-w-[280px]">Endpoint: harshithapalakollu.app.n8n.cloud</span>
            <span className="text-[#CCFF00] font-mono text-[10px] shrink-0">Live</span>
          </div>

          {/* Messages Area */}
          <div className="p-4 flex-1 h-[360px] overflow-y-auto space-y-3.5 bg-[#090A0F]/60">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#CCFF00] text-black font-medium rounded-tr-none'
                      : 'bg-[#161B26] text-slate-100 border border-[#232A3B] rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-[#CCFF00] bg-[#161B26] border border-[#232A3B] px-3.5 py-2.5 rounded-2xl rounded-tl-none w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Coach is analyzing your workout & diet...</span>
              </div>
            )}

            {errorStatus && (
              <div className="p-2.5 bg-amber-950/40 border border-amber-800/50 rounded-xl text-amber-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>{errorStatus}</p>
              </div>
            )}
          </div>

          {/* Suggestion Prompts */}
          <div className="p-2.5 bg-[#0C101A] border-t border-[#1A1F2C] overflow-x-auto flex gap-1.5 no-scrollbar">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                disabled={isSending}
                className="text-[11px] px-2.5 py-1 rounded-full bg-[#161B26] text-slate-300 hover:text-[#CCFF00] hover:bg-[#1E2536] border border-[#232A3B] whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
              >
                <Sparkles className="w-2.5 h-2.5 text-[#CCFF00]" />
                {s}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#090A0F] border-t border-[#1E2536] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask coach about form, sets, or macros..."
              disabled={isSending}
              className="flex-1 bg-[#141824] border border-[#232A3B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#CCFF00] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="w-10 h-10 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] disabled:opacity-40 disabled:hover:bg-[#CCFF00] text-black flex items-center justify-center transition-transform active:scale-95 shrink-0 font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
