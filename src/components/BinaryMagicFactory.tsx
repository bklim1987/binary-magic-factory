import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isLocked, setIsLocked] = useState(false);
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
    // Block all interactions while locked
    if (isLocked) return;

    // Clear any existing animations for this bit
    animationTimeouts.current.forEach(clearTimeout);
    animationTimeouts.current = [];

    if (selectedBits.includes(bit)) {
      // Unprint: just clear the card, no animation
      setSelectedBits(prev => prev.filter(b => b !== bit));
      setAnimatingCards(prev => ({ ...prev, [bit]: [] }));
    } else {
      // Lock interactions
      setIsLocked(true);
      
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
            
            // After last number, unlock and clear highlights
            if (index === matchingNums.length - 1) {
              setTimeout(() => {
                setIsLocked(false);
              }, 100);
            }
          }, index * intervalTime);
          animationTimeouts.current.push(timeout);
        });
      }, 2000);
      
      animationTimeouts.current.push(blinkTimeout);
    }
  };

  // Check if any selected bit matches a number - only highlight during blinking or animating
  const getHighlightedBits = (num: number) => {
    // Only highlight if we're in the middle of an animation (blinking or filling)
    const activeBits: number[] = [];
    
    if (blinkingBit && (num & blinkingBit) === blinkingBit) {
      activeBits.push(blinkingBit);
    }
    
    // Also highlight for bits that are still being animated (not fully filled)
    BITS.forEach(bit => {
      if (bit !== blinkingBit && selectedBits.includes(bit)) {
        const matchingNums = getMatchingNumbers(bit);
        const animatedNums = animatingCards[bit];
        // Only highlight if animation is in progress (not complete)
        if (animatedNums.length > 0 && animatedNums.length < matchingNums.length && (num & bit) === bit) {
          activeBits.push(bit);
        }
      }
    });
    
    return activeBits;
  };

  // Sort selected bits for pattern hints: 1, 2, 4, 8 order
  const sortedSelectedBits = useMemo(() => {
    return [...selectedBits].sort((a, b) => a - b);
  }, [selectedBits]);

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
                const isDimmed = (blinkingBit !== null || isLocked) && !isHighlighted;
                
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
                disabled={isLocked}
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

          {/* Pattern Hints - sorted by bit value */}
          <div className="space-y-2">
            <AnimatePresence>
              {sortedSelectedBits.map(bit => (
                <PatternHint key={bit} bit={bit} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
