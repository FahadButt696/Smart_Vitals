import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, RefreshCw, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const AIRecommendationCard = ({ 
  title, 
  recommendation, 
  feature, 
  userId, 
  onRefresh,
  isLoading = false 
}) => {
  const { getToken } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle both string and array recommendations
  const recommendations = Array.isArray(recommendation) ? recommendation : [recommendation];
  const hasMultipleRecommendations = recommendations.length > 1;
  const currentRecommendation = recommendations[currentIndex] || "";

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

  if (!currentRecommendation || currentRecommendation.trim() === '') {
    return null;
  }

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
              {hasMultipleRecommendations && (
                <span className="text-white/60">• {currentIndex + 1} of {recommendations.length}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasMultipleRecommendations && (
            <>
              <button
                onClick={prevRecommendation}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors duration-200"
                title="Previous recommendation"
              >
                <ChevronLeft className="w-4 h-4 text-cyan-400" />
              </button>
              <button
                onClick={nextRecommendation}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors duration-200"
                title="Next recommendation"
              >
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>
            </>
          )}
          
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
      
      <div className="space-y-3">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-white/80 text-sm leading-relaxed line-clamp-3"
        >
          {currentRecommendation}
        </motion.p>
        
        {hasMultipleRecommendations && (
          <div className="flex justify-center">
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
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AIRecommendationCard;
