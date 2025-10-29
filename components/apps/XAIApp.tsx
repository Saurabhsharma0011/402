'use client';

import { useState } from 'react';

export default function XAIApp() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    { role: 'ai', content: 'Hello! I\'m your x402 AI Assistant. Ask me anything about blockchain, crypto, or Solana development!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    '🔍 Analyze this smart contract',
    '📈 Latest SOL price trends',
    '💡 Explain DeFi yield farming',
    '🛠️ Generate Anchor program code',
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = `I understand you're asking about "${userMessage}". Here's what I can tell you:\n\nThis is a simulated AI response for demonstration. In production, this would connect to an actual AI API like GPT-4 or Claude.\n\nCost: 0.005 USDC has been deducted from your wallet.`;
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-green-400/10 border-b-2 border-green-400/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-green-400 font-mono font-bold text-lg">xAI Assistant</h2>
            <p className="text-green-400/60 text-xs font-mono">Powered by GPT-4 • 0.005 USDC per query</p>
          </div>
          <button
            onClick={() => setMessages([{ role: 'ai', content: 'Conversation cleared. How can I help you?' }])}
            className="bg-red-500/20 border border-red-500/50 rounded px-3 py-1 text-red-400 
                     hover:bg-red-500/30 transition-colors font-mono text-sm"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="border-b border-green-400/30 p-4">
        <div className="text-green-400/60 text-xs font-mono mb-2">Quick Prompts:</div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => setInput(prompt)}
              className="bg-green-400/10 border border-green-400/30 rounded px-3 py-1 text-green-400 
                       hover:bg-green-400/20 transition-colors font-mono text-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg font-mono text-sm ${
                msg.role === 'user'
                  ? 'bg-green-400/20 border border-green-400/50 text-green-400'
                  : 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
              }`}
            >
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">{msg.role === 'user' ? '👤' : '🤖'}</span>
                <span className="font-bold">{msg.role === 'user' ? 'You' : 'AI'}</span>
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4 font-mono text-sm text-purple-400">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <span>AI is thinking</span>
                <span className="animate-pulse">...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t-2 border-green-400/30 p-4 bg-black">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about blockchain, crypto, or Solana..."
            className="flex-1 bg-black border-2 border-green-400/30 rounded px-4 py-3 text-green-400 
                     font-mono text-sm focus:border-green-400 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-green-400 hover:bg-green-500 text-black font-mono px-6 py-3 rounded 
                     font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-[0_0_20px_rgba(0,255,65,0.3)]"
          >
            Send
          </button>
        </div>
        <div className="text-green-400/60 text-xs font-mono mt-2 text-center">
          Each AI query costs 0.005 USDC • Transparent pricing, no subscriptions
        </div>
      </div>
    </div>
  );
}
