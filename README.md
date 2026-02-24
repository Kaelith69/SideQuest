<div align="center">

<!-- ═══════════════════════════════════════════════════════════════════
     SVG HERO BANNER  —  Developer Tool palette
     Primary: #F59E0B  |  Secondary: #2563EB  |  Accent: #10B981
     ═══════════════════════════════════════════════════════════════════ -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 240" width="900" height="240" role="img" aria-label="SideQuest – Hyper-local task marketplace hero banner">
  <defs>
    <linearGradient id="sq-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070D24"/>
      <stop offset="55%" stop-color="#0F1A40"/>
      <stop offset="100%" stop-color="#1A2255"/>
    </linearGradient>
    <linearGradient id="sq-title" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="sq-pin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <filter id="sq-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="sq-subtle" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="900" height="240" fill="url(#sq-bg)" rx="18"/>

  <!-- Subtle grid -->
  <g stroke="#ffffff05" stroke-width="1">
    <line x1="0" y1="48"  x2="900" y2="48"/>
    <line x1="0" y1="96"  x2="900" y2="96"/>
    <line x1="0" y1="144" x2="900" y2="144"/>
    <line x1="0" y1="192" x2="900" y2="192"/>
    <line x1="100" y1="0" x2="100" y2="240"/>
    <line x1="200" y1="0" x2="200" y2="240"/>
    <line x1="300" y1="0" x2="300" y2="240"/>
    <line x1="400" y1="0" x2="400" y2="240"/>
    <line x1="500" y1="0" x2="500" y2="240"/>
    <line x1="600" y1="0" x2="600" y2="240"/>
    <line x1="700" y1="0" x2="700" y2="240"/>
    <line x1="800" y1="0" x2="800" y2="240"/>
  </g>

  <!-- Decorative background circles -->
  <circle cx="790" cy="60"  r="90"  fill="#F59E0B" opacity="0.03"/>
  <circle cx="820" cy="180" r="60"  fill="#2563EB" opacity="0.04"/>
  <circle cx="740" cy="120" r="110" fill="#10B981" opacity="0.02"/>

  <!-- Map Pin Icon (left) -->
  <g filter="url(#sq-glow)" transform="translate(52, 58)">
    <path d="M44 6 C26 6 12 20 12 36 C12 56 44 82 44 82 C44 82 76 56 76 36 C76 20 62 6 44 6Z" fill="url(#sq-pin)" opacity="0.95"/>
    <circle cx="44" cy="36" r="14" fill="#0F1A40" opacity="0.9"/>
    <circle cx="44" cy="36" r="7"  fill="#F59E0B" opacity="1"/>
  </g>

  <!-- Pulse rings behind pin -->
  <circle cx="96" cy="94" r="48" fill="none" stroke="#F59E0B" stroke-width="1" opacity="0.10"/>
  <circle cx="96" cy="94" r="64" fill="none" stroke="#F59E0B" stroke-width="0.6" opacity="0.06"/>

  <!-- Title -->
  <text x="158" y="108"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
    font-size="64" font-weight="800" fill="url(#sq-title)" filter="url(#sq-glow)">SideQuest</text>

  <!-- Tagline -->
  <text x="160" y="143"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
    font-size="17" font-weight="400" fill="#94A3B8">
    Hyper-local task marketplace — connecting neighbours in real time
  </text>

  <!-- Badge: v1.0.0 -->
  <rect x="160" y="162" width="76" height="26" rx="13" fill="#F59E0B"/>
  <text x="198" y="179" font-family="'Courier New', monospace" font-size="12" font-weight="700" fill="#0F1A40" text-anchor="middle">v 1.0.0</text>

  <!-- Badge: Firebase -->
  <rect x="246" y="162" width="82" height="26" rx="13" fill="#ffffff0D"/>
  <text x="287" y="179" font-family="'Courier New', monospace" font-size="12" fill="#FCD34D" text-anchor="middle">Firebase</text>

  <!-- Badge: MapLibre -->
  <rect x="338" y="162" width="84" height="26" rx="13" fill="#ffffff0D"/>
  <text x="380" y="179" font-family="'Courier New', monospace" font-size="12" fill="#93C5FD" text-anchor="middle">MapLibre</text>

  <!-- Badge: Vanilla JS -->
  <rect x="432" y="162" width="90" height="26" rx="13" fill="#ffffff0D"/>
  <text x="477" y="179" font-family="'Courier New', monospace" font-size="12" fill="#6EE7B7" text-anchor="middle">Vanilla JS</text>

  <!-- Badge: MIT -->
  <rect x="532" y="162" width="56" height="26" rx="13" fill="#ffffff0D"/>
  <text x="560" y="179" font-family="'Courier New', monospace" font-size="12" fill="#C4B5FD" text-anchor="middle">MIT</text>

  <!-- Right-side decorative pulse map indicator -->
  <circle cx="808" cy="120" r="14" fill="#F59E0B" opacity="0.15" filter="url(#sq-subtle)"/>
  <circle cx="808" cy="120" r="8"  fill="#F59E0B" opacity="0.50"/>
  <circle cx="808" cy="120" r="3"  fill="#FEF3C7"/>
  <circle cx="808" cy="120" r="28" fill="none" stroke="#F59E0B" stroke-width="1.2" opacity="0.20"/>
  <circle cx="808" cy="120" r="44" fill="none" stroke="#F59E0B" stroke-width="0.7" opacity="0.10"/>
  <circle cx="808" cy="120" r="60" fill="none" stroke="#F59E0B" stroke-width="0.4" opacity="0.06"/>
