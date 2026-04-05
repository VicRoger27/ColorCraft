import chroma from 'chroma-js';

export type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic';

export const generateHarmony = (color: string, type: HarmonyType): string[] => {
  const base = chroma(color);
  
  switch (type) {
    case 'complementary':
      return [color, base.set('hsl.h', (base.get('hsl.h') + 180) % 360).hex()];
    
    case 'analogous':
      return [
        base.set('hsl.h', (base.get('hsl.h') - 30 + 360) % 360).hex(),
        color,
        base.set('hsl.h', (base.get('hsl.h') + 30) % 360).hex()
      ];
      
    case 'triadic':
      return [
        color,
        base.set('hsl.h', (base.get('hsl.h') + 120) % 360).hex(),
        base.set('hsl.h', (base.get('hsl.h') + 240) % 360).hex()
      ];
      
    case 'tetradic':
      return [
        color,
        base.set('hsl.h', (base.get('hsl.h') + 90) % 360).hex(),
        base.set('hsl.h', (base.get('hsl.h') + 180) % 360).hex(),
        base.set('hsl.h', (base.get('hsl.h') + 270) % 360).hex()
      ];
      
    case 'monochromatic':
      return [
        base.brighten(1.5).hex(),
        base.brighten(0.75).hex(),
        color,
        base.darken(0.75).hex(),
        base.darken(1.5).hex()
      ];
      
    default:
      return [color];
  }
};

export const downloadColorAsPng = (color: string, filename: string = 'color.png') => {
  const canvas = document.createElement('canvas');
  canvas.width = 4096;
  canvas.height = 2160;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

export const downloadPaletteAsPng = (colors: string[], filename: string = 'palette.png') => {
  const canvas = document.createElement('canvas');
  const width = 4096;
  const height = 2160;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const stripeWidth = width / colors.length;
  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(i * stripeWidth, 0, stripeWidth, height);
  });
  
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};
