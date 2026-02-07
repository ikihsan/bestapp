'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles } from 'lucide-react';
import type { ChatMessage } from '@/types';

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm the bestapp.live AI assistant. I can help you find the best AI tools for any task. What are you looking for?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [open, messages, scrollToBottom]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.filter((m) => m.role !== 'system'),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I encountered an error. Please try again or browse our tools at bestapp.live.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    'Suggest tools for writing',
    'Best free AI image generators',
    'Compare coding assistants',
  ];

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center
                       rounded-full bg-brand-500 text-white shadow-float transition-shadow
                       hover:bg-brand-600 hover:shadow-xl focus:outline-none focus:ring-4
                       focus:ring-brand-500/30"
            aria-label="Open AI assistant chat"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] max-h-[80vh]
                       flex-col overflow-hidden rounded-2xl border border-border bg-surface
                       shadow-float sm:w-[400px]"
            role="dialog"
            aria-label="AI assistant chat"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-brand-500 px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-white" />
                <span className="font-heading font-semibold text-white">AI Assistant</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-white/80 transition-colors hover:bg-white/10
                           hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                      msg.role === 'user'
                        ? 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300'
                        : 'bg-surface-overlay text-on-surface-muted'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="h-3.5 w-3.5" />
                    ) : (
                      <Bot className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-body-sm ${
                      msg.role === 'user'
                        ? 'bg-brand-500 text-white'
                        : 'bg-surface-raised text-on-surface border border-border'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-surface-overlay text-on-surface-muted">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-2xl bg-surface-raised px-4 py-3 border border-border">
                    <Loader2 className="h-4 w-4 animate-spin text-on-surface-muted" />
                  </div>
                </div>
              )}

              {/* Quick actions for first interaction */}
              {messages.length === 1 && (
                <div className="space-y-2">
                  <p className="text-caption text-on-surface-muted">Try asking:</p>
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => {
                        setInput(action);
                        setTimeout(() => {
                          setInput(action);
                          sendMessage();
                        }, 0);
                      }}
                      className="block w-full rounded-lg border border-border bg-surface-raised px-3
                                 py-2 text-left text-body-sm text-on-surface transition-colors
                                 hover:border-brand-300 hover:text-brand-500"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about AI tools..."
                  className="flex-1 rounded-lg border border-border bg-surface-raised px-3 py-2.5
                             text-body-sm text-on-surface placeholder:text-on-surface-muted
                             focus:border-brand-500 focus:outline-none"
                  aria-label="Chat message input"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500
                             text-white transition-colors hover:bg-brand-600
                             disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1.5 text-center text-caption text-on-surface-muted">
                Powered by AI • No login required
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
