import { NOTES, NOTE_NAMES_FLAT } from './music-theory.js';

const SHARP_NAMES_ASCII = NOTES.map(note => note.replace('♯', '#'));
const CHROMATIC_ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const PLAYBACK_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BASE_ORDER = ['major', 'dominant', 'minor', 'half-diminished', 'diminished'];
const TENSION_ORDER = ['none', 'b9', '9', '#9', '11', '#11', 'b13', '13'];

export const BASE_CHORD_TYPES = [
  {
    id: 'major',
    label: 'Maj7',
    shortLabel: 'maj7',
    description: 'Major-seven base chord.',
  },
  {
    id: 'dominant',
    label: '7',
    shortLabel: '7',
    description: 'Dominant-seven base chord.',
  },
  {
    id: 'minor',
    label: 'm7',
    shortLabel: 'm7',
    description: 'Minor-seven base chord.',
  },
  {
    id: 'half-diminished',
    label: 'm7♭5',
    shortLabel: 'm7♭5',
    description: 'Half-diminished base chord.',
  },
  {
    id: 'diminished',
    label: 'dim7',
    shortLabel: 'dim7',
    description: 'Fully diminished base chord.',
  },
];

export const TENSION_OPTIONS = [
  { id: 'none', label: 'None', description: 'Base chord only.' },
  { id: 'b9', label: '♭9', description: 'Flat ninth tension.' },
  { id: '9', label: '9', description: 'Natural ninth tension.' },
  { id: '#9', label: '♯9', description: 'Sharp ninth tension.' },
  { id: '11', label: '11', description: 'Natural eleventh tension.' },
  { id: '#11', label: '♯11', description: 'Sharp eleventh tension.' },
  { id: 'b13', label: '♭13', description: 'Flat thirteenth tension.' },
  { id: '13', label: '13', description: 'Natural thirteenth tension.' },
];

const FAMILY_CONFIG = {
  major: {
    baseId: 'maj7',
    shellIntervals: [0, 4, 7, 11],
    supportedTensions: ['none', '9', '#11', '13'],
    descriptions: {
      none: 'The smooth, settled major-seven color common in jazz harmony.',
      '9': 'Major-seven color with a lifted ninth on top.',
      '#11': 'Lydian-flavored major color with the sharp eleventh as the key tension.',
      '13': 'A wider major color that keeps the major-seven core but reaches for 13.',
    },
  },
  dominant: {
    baseId: '7',
    shellIntervals: [0, 4, 7, 10],
    supportedTensions: ['none', 'b9', '9', '#9', '11', '#11', 'b13', '13'],
    descriptions: {
      none: 'The dominant-seven sound: active, bluesy, and ready to resolve.',
      b9: 'Dominant color sharpened by the strong pull of a flat ninth.',
      '9': 'Dominant tension with the ninth added above the shell.',
      '#9': 'Dominant color with the altered sharp-nine bite.',
      '11': 'Dominant color widened by the eleventh.',
      '#11': 'A brighter dominant extension with the sharp eleventh color.',
      b13: 'Dominant color with the darker altered flat-thirteen pull.',
      '13': 'Dominant color with the bright pull of 13 on top.',
    },
  },
  minor: {
    baseId: 'm7',
    shellIntervals: [0, 3, 7, 10],
    supportedTensions: ['none', '9', '11', '13'],
    descriptions: {
      none: 'The base minor-seven shell before adding upper extensions.',
      '9': 'Minor-seven color with a 9 on top, adding lift without losing softness.',
      '11': 'A modal extension color that leans toward quartal space and open minor color.',
      '13': 'Minor-seven color with the 13 extension opening the top of the chord.',
    },
  },
  'half-diminished': {
    baseId: 'm7b5',
    shellIntervals: [0, 3, 6, 10],
    supportedTensions: ['none'],
    descriptions: {
      none: 'Half-diminished color with a softer edge than a fully diminished chord.',
    },
  },
  diminished: {
    baseId: 'dim7',
    shellIntervals: [0, 3, 6, 9],
    supportedTensions: ['none'],
    descriptions: {
      none: 'Fully diminished symmetry with maximum pull and instability.',
    },
  },
};

const TENSION_INTERVALS = {
  b9: 13,
  '9': 14,
  '#9': 15,
  '11': 17,
  '#11': 18,
  b13: 20,
  '13': 21,
};

