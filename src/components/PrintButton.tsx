import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PrintButtonProps {
  bit: 1 | 2 | 4 | 8;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const bitStyles = {
  1: { bg: "bg-bit-1", hover: "hover:bg-bit-1/90", glow: "bit-glow-1" },
  2: { bg: "bg-bit-2", hover: "hover:bg-bit-2/90", glow: "bit-glow-2" },
  4: { bg: "bg-bit-4", hover: "hover:bg-bit-4/90", glow: "bit-glow-4" },
  8: { bg: "bg-bit-8", hover: "hover:bg-bit-8/90", glow: "bit-glow-8" },
};

export const PrintButton = ({ bit, label, isActive, onClick }: PrintButtonProps) => {
  const styles = bitStyles[bit];

  return (
    <motion.button
      className={cn(
        "px-4 py-3 rounded-lg font-semibold text-background transition-all",
        "shadow-lg active:shadow-none active:translate-y-1",
        styles.bg,
        styles.hover,
        isActive && styles.glow
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
};
