import { createCustomSelect } from '../components/custom-select.js';
import { playPlaybackEvents } from '../core/audio-engine.js';
import {
  BASE_CHORD_TYPES,
  TENSION_OPTIONS,
  TRAINING_TEMPLATES,
  VOICING_OPTIONS,
  buildChordPool,
  buildPlaybackEvents,
  createQuestion,
  EAR_TRAINING_ROOTS,
  getAvailableVoicingOptionIds,
  getChordDefinition,
} from '../core/chord-ear-training.js';

const QUESTION_DELAY_MS = 1400;
const PLAYBACK_MODE_LABELS = {
  chord: '和弦',
  arpeggio: '琶音',
  both: '先琶音后和弦',
};
const VOICING_MODE_LABELS = Object.fromEntries(
  VOICING_OPTIONS.map(option => [option.id, option.label]),
);

function cloneTemplateConfig(template){
  return {
    baseChordIds: [...template.baseChordIds],
    tensionIds: [...template.tensionIds],
    playbackMode: template.playbackMode,
    voicingMode: template.voicingMode ?? 'close-root',
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

function renderQuestionPrompt(questionNumber, playbackMode, voicingMode, optionCount){
  return `
    <div class="ear-prompt">
      <span class="ear-prompt-kicker">
        Question ${questionNumber} · ${PLAYBACK_MODE_LABELS[playbackMode]} · ${VOICING_MODE_LABELS[voicingMode]} · ${optionCount} Options
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
        <span><b>Voicing:</b> ${question.voicingLabel}</span>
      </div>
      <div class="ear-feedback-context">${PLAYBACK_MODE_LABELS[question.playbackMode]} playback · ${question.voicingLabel}</div>
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
      <p class="module-intro">模板只是起点，核心是自己配置 base chord、单个 tension、播放方式和转位。当前版本仅支持封闭排列。</p>
      <div class="ear-config-panel">
        <div class="controls ear-controls" id="et-controls"></div>
        <div class="ear-chip-section">
          <div class="ear-section-head">
            <h3>Base Chords</h3>
            <span>三和弦、6 和弦、7 和弦都可以进题库</span>
          </div>
          <div class="choice-chip-grid" id="et-base-grid"></div>
        </div>
        <div class="ear-chip-section">
          <div class="ear-section-head">
            <h3>Tension</h3>
            <span>每道题只会取一个 tension，比如 none、♭9、9、♯9</span>
          </div>
          <div class="choice-chip-grid" id="et-ext-grid"></div>
        </div>
        <div class="ear-pool-preview" id="et-preview"></div>
      </div>
      <div class="controls ear-action-controls">
        <button class="btn btn-primary" id="et-start">开始训练</button>
        <button class="btn btn-secondary" id="et-replay">重播</button>
        <button class="btn btn-secondary" id="et-replay-arpeggio">重播琶音</button>
        <button class="btn btn-secondary" id="et-next">下一题</button>
      </div>
      <div class="stats">
        <span>正确: <b class="num" id="et-correct">0</b></span>
        <span>错误: <b class="num" id="et-wrong">0</b></span>
        <span>正确率: <b class="num" id="et-rate">0%</b></span>
        <span>已答: <b class="num" id="et-attempted">0</b></span>
      </div>
      <div class="question-display ear-question-display" id="et-question">
        ${renderQuestionPrompt(1, state.config.playbackMode, state.config.voicingMode, buildChordPool(state.config).length)}
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

  const voicingToggle = document.createElement('div');
  voicingToggle.className = 'degree-toggle degree-toggle-wide';
  voicingToggle.id = 'et-voicing-mode';
  voicingToggle.innerHTML = `
    <button class="active" data-voicing="close-root">原位</button>
    <button data-voicing="close-first">一转</button>
    <button data-voicing="close-second">二转</button>
    <button data-voicing="close-third">三转</button>
    <button data-voicing="close-random">随机</button>
  `;
  controls.appendChild(voicingToggle);

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
  const replayArpeggioButton = document.getElementById('et-replay-arpeggio');
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

  function normalizeConfig(nextConfig){
    const availableVoicingIds = getAvailableVoicingOptionIds(nextConfig);
    const fallbackVoicingId = availableVoicingIds[0] ?? 'close-root';
    return {
      ...nextConfig,
      voicingMode: availableVoicingIds.includes(nextConfig.voicingMode)
        ? nextConfig.voicingMode
        : fallbackVoicingId,
    };
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
    rootSelect.setDisabled(state.rootMode === 'random');
    startButton.disabled = pool.length === 0;

    if(!pool.length){
      previewEl.innerHTML = `
        <div class="ear-preview-head">
          <strong>Current Pool</strong>
          <span>0 chords · ${PLAYBACK_MODE_LABELS[state.config.playbackMode]} · ${VOICING_MODE_LABELS[state.config.voicingMode]}</span>
        </div>
        <div class="ear-preview-empty">当前选择没有生成出有效题目，请至少保留一个兼容的 base chord + tension 组合。</div>
      `;
      return;
    }

    const labels = pool.map(chordId => getChordDefinition(chordId).answerLabel);
    previewEl.innerHTML = `
      <div class="ear-preview-head">
        <strong>Current Pool</strong>
        <span>${pool.length} chords · ${PLAYBACK_MODE_LABELS[state.config.playbackMode]} · ${VOICING_MODE_LABELS[state.config.voicingMode]}</span>
      </div>
      <div class="ear-preview-list">${labels.join(' · ')}</div>
    `;
  }

  function renderConfigChips(){
    const availableVoicingIds = getAvailableVoicingOptionIds(state.config);
    baseGrid.innerHTML = renderChipButtons(BASE_CHORD_TYPES, state.config.baseChordIds, 'base');
    extGrid.innerHTML = renderChipButtons(TENSION_OPTIONS, state.config.tensionIds, 'tension');
    playbackToggle.querySelectorAll('button').forEach(button => {
      button.classList.toggle('active', button.dataset.playback === state.config.playbackMode);
    });
    voicingToggle.querySelectorAll('button').forEach(button => {
      const isAvailable = availableVoicingIds.includes(button.dataset.voicing);
      button.disabled = !isAvailable;
      button.classList.toggle('is-disabled', !isAvailable);
      button.classList.toggle('active', button.dataset.voicing === state.config.voicingMode);
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
        question.voicingMode,
        question.optionIds.length,
      );
    feedbackEl.innerHTML = '<div class="ear-feedback-placeholder">先听，再选。</div>';
    renderOptions(question);
  }

  async function playCurrentQuestion(playbackMode = state.config.playbackMode){
    if(!state.currentQuestion) return;
    const events = buildPlaybackEvents(state.currentQuestion.audioNotes, playbackMode);
    await playPlaybackEvents(events);
  }

  function showEmptyPoolState(){
    clearNextTimer();
    state.active = false;
    state.answered = false;
    state.currentQuestion = null;
    questionEl.innerHTML = renderQuestionPrompt(
      1,
      state.config.playbackMode,
      state.config.voicingMode,
      0,
    );
    optionsEl.innerHTML = '';
    feedbackEl.innerHTML = '<div class="ear-feedback-placeholder">当前配置没有可用题目，请先调整题库。</div>';
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
    if(!getCurrentPool().length){
      showEmptyPoolState();
      return;
    }
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
    if(!getCurrentPool().length){
      updatePreview();
      showEmptyPoolState();
      return;
    }

    if(state.active){
      startSession();
    } else {
      updatePreview();
      questionEl.innerHTML = renderQuestionPrompt(
        1,
        state.config.playbackMode,
        state.config.voicingMode,
        getCurrentPool().length,
      );
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
    state.config = normalizeConfig(cloneTemplateConfig(template));
    setTemplateSelection(template.id);
    renderConfigChips();
    restartIfActive();
  }

  function handleConfigMutation(updater){
    state.config = normalizeConfig(updater(state.config));
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

  replayArpeggioButton.addEventListener('click', () => {
    playCurrentQuestion('arpeggio');
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

  voicingToggle.addEventListener('click', event => {
    const toggleButton = event.target.closest('button[data-voicing]');
    if(!toggleButton || toggleButton.disabled) return;
    handleConfigMutation(config => ({
      ...config,
      voicingMode: toggleButton.dataset.voicing,
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
    const button = event.target.closest('button[data-kind="tension"]');
    if(!button) return;
    handleConfigMutation(config => ({
      ...config,
      tensionIds: toggleListValue(config.tensionIds, button.dataset.id),
    }));
  });

  renderConfigChips();
  updateStats();
}