</svg>

---

[![Version](https://img.shields.io/badge/version-1.0.0-F59E0B?style=for-the-badge&logoColor=white)](https://github.com/Kaelith69/SideQuest/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-CDN-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-3.6.2-396CB2?style=for-the-badge&logo=maplibre&logoColor=white)](https://maplibre.org/)
[![Status](https://img.shields.io/badge/Status-Active-2563EB?style=for-the-badge)](https://github.com/Kaelith69/SideQuest)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-F59E0B?style=for-the-badge)](https://github.com/Kaelith69/SideQuest/pulls)

</div>

---

## 📑 Table of Contents

- [What Is SideQuest?](#-what-is-sidequest)
- [Core Capabilities](#-core-capabilities)
- [Architecture](#️-architecture)
- [Data Flow](#-data-flow)
- [Tech Stack](#️-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [Usage Guide](#-usage-guide)
- [Performance](#-performance)
- [Design Principles](#-design-principles)
- [Accessibility](#-accessibility)
- [Security & Privacy](#-security--privacy)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎮 What Is SideQuest?

**SideQuest** is a hyper-local, real-time task marketplace that connects neighbours. Got groceries to grab, a couch to move, or a dog that needs walking? Post a quest, set a Rupee (₹) reward, and let a neighbour earn it.

> *"You have money but no time. Your neighbour has time but needs money. SideQuest: now kith."* 🤝

SideQuest is a **zero-build, client-side Single-Page Application** powered by Firebase and MapLibre GL JS. No bundler. No server to maintain. Open a browser and go.

---

## 🧩 Core Capabilities

<div align="center">

<!-- ═══════════════════════════════════════════════════════════
     CORE CAPABILITY GRAPH  —  Developer Tool palette
     ═══════════════════════════════════════════════════════════ -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 320" width="820" height="320" role="img" aria-label="SideQuest core capability graph showing five interconnected system pillars">
  <defs>
    <linearGradient id="cap-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#EFF6FF"/>
    </linearGradient>
    <filter id="cap-shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#00000015"/>
    </filter>
    <filter id="cap-glow2" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="820" height="320" fill="url(#cap-bg)" rx="16"/>

  <!-- Title -->
  <text x="410" y="30" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="14" font-weight="600" fill="#64748B" letter-spacing="2">CORE CAPABILITIES</text>

  <!-- Connection lines (drawn before nodes so nodes sit on top) -->
  <!-- Center to Map -->
  <line x1="410" y1="165" x2="210" y2="115" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.5"/>
  <!-- Center to Escrow -->
  <line x1="410" y1="165" x2="610" y2="115" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.5"/>
  <!-- Center to Search -->
  <line x1="410" y1="165" x2="610" y2="240" stroke="#10B981" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.5"/>
  <!-- Center to Profiles -->
  <line x1="410" y1="165" x2="210" y2="240" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.5"/>
  <!-- Map to Profiles -->
  <line x1="210" y1="115" x2="210" y2="240" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3,5" opacity="0.35"/>
  <!-- Escrow to Search -->
  <line x1="610" y1="115" x2="610" y2="240" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3,5" opacity="0.35"/>

  <!-- ── CENTER NODE: Real-time Engine ── -->
  <circle cx="410" cy="165" r="52" fill="#2563EB" opacity="0.08" filter="url(#cap-shadow)"/>
  <circle cx="410" cy="165" r="44" fill="#2563EB"/>
  <text x="410" y="157" text-anchor="middle" font-family="sans-serif" font-size="22">⚡</text>
  <text x="410" y="175" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="white">REAL-TIME</text>
  <text x="410" y="188" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="white">ENGINE</text>

  <!-- ── TOP-LEFT NODE: Live Map ── -->
  <circle cx="210" cy="115" r="48" fill="#F59E0B" opacity="0.10" filter="url(#cap-shadow)"/>
  <circle cx="210" cy="115" r="40" fill="#F59E0B"/>
  <text x="210" y="107" text-anchor="middle" font-family="sans-serif" font-size="20">🗺️</text>
  <text x="210" y="124" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="white">LIVE MAP</text>
  <text x="210" y="137" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#FEF3C7">MapLibre GL JS</text>

  <!-- ── TOP-RIGHT NODE: Escrow Wallet ── -->
  <circle cx="610" cy="115" r="48" fill="#2563EB" opacity="0.10" filter="url(#cap-shadow)"/>
  <circle cx="610" cy="115" r="40" fill="#2563EB"/>
  <text x="610" y="107" text-anchor="middle" font-family="sans-serif" font-size="20">💰</text>
  <text x="610" y="124" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="white">ESCROW</text>
  <text x="610" y="137" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#BFDBFE">Atomic Txns</text>

  <!-- ── BOTTOM-LEFT NODE: Profiles & Ratings ── -->
  <circle cx="210" cy="240" r="48" fill="#F59E0B" opacity="0.10" filter="url(#cap-shadow)"/>
  <circle cx="210" cy="240" r="40" fill="#F59E0B"/>
  <text x="210" y="232" text-anchor="middle" font-family="sans-serif" font-size="20">⭐</text>
  <text x="210" y="249" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="white">PROFILES</text>
  <text x="210" y="262" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#FEF3C7">Ratings &amp; Stats</text>

  <!-- ── BOTTOM-RIGHT NODE: Filter & Search ── -->
  <circle cx="610" cy="240" r="48" fill="#10B981" opacity="0.10" filter="url(#cap-shadow)"/>
  <circle cx="610" cy="240" r="40" fill="#10B981"/>
  <text x="610" y="232" text-anchor="middle" font-family="sans-serif" font-size="20">🔍</text>
  <text x="610" y="249" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="white">DISCOVERY</text>
  <text x="610" y="262" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#D1FAE5">Filter + Search</text>

  <!-- Legend -->
  <rect x="260" y="290" width="300" height="22" rx="11" fill="#F1F5F9"/>
  <text x="410" y="305" text-anchor="middle"
    font-family="-apple-system, sans-serif" font-size="11" fill="#64748B">
    Five pillars — all interconnected via Firestore real-time listeners
  </text>
</svg>

</div>

---

## 🏛️ Architecture

<div align="center">

<!-- ═══════════════════════════════════════════════════════════
     ARCHITECTURE DIAGRAM  —  Developer Tool palette
     ═══════════════════════════════════════════════════════════ -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 420" width="820" height="420" role="img" aria-label="SideQuest layered architecture diagram showing browser SPA, Firebase cloud layer, and external CDN services">
  <defs>
    <linearGradient id="arch-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
    <linearGradient id="layer1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7"/>
      <stop offset="100%" stop-color="#FDE68A"/>
    </linearGradient>
    <linearGradient id="layer2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DBEAFE"/>
      <stop offset="100%" stop-color="#BFDBFE"/>
    </linearGradient>
    <linearGradient id="layer3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D1FAE5"/>
      <stop offset="100%" stop-color="#A7F3D0"/>
    </linearGradient>
    <filter id="arch-shadow">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#00000012"/>
    </filter>
    <marker id="arrowDown" markerWidth="10" markerHeight="7" refX="5" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8"/>
    </marker>
    <marker id="arrowUp" markerWidth="10" markerHeight="7" refX="5" refY="3.5" orient="auto-start-reverse">
      <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8"/>
    </marker>
  </defs>

  <rect width="820" height="420" fill="url(#arch-bg)" rx="16"/>

  <!-- Title -->
  <text x="410" y="30" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="14" font-weight="600" fill="#64748B" letter-spacing="2">SYSTEM ARCHITECTURE</text>

  <!-- ── LAYER 1: Browser SPA ── -->
  <rect x="40" y="48" width="740" height="128" rx="12" fill="url(#layer1)" filter="url(#arch-shadow)"/>
  <rect x="40" y="48" width="740" height="128" rx="12" fill="none" stroke="#F59E0B" stroke-width="1.5"/>
  <text x="60" y="70" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#92400E">🌐  BROWSER LAYER  —  Single-Page Application (no build step)</text>

  <!-- Module boxes in layer 1 -->
  <rect x="58"  y="82" width="106" height="80" rx="8" fill="white" opacity="0.7" stroke="#F59E0B" stroke-width="1"/>
  <text x="111" y="115" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#92400E">index.html</text>
  <text x="111" y="129" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#78350F">App Shell</text>
  <text x="111" y="142" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#78350F">All Views</text>

  <rect x="178" y="82" width="106" height="80" rx="8" fill="white" opacity="0.7" stroke="#F59E0B" stroke-width="1"/>
  <text x="231" y="115" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#92400E">app.js</text>
  <text x="231" y="129" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#78350F">Orchestrator</text>
  <text x="231" y="142" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#78350F">Auth State</text>

  <rect x="298" y="82" width="106" height="80" rx="8" fill="white" opacity="0.7" stroke="#F59E0B" stroke-width="1"/>
  <text x="351" y="115" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#92400E">map.js</text>
  <text x="351" y="129" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#78350F">MapLibre GL</text>
  <text x="351" y="142" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#78350F">Geolocation</text>

  <rect x="418" y="82" width="106" height="80" rx="8" fill="white" opacity="0.7" stroke="#F59E0B" stroke-width="1"/>
  <text x="471" y="115" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#92400E">tasks.js</text>
  <text x="471" y="129" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#78350F">Task CRUD</text>
  <text x="471" y="142" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#78350F">Escrow Logic</text>

  <rect x="538" y="82" width="106" height="80" rx="8" fill="white" opacity="0.7" stroke="#F59E0B" stroke-width="1"/>
  <text x="591" y="115" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#92400E">auth.js</text>
  <text x="591" y="129" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#78350F">Sign In/Up</text>
  <text x="591" y="142" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#78350F">Logout</text>

  <rect x="658" y="82" width="106" height="80" rx="8" fill="white" opacity="0.7" stroke="#F59E0B" stroke-width="1"/>
  <text x="711" y="115" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="#92400E">ui.js</text>
  <text x="711" y="129" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#78350F">Toast / Confirm</text>
  <text x="711" y="142" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#78350F">Modals</text>

  <!-- Arrow 1→2 -->
  <line x1="410" y1="180" x2="410" y2="210" stroke="#94A3B8" stroke-width="2" marker-end="url(#arrowDown)" stroke-dasharray="4,3"/>
  <text x="430" y="200" font-family="-apple-system, sans-serif" font-size="10" fill="#94A3B8">HTTPS / WS</text>

  <!-- ── LAYER 2: Firebase Cloud ── -->
  <rect x="40" y="214" width="740" height="116" rx="12" fill="url(#layer2)" filter="url(#arch-shadow)"/>
  <rect x="40" y="214" width="740" height="116" rx="12" fill="none" stroke="#2563EB" stroke-width="1.5"/>
  <text x="60" y="236" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#1E40AF">☁️  FIREBASE CLOUD  —  Google Cloud infrastructure</text>

  <rect x="100" y="248" width="220" height="70" rx="8" fill="white" opacity="0.8" stroke="#2563EB" stroke-width="1"/>
  <text x="210" y="272" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#1E40AF">🔐  Firebase Authentication</text>
  <text x="210" y="289" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" fill="#3B82F6">Email / Password</text>
  <text x="210" y="304" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" fill="#3B82F6">JWT tokens  •  onAuthStateChanged</text>

  <rect x="500" y="248" width="220" height="70" rx="8" fill="white" opacity="0.8" stroke="#2563EB" stroke-width="1"/>
  <text x="610" y="272" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#1E40AF">🗄️  Cloud Firestore</text>
  <text x="610" y="289" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" fill="#3B82F6">Real-time NoSQL  •  /tasks  /users</text>
  <text x="610" y="304" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" fill="#3B82F6">Atomic transactions  •  onSnapshot</text>

  <!-- Arrow 2→3 -->
  <line x1="410" y1="334" x2="410" y2="364" stroke="#94A3B8" stroke-width="2" marker-end="url(#arrowDown)" stroke-dasharray="4,3"/>
  <text x="430" y="354" font-family="-apple-system, sans-serif" font-size="10" fill="#94A3B8">HTTPS</text>

  <!-- ── LAYER 3: External CDN Services ── -->
  <rect x="40" y="368" width="740" height="40" rx="12" fill="url(#layer3)" filter="url(#arch-shadow)"/>
  <rect x="40" y="368" width="740" height="40" rx="12" fill="none" stroke="#10B981" stroke-width="1.5"/>
  <text x="80" y="392" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#065F46">🌍  EXTERNAL CDN</text>
  <text x="240" y="392" font-family="-apple-system, sans-serif" font-size="10" fill="#047857">Tailwind CSS (cdn.tailwindcss.com)</text>
  <text x="490" y="392" font-family="-apple-system, sans-serif" font-size="10" fill="#047857">MapLibre GL JS (unpkg.com/maplibre-gl@3.6.2)</text>
</svg>

</div>

SideQuest is a **client-side SPA** with no build step. The entire application runs in the browser; Firebase provides authentication and a real-time NoSQL database; all libraries are loaded from CDN.

---

## 🔄 Data Flow

<div align="center">

<!-- ═══════════════════════════════════════════════════════════
     DATA FLOW  —  Escrow lifecycle diagram
     ═══════════════════════════════════════════════════════════ -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 200" width="820" height="200" role="img" aria-label="SideQuest escrow task lifecycle data flow: Post Task, Lock Escrow, Claim, Mark Done, Rate and Pay">
  <defs>
    <linearGradient id="df-bg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#EFF6FF"/>
    </linearGradient>
    <filter id="df-shadow">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#00000015"/>
    </filter>
    <marker id="df-arrow" markerWidth="9" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 9 3, 0 6" fill="#64748B"/>
    </marker>
  </defs>

  <rect width="820" height="200" fill="url(#df-bg)" rx="16"/>
  <text x="410" y="28" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="14" font-weight="600" fill="#64748B" letter-spacing="2">ESCROW LIFECYCLE  —  TASK DATA FLOW</text>

  <!-- Step boxes -->
  <!-- Step 1: Post Task -->
  <rect x="30"  y="50" width="118" height="80" rx="10" fill="#F59E0B" filter="url(#df-shadow)"/>
  <text x="89"  y="80"  text-anchor="middle" font-family="sans-serif" font-size="20">📝</text>
  <text x="89"  y="97"  text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="white">POST TASK</text>
  <text x="89"  y="112" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#FEF3C7">status: open</text>

  <!-- Arrow 1→2 -->
  <line x1="149" y1="90" x2="175" y2="90" stroke="#64748B" stroke-width="2" marker-end="url(#df-arrow)"/>

  <!-- Step 2: Escrow -->
  <rect x="177" y="50" width="118" height="80" rx="10" fill="#D97706" filter="url(#df-shadow)"/>
  <text x="236" y="80"  text-anchor="middle" font-family="sans-serif" font-size="20">🔒</text>
  <text x="236" y="97"  text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="white">LOCK ESCROW</text>
  <text x="236" y="112" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#FEF3C7">₹ deducted</text>

  <!-- Arrow 2→3 -->
  <line x1="296" y1="90" x2="322" y2="90" stroke="#64748B" stroke-width="2" marker-end="url(#df-arrow)"/>

  <!-- Step 3: Claim -->
  <rect x="324" y="50" width="118" height="80" rx="10" fill="#2563EB" filter="url(#df-shadow)"/>
  <text x="383" y="80"  text-anchor="middle" font-family="sans-serif" font-size="20">🙋</text>
  <text x="383" y="97"  text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="white">CLAIM</text>
  <text x="383" y="112" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#BFDBFE">in-progress</text>

  <!-- Arrow 3→4 -->
  <line x1="443" y1="90" x2="469" y2="90" stroke="#64748B" stroke-width="2" marker-end="url(#df-arrow)"/>

  <!-- Step 4: Mark Done -->
  <rect x="471" y="50" width="118" height="80" rx="10" fill="#1D4ED8" filter="url(#df-shadow)"/>
  <text x="530" y="80"  text-anchor="middle" font-family="sans-serif" font-size="20">✅</text>
  <text x="530" y="97"  text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="white">MARK DONE</text>
  <text x="530" y="112" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#BFDBFE">pending confirm</text>

  <!-- Arrow 4→5 -->
  <line x1="590" y1="90" x2="616" y2="90" stroke="#64748B" stroke-width="2" marker-end="url(#df-arrow)"/>

  <!-- Step 5: Rate & Pay -->
  <rect x="618" y="50" width="166" height="80" rx="10" fill="#10B981" filter="url(#df-shadow)"/>
  <text x="701" y="80"  text-anchor="middle" font-family="sans-serif" font-size="20">⭐💰</text>
  <text x="701" y="97"  text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="white">RATE &amp; PAY</text>
  <text x="701" y="112" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" fill="#D1FAE5">₹ released atomically</text>

  <!-- Footer note -->
  <text x="410" y="168" text-anchor="middle"
    font-family="-apple-system, sans-serif" font-size="11" fill="#64748B">
    All wallet mutations use Firestore atomic transactions — no double-spend possible
  </text>
  <text x="410" y="185" text-anchor="middle"
    font-family="-apple-system, sans-serif" font-size="11" fill="#94A3B8">
    Task deleted → escrow automatically refunded  |  Auto-cleanup removes open tasks after 24 h
  </text>
</svg>

</div>

### Component Responsibilities

| Module | Role | Key Exports |
|---|---|---|
| `firebase-config.js` | SDK init | `auth`, `db` |
| `app.js` | Orchestrator, auth state routing | `init()` |
| `auth.js` | Sign-in / sign-up / logout | `logout()` |
| `map.js` | MapLibre rendering, geolocation, markers | `initMap()`, `flyToUserLocation()` |
| `tasks.js` | Task CRUD, escrow, filter, profile, ratings | `listenForTasks()`, `listenToUser()` |
| `ui.js` | Toast notifications, confirm dialogs | `showToast()`, `showConfirm()` |

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Markup | HTML5 | — | App shell & all view templates |
| Styling | Tailwind CSS | CDN latest | Utility-first responsive design |
| Scripting | Vanilla JavaScript ES Modules | ES2020+ | Zero-dependency application logic |
| Map | MapLibre GL JS | 3.6.2 | Vector/raster tile rendering, markers |
| Auth | Firebase Authentication | 10.7.1 | Email/password auth, JWT tokens |
| Database | Cloud Firestore | 10.7.1 | Real-time NoSQL, atomic transactions |
| Hosting | Any static host | — | No custom server required |

> **Zero build step.** No npm, no webpack, no bundler. Clone → configure → serve.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ **Live Map** | OpenStreetMap tiles via MapLibre GL JS; colour-coded task pins |
| 📍 **Geolocation** | Auto-centre on user location; live `watchPosition` tracking |
| 📝 **Post Tasks** | Title, category (Help / Delivery / Social / Other), description, optional ₹ reward |
| 💰 **Escrow Wallet** | Reward locked atomically on post; refunded on delete; paid on completion |
| 🔍 **Filter & Search** | Category chip filter; full-text search across title and description |
| 👤 **Profiles** | Editable display name; wallet balance; tasks posted / completed / avg rating |
| ⭐ **Ratings** | 1–5 star rating on task completion; running average updated per user |
| 🧹 **Auto-Cleanup** | `open` tasks older than 24 h are automatically deleted |
| 📱 **Mobile-First** | Safe-area insets, `svh` viewport units, bottom-sheet modals |
| 💬 **Toasts** | Non-blocking `showToast()` notifications for all async operations |
| 🔐 **Auth-Gated Rules** | Firestore security rules enforce ownership on every read/write |

---

## 📂 Project Structure

```
SideQuest/
├── index.html              # App shell — all views rendered here
├── firestore.rules         # Firestore security rules (auth-gated ownership)
├── FUNCTION_SPEC.md        # Implementation checklist
├── LICENSE                 # MIT License
│
├── styles/
│   ├── main.css            # Custom animations, task markers, glass utilities
│   └── tailwind.css        # Tailwind reference / purge output
│
├── js/
│   ├── firebase-config.js  # Firebase initialisation & exports (auth, db)
│   ├── auth.js             # Sign-in, sign-up, logout handlers
│   ├── app.js              # Entry point — auth state → view routing
│   ├── map.js              # MapLibre map, geolocation, marker helpers
│   ├── tasks.js            # Task CRUD, filters, escrow, profile, ratings
│   └── ui.js               # showToast() and showConfirm() utilities
│
└── wiki/                   # Extended documentation (GitHub Wiki source)
    ├── Home.md
    ├── Architecture.md
    ├── Installation.md
    ├── Usage.md
    ├── Privacy.md
    ├── Contributing.md
    ├── Troubleshooting.md
    └── Roadmap.md
```

---

## 🚀 Setup & Installation

### Prerequisites

| Requirement | Minimum version | Notes |
|---|---|---|
| Browser | Chrome 90+, Firefox 90+, Safari 15+ | Must support ES Modules |
| Firebase project | Any | Auth (Email/Password) + Firestore enabled |
| Local HTTP server | Any | Required — `file://` origins block ES modules |

### 1 — Clone the Repository

```bash
git clone https://github.com/Kaelith69/SideQuest.git
cd SideQuest
```

### 2 — Create & Configure Your Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com/) → **Add project**.
2. Enable **Authentication** → Sign-in method → **Email/Password**.
3. Enable **Firestore Database** → Start in **production mode**.
4. Go to **Project Settings → General → Your apps → Web app** → copy the config object.

Open `js/firebase-config.js` and paste your credentials:

```javascript
// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey:            "YOUR_API_KEY",
    authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
    projectId:         "YOUR_PROJECT_ID",
    storageBucket:     "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId:             "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
```

> ⚠️ **Never commit real credentials to a public repository.**  
> Add `js/firebase-config.js` to `.gitignore` if your config contains live keys.

### 3 — Deploy Firestore Security Rules

```bash
# Install the Firebase CLI (requires Node.js)
npm install -g firebase-tools

firebase login
firebase use --add          # Select your project
firebase deploy --only firestore:rules
```

Alternatively, copy `firestore.rules` into the Firebase Console → **Firestore → Rules** editor and click **Publish**.

### 4 — Start a Local Server

```bash
# Python (no install required)
python -m http.server 8000

# Node.js
npx http-server . -p 8000

# VS Code  →  Install "Live Server" extension  →  "Go Live"
```

### 5 — Open the App

Navigate to `http://localhost:8000`.  
Sign up for an account — every new user receives a **₹500 demo wallet** to start posting tasks immediately.

---

## 💡 Usage Guide

### Posting a Task

```
1. Sign in  →  tap the ＋ FAB on the map
2. Enter: title, category, optional ₹ reward, description
3. Tap "Post Task"  →  reward is immediately escrowed from your wallet
```

### Claiming & Completing a Task

```
1. Tap any task marker on the map
2. Review details  →  tap "I'll do it!"
3. Complete the work  →  tap "Mark as Done"
4. Poster rates your work (1–5 ★)  →  reward credited to your wallet
```

### Searching & Filtering

```
Search bar       →  full-text match on title & description
Category chips   →  filter by  All | Help | Delivery | Social
```

### Managing Your Profile

```
Profile tab  →  view wallet balance, stats, avg rating
Edit icon    →  update your display name
Log Out      →  sign out of the app
```

---

## 📊 Performance

<div align="center">

<!-- ═══════════════════════════════════════════════════════════
     PERFORMANCE STATS PANEL  —  Developer Tool palette
     ═══════════════════════════════════════════════════════════ -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 180" width="820" height="180" role="img" aria-label="SideQuest performance statistics: sub-100ms real-time updates, zero custom backend, 100% serverless, 24-hour auto-cleanup">
  <defs>
    <linearGradient id="perf-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#EFF6FF"/>
    </linearGradient>
    <filter id="perf-card">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#00000012"/>
    </filter>
  </defs>

  <rect width="820" height="180" fill="url(#perf-bg)" rx="16"/>
  <text x="410" y="28" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="14" font-weight="600" fill="#64748B" letter-spacing="2">PERFORMANCE CHARACTERISTICS</text>

  <!-- Card 1: Real-time -->
  <rect x="30"  y="44" width="176" height="118" rx="12" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" filter="url(#perf-card)"/>
  <text x="118" y="80"  text-anchor="middle" font-family="sans-serif" font-size="28">⚡</text>
  <text x="118" y="104" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="26" font-weight="800" fill="#92400E">&lt;100ms</text>
  <text x="118" y="122" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="11" fill="#78350F">Real-time updates</text>
  <text x="118" y="138" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" fill="#B45309">Firestore onSnapshot</text>
  <text x="118" y="153" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" fill="#B45309">WebSocket transport</text>

  <!-- Card 2: Zero Backend -->
  <rect x="218" y="44" width="176" height="118" rx="12" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.5" filter="url(#perf-card)"/>
  <text x="306" y="80"  text-anchor="middle" font-family="sans-serif" font-size="28">🚫</text>
  <text x="306" y="104" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="26" font-weight="800" fill="#1E40AF">Zero</text>
  <text x="306" y="120" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#1D4ED8">Custom Backend</text>
  <text x="306" y="138" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" fill="#3B82F6">No server to manage</text>
  <text x="306" y="153" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" fill="#3B82F6">or scale</text>

  <!-- Card 3: Serverless -->
  <rect x="406" y="44" width="176" height="118" rx="12" fill="#D1FAE5" stroke="#10B981" stroke-width="1.5" filter="url(#perf-card)"/>
  <text x="494" y="80"  text-anchor="middle" font-family="sans-serif" font-size="28">☁️</text>
  <text x="494" y="104" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="26" font-weight="800" fill="#065F46">100%</text>
  <text x="494" y="120" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#047857">Serverless</text>
  <text x="494" y="138" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" fill="#059669">Firebase free tier</text>
  <text x="494" y="153" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" fill="#059669">scales automatically</text>

  <!-- Card 4: Auto-cleanup -->
  <rect x="594" y="44" width="196" height="118" rx="12" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1.5" filter="url(#perf-card)"/>
  <text x="692" y="80"  text-anchor="middle" font-family="sans-serif" font-size="28">🧹</text>
  <text x="692" y="104" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="26" font-weight="800" fill="#4C1D95">24 h</text>
  <text x="692" y="120" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#6D28D9">Auto-cleanup</text>
  <text x="692" y="138" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" fill="#7C3AED">Stale tasks removed</text>
  <text x="692" y="153" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" fill="#7C3AED">on snapshot callback</text>
</svg>

</div>

---

## 🎨 Design Principles

1. **Zero Build Step** — The app runs directly in any modern browser. No compilation, no bundler, no `node_modules` directory. This keeps the onboarding time under two minutes.

2. **Real-time First** — Every data mutation (task post, claim, completion) is immediately reflected to all connected clients via Firestore `onSnapshot` listeners.

3. **Mobile-First Responsive** — Layout uses `svh` viewport units and `env(safe-area-inset-*)` to handle notches and navigation bars on iOS and Android natively.

4. **Atomic Financial Operations** — Every wallet mutation runs inside a Firestore transaction. A task post that fails mid-way will never leave the wallet debited without a task record, and vice versa.

5. **Minimal Permissions Surface** — Firestore rules follow the principle of least privilege: authenticated users can only write their own user document, only create tasks with their own UID, and only update tasks they own or have claimed.

6. **Self-Contained Modules** — Each `.js` file has a single clearly defined responsibility. `tasks.js` handles data; `map.js` handles rendering; `ui.js` handles shared user-facing feedback. No circular dependencies.

7. **Progressive Disclosure** — The UI shows only what is relevant at each step. Poster controls (Delete) and assignee controls (Claim / Mark Done) appear contextually based on the authenticated user's relationship to the task.

---

## ♿ Accessibility

| Consideration | Implementation |
|---|---|
| **Semantic HTML** | Form labels, `<button>` elements, appropriate `type` attributes |
| **ARIA labels** | SVG graphics carry `role="img"` and `aria-label` attributes |
| **Colour contrast** | Primary blue `#007AFF` on white meets WCAG AA at normal text sizes |
| **Keyboard navigation** | All interactive elements are focusable; modals trap focus |
| **Touch targets** | All tap targets ≥ 44 × 44 px per Apple HIG / WCAG 2.5.5 |
| **Viewport safe areas** | `env(safe-area-inset-*)` prevents content from hiding behind device chrome |
| **Reduced motion** | Splash-screen fade uses CSS `transition-opacity`; can be disabled via `prefers-reduced-motion` |
| **Screen readers** | Toast notifications use `textContent` (not `innerHTML`) to prevent XSS and ensure text-only output |

---

## 🔒 Security & Privacy

### Security Controls

| Concern | Mitigation |
|---|---|
| **Unauthorised Firestore access** | Rules require `request.auth != null` on every read and write |
| **Ownership enforcement** | Task create requires `poster.id == request.auth.uid`; update requires poster or assignee UID |
| **Wallet double-spend** | All balance changes use `runTransaction()` — no non-atomic `updateDoc()` on wallet fields |
| **XSS** | UI text inserted via `textContent` / typed DOM properties only; no raw `innerHTML` with user data |
| **Credential exposure** | `firebase-config.js` should be `.gitignore`d when using live keys |
| **Stale data** | Open tasks auto-deleted after 24 h; no stale references persist |

### Privacy Model

- **Data collected:** email address, display name, task content, geolocation (coarse — map centre only), wallet balance.
- **Data stored:** Firebase Auth (email, hashed password) and Cloud Firestore (user profile, tasks).
- **Data shared:** task title, description, and poster name are visible to all authenticated users. Location coordinates are stored per task but only the map pin position is exposed.
- **Data deletion:** deleting a task removes the Firestore document and refunds the escrow. User account deletion is not currently implemented in the UI (use Firebase Console).

> See [wiki/Privacy.md](wiki/Privacy.md) for the complete privacy model.

---

## 🗺️ Roadmap

| Priority | Feature | Status |
|---|---|---|
| 🔴 High | Push notifications for task status updates | Planned |
| 🔴 High | In-app chat between poster and assignee | Planned |
| 🟡 Medium | Image attachments on task posts (Firebase Storage) | Planned |
| 🟡 Medium | Payment gateway (Razorpay / Stripe) | Research |
| 🟢 Low | PWA offline support (Service Worker) | Planned |
| 🟢 Low | Dark mode | Planned |
| 🟢 Low | Geohash-based proximity queries | Planned |

See [wiki/Roadmap.md](wiki/Roadmap.md) for the full roadmap.

---

## 🤝 Contributing

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with a conventional message: `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request against `main`

Please read [wiki/Contributing.md](wiki/Contributing.md) for coding conventions, branch naming, and review guidelines.

---

<div align="center">

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for the full legal text.

```
Copyright (c) 2026 Kaelith69
```

Free to use, modify, distribute. Attribution appreciated but not required.

---

*Made with 💻 and ☕ by [Kaelith69](https://github.com/Kaelith69)*

</div>

