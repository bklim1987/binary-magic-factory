import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BinaryInputRowProps {
  number: number;
  activeBits: number[];
  onToggleBit: (bit: number) => void;
  isComplete: boolean;
  isDisabled: boolean;
}

const BITS: (1 | 2 | 4 | 8)[] = [8, 4, 2, 1];

const bitConfig: Record<number, { color: string; dimColor: string }> = {
  1: { color: "bg-bit-1", dimColor: "bg-bit-1/20" },
  2: { color: "bg-bit-2", dimColor: "bg-bit-2/20" },
  4: { color: "bg-bit-4", dimColor: "bg-bit-4/20" },
  8: { color: "bg-bit-8", dimColor: "bg-bit-8/20" },
};

export const BinaryInputRow = ({ 
  number, 
  activeBits, 
  onToggleBit, 
  isComplete,
  isDisabled 
}: BinaryInputRowProps) => {
  const currentSum = activeBits.reduce((sum, bit) => sum + bit, 0);
  const isCorrect = currentSum === number;

  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300",
      isComplete && "bg-accent/10"
    )}>
      <span className={cn(
        "font-mono text-lg font-bold w-8 text-right transition-colors",
        isComplete ? "text-accent" : "text-foreground/70"
      )}>
        {number}
      </span>
      
      <div className="flex gap-2">
        {BITS.map((bit) => {
          const isActive = activeBits.includes(bit);
          const config = bitConfig[bit];
          
          return (
            <motion.button
              key={bit}
              disabled={isDisabled}
              onClick={() => onToggleBit(bit)}
              className={cn(
                "w-8 h-8 rounded-md border transition-all duration-200 flex items-center justify-center font-mono font-bold text-sm",
                isActive 
                  ? `${config.color} border-transparent text-background` 
                  : `${config.dimColor} border-border/50 text-muted-foreground`,
                !isDisabled && "hover:scale-105 hover:brightness-110 cursor-pointer",
                isDisabled && "cursor-not-allowed opacity-50"
              )}
              whileTap={{ scale: 0.95 }}
            >
              {bit}
            </motion.button>
          );
        })}
      </div>

      {/* Equals sign and sum */}
      <span className="text-muted-foreground font-mono">=</span>
      <span className={cn(
        "font-mono font-bold w-6 transition-colors",
        isCorrect ? "text-accent" : "text-foreground/50"
      )}>
        {currentSum}
      </span>
    </div>
  );
};