export const TRAINING_TEMPLATES = [
  {
    id: 'basic-sevenths',
    label: 'Basic Seventh Chords',
    description: 'Start from core seventh-chord colors only.',
    baseChordIds: ['major', 'dominant', 'minor', 'half-diminished', 'diminished'],
    tensionIds: ['none'],
    playbackMode: 'chord',
  },
  {
    id: 'minor-tensions',
    label: 'Minor Tensions',
    description: 'Train minor base with one selected tension at a time.',
    baseChordIds: ['minor'],
    tensionIds: ['none', '9', '11', '13'],
    playbackMode: 'chord',
  },
  {
    id: 'dorian-minor-tensions',
    label: 'Dorian Minor Tensions',
    description: 'Focus on Dorian-friendly minor tensions, especially 9, 11, and 13.',
    baseChordIds: ['minor'],
    tensionIds: ['none', '9', '11', '13'],
    playbackMode: 'chord',
  },
  {
    id: 'dominant-tensions',
    label: 'Dominant Tensions',
    description: 'Compare dominant base with altered and natural single tensions.',
    baseChordIds: ['dominant'],
    tensionIds: ['none', 'b9', '9', '#9', '#11', 'b13', '13'],
    playbackMode: 'chord',
  },
];

export const EAR_TRAINING_ROOTS = CHROMATIC_ROOTS.map(root => ({
  value: root,
  label: formatRootLabel(root),
}));

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

function buildDescription(familyId, tensionId){
  return FAMILY_CONFIG[familyId].descriptions[tensionId];
}

function buildChordId(familyId, tensionId){
  const family = FAMILY_CONFIG[familyId];
  if(tensionId === 'none'){
    return family.baseId;
  }

  if(familyId === 'major'){
    if(tensionId === '9') return 'maj9';
    if(tensionId === '#11') return 'maj7#11';
    if(tensionId === '13') return 'maj13';
  }

  if(familyId === 'dominant'){
    if(tensionId === '9') return '9';
    if(tensionId === '13') return '13';
    if(tensionId === '11') return '11';
    return `7${tensionId}`;
  }

  if(familyId === 'minor'){
    if(tensionId === '9') return 'm9';
    if(tensionId === '11') return 'm11';
    if(tensionId === '13') return 'm13';
  }

  return family.baseId;
}

function buildSymbol(familyId, tensionId){
  const chordId = buildChordId(familyId, tensionId);
  return chordId
    .replace(/b/g, '♭')
    .replace(/#/g, '♯');
}

function buildAnswerLabel(familyId, tensionId){
  return buildSymbol(familyId, tensionId);
}

function buildDefinition(familyId, tensionId){
  const family = FAMILY_CONFIG[familyId];
  const tensionIntervals = tensionId === 'none' ? [] : [TENSION_INTERVALS[tensionId]];

  return {
    id: buildChordId(familyId, tensionId),
    familyId,
    tensionId,
    shortLabel: buildSymbol(familyId, tensionId),
    answerLabel: buildAnswerLabel(familyId, tensionId),
    symbol: buildSymbol(familyId, tensionId),
    intervals: [...family.shellIntervals, ...tensionIntervals],
    tensions: tensionId === 'none' ? [] : [tensionId.replace(/b/g, '♭').replace(/#/g, '♯')],
    description: buildDescription(familyId, tensionId),
  };
}

const CHORD_DEFINITIONS = BASE_ORDER.flatMap(familyId => {
  const family = FAMILY_CONFIG[familyId];
  return family.supportedTensions.map(tensionId => buildDefinition(familyId, tensionId));
});

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
  const tensionIds = getSelectedIds(config.tensionIds, ['none']);

  return CHORD_DEFINITIONS
    .filter(definition => (
      baseChordIds.includes(definition.familyId) &&
      tensionIds.includes(definition.tensionId)
    ))
    .sort((left, right) => {
      const baseComparison = BASE_ORDER.indexOf(left.familyId) - BASE_ORDER.indexOf(right.familyId);
      if(baseComparison !== 0) return baseComparison;
      return TENSION_ORDER.indexOf(left.tensionId) - TENSION_ORDER.indexOf(right.tensionId);
    })
    .map(definition => definition.id);
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
    label: `${formatRootLabel(root)}${definition.symbol}`,
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
