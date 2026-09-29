import json
import os

# 1. Load questions
with open('questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# 2. Load background & farm images
with open('gemini_images_b64.json', 'r', encoding='utf-8') as f:
    gemini_imgs = json.load(f)

# 3. Load Don Jacinto sprites
with open('jacinto_sprites_b64.json', 'r', encoding='utf-8') as f:
    sprites = json.load(f)

# 4. Load Gonzalo Neural TTS voices
with open('assets/datos/gonzalo_voice_b64.json', 'r', encoding='utf-8') as f:
    gonzalo_voices = json.load(f)

# 5. Load Question Audio
with open('assets/datos/questions_voice_b64.json', 'r', encoding='utf-8') as f:
    questions_voices = json.load(f)

questions_json_str = json.dumps(questions, ensure_ascii=False)
gemini_imgs_str = json.dumps(gemini_imgs, ensure_ascii=False)
sprites_str = json.dumps(sprites, ensure_ascii=False)
gonzalo_voices_str = json.dumps(gonzalo_voices, ensure_ascii=False)
questions_voices_str = json.dumps(questions_voices, ensure_ascii=False)

raw_html = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Juego JEP: Don Jacinto y la Memoria Histórica (1958-1978)</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- React 18 & ReactDOM 18 -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  
  <!-- Babel Standalone for JSX -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <!-- Google Fonts: Space Grotesk & Outfit -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;700;800&display=swap" rel="stylesheet">

  <style>
    * {
      box-sizing: border-box;
      font-family: 'Outfit', sans-serif;
      user-select: none;
    }
    
    .font-mono-title {
      font-family: 'Space Grotesk', sans-serif;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #0f172a;
    }
    ::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 4px;
    }

    /* Full-body Pawn Animations */
    @keyframes bobWalk {
      0%, 100% { transform: translate(-50%, -88%) translateY(0) rotate(0deg); }
      25% { transform: translate(-50%, -88%) translateY(-22px) rotate(-4deg); }
      75% { transform: translate(-50%, -88%) translateY(-22px) rotate(4deg); }
    }
    
    .pawn-walking {
      animation: bobWalk 0.38s infinite ease-in-out;
    }

    @keyframes idleBreathe {
      0%, 100% { transform: translate(-50%, -88%) translateY(0) scale(1); filter: drop-shadow(0 10px 18px rgba(0,0,0,0.55)); }
      50% { transform: translate(-50%, -88%) translateY(-6px) scale(1.03); filter: drop-shadow(0 14px 24px rgba(245, 158, 11, 0.45)); }
    }

    .pawn-idle {
      animation: idleBreathe 2.6s infinite ease-in-out;
    }

    @keyframes celebrateBounce {
      0%, 100% { transform: translate(-50%, -88%) translateY(0) scale(1.05); filter: drop-shadow(0 12px 24px rgba(245, 158, 11, 0.7)); }
      50% { transform: translate(-50%, -88%) translateY(-18px) scale(1.12); filter: drop-shadow(0 20px 30px rgba(245, 158, 11, 0.9)); }
    }

    .pawn-celebrating {
      animation: celebrateBounce 0.6s infinite ease-in-out;
    }

    @keyframes worryShake {
      0%, 100% { transform: translate(-50%, -88%) translateX(0) scale(0.98); filter: drop-shadow(0 8px 16px rgba(239, 68, 68, 0.5)); }
      25% { transform: translate(-50%, -88%) translateX(-6px) rotate(-2deg) scale(0.98); }
      75% { transform: translate(-50%, -88%) translateX(6px) rotate(2deg) scale(0.98); }
    }

    .pawn-worried {
      animation: worryShake 0.5s infinite ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
    }

    .shake-error {
      animation: shake 0.45s cubic-bezier(.36,.07,.19,.97) both;
    }

    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 15px rgba(245, 158, 11, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.4); }
      50% { box-shadow: 0 0 30px rgba(245, 158, 11, 0.9), inset 0 0 20px rgba(255, 255, 255, 0.8); }
    }

    .tile-active {
      animation: pulseGlow 1.8s infinite ease-in-out;
    }

    @keyframes diceRoll3D {
      0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(0.9); }
      25% { transform: rotateX(180deg) rotateY(90deg) rotateZ(45deg) scale(1.18); }
      50% { transform: rotateX(360deg) rotateY(270deg) rotateZ(180deg) scale(1.22); }
      75% { transform: rotateX(540deg) rotateY(450deg) rotateZ(270deg) scale(1.12); }
      100% { transform: rotateX(720deg) rotateY(720deg) rotateZ(360deg) scale(1); }
    }

    .dice-rolling {
      animation: diceRoll3D 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes soundwave {
      0%, 100% { transform: scaleY(0.4); opacity: 0.6; }
      50% { transform: scaleY(1); opacity: 1; }
    }

    .wave-bar {
      animation: soundwave 0.8s infinite ease-in-out;
    }

    /* Confetti Canvas */
    #confetti-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 overflow-hidden select-none h-screen w-screen">
  <canvas id="confetti-canvas"></canvas>
  <div id="root" class="h-full w-full"></div>

  <!-- EMBEDDED DATA STORES -->
  <script>
    window.__QUESTIONS_DATA__ = %%DATA_QUESTIONS%%;
    window.__GEMINI_IMAGES__ = %%DATA_GEMINI_IMAGES%%;
    window.__JACINTO_SPRITES__ = %%DATA_JACINTO_SPRITES%%;
    window.__GONZALO_VOICES__ = %%DATA_GONZALO_VOICES%%;
    window.__QUESTIONS_VOICES__ = %%DATA_QUESTIONS_VOICES%%;
  </script>

  <!-- REACT APPLICATION SCRIPT -->
  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback } = React;

    function cleanOptionText(text) {
      if (!text) return '';
      return text.replace(/^[A-Da-d0-9][\.\)\-\:\s]+\s*/, '');
    }

    // --- 1. AUDIO & EDGE NEURAL TTS ENGINE ---
    class GameAudioController {
      constructor() {
        this.ctx = null;
        this.muted = false;
        this.voiceEnabled = true;
        this.currentAudio = null;
      }

      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            this.ctx = new AudioContext();
          }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }

      toggleMute() {
        this.muted = !this.muted;
        if (this.muted && this.currentAudio) {
          this.currentAudio.pause();
        }
        return this.muted;
      }

      toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        if (!this.voiceEnabled && this.currentAudio) {
          this.currentAudio.pause();
        }
        return this.voiceEnabled;
      }

      playB64Voice(b64Data, onEnded) {
        if (this.muted || !this.voiceEnabled || !b64Data) {
          if (onEnded) onEnded();
          return;
        }
        try {
          if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
          }
          const audio = new Audio(b64Data);
          this.currentAudio = audio;
          audio.onended = () => {
            this.currentAudio = null;
            if (onEnded) onEnded();
          };
          audio.onerror = (e) => {
            console.warn('Voice playback note:', e);
            if (onEnded) onEnded();
          };
          audio.play().catch(e => {
            console.log('Autoplay interaction note:', e);
            if (onEnded) onEnded();
          });
        } catch (err) {
          console.error('Audio play error:', err);
          if (onEnded) onEnded();
        }
      }

      playNamedVoice(name, onEnded) {
        const b64 = window.__GONZALO_VOICES__?.[name];
        if (b64) {
          this.playB64Voice(b64, onEnded);
        } else if (onEnded) {
          onEnded();
        }
      }

      playQuestionVoice(qIdx, onEnded) {
        const b64 = window.__QUESTIONS_VOICES__?.[String(qIdx)];
        if (b64) {
          this.playB64Voice(b64, onEnded);
        } else {
          this.fallbackSpeak(window.__QUESTIONS_DATA__?.[qIdx]?.question || '', onEnded);
        }
      }

      fallbackSpeak(text, onEnded) {
        if (this.muted || !this.voiceEnabled || !('speechSynthesis' in window)) {
          if (onEnded) onEnded();
          return;
        }
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'es-CO';
          utterance.rate = 1.0;
          utterance.onend = () => { if (onEnded) onEnded(); };
          utterance.onerror = () => { if (onEnded) onEnded(); };
          window.speechSynthesis.speak(utterance);
        } catch(e) {
          if (onEnded) onEnded();
        }
      }

      // Procedural Sound Effects
      playDiceRoll() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        for (let i = 0; i < 7; i++) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140 + Math.random() * 260, now + i * 0.08);
          gain.gain.setValueAtTime(0.18, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.06);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.06);
        }
      }

      playStep() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      }

      playCorrect() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.09);
          gain.gain.setValueAtTime(0.22, now + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.35);
        });
      }

      playWrong() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.45);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      }

      playStarBonus() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.2, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.4);
        });
      }

      playVictory() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const fanfare = [
          { f: 523.25, t: 0, d: 0.18 },
          { f: 523.25, t: 0.18, d: 0.18 },
          { f: 523.25, t: 0.36, d: 0.18 },
          { f: 659.25, t: 0.54, d: 0.45 },
          { f: 587.33, t: 1.02, d: 0.18 },
          { f: 659.25, t: 1.20, d: 0.18 },
          { f: 783.99, t: 1.40, d: 0.80 }
        ];
        fanfare.forEach(note => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note.f, now + note.t);
          gain.gain.setValueAtTime(0.28, now + note.t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + note.t);
          osc.stop(now + note.t + note.d);
        });
      }
    }

    const audioCtrl = new GameAudioController();

    // --- 2. BOARD TILES CONFIGURATION ---
    const BOARD_TILES = [
      { id: 1,  x: 7,  y: 75, label: "1. Orígenes", cat: "multiple", color: "#3b82f6", badge: "🟦" },
      { id: 2,  x: 13, y: 69, label: "2. Frente Nal", cat: "abc", color: "#10b981", badge: "🟩" },
      { id: 3,  x: 19, y: 63, label: "3. Pacto 58", cat: "tf", color: "#f59e0b", badge: "🟨" },
      { id: 4,  x: 25, y: 57, label: "4. Guerra Fría", cat: "multiple", color: "#3b82f6", badge: "🟦" },
      { id: 5,  x: 22, y: 47, label: "5. Cuba 1959", cat: "abc", color: "#10b981", badge: "🟩" },
      { id: 6,  x: 28, y: 40, label: "6. DSN", cat: "tf", color: "#f59e0b", badge: "🟨" },
      { id: 7,  x: 35, y: 35, label: "7. Pacto Sitges", cat: "star", color: "#fbbf24", badge: "⭐" },
      { id: 8,  x: 42, y: 42, label: "8. Marquetalia", cat: "abc", color: "#10b981", badge: "🟩" },
      { id: 9,  x: 38, y: 53, label: "9. Seguridad Nal", cat: "multiple", color: "#3b82f6", badge: "🟦" },
      { id: 10, x: 45, y: 63, label: "10. Nacen FARC", cat: "abc", color: "#10b981", badge: "🟩" },
      { id: 11, x: 53, y: 69, label: "11. Origen Agrario", cat: "tf", color: "#f59e0b", badge: "🟨" },
      { id: 12, x: 60, y: 65, label: "12. Golpear y Huir", cat: "multiple", color: "#3b82f6", badge: "🟦" },
      { id: 13, x: 65, y: 56, label: "13. ELN Simacota", cat: "abc", color: "#10b981", badge: "🟩" },
      { id: 14, x: 60, y: 46, label: "14. EPL Maoísmo", cat: "tf", color: "#f59e0b", badge: "🟨" },
      { id: 15, x: 67, y: 39, label: "15. Memoria y Paz", cat: "star", color: "#fbbf24", badge: "⭐" },
      { id: 16, x: 74, y: 49, label: "16. Armas o Reformas", cat: "multiple", color: "#3b82f6", badge: "🟦" },
      { id: 17, x: 80, y: 59, label: "17. Elecciones 70", cat: "abc", color: "#10b981", badge: "🟩" },
      { id: 18, x: 86, y: 53, label: "18. M-19 Espada", cat: "multiple", color: "#3b82f6", badge: "🟦" },
      { id: 19, x: 81, y: 43, label: "19. Guerrilla Urbana", cat: "tf", color: "#f59e0b", badge: "🟨" },
      { id: 20, x: 76, y: 33, label: "20. Paro del 77", cat: "multiple", color: "#3b82f6", badge: "🟦" },
      { id: 21, x: 83, y: 27, label: "21. Movilización Civil", cat: "abc", color: "#10b981", badge: "🟩" },
      { id: 22, x: 89, y: 33, label: "22. Narcotráfico", cat: "tf", color: "#f59e0b", badge: "🟨" },
      { id: 23, x: 93, y: 43, label: "23. No Repetición", cat: "multiple", color: "#3b82f6", badge: "🟦" },
      { id: 24, x: 95, y: 25, label: "24. Finca La Esperanza", cat: "star", color: "#fbbf24", badge: "🏁" }
    ];

    const FARM_LEVELS = [
      { level: 0, title: "Choza Inicial Rústica", desc: "Terreno montañoso despejado y choza de adobe rústica.", imgKey: "finca_inicial" },
      { level: 1, title: "Siembra de Cafetales", desc: "Primeros surcos de café y orquídeas en flor.", imgKey: "finca_inicial" },
      { level: 2, title: "Ventanas Coloniales", desc: "Ventanas de madera talladas en azul y amarillo.", imgKey: "finca_intermedia" },
      { level: 3, title: "Muros y Corredores", desc: "Paredes blancas estucadas con zócalo rojo y porche.", imgKey: "finca_intermedia" },
      { level: 4, title: "Segundo Piso Tradicional", desc: "Balcones antioqueños con chambranas de madera.", imgKey: "finca_intermedia" },
      { level: 5, title: "Tejado y Pozo de Piedra", desc: "Tejas de barro cocido y fuente artesanal de agua pura.", imgKey: "finca_intermedia" },
      { level: 6, title: "Establo y Ganadería", desc: "Establo con vacas lecheras y cantinas relucientes.", imgKey: "finca_hacienda_victoria" },
      { level: 7, title: "Pasera de Secado Solar", desc: "Patio tradicional para secar granos de café dorado.", imgKey: "finca_hacienda_victoria" },
      { level: 8, title: "Hacienda La Esperanza (Máxima)", desc: "¡Reconstrucción total con bandera de Colombia y fiesta comunitaria!", imgKey: "finca_hacienda_victoria" }
    ];

    function generateDicePlan() {
      const pool = [
        [3, 3, 3, 3, 3, 3, 3, 3],
        [2, 4, 3, 2, 4, 3, 3, 3],
        [4, 2, 4, 3, 2, 3, 4, 2],
        [3, 4, 2, 3, 4, 2, 3, 3],
        [2, 3, 4, 3, 3, 4, 2, 3],
        [4, 3, 2, 4, 3, 2, 3, 3]
      ];
      return pool[Math.floor(Math.random() * pool.length)];
    }

    function launchConfetti() {
      const canvas = document.getElementById('confetti-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#ec4899', '#8b5cf6', '#ffffff'];

      for (let i = 0; i < 180; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          size: Math.random() * 8 + 4,
          speedY: Math.random() * 4 + 2,
          speedX: (Math.random() - 0.5) * 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      let frame = 0;
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.rotation += p.rotationSpeed;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
          ctx.restore();
        });
        frame++;
        if (frame < 350) {
          requestAnimationFrame(animate);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      animate();
    }

    // --- MAIN APP COMPONENT ---
    function App() {
      // Game State
      const [gameState, setGameState] = useState('INTRO'); // INTRO, PLAYING, QUESTION, FEEDBACK, VICTORY, GAMEOVER
      const [currentStep, setCurrentStep] = useState(1);
      const [turnNumber, setTurnNumber] = useState(1);
      const [lives, setLives] = useState(3);
      const [farmLevel, setFarmLevel] = useState(0);
      const [score, setScore] = useState(0);
      
      // Dynamic Emotional State of Don Jacinto: 'saludo', 'celebrando', 'preocupado', 'cosechando'
      const [jacintoEmotion, setJacintoEmotion] = useState('cosechando');
      
      // Visual & Audio Alert for Farm Changes
      const [farmAlert, setFarmAlert] = useState(null); // { type: 'upgrade' | 'degrade', title, level, text }

      // Dice & Movement State
      const [dicePlan] = useState(generateDicePlan);
      const [currentDiceRoll, setCurrentDiceRoll] = useState(dicePlan[0]);
      const [isRolling, setIsRolling] = useState(false);
      const [isWalking, setIsWalking] = useState(false);
      
      // Question State
      const [activeQuestion, setActiveQuestion] = useState(null);
      const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
      const [selectedAnswer, setSelectedAnswer] = useState(null);
      const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
      const [isNarrating, setIsNarrating] = useState(false);
      const [usedQuestionIndices, setUsedQuestionIndices] = useState(new Set());

      // Audio & UI Controls
      const [isMuted, setIsMuted] = useState(false);
      const [isVoiceOn, setIsVoiceOn] = useState(true);
      const [showFarmModal, setShowFarmModal] = useState(false);
      const [notificationText, setNotificationText] = useState("¡Bienvenido! Lanza el dado para comenzar.");

      const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          if (document.exitFullscreen) document.exitFullscreen();
        }
      };

      const startIntro = () => {
        setJacintoEmotion('cosechando');
        audioCtrl.playNamedVoice('intro');
      };

      const handleStartGame = () => {
        audioCtrl.init();
        if (audioCtrl.currentAudio) audioCtrl.currentAudio.pause();
        setGameState('PLAYING');
        setJacintoEmotion('saludo');
        setNotificationText("¡Turno 1 de 8! Presiona 'Tirar Dado' o la barra espaciadora.");
        audioCtrl.playNamedVoice('dice_1');
      };

      // Spacebar listener
      useEffect(() => {
        const handleKeyDown = (e) => {
          if (e.code === 'Space') {
            if (gameState === 'PLAYING' && !isRolling && !isWalking) {
              e.preventDefault();
              handleRollDice();
            }
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, [gameState, isRolling, isWalking, turnNumber]);

      const handleRollDice = () => {
        if (isRolling || isWalking) return;
        audioCtrl.init();
        setIsRolling(true);
        setFarmAlert(null);
        audioCtrl.playDiceRoll();

        const rollValue = dicePlan[turnNumber - 1] || Math.floor(Math.random() * 3) + 2;
        setCurrentDiceRoll(rollValue);

        setTimeout(() => {
          setIsRolling(false);
          movePawn(rollValue);
        }, 800);
      };

      const movePawn = (steps) => {
        setIsWalking(true);
        setJacintoEmotion('saludo');
        let stepCount = 0;
        let startPos = currentStep;

        const interval = setInterval(() => {
          stepCount++;
          const nextPos = Math.min(24, startPos + stepCount);
          setCurrentStep(nextPos);
          audioCtrl.playStep();

          if (stepCount >= steps || nextPos >= 24) {
            clearInterval(interval);
            setIsWalking(false);
            onTileReached(nextPos);
          }
        }, 340);
      };

      const onTileReached = (tileId) => {
        const tile = BOARD_TILES.find(t => t.id === tileId) || BOARD_TILES[tileId - 1];
        
        const allQuestions = window.__QUESTIONS_DATA__ || [];
        let available = allQuestions.map((q, idx) => ({ q, idx })).filter(item => !usedQuestionIndices.has(item.idx));
        
        if (tile.cat === 'tf') {
          const tfList = available.filter(item => item.q.type === 'true_false' || item.q.options?.length === 2);
          if (tfList.length > 0) available = tfList;
        } else if (tile.cat === 'abc') {
          const abcList = available.filter(item => item.q.type === 'abc' || item.q.options?.length === 3);
          if (abcList.length > 0) available = abcList;
        } else if (tile.cat === 'star') {
          const starList = available.filter(item => item.q.type === 'bonus' || item.q.isSpecialBonus);
          if (starList.length > 0) available = starList;
        }

        const selected = available.length > 0 
          ? available[Math.floor(Math.random() * available.length)]
          : { q: allQuestions[0], idx: 0 };

        usedQuestionIndices.add(selected.idx);
        setUsedQuestionIndices(new Set(usedQuestionIndices));
        
        setActiveQuestion(selected.q);
        setActiveQuestionIdx(selected.idx);
        setSelectedAnswer(null);
        setGameState('QUESTION');

        if (tile.cat === 'star') {
          audioCtrl.playStarBonus();
          setTimeout(() => {
            playQuestionNarration(selected.idx);
          }, 800);
        } else {
          playQuestionNarration(selected.idx);
        }
      };

      const playQuestionNarration = (idx) => {
        setIsNarrating(true);
        audioCtrl.playQuestionVoice(idx, () => {
          setIsNarrating(false);
        });
      };

      // Answer Selection with Visual & Audio Farm Alerts
      const handleSelectAnswer = (index) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index);
        
        const isBonusTile = activeQuestion.type === 'bonus';
        const correct = isBonusTile ? true : (index === activeQuestion.correct);
        setIsAnswerCorrect(correct);
        setGameState('FEEDBACK');

        if (correct) {
          audioCtrl.playCorrect();
          const nextLevel = Math.min(8, farmLevel + 1);
          setFarmLevel(nextLevel);
          setScore(prev => prev + (activeQuestion.isSpecialBonus || isBonusTile ? 200 : 100));
          
          // Emotional State: Don Jacinto Celebrates Joyfully!
          setJacintoEmotion('celebrando');

          // Farm Upgrade Alert & Narration
          const upgradeInfo = FARM_LEVELS[nextLevel] || FARM_LEVELS[8];
          setFarmAlert({
            type: 'upgrade',
            level: nextLevel,
            title: upgradeInfo.title,
            desc: upgradeInfo.desc
          });

          // Play Gonzalo Neural Farm Upgrade voice line
          setTimeout(() => {
            audioCtrl.playNamedVoice('upgrade_' + nextLevel, () => {
              const voiceKeys = ['correct_1', 'correct_2', 'correct_3'];
              const pickedVoice = (activeQuestion.isSpecialBonus || isBonusTile) ? 'star_bonus' : voiceKeys[Math.floor(Math.random() * voiceKeys.length)];
              audioCtrl.playNamedVoice(pickedVoice);
            });
          }, 400);

        } else {
          audioCtrl.playWrong();
          setLives(prev => Math.max(0, prev - 1));
          
          // Emotional State: Don Jacinto Worried & Sweating!
          setJacintoEmotion('preocupado');

          // Farm Degradation Alert & Narration
          setFarmAlert({
            type: 'degrade',
            text: '¡Pérdida de 1 Vida! La Finca La Esperanza ha sufrido un deterioro.'
          });

          // Play Gonzalo Neural Degradation Alert voice line
          setTimeout(() => {
            audioCtrl.playNamedVoice('degrade_alert', () => {
              const wrongVoices = ['wrong_1', 'wrong_2', 'wrong_3'];
              const pickedWrong = wrongVoices[Math.floor(Math.random() * wrongVoices.length)];
              audioCtrl.playNamedVoice(pickedWrong);
            });
          }, 400);
        }
      };

      const handleContinueAfterFeedback = () => {
        setFarmAlert(null);

        if (lives <= 0 && !isAnswerCorrect) {
          setGameState('GAMEOVER');
          setJacintoEmotion('preocupado');
          audioCtrl.playNamedVoice('game_over');
          return;
        }

        if (currentStep >= 24 || turnNumber >= 8) {
          setGameState('VICTORY');
          setFarmLevel(8);
          setJacintoEmotion('celebrando');
          audioCtrl.playVictory();
          launchConfetti();
          setTimeout(() => audioCtrl.playNamedVoice('victory'), 700);
          return;
        }

        // Advance to next turn
        const nextTurn = turnNumber + 1;
        setTurnNumber(nextTurn);
        setGameState('PLAYING');
        setJacintoEmotion('saludo');
        
        const diceVoices = ['dice_1', 'dice_2', 'dice_3'];
        const nextPrompt = diceVoices[(nextTurn - 1) % diceVoices.length];
        setNotificationText(`¡Turno ${nextTurn} de 8! Lanza el dado para avanzar.`);
        audioCtrl.playNamedVoice(nextPrompt);
      };

      const handleRestart = () => {
        setCurrentStep(1);
        setTurnNumber(1);
        setLives(3);
        setFarmLevel(0);
        setScore(0);
        setSelectedAnswer(null);
        setFarmAlert(null);
        setUsedQuestionIndices(new Set());
        setGameState('PLAYING');
        setJacintoEmotion('saludo');
        setNotificationText("¡Partida reiniciada! Lanza el dado para comenzar.");
        audioCtrl.playNamedVoice('dice_1');
      };

      const activeTile = BOARD_TILES.find(t => t.id === currentStep) || BOARD_TILES[0];
      
      // Dynamic Full-Body Sprite based on Emotion
      const currentJacintoSprite = window.__JACINTO_SPRITES__?.[jacintoEmotion] || window.__JACINTO_SPRITES__?.saludo || window.__JACINTO_SPRITES__?.full_body;
      const backgroundImage = window.__GEMINI_IMAGES__?.paisaje_fondo || '';
      const farmImages = window.__GEMINI_IMAGES__ || {};

      // Dynamic Animation Class for Pawn
      let pawnAnimClass = 'pawn-idle';
      if (isWalking) {
        pawnAnimClass = 'pawn-walking';
      } else if (jacintoEmotion === 'celebrando') {
        pawnAnimClass = 'pawn-celebrating';
      } else if (jacintoEmotion === 'preocupado') {
        pawnAnimClass = 'pawn-worried';
      }

      return (
        <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden select-none">
          
          {/* ======================================================== */}
          {/* 1. TOP HEADER / PRESENTER BAR                             */}
          {/* ======================================================== */}
          <header className="relative z-30 flex items-center justify-between px-4 md:px-6 py-2.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl select-none">
            {/* Left: Presentation Branding & Credits */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400 font-mono-title text-base shadow-inner">
                JEP
              </div>
              <div>
                <h1 className="text-sm md:text-base font-bold text-white tracking-wide font-mono-title flex items-center gap-2">
                  Camino a la Finca: Don Jacinto y la Memoria Histórica
                  <span className="text-xs font-normal text-amber-400/90 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                    1958–1978
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-medium hidden sm:block">
                  Comunidad de Indagación 3 • <span className="text-slate-300">Isabella Ortiz, Alison Cuasquer, Valery Lopez, Valentina Benavidez</span>
                </p>
              </div>
            </div>

            {/* Right: Game HUD & Controls */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Turn Counter */}
              <div className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/70 text-xs font-semibold">
                <span className="text-base">🎲</span>
                <span className="text-slate-400 hidden sm:inline">Turno</span>
                <span className="text-amber-400 font-bold font-mono-title text-sm">{gameState === 'INTRO' ? '-' : `${turnNumber} / 8`}</span>
              </div>

              {/* Lives (3 Hearts) */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/70">
                {[1, 2, 3].map(heartIdx => (
                  <span key={heartIdx} className={`text-base transition-transform duration-300 ${heartIdx <= lives ? 'scale-100' : 'scale-90 opacity-30 grayscale'}`}>
                    {heartIdx <= lives ? '❤️' : '💔'}
                  </span>
                ))}
              </div>

              {/* Finca Compact Badge */}
              <button 
                onClick={() => setShowFarmModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-emerald-900/70 hover:from-emerald-900/90 hover:to-emerald-800/80 border border-emerald-500/40 text-xs font-semibold text-emerald-300 transition-all shadow-sm hover:shadow-emerald-500/20 active:scale-95 cursor-pointer"
                title="Ver progreso de la Finca La Esperanza"
              >
                <span className="text-base">🏡</span>
                <span className="hidden md:inline">Finca:</span>
                <span className="font-bold text-emerald-200">Nv {farmLevel}/8</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-200 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  {score} pts
                </span>
              </button>

              {/* TTS Voice Toggle */}
              <button 
                onClick={() => setIsVoiceOn(audioCtrl.toggleVoice())}
                className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${isVoiceOn ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                title={isVoiceOn ? "Voz de Don Jacinto (Gonzalo Neural) Activada" : "Voz Desactivada"}
              >
                <div className="flex items-center gap-1.5">
                  <span>{isVoiceOn ? '🗣️' : '🔇'}</span>
                  <span className="hidden lg:inline">Voz Jacinto</span>
                </div>
              </button>

              {/* Mute SFX Toggle */}
              <button 
                onClick={() => setIsMuted(audioCtrl.toggleMute())}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 transition-all cursor-pointer"
                title={isMuted ? "Activar Sonido" : "Silenciar"}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>

              {/* Fullscreen Button */}
              <button 
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 transition-all cursor-pointer"
                title="Pantalla Completa"
              >
                ⛶
              </button>
            </div>
          </header>

          {/* ======================================================== */}
          {/* FLOATING FINCA UPGRADE / DEGRADATION NOTIFICATION TOAST   */}
          {/* ======================================================== */}
          {farmAlert && (
            <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-fade-in">
              {farmAlert.type === 'upgrade' ? (
                <div className="flex items-center gap-3.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-950/95 via-emerald-900/95 to-amber-950/95 border-2 border-amber-400 text-white shadow-2xl shadow-emerald-500/40 animate-bounce">
                  <div className="text-3xl">✨🏡</div>
                  <div>
                    <div className="text-xs font-extrabold text-amber-300 font-mono-title tracking-wider uppercase flex items-center gap-2">
                      <span>¡MEJORA EN LA FINCA LA ESPERANZA!</span>
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[10px]">NIVEL {farmAlert.level}/8</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-100">
                      {farmAlert.title}
                    </div>
                    <div className="text-xs text-slate-300 font-normal">
                      {farmAlert.desc}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-950/95 via-rose-900/95 to-slate-950/95 border-2 border-rose-500 text-white shadow-2xl shadow-rose-900/50 shake-error">
                  <div className="text-3xl">💔⚠️</div>
                  <div>
                    <div className="text-xs font-extrabold text-rose-300 font-mono-title tracking-wider uppercase">
                      ¡DETERIORO EN LA FINCA! (-1 VIDA)
                    </div>
                    <div className="text-sm font-semibold text-rose-100">
                      {farmAlert.text}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. MAIN BOARD VIEW                                        */}
          {/* ======================================================== */}
          <main className="relative flex-1 w-full h-full overflow-hidden bg-slate-950">
            {backgroundImage ? (
              <img 
                src={backgroundImage} 
                alt="Paisaje Cafetero Cordillera Central" 
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-95 transition-opacity duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-emerald-700 to-green-950" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/20 pointer-events-none" />

            {/* SVG Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {BOARD_TILES.map((tile, idx) => {
                if (idx === BOARD_TILES.length - 1) return null;
                const nextTile = BOARD_TILES[idx + 1];
                const isPassed = tile.id < currentStep;
                return (
                  <line 
                    key={`line-${tile.id}`}
                    x1={`${tile.x}%`}
                    y1={`${tile.y}%`}
                    x2={`${nextTile.x}%`}
                    y2={`${nextTile.y}%`}
                    stroke={isPassed ? '#f59e0b' : '#ffffff'}
                    strokeOpacity={isPassed ? '0.85' : '0.4'}
                    strokeWidth={isPassed ? '5' : '3'}
                    strokeDasharray={isPassed ? 'none' : '6 6'}
                    strokeLinecap="round"
                    filter="url(#glowEffect)"
                  />
                );
              })}
            </svg>

            {/* 24 STONE TILES */}
            <div className="absolute inset-0 z-10 pointer-events-auto">
              {BOARD_TILES.map((tile) => {
                const isCurrent = tile.id === currentStep;
                const isPassed = tile.id < currentStep;
                
                return (
                  <div
                    key={tile.id}
                    style={{ left: `${tile.x}%`, top: `${tile.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  >
                    <div 
                      className={`relative flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full font-mono-title font-bold text-xs md:text-sm transition-all duration-300 shadow-lg ${
                        isCurrent 
                          ? 'tile-active scale-125 z-20 text-slate-950 font-extrabold bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 border-2 border-white ring-4 ring-amber-400/60 shadow-amber-500/60' 
                          : isPassed 
                            ? 'bg-amber-500/90 text-slate-950 border-2 border-amber-300 shadow-amber-900/40 opacity-90' 
                            : 'bg-slate-900/90 text-slate-200 border-2 border-slate-600/90 hover:scale-110 hover:border-amber-400'
                      }`}
                      style={{
                        borderColor: isCurrent ? '#ffffff' : (isPassed ? '#f59e0b' : tile.color)
                      }}
                    >
                      <span>{tile.id}</span>
                      
                      <span className="absolute -top-1 -right-1 text-[9px] md:text-[10px]">
                        {tile.badge}
                      </span>
                    </div>

                    <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900/95 border border-slate-700 text-[11px] font-medium text-slate-200 shadow-xl z-30">
                      {tile.label}
                    </div>
                  </div>
                );
              })}

              {/* 3. DON JACINTO FULL-BODY STANDING PAWN (With Dynamic Emotional Sprites!) */}
              <div 
                style={{ 
                  left: `${activeTile.x}%`, 
                  top: `${activeTile.y}%`,
                  transition: isWalking ? 'none' : 'left 0.35s ease-out, top 0.35s ease-out'
                }}
                className={`absolute z-30 pointer-events-none ${pawnAnimClass}`}
              >
                {/* Ground Shadow */}
                <div className="absolute left-1/2 bottom-1.5 -translate-x-1/2 w-16 h-4 bg-slate-950/80 rounded-full blur-[3px] pointer-events-none" />

                {/* Full-Body Sprite Image (Crisp, complete, no background) */}
                <img 
                  src={currentJacintoSprite} 
                  alt="Don Jacinto Campesino" 
                  className="w-20 md:w-24 lg:w-28 max-h-36 object-contain pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                />

                {/* State Tag Badge */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] shadow-lg border border-amber-200">
                  {jacintoEmotion === 'celebrando' ? '🎉 ¡Don Jacinto Triunfa!' : jacintoEmotion === 'preocupado' ? '😰 Don Jacinto Preocupado' : 'Don Jacinto'}
                </div>
              </div>
            </div>

            {/* 4. BOTTOM FLOATING CONTROLS & NARRATION STRIP */}
            <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6 z-20 flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none">
              
              <div className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl max-w-xl">
                <img 
                  src={currentJacintoSprite} 
                  alt="Don Jacinto" 
                  className="w-10 h-10 rounded-full object-cover bg-amber-500/20 border border-amber-500/40 p-0.5 shrink-0" 
                />
                <div>
                  <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                    <span>Don Jacinto:</span>
                    {isNarrating && (
                      <span className="flex items-center gap-0.5 text-emerald-400 text-[10px]">
                        <span className="w-1 h-2 bg-emerald-400 rounded wave-bar" style={{ animationDelay: '0s' }}></span>
                        <span className="w-1 h-3 bg-emerald-400 rounded wave-bar" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-1 h-2 bg-emerald-400 rounded wave-bar" style={{ animationDelay: '0.4s' }}></span>
                        Narrando...
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-tight">
                    «{notificationText}»
                  </p>
                </div>
              </div>

              {gameState === 'PLAYING' && (
                <div className="pointer-events-auto flex items-center gap-3">
                  <button
                    onClick={handleRollDice}
                    disabled={isRolling || isWalking}
                    className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-mono-title font-extrabold text-base shadow-2xl transition-all duration-200 transform active:scale-95 cursor-pointer ${
                      isRolling || isWalking 
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 border-2 border-amber-200 shadow-amber-500/40 hover:shadow-amber-500/60 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center text-lg font-mono-title shadow-inner border border-amber-400/40 ${isRolling ? 'dice-rolling' : ''}`}>
                      {isRolling ? '🎲' : currentDiceRoll}
                    </div>
                    <span>{isRolling ? 'Lanzando dado...' : isWalking ? 'Avanzando...' : '¡Tirar Dado! (Espacio)'}</span>
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* ======================================================== */}
          {/* MODAL 1: INTRO SCREEN CINEMATIC OVERLAY                   */}
          {/* ======================================================== */}
          {gameState === 'INTRO' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
              <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-amber-500/40 shadow-2xl p-6 md:p-8 text-center overflow-hidden">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
                  <span>🇨🇴</span> Memoria Histórica del Conflicto Armado (1958–1978)
                </div>

                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-b from-amber-500/20 to-emerald-500/20 border-2 border-amber-400/40 flex items-center justify-center overflow-hidden shadow-2xl">
                      <img 
                        src={window.__JACINTO_SPRITES__?.saludo} 
                        alt="Don Jacinto" 
                        className="w-full h-full object-contain transform scale-110 drop-shadow-xl" 
                      />
                    </div>
                    <button 
                      onClick={startIntro}
                      className="absolute -bottom-1 -right-1 p-2.5 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg border border-amber-200 transition-transform active:scale-90 cursor-pointer"
                      title="Escuchar saludo de Don Jacinto"
                    >
                      🗣️
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white font-mono-title mb-2">
                  ¡Hola! Soy Don Jacinto
                </h2>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6 max-w-lg mx-auto">
                  Campesino de nuestras hermosas montañas. Acompáñame por este sendero de 24 casillas. En 8 turnos responderemos preguntas de memoria y reconstruiremos juntos la <strong className="text-amber-400">Finca La Esperanza</strong>.
                </p>

                <div className="py-2.5 px-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 mb-6 max-w-md mx-auto">
                  <span className="font-semibold text-slate-200">Comunidad de Indagación 3:</span> Isabella Ortiz, Alison Cuasquer, Valery Lopez, Valentina Benavidez
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleStartGame}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold font-mono-title text-base shadow-xl shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    ¡Comenzar Recorrido! 🚀
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODAL 2: QUESTION DISPLAY                                 */}
          {/* ======================================================== */}
          {(gameState === 'QUESTION' || gameState === 'FEEDBACK') && activeQuestion && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
              <div className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 border-2 border-slate-700 shadow-2xl p-6 md:p-8 overflow-hidden">
                
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-xl text-xs font-bold text-slate-950 uppercase tracking-wider font-mono-title shadow-sm"
                          style={{ backgroundColor: activeTile.color }}>
                      {activeQuestion.category || "MEMORIA HISTÓRICA"}
                    </span>
                    {(activeQuestion.isSpecialBonus || activeQuestion.type === 'bonus') && (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1">
                        ⭐ Casilla Estrella de Reflexión
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playQuestionNarration(activeQuestionIdx)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isNarrating 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                      title="Escuchar pregunta"
                    >
                      <span>{isNarrating ? '🗣️' : '🔊'}</span>
                      <span>{isNarrating ? 'Narrando...' : 'Escuchar'}</span>
                    </button>
                    
                    <span className="text-xs text-slate-400 font-mono-title">
                      Casilla #{currentStep} • Turno {turnNumber}/8
                    </span>
                  </div>
                </div>

                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-snug mb-6 font-mono-title">
                  {activeQuestion.question}
                </h3>

                <div className="space-y-3 mb-6">
                  {activeQuestion.options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrectOption = idx === activeQuestion.correct;
                    const letters = ['A', 'B', 'C', 'D'];
                    const cleanOpt = cleanOptionText(opt);
                    
                    let btnStyle = "bg-slate-800/80 hover:bg-slate-700/90 border-slate-700 text-slate-200 cursor-pointer";
                    let badgeStyle = "bg-slate-700 text-slate-300";

                    if (gameState === 'FEEDBACK') {
                      if (isCorrectOption) {
                        btnStyle = "bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/50 font-bold shadow-lg shadow-emerald-500/30";
                        badgeStyle = "bg-white text-emerald-800 font-extrabold";
                      } else if (isSelected && !isCorrectOption) {
                        btnStyle = "bg-rose-600/90 text-white border-rose-400 shake-error font-semibold";
                        badgeStyle = "bg-white text-rose-800 font-extrabold";
                      } else {
                        btnStyle = "bg-slate-900/60 border-slate-800 text-slate-500 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(idx)}
                        disabled={gameState === 'FEEDBACK'}
                        className={`w-full flex items-center gap-3.5 p-3.5 md:p-4 rounded-2xl border-2 text-left text-sm md:text-base transition-all duration-200 ${btnStyle}`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 font-mono-title ${badgeStyle}`}>
                          {letters[idx] || (idx + 1)}
                        </div>
                        <span className="flex-1 leading-relaxed">{cleanOpt}</span>
                        {gameState === 'FEEDBACK' && isCorrectOption && (
                          <span className="text-xl">✅</span>
                        )}
                        {gameState === 'FEEDBACK' && isSelected && !isCorrectOption && (
                          <span className="text-xl">❌</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {gameState === 'FEEDBACK' && (
                  <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs md:text-sm text-slate-300 animate-fade-in">
                    <div className="flex items-center gap-2 font-bold mb-1.5 font-mono-title text-amber-400">
                      <span>📖 Explicación Histórica & Verdad:</span>
                    </div>
                    <p className="leading-relaxed mb-2 text-slate-200">
                      {activeQuestion.explanation}
                    </p>
                    {activeQuestion.citation && (
                      <div className="text-[11px] text-amber-300/80 font-medium">
                        Cita oficial: {activeQuestion.citation}
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleContinueAfterFeedback}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono-title text-sm shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        Continuar Recorrido ➡️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODAL 3: FINCA PROGRESS DRAWER                            */}
          {/* ======================================================== */}
          {showFarmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
              <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl p-6 md:p-8 text-center overflow-hidden">
                <button 
                  onClick={() => setShowFarmModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  ✕
                </button>

                <h3 className="text-xl md:text-2xl font-bold text-emerald-400 font-mono-title mb-1 flex items-center justify-center gap-2">
                  🏡 Finca La Esperanza • Nivel {farmLevel} / 8
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {FARM_LEVELS[farmLevel]?.title || "Finca Cafetera"}
                </p>

                <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-slate-700 mb-4 shadow-inner">
                  <img 
                    src={farmImages[FARM_LEVELS[farmLevel]?.imgKey] || farmImages.finca_inicial} 
                    alt="Progreso de la Finca"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-left">
                    <p className="text-xs text-emerald-200 font-medium">
                      {FARM_LEVELS[farmLevel]?.desc}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700 mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${(farmLevel / 8) * 100}%` }}
                  />
                </div>

                <p className="text-xs text-slate-300">
                  Cada respuesta correcta hace florecer los cafetales, añade ventanas coloniales, paseras de secado y devuelve la vida a la comunidad campesina.
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODAL 4: VICTORY SCREEN                                   */}
          {/* ======================================================== */}
          {gameState === 'VICTORY' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fade-in">
              <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-2xl p-6 md:p-8 text-center overflow-hidden">
                
                <div className="text-5xl mb-3 animate-bounce">🏆</div>
                
                <h2 className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono-title mb-2">
                  ¡Victoria! ¡La Finca La Esperanza ha Renacido!
                </h2>
                <p className="text-sm md:text-base text-slate-200 leading-relaxed mb-4 max-w-lg mx-auto">
                  Gracias a su compromiso con la memoria histórica y la verdad, Don Jacinto ha recuperado su hogar y sus cafetales en su máximo esplendor.
                </p>

                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-amber-500/40 mb-5 shadow-2xl">
                  <img 
                    src={farmImages.finca_hacienda_victoria || farmImages.finca_intermedia} 
                    alt="Hacienda La Esperanza Completa"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-amber-300">🏡 Hacienda La Esperanza • ¡Nivel Máximo 8/8!</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 mb-6">
                  <div className="font-bold text-amber-400 mb-1">Comunidad de Indagación 3 (1958–1978):</div>
                  <div>Isabella Ortiz • Alison Cuasquer • Valery Lopez • Valentina Benavidez</div>
                  <div className="text-[11px] text-slate-400 mt-1">«La paz se construye sobre la verdad, la memoria y la no repetición»</div>
                </div>

                <button
                  onClick={handleRestart}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold font-mono-title text-base shadow-xl shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  🔄 Jugar de Nuevo
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODAL 5: GAME OVER SCREEN                                 */}
          {/* ======================================================== */}
          {gameState === 'GAMEOVER' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fade-in">
              <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-rose-500/40 shadow-2xl p-6 md:p-8 text-center">
                <div className="text-5xl mb-3">💔</div>
                <h3 className="text-2xl font-bold text-rose-400 font-mono-title mb-2">
                  Se han agotado las vidas
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Don Jacinto nos recuerda que en el camino hacia la paz y la memoria histórica, cada caída es una oportunidad para aprender de nuestro pasado y volver a empezar.
                </p>
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono-title text-sm shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  🔄 Intentar de Nuevo
                </button>
              </div>
            </div>
          )}

        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
"""

# Replace unique tokens
final_html = raw_html.replace('%%DATA_QUESTIONS%%', questions_json_str)
final_html = final_html.replace('%%DATA_GEMINI_IMAGES%%', gemini_imgs_str)
final_html = final_html.replace('%%DATA_JACINTO_SPRITES%%', sprites_str)
final_html = final_html.replace('%%DATA_GONZALO_VOICES%%', gonzalo_voices_str)
final_html = final_html.replace('%%DATA_QUESTIONS_VOICES%%', questions_voices_str)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

print(f'Successfully generated standalone index.html! File size: {os.path.getsize("index.html")} bytes')
