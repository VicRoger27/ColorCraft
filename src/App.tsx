import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  RefreshCw, 
  Copy, 
  Check, 
  Palette, 
  Layers, 
  Zap,
  ChevronRight,
  Github,
  Twitter,
  Sun,
  Moon,
  Waves
} from 'lucide-react';
import chroma from 'chroma-js';
import { 
  generateHarmony, 
  downloadColorAsPng, 
  downloadPaletteAsPng, 
  HarmonyType 
} from './lib/colorUtils';

const Glitter = React.memo(({ color }: { color: string }) => {
  const particles = useMemo(() => Array.from({ length: 25 }).map(() => ({
    x: Math.random() * 100 + '%',
    y: Math.random() * 100 + '%',
    opacity: Math.random() * 0.3 + 0.1,
    scale: Math.random() * 0.5 + 0.5,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          initial={{ x: p.x, y: p.y, opacity: p.opacity, scale: p.scale }}
          animate={{ 
            opacity: [p.opacity, p.opacity + 0.3, p.opacity],
            scale: [p.scale, p.scale * 1.5, p.scale],
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: p.delay
          }}
          style={{ 
            backgroundColor: color,
            willChange: 'transform, opacity'
          }}
        />
      ))}
    </div>
  );
});

const FlowingRiver = React.memo(({ color }: { color: string }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
      <motion.div
        className="absolute w-[150%] h-[150%] -top-1/4 -left-1/4"
        style={{
          background: `linear-gradient(45deg, transparent 45%, ${color} 50%, transparent 55%)`,
          filter: 'blur(80px)',
          willChange: 'transform'
        }}
        animate={{
          x: ['-10%', '10%'],
          y: ['-5%', '5%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "linear",
        }}
      />
    </div>
  );
});

