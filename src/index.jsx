import React from 'react';
import {AbsoluteFill, Composition, Html5Audio, OffthreadVideo, Sequence, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import {validateTimeline} from './timeline.mjs';

const source = (s) => s.startsWith('https://') ? s : staticFile(s);
export const example = {
  width: 720, height: 1280, fps: 30, durationInFrames: 60,
  clips: [{src: 'smoke.mp4', at: 0, duration: 60, sourceStart: 0, speed: 1, volume: 0}],
  audio: [], texts: []
};
function Edit(t) {
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
      <AbsoluteFill style={{justifyContent:'flex-end', alignItems:'center', padding:60, paddingBottom:180}}>
        <div style={{fontFamily:'Arial',fontSize:42,color:'white',background:'#000b',padding:18,textAlign:'center'}}>{x.text}</div>
      </AbsoluteFill>
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
