import fs from 'node:fs/promises';
import path from 'node:path';
import {render,root} from './render.mjs';
const sourceFile=path.join(root,'public/smoke.mp4');
try {await fs.access(sourceFile);} catch {await render({},sourceFile,'TestSource');}
// Audio sintético para comprobar mezcla y cortes sin consumir APIs ni voces.
const rate=48000, samples=rate*2, wav=Buffer.alloc(44+samples*2);
wav.write('RIFF');wav.writeUInt32LE(36+samples*2,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples*2,40);
for(let i=0;i<samples;i++)wav.writeInt16LE(Math.round(Math.sin(i/rate*440*Math.PI*2)*2000),44+i*2);
await fs.writeFile(path.join(root,'public/tone.wav'),wav);
const t={width:720,height:1280,fps:30,durationInFrames:60,
  clips:[{src:'smoke.mp4',at:0,duration:24,sourceStart:0},{src:'smoke.mp4',at:24,duration:36,sourceStart:15,speed:1.25}],
  audio:[{src:'tone.wav',at:0,duration:60,volume:0.3}],texts:[{text:'Corte + velocidad + audio independiente',at:24,duration:36}]};
await fs.writeFile(path.join(root,'examples/smoke.json'),JSON.stringify(t,null,2));
await render(t,path.join(root,'renders/prueba-montaje.mp4'));
