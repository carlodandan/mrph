// Tutorial.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, ArrowLeft, FileText, Users, TrendingUp, CheckCircle } from 'lucide-react';
import ArtPlayer from '../components/ArtPlayer';

function Tutorial() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const playerRef = useRef(null);

  const videoList = [
    {
      id: 'professional',
      title: 'Professional Level Exam - Snippet',
      description: 'Get a quick look at how the Mock Reviewer PH CSC Professional Level mock exam works—featuring its interface, categories, and key functionalities. This snippet highlights how the system helps you practice across all 8 major subjects, including Numerical Ability, Analytical Ability, Verbal Ability, and more.',
      duration: '03:39',
      thumbnail: '/tutorials/pro-thumbnail.png',
      date: '2025-12-04',
      url: '/tutorials/pro.mp4',
      icon: <FileText className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      examLink: '/exam/professional',
      features: [
        '170 questions in 3.5 hours',
        'College graduate level',
        '8 major categories',
        'Detailed answer explanations'
      ]
    },
    {
      id: 'subprofessional',
      title: 'Sub-Professional Level Exam - Snippet',
      description: 'Get a quick look at how the Mock Reviewer PH CSC Sub-Professional Level mock exam works—featuring its interface, categories, and key functionalities. This snippet highlights how the system helps you practice across all 8 major subjects, including Numerical Ability, Clerical Ability, Verbal Ability, and more.',
      duration: '01:12',
      thumbnail: '/tutorials/subpro-thumbnail.png',
      date: '2025-12-04',
      url: '/tutorials/subpro.mp4',
      icon: <Users className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      examLink: '/exam/subprofessional',
      features: [
        '165 questions in 2.5 hours',
        'Non-college graduate level',
        '8 major categories',
        'Time management strategies'
      ]
    },
    {
      id: 'practice',
      title: 'Quick Practice Test - Strategy',
      description: 'Learn how to effectively use the 20-question practice test. Master test-taking strategies, question analysis, and time management in this quick tutorial.',
      duration: '01:45',
      thumbnail: '/tutorials/practice-thumbnail.png',
      date: '2025-12-04',
      url: '/tutorials/practice.mp4',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      examLink: '/',
      features: [
        '20 questions in 30 minutes',
        'Mixed difficulty levels',
        'Instant feedback',
        'Performance tracking'
      ]
    }
  ];

  // Set first video as default selected
  useEffect(() => {
    if (videoList.length > 0 && !selectedVideo) {
      setSelectedVideo(videoList[0]);
    }
  }, []);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    // Scroll to player on mobile
    if (window.innerWidth < 768) {
      document.getElementById('video-player').scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center md:text-left">
            CSC Exam <span className="text-blue-600">Video Tutorials</span>
          </h1>
        </div>

        <p className="text-gray-600 text-center md:text-left mb-4">
          Watch detailed guides for each exam type to maximize your preparation
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Video Player */}
        <div className="lg:w-2/3">
          <div id="video-player" className="mb-8">
            {selectedVideo ? (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 bg-linear-to-r from-gray-800 to-gray-900">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-linear-to-br ${selectedVideo.color}`}>
                      <div className="text-white">
                        {selectedVideo.icon}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedVideo.title}</h2>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-300">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {selectedVideo.duration}
                        </span>
                        <span>{selectedVideo.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="aspect-video">
                  <ArtPlayer
                    option={{
                      url: selectedVideo.url,
                      poster: selectedVideo.thumbnail,
                      title: selectedVideo.title,
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '0'
                    }}
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Video Description</h3>
                  <p className="text-gray-700 mb-6">{selectedVideo.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                        Key Features
                      </h4>
                      <ul className="space-y-2">
                        {selectedVideo.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Ready to Practice?</h4>
                      <p className="text-gray-600 mb-4">
                        After watching this tutorial, apply what you've learned with our interactive exam.
                      </p>
                      <Link
                        to={selectedVideo.examLink}
                        className="inline-block px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                      >
                        Start {selectedVideo.id === 'practice' ? 'Practice Test' : `${selectedVideo.id.charAt(0).toUpperCase() + selectedVideo.id.slice(1)} Exam`}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl aspect-video flex items-center justify-center">
                <div className="text-center p-8">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Select a Tutorial to Begin</h3>
                  <p className="text-gray-600 max-w-md">
                    Choose from our comprehensive exam guides to start your preparation journey.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Video Selection */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Exam Tutorials</h3>
            <p className="text-gray-600 mb-6">
              Select a tutorial below to learn about each exam type and get preparation tips.
            </p>
            
            <div className="space-y-4">
              {videoList.map(video => (
                <div
                  key={video.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${selectedVideo?.id === video.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-linear-to-br ${video.color}`}>
                      <div className="text-white">
                        {video.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1">{video.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="mr-4">{video.duration}</span>
                        <span>{video.date}</span>
                      </div>
                      
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                          {video.id === 'professional' ? 'Professional Level' : 
                           video.id === 'subprofessional' ? 'Sub-Professional Level' : 'Practice Test'}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`w-3 h-3 rounded-full ${selectedVideo?.id === video.id ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">Exam Overview</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Tutorials</span>
                  <span className="font-semibold text-gray-800">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Duration</span>
                  <span className="font-semibold text-gray-800">4mins. and 36secs.</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-semibold text-gray-800">December 2025</span>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8">
              <Link
                to="/"
                className="block w-full text-center px-4 py-3 bg-linear-to-r from-blue-50 to-purple-50 text-blue-700 rounded-xl font-semibold border-2 border-blue-200 hover:border-blue-300 hover:bg-linear-to-r hover:from-blue-100 hover:to-purple-100 transition-all"
              >
                ← Return to Home Page
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-12">
        <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Need More Help?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Exam Guidelines</h4>
              <p className="text-gray-600 text-sm">
                Review official exam rules, time limits, and question formats.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Community Support</h4>
              <p className="text-gray-600 text-sm">
                Join our community for tips, discussions, and peer support.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Progress Tracking</h4>
              <p className="text-gray-600 text-sm">
                Monitor your improvement with detailed analytics and reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;