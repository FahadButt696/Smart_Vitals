import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Search, AlertTriangle, CheckCircle, Info, Heart, Brain, Eye } from 'lucide-react';

const SymptomChecker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('head');

  const bodyParts = [
    { id: 'head', label: 'Head & Neck', icon: Brain, symptoms: ['Headache', 'Dizziness', 'Sore throat', 'Runny nose'] },
    { id: 'chest', label: 'Chest', icon: Heart, symptoms: ['Chest pain', 'Shortness of breath', 'Cough', 'Heartburn'] },
    { id: 'abdomen', label: 'Abdomen', icon: Eye, symptoms: ['Stomach pain', 'Nausea', 'Diarrhea', 'Bloating'] },
    { id: 'limbs', label: 'Limbs', icon: Eye, symptoms: ['Joint pain', 'Muscle weakness', 'Swelling', 'Numbness'] }
  ];

  const commonSymptoms = [
    'Fever', 'Fatigue', 'Loss of appetite', 'Weight loss', 'Night sweats',
    'Insomnia', 'Anxiety', 'Depression', 'Rash', 'Itching', 'Swelling'
  ];

  const addSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const getAssessment = () => {
    if (selectedSymptoms.length === 0) return null;
    
    // Simple symptom assessment logic
    const severity = selectedSymptoms.length > 3 ? 'high' : selectedSymptoms.length > 1 ? 'medium' : 'low';
    const recommendations = [
      'Monitor your symptoms closely',
      'Stay hydrated and get adequate rest',
      'Consider consulting a healthcare provider if symptoms persist'
    ];
    
    return { severity, recommendations };
  };

  const assessment = getAssessment();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center">
            <Thermometer className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Symptom Checker</h3>
            <p className="text-white/60">Check your symptoms and get health guidance</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for symptoms..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Body Parts Selection */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Select Body Area</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bodyParts.map((part) => (
            <motion.button
              key={part.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedBodyPart(part.id)}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                selectedBodyPart === part.id
                  ? 'border-cyan-400/50 bg-cyan-400/10'
                  : 'border-white/20 hover:border-cyan-400/30 hover:bg-white/5'
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center mb-3 mx-auto">
                <part.icon className="text-white text-xl" />
              </div>
              <p className="text-white font-medium text-center text-sm">{part.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Symptoms by Body Part */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          Common Symptoms - {bodyParts.find(p => p.id === selectedBodyPart)?.label}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {bodyParts.find(p => p.id === selectedBodyPart)?.symptoms.map((symptom) => (
            <motion.button
              key={symptom}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addSymptom(symptom)}
              className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/30 hover:bg-white/10 transition-all duration-200 text-left"
            >
              <p className="text-white text-sm">{symptom}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Common Symptoms */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Other Common Symptoms</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {commonSymptoms.map((symptom) => (
            <motion.button
              key={symptom}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addSymptom(symptom)}
              className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/30 hover:bg-white/10 transition-all duration-200 text-left"
            >
              <p className="text-white text-sm">{symptom}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Symptoms */}
      {selectedSymptoms.length > 0 && (
        <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Your Selected Symptoms</h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {selectedSymptoms.map((symptom) => (
              <motion.div
                key={symptom}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3 bg-cyan-400/20 border border-cyan-400/30 rounded-lg"
              >
                <span className="text-white text-sm">{symptom}</span>
                <button
                  onClick={() => removeSymptom(symptom)}
                  className="text-cyan-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
          
          {/* Assessment */}
          {assessment && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  assessment.severity === 'high' 
                    ? 'bg-red-400/20 text-red-400' 
                    : assessment.severity === 'medium'
                    ? 'bg-yellow-400/20 text-yellow-400'
                    : 'bg-green-400/20 text-green-400'
                }`}>
                  {assessment.severity === 'high' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-white font-semibold">
                    Symptom Assessment: {assessment.severity.charAt(0).toUpperCase() + assessment.severity.slice(1)} Priority
                  </h4>
                  <p className="text-white/60 text-sm">
                    Based on {selectedSymptoms.length} selected symptom{selectedSymptoms.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h5 className="text-white font-medium">Recommendations:</h5>
                {assessment.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white/70 text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Find a Doctor</h4>
            <p className="text-white/60 text-sm">Locate healthcare providers near you</p>
          </button>
          <button className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Emergency Info</h4>
            <p className="text-white/60 text-sm">Learn when to seek emergency care</p>
          </button>
          <button className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Health Library</h4>
            <p className="text-white/60 text-sm">Access reliable health information</p>
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-6 bg-yellow-400/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold mb-2">Important Disclaimer</h4>
            <p className="text-white/70 text-sm">
              This symptom checker is for informational purposes only and should not replace professional medical advice. 
              Always consult with a healthcare provider for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker; 