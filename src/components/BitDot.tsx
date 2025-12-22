import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BitDotProps {
  bit: 1 | 2 | 4 | 8;
  isActive: boolean;
  isHighlighted?: boolean;
  isBlinking?: boolean;
}

const bitConfig = {
  1: { color: "bg-bit-1", glow: "bit-glow-1", text: "text-background" },
  2: { color: "bg-bit-2", glow: "bit-glow-2", text: "text-background" },
  4: { color: "bg-bit-4", glow: "bit-glow-4", text: "text-background" },
  8: { color: "bg-bit-8", glow: "bit-glow-8", text: "text-background" },
};

export const BitDot = ({ bit, isActive, isHighlighted, isBlinking }: BitDotProps) => {
  const config = bitConfig[bit];

  return (
    <motion.div
      className={cn(
        "w-8 h-8 rounded-md border transition-all duration-300 flex items-center justify-center font-mono font-bold text-sm",
        isActive
          ? cn(config.color, "border-transparent", config.text)
          : "bg-secondary/30 border-border/50 text-muted-foreground/30",
        isActive && isHighlighted && config.glow
      )}
      animate={{
        opacity: isBlinking 
          ? [1, 0.3, 1, 0.3, 1, 0.3, 1] 
          : isActive ? 1 : 0.3,
        scale: isActive && isHighlighted ? 1.1 : 1,
      }}
      transition={{ 
        duration: isBlinking ? 2 : 0.2,
        ease: "easeInOut"
      }}
    >
      {bit}
    </motion.div>
  );
};
