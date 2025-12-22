import { motion } from "framer-motion";
import { BitDot } from "./BitDot";
import { cn } from "@/lib/utils";

interface NumberRowProps {
  number: number;
  selectedBits: number[];
  isDimmed: boolean;
  isHighlighted: boolean;
  blinkingBit: number | null;
}

export const NumberRow = ({ number, selectedBits, isDimmed, isHighlighted, blinkingBit }: NumberRowProps) => {
  const bits: (1 | 2 | 4 | 8)[] = [8, 4, 2, 1];

  return (
    <motion.div
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300",
        isHighlighted && "bg-gradient-to-r from-primary/20 to-accent/20 ring-2 ring-primary/50",
        isDimmed && "opacity-10"
      )}
      animate={{
        scale: isHighlighted ? 1.05 : 1,
        x: isHighlighted ? 8 : 0,
      }}
      transition={{ duration: 0.25 }}
    >
      <span className={cn(
        "font-mono text-xl font-bold w-8 text-right transition-all duration-300",
        isHighlighted ? "text-accent text-2xl" : "text-foreground/90"
      )}>
        {number}
      </span>
      <div className="flex gap-2">
        {bits.map((bit) => {
          const hasBit = (number & bit) === bit;
          const isBlinking = blinkingBit === bit && hasBit;
          return (
            <BitDot
              key={bit}
              bit={bit}
              isActive={hasBit}
              isHighlighted={selectedBits.includes(bit) && hasBit}
              isBlinking={isBlinking}
            />
          );
        })}
      </div>
    </motion.div>
  );
};
