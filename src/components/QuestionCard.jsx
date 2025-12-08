import { useState, useEffect } from 'react';
import { CheckCircle, HelpCircle, Maximize2, X } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

function QuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer, 
  selectedAnswer,
  isLastQuestion
}) {
  const [localSelected, setLocalSelected] = useState(selectedAnswer);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

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

  // Function to render text with LaTeX support
  const renderTextWithLatex = (text) => {
    if (!text) return null;
    
    // Split by LaTeX delimiters
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);
    
    return parts.map((part, index) => {
      // Check if part is LaTeX (starts and ends with $ or $$)
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // Block math (display mode)
        const latex = part.slice(2, -2);
        return <BlockMath key={index} math={latex} />;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // Inline math
        const latex = part.slice(1, -1);
        return <InlineMath key={index} math={latex} />;
      } else {
        // Regular text
        return <span key={index}>{part}</span>;
      }
    });
  };

  // Function to check if text contains LaTeX
  const containsLatex = (text) => {
    return text && (text.includes('$') || text.includes('$$'));
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl p-6 md:p-8 fade-in">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-200">
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
              <div className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-950 rounded-full">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-200">{question.category}</span>
              </div>
            )}
          </div>

          {/* Display image if question has src */}
          {question.src && (
            <div className="mb-6">
              <div className="relative w-full max-w-2xl mx-auto">
                <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <img 
                    src={question.src}
                    alt={question.imageAlt || "Question image"}
                    className="w-full h-auto max-h-96 object-contain cursor-pointer"
                    onClick={() => setIsImageZoomed(true)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      console.error(`Failed to load image: ${question.src}`);
                    }}
                  />
                  <button
                    onClick={() => setIsImageZoomed(true)}
                    className="absolute top-3 right-3 bg-gray-950/60 hover:bg-gray-950/80 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                    title="Zoom image"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-100 mt-2 text-center">
                  Click image to enlarge
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-80 dark:text-white mb-2">Question:</h3>
              <div className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-line">
                {containsLatex(question.text) ? (
                  renderTextWithLatex(question.text)
                ) : (
                  question.text
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wide mb-2">
            Select your answer:
          </h4>
          {question.options && question.options.map((option, index) => {
            const isSelected = localSelected === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                className={`w-full p-2 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-gray-900 shadow-md transform scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                    isSelected ? 'bg-blue-50 dark:bg-gray-600 text-gray-950 dark:text-gray-50' : 'bg-gray-200 dark:bg-gray-600 text-gray-950 dark:text-gray-50'
                  }`}>
                    {isSelected ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="font-bold">{getLetter(index)}</span>
                    )}
                  </div>
                  <div className="flex-1 text-gray-950 dark:text-gray-50">
                    {containsLatex(option.text) ? (
                      renderTextWithLatex(option.text)
                    ) : (
                      option.text
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-500 dark:text-gray-100">
            {isLastQuestion ? 'Last question' : `${totalQuestions - questionNumber} questions remaining`}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => handleAnswerSelect(null)}
              className={`px-4 py-2 font-medium ${
                !localSelected 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 dark:text-gray-200 hover:text-gray-80 dark:text-white'
              }`}
              disabled={!localSelected}
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>

      {/* Image zoom modal */}
      {isImageZoomed && question.src && (
        <div className="fixed inset-0 bg-gray-950/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-[90vh]">
            <img 
              src={question.src}
              alt={question.imageAlt || "Question image - zoomed"}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-4 right-4 bg-gray-950/70 hover:bg-gray-950 text-white p-3 rounded-full backdrop-blur-sm transition-all"
              title="Close zoom"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <div className="inline-block bg-gray-950/70 text-white text-sm px-4 py-2 rounded-lg backdrop-blur-sm">
                {question.imageAlt || "Question image"}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QuestionCard;