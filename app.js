// --- Sound Manager (Web Audio API Synthesizer) ---
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = muted;
  }

  playClick() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playCorrect() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 -> E5 -> G5 -> C6
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.06);
      
      gain.gain.setValueAtTime(0, now + index * 0.06);
      gain.gain.linearRampToValueAtTime(0.12, now + index * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.06 + 0.25);
      
      osc.start(now + index * 0.06);
      osc.stop(now + index * 0.06 + 0.3);
    });
  }

  playWrong() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.35);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    
    osc.start();
    osc.stop(now + 0.4);
  }

  playDrumroll() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const duration = 1.6;
    
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const time = i / this.ctx.sampleRate;
      const modulation = 0.3 + 0.7 * Math.abs(Math.sin(time * Math.PI * 35));
      data[i] = (Math.random() * 2 - 1) * modulation;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.exponentialRampToValueAtTime(380, now + duration);
    filter.Q.setValueAtTime(1.5, now);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.2, now + duration - 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start(now);
    
    setTimeout(() => {
      this.playCymbal();
    }, (duration - 0.15) * 1000);
  }

  playCymbal() {
    if (this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.6);
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3200, now);
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start(now);
    osc.start(now);
    
    noise.stop(now + 0.6);
    osc.stop(now + 0.6);
  }

  playTada() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    
    const chord1 = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    chord1.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.6);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.6);
    });
    
    setTimeout(() => {
      if (this.muted) return;
      const now2 = this.ctx.currentTime;
      const chord2 = [329.63, 392.00, 523.25, 659.25]; // E4, G4, C5, E5
      chord2.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now2);
        
        gain.gain.setValueAtTime(0, now2);
        gain.gain.linearRampToValueAtTime(0.06, now2 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.005, now2 + 0.7);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now2);
        osc.stop(now2 + 0.75);
      });
    }, 180);
  }

  playBeep(freq, type = 'sine', duration = 0.15) {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playPump() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.12);
    
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }
  
  playTick() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }
}

// --- Confetti particle engine ---
class ConfettiEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.colors = ['#00f0ff', '#ff007f', '#ffd700', '#00ff88', '#ffffff', '#ff9f00'];
    
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  burst() {
    for (let i = 0; i < 120; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: -20 - Math.random() * 100,
        size: Math.random() * 8 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 4 + 3,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.08 + 0.04,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2
      });
    }
    
    if (!this.animationId) {
      this.animate();
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.particles.length === 0) {
      this.animationId = null;
      return;
    }
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.wobble) * 1.5;
      p.wobble += p.wobbleSpeed;
      p.rotation += p.rotationSpeed;
      
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation * Math.PI / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();
      
      if (p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
      }
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

