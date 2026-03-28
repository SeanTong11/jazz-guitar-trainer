import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildChordNotes,
  buildChordPool,
  buildPlaybackEvents,
  createQuestion,
  formatRootLabel,
  getChordDefinition,
  TENSION_OPTIONS,
  TRAINING_TEMPLATES,
} from '../src/core/chord-ear-training.js';

test('formatRootLabel uses jazz-friendly accidental symbols', () => {
  assert.equal(formatRootLabel('Bb'), 'B♭');
  assert.equal(formatRootLabel('F#'), 'F♯');
  assert.equal(formatRootLabel('C'), 'C');
});

test('tension options expose single-tension choices including none and alterations', () => {
  assert.deepEqual(
    TENSION_OPTIONS.map(option => option.id),
    ['none', 'b9', '9', '#9', '11', '#11', 'b13', '13'],
  );
});

test('buildChordPool combines selected base chords and single tensions', () => {
  const pool = buildChordPool({
    baseChordIds: ['major', 'dominant'],
    tensionIds: ['none', '9', '13'],
  });

  assert.deepEqual(pool, ['maj7', 'maj9', 'maj13', '7', '9', '13']);
});

test('buildChordPool filters out unsupported tension combinations', () => {
  const pool = buildChordPool({
    baseChordIds: ['major', 'half-diminished', 'diminished'],
    tensionIds: ['none', '#11', 'b9'],
  });

  assert.deepEqual(pool, ['maj7', 'maj7#11', 'm7b5', 'dim7']);
});

test('buildChordNotes returns expected label and notes for major sharp eleven', () => {
  const chord = buildChordNotes('Bb', 'maj7#11', 3);

  assert.equal(chord.label, 'B♭maj7♯11');
  assert.deepEqual(chord.noteLabels, ['B♭', 'D', 'F', 'A', 'E']);
  assert.deepEqual(chord.audioNotes, ['A#3', 'D4', 'F4', 'A4', 'E5']);
});

test('buildChordNotes returns expected label and notes for dominant flat nine', () => {
  const chord = buildChordNotes('C', '7b9', 3);

  assert.equal(chord.label, 'C7♭9');
  assert.deepEqual(chord.noteLabels, ['C', 'E', 'G', 'B♭', 'D♭']);
});

test('createQuestion uses selected chord pool as answer options', () => {
  const question = createQuestion({
    config: {
      baseChordIds: ['dominant'],
      tensionIds: ['none', 'b9', '9', '#9'],
    },
    rootMode: 'fixed',
    fixedRoot: 'D',
    randomFn: () => 0,
  });

  assert.equal(question.root, 'D');
  assert.equal(question.chordId, '7');
  assert.deepEqual(question.optionLabels, ['7', '7♭9', '9', '7♯9']);
  assert.equal(question.signature, 'D:7');
});

test('buildPlaybackEvents supports chord, arpeggio, and both modes', () => {
  const notes = ['C4', 'E4', 'G4', 'B4'];

  assert.deepEqual(buildPlaybackEvents(notes, 'chord'), [
    { type: 'chord', notes, delay: 0, duration: 1.35 },
  ]);

  assert.deepEqual(buildPlaybackEvents(notes, 'arpeggio'), [
    { type: 'note', notes: ['C4'], delay: 0, duration: 0.42 },
    { type: 'note', notes: ['E4'], delay: 0.16, duration: 0.42 },
    { type: 'note', notes: ['G4'], delay: 0.32, duration: 0.42 },
    { type: 'note', notes: ['B4'], delay: 0.48, duration: 0.42 },
  ]);

  assert.deepEqual(buildPlaybackEvents(notes, 'both'), [
    { type: 'note', notes: ['C4'], delay: 0, duration: 0.42 },
    { type: 'note', notes: ['E4'], delay: 0.16, duration: 0.42 },
    { type: 'note', notes: ['G4'], delay: 0.32, duration: 0.42 },
    { type: 'note', notes: ['B4'], delay: 0.48, duration: 0.42 },
    { type: 'chord', notes, delay: 0.8, duration: 1.35 },
  ]);
});

test('training template captures single-tension dominant setup', () => {
  const template = TRAINING_TEMPLATES.find(item => item.id === 'dominant-tensions');

  assert.ok(template);
  assert.deepEqual(template.baseChordIds, ['dominant']);
  assert.deepEqual(template.tensionIds, ['none', 'b9', '9', '#9', '#11', 'b13', '13']);
  assert.equal(template.playbackMode, 'chord');
});

test('getChordDefinition throws for unknown ids', () => {
  assert.throws(() => getChordDefinition('maj7b9#11'), /Unknown chord/i);
});
