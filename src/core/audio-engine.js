import * as Tone from 'tone';

let synth = null;
let polySynth = null;
let membraneSynth = null;
let metalSynth = null;
let started = false;

export async function ensureStarted(){
  if(!started){ await Tone.start(); started = true; }
}

export function getSynth(){
  if(!synth) synth = new Tone.Synth({
    oscillator:{type:'triangle'},
    envelope:{attack:0.02,decay:0.1,sustain:0.5,release:1.2}
  }).toDestination();
  return synth;
}

export function getPolySynth(){
  if(!polySynth){
    polySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator:{type:'triangle'},
      envelope:{attack:0.02,decay:0.3,sustain:0.4,release:1}
    }).toDestination();
    polySynth.volume.value = -6;
  }
  return polySynth;
}

export async function playChord(noteNames, options = {}){
  await ensureStarted();
  const instrument = getPolySynth();
  const duration = options.duration ?? 1.3;
  const when = Tone.now() + (options.delay ?? 0);

  instrument.releaseAll();
  instrument.triggerAttackRelease(noteNames, duration, when);
}

export function getMembraneSynth(){
  if(!membraneSynth) membraneSynth = new Tone.MembraneSynth({
    pitchDecay:0.01,octaves:4,envelope:{attack:0.001,decay:0.1,sustain:0,release:0.1}
  }).toDestination();
  return membraneSynth;
}

export function getMetalSynth(){
  if(!metalSynth){
    metalSynth = new Tone.MetalSynth({
      frequency:400,envelope:{attack:0.001,decay:0.05,release:0.01},
      harmonicity:5.1,modulationIndex:16,resonance:2000,octaves:0.5
    }).toDestination();
    metalSynth.volume.value = -12;
  }
  return metalSynth;
}

export { Tone };
