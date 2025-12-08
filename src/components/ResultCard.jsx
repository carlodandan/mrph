import { Trophy, Target, Clock, BarChart3, CheckCircle, XCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

function ResultCard({ result }) {
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-900';
    if (percentage >= 60) return 'text-yellow-600 dark:text-gray-900';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-100 dark:bg-gray-900';
    if (percentage >= 60) return 'bg-yellow-100 dark:bg-gray-900';
    return 'bg-red-100';
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const percentage = Math.round((result.score / result.totalQuestions) * 100);

  // Check if evaluations exist in the result
  const hasEvaluations = result.evaluations && result.evaluations.length > 0;

  return (
    <div className="bg-linear-to-br from-white to-blue-50 dark:from-gray-950 dark:to-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Exam Results</h3>
            <p className="text-gray-600 dark:text-gray-200">
              {result.examType === 'professional' ? 'Professional' : 'Sub-Professional'} Level • {new Date(result.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Score Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <svg className="w-48 h-48" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#linear)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 2.83} 283`}
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearlinear id="linear" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearlinear>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
              {percentage}%
            </span>
            <span className="text-gray-600 dark:text-gray-200">Score</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {result.categoryScores && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Category Performance</h4>
          <div className="space-y-3">
            {Object.entries(result.categoryScores).map(([category, scores]) => {
              const categoryPercentage = Math.round((scores.correct / scores.total) * 100);
              return (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-200">{category}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 dark:text-gray-200">
                      {scores.correct}/{scores.total}
                    </span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          categoryPercentage >= 80 ? 'bg-green-50 dark:bg-gray-900' :
                          categoryPercentage >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${categoryPercentage}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium w-12 ${
                      categoryPercentage >= 80 ? 'text-green-600' :
                      categoryPercentage >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {categoryPercentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-200">Correct</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{result.score}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-200">Total</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{result.totalQuestions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-200">Time</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{result.timeTaken}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-200">Answered</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{result.answersCount || 0}/{result.totalQuestions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Performance Summary</h4>
        <div className={`p-4 rounded-xl ${getScoreBgColor(percentage)}`}>
          <p className="text-gray-700 dark:text-gray-950">
            {percentage >= 80 
              ? "Excellent! You're well-prepared for the actual Civil Service Exam."
              : percentage >= 60
              ? "Good effort! Review the areas where you struggled."
              : "Needs improvement. Focus on studying key concepts and practice more."
            }
          </p>
        </div>
      </div>

      {/* Question Review Section */}
      {hasEvaluations && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Question Review</h4>
          <div className="space-y-4">
            {result.evaluations.map((evaluation, index) => {
              const isExpanded = expandedQuestions[evaluation.questionId || index];
              const isCorrect = evaluation.isCorrect;
              const question = evaluation.question;
              
              return (
                <div key={evaluation.questionId || index} className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleQuestion(evaluation.questionId || index)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 hover:dark:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div className="text-left">
                        <span className="font-medium text-gray-800 dark:text-white">
                          Question {index + 1}: {question?.text?.substring(0, 60)}...
                        </span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-sm px-2 py-0.5 rounded-full ${
                            isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                          {question?.category && (
                            <span className="text-sm text-gray-500 dark:text-gray-100">
                              {question.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-100" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-100" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-950">
                      <div className="space-y-4">
                        {/* Question */}
                        <div>
                          <h5 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Question:</h5>
                          <p className="text-gray-800 dark:text-white">{question?.text}</p>
                        </div>
                        
                        {/* Options */}
                        <div>
                          <h5 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Options:</h5>
                          <div className="space-y-2">
                            {question?.options?.map((option, optIndex) => {
                              const isUserAnswer = evaluation.userAnswer === option.id;
                              const isCorrectAnswer = question.correctAnswer === option.id;
                              const letter = String.fromCharCode(65 + optIndex);
                              
                              return (
                                <div 
                                  key={option.id} 
                                  className={`p-3 rounded-lg border ${
                                    isUserAnswer && isCorrectAnswer
                                      ? 'bg-green-50 dark:bg-gray-900 border-green-500'
                                      : isUserAnswer && !isCorrectAnswer
                                      ? 'bg-red-50 dark:bg-gray-900 border-red-200'
                                      : isCorrectAnswer
                                      ? 'bg-green-50 dark:bg-gray-900 border-green-500'
                                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-6 h-6 flex items-center justify-center rounded ${
                                      isUserAnswer && isCorrectAnswer
                                        ? 'bg-green-50 dark:bg-gray-900 dark:text-white text-gray-950'
                                        : isUserAnswer && !isCorrectAnswer
                                        ? 'bg-red-300 text-white dark:text-gray-950'
                                        : isCorrectAnswer
                                        ? 'bg-green-300 dark:bg-green-900 dark:text-gray-950'
                                        : 'bg-gray-200 text-gray-700 dark:text-gray-950'
                                    }`}>
                                      {letter}
                                    </div>
                                    <span className="text-gray-800 dark:text-white">{option.text}</span>
                                    {isUserAnswer && (
                                      <span className="ml-auto text-sm font-medium text-blue-700">
                                        Your choice
                                      </span>
                                    )}
                                    {isCorrectAnswer && !isUserAnswer && (
                                      <span className="ml-auto text-sm font-medium text-green-600">
                                        Correct answer
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Explanation */}
                        {question?.explanation && (
                          <div>
                            <h5 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Explanation:</h5>
                            <div className="p-3 bg-blue-50 dark:bg-gray-900 rounded-lg border border-blue-100">
                              <p className="text-gray-800 dark:text-white">{question.explanation}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Additional Info */}
                        <div className="flex flex-wrap gap-2">
                          {question?.category && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-200 rounded text-xs">
                              Category: {question.category}
                            </span>
                          )}
                          {question?.difficulty && (
                            <span className={`px-2 py-1 rounded text-xs ${
                              question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                              question.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              Difficulty: {question.difficulty}
                            </span>
                          )}
                          {question?.language && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                              Language: {question.language === 'filipino' ? 'Filipino' : 'English'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        {hasEvaluations && (
          <button
            onClick={() => {
              // Toggle all questions
              const allQuestions = result.evaluations.reduce((acc, evalItem, index) => {
                acc[evalItem.questionId || index] = true;
                return acc;
              }, {});
              setExpandedQuestions(allQuestions);
            }}
            className="flex-1 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
          >
            Expand All Explanations
          </button>
        )}
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          Take Another Test
        </button>
      </div>
    </div>
  );
}

export default ResultCard;