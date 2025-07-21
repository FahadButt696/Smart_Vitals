import React from "react";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0F0F0F] via-[#1C1C1C] to-[#2B2B2B] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1C1C1C] bg-opacity-70 p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-6">AI Fitness</h2>
        <nav className="space-y-4">
          <a href="#" className="block hover:text-purple-400">Home</a>
          <a href="#" className="block hover:text-purple-400">Plans</a>
          <a href="#" className="block hover:text-purple-400">AI Coach</a>
          <a href="#" className="block hover:text-purple-400">Meal Tracker</a>
          <a href="#" className="block hover:text-purple-400">Workouts</a>
          <a href="#" className="block hover:text-purple-400">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome Back!</h1>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#2B2B2B] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold">Your Workout</h2>
            <p className="text-sm text-gray-400">Next session in 3 hours</p>
          </div>
          <div className="bg-[#2B2B2B] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold">Calories Burned</h2>
            <p className="text-sm text-gray-400">+350 kcal today</p>
          </div>
          <div className="bg-[#2B2B2B] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold">Water Intake</h2>
            <p className="text-sm text-gray-400">5/8 glasses</p>
          </div>
        </div>
      </main>
    </div>
  );
}
