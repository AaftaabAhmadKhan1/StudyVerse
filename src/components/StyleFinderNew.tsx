'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, Loader2, Sparkles, CloudRain, Sun, Cloud, Globe, Brain, Wand2, CheckCircle2, Star, Zap } from 'lucide-react';

interface WeatherData {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

interface StyleRecommendation {
  category: string;
  items: string[];
  culturalContext: string;
  weatherReason: string;
}

interface DesignImage {
  id: number;
  url: string;
  prompt: string;
  category: string;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  name: string;
  country: string;
}

const aiStages = [
  { icon: Globe, text: 'Analyzing your location...', color: 'from-blue-500 to-cyan-500' },
  { icon: CloudRain, text: 'Fetching real-time weather data...', color: 'from-cyan-500 to-teal-500' },
  { icon: Brain, text: 'AI processing cultural patterns...', color: 'from-purple-500 to-pink-500' },
  { icon: Wand2, text: 'Generating personalized designs...', color: 'from-pink-500 to-rose-500' },
  { icon: Sparkles, text: 'Finalizing recommendations...', color: 'from-amber-500 to-yellow-500' },
];

export default function StyleFinderNew() {
  const [mounted, setMounted] = useState(false);
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiStage, setAiStage] = useState(0);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([]);
  const [designs, setDesigns] = useState<DesignImage[]>([]);
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: number]: boolean }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const [retryCount, setRetryCount] = useState<{ [key: number]: number }>({});
  const [error, setError] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch location suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (location.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=5&addressdetails=1`
        );
        const data = await response.json();
        
        const formattedSuggestions = data.map((item: any) => ({
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          name: item.name,
          country: item.address?.country || 'Unknown',
        }));
        
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [location]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // AI stage progression
  useEffect(() => {
    if (loading && aiStage < aiStages.length - 1) {
      const timer = setTimeout(() => {
        setAiStage(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, aiStage]);

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.display_name);
    setSelectedLocation(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError('');
    setAiStage(0);
    setDesigns([]);
    setRecommendations([]);
    setWeather(null);
    
    const animationStartTime = Date.now();
    const minimumAnimationDuration = 10000;
    
    try {
      let locationData = selectedLocation;
      
      if (!locationData) {
        const geocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
        );
        const geocodeData = await geocodeResponse.json();
        
        if (geocodeData.length === 0) {
          throw new Error('Location not found. Please select from suggestions.');
        }
        
        locationData = {
          display_name: geocodeData[0].display_name,
          lat: geocodeData[0].lat,
          lon: geocodeData[0].lon,
          country: geocodeData[0].address?.country || location,
          name: geocodeData[0].display_name // fallback, as 'name' is required
        };
      }
      
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: locationData.display_name,
          lat: parseFloat(locationData.lat),
          lon: parseFloat(locationData.lon),
          country: locationData.country,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get recommendations');
      }

      const data = await response.json();
      
      const elapsedTime = Date.now() - animationStartTime;
      const remainingTime = Math.max(0, minimumAnimationDuration - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setDesigns(data.designs || []);
      setWeather(data.weather);
      setRecommendations(data.recommendations);
      
      const loadingStates: { [key: number]: boolean } = {};
      (data.designs || []).forEach((design: DesignImage) => {
        loadingStates[design.id] = true;
      });
      setImageLoadingStates(loadingStates);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setAiStage(0);
    }
  };

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (desc.includes('cloud')) return <Cloud className="w-8 h-8 text-gray-400" />;
    return <Sun className="w-8 h-8 text-yellow-400" />;
  };

  const handleImageLoad = (id: number) => {
    setImageLoadingStates(prev => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id: number) => {
    const currentRetry = retryCount[id] || 0;
    if (currentRetry < 3) {
      setRetryCount(prev => ({ ...prev, [id]: currentRetry + 1 }));
      setTimeout(() => {
        setImageErrors(prev => ({ ...prev, [id]: false }));
      }, 1000);
    } else {
      setImageLoadingStates(prev => ({ ...prev, [id]: false }));
      setImageErrors(prev => ({ ...prev, [id]: true }));
    }
  };

  return (
    <section ref={sectionRef} id="style-finder" className="relative py-24 bg-gradient-to-b from-slate-900 via-purple-950/30 to-slate-950 overflow-hidden">
      {/* Animated Background */}
      <motion.div
        style={{ y }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-600/20 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-150, 150]) }}
        className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-pink-600/20 to-transparent rounded-full blur-3xl"
      />

      {/* Floating Elements */}
      {mounted && [...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          <Sparkles className="w-4 h-4 text-purple-400/40" />
        </motion.div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          style={{ opacity, scale }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white font-semibold text-sm mb-6">
              <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
              AI-Powered Discovery
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Find Your Perfect{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Style
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Enter your location and let our advanced AI discover culturally authentic clothing designs tailored to your climate
          </motion.p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setSelectedLocation(null);
                  }}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Search any city or country in the world..."
                  className="w-full pl-16 pr-6 py-6 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-lg text-white placeholder-gray-400"
                  required
                />
                
                {/* Autocomplete Suggestions */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      ref={suggestionsRef}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-full mt-3 w-full bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50"
                    >
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="w-full px-6 py-4 text-left hover:bg-white/10 transition-all border-b border-white/5 last:border-0 flex items-start gap-4 group"
                        >
                          <MapPin className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                              {suggestion.name}
                            </div>
                            <div className="text-sm text-gray-400 truncate">{suggestion.display_name}</div>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                className="px-10 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 whitespace-nowrap"
                style={{ backgroundSize: '200% 100%' }}
                animate={!loading ? {
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Discovering...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    <span>Discover Style</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-center backdrop-blur-xl"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* AI Loading Animation */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl mx-auto mb-16"
            >
              <div className="relative bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-2xl rounded-3xl p-12 border border-white/10 overflow-hidden">
                {/* Animated Background Glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: '200% 100%' }}
                />

                <div className="relative z-10">
                  {/* Current Stage */}
                  <div className="text-center mb-12">
                    <motion.div
                      key={aiStage}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", duration: 0.8 }}
                      className="inline-block mb-6"
                    >
                      <div className={`w-24 h-24 bg-gradient-to-br ${aiStages[aiStage].color} rounded-3xl flex items-center justify-center shadow-2xl`}>
                        {React.createElement(aiStages[aiStage].icon, { className: "w-12 h-12 text-white" })}
                      </div>
                    </motion.div>
                    
                    <motion.p
                      key={`text-${aiStage}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold text-white"
                    >
                      {aiStages[aiStage].text}
                    </motion.p>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex justify-center gap-3">
                    {aiStages.map((stage, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ 
                          scale: 1,
                          backgroundColor: index <= aiStage ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.1)'
                        }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                      >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${
                          index <= aiStage ? 'border-purple-400' : 'border-white/20'
                        } transition-all`}>
                          {React.createElement(stage.icon, { 
                            className: `w-7 h-7 ${index <= aiStage ? 'text-white' : 'text-gray-500'}` 
                          })}
                        </div>
                        {index === aiStage && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl bg-purple-500/30"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-8 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: '0%' }}
                      animate={{ width: `${((aiStage + 1) / aiStages.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weather Card */}
        <AnimatePresence>
          {weather && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto mb-16"
            >
              <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center"
                    >
                      {getWeatherIcon(weather.description)}
                    </motion.div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">Current Weather</h3>
                      <p className="text-gray-300 text-lg capitalize">{weather.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="bg-white/5 rounded-2xl p-4">
                      <div className="text-3xl font-bold text-white mb-1">{Math.round(weather.temp)}°C</div>
                      <div className="text-sm text-gray-400">Temperature</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4">
                      <div className="text-3xl font-bold text-white mb-1">{weather.humidity}%</div>
                      <div className="text-sm text-gray-400">Humidity</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4">
                      <div className="text-3xl font-bold text-white mb-1">{Math.round(weather.windSpeed)}</div>
                      <div className="text-sm text-gray-400">Wind km/h</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendations */}
        <AnimatePresence>
          {recommendations.length > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-white text-center mb-12"
              >
                Your Personalized Recommendations
              </motion.h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                          {rec.category}
                        </h4>
                        <p className="text-gray-400 text-sm">{rec.culturalContext}</p>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {rec.items.map((item, itemIndex) => (
                        <motion.li
                          key={itemIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                          className="flex items-center gap-3 text-gray-300"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <div className="pt-6 border-t border-white/10">
                      <p className="text-sm text-gray-400 flex items-start gap-2">
                        <CloudRain className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                        <span>{rec.weatherReason}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Design Gallery */}
        <AnimatePresence>
          {designs.length > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <h3 className="text-4xl font-bold text-white mb-4">
                  Your Curated{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Design Collection
                  </span>
                </h3>
                <p className="text-xl text-gray-300">AI-generated fashion designs tailored to your location and climate</p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {designs.map((design, index) => (
                  <motion.div
                    key={design.id}
                    initial={{ opacity: 0, scale: 0.8, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -15, scale: 1.05 }}
                    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      {imageLoadingStates[design.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm">
                          <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
                        </div>
                      )}
                      
                      {!imageErrors[design.id] ? (
                        <img
                          src={`${design.url}?sig=${design.id}&t=${Date.now()}`}
                          alt={design.prompt}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          onLoad={() => handleImageLoad(design.id)}
                          onError={() => handleImageError(design.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-pink-900/40">
                          <div className="text-center p-6">
                            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                            <p className="text-gray-300">Design Preview</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-semibold text-white">{design.category}</span>
                          </div>
                          <p className="text-sm text-gray-200 line-clamp-2">{design.prompt}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium text-white">
                          {design.category}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
                        >
                          <Sparkles className="w-5 h-5 text-white" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Animated Border */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent)',
                      }}
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
