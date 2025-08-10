import React, { useState, useEffect } from 'react';
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
import toast from 'react-hot-toast';

const SleepTracker = () => {
  const { user } = useUser();
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
  const [activeGraphView, setActiveGraphView] = useState('daily'); // daily, weekly, monthly
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);
  const [filterType, setFilterType] = useState('all'); // all, today, week, month
  const [showFilters, setShowFilters] = useState(false);

  // Form states
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

  const sleepGoal = 8; // hours

  useEffect(() => {
    if (user) {
      fetchSleepData();
      fetchSleepStats();
      fetchTodaySleep();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [sleepLogs, filterType]);

  const fetchSleepData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/sleep?userId=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setSleepLogs(data.logs || []);
      } else {
        console.error('Error fetching sleep data:', data.error);
        toast.error('Failed to fetch sleep data');
      }
    } catch (error) {
      console.error('Error fetching sleep data:', error);
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchSleepStats = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/sleep/stats?userId=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setStats(data.stats);
      } else {
        console.error('Error fetching sleep stats:', data.error);
      }
    } catch (error) {
      console.error('Error fetching sleep stats:', error);
    }
  };

  const fetchTodaySleep = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`http://localhost:5000/api/sleep?userId=${user.id}&startDate=${today}&endDate=${today}`);
      const data = await response.json();
      
      if (response.ok && data.logs && data.logs.length > 0) {
        setTodaySleep(data.logs[0]);
        // Update stats with today's data
        setStats(prev => ({
          ...prev,
          today: {
            duration: data.logs[0].duration || 0,
            quality: data.logs[0].quality || null,
            startTime: data.logs[0].startTime || null,
            endTime: data.logs[0].endTime || null
          }
        }));
      } else {
        setTodaySleep(null);
        // Reset today's stats if no data
        setStats(prev => ({
          ...prev,
          today: {
            duration: 0,
            quality: null,
            startTime: null,
            endTime: null
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching today\'s sleep:', error);
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
          notes: sleepForm.notes
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Sleep log added successfully!');
        fetchSleepData();
        fetchSleepStats();
        fetchTodaySleep();
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
        fetchSleepData();
        fetchSleepStats();
        fetchTodaySleep();
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
        fetchSleepData();
        fetchSleepStats();
        fetchTodaySleep();
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
      const dailyData = Object.entries(stats.dailyBreakdown || {}).map(([date, duration]) => ({
        label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        value: duration
      })).slice(-7);
      
      // Fill missing days with 0 values
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const existingData = dailyData.find(d => d.label === dayName);
        last7Days.push(existingData || { label: dayName, value: 0 });
      }
      
      return last7Days;
    } else if (activeGraphView === 'weekly') {
      // Group by week
      const weeklyData = [];
      const sortedLogs = sleepLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      let currentWeek = [];
      let currentWeekStart = null;
      
      sortedLogs.forEach(log => {
        const logDate = new Date(log.date);
        const weekStart = new Date(logDate);
        weekStart.setDate(logDate.getDate() - logDate.getDay());
        
        if (!currentWeekStart || weekStart.getTime() !== currentWeekStart.getTime()) {
          if (currentWeek.length > 0) {
            const avgDuration = currentWeek.reduce((sum, l) => sum + (l.duration || 0), 0) / currentWeek.length;
            weeklyData.push({
              label: `Week ${currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
              value: Math.round(avgDuration * 100) / 100
            });
          }
          currentWeek = [log];
          currentWeekStart = weekStart;
        } else {
          currentWeek.push(log);
        }
      });
      
      if (currentWeek.length > 0) {
        const avgDuration = currentWeek.reduce((sum, l) => sum + (l.duration || 0), 0) / currentWeek.length;
        weeklyData.push({
          label: `Week ${currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          value: Math.round(avgDuration * 100) / 100
        });
      }
      
      return weeklyData.slice(-4);
    } else {
      // Monthly view - quality distribution
      const qualityData = Object.entries(stats.qualityDistribution || {}).map(([quality, count]) => ({
        label: quality.charAt(0).toUpperCase() + quality.slice(1),
        value: count
      }));
      
      // If no quality data, show default distribution
      if (qualityData.length === 0) {
        return [
          { label: 'Good', value: 0 },
          { label: 'Excellent', value: 0 },
          { label: 'Fair', value: 0 },
          { label: 'Poor', value: 0 },
          { label: 'Restless', value: 0 }
        ];
      }
      
      return qualityData;
    }
  };

  const getChartComponent = () => {
    const data = getChartData();
    if (activeGraphView === 'monthly') {
      return <DoughnutChart data={data} height={200} />;
    } else {
      return <BarChart data={data} height={200} />;
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 log-sleep-btn"
          >
            <FaPlus className="inline mr-2" />
            Log Sleep
          </motion.button>
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
            <ProgressBar 
              value={stats.today.duration} 
              max={sleepGoal} 
              color="from-blue-400 to-cyan-500" 
              showLabel={true}
              label={`${Math.round(progressPercentage)}% of ${sleepGoal}h goal`}
            />
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
            
            {getChartData().length > 0 ? (
              <div className="h-48 sm:h-56 md:h-64 w-full chart-container">
                {getChartComponent()}
              </div>
            ) : (
              <div className="text-center text-white/60 py-8">
                <FaChartBar className="text-4xl mx-auto mb-2 opacity-50" />
                <p>No sleep data available for charts</p>
              </div>
            )}
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
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaBed className="text-green-400" />
              Sleep Goals
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">Daily Goal</span>
                  <span className="text-white font-medium">{sleepGoal}h</span>
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
            </div>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-backdrop"
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
              className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Log Sleep</h3>
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

              <div className="space-y-4">
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
                  <label className="block text-white font-medium mb-2">Notes (Optional)</label>
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
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 p-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addSleep}
                    disabled={addingSleep || !sleepForm.startTime || !sleepForm.endTime}
                    className="flex-1 p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-backdrop"
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
              className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Edit Sleep</h3>
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
                    disabled={!sleepForm.startTime || !sleepForm.endTime}
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-backdrop"
            onClick={() => setDeletingLog(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-sm"
            >
              <div className="text-center">
                <div className="p-3 bg-red-400/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-400 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Delete Sleep Log</h3>
                <p className="text-white/70 mb-6">
                  Are you sure you want to delete this sleep log? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeletingLog(null)}
                    className="flex-1 p-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => deleteSleep(deletingLog._id)}
                    className="flex-1 p-3 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
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