// --- Quiz Questions Data ---
const quizData = [
  {
    id: 1,
    question: "청년부 예배 드리는 예배당의 이름은 무엇인가요?",
    type: "multiple",
    choices: ["갈릴리", "갈보리", "로고스", "임마누엘"],
    answerIndex: 0,
    answerText: "1) 갈릴리",
    explanation: "우리가 예배를 드리는 예배당의 이름은 갈릴리홀입니다."
  },
  {
    id: 2,
    question: "예수님은 어디에서 나셨나요?",
    type: "multiple",
    choices: ["구유", "두유", "지푸라기", "산부인과"],
    answerIndex: 0,
    answerText: "1) 구유",
    explanation: "성경 구절: 구유 (눅 2:7)"
  },
  {
    id: 3,
    question: "이번 베트남 단기선교를 가는 밀알 청년은 몇 명인가요?",
    type: "multiple",
    choices: ["2명", "3명", "4명", "아무도 안간다"],
    answerIndex: 1,
    answerText: "2) 3명",
    explanation: "단기선교 참석 청년: 양희온, 이원영, 정환희"
  },
  {
    id: 4,
    question: "우리가 예수님을 믿는 것은 전적으로 인간의 선택에 달려 있다.",
    type: "ox",
    choices: ["O", "X"],
    answerIndex: 1,
    answerText: "X",
    explanation: "믿음은 인간의 선택이 아니라 하나님의 은혜이자 선물입니다."
  },
  {
    id: 5,
    question: "효력 있는 부르심은 무엇인가요?",
    type: "multiple2",
    choices: ["외적 부르심", "내적 부르심"],
    answerIndex: 1,
    answerText: "2) 내적 부르심",
    explanation: "효력 있는 부르심은 성령님의 역사로 인한 내적 부르심을 뜻합니다."
  },
  {
    id: 6,
    question: "밀알 하계 수련회 시작 날짜는 언제인가요?",
    type: "multiple",
    choices: ["8월 14일", "8월 20일", "8월 13일", "8월 21일"],
    answerIndex: 1,
    answerText: "2) 8월 20일",
    explanation: "밀알 하계 수련회는 8월 20일에 시작됩니다."
  },
  {
    id: 7,
    question: "스트릿 예배에 참석한 밀알 청년 수는 몇 명인가요?",
    type: "multiple",
    choices: ["19명", "21명", "22명", "24명"],
    answerIndex: 2,
    answerText: "3) 22명",
    explanation: "스트릿 예배에 동참해 자리를 지켜준 밀알 청년은 총 22명입니다."
  },
  {
    id: 8,
    question: "밀알 1년차 중에서 생일이 가장 빠른 청년은 누구인가요?",
    type: "multiple",
    choices: ["홍예인", "정민우", "홍민기", "정태훈"],
    answerIndex: 3,
    answerText: "4) 정태훈",
    explanation: "정태훈 청년의 생일은 1월 8일로 가장 빠릅니다."
  },
  {
    id: 9,
    question: "밀알에는 정씨가 몇 명 있을까요?",
    type: "multiple",
    choices: ["7명", "8명", "9명", "10명"],
    answerIndex: 1,
    answerText: "2) 8명",
    explanation: "정씨 성을 가진 8명: 정민우, 정태훈, 정환희, 정세윤, 정예건, 정기영, 정하임, 정혜성"
  },
  {
    id: 10,
    question: "밀알 제적 인원은 몇 명인가요?",
    type: "multiple",
    choices: ["80명", "81명", "82명", "83명"],
    answerIndex: 2,
    answerText: "3) 82명",
    explanation: "현재 밀알 청년부 제적 인원은 82명입니다."
  },
  {
    id: 11,
    question: "예수님은 이 땅에서의 '삶' 동안 무엇 아래에 사셨나요?",
    type: "multiple",
    choices: ["은혜", "사랑", "성전", "율법"],
    answerIndex: 3,
    answerText: "4) 율법",
    explanation: "성경 구절: 율법 (갈 4:4)"
  },
  {
    id: 12,
    question: "밀알 총무님의 전공은 무엇인가요?",
    type: "multiple",
    choices: ["디지털미디어디자인", "시각디자인", "디지털그래픽디자인", "미디어콘텐츠디자인"],
    answerIndex: 0,
    answerText: "1) 디지털미디어디자인",
    explanation: "밀알 총무님의 대학 전공은 디지털미디어디자인입니다."
  },
  {
    id: 13,
    question: "밀알 서기님의 키는 몇 일까요?",
    type: "multiple",
    choices: ["159.5cm", "160cm", "160.5cm", "161cm"],
    answerIndex: 3,
    answerText: "4) 161cm",
    explanation: "서기님의 실제 키는 161cm입니다."
  },
  {
    id: 14,
    question: "목사님의 마라탕 최애 재료는 무엇일까요?",
    type: "multiple",
    choices: ["중간 당면", "실곤약", "넓적 당면", "넓적 분모자"],
    answerIndex: 0,
    answerText: "1) 중간 당면",
    explanation: "목사님의 마라탕 최애 재료는 쫄깃한 중간 당면입니다."
  },
  {
    id: 15,
    question: "청년부 예배를 드리는 갈릴리홀 총 의자 개수는 몇 개인가요?",
    type: "multiple",
    choices: ["222개", "224개", "226개", "228개"],
    answerIndex: 3,
    answerText: "4) 228개",
    explanation: "갈릴리홀에 배치된 총 의자 개수는 228개입니다."
  },
  {
    id: 16,
    question: "4층 소그룹실은 6개이다.",
    type: "ox",
    choices: ["O", "X"],
    answerIndex: 1,
    answerText: "X",
    explanation: "해설: 5개입니다. (패자부활전)"
  },
  {
    id: 17,
    question: "우리 교회 건물은 총 8층까지 있다.",
    type: "ox",
    choices: ["O", "X"],
    answerIndex: 1,
    answerText: "X",
    explanation: "해설: 지하 3층 ~ 지상 6층 = 총 9개 층입니다. (패자부활전)"
  }
];

// --- Unison Game (이구동성) Data ---
const unisonWords = ["느부갓네살", "사마라아인", "여호와이레", "요한계시록", "갈보리언덕", "여리고성벽", "시몬베드로", "데살로니가", "나아만장군", "야곱의축복"];
const unisonTelepathy = [
  { q: "짜장면 vs 짬뽕", left: "짜장면", right: "짬뽕" },
  { q: "부먹 vs 찍먹", left: "부먹", right: "찍먹" },
  { q: "여름 vs 겨울", left: "여름", right: "겨울" },
  { q: "갈릴리홀 vs 본당", left: "갈릴리홀", right: "본당" },
  { q: "넓적당면 vs 중간당면", left: "넓적당면", right: "중간당면" },
  { q: "아아 vs 따아", left: "아아", right: "따아" },
  { q: "탕수육 vs 깐풍기", left: "탕수육", right: "깐풍기" }
];

// --- Mission Roulette Data ---
const rouletteTools = ["종이컵", "방석", "윷놀이", "종이", "두꺼운 빨대", "발", "손", "머리", "유성매직"];
const rouletteBodies = [];

// --- App State ---
let currentView = 'menu'; // 'menu' | 'quiz' | 'unison' | 'race'
let quizCurrentIdx = 0;
const quizRevealedQuestions = new Set();
let quizSelectedChoiceIdx = null;

// Unison State
let unisonCurrentIdx = 0;
let unisonWordArr = [];
let unisonWordRevealed = [false, false, false, false, false];

// Balloon Race Sub-Tab State
let raceTab = 'bracket'; // 'bracket' | 'roulette'
let raceProgress = [0, 0, 0, 0];
let raceWinnerIdx = null;

// Bracket Tournament State (5 Teams)
let bracketTeams = ["밀 팀", "알 팀", "오락 팀", "관 팀", "청년 팀"];
let round1ByeIdx = 4; // Default to Team 5 (index 4)
let round2ByeSlot = 2; // Default to Slot C (index 2 - Round 1 Bye slot)
let bracketWinners = {
  match1: null, // 'A' or 'B'
  match2: null, // 'A' or 'B'
  match3: null, // 'A' or 'B' (Semifinal)
  match4: null  // 'A' or 'B' (Final)
};

