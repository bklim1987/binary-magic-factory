import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Factory, Sparkles, Lock } from "lucide-react";
import { NumberRow } from "./NumberRow";
import { PrintButton } from "./PrintButton";
import { OutputCard } from "./OutputCard";
import { PatternHint } from "./PatternHint";
import { Phase2Panel } from "./Phase2Panel";

const NUMBERS = Array.from({ length: 15 }, (_, i) => i + 1);
const BITS: (1 | 2 | 4 | 8)[] = [1, 2, 4, 8];

export const BinaryMagicFactory = () => {
  // Phase control - starts at Phase 1 (puzzle), then unlocks Phase 2 (cards)
  const [phase2Unlocked, setPhase2Unlocked] = useState(false);
  
  const [selectedBits, setSelectedBits] = useState<number[]>([]);
  const [blinkingBit, setBlinkingBit] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [animatingCards, setAnimatingCards] = useState<Record<number, number[]>>({
    1: [],
    2: [],
    4: [],
    8: [],
  });
  const [selectedCardBits, setSelectedCardBits] = useState<number[]>([]);
  const [completedCards, setCompletedCards] = useState<number[]>([]);
  
  // Check if all 4 cards are completed
  const allCardsCompleted = completedCards.length === 4;
  const animationTimeouts = useRef<NodeJS.Timeout[]>([]);

  const handlePhase1Complete = useCallback(() => {
    setPhase2Unlocked(true);
  }, []);

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
      // Unprint: clear the card and ALL checkboxes/highlights
      setSelectedBits(prev => prev.filter(b => b !== bit));
      setAnimatingCards(prev => ({ ...prev, [bit]: [] }));
      setCompletedCards(prev => prev.filter(b => b !== bit));
      // Clear ALL selected card bits when any card is cleared
      setSelectedCardBits([]);
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
            
            // After last number, unlock and mark card as completed
            if (index === matchingNums.length - 1) {
              setTimeout(() => {
                setIsLocked(false);
                setCompletedCards(prev => [...prev, bit]);
              }, 100);
            }
          }, index * intervalTime);
          animationTimeouts.current.push(timeout);
        });
      }, 2000);
      
      animationTimeouts.current.push(blinkTimeout);
    }
  };

  const handleCardSelect = (bit: number) => {
    // Only allow selection when all 4 cards are completed
    if (!allCardsCompleted) return;
    setSelectedCardBits(prev => 
      prev.includes(bit) ? prev.filter(b => b !== bit) : [...prev, bit]
    );
  };

  // Calculate the sum of selected card bits
  const selectedBitsSum = useMemo(() => {
    return selectedCardBits.reduce((sum, bit) => sum + bit, 0);
  }, [selectedCardBits]);

  // Check if any selected bit matches a number - highlight during animation or card selection
  const getHighlightedBits = (num: number) => {
    const activeBits: number[] = [];
    
    // Highlight during blinking phase
    if (blinkingBit && (num & blinkingBit) === blinkingBit) {
      activeBits.push(blinkingBit);
    }
    
    // Highlight for bits that are currently printing (until card is marked as completed)
    // Keep highlight on until all 8 numbers are displayed AND card is marked completed
    BITS.forEach(bit => {
      if (bit === blinkingBit) return;
      if (!selectedBits.includes(bit)) return;

      const currentLen = animatingCards[bit].length;
      const isStillPrinting = currentLen > 0 && !completedCards.includes(bit);

      if (isStillPrinting && (num & bit) === bit) {
        activeBits.push(bit);
      }
    });
    
    // Highlight ONLY the number that equals the sum of selected bits
    // e.g., if green(2) selected -> highlight only 2
    // if green(2) + red(1) selected -> highlight only 3
    if (selectedCardBits.length > 0 && num === selectedBitsSum) {
      selectedCardBits.forEach(bit => {
        if (!activeBits.includes(bit)) {
          activeBits.push(bit);
        }
      });
    }
    
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
          {phase2Unlocked 
            ? "Pick colors to see which numbers contain those magic bits!"
            : "Complete Phase 1 to unlock the magic cards!"}
        </p>
      </motion.header>

      {/* Main Stage */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Left: Phase 1 Panel (Binary Input Puzzle) - hide after Phase 2 unlocked */}
        {!phase2Unlocked && (
          <Phase2Panel onComplete={handlePhase1Complete} isActive={!phase2Unlocked} />
        )}
        {/* Middle: Number List (X-Ray Scanner) - only show when Phase 2 unlocked */}
        {phase2Unlocked && (
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
                      highlightedBits={highlightedBits}
                      isDimmed={isDimmed}
                      isHighlighted={isHighlighted}
                      blinkingBit={blinkingBit}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Right: Factory Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-[500px] space-y-5 relative"
        >
          {/* Frozen overlay when Phase 2 is locked */}
          {!phase2Unlocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-2xl z-20 flex flex-col items-center justify-center"
            >
              <Lock className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg font-medium">
                Complete Phase 1 to unlock
              </p>
            </motion.div>
          )}

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
                disabled={isLocked || !phase2Unlocked}
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
                isSelectable={allCardsCompleted && completedCards.includes(bit)}
                isCardSelected={selectedCardBits.includes(bit)}
                onCardSelect={handleCardSelect}
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
