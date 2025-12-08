import React from 'react';
import { FaGithub } from "react-icons/fa6";
import { SiKofi } from "react-icons/si";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-2 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600 dark:text-gray-200">
          <p className="mb-4">
            This is an unofficial mock exam / reviewer tool. Always refer to the official 
            Civil Service Commission website for the most accurate information.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
            <a 
              href="https://github.com/carlodandan/mrph" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
            >
              <FaGithub className="w-4 h-4" />
              <span>View Source on GitHub</span>
            </a>
            
            <span className="hidden sm:block text-gray-400">• </span>
            
            <a 
              href="https://ko-fi.com/L4L23X7F6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-red-600 transition-colors"
            >
              <SiKofi className="w-4 h-4" />
              <span>Buy me a coffee</span>
            </a>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-100">
            © {currentYear} Mock Reviewer PH. All Rights Reserved. 
            <span className="font-medium ml-1 hover:text-blue-600 transition-colors"><a href="https://github.com/carlodandan" target="_blank" rel="noopener noreferrer"> Carlo Dandan</a></span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;