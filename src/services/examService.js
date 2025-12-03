// Import all JSON files statically
import proNumericalAbility from '../data/pro/numerical-ability.json';
import proAnalyticalAbility from '../data/pro/analytical-ability.json';
import proVerbalAbility from '../data/pro/verbal-ability.json';
import proPhilippineConstitution from '../data/pro/philippine-constitution.json';
import proRA6713 from '../data/pro/ra-6713.json';
import proPeaceHumanRights from '../data/pro/peace-human-rights.json';
import proEnvironmentalManagement from '../data/pro/environmental-management.json';
import proGeneralInformation from '../data/pro/general-information.json';

import subNumericalAbility from '../data/subPro/numerical-ability.json';
import subClericalAbility from '../data/subPro/clerical-ability.json';
import subVerbalAbility from '../data/subPro/verbal-ability.json';
import subPhilippineConstitution from '../data/subPro/philippine-constitution.json';
import subRA6713 from '../data/subPro/ra-6713.json';
import subPeaceHumanRights from '../data/subPro/peace-human-rights.json';
import subEnvironmentalManagement from '../data/subPro/environmental-management.json';
import subGeneralInformation from '../data/subPro/general-information.json';

class ExamService {
  constructor() {
    // Initialize question pools with static imports
    this.proQuestions = {
      'Numerical Ability': proNumericalAbility || [],
      'Analytical Ability': proAnalyticalAbility || [],
      'Verbal Ability': proVerbalAbility || [],
      'Philippine Constitution': proPhilippineConstitution || [],
      'RA 6713': proRA6713 || [],
      'Peace and Human Rights': proPeaceHumanRights || [],
      'Environmental Management': proEnvironmentalManagement || [],
      'General Information': proGeneralInformation || []
    };

    this.subQuestions = {
      'Numerical Ability': subNumericalAbility || [],
      'Clerical Ability': subClericalAbility || [],
      'Verbal Ability': subVerbalAbility || [],
      'Philippine Constitution': subPhilippineConstitution || [],
      'RA 6713': subRA6713 || [],
      'Peace and Human Rights': subPeaceHumanRights || [],
      'Environmental Management': subEnvironmentalManagement || [],
      'General Information': subGeneralInformation || []
    };

    this.sessionUsedQuestions = new Set();
    this.examProgress = new Map();
    this.currentSessionId = null;
    this.isInitialized = true; // Static imports mean we're already initialized

    // Log statistics
    this.logQuestionStats();
  }

  logQuestionStats() {
    const proCount = Object.values(this.proQuestions).reduce((sum, arr) => sum + (arr?.length || 0), 0);
    const subCount = Object.values(this.subQuestions).reduce((sum, arr) => sum + (arr?.length || 0), 0);
    
    console.log('Questions loaded successfully');
    console.log(`Professional: ${proCount} total questions`);
    console.log(`Sub-professional: ${subCount} total questions`);
    
    // Log per category counts
    console.log('Professional categories:');
    Object.entries(this.proQuestions).forEach(([category, questions]) => {
      console.log(`  ${category}: ${questions?.length || 0} questions`);
    });
    
    console.log('Sub-professional categories:');
    Object.entries(this.subQuestions).forEach(([category, questions]) => {
      console.log(`  ${category}: ${questions?.length || 0} questions`);
    });
  }

  async initialize() {
    // Already initialized with static imports
    return Promise.resolve();
  }

  getExamCategories(examType) {
    if (examType === 'professional') {
      return [
        'Numerical Ability',
        'Analytical Ability',
        'Verbal Ability',
        'Philippine Constitution',
        'RA 6713',
        'Peace and Human Rights',
        'Environmental Management',
        'General Information'
      ];
    } else { // subprofessional
      return [
        'Numerical Ability',
        'Clerical Ability',
        'Verbal Ability',
        'Philippine Constitution',
        'RA 6713',
        'Peace and Human Rights',
        'Environmental Management',
        'General Information'
      ];
    }
  }

  getRandomQuestions(array, count, excludeIds = new Set()) {
    if (!array || !Array.isArray(array) || array.length === 0) return [];
    
    // Filter out excluded questions
    const availableQuestions = array.filter(q => q && q.id && !excludeIds.has(q.id));
    
    if (availableQuestions.length === 0) return [];
    
    // If we need more questions than available, return all available
    if (availableQuestions.length <= count) {
      return this.shuffleArray([...availableQuestions]);
    }
    
    // Select random questions without replacement
    const shuffled = this.shuffleArray([...availableQuestions]);
    return shuffled.slice(0, count);
  }

  getCategoryQuestions(examType, category, language = 'english', count = 10) {
    const questionPool = examType === 'professional' 
      ? this.proQuestions?.[category]
      : this.subQuestions?.[category];

    if (!questionPool || !Array.isArray(questionPool)) {
      console.error(`No questions found for category: ${category}`, questionPool);
      return [];
    }

    // Filter by language first
    const languageFilteredQuestions = questionPool.filter(q => {
      if (!q) return false;
      const qLanguage = q.language || 'english';
      return qLanguage === language;
    });

    // Get random questions, excluding already used ones in this session
    const selectedQuestions = this.getRandomQuestions(
      languageFilteredQuestions.length > 0 ? languageFilteredQuestions : questionPool,
      count,
      this.sessionUsedQuestions
    );

    // Mark as used in this session
    selectedQuestions.forEach(q => {
      if (q && q.id) this.sessionUsedQuestions.add(q.id);
    });
    
    return selectedQuestions;
  }

