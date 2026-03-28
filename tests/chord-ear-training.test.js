import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EAR_TRAINING_PRESETS,
  buildChordNotes,
  createQuestion,
  formatRootLabel,
  getChordDefinition,
} from '../src/core/chord-ear-training.js';

test('formatRootLabel uses jazz-friendly accidental symbols', () => {
  assert.equal(formatRootLabel('Bb'), 'B♭');
  assert.equal(formatRootLabel('F#'), 'F♯');
  assert.equal(formatRootLabel('C'), 'C');
});

test('buildChordNotes returns expected voicing for B-flat minor 9', () => {
  const chord = buildChordNotes('Bb', 'm9', 3);

  assert.equal(chord.label, 'B♭m9');
  assert.deepEqual(chord.noteLabels, ['B♭', 'D♭', 'F', 'A♭', 'C']);
  assert.deepEqual(chord.audioNotes, ['Bb3', 'Db4', 'F4', 'Ab4', 'C5']);
});

test('minor 11 feedback highlights its tension color', () => {
  const chord = buildChordNotes('D', 'm11', 3);

  assert.equal(chord.definition.shortLabel, 'm11');
  assert.deepEqual(chord.definition.tensions, ['11']);
  assert.match(chord.definition.description, /quartal|color|extension/i);
});

test('createQuestion uses fixed root and full preset option set', () => {
  const question = createQuestion({
    presetId: 'minor-extensions',
    rootMode: 'fixed',
    fixedRoot: 'D',
    randomFn: () => 0,
  });

  assert.equal(question.root, 'D');
  assert.equal(question.chordId, 'm7');
  assert.deepEqual(question.optionLabels, ['m7', 'm9', 'm11', 'm6 / m13']);
  assert.equal(question.signature, 'D:m7');
});

test('createQuestion avoids repeating the previous question when possible', () => {
  const sequence = [0, 0, 0.45];
  const question = createQuestion({
    presetId: 'basic-sevenths',
    rootMode: 'fixed',
    fixedRoot: 'C',
    previousSignature: 'C:maj7',
    randomFn: () => sequence.shift() ?? 0.7,
  });

  assert.notEqual(question.signature, 'C:maj7');
});

test('dorian preset stays focused on minor extension colors', () => {
  const preset = EAR_TRAINING_PRESETS.find(item => item.id === 'dorian-minor-extensions');

  assert.ok(preset);
  assert.deepEqual(preset.chordIds, ['m7', 'm9', 'm11', 'm6']);
  assert.match(preset.description, /Dorian/i);
});

test('getChordDefinition throws for unknown ids', () => {
  assert.throws(() => getChordDefinition('m69'), /Unknown chord/i);
});
