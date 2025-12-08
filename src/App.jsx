import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Exam from './pages/Exam';
import Results from './pages/Results';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import ErrorBoundary from './components/ErrorBoundary';
import DisclaimerModal from './components/DisclaimerModal';
import Footer from './components/Footer'; 
import Tutorial from './pages/Tutorial';
import './index.css';
import 'katex/dist/katex.min.css';

function App() {

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-950">
          <DisclaimerModal />
          <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/exam/:type" element={<Exam />} />
              <Route path="/results" element={<Results />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfUse />} />
            </Routes>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;