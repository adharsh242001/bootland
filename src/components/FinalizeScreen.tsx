import { motion } from "motion/react";
import { ShoeDesign } from "../types";
import { RefreshCw, Check, Download, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export const RevealScreen = ({ 
  images, 
  onSelect, 
  onRegenerate 
}: { 
  images: string[]; 
  onSelect: (img: string) => void;
  onRegenerate: () => void;
}) => {
  return (
    <div className="min-h-screen bg-[#E4E3E0] p-8">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">The Reveal</h2>
          <p className="mt-4 font-mono text-sm uppercase opacity-60">Step 03 // Select Your Masterpiece</p>
        </div>
        <button 
          onClick={onRegenerate}
          className="flex items-center gap-2 font-mono text-xs uppercase border border-black/20 px-4 py-2 hover:bg-black hover:text-white transition-all"
        >
          <RefreshCw size={14} /> Iterate Design
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            className="group relative aspect-square bg-white border border-black/10 overflow-hidden cursor-pointer"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.2 }}
            onClick={() => onSelect(img)}
          >
            <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest">Select Design</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const FinalizeScreen = ({ 
  design, 
  onReset 
}: { 
  design: ShoeDesign; 
  onReset: () => void;
}) => {
  const shareUrl = `${window.location.origin}/share/${design.id}`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <motion.div 
        className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative aspect-square border border-white/20">
          <img src={design.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute top-4 left-4 font-mono text-[10px] uppercase bg-black/80 px-2 py-1">
            Design ID: {design.id}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4">Design<br/>Finalized</h2>
            <p className="font-mono text-sm text-white/40 uppercase">Your design has been pushed to the main projection.</p>
          </div>

          <div className="p-6 bg-white text-black flex items-center gap-6">
            <div className="bg-white p-2">
              <QRCodeSVG value={shareUrl} size={120} />
            </div>
            <div>
              <p className="font-bold uppercase tracking-tight text-lg">Scan to Download</p>
              <p className="text-xs font-mono opacity-60 mt-1">Take your design with you and share on social.</p>
            </div>
          </div>

          <button 
            onClick={onReset}
            className="w-full py-4 border border-white/20 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            Create Another
          </button>
        </div>
      </motion.div>

      <div className="mt-24 font-mono text-[10px] uppercase opacity-20 tracking-[0.5em]">
        SoleAI // Interactive Experience // 2026
      </div>
    </div>
  );
};
