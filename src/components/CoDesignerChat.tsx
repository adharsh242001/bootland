import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage, Mood, ShoeType, ColorPalette, UpperMaterial } from "../types";
import { Send, Sparkles, ArrowLeft, Palette, Layers, Pipette } from "lucide-react";
import { getCoDesignerResponse } from "../services/gemini";

const MATERIALS: UpperMaterial[] = ["Leather", "Canvas", "Mesh", "Suede", "Carbon Fiber", "Recycled Plastic", "Iridescent Mesh"];

const PREDEFINED_SOLE_COLORS = [
  { name: "Neon Green", hex: "#39FF14" },
  { name: "Electric Blue", hex: "#00FFFF" },
  { name: "Hot Pink", hex: "#FF69B4" },
  { name: "Pure White", hex: "#FFFFFF" },
  { name: "Matte Black", hex: "#1A1A1A" },
  { name: "Gum", hex: "#BE8A5B" },
  { name: "Crimson", hex: "#DC143C" },
  { name: "Solar Yellow", hex: "#FFD700" },
];

const COLOR_SUGGESTIONS: Record<Mood, ColorPalette[]> = {
  Cyberpunk: [
    { sole: "Neon Green", material: "Matte Black", laces: "Electric Blue", overall: "Cyber-Noir" },
    { sole: "Hot Pink", material: "Chrome Silver", laces: "Yellow", overall: "Synthwave" },
  ],
  Botanical: [
    { sole: "Earth Brown", material: "Moss Green", laces: "Cream", overall: "Forest Floor" },
    { sole: "Terracotta", material: "Sage", laces: "Olive", overall: "Desert Bloom" },
  ],
  Minimalist: [
    { sole: "Pure White", material: "Light Gray", laces: "White", overall: "Monochrome" },
    { sole: "Gum", material: "Navy", laces: "Navy", overall: "Classic Navy" },
  ],
  "Retro-Futurism": [
    { sole: "Off-White", material: "Teal", laces: "Orange", overall: "Space Age" },
    { sole: "Red", material: "White", laces: "Blue", overall: "Astro-Pop" },
  ],
  Oceanic: [
    { sole: "Translucent Blue", material: "Seafoam", laces: "White", overall: "Deep Sea" },
    { sole: "Sand", material: "Coral", laces: "Aqua", overall: "Reef" },
  ],
};

export const CoDesignerChat = ({ 
  mood, 
  shoeType,
  upperMaterial,
  colors,
  history, 
  onUpdateHistory, 
  onUpdateColors,
  onUpdateMaterial,
  onGenerate,
  onBack 
}: { 
  mood: Mood; 
  shoeType: ShoeType;
  upperMaterial: UpperMaterial;
  colors: ColorPalette;
  history: ChatMessage[]; 
  onUpdateHistory: (history: ChatMessage[]) => void;
  onUpdateColors: (colors: ColorPalette) => void;
  onUpdateMaterial: (material: UpperMaterial) => void;
  onGenerate: (prompt: string) => void;
  onBack: () => void;
}) => {
  const [input, setInput] = useState("");
  const [customHex, setCustomHex] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = COLOR_SUGGESTIONS[mood] || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: "user", text: input };
    const newHistory = [...history, userMsg];
    onUpdateHistory(newHistory);
    setInput("");
    setIsTyping(true);

    try {
      const response = await getCoDesignerResponse(newHistory, mood);
      onUpdateHistory([...newHistory, { role: "model", text: response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSoleColorUpdate = (color: string) => {
    onUpdateColors({ ...colors, sole: color });
  };

  const handleHexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^#[0-9A-F]{6}$/i.test(customHex)) {
      handleSoleColorUpdate(customHex);
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar Info */}
      <div className="w-full md:w-96 border-b md:border-b-0 md:border-r border-white/10 p-8 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono uppercase opacity-40 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft size={14} /> Back to Type
          </button>
          
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">
              Co-Design<br/>Session
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="px-2 py-1 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">
                {mood}
              </div>
              <div className="px-2 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">
                {shoeType}
              </div>
            </div>
          </div>

          {/* Material Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase opacity-40">
              <Layers size={12} /> Upper Material
            </div>
            <select 
              value={upperMaterial}
              onChange={(e) => onUpdateMaterial(e.target.value as UpperMaterial)}
              className="w-full bg-white/5 border border-white/10 p-3 text-xs font-mono uppercase focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
            >
              {MATERIALS.map(m => (
                <option key={m} value={m} className="bg-black text-white">{m}</option>
              ))}
            </select>
          </div>

          {/* Sole Color Picker */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase opacity-40">
              <Pipette size={12} /> Sole Color
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PREDEFINED_SOLE_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleSoleColorUpdate(c.name)}
                  className={`h-8 rounded-sm border transition-all ${
                    colors.sole === c.name ? "border-emerald-500 scale-110" : "border-white/10 hover:border-white/40"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
            <form onSubmit={handleHexSubmit} className="flex gap-2">
              <input
                type="text"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                placeholder="#HEXCODE"
                className="flex-grow bg-white/5 border border-white/10 p-2 text-[10px] font-mono uppercase focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button 
                type="submit"
                className="px-3 bg-white/10 text-[10px] font-mono uppercase hover:bg-white/20 transition-colors"
              >
                Apply
              </button>
            </form>
          </div>

          {/* Color Suggestions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase opacity-40">
              <Palette size={12} /> Suggested Palettes
            </div>
            <div className="grid grid-cols-1 gap-3">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onUpdateColors(s)}
                  className={`text-left p-3 border transition-all ${
                    JSON.stringify(colors) === JSON.stringify(s) 
                      ? "border-emerald-500 bg-emerald-500/10" 
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2">{s.overall}</p>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white" style={{ width: '100%' }} />
                    </div>
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
                    </div>
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white/40" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div className="mt-2 text-[8px] font-mono opacity-40 flex flex-wrap gap-x-2">
                    <span>Sole: {s.sole}</span>
                    <span>Mat: {s.material}</span>
                    <span>Lace: {s.laces}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Selection Display */}
          <div className="p-4 bg-white/5 border border-white/10 space-y-2">
            <p className="text-[10px] font-mono uppercase opacity-40">Current Selection</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] uppercase font-bold">
              <span className="opacity-40">Sole:</span> <span>{colors.sole}</span>
              <span className="opacity-40">Material:</span> <span>{colors.material}</span>
              <span className="opacity-40">Laces:</span> <span>{colors.laces}</span>
              <span className="opacity-40">Upper:</span> <span>{upperMaterial}</span>
              <span className="opacity-40">Overall:</span> <span>{colors.overall}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onGenerate(history.map(m => m.text).join(" "))}
          className="w-full mt-8 py-4 bg-white text-black font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors"
        >
          <Sparkles size={18} /> Generate Draft
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-grow flex flex-col bg-[#111]">
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide"
        >
          <AnimatePresence initial={false}>
            {history.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] p-4 ${
                  msg.role === "user" 
                    ? "bg-white text-black font-medium" 
                    : "border border-white/20 text-white/80 font-mono text-sm"
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-xs font-mono text-white/20 uppercase animate-pulse"
              >
                AI is conceptualizing...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <form 
          onSubmit={handleSubmit}
          className="p-8 border-t border-white/10 flex gap-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a detail (e.g. 'Add carbon fiber panels')"
            className="flex-grow bg-transparent border-b border-white/20 py-2 focus:outline-none focus:border-emerald-500 transition-colors font-mono text-sm"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 text-white/40 hover:text-white transition-colors disabled:opacity-20"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
