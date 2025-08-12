import React, { useState } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import AIRecommendationCard from "@/components/custom/AIRecommendationCard";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { 
  Brain, 
  Heart, 
  Sparkles, 
  TrendingUp, 
  Lightbulb, 
  Shield, 
  AlertTriangle,
  MessageCircle,
  BookOpen,
  Phone,
  ExternalLink,
  Activity,
  Moon,
  Sun,
  Users,
  Target
} from "lucide-react";
import MentalHealthChatbot from "../../components/custom/MentalHealthChatbot";

const MentalHealth = () => {
  const { user, isLoaded } = useUser();
  const { recommendations } = useAIRecommendations();
  const [showCrisisResources, setShowCrisisResources] = useState(false);

  if (!isLoaded) return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-cyan-900 to-neutral-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-white/70 text-lg">Loading your mental health companion...</p>
      </div>
    </div>
  );

  const mentalHealthInsights = [
    {
      title: 'Mood Trends',
      description: 'Your mood has been improving over the past week. Keep up the positive momentum!',
      icon: TrendingUp,
      color: 'from-green-400 to-emerald-400',
      value: '+15%'
    },
    {
      title: 'Sleep Quality',
      description: 'Your sleep pattern shows consistent improvement. Great work on your routine!',
      icon: Moon,
      color: 'from-purple-400 to-pink-400',
      value: '8.2h'
    },
    {
      title: 'Stress Level',
      description: 'Stress levels are moderate. Consider trying some relaxation techniques.',
      icon: Activity,
      color: 'from-orange-400 to-red-400',
      value: 'Medium'
    },
    {
      title: 'Social Connection',
      description: 'You\'ve been engaging well with your support network. Keep it up!',
      icon: Users,
      color: 'from-blue-400 to-cyan-400',
      value: 'Good'
    }
  ];

  const quickActions = [
    {
      title: 'Start New Session',
      description: 'Begin a fresh conversation with your AI companion',
      icon: MessageCircle,
      action: () => setShowCrisisResources(false)
    },
    {
      title: 'View Progress',
      description: 'Track your mental health journey over time',
      icon: Target,
      action: () => setShowCrisisResources(false)
    },
    {
      title: 'Crisis Resources',
      description: 'Access emergency mental health support',
      icon: AlertTriangle,
      action: () => setShowCrisisResources(!showCrisisResources)
    },
    {
      title: 'Wellness Tips',
      description: 'Get daily mental health and wellness advice',
      icon: Lightbulb,
      action: () => setShowCrisisResources(false)
    }
  ];

  const crisisResources = [
    {
      title: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support and suicide prevention",
      link: "https://988lifeline.org/"
    },
    {
      title: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Text-based crisis support",
      link: "https://www.crisistextline.org/"
    },
    {
      title: "Emergency Services",
      number: "911",
      description: "Immediate emergency assistance",
      link: null
    }
  ];

  return (
    <div className="space-y-6">
      <SignedIn>
        {/* AI Chat Interface */}
        <div className="backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
          {/* Chat Header */}
          {/* <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Dr. Sarah Chen - AI Mental Health Companion</h3>
                <p className="text-white/60 text-sm">Licensed Clinical Psychologist • CBT & DBT Specialist</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCrisisResources(!showCrisisResources)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                title="Toggle crisis resources"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
          </div> */}

          {/* Chat Component - Removed duplicate */}
        </div>

        {/* Crisis Resources Banner */}
        {showCrisisResources && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="backdrop-blur-xl border border-red-400/30 rounded-2xl p-6 bg-red-500/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-red-400 text-xl" />
              </div>
              <div>
                <h3 className="text-red-300 font-bold text-lg">Crisis Support Resources</h3>
                <p className="text-red-400/80 text-sm">24/7 professional help available</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {crisisResources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-red-500/10 rounded-xl border border-red-400/20 text-center hover:border-red-400/40 transition-all duration-200"
                >
                  <div className="text-red-300 font-medium text-sm mb-2">{resource.title}</div>
                  <div className="text-red-400 font-bold text-2xl mb-2">{resource.number}</div>
                  <div className="text-red-300 text-xs mb-3">{resource.description}</div>
                  {resource.link && (
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-red-300 hover:text-red-200 text-xs transition-colors duration-200"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit Resource
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mental Health Insights */}
        <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="text-purple-400" />
            AI Mental Health Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mentalHealthInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-400/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-xl flex items-center justify-center`}>
                    <insight.icon className="text-white text-xl" />
                  </div>
                  <span className="text-2xl font-bold text-white">{insight.value}</span>
                </div>
                <h4 className="text-white font-semibold mb-2">{insight.title}</h4>
                <p className="text-white/70 text-sm">{insight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Mental Health Recommendations */}
        <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Brain className="text-cyan-400" />
            AI Mental Health Tips
          </h3>
          {recommendations?.mentalHealthChatbot ? (
            <AIRecommendationCard
              title="Mental Health"
              recommendation={recommendations.mentalHealthChatbot}
              feature="mentalHealthChatbot"
              userId={user?.id}
            />
          ) : (
            <div className="text-center py-4">
              <p className="text-white/60 mb-2">No AI recommendations available yet.</p>
              <p className="text-white/40 text-sm">Complete your onboarding to get personalized AI recommendations.</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-400/30 transition-all duration-200 text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 rounded-xl flex items-center justify-center mb-3 group-hover:from-purple-400/30 group-hover:to-cyan-400/30 transition-all duration-200">
                  <action.icon className="text-purple-400 text-xl" />
                </div>
                <h4 className="text-white font-semibold mb-2">{action.title}</h4>
                <p className="text-white/60 text-sm">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* AI Mental Health Chatbot */}
        <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageCircle className="text-purple-400" />
            AI Mental Health Companion
          </h3>
          <MentalHealthChatbot />
        </div>

        {/* Professional Disclaimer */}
        <div className="backdrop-blur-xl border border-orange-400/30 rounded-2xl p-6 bg-orange-500/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-orange-300 font-semibold text-lg mb-2">Important Notice</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                This AI companion provides supportive conversations but is not a substitute for professional mental health care. 
                For emergencies, contact crisis services (988) or call 911.
              </p>
              <div className="flex items-center gap-2 text-orange-400/80 text-xs">
                <BookOpen className="w-3 h-3" />
                <span>Licensed Clinical Psychologist • Evidence-Based Support</span>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Mental Health Support</h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Access your personalized AI mental health companion for confidential support and guidance.
            </p>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <p className="text-white/70">
                Please sign in to access your mental health companion.
              </p>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  );
};

export default MentalHealth;
