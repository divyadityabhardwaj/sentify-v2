"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { TextScramble } from "./ui/text-scramble";

interface HeroSectionProps {
  onStartClick: () => void;
}

export default function HeroSection({ onStartClick }: HeroSectionProps) {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center min-h-[60vh] max-w-5xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center p-8 md:p-16 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl"
      >
        <div className="mb-8 flex flex-col items-center gap-2">
          <h2 className="text-xl md:text-2xl font-medium text-blue-200 tracking-widest uppercase mb-2">
            <TextScramble duration={1.5} speed={0.1} trigger={true}>
              Decode Sentiment
            </TextScramble>
          </h2>
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter drop-shadow-lg">
            <TextScramble
              duration={2}
              speed={0.1}
              trigger={true}
              className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
            >
              SENTIFY
            </TextScramble>
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
        >
          Advanced sentiment analysis for text and YouTube comments.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartClick}
            className="group px-10 py-4 bg-white text-black rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3),0_4px_0_rgba(200,200,200,1),0_8px_16px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5),0_4px_0_rgba(200,200,200,1),0_12px_24px_rgba(0,0,0,0.5)] active:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3),0_0_0_rgba(200,200,200,1),0_2px_4px_rgba(0,0,0,0.4)] active:translate-y-1"
          >
            Start Analyzing
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
