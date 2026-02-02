// Simple asset loader with placeholder generator
export type Assets = {
  player?: HTMLImageElement | null;
  enemy?: HTMLImageElement | null;
};

function makePlaceholderImage(width: number, height: number, color: string, label?: string) {
  const cvs = document.createElement('canvas');
  cvs.width = width;
  cvs.height = height;
  const ctx = cvs.getContext('2d')!;

  // Background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // Simple face / emblem
  ctx.fillStyle = '#111';
  ctx.fillRect(4, 4, width - 8, height - 8);
  ctx.fillStyle = color;
  ctx.fillRect(8, 8, width - 16, height - 16);

  // Label
  if (label) {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, width / 2, height - 6);
  }

  const img = new Image();
  img.src = cvs.toDataURL('image/png');
  return img;
}

async function loadImageOrPlaceholder(path: string | null, width: number, height: number, color: string, label?: string) {
  if (!path) {
    return makePlaceholderImage(width, height, color, label);
  }
  return new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      // fallback to placeholder
      resolve(makePlaceholderImage(width, height, color, label));
    };
    img.src = path;
  });
}

export async function loadAssets(manifestPath = '/assets/manifest.json') : Promise<Assets> {
  try {
    const resp = await fetch(manifestPath + '?t=' + Date.now());
    const manifest = await resp.json();
    const player = await loadImageOrPlaceholder(manifest.player ?? null, 32, 64, '#2b2b2b', 'PLAYER');
    const enemy = await loadImageOrPlaceholder(manifest.enemy ?? null, 45, 65, '#4b2b2b', 'ENEMY');
    return { player, enemy };
  } catch (e) {
    // manifest missing or fetch failed - return placeholders
    return {
      player: makePlaceholderImage(32, 64, '#2b2b2b', 'PLAYER'),
      enemy: makePlaceholderImage(45, 65, '#4b2b2b', 'ENEMY'),
    };
  }
}
