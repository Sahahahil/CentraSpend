import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiCpu, FiTrendingUp } from 'react-icons/fi';

const SUGGESTED_QUESTIONS = [
  'What is my total spent?',
  'How much spent on Food?',
  'What is my biggest expense?',
  'What is my average expense?',
  'What is my latest transaction?',
  'How many expenses logged?'
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      text: "Hello! I'm SpendBot, your personal finance intelligence assistant. 🧠💰\n\nAsk me anything about your recorded expenses and I'll calculate it from your database in real-time!",
      isBot: true,
      time: new Date()
    }
  ]);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    // Append User Message
    const userMsgId = Math.random().toString(36).substring(7);
    const userMessage = {
      id: userMsgId,
      text: textToSend,
      isBot: false,
      time: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend }),
      });
      const data = await res.json();
      
      // Append Bot Message
      const botMsgId = Math.random().toString(36).substring(7);
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          text: data.answer || "Sorry, I couldn't compute an answer. Let's try again.",
          isBot: true,
          time: new Date()
        }
      ]);
    } catch (err) {
      const errorMsgId = Math.random().toString(36).substring(7);
      setMessages((prev) => [
        ...prev,
        {
          id: errorMsgId,
          text: "⚠️ Connection error. Please make sure the backend server is running on port 5000 and try again.",
          isBot: true,
          time: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    handleSendMessage(question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button (FAB) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg hover:shadow-indigo-500/30 cursor-pointer border border-indigo-500/20"
        aria-label="Ask Chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiX className="text-2xl" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <FiMessageSquare className="text-2xl" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-indigo-600 animate-pulse"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Sliding Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="absolute bottom-18 right-0 w-[350px] sm:w-[400px] h-[520px] rounded-3xl shadow-2xl glass-panel border border-white/30 dark:border-gray-800 overflow-hidden flex flex-col justify-between"
          >
            {/* Header Banner */}
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-600/90 to-violet-600/90 text-white flex items-center justify-between border-b border-indigo-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl border border-white/15">
                  <FiCpu className="text-lg text-indigo-200" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold tracking-wide">SpendBot Intelligence</h4>
                  <p className="text-[10px] text-indigo-200 font-medium">Understands aggregate queries</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Message Thread Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50 dark:bg-gray-950/20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed font-medium shadow-sm whitespace-pre-wrap text-left ${
                      msg.isBot
                        ? 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {msg.text}
                    <div
                      className={`text-[9px] mt-1 text-right font-semibold ${
                        msg.isBot ? 'text-gray-400 dark:text-gray-500' : 'text-indigo-200'
                      }`}
                    >
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Dot Animation */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Queries Horizontal Slider */}
            <div className="px-4 py-2 border-t border-gray-100/50 dark:border-gray-800/50 bg-white/40 dark:bg-gray-900/40">
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {SUGGESTED_QUESTIONS.map((qText) => (
                  <button
                    key={qText}
                    disabled={loading}
                    onClick={() => handleSendMessage(qText)}
                    className="flex-shrink-0 px-3 py-1.5 bg-indigo-500/10 dark:bg-indigo-500/5 hover:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-bold rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50"
                  >
                    {qText}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Footer Form */}
            <form 
              onSubmit={onSubmit}
              className="p-4 border-t border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900 flex gap-2 items-center"
            >
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={loading ? "Generating answer..." : "Ask me total spent, food, etc..."}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <FiSend className="text-sm" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
