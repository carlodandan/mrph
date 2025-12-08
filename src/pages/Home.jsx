import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Users, Clock, Shield, ArrowRight, Star } from 'lucide-react';
import ExamSelection from '../components/ExamSelection';

function Home() {
  const [activeTab, setActiveTab] = useState('about');

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Mock Exam / Reviewer",
      description: "Get a proper questions with explanations from from different sources."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Adaptive Learning",
      description: "Questions adjust to your skill level for optimal preparation"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time Management",
      description: "Practice with realistic time constraints and tracking"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Official Syllabus",
      description: "Based on actual Civil Service Commission exam coverage"
    }
  ];

  const tips = [
    "Review basic grammar and vocabulary daily",
    "Practice mathematical operations without calculator",
    "Study Philippine Constitution and government structure",
    "Take timed practice tests regularly",
    "Focus on weakest areas"
  ];

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Hero Section */}
      <div className="text-center mb-6 pt-4">
        <div className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-100 to-purple-100 rounded-full mb-4">
          <Star className="w-4 h-4 text-yellow-500 mr-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Philippine Civil Service Examination</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Master the Civil Service Exam with{' '}
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mock Reviewer PH
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-200 max-w-3xl mx-auto mb-8">
          Prepare smarter with personalized mock tests and detailed explanations for both Professional and Sub-Professional levels.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a 
            href="#exams" 
            className="px-8 py-4 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            Start Free Mock Examination
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
          <Link 
            to="/tutorial"
            className="px-8 py-4 bg-white dark:bg-gray-950 text-gray-800 dark:text-white rounded-xl font-semibold text-lg border-2 border-gray-300 hover:bg-gray-50 transition-all text-center"
          >
            Watch Tutorial
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
          >
            <div className="p-3 bg-linear-to-br from-blue-100 to-purple-100 rounded-xl w-fit mb-4">
              <div className="text-blue-600">
                {feature.icon}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-200">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Tabs Section */}
      <div className="mb-16">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-6 py-3 font-medium text-lg ${activeTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-100'}`}
            onClick={() => setActiveTab('about')}
          >
            About the Exam
          </button>
          <button
            className={`px-6 py-3 font-medium text-lg ${activeTab === 'tips' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-100'}`}
            onClick={() => setActiveTab('tips')}
          >
            Study Tips
          </button>
          <button
            className={`px-6 py-3 font-medium text-lg ${activeTab === 'requirements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-100'}`}
            onClick={() => setActiveTab('requirements')}
          >
            Requirements
          </button>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-8 shadow-lg">
          {activeTab === 'about' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">About the Civil Service Exam</h3>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                The Civil Service Examination (CSE) is conducted by the Philippine Civil Service Commission (CSC) to determine the fitness of individuals who want to enter government service.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 bg-blue-50 dark:bg-gray-900 rounded-xl">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2">Professional Level</h4>
                  <ul className="text-gray-700 dark:text-gray-200 space-y-2">
                    <li>• For college graduates</li>
                    <li>• 170 multiple-choice items</li>
                    <li>• 3.5 hours duration</li>
                    <li>• Higher salary grade eligibility</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 dark:bg-gray-900 rounded-xl">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2">Sub-Professional Level</h4>
                  <ul className="text-gray-700 dark:text-gray-200 space-y-2">
                    <li>• For non-college graduates</li>
                    <li>• 165 multiple-choice items</li>
                    <li>• 2.5 hours duration</li>
                    <li>• Entry-level government positions</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Effective Study Tips</h3>
              <div className="space-y-4">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 pt-1">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Examination Requirements</h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-200">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-50 dark:bg-gray-900 rounded-full mr-3"></div>
                  Filipino citizen
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-50 dark:bg-gray-900 rounded-full mr-3"></div>
                  At least 18 years old
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-50 dark:bg-gray-900 rounded-full mr-3"></div>
                  Of good moral character
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-50 dark:bg-gray-900 rounded-full mr-3"></div>
                  No criminal record
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-50 dark:bg-gray-900 rounded-full mr-3"></div>
                  Not removed from service for cause
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Exam Selection */}
      <div id="exams" className="scroll-mt-16">
        <ExamSelection />
      </div>
    </div>
  );
}

export default Home;