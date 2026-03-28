import { createCustomSelect } from '../components/custom-select.js';
import { playChord } from '../core/audio-engine.js';
import {
  EAR_TRAINING_PRESETS,
  EAR_TRAINING_ROOTS,
  createQuestion,
} from '../core/chord-ear-training.js';

const QUESTION_DELAY_MS = 1400;

function createInitialState(){
  return {
    active: false,
    answered: false,
    correct: 0,
    wrong: 0,
    attempted: 0,
    currentQuestion: null,
    autoNext: false,
    rootMode: 'fixed',
    nextTimer: null,
  };
}

function buildPresetGroups(){
  return [{
    label: 'Chord Packs',
    options: EAR_TRAINING_PRESETS.map(preset => ({
      value: preset.id,
      label: preset.label,
    })),
  }];
}

function buildRootGroups(){
  return [{
    label: 'Chromatic Roots',
    options: EAR_TRAINING_ROOTS,
  }];
}

function renderQuestionPrompt(questionNumber){
  return `
    <div class="ear-prompt">
      <span class="ear-prompt-kicker">Question ${questionNumber}</span>
      <strong>Listen</strong>
      <p>Identify the chord quality from the current practice pack.</p>
    </div>
  `;
}

function renderFeedbackMarkup(question, isCorrect){
  const toneClass = isCorrect ? 'is-correct' : 'is-wrong';
  const toneLabel = isCorrect ? 'Correct' : 'Answer';
  const tensionText = question.definition.tensions.length
    ? question.definition.tensions.join(' / ')
    : 'None';

  return `
    <div class="ear-feedback ${toneClass}">
      <div class="ear-feedback-head">
        <span class="ear-feedback-status">${toneLabel}</span>
        <strong>${question.label}</strong>
      </div>
      <p>${question.definition.description}</p>
      <div class="ear-feedback-meta">
        <span><b>Notes:</b> ${question.noteLabels.join(' · ')}</span>
        <span><b>Tensions:</b> ${tensionText}</span>
      </div>
      <div class="ear-feedback-context">${question.presetDescription}</div>
    </div>
  `;
}

