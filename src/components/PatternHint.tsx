import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface PatternHintProps {
  selectedBit: number | null;
}

const patterns: Record<number, string> = {
  1: "Pattern: Every other one (odd numbers)!",
  2: "Pattern: 2 ON, 2 OFF, 2 ON, 2 OFF...",
  4: "Pattern: 4 ON, 4 OFF, 4 ON, 4 OFF...",
  8: "Pattern: All the big numbers (8-15)!",
};

export const PatternHint = ({ selectedBit }: PatternHintProps) => {
  return (
    <AnimatePresence mode="wait">
      {selectedBit && (
        <motion.div
          key={selectedBit}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-accent text-accent-foreground px-4 py-3 rounded-lg flex items-center gap-3 font-semibold"
        >
          <Lightbulb className="w-5 h-5 flex-shrink-0" />
          <span>{patterns[selectedBit]}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
