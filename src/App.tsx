import { useState, useEffect } from "react";
import { AppState, Mood, ShoeDesign, ChatMessage, ShoeType, ColorPalette } from "./types";
import { AttractScreen } from "./components/AttractScreen";
import { MoodSelector } from "./components/MoodSelector";
import { TypeSelector } from "./components/TypeSelector";
import { CoDesignerChat } from "./components/CoDesignerChat";
import { RevealScreen, FinalizeScreen } from "./components/FinalizeScreen";
import { ProjectionView } from "./components/ProjectionView";
import { generateShoeImage } from "./services/gemini";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [state, setState] = useState<AppState>({
    step: "attract",
    chatHistory: [],
    generatedImages: [],
    selectedMaterial: "Leather",
    selectedColors: { sole: "Default", material: "Default", laces: "Default", overall: "Default" }
  });

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Simple routing
  if (path === "/projection") {
    return <ProjectionView />;
  }

  if (path.startsWith("/share/")) {
    const designId = path.split("/")[2];
    return <SharePage designId={designId} />;
  }

  const handleStart = () => setState(s => ({ ...s, step: "mood" }));
  
  const handleMoodSelect = (mood: Mood) => {
    setState(s => ({ 
      ...s, 
      selectedMood: mood, 
      step: "type",
    }));
  };

  const handleTypeSelect = (type: ShoeType) => {
    setState(s => ({ 
      ...s, 
      selectedType: type,
      step: "chat",
      chatHistory: [{ role: "model", text: `Excellent choice. A ${type} in the ${s.selectedMood} aesthetic is a bold move. I've prepared some color palettes for you on the left. How should we customize this further?` }]
    }));
  };

  const handleGenerate = async (customPrompt: string) => {
    if (!state.selectedMood || !state.selectedType) return;
    setState(s => ({ ...s, step: "generating" }));
    
    try {
      const colorPrompt = `Colors: Sole is ${state.selectedColors.sole}, Materials are ${state.selectedColors.material}, Laces are ${state.selectedColors.laces}. Overall theme is ${state.selectedColors.overall}.`;
      const materialPrompt = `Upper material: ${state.selectedMaterial}.`;
      const fullPrompt = `${state.selectedType}. ${materialPrompt} ${colorPrompt}. ${customPrompt}`;
      
      // Generate 3 variations
      const promises = [
        generateShoeImage(state.selectedMood, fullPrompt),
        generateShoeImage(state.selectedMood, fullPrompt + " alternative variation"),
        generateShoeImage(state.selectedMood, fullPrompt + " experimental materials")
      ];
      const images = await Promise.all(promises);
      setState(s => ({ ...s, step: "reveal", generatedImages: images }));
    } catch (error) {
      console.error(error);
      setState(s => ({ ...s, step: "chat" }));
    }
  };

  const handleSelectImage = async (imageUrl: string) => {
    const design: ShoeDesign = {
      id: Math.random().toString(36).substring(7),
      imageUrl,
      prompt: state.chatHistory.filter(m => m.role === "user").map(m => m.text).join(", "),
      mood: state.selectedMood!,
      shoeType: state.selectedType!,
      upperMaterial: state.selectedMaterial,
      colors: state.selectedColors,
      timestamp: Date.now(),
    };

    // Push to server
    await fetch("/api/finalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(design),
    });

    setState(s => ({ ...s, step: "finalize", finalDesign: design }));
  };

  return (
    <div className="min-h-screen bg-black select-none">
      <AnimatePresence mode="wait">
        {state.step === "attract" && (
          <motion.div key="attract" exit={{ opacity: 0 }}><AttractScreen onStart={handleStart} /></motion.div>
        )}
        {state.step === "mood" && (
          <motion.div key="mood" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MoodSelector onSelect={handleMoodSelect} />
          </motion.div>
        )}
        {state.step === "type" && (
          <motion.div key="type" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TypeSelector onSelect={handleTypeSelect} onBack={() => setState(s => ({ ...s, step: "mood" }))} />
          </motion.div>
        )}
        {state.step === "chat" && (
          <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CoDesignerChat 
              mood={state.selectedMood!} 
              shoeType={state.selectedType!}
              upperMaterial={state.selectedMaterial}
              colors={state.selectedColors}
              history={state.chatHistory}
              onUpdateHistory={(h) => setState(s => ({ ...s, chatHistory: h }))}
              onUpdateColors={(c) => setState(s => ({ ...s, selectedColors: c }))}
              onUpdateMaterial={(m) => setState(s => ({ ...s, selectedMaterial: m }))}
              onGenerate={handleGenerate}
              onBack={() => setState(s => ({ ...s, step: "type" }))}
            />
          </motion.div>
        )}
        {state.step === "generating" && (
          <motion.div key="generating" className="h-screen flex flex-col items-center justify-center bg-black text-white">
            <div className="w-24 h-24 border-t-2 border-emerald-500 rounded-full animate-spin mb-8" />
            <h2 className="text-2xl font-black uppercase tracking-widest animate-pulse">Synthesizing Design...</h2>
            <p className="mt-4 font-mono text-xs opacity-40 uppercase">Gemini AI is generating high-res renders</p>
          </motion.div>
        )}
        {state.step === "reveal" && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RevealScreen 
              images={state.generatedImages} 
              onSelect={handleSelectImage}
              onRegenerate={() => setState(s => ({ ...s, step: "chat" }))}
            />
          </motion.div>
        )}
        {state.step === "finalize" && (
          <motion.div key="finalize" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FinalizeScreen 
              design={state.finalDesign!} 
              onReset={() => setState({ step: "attract", chatHistory: [], generatedImages: [], selectedMaterial: "Leather", selectedColors: { sole: "Default", material: "Default", laces: "Default", overall: "Default" } })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SharePage = ({ designId }: { designId: string }) => {
  const [design, setDesign] = useState<ShoeDesign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/design/${designId}`)
      .then(res => res.json())
      .then(data => {
        setDesign(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [designId]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white font-mono uppercase">Loading...</div>;
  if (!design) return <div className="h-screen bg-black flex items-center justify-center text-white font-mono uppercase">Design Not Found</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <div className="max-w-md w-full space-y-8 mt-12">
        <div className="border border-white/10 p-2 bg-white/5">
          <img src={design.imageUrl} className="w-full aspect-square object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Your SoleAI Design</h1>
          <p className="font-mono text-xs opacity-40 uppercase">Mood: {design.mood} // ID: {design.id}</p>
          <p className="text-sm opacity-80 italic">"{design.prompt}"</p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-8">
          <a 
            href={design.imageUrl} 
            download={`soleai-${design.id}.png`}
            className="flex items-center justify-center gap-2 py-4 bg-white text-black font-bold uppercase text-xs tracking-widest"
          >
            Download
          </a>
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'My SoleAI Shoe Design',
                  text: 'Check out the kicks I designed with AI!',
                  url: window.location.href,
                });
              }
            }}
            className="flex items-center justify-center gap-2 py-4 border border-white/20 font-bold uppercase text-xs tracking-widest"
          >
            Share
          </button>
        </div>
      </div>
      <div className="mt-auto py-12 font-mono text-[10px] opacity-20 uppercase tracking-[0.5em]">
        SoleAI // 2026
      </div>
    </div>
  );
};
