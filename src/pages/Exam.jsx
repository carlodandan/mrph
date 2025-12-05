import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertCircle, BookOpen, CheckCircle } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { examService } from '../services/examService';

function Exam() {
  const { type } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryProgress, setCategoryProgress] = useState({});
  const [examConfig, setExamConfig] = useState(null);
  const timerRef = useRef(null);
  const hasShownContinuePrompt = useRef(false);

  // Reset Screen position
  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Also focus on the first question card for accessibility
      const questionCard = document.querySelector('[data-question-card]');
      if (questionCard) {
        questionCard.focus({ preventScroll: true });
      }
    }
  }, [isLoading, questions]);

  // Initialize exam
  useEffect(() => {
    let isMounted = true;
    
    const initializeExam = async () => {
      if (hasShownContinuePrompt.current) return;

      window.scrollTo(0, 0);
      
      const savedProgress = examService.loadProgress(type);
      
      if (savedProgress) {
        hasShownContinuePrompt.current = true;
        
        const continueExam = window.confirm(
          'You have an exam in progress. Would you like to continue?'
        );
        
        if (continueExam && isMounted) {
          setQuestions(savedProgress.questions || []);
          setAnswers(savedProgress.answers || {});
          setCurrentQuestion(savedProgress.currentQuestion || 0);
          setTimeRemaining(savedProgress.timeRemaining || 0);
          
          let totalQuestions;
          let categories = [];
          
          if (type === 'practice') {
            totalQuestions = savedProgress.questions?.length || 60; // Practice has 60 items
          } else {
            categories = examService.getExamCategories(type);
            totalQuestions = savedProgress.questions?.length || categories.length * 20;
          }
          
          setExamConfig({
            totalQuestions,
            timeLimit: savedProgress.timeRemaining || examService.getAdaptedTimeLimit(type, totalQuestions),
            categories: type === 'practice' ? 6 : categories.length,
          });
          
          updateCategoryProgress(savedProgress.questions || [], savedProgress.answers || {});
          
          setIsLoading(false);
          return;
        } else if (isMounted) {
          examService.clearProgress(type);
          hasShownContinuePrompt.current = false;
        }
      }

      let totalQuestions;
      let categoriesCount;
      let categories = []; // Declare categories here

      if (type === 'practice') {
        totalQuestions = 60;
        categoriesCount = 6;
      } else {
        categories = examService.getExamCategories(type); // Define categories here
        totalQuestions = categories.reduce((sum, category) => {
          return sum + (category === 'General Information' ? 10 : 20);
        }, 0);
        categoriesCount = categories.length;
      }
      
      if (isMounted) {
        setExamConfig({
          totalQuestions,
          timeLimit: examService.getAdaptedTimeLimit(type, totalQuestions),
          categories: categoriesCount, // Use categoriesCount instead of categories.length
        });
      }

      await generateNewExam(isMounted);
    };

    initializeExam();

    return () => {
      isMounted = false;
    };
  }, [type]);

  const generateNewExam = async (isMounted = true) => {
    if (!isMounted) return;
    
    setIsLoading(true);
    
    try {
      await examService.initialize();
      
      const examQuestions = await examService.generateExam(type);
      
      if (examQuestions.length === 0) {
        throw new Error('No questions were generated. Please check if JSON files exist and contain valid questions.');
      }
      
      if (isMounted) {
        setQuestions(examQuestions);
        
        updateCategoryProgress(examQuestions, {});
        
        const timeLimit = examService.getAdaptedTimeLimit(type, examQuestions.length);
        setTimeRemaining(timeLimit);
        
        setExamConfig(prev => ({
          ...prev,
          totalQuestions: examQuestions.length,
          timeLimit
        }));
        
        saveProgress(timeLimit, examQuestions);
      }
      
    } catch (error) {
      console.error('Failed to generate exam:', error);
      alert(`Failed to load exam questions: ${error.message}. Please check the console for details.`);
      if (isMounted) {
        navigate('/');
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const updateCategoryProgress = (questionsList, currentAnswers) => {
    const progress = {};
    
    questionsList.forEach(q => {
      if (!progress[q.category]) {
        progress[q.category] = { total: 0, answered: 0 };
      }
      
      progress[q.category].total++;
      
      if (currentAnswers[q.id]) {
        progress[q.category].answered++;
      }
    });
    
    setCategoryProgress(progress);
  };

  const saveProgress = (currentTime, currentQuestions = questions) => {
    const progress = {
      questions: currentQuestions,
      answers,
      currentQuestion,
      timeRemaining: currentTime,
      examType: type,
      timestamp: Date.now()
    };
    
    examService.saveProgress(type, progress);
  };

  // Timer management
  useEffect(() => {
    if (timeRemaining <= 0 || questions.length === 0 || !examConfig) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        
        if (newTime % 30 === 0) {
          saveProgress(newTime);
        }
        
        if (newTime <= 0) {
          clearInterval(timerRef.current);
          handleSubmitExam();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeRemaining, questions, examConfig]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, answerId) => {
    const newAnswers = {
      ...answers,
      [questionId]: answerId
    };
    
    setAnswers(newAnswers);
    updateCategoryProgress(questions, newAnswers);
    saveProgress(timeRemaining);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => {
        const newValue = prev + 1;
        saveProgress(timeRemaining);
        return newValue;
      });
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => {
        const newValue = prev - 1;
        saveProgress(timeRemaining);
        return newValue;
      });
    }
  };

  const handleSubmitExam = () => {
    if (questions.length === 0 || !examConfig) return;

    examService.clearProgress(type);
    
    const { score, total, percentage, evaluations } = examService.calculateScore(questions, answers);
    const categoryScores = examService.calculateCategoryScores(questions, answers);

    const result = {
      examType: type,
      score,
      totalQuestions: total,
      percentage,
      timeTaken: formatTime(examConfig.timeLimit - timeRemaining),
      date: new Date().toISOString(),
      categoryScores,
      evaluations,
      answersCount: Object.keys(answers).length
    };

    localStorage.setItem('lastExamResult', JSON.stringify(result));
    
    navigate('/results');
  };

  const getCurrentCategory = () => {
    if (questions.length === 0) return '';
    return questions[currentQuestion]?.category || '';
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading exam questions..." />;
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-4 text-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-6">
            Failed to load exam questions. Please try again.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const answeredCount = getAnsweredCount();

  if (!examConfig) {
    return <LoadingSpinner message="Loading exam configuration..." />;
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <div className="px-4 py-2 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl">
              <span className="text-sm font-medium">
                {type === 'professional' ? 'Professional Level' : 
                type === 'subprofessional' ? 'Sub-Professional Level' : 'Practice Level'}
              </span>
            </div>
          </div>

          {/* Timer */}
          <div className={`flex items-center space-x-2 px-4 py-3 rounded-xl ${
            timeRemaining < 300 ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <Clock className={`w-5 h-5 ${timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'}`} />
            <span className={`text-lg font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Questions on left, Progress on right */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Left Column - Questions */}
        <div className="lg:w-2/3">
          <QuestionCard
            question={currentQ}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
            onAnswer={(answerId) => handleAnswer(currentQ.id, answerId)}
            selectedAnswer={answers[currentQ.id]}
            isLastQuestion={isLastQuestion}
            data-question-card
          />
        </div>

        {/* Right Column - Exam Progress */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Exam Progress
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Questions Answered</span>
                  <span>{answeredCount}/{questions.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Time Used</span>
                  <span>{formatTime(examConfig.timeLimit - timeRemaining)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${((examConfig.timeLimit - timeRemaining) / examConfig.timeLimit) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Category */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-1">Current Category</p>
                <div className="px-3 py-2 bg-blue-50 rounded-lg">
                  <span className="font-medium text-blue-700">{getCurrentCategory()}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Quick Stats</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{answeredCount}</div>
                    <div className="text-xs text-gray-500">Answered</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{questions.length - answeredCount}</div>
                    <div className="text-xs text-gray-500">Remaining</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation and Submit Buttons - MOVED HERE */}
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col space-y-4">
              {/* Navigation Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium ${
                    currentQuestion === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Previous Question
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === questions.length - 1}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium ${
                    currentQuestion === questions.length - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-linear-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                  }`}
                >
                  Next Question
                </button>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to submit the exam?')) {
                    handleSubmitExam();
                  }
                }}
                className="w-full px-6 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
        <h4 className="font-bold text-gray-800 mb-4">Question Navigator</h4>
        <div className="grid grid-cols-10 gap-2">
          {questions.map((q, index) => {
            const isAnswered = answers[q.id];
            
            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentQuestion(index);
                  saveProgress(timeRemaining);
                }}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all relative ${
                  index === currentQuestion
                    ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                    : isAnswered
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={`Q${index + 1}: ${q.category}${isAnswered ? ' (Answered)' : ''}`}
              >
                {index + 1}
                {isAnswered && (
                  <span className="absolute -top-1 -right-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-gray-600">Current</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 border border-green-500 rounded mr-2"></div>
            <span className="text-gray-600">Answered</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 border border-gray-400 rounded mr-2"></div>
            <span className="text-gray-600">Not Answered</span>
          </div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
        <h4 className="font-bold text-gray-800 mb-4">Category Progress</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(categoryProgress).map(([category, stats]) => {
            const percentage = Math.round((stats.answered / stats.total) * 100);
            
            return (
              <div key={category} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700 text-sm">{category}</span>
                  <span className="text-xs text-gray-500">
                    {stats.answered}/{stats.total}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Answered</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center space-x-2 text-blue-800 mb-2">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">CSC Exam Guidelines:</span>
        </div>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Read each question carefully before answering</li>
          <li>• Manage your time wisely across all categories</li>
          <li>• Answer all questions - there's no penalty for wrong answers</li>
          <li>• Review your answers before submitting</li>
          <li>• You can change answers anytime before submission</li>
        </ul>
      </div>
    </div>
  );
}

export default Exam;