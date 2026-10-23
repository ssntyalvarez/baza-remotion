import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateTimeline} from '../src/timeline.mjs';
const valid = () => ({width:720,height:1280,fps:30,durationInFrames:60,clips:[{src:'clip.mp4',at:0,duration:60}],audio:[]});
test('admite cortes, capas y audio independiente para J/L',()=>{
  const t=valid(); t.clips=[{src:'clip.mp4',at:0,duration:24},{src:'clip.mp4',at:24,duration:36,sourceStart:5,speed:1.5},{src:'outro.mov',at:40,duration:20,transparent:true}];
  t.audio=[{src:'voz.wav',at:0,duration:60,volume:1}]; assert.equal(validateTimeline(t),t);
});
test('rechaza huecos, excesos y parámetros inválidos',()=>{
  for(const change of [t=>t.clips[0].at=1,t=>t.clips[0].duration=61,t=>t.clips[0].speed=0,t=>t.clips[0].volume=-1,t=>t.clips[0].src='../privado.mp4',t=>t.clips[0].src='file:///private',t=>t.height=1279]){
    const t=valid();change(t);assert.throws(()=>validateTimeline(t));
  }
});
