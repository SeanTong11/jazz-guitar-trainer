import { createCustomSelect } from '../components/custom-select.js';
import { playPlaybackEvents } from '../core/audio-engine.js';
import {
  BASE_CHORD_TYPES,
  EXTENSION_OPTIONS,
  TRAINING_TEMPLATES,
  buildChordPool,
  buildPlaybackEvents,
  createQuestion,
  EAR_TRAINING_ROOTS,
  getChordDefinition,
} from '../core/chord-ear-training.js';

const QUESTION_DELAY_MS = 1400;
const PLAYBACK_MODE_LABELS = {
  chord: '和弦',
  arpeggio: '琶音',
  both: '先琶音后和弦',
};

function cloneTemplateConfig(template){
  return {
    baseChordIds: [...template.baseChordIds],
    extensionIds: [...template.extensionIds],
    playbackMode: template.playbackMode,
  };
}

function createInitialState(){
  const initialTemplate = TRAINING_TEMPLATES[0];
  return {
    active: false,
    answered: false,
    correct: 0,
    wrong: 0,
    attempted: 0,
    currentQuestion: null,
    autoNext: false,
    rootMode: 'fixed',
    selectedTemplateId: initialTemplate.id,
    config: cloneTemplateConfig(initialTemplate),
    nextTimer: null,
  };
}

function buildTemplateGroups(){
  return [{
    label: 'Quick Templates',
    options: [
      { value: 'custom', label: 'Custom' },
      ...TRAINING_TEMPLATES.map(template => ({
        value: template.id,
        label: template.label,
      })),
    ],
  }];
}

function buildRootGroups(){
  return [{
    label: 'Chromatic Roots',
    options: EAR_TRAINING_ROOTS,
  }];
}

function renderQuestionPrompt(questionNumber, playbackMode, optionCount){
  return `
    <div class="ear-prompt">
      <span class="ear-prompt-kicker">
        Question ${questionNumber} · ${PLAYBACK_MODE_LABELS[playbackMode]} · ${optionCount} Options
      </span>
      <strong>Listen</strong>
      <p>Identify the chord quality from the current configuration.</p>
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
      <div class="ear-feedback-context">${PLAYBACK_MODE_LABELS[question.playbackMode]} playback</div>
    </div>
  `;
}

function renderChipButtons(items, selectedIds, kind){
  return items.map(item => `
    <button
      type="button"
      class="choice-chip ${selectedIds.includes(item.id) ? 'active' : ''}"
      data-kind="${kind}"
      data-id="${item.id}"
    >
      <span class="choice-chip-title">${item.label}</span>
      <span class="choice-chip-subtitle">${item.description}</span>
    </button>
  `).join('');
}

