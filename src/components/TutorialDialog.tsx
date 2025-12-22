import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Puzzle,
  Printer,
  Sparkles,
  MousePointerClick,
  Calculator,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TutorialPage {
  title: string;
  description: string;
  icon: React.ReactNode;
  illustration: React.ReactNode;
}

const tutorialPages: TutorialPage[] = [
  {
    title: "欢迎来到二进制魔法工厂",
    description: "这是一个帮助你理解二进制数字的互动游戏。通过两个阶段的挑战，你将发现数字背后的魔法规律！",
    icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
    illustration: (
      <div className="flex items-center justify-center gap-4 py-8">
        <div className="flex gap-2">
          {[1, 0, 1, 1].map((bit, i) => (
            <div 
              key={i}
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold
                ${bit === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {bit}
            </div>
          ))}
        </div>
        <span className="text-2xl">=</span>
        <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center text-xl font-bold">
          11
        </div>
      </div>
    ),
  },
  {
    title: "第一阶段：二进制拼图",
    description: "点击格子在 0 和 1 之间切换，让每一行的二进制数等于左边显示的十进制数字。完成所有行后解锁第二阶段！",
    icon: <Puzzle className="w-8 h-8 text-blue-500" />,
    illustration: (
      <div className="space-y-3 py-4">
        <div className="flex items-center gap-4 justify-center">
          <span className="w-8 text-right font-bold text-lg">5</span>
          <span className="text-muted-foreground">=</span>
          <div className="flex gap-1">
            {[0, 1, 0, 1].map((bit, i) => (
              <div 
                key={i}
                className={`w-10 h-10 rounded flex items-center justify-center font-mono
                  ${bit === 1 ? 'bg-green-500/20 text-green-500 border-2 border-green-500' : 'bg-muted text-muted-foreground border border-border'}`}
              >
                {bit}
              </div>
            ))}
          </div>
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        </div>
        <div className="flex items-center gap-4 justify-center">
          <span className="w-8 text-right font-bold text-lg">3</span>
          <span className="text-muted-foreground">=</span>
          <div className="flex gap-1">
            {[0, 0, 1, 1].map((bit, i) => (
              <div 
                key={i}
                className={`w-10 h-10 rounded flex items-center justify-center font-mono
                  ${bit === 1 ? 'bg-green-500/20 text-green-500 border-2 border-green-500' : 'bg-muted text-muted-foreground border border-border'}`}
              >
                {bit}
              </div>
            ))}
          </div>
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        </div>
      </div>
    ),
  },
  {
    title: "第二阶段：打印魔法卡片",
    description: "点击 Print 按钮（如 Print 1s），观察哪些数字会亮起来——这些数字的二进制表示中都包含对应的位！",
    icon: <Printer className="w-8 h-8 text-purple-500" />,
    illustration: (
      <div className="py-4 space-y-4">
        <div className="flex justify-center gap-2">
          {['Print 1s', 'Print 2s', 'Print 4s', 'Print 8s'].map((label, i) => (
            <div 
              key={i}
              className={`px-3 py-2 rounded-lg text-sm font-medium
                ${i === 0 ? 'bg-red-500 text-white ring-2 ring-red-300' : 'bg-muted text-muted-foreground'}`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div 
                key={num}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold
                  ${num % 2 === 1 ? 'bg-red-500/20 text-red-500 ring-2 ring-red-400' : 'bg-muted text-muted-foreground'}`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "观察数字填充卡片",
    description: "按下 Print 按钮后，符合条件的数字会依次填入右侧的卡片中。仔细观察——所有奇数都包含 1，所有偶数都不包含！",
    icon: <Sparkles className="w-8 h-8 text-orange-500" />,
    illustration: (
      <div className="py-4">
        <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-4 max-w-[200px] mx-auto">
          <div className="text-center text-red-500 font-bold mb-2">1s 卡片</div>
          <div className="grid grid-cols-4 gap-1">
            {[1, 3, 5, 7, 9, 11, 13, 15].map((num) => (
              <div 
                key={num}
                className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-sm font-bold text-red-500"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "选择卡片组合",
    description: "当所有4张卡片都填满后，点击卡片来选择它们。被选中的卡片会显示勾选标记，取消选择再点一次即可。",
    icon: <MousePointerClick className="w-8 h-8 text-cyan-500" />,
    illustration: (
      <div className="py-4 flex justify-center gap-3">
        {[
          { bit: 1, color: 'red', selected: true },
          { bit: 2, color: 'green', selected: false },
          { bit: 4, color: 'blue', selected: true },
          { bit: 8, color: 'yellow', selected: false },
        ].map(({ bit, color, selected }) => (
          <div 
            key={bit}
            className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg relative
              ${selected 
                ? `bg-${color}-500/30 ring-2 ring-${color}-500` 
                : 'bg-muted'
              }`}
            style={{
              backgroundColor: selected ? `var(--${color}-bg, rgba(var(--${color}-500), 0.3))` : undefined,
              boxShadow: selected ? `0 0 15px rgba(var(--${color}-500), 0.5)` : undefined
            }}
          >
            {bit}
            {selected && (
              <CheckCircle2 className="absolute -top-1 -right-1 w-5 h-5 text-green-500 bg-background rounded-full" />
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "发现魔法数字",
    description: "选中的卡片数值相加就是目标数字！例如选中 1 和 4，它们的和是 5，数字 5 就会高亮显示。这就是二进制的魔法！",
    icon: <Calculator className="w-8 h-8 text-pink-500" />,
    illustration: (
      <div className="py-4 space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 font-bold">1</div>
          <span className="text-xl">+</span>
          <div className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-500 font-bold">4</div>
          <span className="text-xl">=</span>
          <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-blue-500 text-white font-bold">5</div>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          5 的二进制是 0101 = 4 + 1
        </div>
      </div>
    ),
  },
];

export const TutorialDialog = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [open, setOpen] = useState(false);

  const handleNext = () => {
    if (currentPage < tutorialPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setCurrentPage(0);
    }
  };

  const page = tutorialPages[currentPage];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          data-testid="button-help"
          className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 shadow-lg"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {page.icon}
            <span>{page.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="py-4"
          >
            {page.illustration}
            <p className="text-muted-foreground text-center mt-4 leading-relaxed">
              {page.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentPage === 0}
            data-testid="button-tutorial-prev"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            上一页
          </Button>
          
          <div className="flex gap-1.5">
            {tutorialPages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                data-testid={`button-tutorial-dot-${index}`}
                className={`w-2 h-2 rounded-full transition-colors
                  ${index === currentPage ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === tutorialPages.length - 1}
            data-testid="button-tutorial-next"
          >
            下一页
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
