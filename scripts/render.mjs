import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {validateTimeline} from '../src/timeline.mjs';
export const root = fileURLToPath(new URL('../', import.meta.url));
export async function render(timeline, output, compositionId='Edit') {
  if (compositionId === 'Edit') validateTimeline(timeline);
  const serveUrl = await bundle({entryPoint:path.join(root,'src/index.jsx'),publicDir:path.join(root,'public')});
  const composition = await selectComposition({serveUrl,id:compositionId,inputProps:timeline,browserExecutable:process.env.REMOTION_CHROME_EXECUTABLE||null});
  await fs.mkdir(path.dirname(output),{recursive:true});
  try { await fs.access(output); throw new Error(`El archivo ya existe: ${output}`); }
  catch(e) { if (e.code !== 'ENOENT') throw e; }
  const partial = output + '.partial.mp4';
  await renderMedia({serveUrl, composition,inputProps:timeline,codec:'h264',crf:18,
    outputLocation:partial,concurrency:2,overwrite:true,browserExecutable:process.env.REMOTION_CHROME_EXECUTABLE||null});
  await fs.rename(partial,output);
  console.log(`Render terminado: ${output}`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [, , input, output] = process.argv;
  if (!input || !output) throw new Error('Uso: npm run render -- montaje.json renders/video.mp4');
  await render(JSON.parse(await fs.readFile(input,'utf8')),path.resolve(output));
}
