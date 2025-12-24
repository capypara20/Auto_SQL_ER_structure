import React, { useState } from 'react';
import { Terminal, X, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

export interface ConsoleMessage {
  id: string;
  timestamp: Date;
  type: 'info' | 'warn' | 'error' | 'success';
  message: string;
  details?: string;
}

interface DebugConsoleProps {
  messages: ConsoleMessage[];
  onClear: () => void;
}

const DebugConsole: React.FC<DebugConsoleProps> = ({ messages, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const getTypeColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'warn':
        return 'text-yellow-600 bg-yellow-50';
      case 'success':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getTypeIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="デバッグコンソールを開く"
      >
        <Terminal size={20} />
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {messages.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl border border-gray-300 z-50 ${
        isMinimized ? 'w-80' : 'w-[600px]'
      }`}
      style={{ maxHeight: isMinimized ? '60px' : '400px' }}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between bg-gray-800 text-white p-3 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Terminal size={18} />
          <h3 className="text-sm font-semibold">デバッグコンソール</h3>
          {messages.length > 0 && (
            <span className="bg-gray-600 text-xs px-2 py-0.5 rounded-full">
              {messages.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="hover:bg-gray-700 p-1 rounded transition-colors"
            title="クリア"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-gray-700 p-1 rounded transition-colors"
            title={isMinimized ? '展開' : '最小化'}
          >
            {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-gray-700 p-1 rounded transition-colors"
            title="閉じる"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* メッセージリスト */}
      {!isMinimized && (
        <div className="overflow-y-auto p-3 space-y-2" style={{ maxHeight: '340px' }}>
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8 text-sm">
              メッセージはありません
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded text-xs border ${getTypeColor(msg.type)}`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-base">{getTypeIcon(msg.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-gray-500 font-mono">
                        {msg.timestamp.toLocaleTimeString('ja-JP')}
                      </span>
                      <span className="font-semibold uppercase text-[10px]">
                        {msg.type}
                      </span>
                    </div>
                    <div className="font-medium break-words">{msg.message}</div>
                    {msg.details && (
                      <pre className="mt-1 text-[10px] bg-white bg-opacity-50 p-2 rounded overflow-x-auto whitespace-pre-wrap break-words">
                        {msg.details}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DebugConsole;
