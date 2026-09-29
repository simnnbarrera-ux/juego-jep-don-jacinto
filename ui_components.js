/**
 * ============================================================================
 * JUEGO JEP: DON JACINTO | COMPONENTES DE INTERFAZ DE USUARIO (UI/UX)
 * ============================================================================
 * Proyecto: Comunidad de Indagación 3 (1958-1978)
 * Integrantes: Isabella Ortiz • Alison Cuasquer • Valery Lopez • Valentina Benavidez
 * Fuente: Comisión de la Verdad (CEV) - Tomo 'No matarás' & Guías Pedagógicas JEP
 * 
 * Componentes diseñados para máxima legibilidad en proyección de aula,
 * alto contraste, animaciones fluidas, feedback sonoro integrado y accesibilidad.
 * ============================================================================
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// 1. SISTEMA DE AUDIO SINTETIZADO (Web Audio API - Cero dependencias externas)
// ============================================================================
class JEPAudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.2, gainVal = 0.15) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  playSuccess() {
    if (this.isMuted) return;
    this.initContext();
    const now = this.ctx?.currentTime || 0;
    if (!this.ctx) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.12), i * 80);
    });
  }

  playError() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    this.playTone(220, 'sawtooth', 0.2, 0.18);
    setTimeout(() => this.playTone(174.61, 'sawtooth', 0.35, 0.2), 120);
  }

  playClick() {
    this.playTone(800, 'sine', 0.05, 0.05);
  }

  playFanfare() {
    if (this.isMuted) return;
    this.initContext();
    const notes = [440, 554.37, 659.25, 880, 783.99, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.15), idx * 140);
    });
  }

  playGameOver() {
    if (this.isMuted) return;
    this.initContext();
    const notes = [392.00, 369.99, 349.23, 311.13];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.4, 0.15), idx * 200);
    });
  }
}

export const jepAudio = new JEPAudioManager();

// ============================================================================
// 2. INYECCIÓN DE ESTILOS Y ANIMACIONES CSS GLOBALES
// ============================================================================
const injectStylesOnce = () => {
  if (typeof document === 'undefined') return;
  const styleId = 'jep-ui-custom-animations';
  if (document.getElementById(styleId)) return;

  const styleEl = document.createElement('style');
  styleEl.id = styleId;
  styleEl.innerHTML = `
    @keyframes jepHeartbeat {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.18); filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.7)); }
      50% { transform: scale(0.95); }
      75% { transform: scale(1.1); }
    }
    @keyframes jepShake {
      0%, 100% { transform: translateX(0); }
      15%, 45%, 75% { transform: translateX(-9px) rotate(-1deg); }
      30%, 60%, 90% { transform: translateX(9px) rotate(1deg); }
    }
    @keyframes jepPopIn {
      0% { opacity: 0; transform: scale(0.88) translateY(20px); }
      70% { transform: scale(1.02) translateY(-4px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes jepGlowPulse {
      0%, 100% { box-shadow: 0 0 15px rgba(234, 179, 8, 0.4), inset 0 0 10px rgba(234, 179, 8, 0.2); }
      50% { box-shadow: 0 0 30px rgba(234, 179, 8, 0.8), inset 0 0 20px rgba(234, 179, 8, 0.4); }
    }
    @keyframes jepConfettiFall {
      0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes jepFadeSlideUp {
      0% { opacity: 0; transform: translateY(24px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes jepFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .jep-font-serif {
      font-family: 'Merriweather', 'Georgia', 'Cambria', serif;
    }
    .jep-font-sans {
      font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    }
    .jep-glass-panel {
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    .jep-glass-card {
      background: rgba(30, 41, 59, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  `;
  document.head.appendChild(styleEl);
};

// ============================================================================
// 3. UTILIDADES DE PANTALLA COMPLETA
// ============================================================================
export const toggleFullScreen = () => {
  if (typeof document === 'undefined') return;
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.warn(`Error al activar pantalla completa: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

// ============================================================================
// 4. COMPONENTE: PresenterHeader (Barra Superior de Exposición)
// ============================================================================
/**
 * Barra superior elegante para proyección en aula.
 * Muestra título de la indagación, nombres del equipo, vidas animadas,
 * turno actual, botón de pantalla completa y botón de sonido.
 */
