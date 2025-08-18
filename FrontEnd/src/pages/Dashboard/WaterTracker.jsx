import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useAuth } from '@clerk/clerk-react';
import { 
  FaTint, 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaChartBar, 
  FaCalendarAlt,
  FaGlassWhiskey,
  FaWineBottle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaTimes,
  FaChartLine,
  FaChartPie,
  FaLeaf,
  FaBed
} from 'react-icons/fa';
import { BarChart, ProgressBar, LineChart, DoughnutChart } from '@/components/custom/ChartComponents';
import AIRecommendationCard from "@/components/custom/AIRecommendationCard";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import toast from 'react-hot-toast';
import { API_BASE_URL } from "../../config/api.js";

const WaterTracker = () => {
  const { user } = useUser();
  const { recommendations } = useAIRecommendations();
  const [waterLogs, setWaterLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [weeklyData, setWeeklyData] = useState({});
  const [stats, setStats] = useState({
    todayTotal: 0,
    weekTotal: 0,
    monthTotal: 0,
    averageDaily: 0,
    dailyBreakdown: {}
  });
  const [loading, setLoading] = useState(true);
  const [addingWater, setAddingWater] = useState(false);
  const [quickAmount, setQuickAmount] = useState(250);
  const [customAmount, setCustomAmount] = useState('');
  const [editingLog, setEditingLog] = useState(null);
  const [deletingLog, setDeletingLog] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [backendError, setBackendError] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState(null);
  const [waterIntakeGoal, setWaterIntakeGoal] = useState(2000); // Default 2L
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);
  
  // Filter state
  const [filterType, setFilterType] = useState('all'); // all, today, week, month, custom
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Graph view state
  const [activeGraphView, setActiveGraphView] = useState('daily'); // daily, weekly, monthly

  const progressPercentage = (todayTotal / waterIntakeGoal) * 100;

  // Quick add amounts - Updated icons to use available ones
  const quickAmounts = [
    { amount: 250, label: 'Glass', icon: FaGlassWhiskey },
    { amount: 500, label: 'Bottle', icon: FaWineBottle },
    { amount: 1000, label: 'Large Bottle', icon: FaWineBottle },
    { amount: 150, label: 'Small Glass', icon: FaGlassWhiskey }
  ];

  const aiRecommendations = [
    {
      type: 'nutrition',
      title: 'Increase Protein Intake',
      description: 'You\'re 15% below your protein goal. Consider adding lean meats or legumes to your next meal.',
      icon: FaLeaf,
      priority: 'high'
    },
    {
      type: 'hydration',
      title: todayTotal >= waterIntakeGoal ? 'Great Hydration!' : 'Stay Hydrated',
      description: todayTotal >= waterIntakeGoal 
        ? `Excellent! You've consumed ${todayTotal}ml today. Keep up the great work!`
        : `You've had ${todayTotal}ml today. Aim for ${waterIntakeGoal - todayTotal}ml more to reach your daily goal.`,
      icon: FaTint,
      priority: todayTotal >= waterIntakeGoal ? 'low' : 'medium'
    },
    {
      type: 'sleep',
      title: 'Great Sleep Pattern',
      description: 'You\'re consistently getting 7-8 hours. Keep up this healthy sleep routine!',
      icon: FaBed,
      priority: 'low'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchWaterData();
      fetchWaterStats();
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/${user.id}`);
      
      if (response.ok) {
        const userData = await response.json();
        setUserData(userData);
        setWaterIntakeGoal(userData.waterIntakeGoal || 2000);
      } else {
        console.error('Error fetching user data:', response.status);
        // Keep default goal if user data fetch fails
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Keep default goal if user data fetch fails
    }
  };

  const fetchWaterData = async () => {
    try {
      setBackendError(false);
      const response = await fetch(`${API_BASE_URL}/api/water?userId=${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        const logs = data.waterLogs || [];
        setWaterLogs(logs);
        setFilteredLogs(logs); // Initially show all logs
        setTodayTotal(data.todayTotal || 0);
        setWeeklyData(data.weeklyData || {});
      } else {
        console.error('Error response:', response.status);
        setBackendError(true);
        toast.error('Failed to load water data');
      }
    } catch (error) {
      console.error('Error fetching water data:', error);
      setBackendError(true);
      toast.error('Failed to load water data - Backend may not be running');
    } finally {
      setLoading(false);
    }
  };

  const fetchWaterStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/water/stats?userId=${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {
          todayTotal: 0,
          weekTotal: 0,
          monthTotal: 0,
          averageDaily: 0,
          dailyBreakdown: {}
        });
      }
    } catch (error) {
      console.error('Error fetching water stats:', error);
    }
  };

  const addWater = async (amount) => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (backendError) {
      toast.error('Backend is not available. Please start the server.');
      return;
    }

    setAddingWater(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/water`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          amount: parseInt(amount)
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Added ${amount}ml of water!`);
        fetchWaterData();
        fetchWaterStats();
        setCustomAmount('');
        setShowCustomModal(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to add water');
      }
    } catch (error) {
      console.error('Error adding water:', error);
      toast.error('Failed to add water - Backend may not be running');
    } finally {
      setAddingWater(false);
    }
  };

  const deleteWater = async (logId) => {
    if (backendError) {
      toast.error('Backend is not available. Please start the server.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/water/${logId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Water log deleted');
        fetchWaterData();
        fetchWaterStats();
        setDeletingLog(null); // Close modal
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete water log');
      }
    } catch (error) {
      console.error('Error deleting water log:', error);
      toast.error('Failed to delete water log');
    }
  };

  // Filter functions
  const applyFilters = () => {
    let filtered = [...waterLogs];
    
    switch (filterType) {
      case 'today': {
        const today = new Date();
        filtered = filtered.filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate.toDateString() === today.toDateString();
        });
        break;
      }
      case 'week': {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate >= weekAgo;
        });
        break;
      }
      case 'month': {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate >= monthAgo;
        });
        break;
      }
      case 'custom': {
        if (customDateRange.startDate && customDateRange.endDate) {
          const startDate = new Date(customDateRange.startDate);
          const endDate = new Date(customDateRange.endDate);
          endDate.setHours(23, 59, 59); // Include the entire end date
          filtered = filtered.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= startDate && logDate <= endDate;
        });
        }
        break;
      }
      default:
        // 'all' - no filtering
        break;
    }
    
    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Pagination functions
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Apply filters when filter type or date range changes
  useEffect(() => {
    applyFilters();
  }, [filterType, customDateRange, waterLogs]);

  // Debug: Monitor waterLogs changes
  useEffect(() => {
    console.log("💧 WaterLogs updated:", {
      count: waterLogs.length,
      sample: waterLogs.slice(0, 2),
      activeGraphView
    });
  }, [waterLogs, activeGraphView]);

  // Chart data generation functions
  const generateDailyChartData = () => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayStart.getDate() + 1);
    
    // Get hourly breakdown for today only
    const hourlyData = Array(24).fill(0);
    
    const todayLogs = waterLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= todayStart && logDate < todayEnd;
    });
    
    todayLogs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      hourlyData[hour] += log.amount;
    });
    
    return hourlyData.map((amount, hour) => ({
      label: `${hour}:00`,
      value: amount || 0
    }));
  };

  const generateWeeklyChartData = () => {
    const today = new Date();
    
    // Calculate the start of the current week (Sunday)
    const currentWeekStart = new Date(today);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    currentWeekStart.setDate(today.getDate() - dayOfWeek);
    
    // Calculate the end of the current week (Saturday)
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    
    const days = [];
    
    // Generate data for each day of the current week
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(currentWeekStart);
      currentDate.setDate(currentWeekStart.getDate() + i);
      
      const dayLogs = waterLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === currentDate.toDateString();
      });
      
      const totalAmount = dayLogs.reduce((sum, log) => sum + (log.amount || 0), 0);
      
      days.push({
        label: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
        value: totalAmount || 0
      });
    }
    
    return days;
  };

  const generateMonthlyChartData = () => {
    const today = new Date();
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Check if we have any water logs at all
    if (waterLogs.length === 0) {
      console.log('⚠️ No water logs available for monthly chart');
      return [];
    }
    
    console.log('📅 Monthly Chart Debug:', {
      today: today.toDateString(),
      currentMonthStart: currentMonthStart.toDateString(),
      currentMonthEnd: currentMonthEnd.toDateString(),
      daysInMonth: currentMonthEnd.getDate(),
      totalWaterLogs: waterLogs.length,
      waterLogsSample: waterLogs.slice(0, 3), // Show first 3 logs for debugging
      firstLogDate: waterLogs[0] ? new Date(waterLogs[0].timestamp).toDateString() : 'No logs',
      lastLogDate: waterLogs[waterLogs.length - 1] ? new Date(waterLogs[waterLogs.length - 1].timestamp).toDateString() : 'No logs'
    });
    
    const days = [];
    
    // Get the number of days in the current month
    const daysInCurrentMonth = currentMonthEnd.getDate();
    
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const currentDate = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth(), i);
      
      const dayLogs = waterLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        const isSameDay = logDate.toDateString() === currentDate.toDateString();
        
        // Debug logging for first few days
        if (i <= 3) {
          console.log(`🔍 Day ${i} filtering:`, {
            currentDate: currentDate.toDateString(),
            logDate: logDate.toDateString(),
            isSameDay,
            logAmount: log.amount
          });
        }
        
        return isSameDay;
      });
      
      const totalAmount = dayLogs.reduce((sum, log) => sum + (log.amount || 0), 0);
      
      // Create better labels for the monthly view
      const dayLabel = `${i}${getDaySuffix(i)}`;
      
      days.push({
        label: dayLabel,
        value: totalAmount || 0
      });
    }
    
    console.log('📊 Monthly Chart Data:', days);
    return days;
  };

  // Helper function to add ordinal suffix to day numbers
  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const generateHourlyDistributionData = () => {
    const hourlyData = Array(24).fill(0);
    
    waterLogs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      hourlyData[hour] += log.amount;
    });
    
    return hourlyData.map((amount, hour) => ({
      label: `${hour}:00`,
      value: amount
    }));
  };

  const getChartData = () => {
    switch (activeGraphView) {
      case 'daily':
        return generateDailyChartData();
      case 'weekly':
        return generateWeeklyChartData();
      case 'monthly':
        return generateMonthlyChartData();
      default:
        return generateDailyChartData();
    }
  };

  const getChartComponent = () => {
    switch (activeGraphView) {
      case 'daily':
        return <LineChart data={getChartData()} height={200} color="from-blue-400 to-cyan-400" />;
      case 'weekly':
        return <BarChart data={getChartData()} height={200} color="from-green-400 to-emerald-400" />;
      case 'monthly':
        return <BarChart data={getChartData()} height={300} color="from-purple-400 to-pink-400" />;
      default:
        return <LineChart data={getChartData()} height={200} color="from-blue-400 to-cyan-400" />;
    }
  };

  const updateWater = async (logId, amount) => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (backendError) {
      toast.error('Backend is not available. Please start the server.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/water/${logId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: parseInt(amount) })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Water log updated!');
        fetchWaterData();
        fetchWaterStats();
        setEditingLog(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update water log');
      }
    } catch (error) {
      console.error('Error updating water log:', error);
      toast.error('Failed to update water log');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'from-green-400 to-emerald-500';
    if (percentage >= 75) return 'from-blue-400 to-cyan-500';
    if (percentage >= 50) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getMotivationalMessage = () => {
    if (progressPercentage >= 100) return "Excellent! You've reached your daily goal! 🎉";
    if (progressPercentage >= 75) return "Great progress! Almost there! 💪";
    if (progressPercentage >= 50) return "Halfway there! Keep going! 🌊";
    if (progressPercentage >= 25) return "Good start! Stay hydrated! 💧";
    return "Time to start hydrating! Your body needs water! 🚰";
  };

  const chartData = Object.entries(weeklyData).map(([date, amount]) => ({
    label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: amount
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

    return (
    <>
      {/* Backend Error Warning */}
      {backendError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-400/20 to-red-600/20 border border-red-400/30 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-red-400 text-xl" />
            <div>
              <h3 className="text-white font-medium">Backend Connection Issue</h3>
              <p className="text-white/70 text-sm">Please ensure the backend server is running on port 5000</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Today's Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaTint className="text-cyan-400" />
              Today's Hydration
            </h2>
            <p className="text-white/60 mt-1">{getMotivationalMessage()}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{todayTotal}ml</div>
            <div className="text-white/60">of {waterIntakeGoal}ml goal</div>
          </div>
        </div>

        <ProgressBar 
          value={todayTotal} 
          max={waterIntakeGoal} 
          color={getProgressColor(progressPercentage)}
          showLabel={true}
        />

        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-white/60">0ml</span>
          <span className="text-white/60">{waterIntakeGoal}ml</span>
        </div>
      </motion.div>

      {/* Quick Add Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FaPlus className="text-cyan-400" />
          Quick Add Water
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {quickAmounts.map((item, index) => (
            <motion.button
              key={item.amount}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addWater(item.amount)}
              disabled={addingWater || backendError}
              className="p-4 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 border border-cyan-400/30 rounded-xl hover:from-cyan-400/30 hover:to-blue-400/30 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed water-amount-btn"
            >
              <item.icon className="text-2xl text-cyan-400 mx-auto mb-2" />
              <div className="text-white font-medium">{item.amount}ml</div>
              <div className="text-white/60 text-sm">{item.label}</div>
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCustomModal(true)}
          disabled={backendError}
          className="w-full p-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed quick-add-btn"
        >
          <FaPlus className="inline mr-2" />
          Add Custom Amount
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaTint className="text-blue-400" />
            AI Hydration Tips
          </h3>
          {recommendations?.hydration ? (
            <AIRecommendationCard
              title="Hydration"
              recommendation={recommendations.hydration}
              feature="hydration"
              userId={user?.id}
            />
          ) : (
            <div className="text-center py-4">
              <p className="text-white/60 mb-2">No AI recommendations available yet.</p>
              <p className="text-white/40 text-sm">Complete your onboarding to get personalized AI recommendations.</p>
            </div>
          )}
        </motion.div>

        {/* Enhanced Charts Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FaChartBar className="text-cyan-400" />
              Water Analytics
            </h3>
            
            {/* Chart View Toggle */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveGraphView('daily')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 graph-view-btn ${
                  activeGraphView === 'daily'
                    ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <FaChartBar className="inline mr-1" />
                Daily
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveGraphView('weekly')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 graph-view-btn ${
                  activeGraphView === 'weekly'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <FaChartLine className="inline mr-1" />
                Weekly
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveGraphView('monthly')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 graph-view-btn ${
                  activeGraphView === 'monthly'
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <FaChartPie className="inline mr-1" />
                Monthly
              </motion.button>
            </div>
          </div>
          
          {getChartData().length > 0 ? (
            <div className={`h-${activeGraphView === 'monthly' ? '80' : '64'}`}>
              {getChartComponent()}
            </div>
          ) : (
            <div className="text-center text-white/60 py-8">
              <FaChartBar className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No data available for {activeGraphView === 'daily' ? 'today' : activeGraphView === 'weekly' ? 'this week' : 'this month'}. Start tracking your water intake!</p>
            </div>
          )}
          
          {/* Chart Summary */}
          <div className="mt-4 p-3 rounded-lg border border-white/20">
            <div className="text-white/70 text-sm mb-1">
              {activeGraphView === 'daily' && 'Today - Hourly Breakdown'}
              {activeGraphView === 'weekly' && 'Current Week - Daily Breakdown'}
              {activeGraphView === 'monthly' && 'Current Month - Daily Breakdown'}
            </div>
            <div className="text-white font-medium">
              Total: {getChartData().reduce((sum, item) => sum + item.value, 0)}ml
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaCalendarAlt className="text-cyan-400" />
            Statistics
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/20 hover:bg-white/5 transition-all duration-200">
              <div className="flex items-center gap-3">
                <FaTint className="text-blue-400" />
                <span className="text-white">This Week</span>
              </div>
              <span className="text-white font-medium">{stats.weekTotal}ml</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/20 hover:bg-white/5 transition-all duration-200">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-green-400" />
                <span className="text-white">This Month</span>
              </div>
              <span className="text-white font-medium">{stats.monthTotal}ml</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/20 hover:bg-white/5 transition-all duration-200">
              <div className="flex items-center gap-3">
                <FaChartBar className="text-purple-400" />
                <span className="text-white">Daily Average</span>
              </div>
              <span className="text-white font-medium">{stats.averageDaily}ml</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="backdrop-blur-xl border border-white/20 rounded-2xl p-6 mt-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FaTint className="text-cyan-400" />
            Recent Water Logs
          </h3>
          
          {/* Filter Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <FaFilter className="text-sm" />
          </motion.button>
        </div>

        {/* Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 border border-white/20 rounded-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Filter Type */}
                <div>
                  <label className="block text-white/70 text-sm mb-2">Filter Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full p-2 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none bg-gray-900"
                    style={{
                      backgroundImage: 'none',
                      backgroundColor: '#111827'
                    }}
                  >
                    <option value="all" className="bg-gray-900 text-white">All Time</option>
                    <option value="today" className="bg-gray-900 text-white">Today</option>
                    <option value="week" className="bg-gray-900 text-white">Last 7 Days</option>
                    <option value="month" className="bg-gray-900 text-white">Last 30 Days</option>
                    <option value="custom" className="bg-gray-900 text-white">Custom Range</option>
                  </select>
                </div>

                {/* Custom Date Range */}
                {filterType === 'custom' && (
                  <>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Start Date</label>
                      <input
                        type="date"
                        value={customDateRange.startDate}
                        onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full p-2 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">End Date</label>
                      <input
                        type="date"
                        value={customDateRange.endDate}
                        onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full p-2 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterType('all');
                      setCustomDateRange({ startDate: '', endDate: '' });
                    }}
                    className="w-full p-2 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    <FaTimes className="inline mr-2" />
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4 text-white/70 text-sm">
          <span>Showing {filteredLogs.length} logs</span>
          {filterType !== 'all' && (
            <span>Filtered by: {filterType === 'today' ? 'Today' : filterType === 'week' ? 'Last 7 Days' : filterType === 'month' ? 'Last 30 Days' : 'Custom Range'}</span>
          )}
        </div>
        
        {currentLogs.length > 0 ? (
          <>
            <div className="space-y-3">
              {currentLogs.map((log) => (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-cyan-400/20 rounded-lg border border-cyan-400/30">
                      <FaTint className="text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{log.amount}ml</div>
                      <div className="text-white/60 text-sm">
                        {formatTime(log.timestamp)} • {formatDate(log.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingLog(log)}
                      disabled={backendError}
                      className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg border border-blue-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed edit-water-btn"
                    >
                      <FaEdit />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setDeletingLog(log)}
                      disabled={backendError}
                      className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg border border-red-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed delete-water-btn"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
                <div className="text-white/70 text-sm">
                  Showing {indexOfFirstLog + 1} to {Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} logs
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="p-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed prev-btn"
                  >
                    <FaChevronLeft />
                  </motion.button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => paginate(pageNum)}
                          className={`px-3 py-2 rounded-lg transition-all duration-200 pagination-btn ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed next-btn"
                  >
                    <FaChevronRight />
                  </motion.button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-white/60 py-8">
            <FaTint className="text-4xl mx-auto mb-2 opacity-50" />
            <p>{filterType === 'all' ? 'No water logs yet. Start tracking your hydration!' : 'No water logs found for the selected filter.'}</p>
          </div>
        )}
      </motion.div>

      {/* Custom Amount Modal */}
      <AnimatePresence>
        {showCustomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCustomModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Add Custom Amount</h3>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount in ml"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addWater(customAmount)}
                  disabled={addingWater || !customAmount || backendError}
                  className="flex-1 p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {addingWater ? 'Adding...' : 'Add Water'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditingLog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Edit Water Log</h3>
              <input
                type="number"
                defaultValue={editingLog.amount}
                onChange={(e) => setEditingLog({...editingLog, amount: e.target.value})}
                placeholder="Enter amount in ml"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingLog(null)}
                  className="flex-1 p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateWater(editingLog._id, editingLog.amount)}
                  disabled={backendError}
                  className="flex-1 p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  Update
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeletingLog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
              <p className="text-white/70 mb-4">Are you sure you want to delete this water log?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletingLog(null)}
                  className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteWater(deletingLog._id)}
                  disabled={backendError}
                  className="p-3 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {backendError ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WaterTracker; 