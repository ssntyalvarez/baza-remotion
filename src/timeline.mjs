const fail = (s) => { throw new Error(s); };
const integer = (v, name, min = 0, max = 100000) => {
  if (!Number.isInteger(v) || v < min || v > max) fail(`${name}: entero entre ${min} y ${max}`);
};
export function validateTimeline(t) {
  if (!t || typeof t !== 'object') fail('Falta montaje');
  integer(t.fps, 'fps', 24, 60);
  integer(t.width, 'width', 2, 3840);
  integer(t.height, 'height', 2, 3840);
  if (t.width % 2 || t.height % 2) fail('Dimensiones deben ser pares');
  integer(t.durationInFrames, 'durationInFrames', 1, t.fps * 300);
  if (!Array.isArray(t.clips) || !t.clips.length || t.clips.length > 200) fail('clips: entre 1 y 200');
  for (const [group, items] of [['clips', t.clips], ['audio', t.audio ?? []], ['texts', t.texts ?? []], ['images', t.images ?? []]]) {
    if (!Array.isArray(items) || items.length > 200) fail(`${group}: lista inválida`);
    items.forEach((x, i) => {
      const name = `${group}[${i}]`;
      if (!x || typeof x !== 'object') fail(name);
      integer(x.at, `${name}.at`);
      integer(x.duration, `${name}.duration`, 1);
      if (x.at + x.duration > t.durationInFrames) fail(`${name}: excede duración`);
      if (group === 'texts') {
        if (typeof x.text !== 'string' || !x.text.trim() || x.text.length > 500) fail(`${name}.text`);
        return;
      }
      if (typeof x.src !== 'string' || !x.src || x.src.length > 4096) fail(`${name}.src`);
      // Solo archivos publicados en public/ o HTTPS. Nunca rutas locales ni código.
      if (!/^https:\/\/[^\s]+$/.test(x.src) && !/^[\w./ -]+$/.test(x.src)) fail(`${name}: origen inválido`);
      if (!x.src.startsWith('https://') && (x.src.startsWith('/') || x.src.split('/').includes('..'))) fail(`${name}: ruta inválida`);
      if (group === 'images') {
        if (!Number.isFinite(x.width) || x.width < 1 || x.width > t.width) fail(`${name}.width`);
        if (!Number.isFinite(x.y ?? 0.5) || (x.y ?? 0.5) < 0 || (x.y ?? 0.5) > 1) fail(`${name}.y`);
        return;
      }
      integer(x.sourceStart ?? 0, `${name}.sourceStart`);
      if (!Number.isFinite(x.speed ?? 1) || (x.speed ?? 1) < 0.25 || (x.speed ?? 1) > 4) fail(`${name}.speed`);
      if (!Number.isFinite(x.volume ?? 0) || (x.volume ?? 0) < 0 || (x.volume ?? 0) > 1) fail(`${name}.volume`);
      if (group === 'clips' && !['cover', 'contain'].includes(x.fit ?? 'cover')) fail(`${name}.fit`);
    });
  }
  // Cobertura visual completa: un montaje con huecos no se renderiza por accidente.
  const ranges = t.clips.map(x => [x.at, x.at + x.duration]).sort((a,b) => a[0] - b[0]);
  let end = 0;
  for (const [a,b] of ranges) { if (a > end) fail(`Hueco visual en cuadro ${end}`); end = Math.max(end,b); }
  if (end < t.durationInFrames) fail('Final sin imagen');
  return t;
}
