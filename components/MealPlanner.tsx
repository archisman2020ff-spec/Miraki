import React, { useState } from 'react';
import { generateMealPlan } from '../services/geminiService';
import { IconSparkles } from './Icons';

// Fix: Implemented MealPlanner component to resolve module errors.
export default function MealPlanner() {
  const [preferences, setPreferences] = useState('');
  const [mealPlan, setMealPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeneratePlan = async () => {
    if (!preferences.trim()) {
      setError('Please enter your meal preferences.');
      return;
    }
    setError('');
    setIsLoading(true);
    setMealPlan('');
    try {
      const plan = await generateMealPlan(preferences);
      setMealPlan(plan);
    } catch (err) {
      setError('Failed to generate meal plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <IconSparkles className="w-8 h-8 text-green-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">AI Meal Planner</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Describe your dietary needs, preferences, or goals, and our AI will generate a personalized 3-day meal plan for you. 
          For example: "I'm a vegetarian looking for high-protein, low-carb meals."
        </p>
        
        <textarea
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="Enter your preferences here..."
          className="w-full p-3 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          disabled={isLoading}
        />

        <button
          onClick={handleGeneratePlan}
          className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-md hover:bg-green-600 transition-colors disabled:bg-green-300"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate My Plan'}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {mealPlan && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-2xl font-bold mb-4">Your Personalized Meal Plan</h3>
            <div className="prose max-w-none whitespace-pre-wrap">{mealPlan}</div>
          </div>
        )}
      </div>
    </div>
  );
}
