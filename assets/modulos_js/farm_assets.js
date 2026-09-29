/**
 * ============================================================================
 * JUEGO JEP: DON JACINTO Y LA MEMORIA HISTÓRICA
 * FARM_ASSETS.JS - Componentes Gráficos Vectoriales SVG de Alta Definición
 * ============================================================================
 * 
 * Contiene los motores de renderizado SVG para:
 * 1. renderFarm(level, isWorried): Finca "La Esperanza" con 9 niveles de progresión (0 a 8).
 * 2. renderJacinto(state): Personaje campesino Don Jacinto con 4 estados ('DIRTY', 'CLEAN', 'WORRIED', 'VICTORY').
 * 3. renderBackground(variant): Paisajes andinos, cordilleras, palmas de cera y cafetales.
 * 4. Utilidades de montaje para DOM / Vanilla JS / React.
 */

(function (global) {
  'use strict';

  // ==========================================================================
  // 1. PALETA DE COLORES Y DEFINICIONES DE ESTILOS COLOMBIANOS
  // ==========================================================================
  const SVG_DEFS = `
    <defs>
      <!-- Gradientes de Cielo -->
      <linearGradient id="skyDayGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2980B9"/>
        <stop offset="35%" stop-color="#6DD5FA"/>
        <stop offset="70%" stop-color="#B8E994"/>
        <stop offset="100%" stop-color="#FCE38A"/>
      </linearGradient>

      <linearGradient id="skySunsetGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4A00E0"/>
        <stop offset="30%" stop-color="#8E2DE2"/>
        <stop offset="65%" stop-color="#F27121"/>
        <stop offset="85%" stop-color="#E94057"/>
        <stop offset="100%" stop-color="#FEE140"/>
      </linearGradient>

      <!-- Gradientes de Montañas Andinas -->
      <linearGradient id="cordilleraFarGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4B6584"/>
        <stop offset="100%" stop-color="#778CA3"/>
      </linearGradient>
      
      <linearGradient id="nevadoSnowGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="60%" stop-color="#E4F1FE"/>
        <stop offset="100%" stop-color="#A5C4D4"/>
      </linearGradient>

      <linearGradient id="cordilleraMidGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1E6B37"/>
        <stop offset="100%" stop-color="#2E8B57"/>
      </linearGradient>

      <linearGradient id="cordilleraNearGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#145A32"/>
        <stop offset="100%" stop-color="#27AE60"/>
      </linearGradient>

      <linearGradient id="terrenoGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2ECC71"/>
        <stop offset="40%" stop-color="#27AE60"/>
        <stop offset="100%" stop-color="#1E8449"/>
      </linearGradient>

      <linearGradient id="caminoTierraGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#C49A6C"/>
        <stop offset="50%" stop-color="#B58757"/>
        <stop offset="100%" stop-color="#93683A"/>
      </linearGradient>

      <!-- Materiales de Construcción Finca -->
      <linearGradient id="adobeWallGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#C89D66"/>
        <stop offset="30%" stop-color="#DBB27E"/>
        <stop offset="70%" stop-color="#D2A46F"/>
        <stop offset="100%" stop-color="#BA8854"/>
      </linearGradient>

      <linearGradient id="whiteStuccoGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ECEFF1"/>
        <stop offset="20%" stop-color="#FFFFFF"/>
        <stop offset="80%" stop-color="#F8FAFC"/>
        <stop offset="100%" stop-color="#E2E8F0"/>
      </linearGradient>

      <linearGradient id="zocaloRojoGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#C0392B"/>
        <stop offset="50%" stop-color="#96281B"/>
        <stop offset="100%" stop-color="#641E16"/>
      </linearGradient>

      <linearGradient id="tejasBarroGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#E65100"/>
        <stop offset="40%" stop-color="#BF360C"/>
        <stop offset="80%" stop-color="#A82B06"/>
        <stop offset="100%" stop-color="#701C02"/>
      </linearGradient>

      <linearGradient id="techoPajaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#D4AC0D"/>
        <stop offset="40%" stop-color="#B7950B"/>
        <stop offset="80%" stop-color="#9A7D0A"/>
        <stop offset="100%" stop-color="#7D6608"/>
      </linearGradient>

      <linearGradient id="woodColonialBlue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1E88E5"/>
        <stop offset="50%" stop-color="#1565C0"/>
        <stop offset="100%" stop-color="#0D47A1"/>
      </linearGradient>

      <linearGradient id="woodColonialYellow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FDD835"/>
        <stop offset="50%" stop-color="#FBC02D"/>
        <stop offset="100%" stop-color="#F57F17"/>
      </linearGradient>

      <linearGradient id="woodRichBrown" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#6D4C41"/>
        <stop offset="50%" stop-color="#8D6E63"/>
        <stop offset="100%" stop-color="#4E342E"/>
      </linearGradient>

      <linearGradient id="goldCoffeeBeanGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFF9C4"/>
        <stop offset="30%" stop-color="#FBC02D"/>
        <stop offset="70%" stop-color="#F57F17"/>
        <stop offset="100%" stop-color="#E65100"/>
      </linearGradient>

      <linearGradient id="redCherryGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FF5252"/>
        <stop offset="40%" stop-color="#D50000"/>
        <stop offset="80%" stop-color="#B71C1C"/>
        <stop offset="100%" stop-color="#5F0909"/>
      </linearGradient>

      <!-- Gradientes de Don Jacinto -->
      <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#F8C291"/>
        <stop offset="60%" stop-color="#E59866"/>
        <stop offset="100%" stop-color="#BA6835"/>
      </linearGradient>

      <linearGradient id="skinShadowGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#E59866"/>
        <stop offset="100%" stop-color="#A04000"/>
      </linearGradient>

      <linearGradient id="ruanaWoolGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FDFEFE"/>
        <stop offset="30%" stop-color="#F4F6F6"/>
        <stop offset="70%" stop-color="#E5E8E8"/>
        <stop offset="100%" stop-color="#CCD1D1"/>
      </linearGradient>

      <linearGradient id="sombreroStrawGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#FEF9E7"/>
        <stop offset="40%" stop-color="#FCF3CF"/>
        <stop offset="80%" stop-color="#F9E79F"/>
        <stop offset="100%" stop-color="#F7DC6F"/>
      </linearGradient>

      <linearGradient id="carrielLeatherGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#795548"/>
        <stop offset="50%" stop-color="#5D4037"/>
        <stop offset="100%" stop-color="#3E2723"/>
      </linearGradient>

      <!-- Filtros para Sombras y Resplandores -->
      <filter id="dropShadow" x="-20%" y="-20%" width="150%" height="150%">
        <feDropShadow dx="3" dy="6" stdDeviation="4" flood-opacity="0.35" flood-color="#0F172A"/>
      </filter>

      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="1" dy="4" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3"/>
        </feComponentTransfer>
        <feMerge> 
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5" result="blur"/>
        <feComponentTransfer in="blur" result="glow">
          <feFuncA type="linear" slope="0.7"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode in="glow"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <!-- Patrón de tejas coloniales -->
      <pattern id="clayTilePattern" width="24" height="16" patternUnits="userSpaceOnUse">
        <path d="M0,0 Q12,8 24,0 L24,16 Q12,24 0,16 Z" fill="#D84315" stroke="#871A00" stroke-width="1"/>
        <path d="M2,1 Q12,7 22,1" fill="none" stroke="#FF7043" stroke-width="0.8"/>
      </pattern>
    </defs>
  `;

  // ==========================================================================
  // 2. ELEMENTOS DE PAISAJE Y FONDO ESCÉNICO (Background)
  // ==========================================================================

  /**
   * Genera una Palma de Cera del Quindío estilizada en las coordenadas indicadas
   */
  function createWaxPalm(x, y, scale = 1, rotation = 0) {
    return `
      <g transform="translate(${x}, ${y}) scale(${scale}) rotate(${rotation})" filter="url(#softShadow)">
        <!-- Tronco esbelto anillado característico -->
        <path d="M-3,0 Q-1,-120 -2,-240 Q-1,-300 0,-340 Q1,-300 2,-240 Q3,-120 3,0 Z" fill="#D5DBDB" stroke="#95A5A6" stroke-width="1"/>
        <!-- Anillos del tronco -->
        ${[-40, -80, -120, -160, -200, -240, -280, -310].map(h => 
          `<ellipse cx="0" cy="${h}" rx="2.5" ry="1" fill="#7F8C8D"/>`
        ).join('')}
        
        <!-- Corona de Hojas de Palma de Cera -->
        <g transform="translate(0, -340)">
          <!-- Racimos de frutos anaranjados -->
          <circle cx="-4" cy="5" r="4" fill="#E67E22"/>
          <circle cx="0" cy="8" r="4.5" fill="#D35400"/>
          <circle cx="4" cy="6" r="4" fill="#E67E22"/>
          
          <!-- Hojas curvadas en todas direcciones -->
          <path d="M0,0 Q-30,-20 -60,-10 Q-35,-5 0,0" fill="#1E8449"/>
          <path d="M0,0 Q-45,-40 -70,-50 Q-40,-30 0,0" fill="#27AE60"/>
          <path d="M0,0 Q-25,-60 -40,-90 Q-20,-55 0,0" fill="#2ECC71"/>
          <path d="M0,0 Q0,-75 0,-105 Q10,-65 0,0" fill="#58D68D"/>
          <path d="M0,0 Q25,-60 40,-90 Q20,-55 0,0" fill="#2ECC71"/>
          <path d="M0,0 Q45,-40 70,-50 Q40,-30 0,0" fill="#27AE60"/>
          <path d="M0,0 Q30,-20 60,-10 Q35,-5 0,0" fill="#1E8449"/>
          <path d="M0,0 Q-15,15 -35,25 Q-15,10 0,0" fill="#145A32"/>
          <path d="M0,0 Q15,15 35,25 Q15,10 0,0" fill="#145A32"/>
        </g>
      </g>
    `;
  }

  /**
   * Genera un arbusto de café maduro con frutos rojos y flores blancas
   */
  function createCoffeeBush(x, y, scale = 1) {
    return `
      <g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#softShadow)">
        <!-- Follaje denso en capas -->
        <ellipse cx="0" cy="-25" rx="35" ry="25" fill="#145A32"/>
        <ellipse cx="-18" cy="-35" rx="28" ry="22" fill="#1E8449"/>
        <ellipse cx="18" cy="-35" rx="28" ry="22" fill="#229954"/>
        <ellipse cx="0" cy="-48" rx="25" ry="20" fill="#27AE60"/>
        <ellipse cx="0" cy="-30" rx="22" ry="18" fill="#2ECC71" opacity="0.8"/>

        <!-- Racimos de granos de café rojo cereza (maduros) -->
        <g>
          <!-- Racimo izquierdo -->
          <circle cx="-20" cy="-25" r="4.5" fill="url(#redCherryGrad)"/>
          <circle cx="-25" cy="-22" r="4" fill="url(#redCherryGrad)"/>
          <circle cx="-16" cy="-20" r="4.2" fill="url(#redCherryGrad)"/>
          <circle cx="-22" cy="-28" r="3.8" fill="url(#redCherryGrad)"/>
          <circle cx="-20" cy="-26" r="1.5" fill="#FFE5E5"/>

          <!-- Racimo central -->
          <circle cx="2" cy="-35" r="5" fill="url(#redCherryGrad)"/>
          <circle cx="-4" cy="-32" r="4.5" fill="url(#redCherryGrad)"/>
          <circle cx="7" cy="-30" r="4.8" fill="url(#redCherryGrad)"/>
          <circle cx="0" cy="-40" r="4" fill="url(#redCherryGrad)"/>
          <circle cx="2" cy="-36" r="1.6" fill="#FFE5E5"/>

          <!-- Racimo derecho -->
          <circle cx="22" cy="-25" r="4.5" fill="url(#redCherryGrad)"/>
          <circle cx="27" cy="-28" r="4.2" fill="url(#redCherryGrad)"/>
          <circle cx="18" cy="-20" r="4.3" fill="url(#redCherryGrad)"/>
          <circle cx="24" cy="-18" r="3.8" fill="url(#redCherryGrad)"/>
          <circle cx="22" cy="-26" r="1.5" fill="#FFE5E5"/>
        </g>

        <!-- Flores blancas de café (aromáticas) -->
        <g fill="#FFFFFF" stroke="#D5D8DC" stroke-width="0.5">
          <circle cx="-10" cy="-45" r="3"/>
          <circle cx="-8" cy="-47" r="2.5"/>
          <circle cx="-12" cy="-46" r="2.5"/>
          
          <circle cx="14" cy="-42" r="3"/>
          <circle cx="16" cy="-44" r="2.5"/>
          <circle cx="12" cy="-43" r="2.5"/>
        </g>
      </g>
    `;
  }

  /**
   * Genera Heliconias (Platanillos) colombianas
   */
  function createHeliconias(x, y, scale = 1) {
    return `
      <g transform="translate(${x}, ${y}) scale(${scale})">
        <!-- Hojas tipo plátano verde brillante -->
        <path d="M0,0 Q-25,-50 -20,-110 Q-5,-60 0,0" fill="#229954"/>
        <path d="M0,0 Q25,-45 15,-100 Q5,-55 0,0" fill="#27AE60"/>
        <!-- Tallo central de la flor -->
        <path d="M0,0 Q-10,-40 -5,-90" fill="none" stroke="#1E8449" stroke-width="4"/>
        <!-- Bracteas colgantes rojo fuego con puntas amarillas/verdes -->
        <path d="M-8,-40 Q-25,-35 -32,-48 Q-18,-48 -6,-44" fill="#C0392B"/>
        <path d="M-32,-48 Q-34,-50 -28,-49" fill="#F1C40F" stroke="#27AE60" stroke-width="0.8"/>

        <path d="M-5,-55 Q12,-50 20,-63 Q6,-63 -4,-59" fill="#E74C3C"/>
        <path d="M20,-63 Q22,-65 16,-64" fill="#F1C40F" stroke="#27AE60" stroke-width="0.8"/>

        <path d="M-6,-70 Q-22,-65 -28,-78 Q-15,-78 -4,-74" fill="#C0392B"/>
        <path d="M-28,-78 Q-30,-80 -24,-79" fill="#F1C40F" stroke="#27AE60" stroke-width="0.8"/>

        <path d="M-4,-85 Q10,-80 16,-92 Q3,-92 -3,-89" fill="#E74C3C"/>
      </g>
    `;
  }

  /**
   * Genera Orquídeas Cattleya Trianae (Flor Nacional de Colombia)
   */
  function createOrchid(x, y, scale = 1) {
    return `
      <g transform="translate(${x}, ${y}) scale(${scale})" filter="url(#softShadow)">
        <!-- Tallo y hojas carnosas -->
        <path d="M0,0 Q-15,-20 -30,-25 Q-15,-10 0,0" fill="#27AE60"/>
        <path d="M0,0 Q15,-18 28,-22 Q12,-8 0,0" fill="#1E8449"/>
        <!-- Pétalos dorsales lilas/magenta -->
        <ellipse cx="0" cy="-35" rx="8" ry="20" fill="#D980FA" transform="rotate(-30 0 -35)"/>
        <ellipse cx="0" cy="-35" rx="8" ry="20" fill="#D980FA" transform="rotate(30 0 -35)"/>
        <ellipse cx="0" cy="-45" rx="7" ry="18" fill="#C56CF0"/>
        <!-- Pétalos laterales ondulados -->
        <path d="M0,-35 Q-25,-50 -32,-35 Q-20,-20 0,-35" fill="#E056FD"/>
        <path d="M0,-35 Q25,-50 32,-35 Q20,-20 0,-35" fill="#E056FD"/>
        <!-- Labelo (labio) tubular fucsia con centro amarillo oro -->
        <ellipse cx="0" cy="-25" rx="14" ry="16" fill="#B53471"/>
        <ellipse cx="0" cy="-24" rx="8" ry="9" fill="#FFC312"/>
        <circle cx="0" cy="-24" r="3" fill="#EE5A24"/>
      </g>
    `;
  }

  /**
   * Genera el Fondo Escénico Completo (Cordillera de los Andes, Nevado, Cafetales y Cielo)
   */
  function renderBackground(variant = 'day') {
    const isSunset = variant === 'sunset';
    const skyGrad = isSunset ? 'url(#skySunsetGrad)' : 'url(#skyDayGrad)';
    const sunColor = isSunset ? '#FEE140' : '#FFF9C4';
    const sunGlow = isSunset ? '#F39C12' : '#F39C12';

    return `
      <!-- 1. CIELO -->
      <rect x="0" y="0" width="1200" height="800" fill="${skyGrad}"/>

      <!-- Sol de la Mañana / Atardecer Andino -->
      <g transform="translate(600, 160)">
        <circle cx="0" cy="0" r="90" fill="${sunGlow}" opacity="0.25" filter="url(#goldGlow)"/>
        <circle cx="0" cy="0" r="60" fill="${sunGlow}" opacity="0.4"/>
        <circle cx="0" cy="0" r="40" fill="${sunColor}" filter="url(#dropShadow)"/>
      </g>

      <!-- Nubes Estilizadas de Algodón -->
      <g fill="#FFFFFF" opacity="0.85" filter="url(#softShadow)">
        <!-- Nube 1 -->
        <g transform="translate(180, 110)">
          <ellipse cx="0" cy="0" rx="55" ry="22"/>
          <ellipse cx="28" cy="-12" rx="35" ry="26"/>
          <ellipse cx="-25" cy="-8" rx="30" ry="20"/>
          <ellipse cx="50" cy="2" rx="25" ry="16"/>
        </g>
        <!-- Nube 2 -->
        <g transform="translate(920, 130)">
          <ellipse cx="0" cy="0" rx="65" ry="25"/>
          <ellipse cx="35" cy="-14" rx="40" ry="28"/>
          <ellipse cx="-30" cy="-10" rx="35" ry="22"/>
          <ellipse cx="-55" cy="2" rx="25" ry="16"/>
        </g>
        <!-- Nube 3 lejana -->
        <g transform="translate(480, 80) scale(0.65)" opacity="0.7">
          <ellipse cx="0" cy="0" rx="50" ry="18"/>
          <ellipse cx="25" cy="-10" rx="30" ry="22"/>
          <ellipse cx="-20" cy="-6" rx="28" ry="18"/>
        </g>
      </g>

      <!-- Cóndor Andino / Aves en el horizonte -->
      <g stroke="#2C3E50" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6">
        <path d="M380,140 Q390,130 400,140 Q410,130 420,140"/>
        <path d="M425,152 Q432,145 440,152 Q448,145 455,152" stroke-width="2"/>
        <path d="M780,105 Q792,95 805,105 Q818,95 830,105"/>
      </g>

      <!-- 2. CORDILLERA LEJANA CON NEVADO DEL RUIZ -->
      <path d="M0,420 L0,260 Q180,240 320,290 Q480,220 620,270 L700,200 L760,250 Q920,210 1080,280 L1200,240 L1200,500 L0,500 Z" fill="url(#cordilleraFarGrad)" opacity="0.9"/>
      
      <!-- Pico Nevado Majestuoso -->
      <g transform="translate(700, 200)">
        <polygon points="0,0 -50,60 60,50" fill="url(#nevadoSnowGrad)"/>
        <path d="M0,0 L-18,35 L-6,28 L8,42 L25,25 L60,50 L-50,60 Z" fill="#FFFFFF"/>
        <!-- Sombra glacial -->
        <polygon points="0,0 8,42 60,50" fill="#90CAF9" opacity="0.5"/>
      </g>

      <!-- 3. CORDILLERA MEDIA (Laderas Verdes Cafeteras) -->
      <path d="M0,480 L0,320 Q220,380 440,310 Q680,410 900,320 Q1060,360 1200,330 L1200,600 L0,600 Z" fill="url(#cordilleraMidGrad)"/>

      <!-- Surcos de Café en la ladera lejana -->
      <g stroke="#145A32" stroke-width="2" opacity="0.4" stroke-dasharray="6,8">
        <path d="M100,370 Q300,410 440,340"/>
        <path d="M80,390 Q280,430 420,360"/>
        <path d="M700,380 Q900,340 1100,370"/>
        <path d="M720,400 Q920,360 1120,390"/>
      </g>

      <!-- Palmas de Cera en las Colinas Lejanas -->
      ${createWaxPalm(90, 410, 0.45, -3)}
      ${createWaxPalm(140, 430, 0.55, 2)}
      ${createWaxPalm(210, 420, 0.4, -1)}
      ${createWaxPalm(1020, 390, 0.5, 3)}
      ${createWaxPalm(1080, 410, 0.6, -2)}
      ${createWaxPalm(1140, 400, 0.45, 1)}

      <!-- 4. CORDILLERA CERCANA / COLINAS ONDULADAS -->
      <path d="M0,540 Q280,460 560,510 Q840,450 1200,530 L1200,800 L0,800 Z" fill="url(#cordilleraNearGrad)"/>

      <!-- 5. TERRENO FRONTAL DE LA FINCA -->
      <path d="M0,590 Q300,560 600,580 Q900,560 1200,600 L1200,800 L0,800 Z" fill="url(#terrenoGrad)"/>

      <!-- Camino empedrado / huella campesina -->
      <path d="M580,620 Q560,690 520,800 L720,800 Q660,700 640,620 Z" fill="url(#caminoTierraGrad)" filter="url(#dropShadow)"/>
      <!-- Piedras del camino -->
      <g fill="#795548" opacity="0.6">
        <ellipse cx="570" cy="650" rx="8" ry="4"/>
        <ellipse cx="610" cy="660" rx="10" ry="5"/>
        <ellipse cx="585" cy="690" rx="12" ry="6"/>
        <ellipse cx="625" cy="710" rx="14" ry="7"/>
        <ellipse cx="560" cy="740" rx="15" ry="7"/>
        <ellipse cx="610" cy="760" rx="18" ry="8"/>
        <ellipse cx="660" cy="780" rx="16" ry="8"/>
      </g>
    `;
  }

  // ==========================================================================
  // 3. RENDERIZADO DE LA FINCA: FINCA "LA ESPERANZA" (NIVELES 0 A 8)
  // ==========================================================================

  /**
   * Dibuja la Finca Campesina en sus 9 niveles de desarrollo arquitectónico y cultural
   * @param {number} level - Nivel de 0 a 8
   * @param {boolean} isWorried - Si Don Jacinto ha fallado preguntas / alerta
   */
  function renderFarm(level = 0, isWorried = false) {
    const lvl = Math.max(0, Math.min(8, parseInt(level, 10) || 0));

    // Base del edificio: Centro (X: 380 a 840, Y: 300 a 620)
    let components = [];

    // ------------------------------------------------------------------------
    // NIVEL 0: CASITA RÚSTICA BÁSICA DE ADOBE Y PAJA
    // ------------------------------------------------------------------------
    components.push(`
      <!-- ================= NIVEL 0: CASA BÁSICA DE ADOBE ================= -->
      <g id="farm-lvl0" filter="url(#dropShadow)">
        <!-- Cimientos de piedra rústica -->
        <rect x="420" y="550" width="380" height="40" rx="4" fill="#795548" stroke="#4E342E" stroke-width="2"/>
        <line x1="420" y1="570" x2="800" y2="570" stroke="#3E2723" stroke-width="1.5" stroke-dasharray="15,10"/>
        
        <!-- Muros de Adobe rústico -->
        <rect x="430" y="380" width="360" height="180" rx="2" fill="url(#adobeWallGrad)" stroke="#8D6E63" stroke-width="2"/>
        
        <!-- Líneas de bloques de adobe / ladrillo de barro -->
        <g stroke="#A1887F" stroke-width="1" opacity="0.6">
          <line x1="430" y1="410" x2="790" y2="410"/>
          <line x1="430" y1="440" x2="790" y2="440"/>
          <line x1="430" y1="470" x2="790" y2="470"/>
          <line x1="430" y1="500" x2="790" y2="500"/>
          <line x1="430" y1="530" x2="790" y2="530"/>
        </g>

        <!-- Puerta rústica de madera básica -->
        <g id="rustic-door" transform="translate(580, 430)">
          <rect x="0" y="0" width="60" height="130" rx="3" fill="#5D4037" stroke="#3E2723" stroke-width="2"/>
          <!-- Tablones de madera -->
          <line x1="20" y1="0" x2="20" y2="130" stroke="#3E2723" stroke-width="1.5"/>
          <line x1="40" y1="0" x2="40" y2="130" stroke="#3E2723" stroke-width="1.5"/>
          <!-- Cerrojo de hierro y manija -->
          <circle cx="12" cy="70" r="4" fill="#212121"/>
          <circle cx="12" cy="70" r="2" fill="#BDBDBD"/>
          <!-- Bisagras de hierro forjado -->
          <rect x="2" y="20" width="12" height="6" fill="#212121"/>
          <rect x="2" y="100" width="12" height="6" fill="#212121"/>
        </g>

        <!-- Ventanuco rústico simple -->
        <g transform="translate(470, 440)">
          <rect x="0" y="0" width="55" height="55" fill="#3E2723" stroke="#271C19" stroke-width="3"/>
          <rect x="4" y="4" width="47" height="47" fill="#8D6E63"/>
          <line x1="27" y1="4" x2="27" y2="51" stroke="#3E2723" stroke-width="2"/>
          <line x1="4" y1="27" x2="51" y2="27" stroke="#3E2723" stroke-width="2"/>
        </g>

        <!-- Techo simple de paja / bahareque (Solo visible en lvl < 5) -->
        ${lvl < 5 ? `
          <polygon points="390,390 610,260 830,390" fill="url(#techoPajaGrad)" stroke="#7D6608" stroke-width="3" filter="url(#dropShadow)"/>
          <!-- Flecos de paja rústica -->
          <path d="M380,390 Q400,405 420,390 Q440,405 460,390 Q480,405 500,390 Q520,405 540,390 Q560,405 580,390 Q600,405 620,390 Q640,405 660,390 Q680,405 700,390 Q720,405 740,390 Q760,405 780,390 Q800,405 820,390 Q840,405 850,390" fill="none" stroke="#D4AC0D" stroke-width="4"/>
          <!-- Viga cumbrera de madera -->
          <line x1="610" y1="260" x2="610" y2="390" stroke="#5D4037" stroke-width="4"/>
        ` : ''}

        <!-- Escoba de paja y machete en funda junto a la puerta -->
        <g transform="translate(650, 490)">
          <line x1="0" y1="0" x2="15" y2="65" stroke="#8D6E63" stroke-width="3.5"/>
          <polygon points="12,50 25,75 5,70" fill="#D4AC0D" stroke="#9A7D0A" stroke-width="1"/>
        </g>
      </g>
    `);

    // ------------------------------------------------------------------------
    // NIVEL 1: JARDÍN FRONTAL CON CAFETALES FLORECIDOS, HELICONIAS Y ORQUÍDEAS
    // ------------------------------------------------------------------------
    if (lvl >= 1) {
      components.push(`
        <!-- ================= NIVEL 1: JARDÍN Y FLORA COLOMBIANA ================= -->
        <g id="farm-lvl1">
          <!-- Cafetales frondosos a los lados de la casa -->
          ${createCoffeeBush(360, 580, 1.2)}
          ${createCoffeeBush(410, 610, 1.0)}
          ${createCoffeeBush(810, 590, 1.15)}
          ${createCoffeeBush(870, 615, 0.95)}

          <!-- Heliconias (Platanillos) en el jardín frontal -->
          ${createHeliconias(460, 630, 0.9)}
          ${createHeliconias(770, 630, 0.85)}

          <!-- Orquídeas Cattleya en soporte rústico de tronco -->
          <g transform="translate(490, 580)">
            <rect x="0" y="0" width="10" height="30" fill="#5D4037" rx="2"/>
            ${createOrchid(5, 5, 0.9)}
          </g>
          <g transform="translate(730, 580)">
            <rect x="0" y="0" width="10" height="30" fill="#5D4037" rx="2"/>
            ${createOrchid(5, 5, 0.85)}
          </g>

          <!-- Macetas de barro adicionales en el suelo -->
          <g transform="translate(540, 560)">
            <polygon points="0,15 15,15 12,0 3,0" fill="#D35400" stroke="#A04000" stroke-width="1"/>
            <circle cx="7" cy="-4" r="7" fill="#E91E63"/>
            <circle cx="7" cy="-4" r="3" fill="#FFF176"/>
          </g>
          <g transform="translate(670, 560)">
            <polygon points="0,15 15,15 12,0 3,0" fill="#D35400" stroke="#A04000" stroke-width="1"/>
            <circle cx="7" cy="-4" r="7" fill="#9C27B0"/>
            <circle cx="7" cy="-4" r="3" fill="#FFF176"/>
          </g>
        </g>
      `);
    }

    // ------------------------------------------------------------------------
    // NIVEL 2: VENTANAS COLONIALES PINTADAS (AZUL Y AMARILLO) CON MATERAS
    // ------------------------------------------------------------------------
    if (lvl >= 2) {
      components.push(`
        <!-- ================= NIVEL 2: VENTANAS COLONIALES VIVAS ================= -->
        <g id="farm-lvl2">
          <!-- Ventana Colonial Izquierda -->
          <g id="colonial-window-left" transform="translate(460, 420)" filter="url(#dropShadow)">
            <!-- Marco exterior azul colonial -->
            <rect x="0" y="0" width="75" height="95" rx="4" fill="url(#woodColonialBlue)" stroke="#0D47A1" stroke-width="2.5"/>
            <!-- Postigos amarillos vivos -->
            <rect x="6" y="6" width="30" height="83" rx="2" fill="url(#woodColonialYellow)" stroke="#E65100" stroke-width="1.5"/>
            <rect x="39" y="6" width="30" height="83" rx="2" fill="url(#woodColonialYellow)" stroke="#E65100" stroke-width="1.5"/>
            
            <!-- Celosías / Calados coloniales -->
            ${[18, 30, 42, 54, 66, 76].map(y => `
              <line x1="10" y1="${y}" x2="32" y2="${y}" stroke="#F57F17" stroke-width="1.5"/>
              <line x1="43" y1="${y}" x2="65" y2="${y}" stroke="#F57F17" stroke-width="1.5"/>
            `).join('')}

            <!-- Cerrojos y aldabas de hierro -->
            <circle cx="33" cy="48" r="2.5" fill="#212121"/>
            <circle cx="42" cy="48" r="2.5" fill="#212121"/>

            <!-- Matera de flores bajo la ventana -->
            <g transform="translate(2, 88)">
              <rect x="0" y="0" width="71" height="18" rx="3" fill="#D35400" stroke="#871A00" stroke-width="1.5"/>
              <!-- Flores rojas y fucsias desbordantes (Geranios / Novios) -->
              <circle cx="10" cy="-3" r="7" fill="#E74C3C"/>
              <circle cx="10" cy="-3" r="2.5" fill="#FFF59D"/>
              <circle cx="25" cy="-5" r="8" fill="#C0392B"/>
              <circle cx="25" cy="-5" r="3" fill="#FFF59D"/>
              <circle cx="42" cy="-4" r="7.5" fill="#E91E63"/>
              <circle cx="42" cy="-4" r="2.5" fill="#FFF59D"/>
              <circle cx="58" cy="-3" r="7" fill="#E74C3C"/>
              <circle cx="58" cy="-3" r="2.5" fill="#FFF59D"/>
              <!-- Hojitas verdes -->
              <ellipse cx="18" cy="2" rx="5" ry="3" fill="#2ECC71"/>
              <ellipse cx="34" cy="1" rx="6" ry="3" fill="#27AE60"/>
              <ellipse cx="50" cy="2" rx="5" ry="3" fill="#2ECC71"/>
            </g>
          </g>

          <!-- Ventana Colonial Derecha -->
          <g id="colonial-window-right" transform="translate(685, 420)" filter="url(#dropShadow)">
            <!-- Marco exterior azul colonial -->
            <rect x="0" y="0" width="75" height="95" rx="4" fill="url(#woodColonialBlue)" stroke="#0D47A1" stroke-width="2.5"/>
            <!-- Postigos amarillos vivos -->
            <rect x="6" y="6" width="30" height="83" rx="2" fill="url(#woodColonialYellow)" stroke="#E65100" stroke-width="1.5"/>
            <rect x="39" y="6" width="30" height="83" rx="2" fill="url(#woodColonialYellow)" stroke="#E65100" stroke-width="1.5"/>
            
            <!-- Celosías / Calados coloniales -->
            ${[18, 30, 42, 54, 66, 76].map(y => `
              <line x1="10" y1="${y}" x2="32" y2="${y}" stroke="#F57F17" stroke-width="1.5"/>
              <line x1="43" y1="${y}" x2="65" y2="${y}" stroke="#F57F17" stroke-width="1.5"/>
            `).join('')}

            <!-- Cerrojos -->
            <circle cx="33" cy="48" r="2.5" fill="#212121"/>
            <circle cx="42" cy="48" r="2.5" fill="#212121"/>

            <!-- Matera de flores bajo la ventana -->
            <g transform="translate(2, 88)">
              <rect x="0" y="0" width="71" height="18" rx="3" fill="#D35400" stroke="#871A00" stroke-width="1.5"/>
              <!-- Flores -->
              <circle cx="12" cy="-4" r="7.5" fill="#9C27B0"/>
              <circle cx="12" cy="-4" r="2.5" fill="#FFF59D"/>
              <circle cx="28" cy="-5" r="8" fill="#E74C3C"/>
              <circle cx="28" cy="-5" r="3" fill="#FFF59D"/>
              <circle cx="45" cy="-4" r="7.5" fill="#FF5722"/>
              <circle cx="45" cy="-4" r="2.5" fill="#FFF59D"/>
              <circle cx="60" cy="-3" r="7" fill="#E91E63"/>
              <circle cx="60" cy="-3" r="2.5" fill="#FFF59D"/>
              <ellipse cx="20" cy="2" rx="6" ry="3" fill="#2ECC71"/>
              <ellipse cx="38" cy="1" rx="5" ry="3" fill="#27AE60"/>
              <ellipse cx="53" cy="2" rx="5" ry="3" fill="#2ECC71"/>
            </g>
          </g>
        </g>
      `);
    }

    // ------------------------------------------------------------------------
    // NIVEL 3: MUROS BLANCOS, ZÓCALO ROJO TRADICIONAL, CORREDOR CON BARANDAS Y HELECHOS
    // ------------------------------------------------------------------------
    if (lvl >= 3) {
      components.push(`
        <!-- ================= NIVEL 3: MUROS ESTUCADOS, ZÓCALO Y CORREDOR ================= -->
        <g id="farm-lvl3">
          <!-- Muros Estucados en Blanco Puro Colonial -->
          <rect x="428" y="380" width="364" height="180" rx="2" fill="url(#whiteStuccoGrad)" stroke="#B0BEC5" stroke-width="1.5"/>

          <!-- Zócalo Tradicional Paisa (Rojo bermellón con filete amarillo) -->
          <g id="zocalo-rojo" filter="url(#softShadow)">
            <rect x="428" y="500" width="364" height="60" fill="url(#zocaloRojoGrad)"/>
            <!-- Filete decorativo dorado/amarillo -->
            <line x1="428" y1="502" x2="792" y2="502" stroke="#FDD835" stroke-width="3"/>
            <line x1="428" y1="507" x2="792" y2="507" stroke="#1565C0" stroke-width="1.5"/>
          </g>

          <!-- Puerta Colonial Mejorada con chambrana de dos batientes -->
          <g transform="translate(575, 415)" filter="url(#dropShadow)">
            <rect x="0" y="0" width="70" height="145" rx="3" fill="url(#woodColonialBlue)" stroke="#0D47A1" stroke-width="3"/>
            <rect x="5" y="5" width="28" height="135" fill="url(#woodColonialYellow)" rx="2"/>
            <rect x="37" y="5" width="28" height="135" fill="url(#woodColonialYellow)" rx="2"/>
            <!-- Tableros tallados -->
            <rect x="9" y="15" width="20" height="40" fill="#F57F17" rx="1"/>
            <rect x="41" y="15" width="20" height="40" fill="#F57F17" rx="1"/>
            <rect x="9" y="70" width="20" height="60" fill="#F57F17" rx="1"/>
            <rect x="41" y="70" width="20" height="60" fill="#F57F17" rx="1"/>
            <!-- Aldabas coloniales doradas -->
            <circle cx="28" cy="65" r="3.5" fill="#FFD700"/>
            <circle cx="42" cy="65" r="3.5" fill="#FFD700"/>
          </g>

          <!-- Corredor / Porche Frontal con Chambrana y Barandas de Madera -->
          <g id="porche-corredor" filter="url(#dropShadow)">
            <!-- Piso de madera / baldosín del corredor -->
            <rect x="390" y="555" width="440" height="25" rx="3" fill="#8D4925" stroke="#5D2E16" stroke-width="2"/>
            
            <!-- Columnas / Pilares de Madera Torneada -->
            ${[405, 525, 685, 805].map(x => `
              <g transform="translate(${x}, 380)">
                <!-- Capitel -->
                <rect x="-8" y="0" width="16" height="10" fill="#FBC02D" stroke="#E65100" stroke-width="1"/>
                <!-- Fuste de la columna -->
                <rect x="-5" y="10" width="10" height="165" fill="url(#woodRichBrown)" stroke="#3E2723" stroke-width="1.5"/>
                <!-- Base -->
                <rect x="-8" y="165" width="16" height="10" fill="#C0392B" stroke="#781E15" stroke-width="1"/>
              </g>
            `).join('')}

            <!-- Barandas de madera (Chambrana tradicional) -->
            <g id="chambrana-railing">
              <!-- Pasamanos superior -->
              <rect x="395" y="495" width="430" height="8" rx="2" fill="#1565C0" stroke="#0D47A1" stroke-width="1"/>
              <!-- Travesaño inferior -->
              <rect x="395" y="545" width="430" height="6" rx="1" fill="#1565C0" stroke="#0D47A1" stroke-width="1"/>
              
              <!-- Balaustres torneados bicolores (azul y amarillo) -->
              ${Array.from({ length: 28 }).map((_, i) => {
                const bx = 415 + i * 14.5;
                if ((bx >= 555 && bx <= 665)) return ''; // Espacio libre para la entrada
                return `
                  <rect x="${bx}" y="503" width="5" height="42" rx="1.5" fill="${i % 2 === 0 ? '#FBC02D' : '#E53935'}" stroke="#3E2723" stroke-width="0.8"/>
                `;
              }).join('')}
            </g>

            <!-- Canastas colgantes con Helechos (Helechos espadas frondosos) -->
            ${[465, 605, 745].map(hx => `
              <g transform="translate(${hx}, 380)" filter="url(#dropShadow)">
                <!-- Cuerda / Cadena -->
                <line x1="0" y1="0" x2="0" y2="25" stroke="#795548" stroke-width="1.5"/>
                <!-- Canasta de bejuco -->
                <ellipse cx="0" cy="27" rx="14" ry="7" fill="#A1887F" stroke="#5D4037" stroke-width="1"/>
                <!-- Frondas colgantes de helecho verde esmeralda -->
                <path d="M0,27 Q-18,35 -24,55 Q-12,45 0,27" fill="#2ECC71"/>
                <path d="M0,27 Q-8,40 -12,65 Q-4,48 0,27" fill="#27AE60"/>
                <path d="M0,27 Q8,40 12,65 Q4,48 0,27" fill="#27AE60"/>
                <path d="M0,27 Q18,35 24,55 Q12,45 0,27" fill="#2ECC71"/>
                <path d="M0,27 Q0,45 0,72 Q-2,50 0,27" fill="#1E8449"/>
              </g>
            `).join('')}
          </g>
        </g>
      `);
    }

    // ------------------------------------------------------------------------
    // NIVEL 4: SEGUNDO PISO COLONIAL CON BALCÓN TRADICIONAL ANTIOQUEÑO
    // ------------------------------------------------------------------------
    if (lvl >= 4) {
      components.push(`
        <!-- ================= NIVEL 4: SEGUNDO PISO Y BALCÓN PAISA ================= -->
        <g id="farm-lvl4" filter="url(#dropShadow)">
          <!-- Estructura del Segundo Piso -->
          <rect x="428" y="220" width="364" height="165" fill="url(#whiteStuccoGrad)" stroke="#B0BEC5" stroke-width="1.5"/>

          <!-- Zócalo superior decorativo -->
          <rect x="428" y="365" width="364" height="15" fill="url(#zocaloRojoGrad)"/>
          <line x1="428" y1="365" x2="792" y2="365" stroke="#FDD835" stroke-width="2"/>

          <!-- 3 Puertas-Ventanas del Segundo Piso con Portales y Abanicos de Sol -->
          ${[470, 575, 680].map((px, idx) => `
            <g transform="translate(${px}, 235)">
              <!-- Marco exterior -->
              <rect x="0" y="18" width="70" height="120" rx="3" fill="url(#woodColonialBlue)" stroke="#0D47A1" stroke-width="2"/>
              <!-- Abanico de sol (Calado colonial en semicírculo) -->
              <path d="M0,18 A35,35 0 0,1 70,18 Z" fill="url(#woodColonialYellow)" stroke="#E65100" stroke-width="1.5"/>
              <line x1="35" y1="18" x2="10" y2="2" stroke="#E65100" stroke-width="1.5"/>
              <line x1="35" y1="18" x2="35" y2="-17" stroke="#E65100" stroke-width="1.5"/>
              <line x1="35" y1="18" x2="60" y2="2" stroke="#E65100" stroke-width="1.5"/>
              <!-- Batientes dobles -->
              <rect x="5" y="24" width="28" height="108" fill="url(#woodColonialYellow)" stroke="#F57F17" stroke-width="1"/>
              <rect x="37" y="24" width="28" height="108" fill="url(#woodColonialYellow)" stroke="#F57F17" stroke-width="1"/>
              <!-- Celosías -->
              ${[38, 52, 66, 80, 94, 108].map(cy => `
                <line x1="9" y1="${cy}" x2="29" y2="${cy}" stroke="#E65100" stroke-width="1.2"/>
                <line x1="41" y1="${cy}" x2="61" y2="${cy}" stroke="#E65100" stroke-width="1.2"/>
              `).join('')}
            </g>
          `).join('')}

          <!-- Balcón Volado Tradicional Antioqueño (Balcón Corrido Paisa) -->
          <g id="balcon-paisa" transform="translate(415, 330)" filter="url(#dropShadow)">
            <!-- Ménsulas / Canecillos de soporte de madera tallada bajo el balcón -->
            ${[15, 75, 135, 195, 255, 315, 375].map(mx => `
              <polygon points="${mx},45 ${mx + 12},45 ${mx + 6},65" fill="#4E342E" stroke="#271C19" stroke-width="1"/>
            `).join('')}

            <!-- Piso del balcón -->
            <rect x="0" y="40" width="390" height="12" rx="2" fill="#6D4C41" stroke="#3E2723" stroke-width="2"/>

            <!-- Pasamanos superior del balcón -->
            <rect x="0" y="0" width="390" height="8" rx="2" fill="url(#woodColonialBlue)" stroke="#0D47A1" stroke-width="1.5"/>
            <!-- Travesaño inferior -->
            <rect x="0" y="34" width="390" height="6" rx="1" fill="url(#woodColonialBlue)" stroke="#0D47A1" stroke-width="1.5"/>

            <!-- Balaustres tallados policromados (Amarillo, Azul y Rojo) -->
            ${Array.from({ length: 32 }).map((_, bi) => {
              const colors = ['#FDD835', '#1E88E5', '#E53935'];
              const c = colors[bi % 3];
              return `
                <g transform="translate(${12 + bi * 11.8}, 8)">
                  <rect x="0" y="0" width="5" height="26" rx="1.5" fill="${c}" stroke="#3E2723" stroke-width="0.8"/>
                  <circle cx="2.5" cy="13" r="2.5" fill="${c}" stroke="#3E2723" stroke-width="0.8"/>
                </g>
              `;
            }).join('')}

            <!-- Materas florales rebosantes a lo largo del balcón -->
            ${[40, 120, 200, 280, 350].map(fx => `
              <g transform="translate(${fx}, 28)">
                <ellipse cx="0" cy="0" rx="12" ry="5" fill="#D35400"/>
                <circle cx="-5" cy="-3" r="5.5" fill="#FF1744"/>
                <circle cx="5" cy="-4" r="6" fill="#F50057"/>
                <circle cx="0" cy="-6" r="5" fill="#FFEA00"/>
                <ellipse cx="0" cy="2" rx="8" ry="3" fill="#2ECC71"/>
              </g>
            `).join('')}
          </g>
        </g>
      `);
    }

    // ------------------------------------------------------------------------
    // NIVEL 5: TEJADO EXPANDIDO DE TEJAS DE BARRO, CHIMENEA Y POZO ARTESANAL
    // ------------------------------------------------------------------------
    if (lvl >= 5) {
      components.push(`
        <!-- ================= NIVEL 5: TEJAS DE BARRO, CHIMENEA Y POZO ================= -->
        <g id="farm-lvl5">
          <!-- Tejado Monumental de Tejas de Barro Rojas Españolas -->
          <g id="tejas-coloniales" filter="url(#dropShadow)">
            <!-- Faldón principal de la cubierta -->
            <polygon points="360,230 610,95 860,230" fill="url(#tejasBarroGrad)" stroke="#871A00" stroke-width="3"/>
            <!-- Textura de tejas en hiladas curvas (canal y cobija) -->
            ${Array.from({ length: 9 }).map((_, row) => {
              const yPos = 110 + row * 13.5;
              const xStart = 580 - row * 26;
              const xEnd = 640 + row * 26;
              return `
                <path d="M${xStart},${yPos} Q610,${yPos + 8} ${xEnd},${yPos}" fill="none" stroke="#FF7043" stroke-width="2.5" opacity="0.8"/>
                <path d="M${xStart},${yPos + 2} Q610,${yPos + 10} ${xEnd},${yPos + 2}" fill="none" stroke="#5D1002" stroke-width="1.8"/>
              `;
            }).join('')}

            <!-- Caballete / Cumbrera decorada -->
            <polygon points="600,90 620,90 610,105" fill="#FFAB91" stroke="#BF360C" stroke-width="2"/>
            
            <!-- Aleros calados tallados en madera bajo las tejas -->
            <path d="M350,232 ${Array.from({ length: 34 }).map((_, i) => `Q${360 + i * 15},244 ${368 + i * 15},232`).join(' ')}" fill="none" stroke="#FDD835" stroke-width="3.5"/>
          </g>

          <!-- Chimenea de Mampostería de Piedra de Río -->
          <g id="chimenea-piedra" transform="translate(440, 95)" filter="url(#dropShadow)">
            <rect x="0" y="0" width="45" height="110" fill="#78909C" stroke="#37474F" stroke-width="2" rx="2"/>
            <!-- Textura de piedras de río -->
            <g fill="#90A4AE" stroke="#37474F" stroke-width="1">
              <rect x="4" y="10" width="18" height="12" rx="4"/>
              <rect x="24" y="8" width="16" height="14" rx="5"/>
              <rect x="8" y="28" width="28" height="14" rx="4"/>
              <rect x="4" y="48" width="16" height="12" rx="4"/>
              <rect x="22" y="46" width="18" height="14" rx="5"/>
              <rect x="6" y="66" width="32" height="14" rx="5"/>
              <rect x="4" y="86" width="18" height="12" rx="4"/>
              <rect x="24" y="84" width="16" height="14" rx="4"/>
            </g>
            <!-- Remate / Sombrerete de la chimenea -->
            <rect x="-4" y="-8" width="53" height="10" fill="#C0392B" stroke="#781E15" stroke-width="1.5" rx="2"/>

            <!-- Humo rústico acogedor de leña de café -->
            <g id="chimney-smoke" opacity="0.65">
              <circle cx="22" cy="-20" r="8" fill="#ECEFF1"/>
              <circle cx="15" cy="-38" r="12" fill="#CFD8DC"/>
              <circle cx="28" cy="-58" r="16" fill="#B0BEC5"/>
              <circle cx="18" cy="-82" r="22" fill="#ECEFF1" opacity="0.4"/>
            </g>
          </g>

          <!-- Pozo de Agua Artesanal de Piedra -->
          <g id="pozo-artesanal" transform="translate(860, 530)" filter="url(#dropShadow)">
            <!-- Brocal / Muro circular de piedra -->
            <ellipse cx="40" cy="55" rx="35" ry="16" fill="#546E7A" stroke="#263238" stroke-width="2"/>
            <rect x="5" y="55" width="70" height="35" fill="#78909C" stroke="#263238" stroke-width="2"/>
            <ellipse cx="40" cy="90" rx="35" ry="16" fill="#455A64" stroke="#263238" stroke-width="2"/>
            
            <!-- Interior con agua cristalina -->
            <ellipse cx="40" cy="55" rx="28" ry="11" fill="#0288D1"/>
            <ellipse cx="40" cy="55" rx="20" ry="7" fill="#4FC3F7" opacity="0.7"/>

            <!-- Pilares de madera y techo a dos aguas del pozo -->
            <line x1="12" y1="55" x2="12" y2="0" stroke="#5D4037" stroke-width="4.5"/>
            <line x1="68" y1="55" x2="68" y2="0" stroke="#5D4037" stroke-width="4.5"/>
            
            <!-- Tejadito de tejas miniatura -->
            <polygon points="0,5 40,-20 80,5" fill="url(#tejasBarroGrad)" stroke="#871A00" stroke-width="2"/>
            
            <!-- Torno / Manivela y Cubeta de madera -->
            <line x1="12" y1="18" x2="68" y2="18" stroke="#8D6E63" stroke-width="4"/>
            <line x1="68" y1="18" x2="78" y2="18" stroke="#212121" stroke-width="3"/>
            <line x1="78" y1="18" x2="78" y2="28" stroke="#212121" stroke-width="3"/>
            
            <!-- Cuerda y Balde -->
            <line x1="40" y1="18" x2="40" y2="42" stroke="#D7CCC8" stroke-width="2"/>
            <polygon points="34,42 46,42 44,54 36,54" fill="#6D4C41" stroke="#3E2723" stroke-width="1.5"/>
          </g>
        </g>
      `);
    }

    // ------------------------------------------------------------------------
    // NIVEL 6: ESTABLO RURAL, VACA LECHERA, GALLINAS Y CANTINAS DE LECHE
    // ------------------------------------------------------------------------
    if (lvl >= 6) {
      components.push(`
        <!-- ================= NIVEL 6: ESTABLO, VACA, GALLINAS Y CANTINAS ================= -->
        <g id="farm-lvl6">
          <!-- Establo de Madera al costado izquierdo -->
          <g id="establo-campesino" transform="translate(190, 440)" filter="url(#dropShadow)">
            <!-- Muros de tablones de madera rústica -->
            <rect x="0" y="40" width="170" height="140" fill="#6D4C41" stroke="#3E2723" stroke-width="2.5"/>
            ${[60, 80, 100, 120, 140, 160].map(sy => `
              <line x1="0" y1="${sy}" x2="170" y2="${sy}" stroke="#4E342E" stroke-width="1.5"/>
            `).join('')}

            <!-- Tejado del establo -->
            <polygon points="-10,40 85,0 180,40" fill="url(#tejasBarroGrad)" stroke="#871A00" stroke-width="2"/>

            <!-- Puerta de corral con aspas en X -->
            <rect x="25" y="80" width="80" height="100" fill="#4E342E" stroke="#271C19" stroke-width="2"/>
            <line x1="25" y1="80" x2="105" y2="180" stroke="#8D6E63" stroke-width="2.5"/>
            <line x1="105" y1="80" x2="25" y2="180" stroke="#8D6E63" stroke-width="2.5"/>

            <!-- Heno dorado asomándose -->
            <path d="M30,110 Q45,95 60,110 Q75,95 90,110" fill="none" stroke="#F1C40F" stroke-width="3"/>
          </g>

          <!-- Vaca Criolla / Lechera contenta asomada en el corral -->
          <g id="vaca-lechera" transform="translate(230, 485)" filter="url(#dropShadow)">
            <!-- Cabeza y Orejas -->
            <ellipse cx="25" cy="20" rx="20" ry="16" fill="#FFFFFF" stroke="#212121" stroke-width="1.5"/>
            <!-- Mancha negra característica -->
            <path d="M12,10 Q20,6 28,14 Q22,25 10,20 Z" fill="#212121"/>
            
            <!-- Orejas -->
            <ellipse cx="5" cy="10" rx="9" ry="5" fill="#FFFFFF" stroke="#212121" stroke-width="1.2" transform="rotate(-20 5 10)"/>
            <ellipse cx="45" cy="10" rx="9" ry="5" fill="#FFFFFF" stroke="#212121" stroke-width="1.2" transform="rotate(20 45 10)"/>
            <ellipse cx="5" cy="10" rx="6" ry="3" fill="#F8BBD0" transform="rotate(-20 5 10)"/>
            <ellipse cx="45" cy="10" rx="6" ry="3" fill="#F8BBD0" transform="rotate(20 45 10)"/>

            <!-- Cuernitos -->
            <path d="M14,6 Q10,-4 6,-2" fill="none" stroke="#D7CCC8" stroke-width="3" stroke-linecap="round"/>
            <path d="M36,6 Q40,-4 44,-2" fill="none" stroke="#D7CCC8" stroke-width="3" stroke-linecap="round"/>

            <!-- Ojos tiernos -->
            <circle cx="16" cy="17" r="3" fill="#212121"/>
            <circle cx="17" cy="16" r="1" fill="#FFFFFF"/>
            <circle cx="34" cy="17" r="3" fill="#212121"/>
            <circle cx="35" cy="16" r="1" fill="#FFFFFF"/>

            <!-- Hocico sonriente rosado -->
            <ellipse cx="25" cy="28" rx="14" ry="9" fill="#F8BBD0" stroke="#F06292" stroke-width="1.2"/>
            <circle cx="20" cy="27" r="2" fill="#880E4F"/>
            <circle cx="30" cy="27" r="2" fill="#880E4F"/>
            <path d="M21,32 Q25,36 29,32" fill="none" stroke="#880E4F" stroke-width="1.5"/>

            <!-- Cencerro tradicional campesino -->
            <rect x="22" y="37" width="6" height="8" fill="#FBC02D" stroke="#F57F17" stroke-width="1" rx="1"/>
            <circle cx="25" cy="45" r="1.5" fill="#E65100"/>
          </g>

          <!-- Gallinas Criollas picoteando en el prado -->
          <g id="gallinas-campo">
            <!-- Gallina Blanca -->
            <g transform="translate(370, 640)" filter="url(#softShadow)">
              <ellipse cx="15" cy="12" rx="14" ry="10" fill="#FFFFFF" stroke="#CFD8DC" stroke-width="1"/>
              <circle cx="24" cy="5" r="6" fill="#FFFFFF" stroke="#CFD8DC" stroke-width="1"/>
              <!-- Pico y cresta roja -->
              <polygon points="29,5 35,7 29,9" fill="#FF9800"/>
              <polygon points="23,0 26,-5 28,1" fill="#E53935"/>
              <ellipse cx="14" cy="14" rx="7" ry="5" fill="#ECEFF1"/>
              <circle cx="26" cy="4" r="1.2" fill="#212121"/>
              <!-- Patitas -->
              <line x1="12" y1="22" x2="12" y2="28" stroke="#FF9800" stroke-width="1.5"/>
              <line x1="18" y1="22" x2="18" y2="28" stroke="#FF9800" stroke-width="1.5"/>
            </g>

            <!-- Gallina Parda / Colorada -->
            <g transform="translate(420, 655)" filter="url(#softShadow)">
              <ellipse cx="15" cy="12" rx="13" ry="9" fill="#A04000" stroke="#6E2C00" stroke-width="1"/>
              <circle cx="6" cy="5" r="5.5" fill="#BA4A00"/>
              <polygon points="1,5 -5,7 1,9" fill="#FF9800"/>
              <polygon points="5,0 7,-4 9,1" fill="#E53935"/>
              <ellipse cx="15" cy="13" rx="7" ry="4" fill="#D35400"/>
              <circle cx="4" cy="4" r="1.2" fill="#212121"/>
              <line x1="12" y1="21" x2="12" y2="27" stroke="#FF9800" stroke-width="1.5"/>
              <line x1="17" y1="21" x2="17" y2="27" stroke="#FF9800" stroke-width="1.5"/>
            </g>

            <!-- Pollitos amarillos -->
            <g transform="translate(400, 665)">
              <circle cx="5" cy="5" r="4" fill="#FEE140"/>
              <circle cx="8" cy="3" r="2.5" fill="#FEE140"/>
              <polygon points="10,3 13,4 10,5" fill="#FF9800"/>
              <circle cx="9" cy="2.5" r="0.6" fill="#212121"/>
            </g>
          </g>

          <!-- Cantinas Tradicionales de Leche de Aluminio -->
          <g id="cantinas-leche" transform="translate(775, 545)" filter="url(#dropShadow)">
            <!-- Cantina 1 -->
            <g transform="translate(0, 0)">
              <rect x="0" y="8" width="22" height="32" rx="3" fill="#CFD8DC" stroke="#78909C" stroke-width="1.5"/>
              <ellipse cx="11" cy="8" rx="9" ry="3" fill="#B0BEC5"/>
              <rect x="4" y="2" width="14" height="6" fill="#90A4AE" stroke="#607D8B" stroke-width="1" rx="1"/>
              <line x1="11" y1="0" x2="11" y2="2" stroke="#455A64" stroke-width="2"/>
              <!-- Brillo metálico -->
              <line x1="6" y1="10" x2="6" y2="38" stroke="#FFFFFF" stroke-width="2" opacity="0.8"/>
            </g>
            <!-- Cantina 2 -->
            <g transform="translate(20, 5)">
              <rect x="0" y="8" width="20" height="28" rx="3" fill="#ECEFF1" stroke="#90A4AE" stroke-width="1.5"/>
              <ellipse cx="10" cy="8" rx="8" ry="3" fill="#CFD8DC"/>
              <rect x="3" y="3" width="14" height="5" fill="#B0BEC5" stroke="#78909C" stroke-width="1" rx="1"/>
              <line x1="5" y1="10" x2="5" y2="34" stroke="#FFFFFF" stroke-width="2" opacity="0.9"/>
            </g>
          </g>
        </g>
      `);
    }

    // ------------------------------------------------------------------------
    // NIVEL 7: PASERA CORREDIZA DE SECADO SOLAR DE CAFÉ CON GRANOS DORADOS
    // ------------------------------------------------------------------------
    if (lvl >= 7) {
      components.push(`
        <!-- ================= NIVEL 7: PASERA DE SECADO DE CAFÉ ================= -->
        <g id="farm-lvl7" transform="translate(860, 480)" filter="url(#dropShadow)">
          <!-- Estructura de rieles y pilotes de la Pasera -->
          <line x1="0" y1="90" x2="220" y2="90" stroke="#3E2723" stroke-width="5"/>
          <line x1="20" y1="90" x2="20" y2="135" stroke="#5D4037" stroke-width="4.5"/>
          <line x1="110" y1="90" x2="110" y2="135" stroke="#5D4037" stroke-width="4.5"/>
          <line x1="200" y1="90" x2="200" y2="135" stroke="#5D4037" stroke-width="4.5"/>

          <!-- Ruedas / Garruchas corredizas de hierro -->
          <circle cx="30" cy="90" r="5" fill="#212121"/>
          <circle cx="190" cy="90" r="5" fill="#212121"/>

          <!-- Gaveta / Mesa de Secado Solar de Café -->
          <polygon points="10,85 210,85 195,45 25,45" fill="#8D6E63" stroke="#4E342E" stroke-width="2"/>
          
          <!-- Capa de Café Pergamino Seco Dorado (Glistening Golden Beans) -->
          <polygon points="18,80 202,80 188,50 32,50" fill="url(#goldCoffeeBeanGrad)" stroke="#B7950B" stroke-width="1" filter="url(#goldGlow)"/>
          
          <!-- Surcos hechos con el rastrillo de madera para el secado parejo -->
          ${[55, 62, 69, 75].map(gy => `
            <line x1="30" y1="${gy}" x2="190" y2="${gy}" stroke="#B7950B" stroke-width="1.8" stroke-dasharray="8,4"/>
          `).join('')}

          <!-- Rastrillo Campesino de Madera sobre el café -->
          <g transform="translate(130, 40)">
            <line x1="0" y1="0" x2="-35" y2="30" stroke="#D7CCC8" stroke-width="3"/>
            <rect x="-42" y="26" width="18" height="6" fill="#5D4037" rx="1"/>
          </g>

          <!-- Techo corredizo de zinc / madera replegado hacia un lado -->
          <g transform="translate(110, 10)">
            <polygon points="0,35 95,15 95,5 0,25" fill="#90A4AE" stroke="#455A64" stroke-width="1.5"/>
            <line x1="10" y1="33" x2="10" y2="23" stroke="#37474F" stroke-width="2"/>
            <line x1="85" y1="17" x2="85" y2="7" stroke="#37474F" stroke-width="2"/>
          </g>

          <!-- Bultos / Costales de Fique (Café de Colombia 100%) -->
          <g transform="translate(-30, 75)">
            <ellipse cx="18" cy="22" rx="16" ry="20" fill="#D7CCC8" stroke="#8D6E63" stroke-width="2"/>
            <ellipse cx="18" cy="5" rx="10" ry="4" fill="#BCAAA4"/>
            <!-- Costura y Logo Café de Colombia -->
            <text x="18" y="24" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="#2E7D32" text-anchor="middle">CAFÉ</text>
            <polygon points="18,27 14,33 22,33" fill="#C62828"/>
          </g>
        </g>
      `);
    }

    // ------------------------------------------------------------------------
    // NIVEL 8: VICTORIA MÁXIMA - BANDERA DE COLOMBIA, FESTONES Y LETRERO TALLADO
    // ------------------------------------------------------------------------
    if (lvl >= 8) {
      components.push(`
        <!-- ================= NIVEL 8: HACIENDA TRIUNFAL (VICTORIA MÁXIMA) ================= -->
        <g id="farm-lvl8">
          <!-- Bandera de Colombia ondeando en la cumbre del tejado -->
          <g id="bandera-colombia" transform="translate(610, 10)" filter="url(#dropShadow)">
            <!-- Mástil blanco -->
            <line x1="0" y1="0" x2="0" y2="90" stroke="#FFFFFF" stroke-width="4.5"/>
            <circle cx="0" cy="0" r="4.5" fill="#FDD835"/>

            <!-- Pabellón Nacional ondeando con ondas suaves -->
            <g transform="translate(2, 4)">
              <!-- Franja Amarilla (50% superior) -->
              <path d="M0,0 Q30,-8 60,0 Q90,8 115,-2 L115,28 Q90,38 60,30 Q30,22 0,30 Z" fill="#FCD116" stroke="#C49B00" stroke-width="0.8"/>
              <!-- Franja Azul (25% media) -->
              <path d="M0,30 Q30,22 60,30 Q90,38 115,28 L115,44 Q90,54 60,46 Q30,38 0,46 Z" fill="#003893"/>
              <!-- Franja Roja (25% inferior) -->
              <path d="M0,46 Q30,38 60,46 Q90,54 115,44 L115,60 Q90,70 60,62 Q30,54 0,62 Z" fill="#CE1126"/>
            </g>
          </g>

          <!-- Gran Letrero Colonial Tallado en Madera Noble: "HACIENDA LA ESPERANZA" -->
          <g id="letrero-hacienda" transform="translate(610, 195)" filter="url(#dropShadow)">
            <!-- Placa de madera tallada con remates barrocos -->
            <path d="M-130,0 Q0,-15 130,0 L140,40 Q0,30 -140,40 Z" fill="url(#woodRichBrown)" stroke="#FDD835" stroke-width="2.5"/>
            <!-- Marco dorado interior -->
            <path d="M-122,5 Q0,-8 122,5 L130,35 Q0,25 -130,35 Z" fill="none" stroke="#FBC02D" stroke-width="1.2"/>
            <!-- Letras doradas en relieve -->
            <text x="0" y="24" font-family="'Georgia', 'Times New Roman', serif" font-size="16" font-weight="bold" fill="#FFF9C4" text-anchor="middle" letter-spacing="2" filter="url(#goldGlow)">
              HACIENDA LA ESPERANZA
            </text>
          </g>

          <!-- Festones y Guirnaldas de Fiesta Patronal Campesina -->
          <g id="festones-fiesta">
            <!-- Guirnalda superior del balcón -->
            <path d="M380,340 Q490,375 610,345 Q730,375 840,340" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity="0.8"/>
            <!-- Banderines multicolores -->
            ${[
              { x: 400, y: 345, color: '#F1C40F' },
              { x: 425, y: 355, color: '#E74C3C' },
              { x: 450, y: 362, color: '#3498DB' },
              { x: 475, y: 366, color: '#2ECC71' },
              { x: 500, y: 368, color: '#9B59B6' },
              { x: 525, y: 366, color: '#E67E22' },
              { x: 550, y: 360, color: '#F1C40F' },
              { x: 575, y: 352, color: '#E74C3C' },
              { x: 600, y: 346, color: '#3498DB' },
              { x: 625, y: 352, color: '#2ECC71' },
              { x: 650, y: 360, color: '#9B59B6' },
              { x: 675, y: 366, color: '#E67E22' },
              { x: 700, y: 368, color: '#F1C40F' },
              { x: 725, y: 366, color: '#E74C3C' },
              { x: 750, y: 362, color: '#3498DB' },
              { x: 775, y: 355, color: '#2ECC71' },
              { x: 800, y: 348, color: '#F1C40F' },
              { x: 820, y: 342, color: '#E74C3C' }
            ].map(b => `
              <polygon points="${b.x - 7},${b.y} ${b.x + 7},${b.y} ${b.x},${b.y + 16}" fill="${b.color}" stroke="#2C3E50" stroke-width="0.6"/>
            `).join('')}

            <!-- Destellos dorados festivos en el cielo -->
            <g filter="url(#goldGlow)" fill="#FFF9C4">
              <path d="M520,70 L524,80 L534,84 L524,88 L520,98 L516,88 L506,84 L516,80 Z"/>
              <path d="M720,60 L723,68 L731,71 L723,74 L720,82 L717,74 L709,71 L717,68 Z"/>
              <path d="M340,160 L343,168 L351,171 L343,174 L340,182 L337,174 L329,171 L337,168 Z"/>
              <path d="M880,180 L883,188 L891,191 L883,194 L880,202 L877,194 L869,191 L877,188 Z"/>
            </g>
          </g>
        </g>
      `);
    }

    // ------------------------------------------------------------------------
    // DETALLES DE ALERTA / PREOCUPACIÓN (isWorried = true)
    // ------------------------------------------------------------------------
    let worriedOverlay = '';
    if (isWorried) {
      worriedOverlay = `
        <!-- ================= ESTADO DE ALERTA (isWorried) ================= -->
        <g id="farm-worried-state">
          <!-- Grietas sutiles en el terreno y zócalo -->
          <path d="M520,590 L535,605 L528,620 L545,635" stroke="#212121" stroke-width="2" fill="none" opacity="0.65"/>
          <path d="M680,595 L670,610 L682,625 L675,640" stroke="#212121" stroke-width="1.8" fill="none" opacity="0.6"/>
          
          <!-- Humareda lejana en el horizonte (alerta en la vereda) -->
          <g opacity="0.55" filter="url(#softShadow)">
            <path d="M280,320 Q290,260 270,200 Q250,150 280,100" stroke="#546E7A" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="10,15"/>
            <circle cx="280" cy="100" r="18" fill="#78909C" opacity="0.5"/>
            <circle cx="265" cy="140" r="14" fill="#607D8B" opacity="0.6"/>
          </g>

          <!-- Tinte sutil crepuscular de tensión -->
          <rect x="0" y="0" width="1200" height="800" fill="#E65100" opacity="0.08" style="mix-blend-mode: multiply;"/>
        </g>
      `;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" class="farm-svg-canvas">
        ${SVG_DEFS}
        ${renderBackground(level >= 8 ? 'sunset' : 'day')}
        <g id="farm-scene-container">
          ${components.join('\n')}
          ${worriedOverlay}
        </g>
      </svg>
    `;
  }

  // ==========================================================================
  // 4. RENDERIZADO DEL PERSONAJE: DON JACINTO (4 ESTADOS)
  // ==========================================================================

  /**
   * Renderiza el personaje Don Jacinto en SVG con altísima calidad vectorial
   * @param {string} state - 'DIRTY' | 'CLEAN' | 'WORRIED' | 'VICTORY'
   */
  function renderJacinto(state = 'CLEAN') {
    const st = (state || 'CLEAN').toUpperCase();

    // Configuración postural y gestual según el estado
    let bodyTransform = 'translate(200, 260)';
    let headTransform = 'translate(0, 0)';
    let leftArm = '';
    let rightArm = '';
    let expression = '';
    let overlays = '';
    let accessories = '';

    // ------------------------------------------------------------------------
    // CABEZA BASE DE DON JACINTO (Sombrero Aguadeño, Rostro, Bigote Campesino)
    // ------------------------------------------------------------------------
    const baseHead = (mouthPath, eyeShape, browRotation, sweatDrop = false) => `
      <g id="jacinto-head" filter="url(#dropShadow)">
        <!-- Cuello y Pañuelo Rabo e' Gallo Rojo -->
        <path d="M-15,35 L15,35 L12,65 L-12,65 Z" fill="url(#skinShadowGrad)"/>
        <!-- Pañuelo campesino rojo anudado al cuello -->
        <path d="M-22,50 Q0,65 22,50 Q18,75 0,80 Q-18,75 -22,50 Z" fill="#C62828" stroke="#8E0000" stroke-width="1.5"/>
        <circle cx="0" cy="74" r="4" fill="#B71C1C"/>
        <path d="M0,74 L-8,92 L0,86 L8,92 Z" fill="#C62828"/>

        <!-- Rostro de Don Jacinto -->
        <path d="M-28,0 Q-32,35 0,46 Q32,35 28,0 Q24,-30 0,-30 Q-24,-30 -28,0 Z" fill="url(#skinGrad)" stroke="#B3541E" stroke-width="1.5"/>

        <!-- Orejas con detalle anatómico -->
        <ellipse cx="-29" cy="5" rx="6" ry="10" fill="url(#skinGrad)" stroke="#B3541E" stroke-width="1"/>
        <ellipse cx="29" cy="5" rx="6" ry="10" fill="url(#skinGrad)" stroke="#B3541E" stroke-width="1"/>
        <path d="M-28,3 Q-25,7 -28,10" fill="none" stroke="#A04000" stroke-width="1"/>
        <path d="M28,3 Q25,7 28,10" fill="none" stroke="#A04000" stroke-width="1"/>

        <!-- Mejillas sonrosadas por el sol de montaña -->
        <circle cx="-16" cy="14" r="8" fill="#E74C3C" opacity="0.25"/>
        <circle cx="16" cy="14" r="8" fill="#E74C3C" opacity="0.25"/>

        <!-- Nariz noble campesina -->
        <path d="M0,-8 Q4,8 7,12 Q0,17 -7,12 Q-4,8 0,-8" fill="url(#skinShadowGrad)" stroke="#A04000" stroke-width="1"/>

        <!-- Ojos y Cejas -->
        ${eyeShape}

        <!-- Cejas tupidas -->
        <g fill="#3E2723">
          <path d="M-22,-8 Q-12,-16 -4,-10 Q-12,-12 -22,-8" transform="${browRotation.left}"/>
          <path d="M22,-8 Q12,-16 4,-10 Q12,-12 22,-8" transform="${browRotation.right}"/>
        </g>

        <!-- Bigote Paisa Colombiano Frondoso y Legendario -->
        <path d="M0,18 Q-15,10 -30,22 Q-18,32 0,23 Q18,32 30,22 Q15,10 0,18 Z" fill="#2D1D17" stroke="#1B100C" stroke-width="1.2"/>
        <!-- Detalle de canas en el bigote -->
        <path d="M-15,18 Q-5,22 0,20" stroke="#D7CCC8" stroke-width="1" fill="none" opacity="0.6"/>
        <path d="M15,18 Q5,22 0,20" stroke="#D7CCC8" stroke-width="1" fill="none" opacity="0.6"/>

        <!-- Boca / Sonrisa -->
        ${mouthPath}

        <!-- Gota de Sudor Cósmica / Preocupación (si aplica) -->
        ${sweatDrop ? `
          <g transform="translate(24, -22)" filter="url(#dropShadow)">
            <path d="M0,0 Q-6,10 0,16 Q6,10 0,0 Z" fill="#29B6F6" stroke="#0288D1" stroke-width="1"/>
            <circle cx="-1.5" cy="10" r="1.5" fill="#FFFFFF"/>
          </g>
        ` : ''}

        <!-- Sombrero Aguadeño Tradicional (Fina paja jipijapa) -->
        <g id="sombrero-aguadeno" transform="translate(0, -26)" filter="url(#dropShadow)">
          <!-- Ala ancha del sombrero -->
          <ellipse cx="0" cy="0" rx="72" ry="22" fill="url(#sombreroStrawGrad)" stroke="#D4AC0D" stroke-width="1.8"/>
          <!-- Sombra bajo el ala -->
          <ellipse cx="0" cy="4" rx="42" ry="12" fill="#7D6608" opacity="0.3"/>
          
          <!-- Copa del sombrero -->
          <path d="M-36,0 Q-40,-38 0,-42 Q40,-38 36,0 Z" fill="url(#sombreroStrawGrad)" stroke="#D4AC0D" stroke-width="1.8"/>
          <!-- Hendidura superior clásica de la copa -->
          <path d="M-20,-36 Q0,-30 20,-36" fill="none" stroke="#B7950B" stroke-width="2.5"/>

          <!-- Cinta negra de terciopelo tradicional -->
          <path d="M-36,-2 Q0,4 36,-2 L36,-10 Q0,-4 -36,-10 Z" fill="#1A1A1A" stroke="#000000" stroke-width="1"/>
          <rect x="-8" y="-10" width="16" height="8" fill="#FDD835" rx="1"/>
        </g>
      </g>
    `;

    // ------------------------------------------------------------------------
    // DIFERENCIACIÓN SEGÚN EL ESTADO
    // ------------------------------------------------------------------------

    if (st === 'DIRTY') {
      // Don Jacinto tras la dura y honrada jornada en el cafetal (con manchas de tierra y canasto)
      expression = baseHead(
        `<path d="M-10,27 Q0,32 10,27" fill="none" stroke="#5D4037" stroke-width="2.5" stroke-linecap="round"/>`,
        `
          <ellipse cx="-13" cy="-2" rx="4.5" ry="3.5" fill="#2C3E50"/>
          <circle cx="-12" cy="-3" r="1.2" fill="#FFFFFF"/>
          <ellipse cx="13" cy="-2" rx="4.5" ry="3.5" fill="#2C3E50"/>
          <circle cx="14" cy="-3" r="1.2" fill="#FFFFFF"/>
        `,
        { left: 'rotate(5 -13 -10)', right: 'rotate(-5 13 -10)' }
      );

      // Brazos recogiendo café
      leftArm = `
        <!-- Brazo izquierdo sosteniendo rama de café -->
        <path d="M-35,90 Q-65,110 -60,150" stroke="url(#skinGrad)" stroke-width="20" stroke-linecap="round" fill="none"/>
        <circle cx="-60" cy="150" r="12" fill="url(#skinGrad)"/>
        <!-- Rama de café en la mano -->
        <path d="M-75,130 Q-60,150 -50,170" stroke="#5D4037" stroke-width="3" fill="none"/>
        <circle cx="-65" cy="142" r="5" fill="url(#redCherryGrad)"/>
        <circle cx="-58" cy="148" r="5" fill="url(#redCherryGrad)"/>
        <ellipse cx="-72" cy="136" rx="6" ry="3" fill="#27AE60" transform="rotate(-30 -72 136)"/>
      `;

      rightArm = `
        <!-- Brazo derecho apoyado en el canasto -->
        <path d="M35,90 Q70,110 50,150" stroke="url(#skinGrad)" stroke-width="20" stroke-linecap="round" fill="none"/>
        <circle cx="50" cy="150" r="12" fill="url(#skinGrad)"/>
      `;

      // Manchas de tierra y polvo de la cosecha
      overlays = `
        <!-- Manchas de tierra en sombrero, rostro y ruana -->
        <g fill="#795548" opacity="0.6">
          <ellipse cx="-14" cy="-5" rx="5" ry="3" transform="rotate(15 -14 -5)"/>
          <ellipse cx="18" cy="10" rx="6" ry="3.5" transform="rotate(-20 18 10)"/>
          <ellipse cx="0" cy="-28" rx="8" ry="3"/>
          <circle cx="-18" cy="95" r="5"/>
          <circle cx="22" cy="110" r="6"/>
          <circle cx="-5" cy="130" r="7"/>
          <circle cx="15" cy="145" r="5.5"/>
        </g>
      `;

      // Canasto cafetero lleno de café recolectado
      accessories = `
        <g id="canasto-cafetero" transform="translate(-45, 130)" filter="url(#dropShadow)">
          <!-- Canasto de bejuco tejido -->
          <polygon points="10,20 80,20 72,75 18,75" fill="#B7950B" stroke="#7D6608" stroke-width="2"/>
          <!-- Trama tejida del canasto -->
          ${[32, 44, 56, 68].map(cy => `
            <line x1="14" y1="${cy}" x2="76" y2="${cy}" stroke="#7D6608" stroke-width="1.8"/>
          `).join('')}
          ${[25, 40, 55, 68].map(cx => `
            <line x1="${cx}" y1="20" x2="${cx - 2}" y2="75" stroke="#7D6608" stroke-width="1.8"/>
          `).join('')}
          <!-- Rebosante de granos de café rojo cereza -->
          <g fill="url(#redCherryGrad)">
            ${[
              {x:25,y:16},{x:35,y:12},{x:45,y:10},{x:55,y:13},{x:65,y:17},
              {x:30,y:20},{x:40,y:18},{x:50,y:17},{x:60,y:20}
            ].map(c => `<circle cx="${c.x}" cy="${c.y}" r="5.5"/>`).join('')}
          </g>
          <!-- Cinto / Correa de cuero que amarra el canasto a la cintura -->
          <path d="M10,25 Q-15,10 -30,0" stroke="#4E342E" stroke-width="4" fill="none"/>
          <path d="M80,25 Q105,10 120,0" stroke="#4E342E" stroke-width="4" fill="none"/>
        </g>
      `;

    } else if (st === 'WORRIED') {
      // Don Jacinto preocupado, en alerta por un fallo o pérdida de vida
      expression = baseHead(
        `<path d="M-12,30 Q-6,24 0,28 Q6,32 12,26" fill="none" stroke="#A04000" stroke-width="2.5" stroke-linecap="round"/>`,
        `
          <ellipse cx="-13" cy="-3" rx="5" ry="5.5" fill="#FFFFFF" stroke="#2C3E50" stroke-width="1.5"/>
          <circle cx="-12" cy="-2" r="2.8" fill="#1A252F"/>
          <circle cx="-13" cy="-3.5" r="1" fill="#FFFFFF"/>

          <ellipse cx="13" cy="-3" rx="5" ry="5.5" fill="#FFFFFF" stroke="#2C3E50" stroke-width="1.5"/>
          <circle cx="12" cy="-2" r="2.8" fill="#1A252F"/>
          <circle cx="11" cy="-3.5" r="1" fill="#FFFFFF"/>
        `,
        { left: 'rotate(-25 -13 -10)', right: 'rotate(25 13 -10)' },
        true // sweat drop activo
      );

      // Manos a la cabeza / expresión de angustia
      leftArm = `
        <path d="M-35,90 Q-65,70 -42,30" stroke="url(#skinGrad)" stroke-width="20" stroke-linecap="round" fill="none"/>
        <circle cx="-42" cy="30" r="12" fill="url(#skinGrad)"/>
      `;
      rightArm = `
        <path d="M35,90 Q65,110 50,145" stroke="url(#skinGrad)" stroke-width="20" stroke-linecap="round" fill="none"/>
        <circle cx="50" cy="145" r="12" fill="url(#skinGrad)"/>
      `;

      overlays = `
        <!-- Ondas de temblor / preocupación cómica -->
        <g stroke="#29B6F6" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8">
          <path d="M-45,-40 Q-55,-30 -45,-20"/>
          <path d="M45,-40 Q55,-30 45,-20"/>
        </g>
      `;

    } else if (st === 'VICTORY') {
      // Don Jacinto saltando de alegría con las manos en alto y canasto de café dorado
      bodyTransform = 'translate(200, 220)';
      expression = baseHead(
        `
          <!-- Gran boca sonriente de oreja a oreja -->
          <path d="M-15,22 Q0,42 15,22 Z" fill="#C0392B" stroke="#96281B" stroke-width="1.5"/>
          <path d="M-11,23 Q0,28 11,23 Q8,20 -11,20 Z" fill="#FFFFFF"/>
        `,
        `
          <!-- Ojos achinados de pura felicidad ( ^  ^ ) -->
          <path d="M-18,-2 Q-13,-10 -8,-2" fill="none" stroke="#1A252F" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M8,-2 Q13,-10 18,-2" fill="none" stroke="#1A252F" stroke-width="3.5" stroke-linecap="round"/>
        `,
        { left: 'rotate(10 -13 -10)', right: 'rotate(-10 13 -10)' }
      );

      // Ambos brazos levantados al cielo en señal de victoria
      leftArm = `
        <path d="M-35,90 Q-70,40 -60,-15" stroke="url(#skinGrad)" stroke-width="20" stroke-linecap="round" fill="none"/>
        <circle cx="-60" cy="-15" r="13" fill="url(#skinGrad)"/>
        <!-- Pulgar arriba / Mano abierta de triunfo -->
        <path d="M-60,-15 L-55,-28" stroke="url(#skinGrad)" stroke-width="6" stroke-linecap="round"/>
      `;

      rightArm = `
        <path d="M35,90 Q70,40 60,-15" stroke="url(#skinGrad)" stroke-width="20" stroke-linecap="round" fill="none"/>
        <circle cx="60" cy="-15" r="13" fill="url(#skinGrad)"/>
        <path d="M60,-15 L55,-28" stroke="url(#skinGrad)" stroke-width="6" stroke-linecap="round"/>
      `;

      // Resplandor de oro, estrellas y canasto de café dorado triunfal
      accessories = `
        <!-- Canasto rebosante de Granos de Café de Oro Puro -->
        <g id="canasto-dorado" transform="translate(-45, 120)" filter="url(#goldGlow)">
          <polygon points="10,20 80,20 72,75 18,75" fill="url(#goldCoffeeBeanGrad)" stroke="#B7950B" stroke-width="2"/>
          <!-- Montículo de café de oro reluciente -->
          <ellipse cx="45" cy="18" rx="35" ry="14" fill="#FEE140" stroke="#F39C12" stroke-width="1.5"/>
          ${[
            {x:22,y:16},{x:32,y:10},{x:45,y:8},{x:58,y:11},{x:68,y:16},
            {x:28,y:20},{x:42,y:17},{x:54,y:18},{x:62,y:21}
          ].map(c => `<circle cx="${c.x}" cy="${c.y}" r="5.5" fill="url(#goldCoffeeBeanGrad)"/>`).join('')}
        </g>

        <!-- Estrellas y chispas de victoria -->
        <g fill="#FFF59D" filter="url(#goldGlow)">
          <polygon points="-85,-30 -80,-20 -70,-20 -78,-14 -75,-4 -85,-10 -95,-4 -92,-14 -100,-20 -90,-20" transform="scale(0.8)"/>
          <polygon points="85,-30 90,-20 100,-20 92,-14 95,-4 85,-10 75,-4 78,-14 70,-20 80,-20" transform="scale(0.8)"/>
          <polygon points="0,-70 5,-60 15,-60 7,-54 10,-44 0,-50 -10,-44 -7,-54 -15,-60 -5,-60" transform="scale(0.9)"/>
        </g>
      `;

    } else {
      // Estado 'CLEAN' por defecto: Don Jacinto pulcro, sonriente, con su ruana impecable y carriel
      expression = baseHead(
        `
          <!-- Sonrisa cordial colombiana -->
          <path d="M-12,24 Q0,35 12,24" fill="none" stroke="#A04000" stroke-width="2.5" stroke-linecap="round"/>
        `,
        `
          <ellipse cx="-13" cy="-2" rx="4.5" ry="4" fill="#2C3E50"/>
          <circle cx="-11.5" cy="-3.5" r="1.5" fill="#FFFFFF"/>
          <ellipse cx="13" cy="-2" rx="4.5" ry="4" fill="#2C3E50"/>
          <circle cx="14.5" cy="-3.5" r="1.5" fill="#FFFFFF"/>
        `,
        { left: 'rotate(0)', right: 'rotate(0)' }
      );

      // Brazo izquierdo saludando amablemente / pulgar arriba
      leftArm = `
        <path d="M-35,90 Q-65,95 -60,65" stroke="url(#skinGrad)" stroke-width="20" stroke-linecap="round" fill="none"/>
        <circle cx="-60" cy="65" r="12" fill="url(#skinGrad)"/>
        <!-- Pulgar arriba cordial -->
        <path d="M-60,65 L-60,50" stroke="url(#skinGrad)" stroke-width="6" stroke-linecap="round"/>
      `;

      // Brazo derecho descansando sobre su carriel
      rightArm = `
        <path d="M35,90 Q65,110 45,150" stroke="url(#skinGrad)" stroke-width="20" stroke-linecap="round" fill="none"/>
        <circle cx="45" cy="150" r="12" fill="url(#skinGrad)"/>
      `;

      // Brillo estelar en el sombrero limpio
      accessories = `
        <!-- Destello en el sombrero aguadeño -->
        <g transform="translate(38, -48)" filter="url(#goldGlow)">
          <path d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z" fill="#FFFFFF"/>
        </g>
      `;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" class="jacinto-svg-canvas">
        ${SVG_DEFS}
        <g id="jacinto-character" transform="${bodyTransform}">
          <!-- Piernas y Pantalón de Dril Azul Campesino -->
          <g id="jacinto-legs">
            <!-- Pantalón de trabajo -->
            <path d="M-30,170 L-28,260 L-8,260 L-10,180 L10,180 L8,260 L28,260 L30,170 Z" fill="#2C3E50" stroke="#1A252F" stroke-width="2"/>
            <!-- Botas de Cuero Campesinas -->
            <g fill="#4E342E" stroke="#271C19" stroke-width="1.5">
              <rect x="-30" y="255" width="24" height="18" rx="4"/>
              <rect x="6" y="255" width="24" height="18" rx="4"/>
            </g>
          </g>

          <!-- Brazos (Capa trasera o conectores) -->
          ${leftArm}
          ${rightArm}

          <!-- Torso y Ruana Colombiana Tradicional de Lana Virgen -->
          <g id="jacinto-torso" filter="url(#dropShadow)">
            <!-- Camisa blanca bajo la ruana -->
            <rect x="-25" y="55" width="50" height="30" fill="#FFFFFF" stroke="#CFD8DC" stroke-width="1"/>

            <!-- Ruana de lana blanca con ribetes rojizos y flecos -->
            <path d="M-45,65 Q0,78 45,65 L55,160 Q0,180 -55,160 Z" fill="url(#ruanaWoolGrad)" stroke="#B0BEC5" stroke-width="1.5"/>
            
            <!-- Franja decorativa tradicional de la ruana (cenefa roja y negra) -->
            <path d="M-52,145 Q0,165 52,145 L54,155 Q0,175 -54,155 Z" fill="#8B0000"/>
            <path d="M-50,138 Q0,158 50,138" stroke="#F1C40F" stroke-width="1.8" fill="none"/>

            <!-- Abertura central del cuello de la ruana -->
            <polygon points="-8,68 8,68 0,105" fill="#37474F"/>
          </g>

          <!-- Carriel Antioqueño Tradicional (Bolsa de cuero con múltiples bolsillos) -->
          <g id="carriel-antioqueno" transform="translate(18, 110)" filter="url(#dropShadow)">
            <!-- Correa terciada cruzada al hombro -->
            <path d="M-45,-45 L0,20" stroke="url(#carrielLeatherGrad)" stroke-width="5" fill="none"/>
            <!-- Caja del carriel de cuero charolado -->
            <rect x="-8" y="15" width="34" height="38" rx="4" fill="url(#carrielLeatherGrad)" stroke="#271C19" stroke-width="1.5"/>
            <!-- Tapa de piel con pelo / ribetes amarillos y verdes -->
            <path d="M-9,15 Q9,35 27,15" fill="#5D4037" stroke="#FDD835" stroke-width="1.5"/>
            <!-- Hebilla dorada -->
            <rect x="7" y="26" width="5" height="7" fill="#FFD700" stroke="#B7950B" stroke-width="0.8"/>
          </g>

          <!-- Accesorios adicionales (canastos, manchas, destellos) -->
          ${accessories}
          ${overlays}

          <!-- Cabeza de Don Jacinto -->
          <g transform="${headTransform}">
            ${expression}
          </g>
        </g>
      </svg>
    `;
  }

  // ==========================================================================
  // 5. COMPATIBILIDAD CON DOM, REACT Y EXPORTACIÓN GLOBAL
  // ==========================================================================

  /**
   * Crea directamente un nodo DOM Element a partir del SVG de la Finca
   */
  function renderFarmElement(level = 0, isWorried = false) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(renderFarm(level, isWorried), 'image/svg+xml');
    return doc.documentElement;
  }

  /**
   * Crea directamente un nodo DOM Element a partir del SVG de Don Jacinto
   */
  function renderJacintoElement(state = 'CLEAN') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(renderJacinto(state), 'image/svg+xml');
    return doc.documentElement;
  }

  // Exportar Objeto Global para navegadores
  const FarmAssets = {
    renderFarm,
    renderJacinto,
    renderBackground,
    renderFarmElement,
    renderJacintoElement,
    createWaxPalm,
    createCoffeeBush,
    createHeliconias,
    createOrchid
  };

  if (typeof window !== 'undefined') {
    window.FarmAssets = FarmAssets;
    window.renderFarm = renderFarm;
    window.renderJacinto = renderJacinto;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = FarmAssets;
  }

})(typeof window !== 'undefined' ? window : globalThis);
