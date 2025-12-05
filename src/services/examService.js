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
    this.isInitialized = true;

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
    } else if (examType === 'subprofessional') {
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
    } else { // practice
      return [
        'Numerical Ability',
        'Verbal Ability',
        'Philippine Constitution',
        'RA 6713',
        'Peace and Human Rights',
        'Environmental Management'
      ];
    }
  }

  /**
   * Returns the base target number of questions for a category.
   * Note: The final count is capped by the overall exam limit (170/165) in generateExam.
   */
  getQuestionsPerCategory(examType, category) {
    // General Information always has 10 questions
    if (category === 'General Information') {
      return 10;
    }
    
    // For practice exams, each category has 10 questions
    if (examType === 'practice') {
      return 10;
    }
    
    // Set a high base target (25) for main categories to ensure we reach the 170/165 limit,
    // as the overall limit check in generateExam will cap the final total.
    return 25;
  }

  getRandomQuestions(array, count, excludeIds = new Set()) {
    if (!array || !Array.isArray(array) || array.length === 0) return [];
  
    // Filter out excluded questions
    const availableQuestions = array.filter(q => q && q.id && !excludeIds.has(q.id));
  
    console.log(`Available questions after filtering: ${availableQuestions.length} out of ${array.length}`);
  
    if (availableQuestions.length === 0) return [];
  
    // If we need more questions than available, return all available
    const actualCount = Math.min(count, availableQuestions.length);
  
    // Create a copy to avoid modifying the original array
    const questionsCopy = [...availableQuestions];
  
    // Fisher-Yates shuffle for random selection
    for (let i = questionsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionsCopy[i], questionsCopy[j]] = [questionsCopy[j], questionsCopy[i]];
    }
  
    // Return the requested number of questions
    return questionsCopy.slice(0, actualCount);
  }

  getCategoryQuestions(examType, category, targetCount = null) {
    // For practice exam, we need to handle both professional and subprofessional pools
    let questionPool = [];
    
    if (examType === 'practice') {
      // For practice, combine questions from both professional and subprofessional
      const proPool = this.proQuestions?.[category] || [];
      const subPool = this.subQuestions?.[category] || [];
      questionPool = [...proPool, ...subPool];
    } else {
      questionPool = examType === 'professional' 
        ? this.proQuestions?.[category]
        : this.subQuestions?.[category];
    }

    if (!questionPool || !Array.isArray(questionPool)) {
      console.error(`No questions found for category: ${category}`, questionPool);
      return [];
    }

    // Use target count or calculate based on category
    const count = targetCount || this.getQuestionsPerCategory(examType, category);

    console.log(`Getting questions for ${category}: Pool has ${questionPool.length} questions, target: ${count}`);

    // Get random questions, excluding already used ones in this session
    const selectedQuestions = this.getRandomQuestions(
      questionPool,
      count,
      this.sessionUsedQuestions
    );

    // Mark as used in this session
    selectedQuestions.forEach(q => {
      if (q && q.id) this.sessionUsedQuestions.add(q.id);
    });
    
    console.log(`Selected ${selectedQuestions.length} questions for ${category}`);
    
    return selectedQuestions;
  }

  getAvailableQuestionCounts(examType) {
    const questionPool = examType === 'professional' ? this.proQuestions : this.subQuestions;
    const counts = {};
    
    Object.entries(questionPool).forEach(([category, questions]) => {
      if (!Array.isArray(questions)) {
        counts[category] = { total: 0 };
        return;
      }
      
      counts[category] = {
        total: questions.length,
        target: this.getQuestionsPerCategory(examType, category)
      };
    });
    
    return counts;
  }

  getPracticeCategories() {
    return [
      'Numerical Ability',
      'Verbal Ability',
      'Philippine Constitution',
      'RA 6713',
      'Peace and Human Rights',
      'Environmental Management'
    ];
  }

  async generatePracticeExam() {
    // Generate new session ID and reset used questions
    this.currentSessionId = Date.now();
    this.clearSessionQuestions();
    
    const categories = this.getPracticeCategories();
    const allQuestions = [];

    console.log(`Generating Practice exam (Session: ${this.currentSessionId})`);

    for (const category of categories) {
      // For practice, get 10 questions from each category
      const targetCount = 10;
      
      // Try to get questions from professional level first
      const proQuestions = this.getCategoryQuestions('professional', category, targetCount);
      
      // If we need more questions, get from sub-professional
      if (proQuestions.length < targetCount) {
        const remainingNeeded = targetCount - proQuestions.length;
        const subQuestions = this.getCategoryQuestions('subprofessional', category, remainingNeeded);
        allQuestions.push(...proQuestions, ...subQuestions);
      } else {
        allQuestions.push(...proQuestions);
      }
      
      console.log(`${category}: ${proQuestions.length} questions selected (target: ${targetCount})`);
    }

    // Shuffle all questions together for the final exam
    const shuffledQuestions = this.shuffleArray(allQuestions);
    
    console.log('\n=== PRACTICE EXAM GENERATION SUMMARY ===');
    console.log(`Total questions generated: ${shuffledQuestions.length}`);
    console.log(`Expected total: ${categories.length * 10} questions`);
    console.log(`Session ID: ${this.currentSessionId}, Used questions: ${this.sessionUsedQuestions.size}`);
    
    // Log category distribution
    const categoryDistribution = {};
    shuffledQuestions.forEach(q => {
      const cat = q.category || 'Unknown';
      categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
    });
    console.log('Category distribution:', categoryDistribution);
    console.log('========================================\n');
    
    return shuffledQuestions;
  }

  async generateExam(examType) {
    if (examType === 'practice') {
      return this.generatePracticeExam();
    }
    this.currentSessionId = Date.now();
    this.clearSessionQuestions(); // Reset tracking for this new exam session
    
    const categories = this.getExamCategories(examType);
    const allQuestions = [];

    // Define the overall total limit based on exam type
    const overallLimit = examType === 'professional' ? 170 : 165;
    let runningTotal = 0;

    console.log(`Generating ${examType} exam (Session: ${this.currentSessionId}, Overall Limit: ${overallLimit})`);

    for (const category of categories) {
        // 1. Calculate the base target for the current category (e.g., 25 or 10)
        const categoryBaseTarget = this.getQuestionsPerCategory(examType, category); 
        
        // 2. Calculate remaining slots needed to hit the overall limit
        const remainingSlots = overallLimit - runningTotal;
        
        // 3. The actual draw count is the minimum of the category's base target and the remaining slots
        const targetCount = Math.min(categoryBaseTarget, remainingSlots);

        // Break if no more questions should be drawn
        if (targetCount <= 0) break;
        
        // 4. Draw questions, limited by targetCount and available pool size
        const categoryQuestions = this.getCategoryQuestions(examType, category, targetCount); 
        
        runningTotal += categoryQuestions.length;
        allQuestions.push(...categoryQuestions);
        
        console.log(`${category}: ${categoryQuestions.length} questions selected (target cap: ${targetCount}, accumulated: ${runningTotal})`);
        
        // 5. Exit loop immediately if limit is hit
        if (runningTotal >= overallLimit) break; 
    }

    // Shuffle all questions together for the final exam
    const shuffledQuestions = this.shuffleArray(allQuestions);
    console.log(`Total questions generated: ${shuffledQuestions.length} (Capped at: ${overallLimit})`);
    
    // Calculate expected total
    const expectedTotal = overallLimit;
    
    console.log(`Expected total questions: ${expectedTotal}`);
    console.log(`Session ID: ${this.currentSessionId}, Used questions: ${this.sessionUsedQuestions.size}`);
    
    return shuffledQuestions;
  }

  getAdaptedTimeLimit(examType, questionCount) {
    // Calculate based on actual question count
    let baseTime, baseQuestions;
    
    if (examType === 'professional') {
      baseTime = 3 * 3600 + 10 * 60; // 3.5 hours
      baseQuestions = 170;
    } else if (examType === 'subprofessional') {
      baseTime = 2 * 3600 + 40 * 60; // 2.5 hours
      baseQuestions = 165;
    } else { // practice
      baseTime = 30 * 60; // 30 minutes for practice
      baseQuestions = 20; // Original practice test size
    }
    
    const timePerQuestion = baseTime / baseQuestions;
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
        
        if (progress.sessionId) {
          this.currentSessionId = progress.sessionId;
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
        stats[category] = { total: 0 };
        return;
      }
      
      stats[category] = {
        total: questionArray.length,
      };
    });
    
    return stats;
  }
}

// Create and export singleton instance
export const examService = new ExamService();