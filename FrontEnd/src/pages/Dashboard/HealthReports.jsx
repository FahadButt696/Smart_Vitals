import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaChartBar, FaFileAlt, FaDownload, FaRobot, FaEye } from "react-icons/fa";
import { healthReport } from "@/assets/Assets";

const HealthReports = () => {
  const { user } = useUser();
  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Monthly Health Summary",
      date: "June 2024",
      type: "Summary",
      status: "Completed"
    },
    {
      id: 2,
      title: "Fitness Progress Report",
      date: "May 2024",
      type: "Progress",
      status: "Completed"
    },
    {
      id: 3,
      title: "Nutrition Analysis",
      date: "April 2024",
      type: "Analysis",
      status: "Completed"
    }
  ]);

  return (
    <SignedIn>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={healthReport}
            alt="Health Reports Background"
            className="w-full h-full object-cover object-center opacity-30"
            style={{ filter: 'brightness(0.4) contrast(1.2) saturate(0.8)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-indigo-900/60 to-purple-900/80"></div>
        </div>
        <div className="relative z-10 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Health Reports</h1>
            <p className="text-white/60">Comprehensive health insights and analytics</p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reports List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaChartBar className="text-indigo-400 text-2xl" />
                  <h2 className="text-xl font-bold text-white">Your Reports</h2>
                </div>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FaFileAlt className="text-indigo-400 text-xl" />
                          <div>
                            <h3 className="text-white font-semibold">{report.title}</h3>
                            <p className="text-white/60 text-sm">{report.date} • {report.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            report.status === 'Completed' 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {report.status}
                          </span>
                          <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                            <FaEye className="text-white" />
                          </button>
                          <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                            <FaDownload className="text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-xl border border-indigo-400/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaRobot className="text-indigo-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">AI Insights</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Your health metrics show consistent improvement over the last 3 months.</p>
                    <p className="text-white/60 text-xs">Keep up the great work!</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Consider scheduling a comprehensive health checkup.</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-xl border border-indigo-400/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2">
                    <FaChartBar />
                    Generate New Report
                  </button>
                  <button className="w-full bg-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all border border-white/20">
                    Share Reports
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </SignedIn>
  );
};

export default HealthReports; 