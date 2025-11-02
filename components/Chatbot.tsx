import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, FoodItem } from '../types';
import { sendMessageToChatbot } from '../services/geminiService';
import { IconChat, IconClose, IconSend, IconSparkles } from './Icons';

// Fix: Implemented Chatbot component to resolve module errors.
interface ChatbotProps {
    menuItems: FoodItem[];
}

export default function Chatbot({ menuItems }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const botResponse = await sendMessageToChatbot(input, menuItems);
        const modelMessage: ChatMessage = { role: 'model', parts: [{ text: botResponse }] };
        setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Oops! Something went wrong." }] };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleToggle = () => {
    if (!isOpen && messages.length === 0) {
        setMessages([{ role: 'model', parts: [{ text: "Hello! I'm your restaurant assistant. How can I help you with our menu today?" }] }]);
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        onClick={handleToggle}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110 z-50"
      >
        {isOpen ? <IconClose className="w-8 h-8" /> : <IconChat className="w-8 h-8" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          <div className="p-4 bg-green-500 text-white rounded-t-lg flex items-center">
            <IconSparkles className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-bold">LayLawn Assistant</h3>
          </div>
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.parts[0].text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                 <div className="max-w-xs px-4 py-2 rounded-2xl bg-gray-200 text-gray-800">
                    <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about the menu..."
              className="flex-grow border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
            <button onClick={handleSend} className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600 disabled:bg-green-300" disabled={isLoading}>
              <IconSend className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
