
import React, { useState } from 'react';
import { GameState } from './types';
import GDDView from './components/GDDView';
import PrototypeView from './components/PrototypeView';
import ConceptsView from './components/ConceptsView';
import { Book, Swords, Palette, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<GameState>(GameState.MENU);

  const renderContent = () => {
    switch (currentView) {
      case GameState.GDD:
        return <GDDView onBack={() => setCurrentView(GameState.MENU)} />;
      case GameState.PROTOTYPE:
        return <PrototypeView onBack={() => setCurrentView(GameState.MENU)} />;
      case GameState.CONCEPTS:
        return <ConceptsView onBack={() => setCurrentView(GameState.MENU)} />;
      default:
        return <LandingMenu setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 relative selection:bg-red-900">
      {/* Background Ambience */}
      <div className="fixed inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 blur-[120px] rounded-full"></div>
      </div>
      
      {renderContent()}
    </div>
  );
};

const LandingMenu: React.FC<{ setView: (v: GameState) => void }> = ({ setView }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-20 relative z-10">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-red-600 font-cinzel text-xl tracking-[0.4em] uppercase opacity-80">Project Codename</h2>
        <h1 className="text-6xl md:text-8xl font-cinzel font-bold text-white drop-shadow-[0_0_15px_rgba(255,0,0,0.4)]">
          ECLIPSE <span className="text-red-800">OF THE</span> BRANDED
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto italic font-light text-lg">
          "The sky bleeds for those who remember the promise."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <MenuCard 
          title="Game Design Document" 
          desc="The blueprint of suffering. Mechanics, lore, and world structure." 
          icon={<Book className="w-8 h-8 text-blue-400" />}
          onClick={() => setView(GameState.GDD)}
        />
        <MenuCard 
          title="Combat Prototype" 
          desc="Experience the weight of the slab. Playable side-scrolling combat." 
          icon={<Swords className="w-8 h-8 text-red-500" />}
          onClick={() => setView(GameState.PROTOTYPE)}
        />
        <MenuCard 
          title="Visual Concept" 
          desc="Pixel art sprites, biomes, and grotesque enemy designs." 
          icon={<Palette className="w-8 h-8 text-purple-400" />}
          onClick={() => setView(GameState.CONCEPTS)}
        />
      </div>

      <footer className="mt-20 opacity-30 text-xs flex gap-4 uppercase tracking-widest font-cinzel">
        <span>Res: 320x180</span>
        <span>|</span>
        <span>Version: 0.1.0-Alpha</span>
        <span>|</span>
        <span>Target: PC (Steam)</span>
      </footer>
    </div>
  );
};

const MenuCard: React.FC<{ title: string, desc: string, icon: React.ReactNode, onClick: () => void }> = ({ title, desc, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="group relative flex flex-col p-8 bg-zinc-900/40 border border-zinc-800 rounded-xl transition-all duration-300 hover:bg-zinc-800/60 hover:border-red-900/50 hover:-translate-y-2 overflow-hidden text-left"
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
      <ChevronRight className="w-6 h-6 text-red-700" />
    </div>
    <div className="mb-6 p-4 bg-zinc-950 rounded-lg w-fit group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <h3 className="text-xl font-cinzel font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
      {title}
    </h3>
    <p className="text-sm text-gray-500 leading-relaxed">
      {desc}
    </p>
    <div className="mt-4 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
      <div className="w-0 group-hover:w-full h-full bg-red-800 transition-all duration-700 ease-out"></div>
    </div>
  </button>
);

export default App;
