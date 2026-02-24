<div align="center">

<!-- Wiki Home Banner -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 140" width="760" height="140" role="img" aria-label="SideQuest Wiki — Hyper-local task marketplace documentation">
  <defs>
    <linearGradient id="wh-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070D24"/>
      <stop offset="100%" stop-color="#1A2255"/>
    </linearGradient>
    <linearGradient id="wh-title" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <filter id="wh-glow">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="760" height="140" fill="url(#wh-bg)" rx="14"/>
  <g stroke="#ffffff05" stroke-width="1">
    <line x1="0" y1="35" x2="760" y2="35"/><line x1="0" y1="70" x2="760" y2="70"/>
    <line x1="0" y1="105" x2="760" y2="105"/>
    <line x1="190" y1="0" x2="190" y2="140"/><line x1="380" y1="0" x2="380" y2="140"/>
    <line x1="570" y1="0" x2="570" y2="140"/>
  </g>
  <circle cx="700" cy="70" r="50" fill="#F59E0B" opacity="0.04"/>
  <text x="50" y="64"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="42" font-weight="800" fill="url(#wh-title)" filter="url(#wh-glow)">SideQuest Wiki</text>
  <text x="52" y="90"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="15" fill="#94A3B8">Complete developer and user documentation for the hyper-local task marketplace</text>
  <rect x="52" y="106" width="66" height="22" rx="11" fill="#F59E0B"/>
  <text x="85" y="121" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#0F1A40">v 1.0.0</text>
  <rect x="128" y="106" width="64" height="22" rx="11" fill="#ffffff0D"/>
  <text x="160" y="121" text-anchor="middle" font-family="monospace" font-size="11" fill="#FCD34D">Firebase</text>
  <rect x="202" y="106" width="72" height="22" rx="11" fill="#ffffff0D"/>
  <text x="238" y="121" text-anchor="middle" font-family="monospace" font-size="11" fill="#93C5FD">MapLibre GL</text>
</svg>

[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)](../LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-F59E0B?style=flat-square)](https://github.com/Kaelith69/SideQuest/releases)
[![Status](https://img.shields.io/badge/Status-Active-2563EB?style=flat-square)](https://github.com/Kaelith69/SideQuest)

</div>

---

# Welcome to SideQuest

**SideQuest** is a hyper-local, real-time task marketplace that connects neighbours. Post small tasks with a ₹ reward; earn money by completing your neighbours' quests — all tracked on a live map.

> *"You have money but no time. Your neighbour has time but needs money. SideQuest: now kith."* 🤝

---

## ✨ What It Does

| Pillar | Description |
|---|---|
| 🗺️ **Live Map** | OpenStreetMap tiles rendered via MapLibre GL JS; colour-coded task pins at real-world locations |
| 💰 **Escrow Wallet** | Reward locked atomically when a task is posted; released to the assignee on confirmed completion |
| ⭐ **Reputation** | 1–5 star ratings per task; running average on every user profile |
| 🔍 **Discovery** | Full-text search + category chips (Help / Delivery / Social / Other) |
| 📱 **Mobile-First** | Safe-area insets, `svh` viewport units, bottom-sheet modals on touch devices |

---

## 🗂️ Wiki Structure

### Getting Started

| Page | Description |
|---|---|
| **[Installation](Installation.md)** | Clone, configure Firebase, deploy rules, serve locally |
| **[Usage](Usage.md)** | Post tasks, claim tasks, search, filter, manage your profile |

### Technical Reference

| Page | Description |
|---|---|
| **[Architecture](Architecture.md)** | System design, component responsibilities, data flow, module internals |
| **[Privacy](Privacy.md)** | Data collected, storage, retention, security rules, user rights |

### Community

| Page | Description |
|---|---|
| **[Contributing](Contributing.md)** | Branch naming, commit style, coding conventions, review process |
| **[Roadmap](Roadmap.md)** | Planned features, version goals, long-term vision |
| **[Troubleshooting](Troubleshooting.md)** | Diagnosis flowcharts, common errors, debugging tools |

---

## 🛠️ Tech Stack (Summary)

| Component | Technology | Version |
|---|---|---|
| Markup | HTML5 | — |
| Styling | Tailwind CSS | CDN latest |
| Scripting | Vanilla JavaScript ES Modules | ES2020+ |
| Map | MapLibre GL JS | 3.6.2 |
| Authentication | Firebase Auth | 10.7.1 |
| Database | Cloud Firestore | 10.7.1 |
| Hosting | Any static host | — |

> **Zero build step.** No npm, no webpack. Clone → configure → open in browser.

---

## 🚀 Quick Start (60 seconds)

```bash
# 1. Clone
git clone https://github.com/Kaelith69/SideQuest.git && cd SideQuest

# 2. Add your Firebase credentials to js/firebase-config.js

# 3. Deploy Firestore rules
firebase deploy --only firestore:rules

# 4. Serve
python -m http.server 8000

# 5. Open http://localhost:8000  →  sign up  →  get ₹500 demo wallet
```

---

## 🔗 Quick Links

- 🏠 [Main Repository](https://github.com/Kaelith69/SideQuest)
- 🐛 [Report an Issue](https://github.com/Kaelith69/SideQuest/issues/new)
- 📋 [View Roadmap](Roadmap.md)
- 🔒 [Security & Privacy](Privacy.md)
- 🤝 [Contribute](Contributing.md)

---

## 📄 License

MIT License — Copyright © 2026 [Kaelith69](https://github.com/Kaelith69). See [LICENSE](../LICENSE).

---

*Made with 💻 and ☕ by [Kaelith69](https://github.com/Kaelith69)*