export function initEarTraining(){
  const container = document.getElementById('mod-earTraining');
  const state = createInitialState();

  container.innerHTML = `
    <div class="card">
      <h2>和弦练耳</h2>
      <p class="module-intro">模板只是起点，核心是自己配置 base chord、extension 和播放方式。</p>
      <div class="ear-config-panel">
        <div class="controls ear-controls" id="et-controls"></div>
        <div class="ear-chip-section">
          <div class="ear-section-head">
            <h3>Base Chords</h3>
            <span>先决定题库里的和弦家族</span>
          </div>
          <div class="choice-chip-grid" id="et-base-grid"></div>
        </div>
        <div class="ear-chip-section">
          <div class="ear-section-head">
            <h3>Extensions</h3>
            <span>决定是否只听 base、还是加入 9 / 11 / 13</span>
          </div>
          <div class="choice-chip-grid" id="et-ext-grid"></div>
        </div>
        <div class="ear-pool-preview" id="et-preview"></div>
      </div>
      <div class="controls ear-action-controls">
        <button class="btn btn-primary" id="et-start">开始训练</button>
        <button class="btn btn-secondary" id="et-replay">重播</button>
        <button class="btn btn-secondary" id="et-next">下一题</button>
      </div>
      <div class="stats">
        <span>正确: <b class="num" id="et-correct">0</b></span>
        <span>错误: <b class="num" id="et-wrong">0</b></span>
        <span>正确率: <b class="num" id="et-rate">0%</b></span>
        <span>已答: <b class="num" id="et-attempted">0</b></span>
      </div>
      <div class="question-display ear-question-display" id="et-question">
        ${renderQuestionPrompt(1, state.config.playbackMode, buildChordPool(state.config).length)}
      </div>
      <div class="options-grid ear-options-grid" id="et-options"></div>
      <div class="ear-feedback-shell" id="et-feedback">
        <div class="ear-feedback-placeholder">先配置题库，再开始训练。</div>
      </div>
    </div>
  `;

  const controls = document.getElementById('et-controls');
  const baseGrid = document.getElementById('et-base-grid');
  const extGrid = document.getElementById('et-ext-grid');
  const previewEl = document.getElementById('et-preview');
  const questionEl = document.getElementById('et-question');
  const optionsEl = document.getElementById('et-options');
  const feedbackEl = document.getElementById('et-feedback');

  const templateSelect = createCustomSelect('et-template', buildTemplateGroups(), state.selectedTemplateId);
  controls.appendChild(templateSelect);

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

  const playbackToggle = document.createElement('div');
  playbackToggle.className = 'degree-toggle degree-toggle-wide';
  playbackToggle.id = 'et-playback-mode';
  playbackToggle.innerHTML = `
    <button class="active" data-playback="chord">和弦</button>
    <button data-playback="arpeggio">琶音</button>
    <button data-playback="both">先琶音后和弦</button>
  `;
  controls.appendChild(playbackToggle);

  const autoNextToggle = document.createElement('div');
  autoNextToggle.className = 'degree-toggle';
  autoNextToggle.id = 'et-auto-next';
  autoNextToggle.innerHTML = `
    <button class="active" data-auto="off">手动下一题</button>
    <button data-auto="on">自动下一题</button>
  `;
  controls.appendChild(autoNextToggle);

  const startButton = document.getElementById('et-start');
  const replayButton = document.getElementById('et-replay');
  const nextButton = document.getElementById('et-next');

  function clearNextTimer(){
    if(state.nextTimer){
      clearTimeout(state.nextTimer);
      state.nextTimer = null;
    }
  }

  function getCurrentPool(){
    return buildChordPool(state.config);
  }

  function setTemplateSelection(templateId){
    state.selectedTemplateId = templateId;
    templateSelect.setValue(templateId);
  }

  function markAsCustom(){
    setTemplateSelection('custom');
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

  function updatePreview(){
    const pool = getCurrentPool();
    const labels = pool.map(chordId => getChordDefinition(chordId).answerLabel);
    previewEl.innerHTML = `
      <div class="ear-preview-head">
        <strong>Current Pool</strong>
        <span>${pool.length} chords · ${PLAYBACK_MODE_LABELS[state.config.playbackMode]}</span>
      </div>
      <div class="ear-preview-list">${labels.join(' · ')}</div>
    `;
    rootSelect.classList.toggle('is-disabled', state.rootMode === 'random');
  }

  function renderConfigChips(){
    baseGrid.innerHTML = renderChipButtons(BASE_CHORD_TYPES, state.config.baseChordIds, 'base');
    extGrid.innerHTML = renderChipButtons(EXTENSION_OPTIONS, state.config.extensionIds, 'extension');
    playbackToggle.querySelectorAll('button').forEach(button => {
      button.classList.toggle('active', button.dataset.playback === state.config.playbackMode);
    });
    updatePreview();
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
    questionEl.innerHTML = renderQuestionPrompt(
      state.attempted + 1,
      state.config.playbackMode,
      question.optionIds.length,
    );
    feedbackEl.innerHTML = '<div class="ear-feedback-placeholder">先听，再选。</div>';
    renderOptions(question);
  }

  async function playCurrentQuestion(){
    if(!state.currentQuestion) return;
    const events = buildPlaybackEvents(state.currentQuestion.audioNotes, state.config.playbackMode);
    await playPlaybackEvents(events);
  }

  async function loadNextQuestion(){
    clearNextTimer();
    state.answered = false;
    state.currentQuestion = createQuestion({
      config: state.config,
      rootMode: state.rootMode,
      fixedRoot: rootSelect.getValue(),
      previousSignature: state.currentQuestion?.signature ?? null,
    });
    state.currentQuestion.playbackMode = state.config.playbackMode;
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

  function restartIfActive(){
    if(state.active){
      startSession();
    } else {
      updatePreview();
      questionEl.innerHTML = renderQuestionPrompt(1, state.config.playbackMode, getCurrentPool().length);
    }
  }

  function toggleListValue(list, value){
    if(list.includes(value)){
      if(list.length === 1) return list;
      return list.filter(item => item !== value);
    }
    return [...list, value];
  }

  function applyTemplate(templateId){
    const template = TRAINING_TEMPLATES.find(item => item.id === templateId);
    if(!template) return;
    state.config = cloneTemplateConfig(template);
    setTemplateSelection(template.id);
    renderConfigChips();
    restartIfActive();
  }

  function handleConfigMutation(updater){
    state.config = updater(state.config);
    markAsCustom();
    renderConfigChips();
    restartIfActive();
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

  templateSelect.addEventListener('change', event => {
    const nextValue = event.detail?.value ?? templateSelect.getValue();
    if(nextValue === 'custom'){
      setTemplateSelection('custom');
      return;
    }
    applyTemplate(nextValue);
  });

  rootSelect.addEventListener('change', () => {
    restartIfActive();
  });

  rootModeToggle.addEventListener('click', event => {
    const toggleButton = event.target.closest('button[data-mode]');
    if(!toggleButton) return;
    state.rootMode = toggleButton.dataset.mode;
    rootModeToggle.querySelectorAll('button').forEach(button => {
      button.classList.toggle('active', button === toggleButton);
    });
    restartIfActive();
  });

  playbackToggle.addEventListener('click', event => {
    const toggleButton = event.target.closest('button[data-playback]');
    if(!toggleButton) return;
    handleConfigMutation(config => ({
      ...config,
      playbackMode: toggleButton.dataset.playback,
    }));
  });

  autoNextToggle.addEventListener('click', event => {
    const toggleButton = event.target.closest('button[data-auto]');
    if(!toggleButton) return;
    state.autoNext = toggleButton.dataset.auto === 'on';
    autoNextToggle.querySelectorAll('button').forEach(button => {
      button.classList.toggle('active', button === toggleButton);
    });
    if(!state.autoNext){
      clearNextTimer();
    }
  });

  baseGrid.addEventListener('click', event => {
    const button = event.target.closest('button[data-kind="base"]');
    if(!button) return;
    handleConfigMutation(config => ({
      ...config,
      baseChordIds: toggleListValue(config.baseChordIds, button.dataset.id),
    }));
  });

  extGrid.addEventListener('click', event => {
    const button = event.target.closest('button[data-kind="extension"]');
    if(!button) return;
    handleConfigMutation(config => ({
      ...config,
      extensionIds: toggleListValue(config.extensionIds, button.dataset.id),
    }));
  });

  renderConfigChips();
  updateStats();
}
