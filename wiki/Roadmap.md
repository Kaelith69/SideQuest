# Roadmap

SideQuest development roadmap — planned features, version goals, and the long-term vision.

---

## 📍 Current Status — v1.0.0 (MVP)

**Released features:**

- ✅ Email/password authentication with demo wallet (₹500 on signup)
- ✅ Interactive map with real-time task markers (MapLibre GL JS)
- ✅ Task creation with optional ₹ reward and escrow
- ✅ Task claiming, completion, and confirmation flow
- ✅ 1–5 star rating system with running average
- ✅ Category filter chips (Help / Delivery / Social / Other)
- ✅ Full-text search on task title and description
- ✅ User profiles with wallet balance and stats
- ✅ Mobile-first responsive design with safe-area insets
- ✅ Firestore security rules (auth-gated, ownership-enforced)
- ✅ 24-hour auto-cleanup of stale open tasks

**Known limitations in v1.0.0:**

- No direct messaging between poster and assignee
- No push notifications
- No image uploads
- No real payment gateway (demo ₹ only)
- Tasks cannot be edited after posting
- No user identity verification
- No marker clustering for dense areas

---

## 🚀 v2.0 — Communication & Media

**Target:** Next major release

### High Priority

| Feature | Description | Technical approach |
|---|---|---|
| 💬 **In-app chat** | Real-time messaging between poster and assignee for a task | Firestore `/chats/{taskId}/messages` subcollection + `onSnapshot` |
| 🔔 **Push notifications** | Browser push for task claimed, task done, rating received | Firebase Cloud Messaging (FCM) + Service Worker |
| 📷 **Photo attachments** | Up to 3 images per task post | Firebase Storage + compressed upload before `addDoc` |
| ✏️ **Task editing** | Allow poster to edit title/description before it is claimed | `updateDoc` behind an ownership check; UI edit button |

### Medium Priority

| Feature | Description |
|---|---|
| 🔍 **Advanced search** | Distance-based filter (e.g. "within 2 km"), price range, sort by newest / closest / reward |
| 📋 **Task templates** | Pre-filled common task templates (dog walk, grocery run, furniture move) |
| 🧾 **Task history** | View completed tasks with timestamps, amounts, and ratings |

---

## 🎨 v2.1 — Trust & Safety

| Feature | Description | Technical approach |
|---|---|---|
| 📱 **Phone verification** | OTP-verified phone number linked to account | Firebase Phone Auth |
| 🛡️ **Report & block** | Flag inappropriate tasks or users | Firestore `/reports` collection + admin review |
| ⭐ **Detailed reviews** | Written review text alongside star rating | Add `reviewText` field to task completion transaction |
| 🔒 **Email verification** | Require email confirmation before first task post | `sendEmailVerification()` on signup + check before post |

---

## 🌐 v3.0 — Payments & Scale

| Feature | Description |
|---|---|
| 💳 **Real payment gateway** | Top-up wallet via Razorpay / Stripe; withdraw earnings to bank | Cloud Functions for payment processing; PCI-compliant flow |
| 📍 **Geo-query optimisation** | Only load tasks within a configurable radius using geohashes | `geofire-common` library + compound Firestore index |
| 🔄 **Pagination** | Load tasks in batches of 20 instead of all at once | Firestore cursor-based pagination with `startAfter()` |
| 📊 **Analytics dashboard** | Task completion rates, DAU, geographic heatmap | Firebase Analytics + BigQuery export |

---

## 📱 v4.0 — Native Mobile

| Feature | Description |
|---|---|
| 🍎 **iOS app** | Native iOS app via React Native or Flutter | App Store distribution |
| 🤖 **Android app** | Native Android app | Google Play distribution |
| 🔕 **Offline support** | Cache tasks and map tiles for offline browsing | Service Worker + IndexedDB |
| 🔔 **Native push** | OS-level push notifications | FCM APNs/FCM Android |

---

## 🤖 Long-term Vision (2026+)

| Idea | Status |
|---|---|
| AI-powered price suggestions | Research |
| Auto-categorisation of tasks via NLP | Research |
| Group/community tasks (block clean-up, etc.) | Conceptual |
| Business accounts with bulk posting and analytics | Conceptual |
| Insurance / damage protection for high-value tasks | Conceptual |
| White-label solution for housing societies | Conceptual |
| API for third-party integrations | Conceptual |

---

## 🔧 Ongoing Technical Improvements

### Performance
- [ ] Marker clustering (`maplibre-gl-cluster` or custom) for dense areas
- [ ] Viewport-culled task queries (only load tasks in visible map bounds)
- [ ] Self-hosted map tiles to remove external dependency

### Security
- [ ] Firebase App Check to prevent unauthorised API usage
- [ ] Rate limiting via Cloud Functions
- [ ] Regular Firestore rules audit

### Developer Experience
- [ ] Firebase Emulator configuration committed to repo for local testing
- [ ] Automated E2E test suite (Playwright)
- [ ] CI/CD pipeline for Firebase Hosting deployments

### Accessibility
- [ ] Full keyboard navigation support for all modals
- [ ] ARIA live regions for toast notifications
- [ ] High-contrast mode support
- [ ] `prefers-reduced-motion` CSS media query for all animations

---

## 📅 How Releases Work

- **Patch releases** (x.x.N): Bug fixes and small improvements — as needed
- **Minor releases** (x.N.0): New features within the current scope — roughly quarterly
- **Major releases** (N.0.0): Significant architectural changes or breaking API changes — as warranted

This roadmap is a **living document** and subject to change based on community feedback, technical feasibility, and available resources. No timelines are guaranteed.

---

## 💬 Influence the Roadmap

- 👍 Upvote features on [existing issues](https://github.com/Kaelith69/SideQuest/issues)
- 💡 Open a [feature request](https://github.com/Kaelith69/SideQuest/issues/new) with the `enhancement` label
- 🔀 Submit a PR — merged contributions accelerate roadmap items
- 📣 Share your use cases and pain points in [Discussions](https://github.com/Kaelith69/SideQuest/discussions)

---

[← Home](Home.md) | [Troubleshooting →](Troubleshooting.md)

---

