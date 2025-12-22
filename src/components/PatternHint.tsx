import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface PatternHintProps {
  bit: number;
}

const patterns: Record<number, string> = {
  1: "Pattern: Every other one (odd numbers)!",
  2: "Pattern: 2 ON, 2 OFF, 2 ON, 2 OFF...",
  4: "Pattern: 4 ON, 4 OFF, 4 ON, 4 OFF...",
  8: "Pattern: All the big numbers (8-15)!",
};

const bitColors: Record<number, string> = {
  1: "bg-bit-1 text-white",
  2: "bg-bit-2 text-white",
  4: "bg-bit-4 text-white",
  8: "bg-bit-8 text-foreground",
};

export const PatternHint = ({ bit }: PatternHintProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`${bitColors[bit]} px-4 py-3 rounded-lg flex items-center gap-3 font-semibold`}
    >
      <Lightbulb className="w-5 h-5 flex-shrink-0" />
      <span>{patterns[bit]}</span>
    </motion.div>
  );
};
