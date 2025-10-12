import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithGoogle } from '../../../store/authThunks';
//eslint-disable-next-line no-unused-vars
import { motion, useInView, useAnimation } from 'framer-motion';
import { Zap, Users, PenTool, Search, Shield, Sparkles, ArrowRight, Play, Star, Code, Heart, MessageSquare, Brain, UserPlus } from 'lucide-react';

const Auth = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleGoogleLogin = () => {
    dispatch(loginWithGoogle());
  };

  // Animation hook for scroll-triggered animations
  const AnimatedSection = ({ children, delay = 0, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const controls = useAnimation();

    useEffect(() => {
      if (isInView) {
        controls.start("visible");
      }
    }, [isInView, controls]);

    return (
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.4, delay, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  // Floating animation for decorative elements
  const FloatingElement = ({ children, duration = 6, className = "" }) => (
    <motion.div
      animate={{
        y: [-10, 10, -10],
        rotate: [-3, 3, -3],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );

  const features = [
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Rich Text Editor",
      description: "Create stunning posts with our advanced TinyMCE editor. Format text, add images, embed media, and style your content with professional-grade tools."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Write with AI",
      description: "Leverage AI-powered writing assistance to overcome writer's block, generate ideas, and enhance your content with intelligent suggestions."
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Interactive Comments",
      description: "Engage with your audience through real-time comments. Build conversations, share feedback, and create meaningful discussions on every post."
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart Search & Discovery",
      description: "Find content and users easily with our intelligent search system. Discover trending posts, explore topics, and connect with like-minded creators."
    },
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "User Profiles & Networking",
      description: "Build your personal brand with custom profiles. Follow other creators, showcase your work, and build your network in the knowledge community."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Google Auth",
      description: "Sign in safely with Google OAuth2 authentication. Your data is secure, private, and protected with industry-standard security measures."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 dark:from-slate-900 dark:via-blue-900/50 dark:to-purple-900/50 relative overflow-hidden pt-6 pb-10">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-500/30 dark:bg-purple-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-500/30 dark:bg-blue-400/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/20 dark:bg-indigo-400/15 blur-3xl"></div>
      </div>

      {/* Floating decorative icons */}
      <FloatingElement duration={8} className="absolute top-20 left-10 text-purple-500/40 dark:text-purple-400/40">
        <Code className="w-12 h-12" />
      </FloatingElement>
      <FloatingElement duration={10} className="absolute top-40 right-20 text-blue-500/40 dark:text-blue-400/40">
        <Star className="w-8 h-8" />
      </FloatingElement>
      <FloatingElement duration={7} className="absolute bottom-32 left-20 text-indigo-500/40 dark:text-indigo-400/40">
        <Heart className="w-10 h-10" />
      </FloatingElement>
      <FloatingElement duration={9} className="absolute bottom-20 right-10 text-purple-500/40 dark:text-purple-400/40">
        <Sparkles className="w-14 h-14" />
      </FloatingElement>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight"
            >
              KnowSpace
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Your intelligent platform for knowledge sharing, creative writing, and meaningful connections
            </motion.p>
          </motion.div>

          {/* Login Card with enhanced animations */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="max-w-md mx-auto mb-16"
          >
            <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-300/50 dark:border-purple-500/30 p-8 relative overflow-hidden">
              {/* Simple animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 to-purple-500/8 dark:from-blue-400/15 dark:to-purple-400/15" />
              
              <div className="relative z-10 text-center">
                <motion.h2 
                  className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Welcome to KnowSpace
                </motion.h2>
                <motion.p 
                  className="text-gray-600 dark:text-gray-100 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Sign in with Google to start your journey
                </motion.p>
                
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  {loading ? (
                    <motion.div 
                      className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="relative z-10">Continue with Google</span>
                    </>
                  )}
                </motion.button>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="mt-4 p-3 bg-red-100/80 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm backdrop-blur-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <AnimatedSection delay={0.6} className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
            Why Choose KnowSpace?
          </h2>
          <motion.p 
            className="text-xl text-center text-gray-700 dark:text-gray-200 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Experience the future of knowledge sharing with cutting-edge features designed for creators
          </motion.p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={0.8 + index * 0.1}>
                <motion.div
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02
                  }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/70 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-purple-300/50 dark:border-purple-500/30 h-full relative overflow-hidden group"
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 to-purple-500/8 dark:from-blue-400/15 dark:to-purple-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="text-purple-600 dark:text-purple-400 mb-4"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-100 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

        {/* Call to Action */}
        <AnimatedSection delay={1.2} className="text-center">
          <motion.div 
            className="bg-gradient-to-r from-purple-700 to-blue-700 dark:from-purple-800/80 dark:to-blue-800/80 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Simple animated background */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-white/10 to-transparent" />
            
            <div className="relative z-10">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                Ready to Start Your Journey?
              </motion.h2>
              <motion.p 
                className="text-xl mb-8 opacity-90"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                Join thousands of creators, writers, and thinkers on KnowSpace
              </motion.p>
              
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)" 
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                disabled={loading}
                className="bg-white text-purple-700 dark:text-purple-800 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 mx-auto relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <span className="relative z-10">Get Started Now</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="relative z-10"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Auth;
