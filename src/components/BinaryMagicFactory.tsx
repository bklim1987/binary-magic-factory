import { useState, useMemo, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Factory, Sparkles } from "lucide-react";
import { NumberRow } from "./NumberRow";
import { PrintButton } from "./PrintButton";
import { OutputCard } from "./OutputCard";
import { PatternHint } from "./PatternHint";

const NUMBERS = Array.from({ length: 15 }, (_, i) => i + 1);
const BITS: (1 | 2 | 4 | 8)[] = [1, 2, 4, 8];

export const BinaryMagicFactory = () => {
  const [selectedBits, setSelectedBits] = useState<number[]>([]);
  const [blinkingBit, setBlinkingBit] = useState<number | null>(null);
  const [animatingCards, setAnimatingCards] = useState<Record<number, number[]>>({
    1: [],
    2: [],
    4: [],
    8: [],
  });
  const animationTimeouts = useRef<NodeJS.Timeout[]>([]);

  const getMatchingNumbers = useCallback((bit: number) => {
    return NUMBERS.filter((n) => (n & bit) === bit);
  }, []);

  const cardNumbers = useMemo(() => ({
    1: selectedBits.includes(1) ? getMatchingNumbers(1) : [],
    2: selectedBits.includes(2) ? getMatchingNumbers(2) : [],
    4: selectedBits.includes(4) ? getMatchingNumbers(4) : [],
    8: selectedBits.includes(8) ? getMatchingNumbers(8) : [],
  }), [selectedBits, getMatchingNumbers]);

  const handlePrint = (bit: number) => {
    // Clear any existing animations for this bit
    animationTimeouts.current.forEach(clearTimeout);
    animationTimeouts.current = [];

    if (selectedBits.includes(bit)) {
      // Deselect
      setSelectedBits(prev => prev.filter(b => b !== bit));
      setAnimatingCards(prev => ({ ...prev, [bit]: [] }));
    } else {
      // Select and animate
      setSelectedBits(prev => [...prev, bit]);
      setBlinkingBit(bit);
      
      // After 2 seconds of blinking, start populating the card
      const blinkTimeout = setTimeout(() => {
        setBlinkingBit(null);
        
        const matchingNums = getMatchingNumbers(bit);
        const intervalTime = 4000 / matchingNums.length;
        
        matchingNums.forEach((num, index) => {
          const timeout = setTimeout(() => {
            setAnimatingCards(prev => ({
              ...prev,
              [bit]: [...prev[bit], num]
            }));
          }, index * intervalTime);
          animationTimeouts.current.push(timeout);
        });
      }, 2000);
      
      animationTimeouts.current.push(blinkTimeout);
    }
  };

  // Check if any selected bit matches a number
  const getHighlightedBits = (num: number) => {
    return selectedBits.filter(bit => (num & bit) === bit);
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
          Pick colors to see which numbers contain those magic bits!
        </p>
      </motion.header>

      {/* Main Stage */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Number List (X-Ray Scanner) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 w-full lg:w-auto"
        >
          <div className="bg-card/50 rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-border">
            {/* Number rows */}
            <div className="space-y-1">
              {NUMBERS.map((num) => {
                const highlightedBits = getHighlightedBits(num);
                const isHighlighted = highlightedBits.length > 0;
                const isDimmed = selectedBits.length > 0 && !isHighlighted;
                
                return (
                  <NumberRow
                    key={num}
                    number={num}
                    selectedBits={selectedBits}
                    isDimmed={isDimmed}
                    isHighlighted={isHighlighted}
                    blinkingBit={blinkingBit}
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
          className="w-full lg:w-[500px] space-y-5"
        >
          <div className="text-center text-muted-foreground mb-2">
            Click buttons to print cards (multi-select):
          </div>

          {/* Print Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {BITS.map((bit) => (
              <PrintButton
                key={bit}
                bit={bit}
                label={`Print ${bit}s ${bit === 1 ? "🔴" : bit === 2 ? "🟢" : bit === 4 ? "🔵" : "🟡"}`}
                isActive={selectedBits.includes(bit)}
                isBlinking={blinkingBit === bit}
                onClick={() => handlePrint(bit)}
              />
            ))}
          </div>

          {/* 4 Output Cards in Grid */}
          <div className="grid grid-cols-2 gap-4">
            {BITS.map((bit) => (
              <OutputCard
                key={bit}
                bit={bit}
                numbers={cardNumbers[bit]}
                isAnimating={blinkingBit === bit || animatingCards[bit].length < cardNumbers[bit].length}
                animatedNumbers={animatingCards[bit]}
              />
            ))}
          </div>

          {/* Pattern Hints */}
          <div className="space-y-2">
            {selectedBits.map(bit => (
              <PatternHint key={bit} selectedBit={bit} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
