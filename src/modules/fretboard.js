import { KEY_GROUPS, SCALE_TYPES, NOTES, NOTE_NAMES_FLAT, DEGREE_LABELS, GUITAR_TUNING, getScaleNotes, buildSemiToNameMap } from '../core/music-theory.js';
import { createCustomSelect } from '../components/custom-select.js';

function buildScaleGroups(){
  const cats = {};
  SCALE_TYPES.forEach(s => { if(!cats[s.cat]) cats[s.cat] = []; cats[s.cat].push(s); });
  return Object.entries(cats).map(([cat, scales]) => ({
    label: cat,
    options: scales.map(s => ({value: s.id, label: s.name}))
  }));
}

let fbKeySel, fbScaleSel;
let fbDisplayMode = 'names';
const FRETS = 20;
const STRINGS = 6;

function noteToSemitone(n){
  let idx = NOTES.indexOf(n);
  if(idx >= 0) return idx;
  idx = NOTE_NAMES_FLAT.indexOf(n);
  if(idx >= 0) return idx;
  return -1;
}

function draw(){
  const root = fbKeySel.getValue();
  const scale = SCALE_TYPES.find(s => s.id === fbScaleSel.getValue());
  const showNames = fbDisplayMode === 'names';
  const showDeg = fbDisplayMode === 'degrees';
  const scaleNotes = getScaleNotes(root, scale);
  const rootSemi = noteToSemitone(root);
  const nameMap = buildSemiToNameMap(root, scale);

  const fretW = 60, strGap = 36;
  const startX = 50, startY = 30;
  const W = fretW * (FRETS + 1) + 40;
  const H = strGap * STRINGS + 40;
  const r = 13;

  let svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${W}" height="${H}" fill="#F5F0E8" rx="12"/>`;

  for(let f = 0; f <= FRETS; f++){
    const x = startX + f * fretW;
    svg += `<line x1="${x}" y1="${startY}" x2="${x}" y2="${startY + (STRINGS-1)*strGap}" stroke="${f===0 ? '#1E1B4B' : '#C8C0B4'}" stroke-width="${f===0?3:1}"/>`;
    if(f > 0) svg += `<text x="${x - fretW/2}" y="${startY + (STRINGS-1)*strGap + 24}" fill="#6B6560" font-size="11" text-anchor="middle">${f}</text>`;
  }

  [3,5,7,9,12,15,17,19].forEach(d => {
    if(d <= FRETS){
      const cx = startX + (d - 0.5) * fretW;
      if(d === 12){
        svg += `<circle cx="${cx}" cy="${startY + 1.5*strGap}" r="4" fill="#D4CFC6"/>`;
        svg += `<circle cx="${cx}" cy="${startY + 3.5*strGap}" r="4" fill="#D4CFC6"/>`;
      } else {
        svg += `<circle cx="${cx}" cy="${startY + 2.5*strGap}" r="4" fill="#D4CFC6"/>`;
      }
    }
  });

  for(let s = 0; s < STRINGS; s++){
    const y = startY + s * strGap;
    svg += `<line x1="${startX}" y1="${y}" x2="${startX + FRETS*fretW}" y2="${y}" stroke="#8A8070" stroke-width="${1 + s*0.3}"/>`;
    const openMidi = GUITAR_TUNING[STRINGS-1-s];
    const openSemi = openMidi % 12;
    const openName = nameMap ? (nameMap[openSemi] || NOTES[openSemi]) : NOTES[openSemi];
    svg += `<text x="${startX - 20}" y="${y + 4}" fill="#6B6560" font-size="11" text-anchor="middle">${openName}</text>`;
  }

  for(let s = 0; s < STRINGS; s++){
    for(let f = 0; f <= FRETS; f++){
      const midi = GUITAR_TUNING[STRINGS-1-s] + f;
      const semi = midi % 12;
      const note = NOTES[semi];
      if(scaleNotes.includes(note)){
        const x = f === 0 ? startX - 2 : startX + (f - 0.5) * fretW;
        const y = startY + s * strGap;
        const isRoot = semi === rootSemi;
        const deg = DEGREE_LABELS[(semi - rootSemi + 12) % 12];
        const displayNote = nameMap ? (nameMap[semi] || note) : note;

        svg += `<circle cx="${x}" cy="${y}" r="${r}" fill="${isRoot ? '#DC2626' : '#7C3AED'}" opacity="${isRoot ? 1 : 0.85}"/>`;

        if(showNames){
          svg += `<text x="${x}" y="${y + 4}" fill="#FFFFFF" font-size="${displayNote.length > 2 ? 8 : 10}" font-weight="600" text-anchor="middle">${displayNote}</text>`;
        } else if(showDeg){
          svg += `<text x="${x}" y="${y + 4}" fill="#FFFFFF" font-size="${deg.length > 3 ? 7 : 10}" font-weight="600" text-anchor="middle">${deg}</text>`;
        } else {
          svg += `<text x="${x}" y="${y + 4}" fill="#FFFFFF" font-size="${displayNote.length > 2 ? 8 : 10}" font-weight="600" text-anchor="middle">${displayNote}</text>`;
        }
      }
    }
  }

  svg += '</svg>';
  document.getElementById('fb-board').innerHTML = svg;
}

export function initFretboard(){
  const container = document.getElementById('mod-fretboard');
  container.innerHTML = `
    <div class="card">
      <h2>指板音阶</h2>
      <div class="controls">
        <span id="fb-key-mount"></span>
        <span id="fb-scale-mount"></span>
        <div class="degree-toggle" id="fb-display-toggle">
          <button class="active" data-show="names">\u97F3\u540D</button>
          <button data-show="degrees">\u7EA7\u6570</button>
        </div>
      </div>
      <div class="fretboard" id="fb-board"></div>
    </div>`;

  const fbKeyMount = document.getElementById('fb-key-mount');
  fbKeySel = createCustomSelect('fb-key', KEY_GROUPS.map(g => ({label:g.label, options:g.keys.map(k=>({value:k.root,label:k.name}))})), 'C');
  fbKeyMount.replaceWith(fbKeySel);
  fbKeySel.addEventListener('change', draw);

  const fbScaleMount = document.getElementById('fb-scale-mount');
  const scaleGroups = buildScaleGroups();
  fbScaleSel = createCustomSelect('fb-scale', scaleGroups, 'major');
  fbScaleMount.replaceWith(fbScaleSel);
  fbScaleSel.addEventListener('change', draw);
  document.getElementById('fb-display-toggle').addEventListener('click', e => {
    const btn = e.target.closest('button[data-show]');
    if(!btn) return;
    document.querySelectorAll('#fb-display-toggle button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    fbDisplayMode = btn.dataset.show;
    draw();
  });
  draw();
}
