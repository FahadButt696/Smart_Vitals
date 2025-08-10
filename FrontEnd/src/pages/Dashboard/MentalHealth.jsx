import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Smile, Frown, Meh, TrendingUp, Calendar, Target } from 'lucide-react';

const MentalHealth = () => {
  const [selectedMood, setSelectedMood] = useState('happy');
  const [selectedActivity, setSelectedActivity] = useState('meditation');

  const moods = [
    { id: 'happy', label: 'Happy', icon: Smile, color: 'from-green-400 to-emerald-400' },
    { id: 'neutral', label: 'Neutral', icon: Meh, color: 'from-yellow-400 to-orange-400' },
    { id: 'sad', label: 'Sad', icon: Frown, color: 'from-blue-400 to-indigo-400' },
    { id: 'anxious', label: 'Anxious', icon: Brain, color: 'from-purple-400 to-pink-400' }
  ];

  const activities = [
    { id: 'meditation', label: 'Meditation', description: 'Mindfulness and breathing exercises', duration: '10 min' },
    { id: 'exercise', label: 'Exercise', description: 'Physical activity and movement', duration: '30 min' },
    { id: 'journaling', label: 'Journaling', description: 'Writing thoughts and feelings', duration: '15 min' },
    { id: 'reading', label: 'Reading', description: 'Books and articles for relaxation', duration: '20 min' },
    { id: 'music', label: 'Music', description: 'Listening to calming music', duration: '25 min' },
    { id: 'nature', label: 'Nature Walk', description: 'Outdoor activities and fresh air', duration: '45 min' }
  ];

  const weeklyMoodData = [
    { day: 'Mon', mood: 'happy', score: 8 },
    { day: 'Tue', mood: 'neutral', score: 6 },
    { day: 'Wed', mood: 'happy', score: 7 },
    { day: 'Thu', mood: 'sad', score: 4 },
    { day: 'Fri', mood: 'happy', score: 8 },
    { day: 'Sat', mood: 'happy', score: 9 },
    { day: 'Sun', mood: 'neutral', score: 6 }
  ];

  const insights = [
    {
      title: 'Mood Improvement',
      description: 'Your mood has improved by 15% this week compared to last week.',
      type: 'positive',
      icon: TrendingUp
    },
    {
      title: 'Sleep Connection',
      description: 'Better sleep quality correlates with improved mood scores.',
      type: 'info',
      icon: Brain
    },
    {
      title: 'Activity Impact',
      description: 'Meditation sessions show positive correlation with mood stability.',
      type: 'positive',
      icon: Target
    }
  ];

  const logMood = () => {
    console.log(`Logged mood: ${selectedMood}`);
  };

  const startActivity = () => {
    console.log(`Started activity: ${selectedActivity}`);
  };

  return (
    <div className="space-y-6">
      {/* Mood Tracker */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Heart className="text-cyan-400" />
          How are you feeling today?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {moods.map((mood) => (
            <motion.button
              key={mood.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood.id)}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                selectedMood === mood.id
                  ? 'border-cyan-400/50 bg-cyan-400/10'
                  : 'border-white/20 hover:border-cyan-400/30 hover:bg-white/5'
              }`}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${mood.color} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
                <mood.icon className="text-white text-xl" />
              </div>
              <p className="text-white font-medium text-center">{mood.label}</p>
            </motion.button>
          ))}
        </div>
        <button
          onClick={logMood}
          className="w-full p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl hover:shadow-lg transition-all duration-200"
        >
          Log My Mood
        </button>
      </div>

      {/* Wellness Activities */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Wellness Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedActivity === activity.id
                  ? 'border-cyan-400/50 bg-cyan-400/10'
                  : 'border-white/20 hover:border-cyan-400/30 hover:bg-white/5'
              }`}
              onClick={() => setSelectedActivity(activity.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-white font-semibold">{activity.label}</h4>
                <span className="text-cyan-400 text-sm">{activity.duration}</span>
              </div>
              <p className="text-white/60 text-sm mb-3">{activity.description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startActivity();
                }}
                className="w-full p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
              >
                Start Activity
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly Mood Chart */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Weekly Mood Trends</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {weeklyMoodData.map((day, index) => (
            <div key={day.day} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-cyan-400/20 to-purple-400/20 rounded-t-lg border border-cyan-400/30 mb-2"
                   style={{ height: `${(day.score / 10) * 200}px` }}>
              </div>
              <span className="text-white/60 text-sm">{day.day}</span>
              <span className="text-white/40 text-xs">{day.score}/10</span>
            </div>
          ))}
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
                insight.type === 'positive' 
                  ? 'bg-green-400/10 border-green-400/30' 
                  : 'bg-blue-400/10 border-blue-400/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  insight.type === 'positive' 
                    ? 'bg-green-400/20 text-green-400' 
                    : 'bg-blue-400/20 text-blue-400'
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
            <h4 className="text-white font-semibold mb-2">Set Wellness Goals</h4>
            <p className="text-white/60 text-sm">Create personal mental health objectives</p>
          </button>
          <button className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Find Resources</h4>
            <p className="text-white/60 text-sm">Discover helpful mental health resources</p>
          </button>
          <button className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Connect with Support</h4>
            <p className="text-white/60 text-sm">Reach out to mental health professionals</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentalHealth; 