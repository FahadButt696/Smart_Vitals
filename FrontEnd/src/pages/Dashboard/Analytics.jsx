import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, LineChart, Calendar, Filter, Download } from 'lucide-react';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('overall');

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ];

  const metrics = [
    { id: 'overall', label: 'Overall Health' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'hydration', label: 'Hydration' }
  ];

  const healthData = {
    overall: { score: 85, trend: 'up', change: '+5%' },
    nutrition: { score: 78, trend: 'up', change: '+3%' },
    fitness: { score: 82, trend: 'up', change: '+7%' },
    sleep: { score: 75, trend: 'down', change: '-2%' },
    hydration: { score: 90, trend: 'up', change: '+8%' }
  };

  const weeklyTrends = [
    { day: 'Mon', health: 82, nutrition: 75, fitness: 80, sleep: 78, hydration: 85 },
    { day: 'Tue', health: 84, nutrition: 78, fitness: 82, sleep: 76, hydration: 88 },
    { day: 'Wed', health: 86, nutrition: 80, fitness: 85, sleep: 74, hydration: 90 },
    { day: 'Thu', health: 88, nutrition: 82, fitness: 87, sleep: 72, hydration: 92 },
    { day: 'Fri', health: 85, nutrition: 79, fitness: 84, sleep: 75, hydration: 89 },
    { day: 'Sat', health: 83, nutrition: 77, fitness: 81, sleep: 77, hydration: 87 },
    { day: 'Sun', health: 85, nutrition: 78, fitness: 82, sleep: 75, hydration: 90 }
  ];

  const insights = [
    {
      title: 'Sleep Quality Declining',
      description: 'Your sleep score has decreased by 2% this week. Consider improving your bedtime routine.',
      type: 'warning',
      icon: TrendingUp
    },
    {
      title: 'Hydration Excellence',
      description: 'Great job! You\'ve maintained excellent hydration levels with an 8% improvement.',
      type: 'success',
      icon: TrendingUp
    },
    {
      title: 'Fitness Progress',
      description: 'Your fitness score shows consistent improvement. Keep up the great work!',
      type: 'success',
      icon: TrendingUp
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Health Analytics</h3>
            <p className="text-white/60">Track your health metrics and trends</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
            >
              {periods.map(period => (
                <option key={period.id} value={period.id}>{period.label}</option>
              ))}
            </select>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
            >
              {metrics.map(metric => (
                <option key={metric.id} value={metric.id}>{metric.label}</option>
              ))}
            </select>
            <button className="p-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-lg hover:shadow-lg transition-all duration-200">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Health Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(healthData).map(([key, data]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center"
          >
            <h4 className="text-white/60 text-sm mb-2 capitalize">{key}</h4>
            <div className="text-3xl font-bold text-white mb-2">{data.score}</div>
            <div className={`flex items-center justify-center gap-1 text-sm ${
              data.trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              <TrendingUp className={`w-4 h-4 ${data.trend === 'down' ? 'rotate-180' : ''}`} />
              {data.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Trends Chart */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <LineChart className="text-cyan-400" />
          Weekly Trends
        </h3>
        <div className="h-80 flex items-end justify-between gap-2">
          {weeklyTrends.map((day, index) => (
            <div key={day.day} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-cyan-400/20 to-purple-400/20 rounded-t-lg border border-cyan-400/30 mb-2"
                   style={{ height: `${(day[selectedMetric] / 100) * 200}px` }}>
              </div>
              <span className="text-white/60 text-sm">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-white/60 text-sm">
          Showing {selectedMetric} data for {periods.find(p => p.id === selectedPeriod)?.label}
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Insights & Recommendations</h3>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${
                insight.type === 'warning' 
                  ? 'bg-orange-400/10 border-orange-400/30' 
                  : 'bg-green-400/10 border-green-400/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  insight.type === 'warning' 
                    ? 'bg-orange-400/20 text-orange-400' 
                    : 'bg-green-400/20 text-green-400'
                }`}>
                  <insight.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">{insight.title}</h4>
                  <p className="text-white/70 text-sm">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Export Report</h4>
            <p className="text-white/60 text-sm">Download your health analytics as PDF</p>
          </button>
          <button className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Set Goals</h4>
            <p className="text-white/60 text-sm">Create new health goals based on trends</p>
          </button>
          <button className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Share Progress</h4>
            <p className="text-white/60 text-sm">Share your health achievements</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 