// Roulette State
let isRouletteSpinning = false;

// --- DOM References (Initialized Lazily) ---
let btnGotoMenu, btnToggleSound, soundIcon, soundLabel, btnResetAll;
let menuView, quizView, unisonView, raceView;
let quizBadge, quizQuestionText, quizChoicesContainer, explanationContainer, explanationText, quizCardContent, questionNavDots;
let btnPrevQuestion, btnNextQuestion, btnRevealAnswer, btnPlayDrumroll, btnPlayTada;
let btnHideAllSyllables, btnRevealAllSyllables;
let btnPrevUnison, btnNextUnison, unisonBadge, unisonNavDots;
let btnRaceTabBracket, btnRaceTabRoulette;
let raceBracketPane, raceRoulettePane;
let raceWinnerModal, raceWinnerName, btnResetRaceWinner;
let btnSpinRoulette, rouletteResultDisplay, slotLever;
let reelTool, reelBody;
let rouletteWheelCanvas; // unused stub
let inputTeamNames = [];
let btnResetBracket;

// Instantiate Audio and Confetti
const sounds = new SoundEffects();
let confetti = null;

function initDOMRefs() {
  btnGotoMenu = document.getElementById('btn-goto-menu');
  btnToggleSound = document.getElementById('btn-toggle-sound');
  soundIcon = document.getElementById('sound-icon');
  soundLabel = document.getElementById('sound-label');
  btnResetAll = document.getElementById('btn-reset-all');

  menuView = document.getElementById('main-menu-view');
  quizView = document.getElementById('quiz-view');
  unisonView = document.getElementById('unison-view');
  raceView = document.getElementById('race-view');

  quizBadge = document.getElementById('quiz-badge-id');
  quizQuestionText = document.getElementById('quiz-question-text');
  quizChoicesContainer = document.getElementById('quiz-choices-container');
  explanationContainer = document.getElementById('explanation-container');
  explanationText = document.getElementById('explanation-text');
  quizCardContent = document.getElementById('quiz-card-content');
  questionNavDots = document.getElementById('question-nav-dots');

  btnPrevQuestion = document.getElementById('btn-prev-question');
  btnNextQuestion = document.getElementById('btn-next-question');
  btnRevealAnswer = document.getElementById('btn-reveal-answer');
  btnPlayDrumroll = document.getElementById('btn-play-drumroll');
  btnPlayTada = document.getElementById('btn-play-tada');

  // Unison DOM refs
  btnHideAllSyllables = document.getElementById('btn-hide-all-syllables');
  btnRevealAllSyllables = document.getElementById('btn-reveal-all-syllables');
  btnPrevUnison = document.getElementById('btn-prev-unison');
  btnNextUnison = document.getElementById('btn-next-unison');
  unisonBadge = document.getElementById('unison-badge-id');
  unisonNavDots = document.getElementById('unison-nav-dots');


  btnRaceTabBracket = document.getElementById('btn-race-tab-bracket');
  btnRaceTabRoulette = document.getElementById('btn-race-tab-roulette');
  raceBracketPane = document.getElementById('race-bracket-pane');
  raceRoulettePane = document.getElementById('race-roulette-pane');

  raceWinnerModal = document.getElementById('race-winner-modal');
  raceWinnerName = document.getElementById('race-winner-name');
  btnResetRaceWinner = document.getElementById('btn-reset-race-winner');

  btnSpinRoulette = document.getElementById('btn-spin-roulette');
  rouletteResultDisplay = document.getElementById('roulette-result-display');
  slotLever = document.getElementById('slot-lever');
  reelTool = document.getElementById('reel-tool');
  reelBody = document.getElementById('reel-body');
  rouletteWheelCanvas = null; // no longer used

  inputTeamNames = [
    document.getElementById('input-team-0'),
    document.getElementById('input-team-1'),
    document.getElementById('input-team-2'),
    document.getElementById('input-team-3'),
    document.getElementById('input-team-4')
  ];
  btnResetBracket = document.getElementById('btn-reset-bracket');
}

// --- View Navigation ---
function showView(viewName) {
  currentView = viewName;
  
  menuView.style.display = 'none';
  quizView.style.display = 'none';
  unisonView.style.display = 'none';
  raceView.style.display = 'none';
  
  if (viewName === 'menu') {
    menuView.style.display = 'flex';
    btnGotoMenu.style.display = 'none';
  } else {
    btnGotoMenu.style.display = 'flex';
    if (viewName === 'quiz') quizView.style.display = 'flex';
    if (viewName === 'unison') {
      unisonView.style.display = 'flex';
    }
    if (viewName === 'race') {
      raceView.style.display = 'flex';
      showRaceTab('bracket');
    }
  }
}

function setupViews() {
  document.getElementById('card-launch-quiz').onclick = () => { sounds.playClick(); showView('quiz'); };
  document.getElementById('card-launch-unison').onclick = () => { sounds.playClick(); showView('unison'); };
  document.getElementById('card-launch-race').onclick = () => { sounds.playClick(); showView('race'); };
  
  btnGotoMenu.onclick = () => {
    sounds.playClick();
    showView('menu');
  };
}

