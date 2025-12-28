"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

interface MobileStoryBookViewProps {
  currentPage: {
    image_signed_url: string;
    text: string;
    page_number: number;
  };
  pageIndex: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  topic: string;
}

const MobileStoryBookView: React.FC<MobileStoryBookViewProps> = ({
  currentPage,
  pageIndex,
  totalPages,
  onPrevPage,
  onNextPage,
  topic,
}) => {
  const [isTextHidden, setIsTextHidden] = useState(false);
  const [layoutKey, setLayoutKey] = useState(0); // Force re-render on layout changes
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Reset text position when screen size changes
  useEffect(() => {
    const handleResize = () => {
      // Reset text to visible state and bottom position on layout changes
      setIsTextHidden(false);
      setLayoutKey(prev => prev + 1); // Force re-render to reset position
    };

    // Handle both resize and orientation change
    const handleOrientationChange = () => {
      // Small delay to ensure the layout has updated
      setTimeout(() => {
        setIsTextHidden(false);
        setLayoutKey(prev => prev + 1);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Also reset on component mount to ensure clean state
    setIsTextHidden(false);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50; // Minimum distance to trigger hide/show
    
    if (Math.abs(info.offset.y) > threshold) {
      if (info.offset.y > 0) {
        // Swiped down - hide text
        setIsTextHidden(true);
      } else {
        // Swiped up - show text
        setIsTextHidden(false);
      }
    }
  };

  const toggleTextVisibility = () => {
    setIsTextHidden(!isTextHidden);
  };

  return (
    <div ref={constraintsRef} className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Full Image Background - always visible */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={pageIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <img
              src={currentPage.image_signed_url}
              alt={`${topic} - Page ${currentPage.page_number}`}
              className="w-full h-full object-fit"
            />
            {/* Subtle overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Draggable Text Overlay */}
      <motion.div
        key={`text-overlay-${layoutKey}`} // Force reset on layout changes
        drag="y"
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        initial={{ y: "0%" }} // Always start at bottom
        animate={{
          y: isTextHidden ? "60%" : "0%",
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 200,
        }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/70 via-gray-900/50 to-transparent backdrop-blur-sm
                   md:max-h-[60vh] max-h-[70vh]" // Limit height on tablets for better image visibility
        style={{ touchAction: 'pan-y' }}
      >

        {/* Toggle Button */}
        <div className="flex justify-center pb-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTextVisibility}
            className="p-2 rounded-full bg-white/5 backdrop-blur-sm text-white hover:bg-white/15 transition-colors"
          >
            {isTextHidden ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </motion.button>
        </div>

        {/* Header with Story Info - Always visible even when collapsed */}
            <motion.div
            className="px-6 md:px-8 pb-4"
            animate={{
                opacity: isTextHidden ? 0.7 : 1,
            }}
            >
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">{topic}</h1>
            </motion.div>

        {/* Content Section - Hides when text is hidden */}
        <AnimatePresence>
          {!isTextHidden && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 md:px-8">                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-black/20 backdrop-blur-sm rounded-lg p-4 md:p-6 mb-4 border border-white/10"
                  >
                    <p className="text-gray-100 text-lg md:text-xl leading-relaxed md:leading-relaxed">
                      {currentPage.text}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation - Always visible */}
        <div className="flex items-center justify-between px-4 md:px-6 pb-4 md:pb-6 bg-gray-900/30">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onPrevPage}
            disabled={pageIndex === 0}
            className={`p-3 rounded-full backdrop-blur-sm ${
              pageIndex === 0
                ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700/70 text-white hover:bg-gray-600/70'
            } transition-colors`}
          >
            <ChevronLeft size={20} />
          </motion.button>

          <motion.div
            className="text-white text-sm font-medium bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10"
            animate={{
              scale: isTextHidden ? 0.9 : 1,
            }}
          >
            {pageIndex + 1} / {totalPages}
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onNextPage}
            disabled={pageIndex === totalPages - 1}
            className={`p-3 rounded-full backdrop-blur-sm ${
              pageIndex === totalPages - 1
                ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700/70 text-white hover:bg-gray-600/70'
            } transition-colors`}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Swipe Instructions - Show briefly on first load */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
          <p className="text-white text-sm text-center">
            Swipe up/down to hide/show text
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileStoryBookView;