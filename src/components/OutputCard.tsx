import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface OutputCardProps {
  bit: 1 | 2 | 4 | 8;
  numbers: number[];
  isAnimating: boolean;
  animatedNumbers: number[];
}

const bitInfo: Record<number, { name: string; color: string; border: string; bg: string }> = {
  1: { name: "Red Card (1)", color: "text-bit-1", border: "border-bit-1", bg: "bg-bit-1/10" },
  2: { name: "Green Card (2)", color: "text-bit-2", border: "border-bit-2", bg: "bg-bit-2/10" },
  4: { name: "Blue Card (4)", color: "text-bit-4", border: "border-bit-4", bg: "bg-bit-4/10" },
  8: { name: "Yellow Card (8)", color: "text-bit-8", border: "border-bit-8", bg: "bg-bit-8/10" },
};

export const OutputCard = ({ bit, numbers, isAnimating, animatedNumbers }: OutputCardProps) => {
  const info = bitInfo[bit];
  const displayNumbers = isAnimating ? animatedNumbers : numbers;

  return (
    <motion.div
      className={cn(
        "bg-card min-h-[200px] rounded-xl p-4 flex flex-col transition-all duration-300",
        info.border,
        "border-2"
      )}
      layout
    >
      <h3
        className={cn(
          "text-lg font-bold text-center mb-3 transition-colors",
          info.color
        )}
      >
        {info.name}
      </h3>
      
      <div className="grid grid-cols-4 gap-2 flex-1">
        <AnimatePresence mode="popLayout">
          {displayNumbers.map((num) => (
            <motion.div
              key={`${bit}-${num}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 500,
                damping: 25
              }}
              className={cn(
                "flex items-center justify-center rounded-lg font-mono font-bold text-lg h-12",
                info.bg,
                `border ${info.border}`,
                info.color
              )}
            >
              {num}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
