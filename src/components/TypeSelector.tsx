import { motion } from "motion/react";
import { ShoeType } from "../types";
import { Footprints, Activity, ShieldAlert, Zap, Star } from "lucide-react";

const TYPES: { name: ShoeType; icon: any; desc: string; image: string }[] = [
  { 
    name: "High-Top Sneaker", 
    icon: Zap, 
    desc: "Classic silhouette with ankle support.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Low-Profile Runner", 
    icon: Activity, 
    desc: "Sleek, lightweight, and built for speed.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Technical Boot", 
    icon: ShieldAlert, 
    desc: "Rugged construction for extreme environments.",
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Slip-on", 
    icon: Footprints, 
    desc: "Effortless style and maximum comfort.",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800"
  },
  { 
    name: "Luxury Trainer", 
    icon: Star, 
    desc: "Premium materials and avant-garde design.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800"
  },
];

export const TypeSelector = ({ onSelect, onBack }: { onSelect: (type: ShoeType) => void; onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-[#E4E3E0] p-8 flex flex-col">
      <div className="flex justify-between items-end mb-12">
        <div>
          <button 
            onClick={onBack}
            className="font-mono text-xs uppercase opacity-40 hover:opacity-100 transition-opacity mb-4 block"
          >
            ← Back to Moods
          </button>
          <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">Select Your<br/>Silhouette</h2>
          <p className="mt-4 font-mono text-sm uppercase opacity-60">Step 02 // Choose the Form Factor</p>
        </div>
        <div className="font-mono text-xs opacity-40 text-right">
          SOLEAI_SYSTEM_V2.0<br/>TYPE_SELECTION_ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-grow">
        {TYPES.map((type, idx) => (
          <motion.div
            key={type.name}
            className="relative group cursor-pointer overflow-hidden border border-black bg-white flex flex-col"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelect(type.name)}
          >
            {/* Image Container */}
            <div className="relative h-64 md:h-auto md:flex-grow overflow-hidden border-b border-black">
              <img 
                src={type.image} 
                alt={type.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute top-4 left-4">
                <type.icon size={32} strokeWidth={1} className="text-white mix-blend-difference" />
              </div>
              <div className="absolute top-4 right-4 font-mono text-xs text-white mix-blend-difference opacity-60">
                0{idx + 1}
              </div>
            </div>

            {/* Info Container */}
            <div className="p-6 group-hover:bg-black group-hover:text-white transition-colors">
              <h3 className="text-xl font-black uppercase leading-tight mb-2">{type.name}</h3>
              <p className="font-mono text-[10px] uppercase opacity-60 group-hover:opacity-100">{type.desc}</p>
            </div>

            {/* Hover Overlay Text */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
