import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, RefreshCw, CheckCircle, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const MultipleAIRecommendations = ({ 
  title, 
  recommendations = [], 
  feature, 
  userId, 
  onRefresh,
  isLoading = false 
}) => {
  const { getToken } = useAuth();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'carousel'
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const handleRefresh = async () => {
    if (!userId || !onRefresh) return;
    
    try {
      const token = await getToken();
      const response = await fetch(API_ENDPOINTS.AI_RECOMMENDATIONS.GENERATE(userId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        toast.success('Recommendations refreshed successfully!');
        onRefresh(); // Refresh the parent component
        setCurrentIndex(0); // Reset to first recommendation
      } else {
        toast.error('Failed to refresh recommendations');
      }
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
      toast.error('Failed to refresh recommendations');
    }
  };

  const nextRecommendation = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendations.length);
  };

  const prevRecommendation = () => {
    setCurrentIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recommendations.map((recommendation, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:border-cyan-400/30 transition-all duration-200"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">{index + 1}</span>
            </div>
            <span className="text-cyan-400 text-xs font-medium">Tip {index + 1}</span>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            {recommendation}
          </p>
        </motion.div>
      ))}
    </div>
  );

  const CarouselView = () => (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 min-h-[120px] flex items-center"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">{currentIndex + 1}</span>
            </div>
            <span className="text-cyan-400 text-sm font-medium">Tip {currentIndex + 1} of {recommendations.length}</span>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            {recommendations[currentIndex]}
          </p>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevRecommendation}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          title="Previous recommendation"
        >
          <ChevronLeft className="w-4 h-4 text-cyan-400" />
        </button>
        
        <div className="flex gap-1">
          {recommendations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-cyan-400 scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              title={`Recommendation ${index + 1}`}
            />
          ))}
        </div>
        
        <button
          onClick={nextRecommendation}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          title="Next recommendation"
        >
          <ChevronRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="ai-recommendation-card backdrop-blur-xl border border-white/20 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base mb-1">{title}</h3>
            <div className="flex items-center gap-2 text-xs text-cyan-400">
              <CheckCircle className="w-3 h-3" />
              <span>AI Personalized</span>
              <span className="text-white/60">• {recommendations.length} tips</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-cyan-400/20 text-cyan-400' 
                  : 'text-white/60 hover:text-white/80'
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('carousel')}
              className={`p-1.5 rounded transition-all duration-200 ${
                viewMode === 'carousel' 
                  ? 'bg-cyan-400/20 text-cyan-400' 
                  : 'text-white/60 hover:text-white/80'
              }`}
              title="Carousel view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 group/refresh"
              title="Refresh recommendations"
            >
              <RefreshCw 
                className={`w-4 h-4 text-cyan-400 ${isLoading ? 'animate-spin' : 'group-hover/refresh:rotate-180 transition-transform duration-300'}`} 
              />
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {viewMode === 'grid' ? <GridView /> : <CarouselView />}
      </div>
    </motion.div>
  );
};

export default MultipleAIRecommendations;
