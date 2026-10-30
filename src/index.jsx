import React from 'react';
import {AbsoluteFill, Composition, Html5Audio, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, registerRoot, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
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
// Texto TikTok (productos que no son Baza): TikTok Sans Medium blanco con trazo negro suave, chico,
// para no tapar la composición. Sin caja. `text` admite \n para dos renglones.
let tiktokReady = null;
function useTikTokFont(enabled) {
  React.useState(() => {
    if (!enabled || tiktokReady) return;
    const h = delayRender('fuente TikTok Sans');
    tiktokReady = new FontFace('TikTokSans', `url(${staticFile('baza/fonts/tiktok/tiktok-sans-latin-500-normal.woff2')})`, {weight: '500'}).load()
      .then(f => { document.fonts.add(f); continueRender(h); })
      .catch(e => { console.error(e); continueRender(h); });
  });
}
function TikTokText({x}) {
  const s = x.scale ?? 1;
  return <AbsoluteFill style={{alignItems:'center'}}>
    <div style={{position:'absolute', top:`${(x.y ?? 0.3) * 100}%`, transform:'translateY(-50%)',
      maxWidth:'82%', textAlign:'center', whiteSpace:'pre-line', color:'#fff',
      fontFamily:'TikTokSans, sans-serif', fontWeight:500, fontSize:(x.size ?? 44)*s, lineHeight:1.18,
      WebkitTextStroke:`${(x.stroke ?? 7)*s}px #000`, paintOrder:'stroke fill',
      textShadow:`0 ${1*s}px ${3*s}px rgba(0,0,0,.35)`}}>{x.text}</div>
  </AbsoluteFill>;
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
// Subtítulo lindo (no TikTok): tarjeta blanca translúcida con esquinas redondeadas, fuente de marca,
// palabras entre *asteriscos* en naranja Baza. Entra con un pop suave. `y` (0-1), `size`, `scale`.
function SubText({x}) {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = x.scale ?? 1;
  const pop = spring({frame: f, fps, config: {damping: 16, stiffness: 220}, durationInFrames: 6});
  const parts = x.text.split(/(\*[^*]+\*)/).filter(Boolean);
  return <AbsoluteFill style={{alignItems:'center'}}>
    <div style={{position:'absolute', top:`${(x.y ?? 0.68) * 100}%`, transform:`translateY(-50%) scale(${0.92 + 0.08*pop})`, opacity: pop,
      whiteSpace:'nowrap', textAlign:'center', background:'rgba(255,255,255,.88)', color:'#1d1d1f',
      fontFamily:'BazaTexto, Helvetica, Arial, sans-serif', fontWeight:500, fontSize:(x.size ?? 36)*s, lineHeight:1.12,
      letterSpacing:-0.4*s, padding:`${8*s}px ${20*s}px ${10*s}px`, borderRadius:20*s,
      boxShadow:`0 ${3*s}px ${12*s}px rgba(0,0,0,.18)`}}>
      {parts.map((p,i) => p.startsWith('*') ? <span key={i} style={{color:'#D84515', fontWeight:700}}>{p.slice(1,-1)}</span> : <span key={i}>{p}</span>)}
    </div>
  </AbsoluteFill>;
}
// Sello de bonus (ej. "+5%"): círculo naranja que aparece con rebote y un leve giro. `sub` = renglón chico.
function BonusBadge({x}) {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = x.scale ?? 1;
  const pop = spring({frame: f, fps, config: {damping: 9, stiffness: 180}, durationInFrames: 14});
  const rot = interpolate(pop, [0, 1], [-18, -6]);
  const d = 250*s;
  return <AbsoluteFill style={{alignItems:'center'}}>
    <div style={{position:'absolute', top:`${(x.y ?? 0.4) * 100}%`, left:`${(x.x ?? 0.5) * 100}%`, width:d, height:d, marginLeft:-d/2, marginTop:-d/2,
      transform:`scale(${pop}) rotate(${rot}deg)`, borderRadius:'50%', background:'#D84515', color:'#fff',
      border:`${8*s}px solid #fff`, boxShadow:`0 ${10*s}px ${30*s}px rgba(0,0,0,.3)`,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      fontFamily:'BazaTexto, Helvetica, Arial, sans-serif', lineHeight:0.95, textAlign:'center'}}>
      <div style={{fontSize:108*s, fontWeight:700, letterSpacing:-3*s}}>{x.text}</div>
      {x.sub ? <div style={{fontSize:36*s, fontWeight:500, marginTop:4*s}}>{x.sub}</div> : null}
    </div>
  </AbsoluteFill>;
}
function Edit(t) {
  useBazaFonts((t.texts ?? []).some(x => ['baza','subtitulo','bonus'].includes(x.style)));
  useTikTokFont((t.texts ?? []).some(x => x.style === 'tiktok'));
  return <AbsoluteFill style={{backgroundColor: '#000'}}>
    {t.clips.map((c,i) => <Sequence key={i} from={c.at} durationInFrames={c.duration}>
      <OffthreadVideo src={source(c.src)} trimBefore={c.sourceStart ?? 0} playbackRate={c.speed ?? 1}
        muted={(c.volume ?? 0) === 0} volume={c.volume ?? 0} transparent={c.transparent ?? false}
        style={{width:'100%', height:'100%', objectFit:c.fit ?? 'cover', ...(c.zoom ? {transform:`scale(${c.zoom})`, transformOrigin:`50% ${(c.originY ?? 0.5)*100}%`} : {})}} />
    </Sequence>)}
    {(t.audio ?? []).map((a,i) => <Sequence key={i} from={a.at} durationInFrames={a.duration} layout="none">
      <Html5Audio src={source(a.src)} trimBefore={a.sourceStart ?? 0} playbackRate={a.speed ?? 1} volume={a.volume ?? 1}/>
    </Sequence>)}
    {(t.images ?? []).map((x,i) => <Sequence key={'img'+i} from={x.at} durationInFrames={x.duration}>
      {/* Imagen fija (logo): centrada en x, `y` = centro vertical (0-1), `width` en px */}
      <AbsoluteFill><Img src={source(x.src)} style={{position:'absolute', left:'50%', top:`${(x.y ?? 0.5)*100}%`,
        width:x.width, transform:'translate(-50%,-50%)'}}/></AbsoluteFill>
    </Sequence>)}
    {(t.texts ?? []).map((x,i) => <Sequence key={i} from={x.at} durationInFrames={x.duration}>
      {x.style === 'baza' ? <BazaText x={x}/> : x.style === 'tiktok' ? <TikTokText x={x}/> : x.style === 'subtitulo' ? <SubText x={x}/> : x.style === 'bonus' ? <BonusBadge x={x}/> : <AbsoluteFill style={{justifyContent:'flex-end', alignItems:'center', padding:60, paddingBottom:180}}>
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
