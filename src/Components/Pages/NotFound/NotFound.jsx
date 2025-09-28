import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/button';
import { Home, Search, ArrowLeft, Sparkles, Compass } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-neutral-900 dark:via-purple-950/30 dark:to-pink-950/20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main 404 Display */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
            404
          </div>

          {/* Floating particles animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="floating-particle absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
            <div className="floating-particle absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full opacity-50"></div>
            <div className="floating-particle absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-400 rounded-full opacity-70"></div>
            <div className="floating-particle absolute bottom-1/3 right-1/3 w-2.5 h-2.5 bg-indigo-400 rounded-full opacity-55"></div>
          </div>
        </div>

        {/* Content Card */}
        <div className="glass-effect rounded-3xl p-8 md:p-12 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Compass className="w-12 h-12 text-purple-600 dark:text-purple-400 mr-3" />
            <Sparkles className="w-8 h-8 text-pink-600 dark:text-pink-400 animate-pulse" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Oops! Page Not Found
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Looks like you've ventured into uncharted territory. The page you're looking for
            seems to have wandered off into the digital wilderness. Don't worry though -
            let's get you back on track!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>

            <Button
              onClick={() => navigate('/search')}
              variant="outline"
              className="w-full sm:w-auto px-8 py-3 border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Users
            </Button>

            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="w-full sm:w-auto px-8 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="max-w-md mx-auto">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>💡 <strong>Quick Tips:</strong></p>
            <ul className="text-left space-y-1">
              <li>• Check the URL for typos</li>
              <li>• Try searching for what you're looking for</li>
              <li>• Browse our latest posts from the home page</li>
            </ul>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default NotFound;