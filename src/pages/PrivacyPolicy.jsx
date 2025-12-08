import React from 'react'
import { Link } from 'react-router-dom'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-950">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Privacy Policy - Mock Reviewer PH</h1>
          <p className="text-gray-500 dark:text-gray-200 mb-8"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-200">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">1. Data Collection Policy</h2>
              <p>Mock Reviewer PH is designed with your privacy as a top priority. We operate on a strict no-tracking, no-collection principle:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>We do not collect personal information (name, email, address, phone number)</li>
                <li>We do not use cookies for tracking or analytics</li>
                <li>We do not require registration, login, or account creation</li>
                <li>We do not collect exam results or performance data on our servers</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">2. Local Data Storage</h2>
              <p>All your study data is stored exclusively on your device:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Mock exam results and scores</li>
                <li>Progress tracking and study history</li>
                <li>Question preferences and settings</li>
              </ul>
              <p className="mt-3">This data is stored using your browser's localStorage or IndexedDB. It remains on your device and is never transmitted to external servers.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">3. Third-Party Services</h2>
              <p>Mock Reviewer PH does not integrate with third-party analytics, advertising, or tracking services. We are a standalone educational tool with no external dependencies that could compromise your privacy.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">4. Changes to Privacy Policy</h2>
              <p>We may update this Privacy Policy to reflect changes in our practices. We will notify users of any material changes by updating the "Last Updated" date at the top of this policy. Continued use of Mock Reviewer PH constitutes acceptance of the updated policy.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">7. Contact Information</h2>
              <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
              <p className="mt-2 p-4 bg-blue-50 dark:bg-gray-900 rounded-lg">
                <strong>Email:</strong> carlodandan.personal@proton.me<br />
                <strong>Subject:</strong> Privacy Policy Inquiry - Mock Reviewer PH
              </p>
              <p className="mt-3">We are committed to responding to privacy-related inquiries promptly and transparently.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">8. Your Privacy Rights</h2>
              <p>As a user of Mock Reviewer PH, you have the right to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Delete all your data by clearing browser storage</li>
                <li>Use our service anonymously</li>
                <li>Understand exactly what data is being stored</li>
              </ul>
            </section>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 bg-blue-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Data Protection Commitment</h3>
            <p className="text-gray-700 dark:text-gray-200">
              Mock Reviewer PH is built on the principle that your study data belongs to you. 
              We believe that Civil Service Exam preparation should be private, secure, and free from tracking. 
              This commitment to privacy is fundamental to our mission of providing accessible, trustworthy exam preparation tools.
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

export default PrivacyPolicy