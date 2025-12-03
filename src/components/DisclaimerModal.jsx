import { AlertTriangle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check if user has already accepted the disclaimer
    const hasAccepted = localStorage.getItem('disclaimerAccepted');
    if (!hasAccepted) {
      setIsOpen(true);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleAccept = () => {
    if (dontShowAgain) {
      localStorage.setItem('disclaimerAccepted', 'true');
    }
    setIsOpen(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Important Disclaimer</h2>
                <p className="text-gray-600 mt-1">Please read carefully before proceeding</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Main Warning */}
            <div className="p-5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-300">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-yellow-800 mb-2">
                    Unofficial Mock Exam / Reviewer Tool
                  </h3>
                  <p className="text-yellow-700">
                    <strong>Always refer to the official Civil Service Commission website</strong> for the most accurate and up-to-date information regarding the Civil Service Examination.
                  </p>
                </div>
              </div>
            </div>

            {/* Sources Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Question Sources</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <span className="font-bold text-blue-700">🤖</span>
                    </div>
                    <h4 className="font-bold text-gray-800">AI-Generated Questions</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Some questions are generated via AI models including Gemini, DeepSeek, and ChatGPT. These may require additional verification.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <span className="font-bold text-purple-700">👥</span>
                    </div>
                    <h4 className="font-bold text-gray-800">Community & Social Media</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Questions collected from social media groups, online forums, and user submissions from various sources.
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <span className="font-bold text-green-700">📚</span>
                    </div>
                    <h4 className="font-bold text-gray-800">Review Center Materials</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Based on old review materials from various review centers and practice books.
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <span className="font-bold text-red-700">⚖️</span>
                    </div>
                    <h4 className="font-bold text-gray-800">Legal References</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Questions based on RA 6713, Philippine Constitution, and other relevant laws and regulations.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border border-red-300">
                <h4 className="font-bold text-red-800 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Important Notice
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span className="text-red-700"><strong>This tool is for practice only</strong> - Not affiliated with the Civil Service Commission</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span className="text-red-700"><strong>Accuracy not guaranteed</strong> - Questions may contain errors or outdated information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span className="text-red-700"><strong>Always verify</strong> - Cross-check with official CSC announcements and materials</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-300">
                <h4 className="font-bold text-blue-800 mb-3">Report Inconsistencies</h4>
                <p className="text-blue-700">
                  If you notice any inconsistencies, errors, or outdated information in the questions, please submit a report. Your feedback helps improve the quality of this tool.
                </p>
              </div>
            </div>

            {/* Checkbox */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1"
                />
                <div>
                  <span className="text-gray-800 font-medium">
                    Don't show this message again
                  </span>
                  <p className="text-gray-600 text-sm mt-1">
                    You can always view this disclaimer from the settings or footer
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.open('https://csc.gov.ph', '_blank', 'noopener,noreferrer')}
              className="flex-1 py-4 bg-white border-2 border-blue-600 text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>🌐</span>
              <span>Visit Official CSC Website</span>
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <span>✅</span>
              <span>I Understand & Accept</span>
            </button>
          </div>
          
          <p className="text-center text-gray-500 text-sm mt-4">
            By clicking "I Understand & Accept", you acknowledge that you have read and understood this disclaimer.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DisclaimerModal;