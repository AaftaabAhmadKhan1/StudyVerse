"use client";

import React, { useState } from "react";
import { BookOpen, Sparkles, Send, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import Link from 'next/link';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface StoryData {
  title: string;
  story: string[];
  conceptSummary: string;
  quiz: QuizQuestion[];
  videoUrl?: string;
}

export default function StoryTutor() {
  const [topic, setTopic] = useState("");
  const [theme, setTheme] = useState("");
  const [ageGroup, setAgeGroup] = useState("8-10");
  const [isLoading, setIsLoading] = useState(false);
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [error, setError] = useState("");

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const generateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !theme) return;

    setIsLoading(true);
    setError("");
    setStoryData(null);
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);

    try {
      const res = await fetch("/api/story-tutor/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, theme, ageGroup }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to generate story");

      setStoryData(data.data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === storyData?.quiz[currentQuizIndex].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (storyData && currentQuizIndex < storyData.quiz.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 section-padding">
      <div className="max-w-4xl mx-auto space-y-8 mt-12">
        <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 transform -rotate-6 shadow-sm">
            <BookOpen size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              StoryTutor <Sparkles className="text-yellow-500" size={24} />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Turn any boring topic into a magical learning adventure!
            </p>
          </div>
        </div>

        {!storyData && !isLoading ? (
          <form onSubmit={generateStory} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What do you want to learn? (Topic)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fractions, Gravity, Photosynthesis, Solar System"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pick a Fun Theme!
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a theme...</option>
                  <option value="Space Explorers">🚀 Space Explorers</option>
                  <option value="Dinosaur Adventure">🦖 Dinosaur Adventure</option>
                  <option value="Magic Academy">🧙‍♂️ Magic Academy</option>
                  <option value="Superhero City">🦸‍♀️ Superhero City</option>
                  <option value="Underwater Kingdom">🧜‍♀️ Underwater Kingdom</option>
                  <option value="Pirate Treasure Hunt">🏴‍☠️ Pirate Treasure Hunt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age Group
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                >
                  <option value="5-7">5-7 years old</option>
                  <option value="8-10">8-10 years old (Recommended)</option>
                  <option value="11-13">11-13 years old</option>
                  <option value="14+">14+ years old</option>
                </select>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                disabled={!topic || !theme}
              >
                <Sparkles size={20} /> Generate Magic Story
              </button>
            </div>
          </form>
        ) : isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-sm border border-gray-100 dark:border-gray-700 text-center space-y-6 flex flex-col items-center justify-center h-64">
            <RefreshCw className="animate-spin text-blue-500 w-12 h-12" />
            <div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Weaving the magic...</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Creating an epic adventure to teach you about {topic}!</p>
            </div>
          </div>
        ) : storyData ? (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center text-blue-600 dark:text-blue-400">
                {storyData.title}
              </h2>

              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border-4 border-blue-50 dark:border-blue-900/20 relative group">
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 z-10">
                  <Sparkles size={16} className="text-yellow-400" /> Auto-Generated Animation
                </div>
                <video 
                  key={storyData.videoUrl || "demo-video"}
                  className="w-full aspect-video object-cover bg-gray-900" 
                  controls 
                  autoPlay 
                  playsInline
                  loop
                  src={storyData.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6">
                <p className="font-medium text-blue-800 dark:text-blue-300 text-sm">
                  <span className="font-bold">Summary: </span>{storyData.conceptSummary}
                </p>
              </div>

              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium">
                {storyData.story.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Quiz Section */}
            {storyData.quiz && storyData.quiz.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Brain size={24} className="text-purple-500"/> Pop Quiz Time!
                </h3>
                
                {currentQuizIndex < storyData.quiz.length ? (
                  <div className="space-y-6">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {currentQuizIndex + 1}. {storyData.quiz[currentQuizIndex].question}
                    </p>
                    
                    <div className="space-y-3">
                      {storyData.quiz[currentQuizIndex].options.map((option, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isCorrect = idx === storyData.quiz[currentQuizIndex].correctAnswerIndex;
                        const showStatus = showExplanation;

                        let btnClass = "w-full text-left px-5 py-4 rounded-xl border transition-all ";
                        if (!showStatus) {
                          btnClass += "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-gray-50 dark:bg-gray-900";
                        } else {
                          if (isCorrect) {
                            btnClass += "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300 font-medium";
                          } else if (isSelected && !isCorrect) {
                            btnClass += "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300 strikethrough opacity-70";
                          } else {
                            btnClass += "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-50";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={showExplanation}
                            className={btnClass}
                          >
                            <span className="flex items-center justify-between">
                              {option}
                              {showStatus && isCorrect && <CheckCircle2 className="text-green-500" size={20} />}
                              {showStatus && isSelected && !isCorrect && <XCircle className="text-red-500" size={20} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {showExplanation && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-xl animate-fade-in text-yellow-800 dark:text-yellow-300">
                        {storyData.quiz[currentQuizIndex].explanation}
                      </div>
                    )}

                    {showExplanation && (
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={nextQuestion}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          {currentQuizIndex < storyData.quiz.length - 1 ? 'Next Question' : 'See Results'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex h-20 w-20 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 items-center justify-center rounded-full mb-4 text-3xl font-bold">
                      {score}/{storyData.quiz.length}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                       {score === storyData.quiz.length ? 'Perfect Score! 🌟' : score > 0 ? 'Great Job! 👏' : 'Keep Trying! 💪'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                      You've successfully completed the {topic} adventure!
                    </p>
                    <button
                      onClick={() => setStoryData(null)}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium transition-colors"
                    >
                      Learn a New Topic
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Quick hack to fix Brain icon not imported directly
function Brain(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/></svg>
}