import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const isHome = currentView === ViewState.HOME;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Minimal Header */}
      <header className="px-4 py-4 flex items-center justify-between sticky top-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center gap-3 w-10">
          {!isHome && (
             <button onClick={() => setView(ViewState.HOME)} className="p-2 -ml-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={28} />
            </button>
          )}
        </div>
        
        {/* Only show title in header if NOT on home, because Home has the big title */}
        {!isHome && (
          <span className="font-bold text-lg text-slate-900">Bauer Eyecare</span>
        )}
        
        <div className="w-10"></div> {/* Spacer for balance */}
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-md mx-auto px-4 pb-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;