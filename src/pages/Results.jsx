import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, RotateCcw, FileText } from 'lucide-react';
import ResultCard from '../components/ResultCard';
import LoadingSpinner from '../components/LoadingSpinner';

function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    // Load results from localStorage
    const savedResult = localStorage.getItem('lastExamResult');
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
    setIsLoading(false);
  }, []);

  const handleRetakeExam = () => {
    if (result) {
      navigate(`/exam/${result.examType}`);
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `civil-service-exam-results-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleDownloadPDF = async () => {
    if (!result) return;

    setIsGeneratingPDF(true);

    try {
        // Dynamic import for jsPDF
        const { jsPDF } = await import('jspdf');

        // Create PDF document
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // --- STYLING CONSTANTS ---
        const PRIMARY_COLOR = [59, 130, 246]; // Blue
        const LIGHT_BG_COLOR = [240, 245, 255]; // Very light blue
        const TEXT_COLOR = [30, 41, 59]; // Dark Slate
        const MUTED_COLOR = [100, 116, 139]; // Gray

        // Helper to reset text styles
        const resetText = () => {
            doc.setTextColor(...TEXT_COLOR);
            doc.setFont('helvetica', 'normal');
        };

        // --- HEADER SECTION ---
        doc.setFillColor(...PRIMARY_COLOR);
        doc.rect(0, 0, 210, 40, 'F'); // Blue header background

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text('Civil Service Mock Exam Results', 105, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Unofficial Result - Mock Reviewer PH (CSE)', 105, 30, { align: 'center' });

        // --- INFO GRID SECTION (2 Columns) ---
        let yPos = 60;
        
        // Left Column: Exam Details
        doc.setFontSize(14);
        doc.setTextColor(...PRIMARY_COLOR);
        doc.setFont('helvetica', 'bold');
        doc.text('Exam Details', 20, 55);

        doc.setFontSize(11);
        doc.setTextColor(...MUTED_COLOR);
        doc.setFont('helvetica', 'normal');
        
        // Helper to draw label-value pairs
        const drawRow = (label, value, x, y) => {
            doc.setFont('helvetica', 'bold');
            doc.text(label, x, y);
            doc.setFont('helvetica', 'normal');
            doc.text(value, x + 35, y);
        };

        resetText();
        drawRow('Exam Type:', result.examType === 'professional' ? 'Professional Level' : 'Sub-Professional Level', 20, yPos);
        drawRow('Date:', new Date(result.date).toLocaleDateString(), 20, yPos + 8);
        drawRow('Language:', result.language === 'english' ? 'English' : 'English/Filipino', 20, yPos + 16);

        // Right Column: Score Snapshot
        doc.setFontSize(14);
        doc.setTextColor(...PRIMARY_COLOR);
        doc.setFont('helvetica', 'bold');
        doc.text('Score Overview', 110, 55);

        resetText();
        // Calculate Percentage Color
        const percentageVal = Math.round((result.score / result.totalQuestions) * 100);
        const isPassing = percentageVal >= 80;
        
        // Draw a big score box
        doc.setFillColor(...LIGHT_BG_COLOR);
        doc.roundedRect(110, 58, 80, 25, 3, 3, 'F');
        
        doc.setFontSize(10);
        doc.setTextColor(...MUTED_COLOR);
        doc.text('FINAL SCORE', 115, 66);
        
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...(isPassing ? [22, 163, 74] : PRIMARY_COLOR)); // Green if passing, else Blue
        doc.text(`${result.score}/${result.totalQuestions}`, 115, 76);
        
        doc.setFontSize(14);
        doc.text(`${percentageVal}%`, 185, 76, { align: 'right' });

        // Stats below box
        yPos = 95;
        resetText();
        doc.setFontSize(10);
        drawRow('Time Taken:', result.timeTaken, 110, yPos - 6);
        drawRow('Answered:', `${result.answersCount || 0}/${result.totalQuestions}`, 110, yPos + 2);

        // Divider Line
        doc.setDrawColor(226, 232, 240);
        doc.line(20, 105, 190, 105);

        // --- CATEGORY PERFORMANCE SECTION ---
        yPos = 120;
        doc.setFontSize(14);
        doc.setTextColor(...PRIMARY_COLOR);
        doc.setFont('helvetica', 'bold');
        doc.text('Category Performance', 20, yPos);
        yPos += 10;

        doc.setFontSize(11);
        
        if (result.categoryScores) {
            Object.entries(result.categoryScores).forEach(([category, scores], index) => {
                if (yPos > 260) {
                    doc.addPage();
                    yPos = 20;
                }

                // Zebra striping for better readability
                if (index % 2 === 0) {
                    doc.setFillColor(...LIGHT_BG_COLOR);
                    doc.rect(20, yPos - 6, 170, 10, 'F');
                }

                // Category Name
                resetText();
                doc.text(category, 25, yPos);

                // Score Details (Right aligned logic)
                doc.setFont('helvetica', 'bold');
                const scoreText = `${scores.correct}/${scores.total}`;
                const percText = `(${scores.percentage}%)`;
                
                doc.text(scoreText, 160, yPos, { align: 'right' });
                
                doc.setTextColor(...PRIMARY_COLOR);
                doc.text(percText, 185, yPos, { align: 'right' });

                yPos += 10;
            });
        }

        // --- SUMMARY BOX ---
        yPos += 5;
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        }

        // Background Box for Summary
        doc.setFillColor(...LIGHT_BG_COLOR);
        doc.setDrawColor(...PRIMARY_COLOR);
        doc.roundedRect(20, yPos, 170, 35, 3, 3, 'FD'); // Fill and Draw border

        doc.setFontSize(12);
        doc.setTextColor(...PRIMARY_COLOR);
        doc.setFont('helvetica', 'bold');
        doc.text('Performance Verdict', 28, yPos + 10);

        doc.setFontSize(11);
        doc.setTextColor(...TEXT_COLOR);
        doc.setFont('helvetica', 'normal');

        let summaryText = '';
        if (percentageVal >= 80) {
            summaryText = "Excellent! You're well-prepared for the actual Civil Service Exam.";
        } else if (percentageVal >= 60) {
            summaryText = "Good effort! Review the areas where you struggled to improve your score.";
        } else {
            summaryText = "Needs improvement. Focus on studying key concepts and practice more.";
        }

        const splitText = doc.splitTextToSize(summaryText, 155);
        doc.text(splitText, 28, yPos + 20);

        // --- FOOTER ---
        const pageHeight = doc.internal.pageSize.height;
        doc.setDrawColor(200, 200, 200);
        doc.line(20, pageHeight - 20, 190, pageHeight - 20);
        
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, pageHeight - 12, { align: 'center' });

        // Save PDF
        const fileName = `csc-exam-results-${result.examType}-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    } finally {
        setIsGeneratingPDF(false);
    }
};

  if (isLoading) {
    return <LoadingSpinner message="Loading results..." />;
  }

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-4 text-center">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No Results Found</h2>
          <p className="text-gray-600 dark:text-gray-200 mb-6">
            You haven't taken any exams yet. Start your preparation now!
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Take an Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-200 hover:text-gray-300 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
          <button
            onClick={handleDownloadJSON}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-950 border border-gray-300 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 hover:dark:bg-gray-500 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON</span>
          </button>
          <button
            onClick={() => {
              const shareText = `I scored ${result.score}/${result.totalQuestions} (${Math.round((result.score / result.totalQuestions) * 100)}%) on the CSC ${result.examType === 'professional' ? 'Professional' : 'Sub-Professional'} Exam Practice!`;
              if (navigator.share) {
                navigator.share({
                  title: 'My CSC Exam Results',
                  text: shareText,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(shareText);
                alert('Results copied to clipboard!');
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-950 border border-gray-300 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 hover:dark:bg-gray-500 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={handleRetakeExam}
            className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Exam</span>
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="mb-8">
        <ResultCard result={result} />
      </div>

      {/* Study Recommendations */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Study Recommendations</h3>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-blue-50 dark:bg-gray-900 rounded-xl">
            <div className="text-blue-600 font-bold text-lg mb-2">Strengths</div>
            {result.categoryScores && Object.entries(result.categoryScores)
              .filter(([category, scores]) => scores.percentage >= 80)
              .map(([category, scores]) => (
                <div key={category} className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-200">{category}</span>
                  <span className="text-sm font-bold text-green-600">{scores.percentage}%</span>
                </div>
              ))}
            {!Object.entries(result.categoryScores || {}).some(([, scores]) => scores.percentage >= 80) && (
              <p className="text-sm text-gray-600 dark:text-gray-200">Keep practicing to identify your strengths!</p>
            )}
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-xl">
            <div className="text-yellow-600 font-bold text-lg mb-2">Areas to Improve</div>
            {result.categoryScores && Object.entries(result.categoryScores)
              .filter(([category, scores]) => scores.percentage < 60)
              .map(([category, scores]) => (
                <div key={category} className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-200">{category}</span>
                  <span className="text-sm font-bold text-red-600">{scores.percentage}%</span>
                </div>
              ))}
            {!Object.entries(result.categoryScores || {}).some(([, scores]) => scores.percentage < 60) && (
              <p className="text-sm text-gray-600 dark:text-gray-200">Great job! Focus on maintaining your performance.</p>
            )}
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-gray-900 rounded-xl">
            <div className="text-green-600 font-bold text-lg mb-2">Next Steps</div>
            <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
              <li>• Review explanations for incorrect answers</li>
              <li>• Focus on weaker categories</li>
              <li>• Practice time management</li>
              <li>• Take more practice tests</li>
            </ul>
          </div>
        </div>

        {/* Study Plan */}
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Recommended Study Plan</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-gray-900 rounded-xl">
              <div className="text-blue-600 font-bold text-lg mb-2">Week 1-2</div>
              <ul className="text-gray-700 dark:text-gray-200 space-y-1 text-sm">
                <li>• Review basic concepts</li>
                <li>• Focus on weaker areas</li>
                <li>• Daily practice questions</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="text-purple-600 font-bold text-lg mb-2">Week 3-4</div>
              <ul className="text-gray-700 dark:text-gray-200 space-y-1 text-sm">
                <li>• Practice timed tests</li>
                <li>• Review question patterns</li>
                <li>• Focus on accuracy</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 dark:bg-gray-900 rounded-xl">
              <div className="text-green-600 font-bold text-lg mb-2">Week 5-6</div>
              <ul className="text-gray-700 dark:text-gray-200 space-y-1 text-sm">
                <li>• Full-length mock exams</li>
                <li>• Review all explanations</li>
                <li>• Final preparation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleRetakeExam}
          className="px-8 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
        >
          Take Another Test
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-white dark:bg-gray-950 border-2 border-gray-300 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Back to Dashboard
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="px-8 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingPDF ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating PDF...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5 mr-2" />
              Download PDF Report
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Results;