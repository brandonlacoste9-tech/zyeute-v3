/**
 * Ti-Guy - Premium Quebec Heritage Emblem Design
 * The Zyeuté Mascot & AI Assistant featuring the iconic beaver emblem
 * Luxury leather chat widget with gold medallion styling
 * NOW USING FREE SCRIPTED RESPONSES (No AI API costs!)
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../Button';
import { cn } from '../../lib/utils';
import tiGuyEmblem from '@assets/TI-GUY_NEW_SHARP_1765507001190.jpg';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'tiguy';
  timestamp: Date;
}

// Local fallback responses (used if API fails)
const FALLBACK_RESPONSES = [
  "Hmm, je comprends pas trop... Peux-tu reformuler? 🤔",
  "Je suis un petit castor, pas Google! Essaie une autre question! 😅",
  "Désolé, j'ai pas compris! Reformule ça pour Ti-Guy! 🦫",
  "Ouin... j'suis mêlé un peu! Dis-moi ça autrement?",
];

const QUICK_ACTIONS = [
  { label: "Comment ça marche?", key: "help" },
  { label: "Poster une photo", key: "upload" },
  { label: "C'est quoi les 🔥?", key: "fire" },
  { label: "Devenir VIP?", key: "premium" },
  { label: "Raconte une joke!", key: "joke" },
];

export const TiGuy: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        const greetings = [
          "Allô! Moi c'est Ti-Guy, ton petit castor préféré! 🦫",
          "Salut mon ami! Comment ça va aujourd'hui? ⚜️",
          "Heille! Content de te jaser! Qu'est-ce que j'peux faire pour toé? 🇨🇦",
        ];
        addTiGuyMessage(greetings[Math.floor(Math.random() * greetings.length)]);
      }, 500);
    }
  }, [isOpen]);

  // Add Ti-Guy message directly
  const addTiGuyMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'tiguy',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Handle user message - NOW USES FREE SCRIPTED ENDPOINT
  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Show typing indicator
    setIsTyping(true);

    try {
      // Use Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ti-guy-chat', {
        body: { message: messageText }
      });

      if (error) throw error;
      
      // Simulate slight delay for natural feel
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

      const tiGuyResponse = data.response || FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];

      const newMessage: Message = {
        id: Date.now().toString(),
        text: tiGuyResponse,
        sender: 'tiguy',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error('Ti-Guy error:', error);

      // Fallback to local response
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];

      const newMessage: Message = {
        id: Date.now().toString(),
        text: fallback,
        sender: 'tiguy',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle quick action
  const handleQuickAction = (key: string, label: string) => {
    handleSendMessage(label);
  };

  return (
    <>
      {/* Chat window - Luxury Leather Emblem Design */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a1512 0%, #0d0a08 50%, #1a1512 100%)',
            border: '3px solid #4a3b22',
            boxShadow: '0 0 30px rgba(0,0,0,0.8), 0 0 15px rgba(255, 191, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Header - Emblem Style with Beaver Logo */}
          <div
            className="p-4 flex items-center justify-between relative"
            style={{
              background: 'linear-gradient(180deg, #2d2218 0%, #1a1512 100%)',
              borderBottom: '2px solid #4a3b22',
            }}
          >
            <div className="flex items-center gap-3">
              {/* Circular Emblem Avatar */}
              <div
                className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
                style={{
                  border: '3px solid #B38600',
                  boxShadow: '0 0 15px rgba(255, 191, 0, 0.3), inset 0 0 10px rgba(0,0,0,0.5)',
                }}
              >
                <img
                  src={tiGuyEmblem}
                  alt="Ti-Guy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3
                  className="font-bold text-lg"
                  style={{
                    background: 'linear-gradient(180deg, #FFD966 0%, #B38600 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  Ti-Guy
                </h3>
                <p
                  className="text-xs font-bold tracking-wider"
                  style={{ color: '#8B7355' }}
                >
                  QUEBEC CA 🦫
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full transition-colors"
              style={{
                background: 'rgba(179, 134, 0, 0.2)',
              }}
            >
              <svg className="w-5 h-5" style={{ color: '#B38600' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {/* Messages - Dark Leather Background */}
          <div
            className="h-80 overflow-y-auto p-4 space-y-3"
            style={{
              background: 'linear-gradient(180deg, #0d0a08 0%, #1a1512 50%, #0d0a08 100%)',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'tiguy' && (
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                    style={{
                      border: '2px solid #B38600',
                      boxShadow: '0 0 8px rgba(255, 191, 0, 0.3)',
                    }}
                  >
                    <img
                      src={tiGuyEmblem}
                      alt="Ti-Guy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[75%] p-3 rounded-2xl text-sm',
                    message.sender === 'user'
                      ? 'text-black font-medium'
                      : 'text-white'
                  )}
                  style={
                    message.sender === 'user'
                      ? {
                        background: 'linear-gradient(135deg, #FFD966 0%, #B38600 100%)',
                        boxShadow: '0 2px 8px rgba(179, 134, 0, 0.4)',
                      }
                      : {
                        background: 'linear-gradient(135deg, #2d2218 0%, #1a1512 100%)',
                        border: '1px solid #4a3b22',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                      }
                  }
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center">
                <div
                  className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                  style={{
                    border: '2px solid #B38600',
                    boxShadow: '0 0 8px rgba(255, 191, 0, 0.3)',
                  }}
                >
                  <img
                    src={tiGuyEmblem}
                    alt="Ti-Guy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="p-3 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #2d2218 0%, #1a1512 100%)',
                    border: '1px solid #4a3b22',
                  }}
                >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#B38600', animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#B38600', animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#B38600', animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions - Leather Buttons */}
          {messages.length <= 2 && (
            <div
              className="p-3"
              style={{
                background: 'linear-gradient(180deg, #1a1512 0%, #2d2218 100%)',
                borderTop: '1px solid #4a3b22',
              }}
            >
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.key}
                    onClick={() => handleQuickAction(action.key, action.label)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
                    style={{
                      background: 'rgba(26, 21, 18, 0.8)',
                      border: '1px solid #B38600',
                      color: '#B38600',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input - Premium Gold Accent */}
          <div
            className="p-3"
            style={{
              background: 'linear-gradient(180deg, #2d2218 0%, #1a1512 100%)',
              borderTop: '2px solid #4a3b22',
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Jase avec Ti-Guy..."
                className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid #4a3b22',
                  color: '#FFD966',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                }}
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform"
                style={{
                  background: 'linear-gradient(135deg, #FFD966 0%, #B38600 100%)',
                  boxShadow: '0 0 10px rgba(255, 191, 0, 0.3)',
                }}
              >
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Quebec Pride Footer */}
          <div
            className="px-4 py-2"
            style={{
              background: 'linear-gradient(180deg, #1a1512 0%, #0d0a08 100%)',
              borderTop: '1px solid #4a3b22',
            }}
          >
            <p
              className="text-center text-xs flex items-center justify-center gap-1"
              style={{ color: '#8B7355' }}
            >
              <span style={{ color: '#B38600' }}>⚜️</span>
              <span>Fait au Québec</span>
              <span style={{ color: '#B38600' }}>🦫</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TiGuy;