// --- Global Actions ---
function setupGlobalControls() {
  btnToggleSound.onclick = () => {
    sounds.playClick();
    sounds.muted = !sounds.muted;
    if (sounds.muted) {
      soundIcon.textContent = '🔇';
      soundLabel.textContent = '음소거됨';
      btnToggleSound.style.borderColor = 'rgba(255, 0, 0, 0.4)';
    } else {
      soundIcon.textContent = '🔊';
      soundLabel.textContent = '소리 켬';
      btnToggleSound.style.borderColor = '';
    }
  };

  btnResetAll.onclick = () => {
    if (confirm('모든 게임의 진행 상황을 완전히 초기화하시겠습니까?')) {
      sounds.playClick();
      // Quiz reset
      quizRevealedQuestions.clear();
      quizCurrentIdx = 0;
      setupQuiz();
      
      // Unison reset
      unisonCurrentIdx = 0;
      loadUnisonWord(0);
      
      // Bracket reset
      resetBracketState();
      
      showView('menu');
    }
  };
}

// --- 1. QUIZ MODULE ---
function setupQuiz() {
  generateNavDots();
  renderQuestion();

  btnPrevQuestion.onclick = () => { sounds.playClick(); navigateQuizTo(quizCurrentIdx - 1); };
  btnNextQuestion.onclick = () => { sounds.playClick(); navigateQuizTo(quizCurrentIdx + 1); };
  btnRevealAnswer.onclick = revealQuizAnswer;
  btnPlayDrumroll.onclick = () => sounds.playDrumroll();
  btnPlayTada.onclick = () => sounds.playTada();
}

function generateNavDots() {
  questionNavDots.innerHTML = '';

  // Split into two rows: 1~8 (idx 0~7) and 9~end (idx 8~)
  const firstRowEnd = 8; // first 8 questions
  const rowWrapper1 = document.createElement('div');
  rowWrapper1.style.cssText = 'display:flex; flex-wrap:wrap; gap:0.6rem; justify-content:center;';
  const rowWrapper2 = document.createElement('div');
  rowWrapper2.style.cssText = 'display:flex; flex-wrap:wrap; gap:0.6rem; justify-content:center;';

  quizData.forEach((q, idx) => {
    const isRes = idx >= 15;
    const dot = document.createElement('button');
    dot.className = `nav-dot ${isRes ? 'resurrection' : ''}`;
    dot.id = `nav-dot-${idx}`;
    dot.textContent = isRes ? `패${idx - 14}` : idx + 1;
    dot.title = q.question;
    dot.onclick = () => {
      sounds.playClick();
      navigateQuizTo(idx);
    };
    if (idx < firstRowEnd) {
      rowWrapper1.appendChild(dot);
    } else {
      rowWrapper2.appendChild(dot);
    }
  });

  questionNavDots.appendChild(rowWrapper1);
  questionNavDots.appendChild(rowWrapper2);
  updateQuizNavDots();
}

function updateQuizNavDots() {
  quizData.forEach((_, idx) => {
    const dot = document.getElementById(`nav-dot-${idx}`);
    if (!dot) return;
    
    if (idx === quizCurrentIdx) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
    
    if (quizRevealedQuestions.has(idx)) {
      dot.classList.add('visited');
    } else {
      dot.classList.remove('visited');
    }
  });
}

function renderQuestion() {
  const q = quizData[quizCurrentIdx];
  quizSelectedChoiceIdx = null;
  
  if (quizCurrentIdx >= 15) {
    quizBadge.textContent = `패자부활전 ${quizCurrentIdx - 14}`;
    quizBadge.classList.add('resurrection-mode');
  } else {
    quizBadge.textContent = `QUESTION ${String(q.id).padStart(2, '0')}`;
    quizBadge.classList.remove('resurrection-mode');
  }
  
  quizQuestionText.textContent = q.question;
  quizChoicesContainer.innerHTML = '';
  
  if (q.type === 'ox') {
    quizChoicesContainer.className = 'choices-grid ox-layout';
  } else {
    quizChoicesContainer.className = 'choices-grid';
  }
  
  q.choices.forEach((choice, idx) => {
    const card = document.createElement('button');
    if (q.type === 'ox') {
      card.className = `choice-card ${choice === 'O' ? 'choice-o' : 'choice-x'}`;
      card.innerHTML = `<span class="choice-text">${choice}</span>`;
    } else {
      card.className = 'choice-card';
      card.innerHTML = `
        <span class="choice-num">${idx + 1}</span>
        <span class="choice-text">${choice}</span>
      `;
    }
    card.id = `choice-card-${idx}`;
    card.onclick = () => selectQuizChoice(idx);
    quizChoicesContainer.appendChild(card);
  });
  
  explanationContainer.style.display = 'none';
  btnRevealAnswer.textContent = '정답 확인';
  btnRevealAnswer.classList.remove('active-mode');
  
  if (quizRevealedQuestions.has(quizCurrentIdx)) {
    applyQuizRevealUI();
  }
  
  quizCardContent.classList.remove('slide-enter-active');
  void quizCardContent.offsetWidth; 
  quizCardContent.classList.add('slide-enter-active');
  
  updateQuizNavDots();
}

function selectQuizChoice(idx) {
  if (quizRevealedQuestions.has(quizCurrentIdx)) return;
  sounds.playClick();
  quizSelectedChoiceIdx = idx;
  
  const cards = quizChoicesContainer.querySelectorAll('.choice-card');
  cards.forEach((card, cIdx) => {
    if (cIdx === idx) {
      card.style.borderColor = 'var(--accent-gold)';
      card.style.background = 'rgba(255, 215, 0, 0.05)';
    } else {
      card.style.borderColor = '';
      card.style.background = '';
    }
  });
}

