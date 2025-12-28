"use client";
import React, {useState, useCallback} from "react";
import {Loader2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, X, BookOpen} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {useToast} from "../../components/Toast";
import MobileStoryBookView from "./MobileStoryBookView";

interface StoryBookComponentProps {
  jobId: string;
  topic?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const StoryBookComponent: React.FC<StoryBookComponentProps> = ({
  jobId,
  topic = "Story",
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [pages, setPages] = useState<string[] | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageTexts, setPageTexts] = useState<string[] | null>(null);
  const [pageNumbers, setPageNumbers] = useState<number[] | null>(null);
  const {showToast} = useToast();

  const isModalMode = isOpen !== undefined;

  const fetchStoryContent = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(`/api/storyBooks/${jobId}/content`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to fetch story content (${res.status})`);
      }

      const data = await res.json();
      const storybookData = data.content || data;

      if (storybookData && storybookData.pages && Array.isArray(storybookData.pages)) {
        const pageUrls = storybookData.pages.map((page: any) => page.image_signed_url);
        const pageTexts = storybookData.pages.map((page: any) => page.text || '');
        const pageNumbers = storybookData.pages.map((page: any) => page.page_number || 0);

        setPages(pageUrls);
        setPageTexts(pageTexts);
        setPageNumbers(pageNumbers);
        setPageIndex(0);
        return true;
      }

      throw new Error("Invalid response from server");
    } catch (err: any) {
      console.error("Error fetching story content:", err);
      setError(err.message || "Failed to load story");
      showToast({message: `Failed to load story: ${err.message}`, status: "error", duration: 5000});
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [jobId, showToast]);

  const handleOpen = useCallback(async () => {
    const ok = await fetchStoryContent();
    if (ok) setHasOpened(true);
  }, [fetchStoryContent]);

  const handleRetry = useCallback(() => {
    setError(null);
    setPages(null);
    setPageTexts(null);
    setPageNumbers(null);
    handleOpen();
  }, [handleOpen]);

  // gallery navigation
  const prevPage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!pages || pages.length === 0) return;
    setPageIndex((p) => Math.max(0, p - 1));
  }, [pages]);

  const nextPage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!pages || pages.length === 0) return;
    const next = Math.min(pages.length - 1, pageIndex + 1);
    setPageIndex(next);
  }, [pages, pageIndex]);

  // Add keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevPage();
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'Escape') onClose?.();
  }, [prevPage, nextPage, onClose]);

  // Auto-fetch data when modal opens
  React.useEffect(() => {
    if (isModalMode && isOpen && !hasOpened && !isLoading) {
      handleOpen();
    }
  }, [isModalMode, isOpen, hasOpened, isLoading, handleOpen]);

  // Don't render modal if not open
  if (isModalMode && !isOpen) return null;

  // Get current page data for animations
  const currentPage = pages && pageTexts && pageNumbers ? {
    image_signed_url: pages[pageIndex],
    text: pageTexts[pageIndex],
    page_number: pageNumbers[pageIndex]
  } : null;

  // Return modal wrapper for modal mode, or direct content for inline mode
  if (isModalMode) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            style={{ outline: 'none' }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full h-full max-w-7xl max-h-screen p-4 md:p-8"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 text-white hover:text-gray-300 transition-colors duration-200 bg-black bg-opacity-50 rounded-full backdrop-blur-sm"
              >
                <X size={24} />
              </button>

              {/* Mobile View (below md breakpoint) */}
              <div className="lg:hidden h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
                      <p className="text-white text-xl">Loading your storybook...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <p className="text-white text-xl mb-4">{error}</p>
                      <button
                        onClick={handleRetry}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : currentPage ? (
                  <MobileStoryBookView
                    currentPage={currentPage}
                    pageIndex={pageIndex}
                    totalPages={pages?.length || 0}
                    onPrevPage={prevPage}
                    onNextPage={nextPage}
                    topic={topic}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <motion.div 
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <BookOpen className="w-24 h-24 text-white mx-auto mb-6 opacity-70" />
                      <motion.p 
                        className="text-white text-2xl font-light tracking-wide"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        Your storybook is being prepared...
                      </motion.p>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Desktop View (md and above) */}
              <div className="hidden lg:block h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
                      <p className="text-white text-xl">Loading your storybook...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <p className="text-white text-xl mb-4">{error}</p>
                      <button
                        onClick={handleRetry}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : currentPage ? (
                <>
                  {/* Main Content Container - Mobile stacked, Desktop side-by-side */}
                  <div className="flex flex-col lg:flex-row h-full lg:gap-8">
                    {/* Image Section */}
                    <div className="flex-1 flex items-center justify-center lg:p-0 mb-0">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={pageIndex}
                          initial={{ x: -40, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 40, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="w-full lg:max-w-none h-full max-h-[50vh] lg:max-h-[70vh]"
                        >
                          <img
                            src={currentPage.image_signed_url}
                            alt={`${topic} - Page ${currentPage.page_number}`}
                            className="w-full h-full object-contain rounded-t-lg lg:rounded-lg shadow-lg"
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Text Section - Directly attached to image bottom on mobile */}
                    <div className="flex-shrink-0 lg:flex-1 flex items-start lg:items-center justify-center lg:justify-start lg:p-0 -mt-0 lg:mt-0">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={pageIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
                          className="w-full lg:max-w-2xl px-4 lg:px-0"
                        >
                          <div className="bg-gray-900 bg-opacity-90 backdrop-blur-sm rounded-b-lg lg:rounded-xl p-6 lg:p-8">
                            <div className="text-white text-base lg:text-xl leading-relaxed font-normal">
                              {currentPage.text}
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={prevPage}
                      disabled={pageIndex === 0}
                      className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
                        pageIndex === 0
                          ? 'bg-gray-600 bg-opacity-50 text-gray-400 cursor-not-allowed'
                          : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70 hover:text-gray-200'
                      }`}
                    >
                      <ChevronLeft size={24} />
                    </motion.button>

                    {/* Page Indicator */}
                    <div className="px-4 py-2 bg-black bg-opacity-50 backdrop-blur-sm rounded-full">
                      <span className="text-white text-sm font-medium">
                        {pageIndex + 1} / {pages?.length || 0}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextPage}
                      disabled={pageIndex === (pages?.length || 0) - 1}
                      className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
                        pageIndex === (pages?.length || 0) - 1
                          ? 'bg-gray-600 bg-opacity-50 text-gray-400 cursor-not-allowed'
                          : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70 hover:text-gray-200'
                      }`}
                    >
                      <ChevronRight size={24} />
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <BookOpen className="w-24 h-24 text-white mx-auto mb-6 opacity-70" />
                    </motion.div>
                    <motion.p 
                      className="text-white text-2xl font-light tracking-wide"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      Your storybook is being prepared...
                    </motion.p>
                    <motion.div
                      className="mt-6 w-32 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 rounded-full mx-auto"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    />
                  </motion.div>
                </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Inline mode (non-modal) - simplified version
  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{topic}</h2>
            <p className="text-gray-600 text-sm font-medium">Interactive Learning Experience</p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          {isLoading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading your storybook...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          ) : currentPage ? (
            <div className="w-full text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pageIndex}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="w-full"
                >
                  <motion.img
                    src={currentPage.image_signed_url}
                    alt={`${topic} - Page ${currentPage.page_number}`}
                    className="max-w-full max-h-[60vh] lg:max-h-[72vh] object-contain mx-auto rounded-2xl shadow-2xl mb-6 p-2 bg-white/5"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5 }}
                  />

                  <motion.p
                    className="text-gray-700 text-lg leading-relaxed mb-4 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.45, delay: 0.05 }}
                  >
                    {currentPage.text}
                  </motion.p>

                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={prevPage}
                      disabled={pageIndex === 0}
                      className="p-2 rounded-full bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm text-gray-500 font-medium">
                      {pageIndex + 1} / {pages?.length || 0}
                    </span>
                    <button
                      onClick={nextPage}
                      disabled={pageIndex === (pages?.length || 0) - 1}
                      className="p-2 rounded-full bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600">Your storybook is being prepared...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryBookComponent;
