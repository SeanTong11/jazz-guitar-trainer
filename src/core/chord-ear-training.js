import { NOTES, NOTE_NAMES_FLAT } from './music-theory.js';

const SHARP_NAMES_ASCII = NOTES.map(note => note.replace('♯', '#'));
const CHROMATIC_ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const PLAYBACK_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BASE_ORDER = ['major', 'dominant', 'minor', 'half-diminished', 'diminished'];
const EXTENSION_ORDER = ['base', '9', '11', '13'];

export const BASE_CHORD_TYPES = [
  {
    id: 'major',
    label: 'Maj7 Family',
    shortLabel: 'maj7',
    description: 'Major-seven based colors.',
  },
  {
    id: 'dominant',
    label: 'Dominant Family',
    shortLabel: '7',
    description: 'Dominant colors and upper tensions.',
  },
  {
    id: 'minor',
    label: 'Minor Family',
    shortLabel: 'm7',
    description: 'Minor-seven colors and modal extensions.',
  },
  {
    id: 'half-diminished',
    label: 'm7♭5',
    shortLabel: 'm7♭5',
    description: 'Half-diminished base color.',
  },
  {
    id: 'diminished',
    label: 'dim7',
    shortLabel: 'dim7',
    description: 'Fully diminished symmetry.',
  },
];

export const EXTENSION_OPTIONS = [
  { id: 'base', label: 'Base', description: 'No added upper extension.' },
  { id: '9', label: '9', description: 'Add the ninth color.' },
  { id: '11', label: '11', description: 'Add the eleventh color.' },
  { id: '13', label: '13', description: 'Add the thirteenth color.' },
];

const CHORD_DEFINITIONS = [
  {
    id: 'maj7',
    familyId: 'major',
    extensionId: 'base',
    shortLabel: 'maj7',
    answerLabel: 'maj7',
    symbol: 'maj7',
    intervals: [0, 4, 7, 11],
    tensions: [],
    description: 'The smooth, settled major-seven color common in jazz harmony.',
  },
  {
    id: 'maj9',
    familyId: 'major',
    extensionId: '9',
    shortLabel: 'maj9',
    answerLabel: 'maj9',
    symbol: 'maj9',
    intervals: [0, 4, 7, 11, 14],
    tensions: ['9'],
    description: 'Major-seven color with a lifted ninth on top.',
  },
  {
    id: 'maj13',
    familyId: 'major',
    extensionId: '13',
    shortLabel: 'maj13',
    answerLabel: 'maj13',
    symbol: 'maj13',
    intervals: [0, 4, 7, 11, 21],
    tensions: ['13'],
    description: 'A wider major color that keeps the major-seven core but reaches for 13.',
  },
  {
    id: '7',
    familyId: 'dominant',
    extensionId: 'base',
    shortLabel: '7',
    answerLabel: '7',
    symbol: '7',
    intervals: [0, 4, 7, 10],
    tensions: [],
    description: 'The dominant-seven sound: active, bluesy, and ready to resolve.',
  },
  {
    id: '9',
    familyId: 'dominant',
    extensionId: '9',
    shortLabel: '9',
    answerLabel: '9',
    symbol: '9',
    intervals: [0, 4, 7, 10, 14],
    tensions: ['9'],
    description: 'Dominant tension with the ninth added above the shell.',
  },
  {
    id: '11',
    familyId: 'dominant',
    extensionId: '11',
    shortLabel: '11',
    answerLabel: '11',
    symbol: '11',
    intervals: [0, 4, 7, 10, 17],
    tensions: ['11'],
    description: 'Dominant color widened by the eleventh.',
  },
  {
    id: '13',
    familyId: 'dominant',
    extensionId: '13',
    shortLabel: '13',
    answerLabel: '13',
    symbol: '13',
    intervals: [0, 4, 7, 10, 21],
    tensions: ['13'],
    description: 'Dominant color with the bright pull of 13 on top.',
  },
  {
    id: 'm7',
    familyId: 'minor',
    extensionId: 'base',
    shortLabel: 'm7',
    answerLabel: 'm7',
    symbol: 'm7',
    intervals: [0, 3, 7, 10],
    tensions: [],
    description: 'The base minor-seven shell before adding upper extensions.',
  },
  {
    id: 'm9',
    familyId: 'minor',
    extensionId: '9',
    shortLabel: 'm9',
    answerLabel: 'm9',
    symbol: 'm9',
    intervals: [0, 3, 7, 10, 14],
    tensions: ['9'],
    description: 'Minor-seven color with a 9 on top, adding lift without losing softness.',
  },
  {
    id: 'm11',
    familyId: 'minor',
    extensionId: '11',
    shortLabel: 'm11',
    answerLabel: 'm11',
    symbol: 'm11',
    intervals: [0, 3, 7, 10, 17],
    tensions: ['11'],
    description: 'A modal extension color that leans toward quartal space and open minor color.',
  },
  {
    id: 'm13',
    familyId: 'minor',
    extensionId: '13',
    shortLabel: 'm13',
    answerLabel: 'm13',
    symbol: 'm13',
    intervals: [0, 3, 7, 10, 21],
    tensions: ['13'],
    description: 'Minor-seven color with the 13 extension opening the top of the chord.',
  },
  {
    id: 'm7b5',
    familyId: 'half-diminished',
    extensionId: 'base',
    shortLabel: 'm7♭5',
    answerLabel: 'm7♭5',
    symbol: 'm7♭5',
    intervals: [0, 3, 6, 10],
    tensions: [],
    description: 'Half-diminished color with a softer edge than a fully diminished chord.',
  },
  {
    id: 'dim7',
    familyId: 'diminished',
    extensionId: 'base',
    shortLabel: 'dim7',
    answerLabel: 'dim7',
    symbol: 'dim7',
    intervals: [0, 3, 6, 9],
    tensions: [],
    description: 'Fully diminished symmetry with maximum pull and instability.',
  },
];