function revealQuizAnswer() {
  console.log('[REVEAL] called, quizCurrentIdx=', quizCurrentIdx);
  console.log('[REVEAL] already revealed?', quizRevealedQuestions.has(quizCurrentIdx));

  if (quizRevealedQuestions.has(quizCurrentIdx)) {
    // Already showing answer → hide it
    console.log('[REVEAL] hiding answer');
    quizRevealedQuestions.delete(quizCurrentIdx);

    // Reset UI directly (don't call renderQuestion to avoid side effects)
    var cards = quizChoicesContainer.querySelectorAll('.choice-card');
    quizChoicesContainer.classList.remove('revealed');
    cards.forEach(function(card) {
      card.classList.remove('correct');
      card.style.cssText = '';
    });
    explanationContainer.style.display = 'none';
    btnRevealAnswer.textContent = '정답 확인';
    btnRevealAnswer.classList.remove('active-mode');
    updateQuizNavDots();
    return;
  }

  // Show answer
  console.log('[REVEAL] showing answer');
  quizRevealedQuestions.add(quizCurrentIdx);

  try { sounds.playCorrect(); } catch(e) { console.warn('sound error', e); }
  try { confetti.burst(); } catch(e) { console.warn('confetti error', e); }

  var q = quizData[quizCurrentIdx];
  var cards = quizChoicesContainer.querySelectorAll('.choice-card');

  console.log('[REVEAL] q.answerIndex=', q.answerIndex, 'cards.length=', cards.length);

  quizChoicesContainer.classList.add('revealed');

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    if (i === q.answerIndex) {
      card.classList.add('correct');
      card.style.background = 'rgba(0, 255, 136, 0.12)';
      card.style.borderColor = 'var(--accent-green)';
      card.style.boxShadow = '0 0 25px rgba(0,255,136,0.3)';
      card.style.opacity = '1';
    } else {
      card.style.opacity = '0.25';
      card.style.pointerEvents = 'none';
    }
  }

  explanationText.textContent = q.answerText + (q.explanation ? ' — ' + q.explanation : '');
  explanationContainer.style.display = 'flex';
  console.log('[REVEAL] explanationContainer display set to:', explanationContainer.style.display);

  btnRevealAnswer.textContent = '정답 가리기';
  btnRevealAnswer.classList.add('active-mode');

  updateQuizNavDots();
  console.log('[REVEAL] done');
}

function applyQuizRevealUI() {
  // Called from renderQuestion() when revisiting an already-revealed question
  var q = quizData[quizCurrentIdx];
  var cards = quizChoicesContainer.querySelectorAll('.choice-card');

  quizChoicesContainer.classList.add('revealed');

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    if (i === q.answerIndex) {
      card.classList.add('correct');
      card.style.background = 'rgba(0, 255, 136, 0.12)';
      card.style.borderColor = 'var(--accent-green)';
      card.style.boxShadow = '0 0 25px rgba(0,255,136,0.3)';
      card.style.opacity = '1';
    } else {
      card.style.opacity = '0.25';
      card.style.pointerEvents = 'none';
    }
  }

  explanationText.textContent = q.answerText + (q.explanation ? ' — ' + q.explanation : '');
  explanationContainer.style.display = 'flex';

  btnRevealAnswer.textContent = '정답 가리기';
  btnRevealAnswer.classList.add('active-mode');

  updateQuizNavDots();
}

function navigateQuizTo(idx) {
  if (idx < 0 || idx >= quizData.length) return;
  quizCurrentIdx = idx;
  renderQuestion();
}

// --- 2. UNISON GAME MODULE (이구동성 5글자) ---
function setupUnison() {
  btnHideAllSyllables.onclick = hideAllSyllables;
  btnRevealAllSyllables.onclick = revealAllSyllables;

  btnPrevUnison.onclick = function() { sounds.playClick(); navigateUnison(-1); };
  btnNextUnison.onclick = function() { sounds.playClick(); navigateUnison(1); };

  for (var i = 0; i < 5; i++) {
    (function(idx) {
      var card = document.getElementById('syllable-card-' + idx);
      if (card) card.onclick = function() { toggleSyllableCard(idx); };
    })(i);
  }

  generateUnisonNavDots();
  loadUnisonWord(0);
}

function generateUnisonNavDots() {
  unisonNavDots.innerHTML = '';

  var firstRowEnd = 5;
  var row1 = document.createElement('div');
  row1.style.cssText = 'display:flex; flex-wrap:wrap; gap:0.6rem; justify-content:center;';
  var row2 = document.createElement('div');
  row2.style.cssText = 'display:flex; flex-wrap:wrap; gap:0.6rem; justify-content:center;';

  for (var i = 0; i < unisonWords.length; i++) {
    (function(idx) {
      var dot = document.createElement('button');
      dot.className = 'nav-dot';
      dot.id = 'unison-nav-dot-' + idx;
      dot.textContent = idx + 1;
      dot.title = '문제 ' + (idx + 1);
      dot.onclick = function() {
        sounds.playClick();
        loadUnisonWord(idx);
      };
      if (idx < firstRowEnd) {
        row1.appendChild(dot);
      } else {
        row2.appendChild(dot);
      }
    })(i);
  }

  unisonNavDots.appendChild(row1);
  unisonNavDots.appendChild(row2);
}

function updateUnisonNavDots() {
  for (var i = 0; i < unisonWords.length; i++) {
    var dot = document.getElementById('unison-nav-dot-' + i);
    if (!dot) continue;
    if (i === unisonCurrentIdx) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  }
}

