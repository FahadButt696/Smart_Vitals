import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { 
  FaBed,
  FaMoon,
  FaSun,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaClock,
  FaStar,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaTimes,
  FaSave,
  FaChevronLeft,
  FaChevronRight,
  FaFilter
} from 'react-icons/fa';
import { BarChart, ProgressBar, LineChart, DoughnutChart } from '@/components/custom/ChartComponents';
import AIRecommendationCard from "@/components/custom/AIRecommendationCard";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import toast from 'react-hot-toast';

const SleepTracker = () => {
  const { user } = useUser();
  const { recommendations } = useAIRecommendations();
  const [sleepLogs, setSleepLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [stats, setStats] = useState({
    today: { duration: 0, quality: null, startTime: null, endTime: null },
    weekly: { total: 0, average: 0, count: 0 },
    monthly: { total: 0, average: 0, count: 0 },
    dailyBreakdown: {},
    qualityDistribution: {}
  });
  const [todaySleep, setTodaySleep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingSleep, setAddingSleep] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [deletingLog, setDeletingLog] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeGraphView, setActiveGraphView] = useState('daily');
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [sleepForm, setSleepForm] = useState({
    startTime: '',
    endTime: '',
    quality: 'good',
    notes: ''
  });

  const qualityOptions = [
    { value: 'excellent', label: 'Excellent', color: 'from-green-400 to-emerald-500', icon: '😴' },
    { value: 'good', label: 'Good', color: 'from-blue-400 to-cyan-500', icon: '😊' },
    { value: 'fair', label: 'Fair', color: 'from-yellow-400 to-orange-500', icon: '😐' },
    { value: 'poor', label: 'Poor', color: 'from-orange-400 to-red-500', icon: '😞' },
    { value: 'restless', label: 'Restless', color: 'from-red-400 to-pink-500', icon: '😵' }
  ];

  const [sleepGoal, setSleepGoal] = useState(8);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editingGoalValue, setEditingGoalValue] = useState(8);

  // Calculate duration in hours between two timestamps
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
  };

  // Recalculate all stats based on current sleep logs
  const recalculateStats = useCallback(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Find today's sleep log (should only be one)
    const todayLog = sleepLogs.find(log => log.date === today);
    
    // Calculate weekly stats
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyLogs = sleepLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= weekAgo && logDate <= now;
    });
    
    const weeklyTotal = weeklyLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const weeklyAverage = weeklyLogs.length > 0 ? weeklyTotal / weeklyLogs.length : 0;
    
    // Calculate monthly stats
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const monthlyLogs = sleepLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= monthAgo && logDate <= now;
    });
    
    const monthlyTotal = monthlyLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const monthlyAverage = monthlyLogs.length > 0 ? monthlyTotal / monthlyLogs.length : 0;
    
    // Update stats
    setStats(prev => ({
      ...prev,
      today: {
        duration: todayLog?.duration || 0,
        quality: todayLog?.quality || null,
        startTime: todayLog?.startTime || null,
        endTime: todayLog?.endTime || null
      },
      weekly: {
        total: weeklyTotal,
        average: weeklyAverage,
        count: weeklyLogs.length
      },
      monthly: {
        total: monthlyTotal,
        average: monthlyAverage,
        count: monthlyLogs.length
      }
    }));

    // Update today's sleep
    setTodaySleep(todayLog || null);
  }, [sleepLogs]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchSleepData();
    }
  }, [user]);

  useEffect(() => {
    if (sleepLogs.length > 0) {
      recalculateStats();
    }
  }, [sleepLogs, recalculateStats]);

  useEffect(() => {
    applyFilters();
  }, [sleepLogs, filterType]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/user/profile?userId=${user.id}`);
      const data = await response.json();
      
      if (response.ok && data.user) {
        setSleepGoal(data.user.sleepGoal || 8);
        setEditingGoalValue(data.user.sleepGoal || 8);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const updateSleepGoal = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/user/sleepGoal`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          sleepGoal: editingGoalValue
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSleepGoal(editingGoalValue);
        setIsEditingGoal(false);
        toast.success('Sleep goal updated successfully!');
      } else {
        toast.error(data.error || 'Failed to update sleep goal');
      }
    } catch (error) {
      console.error('Error updating sleep goal:', error);
      toast.error('Failed to update sleep goal');
    }
  };

  const fetchSleepData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/sleep?userId=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setSleepLogs(data.logs || []);
      } else {
        toast.error('Failed to fetch sleep data');
      }
    } catch (error) {
      console.error('Error fetching sleep data:', error);
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sleepLogs];
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    switch (filterType) {
      case 'today':
        filtered = filtered.filter(log => log.date === today);
        break;
      case 'week':
        filtered = filtered.filter(log => log.date >= weekAgo);
        break;
      case 'month':
        filtered = filtered.filter(log => log.date >= monthAgo);
        break;
      default:
        break;
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const addSleep = async () => {
    if (!user || !sleepForm.startTime || !sleepForm.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }
  
    try {
      setAddingSleep(true);
      
      // Calculate the date from startTime
      const sleepDate = new Date(sleepForm.startTime).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      
      // Check if a sleep log already exists for the selected date
      const existingLog = sleepLogs.find(log => log.date === sleepDate);
      if (existingLog) {
        // Show professional error message
        const dateDisplay = sleepDate === today ? 'today' : `on ${new Date(sleepDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`;
        
        toast.error(`Sleep already logged for ${dateDisplay}. You can only have one sleep entry per day.`, {
          duration: 5000,
          icon: '😴',
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid #ef4444',
          },
        });
        setAddingSleep(false);
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/sleep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          startTime: sleepForm.startTime,
          endTime: sleepForm.endTime,
          quality: sleepForm.quality,
          notes: sleepForm.notes,
          date: sleepDate // Ensure date is included
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success('Sleep log added successfully!');
        await fetchSleepData();
        setShowAddModal(false);
        resetForm();
      } else {
        toast.error(data.error || 'Failed to add sleep log');
      }
    } catch (error) {
      console.error('Error adding sleep:', error);
      toast.error('Failed to add sleep log');
    } finally {
      setAddingSleep(false);
    }
  };

  const updateSleep = async () => {
    if (!editingLog || !sleepForm.startTime || !sleepForm.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check for date conflicts before updating
    const selectedDate = new Date(sleepForm.startTime).toISOString().split('T')[0];
    const originalDate = new Date(editingLog.startTime).toISOString().split('T')[0];
    const existingLog = sleepLogs.find(log => log.date === selectedDate && log._id !== editingLog._id);
    
    if (existingLog) {
      toast.error(`Cannot update to ${new Date(selectedDate).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}. Another sleep log already exists for that date.`, {
        duration: 5000,
        icon: '😴',
        style: {
          background: '#1f2937',
          color: '#f3f4f6',
          border: '1px solid #ef4444',
        },
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/sleep/${editingLog._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: sleepForm.startTime,
          endTime: sleepForm.endTime,
          quality: sleepForm.quality,
          notes: sleepForm.notes
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Sleep log updated successfully!');
        await fetchSleepData(); // Refresh all data
        setEditingLog(null);
        resetForm();
      } else {
        toast.error(data.error || 'Failed to update sleep log');
      }
    } catch (error) {
      console.error('Error updating sleep:', error);
      toast.error('Failed to update sleep log');
    }
  };

  const deleteSleep = async (logId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sleep/${logId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Sleep log deleted successfully!');
        await fetchSleepData(); // Refresh all data
        setDeletingLog(null);
      } else {
        toast.error(data.error || 'Failed to delete sleep log');
      }
    } catch (error) {
      console.error('Error deleting sleep:', error);
      toast.error('Failed to delete sleep log');
    }
  };

  const resetForm = () => {
    setSleepForm({
      startTime: '',
      endTime: '',
      quality: 'good',
      notes: ''
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (hours) => {
    if (!hours) return '0h 0m';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getQualityColor = (quality) => {
    const option = qualityOptions.find(opt => opt.value === quality);
    return option ? option.color : 'from-gray-400 to-gray-500';
  };

  const getQualityIcon = (quality) => {
    const option = qualityOptions.find(opt => opt.value === quality);
    return option ? option.icon : '😐';
  };

  const getChartData = () => {
    if (activeGraphView === 'daily') {
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = sleepLogs.filter(log => log.date === today);
      
      if (todayLogs.length > 0) {
        // For daily view, show only the single sleep log for today
        const log = todayLogs[0];
        return [{
          label: 'Today\'s Sleep',
          value: log.duration || 0
        }];
      } else {
        return [{ label: 'No sleep logged today', value: 0 }];
      }
    } else if (activeGraphView === 'weekly') {
      const today = new Date();
      const currentWeekStart = new Date(today);
      const dayOfWeek = today.getDay();
      currentWeekStart.setDate(today.getDate() - dayOfWeek);
      
      // Get all sleep logs for the current week
      const weekLogs = sleepLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= currentWeekStart && logDate <= today;
      });
      
      // Group by date and calculate total duration per day
      const dailyTotals = {};
      weekLogs.forEach(log => {
        const dayKey = new Date(log.date).toDateString();
        if (!dailyTotals[dayKey]) {
          dailyTotals[dayKey] = 0;
        }
        dailyTotals[dayKey] += log.duration || 0;
      });
      
      // Create weekly data array with all 7 days
      const weeklyData = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(currentWeekStart);
        currentDate.setDate(currentWeekStart.getDate() + i);
        const dayKey = currentDate.toDateString();
        
        weeklyData.push({
          label: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
          value: dailyTotals[dayKey] || 0
        });
      }
      
      return weeklyData;
    } else {
      // Monthly view - only show days with actual data
      const today = new Date();
      const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      // Get all sleep logs for the current month
      const monthLogs = sleepLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getMonth() === today.getMonth() && logDate.getFullYear() === today.getFullYear();
      });
      
      // Group by date and calculate total duration per day
      const dailyTotals = {};
      monthLogs.forEach(log => {
        const day = new Date(log.date).getDate();
        if (!dailyTotals[day]) {
          dailyTotals[day] = 0;
        }
        dailyTotals[day] += log.duration || 0;
      });
      
      // Convert to chart data format, only including days with data
      const monthlyData = Object.entries(dailyTotals)
        .filter(([day, duration]) => duration > 0)
        .map(([day, duration]) => ({
          label: day,
          value: duration
        }))
        .sort((a, b) => parseInt(a.label) - parseInt(b.label));
      
      // If no data, return empty state
      if (monthlyData.length === 0) {
        return [{ label: 'No sleep data this month', value: 0 }];
      }
      
      return monthlyData;
    }
  };

  const getChartComponent = () => {
    const data = getChartData();
    
    if (activeGraphView === 'daily') {
      return <BarChart data={data} height={250} color="from-blue-400 to-cyan-400" />;
    } else if (activeGraphView === 'weekly') {
      return <BarChart data={data} height={250} color="from-green-400 to-emerald-400" />;
    } else {
      return <BarChart data={data} height={300} color="from-purple-400 to-pink-400" />;
    }
  };

  const progressPercentage = (stats.today.duration / sleepGoal) * 100;

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <>
      {/* Today's Sleep Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <FaBed className="text-cyan-400" />
            Today's Sleep
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {todaySleep ? (
              <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                <FaCheckCircle />
                Sleep logged for today
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 log-sleep-btn"
              >
                <FaPlus className="inline mr-2" />
                Log Sleep
              </motion.button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Duration Card */}
          <div className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 border border-blue-400/30 rounded-xl p-6 sleep-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-500">
                <FaClock className="text-white text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {formatDuration(stats.today.duration)}
                </div>
                <div className="text-white/60 text-sm mobile-text">Duration</div>
              </div>
            </div>
            {todaySleep ? (
              <ProgressBar 
                value={stats.today.duration} 
                max={sleepGoal} 
                color="from-blue-400 to-cyan-500" 
                showLabel={true}
                label={`${Math.round(progressPercentage)}% of ${sleepGoal}h goal`}
              />
            ) : (
              <div className="text-center py-2">
                <p className="text-white/60 text-sm">No sleep logged today</p>
                <p className="text-cyan-400 text-xs mt-1">Click "Log Sleep" to get started</p>
              </div>
            )}
          </div>

          {/* Quality Card */}
          <div className={`bg-gradient-to-br ${getQualityColor(stats.today.quality)}/20 border border-white/30 rounded-xl p-6 sleep-card`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${getQualityColor(stats.today.quality)}`}>
                <FaStar className="text-white text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  {getQualityIcon(stats.today.quality)}
                  {stats.today.quality ? stats.today.quality.charAt(0).toUpperCase() + stats.today.quality.slice(1) : 'No Data'}
                </div>
                <div className="text-white/60 text-sm mobile-text">Quality</div>
              </div>
            </div>
          </div>

          {/* Sleep Time Card */}
          <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 border border-purple-400/30 rounded-xl p-6 sleep-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500">
                <FaMoon className="text-white text-xl" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {stats.today.startTime ? formatTime(stats.today.startTime) : '--:--'}
                </div>
                <div className="text-white/60 text-sm mobile-text">Bedtime</div>
              </div>
            </div>
          </div>

          {/* Wake Time Card */}
          <div className="bg-gradient-to-br from-orange-400/20 to-yellow-400/20 border border-orange-400/30 rounded-xl p-6 sleep-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-400 to-yellow-500">
                <FaSun className="text-white text-xl" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {stats.today.endTime ? formatTime(stats.today.endTime) : '--:--'}
                </div>
                <div className="text-white/60 text-sm mobile-text">Wake Time</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mb-8">
        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="xl:col-span-2"
        >
          <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <FaChartBar className="text-cyan-400" />
                Sleep Analytics
              </h3>
              
              {/* Chart View Toggle */}
              <div className="flex items-center gap-1 sm:gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveGraphView('daily')}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 graph-view-btn ${
                    activeGraphView === 'daily'
                      ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <FaChartBar className="inline mr-1" />
                  <span className="hidden sm:inline">Daily</span>
                  <span className="sm:hidden">D</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveGraphView('weekly')}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 graph-view-btn ${
                    activeGraphView === 'weekly'
                      ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <FaChartLine className="inline mr-1" />
                  <span className="hidden sm:inline">Weekly</span>
                  <span className="sm:hidden">W</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveGraphView('monthly')}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 graph-view-btn ${
                    activeGraphView === 'monthly'
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <FaChartPie className="inline mr-1" />
                  <span className="hidden sm:inline">Quality</span>
                  <span className="sm:hidden">Q</span>
                </motion.button>
              </div>
            </div>
            
            {(() => {
              const chartData = getChartData();
              const hasRealData = chartData.some(item => item.value > 0);
              
              if (hasRealData) {
                return getChartComponent();
              } else {
                return (
                  <div className="text-center text-white/60 py-8">
                    <FaChartBar className="text-4xl mx-auto mb-2 opacity-50" />
                    <p>No {activeGraphView === 'daily' ? 'sleep data for today' : activeGraphView === 'weekly' ? 'sleep data for this week' : 'sleep data for this month'}</p>
                    <p className="text-sm mt-2">Start logging your sleep to see analytics</p>
                  </div>
                );
              }
            })()}
            
            {/* Chart Summary */}
            <div className="mt-4 p-3 rounded-lg border border-white/20">
              <div className="text-white/70 text-sm mb-1">
                {activeGraphView === 'daily' && 'Today - Sleep Duration'}
                {activeGraphView === 'weekly' && 'Current Week - Daily Breakdown'}
                {activeGraphView === 'monthly' && 'Current Month - Sleep Days'}
              </div>
              <div className="text-white font-medium">
                {(() => {
                  const chartData = getChartData();
                  const hasRealData = chartData.some(item => item.value > 0);
                  if (hasRealData) {
                    if (activeGraphView === 'daily') {
                      const todayLog = chartData[0];
                      return `Duration: ${formatDuration(todayLog.value)}`;
                    } else if (activeGraphView === 'weekly') {
                      const total = chartData.reduce((sum, item) => sum + (item.value || 0), 0);
                      const daysWithData = chartData.filter(item => item.value > 0).length;
                      return `Total: ${formatDuration(total)} (${daysWithData}/7 days logged)`;
                    } else {
                      const total = chartData.reduce((sum, item) => sum + (item.value || 0), 0);
                      const count = chartData.length;
                      return `Total: ${formatDuration(total)} (${count} sleep days)`;
                    }
                  } else {
                    return 'No sleep data available';
                  }
                })()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Weekly Stats */}
          <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-cyan-400" />
              Weekly Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Average</span>
                <span className="text-white font-medium">{formatDuration(stats.weekly.average)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Total</span>
                <span className="text-white font-medium">{formatDuration(stats.weekly.total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Nights Logged</span>
                <span className="text-white font-medium">{stats.weekly.count}/7</span>
              </div>
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-purple-400" />
              Monthly Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Average</span>
                <span className="text-white font-medium">{formatDuration(stats.monthly.average)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Total</span>
                <span className="text-white font-medium">{formatDuration(stats.monthly.total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Nights Logged</span>
                <span className="text-white font-medium">{stats.monthly.count}/30</span>
              </div>
            </div>
          </div>

          {/* Sleep Goals */}
          <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FaBed className="text-green-400" />
                Sleep Goals
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (isEditingGoal) {
                    updateSleepGoal();
                  } else {
                    setIsEditingGoal(true);
                  }
                }}
                className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                {isEditingGoal ? <FaSave className="text-sm" /> : <FaEdit className="text-sm" />}
              </motion.button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">Daily Goal</span>
                  {isEditingGoal ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="4"
                        max="12"
                        step="0.5"
                        value={editingGoalValue}
                        onChange={(e) => setEditingGoalValue(parseFloat(e.target.value))}
                        className="w-16 p-1 bg-white/10 border border-white/20 rounded text-white text-center text-sm"
                      />
                      <span className="text-white font-medium">h</span>
                    </div>
                  ) : (
                    <span className="text-white font-medium">{sleepGoal}h</span>
                  )}
                </div>
                <ProgressBar 
                  value={stats.weekly.average} 
                  max={sleepGoal} 
                  color="from-green-400 to-emerald-500" 
                  showLabel={false}
                />
              </div>
              <div className="text-center">
                {stats.weekly.average >= sleepGoal ? (
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <FaCheckCircle />
                    <span className="text-sm">Goal achieved!</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-orange-400">
                    <FaExclamationTriangle />
                    <span className="text-sm">
                      {formatDuration(sleepGoal - stats.weekly.average)} to go
                    </span>
                  </div>
                )}
              </div>
              {isEditingGoal && (
                <div className="flex items-center justify-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsEditingGoal(false);
                      setEditingGoalValue(sleepGoal);
                    }}
                    className="px-3 py-1 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 text-sm"
                  >
                    Cancel
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* AI Sleep Recommendations */}
          <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaBed className="text-cyan-400" />
              AI Sleep Tips
            </h3>
            {recommendations?.sleepTracker ? (
              <AIRecommendationCard
                title="Sleep & Recovery"
                recommendation={recommendations.sleepTracker}
                feature="sleepTracker"
                userId={user?.id}
              />
            ) : (
              <div className="text-center py-4">
                <p className="text-white/60 mb-2 text-sm">No AI recommendations available yet.</p>
                <p className="text-white/40 text-xs">Complete your onboarding to get personalized AI recommendations.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Sleep Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="backdrop-blur-xl border border-white/20 rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <FaBed className="text-cyan-400" />
            Sleep History
          </h3>
          
          {/* Filter Controls */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 filter-btn"
            >
              <FaFilter />
            </motion.button>
          </div>
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-white/5 rounded-xl"
            >
              <div className="flex items-center gap-2 flex-wrap">
                {['all', 'today', 'week', 'month'].map((filter) => (
                  <motion.button
                    key={filter}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterType(filter)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 filter-option ${
                      filterType === filter
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {currentLogs.length > 0 ? (
          <>
            <div className="space-y-4">
              {currentLogs.map((log, index) => (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200 log-item gap-3"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${getQualityColor(log.quality)}`}>
                      <span className="text-lg sm:text-xl">{getQualityIcon(log.quality)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-white font-medium">
                        <span className="text-sm sm:text-base">{formatTime(log.startTime)} - {formatTime(log.endTime)}</span>
                        <span className="text-cyan-400 text-sm sm:text-base">{formatDuration(log.duration)}</span>
                      </div>
                      <div className="text-white/60 text-xs sm:text-sm">
                        {formatDate(log.startTime)} • {log.quality}
                        {log.notes && (
                          <div className="text-white/50 text-xs mt-1 max-w-full sm:max-w-md truncate">
                            {log.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setEditingLog(log);
                        setSleepForm({
                          startTime: new Date(log.startTime).toISOString().slice(0, 16),
                          endTime: new Date(log.endTime).toISOString().slice(0, 16),
                          quality: log.quality,
                          notes: log.notes || ''
                        });
                      }}
                      className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg border border-blue-400/30 transition-colors edit-sleep-btn"
                    >
                      <FaEdit />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setDeletingLog(log)}
                      className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg border border-red-400/30 transition-colors delete-sleep-btn"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-white/20 gap-4">
                <div className="text-white/70 text-xs sm:text-sm text-center sm:text-left">
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
                          className={`px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 pagination-btn text-sm ${
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
            <FaBed className="text-4xl mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No sleep logs found</p>
            <p className="text-sm">Start tracking your sleep by clicking the "Log Sleep" button above.</p>
          </div>
        )}
      </motion.div>

      {/* Add Sleep Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 modal-backdrop"
            onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white">Log Sleep</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors close-btn"
                >
                  <FaTimes />
                </motion.button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Date Validation Warning */}
                {(() => {
                  if (sleepForm.startTime) {
                    const selectedDate = new Date(sleepForm.startTime).toISOString().split('T')[0];
                    const existingLog = sleepLogs.find(log => log.date === selectedDate);
                    if (existingLog) {
                      return (
                        <div className="p-3 bg-red-400/20 border border-red-400/30 rounded-xl">
                          <div className="flex items-center gap-2 text-red-400">
                            <FaExclamationTriangle />
                            <span className="font-medium text-sm sm:text-base">Sleep Already Logged</span>
                          </div>
                          <p className="text-red-300 text-xs sm:text-sm mt-1">
                            You already have a sleep log for {new Date(selectedDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}. Please choose a different date or edit your existing entry.
                          </p>
                        </div>
                      );
                    }
                  }
                  return null;
                })()}
                
                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Start Time (Bedtime)</label>
                  <input
                    type="datetime-local"
                    value={sleepForm.startTime}
                    onChange={(e) => setSleepForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full p-2 sm:p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">End Time (Wake Time)</label>
                  <input
                    type="datetime-local"
                    value={sleepForm.endTime}
                    onChange={(e) => setSleepForm(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full p-2 sm:p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Sleep Quality</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {qualityOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSleepForm(prev => ({ ...prev, quality: option.value }))}
                        className={`p-2 sm:p-3 rounded-xl border transition-all duration-200 ${
                          sleepForm.quality === option.value
                            ? `bg-gradient-to-r ${option.color} border-white/30 text-white`
                            : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        <div className="text-base sm:text-lg mb-1">{option.icon}</div>
                        <div className="text-xs sm:text-sm font-medium">{option.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Notes (Optional)</label>
                  <textarea
                    value={sleepForm.notes}
                    onChange={(e) => setSleepForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="How was your sleep? Any dreams, disturbances, etc."
                    rows={2}
                    className="w-full p-2 sm:p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors resize-none text-sm sm:text-base"
                  />
                </div>

                <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 p-2 sm:p-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200 text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addSleep}
                    disabled={addingSleep || !sleepForm.startTime || !sleepForm.endTime || (() => {
                      if (sleepForm.startTime) {
                        const selectedDate = new Date(sleepForm.startTime).toISOString().split('T')[0];
                        return sleepLogs.some(log => log.date === selectedDate);
                      }
                      return false;
                    })()}
                    className="flex-1 p-2 sm:p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {addingSleep ? 'Adding...' : 'Log Sleep'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Sleep Modal */}
      <AnimatePresence>
        {editingLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 modal-backdrop"
            onClick={() => {
              setEditingLog(null);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white">Edit Sleep</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setEditingLog(null);
                    resetForm();
                  }}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors close-btn"
                >
                  <FaTimes />
                </motion.button>
              </div>

              <div className="space-y-4">
                {/* Date Validation Warning for Edit */}
                {(() => {
                  if (sleepForm.startTime && editingLog) {
                    const selectedDate = new Date(sleepForm.startTime).toISOString().split('T')[0];
                    const originalDate = new Date(editingLog.startTime).toISOString().split('T')[0];
                    const existingLog = sleepLogs.find(log => log.date === selectedDate && log._id !== editingLog._id);
                    if (existingLog) {
                      return (
                        <div className="p-3 bg-red-400/20 border border-red-400/30 rounded-xl">
                          <div className="flex items-center gap-2 text-red-400">
                            <FaExclamationTriangle />
                            <span className="font-medium">Date Conflict</span>
                          </div>
                          <p className="text-red-300 text-sm mt-1">
                            You already have a sleep log for {new Date(selectedDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}. Please choose a different date or edit the existing entry for that date.
                          </p>
                        </div>
                      );
                    }
                  }
                  return null;
                })()}
                
                <div>
                  <label className="block text-white font-medium mb-2">Start Time (Bedtime)</label>
                  <input
                    type="datetime-local"
                    value={sleepForm.startTime}
                    onChange={(e) => setSleepForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">End Time (Wake Time)</label>
                  <input
                    type="datetime-local"
                    value={sleepForm.endTime}
                    onChange={(e) => setSleepForm(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Sleep Quality</label>
                  <div className="grid grid-cols-2 gap-2">
                    {qualityOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSleepForm(prev => ({ ...prev, quality: option.value }))}
                        className={`p-3 rounded-xl border transition-all duration-200 ${
                          sleepForm.quality === option.value
                            ? `bg-gradient-to-r ${option.color} border-white/30 text-white`
                            : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        <div className="text-lg mb-1">{option.icon}</div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Notes</label>
                  <textarea
                    value={sleepForm.notes}
                    onChange={(e) => setSleepForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="How was your sleep? Any dreams, disturbances, etc."
                    rows={3}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setEditingLog(null);
                      resetForm();
                    }}
                    className="flex-1 p-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={updateSleep}
                    disabled={!sleepForm.startTime || !sleepForm.endTime || (() => {
                      if (sleepForm.startTime && editingLog) {
                        const selectedDate = new Date(sleepForm.startTime).toISOString().split('T')[0];
                        return sleepLogs.some(log => log.date === selectedDate && log._id !== editingLog._id);
                      }
                      return false;
                    })()}
                    className="flex-1 p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaSave className="inline mr-2" />
                    Update
                  </motion.button>
                </div>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 modal-backdrop"
            onClick={() => setDeletingLog(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm"
            >
              <div className="text-center">
                <div className="p-3 bg-red-400/20 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-400 text-xl sm:text-2xl" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Delete Sleep Log</h3>
                <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">
                  Are you sure you want to delete this sleep log? This action cannot be undone.
                </p>
                <div className="flex gap-2 sm:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeletingLog(null)}
                    className="flex-1 p-2 sm:p-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200 text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => deleteSleep(deletingLog._id)}
                    className="flex-1 p-2 sm:p-3 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SleepTracker;