export const TRAINING_TEMPLATES = [
  {
    id: 'basic-sevenths',
    label: 'Basic Seventh Chords',
    description: 'Start from core seventh-chord colors only.',
    baseChordIds: ['major', 'dominant', 'minor', 'half-diminished', 'diminished'],
    extensionIds: ['base'],
    playbackMode: 'chord',
  },
  {
    id: 'minor-extensions',
    label: 'Minor Extensions',
    description: 'Train the difference between base minor, 9, 11, and 13.',
    baseChordIds: ['minor'],
    extensionIds: ['base', '9', '11', '13'],
    playbackMode: 'chord',
  },
  {
    id: 'dorian-minor-extensions',
    label: 'Dorian Minor Extensions',
    description: 'Focus on Dorian-friendly minor extensions, especially 9, 11, and 13.',
    baseChordIds: ['minor'],
    extensionIds: ['base', '9', '11', '13'],
    playbackMode: 'chord',
  },
  {
    id: 'dominant-tensions',
    label: 'Dominant Tensions',
    description: 'Compare dominant base, 9, 11, and 13 colors.',
    baseChordIds: ['dominant'],
    extensionIds: ['base', '9', '11', '13'],
    playbackMode: 'chord',
  },
];

export const EAR_TRAINING_ROOTS = CHROMATIC_ROOTS.map(root => ({
  value: root,
  label: formatRootLabel(root),
}));

function sortByOrder(items, order, getter = value => value){
  return [...items].sort((left, right) => order.indexOf(getter(left)) - order.indexOf(getter(right)));
}

function pickFromList(items, randomFn){
  const index = Math.floor(randomFn() * items.length);
  return items[Math.min(index, items.length - 1)];
}

function noteToSemitone(noteName){
  const normalized = String(noteName).replace(/♭/g, 'b').replace(/♯/g, '#');
  let index = NOTE_NAMES_FLAT.indexOf(normalized);
  if(index >= 0) return index;
  index = SHARP_NAMES_ASCII.indexOf(normalized);
  if(index >= 0) return index;
  throw new Error(`Unknown note: ${noteName}`);
}

