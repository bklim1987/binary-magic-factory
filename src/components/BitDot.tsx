import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BitDotProps {
  bit: 1 | 2 | 4 | 8;
  isActive: boolean;
  isHighlighted?: boolean;
}

const bitConfig = {
  1: { color: "bg-bit-1", glow: "bit-glow-1" },
  2: { color: "bg-bit-2", glow: "bit-glow-2" },
  4: { color: "bg-bit-4", glow: "bit-glow-4" },
  8: { color: "bg-bit-8", glow: "bit-glow-8" },
};

export const BitDot = ({ bit, isActive, isHighlighted }: BitDotProps) => {
  const config = bitConfig[bit];

  return (
    <motion.div
      className={cn(
        "w-6 h-6 rounded-md border transition-all duration-300",
        isActive
          ? cn(config.color, "border-transparent")
          : "bg-secondary/30 border-border/50",
        isActive && isHighlighted && config.glow
      )}
      animate={{
        opacity: isActive ? 1 : 0.2,
        scale: isActive && isHighlighted ? 1.1 : 1,
      }}
      transition={{ duration: 0.2 }}
    />
  );
};
