import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useAuth, SignedIn } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from "@/config/api";
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Weight, 
  Target, 
  Ruler, 
  Heart, 
  Bed, 
  Droplets 
} from 'lucide-react';

const Profile = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    gender: '',
    age: '',
    height: { value: '', unit: 'cm' },
    weight: { value: '', unit: 'kg' },
    goal: '',
    targetWeight: '',
    activityLevel: '',
    dietaryPreference: '',
    medicalConditions: '',
    allergies: '',
    medications: '',
    workoutDaysPerWeek: 3,
    workoutPreferences: [],
    mealPlanType: '',
    waterIntakeGoal: 3000,
    sleepGoal: 8,
    wantsMentalSupport: false
  });

  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Load user profile data
  useEffect(() => {
    if (isLoaded && clerkUser) {
      console.log("Clerk loaded, user:", clerkUser);
      loadUserProfile();
    }
  }, [isLoaded, clerkUser]);

  // Check for changes
  useEffect(() => {
    if (originalData) {
      const hasChangesValue = JSON.stringify(profileData) !== JSON.stringify(originalData);
      console.log("Checking for changes:", hasChangesValue);
      console.log("Profile data:", profileData);
      console.log("Original data:", originalData);
      setHasChanges(hasChangesValue);
    }
  }, [profileData, originalData]);

  const loadUserProfile = async () => {
    try {
      setIsInitialLoading(true);
      const token = await getToken(); // Make sure token is fetched after Clerk is loaded
      if (!token) {
        console.error("No token found, user might not be signed in yet.");
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/api/user/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errText = await response.text();
        console.error("Failed to load profile data:", errText);
        return;
      }
  
      const userData = await response.json();
      console.log("Loaded user data:", userData);
      console.log("Height data loaded:", userData.height);
      console.log("Weight data loaded:", userData.weight);
      
      // Merge data more carefully, preserving defaults for undefined values
      const mergedData = {
        ...profileData, // Start with defaults
        ...userData,    // Override with actual data
        height: {
          value: userData.height?.value || "",
          unit: "cm"
        },
        weight: {
          value: userData.weight?.value || "",
          unit: "kg"
        },
        // Ensure other fields have fallbacks
        fullName: userData.fullName || "",
        email: userData.email || "",
        gender: userData.gender || "",
        age: userData.age || "",
        goal: userData.goal || "",
        targetWeight: userData.targetWeight || "",
        activityLevel: userData.activityLevel || "",
        dietaryPreference: userData.dietaryPreference || "",
        medicalConditions: userData.medicalConditions || "",
        allergies: userData.allergies || "",
        medications: userData.medications || "",
        workoutDaysPerWeek: userData.workoutDaysPerWeek || 3,
        workoutPreferences: userData.workoutPreferences || [],
        mealPlanType: userData.mealPlanType || "",
        waterIntakeGoal: userData.waterIntakeGoal || 3000,
        sleepGoal: userData.sleepGoal || 8,
        wantsMentalSupport: userData.wantsMentalSupport || false
      };
  
      setProfileData(mergedData);
      setOriginalData(mergedData);
  
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      
      // Convert numeric values to numbers for height and weight
      let processedValue = value;
      if ((parent === 'height' || parent === 'weight') && child === 'value') {
        processedValue = value === '' ? '' : parseFloat(value);
      }
      
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: processedValue
        }
      }));
    } else {
      // Convert numeric fields to numbers
      let processedValue = value;
      if (['age', 'targetWeight', 'workoutDaysPerWeek', 'waterIntakeGoal', 'sleepGoal'].includes(field)) {
        processedValue = value === '' ? '' : parseFloat(value);
      }
      
      setProfileData(prev => ({
        ...prev,
        [field]: processedValue
      }));
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Structure the data properly for the backend
      const structuredData = {
        fullName: profileData.fullName,
        email: profileData.email,
        gender: profileData.gender,
        age: profileData.age,
        height: {
          value: profileData.height.value,
          unit: profileData.height.unit
        },
        weight: {
          value: profileData.weight.value,
          unit: profileData.weight.unit
        },
        goal: profileData.goal,
        targetWeight: profileData.targetWeight,
        activityLevel: profileData.activityLevel,
        dietaryPreference: profileData.dietaryPreference,
        medicalConditions: profileData.medicalConditions,
        allergies: profileData.allergies,
        medications: profileData.medications,
        workoutDaysPerWeek: profileData.workoutDaysPerWeek,
        workoutPreferences: profileData.workoutPreferences,
        mealPlanType: profileData.mealPlanType,
        waterIntakeGoal: profileData.waterIntakeGoal,
        sleepGoal: profileData.sleepGoal,
        wantsMentalSupport: profileData.wantsMentalSupport
      };

      const response = await fetch(`${API_BASE_URL}/api/user/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(structuredData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setOriginalData(structuredData);
        setProfileData(structuredData);
        setHasChanges(false);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        const errorText = await response.text();
        console.error("Failed to update profile:", errorText);
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setHasChanges(false);
    setIsEditing(false);
  };

  const calculateBMI = () => {
    if (profileData.weight?.value && profileData.height?.value) {
      const weightKg = parseFloat(profileData.weight.value);
      const heightM = parseFloat(profileData.height.value) / 100; // Convert cm to meters
      if (weightKg > 0 && heightM > 0) {
        return (weightKg / (heightM * heightM)).toFixed(1);
      }
    }
    return 'N/A';
  };

  const healthStats = [
    { 
      label: 'Current Weight', 
      value: profileData.weight?.value ? `${profileData.weight.value} kg` : 'Not set', 
      icon: Weight, 
      color: 'from-cyan-400 to-blue-500' 
    },
    { 
      label: 'Target Weight', 
      value: profileData.targetWeight ? `${profileData.targetWeight} kg` : 'Not set', 
      icon: Target, 
      color: 'from-purple-400 to-pink-500' 
    },
    { 
      label: 'Height', 
      value: profileData.height?.value ? `${profileData.height.value} cm` : 'Not set', 
      icon: Ruler, 
      color: 'from-green-400 to-emerald-500' 
    },
    { 
      label: 'BMI', 
      value: calculateBMI(), 
      icon: Heart, 
      color: 'from-orange-400 to-red-500' 
    },
    { 
      label: 'Sleep Goal', 
      value: `${profileData.sleepGoal}h`, 
      icon: Bed, 
      color: 'from-indigo-400 to-purple-500' 
    },
  ];

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <SignedIn>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>

        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          {/* Loading State */}
          {isInitialLoading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 sm:mb-8 bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 sm:p-6 text-center"
            >
              <div className="flex items-center justify-center gap-3 text-blue-300">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-300"></div>
                <span className="text-lg">Loading your profile...</span>
              </div>
            </motion.div>
          )}

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Profile</h1>
                <p className="text-white/60">Manage your personal information and health data</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {isEditing ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200 border border-white/20 text-sm sm:text-base"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={isLoading || !hasChanges}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center text-sm sm:text-base"
                  >
                    <Edit3 className="inline mr-2" size={18} />
                    Edit Profile
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 h-full">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      {clerkUser?.imageUrl ? (
                        <img 
                          src={clerkUser.imageUrl} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="text-white text-3xl" />
                      )}
                    </div>
                    {isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full text-white"
                      >
                        <Camera className="text-sm" />
                      </motion.button>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{profileData.fullName || 'User'}</h2>
                  <p className="text-white/60">{profileData.email || 'No email'}</p>
                  {profileData.goal && (
                    <div className="mt-2 inline-block px-3 py-1 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full border border-cyan-400/30">
                      <span className="text-cyan-400 text-sm font-medium">{profileData.goal}</span>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Weight className="text-cyan-400" size={18} />
                    <div className="flex-1">
                      <p className="text-white/60 text-sm">Current Weight</p>
                      <p className="text-white font-medium">{profileData.weight?.value ? `${profileData.weight.value} kg` : 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Target className="text-purple-400" size={18} />
                    <div className="flex-1">
                      <p className="text-white/60 text-sm">Target Weight</p>
                      <p className="text-white font-medium">{profileData.targetWeight ? `${profileData.targetWeight} kg` : 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Droplets className="text-blue-400" size={18} />
                    <div className="flex-1">
                      <p className="text-white/60 text-sm">Water Intake Goal</p>
                      <p className="text-white font-medium">{profileData.waterIntakeGoal ? `${profileData.waterIntakeGoal} ml` : 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Health Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {healthStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                        <stat.icon className="text-white text-xl" />
                      </div>
                      <p className="text-white/60 text-sm">{stat.label}</p>
                    </div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Profile Form */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.fullName || ''}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        disabled={!isEditing}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Gender</label>
                      <select
                        value={profileData.gender || ''}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        disabled={!isEditing}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                      >
                        <option value="" className="bg-gray-800 text-white">Select gender</option>
                        <option value="Male" className="bg-gray-800 text-white">Male</option>
                        <option value="Female" className="bg-gray-800 text-white">Female</option>
                        <option value="Other" className="bg-gray-800 text-white">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Age</label>
                      <input
                        type="number"
                        value={profileData.age || ''}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        disabled={!isEditing}
                        min="13"
                        max="120"
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                        placeholder="Enter your age"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Height (cm)</label>
                      <input
                        type="number"
                        value={profileData.height?.value || ''}
                        onChange={(e) => handleInputChange('height.value', e.target.value)}
                        disabled={!isEditing}
                        min="50"
                        max="250"
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                        placeholder="Enter your height in cm"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        value={profileData.weight?.value || ''}
                        onChange={(e) => handleInputChange('weight.value', e.target.value)}
                        disabled={!isEditing}
                        min="20"
                        max="300"
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                        placeholder="Enter your weight in kg"
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Goal</label>
                      <select
                        value={profileData.goal || ''}
                        onChange={(e) => handleInputChange('goal', e.target.value)}
                        disabled={!isEditing}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                      >
                        <option value="" className="bg-gray-800 text-white">Select goal</option>
                        <option value="Weight Loss" className="bg-gray-800 text-white">Weight Loss</option>
                        <option value="Weight Gain" className="bg-gray-800 text-white">Weight Gain</option>
                        <option value="Maintenance" className="bg-gray-800 text-white">Maintenance</option>
                        <option value="Muscle Building" className="bg-gray-800 text-white">Muscle Building</option>
                        <option value="General Health" className="bg-gray-800 text-white">General Health</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Target Weight (kg)</label>
                      <input
                        type="number"
                        value={profileData.targetWeight || ''}
                        onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                        disabled={!isEditing}
                        min="20"
                        max="300"
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                        placeholder="Enter target weight"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Activity Level</label>
                      <select
                        value={profileData.activityLevel || ''}
                        onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                        disabled={!isEditing}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                      >
                        <option value="">Select activity level</option>
                        <option value="Sedentary">Sedentary</option>
                        <option value="Lightly Active">Lightly Active</option>
                        <option value="Moderately Active">Moderately Active</option>
                        <option value="Very Active">Very Active</option>
                        <option value="Extremely Active">Extremely Active</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Workout Days per Week</label>
                      <input
                        type="number"
                        value={profileData.workoutDaysPerWeek || 3}
                        onChange={(e) => handleInputChange('workoutDaysPerWeek', e.target.value)}
                        disabled={!isEditing}
                        min="0"
                        max="7"
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Medical Conditions</label>
                    <textarea
                      value={profileData.medicalConditions || ''}
                      onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                      disabled={!isEditing}
                      rows="3"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                      placeholder="List any medical conditions (optional)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Allergies</label>
                    <textarea
                      value={profileData.allergies || ''}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      disabled={!isEditing}
                      rows="3"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                      placeholder="List any allergies (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Water Intake Goal (ml)</label>
                    <input
                      type="number"
                      value={profileData.waterIntakeGoal || 3000}
                      onChange={(e) => handleInputChange('waterIntakeGoal', parseInt(e.target.value))}
                      disabled={!isEditing}
                      min="500"
                      max="5000"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Sleep Goal (hours)</label>
                    <input
                      type="number"
                      value={profileData.sleepGoal || 8}
                      onChange={(e) => handleInputChange('sleepGoal', parseInt(e.target.value))}
                      disabled={!isEditing}
                      min="4"
                      max="12"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Workout Preferences */}
                <div className="mt-6">
                  <label className="block text-white/80 text-sm font-medium mb-2">Workout Preferences</label>
                  <div className="flex flex-wrap gap-3">
                    {['Cardio', 'Strength', 'Yoga', 'HIIT', 'Walking'].map((pref) => (
                      <div key={pref} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`pref-${pref}`}
                          checked={profileData.workoutPreferences?.includes(pref)}
                          onChange={(e) => {
                            const newPrefs = e.target.checked
                              ? [...(profileData.workoutPreferences || []), pref]
                              : (profileData.workoutPreferences || []).filter(p => p !== pref);
                            handleInputChange('workoutPreferences', newPrefs);
                          }}
                          disabled={!isEditing}
                          className="hidden"
                        />
                        <label
                          htmlFor={`pref-${pref}`}
                          className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all ${
                            profileData.workoutPreferences?.includes(pref)
                              ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {pref}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </SignedIn>
  );
};

export default Profile;