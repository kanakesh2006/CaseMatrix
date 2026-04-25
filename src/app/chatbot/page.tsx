"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Scale, User, Bot, Loader2, Info } from 'lucide-react';

type ChatMessage = { id: string; from: 'user' | 'bot'; text: string };

export default function ChatbotPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'welcome',
    from: 'bot',
    text: "Hello. I am the CaseMatrix Legal AI. I can assist you with understanding legal terminologies, navigating the platform, or clarifying procedural queries. How may I assist you today?"
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => scrollToBottom(), [messages, isLoading]);

  // Simple markdown bold parser
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-zinc-900">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), from: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create context of last few messages to send
      const historyToSend = [...messages, userMessage].map(m => ({ from: m.from, text: m.text }));

      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyToSend })
      });

      if (!res.ok) throw new Error('Network error');
      
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), from: 'bot', text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        from: 'bot', 
        text: 'I encountered an error while trying to connect to the legal knowledge base. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-responsive py-8 max-w-4xl h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Legal AI Assistant</h1>
            <p className="text-sm font-medium text-zinc-500 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Powered by Groq
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
          <Info className="h-4 w-4" />
          AI guidance is not legal advice.
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden bg-white rounded-2xl shadow-sm border border-zinc-200 flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex items-start gap-4 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`flex shrink-0 h-10 w-10 items-center justify-center rounded-full shadow-sm ${
                  msg.from === 'user' ? 'bg-zinc-100 text-zinc-600' : 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
                }`}>
                  {msg.from === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-sm ${
                  msg.from === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-zinc-50 border border-zinc-100 text-zinc-700 rounded-tl-sm whitespace-pre-wrap leading-relaxed'
                }`}>
                  {msg.from === 'user' ? msg.text : renderFormattedText(msg.text)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-4"
            >
              <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-zinc-50 border border-zinc-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-sm text-zinc-500 font-medium">Analyzing legal contexts...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-zinc-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a legal procedural question..."
              className="w-full rounded-full bg-zinc-100 px-6 py-4 pr-16 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500 focus:shadow-md"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-3 text-xs text-zinc-400">
            CaseMatrix AI can make mistakes. Always verify critical information.
          </div>
        </div>
      </div>
    </div>
  );
}
