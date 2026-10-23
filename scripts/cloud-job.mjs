import {Storage} from '@google-cloud/storage';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {render,root} from './render.mjs';
import {validateTimeline} from '../src/timeline.mjs';
const bucketName=process.env.RENDER_BUCKET;
const id=process.env.JOB_ID;
if(!bucketName || !/^[a-zA-Z0-9_-]{1,80}$/.test(id ?? '')) throw new Error('RENDER_BUCKET y JOB_ID requeridos');
const bucket=new Storage().bucket(bucketName);
const prefix=`jobs/${id}`;
const result=bucket.file(`${prefix}/result.mp4`);
if((await result.exists())[0]) {console.log('Resultado ya existe; no se vuelve a renderizar');process.exit(0);}
const lease=bucket.file('control/render.lock');
const token=randomUUID();
try {await lease.save(JSON.stringify({id,token,started:Date.now()}),{resumable:false,preconditionOpts:{ifGenerationMatch:0}});}
catch(e){if(e.code===412)throw new Error('Hay otro render o un bloqueo pendiente. No se inicia un segundo trabajo.');throw e;}
const status=async(state,extra={})=>bucket.file(`${prefix}/status.json`).save(JSON.stringify({id,state,updated:new Date().toISOString(),...extra}),{resumable:false,contentType:'application/json'});
try {
  await status('running');
  const manifest=bucket.file(`${prefix}/timeline.json`);
  const [metadata]=await manifest.getMetadata();
  if(Number(metadata.size)>1000000)throw new Error('Montaje demasiado grande');
  const [data]=await manifest.download();
  const t=JSON.parse(data.toString('utf8'));
  // Esta primera nube admite hasta 90 s y Full HD para acotar el trabajo.
  if(t.fps!==30 || t.width>1920 || t.height>1920 || t.durationInFrames>2700)throw new Error('Límite inicial: 30 FPS, 1920 px por lado y 90 segundos');
  const replacements=new Map();let bytes=0;
  for(const item of [...(t.clips??[]),...(t.audio??[])]) {
    if(typeof item.src!=='string')throw new Error('Falta fuente');
    if(replacements.has(item.src)){item.src=replacements.get(item.src);continue;}
    const original=item.src;
    // Solo material del bucket propio: impide acceso a metadatos o servidores internos.
    if(!original.startsWith(`gs://${bucketName}/assets/`))throw new Error('Las fuentes deben estar en gs://RENDER_BUCKET/assets/');
    const object=original.slice(`gs://${bucketName}/`.length);
    const source=bucket.file(object);const [m]=await source.getMetadata();
    bytes+=Number(m.size);
    if(!Number.isFinite(bytes)||Number(m.size)>300*1024*1024||bytes>1024*1024*1024)throw new Error('Límite de archivos: 300 MB por fuente y 1 GB total');
    const ext=path.extname(object).toLowerCase();
    if(!['.mp4','.mov','.webm','.wav','.mp3','.m4a','.aac'].includes(ext))throw new Error('Formato no admitido');
    const local=`cloud-${createHash('sha256').update(original).digest('hex')}${ext}`;
    await source.download({destination:path.join(root,'public',local)});
    replacements.set(original,local);item.src=local;
  }
  validateTimeline(t);
  const output=path.join(root,'renders',`${id}.mp4`);
  await render(t,output);
  await bucket.upload(output,{destination:`${prefix}/result.mp4`,preconditionOpts:{ifGenerationMatch:0},metadata:{contentType:'video/mp4'}});
  await status('completed',{result:`gs://${bucketName}/${prefix}/result.mp4`});
} catch(e) {
  await status('failed',{message:String(e.message).slice(0,500)}).catch(()=>{});
  throw e;
} finally {
  await lease.delete().catch(()=>{});
}
