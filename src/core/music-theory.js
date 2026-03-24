export const NOTES = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
export const NOTE_NAMES_FLAT = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
export const KEYS = ['C','Db','D','Eb','E','F','F♯/Gb','G','Ab','A','Bb','B'];

export const KEY_GROUPS = [
  { label: '无升降号', keys: [{name:'C', root:'C'}] },
  { label: '升号调', keys: [
    {name:'G', root:'G'},
    {name:'D', root:'D'},
    {name:'A', root:'A'},
    {name:'E', root:'E'},
    {name:'B', root:'B'},
  ]},
  { label: '降号调', keys: [
    {name:'F', root:'F'},
    {name:'B♭', root:'Bb'},
    {name:'E♭', root:'Eb'},
    {name:'A♭', root:'Ab'},
    {name:'D♭', root:'Db'},
    {name:'G♭', root:'Gb'},
  ]},
];

export const KEY_NOTE_NAMES = {
  'C':  ['C','D','E','F','G','A','B'],
  'G':  ['G','A','B','C','D','E','F♯'],
  'D':  ['D','E','F♯','G','A','B','C♯'],
  'A':  ['A','B','C♯','D','E','F♯','G♯'],
  'E':  ['E','F♯','G♯','A','B','C♯','D♯'],
  'B':  ['B','C♯','D♯','E','F♯','G♯','A♯'],
  'F':  ['F','G','A','B♭','C','D','E'],
  'Bb': ['B♭','C','D','E♭','F','G','A'],
  'Eb': ['E♭','F','G','A♭','B♭','C','D'],
  'Ab': ['A♭','B♭','C','D♭','E♭','F','G'],
  'Db': ['D♭','E♭','F','G♭','A♭','B♭','C'],
  'Gb': ['G♭','A♭','B♭','C♭','D♭','E♭','F'],
};
export const DEGREE_LABELS = ['1','♭2','2','♭3','3','4','♯4/♭5','5','♭6','6','♭7','7'];
export const DEGREE_LABELS_ROMAN = ['I','♭II','II','♭III','III','IV','♯IV/♭V','V','♭VI','VI','♭VII','VII'];

export const SCALE_TYPES = [
  {name:'大调 (Ionian)',id:'major',cat:'基础',intervals:[0,2,4,5,7,9,11]},
  {name:'自然小调 (Aeolian)',id:'minor',cat:'基础',intervals:[0,2,3,5,7,8,10]},
  {name:'Dorian',id:'dorian',cat:'基础',intervals:[0,2,3,5,7,9,10]},
  {name:'Phrygian',id:'phrygian',cat:'基础',intervals:[0,1,3,5,7,8,10]},
  {name:'Lydian',id:'lydian',cat:'基础',intervals:[0,2,4,6,7,9,11]},
  {name:'Mixolydian',id:'mixolydian',cat:'基础',intervals:[0,2,4,5,7,9,10]},
  {name:'Locrian',id:'locrian',cat:'基础',intervals:[0,1,3,5,6,8,10]},

  {name:'和声小调',id:'harmonic-minor',cat:'和声小调',intervals:[0,2,3,5,7,8,11]},
  {name:'Locrian ♮6',id:'locrian-nat6',cat:'和声小调',intervals:[0,1,3,5,6,9,10]},
  {name:'Ionian ♯5',id:'ionian-sharp5',cat:'和声小调',intervals:[0,2,4,5,8,9,11]},
  {name:'Dorian ♯4',id:'dorian-sharp4',cat:'和声小调',intervals:[0,2,3,6,7,9,10]},
  {name:'Phrygian Dominant',id:'phrygian-dom',cat:'和声小调',intervals:[0,1,4,5,7,8,10]},
  {name:'Lydian ♯2',id:'lydian-sharp2',cat:'和声小调',intervals:[0,3,4,6,7,9,11]},
  {name:'Ultralocrian',id:'ultralocrian',cat:'和声小调',intervals:[0,1,3,4,6,8,9]},

  {name:'旋律小调',id:'melodic-minor',cat:'旋律小调',intervals:[0,2,3,5,7,9,11]},
  {name:'Dorian ♭2',id:'dorian-b2',cat:'旋律小调',intervals:[0,1,3,5,7,9,10]},
  {name:'Lydian Augmented',id:'lydian-aug',cat:'旋律小调',intervals:[0,2,4,6,8,9,11]},
  {name:'Lydian Dominant',id:'lydian-dom',cat:'旋律小调',intervals:[0,2,4,6,7,9,10]},
  {name:'Mixolydian b6',id:'mixolydian-b6',cat:'旋律小调',intervals:[0,2,4,5,7,8,10]},
  {name:'Locrian ♮2',id:'locrian-nat2',cat:'旋律小调',intervals:[0,2,3,5,6,8,10]},
  {name:'Altered (Super Locrian)',id:'altered',cat:'旋律小调',intervals:[0,1,3,4,6,8,10]},

  {name:'五声大调',id:'penta-major',cat:'其他',intervals:[0,2,4,7,9]},
  {name:'五声小调',id:'penta-minor',cat:'其他',intervals:[0,3,5,7,10]},
  {name:'Blues',id:'blues',cat:'其他',intervals:[0,3,5,6,7,10]},
  {name:'全音阶',id:'whole-tone',cat:'其他',intervals:[0,2,4,6,8,10]},
  {name:'减音阶 (半全)',id:'dim-hw',cat:'其他',intervals:[0,1,3,4,6,7,9,10]},
  {name:'减音阶 (全半)',id:'dim-wh',cat:'其他',intervals:[0,2,3,5,6,8,9,11]},
  {name:'Bebop大调',id:'bebop-major',cat:'其他',intervals:[0,2,4,5,7,8,9,11]},
  {name:'Bebop属',id:'bebop-dom',cat:'其他',intervals:[0,2,4,5,7,9,10,11]},
];

