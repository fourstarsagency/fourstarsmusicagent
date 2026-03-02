import React, { useState, useRef } from 'react';
import { Music, Download, Loader2, Sparkles, Volume2, Upload, Star, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [prompt, setPrompt] = useState('A majestic orchestral masterpiece with golden brass and shimmering strings');
  const [duration, setDuration] = useState(240);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setAudioUrl(null);
    setEnhancedPrompt(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, duration }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate music');
      }

      setAudioUrl(data.url);
      setEnhancedPrompt(data.enhancedPrompt);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setUploadedFileName(file.name);
      setEnhancedPrompt(`Uploaded Reference: ${file.name}\n\nAnalyzing audio structure... (This is a placeholder for real AI analysis)`);
    }
  };

  const maxDuration = 240;

  return (
    <div className="min-h-screen bg-[#000000] text-[#E5E5E5] font-sans selection:bg-[#D4AF37]/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FFD700]/5 blur-[150px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-6"
          >
            <div className="flex gap-1">
              <Star size={10} fill="currentColor" />
              <Star size={10} fill="currentColor" />
              <Star size={10} fill="currentColor" />
              <Star size={10} fill="currentColor" />
            </div>
            <span>PREMIUM AI AGENT</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-6 text-white"
          >
            Four Stars <span className="text-[#D4AF37]">AI</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-xl max-w-2xl mx-auto font-light leading-relaxed"
          >
            The pinnacle of artificial musical intelligence. Compose, refine, and master your sonic vision with our most advanced generative agent.
          </motion.p>
        </header>

        <div className="grid gap-10">
          {/* Main Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/30 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
                    Musical Vision
                  </label>
                  <div className="flex flex-col items-end gap-1">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] font-bold text-[#D4AF37] hover:text-[#FFD700] uppercase tracking-widest flex items-center gap-2 transition-colors"
                    >
                      <Upload size={14} />
                      {uploadedFileName ? 'Change Reference' : 'Upload Reference'}
                    </button>
                    {uploadedFileName && (
                      <span className="text-[9px] text-zinc-500 font-mono truncate max-w-[150px]">
                        {uploadedFileName}
                      </span>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="audio/*" 
                    className="hidden" 
                  />
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your masterpiece..."
                  className="w-full bg-black/60 border border-white/5 rounded-2xl p-6 text-xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#D4AF37]/50 transition-all min-h-[160px] resize-none font-light"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
                      Composition Length
                    </label>
                    <span className="text-[#D4AF37] font-mono text-sm font-bold">
                      {duration >= 60 ? `${Math.floor(duration / 60)}m ${duration % 60}s` : `${duration}s`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max={maxDuration}
                    step="1"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-600 uppercase font-bold tracking-widest">
                    <span>Short</span>
                    <span>Full Track</span>
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full h-[64px] bg-[#D4AF37] hover:bg-[#FFD700] disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-3 group relative overflow-hidden shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                    <div className="relative flex items-center gap-3">
                      {isGenerating ? (
                        <>
                          <Loader2 className="animate-spin" size={24} />
                          <span className="tracking-widest uppercase text-sm">Synthesizing...</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle size={24} />
                          <span className="tracking-widest uppercase text-sm">Begin Generation</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Result Section */}
          <AnimatePresence mode="wait">
            {audioUrl && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="bg-zinc-900/20 border border-[#D4AF37]/10 rounded-[2rem] p-10 flex flex-col items-center gap-8 relative"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.4)] flex items-center justify-center text-black">
                  <Volume2 size={36} />
                </div>
                
                <div className="text-center mt-6">
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">Mastered Output</h3>
                  <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.4em]">Four Stars Quality Certified</p>
                </div>
                
                <div className="w-full max-w-2xl bg-black/40 rounded-3xl p-6 border border-white/5">
                  <audio ref={audioRef} src={audioUrl} controls className="w-full custom-audio" />
                </div>

                {enhancedPrompt && (
                  <div className="w-full bg-black/20 border border-white/5 rounded-2xl p-6">
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mb-4">
                      Agent Analysis & Metadata
                    </label>
                    <div className="text-sm text-zinc-400 font-light italic leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto custom-scrollbar">
                      {enhancedPrompt}
                    </div>
                  </div>
                )}

                <div className="flex gap-6">
                  <a
                    href={audioUrl}
                    download="four-stars-master.mp3"
                    className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-sm font-bold uppercase tracking-widest text-[#D4AF37]"
                  >
                    <Download size={20} />
                    Download Master
                  </a>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 text-red-400 text-center text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/5 text-center">
          <div className="flex justify-center gap-1 mb-4 text-[#D4AF37]/40">
            <Star size={12} fill="currentColor" />
            <Star size={12} fill="currentColor" />
            <Star size={12} fill="currentColor" />
            <Star size={12} fill="currentColor" />
          </div>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.5em]">
            © 2026 Four Stars AI Agent • Excellence in Sound
          </p>
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        .custom-audio::-webkit-media-controls-panel {
          background-color: transparent;
        }
        
        .custom-audio::-webkit-media-controls-play-button,
        .custom-audio::-webkit-media-controls-mute-button {
          filter: sepia(100%) saturate(300%) brightness(100%) hue-rotate(-10deg);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
