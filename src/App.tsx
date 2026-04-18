/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Info } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 selection:text-cyan-200 font-sans overflow-x-hidden relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-magenta-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      <header className="relative z-10 px-8 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.4)]">
            <span className="font-bold text-xl italic tracking-tighter">N</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight italic uppercase glow-cyan">Neon Rhythm</h1>
            <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-cyan-400/50">Arcade Core OS v1.0</span>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium tracking-wide">
          <a href="#" className="hover:text-cyan-400 transition-colors">Arcade</a>
          <a href="#" className="hover:text-magenta-400 transition-colors">Vibe Lab</a>
          <div className="w-px h-4 bg-white/10 mx-2" />
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Github size={18} />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Info size={18} />
            </button>
          </div>
        </nav>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-start">
        {/* Game Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <SnakeGame />
        </motion.div>

        {/* Sidebar / Player Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col gap-8 w-full max-w-sm"
        >
          <MusicPlayer />
          
          <div className="glass-morphism p-6 rounded-3xl border-white/5 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50">Mission Briefing</h3>
            <p className="text-sm leading-relaxed text-white/70">
              Navigate the neon grid using your <span className="text-magenta-400 font-bold">Arrow Keys</span>. 
              Harvest the energy spores to increase your length and score. 
              Collision with walls or your own tail will result in system termination.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-lime-400 tracking-widest">System Online</span>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-8 flex justify-between items-end pointer-events-none opacity-40">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Grid Synchronized</span>
          <span className="text-[10px] font-mono">LATENCY: 12ms</span>
        </div>
        <div className="text-[10px] font-mono text-right">
          DESIGNED FOR IMMERSIVE RHYTHMIC EXPERIENCES<br />
          © 2026 NEON RHYTHM SYSTEMS
        </div>
      </footer>
    </div>
  );
}

