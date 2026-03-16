import { motion } from "motion/react";

export const AttractScreen = ({ onStart }: { onStart: () => void }) => {
  return (
    <div 
      className="relative h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden cursor-pointer"
      onClick={onStart}
    >
      {/* Background Looping Visuals */}
      <div className="absolute inset-0 opacity-40">
        <motion.img
          src="https://picsum.photos/seed/sneaker1/1920/1080"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.h1 
          className="text-[20vw] font-black leading-[0.8] text-white uppercase tracking-tighter"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Sole<span className="text-emerald-500">AI</span>
        </motion.h1>
        
        <motion.p 
          className="mt-8 text-xl text-white/60 font-mono uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Design Your Future Kicks
        </motion.p>

        <motion.div 
          className="mt-12 inline-block px-8 py-4 border border-white/20 rounded-full text-white font-medium uppercase tracking-wider backdrop-blur-sm hover:bg-white hover:text-black transition-colors"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Tap to Start
        </motion.div>
      </div>

      {/* Brutalist Accents */}
      <div className="absolute bottom-12 left-12 font-mono text-xs text-white/40 uppercase vertical-rl rotate-180">
        Interactive Experience // 2026
      </div>
      <div className="absolute top-12 right-12 font-mono text-xs text-white/40 uppercase">
        AI-Powered Design Studio
      </div>
    </div>
  );
};