export default function App() {
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [pickerColor, setPickerColor] = useState('#6366f1');
  const [copied, setCopied] = useState(false);
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('analogous');
  const [palette, setPalette] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showRiver, setShowRiver] = useState(false);
  const [showRiverWarning, setShowRiverWarning] = useState(false);
  const [isDynamicBg, setIsDynamicBg] = useState(false);
  const [showDynamicBgWarning, setShowDynamicBgWarning] = useState(false);

  // Sync picker color when selected color changes (e.g. from randomizer or palette click)
  useEffect(() => {
    setPickerColor(selectedColor);
  }, [selectedColor]);

  const updatePalette = useCallback(() => {
    setPalette(generateHarmony(selectedColor, harmonyType));
  }, [selectedColor, harmonyType]);

  useEffect(() => {
    updatePalette();
  }, [updatePalette]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickerColor(e.target.value);
  };

  const handleColorBlur = () => {
    setSelectedColor(pickerColor);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateRandomColor = () => {
    setSelectedColor(chroma.random().hex());
  };

  const isLight = chroma(selectedColor).luminance() > 0.5;

  const bgBaseColor = isDynamicBg ? pickerColor : (isDarkMode ? '#334155' : '#cbd5e1');

  return (
    <div 
      className={`min-h-screen font-sans selection:bg-indigo-500/30 transition-all duration-1000 ease-in-out relative overflow-hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
      style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#f8fafc' }}
    >
      {/* Dynamic Atmospheric Blobs */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `
            radial-gradient(circle at 0% 0%, ${chroma(bgBaseColor).alpha(isDarkMode ? 0.35 : 0.15).css()} 0%, transparent 60%),
            radial-gradient(circle at 100% 0%, ${chroma(bgBaseColor).alpha(isDarkMode ? 0.2 : 0.08).css()} 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, ${chroma(bgBaseColor).alpha(isDarkMode ? 0.3 : 0.12).css()} 0%, transparent 60%),
            radial-gradient(circle at 0% 100%, ${chroma(bgBaseColor).alpha(isDarkMode ? 0.25 : 0.1).css()} 0%, transparent 50%)
          `
        }}
      />

      {/* Animated Background Effects */}
      {showRiver && <FlowingRiver color={bgBaseColor} />}
      <Glitter color={bgBaseColor} />

      {/* GPU Warning Modal */}
      <AnimatePresence>
        {showRiverWarning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`max-w-sm w-full p-8 rounded-[2.5rem] border shadow-2xl ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Waves className="w-8 h-8 text-red-500" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>GPU Stress Warning</h3>
              <p className={`text-sm mb-8 ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>
                The "Flowing River" effect uses complex shaders that may significantly impact performance on some devices. Do you want to proceed?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowRiverWarning(false)}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-colors ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowRiver(true);
                    setShowRiverWarning(false);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm transition-colors shadow-lg shadow-indigo-500/20"
                >
                  Turn On
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic BG Warning Modal */}
      <AnimatePresence>
        {showDynamicBgWarning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`max-w-sm w-full p-8 rounded-[2.5rem] border shadow-2xl ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-red-500" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>GPU Stress Warning</h3>
              <p className={`text-sm mb-8 ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>
                Enabling real-time background color updates can be demanding on your hardware. Do you want to proceed?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDynamicBgWarning(false)}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-colors ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setIsDynamicBg(true);
                    setShowDynamicBgWarning(false);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm transition-colors shadow-lg shadow-indigo-500/20"
                >
                  Turn On
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
      {/* Header */}
      <header className={`border-b backdrop-blur-md sticky top-0 z-50 transition-colors duration-500 ${isDarkMode ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-white/60'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              ColorCraft
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl transition-all active:scale-95 ${isDarkMode ? 'hover:bg-white/5 text-white/60 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Dynamic BG Toggle */}
            <div className="flex flex-col items-end">
              <button
                onClick={() => {
                  if (!isDynamicBg) {
                    setShowDynamicBgWarning(true);
                  } else {
                    setIsDynamicBg(false);
                  }
                }}
                className={`p-2 rounded-xl transition-all active:scale-95 flex items-center gap-2 ${isDynamicBg ? 'bg-indigo-500 text-white' : (isDarkMode ? 'hover:bg-white/5 text-white/60 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900')}`}
              >
                <Zap className="w-5 h-5" />
                <span className="text-[10px] font-bold hidden sm:inline uppercase tracking-widest">{isDynamicBg ? 'Dynamic ON' : 'Dynamic OFF'}</span>
              </button>
              {isDynamicBg && (
                <span className="text-[7px] font-black text-red-500 uppercase tracking-tighter mt-0.5 animate-pulse">
                  GPU Stress Warning
                </span>
              )}
            </div>

            {/* River Toggle */}
            <div className="flex flex-col items-end">
              <button
                onClick={() => {
                  if (!showRiver) {
                    setShowRiverWarning(true);
                  } else {
                    setShowRiver(false);
                  }
                }}
                className={`p-2 rounded-xl transition-all active:scale-95 flex items-center gap-2 ${showRiver ? 'bg-indigo-500 text-white' : (isDarkMode ? 'hover:bg-white/5 text-white/60 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900')}`}
              >
                <Waves className="w-5 h-5" />
                <span className="text-[10px] font-bold hidden sm:inline uppercase tracking-widest">{showRiver ? 'River ON' : 'River OFF'}</span>
              </button>
              {showRiver && (
                <span className="text-[7px] font-black text-red-500 uppercase tracking-tighter mt-0.5 animate-pulse">
                  GPU Stress Warning
                </span>
              )}
            </div>

            <div className={`w-px h-6 mx-1 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />

            <a 
              href="https://github.com/VicRoger27/ColorCraft" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/5 text-white/60 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-12">
        {/* Left Column: Picker & Main Color */}
        <div className="lg:col-span-5 space-y-8">
          <section className="space-y-4">
            <h2 className={`text-sm font-medium uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
              <Zap className="w-4 h-4" /> Main Color
            </h2>
            
            <div className="relative group">
              <motion.div 
                className="w-full aspect-square rounded-3xl shadow-2xl overflow-hidden relative"
                style={{ backgroundColor: pickerColor }}
                layoutId="main-color"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10 pointer-events-none">
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={pickerColor}
                    className={`text-4xl md:text-6xl font-black tracking-tighter mb-4 ${chroma(pickerColor).luminance() > 0.5 ? 'text-black' : 'text-white'}`}
                  >
                    {pickerColor.toUpperCase()}
                  </motion.span>
                  
                  <div className="flex gap-2 pointer-events-auto">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(pickerColor);
                      }}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all active:scale-95 ${
                        chroma(pickerColor).luminance() > 0.5 ? 'bg-black/10 hover:bg-black/20 text-black' : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy HEX'}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadColorAsPng(pickerColor, `color-${pickerColor.replace('#', '')}.png`);
                      }}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all active:scale-95 ${
                        chroma(pickerColor).luminance() > 0.5 ? 'bg-black/10 hover:bg-black/20 text-black' : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      PNG
                    </button>
                  </div>
                </div>

                {/* Hidden Native Picker Overlay */}
                <input 
                  type="color" 
                  value={pickerColor}
                  onChange={handleColorChange}
                  onBlur={handleColorBlur}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
                />
              </motion.div>
              
              <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 backdrop-blur-xl border px-4 py-2 rounded-2xl flex items-center gap-4 shadow-xl transition-colors ${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-white border-slate-200'}`}>
                <button 
                  onClick={generateRandomColor}
                  className={`flex items-center gap-2 text-xs font-semibold transition-colors ${isDarkMode ? 'hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'}`}
                >
                  <RefreshCw className="w-3 h-3" /> Randomize
                </button>
                <div className={`w-px h-4 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
                <span className={`text-[10px] uppercase font-bold ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Click square to pick</span>
              </div>
            </div>
          </section>

          <section className={`rounded-2xl p-6 space-y-6 transition-colors ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200 shadow-sm'}`}>
            <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <Layers className="w-4 h-4 text-indigo-400" /> Color Values
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className={`text-[10px] uppercase font-bold ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>RGB</span>
                <div className={`px-3 py-2 rounded-lg font-mono text-sm border transition-colors ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  {chroma(selectedColor).rgb().join(', ')}
                </div>
              </div>
              <div className="space-y-1">
                <span className={`text-[10px] uppercase font-bold ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>HSL</span>
                <div className={`px-3 py-2 rounded-lg font-mono text-sm border transition-colors ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                  {chroma(selectedColor).hsl().map(v => isNaN(v) ? 0 : Math.round(v)).join(', ')}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Harmony & Palette */}
        <div className="lg:col-span-7 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-sm font-medium uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                <Palette className="w-4 h-4" /> Harmony Generator
              </h2>
              <button 
                onClick={() => downloadPaletteAsPng(palette, `palette-${harmonyType}.png`)}
                className={`text-xs font-bold flex items-center gap-1 transition-colors ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
              >
                Export Palette <Download className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(['analogous', 'complementary', 'triadic', 'tetradic', 'monochromatic'] as HarmonyType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setHarmonyType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                    harmonyType === type 
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                      : (isDarkMode ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900')
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {palette.map((color, index) => (
                  <motion.div
                    key={`${color}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative"
                  >
                    <div 
                      className="w-full h-48 rounded-2xl shadow-lg transition-transform group-hover:-translate-y-1 cursor-pointer overflow-hidden"
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-black/20 backdrop-blur-md ${chroma(color).luminance() > 0.5 ? 'text-black' : 'text-white'}`}>
                          Apply Base
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between px-1">
                      <span className={`font-mono text-xs font-bold ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>{color.toUpperCase()}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(color);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900'}`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          <section className={`rounded-3xl p-8 relative overflow-hidden transition-colors ${isDarkMode ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-100 shadow-sm'}`}>
            <div className="relative z-10 space-y-4">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Need more inspiration?</h3>
              <p className={`text-sm max-w-md ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>
                Generate a completely random palette based on current design trends and color theory.
              </p>
              <button 
                onClick={generateRandomColor}
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
              >
                Surprise Me <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />
          </section>
        </div>
      </main>

      <footer className={`max-w-7xl mx-auto px-6 py-12 border-t mt-12 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
        <div className={`flex items-center gap-2 opacity-40 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <Palette className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest uppercase">ColorCraft v1.1</span>
        </div>
        <p className={`text-xs text-center ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>
          Crafted with precision for designers and developers. Export high-quality color assets instantly.
        </p>
      </footer>
    </div>
  </div>
);
}
