import { motion } from "motion/react";
import { Mood } from "../types";
import { Zap, Leaf, Shield, Rocket, Waves } from "lucide-react";

const MOODS: { name: Mood; icon: any; color: string; image: string }[] = [
  { name: "Cyberpunk", icon: Zap, color: "text-purple-500", image: "https://picsum.photos/seed/cyber/400/600" },
  { name: "Botanical", icon: Leaf, color: "text-emerald-500", image: "https://picsum.photos/seed/botany/400/600" },
  { name: "Minimalist", icon: Shield, color: "text-zinc-400", image: "https://picsum.photos/seed/minimal/400/600" },
  { name: "Retro-Futurism", icon: Rocket, color: "text-orange-500", image: "https://picsum.photos/seed/retro/400/600" },
  { name: "Oceanic", icon: Waves, color: "text-blue-500", image: "https://picsum.photos/seed/ocean/400/600" },
];

export const MoodSelector = ({ onSelect }: { onSelect: (mood: Mood) => void }) => {
  return (
    <div className="min-h-screen bg-[#E4E3E0] p-8 flex flex-col">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">Choose Your<br/>Vibe</h2>
          <p className="mt-4 font-mono text-sm uppercase opacity-60">Step 01 // Select a Foundation</p>
        </div>
        <div className="font-mono text-xs opacity-40 text-right">
          SOLEAI_SYSTEM_V2.0<br/>MOOD_SELECTION_ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-grow">
        {MOODS.map((mood, idx) => (
          <motion.div
            key={mood.name}
            className="relative group cursor-pointer overflow-hidden border border-black/10 bg-white"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelect(mood.name)}
            whileHover={{ y: -10 }}
          >
            <img 
              src={mood.image} 
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-20 group-hover:opacity-40"
              referrerPolicy="no-referrer"
            />
            <div className="relative h-full p-6 flex flex-col justify-between z-10">
              <mood.icon className={`w-12 h-12 ${mood.color}`} strokeWidth={1.5} />
              <div>
                <h3 className="text-2xl font-bold uppercase leading-tight">{mood.name}</h3>
                <div className="mt-2 h-1 w-0 group-hover:w-full bg-black transition-all duration-300" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
