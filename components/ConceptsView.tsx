
import React, { useState } from 'react';
import { ArrowLeft, User, Skull, LandPlot } from 'lucide-react';

const ConceptsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'Characters' | 'Enemies' | 'Biomes'>('Characters');

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-colors mb-8 font-cinzel uppercase tracking-widest text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Return
      </button>

      <div className="flex flex-col md:flex-row gap-12">
        <aside className="md:w-64 space-y-2">
          <TabButton icon={<User />} label="Characters" active={activeTab === 'Characters'} onClick={() => setActiveTab('Characters')} />
          <TabButton icon={<Skull />} label="Enemies" active={activeTab === 'Enemies'} onClick={() => setActiveTab('Enemies')} />
          <TabButton icon={<LandPlot />} label="Biomes" active={activeTab === 'Biomes'} onClick={() => setActiveTab('Biomes')} />
        </aside>

        <main className="flex-1">
          {activeTab === 'Characters' && <CharacterGallery />}
          {activeTab === 'Enemies' && <EnemyGallery />}
          {activeTab === 'Biomes' && <BiomeGallery />}
        </main>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg transition-all font-cinzel uppercase text-sm tracking-wider ${active ? 'bg-red-900 text-white' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900'}`}
  >
    {icon} {label}
  </button>
);

const CharacterGallery = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <ConceptCard 
        name="The Branded One" 
        role="Protagonist" 
        image="https://picsum.photos/seed/branded/400/500"
        desc="A former commander whose heart was consumed by vengeance. He carries 'Dragon-Slayer,' a massive sword forged from fallen angel wings and cursed iron."
    />
    <ConceptCard 
        name="Oracle Rei" 
        role="The Catalyst" 
        image="https://picsum.photos/seed/oracle/400/500"
        desc="A girl born from the Spire. Her eyes see the future as static on a screen. She believes the world must be destroyed to be saved."
    />
  </div>
);

const EnemyGallery = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <EnemyItem name="Unit-Alpha Apostle" tier="Elite" type="Bio-Organic" />
      <EnemyItem name="Crying Seraph" tier="Minion" type="Angelic" />
      <EnemyItem name="The Betrayer (Phase 1)" tier="God Hand" type="Celestial" />
      <EnemyItem name="Nerv Husk" tier="Basic" type="Mechanical" />
    </div>
);

const BiomeGallery = () => (
    <div className="space-y-8">
        <BiomeSection name="Fields of Despair" color="#333" />
        <BiomeSection name="The Red Sea" color="#600" />
        <BiomeSection name="Geo-Front Ruin" color="#111" />
    </div>
);

const ConceptCard: React.FC<{ name: string, role: string, image: string, desc: string }> = ({ name, role, image, desc }) => (
    <div className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
        <div className="h-96 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
            <img src={image} alt={name} className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000" />
        </div>
        <div className="p-6">
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-2xl font-cinzel text-white">{name}</h3>
                <span className="text-red-700 text-xs font-pixel uppercase">{role}</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        </div>
    </div>
);

const EnemyItem: React.FC<{ name: string, tier: string, type: string }> = ({ name, tier, type }) => (
    <div className="bg-zinc-950 p-6 border border-zinc-900 rounded-lg hover:border-red-900 transition-colors">
        <div className="w-12 h-12 bg-red-900/20 rounded-full mb-4 flex items-center justify-center">
            <Skull className="text-red-700 w-6 h-6" />
        </div>
        <h4 className="text-white font-bold mb-1">{name}</h4>
        <div className="flex flex-col gap-1 text-[10px] uppercase font-pixel tracking-tighter">
            <span className="text-zinc-600">Tier: <span className="text-red-800">{tier}</span></span>
            <span className="text-zinc-600">Type: {type}</span>
        </div>
    </div>
);

const BiomeSection: React.FC<{ name: string, color: string }> = ({ name, color }) => (
    <div className="relative h-48 rounded-xl overflow-hidden group cursor-pointer border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity" style={{ backgroundColor: color }}></div>
        <div className="absolute bottom-0 left-0 p-8 z-20">
            <h3 className="text-3xl font-cinzel text-white group-hover:translate-x-2 transition-transform">{name}</h3>
            <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-pixel">Tileset Ready: 85%</p>
        </div>
    </div>
);

export default ConceptsView;
