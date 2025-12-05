import { useState, useEffect } from 'react';
import { CheckCircle, Circle, HelpCircle } from 'lucide-react';

function QuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer, 
  selectedAnswer,
  isLastQuestion
}) {
  const [localSelected, setLocalSelected] = useState(selectedAnswer);

  // Reset localSelected when the question changes
  useEffect(() => {
    setLocalSelected(selectedAnswer);
  }, [question.id, selectedAnswer]);

  const handleAnswerSelect = (answerId) => {
    setLocalSelected(answerId);
    onAnswer(answerId);
  };

  const getLetter = (index) => {
    return String.fromCharCode(65 + index);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 fade-in">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-linear-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {question.language && (
            <div className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              {question.language === 'filipino' ? 'Filipino' : 'English'}
            </div>
          )}

          {question.difficulty && (
            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
              question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              question.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {question.difficulty}
            </div>
          )}

          {question.category && (
            <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full">
              <span className="text-xs font-medium text-gray-600">{question.category}</span>
            </div>
          )}
        </div>

        <div className="flex items-start space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <HelpCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Question:</h3>
            <p className="text-gray-700 text-lg leading-relaxed">{question.text}</p>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4 mb-8">
        <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
          Select your answer:
        </h4>
        {question.options.map((option, index) => {
          const isSelected = localSelected === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleAnswerSelect(option.id)}
              className={`w-full p-2 rounded-xl border-2 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                  isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {isSelected ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-bold">{getLetter(index)}</span>
                  )}
                </div>
                <span className="flex-1 text-gray-800">{option.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          {isLastQuestion ? 'Last question' : `${totalQuestions - questionNumber} questions remaining`}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => handleAnswerSelect(null)}
            className={`px-4 py-2 font-medium ${
              !localSelected 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            disabled={!localSelected}
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;