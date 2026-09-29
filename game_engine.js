/**
 * ============================================================================
 * JUEGO JEP: DON JACINTO - MOTOR DE JUEGO, AUDIO Y MATEMÁTICAS (v1.0.0)
 * ============================================================================
 * 
 * Componentes principales:
 * 1. generateTurnDicePlan(totalSteps, turns, options):
 *    - Generador matemático estocástico de secuencias de dados (sum = 24 en 8 turnos).
 * 2. WebAudioSynthesizer:
 *    - Sintetizador puro Web Audio API sin librerías externas con audio procedimental:
 *      * playDiceRoll(): Dados rodando y rebotando con física acústica.
 *      * playStep(): Pasos campesinos de Don Jacinto sobre tierra/piedra.
 *      * playCorrect(): Acorde brillante mayor Do-Mi-Sol-Do con armónicos de triunfo.
 *      * playWrong(): Tono descendente grave cálido de error.
 *      * playBonus(): Arpegio cristalino mágico de casilla estrella.
 *      * playVictory(): Fanfarria festiva orquestal con trompetas sintetizadas.
 *      * playIntroChirp(): Canto matutino de aves en el cafetal colombiano.
 *      * Control de Mute / Volumen maestro.
 * 3. BoardPathCoordinates:
 *    - Las 24 casillas en coordenadas normalizadas (X%, Y%) trazando un sendero
 *      sinuoso desde el cafetal (6%, 75%) hasta la Finca (92%, 30%).
 *    - Asignación pedagógica de categorías (🟦 Múltiple, 🟩 ABC, 🟨 V/F, ⭐ Bonificación).
 * 4. JEPGameEngine:
 *    - Máquina de estados integral para orquestar la partida, vidas, puntuación,
 *      racha, banco de preguntas y navegación.
 * 
 * Compatible con entornos Navegador (window.*) y Node.js (CommonJS / ES Modules).
 * ============================================================================
 */

