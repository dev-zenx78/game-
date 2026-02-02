
import React from 'react';
import { ArrowLeft, Swords, Users, Map, Brain } from 'lucide-react';

const GDDView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-colors mb-8 font-cinzel uppercase tracking-widest text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Terminal
      </button>

      <header className="border-b border-red-900/30 pb-12 mb-12">
        <h1 className="text-5xl font-cinzel font-bold text-white mb-4">Game Design Document</h1>
        <p className="text-red-700 font-pixel text-[10px] tracking-tight uppercase">Confidential Project: Eclipse of the Branded</p>
      </header>

      <div className="space-y-16">
        <Section icon={<Swords />} title="Core Mechanics: The Slab">
          <p className="mb-4">Combat is defined by momentum. Unlike fast-paced hack-and-slash games, every swing of the Greatsword carries immense weight. Missing a hit leaves you vulnerable, but connecting shatters armor and morale.</p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li><span className="text-red-500">Rage System:</span> Taking and dealing damage fills the Rage Meter. At 100%, enter 'Apostolic Frenzy'—increased speed and damage, but health drains steadily.</li>
            <li><span className="text-red-500">The Brand:</span> At night or in 'Eclipsed Zones', the brand on the neck bleeds. This attracts elite demons but increases EXP gain and rare material drops.</li>
            <li><span className="text-red-500">Tight Parry:</span> Parrying isn't just defense; it's a counter-system. A perfect parry triggers a 'Visceral Execution' (Evangelion-style hyper-violent finisher).</li>
          </ul>
        </Section>

        <Section icon={<Users />} title="Companion System: The Bonds">
          <p className="mb-4">The protagonist is strong, but the world is hollow. Allies provide the psychological anchor needed to survive the Descent.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CompanionCard name="Rei" role="The Oracle" power="Temporal Visions (Slow-mo)" />
            <CompanionCard name="Kael" role="Disgraced Knight" power="Iron Wall (Invulnerability)" />
            <CompanionCard name="Dr. Aris" role="Rogue Scientist" power="Bio-Hazard (DOT debuffs)" />
            <CompanionCard name="Thorne" role="Silent Berserker" power="Echo Strike (Extra Hits)" />
          </div>
        </Section>

        <Section icon={<Brain />} title="Psychological Layers">
          <p>Inspired by Evangelion, specific segments of the game transition from side-scrolling action to first-person introspective sequences. Players navigate through the hero's trauma-scape, making choices that determine the "Sanity Level," directly impacting which Ending the player unlocks.</p>
        </Section>

        <Section icon={<Map />} title="World Hierarchy">
          <ul className="space-y-4">
            <li className="bg-zinc-900/50 p-4 border-l-2 border-zinc-700">
              <h4 className="font-bold text-white">Biome 1: The Ash Fields</h4>
              <p className="text-sm text-gray-500 italic">Desolate plains where the first sacrifice occurred. Low-level Husks wander the gray dunes.</p>
            </li>
            <li className="bg-zinc-900/50 p-4 border-l-2 border-red-900">
              <h4 className="font-bold text-white">Biome 2: Neural Spire</h4>
              <p className="text-sm text-gray-500 italic">A bio-mechanical tower pulsing with organic energy. Home to the first Apostle-Angel hybrid.</p>
            </li>
            <li className="bg-zinc-900/50 p-4 border-l-2 border-purple-900">
              <h4 className="font-bold text-white">Biome 3: The Abyssal Womb</h4>
              <p className="text-sm text-gray-500 italic">Reality warps. Backgrounds become surreal. The final climb to the Hands of Fate.</p>
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
};

const Section: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
  <section>
    <div className="flex items-center gap-4 mb-6">
      <div className="text-red-600 bg-red-900/10 p-2 rounded">{icon}</div>
      <h2 className="text-2xl font-cinzel font-bold text-white uppercase tracking-wider">{title}</h2>
    </div>
    <div className="text-gray-400 leading-relaxed pl-12">
      {children}
    </div>
  </section>
);

const CompanionCard: React.FC<{ name: string, role: string, power: string }> = ({ name, role, power }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
    <h4 className="text-white font-bold">{name} - <span className="text-red-700 text-sm font-normal">{role}</span></h4>
    <p className="text-xs text-gray-500 mt-1">Ability: {power}</p>
  </div>
);

export default GDDView;
