
import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`flex ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] ${
          message.sender === 'user'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <div className="flex items-center gap-2 mb-1 text-xs opacity-80">
          {message.sender === 'user' ? (
            <>
              <span>Você</span>
              <User className="h-3 w-3" />
            </>
          ) : (
            <>
              <Bot className="h-3 w-3" />
              <span>Assistente</span>
            </>
          )}
        </div>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className="text-xs mt-1 opacity-70 text-right">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
