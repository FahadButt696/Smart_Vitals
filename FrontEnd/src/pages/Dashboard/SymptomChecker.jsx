import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaThermometerHalf, FaStethoscope, FaRobot, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import { AiSymptom } from "@/assets/Assets";

const SymptomChecker = () => {
  const { user } = useUser();
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = () => {
    // Simulate AI analysis
    setAnalysis({
      severity: "Low",
      recommendations: [
        "Rest and stay hydrated",
        "Monitor symptoms for 24-48 hours",
        "Consider over-the-counter pain relief if needed"
      ],
      warning: "If symptoms worsen, consult a healthcare professional"
    });
  };

  return (
    <SignedIn>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={AiSymptom}
            alt="Symptom Checker Background"
            className="w-full h-full object-cover object-center opacity-30"
            style={{ filter: 'brightness(0.4) contrast(1.2) saturate(0.8)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-red-900/60 to-orange-900/80"></div>
        </div>
        <div className="relative z-10 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">AI Symptom Checker</h1>
            <p className="text-white/60">Get preliminary health insights based on your symptoms</p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Symptom Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaThermometerHalf className="text-red-400 text-2xl" />
                  <h2 className="text-xl font-bold text-white">Describe Your Symptoms</h2>
                </div>
                <div className="space-y-4">
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe your symptoms in detail... (e.g., headache, fever, fatigue)"
                    className="w-full h-32 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-red-400 resize-none"
                  />
                  <button
                    onClick={handleAnalyze}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
                  >
                    <FaSearch />
                    Analyze Symptoms
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Analysis Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaStethoscope className="text-blue-400 text-2xl" />
                  <h2 className="text-xl font-bold text-white">AI Analysis</h2>
                </div>
                {analysis ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-semibold">Severity Level:</span>
                        <span className="px-2 py-1 bg-green-500/30 text-green-300 rounded-full text-sm">
                          {analysis.severity}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-white font-semibold">Recommendations:</h3>
                      {analysis.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-2">
                        <FaExclamationTriangle className="text-yellow-400" />
                        <p className="text-white/90 text-sm">{analysis.warning}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaRobot className="text-4xl text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">Enter your symptoms above to get AI analysis</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* AI Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-xl border border-red-400/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaRobot className="text-red-400 text-xl" />
                <h3 className="text-xl font-bold text-white">AI Health Tips</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                  <p className="text-white text-sm mb-1">Stay hydrated and get adequate rest for better recovery.</p>
                  <p className="text-white/60 text-xs">Tip: Drink 8 glasses of water daily.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                  <p className="text-white text-sm mb-1">Monitor your symptoms and track any changes over time.</p>
                  <p className="text-white/60 text-xs">Keep a symptom diary for better tracking.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SignedIn>
  );
};

export default SymptomChecker; 