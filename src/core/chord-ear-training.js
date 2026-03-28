import { NOTES, NOTE_NAMES_FLAT } from './music-theory.js';

const SHARP_NAMES_ASCII = NOTES.map(note => note.replace('♯', '#'));
const CHROMATIC_ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const CHORD_DEFINITIONS = [
  {
    id: 'major',
    shortLabel: 'major',
    answerLabel: 'major',
    symbol: ' major',
    intervals: [0, 4, 7],
    tensions: [],
    description: 'The plain major triad sound: bright, stable, and centered.',
  },
  {
    id: 'minor',
    shortLabel: 'minor',
    answerLabel: 'minor',
    symbol: ' minor',
    intervals: [0, 3, 7],
    tensions: [],
    description: 'The plain minor triad sound: darker and softer than major.',
  },
  {
    id: 'diminished',
    shortLabel: 'diminished',
    answerLabel: 'diminished',
    symbol: ' diminished',
    intervals: [0, 3, 6],
    tensions: [],
    description: 'A tense, unstable triad built from stacked minor thirds.',
  },
  {
    id: 'augmented',
    shortLabel: 'augmented',
    answerLabel: 'augmented',
    symbol: ' augmented',
    intervals: [0, 4, 8],
    tensions: [],
    description: 'A bright but floating triad with the raised fifth opening the sound.',
  },
  {
    id: 'maj7',
    shortLabel: 'maj7',
    answerLabel: 'maj7',
    symbol: 'maj7',
    intervals: [0, 4, 7, 11],
    tensions: [],
    description: 'The smooth, settled major-seven color common in jazz harmony.',
  },
  {
    id: '7',
    shortLabel: '7',
    answerLabel: '7',
    symbol: '7',
    intervals: [0, 4, 7, 10],
    tensions: [],
    description: 'The dominant-seven sound: active, bluesy, and ready to resolve.',
  },
  {
    id: 'm7',
    shortLabel: 'm7',
    answerLabel: 'm7',
    symbol: 'm7',
    intervals: [0, 3, 7, 10],
    tensions: [],
    description: 'The base minor-seven shell before adding upper extensions.',
  },
  {
    id: 'm7b5',
    shortLabel: 'm7♭5',
    answerLabel: 'm7♭5',
    symbol: 'm7♭5',
    intervals: [0, 3, 6, 10],
    tensions: [],
    description: 'Half-diminished color with a softer edge than a fully diminished chord.',
  },
  {
    id: 'dim7',
    shortLabel: 'dim7',
    answerLabel: 'dim7',
    symbol: 'dim7',
    intervals: [0, 3, 6, 9],
    tensions: [],
    description: 'Fully diminished symmetry with maximum pull and instability.',
  },
  {
    id: 'm9',
    shortLabel: 'm9',
    answerLabel: 'm9',
    symbol: 'm9',
    intervals: [0, 3, 7, 10, 14],
    tensions: ['9'],
    description: 'Minor-seven color with a 9 on top, adding lift without losing softness.',
  },
  {
    id: 'm11',
    shortLabel: 'm11',
    answerLabel: 'm11',
    symbol: 'm11',
    intervals: [0, 3, 7, 10, 17],
    tensions: ['11'],
    description: 'A modal extension color that leans toward quartal space and open minor color.',
  },
  {
    id: 'm6',
    shortLabel: 'm6',
    answerLabel: 'm6 / m13',
    symbol: 'm6',
    intervals: [0, 3, 7, 9],
    tensions: ['13'],
    description: 'Minor-six color often used as an accessible entry to the 13 extension sound.',
  },
];

export const EAR_TRAINING_PRESETS = [
  {
    id: 'basic-triads',
    label: 'Basic Triads',
    description: 'Hear the four core triad colors before moving into jazz voicings.',
    chordIds: ['major', 'minor', 'diminished', 'augmented'],
  },
  {
    id: 'basic-sevenths',
    label: 'Basic Seventh Chords',
    description: 'Recognize the most common seventh-chord qualities used in jazz.',
    chordIds: ['maj7', '7', 'm7', 'm7b5', 'dim7'],
  },
  {
    id: 'minor-extensions',
    label: 'Minor Extensions',
    description: 'Compare how one minor shell changes as upper extensions are added.',
    chordIds: ['m7', 'm9', 'm11', 'm6'],
  },
  {
    id: 'dorian-minor-extensions',
    label: 'Dorian Minor Extensions',
    description: 'Focus on Dorian-friendly minor colors where 9, 11, and 13 become usable extension sounds.',
    chordIds: ['m7', 'm9', 'm11', 'm6'],
  },
];