export const PresenterHeader = ({
  lives = 3,
  maxLives = 3,
  currentTurn = 1,
  maxTurns = 8,
  title = 'Juego JEP | Comunidad de Indagación 3 (1958-1978)',
  teamMembers = 'Isabella Ortiz • Alison Cuasquer • Valery Lopez • Valentina Benavidez',
  isMuted = false,
  onToggleSound,
  onResetGame,
  score = 0,
}) => {
  const [fullscreenActive, setFullscreenActive] = useState(false);

  useEffect(() => {
    injectStylesOnce();
    const handleFsChange = () => {
      setFullscreenActive(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleSoundClick = () => {
    jepAudio.isMuted = !isMuted;
    if (onToggleSound) {
      onToggleSound(!isMuted);
    }
  };

  const handleFullScreenClick = () => {
    jepAudio.playClick();
    toggleFullScreen();
  };

  return (
    <header
      className="jep-font-sans w-full select-none"
      style={{
        background: 'linear-gradient(180deg, rgba(10, 18, 30, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderBottom: '2px solid rgba(234, 179, 8, 0.35)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 0 rgba(234, 179, 8, 0.15)',
        position: 'relative',
        zIndex: 50,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* BLOQUE IZQUIERDO: Título Institucional y Equipo de Exposición */}
        <div className="flex items-center gap-3.5 min-w-[300px]">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg border"
            style={{
              background: 'linear-gradient(135deg, #15803d 0%, #166534 50%, #854d0e 100%)',
              borderColor: 'rgba(234, 179, 8, 0.5)',
              color: '#fef08a',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)',
            }}
          >
            ☕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1
                className="text-lg md:text-xl font-extrabold tracking-wide text-white uppercase flex items-center gap-2"
                style={{ letterSpacing: '0.04em' }}
              >
                {title}
              </h1>
              <span
                className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase border"
                style={{
                  background: 'rgba(234, 179, 8, 0.15)',
                  color: '#fef08a',
                  borderColor: 'rgba(234, 179, 8, 0.4)',
                }}
              >
                JEP • CEV
              </span>
            </div>
            <p className="text-xs md:text-sm text-emerald-300 font-medium tracking-wide flex items-center gap-1.5 mt-0.5">
              <span className="text-amber-400 font-bold">Investigadoras:</span>
              <span className="text-slate-200">{teamMembers}</span>
            </p>
          </div>
        </div>

        {/* BLOQUE CENTRAL: Indicadores Clave de Exposición (Vidas + Turno) */}
        <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-700/60 shadow-inner">
          
          {/* Indicador de Vidas Animado */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
              Vidas:
            </span>
            <div className="flex items-center gap-1 text-2xl">
              {Array.from({ length: maxLives }).map((_, idx) => {
                const isAlive = idx < lives;
                return (
                  <span
                    key={idx}
                    title={isAlive ? 'Vida Activa' : 'Vida Perdida'}
                    style={{
                      display: 'inline-block',
                      transform: isAlive ? 'scale(1)' : 'scale(0.88)',
                      filter: isAlive
                        ? 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))'
                        : 'grayscale(100%) opacity(0.4)',
                      animation: isAlive && lives === 1 ? 'jepHeartbeat 1.1s infinite' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isAlive ? '❤️' : '💔'}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-700"></div>

          {/* Contador de Turnos para el Salón */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                Progreso
              </div>
              <div className="text-sm md:text-base font-black text-white tracking-wide">
                Turno <span className="text-emerald-400">{currentTurn}</span>
                <span className="text-slate-500 font-normal"> / {maxTurns}</span>
              </div>
            </div>
            
            {/* Barra de progreso miniatura */}
            <div className="w-16 md:w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (currentTurn / maxTurns) * 100)}%`,
                  background: 'linear-gradient(90deg, #10b981 0%, #eab308 100%)',
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                }}
              />
            </div>
          </div>

          {score > 0 && (
            <>
              <div className="h-6 w-[1px] bg-slate-700 hidden sm:block"></div>
              <div className="hidden sm:flex items-center gap-1.5 text-amber-300 font-bold text-sm">
                <span>⭐</span>
                <span>{score} pts</span>
              </div>
            </>
          )}
        </div>

        {/* BLOQUE DERECHO: Controles de Proyección (Pantalla Completa + Mute) */}
        <div className="flex items-center gap-2">
          {/* Botón de Sonido */}
          <button
            onClick={handleSoundClick}
            type="button"
            className="p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center gap-1.5 text-sm font-semibold cursor-pointer active:scale-95"
            style={{
              background: isMuted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              borderColor: isMuted ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)',
              color: isMuted ? '#fca5a5' : '#6ee7b7',
            }}
            title={isMuted ? 'Activar Sonido de Efectos' : 'Silenciar Efectos'}
          >
            <span className="text-lg">{isMuted ? '🔇' : '🔊'}</span>
            <span className="hidden lg:inline text-xs">{isMuted ? 'Silenciado' : 'Sonido'}</span>
          </button>

          {/* Botón de Pantalla Completa */}
          <button
            onClick={handleFullScreenClick}
            type="button"
            className="px-3 py-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 text-sm font-bold cursor-pointer shadow-md active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderColor: 'rgba(234, 179, 8, 0.4)',
              color: '#fef08a',
            }}
            title="Modo Proyector de Clase (Pantalla Completa - F)"
          >
            <span className="text-base">{fullscreenActive ? '🗗' : '⛶'}</span>
            <span className="text-xs uppercase tracking-wider font-extrabold">
              {fullscreenActive ? 'Salir' : 'Proyector'}
            </span>
          </button>

          {onResetGame && (
            <button
              onClick={() => {
                jepAudio.playClick();
                if (window.confirm('¿Deseas reiniciar la partida para otra ronda de exposición?')) {
                  onResetGame();
                }
              }}
              type="button"
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition text-sm cursor-pointer"
              title="Reiniciar Partida"
            >
              🔄
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

// ============================================================================
// 5. HELPER DE COLORES Y BADGES POR CATEGORÍA
// ============================================================================
export const getCategoryStyles = (categoryString = '') => {
  const cat = categoryString.toLowerCase();
  if (cat.includes('opción') || cat.includes('opcion') || cat.includes('múltiple') || cat.includes('multiple') || cat.includes('azul') || cat.includes('🟦')) {
    return {
      bg: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
      border: '#60a5fa',
      text: '#eff6ff',
      badgeBg: 'rgba(37, 99, 235, 0.25)',
      badgeBorder: 'rgba(96, 165, 250, 0.5)',
      icon: '🟦',
      label: 'Opción Múltiple (Pregunta Azul)',
      accentColor: '#3b82f6',
    };
  }
  if (cat.includes('abc') || cat.includes('verde') || cat.includes('🟩')) {
    return {
      bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      border: '#34d399',
      text: '#ecfdf5',
      badgeBg: 'rgba(5, 150, 105, 0.25)',
      badgeBorder: 'rgba(52, 211, 153, 0.5)',
      icon: '🟩',
      label: 'Pregunta ABC (Pregunta Verde)',
      accentColor: '#10b981',
    };
  }
  if (cat.includes('verdadero') || cat.includes('falso') || cat.includes('amarillo') || cat.includes('🟨')) {
    return {
      bg: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      border: '#fbbf24',
      text: '#fffbeb',
      badgeBg: 'rgba(217, 119, 6, 0.25)',
      badgeBorder: 'rgba(251, 191, 36, 0.5)',
      icon: '🟨',
      label: 'Verdadero o Falso (Pregunta Amarilla)',
      accentColor: '#f59e0b',
    };
  }
  if (cat.includes('bonificación') || cat.includes('bonificacion') || cat.includes('estrella') || cat.includes('dorado') || cat.includes('⭐') || cat.includes('bonus')) {
    return {
      bg: 'linear-gradient(135deg, #ca8a04 0%, #854d0e 100%)',
      border: '#facc15',
      text: '#fefce8',
      badgeBg: 'rgba(202, 138, 4, 0.3)',
      badgeBorder: 'rgba(250, 204, 21, 0.7)',
      icon: '⭐',
      label: 'Bonificación Histórica (Casilla Estrella)',
      accentColor: '#eab308',
      isStar: true,
    };
  }
  return {
    bg: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
    border: '#94a3b8',
    text: '#f8fafc',
    badgeBg: 'rgba(51, 65, 85, 0.4)',
    badgeBorder: 'rgba(148, 163, 184, 0.4)',
    icon: '📜',
    label: categoryString || 'Pregunta de Indagación',
    accentColor: '#64748b',
  };
};

// ============================================================================
// 6. COMPONENTE: QuestionModalDisplay (Modal Pedagógico para Proyección)
// ============================================================================
/**
 * Modal grande y accesible para proyectar en el salón de clases.
 * - Gran tamaño tipográfico para visibilidad a 5+ metros de distancia.
 * - Feedback inmediato de color (Verde esmeralda / Rojo carmesí con sacudida).
 * - Muestra la opción correcta si hubo fallo.
 * - Despliega la caja pedagógica con la cita del Tomo CEV 'No matarás'.
 * - Atajos de teclado (A, B, C, D o 1, 2, 3, 4 y Espacio/Enter para continuar).
 */
export const QuestionModalDisplay = ({
  question,
  isOpen = true,
  onSelectOption,
  onContinue,
  selectedOption = null,
  isAnswered = false,
  customCitationPrefix = '📖 Comisión de la Verdad (CEV) • Tomo «No matarás»',
}) => {
  const [localSelected, setLocalSelected] = useState(selectedOption);
  const [hasAnswered, setHasAnswered] = useState(isAnswered);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    injectStylesOnce();
  }, []);

  useEffect(() => {
    setLocalSelected(selectedOption);
    setHasAnswered(isAnswered);
  }, [selectedOption, isAnswered, question]);

  // Manejo de atajos de teclado para el ponente en clase
  useEffect(() => {
    if (!isOpen || !question) return;

    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();

      if (!hasAnswered) {
        const optionCount = question.options?.length || 0;
        let chosenIdx = -1;

        if (key === 'A' || key === '1') chosenIdx = 0;
        else if (key === 'B' || key === '2') chosenIdx = 1;
        else if ((key === 'C' || key === '3') && optionCount >= 3) chosenIdx = 2;
        else if ((key === 'D' || key === '4') && optionCount >= 4) chosenIdx = 3;
        else if (key === 'V' && question.type === 'true_false') chosenIdx = 0;
        else if (key === 'F' && question.type === 'true_false') chosenIdx = 1;

        if (chosenIdx >= 0 && chosenIdx < optionCount) {
          handleOptionClick(chosenIdx);
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleContinueClick();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, question, hasAnswered, localSelected]);

  if (!isOpen || !question) return null;

  const catTheme = getCategoryStyles(question.category || question.type);
  const isCorrect = localSelected !== null && localSelected === question.correct;

  const handleOptionClick = (idx) => {
    if (hasAnswered) return;
    setLocalSelected(idx);
    setHasAnswered(true);

    const correct = idx === question.correct;
    if (correct) {
      jepAudio.playSuccess();
    } else {
      jepAudio.playError();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }

    if (onSelectOption) {
      onSelectOption(idx, correct);
    }
  };

  const handleContinueClick = () => {
    jepAudio.playClick();
    if (onContinue) {
      onContinue();
    }
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto"
      style={{
        backgroundColor: 'rgba(2, 6, 23, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        className={`w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
          isShaking ? 'animate-[jepShake_0.5s_ease-in-out]' : ''
        }`}
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          border: `2px solid ${catTheme.border}`,
          boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px ${catTheme.badgeBorder}`,
          animation: 'jepPopIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* CABECERA DEL MODAL: Badge de Categoría y Cita Temática */}
        <div
          className="px-6 py-4 flex flex-wrap items-center justify-between gap-3"
          style={{
            background: catTheme.bg,
            borderBottom: '2px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{catTheme.icon}</span>
            <div>
              <span
                className="text-xs md:text-sm font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.35)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: catTheme.text,
                }}
              >
                {question.category || catTheme.label}
              </span>
            </div>
          </div>

          <div className="text-xs md:text-sm font-semibold text-white/90 flex items-center gap-1.5">
            <span>🏛️ Memoria Histórica</span>
            <span className="opacity-60">•</span>
            <span>1958 - 1978</span>
          </div>
        </div>

        {/* CUERPO DEL MODAL */}
        <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* ENUNCIADO DE LA PREGUNTA */}
          <div className="bg-slate-900/90 p-5 md:p-6 rounded-2xl border border-slate-700/80 shadow-inner">
            <p className="text-xs uppercase tracking-widest font-bold text-amber-400 mb-2">
              Pregunta de Indagación Pedagógica
            </p>
            <h2
              className="jep-font-serif text-xl md:text-2xl lg:text-3xl font-bold text-white leading-relaxed tracking-normal"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
              {question.question}
            </h2>
          </div>

          {/* LISTA DE OPCIONES DE RESPUESTA */}
          <div className="grid grid-cols-1 gap-3.5 pt-1">
            {question.options &&
              question.options.map((optionText, idx) => {
                const isSelected = localSelected === idx;
                const isThisTheCorrectAnswer = idx === question.correct;
                
                // Estilos según el estado de respuesta
                let buttonStyle = {
                  background: 'rgba(30, 41, 59, 0.85)',
                  border: '2px solid rgba(71, 85, 105, 0.6)',
                  color: '#f8fafc',
                  transform: 'scale(1)',
                };
                let badgeStyle = {
                  bg: '#334155',
                  text: '#cbd5e1',
                  border: '#475569',
                };
                let iconIndicator = null;

                if (hasAnswered) {
                  if (isThisTheCorrectAnswer) {
                    buttonStyle = {
                      background: 'linear-gradient(135deg, rgba(6, 95, 70, 0.95) 0%, rgba(4, 120, 87, 0.95) 100%)',
                      border: '3px solid #34d399',
                      color: '#ffffff',
                      boxShadow: '0 0 20px rgba(52, 211, 153, 0.45)',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    };
                    badgeStyle = { bg: '#059669', text: '#ffffff', border: '#34d399' };
                    iconIndicator = '✅';
                  } else if (isSelected && !isThisTheCorrectAnswer) {
                    buttonStyle = {
                      background: 'linear-gradient(135deg, rgba(153, 27, 27, 0.95) 0%, rgba(185, 28, 28, 0.95) 100%)',
                      border: '3px solid #f87171',
                      color: '#ffffff',
                      boxShadow: '0 0 20px rgba(239, 68, 68, 0.45)',
                      transform: 'scale(0.99)',
                    };
                    badgeStyle = { bg: '#dc2626', text: '#ffffff', border: '#f87171' };
                    iconIndicator = '❌';
                  } else {
                    buttonStyle = {
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '2px solid rgba(51, 65, 85, 0.4)',
                      color: '#94a3b8',
                      opacity: 0.55,
                      transform: 'scale(0.99)',
                    };
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleOptionClick(idx)}
                    className="w-full text-left p-4 md:p-5 rounded-2xl font-medium text-base md:text-lg flex items-center justify-between gap-4 transition-all duration-200 cursor-pointer group select-none shadow-md hover:border-amber-400/80 hover:shadow-lg focus:outline-none"
                    style={buttonStyle}
                  >
                    <div className="flex items-center gap-4">
                      {/* Letra o Indicador de la Opción */}
                      <span
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base flex-shrink-0 border shadow-sm transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: badgeStyle.bg,
                          color: badgeStyle.text,
                          borderColor: badgeStyle.border,
                        }}
                      >
                        {question.type === 'true_false'
                          ? idx === 0 ? 'V' : 'F'
                          : letters[idx] || (idx + 1)}
                      </span>

                      {/* Texto de la Opción */}
                      <span className="font-semibold tracking-normal text-slate-100">
                        {optionText}
                      </span>
                    </div>

                    {/* Ícono de Validación */}
                    {iconIndicator && (
                      <span className="text-2xl flex-shrink-0 animate-bounce">
                        {iconIndicator}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* CAJA PEDAGÓGICA Y CITA HISTÓRICA (Aparece tras responder) */}
          {hasAnswered && (
            <div
              className="p-5 md:p-6 rounded-2xl border transition-all duration-500 shadow-xl space-y-3"
              style={{
                background: isCorrect
                  ? 'linear-gradient(135deg, rgba(6, 78, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(69, 10, 10, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
                borderColor: isCorrect ? '#34d399' : '#f87171',
                animation: 'jepFadeSlideUp 0.4s ease-out forwards',
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 font-black text-lg">
                  <span className="text-2xl">{isCorrect ? '🌟 ¡Respuesta Correcta!' : '📌 Aclaración Pedagógica'}</span>
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                    style={{
                      background: isCorrect ? 'rgba(52, 211, 153, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                      color: isCorrect ? '#6ee7b7' : '#fca5a5',
                    }}
                  >
                    {isCorrect ? '+1 Acierto de Memoria' : 'Análisis Histórico'}
                  </span>
                </div>
              </div>

              {/* Explicación Pedagógica */}
              {question.explanation && (
                <p className="text-slate-100 text-sm md:text-base leading-relaxed font-normal">
                  {question.explanation}
                </p>
              )}

              {/* Cita Oficial de la Comisión de la Verdad / JEP */}
              {question.citation && (
                <div className="pt-2 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs md:text-sm text-amber-300 font-semibold italic">
                  <div className="flex items-center gap-1.5">
                    <span>{question.citation.includes('📖') ? '' : '📖 '}</span>
                    <span>{question.citation}</span>
                  </div>
                  <span className="text-slate-400 not-italic text-xs">
                    Comunidad de Indagación 3
                  </span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* PIE DEL MODAL: Botón Continuar Recorrido */}
        {hasAnswered && (
          <div
            className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4"
          >
            <span className="text-xs text-slate-400 hidden sm:inline">
              Presiona <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-amber-400 font-mono text-xs">Espacio</kbd> o <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-amber-400 font-mono text-xs">Enter</kbd> para avanzar
            </span>

            <button
              onClick={handleContinueClick}
              type="button"
              className="ml-auto w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base md:text-lg tracking-wide uppercase cursor-pointer flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                color: '#ffffff',
                border: '2px solid #6ee7b7',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.6)',
              }}
            >
              <span>Continuar Recorrido</span>
              <span className="text-xl">➡️</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

// ============================================================================
// 7. COMPONENTE: IntroCinematicOverlay (Pantalla de Inicio y Ambientación)
// ============================================================================
/**
 * Pantalla cinemática introductoria con Don Jacinto en el cafetal.
 * Diálogo de ambientación histórica y botones para iniciar o saltar la intro.
 */
export const IntroCinematicOverlay = ({
  isOpen = true,
  onStart,
  onSkip,
  title = 'Juego JEP: Don Jacinto',
  subtitle = 'Recuperando la Finca La Esperanza • 1958-1978',
  teamMembers = 'Isabella Ortiz • Alison Cuasquer • Valery Lopez • Valentina Benavidez',
}) => {
  const [currentDialogueIdx, setCurrentDialogueIdx] = useState(0);

  const dialogues = [
    {
      speaker: 'Don Jacinto (Campesino y Testigo de la Historia)',
      avatar: '👨‍🌾',
      badge: 'Finca La Esperanza • 1958',
      text: '¡Buenos días, muchachos! Soy Don Jacinto. Durante décadas, mi familia ha cultivado este café en las laderas de Colombia. Pero entre 1958 y 1978, los vientos del conflicto y el Frente Nacional transformaron nuestros campos...',
    },
    {
      speaker: 'Don Jacinto',
      avatar: '☕',
      badge: 'Contexto de Indagación',
      text: 'El pacto bipartidista prometió traer paz entre liberales y conservadores, pero cerró las puertas a nuevas voces. En los montes surgieron las guerrillas (FARC, ELN, EPL, M-19) y nuestros campesinos lucharon por su tierra y dignidad.',
    },
    {
      speaker: 'Don Jacinto',
      avatar: '🌾',
      badge: 'Misión del Recorrido',
      text: 'Hoy los invito a caminar por los 8 tramos de nuestra historia. Si respondemos con la verdad de los informes de la Comisión de la Verdad y la JEP, recuperaremos la Finca La Esperanza. ¿Están listos para comenzar?',
    },
  ];

  useEffect(() => {
    injectStylesOnce();
  }, []);

  if (!isOpen) return null;

  const handleNextDialogue = () => {
    jepAudio.playClick();
    if (currentDialogueIdx < dialogues.length - 1) {
      setCurrentDialogueIdx((prev) => prev + 1);
    } else {
      handleStartClick();
    }
  };

  const handleStartClick = () => {
    jepAudio.playSuccess();
    if (onStart) onStart();
  };

  const handleSkipClick = () => {
    jepAudio.playClick();
    if (onSkip) onSkip();
    else if (onStart) onStart();
  };

  const currentDialogue = dialogues[currentDialogueIdx];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{
        background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.96) 0%, rgba(2, 6, 23, 0.99) 100%)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div
        className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border"
        style={{
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          borderColor: 'rgba(234, 179, 8, 0.4)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(234, 179, 8, 0.2)',
          animation: 'jepPopIn 0.4s ease-out',
        }}
      >
        {/* ENCABEZADO CINEMÁTICO */}
        <div
          className="p-6 md:p-8 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #166534 0%, #14532d 50%, #713f12 100%)',
            borderBottom: '2px solid rgba(234, 179, 8, 0.4)',
          }}
        >
          <div className="absolute top-2 right-4 opacity-15 text-8xl select-none">
            🌾
          </div>

          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/40 mb-3">
            Comunidad de Indagación 3 • 1958 - 1978
          </span>

          <h1 className="jep-font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            {title}
          </h1>
          <p className="text-emerald-200 text-sm md:text-base font-medium mt-2 max-w-xl mx-auto">
            {subtitle}
          </p>
          <p className="text-xs text-amber-200/80 mt-1 font-semibold">
            {teamMembers}
          </p>
        </div>

        {/* CONTENIDO DEL DIÁLOGO */}
        <div className="p-6 md:p-8 space-y-6">
          
          <div className="flex items-start gap-4 md:gap-6 bg-slate-900/90 p-5 md:p-6 rounded-2xl border border-slate-700/80 shadow-inner">
            {/* Avatar de Don Jacinto */}
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-4xl md:text-5xl flex-shrink-0 shadow-lg border"
              style={{
                background: 'linear-gradient(135deg, #854d0e 0%, #a16207 100%)',
                borderColor: '#facc15',
                animation: 'jepFloat 3s ease-in-out infinite',
              }}
            >
              {currentDialogue.avatar}
            </div>

            {/* Texto del Diálogo */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-base md:text-lg font-bold text-amber-300">
                  {currentDialogue.speaker}
                </h3>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {currentDialogue.badge}
                </span>
              </div>
              <p className="text-slate-100 text-sm md:text-base leading-relaxed font-normal jep-font-serif">
                «{currentDialogue.text}»
              </p>
            </div>
          </div>

          {/* Indicador de pasos de diálogo */}
          <div className="flex items-center justify-center gap-2">
            {dialogues.map((_, idx) => (
              <div
                key={idx}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: idx === currentDialogueIdx ? '28px' : '8px',
                  backgroundColor: idx === currentDialogueIdx ? '#facc15' : '#475569',
                }}
              />
            ))}
          </div>

        </div>

        {/* ACCIONES DE INICIO */}
        <div className="px-6 py-5 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleSkipClick}
            type="button"
            className="text-xs md:text-sm text-slate-400 hover:text-slate-200 font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Saltar Introducción ⏩
          </button>

          <div className="flex items-center gap-3 ml-auto">
            {currentDialogueIdx < dialogues.length - 1 ? (
              <button
                onClick={handleNextDialogue}
                type="button"
                className="px-6 py-3 rounded-xl font-bold text-sm md:text-base bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 transition cursor-pointer flex items-center gap-2"
              >
                <span>Siguiente Diálogo</span>
                <span>➡️</span>
              </button>
            ) : null}

            <button
              onClick={handleStartClick}
              type="button"
              className="px-7 py-3.5 rounded-2xl font-black text-sm md:text-base uppercase tracking-wider text-white shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2.5"
              style={{
                background: 'linear-gradient(135deg, #15803d 0%, #166534 50%, #854d0e 100%)',
                border: '2px solid #facc15',
                boxShadow: '0 0 25px rgba(234, 179, 8, 0.45)',
              }}
            >
              <span>Comenzar Recorrido</span>
              <span className="text-xl">🚀</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// 8. COMPONENTE DE CONFETI PARA CELEBRACIÓN (Canvas / CSS)
// ============================================================================
const ConfettiRain = () => {
  const pieces = Array.from({ length: 45 });
  const colors = ['#facc15', '#10b981', '#3b82f6', '#ec4899', '#f97316', '#a855f7', '#ffffff'];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const animDuration = 2.5 + Math.random() * 3;
        const animDelay = Math.random() * 2;
        const color = colors[i % colors.length];
        const size = 8 + Math.random() * 10;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '-20px',
              left: `${left}%`,
              width: `${size}px`,
              height: `${size * 1.5}px`,
              backgroundColor: color,
              borderRadius: '3px',
              animation: `jepConfettiFall ${animDuration}s linear ${animDelay}s infinite`,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};

// ============================================================================
// 9. COMPONENTE: VictoryModal (Victoria y Conclusión Pedagógica)
// ============================================================================
/**
 * Modal de Victoria Histórica.
 * - Celebración con confeti animado.
 * - Mensaje de recuperación de la Finca La Esperanza.
 * - Créditos completos del equipo y fuentes oficiales de la CEV/JEP.
 * - Botón 'Volver a Jugar'.
 */
export const VictoryModal = ({
  isOpen = true,
  onRestart,
  score = 8,
  maxTurns = 8,
  teamMembers = 'Isabella Ortiz • Alison Cuasquer • Valery Lopez • Valentina Benavidez',
}) => {
  useEffect(() => {
    injectStylesOnce();
    if (isOpen) {
      jepAudio.playFanfare();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      style={{
        backgroundColor: 'rgba(2, 6, 23, 0.92)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <ConfettiRain />

      <div
        className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10"
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          border: '3px solid #facc15',
          boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.9), 0 0 50px rgba(234, 179, 8, 0.5)',
          animation: 'jepPopIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ENCABEZADO DORADO DE VICTORIA */}
        <div
          className="p-6 md:p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, #854d0e 0%, #ca8a04 50%, #166534 100%)',
            borderBottom: '2px solid rgba(250, 204, 21, 0.5)',
          }}
        >
          <div
            className="text-6xl md:text-7xl mb-2"
            style={{ animation: 'jepFloat 2.5s ease-in-out infinite' }}
          >
            🏆
          </div>
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-950/60 text-amber-200 border border-amber-400/50">
            ¡Misión Histórica Cumplida!
          </span>
          <h1 className="jep-font-serif text-3xl md:text-4xl font-black text-white mt-2 drop-shadow-md">
            ¡Victoria para Don Jacinto!
          </h1>
          <p className="text-amber-100 text-sm md:text-base font-semibold mt-1">
            Has recuperado la Finca «La Esperanza» y defendido la memoria histórica.
          </p>
        </div>

        {/* CUERPO DEL LOGRO PEDAGÓGICO */}
        <div className="p-6 md:p-8 space-y-5">
          
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700 space-y-3">
            <h3 className="text-sm uppercase tracking-widest font-black text-amber-400 flex items-center gap-2">
              <span>🌾</span>
              <span>Balance de Aprendizaje y Convivencia</span>
            </h3>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed jep-font-serif">
              «Comprender el periodo 1958-1978 nos permite reconocer que las demandas campesinas y la movilización social fueron derechos legítimos. Escuchar la verdad y honrar a las víctimas es el fundamento de la no repetición y la paz en Colombia.»
            </p>
          </div>

          {/* CRÉDITOS Y FUENTES */}
          <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-800/60 text-xs space-y-1.5 text-emerald-200">
            <div className="font-bold text-white uppercase tracking-wider text-xs">
              Comunidad de Indagación 3 (1958 - 1978)
            </div>
            <div>
              <span className="text-amber-300 font-semibold">Investigadoras: </span>
              <span className="text-slate-200">{teamMembers}</span>
            </div>
            <div>
              <span className="text-amber-300 font-semibold">Fuente: </span>
              <span className="text-slate-200">Comisión de la Verdad (CEV) • Tomo «No matarás» & Criterios JEP</span>
            </div>
          </div>

        </div>

        {/* BOTÓN VOLVER A JUGAR */}
        <div className="p-6 bg-slate-950/90 border-t border-slate-800 text-center">
          <button
            onClick={() => {
              jepAudio.playClick();
              if (onRestart) onRestart();
            }}
            type="button"
            className="w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-base md:text-lg uppercase tracking-wider text-white shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-3 mx-auto"
            style={{
              background: 'linear-gradient(135deg, #15803d 0%, #166534 50%, #854d0e 100%)',
              border: '2px solid #facc15',
              boxShadow: '0 0 30px rgba(234, 179, 8, 0.6)',
            }}
          >
            <span>🌾 Volver a Jugar / Nueva Exposición</span>
            <span className="text-xl">🔄</span>
          </button>
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// 10. COMPONENTE: GameOverModal (Pantalla Motivacional de Memoria)
// ============================================================================
/**
 * Pantalla cuando se agotan las vidas.
 * - Mensaje reflexivo y motivacional sobre la memoria histórica.
 * - Botón para intentar de nuevo.
 */
export const GameOverModal = ({
  isOpen = true,
  onRetry,
  turnReached = 1,
  maxTurns = 8,
  teamMembers = 'Isabella Ortiz • Alison Cuasquer • Valery Lopez • Valentina Benavidez',
}) => {
  useEffect(() => {
    injectStylesOnce();
    if (isOpen) {
      jepAudio.playGameOver();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      style={{
        backgroundColor: 'rgba(2, 6, 23, 0.94)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div
        className="w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border"
        style={{
          background: 'linear-gradient(180deg, #1e1b2e 0%, #0f172a 100%)',
          borderColor: 'rgba(239, 68, 68, 0.5)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(239, 68, 68, 0.3)',
          animation: 'jepPopIn 0.4s ease-out',
        }}
      >
        {/* ENCABEZADO REFLEXIVO */}
        <div
          className="p-6 md:p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #450a0a 100%)',
            borderBottom: '2px solid rgba(239, 68, 68, 0.4)',
          }}
        >
          <div className="text-6xl mb-2">🕊️</div>
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-red-950/70 text-red-200 border border-red-500/40">
            Reflexión de Memoria Histórica
          </span>
          <h2 className="jep-font-serif text-2xl md:text-3xl font-black text-white mt-2">
            El Camino Hacia la Verdad Continúa
          </h2>
          <p className="text-red-200 text-xs md:text-sm mt-1">
            Llegaste hasta el <span className="font-bold text-white">Turno {turnReached}</span> de {maxTurns}
          </p>
        </div>

        {/* CONTENIDO REFLEXIVO */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700/80 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Mensaje Pedagógico
            </h4>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed jep-font-serif">
              «Don Jacinto debe tomar un descanso en el cafetal, pero la historia de nuestras comunidades no se apaga. Cada intento nos enseña a profundizar en las raíces del conflicto para construir un país con justicia y paz.»
            </p>
          </div>

          <p className="text-xs text-center text-slate-400">
            {teamMembers} • Comunidad de Indagación 3
          </p>
        </div>

        {/* BOTÓN INTENTAR DE NUEVO */}
        <div className="p-6 bg-slate-950/90 border-t border-slate-800 text-center">
          <button
            onClick={() => {
              jepAudio.playClick();
              if (onRetry) onRetry();
            }}
            type="button"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base uppercase tracking-wider text-white shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 mx-auto"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
              border: '2px solid #f87171',
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.5)',
            }}
          >
            <span>🔄 Intentar de Nuevo (Reiniciar Vidas)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// EXPORTACIÓN POR DEFECTO PARA INTEGRACIÓN FLUIDA
// ============================================================================
const UIComponents = {
  PresenterHeader,
  QuestionModalDisplay,
  IntroCinematicOverlay,
  VictoryModal,
  GameOverModal,
  jepAudio,
  getCategoryStyles,
  toggleFullScreen,
};

// Asignación a window si se corre en entorno de navegador sin bundler
if (typeof window !== 'undefined') {
  window.JEP_UI = UIComponents;
}

export default UIComponents;
