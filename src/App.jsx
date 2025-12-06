import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Exam from './pages/Exam';
import Results from './pages/Results';
import ErrorBoundary from './components/ErrorBoundary';
import DisclaimerModal from './components/DisclaimerModal';
import Tutorial from './pages/Tutorial';
import './index.css';
import 'katex/dist/katex.min.css';

function App() {

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50">
          <DisclaimerModal />
          <Header />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exam/:type" element={<Exam />} />
            <Route path="/results" element={<Results />} />
            <Route path="/tutorial" element={<Tutorial />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;