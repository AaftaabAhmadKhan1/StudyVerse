'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, Sparkles, CloudRain, Sun, Cloud, Globe, Brain, Wand2, CheckCircle2 } from 'lucide-react';

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
  { icon: Globe, text: 'Analyzing your location...', color: 'text-blue-500' },
  { icon: CloudRain, text: 'Fetching real-time weather data...', color: 'text-cyan-500' },
  { icon: Brain, text: 'AI processing cultural patterns...', color: 'text-purple-500' },
  { icon: Wand2, text: 'Generating personalized designs...', color: 'text-pink-500' },
  { icon: Sparkles, text: 'Finalizing recommendations...', color: 'text-amber-500' },
];

export default function StyleFinder() {
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

  // Fetch location suggestions as user types
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

  // Animated AI stage progression (2 seconds per stage = 10 seconds total)
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
    
    // Start animation timer to ensure all stages complete (10 seconds minimum)
    const animationStartTime = Date.now();
    const minimumAnimationDuration = 10000; // 10 seconds
    
    try {
      // If user didn't select from suggestions, fetch coordinates first
      let locationData = selectedLocation;
      
      if (!locationData) {
        console.log('Fetching coordinates for:', location);
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
      
      console.log('API Response:', data);
      console.log('Designs received:', data.designs);
      
      // Calculate remaining time to ensure full 10-second animation
      const elapsedTime = Date.now() - animationStartTime;
      const remainingTime = Math.max(0, minimumAnimationDuration - elapsedTime);
      
      // Wait for animation to complete all stages
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setDesigns(data.designs || []);
      setWeather(data.weather);
      setRecommendations(data.recommendations);
      
      // Initialize loading states for all images
      const loadingStates: { [key: number]: boolean } = {};
      (data.designs || []).forEach((design: DesignImage) => {
        loadingStates[design.id] = true;
      });
      setImageLoadingStates(loadingStates);
      
      console.log('Designs state updated:', data.designs?.length || 0, 'designs');
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
    if (desc.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (desc.includes('cloud')) return <Cloud className="w-8 h-8 text-gray-500" />;
    return <Sun className="w-8 h-8 text-yellow-500" />;
  };

  return (
    <section id="style-finder" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Style
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your location and let our AI discover the perfect clothing designs for you
          </p>
        </motion.div>

        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
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
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-lg"
                  required
                />
                
                {/* Autocomplete suggestions */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      ref={suggestionsRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors border-b border-gray-100 last:border-0 flex items-start gap-3"
                        >
                          <MapPin className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">{suggestion.name}</div>
                            <div className="text-sm text-gray-500 truncate">{suggestion.display_name}</div>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <motion.button
                type="submit"
                disabled={loading || !selectedLocation}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Discover</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* AI Processing Animation */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative bg-gradient-to-br from-primary-50 via-purple-50 to-accent-50 rounded-3xl p-8 shadow-2xl border border-primary-200 overflow-hidden">
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-400/20 via-purple-400/20 to-accent-400/20"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Main AI Icon */}
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Brain className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* AI Processing Text */}
                  <motion.h3
                    className="text-2xl font-bold text-center text-gray-900 mb-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Fashion Intelligence at Work
                  </motion.h3>
                  <p className="text-center text-gray-600 mb-8">
                    Creating personalized fashion recommendations just for you
                  </p>

                  {/* Stage Progress */}
                  <div className="space-y-4">
                    {aiStages.map((stage, index) => {
                      const Icon = stage.icon;
                      const isActive = index === aiStage;
                      const isCompleted = index < aiStage;

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: isActive || isCompleted ? 1 : 0.3,
                            x: 0,
                            scale: isActive ? 1.02 : 1,
                          }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                            isActive 
                              ? 'bg-white shadow-lg border-2 border-primary-300' 
                              : isCompleted
                              ? 'bg-white/50'
                              : 'bg-white/30'
                          }`}
                        >
                          {/* Icon */}
                          <div className={`relative flex-shrink-0`}>
                            {isCompleted ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"
                              >
                                <CheckCircle2 className="w-6 h-6 text-white" />
                              </motion.div>
                            ) : (
                              <motion.div
                                animate={isActive ? {
                                  rotate: [0, 360],
                                  scale: [1, 1.2, 1],
                                } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  isActive ? 'bg-gradient-to-br from-primary-500 to-accent-500' : 'bg-gray-300'
                                }`}
                              >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                              </motion.div>
                            )}
                          </div>

                          {/* Text */}
                          <div className="flex-1">
                            <motion.p
                              className={`font-medium ${
                                isActive ? 'text-gray-900' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                              }`}
                              animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              {stage.text}
                            </motion.p>
                          </div>

                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              className="flex gap-1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              {[0, 1, 2].map((dot) => (
                                <motion.div
                                  key={dot}
                                  className="w-2 h-2 bg-primary-500 rounded-full"
                                  animate={{ 
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                  }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: dot * 0.2,
                                  }}
                                />
                              ))}
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-6 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500"
                      initial={{ width: '0%' }}
                      animate={{ width: `${((aiStage + 1) / aiStages.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {Math.round(((aiStage + 1) / aiStages.length) * 100)}% Complete
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weather display */}
        {weather && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-12 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getWeatherIcon(weather.description)}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{weather.temp}°C</h3>
                  <p className="text-gray-600 capitalize">{weather.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Humidity: {weather.humidity}%</p>
                <p className="text-sm text-gray-600">Wind: {weather.windSpeed} km/h</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="w-6 h-6 text-accent-600" />
              <h3 className="text-2xl font-bold text-gray-900">Your Personalized Recommendations</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200"
                >
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{rec.category}</h4>
                  
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Recommended Items:</p>
                    <ul className="space-y-1">
                      {rec.items.map((item, idx) => (
                        <li key={idx} className="text-gray-600 flex items-start gap-2">
                          <span className="text-primary-600 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs font-semibold text-purple-900 mb-1">Cultural Context</p>
                      <p className="text-sm text-purple-700">{rec.culturalContext}</p>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Weather Adaptation</p>
                      <p className="text-sm text-blue-700">{rec.weatherReason}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && recommendations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-12 h-12 text-primary-600" />
            </div>
            <p className="text-xl text-gray-600">
              Enter your location to discover amazing style recommendations
            </p>
          </motion.div>
        )}

        {/* Debug info */}
        {!loading && designs.length > 0 && (
          <div className="mt-4 p-2 bg-blue-100 text-blue-900 text-sm rounded">
            Debug: {designs.length} designs loaded
          </div>
        )}

        {/* AI-Generated Fashion Designs */}
        {designs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <div className="flex items-center justify-center gap-2 mb-8">
              <Wand2 className="w-6 h-6 text-accent-600" />
              <h3 className="text-2xl font-bold text-gray-900">AI-Generated Fashion Designs</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200">
                    {/* Loading skeleton */}
                    {imageLoadingStates[design.id] && !imageErrors[design.id] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center px-4">
                          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-2" />
                          <p className="text-sm font-semibold text-gray-800 mb-1">AI Generating...</p>
                          <p className="text-xs text-gray-600">{design.category}</p>
                          <p className="text-xs text-gray-500 mt-2">Please wait 20-40 seconds</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Error state with retry button */}
                    {imageErrors[design.id] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
                        <div className="text-center p-6">
                          <Wand2 className="w-16 h-16 text-primary-600 mx-auto mb-3" />
                          <p className="text-base font-semibold text-gray-800 mb-1">{design.category}</p>
                          <p className="text-xs text-gray-600 mb-3">Fashion Design Concept</p>
                        </div>
                      </div>
                    )}
                    
                    <img
                      key={`img-${design.id}-${retryCount[design.id] || 0}`}
                      src={`${design.url}&retry=${retryCount[design.id] || 0}`}
                      alt={design.category}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        imageLoadingStates[design.id] ? 'opacity-0' : 'opacity-100'
                      }`}
                      loading="lazy"
                      onLoad={() => {
                        setImageLoadingStates(prev => ({ ...prev, [design.id]: false }));
                        setImageErrors(prev => ({ ...prev, [design.id]: false }));
                        console.log(`Design ${design.id} loaded successfully`);
                      }}
                      onError={() => {
                        const currentRetry = retryCount[design.id] || 0;
                        console.log(`Design ${design.id} load attempt ${currentRetry + 1}...`);
                        
                        if (currentRetry < 5) {
                          // Retry up to 5 times with delays
                          setTimeout(() => {
                            setRetryCount(prev => ({ ...prev, [design.id]: currentRetry + 1 }));
                          }, 5000); // 5 second delays between retries
                        } else {
                          // After 5 retries, show error state
                          setImageErrors(prev => ({ ...prev, [design.id]: true }));
                          setImageLoadingStates(prev => ({ ...prev, [design.id]: false }));
                        }
                        setImageLoadingStates(prev => ({ ...prev, [design.id]: false }));
                      }}
                    />
                    
                    {/* Overlay on hover */}
                    {!imageLoadingStates[design.id] && !imageErrors[design.id] && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <div className="text-white">
                          <h4 className="font-bold text-lg mb-1">{design.category}</h4>
                          <p className="text-sm text-gray-200 line-clamp-2">{design.prompt}</p>
                        </div>
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <div className="text-white">
                        <h4 className="font-bold text-lg mb-1">{design.category}</h4>
                        <p className="text-sm text-gray-200 line-clamp-2">{design.prompt}</p>
                      </div>
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900 shadow-lg">
                    {design.category}
                  </div>

                  {/* AI badge */}
                  <div className="absolute top-4 left-4 px-2 py-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-xs font-medium text-white">AI Generated</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Note about AI */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-200"
            >
              <p className="text-center text-sm text-gray-700">
                <span className="font-semibold">✨ Fashion Inspiration:</span> Curated design concepts based on your location's culture and current weather conditions.
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
