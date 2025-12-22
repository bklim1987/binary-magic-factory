import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Factory, Sparkles } from "lucide-react";
import { NumberRow } from "./NumberRow";
import { PrintButton } from "./PrintButton";
import { OutputCard } from "./OutputCard";
import { PatternHint } from "./PatternHint";

const NUMBERS = Array.from({ length: 15 }, (_, i) => i + 1);

export const BinaryMagicFactory = () => {
  const [selectedBit, setSelectedBit] = useState<number | null>(null);

  const matchingNumbers = useMemo(() => {
    if (!selectedBit) return [];
    return NUMBERS.filter((n) => (n & selectedBit) === selectedBit);
  }, [selectedBit]);

  const handlePrint = (bit: number) => {
    setSelectedBit(selectedBit === bit ? null : bit);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Factory className="w-10 h-10 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Binary Magic Factory
          </h1>
          <Sparkles className="w-8 h-8 text-accent" />
        </div>
        <p className="text-muted-foreground text-lg">
          Pick a color to see which numbers contain that magic bit!
        </p>
      </motion.header>

      {/* Main Stage */}
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Number List (X-Ray Scanner) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 w-full lg:w-auto"
        >
          <div className="bg-card/50 rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-border">
            {/* Header row */}
            <div className="flex justify-end pr-4 mb-2 gap-2">
              <span className="w-6 text-center text-xs font-mono text-muted-foreground">8</span>
              <span className="w-6 text-center text-xs font-mono text-muted-foreground">4</span>
              <span className="w-6 text-center text-xs font-mono text-muted-foreground">2</span>
              <span className="w-6 text-center text-xs font-mono text-muted-foreground">1</span>
            </div>

            {/* Number rows */}
            <div className="space-y-1">
              {NUMBERS.map((num) => {
                const hasBit = selectedBit ? (num & selectedBit) === selectedBit : false;
                return (
                  <NumberRow
                    key={num}
                    number={num}
                    selectedBit={selectedBit}
                    isDimmed={selectedBit !== null && !hasBit}
                    isHighlighted={hasBit}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right: Factory Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-[340px] space-y-5"
        >
          <div className="text-center text-muted-foreground mb-2">
            Click a button to start printing:
          </div>

          {/* Print Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <PrintButton
              bit={1}
              label="Print 1s 🔴"
              isActive={selectedBit === 1}
              onClick={() => handlePrint(1)}
            />
            <PrintButton
              bit={2}
              label="Print 2s 🟢"
              isActive={selectedBit === 2}
              onClick={() => handlePrint(2)}
            />
            <PrintButton
              bit={4}
              label="Print 4s 🔵"
              isActive={selectedBit === 4}
              onClick={() => handlePrint(4)}
            />
            <PrintButton
              bit={8}
              label="Print 8s 🟡"
              isActive={selectedBit === 8}
              onClick={() => handlePrint(8)}
            />
          </div>

          {/* Output Card */}
          <OutputCard selectedBit={selectedBit} numbers={matchingNumbers} />

          {/* Pattern Hint */}
          <PatternHint selectedBit={selectedBit} />
        </motion.div>
      </div>
    </div>
  );
};
