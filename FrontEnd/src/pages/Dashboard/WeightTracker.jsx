import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useAuth, SignedIn } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from "@/config/api";

import { 
  FaWeight, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaChartLine, 
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaDownload,
  FaUpload,
  FaFilter,
  FaSort,
  FaTimes
} from 'react-icons/fa';
import { LineChart, BarChart } from '@/components/custom/ChartComponents';
import AIRecommendationCard from "@/components/custom/AIRecommendationCard";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";

// Constants for validation
const WEIGHT_LIMITS = {
  MIN_KG: 20,    // 20 kg minimum
  MAX_KG: 500,   // 500 kg maximum
  MIN_LBS: 44,   // 44 lbs minimum
  MAX_LBS: 1100  // 1100 lbs maximum
};

const DATE_LIMITS = {
  MAX_FUTURE_DAYS: 7,  // Can't log weight more than 7 days in future
  MAX_PAST_DAYS: 365   // Can't log weight more than 1 year in past
};

const WeightTracker = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { recommendations } = useAIRecommendations();
  const [weightLogs, setWeightLogs] = useState([]);
  const [stats, setStats] = useState({
    current: null,
    starting: null,
    totalChange: 0,
    averageChange: 0,
    trend: "stable",
    totalEntries: 0,
    thisWeek: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWeight, setEditingWeight] = useState(null);
  const [chartView, setChartView] = useState('daily');
  const [showNotes, setShowNotes] = useState({});
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState('all'); // all, thisWeek, thisMonth
  const [sortBy, setSortBy] = useState('date'); // date, weight
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [showHelp, setShowHelp] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    weight: '',
    unit: 'kg',
    timestamp: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5), // Add time field
    notes: ''
  });
  
  // Initialize form with user profile data
  const initializeFormWithProfile = () => {
    if (userProfile && userProfile.weightUnit) {
      setFormData(prev => ({
        ...prev,
        unit: userProfile.weightUnit
      }));
    }
  };

  // Fetch user profile data (including initial weight from onboarding)
  const fetchUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        console.log('User profile fetched:', data);
        
        // Initialize form with profile data
        initializeFormWithProfile();
        
        // If we already have weight logs, recalculate stats with profile data
        if (weightLogs && weightLogs.length > 0) {
          setTimeout(() => calculateStatsWithProfileWeight(), 100);
        }
      } else {
        console.warn('Failed to fetch user profile:', response.status);
      }
    } catch (error) {
      console.warn('Error fetching user profile:', error);
    }
  };

  // Check if backend is available
  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`, { 
        method: 'GET',
        signal: AbortSignal.timeout(10000) // 10 second timeout for mobile
      });
      return response.ok;
    } catch (error) {
      console.warn('Backend server not available:', error.message);
      return false;
    }
  };

  // Validation functions
  const validateWeight = (weight, unit) => {
    const numWeight = parseFloat(weight);
    
    if (isNaN(numWeight) || numWeight <= 0) {
      return 'Weight must be a positive number';
    }
    
    if (unit === 'kg') {
      if (numWeight < WEIGHT_LIMITS.MIN_KG) {
        return `Weight must be at least ${WEIGHT_LIMITS.MIN_KG} kg`;
      }
      if (numWeight > WEIGHT_LIMITS.MAX_KG) {
        return `Weight cannot exceed ${WEIGHT_LIMITS.MAX_KG} kg`;
      }
    } else if (unit === 'lbs') {
      if (numWeight < WEIGHT_LIMITS.MIN_LBS) {
        return `Weight must be at least ${WEIGHT_LIMITS.MIN_LBS} lbs`;
      }
      if (numWeight > WEIGHT_LIMITS.MAX_LBS) {
        return `Weight cannot exceed ${WEIGHT_LIMITS.MAX_LBS} lbs`;
      }
    }
    
    return null;
  };

  const validateDate = (dateString) => {
    const selectedDate = new Date(dateString);
    const today = new Date();
    const maxFuture = new Date();
    const maxPast = new Date();
    
    maxFuture.setDate(today.getDate() + DATE_LIMITS.MAX_FUTURE_DAYS);
    maxPast.setDate(today.getDate() - DATE_LIMITS.MAX_PAST_DAYS);
    
    if (selectedDate > maxFuture) {
      return `Cannot log weight more than ${DATE_LIMITS.MAX_FUTURE_DAYS} days in the future`;
    }
    
    if (selectedDate < maxPast) {
      return `Cannot log weight more than ${DATE_LIMITS.MAX_PAST_DAYS} days in the past`;
    }
    
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate weight
    const weightError = validateWeight(formData.weight, formData.unit);
    if (weightError) {
      newErrors.weight = weightError;
    }
    
    // Validate date
    const dateError = validateDate(formData.timestamp);
    if (dateError) {
      newErrors.date = dateError;
    }
    
    // Validate time
    if (!formData.time) {
      newErrors.time = 'Time is required';
    } else {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(formData.time)) {
        newErrors.time = 'Please enter a valid time';
      }
    }
    
    // Validate notes length
    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes cannot exceed 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch weight logs with error handling
  const fetchWeightLogs = async () => {
    try {
      setLoading(true);
      setIsInitialLoading(true);
      
      if (!user?.id) {
        console.warn('No user ID available for fetching weight logs');
        setWeightLogs([]);
        return;
      }

      // Check if backend is available
      const backendAvailable = await checkBackendStatus();
      if (!backendAvailable) {
        toast.error('Backend server is not available. Please check your connection.');
        setWeightLogs([]);
        return;
      }

      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/weight?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        console.log('📥 Weight logs fetched successfully:', data.logs);
        console.log('🔍 Weight logs data structure:', {
          logsLength: data.logs?.length || 0,
          sampleLog: data.logs?.[0],
          allLogs: data.logs
        });
        setWeightLogs(data.logs || []);
        setLastSync(new Date());
        
        // Calculate stats after weight logs are set
        setTimeout(() => calculateStatsWithProfileWeight(), 100);
      } else {
        throw new Error(data.message || 'Failed to fetch weight logs');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout:', error);
        toast.error('Request timed out. Please check your connection.');
      } else {
        console.error('Error fetching weight logs:', error);
        toast.error('Failed to fetch weight logs. Please try again.');
      }
      setWeightLogs([]);
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  };

  // Fetch weight stats with error handling
  const fetchWeightStats = async () => {
    try {
      if (!user?.id) {
        console.warn('No user ID available for fetching weight stats');
        setStats({
          current: null,
          starting: null,
          totalChange: 0,
          averageChange: 0,
          trend: "stable",
          totalEntries: 0,
          thisWeek: 0,
          thisMonth: 0
        });
        return;
      }

      // Check if backend is available
      const backendAvailable = await checkBackendStatus();
      if (!backendAvailable) {
        toast.error('Backend server is not available. Please check your connection.');
        setStats({
          current: null,
          starting: null,
          totalChange: 0,
          averageChange: 0,
          trend: "stable",
          totalEntries: 0,
          thisWeek: 0,
          thisMonth: 0
        });
        return;
      }

      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/weight/stats?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setStats(data.stats || {
          current: null,
          starting: null,
          totalChange: 0,
          averageChange: 0,
          trend: "stable",
          totalEntries: 0,
          thisWeek: 0,
          thisMonth: 0
        });
      } else {
        throw new Error(data.message || 'Failed to fetch weight stats');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout:', error);
        toast.error('Request timed out. Please check your connection.');
      } else {
        console.error('Error fetching weight stats:', error);
        toast.error('Failed to fetch weight statistics. Please try again.');
      }
      setStats({
        current: null,
        starting: null,
        totalChange: 0,
        averageChange: 0,
        trend: "stable",
        totalEntries: 0,
        thisWeek: 0,
        thisMonth: 0
      });
    }
  };

  // Calculate stats using user profile weight as starting weight when no logs available
  const calculateStatsWithProfileWeight = () => {
    if (!weightLogs || weightLogs.length === 0) {
      // No logs available, use profile weight as starting weight
      if (userProfile && userProfile.weight) {
        const profileWeight = {
          weight: userProfile.weight,
          unit: userProfile.weightUnit || 'kg',
          timestamp: new Date().toISOString(),
          notes: 'Initial weight from onboarding'
        };
        
        setStats({
          current: profileWeight,
          starting: profileWeight,
          totalChange: 0,
          averageChange: 0,
          trend: "stable",
          totalEntries: 1,
          thisWeek: 1,
          thisMonth: 1
        });
        return;
      }
    }
    
    // If we have logs, let the backend handle stats calculation
    fetchWeightStats();
  };

  // Add weight log with comprehensive validation
  const addWeight = async (e) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('User not authenticated. Please log in again.');
      return;
    }
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    try {
      setSubmitting(true);
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/weight`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
          weight: parseFloat(formData.weight),
          timestamp: new Date(`${formData.timestamp}T${formData.time}:00`).toISOString()
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        console.log('✅ Weight added successfully:', data);
        toast.success('Weight logged successfully!');
        setShowAddModal(false);
        setFormData({
          weight: '',
          unit: 'kg',
          timestamp: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().slice(0, 5),
          notes: ''
        });
        setErrors({});
        console.log('🔄 Fetching updated weight logs...');
        fetchWeightLogs();
        fetchWeightStats();
      } else {
        throw new Error(data.message || 'Failed to log weight');
      }
    } catch (error) {
      console.error('Error adding weight:', error);
      toast.error(error.message || 'Failed to log weight. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Update weight log with validation
  const updateWeight = async (e) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('User not authenticated. Please log in again.');
      return;
    }
    
    if (!editingWeight?._id) {
      toast.error('No weight log selected for editing');
      return;
    }
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    try {
      setSubmitting(true);
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/weight/${editingWeight._id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
          weight: parseFloat(formData.weight),
          timestamp: new Date(`${formData.timestamp}T${formData.time}:00`).toISOString()
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        toast.success('Weight updated successfully!');
        setShowEditModal(false);
        setEditingWeight(null);
        setFormData({
          weight: '',
          unit: 'kg',
          timestamp: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().slice(0, 5),
          notes: ''
        });
        setErrors({});
        fetchWeightLogs();
        fetchWeightStats();
      } else {
        throw new Error(data.message || 'Failed to update weight');
      }
    } catch (error) {
      console.error('Error updating weight:', error);
      toast.error(error.message || 'Failed to update weight. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete weight log with confirmation
  const deleteWeight = async (id) => {
    if (!id) {
      toast.error('Invalid weight log ID');
      return;
    }
    
    // Show confirmation toast
    toast.success('Weight log deleted successfully!');
    
    // Proceed with deletion (removed confirmation for better UX)
    
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/weight/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        toast.success('Weight log deleted successfully!');
        fetchWeightLogs();
        fetchWeightStats();
      } else {
        throw new Error(data.message || 'Failed to delete weight log');
      }
    } catch (error) {
      console.error('Error deleting weight:', error);
      toast.error(error.message || 'Failed to delete weight log. Please try again.');
    }
  };

  // Edit weight log
  const handleEdit = (weight) => {
    setEditingWeight(weight);
    setFormData({
      weight: weight.weight.toString(),
      unit: weight.unit,
      timestamp: new Date(weight.timestamp).toISOString().split('T')[0],
      time: new Date(weight.timestamp).toTimeString().slice(0, 5),
      notes: weight.notes || ''
    });
    setErrors({});
    setShowEditModal(true);
  };

  // Filter and sort weight logs
  const getFilteredAndSortedLogs = () => {
    try {
      if (!weightLogs || !Array.isArray(weightLogs)) {
        return [];
      }

      let filteredLogs = [...weightLogs];
      
      // Apply filters
      const now = new Date();
      switch (filter) {
        case 'thisWeek': {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - 7);
          const weekStartStr = weekStart.toISOString().split('T')[0];
          filteredLogs = filteredLogs.filter(log => {
            if (!log || !log.timestamp) return false;
            const logDate = new Date(log.timestamp);
            const logDateStr = logDate.toISOString().split('T')[0];
            return logDateStr >= weekStartStr;
          });
          break;
        }
        case 'thisMonth': {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthStartStr = monthStart.toISOString().split('T')[0];
          filteredLogs = filteredLogs.filter(log => {
            if (!log || !log.timestamp) return false;
            const logDate = new Date(log.timestamp);
            const logDateStr = logDate.toISOString().split('T')[0];
            return logDateStr >= monthStartStr;
          });
          break;
        }
        default:
          break;
      }
      
      // Apply sorting
      filteredLogs.sort((a, b) => {
        if (!a || !b) return 0;
        
        let comparison = 0;
        
        if (sortBy === 'date') {
          const dateA = new Date(a.timestamp || 0);
          const dateB = new Date(b.timestamp || 0);
          comparison = dateA - dateB;
        } else if (sortBy === 'weight') {
          const weightA = a.weight || 0;
          const weightB = b.weight || 0;
          comparison = weightA - weightB;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      
      return filteredLogs;
    } catch (error) {
      console.error('Error filtering and sorting logs:', error);
      return [];
    }
  };

  // Get chart data with error handling
  const getChartData = (view) => {
    try {
      if (!weightLogs || !Array.isArray(weightLogs) || weightLogs.length === 0) {
        return { 
          labels: [], 
          datasets: [{
            label: 'Weight (kg)',
            data: [],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          }]
        };
      }
  
      const now = new Date();
      let filteredLogs = [];
      let labels = [];
  
      switch (view) {
        case 'daily':
          // Today only - show all weight entries for today
          const today = now.toISOString().split('T')[0];
          
          const todayLogs = weightLogs.filter(log => {
            if (!log || !log.timestamp) return false;
            const logDate = new Date(log.timestamp);
            const logDateStr = logDate.toISOString().split('T')[0];
            return logDateStr === today;
          });
          
          if (todayLogs.length > 0) {
            const sortedTodayLogs = todayLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            labels = sortedTodayLogs.map((log, index) => {
              const time = new Date(log.timestamp).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              });
              return `Entry ${index + 1} (${time})`;
            });
            filteredLogs = sortedTodayLogs.map(log => log.weight);
          } else {
            labels = ['No weight logged today'];
            filteredLogs = [0.1];
          }
          break;
        
        case 'weekly':
          // Current week only - show daily breakdown
          const currentWeekStart = new Date(now);
          const dayOfWeek = now.getDay();
          currentWeekStart.setDate(now.getDate() - dayOfWeek);
          
          const currentWeekEnd = new Date(currentWeekStart);
          currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
          
          for (let i = 0; i < 7; i++) {
            const currentDate = new Date(currentWeekStart);
            currentDate.setDate(currentWeekStart.getDate() + i);
            
            const dayLogs = weightLogs.filter(log => {
              if (!log || !log.timestamp) return false;
              const logDate = new Date(log.timestamp);
              const logDateStr = logDate.toISOString().split('T')[0];
              const currentDateStr = currentDate.toISOString().split('T')[0];
              return logDateStr === currentDateStr;
            });
            
            labels.push(currentDate.toLocaleDateString('en-US', { weekday: 'short' }));
            
            if (dayLogs.length > 0) {
              const latestLog = dayLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
              filteredLogs.push(latestLog.weight);
            } else {
              filteredLogs.push(0);
            }
          }
          break;
        
        case 'monthly':
          // Current month only - show daily breakdown
          const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          
          for (let i = 1; i <= currentMonthEnd.getDate(); i++) {
            const currentDate = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth(), i);
            
            const dayLogs = weightLogs.filter(log => {
              if (!log || !log.timestamp) return false;
              const logDate = new Date(log.timestamp);
              const logDateStr = logDate.toISOString().split('T')[0];
              const currentDateStr = currentDate.toISOString().split('T')[0];
              return logDateStr === currentDateStr;
            });
            
            labels.push(i.toString());
            
            if (dayLogs.length > 0) {
              const latestLog = dayLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
              filteredLogs.push(latestLog.weight);
            } else {
              filteredLogs.push(0);
            }
          }
          break;
        
        default:
          labels = ['No Data'];
          filteredLogs = [0];
      }
  
      return labels.map((label, index) => ({
        label: label,
        value: filteredLogs[index] || 0
      }));
      
    } catch (error) {
      return [{ 
        label: 'Error', 
        value: 0
      }];
    }
  };

  // Get trend icon and color
  const getTrendInfo = (trend) => {
    switch (trend) {
      case 'losing':
        return { icon: FaArrowDown, color: 'text-green-400', bgColor: 'bg-green-400/10' };
      case 'gaining':
        return { icon: FaArrowUp, color: 'text-red-400', bgColor: 'bg-red-400/10' };
      default:
        return { icon: FaMinus, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' };
    }
  };

  // Export data functionality
  const exportData = () => {
    try {
      const exportData = {
        user: user?.username || 'User',
        exportDate: new Date().toISOString(),
        weightLogs: weightLogs,
        stats: stats
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `weight-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Weight data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data. Please try again.');
    }
  };

  // Handle form input changes with validation
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    
    // Real-time validation for weight
    if (field === 'weight' || field === 'unit') {
      const weightToValidate = field === 'weight' ? value : formData.weight;
      const unitToValidate = field === 'unit' ? value : formData.unit;
      
      if (weightToValidate && unitToValidate) {
        const weightError = validateWeight(weightToValidate, unitToValidate);
        if (weightError) {
          setErrors(prev => ({ ...prev, weight: weightError }));
        } else {
          // Clear weight error if validation passes
          setErrors(prev => ({ ...prev, weight: null }));
        }
      } else if (field === 'weight' && !value) {
        // Clear weight error if field is empty
        setErrors(prev => ({ ...prev, weight: null }));
      }
    }
    
    // Real-time validation for date
    if (field === 'timestamp') {
      if (value) {
        const dateError = validateDate(value);
        if (dateError) {
          setErrors(prev => ({ ...prev, date: dateError }));
        } else {
          // Clear date error if validation passes
          setErrors(prev => ({ ...prev, date: null }));
        }
      } else {
        // Clear date error if field is empty
        setErrors(prev => ({ ...prev, date: null }));
      }
    }
    
    // Real-time validation for notes
    if (field === 'notes') {
      if (value.length > 500) {
        setErrors(prev => ({ ...prev, notes: 'Notes cannot exceed 500 characters' }));
      } else {
        // Clear notes error if validation passes
        setErrors(prev => ({ ...prev, notes: null }));
      }
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchUserProfile();
      fetchWeightLogs();
      // fetchWeightStats(); // Will be called by calculateStatsWithProfileWeight if needed
    } else if (!user) {
      setLoading(false);
    }
  }, [user]);

  // Debug chart data when weightLogs or chartView changes
 

  // Add error boundary for chart rendering
  const renderChart = () => {
    try {
      const chartData = getChartData(chartView);
      
      // Check if chartData is valid
      if (!chartData || !Array.isArray(chartData)) {
        return (
          <div className="flex items-center justify-center h-full text-white/60">
            <p>Error loading chart data</p>
          </div>
        );
      }
  
      // Handle empty data case
      if (chartData.length === 0 || chartData.every(item => item.value <= 0)) {
        return (
          <div className="flex items-center justify-center h-full text-white/60">
            <p>No data available for {chartView} view</p>
          </div>
        );
      }
  
      // Use appropriate chart type for each view
      switch (chartView) {
        case 'daily':
          return (
            <div className="h-[300px]">
              <BarChart 
                data={chartData} 
                height={300}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: false,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.6)'
                      }
                    },
                    x: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.6)'
                      }
                    }
                  }
                }}
              />
            </div>
          );
        case 'weekly':
          return (
            <div className="h-[300px]">
              <BarChart 
                data={chartData} 
                height={300}
              />
            </div>
          );
        case 'monthly':
          return (
            <div className="h-[300px]">
              <BarChart 
                data={chartData} 
                height={300}
              />
            </div>
          );
        default:
          return <LineChart data={chartData} />;
      }
    } catch (error) {
      return (
        <div className="flex items-center justify-center h-full text-white/60">
          <p>Unable to display chart</p>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <SignedIn>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      </SignedIn>
    );
  }

  const trendInfo = getTrendInfo(stats.trend);
  const filteredLogs = getFilteredAndSortedLogs();

  return (
    <SignedIn>
      <>
        {/* Loading State */}
        {isInitialLoading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-blue-500/20 border border-blue-500/30 rounded-xl p-6 text-center"
          >
            <div className="flex items-center justify-center gap-3 text-blue-300">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-300"></div>
              <span className="text-lg">Loading your weight data...</span>
            </div>
          </motion.div>
        )}

        {/* Today's Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FaWeight className="text-cyan-400" />
              Today's Weight
            </h2>
            <p className="text-white/60 mt-1 text-sm sm:text-base">
              {stats.current ? `Current: ${stats.current.weight} ${stats.current.unit}` : 
               stats.starting ? `Initial weight: ${stats.starting.weight} ${stats.starting.unit}` : 'No weight logged today'}
            </p>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {stats.current ? `${stats.current.weight} ${stats.current.unit}` : 
               stats.starting ? `${stats.starting.weight} ${stats.starting.unit}` : '--'}
            </div>
            <div className="text-white/60 text-sm">
              {stats.totalChange !== 0 ? `${stats.totalChange > 0 ? '+' : ''}${stats.totalChange} ${stats.current?.unit || stats.starting?.unit || 'kg'} total change` : 'No change yet'}
            </div>
          </div>
        </div>

        {(stats.current || stats.starting) && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Starting weight</span>
            <span className="text-white/60">{stats.starting ? `${stats.starting.weight} ${stats.starting.unit}` : 'Not set'}</span>
          </div>
        )}
        
        {/* Show info when displaying profile weight */}
        {!stats.current && stats.starting && (
          <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-blue-300 text-sm">
              <FaInfoCircle className="text-blue-400" />
              <span>Showing your initial weight from onboarding. Log your first weight entry to start tracking progress!</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Add Weight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FaPlus className="text-cyan-400" />
          Quick Add Weight
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-white/70 text-sm mb-2">Weight</label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="Enter weight"
                className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none"
              />
              <select
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className="w-20 p-3 bg-gray-800 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="kg" className="bg-gray-800 text-white hover:bg-gray-700">kg</option>
                <option value="lbs" className="bg-gray-800 text-white hover:bg-gray-700">lbs</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-white/70 text-sm mb-2">Date</label>
            <input
              type="date"
              value={formData.timestamp}
              onChange={(e) => handleInputChange('timestamp', e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-white/70 text-sm mb-2">Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-white/70 text-sm mb-2">Notes (Optional)</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Add any notes about your weight..."
            rows="2"
            maxLength={500}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none resize-none"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => addWeight(e)}
                     disabled={submitting || !formData.weight || !formData.timestamp || !formData.time || Object.keys(errors).some(key => errors[key] !== null)}
          className="w-full mt-4 p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Logging...
            </div>
          ) : (
            <>
              <FaPlus className="inline mr-2" />
              Log Weight
            </>
          )}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Enhanced Charts Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <FaChartLine className="text-cyan-400" />
              Weight Analytics
            </h3>
            
            {/* Chart View Toggle */}
                      <div className="flex flex-wrap items-center gap-2">
            {['daily', 'weekly', 'monthly'].map((view) => (
              <motion.button
                key={view}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('🔄 Chart view changing from', chartView, 'to', view);
                  setChartView(view);
                }}
                className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 graph-view-btn ${
                  chartView === view
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </motion.button>
            ))}
          </div>
          </div>
          
          
          {(() => {
            const chartData = getChartData(chartView);
            console.log('🔍 Chart container - chartData received:', chartData, 'chartView:', chartView);
            console.log('🔍 Chart container - chartData type:', typeof chartData, 'isArray:', Array.isArray(chartData));
            console.log('🔍 Chart container - chartData details:', {
              length: chartData?.length,
              firstItem: chartData?.[0],
              allItems: chartData
            });
            
            // Check if we have any data entries (not just values > 0)
            const hasData = chartData && chartData.length > 0;
            console.log('🔍 Chart container - hasData:', hasData, 'chartData.length:', chartData?.length);
            
            if (hasData) {
              console.log('✅ Rendering chart with data:', chartData);
              const renderedChart = renderChart();
              console.log('🔍 renderChart returned:', renderedChart);
              return (
                <div className="h-64 sm:h-80">
                  {renderedChart}
                </div>
              );
            } else {
              console.log('⚠️ No chart data, showing empty state for view:', chartView);
              return (
                <div className="text-center text-white/60 py-8">
                  <FaChartLine className="text-4xl mx-auto mb-2 opacity-50" />
                  <p>No {chartView === 'daily' ? 'weight data for today' : chartView === 'weekly' ? 'weight data for this week' : 'weight data for this month'}</p>
                  <p className="text-sm mt-2">Start logging your weight to see analytics</p>
                </div>
              );
            }
          })()}
          
          {/* Chart Summary */}
          <div className="mt-4 p-3 rounded-lg border border-white/20">
            <div className="text-white/70 text-sm mb-1">
              {chartView === 'daily' && 'Today - Weight Entries'}
              {chartView === 'weekly' && 'Current Week - Daily Breakdown'}
              {chartView === 'monthly' && 'Current Month - Daily Breakdown'}
            </div>
            <div className="text-white font-medium">
              {(() => {
                const chartData = getChartData(chartView);
                if (chartData && chartData.length > 0) {
                  // Count entries with actual weight data (value > 0)
                  const actualEntries = chartData.filter(item => item.value > 0).length;
                  return `Entries: ${actualEntries}`;
                } else {
                  return 'No entries available';
                }
              })()}
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
            <FaCalendarAlt className="text-cyan-400" />
            Statistics
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/20 hover:bg-white/5 transition-all duration-200">
              <div className="flex items-center gap-3">
                <FaWeight className="text-blue-400" />
                <span className="text-white">Current Weight</span>
              </div>
              <span className="text-white font-medium">
                {stats.current ? `${stats.current.weight} ${stats.current.unit}` : 'No data'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/20 hover:bg-white/5 transition-all duration-200">
              <div className="flex items-center gap-3">
                <trendInfo.icon className={trendInfo.color} />
                <span className="text-white">Total Change</span>
              </div>
              <span className="text-white font-medium">
                {stats.totalChange !== 0 ? `${stats.totalChange > 0 ? '+' : ''}${stats.totalChange} ${stats.current?.unit || 'kg'}` : '0 kg'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/20 hover:bg-white/5 transition-all duration-200">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-green-400" />
                <span className="text-white">This Week</span>
              </div>
              <span className="text-white font-medium">{stats.thisWeek} entries</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/20 hover:bg-white/5 transition-all duration-200">
              <div className="flex items-center gap-3">
                <FaChartLine className="text-purple-400" />
                <span className="text-white">Total Entries</span>
              </div>
              <span className="text-white font-medium">{stats.totalEntries}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Weight Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="backdrop-blur-xl border border-white/20 rounded-2xl p-6 mt-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FaWeight className="text-purple-400" />
          AI Weight Management Tips
        </h3>
        {recommendations?.weightProgress ? (
          <AIRecommendationCard
            title="Weight Management"
            recommendation={recommendations.weightProgress}
            feature="weightProgress"
            userId={user?.id}
          />
        ) : (
          <div className="text-center py-4">
            <p className="text-white/60 mb-2">No AI recommendations available yet.</p>
            <p className="text-white/40 text-sm">Complete your onboarding to get personalized AI recommendations.</p>
          </div>
        )}
      </motion.div>

      {/* Recent Weight Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="backdrop-blur-xl border border-white/20 rounded-2xl p-6 mt-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FaWeight className="text-cyan-400" />
            Recent Weight Logs
          </h3>
          
          {/* Filter Controls */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHelp(true)}
              className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
              title="Help & Tips"
            >
              <FaInfoCircle size={14} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportData}
              className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
              title="Export Data"
            >
              <FaDownload size={14} />
            </motion.button>
          </div>
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-white/60" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-cyan-400"
            >
              <option value="all" className="bg-gray-800 text-white">All Time</option>
              <option value="thisWeek" className="bg-gray-800 text-white">This Week</option>
              <option value="thisMonth" className="bg-gray-800 text-white">This Month</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <FaSort className="text-white/60" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-cyan-400"
            >
              <option value="date" className="bg-gray-800 text-white">Date</option>
              <option value="weight" className="bg-gray-800 text-white">Weight</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="bg-white/10 text-white p-1 rounded hover:bg-white/20 transition-all duration-200"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              <FaWeight className="text-4xl mx-auto mb-2 opacity-50" />
              <p>{filter !== 'all' ? 'No weight logs found for the selected filter.' : 'No weight logs yet. Start tracking your weight!'}</p>
            </div>
          ) : (
                         filteredLogs.slice(0, 10).map((log) => (
               <div key={log._id}>
                 <motion.div
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex items-center justify-between p-4 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-200"
                 >
                   <div className="flex items-center gap-4">
                     <div className="p-2 bg-cyan-400/20 rounded-lg border border-cyan-400/30">
                       <FaWeight className="text-cyan-400" />
                     </div>
                     <div>
                       <div className="text-white font-medium">{log.weight} {log.unit}</div>
                       <div className="text-white/60 text-sm">
                         {new Date(log.timestamp).toLocaleDateString('en-US', {
                           month: 'short',
                           day: 'numeric'
                         })} at {new Date(log.timestamp).toLocaleTimeString('en-US', {
                           hour: '2-digit',
                           minute: '2-digit',
                           hour12: true
                         })}
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-2">
                     {log.notes && (
                       <button
                         onClick={() => setShowNotes(prev => ({ ...prev, [log._id]: !prev[log._id] }))}
                         className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg border border-blue-400/30 transition-colors"
                       >
                         {showNotes[log._id] ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                       </button>
                     )}
                     <motion.button
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={() => handleEdit(log)}
                       className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg border border-blue-400/30 transition-colors edit-weight-btn"
                     >
                       <FaEdit />
                     </motion.button>
                     <motion.button
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.9 }}
                       onClick={() => deleteWeight(log._id)}
                       className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg border border-red-400/30 transition-colors delete-weight-btn"
                     >
                       <FaTrash />
                     </motion.button>
                   </div>
                 </motion.div>
                 
                 {log.notes && showNotes[log._id] && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10"
                   >
                     <p className="text-white/70 text-sm">{log.notes}</p>
                   </motion.div>
                 )}
               </div>
             ))
          )}
        </div>

               </motion.div>

      {/* Add Weight Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Log Weight</h3>
              <form onSubmit={addWeight} className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Weight <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      className={`flex-1 bg-white/10 border rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none transition-colors ${
                        errors.weight ? 'border-red-400' : 'border-white/20 focus:border-cyan-400'
                      }`}
                      placeholder="Enter weight"
                    />
                    <select
                      value={formData.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      className="bg-gray-800 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="kg" className="bg-gray-800 text-white">kg</option>
                      <option value="lbs" className="bg-gray-800 text-white">lbs</option>
                    </select>
                  </div>
                  {errors.weight && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <FaExclamationTriangle size={12} />
                      {errors.weight}
                    </p>
                  )}
                  <p className="text-white/40 text-xs mt-1">
                    Limits: {formData.unit === 'kg' ? `${WEIGHT_LIMITS.MIN_KG}-${WEIGHT_LIMITS.MAX_KG} kg` : `${WEIGHT_LIMITS.MIN_LBS}-${WEIGHT_LIMITS.MAX_LBS} lbs`}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.timestamp}
                      onChange={(e) => handleInputChange('timestamp', e.target.value)}
                      className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors ${
                        errors.date ? 'border-red-400' : 'border-white/20 focus:border-cyan-400'
                      }`}
                    />
                    {errors.date && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <FaExclamationTriangle size={12} />
                        {errors.date}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Time <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors ${
                        errors.time ? 'border-red-400' : 'border-white/20 focus:border-cyan-400'
                      }`}
                    />
                    {errors.time && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <FaExclamationTriangle size={12} />
                        {errors.time}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Notes <span className="text-white/40">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none transition-colors ${
                      errors.notes ? 'border-red-400' : 'border-white/20 focus:border-cyan-400'
                    }`}
                    placeholder="Add any notes..."
                    rows="3"
                    maxLength={500}
                  />
                  {errors.notes && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <FaExclamationTriangle size={12} />
                      {errors.notes}
                    </p>
                  )}
                  <p className="text-white/40 text-xs mt-1">
                    {formData.notes.length}/500 characters
                  </p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !formData.weight || !formData.timestamp || !formData.time || Object.keys(errors).some(key => errors[key] !== null)}
                    className="flex-1 bg-gradient-to-r from-cyan-400 to-purple-400 text-white py-2 rounded-lg hover:from-cyan-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-gray-600"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Logging...
                      </div>
                    ) : (
                      'Log Weight'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Weight Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Edit Weight</h3>
              <form onSubmit={updateWeight} className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Weight <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      className={`flex-1 bg-white/10 border rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none transition-colors ${
                        errors.weight ? 'border-red-400' : 'border-white/20 focus:border-cyan-400'
                      }`}
                      placeholder="Enter weight"
                    />
                    <select
                      value={formData.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      className="bg-gray-800 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="kg" className="bg-gray-800 text-white">kg</option>
                      <option value="lbs" className="bg-gray-800 text-white">lbs</option>
                    </select>
                  </div>
                  {errors.weight && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <FaExclamationTriangle size={12} />
                      {errors.weight}
                    </p>
                  )}
                  <p className="text-white/40 text-xs mt-1">
                    Limits: {formData.unit === 'kg' ? `${WEIGHT_LIMITS.MIN_KG}-${WEIGHT_LIMITS.MAX_KG} kg` : `${WEIGHT_LIMITS.MIN_LBS}-${WEIGHT_LIMITS.MAX_LBS} lbs`}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.timestamp}
                      onChange={(e) => handleInputChange('timestamp', e.target.value)}
                      className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors ${
                        errors.date ? 'border-red-400' : 'border-white/20 focus:border-cyan-400'
                      }`}
                    />
                    {errors.date && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <FaExclamationTriangle size={12} />
                        {errors.date}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Time <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors ${
                        errors.time ? 'border-red-400' : 'border-white/20 focus:border-cyan-400'
                      }`}
                    />
                    {errors.time && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <FaExclamationTriangle size={12} />
                        {errors.time}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Notes <span className="text-white/40">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none transition-colors ${
                      errors.notes ? 'border-red-400' : 'border-white/20 focus:border-cyan-400'
                    }`}
                    placeholder="Add any notes..."
                    rows="3"
                    maxLength={500}
                  />
                  {errors.notes && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <FaExclamationTriangle size={12} />
                      {errors.notes}
                    </p>
                  )}
                  <p className="text-white/40 text-xs mt-1">
                    {formData.notes.length}/500 characters
                  </p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !formData.weight || !formData.timestamp || !formData.time || Object.keys(errors).length > 0}
                    className="flex-1 bg-gradient-to-r from-cyan-400 to-purple-400 text-white py-2 rounded-lg hover:from-cyan-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      'Update Weight'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Weight Tracker Help & Tips</h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FaInfoCircle className="text-cyan-400" />
                    Getting Started
                  </h4>
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <p className="text-white/80">
                      • <strong>Log your weight</strong> by clicking the "Log Weight" button
                    </p>
                    <p className="text-white/80">
                      • <strong>Set realistic goals</strong> - aim for 0.5-1 kg (1-2 lbs) per week
                    </p>
                    <p className="text-white/80">
                      • <strong>Be consistent</strong> - weigh yourself at the same time each day
                    </p>
                    <p className="text-white/80">
                      • <strong>Track progress</strong> using the charts and statistics
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FaWeight className="text-blue-400" />
                    Weight Guidelines
                  </h4>
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <p className="text-white/80">
                      • <strong>Minimum weight:</strong> {WEIGHT_LIMITS.MIN_KG} kg / {WEIGHT_LIMITS.MIN_LBS} lbs
                    </p>
                    <p className="text-white/80">
                      • <strong>Maximum weight:</strong> {WEIGHT_LIMITS.MAX_KG} kg / {WEIGHT_LIMITS.MAX_LBS} lbs
                    </p>
                    <p className="text-white/80">
                      • <strong>Date limits:</strong> Can't log weight more than {DATE_LIMITS.MAX_FUTURE_DAYS} days in the future
                    </p>
                    <p className="text-white/80">
                      • <strong>Notes:</strong> Optional notes up to 500 characters
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FaChartLine className="text-green-400" />
                    Features
                  </h4>
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <p className="text-white/80">
                      • <strong>Charts:</strong> View daily, weekly, or monthly progress
                    </p>
                    <p className="text-white/80">
                      • <strong>Filtering:</strong> View all time, this week, or this month
                    </p>
                    <p className="text-white/80">
                      • <strong>Sorting:</strong> Sort by date or weight, ascending or descending
                    </p>
                    <p className="text-white/80">
                      • <strong>Export:</strong> Download your data as JSON
                    </p>
                    <p className="text-white/80">
                      • <strong>Trends:</strong> See if you're gaining, losing, or maintaining weight
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FaCheckCircle className="text-purple-400" />
                    Best Practices
                  </h4>
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <p className="text-white/80">
                      • Weigh yourself first thing in the morning, after using the bathroom
                    </p>
                    <p className="text-white/80">
                      • Use the same scale and wear similar clothing each time
                    </p>
                    <p className="text-white/80">
                      • Don't get discouraged by daily fluctuations - focus on trends
                    </p>
                    <p className="text-white/80">
                      • Combine weight tracking with other health metrics for best results
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
    </SignedIn>
  );
};

export default WeightTracker; 