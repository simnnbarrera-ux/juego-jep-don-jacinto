# 🎲 Juego JEP: Don Jacinto y la Memoria Histórica (1958–1978)

> **Experiencia Educativa Interactiva de Memoria Histórica y Construcción de Paz en Colombia.**

---

## 📖 Acerca del Proyecto

**Juego JEP: Don Jacinto y la Memoria Histórica (1958–1978)** es un juego de mesa interactivo y pedagógico diseñado para reflexionar sobre los hechos históricos, actores, transformaciones agrarias y dinámicas del conflicto armado en Colombia durante el periodo del Frente Nacional y el surgimiento de las insurgencias armadas.

A través del viaje de **Don Jacinto**, un campesino colombiano sabio y resiliente, los jugadores avanzan por un tablero serpenteante de casillas respondiendo preguntas históricas fundamentadas en los informes de la **Comisión para el Esclarecimiento de la Verdad (CEV)** y la **Jurisdicción Especial para la Paz (JEP)**.

### ✨ Características Principales

- **Tablero Dinámico Interactivo**: 24 casillas temáticas conectadas por caminos serpenteantes con casillas especiales (Finca Campesina, Estrella de Sabiduría, Preguntas Históricas).
- **Voz Neuronal en Español (Edge Neural TTS - Voz Gonzalo)**: Locución narrada de Don Jacinto con audio sintetizado de alta fidelidad.
- **Evolución de la Finca Campesina**: Reconstruye la finca de Don Jacinto a través de 5 niveles arquitectónicos (Parcela Inicial, Bohío, Casa de Bahareque, Casona Campesina, Finca Próspera y Sostenible).
- **Peón Animado de Don Jacinto**: Sprite animado de cuerpo completo con ciclo de caminata y retroalimentación expresiva (feliz, pensativo, triste, sabio).
- **Banco de Preguntas CEV / JEP**: Más de 50 preguntas contextualizadas con explicaciones pedagógicas exhaustivas.
- **Diseño Responsive Moderno**: Desarrollado con React 18, Tailwind CSS, Space Grotesk y Outfit con temática Glassmorphism Sci-Fi / Campesina.

---

## 👥 Equipo Creador - Comunidad de Indagación 3 (1958–1978)

- **Isabella Ortiz**
- **Alison Cuasquer**
- **Valery Lopez**
- **Valentina Benavidez**

*«La paz se construye sobre la verdad, la memoria y la no repetición»*

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 (SPA), ReactDOM 18, Babel Standalone
- **Estilos**: Tailwind CSS 3 CDN, CSS Keyframe Animations & Glassmorphism
- **Audio & TTS**: Microsoft Edge Neural TTS (`es-CO-GonzaloNeural`), Web Audio API
- **Arquitectura de Despliegue**: Vercel Static Hosting & CDN
- **Repositorio**: GitHub (`simnnbarrera-ux/juego-jep-don-jacinto`)

---

## 🚀 Despliegue y Ejecución Local

### Ejecución Local

Para correr el proyecto localmente sin necesidad de compilación:

```bash
# Servir con cualquier servidor HTTP estático
npx serve .
# O con Python
python -m http.server 8080
```

Abre en tu navegador: `http://localhost:8080`

### Reconstruir el `index.html` (Opcional)

Si modificas el banco de preguntas en `questions.json` o los assets modulares:

```bash
python build_index.py
```

---

## 📄 Licencia

Este proyecto tiene fines estrictamente educativos y pedagógicos bajo la licencia MIT.
