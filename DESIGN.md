# aifullfill.com - Design System & Aesthetics Blueprint (DESIGN.md)

> **Design Philosophy:** Human warmth meets high-precision developer aesthetics. Inspired by Lovable and Linear, grounded in the 60-30-10 auspicious identity of aifullfill.com. Designed to eliminate generic "AI slop" through intentional layout, solid typography, and tactile surface feedback.

---

## 1. Visual Theme & Atmosphere

- **Theme Mode:** Dark-first with high-contrast warm surfaces. 
- **Atmosphere:** Deep, focused, and professional. The canvas feels like a studio workspace for AI builders, rather than a promotional sales page.
- **Surface Elevation:** Depth is created via subtle border distinctions (`1px solid rgba(255,255,255,0.08)`) and multi-layer inset shadows, not heavy drop shadows or oversized colorful blur blobs.
- **Tactile Feedback:** Buttons and interactive cards have a distinct physical feel with top-edge specular highlights (`inset 0 1px 0 rgba(255,255,255,0.15)`).

---

## 2. Color Palette & Roles (The 60-30-10 Rule)

### 60% Canvas & Foundation (หมวดเดช - ลึกซึ้ง น่าเชื่อถือ)
- **Primary Canvas (`brand-slate`):** `#0F172A` (Tailwind `slate-900`) - Dark slate base that prevents eye strain.
- **Surface 1 (`brand-surface`):** `#1E293B` (Tailwind `slate-800`) - Primary card and modal background.
- **Surface 2 (`brand-surface-light`):** `#334155` (Tailwind `slate-700`) - Hover states and inner containers.
- **Off-White Canvas:** `#F8FAFC` (Tailwind `slate-50`) - Used for high-contrast light sections where applicable.

### 30% Growth & Structure (หมวดมนตรี - ส่งเสริมธาตุไม้และความงอกงาม)
- **Primary Emerald (`brand-emerald`):** `#10B981` (Tailwind `emerald-500`) - Accents for system stability, success indicators, verified badges, and interactive borders.
- **Emerald Dark (`brand-emerald-dark`):** `#059669` (Tailwind `emerald-600`) - Hover states on emerald actions.
- **Emerald Wash:** `rgba(16, 185, 129, 0.1)` - Badges and indicator backdrops.

### 10% Spark & Conversion (หมวดศรี - จุดประกายโชคลาภและการตัดสินใจ)
- **Sunset Orange (`brand-orange`):** `#F97316` (Tailwind `orange-500`) - Reserved **strictly** for Call to Action (CTA), pricing highlights, and the signature "i" dot spark.
- **Orange Hover (`brand-orange-hover`):** `#EA580C` (Tailwind `orange-600`) - Active/hover state for primary conversion buttons.
- **Orange Glow Accent:** `rgba(249, 115, 22, 0.2)` - Subtle highlight on primary interactive elements.

---

## 3. Typography Standards

- **Primary Font:** `Prompt` (Google Font with Thai & Latin support)
- **Mono Font:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas` for code snippets, API keys, and metrics.
- **Strict Anti-Slop Typography Rules:**
  1. **NO Gradient Text on Headings:** Never use `bg-clip-text text-transparent bg-gradient-to-r` on titles. Use solid, crisp `#FFFFFF` or `#0F172A` with strategic accent words in orange or emerald.
  2. **Tight Letter-Spacing:** Use `tracking-tight` on large headings (`text-4xl` and above) for modern punchiness.
  3. **High Contrast Subtitles:** Use `#94A3B8` (`slate-400`) instead of faint grays to ensure readability.

---

## 4. Components & Micro-interactions (Lovable Style)

### Buttons
- **Primary CTA (Orange):**
  `rounded-full bg-brand-orange text-white font-medium px-6 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_2px_rgba(0,0,0,0.2)] hover:bg-brand-orange-hover transition-all duration-150 active:scale-[0.98]`
- **Secondary Action (Ghost / Surface):**
  `rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 px-5 py-2.5 transition-all duration-150`
- **Pill Badge:**
  `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border`

### Cards & Bento Grid
- **Border Treatment:** `border border-slate-800/80 hover:border-slate-700 transition-colors`
- **Surface Fill:** `bg-slate-900/90 backdrop-blur-sm`
- **Corner Radius:** `rounded-2xl`
- **Focal Point:** One prominent double-width or full-height card per grid section to break monotony.

---

## 5. Pre-flight Quality Gate

Before marking any UI code complete:
1. Run `npx impeccable detect <file>` and verify zero anti-patterns.
2. Verify responsive scaling down to 360px mobile viewport.
3. Check color contrast ratios (WCAG AA compliant).
