import React from 'react';
import {AbsoluteFill, Composition, Html5Audio, OffthreadVideo, Sequence, continueRender, delayRender, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import {validateTimeline} from './timeline.mjs';

const source = (s) => s.startsWith('https://') ? s : staticFile(s);
export const example = {
  width: 720, height: 1280, fps: 30, durationInFrames: 60,
  clips: [{src: 'smoke.mp4', at: 0, duration: 60, sourceStart: 0, speed: 1, volume: 0}],
  audio: [], texts: []
};
// Texto Baza (equivalente al MOGRT texto-baza de Premiere): caja naranja #D84515 con esquinas redondeadas,
// texto blanco, renglón chico arriba (sub) y renglón grande abajo (text). Entra de golpe, sin animación.
// Fuente: public/baza/fonts/texto-medium.* y texto-bold.* (reemplazar esos archivos por la fuente de marca).
let fontsReady = null;
function useBazaFonts(enabled) {
  React.useState(() => {
    if (!enabled || fontsReady) return;
    const h = delayRender('fuentes Baza');
    fontsReady = Promise.all([
      new FontFace('BazaTexto', `url(${staticFile('baza/fonts/texto-medium.otf')})`, {weight: '500'}).load(),
      new FontFace('BazaTexto', `url(${staticFile('baza/fonts/texto-bold.otf')})`, {weight: '700'}).load(),
    ]).then(fs => { fs.forEach(f => document.fonts.add(f)); continueRender(h); })
      .catch(e => { console.error(e); continueRender(h); });
  });
}
function BazaText({x}) {
  // Forma de T: cada renglón con su propia caja naranja, pegadas. Arriba regular (nombre), abajo bold grande.
  // Así no queda naranja vacío a los costados del renglón corto.
  const s = x.scale ?? 1;
  const box = {background:'#D84515', color:'#fff', fontFamily:'BazaTexto, Helvetica, Arial, sans-serif',
    lineHeight:0.95, textAlign:'center', whiteSpace:'nowrap'};
  return <AbsoluteFill style={{alignItems:'center'}}>
    <div style={{position:'absolute', top:`${(x.y ?? 0.2) * 100}%`, transform:'translateY(-50%)',
      display:'flex', flexDirection:'column', alignItems:'center'}}>
      {x.sub ? <div style={{...box, fontSize:(x.subSize ?? 56)*s, fontWeight:500, letterSpacing:-0.5*s,
        padding:`${12*s}px ${22*s}px ${12*s}px`, borderRadius:12*s}}>{x.sub}</div> : null}
      {x.level === 'secundario'
        ? <div style={{...box, fontSize:(x.size ?? 46)*s, fontWeight:500, letterSpacing:-0.5*s,
            padding:`${10*s}px ${20*s}px ${11*s}px`, borderRadius:11*s}}>{x.text}</div>
        : <div style={{...box, fontSize:(x.size ?? 104)*s, fontWeight:700, letterSpacing:-2*s,
            padding:`${10*s}px ${22*s}px ${12*s}px`, borderRadius:12*s, marginTop:x.sub ? -1 : 0}}>{x.text}</div>}
    </div>
  </AbsoluteFill>;
}
function Edit(t) {
  useBazaFonts((t.texts ?? []).some(x => x.style === 'baza'));
  return <AbsoluteFill style={{backgroundColor: '#000'}}>
    {t.clips.map((c,i) => <Sequence key={i} from={c.at} durationInFrames={c.duration}>
      <OffthreadVideo src={source(c.src)} trimBefore={c.sourceStart ?? 0} playbackRate={c.speed ?? 1}
        muted={(c.volume ?? 0) === 0} volume={c.volume ?? 0} transparent={c.transparent ?? false}
        style={{width:'100%', height:'100%', objectFit:c.fit ?? 'cover'}} />
    </Sequence>)}
    {(t.audio ?? []).map((a,i) => <Sequence key={i} from={a.at} durationInFrames={a.duration} layout="none">
      <Html5Audio src={source(a.src)} trimBefore={a.sourceStart ?? 0} playbackRate={a.speed ?? 1} volume={a.volume ?? 1}/>
    </Sequence>)}
    {(t.texts ?? []).map((x,i) => <Sequence key={i} from={x.at} durationInFrames={x.duration}>
      {x.style === 'baza' ? <BazaText x={x}/> : <AbsoluteFill style={{justifyContent:'flex-end', alignItems:'center', padding:60, paddingBottom:180}}>
        <div style={{fontFamily:'Arial',fontSize:42,color:'white',background:'#000b',padding:18,textAlign:'center'}}>{x.text}</div>
      </AbsoluteFill>}
    </Sequence>)}
  </AbsoluteFill>;
}
function TestSource() {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: f < 30 ? '#164e63' : '#9a3412', color:'white', fontFamily:'Arial', alignItems:'center', justifyContent:'center'}}>
    <div style={{fontSize:55}}>PRUEBA REMOTION</div>
    <div style={{fontSize:30}}>Cuadro {f}</div>
    <div style={{height:50,width:50,background:'white',transform:`translateX(${(f-30)*5}px)`,marginTop:50}}/>
  </AbsoluteFill>;
}
registerRoot(() => <>
  <Composition id="Edit" component={Edit} width={720} height={1280} fps={30} durationInFrames={60} defaultProps={example}
    calculateMetadata={({props}) => {
      validateTimeline(props);
      return {width:props.width,height:props.height,fps:props.fps,durationInFrames:props.durationInFrames};
    }}/>
  <Composition id="TestSource" component={TestSource} width={720} height={1280} fps={30} durationInFrames={60}/>
</>);
