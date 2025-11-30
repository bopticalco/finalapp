import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithGemini } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

const ChatAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I'm the Bauer Eyecare virtual assistant. How can I help you today? I can assist with office hours, locations, or direct you to booking and payments.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for Gemini API
      // Filter out only model and user messages, convert to API format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const streamResult = await chatWithGemini(history, userMessage.text);
      
      let fullResponseText = "";
      const modelMessageId = new Date().getTime();
      
      // Add initial placeholder for model response
      setMessages(prev => [...prev, {
        role: 'model',
        text: '',
        timestamp: new Date()
      }]);

      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullResponseText += c.text;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = fullResponseText;
            return newMessages;
          });
        }
      }

    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: "I'm having trouble connecting right now. Please try again later or call our office.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[600px] max-h-[80vh]">
      <div className="bg-blue-600 p-4 flex items-center gap-3 text-white">
        <div className="p-2 bg-white/20 rounded-full">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-bold text-lg">Virtual Assistant</h2>
          <p className="text-blue-100 text-xs">Always here to help</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
              <RefreshCw className="animate-spin text-blue-600 w-4 h-4" />
              <span className="text-xs text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question here..."
            className="flex-grow px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
