"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function InteractiveDeskBackground() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Extremely smooth spring config for luxurious feeling
  const springConfig = { damping: 50, stiffness: 100, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize from -1 to 1 for calculation
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Parallax calculations (inverse movement for background feeling)
  // Far background element (moves least)
  const bg1X = useTransform(smoothX, [-1, 1], [15, -15]);
  const bg1Y = useTransform(smoothY, [-1, 1], [15, -15]);
  const bg1Rot = useTransform(smoothX, [-1, 1], [-10, -14]);

  // Midground element (moves medium)
  const bg2X = useTransform(smoothX, [-1, 1], [-25, 25]);
  const bg2Y = useTransform(smoothY, [-1, 1], [-25, 25]);
  const bg2Rot = useTransform(smoothX, [-1, 1], [-4, -8]);

  // Foreground decorative element (moves most)
  const bg3X = useTransform(smoothX, [-1, 1], [40, -40]);
  const bg3Y = useTransform(smoothY, [-1, 1], [40, -40]);
  const bg3Rot = useTransform(smoothX, [-1, 1], [10, 16]);

  if (!mounted) {
    return <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#FCFBF9] to-[#F4F2EE]" />;
  }

  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#FCFBF9] to-[#F4F2EE] overflow-hidden pointer-events-none">
      
      {/* 
        Shape 1: Top Left Large Card 
        Provides the main framing behind the large heading
      */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-[10%] -left-[10vw] w-[50vw] h-[60vh] max-w-[500px] bg-white rounded-3xl shadow-[40px_40px_100px_rgba(45,42,38,0.06)] border border-ink/5"
        style={{
          x: bg1X,
          y: bg1Y,
          rotate: bg1Rot,
          transformOrigin: "center center",
        }}
      />

      {/* 
        Shape 2: Bottom Right Secondary Card
        Frames the bottom text and buttons
      */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="absolute bottom-[0%] -right-[5vw] w-[40vw] h-[55vh] max-w-[450px] bg-[#FAFAFA] rounded-2xl shadow-[20px_30px_80px_rgba(45,42,38,0.05)] border border-ink/[0.03] backdrop-blur-sm"
        style={{
          x: bg2X,
          y: bg2Y,
          rotate: bg2Rot,
          transformOrigin: "bottom right",
        }}
      />

      {/* 
        Shape 3: Accent Element
        A subtle, blurred shape to give optical depth
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-[60%] left-[10%] w-[15vw] aspect-square bg-[#FFFFFF] rounded-full blur-[4px] shadow-2xl opacity-60"
        style={{
          x: bg3X,
          y: bg3Y,
          rotate: bg3Rot,
        }}
      >
        <div className="absolute inset-2 border border-ink/[0.02] rounded-full" />
      </motion.div>

    </div>
  );
}
