
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchInterface from '@/components/SearchInterface';

const Explore = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-dlsl-green/5">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-4xl">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-dlsl-green to-emerald-400 rounded-2xl mb-6 shadow-lg">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-dlsl-green font-bold text-lg">S</span>
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
                STARS Research Assistant
              </h1>
              
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Ask questions about research, find theses, or explore academic work at 
                <span className="text-dlsl-green font-medium"> De La Salle Lipa University</span>
              </p>
            </div>

            {/* Chat Interface */}
            <SearchInterface className="animate-fade-in" />
            
            {/* Quick Suggestions */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 mb-4">Try asking about:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "AI research in 2023",
                  "Computer Science theses",
                  "Engineering projects",
                  "Business studies",
                  "Latest research trends"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-dlsl-green hover:text-dlsl-green transition-all duration-200 hover:shadow-md"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
