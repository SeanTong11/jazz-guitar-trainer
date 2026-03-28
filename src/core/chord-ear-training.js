import { NOTES, NOTE_NAMES_FLAT } from './music-theory.js';

const SHARP_NAMES_ASCII = NOTES.map(note => note.replace('♯', '#'));
const CHROMATIC_ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const PLAYBACK_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BASE_ORDER = [
  'major-triad',
  'minor-triad',
  'diminished-triad',
  'augmented-triad',
  'major-six',
  'minor-six',
  'major',
  'dominant',
  'minor',
  'half-diminished',
  'diminished',
];
const TENSION_ORDER = ['none', 'b9', '9', '#9', '11', '#11', 'b13', '13'];

export const BASE_CHORD_TYPES = [
  {
    id: 'major-triad',
    label: 'Maj',
    shortLabel: 'maj',
    description: 'Major triad base chord.',
  },
  {
    id: 'minor-triad',
    label: 'm',
    shortLabel: 'm',
    description: 'Minor triad base chord.',
  },
  {
    id: 'diminished-triad',
    label: 'dim',
    shortLabel: 'dim',
    description: 'Diminished triad base chord.',
  },
  {
    id: 'augmented-triad',
    label: 'aug',
    shortLabel: 'aug',
    description: 'Augmented triad base chord.',
  },
  {
    id: 'major-six',
    label: '6',
    shortLabel: '6',
    description: 'Major-six base chord.',
  },
  {
    id: 'minor-six',
    label: 'm6',
    shortLabel: 'm6',
    description: 'Minor-six base chord.',
  },
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

export const VOICING_OPTIONS = [
  {
    id: 'close-root',
    label: '原位',
    description: 'Closed position with the root in the bass.',
  },
  {
    id: 'close-first',
    label: '一转位',
    description: 'Closed position with the first inversion in the bass.',
  },
  {
    id: 'close-second',
    label: '二转位',
    description: 'Closed position with the second inversion in the bass.',
  },
  {
    id: 'close-third',
    label: '三转位',
    description: 'Closed position with the third inversion in the bass.',
  },
  {
    id: 'close-random',
    label: '随机转位',
    description: 'Closed position with the inversion chosen randomly each time.',
  },
];

const FAMILY_CONFIG = {
  'major-triad': {
    baseId: 'maj',
    shellIntervals: [0, 4, 7],
    supportedTensions: ['none', '9', '#11'],
    descriptions: {
      none: 'The plain major triad, clean and direct.',
      '9': 'Major triad color with an added ninth on top.',
      '#11': 'Major triad color with a brighter added sharp-eleven.',
    },
  },
  'minor-triad': {
    baseId: 'm',
    shellIntervals: [0, 3, 7],
    supportedTensions: ['none', '9', '11'],
    descriptions: {
      none: 'The plain minor triad before any upper color is added.',
      '9': 'Minor triad color with an added ninth.',
      '11': 'Minor triad color with an added eleventh.',
    },
  },
  'diminished-triad': {
    baseId: 'dim',
    shellIntervals: [0, 3, 6],
    supportedTensions: ['none'],
    descriptions: {
      none: 'Compact diminished triad color.',
    },
  },
  'augmented-triad': {
    baseId: 'aug',
    shellIntervals: [0, 4, 8],
    supportedTensions: ['none'],
    descriptions: {
      none: 'Bright augmented triad color with a raised fifth.',
    },
  },
  'major-six': {
    baseId: '6',
    shellIntervals: [0, 4, 7, 9],
    supportedTensions: ['none', '9'],
    descriptions: {
      none: 'A major triad opened up by the sixth.',
      '9': 'The classic 6/9 color without adding a seventh.',
    },
  },
  'minor-six': {
    baseId: 'm6',
    shellIntervals: [0, 3, 7, 9],
    supportedTensions: ['none', '9'],
    descriptions: {
      none: 'Minor color with the sixth added on top.',
      '9': 'Minor-six color widened into a m6/9 sonority.',
    },
  },
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
    id: 'basic-core-chords',
    label: 'Basic Core Chords',
    description: 'Start from triads, sixth chords, and core seventh colors.',
    baseChordIds: [
      'major-triad',
      'minor-triad',
      'diminished-triad',
      'augmented-triad',
      'major-six',
      'minor-six',
      'major',
      'dominant',
      'minor',
    ],
    tensionIds: ['none'],
    playbackMode: 'chord',
    voicingMode: 'close-root',
  },
  {
    id: 'basic-sevenths',
    label: 'Basic Seventh Chords',
    description: 'Focus on core seventh-chord colors only.',
    baseChordIds: ['major', 'dominant', 'minor', 'half-diminished', 'diminished'],
    tensionIds: ['none'],
    playbackMode: 'chord',
    voicingMode: 'close-root',
  },
  {
    id: 'triads-and-sixths',
    label: 'Triads and Sixths',
    description: 'Drill plain triads, six chords, and a small set of common add colors.',
    baseChordIds: ['major-triad', 'minor-triad', 'diminished-triad', 'augmented-triad', 'major-six', 'minor-six'],
    tensionIds: ['none', '9', '#11', '11'],
    playbackMode: 'chord',
    voicingMode: 'close-root',
  },
  {
    id: 'minor-tensions',
    label: 'Minor Tensions',
    description: 'Train minor base with one selected tension at a time.',
    baseChordIds: ['minor'],
    tensionIds: ['none', '9', '11', '13'],
    playbackMode: 'chord',
    voicingMode: 'close-root',
  },
  {
    id: 'dorian-minor-tensions',
    label: 'Dorian Minor Tensions',
    description: 'Focus on Dorian-friendly minor tensions, especially 9, 11, and 13.',
    baseChordIds: ['minor'],
    tensionIds: ['none', '9', '11', '13'],
    playbackMode: 'chord',
    voicingMode: 'close-root',
  },
  {
    id: 'dominant-tensions',
    label: 'Dominant Tensions',
    description: 'Compare dominant base with altered and natural single tensions.',
    baseChordIds: ['dominant'],
    tensionIds: ['none', 'b9', '9', '#9', '#11', 'b13', '13'],
    playbackMode: 'chord',
    voicingMode: 'close-root',
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

  if(familyId === 'major-triad'){
    if(tensionId === '9') return 'add9';
    if(tensionId === '#11') return 'add#11';
  }

  if(familyId === 'minor-triad'){
    if(tensionId === '9') return 'm(add9)';
    if(tensionId === '11') return 'm(add11)';
  }

  if(familyId === 'major-six'){
    if(tensionId === '9') return '6/9';
  }

  if(familyId === 'minor-six'){
    if(tensionId === '9') return 'm6/9';
  }

  if(familyId === 'major'){
    if(tensionId === '9') return 'maj9';
    if(tensionId === '#11') return 'maj7#11';
    if(tensionId === '13') return 'maj13';
  }

  if(familyId === 'dominant'){
    if(tensionId === '9') return '9';
    if(tensionId === '11') return '11';
    if(tensionId === '13') return '13';
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
  return buildChordId(familyId, tensionId)
    .replace(/b/g, '♭')
    .replace(/#/g, '♯');
}

function buildDefinition(familyId, tensionId){
  const family = FAMILY_CONFIG[familyId];
  const tensionIntervals = tensionId === 'none' ? [] : [TENSION_INTERVALS[tensionId]];

  return {
    id: buildChordId(familyId, tensionId),
    familyId,
    tensionId,
    shortLabel: buildSymbol(familyId, tensionId),
    answerLabel: buildSymbol(familyId, tensionId),
    symbol: buildSymbol(familyId, tensionId),
    intervals: [...family.shellIntervals, ...tensionIntervals],
    tensions: tensionId === 'none' ? [] : [tensionId.replace(/b/g, '♭').replace(/#/g, '♯')],
    description: buildDescription(familyId, tensionId),
  };
}

const CHORD_DEFINITIONS = BASE_ORDER.flatMap(familyId => (
  FAMILY_CONFIG[familyId].supportedTensions.map(tensionId => buildDefinition(familyId, tensionId))
));

function getSelectedIds(selectedIds, fallbackIds){
  if(Array.isArray(selectedIds) && selectedIds.length){
    return [...selectedIds];
  }
  return [...fallbackIds];
}

function normalizeOptions(optionsOrBaseOctave){
  if(typeof optionsOrBaseOctave === 'number'){
    return {
      baseOctave: optionsOrBaseOctave,
      voicingMode: 'close-root',
      randomFn: Math.random,
    };
  }

  return {
    baseOctave: optionsOrBaseOctave?.baseOctave ?? 3,
    voicingMode: optionsOrBaseOctave?.voicingMode ?? 'close-root',
    randomFn: optionsOrBaseOctave?.randomFn ?? Math.random,
  };
}

function getInversionLabel(inversion){
  if(inversion === 0) return '原位';
  const names = ['一', '二', '三', '四', '五'];
  const prefix = names[inversion - 1] ?? String(inversion);
  return `${prefix}转位`;
}

function getMaxInversion(familyId){
  return Math.max(FAMILY_CONFIG[familyId].shellIntervals.length - 1, 0);
}

function getAvailableInversions(familyId, voicingMode){
  const maxInversion = getMaxInversion(familyId);

  if(voicingMode === 'close-random'){
    return Array.from({ length: maxInversion + 1 }, (_, index) => index);
  }

  if(voicingMode === 'close-root'){
    return [0];
  }

  if(voicingMode === 'close-first'){
    return maxInversion >= 1 ? [1] : [];
  }

  if(voicingMode === 'close-second'){
    return maxInversion >= 2 ? [2] : [];
  }

  if(voicingMode === 'close-third'){
    return maxInversion >= 3 ? [3] : [];
  }

  return [0];
}

function applyCloseVoicing(intervals, inversion){
  return intervals
    .slice(inversion)
    .concat(intervals.slice(0, inversion).map(interval => interval + 12));
}

function getVoicingLabel(inversion){
  return getInversionLabel(inversion);
}

function getVoicingVariantCount(chordId, voicingMode){
  const definition = getChordDefinition(chordId);
  return getAvailableInversions(definition.familyId, voicingMode).length;
}

function getQuestionVariantCount(chordPool, rootMode, voicingMode){
  const rootCount = rootMode === 'random' ? CHROMATIC_ROOTS.length : 1;
  const voicingCount = chordPool.reduce(
    (total, chordId) => total + getVoicingVariantCount(chordId, voicingMode),
    0,
  );
  return rootCount * voicingCount;
}

export function getAvailableVoicingOptionIds(config = {}){
  const baseChordIds = getSelectedIds(config.baseChordIds, ['major-triad', 'minor-triad', 'major', 'dominant', 'minor']);
  const tensionIds = getSelectedIds(config.tensionIds, ['none']);

  return VOICING_OPTIONS
    .filter(option => CHORD_DEFINITIONS.some(definition => (
      baseChordIds.includes(definition.familyId) &&
      tensionIds.includes(definition.tensionId) &&
      getAvailableInversions(definition.familyId, option.id).length > 0
    )))
    .map(option => option.id);
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
  const baseChordIds = getSelectedIds(config.baseChordIds, ['major-triad', 'minor-triad', 'major', 'dominant', 'minor']);
  const tensionIds = getSelectedIds(config.tensionIds, ['none']);
  const voicingMode = config.voicingMode ?? 'close-root';

  return CHORD_DEFINITIONS
    .filter(definition => (
      baseChordIds.includes(definition.familyId) &&
      tensionIds.includes(definition.tensionId) &&
      getAvailableInversions(definition.familyId, voicingMode).length > 0
    ))
    .sort((left, right) => {
      const baseComparison = BASE_ORDER.indexOf(left.familyId) - BASE_ORDER.indexOf(right.familyId);
      if(baseComparison !== 0) return baseComparison;
      return TENSION_ORDER.indexOf(left.tensionId) - TENSION_ORDER.indexOf(right.tensionId);
    })
    .map(definition => definition.id);
}

export function buildChordNotes(root, chordId, optionsOrBaseOctave = 3){
  const definition = getChordDefinition(chordId);
  const options = normalizeOptions(optionsOrBaseOctave);
  const rootSemitone = noteToSemitone(root);
  const baseMidi = ((options.baseOctave + 1) * 12) + rootSemitone;
  const inversionChoices = getAvailableInversions(definition.familyId, options.voicingMode);
  const safeInversionChoices = inversionChoices.length ? inversionChoices : [0];
  const inversion = pickFromList(safeInversionChoices, options.randomFn);
  const voicedIntervals = applyCloseVoicing(definition.intervals, inversion);
  const midiNotes = voicedIntervals.map(interval => baseMidi + interval);

  return {
    root,
    rootLabel: formatRootLabel(root),
    chordId,
    label: `${formatRootLabel(root)}${definition.symbol}`,
    definition,
    inversion,
    inversionLabel: getInversionLabel(inversion),
    voicingMode: options.voicingMode,
    voicingLabel: getVoicingLabel(inversion),
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
  const voicingMode = config.voicingMode ?? 'close-root';

  let attempts = 0;
  let root = fixedRoot;
  let chordId = safePool[0];
  let chord = buildChordNotes(root, chordId, { baseOctave, voicingMode, randomFn });
  let signature = `${root}:${chordId}:${chord.inversion}`;

  do {
    root = rootMode === 'random'
      ? pickFromList(CHROMATIC_ROOTS, randomFn)
      : fixedRoot;
    chordId = pickFromList(safePool, randomFn);
    chord = buildChordNotes(root, chordId, { baseOctave, voicingMode, randomFn });
    signature = `${root}:${chordId}:${chord.inversion}`;
    attempts++;
  } while(
    signature === previousSignature &&
    attempts < 16 &&
    getQuestionVariantCount(safePool, rootMode, voicingMode) > 1
  );

  return {
    ...chord,
    rootMode,
    signature,
    optionIds: [...safePool],
    optionLabels: safePool.map(id => getChordDefinition(id).answerLabel),
  };
}
