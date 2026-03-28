import * as Tone from 'tone';

let synth = null;
let polySynth = null;
let membraneSynth = null;
let metalSynth = null;
let pianoSampler = null;
let pianoLoadPromise = null;
let started = false;

const PIANO_SAMPLE_MAP = {
  A0: 'A0.mp3',
  C1: 'C1.mp3',
  'D#1': 'Ds1.mp3',
  'F#1': 'Fs1.mp3',
  A1: 'A1.mp3',
  C2: 'C2.mp3',
  'D#2': 'Ds2.mp3',
  'F#2': 'Fs2.mp3',
  A2: 'A2.mp3',
  C3: 'C3.mp3',
  'D#3': 'Ds3.mp3',
  'F#3': 'Fs3.mp3',
  A3: 'A3.mp3',
  C4: 'C4.mp3',
  'D#4': 'Ds4.mp3',
  'F#4': 'Fs4.mp3',
  A4: 'A4.mp3',
  C5: 'C5.mp3',
  'D#5': 'Ds5.mp3',
  'F#5': 'Fs5.mp3',
  A5: 'A5.mp3',
  C6: 'C6.mp3',
  'D#6': 'Ds6.mp3',
  'F#6': 'Fs6.mp3',
  A6: 'A6.mp3',
  C7: 'C7.mp3',
  'D#7': 'Ds7.mp3',
  'F#7': 'Fs7.mp3',
  A7: 'A7.mp3',
  C8: 'C8.mp3',
};

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

export function getPianoSampler(){
  if(!pianoSampler){
    pianoSampler = new Tone.Sampler({
      urls: PIANO_SAMPLE_MAP,
      release: 1.4,
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
    }).toDestination();
    pianoSampler.volume.value = -3;
  }
  return pianoSampler;
}

async function ensurePianoReady(){
  await ensureStarted();
  const instrument = getPianoSampler();
  if(!pianoLoadPromise){
    pianoLoadPromise = Tone.loaded();
  }
  await pianoLoadPromise;
  return instrument;
}

export async function playChord(noteNames, options = {}){
  let instrument;
  try {
    instrument = await ensurePianoReady();
  } catch {
    instrument = getPolySynth();
  }
  const duration = options.duration ?? 1.3;
  const when = Tone.now() + (options.delay ?? 0);

  if(typeof instrument.releaseAll === 'function'){
    instrument.releaseAll();
  }
  instrument.triggerAttackRelease(noteNames, duration, when);
}

export async function playPlaybackEvents(events){
  if(!events?.length) return;

  let instrument;
  try {
    instrument = await ensurePianoReady();
  } catch {
    instrument = getPolySynth();
  }

  const startTime = Tone.now() + 0.05;
  if(typeof instrument.releaseAll === 'function'){
    instrument.releaseAll();
  }

  events.forEach(event => {
    instrument.triggerAttackRelease(
      event.notes,
      event.duration,
      startTime + event.delay,
    );
  });
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