  async generateExam(examType, language = 'english') {
    // Generate new session ID and reset used questions
    this.currentSessionId = Date.now();
    this.clearSessionQuestions();
    
    const categories = this.getExamCategories(examType);
    const allQuestions = [];

    console.log(`Generating ${examType} exam in ${language} (Session: ${this.currentSessionId})`);

    for (const category of categories) {
      const categoryQuestions = this.getCategoryQuestions(examType, category, language, 10);
      console.log(`${category}: ${categoryQuestions.length} questions selected`);
      allQuestions.push(...categoryQuestions);
    }

    // Shuffle all questions together
    const shuffledQuestions = this.shuffleArray(allQuestions);
    console.log(`Total questions generated: ${shuffledQuestions.length}`);
    return shuffledQuestions;
  }

  getAdaptedTimeLimit(examType, questionCount) {
    const originalTimes = {
      professional: 3 * 3600 + 10 * 60, // 3h 10m for 170 questions
      subprofessional: 2 * 3600 + 40 * 60 // 2h 40m for 165 questions
    };

    const originalQuestionCount = examType === 'professional' ? 170 : 165;
    const timePerQuestion = originalTimes[examType] / originalQuestionCount;
    
    return Math.round(timePerQuestion * questionCount);
  }

  calculateScore(questions, answers) {
    let score = 0;
    const evaluations = [];

    questions.forEach(question => {
      if (!question) return;
      
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) score++;

      evaluations.push({
        question,
        userAnswer,
        isCorrect,
        explanation: question.explanation || 'No explanation available',
        correctAnswer: question.correctAnswer
      });
    });

    return {
      score,
      total: questions.length,
      percentage: questions.length > 0 ? Math.round((score / questions.length) * 100) : 0,
      evaluations
    };
  }

  calculateCategoryScores(questions, answers) {
    const categoryScores = {};

    questions.forEach(q => {
      if (!q) return;
      
      const category = q.category || 'Unknown';
      if (!categoryScores[category]) {
        categoryScores[category] = { total: 0, correct: 0 };
      }
      
      categoryScores[category].total++;
      
      if (answers[q.id] === q.correctAnswer) {
        categoryScores[category].correct++;
      }
    });

    // Calculate percentages
    Object.keys(categoryScores).forEach(category => {
      const scores = categoryScores[category];
      scores.percentage = scores.total > 0 ? Math.round((scores.correct / scores.total) * 100) : 0;
    });

    return categoryScores;
  }

  saveProgress(examType, data) {
    const key = `exam_progress_${examType}`;
    const progress = {
      ...data,
      timestamp: Date.now(),
      sessionId: this.currentSessionId
    };
    localStorage.setItem(key, JSON.stringify(progress));
    this.examProgress.set(key, progress);
  }

  loadProgress(examType) {
    const key = `exam_progress_${examType}`;
    
    if (this.examProgress.has(key)) {
      return this.examProgress.get(key);
    }

    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        this.examProgress.set(key, progress);
        
        // Restore session ID if continuing
        if (progress.sessionId) {
          this.currentSessionId = progress.sessionId;
          // Mark questions from saved progress as used
          if (progress.questions && Array.isArray(progress.questions)) {
            progress.questions.forEach(q => {
              if (q && q.id) this.sessionUsedQuestions.add(q.id);
            });
          }
        }
        
        return progress;
      } catch (error) {
        console.error('Error parsing saved progress:', error);
        return null;
      }
    }

    return null;
  }

  clearProgress(examType) {
    const key = `exam_progress_${examType}`;
    localStorage.removeItem(key);
    this.examProgress.delete(key);
    this.clearSessionQuestions();
  }

  clearSessionQuestions() {
    this.sessionUsedQuestions.clear();
  }

  clearUsedQuestions() {
    this.clearSessionQuestions();
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Get statistics about available questions
  getQuestionStats(examType) {
    const questions = examType === 'professional' ? this.proQuestions : this.subQuestions;
    const stats = {};
    
    if (!questions) return stats;
    
    Object.entries(questions).forEach(([category, questionArray]) => {
      if (!Array.isArray(questionArray)) {
        stats[category] = { total: 0, english: 0, filipino: 0 };
        return;
      }
      
      const englishCount = questionArray.filter(q => q && (q.language || 'english') === 'english').length;
      const filipinoCount = questionArray.filter(q => q && q.language === 'filipino').length;
      
      stats[category] = {
        total: questionArray.length,
        english: englishCount,
        filipino: filipinoCount
      };
    });
    
    return stats;
  }
}

// Create and export singleton instance
export const examService = new ExamService();