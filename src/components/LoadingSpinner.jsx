import { Loader2 } from 'lucide-react';

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500 animate-pulse" />
        </div>
        <p className="mt-4 text-lg text-gray-600 dark:text-amber-100 font-medium">{message}</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-100">Mock Review PH</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;