(function (global) {
  'use strict';

  // ============================================================================
  // 1. GENERADOR MATEMÁTICO DE TIRADAS DE DADOS (DICE PLAN GENERATOR)
  // ============================================================================

  /**
   * Genera un plan estocástico de tiradas de dado cuya suma sea EXACTAMENTE `totalSteps` en `turns` turnos.
   * 
   * @param {number} [totalSteps=24] - Total de casillas a recorrer (por defecto 24).
   * @param {number} [turns=8] - Número exacto de turnos de la partida (por defecto 8).
   * @param {Object} [options={}] - Opciones de configuración matemática.
   * @param {number} [options.minStep=2] - Paso mínimo permitido por tirada (default 2).
   * @param {number} [options.maxStep=4] - Paso máximo permitido por tirada (default 4).
   * @param {boolean} [options.allowExtremes=true] - Permite variaciones ocasionales de 1 a 5 si se solicita.
   * @param {number} [options.randomWalkIterations=30] - Iteraciones de perturbación aleatoria para máxima entropía.
   * @returns {number[]} Array de enteros de longitud `turns` cuya suma es estrictamente `totalSteps`.
   */
  function generateTurnDicePlan(totalSteps = 24, turns = 8, options = {}) {
    const minStep = options.minStep !== undefined ? options.minStep : 2;
    const maxStep = options.maxStep !== undefined ? options.maxStep : 4;
    const iterations = options.randomWalkIterations || 40;

    // Validación de viabilidad matemática
    if (turns * minStep > totalSteps || turns * maxStep < totalSteps) {
      throw new RangeError(
        `Imposible sumar ${totalSteps} en ${turns} turnos con rango [${minStep}, ${maxStep}]. ` +
        `Rango posible: [${turns * minStep} - ${turns * maxStep}].`
      );
    }

    // Inicialización base equitativa
    const baseValue = Math.floor(totalSteps / turns);
    let remainder = totalSteps % turns;
    const plan = new Array(turns).fill(baseValue);

    // Distribuir el residuo inicial
    for (let i = 0; i < remainder; i++) {
      plan[i]++;
    }

    // Barajado inicial (Fisher-Yates)
    for (let i = plan.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [plan[i], plan[j]] = [plan[j], plan[i]];
    }

    // Algoritmo de paseo aleatorio conservativo (Zero-Sum Stochastic Perturbation)
    // Transfiere unidades entre dos posiciones aleatorias manteniendo la suma invariante en 24
    for (let iter = 0; iter < iterations; iter++) {
      const idxA = Math.floor(Math.random() * turns);
      let idxB = Math.floor(Math.random() * turns);
      while (idxB === idxA) {
        idxB = Math.floor(Math.random() * turns);
      }

      // Delta aleatorio (+1 o +2)
      const maxTransferPossible = Math.min(plan[idxA] - minStep, maxStep - plan[idxB]);
      if (maxTransferPossible > 0) {
        const delta = Math.floor(Math.random() * maxTransferPossible) + 1;
        plan[idxA] -= delta;
        plan[idxB] += delta;
      }
    }

    // Barajado final para eliminar cualquier sesgo posicional
    for (let i = plan.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [plan[i], plan[j]] = [plan[j], plan[i]];
    }

    // Verificación de integridad estricta
    const finalSum = plan.reduce((acc, val) => acc + val, 0);
    if (finalSum !== totalSteps || plan.length !== turns) {
      // Fallback determinista seguro en caso extremo
      return generateTurnDicePlanFallback(totalSteps, turns, minStep, maxStep);
    }

    return plan;
  }

  /**
   * Generador alternativo determinista de respaldo si se excedieran los límites.
   */
  function generateTurnDicePlanFallback(totalSteps = 24, turns = 8, minStep = 2, maxStep = 4) {
    const templates = [
      [3, 2, 4, 3, 2, 4, 3, 3],
      [4, 3, 2, 4, 3, 2, 3, 3],
      [2, 4, 3, 3, 4, 2, 3, 3],
      [3, 3, 4, 2, 3, 4, 2, 3],
      [4, 2, 3, 4, 2, 3, 3, 3],
      [2, 3, 4, 3, 3, 2, 4, 3],
      [3, 4, 2, 3, 4, 3, 2, 3],
      [4, 4, 2, 2, 3, 3, 3, 3]
    ];
    const chosen = templates[Math.floor(Math.random() * templates.length)].slice();
    for (let i = chosen.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chosen[i], chosen[j]] = [chosen[j], chosen[i]];
    }
    return chosen;
  }

  /**
   * Valida exhaustivamente un plan de dados.
   */
  function validateDicePlan(plan, expectedSum = 24, expectedTurns = 8, minStep = 1, maxStep = 6) {
    if (!Array.isArray(plan)) return { valid: false, reason: 'El plan no es un Array.' };
    if (plan.length !== expectedTurns) {
      return { valid: false, reason: `Longitud ${plan.length} difiere de los ${expectedTurns} turnos requeridos.` };
    }
    const sum = plan.reduce((a, b) => a + b, 0);
    if (sum !== expectedSum) {
      return { valid: false, reason: `La suma total (${sum}) no es exactamente ${expectedSum}.` };
    }
    for (let i = 0; i < plan.length; i++) {
      const val = plan[i];
      if (!Number.isInteger(val) || val < minStep || val > maxStep) {
        return { valid: false, reason: `El turno ${i + 1} tiene un valor no permitido (${val}).` };
      }
    }
    return { valid: true, sum, turns: plan.length };
  }

  // ============================================================================
  // 2. SISTEMA DE AUDIO NATIVO WEB AUDIO API (WEB AUDIO SYNTHESIZER)
  // ============================================================================

  class WebAudioSynthesizer {
    constructor(options = {}) {
      this.volume = options.volume !== undefined ? options.volume : 0.85;
      this.muted = !!options.muted;
      this.ctx = null;
      this.masterGain = null;
      this._unlocked = false;

      // Autoinicialización perezosa (Lazy Init)
      this._initContext();
    }

    /**
     * Inicializa de forma segura el AudioContext respetando las políticas del navegador.
     */
    _initContext() {
      if (typeof window === 'undefined') return; // Entorno Node.js
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.warn('[WebAudioSynthesizer] Web Audio API no está soportada en este navegador.');
        return;
      }

      if (!this.ctx) {
        try {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        } catch (e) {
          console.warn('[WebAudioSynthesizer] Error inicializando AudioContext:', e);
        }
      }
    }

    /**
     * Desbloquea el AudioContext ante el primer toque o click del usuario.
     */
    unlock() {
      if (!this.ctx) this._initContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        return this.ctx.resume().then(() => {
          this._unlocked = true;
          return true;
        }).catch(err => {
          console.warn('[WebAudioSynthesizer] No se pudo reanudar AudioContext:', err);
          return false;
        });
      }
      this._unlocked = true;
      return Promise.resolve(true);
    }

    /**
     * Establece el volumen maestro (0.0 a 1.0).
     */
    setVolume(value) {
      this.volume = Math.max(0, Math.min(1, Number(value) || 0));
      if (this.masterGain && this.ctx && !this.muted) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.05);
      }
    }

    /**
     * Obtiene el volumen actual.
     */
    getVolume() {
      return this.volume;
    }

    /**
     * Silencia o activa el sonido.
     */
    setMuted(muteState) {
      this.muted = !!muteState;
      if (this.masterGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.linearRampToValueAtTime(this.muted ? 0 : this.volume, now + 0.05);
      }
    }

    /**
     * Alterna el estado de mute.
     */
    toggleMute() {
      this.setMuted(!this.muted);
      return this.muted;
    }

    isMuted() {
      return this.muted;
    }

    // --------------------------------------------------------------------------
    // UTILIDADES PROCEDIMENTALES DE SÍNTESIS
    // --------------------------------------------------------------------------

    /**
     * Genera un buffer de ruido blanco de duración `durationSec`.
     */
    _createNoiseBuffer(durationSec = 0.2) {
      if (!this.ctx) return null;
      const bufferSize = Math.floor(this.ctx.sampleRate * durationSec);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      return buffer;
    }

    // --------------------------------------------------------------------------
    // 2.1 playDiceRoll(): Sonido realista de dados rodando y rebotando en madera
    // --------------------------------------------------------------------------
    playDiceRoll() {
      if (!this.ctx || this.muted) return;
      this.unlock();
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Secuencia de rebotes con intervalos decrecientes (simulando fricción y reposo)
      const bounces = [
        { time: 0.00, pitch: 420, intensity: 0.85, clickDur: 0.045 },
        { time: 0.08, pitch: 480, intensity: 0.70, clickDur: 0.040 },
        { time: 0.15, pitch: 390, intensity: 0.60, clickDur: 0.035 },
        { time: 0.21, pitch: 460, intensity: 0.50, clickDur: 0.030 },
        { time: 0.26, pitch: 430, intensity: 0.40, clickDur: 0.025 },
        { time: 0.30, pitch: 510, intensity: 0.90, clickDur: 0.060 } // Impacto final seco
      ];

      bounces.forEach(b => {
        const t = now + b.time;

        // Capa 1: Resonancia de la madera del cubilete/tablero (Cuerpo tonal)
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(b.pitch * (0.9 + Math.random() * 0.2), t);
        osc.frequency.exponentialRampToValueAtTime(80, t + b.clickDur);

        oscGain.gain.setValueAtTime(b.intensity * 0.45, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + b.clickDur);

        osc.connect(oscGain);
        oscGain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + b.clickDur + 0.01);

        // Capa 2: Fricción y chasquido del borde del dado (Ruido filtrado pasabanda)
        const noiseBuffer = this._createNoiseBuffer(b.clickDur + 0.01);
        if (noiseBuffer) {
          const noiseSource = ctx.createBufferSource();
          noiseSource.buffer = noiseBuffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1100 + Math.random() * 400, t);
          filter.Q.setValueAtTime(3.5, t);

          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(b.intensity * 0.35, t);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, t + b.clickDur);

          noiseSource.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(this.masterGain);

          noiseSource.start(t);
          noiseSource.stop(t + b.clickDur + 0.01);
        }
      });
    }

    // --------------------------------------------------------------------------
    // 2.2 playStep(): Pasos campesinos de Don Jacinto sobre el sendero de tierra
    // --------------------------------------------------------------------------
    playStep() {
      if (!this.ctx || this.muted) return;
      this.unlock();
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const duration = 0.12;

      // Capa 1: Golpe de bota campesina (Thud grave con amortiguación de tierra)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(115 + Math.random() * 15, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + duration);

      oscGain.gain.setValueAtTime(0.38, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + duration + 0.01);

      // Capa 2: Fricción de gravilla/hojarasca del cafetal
      const noiseBuffer = this._createNoiseBuffer(duration);
      if (noiseBuffer) {
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1600 + Math.random() * 300, now);
        filter.Q.setValueAtTime(1.8, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.18, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + duration + 0.01);
      }
    }

    // --------------------------------------------------------------------------
    // 2.3 playCorrect(): Acorde brillante ascendente mayor Do-Mi-Sol-Do (Triunfo)
    // --------------------------------------------------------------------------
    playCorrect() {
      if (!this.ctx || this.muted) return;
      this.unlock();
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Arpegio mayor celestial: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
      const notes = [
        { freq: 523.25, time: 0.00, dur: 0.45, gain: 0.30 },
        { freq: 659.25, time: 0.08, dur: 0.45, gain: 0.32 },
        { freq: 783.99, time: 0.16, dur: 0.50, gain: 0.35 },
        { freq: 1046.50, time: 0.24, dur: 0.85, gain: 0.40 }
      ];

      notes.forEach(n => {
        const t = now + n.time;

        // Oscilador principal (Chime puro tipo campana)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(n.freq, t);

        // Armónico de brillo (octava superior levemente desafinada para efecto celestial)
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(n.freq * 2.004, t);

        // Envolvente tipo campana cristalina
        gainNode.gain.setValueAtTime(0.0001, t);
        gainNode.gain.linearRampToValueAtTime(n.gain, t + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + n.dur);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + n.dur + 0.05);
        osc2.stop(t + n.dur + 0.05);
      });
    }

    // --------------------------------------------------------------------------
    // 2.4 playWrong(): Tono descendente grave cálido de error
    // --------------------------------------------------------------------------
    playWrong() {
      if (!this.ctx || this.muted) return;
      this.unlock();
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const duration = 0.45;

      // Dos osciladores en intervalo disonante cayendo en pitch
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      // Caída de tono suave
      osc1.frequency.setValueAtTime(190, now);
      osc1.frequency.exponentialRampToValueAtTime(62, now + duration);

      osc2.frequency.setValueAtTime(133, now);
      osc2.frequency.exponentialRampToValueAtTime(50, now + duration);

      // Filtro paso-bajo cálido para evitar estridencias molestas
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + duration);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(0.40, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
    }

    // --------------------------------------------------------------------------
    // 2.5 playBonus(): Arpegio mágico de casilla estrella de Memoria Histórica
    // --------------------------------------------------------------------------
    playBonus() {
      if (!this.ctx || this.muted) return;
      this.unlock();
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Escala mágica pentatónica brillante ascendente y destello final
      const magicFrequencies = [
        587.33, // D5
        739.99, // F#5
        880.00, // A5
        1108.73, // C#6
        1479.98, // F#6
        1760.00, // A6
        2217.46  // C#7
      ];

      magicFrequencies.forEach((freq, index) => {
        const t = now + index * 0.055;
        const noteDur = 0.55;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        // Modulación ligera de vibrato brillante
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(14, t);
        lfoGain.gain.setValueAtTime(freq * 0.015, t);
        lfo.connect(osc.frequency);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.24, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + noteDur);

        osc.connect(gain);
        gain.connect(this.masterGain);

        lfo.start(t);
        osc.start(t);
        lfo.stop(t + noteDur);
        osc.stop(t + noteDur + 0.05);
      });
    }

    // --------------------------------------------------------------------------
    // 2.6 playVictory(): Fanfarria festiva de trompetas y victoria
    // --------------------------------------------------------------------------
    playVictory() {
      if (!this.ctx || this.muted) return;
      this.unlock();
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Secuencia de notas de fanfarria tradicional
      const melody = [
        // Compás 1: Llamado triunfal
        { freq: 392.00, time: 0.00, dur: 0.16, isChord: false }, // G4
        { freq: 523.25, time: 0.18, dur: 0.16, isChord: false }, // C5
        { freq: 659.25, time: 0.36, dur: 0.16, isChord: false }, // E5
        { freq: 783.99, time: 0.54, dur: 0.42, isChord: false }, // G5

        // Compás 2: Repique rítmico
        { freq: 659.25, time: 1.02, dur: 0.14, isChord: false }, // E5
        { freq: 783.99, time: 1.18, dur: 0.48, isChord: false }, // G5

        // Acorde final sostenido majestuoso (C Mayor brillante con cuerpo)
        { freq: 523.25, time: 1.70, dur: 1.40, isChord: true }, // C5
        { freq: 659.25, time: 1.70, dur: 1.40, isChord: true }, // E5
        { freq: 783.99, time: 1.70, dur: 1.40, isChord: true }, // G5
        { freq: 1046.50, time: 1.70, dur: 1.40, isChord: true }  // C6
      ];

      melody.forEach(note => {
        const t = now + note.time;

        // Modelado de trompeta/bronces: Dientes de sierra enriquecidos con filtro dinámico
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const noteGain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(note.freq, t);
        osc2.frequency.setValueAtTime(note.freq * 1.002, t); // Leve ensanchamiento estéreo/fase

        filter.type = 'lowpass';
        // Envolvente de filtro de bronce (Apertura rápida y brillo brillante)
        filter.frequency.setValueAtTime(600, t);
        filter.frequency.linearRampToValueAtTime(3200, t + 0.05);
        filter.frequency.exponentialRampToValueAtTime(1400, t + note.dur);

        noteGain.gain.setValueAtTime(0.0001, t);
        noteGain.gain.linearRampToValueAtTime(note.isChord ? 0.20 : 0.32, t + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, t + note.dur);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + note.dur + 0.05);
        osc2.stop(t + note.dur + 0.05);
      });
    }

    // --------------------------------------------------------------------------
    // 2.7 playIntroChirp(): Canto suave de pájaros mañaneros en el cafetal
    // --------------------------------------------------------------------------
    playIntroChirp() {
      if (!this.ctx || this.muted) return;
      this.unlock();
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Trinos de ave tropical colombiana (Mirla / Turpial)
      const chirps = [
        { tOffset: 0.00, startF: 2400, peakF: 3400, endF: 2800, dur: 0.08 },
        { tOffset: 0.12, startF: 2900, peakF: 4100, endF: 3200, dur: 0.11 },
        { tOffset: 0.28, startF: 3300, peakF: 4400, endF: 3000, dur: 0.14 },
        { tOffset: 0.65, startF: 2600, peakF: 3600, endF: 2900, dur: 0.09 },
        { tOffset: 0.78, startF: 3100, peakF: 4200, endF: 3500, dur: 0.13 }
      ];

      chirps.forEach(c => {
        const t = now + c.tOffset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(c.startF, t);
        osc.frequency.linearRampToValueAtTime(c.peakF, t + c.dur * 0.4);
        osc.frequency.exponentialRampToValueAtTime(c.endF, t + c.dur);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.16, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + c.dur);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + c.dur + 0.02);
      });
    }
  }

  // ============================================================================
  // 2.8 CONTROLADOR INTEGRAL DE AUDIO Y EDGE NEURAL TTS (GAME AUDIO CONTROLLER)
  // ============================================================================

  class GameAudioController {
    constructor(options = {}) {
      this.synth = new WebAudioSynthesizer(options);
      this.muted = !!options.muted;
      this.voiceEnabled = options.voiceEnabled !== undefined ? !!options.voiceEnabled : true;
      this.volume = options.volume !== undefined ? options.volume : 0.9;
      this.currentAudio = null;
      this.currentUtterance = null;
    }

    init() {
      this.synth.unlock();
    }

    setVolume(val) {
      this.volume = Math.max(0, Math.min(1, Number(val) || 0));
      this.synth.setVolume(this.volume);
      if (this.currentAudio) {
        this.currentAudio.volume = this.muted ? 0 : this.volume;
      }
    }

    getVolume() {
      return this.volume;
    }

    toggleMute() {
      this.muted = !this.muted;
      this.synth.setMuted(this.muted);
      if (this.currentAudio) {
        if (this.muted) {
          this.currentAudio.pause();
        } else if (this.voiceEnabled) {
          this.currentAudio.volume = this.volume;
        }
      }
      if (this.muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return this.muted;
    }

    toggleVoice() {
      this.voiceEnabled = !this.voiceEnabled;
      if (!this.voiceEnabled) {
        this.stopVoice();
      }
      return this.voiceEnabled;
    }

    stopVoice() {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }

    playB64Voice(b64Data, onEnded) {
      if (this.muted || !this.voiceEnabled || !b64Data) {
        if (onEnded) onEnded();
        return;
      }
      this.stopVoice();
      try {
        if (typeof Audio === 'undefined') {
          if (onEnded) onEnded();
          return;
        }
        const audio = new Audio(b64Data);
        audio.volume = this.volume;
        this.currentAudio = audio;
        audio.onended = () => {
          if (this.currentAudio === audio) this.currentAudio = null;
          if (onEnded) onEnded();
        };
        audio.onerror = (e) => {
          console.warn('[GameAudioController] Base64 Voice playback notice:', e);
          if (this.currentAudio === audio) this.currentAudio = null;
          if (onEnded) onEnded();
        };
        audio.play().catch(e => {
          console.log('[GameAudioController] Autoplay notice:', e);
          if (onEnded) onEnded();
        });
      } catch (err) {
        console.error('[GameAudioController] Audio error:', err);
        if (onEnded) onEnded();
      }
    }

    playNamedVoice(name, onEnded) {
      const voices = (typeof window !== 'undefined' && window.__GONZALO_VOICES__) ? window.__GONZALO_VOICES__ : {};
      const b64 = voices[name];
      if (b64) {
        this.playB64Voice(b64, onEnded);
      } else {
        if (onEnded) onEnded();
      }
    }

    playQuestionVoice(qIdx, onEnded) {
      const qVoices = (typeof window !== 'undefined' && window.__QUESTIONS_VOICES__) ? window.__QUESTIONS_VOICES__ : {};
      const b64 = qVoices[String(qIdx)];
      if (b64) {
        this.playB64Voice(b64, onEnded);
      } else {
        const qData = (typeof window !== 'undefined' && window.__QUESTIONS_DATA__) ? window.__QUESTIONS_DATA__[qIdx] : null;
        const fallbackText = qData ? `${qData.category || ''}. ${qData.question || ''}` : '';
        this.fallbackSpeak(fallbackText, onEnded);
      }
    }

    fallbackSpeak(text, onEnded) {
      if (this.muted || !this.voiceEnabled || !text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        if (onEnded) onEnded();
        return;
      }
      try {
        this.stopVoice();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-CO';
        utterance.rate = 1.0;
        utterance.pitch = 0.95;
        utterance.volume = this.volume;

        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const coVoice = voices.find(v => v.lang === 'es-CO' || v.lang === 'es_CO');
          const esVoice = voices.find(v => v.lang.startsWith('es'));
          if (coVoice) utterance.voice = coVoice;
          else if (esVoice) utterance.voice = esVoice;
        }

        utterance.onend = () => {
          this.currentUtterance = null;
          if (onEnded) onEnded();
        };
        utterance.onerror = (e) => {
          this.currentUtterance = null;
          if (onEnded) onEnded();
        };
        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      } catch(e) {
        if (onEnded) onEnded();
      }
    }

    // Proxy Web Audio Effects
    playDiceRoll() { this.synth.playDiceRoll(); }
    playStep() { this.synth.playStep(); }
    playCorrect() { this.synth.playCorrect(); }
    playWrong() { this.synth.playWrong(); }
    playStarBonus() { this.synth.playBonus(); }
    playVictory() { this.synth.playVictory(); }
    playIntroChirp() { this.synth.playIntroChirp(); }
  }

  // ============================================================================
  // 3. COORDENADAS Y CONFIGURACIÓN DEL TABLERO (BOARD PATH COORDINATES)
  // ============================================================================

  /**
   * Las 24 casillas que forman el sendero campesino sinuoso entre las colinas de Colombia.
   * Origen: Cafetal a la izquierda (X: 6%, Y: 75%)
   * Destino: La Casona / Finca Don Jacinto a la derecha (X: 92%, Y: 30%)
   * 
   * Tipos de casillas:
   * - 'multiple_choice': 🟦 Opción Múltiple (4 opciones)
   * - 'abc': 🟩 Opción ABC (3 opciones)
   * - 'true_false': 🟨 Verdadero o Falso (2 opciones)
   * - 'bonus': ⭐ Casilla Especial de Bonificación de Memoria Histórica (Puntos clave: 7, 15, 22)
   * - 'finish': 🏡 Llegada a la Finca Don Jacinto (Meta Triunfal)
   */
  const RAW_BOARD_TILES = [
    {
      id: 1,
      step: 1,
      x: 6.0,
      y: 75.0,
      type: 'multiple_choice',
      icon: '🟦',
      name: 'Salida del Cafetal',
      category: '🟦 Opción Múltiple',
      desc: 'Don Jacinto inicia su jornada con su canasto y sombrero.'
    },
    {
      id: 2,
      step: 2,
      x: 12.0,
      y: 80.0,
      type: 'abc',
      icon: '🟩',
      name: 'Surco de los Guayacanes',
      category: '🟩 Pregunta ABC',
      desc: 'Flores amarillas tapizan el inicio del camino rural.'
    },
    {
      id: 3,
      step: 3,
      x: 20.0,
      y: 83.0,
      type: 'true_false',
      icon: '🟨',
      name: 'El Manantial de la Loma',
      category: '🟨 Verdadero o Falso',
      desc: 'Agua cristalina que nutre las raíces de la comunidad.'
    },
    {
      id: 4,
      step: 4,
      x: 28.0,
      y: 78.0,
      type: 'multiple_choice',
      icon: '🟦',
      name: 'Quebrada La Esperanza',
      category: '🟦 Opción Múltiple',
      desc: 'Paso por el vado de piedra donde se cruzan los arrieros.'
    },
    {
      id: 5,
      step: 5,
      x: 33.0,
      y: 68.0,
      type: 'abc',
      icon: '🟩',
      name: 'Subida del Trapiche',
      category: '🟩 Pregunta ABC',
      desc: 'Aroma a caña de azúcar y panela recién batida.'
    },
    {
      id: 6,
      step: 6,
      x: 27.0,
      y: 57.0,
      type: 'true_false',
      icon: '🟨',
      name: 'Curva del Samán Centenario',
      category: '🟨 Verdadero o Falso',
      desc: 'Sombra frondosa para tomar aliento en la pendiente.'
    },
    {
      id: 7,
      step: 7,
      x: 19.0,
      y: 50.0,
      type: 'bonus',
      icon: '⭐',
      name: 'Alto del Pacto Histórico',
      category: '⭐ Bonificación de Memoria Histórica',
      isStar: true,
      desc: '¡Casilla de Memoria Histórica! Reflexión sobre el inicio de la convivencia.'
    },
    {
      id: 8,
      step: 8,
      x: 25.0,
      y: 42.0,
      type: 'multiple_choice',
      icon: '🟦',
      name: 'Sendero del Yarumo Blanco',
      category: '🟦 Opción Múltiple',
      desc: 'Árboles insignes que vigilan la cuenca desde lo alto.'
    },
    {
      id: 9,
      step: 9,
      x: 36.0,
      y: 39.0,
      type: 'abc',
      icon: '🟩',
      name: 'Mirador del Valle Central',
      category: '🟩 Pregunta ABC',
      desc: 'Vista panorámica de las parcelas campesinas integradas.'
    },
    {
      id: 10,
      step: 10,
      x: 47.0,
      y: 44.0,
      type: 'true_false',
      icon: '🟨',
      name: 'Cruce de las Heliconias',
      category: '🟨 Verdadero o Falso',
      desc: 'Senderos vivos donde anidan colibríes y pavas de monte.'
    },
    {
      id: 11,
      step: 11,
      x: 56.0,
      y: 51.0,
      type: 'multiple_choice',
      icon: '🟦',
      name: 'Filo de la Montaña',
      category: '🟦 Opción Múltiple',
      desc: 'Cresta de viento fresco que divide las dos vertientes.'
    },
    {
      id: 12,
      step: 12,
      x: 62.0,
      y: 61.0,
      type: 'abc',
      icon: '🟩',
      name: 'Paso de la Niebla',
      category: '🟩 Pregunta ABC',
      desc: 'Bruma matinal que abraza los sembrados de ladera.'
    },
    {
      id: 13,
      step: 13,
      x: 68.0,
      y: 66.0,
      type: 'true_false',
      icon: '🟨',
      name: 'Puente de Guadua y Bejuco',
      category: '🟨 Verdadero o Falso',
      desc: 'Arquitectura tradicional que une veredas hermanadas.'
    },
    {
      id: 14,
      step: 14,
      x: 74.0,
      y: 59.0,
      type: 'multiple_choice',
      icon: '🟦',
      name: 'Camino Real de los Arrieros',
      category: '🟦 Opción Múltiple',
      desc: 'Antigua calzada empedrada de historias y acuerdos.'
    },
    {
      id: 15,
      step: 15,
      x: 78.0,
      y: 49.0,
      type: 'bonus',
      icon: '⭐',
      name: 'Santuario de la Memoria y la Verdad',
      category: '⭐ Bonificación de Memoria Histórica',
      isStar: true,
      desc: '¡Casilla Especial! Espacio sagrado de testimonio y dignidad de las víctimas.'
    },
    {
      id: 16,
      step: 16,
      x: 73.0,
      y: 38.0,
      type: 'abc',
      icon: '🟩',
      name: 'Huerto de Cacao y Cítricos',
      category: '🟩 Pregunta ABC',
      desc: 'Diversificación agraria símbolo de autonomía comunitaria.'
    },
    {
      id: 17,
      step: 17,
      x: 65.0,
      y: 30.0,
      type: 'true_false',
      icon: '🟨',
      name: 'Collado de los Vientos',
      category: '🟨 Verdadero o Falso',
      desc: 'Punto alto donde ondean las banderas de la reconciliación.'
    },
    {
      id: 18,
      step: 18,
      x: 58.0,
      y: 24.0,
      type: 'multiple_choice',
      icon: '🟦',
      name: 'Roca de la Convivencia',
      category: '🟦 Opción Múltiple',
      desc: 'Piedra grabada con relatos ancestrales de no repetición.'
    },
    {
      id: 19,
      step: 19,
      x: 66.0,
      y: 17.0,
      type: 'abc',
      icon: '🟩',
      name: 'Balcón del Paisaje Cultural',
      category: '🟩 Pregunta ABC',
      desc: 'Patrimonio de la humanidad forjado por manos laboriosas.'
    },
    {
      id: 20,
      step: 20,
      x: 76.0,
      y: 17.0,
      type: 'true_false',
      icon: '🟨',
      name: 'Alameda de los Cafetos Maduros',
      category: '🟨 Verdadero o Falso',
      desc: 'Granos rojos listos para la cosecha de la prosperidad.'
    },
    {
      id: 21,
      step: 21,
      x: 84.0,
      y: 21.0,
      type: 'multiple_choice',
      icon: '🟦',
      name: 'Portón de las Bromelias',
      category: '🟦 Opción Múltiple',
      desc: 'Entrada principal a los terrenos de la casona campesina.'
    },
    {
      id: 22,
      step: 22,
      x: 89.0,
      y: 26.0,
      type: 'bonus',
      icon: '⭐',
      name: 'Terraza de la Reconciliación',
      category: '⭐ Bonificación de Memoria Histórica',
      isStar: true,
      desc: '¡Casilla Estrella! Abrazo fraternal entre generaciones.'
    },
    {
      id: 23,
      step: 23,
      x: 88.0,
      y: 32.0,
      type: 'abc',
      icon: '🟩',
      name: 'Jardín de las Hortensias',
      category: '🟩 Pregunta ABC',
      desc: 'Último tramo adoquinado antes de cruzar el umbral del hogar.'
    },
    {
      id: 24,
      step: 24,
      x: 92.0,
      y: 30.0,
      type: 'finish',
      icon: '🏡',
      name: 'Finca Don Jacinto (Meta Triunfal)',
      category: '🏆 Meta y Legado',
      isFinish: true,
      desc: '¡Llegada victoriosa a la Finca! Don Jacinto abraza la verdad y la paz.'
    }
  ];

  class BoardPathCoordinates {
    constructor() {
      this.tiles = RAW_BOARD_TILES.map(t => Object.assign({}, t));
    }

    /**
     * Retorna la lista inmutable de las 24 casillas.
     */
    getTiles() {
      return this.tiles;
    }

    /**
     * Retorna la casilla correspondiente a un número de paso (1..24).
     */
    getTile(stepNumber) {
      if (stepNumber < 1) return this.tiles[0];
      if (stepNumber > 24) return this.tiles[23];
      return this.tiles[stepNumber - 1];
    }

    /**
     * Obtiene las coordenadas X, Y porcentuales de una casilla dada.
     */
    getPoint(stepNumber) {
      const tile = this.getTile(stepNumber);
      return { x: tile.x, y: tile.y };
    }

    /**
     * Genera una cadena SVG Smooth Path ('d' attribute) lista para renderizar el sendero.
     * Utiliza curvas Bezier cúbicas suavizadas entre todos los puntos.
     */
    getSvgPathString(width = 100, height = 100) {
      const pts = this.tiles.map(t => ({
        x: (t.x / 100) * width,
        y: (t.y / 100) * height
      }));

      if (pts.length === 0) return '';
      let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;

      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = i > 0 ? pts[i - 1] : pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = i != pts.length - 2 ? pts[i + 2] : p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
      }

      return d;
    }

    /**
     * Interpola suavemente la posición (X%, Y%) para animaciones fluidas del personaje.
     * @param {number} currentStep - Paso de inicio (1..24)
     * @param {number} targetStep - Paso destino (1..24)
     * @param {number} progress - Progreso normalizado de 0.0 a 1.0
     */
    interpolatePosition(currentStep, targetStep, progress) {
      const clampedP = Math.max(0, Math.min(1, progress));
      const pA = this.getPoint(currentStep);
      const pB = this.getPoint(targetStep);
      return {
        x: pA.x + (pB.x - pA.x) * clampedP,
        y: pA.y + (pB.y - pA.y) * clampedP
      };
    }
  }

  // ============================================================================
  // 4. MÁQUINA DE ESTADOS Y CONTROLADOR CENTRAL (JEP GAME ENGINE)
  // ============================================================================

  class JEPGameEngine {
    constructor(config = {}) {
      this.totalSteps = config.totalSteps || 24;
      this.totalTurns = config.totalTurns || 8;
      this.initialLives = config.initialLives || 3;

      this.audio = config.audio || new WebAudioSynthesizer();
      this.board = new BoardPathCoordinates();

      this.questionsBank = [];
      this.usedQuestions = new Set();

      this.listeners = {
        diceRoll: [],
        step: [],
        question: [],
        answer: [],
        correct: [],
        wrong: [],
        bonus: [],
        gameOver: [],
        victory: []
      };

      this.reset();
    }

    /**
     * Registra un observador para eventos de juego.
     */
    on(event, callback) {
      if (this.listeners[event]) {
        this.listeners[event].push(callback);
      }
      return this;
    }

    /**
     * Emite un evento a los observadores registrados.
     */
    _emit(event, payload) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(cb => {
          try {
            cb(payload);
          } catch (e) {
            console.error(`[JEPGameEngine] Error en listener de ${event}:`, e);
          }
        });
      }
    }

    /**
     * Carga el banco de preguntas desde un array u objeto JSON.
     */
    loadQuestions(questionsArray) {
      if (!Array.isArray(questionsArray)) {
        throw new TypeError('El banco de preguntas debe ser un Array.');
      }
      this.questionsBank = questionsArray.slice();
      this.usedQuestions.clear();
      return this.questionsBank.length;
    }

    /**
     * Reinicia por completo la partida.
     */
    reset() {
      this.dicePlan = generateTurnDicePlan(this.totalSteps, this.totalTurns);
      this.currentTurn = 0; // Índice de turno 0..7 (Turnos 1..8)
      this.currentStep = 0; // Posición de Don Jacinto (0 = Inicio antes de la casilla 1)
      this.lives = this.initialLives;
      this.score = 0;
      this.streak = 0;
      this.isGameOver = false;
      this.isVictory = false;
      this.currentQuestion = null;
      this.history = [];

      this.usedQuestions.clear();
      return this.getGameState();
    }

    /**
     * Inicia una nueva partida opcionalmente con preguntas nuevas.
     */
    startNewGame(questionsData = null) {
      if (questionsData) {
        this.loadQuestions(questionsData);
      }
      return this.reset();
    }

    /**
     * Ejecuta la tirada del dado para el turno actual.
     * Retorna el resultado del dado y el paso destino calculado.
     */
    rollDice() {
      if (this.isGameOver || this.isVictory) {
        throw new Error('La partida ha finalizado. Reinicia el juego para continuar.');
      }
      if (this.currentTurn >= this.totalTurns) {
        throw new Error('Se han agotado todos los turnos.');
      }

      // Obtener el valor precalculado del plan estocástico
      const rollValue = this.dicePlan[this.currentTurn];
      const prevStep = this.currentStep;
      const targetStep = Math.min(this.totalSteps, prevStep + rollValue);

      // Reproducir sonido de dados
      if (this.audio) {
        this.audio.playDiceRoll();
      }

      const turnInfo = {
        turnNumber: this.currentTurn + 1,
        totalTurns: this.totalTurns,
        rollValue,
        prevStep,
        targetStep,
        remainingTurns: this.totalTurns - (this.currentTurn + 1)
      };

      this._emit('diceRoll', turnInfo);
      return turnInfo;
    }

    /**
     * Avanza al jugador al paso objetivo y selecciona la pregunta de la casilla.
     */
    moveToStep(targetStep) {
      this.currentStep = targetStep;
      const tile = this.board.getTile(this.currentStep);

      if (this.audio) {
        this.audio.playStep();
      }

      this._emit('step', { currentStep: this.currentStep, tile });

      // Si es la meta final
      if (this.currentStep >= this.totalSteps) {
        this.isVictory = true;
        if (this.audio) this.audio.playVictory();
        this._emit('victory', { score: this.score, lives: this.lives, turnsUsed: this.currentTurn + 1 });
        return { tile, question: null, isVictory: true };
      }

      // Seleccionar pregunta acorde al tipo de casilla
      const question = this._selectQuestionForTile(tile);
      this.currentQuestion = question;

      if (tile.type === 'bonus' && this.audio) {
        this.audio.playBonus();
        this._emit('bonus', { tile, question });
      }

      this._emit('question', { tile, question });
      return { tile, question, isVictory: false };
    }

    /**
     * Selecciona una pregunta del banco según la categoría de la casilla.
     */
    _selectQuestionForTile(tile) {
      if (!this.questionsBank || this.questionsBank.length === 0) {
        // Fallback dinámico si no se ha cargado el JSON todavía
        return this._createDefaultQuestion(tile);
      }

      // Filtrar por tipo de casilla
      let eligible = this.questionsBank.filter(q => {
        if (this.usedQuestions.has(q.id)) return false;
        if (tile.type === 'bonus') return q.type === 'bonus';
        if (tile.type === 'multiple_choice') return q.type === 'multiple_choice';
        if (tile.type === 'abc') return q.type === 'abc';
        if (tile.type === 'true_false') return q.type === 'true_false';
        return true;
      });

      // Si se agotaron las preguntas no usadas de este tipo, relajar restricción de uso
      if (eligible.length === 0) {
        eligible = this.questionsBank.filter(q => {
          if (tile.type === 'bonus') return q.type === 'bonus';
          if (tile.type === 'multiple_choice') return q.type === 'multiple_choice';
          if (tile.type === 'abc') return q.type === 'abc';
          if (tile.type === 'true_false') return q.type === 'true_false';
          return true;
        });
      }

      // Si aún no hay coincidentes, tomar cualquiera disponible
      if (eligible.length === 0) {
        eligible = this.questionsBank;
      }

      const selected = eligible[Math.floor(Math.random() * eligible.length)];
      if (selected && selected.id) {
        this.usedQuestions.add(selected.id);
      }

      return selected;
    }

    /**
     * Pregunta de emergencia predeterminada
     */
    _createDefaultQuestion(tile) {
      if (tile.type === 'bonus') {
        return {
          id: `BONUS_GEN_${tile.step}`,
          type: 'bonus',
          category: '⭐ Bonificación de Memoria Histórica',
          question: `¡Reflexión de Paz en ${tile.name}!`,
          options: ['¡Comprender el pasado para construir el porvenir! (+100 pts)'],
          correct: 0,
          explanation: 'La memoria colectiva permite sanar el tejido social campesino.',
          citation: '📖 Comisión de la Verdad'
        };
      }
      return {
        id: `GEN_${tile.step}`,
        type: tile.type,
        category: tile.category,
        question: `Pregunta de conocimiento en ${tile.name}`,
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'].slice(0, tile.type === 'true_false' ? 2 : (tile.type === 'abc' ? 3 : 4)),
        correct: 0,
        explanation: 'Reflexión pedagógica de prueba.',
        citation: '📖 No matarás'
      };
    }

    /**
     * Evalúa la respuesta seleccionada por el jugador.
     * @param {number} selectedOptionIndex - Índice de la respuesta (0, 1, 2, 3...)
     */
    submitAnswer(selectedOptionIndex) {
      if (!this.currentQuestion) {
        throw new Error('No hay una pregunta activa para responder.');
      }

      const q = this.currentQuestion;
      const isCorrect = (selectedOptionIndex === q.correct) || (q.type === 'bonus');
      const pointsEarned = isCorrect ? (100 + (this.streak * 25)) : 0;

      if (isCorrect) {
        this.score += pointsEarned;
        this.streak += 1;
        if (q.type === 'bonus') {
          this.lives = Math.min(this.initialLives, this.lives + 1);
        }
        if (this.audio) {
          this.audio.playCorrect();
        }
        this._emit('correct', { question: q, pointsEarned, streak: this.streak, score: this.score });
      } else {
        this.streak = 0;
        this.lives -= 1;
        if (this.audio) {
          this.audio.playWrong();
        }
        this._emit('wrong', { question: q, correctIndex: q.correct, livesLeft: this.lives });

        if (this.lives <= 0) {
          this.isGameOver = true;
          this._emit('gameOver', { score: this.score, finalStep: this.currentStep, turnsUsed: this.currentTurn + 1 });
        }
      }

      // Registrar historial de turno
      this.history.push({
        turn: this.currentTurn + 1,
        step: this.currentStep,
        questionId: q.id,
        selectedOption: selectedOptionIndex,
        isCorrect,
        pointsEarned
      });

      // Avanzar al siguiente turno
      this.currentTurn += 1;
      this.currentQuestion = null;

      // Comprobar si completó los 8 turnos sin perder vidas
      if (this.currentStep >= this.totalSteps && !this.isGameOver) {
        this.isVictory = true;
      }

      return {
        isCorrect,
        correctIndex: q.correct,
        explanation: q.explanation,
        citation: q.citation,
        score: this.score,
        lives: this.lives,
        streak: this.streak,
        isGameOver: this.isGameOver,
        isVictory: this.isVictory
      };
    }

    /**
     * Retorna el estado completo del juego.
     */
    getGameState() {
      return {
        currentTurn: this.currentTurn,
        turnNumber: Math.min(this.totalTurns, this.currentTurn + 1),
        totalTurns: this.totalTurns,
        currentStep: this.currentStep,
        totalSteps: this.totalSteps,
        currentTile: this.board.getTile(this.currentStep),
        dicePlan: this.dicePlan.slice(),
        lives: this.lives,
        maxLives: this.initialLives,
        score: this.score,
        streak: this.streak,
        isGameOver: this.isGameOver,
        isVictory: this.isVictory,
        history: this.history.slice()
      };
    }
  }

  // ============================================================================
  // EXPORTACIÓN MULTI-ENTORNO (UMD / COMMONJS / WINDOW)
  // ============================================================================

  const GameEngineModule = {
    generateTurnDicePlan,
    validateDicePlan,
    WebAudioSynthesizer,
    GameAudioController,
    BoardPathCoordinates,
    JEPGameEngine,
    RAW_BOARD_TILES
  };

  // Node.js CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngineModule;
  }

  // Navegador / Global
  if (typeof global !== 'undefined') {
    global.generateTurnDicePlan = generateTurnDicePlan;
    global.validateDicePlan = validateDicePlan;
    global.WebAudioSynthesizer = WebAudioSynthesizer;
    global.GameAudioController = GameAudioController;
    global.BoardPathCoordinates = BoardPathCoordinates;
    global.JEPGameEngine = JEPGameEngine;
    global.RAW_BOARD_TILES = RAW_BOARD_TILES;
    global.JEPGameModule = GameEngineModule;
  }

})(typeof window !== 'undefined' ? window : globalThis);
