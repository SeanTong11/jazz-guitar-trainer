import './styles/theme.css';
import './styles/modules.css';
import { initNoteDegree } from './modules/note-degree.js';
import { initFretboard } from './modules/fretboard.js';
import { initChordDiagrams } from './modules/chord-diagrams.js';
import { initEarTraining } from './modules/ear-training.js';

document.getElementById('mainNav').addEventListener('click', e => {
  const btn = e.target.closest('.nav-btn');
  if(!btn) return;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
  document.getElementById('mod-' + btn.dataset.mod).classList.add('active');
});

initNoteDegree();
initFretboard();
initChordDiagrams();
initEarTraining();
