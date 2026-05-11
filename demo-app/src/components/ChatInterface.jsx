"use client";

import React, { useState } from 'react';
import { Sliders, ChevronDown, ChevronUp, Loader2, Send, MessageSquare, Database, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes
 */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ChatInterface() {
  const [query, setQuery] = useState("");
  const [k, setK] = useState(10);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage.content, k })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch response');
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer,
        chunks: data.chunks 
      }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen flex flex-col font-sans selection:bg-blue-500/30">
      {/* Header Section */}
      <header className="mb-10 text-center relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4"
        >
          <Database className="text-blue-400" size={32} />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500 tracking-tight mb-3">
          Bhitt.AI
        </h1>
        <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
          Semantic Search Engine powered by Gemini & Vector Retrieval
        </p>
      </header>

      {/* Configuration / Tuning K */}
      <section className="mb-8">
        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-3 text-zinc-300">
            <div className="p-2 rounded-lg bg-zinc-800">
              <Sliders size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-zinc-500">Retrieval Parameter</p>
              <p className="text-xs text-zinc-400">Tune the number of context chunks (K)</p>
            </div>
          </div>
          
          <div className="flex-1 flex items-center gap-6">
            <input 
              type="range" 
              min="1" 
              max="25" 
              value={k} 
              onChange={(e) => setK(parseInt(e.target.value))}
              className="flex-1 h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
            />
            <div className="px-4 py-2 bg-zinc-800 rounded-xl border border-zinc-700 min-w-[60px] text-center">
              <span className="text-emerald-400 font-mono font-bold">{k}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Flow Container */}
      <div className="flex-1 flex flex-col gap-6 mb-8 overflow-y-auto max-h-[60vh] px-2 custom-scrollbar">
        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="flex flex-col items-center justify-center flex-1 py-12 text-zinc-500 space-y-4"
          >
            <MessageSquare size={64} strokeWidth={1} />
            <p className="text-xl font-medium">Ready for your query...</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <span className="px-3 py-1 rounded-full border border-zinc-800 italic">&quot;What is the core message?&quot;</span>
              <span className="px-3 py-1 rounded-full border border-zinc-800 italic">&quot;Explain chapter 2 context&quot;</span>
            </div>
          </motion.div>
        )}
        
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex flex-col gap-3",
              msg.role === 'user' ? "items-end" : "items-start"
            )}
          >
            <div className={cn(
              "max-w-[90%] md:max-w-[75%] p-5 rounded-3xl shadow-2xl relative",
              msg.role === 'user' 
                ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none" 
                : "bg-zinc-900 text-zinc-100 rounded-tl-none border border-zinc-800/80"
            )}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              
              {msg.role === 'user' && (
                <div className="absolute -top-6 right-0 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">You</div>
              )}
              {msg.role === 'assistant' && (
                <div className="absolute -top-6 left-0 text-[10px] uppercase font-bold text-blue-400 tracking-widest">Bhitt Engine</div>
              )}
            </div>

            {/* Source Accordion - Embedded below Assistant answer */}
            {msg.role === 'assistant' && msg.chunks && (
              <SourceAccordion chunks={msg.chunks} />
            )}
          </motion.div>
        ))}

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/20 border border-zinc-800/40 w-fit"
          >
            <Loader2 className="animate-spin text-blue-400" size={24} />
            <span className="text-sm font-medium text-zinc-400 animate-pulse">Analyzing context & generating response...</span>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-start gap-3 shadow-lg"
          >
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-bold text-sm">Engine Error</p>
              <p className="text-xs opacity-80">{error}</p>
            </div>
          </motion.div>
        )}
        
        {/* Scroll anchor */}
        <div className="h-4" />
      </div>

      {/* Input Form */}
      <footer className="sticky bottom-4">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-[2rem] p-2 flex items-center gap-2">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your query (e.g., Explain the concept of patience...)"
              className="flex-1 bg-transparent border-none py-3 px-6 focus:ring-0 focus:outline-none text-zinc-100 placeholder:text-zinc-600 text-lg"
            />
            <button 
              type="submit"
              disabled={isLoading || !query.trim()}
              className="p-4 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-900 disabled:text-zinc-700 rounded-full transition-all transform active:scale-95 shadow-xl text-white flex items-center justify-center"
            >
              <Send size={22} />
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
          Powered by Google Gemini Flash 1.5
        </p>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}

/**
 * Sources Accordion Component
 */
function SourceAccordion({ chunks }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-[90%] md:max-w-[75%] ml-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all duration-300",
          isOpen 
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
            : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700"
        )}
      >
        <Database size={10} />
        Context Sources ({chunks.length})
        {isOpen ? <ChevronUp size={12} className="ml-1" /> : <ChevronDown size={12} className="ml-1" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid gap-3">
              {chunks.map((chunk, i) => (
                <motion.div 
                  key={i} 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/50 backdrop-blur-sm group hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      CHUNK {i + 1}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 group-hover:text-emerald-400/70 transition-colors">
                      Ref ID: {chunk.sur}:{chunk.verse}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed italic">
                    &quot;{chunk.text}&quot;
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
