import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music2 } from 'lucide-react';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Pulse',
    artist: 'AI Voyager',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/cyber/200/200'
  },
  {
    id: '2',
    title: 'Neon Nights',
    artist: 'Synthetix',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon/200/200'
  },
  {
    id: '3',
    title: 'Delta Stream',
    artist: 'Quantum Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/stream/200/200'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center p-6 glass-morphism rounded-3xl w-full max-w-sm border-neon-cyan relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2">
        <Music2 className="text-cyan-400 opacity-30 w-12 h-12" />
      </div>
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={nextTrack}
      />

      <div className="relative w-48 h-48 mb-6 group">
        <motion.div 
          key={currentTrack.id}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 1.2, rotate: 10 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full h-full rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(0,243,255,0.3)]"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex gap-1 items-end h-12">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [10, 40, 15, 35, 10] }}
                  transition={{ 
                    duration: 0.8, 
                    repeat: Infinity, 
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                  className="w-1.5 bg-cyan-400 rounded-full"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold glow-cyan tracking-tight truncate w-64">{currentTrack.title}</h2>
        <p className="text-cyan-400/70 font-mono text-sm uppercase tracking-widest">{currentTrack.artist}</p>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={prevTrack}
          className="p-3 rounded-full hover:bg-cyan-500/10 transition-colors text-cyan-400/50 hover:text-cyan-400"
        >
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="p-5 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30 hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,243,255,0.2)]"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>

        <button 
          onClick={nextTrack}
          className="p-3 rounded-full hover:bg-cyan-500/10 transition-colors text-cyan-400/50 hover:text-cyan-400"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <div className="mt-8 w-full">
         <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
               animate={isPlaying ? { x: ["-100%", "100%"] } : { x: "-100%" }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="h-full w-full bg-linear-to-r from-transparent via-cyan-400 to-transparent"
            />
         </div>
      </div>
    </div>
  );
}