function loadUnisonWord(idx) {
  unisonCurrentIdx = idx;
  var word = unisonWords[idx];
  unisonWordArr = word.split('');
  unisonWordRevealed = [false, false, false, false, false];

  unisonBadge.textContent = '이구동성 ' + String(idx + 1).padStart(2, '0');
  renderSyllableCards();
  updateUnisonNavDots();
}

function navigateUnison(dir) {
  var next = unisonCurrentIdx + dir;
  if (next < 0 || next >= unisonWords.length) return;
  loadUnisonWord(next);
}

function renderSyllableCards() {
  for (var i = 0; i < 5; i++) {
    var card = document.getElementById('syllable-card-' + i);
    if (!card) continue;
    var charElem = card.querySelector('.syllable-char');

    if (unisonWordRevealed[i]) {
      card.classList.add('revealed');
      charElem.textContent = unisonWordArr[i] || '?';
    } else {
      card.classList.remove('revealed');
      charElem.textContent = '?';
    }
  }
}

function toggleSyllableCard(idx) {
  sounds.playClick();
  unisonWordRevealed[idx] = !unisonWordRevealed[idx];
  renderSyllableCards();
  if (unisonWordRevealed.every(function(v) { return v; })) {
    sounds.playTada();
    confetti.burst();
  }
}

function hideAllSyllables() {
  sounds.playClick();
  unisonWordRevealed = [false, false, false, false, false];
  renderSyllableCards();
}

function revealAllSyllables() {
  sounds.playCorrect();
  unisonWordRevealed = [true, true, true, true, true];
  renderSyllableCards();
  confetti.burst();
}

// --- 3. BALLOON RACE MODULE (Bracket & Roulette) ---
function setupRace() {
  btnRaceTabBracket.onclick = () => showRaceTab('bracket');
  btnRaceTabRoulette.onclick = () => showRaceTab('roulette');

  // 3-1. Tournament Bracket - use event delegation for reliability
  // Team name inputs
  inputTeamNames.forEach((input, idx) => {
    if (!input) return;
    input.addEventListener('input', (e) => {
      bracketTeams[idx] = e.target.value;
      renderBracket();
    });
  });

  // Win & bye buttons via event delegation on the bracket pane
  raceBracketPane.addEventListener('click', (e) => {
    const winBtn = e.target.closest('.btn-action-win');
    if (winBtn) {
      const match = winBtn.getAttribute('data-match');
      const side = winBtn.getAttribute('data-side');
      setBracketWinner(match, side);
      return;
    }
    const byeBtn = e.target.closest('.btn-designate-bye');
    if (byeBtn) {
      const round = parseInt(byeBtn.getAttribute('data-round'));
      if (round === 1) {
        const teamIdx = parseInt(byeBtn.getAttribute('data-team'));
        setRound1Bye(teamIdx);
      } else if (round === 2) {
        const slotIdx = parseInt(byeBtn.getAttribute('data-slot'));
        setRound2Bye(slotIdx);
      }
      return;
    }
    const resetBtn = e.target.closest('#btn-reset-bracket');
    if (resetBtn) {
      resetBracketState();
    }
  });

  // 3-2. Slot Machine Roulette
  btnSpinRoulette.onclick = triggerSlotSpin;
  if (slotLever) slotLever.onclick = triggerSlotSpin;
  buildSlotStrips();
}

function showRaceTab(tab) {
  raceTab = tab;
  
  btnRaceTabBracket.classList.remove('active-tab');
  btnRaceTabRoulette.classList.remove('active-tab');
  
  raceBracketPane.style.display = 'none';
  raceRoulettePane.style.display = 'none';

  if (tab === 'bracket') {
    btnRaceTabBracket.classList.add('active-tab');
    raceBracketPane.style.display = 'block';
    renderBracket();
  } else if (tab === 'roulette') {
    btnRaceTabRoulette.classList.add('active-tab');
    raceRoulettePane.style.display = 'block';
  }
}


// 3-2. Tournament Bracket rendering and logic
function setRound1Bye(teamIdx) {
  sounds.playClick();
  round1ByeIdx = teamIdx;
  
  bracketWinners.match1 = null;
  bracketWinners.match2 = null;
  bracketWinners.match3 = null;
  bracketWinners.match4 = null;
  
  round2ByeSlot = 2;
  renderBracket();
}

function setRound2Bye(slotIdx) {
  sounds.playClick();
  round2ByeSlot = slotIdx;
  
  bracketWinners.match3 = null;
  bracketWinners.match4 = null;
  renderBracket();
}

function setBracketWinner(match, side) {
  sounds.playClick();
  const matchKey = `match${match}`;

  // Toggle: clicking the same winner again cancels it
  if (bracketWinners[matchKey] === side) {
    bracketWinners[matchKey] = null;
    // Reset downstream matches if we undo a win
    if (match === '1' || match === '2') {
      bracketWinners.match3 = null;
      bracketWinners.match4 = null;
    } else if (match === '3') {
      bracketWinners.match4 = null;
    }
    renderBracket();
    return;
  }

  bracketWinners[matchKey] = side;

  if (match === '1' || match === '2') {
    bracketWinners.match3 = null;
    bracketWinners.match4 = null;
  } else if (match === '3') {
    bracketWinners.match4 = null;
  }

  renderBracket();
  
  if (match === '4') {
    sounds.playTada();
    confetti.burst();
  }
}

