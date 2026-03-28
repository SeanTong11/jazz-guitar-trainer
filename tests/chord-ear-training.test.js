import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildChordNotes,
  buildChordPool,
  buildPlaybackEvents,
  createQuestion,
  formatRootLabel,
  getChordDefinition,
  TRAINING_TEMPLATES,
} from '../src/core/chord-ear-training.js';

test('formatRootLabel uses jazz-friendly accidental symbols', () => {
  assert.equal(formatRootLabel('Bb'), 'B♭');
  assert.equal(formatRootLabel('F#'), 'F♯');
  assert.equal(formatRootLabel('C'), 'C');
});

test('buildChordPool combines selected base chords and extensions', () => {
  const pool = buildChordPool({
    baseChordIds: ['major', 'minor'],
    extensionIds: ['base', '9', '13'],
  });

  assert.deepEqual(pool, ['maj7', 'maj9', 'maj13', 'm7', 'm9', 'm13']);
});

test('buildChordPool filters unsupported combinations and keeps base chords', () => {
  const pool = buildChordPool({
    baseChordIds: ['major', 'half-diminished', 'diminished'],
    extensionIds: ['base', '11'],
  });

  assert.deepEqual(pool, ['maj7', 'm7b5', 'dim7']);
});

test('buildChordNotes returns expected label and notes for minor 13', () => {
  const chord = buildChordNotes('Bb', 'm13', 3);

  assert.equal(chord.label, 'B♭m13');
  assert.deepEqual(chord.noteLabels, ['B♭', 'D♭', 'F', 'A♭', 'G']);
  assert.deepEqual(chord.audioNotes, ['A#3', 'C#4', 'F4', 'G#4', 'G5']);
});

test('createQuestion uses selected chord pool as answer options', () => {
  const question = createQuestion({
    config: {
      baseChordIds: ['minor'],
      extensionIds: ['base', '9', '11', '13'],
    },
    rootMode: 'fixed',
    fixedRoot: 'D',
    randomFn: () => 0,
  });

  assert.equal(question.root, 'D');
  assert.equal(question.chordId, 'm7');
  assert.deepEqual(question.optionLabels, ['m7', 'm9', 'm11', 'm13']);
  assert.equal(question.signature, 'D:m7');
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

test('training template captures My Ear Training style minor extension setup', () => {
  const template = TRAINING_TEMPLATES.find(item => item.id === 'minor-extensions');

  assert.ok(template);
  assert.deepEqual(template.baseChordIds, ['minor']);
  assert.deepEqual(template.extensionIds, ['base', '9', '11', '13']);
  assert.equal(template.playbackMode, 'chord');
});

test('getChordDefinition throws for unknown ids', () => {
  assert.throws(() => getChordDefinition('maj11'), /Unknown chord/i);
});
