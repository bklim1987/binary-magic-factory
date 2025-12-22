import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, Unlock, Sparkles } from "lucide-react";
import { BinaryInputRow } from "./BinaryInputRow";
import { cn } from "@/lib/utils";

interface Phase2PanelProps {
  onComplete: () => void;
  isActive: boolean;
}

const NUMBERS = Array.from({ length: 15 }, (_, i) => i + 1);

export const Phase2Panel = ({ onComplete, isActive }: Phase2PanelProps) => {
  const [rowStates, setRowStates] = useState<Record<number, number[]>>(() =>
    Object.fromEntries(NUMBERS.map(n => [n, []]))
  );
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  const completedRows = useMemo(() => {
    return NUMBERS.filter(num => {
      const bits = rowStates[num];
      const sum = bits.reduce((s, b) => s + b, 0);
      return sum === num;
    });
  }, [rowStates]);

  const allComplete = completedRows.length === 15;

  useEffect(() => {
    if (allComplete && isActive) {
      setShowUnlockAnimation(true);
      const timer = setTimeout(() => {
        setShowUnlockAnimation(false);
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [allComplete, isActive, onComplete]);

  const handleToggleBit = (number: number, bit: number) => {
    if (!isActive) return;
    setRowStates(prev => ({
      ...prev,
      [number]: prev[number].includes(bit)
        ? prev[number].filter(b => b !== bit)
        : [...prev[number], bit]
    }));
  };

  return (
    <div className="flex-1 w-full lg:w-auto">
      <div className="bg-card/50 rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-border relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            {isActive ? <Unlock className="w-5 h-5 text-accent" /> : <Lock className="w-5 h-5 text-muted-foreground" />}
            Phase 2: Light Up the Bits
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={cn(
              "font-bold",
              allComplete ? "text-accent" : completedRows.length > 0 ? "text-primary" : ""
            )}>
              {completedRows.length}/15
            </span>
          </div>
        </div>

        {/* Progress checkmarks grid */}
        <div className="flex flex-wrap gap-1 mb-4">
          {NUMBERS.map(num => (
            <motion.div
              key={num}
              initial={{ scale: 0 }}
              animate={{ 
                scale: completedRows.includes(num) ? 1 : 0.5,
                opacity: completedRows.includes(num) ? 1 : 0.2
              }}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                completedRows.includes(num) 
                  ? "bg-accent text-accent-foreground" 
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {completedRows.includes(num) ? <Check className="w-3 h-3" /> : num}
            </motion.div>
          ))}
        </div>

        {/* Input rows */}
        <div className="space-y-1">
          {NUMBERS.map((num) => (
            <BinaryInputRow
              key={num}
              number={num}
              activeBits={rowStates[num]}
              onToggleBit={(bit) => handleToggleBit(num, bit)}
              isComplete={completedRows.includes(num)}
              isDisabled={!isActive || showUnlockAnimation}
            />
          ))}
        </div>

        {/* Unlock animation overlay */}
        <AnimatePresence>
          {showUnlockAnimation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mb-4"
              >
                <Unlock className="w-20 h-20 text-accent" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-accent flex items-center gap-2"
              >
                <Sparkles className="w-6 h-6" />
                Factory Unlocked!
                <Sparkles className="w-6 h-6" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground mt-2"
              >
                Now try the magic cards...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
