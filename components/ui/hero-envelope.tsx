"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export function HeroEnvelope() {
  return (
    <div className="relative perspective-[1500px] pointer-events-none z-10 flex items-center justify-center scale-75 md:scale-100">
      
      {/* Floor Shadow */}
      <motion.div 
        animate={{ scale: [1, 0.95, 1], opacity: [0.08, 0.05, 0.08] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-10 left-[15%] w-[80%] h-24 bg-black blur-2xl rounded-[100%] scale-y-[0.3]"
      />

      {/* Floating Envelope Body */}
      <motion.div
         animate={{ 
          y: [0, -15, 0],
          rotateZ: [-14, -12, -14],
          rotateX: [25, 20, 25],
          rotateY: [-15, -12, -15]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-[380px] h-[240px] drop-shadow-2xl"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Soft dark shadow behind the envelope itself for depth */}
        <div className="absolute inset-0 bg-black/10 rounded-sm blur-md translate-y-4 translate-x-2 -z-10" />

        {/* Envelope Base Layer */}
        <div className="absolute inset-0 bg-[#E8E1D3] rounded-[4px] overflow-hidden border border-white/30">
           {/* Fine paper texture */}
           <div className="absolute inset-0 opacity-[0.08] mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E')" }} />
        </div>

        {/* Bottom Flap */}
        <div 
           className="absolute bottom-0 inset-x-0 h-[65%] bg-[#DED6C4] drop-shadow-[0_-4px_10px_rgba(0,0,0,0.06)] origin-bottom rounded-b-[4px]" 
           style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)", zIndex: 2 }} 
        />

        {/* Internal dark gradient (creates depth where flaps meet) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/[0.04] to-transparent z-[1]" />

        {/* Left Flap */}
        <div 
           className="absolute inset-y-0 left-0 w-[50%] bg-gradient-to-r from-[#DFD7C6] to-[#E5DECD] drop-shadow-md origin-left rounded-l-[4px]" 
           style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)", zIndex: 3 }} 
        />
        
        {/* Right Flap */}
        <div 
           className="absolute inset-y-0 right-0 w-[50%] bg-gradient-to-l from-[#DFD6C3] to-[#E7E0D0] drop-shadow-md origin-right rounded-r-[4px]" 
           style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)", zIndex: 3 }} 
        />
        
        {/* Top Flap (over everything) */}
        <div 
           className="absolute top-0 inset-x-0 h-[55%] bg-[#EBE4D5] z-[4] border-b border-white/20 origin-top rounded-t-[4px]" 
           style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        >
             {/* Realistic lighting on top flap (brighter top-left to darker bottom-right) */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/[0.05]" />
        </div>
        
        {/* Drop shadow for the top flap specifically */}
        <div 
           className="absolute top-0 inset-x-0 h-[55%] pointer-events-none z-[3]" 
           style={{ filter: "drop-shadow(0px 6px 8px rgba(0,0,0,0.08))" }}
        >
            <div className="w-full h-full bg-black/50" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
        </div>

        {/* Wax Seal - Identical to screenshot styling */}
        <div className="absolute top-[52%] left-[49%] -translate-x-1/2 -translate-y-1/2 w-[55px] h-[55px] bg-[#D1C3AD] rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.18)] z-[5] flex items-center justify-center border border-[#E9E0D1] overflow-hidden drop-shadow-sm">
           {/* Gloss/Lighting on the wax */}
           <div className="absolute inset-0 bg-gradient-to-tl from-black/10 via-transparent to-white/40" />
           
           {/* Inner depressed ring */}
           <div className="w-[42px] h-[42px] border-[1.5px] border-[#C3B39C] rounded-full flex items-center justify-center z-10 shadow-inner bg-[#CCC0AA] relative overflow-hidden">
               {/* Lighting specifically for inner ring */}
               <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
               <Mail size={16} className="text-[#A29683] z-10 -mt-0.5 opacity-90" />
           </div>
           
           {/* Faux Wax Imperfections */}
           <div className="absolute top-1 left-[15px] w-4 h-2 bg-[#DED1BF] rounded-full blur-[1px] opacity-80" />
           <div className="absolute bottom-1 right-2 w-3 h-3 bg-[#C4B49C] rounded-full blur-[1px] opacity-60" />
           <div className="absolute top-1/2 -right-1 w-3 h-4 bg-[#D1C3AD] rounded-full blur-[0.5px]" />
           <div className="absolute bottom-0 -left-1 w-4 h-3 bg-[#D1C3AD] rounded-full blur-[0.5px]" />
        </div>
        
      </motion.div>
    </div>
  );
}
