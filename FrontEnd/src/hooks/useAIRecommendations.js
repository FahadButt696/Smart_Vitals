import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { API_ENDPOINTS } from '@/config/api';

// Hook for managing AI recommendations (generation + fetching)
export const useAIRecommendations = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const fetchRecommendations = async () => {
    if (!user || hasGenerated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      const response = await fetch(API_ENDPOINTS.AI_RECOMMENDATIONS.GET(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
        setHasGenerated(true); // Mark as fetched to prevent duplicate calls
      } else if (response.status === 404) {
        // No recommendations found, generate them ONCE
        if (!hasGenerated) {
          await generateRecommendations();
        }
      } else {
        throw new Error('Failed to fetch recommendations');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = async () => {
    if (!user || hasGenerated) return; // Prevent duplicate generation
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      const response = await fetch(API_ENDPOINTS.AI_RECOMMENDATIONS.GENERATE(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.data.recommendations);
        setHasGenerated(true); // Mark as generated to prevent future calls
        
        // If recommendations already existed, mark as fetched
        if (data.alreadyExists) {
          console.log("Recommendations already existed, marked as fetched");
        }
      } else {
        throw new Error('Failed to generate recommendations');
      }
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Force refresh only when explicitly requested
  const refreshRecommendations = async () => {
    setHasGenerated(false); // Reset flag to allow regeneration
    await generateRecommendations();
  };

  // Reset recommendations when user changes
  useEffect(() => {
    if (user) {
      setHasGenerated(false); // Reset for new user
      fetchRecommendations();
    }
  }, [user]);

  return {
    recommendations,
    isLoading,
    error,
    fetchRecommendations,
    generateRecommendations,
    refreshRecommendations,
    hasGenerated
  };
};

// Hook for fetching existing AI recommendations only (no generation)
export const useExistingAIRecommendations = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExistingRecommendations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      const response = await fetch(API_ENDPOINTS.AI_RECOMMENDATIONS.GET(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
      } else if (response.status === 404) {
        // No recommendations found, but don't generate them
        setRecommendations(null);
      } else {
        throw new Error('Failed to fetch recommendations');
      }
    } catch (err) {
      console.error('Error fetching existing recommendations:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch recommendations when user changes
  useEffect(() => {
    if (user) {
      fetchExistingRecommendations();
    }
  }, [user]);

  return {
    recommendations,
    isLoading,
    error,
    fetchExistingRecommendations
  };
};