function semitoneToDisplayNote(semitone){
  const normalized = ((semitone % 12) + 12) % 12;
  return formatRootLabel(NOTE_NAMES_FLAT[normalized]);
}

function midiToPlaybackNoteName(midi){
  const normalized = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${PLAYBACK_NOTE_NAMES[normalized]}${octave}`;
}

function buildChordLabel(rootLabel, definition){
  return `${rootLabel}${definition.symbol}`;
}

function getSelectedIds(selectedIds, fallbackIds){
  if(Array.isArray(selectedIds) && selectedIds.length){
    return [...selectedIds];
  }
  return [...fallbackIds];
}

export function formatRootLabel(root){
  return String(root).replace(/b/g, '♭').replace(/#/g, '♯');
}

export function getChordDefinition(chordId){
  const definition = CHORD_DEFINITIONS.find(item => item.id === chordId);
  if(!definition){
    throw new Error(`Unknown chord: ${chordId}`);
  }
  return definition;
}

export function getTrainingTemplate(templateId){
  const template = TRAINING_TEMPLATES.find(item => item.id === templateId);
  if(!template){
    throw new Error(`Unknown training template: ${templateId}`);
  }
  return template;
}

export function buildChordPool(config = {}){
  const baseChordIds = getSelectedIds(config.baseChordIds, ['major', 'dominant', 'minor']);
  const extensionIds = getSelectedIds(config.extensionIds, ['base']);

  return sortByOrder(
    CHORD_DEFINITIONS.filter(definition => (
      baseChordIds.includes(definition.familyId) &&
      extensionIds.includes(definition.extensionId)
    )),
    BASE_ORDER,
    definition => definition.familyId,
  ).sort((left, right) => {
    const baseComparison = BASE_ORDER.indexOf(left.familyId) - BASE_ORDER.indexOf(right.familyId);
    if(baseComparison !== 0) return baseComparison;
    return EXTENSION_ORDER.indexOf(left.extensionId) - EXTENSION_ORDER.indexOf(right.extensionId);
  }).map(definition => definition.id);
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
    audioNotes: midiNotes.map(midiToPlaybackNoteName),
  };
}

export function buildPlaybackEvents(noteNames, playbackMode = 'chord'){
  const noteDuration = 0.42;
  const stepDelay = 0.16;
  const chordDuration = 1.35;

  if(playbackMode === 'arpeggio'){
    return noteNames.map((note, index) => ({
      type: 'note',
      notes: [note],
      delay: Number((index * stepDelay).toFixed(2)),
      duration: noteDuration,
    }));
  }

  if(playbackMode === 'both'){
    const arpeggioEvents = buildPlaybackEvents(noteNames, 'arpeggio');
    return [
      ...arpeggioEvents,
      {
        type: 'chord',
        notes: noteNames,
        delay: Number(((noteNames.length + 1) * stepDelay).toFixed(2)),
        duration: chordDuration,
      },
    ];
  }

  return [{
    type: 'chord',
    notes: noteNames,
    delay: 0,
    duration: chordDuration,
  }];
}

export function createQuestion({
  config = {},
  rootMode = 'fixed',
  fixedRoot = 'C',
  previousSignature = null,
  randomFn = Math.random,
  baseOctave = 3,
}){
  const chordPool = buildChordPool(config);
  const safePool = chordPool.length ? chordPool : buildChordPool();

  let attempts = 0;
  let root = fixedRoot;
  let chordId = safePool[0];
  let signature = `${root}:${chordId}`;

  do {
    root = rootMode === 'random'
      ? pickFromList(CHROMATIC_ROOTS, randomFn)
      : fixedRoot;
    chordId = pickFromList(safePool, randomFn);
    signature = `${root}:${chordId}`;
    attempts++;
  } while(signature === previousSignature && attempts < 16 && safePool.length * CHROMATIC_ROOTS.length > 1);

  const chord = buildChordNotes(root, chordId, baseOctave);

  return {
    ...chord,
    rootMode,
    signature,
    optionIds: [...safePool],
    optionLabels: safePool.map(id => getChordDefinition(id).answerLabel),
  };
}