export const INTERVALS = [
  {name:'纯一度',semitones:0},{name:'小二度',semitones:1},{name:'大二度',semitones:2},
  {name:'小三度',semitones:3},{name:'大三度',semitones:4},{name:'纯四度',semitones:5},
  {name:'三全音',semitones:6},{name:'纯五度',semitones:7},{name:'小六度',semitones:8},
  {name:'大六度',semitones:9},{name:'小七度',semitones:10},{name:'大七度',semitones:11},
  {name:'纯八度',semitones:12}
];

export const CHORD_TYPES_EAR = [
  {name:'大三',notes:[0,4,7]},{name:'小三',notes:[0,3,7]},{name:'增三',notes:[0,4,8]},
  {name:'减三',notes:[0,3,6]},{name:'大七',notes:[0,4,7,11]},{name:'属七',notes:[0,4,7,10]},
  {name:'小七',notes:[0,3,7,10]},{name:'半减七',notes:[0,3,6,10]},{name:'减七',notes:[0,3,6,9]},
  {name:'小大七',notes:[0,3,7,11]}
];

export const GUITAR_TUNING = [40,45,50,55,59,64];

export function getScaleNotes(rootName, scaleType){
  let root = NOTES.indexOf(rootName);
  if(root<0) root = NOTE_NAMES_FLAT.indexOf(rootName);
  if(root<0) return [];
  return scaleType.intervals.map(i => NOTES[(root+i)%12]);
}

const LETTER_ORDER = ['C','D','E','F','G','A','B'];
const SEMI_OF_LETTER = {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11};

export function getSpelledScaleNotes(rootName, scaleType){
  let rootSemi = NOTES.indexOf(rootName);
  if(rootSemi < 0) rootSemi = NOTE_NAMES_FLAT.indexOf(rootName);
  if(rootSemi < 0) return getScaleNotes(rootName, scaleType);

  const rootLetter = rootName.charAt(0).toUpperCase();
  const rootLetterIdx = LETTER_ORDER.indexOf(rootLetter);
  if(rootLetterIdx < 0) return getScaleNotes(rootName, scaleType);

  const intervals = scaleType.intervals;
  const result = [];

  for(let i = 0; i < intervals.length; i++){
    const targetSemi = (rootSemi + intervals[i]) % 12;
    const letterIdx = (rootLetterIdx + i) % 7;
    const letter = LETTER_ORDER[letterIdx];
    const naturalSemi = SEMI_OF_LETTER[letter];
    const diff = ((targetSemi - naturalSemi) + 12) % 12;

    if(diff === 0){
      result.push(letter);
    } else if(diff === 1){
      result.push(letter + '\u266f');
    } else if(diff === 11){
      result.push(letter + '♭');
    } else if(diff === 2){
      result.push(letter + '\u266f\u266f');
    } else if(diff === 10){
      result.push(letter + '♭♭');
    } else {
      result.push(NOTES[targetSemi]);
    }
  }
  return result;
}

export function buildSemiToNameMap(rootName, scaleType){
  let rootSemi = NOTES.indexOf(rootName);
  if(rootSemi < 0) rootSemi = NOTE_NAMES_FLAT.indexOf(rootName);
  const spelled = getSpelledScaleNotes(rootName, scaleType);
  const intervals = scaleType.intervals;
  const map = {};
  for(let i = 0; i < intervals.length; i++){
    const semi = (rootSemi + intervals[i]) % 12;
    map[semi] = spelled[i];
  }
  return map;
}

export function getDegreeLabel(rootIdx, noteIdx){
  return DEGREE_LABELS[(noteIdx - rootIdx + 12) % 12];
}

export function midiToNote(m){ return NOTES[m % 12]; }
export function midiToNoteName(m){ return NOTES[m % 12] + Math.floor(m/12-1); }
export function parseKey(k){ return k.includes('/') ? k.split('/')[0] : k; }
export function shuffle(arr){
  const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;
}
export function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