export function initEarTraining(){
  const container = document.getElementById('mod-earTraining');
  const state = createInitialState();

  container.innerHTML = `
    <div class="card">
      <h2>和弦练耳</h2>
      <p class="module-intro">先专注听和弦颜色，再把听感带回指板和 voicing。</p>
      <div class="controls ear-controls" id="et-controls"></div>
      <div class="stats">
        <span>正确: <b class="num" id="et-correct">0</b></span>
        <span>错误: <b class="num" id="et-wrong">0</b></span>
        <span>正确率: <b class="num" id="et-rate">0%</b></span>
        <span>已答: <b class="num" id="et-attempted">0</b></span>
      </div>
      <div class="question-display ear-question-display" id="et-question">
        ${renderQuestionPrompt(1)}
      </div>
      <div class="options-grid ear-options-grid" id="et-options"></div>
      <div class="ear-feedback-shell" id="et-feedback">
        <div class="ear-feedback-placeholder">选择练习包后点击“开始训练”。</div>
      </div>
    </div>
  `;

  const controls = document.getElementById('et-controls');

  const presetSelect = createCustomSelect('et-preset', buildPresetGroups(), EAR_TRAINING_PRESETS[0].id);
  controls.appendChild(presetSelect);

  const rootSelect = createCustomSelect('et-root', buildRootGroups(), 'C');
  controls.appendChild(rootSelect);

  const rootModeToggle = document.createElement('div');
  rootModeToggle.className = 'degree-toggle';
  rootModeToggle.id = 'et-root-mode';
  rootModeToggle.innerHTML = `
    <button class="active" data-mode="fixed">固定根音</button>
    <button data-mode="random">随机根音</button>
  `;
  controls.appendChild(rootModeToggle);

  const autoNextToggle = document.createElement('div');
  autoNextToggle.className = 'degree-toggle';
  autoNextToggle.id = 'et-auto-next';
  autoNextToggle.innerHTML = `
    <button class="active" data-auto="off">手动下一题</button>
    <button data-auto="on">自动下一题</button>
  `;
  controls.appendChild(autoNextToggle);

  const startButton = document.createElement('button');
  startButton.className = 'btn btn-primary';
  startButton.textContent = '开始训练';
  controls.appendChild(startButton);

  const replayButton = document.createElement('button');
  replayButton.className = 'btn btn-secondary';
  replayButton.textContent = '重播';
  controls.appendChild(replayButton);

  const nextButton = document.createElement('button');
  nextButton.className = 'btn btn-secondary';
  nextButton.textContent = '下一题';
  controls.appendChild(nextButton);

  const questionEl = document.getElementById('et-question');
  const optionsEl = document.getElementById('et-options');
  const feedbackEl = document.getElementById('et-feedback');

  function clearNextTimer(){
    if(state.nextTimer){
      clearTimeout(state.nextTimer);
      state.nextTimer = null;
    }
  }

  function updateStats(){
    document.getElementById('et-correct').textContent = state.correct;
    document.getElementById('et-wrong').textContent = state.wrong;
    document.getElementById('et-attempted').textContent = state.attempted;
    const rate = state.attempted
      ? Math.round((state.correct / state.attempted) * 100)
      : 0;
    document.getElementById('et-rate').textContent = `${rate}%`;
  }

  function renderOptions(question){
    optionsEl.innerHTML = '';

    question.optionIds.forEach((optionId, index) => {
      const button = document.createElement('button');
      button.className = 'opt-btn';
      button.type = 'button';
      button.textContent = question.optionLabels[index];
      button.dataset.optionId = optionId;
      button.addEventListener('click', () => handleAnswer(optionId, button));
      optionsEl.appendChild(button);
    });
  }

  function renderQuestion(question){
    questionEl.innerHTML = renderQuestionPrompt(state.attempted + 1);
    feedbackEl.innerHTML = '<div class="ear-feedback-placeholder">先听，再选。</div>';
    renderOptions(question);
  }

  async function playCurrentQuestion(){
    if(!state.currentQuestion) return;
    await playChord(state.currentQuestion.audioNotes, { duration: 1.35 });
  }

  async function loadNextQuestion(){
    clearNextTimer();
    state.answered = false;
    state.currentQuestion = createQuestion({
      presetId: presetSelect.getValue(),
      rootMode: state.rootMode,
      fixedRoot: rootSelect.getValue(),
      previousSignature: state.currentQuestion?.signature ?? null,
    });
    renderQuestion(state.currentQuestion);
    await playCurrentQuestion();
  }

  async function startSession(){
    clearNextTimer();
    state.active = true;
    state.answered = false;
    state.correct = 0;
    state.wrong = 0;
    state.attempted = 0;
    state.currentQuestion = null;
    updateStats();
    await loadNextQuestion();
  }

  function lockOptionButtons(){
    optionsEl.querySelectorAll('.opt-btn').forEach(button => {
      button.disabled = true;
      button.style.pointerEvents = 'none';
    });
  }

  function markCorrectAnswer(question){
    optionsEl.querySelectorAll('.opt-btn').forEach(button => {
      if(button.dataset.optionId === question.chordId){
        button.classList.add('correct');
      }
    });
  }

  function scheduleNextQuestion(){
    if(!state.autoNext) return;
    clearNextTimer();
    state.nextTimer = setTimeout(() => {
      state.nextTimer = null;
      loadNextQuestion();
    }, QUESTION_DELAY_MS);
  }

  function handleAnswer(optionId, button){
    if(!state.active || state.answered || !state.currentQuestion) return;

    state.answered = true;
    state.attempted += 1;

    const isCorrect = optionId === state.currentQuestion.chordId;
    if(isCorrect){
      state.correct += 1;
      button.classList.add('correct');
    } else {
      state.wrong += 1;
      button.classList.add('wrong');
    }

    lockOptionButtons();
    markCorrectAnswer(state.currentQuestion);
    updateStats();
    feedbackEl.innerHTML = renderFeedbackMarkup(state.currentQuestion, isCorrect);
    scheduleNextQuestion();
  }

  function updateRootMode(toggleButton){
    state.rootMode = toggleButton.dataset.mode;
    rootModeToggle.querySelectorAll('button').forEach(button => {
      button.classList.toggle('active', button === toggleButton);
    });
  }

  function updateAutoNext(toggleButton){
    state.autoNext = toggleButton.dataset.auto === 'on';
    autoNextToggle.querySelectorAll('button').forEach(button => {
      button.classList.toggle('active', button === toggleButton);
    });
    if(!state.autoNext){
      clearNextTimer();
    }
  }

  startButton.addEventListener('click', () => {
    startSession();
  });

  replayButton.addEventListener('click', () => {
    playCurrentQuestion();
  });

  nextButton.addEventListener('click', () => {
    if(!state.active){
      startSession();
      return;
    }
    loadNextQuestion();
  });

  rootModeToggle.addEventListener('click', event => {
    const toggleButton = event.target.closest('button[data-mode]');
    if(!toggleButton) return;
    updateRootMode(toggleButton);
  });

  autoNextToggle.addEventListener('click', event => {
    const toggleButton = event.target.closest('button[data-auto]');
    if(!toggleButton) return;
    updateAutoNext(toggleButton);
  });

  [presetSelect, rootSelect].forEach(select => {
    select.addEventListener('change', () => {
      if(state.active){
        startSession();
      }
    });
  });

  updateStats();
}
