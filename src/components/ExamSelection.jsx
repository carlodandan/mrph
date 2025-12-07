import { Link } from 'react-router-dom';
import { ClipboardCheck, Users, Clock, TrendingUp } from 'lucide-react';

function ExamSelection() {
  const exams = [
    {
      id: 'professional',
      title: 'Professional Level',
      description: 'For college graduates. 170 items, 3.5 hours duration.',
      items: 170,
      duration: '3.5 hours',
      difficulty: 'Advanced',
      icon: <ClipboardCheck className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-gray-900 dark:bg-gray-950'
    },
    {
      id: 'subprofessional',
      title: 'Sub-Professional Level',
      description: 'For non-college graduates. 165 items, 2.5 hours duration.',
      items: 165,
      duration: '2.5 hours',
      difficulty: 'Intermediate',
      icon: <Users className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-gray-900 dark:bg-gray-950'
    },
    {
      id: 'practice',
      title: 'Quick Practice',
      description: '60-item practice test with questions from both Professional and Sub-Professional levels.',
      items: 60,
      duration: '30 mins',
      difficulty: 'All Levels',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-gray-950'
    }
  ];

  return (
    <div className="py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-80 dark:text-white mb-3">Choose Your Exam Type</h2>
        <p className="text-gray-600 dark:text-amber-100 max-w-2xl mx-auto">
          Select the Civil Service Exam level that matches your qualifications and goals
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {exams.map((exam) => (
          <Link
            key={exam.id}
            to={`/exam/${exam.id}`}
            className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${exam.bgColor}`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-linear-to-br ${exam.color} text-white`}>
                  {exam.icon}
                </div>
                <span className="px-3 py-1 bg-white dark:bg-black rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm">
                  {exam.difficulty}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-80 dark:text-white mb-2">{exam.title}</h3>
              <p className="text-gray-600 dark:text-amber-100 mb-6">{exam.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-200">
                <div className="flex items-center space-x-2">
                  <ClipboardCheck className="w-4 h-4 text-gray-400" />
                  <span>{exam.items} items</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{exam.duration}</span>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full py-3 bg-white dark:bg-black text-gray-80 dark:text-white font-semibold rounded-xl border-2 border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-50 transition-all">
                  Start Exam
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-black rounded-full shadow-md">
          <div className="w-2 h-2 bg-green-50 dark:bg-gray-9000 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 dark:text-amber-100">Some questions here are generated via AI (Gemini, Deepseek and ChatGPT), some are from social media groups and old reviewer from a review center. If you see inconsistency, please submit a report.</span>
        </div>
      </div>
    </div>
  );
}

export default ExamSelection;