import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface OutputCardProps {
  selectedBit: number | null;
  numbers: number[];
}

const bitInfo: Record<number, { name: string; color: string; border: string }> = {
  1: { name: "Red Card (1)", color: "text-bit-1", border: "border-bit-1" },
  2: { name: "Green Card (2)", color: "text-bit-2", border: "border-bit-2" },
  4: { name: "Blue Card (4)", color: "text-bit-4", border: "border-bit-4" },
  8: { name: "Yellow Card (8)", color: "text-bit-8", border: "border-bit-8" },
};

export const OutputCard = ({ selectedBit, numbers }: OutputCardProps) => {
  const info = selectedBit ? bitInfo[selectedBit] : null;

  return (
    <motion.div
      className={cn(
        "bg-foreground/95 min-h-[280px] rounded-xl p-5 flex flex-col transition-all duration-300",
        info ? info.border : "border-muted-foreground/30",
        "border-4"
      )}
      layout
    >
      <h3
        className={cn(
          "text-xl font-bold text-center mb-4 transition-colors",
          info ? info.color : "text-muted-foreground"
        )}
      >
        {info ? info.name : "Select a Card"}
      </h3>
      
      <div className="flex flex-wrap gap-2 justify-center flex-1 content-start">
        <AnimatePresence mode="popLayout">
          {numbers.map((num, index) => (
            <motion.div
              key={`${selectedBit}-${num}`}
              initial={{ scale: 0, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                delay: index * 0.08,
                type: "spring",
                stiffness: 500,
                damping: 25
              }}
              className={cn(
                "px-4 py-2 rounded-lg font-mono font-bold text-lg",
                "bg-background/10 backdrop-blur-sm",
                info && `border-2 ${info.border}`
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
