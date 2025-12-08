import React from 'react'
import { Link } from 'react-router-dom'

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-950">

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Terms of Use - Mock Reviewer PH</h1>
          <p className="text-gray-500 dark:text-gray-200 mb-8"><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-200">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">1. Nature of Service</h2>
              <p>Mock Reviewer PH is a free online platform that simulates Civil Service Examination (CSE) mock tests. Our questions are sourced from various materials including social media groups, old review materials, community contributions, and AI-generated content for educational purposes only.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">2. Educational Purpose Disclaimer</h2>
              <p>This platform is designed for practice and self-assessment only. The mock exams provided here are not affiliated with, endorsed by, or connected to the Civil Service Commission (CSC) or any government agency. Our content should not be considered as official study material for the actual Civil Service Examination.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">3. Content Accuracy & Verification</h2>
              <p>While we strive to provide accurate and reliable content, users are strongly advised to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Verify answers through official CSC review materials</li>
                <li>Cross-reference with authorized textbooks and publications</li>
                <li>Consult official CSC announcements and updates</li>
                <li>Understand that AI-generated content may contain inaccuracies</li>
              </ul>
              <p className="mt-3">The platform owners and developers are not responsible for any discrepancies between our mock tests and actual CSC examination questions.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">4. User Responsibility</h2>
              <p>By using this platform, you acknowledge that:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>This is a supplementary study tool and not a replacement for official review</li>
                <li>Your performance on mock tests does not guarantee actual exam results</li>
                <li>You should use multiple sources for comprehensive preparation</li>
                <li>All data (test results, progress) is stored locally and may be lost if browser data is cleared</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">5. Intellectual Property</h2>
              <p>Mock Reviewer PH grants users a non-commercial, personal license to use this platform for exam preparation purposes. All test content, while compiled from various sources, is presented in a unique format. Original contributions by the platform are protected under applicable copyright laws.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">6. Limitation of Liability</h2>
              <p>The platform is provided "as is" without warranties of any kind. The developers are not liable for:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Any inaccuracies in test questions or answers</li>
                <li>User performance on actual Civil Service Examinations</li>
                <li>Technical issues affecting test availability</li>
                <li>Data loss from browser or device issues</li>
                <li>Decisions made by the Civil Service Commission</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">7. Data Privacy</h2>
              <p>Mock Reviewer PH does not collect personal information. All test results and progress data are stored locally on your device. We do not use cookies for tracking purposes. For backup purposes, users can export their data using the provided export features.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">8. Community Contributions</h2>
              <p>Questions contributed by community members through social media groups are used with implied permission for educational sharing. If you are a content owner and wish to have specific material removed, please contact us.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">9. Updates and Changes</h2>
              <p>We reserve the right to update these terms and modify platform content without prior notice. Continued use of the platform constitutes acceptance of updated terms.</p>
            </section>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 bg-blue-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Important Note for Civil Service Exam Takers</h3>
            <p className="text-gray-700 dark:text-gray-200">
              This platform is created by independent developers to support Civil Service Exam preparation. 
              For official information, exam schedules, and authorized review materials, always refer to the 
              <a href="https://www.csc.gov.ph" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mx-1">
                official Civil Service Commission website
              </a>
              and announcements.
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              ← Back to Mock Reviewer PH
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TermsOfUse