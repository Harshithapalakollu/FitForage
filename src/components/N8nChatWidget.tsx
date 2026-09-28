import React, { useEffect } from 'react';

export const N8N_WEBHOOK_URL = 'https://harshithapalakollu.app.n8n.cloud/webhook/b6c77597-8385-4dc7-b76d-6eba839390c7/chat';

export const N8nChatWidget: React.FC = () => {
  useEffect(() => {
    // Prevent multiple initializations across re-renders
    if (typeof window === 'undefined') return;
    if ((window as any).__fitforgeN8nChatInit || document.getElementById('n8n-chat-script')) {
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
              'Hey athlete! ⚡ Welcome to your FitForge AI Coach.',
              'Ask me anything about your workout plan, form cues, daily calorie/macro targets, or recovery!'
            ],
            i18n: {
              en: {
                title: 'FitForge AI Coach',
                subtitle: 'Automated Fitness Intelligence',
                footer: 'FitForge • Powered by n8n',
                getStarted: 'Start Coaching Session',
                inputPlaceholder: 'Ask about workouts, form, or nutrition...'
              }
            }
          });
          window.__fitforgeN8nChatInit = true;
        } catch (err) {
          console.warn('n8n createChat initialization note:', err);
        }
      `;
      document.head.appendChild(script);
    } catch (err) {
      console.warn('Failed to append n8n chat script:', err);
    }
  }, []);

  // Returns null so only the official n8n chat widget exists in the DOM
  return null;
};
