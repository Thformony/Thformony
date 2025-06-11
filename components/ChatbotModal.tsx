
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ChatMessage, WebGrounding, GroundingChunk } from '../types';
import { sendMessageToChat, extractGroundingChunks } from '../services/geminiService';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { PaperAirplaneIcon, InformationCircleIcon } from './icons'; // Assuming icons are available
import { Part, Content } from '@google/genai'; // Correct import for Part type, Added Content

export const ChatbotModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t, theme, apiKeyAvailable } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  // Initial system message or welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ 
        id: 'system-welcome', 
        text: "Hello! I'm your AI assistant for Th For Currency Exchange. How can I help you today?", 
        sender: 'system',
        timestamp: Date.now()
      }]);
    }
    // Reset messages when modal closes if desired, or persist them
    // For now, let's reset to show welcome each time.
    // If persisting, remove this messages.length check and the reset in onClose if any.
    return () => {
        // Optional: clear messages when modal closes
        // setMessages([]); 
    }
  }, [isOpen]); // Removed messages.length dependency to avoid loop if persisted

  const mapChatMessagesToContentHistory = (chatMessages: ChatMessage[]): Content[] => {
    return chatMessages.map(msg => {
        if (msg.sender === 'user') {
            return { role: 'user', parts: [{ text: msg.text }] };
        } else if (msg.sender === 'bot') {
            return { role: 'model', parts: [{ text: msg.text }] }; 
        }
        // System messages are part of the initial chat config, not history items here
        return null; 
    }).filter(content => content !== null) as Content[];
  };


  const handleSend = async () => {
    if (input.trim() === '' || isLoading || !apiKeyAvailable) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), text: input, sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Prepare history for the API call, excluding system messages which are handled by systemInstruction
    const historyForApi = mapChatMessagesToContentHistory(messages.filter(msg => msg.sender !== 'system'));


    const response = await sendMessageToChat(input, historyForApi);
    setIsLoading(false);

    if (response) {
      const groundingChunks = extractGroundingChunks(response);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: Date.now(),
        groundingChunks: groundingChunks?.map(chunk => chunk.web).filter(Boolean) as WebGrounding[]
      };
      setMessages(prev => [...prev, botMessage]);
    } else {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: t('errorMessage'),
        sender: 'bot',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('chatWithOurBot')} size="lg">
      {!apiKeyAvailable && (
         <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-700 border border-yellow-300 dark:border-yellow-600 rounded-md text-yellow-700 dark:text-yellow-200 text-sm flex items-center">
          <InformationCircleIcon className="w-5 h-5 me-2 rtl:ms-2 flex-shrink-0"/> {t('apiKeyMissing')}
        </div>
      )}
      <div className="flex flex-col h-[60vh]">
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-900 rounded-t-md">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-br-none rtl:rounded-bl-none rtl:rounded-br-xl'
                    : msg.sender === 'bot'
                    ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 rounded-bl-none rtl:rounded-br-none rtl:rounded-bl-xl'
                    : 'bg-transparent text-neutral-500 dark:text-neutral-400 text-sm italic text-center w-full' /* System messages */
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.sender === 'bot' && msg.groundingChunks && msg.groundingChunks.length > 0 && (
                   <div className="mt-2 pt-2 border-t border-neutral-300 dark:border-neutral-600">
                     <p className="text-xs font-semibold mb-1">{t('viewSources')}:</p>
                     <ul className="space-y-1">
                       {msg.groundingChunks.map((chunk, index) => (
                         <li key={index} className="text-xs">
                           <a 
                             href={chunk.uri} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-primary dark:text-primary-light hover:underline truncate block"
                             title={chunk.title || chunk.uri}
                           >
                             [{index + 1}] {chunk.title || chunk.uri}
                           </a>
                         </li>
                       ))}
                     </ul>
                   </div>
                )}
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : msg.sender === 'bot' ? 'text-neutral-500 dark:text-neutral-400' : 'hidden'} ${msg.sender === 'user' ? 'text-right rtl:text-left' : 'text-left rtl:text-right'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-b-md">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder={t('typeYourMessage')}
              className="flex-grow !mb-0" // Override default margin
              disabled={isLoading || !apiKeyAvailable}
              aria-label={t('typeYourMessage')}
            />
            <Button onClick={handleSend} disabled={isLoading || !apiKeyAvailable || input.trim() === ''} className="h-10 w-10 p-0 flex-shrink-0">
              {isLoading ? <LoadingSpinner size="sm" /> : <PaperAirplaneIcon className="w-5 h-5" />}
              <span className="sr-only">{t('sendMessage')}</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
