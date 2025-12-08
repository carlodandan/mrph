import { Link } from 'react-router-dom';
import { BookOpen, Trophy } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <header className="bg-white dark:bg-gray-950 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <BookOpen className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
            <div>
              <h1 className="text-sm md:text-sm font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mock Reviewer PH
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-100">Your Go-To Reviewer</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center space-x-1 py-2 rounded-lg hover:bg-blue-100 hover:dark:bg-gray-800 dark:bg-gray-950 transition-colors text-gray-700 dark:text-gray-200 hover:text-blue-600 md:text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/results" 
              className="flex items-center space-x-1 py-2 rounded-lg hhover:bg-blue-100 hover:dark:bg-gray-800 dark:bg-gray-950 transition-colors text-gray-700 dark:text-gray-200 hover:text-blue-600 md:text-sm"
            >
              <Trophy className="w-4 h-4" />
              <span>Results</span>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;