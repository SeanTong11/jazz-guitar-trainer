/**
 * Drop2/Drop3 Voicing Database
 * Voice ordering: top-to-bottom (string 1 = highest)
 * Drop2: 2nd voice from top dropped an octave
 * Drop3: 3rd voice from top dropped an octave
 */

const CHORD_QUALITIES = ['Maj7','Min7','Dom7','Min7b5','Dim7','MinMaj7'];

const CHORD_INTERVALS = {
  'Maj7':    [0,4,7,11],
  'Min7':    [0,3,7,10],
  'Dom7':    [0,4,7,10],
  'Min7b5':  [0,3,6,10],
  'Dim7':    [0,3,6,9],
  'MinMaj7': [0,3,7,11],
};

const CHORD_LABELS = {
  'Maj7':    {symbol:'△7', name:'大七和弦'},
  'Min7':    {symbol:'m7', name:'小七和弦'},
  'Dom7':    {symbol:'7', name:'属七和弦'},
  'Min7b5':  {symbol:'ø7', name:'半减七和弦'},
  'Dim7':    {symbol:'°7', name:'减七和弦'},
  'MinMaj7': {symbol:'m△7', name:'小大七和弦'},
};

const STRING_SETS = [
  {id:'set1', label:'①②③④弦', strings:[0,1,2,3]},
  {id:'set2', label:'②③④⑤弦', strings:[1,2,3,4]},
  {id:'set3', label:'③④⑤⑥弦', strings:[2,3,4,5]},
];

const INVERSION_NAMES = ['根位','第一转位','第二转位','第三转位'];

const TUNING = [64,59,55,50,45,40];

function getDrop2Voices(intervals, inv) {
  let close = [];
  for (let i = 0; i < 4; i++) close.push(intervals[(i + inv) % 4]);
  let topDown = [close[3], close[2], close[1], close[0]];
  return [topDown[0], topDown[2], topDown[3], topDown[1]];
}

function getDrop3Voices(intervals, inv) {
  let close = [];
  for (let i = 0; i < 4; i++) close.push(intervals[(i + inv) % 4]);
  let topDown = [close[3], close[2], close[1], close[0]];
  return [topDown[0], topDown[1], topDown[3], topDown[2]];
}

function voicesToFrets(noteClasses, strings) {
  let prevMidi = Infinity;
  let frets = [];
  for (let i = 0; i < 4; i++) {
    const open = TUNING[strings[i]];
    const nc = ((noteClasses[i] % 12) + 12) % 12;
    let candidates = [];
    for (let f = 0; f <= 15; f++) {
      if ((open + f) % 12 === nc) candidates.push(open + f);
    }
    if (i === 0) {
      frets.push(candidates[0] - open);
      prevMidi = candidates[0];
    } else {
      let best = candidates.filter(m => m < prevMidi).pop();
      if (best === undefined) best = candidates[0];
      frets.push(best - open);
      prevMidi = best;
    }
  }
  return frets;
}

function buildDrop2Voicings() {
  const voicings = {};
  CHORD_QUALITIES.forEach(q => {
    voicings[q] = {};
    STRING_SETS.forEach(ss => {
      const inversions = [];
      for (let inv = 0; inv < 4; inv++) {
        const voices = getDrop2Voices(CHORD_INTERVALS[q], inv);
        const frets = voicesToFrets(voices, ss.strings);
        inversions.push({ name: INVERSION_NAMES[inv], inversion: inv, frets });
      }
      voicings[q][ss.id] = inversions;
    });
  });
  return voicings;
}

function buildDrop3Voicings() {
  const voicings = {};
  CHORD_QUALITIES.forEach(q => {
    voicings[q] = {};
    STRING_SETS.forEach(ss => {
      const inversions = [];
      for (let inv = 0; inv < 4; inv++) {
        const voices = getDrop3Voices(CHORD_INTERVALS[q], inv);
        const frets = voicesToFrets(voices, ss.strings);
        inversions.push({ name: INVERSION_NAMES[inv], inversion: inv, frets });
      }
      voicings[q][ss.id] = inversions;
    });
  });
  return voicings;
}

export const DROP2 = buildDrop2Voicings();
export const DROP3 = buildDrop3Voicings();
export { CHORD_QUALITIES, CHORD_INTERVALS, CHORD_LABELS, STRING_SETS, INVERSION_NAMES };

export function transposeVoicing(frets, semitones) {
  return frets.map(f => {
    if (f < 0) return f;
    let nf = f + semitones;
    while (nf < 0) nf += 12;
    return nf;
  });
}