export const EAR_TRAINING_ROOTS = CHROMATIC_ROOTS.map(root => ({
  value: root,
  label: formatRootLabel(root),
}));

export function formatRootLabel(root){
  return String(root).replace(/b/g, '♭').replace(/#/g, '♯');
}

function noteToSemitone(noteName){
  const normalized = String(noteName).replace(/♭/g, 'b').replace(/♯/g, '#');
  let index = NOTE_NAMES_FLAT.indexOf(normalized);
  if(index >= 0) return index;
  index = SHARP_NAMES_ASCII.indexOf(normalized);
  if(index >= 0) return index;
  throw new Error(`Unknown note: ${noteName}`);
}

function semitoneToAsciiNote(semitone){
  return NOTE_NAMES_FLAT[((semitone % 12) + 12) % 12];
}

function semitoneToDisplayNote(semitone){
  return formatRootLabel(semitoneToAsciiNote(semitone));
}

function midiToNoteName(midi){
  const pitchClass = semitoneToAsciiNote(midi);
  const octave = Math.floor(midi / 12) - 1;
  return `${pitchClass}${octave}`;
}

function buildChordLabel(rootLabel, definition){
  if(definition.symbol.startsWith(' ')){
    return `${rootLabel}${definition.symbol}`;
  }
  return `${rootLabel}${definition.symbol}`;
}

function pickFromList(items, randomFn){
  const index = Math.floor(randomFn() * items.length);
  return items[Math.min(index, items.length - 1)];
}

export function getChordDefinition(chordId){
  const definition = CHORD_DEFINITIONS.find(item => item.id === chordId);
  if(!definition){
    throw new Error(`Unknown chord: ${chordId}`);
  }
  return definition;
}

export function getPreset(presetId){
  const preset = EAR_TRAINING_PRESETS.find(item => item.id === presetId);
  if(!preset){
    throw new Error(`Unknown preset: ${presetId}`);
  }
  return preset;
}

export function buildChordNotes(root, chordId, baseOctave = 3){
  const definition = getChordDefinition(chordId);
  const rootSemitone = noteToSemitone(root);
  const baseMidi = ((baseOctave + 1) * 12) + rootSemitone;
  const midiNotes = definition.intervals.map(interval => baseMidi + interval);

  return {
    root,
    rootLabel: formatRootLabel(root),
    chordId,
    label: buildChordLabel(formatRootLabel(root), definition),
    definition,
    noteLabels: midiNotes.map(midi => semitoneToDisplayNote(midi % 12)),
    audioNotes: midiNotes.map(midiToNoteName),
  };
}

export function createQuestion({
  presetId,
  rootMode = 'fixed',
  fixedRoot = 'C',
  previousSignature = null,
  randomFn = Math.random,
  baseOctave = 3,
}){
  const preset = getPreset(presetId);

  let attempts = 0;
  let root = fixedRoot;
  let chordId = preset.chordIds[0];
  let signature = `${root}:${chordId}`;

  do {
    root = rootMode === 'random'
      ? pickFromList(CHROMATIC_ROOTS, randomFn)
      : fixedRoot;
    chordId = pickFromList(preset.chordIds, randomFn);
    signature = `${root}:${chordId}`;
    attempts++;
  } while(signature === previousSignature && attempts < 16 && preset.chordIds.length * CHROMATIC_ROOTS.length > 1);

  const chord = buildChordNotes(root, chordId, baseOctave);

  return {
    ...chord,
    presetId: preset.id,
    presetLabel: preset.label,
    presetDescription: preset.description,
    rootMode,
    signature,
    optionIds: [...preset.chordIds],
    optionLabels: preset.chordIds.map(id => getChordDefinition(id).answerLabel),
  };
}
