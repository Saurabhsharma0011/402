'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function XFeedApp() {
  const [selectedNews, setSelectedNews] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // News screenshots from public folder
  const newsItems = [
    { id: 1, image: '/Screenshot 2025-10-29 at 9.02.33 AM.png', title: 'x402 News Update #1', date: 'Oct 29, 2025 - 9:02 AM' },
    { id: 2, image: '/Screenshot 2025-10-29 at 9.03.06 AM.png', title: 'x402 News Update #2', date: 'Oct 29, 2025 - 9:03 AM' },
    { id: 3, image: '/Screenshot 2025-10-29 at 9.03.29 AM.png', title: 'x402 News Update #3', date: 'Oct 29, 2025 - 9:03 AM' },
    { id: 4, image: '/Screenshot 2025-10-29 at 9.03.45 AM.png', title: 'x402 News Update #4', date: 'Oct 29, 2025 - 9:03 AM' },
    { id: 5, image: '/Screenshot 2025-10-29 at 9.03.54 AM.png', title: 'x402 News Update #5', date: 'Oct 29, 2025 - 9:03 AM' },
    { id: 6, image: '/Screenshot 2025-10-29 at 9.04.08 AM.png', title: 'x402 News Update #6', date: 'Oct 29, 2025 - 9:04 AM' },
    { id: 7, image: '/Screenshot 2025-10-29 at 9.06.12 AM.png', title: 'x402 News Update #7', date: 'Oct 29, 2025 - 9:06 AM' },
    { id: 8, image: '/Screenshot 2025-10-29 at 9.06.24 AM.png', title: 'x402 News Update #8', date: 'Oct 29, 2025 - 9:06 AM' },
    { id: 9, image: '/Screenshot 2025-10-29 at 9.06.35 AM.png', title: 'x402 News Update #9', date: 'Oct 29, 2025 - 9:06 AM' },
    { id: 10, image: '/Screenshot 2025-10-29 at 9.06.50 AM.png', title: 'x402 News Update #10', date: 'Oct 29, 2025 - 9:06 AM' },
    { id: 11, image: '/Screenshot 2025-10-29 at 9.06.59 AM.png', title: 'x402 News Update #11', date: 'Oct 29, 2025 - 9:06 AM' },
    { id: 12, image: '/Screenshot 2025-10-29 at 9.07.05 AM.png', title: 'x402 News Update #12', date: 'Oct 29, 2025 - 9:07 AM' },
    { id: 13, image: '/Screenshot 2025-10-29 at 9.07.11 AM.png', title: 'x402 News Update #13', date: 'Oct 29, 2025 - 9:07 AM' },
  ];

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-400/10 to-purple-500/10 border-b border-green-400/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📰</div>
            <div>
              <h2 className="text-xl font-mono font-bold text-green-400">x402feed</h2>
              <p className="text-xs text-green-400/60 font-mono">Latest x402 News & Updates</p>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded font-mono text-sm transition-all ${
                viewMode === 'grid'
                  ? 'bg-green-400 text-black'
                  : 'bg-green-400/20 text-green-400 hover:bg-green-400/30'
              }`}
            >
              ▦ Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded font-mono text-sm transition-all ${
                viewMode === 'list'
                  ? 'bg-green-400 text-black'
                  : 'bg-green-400/20 text-green-400 hover:bg-green-400/30'
              }`}
            >
              ☰ List
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-green-400/5 border-b border-green-400/20 px-6 py-3">
        <div className="flex items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-green-400/60">Total News:</span>
            <span className="text-green-400 font-bold">{newsItems.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400/60">Latest:</span>
            <span className="text-green-400">Oct 29, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-green-400">Live Feed</span>
          </div>
        </div>
      </div>

      {/* News Feed Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((news) => (
              <div
                key={news.id}
                onClick={() => setSelectedNews(news.id)}
                className="group bg-black border-2 border-green-400/30 rounded-lg overflow-hidden 
                         hover:border-green-400 transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]"
              >
                <div className="relative w-full h-64 bg-green-400/5">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded">
                    <span className="text-green-400 font-mono text-xs font-bold">#{news.id}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-green-400 font-mono text-sm font-bold mb-2">{news.title}</h3>
                  <p className="text-green-400/60 font-mono text-xs">{news.date}</p>
                  <button className="mt-3 text-green-400 font-mono text-xs hover:text-green-300 flex items-center gap-1">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {newsItems.map((news) => (
              <div
                key={news.id}
                onClick={() => setSelectedNews(news.id)}
                className="group flex gap-4 bg-black border-2 border-green-400/30 rounded-lg overflow-hidden 
                         hover:border-green-400 transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] p-4"
              >
                <div className="relative w-48 h-32 flex-shrink-0 bg-green-400/5 rounded overflow-hidden">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-400/20 text-green-400 font-mono text-xs px-2 py-1 rounded">
                        #{news.id}
                      </span>
                      <span className="text-green-400/60 font-mono text-xs">{news.date}</span>
                    </div>
                    <h3 className="text-green-400 font-mono text-lg font-bold">{news.title}</h3>
                  </div>
                  <button className="text-green-400 font-mono text-sm hover:text-green-300 flex items-center gap-1 self-start">
                    View Full Screenshot →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Full View */}
      {selectedNews && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedNews(null)}
        >
          <div className="relative max-w-5xl w-full max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute -top-12 right-0 text-white hover:text-green-400 font-mono text-sm 
                       bg-black/50 px-4 py-2 rounded transition-colors"
            >
              ✕ Close
            </button>
            
            {/* Full Screenshot */}
            <div className="relative w-full h-[80vh] bg-black border-2 border-green-400 rounded-lg overflow-hidden">
              <Image
                src={newsItems.find(n => n.id === selectedNews)?.image || ''}
                alt={newsItems.find(n => n.id === selectedNews)?.title || ''}
                fill
                className="object-contain"
              />
            </div>
            
            {/* Navigation */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNews(prev => prev && prev > 1 ? prev - 1 : newsItems.length);
                }}
                className="bg-green-400/20 text-green-400 px-6 py-3 rounded font-mono hover:bg-green-400/30 transition-all"
              >
                ← Previous
              </button>
              
              <div className="text-green-400 font-mono text-sm">
                {selectedNews} / {newsItems.length}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNews(prev => prev && prev < newsItems.length ? prev + 1 : 1);
                }}
                className="bg-green-400/20 text-green-400 px-6 py-3 rounded font-mono hover:bg-green-400/30 transition-all"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
