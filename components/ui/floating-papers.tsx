"use client";

import { motion } from "framer-motion";

export function FloatingPapers() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top Left Paper */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [12, 18, 12], x: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[18%] left-[12%] w-16 h-20 bg-[#F0EBE0] shadow-md blur-[3px] opacity-70 border border-white/40"
        style={{ borderRadius: "2px 8px 2px 2px" }}
      >
          {/* Faux paper curl shading */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent" />
      </motion.div>
      
      {/* Top Right Paper */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [-24, -18, -24], x: [0, -15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[22%] right-[10%] xl:right-[15%] w-24 h-24 bg-[#EBE4D5] shadow-lg blur-[5px] opacity-60 border border-white/30"
        style={{ borderRadius: "16px 2px 2px 10px" }}
      >
          <div className="absolute inset-0 bg-gradient-to-bl from-black/5 to-transparent" />
      </motion.div>

      {/* Bottom Left Paper */}
      <motion.div
        animate={{ y: [0, 25, 0], rotate: [-40, -48, -40] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[25%] left-[10%] xl:left-[15%] w-12 h-16 bg-[#E9E1D2] shadow-sm blur-[2px] opacity-80 border border-white/50"
        style={{ borderRadius: "2px 2px 8px 2px" }}
      />

      {/* Bottom Right Paper */}
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [55, 45, 55], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute -bottom-[5%] right-[10%] xl:right-[20%] w-40 h-48 bg-[#F0EBE0] shadow-2xl blur-[8px] opacity-90 border border-white/20"
        style={{ borderRadius: "4px 20px 4px 4px" }}
      >
          <div className="absolute inset-0 bg-gradient-to-t from-black/[0.03] to-white/10" />
      </motion.div>
    </div>
  );
}
