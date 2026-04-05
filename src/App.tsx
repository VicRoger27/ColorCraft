import React, { useState, useEffect, useCallback } from 'react';
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
  Twitter
} from 'lucide-react';
import chroma from 'chroma-js';
import { 
  generateHarmony, 
  downloadColorAsPng, 
  downloadPaletteAsPng, 
  HarmonyType 
} from './lib/colorUtils';

export default function App() {
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [pickerColor, setPickerColor] = useState('#6366f1');
  const [copied, setCopied] = useState(false);
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('analogous');
  const [palette, setPalette] = useState<string[]>([]);

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              ColorCraft
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <Github className="w-5 h-5 text-white/60" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <Twitter className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-12">
        {/* Left Column: Picker & Main Color */}
        <div className="lg:col-span-5 space-y-8">
          <section className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Main Color
            </h2>
            
            <div className="relative group">
              <motion.div 
                className="w-full aspect-square rounded-3xl shadow-2xl overflow-hidden relative"
                style={{ backgroundColor: pickerColor }}
                layoutId="main-color"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={pickerColor}
                    className={`text-4xl md:text-6xl font-black tracking-tighter mb-4 ${chroma(pickerColor).luminance() > 0.5 ? 'text-black' : 'text-white'}`}
                  >
                    {pickerColor.toUpperCase()}
                  </motion.span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyToClipboard(pickerColor)}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all active:scale-95 ${
                        chroma(pickerColor).luminance() > 0.5 ? 'bg-black/10 hover:bg-black/20 text-black' : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy HEX'}
                    </button>
                    <button 
                      onClick={() => downloadColorAsPng(pickerColor, `color-${pickerColor.replace('#', '')}.png`)}
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
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </motion.div>
              
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-4 shadow-xl">
                <button 
                  onClick={generateRandomColor}
                  className="flex items-center gap-2 text-xs font-semibold hover:text-indigo-400 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Randomize
                </button>
                <div className="w-px h-4 bg-white/10" />
                <span className="text-[10px] uppercase font-bold text-white/40">Click square to pick</span>
              </div>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Color Values
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/30">RGB</span>
                <div className="bg-black/40 px-3 py-2 rounded-lg font-mono text-sm border border-white/5">
                  {chroma(selectedColor).rgb().join(', ')}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/30">HSL</span>
                <div className="bg-black/40 px-3 py-2 rounded-lg font-mono text-sm border border-white/5">
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
              <h2 className="text-sm font-medium uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Palette className="w-4 h-4" /> Harmony Generator
              </h2>
              <button 
                onClick={() => downloadPaletteAsPng(palette, `palette-${harmonyType}.png`)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
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
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
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
                      <span className="font-mono text-xs font-bold text-white/60">{color.toUpperCase()}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(color);
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          <section className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-bold">Need more inspiration?</h3>
              <p className="text-white/60 text-sm max-w-md">
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

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 opacity-40">
          <Palette className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest uppercase">ColorCraft v1.0</span>
        </div>
        <p className="text-xs text-white/30 text-center">
          Crafted with precision for designers and developers. Export high-quality color assets instantly.
        </p>
        <div className="flex gap-6 text-xs font-bold text-white/40">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}
