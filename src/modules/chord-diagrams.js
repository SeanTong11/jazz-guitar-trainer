const CATEGORIES = [
  { id:'basic', name:'Basic Chords', subcats:[
    {id:'maj7',name:'Major 7',img:'maj7.png'},
    {id:'dom7',name:'Dominant 7',img:'dom7.png'},
    {id:'min7',name:'Minor 7',img:'min7.png'},
    {id:'min7b5',name:'Minor 7b5',img:'min7b5.png'},
    {id:'dim7',name:'Diminished 7',img:'dim7.png'},
  ]},
  { id:'shell', name:'Shell Chords', subcats:[
    {id:'shell-137-e',name:'1-3-7 (E Root)',img:'shell-137-e.png'},
    {id:'shell-173-e',name:'1-7-3 (E Root)',img:'shell-173-e.png'},
    {id:'shell-137-a',name:'1-3-7 (A Root)',img:'shell-137-a.png'},
    {id:'shell-173-a',name:'1-7-3 (A Root)',img:'shell-173-a.png'},
  ]},
  { id:'ext-maj', name:'Extended (Major)', subcats:[
    {id:'maj6',name:'Major 6',img:'maj6.png'},
    {id:'maj69',name:'Major 6/9',img:'maj69.png'},
    {id:'maj9',name:'Major 9',img:'maj9.png'},
    {id:'maj13',name:'Major 13',img:'maj13.png'},
    {id:'maj7s11',name:'Major 7#11',img:'maj7s11.png'},
    {id:'maj7s5',name:'Major 7#5',img:'maj7s5.png'},
  ]},
  { id:'ext-dom', name:'Extended (Dominant)', subcats:[
    {id:'dom9',name:'Dominant 9',img:'dom9.png'},
    {id:'dom13',name:'Dominant 13',img:'dom13.png'},
  ]},
  { id:'ext-sus', name:'Sus Chords', subcats:[
    {id:'sus4-7',name:'7 Sus 4',img:'sus4-7.png'},
    {id:'sus4-9',name:'9 Sus 4',img:'sus4-9.png'},
    {id:'sus4-13',name:'13 Sus 4',img:'sus4-13.png'},
  ]},
  { id:'ext-min', name:'Extended (Minor)', subcats:[
    {id:'min6',name:'Minor 6',img:'min6.png'},
    {id:'min9-11',name:'Minor 9 / 11',img:'min9-11.png'},
    {id:'minmaj7',name:'Minor/Major 7',img:'minmaj7.png'},
    {id:'minmaj9',name:'Minor/Major 9',img:'minmaj9.png'},
  ]},
  { id:'altered', name:'Altered Dominant', subcats:[
    {id:'dom7b9',name:'7b9',img:'dom7b9.png'},
    {id:'dom7b9sus4',name:'7b9 Sus 4',img:'dom7b9sus4.png'},
    {id:'dom13b9-s9',name:'13b9 / 13#9',img:'dom13b9-s9.png'},
    {id:'dom7s9',name:'7#9',img:'dom7s9.png'},
    {id:'dom7s11',name:'7#11',img:'dom7s11.png'},
    {id:'dom7b13',name:'7b13',img:'dom7b13.png'},
    {id:'alt-b5',name:'Altered b5',img:'alt-b5.png'},
    {id:'alt-s5',name:'Altered #5',img:'alt-s5.png'},
  ]},
  { id:'drop2', name:'Drop 2 Inversions', subcats:[
    {id:'drop2-maj7',name:'Major 7',img:'drop2-maj7.png'},
    {id:'drop2-dom7',name:'Dominant 7',img:'drop2-dom7.png'},
    {id:'drop2-min7',name:'Minor 7',img:'drop2-min7.png'},
    {id:'drop2-min7b5',name:'Minor 7b5',img:'drop2-min7b5.png'},
  ]},
  { id:'drop3', name:'Drop 3 Inversions', subcats:[
    {id:'drop3-maj7',name:'Major 7',img:'drop3-maj7.png'},
    {id:'drop3-dom7',name:'Dominant 7',img:'drop3-dom7.png'},
    {id:'drop3-min7',name:'Minor 7',img:'drop3-min7.png'},
    {id:'drop3-min7b5',name:'Minor 7b5',img:'drop3-min7b5.png'},
  ]},
  { id:'open', name:'Open Chords', subcats:[
    {id:'open-e',name:'E Root',img:'open-e.png'},
    {id:'open-a',name:'A Root',img:'open-a.png'},
    {id:'open-db',name:'D / B Root',img:'open-db.png'},
    {id:'open-bbc',name:'Bb / C Root',img:'open-bbc.png'},
  ]},
  { id:'quartal', name:'Quartal Chords', subcats:[
    {id:'quartal',name:'C Dorian',img:'quartal.png'},
  ]},
];

function renderCatButtons(){
  return CATEGORIES.map(cat => `
    <div class="chord-cat-group collapsed">
      <button class="chord-cat-toggle" data-cat="${cat.id}">${cat.name}</button>
      <div class="chord-cat-btns">
        ${cat.subcats.map(sc => `<button class="chord-subcat-btn" data-img="${sc.img}">${sc.name}</button>`).join('')}
      </div>
    </div>
  `).join('');
}

function showChord(imgFile){
  const viewer = document.getElementById('cd-viewer');
  viewer.innerHTML = `<div style="display:flex;justify-content:center"><img src="/chords/${imgFile}" alt="Chord diagram" style="width:100%;max-width:800px;border-radius:12px;box-shadow:4px 4px 12px rgba(0,0,0,0.08)"></div>`;
}

export function initChordDiagrams() {
  const container = document.getElementById('mod-chordDiagram');
  container.innerHTML = `
    <div class="card">
      <h2>Jazz Guitar Chord Dictionary</h2>
      <p style="color:var(--text-muted);font-size:.85rem;margin-bottom:16px">244 chord diagrams &mdash; Source: Jazz Guitar Online</p>
      <div class="cd-layout">
        <div class="cd-sidebar">${renderCatButtons()}</div>
        <div class="cd-content" id="cd-viewer">
          <p style="text-align:center;color:var(--text-muted);padding:40px">Select a chord type from the left</p>
        </div>
      </div>
    </div>
  `;
  container.querySelectorAll('.chord-cat-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.parentElement.classList.toggle('collapsed');
    });
  });

  container.querySelectorAll('.chord-subcat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.chord-subcat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showChord(btn.dataset.img);
    });
  });
}