function renderBracket() {
  const pairings = getRound1Pairings();
  
  document.querySelector('#b-team-m1-a .node-name').textContent = bracketTeams[pairings.match1[0]];
  document.querySelector('#b-team-m1-b .node-name').textContent = bracketTeams[pairings.match1[1]];
  document.querySelector('#b-team-m2-a .node-name').textContent = bracketTeams[pairings.match2[0]];
  document.querySelector('#b-team-m2-b .node-name').textContent = bracketTeams[pairings.match2[1]];

  applyNodeWinUI('#b-team-m1-a', bracketWinners.match1 === 'A');
  applyNodeWinUI('#b-team-m1-b', bracketWinners.match1 === 'B');
  applyNodeWinUI('#b-team-m2-a', bracketWinners.match2 === 'A');
  applyNodeWinUI('#b-team-m2-b', bracketWinners.match2 === 'B');

  document.querySelectorAll('[data-round="1"]').forEach(btn => {
    const idx = parseInt(btn.getAttribute('data-team'));
    if (idx === round1ByeIdx) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const semis = getSemifinalSlots(pairings);

  document.querySelector('#b-team-m3-a .node-name').textContent = semis.match3[0] ? semis.match3[0].name : "대기 중";
  document.querySelector('#b-team-m3-b .node-name').textContent = semis.match3[1] ? semis.match3[1].name : "대기 중";
  document.querySelector('#b-team-m4-b .node-name').textContent = semis.bye ? semis.bye.name : "대기 중";

  applyNodeWinUI('#b-team-m3-a', bracketWinners.match3 === 'A');
  applyNodeWinUI('#b-team-m3-b', bracketWinners.match3 === 'B');

  document.querySelectorAll('[data-round="2"]').forEach(btn => {
    const idx = parseInt(btn.getAttribute('data-slot'));
    if (idx === round2ByeSlot) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
    
    if (idx === 0) btn.textContent = `예선1승자`;
    if (idx === 1) btn.textContent = `예선2승자`;
    if (idx === 2) btn.textContent = `1R부전승`;
  });

  const finalistA = bracketWinners.match3 === 'A' ? semis.match3[0] : (bracketWinners.match3 === 'B' ? semis.match3[1] : null);
  const finalistB = semis.bye;

  document.querySelector('#b-team-m4-a .node-name').textContent = finalistA ? finalistA.name : "결승 진출자 A";
  document.querySelector('#b-team-m4-c .node-name').textContent = finalistB ? finalistB.name : "결승 진출자 B";

  applyNodeWinUI('#b-team-m4-a', bracketWinners.match4 === 'A');
  applyNodeWinUI('#b-team-m4-c', bracketWinners.match4 === 'B');

  const champName = document.getElementById('bracket-champion-name');
  if (bracketWinners.match4 === 'A' && finalistA) {
    champName.textContent = finalistA.name;
    document.getElementById('bracket-champion').style.borderColor = 'var(--accent-green)';
    document.getElementById('bracket-champion').style.boxShadow = '0 0 25px var(--accent-green-glow)';
  } else if (bracketWinners.match4 === 'B' && finalistB) {
    champName.textContent = finalistB.name;
    document.getElementById('bracket-champion').style.borderColor = 'var(--accent-green)';
    document.getElementById('bracket-champion').style.boxShadow = '0 0 25px var(--accent-green-glow)';
  } else {
    champName.textContent = "???";
    document.getElementById('bracket-champion').style.borderColor = 'var(--accent-gold)';
    document.getElementById('bracket-champion').style.boxShadow = '0 0 25px var(--accent-gold-glow)';
  }
}

function applyNodeWinUI(selector, active) {
  const node = document.querySelector(selector);
  if (!node) return;
  if (active) {
    node.classList.add('win-active');
  } else {
    node.classList.remove('win-active');
  }
}

function getRound1Pairings() {
  const active = [];
  for (let i = 0; i < 5; i++) {
    if (i !== round1ByeIdx) active.push(i);
  }
  return {
    match1: [active[0], active[1]],
    match2: [active[2], active[3]],
    bye: round1ByeIdx
  };
}

function getSemifinalSlots(pairings) {
  const name1 = bracketWinners.match1 === 'A' ? bracketTeams[pairings.match1[0]] : (bracketWinners.match1 === 'B' ? bracketTeams[pairings.match1[1]] : null);
  const name2 = bracketWinners.match2 === 'A' ? bracketTeams[pairings.match2[0]] : (bracketWinners.match2 === 'B' ? bracketTeams[pairings.match2[1]] : null);
  
  const slots = [
    { type: 'match1', name: name1 || "예선1 승자" },
    { type: 'match2', name: name2 || "예선2 승자" },
    { type: 'bye1', name: bracketTeams[pairings.bye] }
  ];
  
  const activeSemis = [];
  let byeSemi = null;
  for (let i = 0; i < 3; i++) {
    if (i === round2ByeSlot) {
      byeSemi = slots[i];
    } else {
      activeSemis.push(slots[i]);
    }
  }
  
  return {
    match3: activeSemis,
    bye: byeSemi
  };
}

function resetBracketState() {
  sounds.playClick();
  bracketWinners = { match1: null, match2: null, match3: null, match4: null };
  round1ByeIdx = 4;
  round2ByeSlot = 2;
  
  bracketTeams = ["밀 팀", "알 팀", "오락 팀", "관 팀", "청년 팀"];
  inputTeamNames.forEach((input, idx) => {
    input.value = bracketTeams[idx];
  });
  
  renderBracket();
}


// --- 3-2. Single Reel Item Picker ---
const slotItems = ['종이컵', '방석', '윷놀이', '종이', '두꺼운 빨대', '발', '손', '머리', '유성매직'];

// Item height in px (matches CSS .picker-item height)
const SLOT_ITEM_H = 110;
let isSlotSpinning = false;
// Track last result index to ensure it can differ each spin
let lastPickedIdx = -1;

function buildSlotStrips() {
  if (!reelTool) return;
  reelTool.innerHTML = '';

  // Repeat items many times so scroll always has room
  const repeats = 40;
  for (let r = 0; r < repeats; r++) {
    slotItems.forEach(item => {
      const el = document.createElement('div');
      el.className = 'picker-item';
      el.textContent = item;
      reelTool.appendChild(el);
    });
  }

  // Start in the middle
  const midOffset = Math.floor(repeats / 2) * slotItems.length * SLOT_ITEM_H;
  reelTool.style.transition = 'none';
  reelTool.style.transform = `translateY(-${midOffset}px)`;
}

function getReelCurrentOffset(reel) {
  try {
    const style = window.getComputedStyle(reel);
    const matrix = new (window.DOMMatrix || window.WebKitCSSMatrix)(style.transform);
    return Math.abs(matrix.m42);
  } catch (e) {
    const m = reel.style.transform.match(/translateY\(-?([\d.]+)px\)/);
    return m ? parseFloat(m[1]) : 0;
  }
}

function triggerSlotSpin() {
  if (isSlotSpinning) return;
  isSlotSpinning = true;

  // Hide result
  if (rouletteResultDisplay) {
    rouletteResultDisplay.style.opacity = '0';
    rouletteResultDisplay.classList.remove('picker-result-pop');
  }

  sounds.playDrumroll();

  // Pick a random item — avoid repeating same as last
  let pickedIdx;
  do {
    pickedIdx = Math.floor(Math.random() * slotItems.length);
  } while (pickedIdx === lastPickedIdx && slotItems.length > 1);
  lastPickedIdx = pickedIdx;

  // FIXED APPROACH: always start from the same known "safe zone" in the middle
  // This prevents the offset from accumulating across spins
  const repeats = 40;
  const safeStartCycle = Math.floor(repeats * 0.35); // start at 35% through the repeats
  const safeStartOffset = safeStartCycle * slotItems.length * SLOT_ITEM_H;

  // Reset reel position to safeStart instantly (no transition)
  reelTool.style.transition = 'none';
  reelTool.style.transform = `translateY(-${safeStartOffset}px)`;

  // Force reflow so the instant reset takes effect before animation begins
  void reelTool.offsetHeight;

  // Calculate landing: spin 8-12 full cycles from safe start, then land on target
  const spinCycles = 8 + Math.floor(Math.random() * 5);

  // targetOffset places the strip so that:
  //   top of viewport   = item at (safeStart + spinCycles*N + pickedIdx - 1)
  //   CENTER of viewport = item at (safeStart + spinCycles*N + pickedIdx)  ← this is what user sees
  //   bottom of viewport = item at (safeStart + spinCycles*N + pickedIdx + 1)
  // Subtracting SLOT_ITEM_H shifts the selected item into the CENTER row
  const targetOffset = safeStartOffset
    + spinCycles * slotItems.length * SLOT_ITEM_H
    + pickedIdx * SLOT_ITEM_H
    - SLOT_ITEM_H; // ← center alignment: push picked item from top to middle slot

  // The DOM 1-based child index of the CENTER item
  // Center item strip-index = (targetOffset / H) + 1, so nth-child = that + 1
  const targetChildIndex = Math.round(targetOffset / SLOT_ITEM_H) + 2;

  // Animate spin
  requestAnimationFrame(() => {
    reelTool.style.transition = `transform 2.8s cubic-bezier(0.08, 0.82, 0.17, 1)`;
    reelTool.style.transform = `translateY(-${targetOffset}px)`;
  });

  // Tick sounds during spin
  let tickCount = 0;
  const tickInterval = setInterval(() => {
    if (!isSlotSpinning || tickCount > 28) { clearInterval(tickInterval); return; }
    sounds.playTick();
    tickCount++;
  }, 90);

  // Landing
  setTimeout(() => {
    clearInterval(tickInterval);
    isSlotSpinning = false;

    // Clear old highlights
    const allItems = reelTool.querySelectorAll('.picker-item');
    allItems.forEach(el => el.classList.remove('picker-item-active'));

    // Highlight landed item
    const landedEl = reelTool.querySelector(`.picker-item:nth-child(${targetChildIndex})`);
    if (landedEl) landedEl.classList.add('picker-item-active');

    // Show result
    if (rouletteResultDisplay) {
      rouletteResultDisplay.textContent = `🎯 ${slotItems[pickedIdx]}`;
      rouletteResultDisplay.style.opacity = '1';
      void rouletteResultDisplay.offsetWidth;
      rouletteResultDisplay.classList.add('picker-result-pop');
    }

    sounds.playTada();
    confetti.burst();
  }, 2850);
}


// Keyboard shortcuts removed — button clicks only

// --- Dynamic Initialization Bootstrap ---
function init() {
  initDOMRefs();
  setupViews();
  setupQuiz();
  setupUnison();
  setupRace();
  setupGlobalControls();
  // keyboard shortcuts removed
}

// Bootstrap check
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
