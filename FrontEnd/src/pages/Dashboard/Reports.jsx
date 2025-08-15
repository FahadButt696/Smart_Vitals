import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Filter, Eye, Share2, Printer } from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('health-summary');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const reportTypes = [
    { id: 'health-summary', label: 'Health Summary', description: 'Comprehensive health overview' },
    { id: 'nutrition-report', label: 'Nutrition Report', description: 'Detailed nutrition analysis' },
    { id: 'fitness-report', label: 'Fitness Report', description: 'Workout and activity summary' },
    { id: 'sleep-report', label: 'Sleep Report', description: 'Sleep pattern analysis' },
    { id: 'hydration-report', label: 'Hydration Report', description: 'Water intake tracking' },
    { id: 'weight-report', label: 'Weight Report', description: 'Weight progress tracking' }
  ];

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ];

  const recentReports = [
    {
      id: 1,
      type: 'Health Summary',
      period: 'This Month',
      generated: '2024-01-15',
      status: 'completed',
      size: '2.4 MB'
    },
    {
      id: 2,
      type: 'Nutrition Report',
      period: 'This Week',
      generated: '2024-01-14',
      status: 'completed',
      size: '1.8 MB'
    },
    {
      id: 3,
      type: 'Fitness Report',
      period: 'This Month',
      generated: '2024-01-13',
      status: 'completed',
      size: '3.1 MB'
    }
  ];

  const generateReport = () => {
    // Simulate report generation
    console.log(`Generating ${selectedReport} report for ${selectedPeriod}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Health Reports</h3>
            <p className="text-white/60">Generate and manage your health reports</p>
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
            <button
              onClick={generateReport}
              className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`backdrop-blur-xl border rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
              selectedReport === report.id
                ? 'border-cyan-400/50 bg-cyan-400/10'
                : 'border-white/20 hover:border-cyan-400/30 hover:bg-white/5'
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center">
                <FileText className="text-white text-xl" />
              </div>
              <div className={`w-3 h-3 rounded-full ${
                selectedReport === report.id ? 'bg-cyan-400' : 'bg-white/20'
              }`} />
            </div>
            <h4 className="text-white font-semibold mb-2">{report.label}</h4>
            <p className="text-white/60 text-sm">{report.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Report Preview */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Eye className="text-cyan-400" />
          Report Preview
        </h3>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">
              {reportTypes.find(r => r.id === selectedReport)?.label} - {periods.find(p => p.id === selectedPeriod)?.label}
            </h4>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                <Printer className="w-4 h-4" />
              </button>
              <button className="p-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg text-white hover:shadow-lg transition-all duration-200">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-white/10 rounded animate-pulse"></div>
            <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse"></div>
            <div className="h-32 bg-white/10 rounded animate-pulse"></div>
            <div className="h-4 bg-white/10 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Recent Reports</h3>
        <div className="space-y-3">
          {recentReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <FileText className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{report.type}</h4>
                  <p className="text-white/60 text-sm">{report.period} • {report.generated}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm">{report.size}</span>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
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
          <button className="reports-btn p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Schedule Reports</h4>
            <p className="text-white/60 text-sm">Set up automatic report generation</p>
          </button>
          <button className="reports-btn p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Share with Doctor</h4>
            <p className="text-white/60 text-sm">Send reports to healthcare providers</p>
          </button>
          <button className="reports-btn p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Archive Reports</h4>
            <p className="text-white/60 text-sm">Organize and store old reports</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports; 