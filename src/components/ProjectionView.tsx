import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoeDesign } from "../types";
import { io } from "socket.io-client";

export const ProjectionView = () => {
  const [designs, setDesigns] = useState<ShoeDesign[]>([]);
  const [currentDesign, setCurrentDesign] = useState<ShoeDesign | null>(null);

  useEffect(() => {
    const socket = io();

    socket.on("init-designs", (initialDesigns: ShoeDesign[]) => {
      setDesigns(initialDesigns);
    });

    socket.on("new-design", (design: ShoeDesign) => {
      setDesigns(prev => [design, ...prev].slice(0, 50));
      setCurrentDesign(design);
      
      // Clear current design after 15 seconds to return to gallery
      setTimeout(() => {
        setCurrentDesign(null);
      }, 15000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden relative">
      <AnimatePresence mode="wait">
        {currentDesign ? (
          <motion.div 
            key={currentDesign.id}
            className="absolute inset-0 flex items-center justify-center p-24"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="relative w-full h-full border border-white/10 flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-grow h-full relative">
                <img 
                  src={currentDesign.imageUrl} 
                  className="w-full h-full object-contain" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="w-full md:w-1/3 space-y-8">
                <h2 className="text-8xl font-black uppercase tracking-tighter leading-none">
                  New<br/><span className="text-emerald-500">Design</span>
                </h2>
                <div className="space-y-4">
                  <p className="font-mono text-sm uppercase opacity-40">Mood: {currentDesign.mood}</p>
                  <p className="text-2xl font-light italic opacity-80">"{currentDesign.prompt}"</p>
                </div>
                <div className="pt-12 border-t border-white/10">
                  <p className="font-mono text-xs uppercase tracking-widest opacity-40">SoleAI // Live Design Feed</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="gallery"
            className="absolute inset-0 p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Hall of Fame</h2>
              <p className="font-mono text-xs uppercase opacity-40">Recent Creations</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {designs.length > 0 ? (
                designs.map((design, idx) => (
                  <motion.div
                    key={design.id}
                    className="aspect-square bg-white/5 border border-white/10 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <img src={design.imageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full h-96 flex items-center justify-center border border-dashed border-white/10">
                  <p className="font-mono text-sm uppercase opacity-20 animate-pulse">Waiting for designs...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  );
};
