# தமிழ் — Tamil Learning App
## Build-Ready PRD · POC Version
### Last updated: 4 October 2026 · Newbie focus, Sri Lankan Tamil first

---

## Newbie Focus Update (4 October 2026)

**This section overrides anything below that conflicts with it.** After the first build, the POC narrows to Newbies learning **Sri Lankan Tamil**. Everything else stays in the code, switched off or as a "coming soon".

### Decisions
| Decision | What it means in the app |
|---|---|
| Newbies only for now | `SHOW_STAGE_SELECTION = false` in `lib/config.ts`. Everyone starts as Newbie. Stage picker, placement check and the stage control on Stats are hidden, not deleted. |
| Sri Lankan Tamil first | All content and UI Tamil uses Sri Lankan forms. Indian Tamil appears in onboarding and settings as "Coming soon". |
| English first for Newbies | Every screen leads with English. Tamil is the accent, and always has a play button beside it. |
| Real voices over the phone voice | Recordings play first. The phone's Tamil voice (ta-LK, then ta-IN) is only a fallback. |
| No personal data collection in the POC | No age, gender or location asked. Use a post-test survey (Google Form or Tally) instead. Revisit with a backend, privacy notice and consent if needed later. |
| Avatar chosen, not generated | Pick one of 6 characters. It ages with XP level, so no personal data is needed. |
| Real film dialogue | Not in the app. Original lines stay. Any real lines need an IP solicitor's review before public launch. |

### Onboarding (replaces the flow in "Onboarding & Learner Stage")
1. **Welcome.** English headline, வணக்கம் with play button and meaning.
2. **Which Tamil?** Sri Lankan Tamil (selected) or Indian Tamil (coming soon, disabled).
3. **Pick your character.** 6 characters, with a strip showing how the chosen one grows from Level 1 to 5.
4. Straight to Home. Back buttons on steps 2 and 3.

### Packs: the Newbie learning path
Six short packs in order, built from `words.ts` categories (`data/packs.ts`):

| # | Pack | Words |
|---|---|---|
| 1 | Greetings வணக்கம் | 5 |
| 2 | Family குடும்பம் | 7 (adds அம்மம்மா) |
| 3 | Food சாப்பாடு | 6 |
| 4 | Feelings உணர்வுகள் | 5 |
| 5 | Nature இயற்கை | 5 |
| 6 | Time நேரம் | 3 |

**Route:** `/pack/[id]`, statically generated. Close button (top left) goes home at any point; XP and seen items are kept.

**Flow:** intro (name, blurb, word count) → one word per screen (Tamil large, romanisation, "Hear it", tap to reveal meaning, Next enabled after reveal; next word auto-plays) → 3-question check on that pack's words (VictoryOverlay on correct, warm inline nudge on wrong) → pack complete (confetti, drum fanfare, the words learned with play buttons, +40 XP once per pack, "Next: Family →").

**Completion rule:** finishing the pack completes it, whatever the check score. No punishment.

**Storage:** `tamil-packs-complete` (array of pack ids). Hook: `usePacks()` → `{ packs, done, complete, isComplete, nextPack, completedCount }`.

**XP:** new action `pack_completed: 40`, awarded once per pack via `addXPOnce`.

### Home (replaces "Page Specs → /")
1. **Hero:** avatar (taps through to Stats), "Welcome / Welcome back", வணக்கம் with play, level name in English with Tamil and play, XP total, bar with "N XP until {character} grows up to {next level}", three stat tiles (words heard, practised, packs done).
2. **Continue card:** next unfinished pack, big and vermillion. When all six are done it points to Challenge.
3. **Your path:** 6 pack tiles (done, current, upcoming). Any pack can be replayed.
4. **Cinema line of the day.**
5. **More to explore:** Learn, Challenge, Write as English-first rows.

### Navigation
- Every module page header has a **← Home** button. The PageHeader leads with the English title, then Tamil with a play button.
- Packs have a **close (×)** button.
- Bottom nav is English first with small Tamil underneath. "Progress" is renamed **Stats** (நிலை).

### Stats page (was Progress)
Character card (change character, growth strip LV1–5), XP bar, packs progress, seen/practised per module, settings (dialect shown, drum sounds on/off), reset. Reset clears XP, progress, packs, character, dialect and onboarding.

### Avatar
`data/avatars.ts`: Nila, Kavi, Malar, Arivu, Thendral, Veera. `components/ui/Avatar.tsx` draws them in SVG. Level 1 child · 2 school collar and book · 3 shoulder scarf · 4 speech bubble · 5 grey hair, glasses, jasmine garland. Frame goes bronze → silver → gold. Stored in `tamil-avatar`.

### Sound
- **Recordings:** `npm run audio:list` writes `audio/recording-list-lk.csv` (119 lines: words, phrases, dialogues, letters, examples, packs, levels and UI lines). Record each one, save it in `public/audio/lk/` under its filename (.mp3, .m4a or .wav). The build runs `scripts/audio-manifest.ts`, which matches files back to their Tamil text, so every play button showing that text uses the recording.
- **Drum hits:** synthesised in the browser (`lib/sfx.ts`), so there are no files to license. "ta-DHUM" on a correct answer, a short fanfare on pack complete. Can be switched off on Stats (`tamil-sfx`).

### Cinema line breakdown
Every dialogue card (Home line of the day, Learn → Dialogues) has a **"Break it down, word by word"** button. It opens the line as word chips in order, each showing Tamil, romanisation and meaning. Tapping a chip plays that word and outlines it. Opening the breakdown marks the line seen and gives +10 XP once per line (`meaning_revealed`, tag `dialogues:{id}`). Data: optional `breakdown: { tamil, roman, english }[]` on each `Dialogue`; the words are in the recording list (group `dword`). Glosses need native review.

### Sri Lankan Tamil content changes (need native review)
- Words: ஓம் (yes), இடியப்பம் (string hoppers), கோப்பி (coffee), அம்மம்மா (grandmother, new), notes on அண்ணா and இண்டைக்கு.
- Phrases rewritten in spoken Sri Lankan Tamil (விளங்கேல்லை, கதையுங்கோ, சுகமா இருக்கிறீங்களா?, இன்னொருக்கா, வேணும்).
- UI lines moved to `data/copy.ts` and switched to ‑ீங்க / ‑ுங்கோ forms. "Paati would be proud" is now "Ammamma would be proud".

### New localStorage keys
`tamil-packs-complete`, `tamil-avatar`, `tamil-dialect`, `tamil-sfx`.

### Next steps
1. AJ reviews all Tamil in `data/words.ts`, `data/phrases.ts`, `data/copy.ts` and `data/packs.ts`.
2. Record the Sri Lankan Tamil set from `audio/recording-list-lk.csv`.
3. Test with 5 Sri Lankan Tamil newbies; post-test survey for age, location and feedback.
4. Then: Indian Tamil content and voices, and word-by-word breakdown of the cinema line for Newbies.

---

## What This Is

A mobile-first Tamil learning web app for diaspora adults. No sign-up. No backend. No database. No streaks. No punishment for absence. Progress lives in localStorage. XP only goes up.

The aesthetic is retro Tamil cinema poster art — bold, warm, dramatic, unmistakably Tamil. Every correct answer feels cinematic. Every wrong answer feels like a kind older relative encouraging you to try again.

**The differentiator:** Original Tamil dialogue written in the energy of iconic Kollywood character archetypes. This is the heart of the product. Nothing else on the market does this.

**The promise:** "Learning Tamil, the way it was always meant to be shared."

---

## POC Goal

Prove that a user can open the app, feel emotionally connected to Tamil, learn a few letters/words/phrases, complete a short challenge, earn XP, and want to return tomorrow.

**Success criteria — after 10 Tamil diaspora testers:**
- ≥60% recall 3+ Tamil words unprompted 24 hours later
- ≥50% return within 7 days without any prompt
- ≥30% share or recommend the app unprompted
- 0 content errors flagged by native-speaking testers

---

## Target User

**Primary:** British Tamil diaspora adults, 18–35. Grew up hearing Tamil, can't read the script, feel disconnected from their heritage. Not language learners by habit — culturally motivated.

**Secondary A:** Non-Tamil partners/friends learning for family. Need 5 words and one phrase they can use confidently.

**Secondary B:** Heritage speakers who can converse but can't read the script. Want to text in Tamil, not transliteration.

**Not the primary target:** Complete beginners with zero Tamil exposure. Serve them eventually — not the validation focus.

---

## Product Principles

- Mobile-first web app (390px primary target)
- No sign-up, no backend, no database
- localStorage only for all state
- XP only goes up — never resets, never decreases
- No streaks, no punishment for absence
- Distinguish "seen" from "practised" — never conflate them
- Tamil script must render correctly on all devices
- Correct answers feel cinematic — full screen moment
- Wrong answers feel warm — inline encouragement only
- Romanisation always visible in POC (one exception: the Advanced placement check, see Onboarding)
- Speech recognition not in POC
- First open asks one question: Newbie, Intermediate or Advanced. The answer only changes where we *suggest* starting. Nothing is ever locked.

---

## Routes

```
/              Home — shows OnboardingFlow on first open, then Dialogue of the Day, XP bar, level title, "Start here" card, module cards
/learn         Learn — letters, words, phrases, dialogue cards (accepts ?tab=letters|words|phrases|dialogues)
/challenge     Challenge — 5-question multiple choice quiz
/write         Write — simple Tamil vowel spelling/tracing practice
/progress      Progress — XP, level, seen/practised counts, reset button
```

---

## Design System

### Colour Palette
```css
--vermillion:    #C1272D;   /* Primary — CTAs, accents, correct flash */
--vermillion-dark: #9B1F23;
--turmeric:      #F5A623;   /* Gold — XP, level titles, highlights */
--navy:          #1A1F3C;   /* Dark — card backgrounds, header */
--navy-light:    #252B4A;
--cream:         #FAF3E0;   /* Page background — aged paper */
--cream-dark:    #EDE5CC;
--stone:         #8C7B6B;   /* Muted text, secondary labels */
--stone-light:   #B5A898;
--white:         #FDFAF4;   /* Card surfaces */
--success:       #2D6A3F;
--error-soft:    #E8A090;   /* Wrong answer highlight — warm, not harsh */
```

### Tamil Font Stack — Apply to Every Tamil Script Element
```css
--font-tamil: 'Tiro Tamil', 'Latha', 'Tamil MN', 'Noto Sans Tamil', serif;
```
- `Tiro Tamil` — Google Fonts primary
- `Latha` — Windows system Tamil fallback
- `Tamil MN` — macOS/iOS system Tamil fallback
- `Noto Sans Tamil` — Google Fonts secondary fallback
- `serif` — last resort

**Never use `'Tiro Tamil'` alone. Always use the full stack via `var(--font-tamil)`.**

### English Fonts
```css
--font-display: 'Bebas Neue', 'Impact', sans-serif;   /* Headers, labels, XP numbers */
--font-body:    'Lora', 'Georgia', serif;               /* Body, subtitles, italic copy */
```

### Texture
- Grain overlay: fixed, `z-index: 999`, `pointer-events: none`, `opacity: 0.045`
- Use SVG `feTurbulence` filter as background-image on `body::before`
- Drop shadows: `0 4px 20px rgba(26,31,60,0.14)` (card), `0 8px 32px rgba(26,31,60,0.22)` (heavy)

### Motion Rules — Non-Negotiable
- **Never animate Tamil script** letter-by-letter. It appears fully formed, always.
- **No bounce/spring easing.** Only `ease-out` or `ease-in-out`.
- **No looping animations** except `audioPulse`.
- All tappable elements: `transform: scale(0.97)` on `:active`, `transition: 80ms ease-out`
- Hover states wrapped in `@media (hover: hover)` — never fires on touch

### Named Keyframes

```css
/* Card entrance — staggered by index * 60ms */
@keyframes stampIn {
  from { opacity: 0; transform: scale(1.04); }
  to   { opacity: 1; transform: scale(1); }
}
/* duration: 180ms, ease-out, fill: forwards */

/* Page load */
@keyframes pageFade {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* duration: 160ms, ease-out */

/* Correct answer flash */
@keyframes victoryFlash {
  0%   { opacity: 0; }
  15%  { opacity: 1; }
  100% { opacity: 0; }
}
/* duration: 280ms, ease-out, one-shot */

/* Victory overlay entrance */
@keyframes victoryReveal {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}
/* duration: 220ms, ease-out */

/* XP counter float in */
@keyframes xpFloat {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Level up title stamp */
@keyframes levelUpStamp {
  0%   { opacity: 0; transform: scale(1.3); }
  60%  { opacity: 1; transform: scale(0.97); }
  100% { opacity: 1; transform: scale(1); }
}

/* Audio button pulse — one-shot, does not loop */
@keyframes audioPulse {
  0%   { box-shadow: 0 0 0 0 rgba(193,39,45,0.45); }
  100% { box-shadow: 0 0 0 14px rgba(193,39,45,0); }
}
/* duration: 600ms, iteration: 1 */
```

---

## Data Files

### `data/letters.ts` — 18 letters
12 vowels + 6 most common consonants. Each letter has:
```typescript
type Letter = {
  id: number
  tamil: string          // "அ"
  roman: string          // "a"
  type: 'vowel' | 'consonant'
  example: {
    tamil: string        // "அம்மா"
    roman: string        // "amma"
    english: string      // "mother"
  }
}
```

### `data/words.ts` — 30 words
5 categories: family (6), greetings (5), food (6), emotions (5), nature (5), time (3).
```typescript
type Word = {
  id: number
  tamil: string
  roman: string
  english: string
  category: 'family' | 'greetings' | 'food' | 'emotions' | 'nature' | 'time'
  notes?: string  // Cultural context, register notes
}
```

### `data/phrases.ts` — 10 phrases
4 situations: visiting family, expressing love, everyday conversations, watching a film.
```typescript
type Phrase = {
  id: number
  tamil: string
  roman: string
  english: string
  situation: string
  literal?: string  // Fun word-for-word translation
}
```

### `data/dialogues.ts` — 5 dialogues
Original Tamil lines. No real celebrity names in the product — archetype names only.
```typescript
type Dialogue = {
  id: number
  tamil: string
  roman: string
  english: string
  inspiration: string   // e.g. "The Everyman Hero — cool, philosophical, unstoppable"
  mood: 'swagger' | 'philosophical' | 'romantic' | 'political' | 'emotional' | 'defiant'
  notes?: string
}
```

**Mood colour map:**
```typescript
const MOOD_COLOURS = {
  swagger:       '#F5A623',
  philosophical: '#7B9ED9',
  romantic:      '#D98CA0',
  political:     '#6FBF7A',
  emotional:     '#B08BE8',
  defiant:       '#E88A4F',
}
```

### `data/levels.ts` — 5 levels
```typescript
type Level = {
  level: number
  tamil: string     // Script
  roman: string     // Romanisation
  english: string   // Meaning
  xpRequired: number
}
```

| Level | Tamil | Roman | English | XP |
|---|---|---|---|---|
| 1 | குழந்தை | Kuzhandhai | Child — just beginning | 0 |
| 2 | மாணவர் | Maanavar | Student — starting to learn | 200 |
| 3 | புரிந்தவர் | Purindavar | One who understands | 500 |
| 4 | பேசுவார் | Pesuvar | One who speaks | 1,000 |
| 5 | கற்றவர் | Katravar | One who has truly learned | 2,000 |

Export helpers: `getLevelFromXP(xp)`, `getNextLevel(xp)`, `getProgressToNextLevel(xp)`

### `data/stages.ts` — 3 learner stages
Not to be confused with XP levels above. See **Onboarding & Learner Stage** for the values.
```typescript
type StageInfo = {
  stage: LearnerStage
  tamil: string            // "இடைநிலை"
  roman: string            // "Idainilai"
  english: string          // "Intermediate"
  description: string      // Self-description on onboarding card
  homeSubline: string      // Home header line
  defaultLearnTab: 'letters' | 'words' | 'phrases' | 'dialogues'
  startHereCopy: string    // One line on the "Start here" card
}
```

### `data/placement.ts`
`PLACEMENT_SETS` for Intermediate and Advanced. Schema and composition in **Onboarding & Learner Stage**.

---

## Progress Model

localStorage key: `"tamil-progress"`

```typescript
type ModuleKey = 'letters' | 'words' | 'phrases' | 'dialogues'

type ProgressState = {
  seen: Record<ModuleKey, number[]>      // IDs seen at least once
  practised: Record<ModuleKey, number[]> // IDs correctly answered in quiz
}
```

**Rules:**
- `markSeen(module, id)` — called on first audio play or card reveal
- `markPractised(module, id)` — called on correct quiz answer only
- Practised also marks seen automatically
- Never use the word "learned" in the UI — only "seen" and "practised"
- `clearAll()` — resets both, used by progress reset flow

---

## XP Model

localStorage key: `"tamil-xp"`

```typescript
type XPState = {
  total: number           // Running total, never resets
  lastVisitDate: string   // ISO date YYYY-MM-DD for return visit detection
}
```

**XP values:**
| Action | XP |
|---|---|
| Hear a card (first time) | 5 |
| Reveal a meaning (first time) | 10 |
| Correct quiz answer | 25 |
| Complete a full challenge session | 50 |
| Complete writing practice | 15 |
| Return visit (new day) | 30 |

**Rules:**
- XP only goes up. Never decreases.
- Wrong answers award 0 XP — not negative XP.
- Return visit XP (30) awarded once per calendar day on app open.
- Level up triggers when `total` crosses a level threshold.

---

## XP + Level System

### Correct Answer — The Victory Moment

When a user gets a quiz answer correct, the app delivers a cinematic full-screen moment. This is the product's signature interaction.

**Sequence:**
1. Single frame vermillion flash fills viewport (280ms, `victoryFlash`)
2. Full-screen navy overlay appears (`victoryReveal`, 220ms)
3. Tamil text of the correct item stamps in large — turmeric colour
4. Praise line in Tamil + English (random from pool, see microcopy)
5. `+25 XP` counter floats up (`xpFloat`)
6. If level-up: level title stamps in (`levelUpStamp`) with English meaning
7. Auto-dismiss after 1.8s (3.5s if level-up). Tap anywhere to skip.

**Level-up extension:** Tamil level title in gold at 42px, Roman + English below in italic. This is the most dramatic moment in the app — feels like a film title card.

### Wrong Answer — Warm Inline Only

No flash. No overlay. Inline only:
- Correct answer highlights in `--turmeric`
- User's answer highlights in `--error-soft` (#E8A090) — warm, not aggressive
- One encouragement line (random from pool, see microcopy)
- "Try again →" button allows one re-attempt per question
- XP: 0 (no penalty)

---

## Onboarding & Learner Stage

### Why it exists
Our users don't arrive at zero. A heritage speaker who chats with their amma every week shouldn't start with "வணக்கம் = hello". A partner learning for a wedding shouldn't start with consonants. One question on first open fixes that.

### Naming: "stage", not "level"
The app already has **XP levels** (குழந்தை → கற்றவர்). To avoid confusing them, this feature is called **learner stage** everywhere: in code, in this doc, and in the UI ("Your stage"). The two never interact. Stage doesn't change XP, and XP never changes stage.

```typescript
type LearnerStage = 'newbie' | 'intermediate' | 'advanced'
```

| Stage | Tamil | Roman | Self-description shown to user |
|---|---|---|---|
| Newbie | தொடக்கம் | Thodakkam (beginning) | "I'm starting from scratch, or close to it." |
| Intermediate | இடைநிலை | Idainilai (middle stage) | "I understand and speak some, but I can't read the script." |
| Advanced | மேம்பட்டவர் | Membattavar (advanced) | "I speak comfortably and can read a little." |

*Tamil labels to be confirmed by native reviewer (pre-build checklist).*

### localStorage keys
```
"tamil-stage"                 → 'newbie' | 'intermediate' | 'advanced'   (default 'newbie' if missing)
"tamil-onboarding-complete"   → 'true'                                   (missing = show onboarding)
```

### Flow

Onboarding is a full-screen component rendered **by the home page** (not its own route) when `tamil-onboarding-complete` is missing. NavBar is hidden while it's showing. Users who deep-link straight to `/learn` or `/challenge` are never blocked. They get the Newbie default and see onboarding next time they land on `/`.

**Hydration guard:** home renders a plain navy screen until mounted, then decides between onboarding and home. This prevents a flash of the home page before onboarding appears.

```
Screen 1: Welcome
   ↓
Screen 2: Choose your stage ──── Newbie ──────────────→ done → Home
   ↓ Intermediate / Advanced
Screen 3: Quick check (5 questions)
   ↓
Screen 4: Result (confirm or soft suggestion) ─────────→ done → Home
```

**Screen 1: Welcome**
- Navy full-screen, Tamil watermark, வணக்கம் large in turmeric with AudioButton (plays it)
- "Learning Tamil, the way it was always meant to be shared."
- "Begin →" (vermillion button)
- Entrance: `pageFade`

**Screen 2: Choose your stage**
- Heading: "உங்களுக்கு எவ்வளவு தமிழ் தெரியும்?" / "How much Tamil do you have?"
- Three stacked tappable cards (cream on navy, `stampIn` staggered): Tamil label large, English label in Bebas Neue, self-description in Lora italic
- Tap a card: it gets a turmeric border, then "Continue →" activates
- Footer, small stone text: "You can change this anytime. Nothing is locked."
- "Skip" text link top-right: sets Newbie and finishes

**Screen 3: Quick check (Intermediate + Advanced only)**
- Intro line: "Quick check. 5 questions. No score, no pressure. It just helps us suggest where to start."
- "2 / 5" progress across top
- Each question has 4 options **plus a 5th "Not sure" button** (counts as incorrect; stops people guessing)
- On tap: correct option highlights turmeric, chosen wrong option highlights `--error-soft`. **No copy, no VictoryOverlay, no XP.** Auto-advance after 900ms.
- Correct answers call `markSeen` on that item. (Not `markPractised`. Practised means practised in the app.)

**Screen 4: Result**

| Chosen stage | Score | What we say | Buttons |
|---|---|---|---|
| Intermediate | 0–1 | "We'd suggest starting at Newbie, but it's your call." | "Start at Newbie" / "Keep Intermediate" |
| Intermediate | 2–4 | "நல்லது. Intermediate it is." | "Let's go →" |
| Intermediate | 5 | "5 out of 5. You might be Advanced." | "Switch to Advanced" / "Keep Intermediate" |
| Advanced | 0–1 | "We'd suggest starting at Newbie, but it's your call." | "Start at Newbie" / "Keep Advanced" |
| Advanced | 2 | "We'd suggest Intermediate, but it's your call." | "Start at Intermediate" / "Keep Advanced" |
| Advanced | 3–5 | "நல்லது. Advanced it is." | "Let's go →" |

The user's own choice is always one tap away. We never override it.

On finish: write `tamil-stage` and `tamil-onboarding-complete`, fade to home.

### Placement question sets — `data/placement.ts`

Fixed (not random), so every user at a stage gets the same check and we can compare results across testers.

```typescript
type PlacementSeed = {
  type: 'word' | 'letter'
  id: number            // ID in words.ts or letters.ts
  hideRoman?: boolean   // Advanced only: tests reading the script
}

export const PLACEMENT_SETS: Record<'intermediate' | 'advanced', PlacementSeed[]>
```

| Set | What it tests | Composition |
|---|---|---|
| **Intermediate** | Do you recognise everyday spoken Tamil? | 4 words (mid-difficulty: family / food / emotions, **not** the 5 cold-start words) + 1 vowel letter. Romanisation **shown**; audio auto-plays. |
| **Advanced** | Can you read the script? | 3 words + 2 letters (one vowel, one consonant). Romanisation **hidden** (`hideRoman: true`); audio does **not** auto-play. |

Final IDs to be picked once content is reviewed (pre-build checklist).

### What stage changes (all soft)

| Where | Newbie | Intermediate | Advanced |
|---|---|---|---|
| **Home header subline** | "Start with sounds. The script will follow." | "You already hear it. Let's teach your eyes." | "Sharpen what you have. The dialogue is where it lives." |
| **"Start here" card on Home** | Learn → Words | Learn → Letters | Learn → Dialogues |
| **Learn default tab** (when no `?tab=`) | Words | Letters | Dialogues |
| **Challenge pool** | Unchanged (cold-start words, letters only after ≥4 seen) | Unchanged | Letter questions allowed from the first session (skip the ≥4-seen rule) |

**Deliberately unchanged:** XP values, levels, Write, content order inside each tab, and what's visible. Every user can open every tab and card.

**"Start here" card:** single full-width row between Dialogue of the Day and the module grid. Turmeric left border, small label "இங்கே தொடங்கு · Start here", destination name + one line of copy, links to `/learn?tab=…`. Always shown in POC.

### Changing stage later
On `/progress`, a **"Your stage"** section with a three-option segmented control. Tap to switch. It takes effect immediately with no re-check. Copy underneath: "This only changes where we suggest you start. Everything stays open."

### Reset
Reset now also clears `tamil-stage` and `tamil-onboarding-complete`, so the user sees onboarding again after `router.push('/')`.

---

## Microcopy — Tone of Voice

**Voice:** Warm and familial. A kind older relative teaching you. Patient, never patronising. Uses "we" not "you". Sentences short.

**Rules:**
- Never say "complete" or "finish" → say "explore" and "discover"
- Never say "wrong" → say "not quite" or "almost"
- Never more than one exclamation mark per screen
- Always include Tamil script in headings alongside English

### Praise Lines (correct answers — rotate randomly)
```
"அது சரிதான்! That's exactly right."
"பாரு! Look at you go."
"நல்லா சொன்னே. Well said."
"சரியா சொன்னே! Perfect."
"ஆமா! Yes — you've got it."
"Paati would be proud."
"தெரியும் உனக்கு. You already knew that."
"அழகா சொன்னே. Beautifully said."
"சரி சரி! That's it!"
"இன்னும் கொஞ்சம் — keep going."
```

### Encouragement Lines (wrong answers — rotate randomly)
```
"கிட்டத்தட்ட. Almost — it was [answer]. Try once more."
"நெருங்கிட்டே. You're getting there."
"இந்த முறை இல்ல — but you'll get it next time."
"கேளு again — listen one more time."
"Don't worry — even appa forgot this one."
"இல்ல, ஆனா நெருங்கிட்டே. Not quite, but very close."
"Paati says try again 😌"
```

### Module Labels
```
Home:       "தமிழ் — Learning Tamil, the way it was always meant to be shared."
Learn:      "கற்க — Letters, words, and phrases. Start anywhere."
Challenge:  "தேர்வு — Let's see what's stayed with you."
Write:      "எழுது — Trace the vowels. Feel the shape of the language."
Progress:   "முன்னேற்றம் — Your journey so far."
```

### Quiz End Screen (by score)
```
5/5:   "பத்தில் பத்து! Perfect. Paati would be proud."
4/5:   "நல்லா இருக்கு. Really good — explore more and come back."
3/5:   "தொடர்ந்து படி. Keep going — every word you hear stays with you."
0–2/5: "ஆரம்பம்தான். Every expert was once a beginner. Explore more and try again."
```

### System Copy
```
Audio unavailable:  "Audio not available on this browser"
Audio aria-label:   "Listen to Tamil pronunciation"
Reset confirm:      "Start fresh? This clears all your progress, seen items and your stage."
Reset cancel:       "Not yet"
Reset confirm btn:  "Yes, reset everything"
Error heading:      "ஒரு நிமிடம்..."
Error body:         "Something went a little sideways. Give it a refresh and we'll be right back."
No streaks:         "No streaks. No pressure. Just Tamil."
```

---

## Components

### `components/ui/AudioButton.tsx`
Props: `text: string`, `onPlay?: () => void`, `size?: 'sm'|'md'|'lg'`, `variant?: 'vermillion'|'navy'|'ghost'`
- `aria-label="Listen to Tamil pronunciation"`
- Unavailable state: greyed out, cursor not-allowed, title tooltip
- `isSpeaking`: applies `audioPulse` animation (600ms, one-shot)
- Uses `useSpeech` hook

### `components/ui/XPBar.tsx`
- Reads from `useXP` hook
- Shows: Tamil level title (large, turmeric), Roman + English subtitle, XP total, progress bar, XP to next level
- Progress bar: `linear-gradient(90deg, --vermillion, --turmeric)`, `transition: width 600ms ease-out`

### `components/ui/VictoryOverlay.tsx`
Props: `visible`, `tamil`, `xpGained`, `isLevelUp?`, `levelName?`, `levelNameEnglish?`, `onDismiss`
- Phase sequence: `flash` → `reveal` → `levelup?` → `done`
- Auto-dismisses. Tap anywhere to skip.
- Praise line random from pool, stable per render

### `components/ui/NavBar.tsx`
- Fixed bottom, always visible including inside modules
- 5 tabs: Home (வீடு), Learn (கற்க), Challenge (தேர்வு), Write (எழுது), Progress (முன்னேற்றம்)
- Active: turmeric Tamil label, vermillion top border, slightly larger font
- Inactive: `rgba(255,255,255,0.4)`
- `padding-bottom: env(safe-area-inset-bottom)` for iOS
- Uses `usePathname()` for active state

### `components/cards/LetterCard.tsx`
Props: `letter: Letter`, `seen: boolean`, `onSeen: () => void`
- Front: Tamil character large, romanisation below
- Flip (tap): 3D CSS flip, `350ms ease-in-out`, `scale(0.97)` at 50%
- Back: example word in Tamil, romanisation, English meaning
- AudioButton triggers `onSeen` on first play
- Gold border when `seen`

### `components/cards/WordCard.tsx`
Props: `word: Word`, `seen: boolean`, `onSeen: () => void`
- Tamil word large, romanisation always visible
- Category badge (colour coded)
- "Reveal meaning →" tap shows English
- AudioButton triggers `onSeen` on first play
- Notes shown if present

### `components/cards/PhraseCard.tsx`
Props: `phrase: Phrase`, `seen: boolean`, `onSeen: () => void`
- Tamil phrase large, romanisation below
- Situation label badge
- "Reveal meaning →" tap
- Literal translation shown in italics if present (e.g. "have you eaten rice?")
- AudioButton triggers `onSeen`

### `components/cards/DialogueCard.tsx`
Props: `dialogue: Dialogue`, `seen: boolean`, `onSeen: () => void`
- Full-width, navy background
- Left border 4px in mood colour
- Tamil text large and centred
- Romanisation in muted cream
- English in Lora italic
- Mood badge top-right (colour from MOOD_COLOURS map)
- "In the spirit of →" attribution in small Bebas Neue at bottom
- AudioButton triggers `onSeen`

### `components/challenge/QuizQuestion.tsx`
Props: `question: QuizQuestion`, `onAnswer: (answer: string) => void`, `disabled: boolean`, `showNotSure?: boolean`
- Tamil prompt large (or audio auto-plays for hear→meaning type)
- Romanisation hidden when `question.hideRoman` is true (placement only)
- `showNotSure`: adds a 5th ghost-style "Not sure" button (placement only)
- 4 option buttons, navy border
- On answer: correct = turmeric highlight, incorrect = error-soft highlight
- Disabled after answer — no multi-tap
- Entrance: `questionWipe` animation

### `components/onboarding/OnboardingFlow.tsx`
Props: `onComplete: (stage: LearnerStage) => void`
- Internal state: `screen: 'welcome' | 'stage' | 'check' | 'result'`, `chosenStage`, `score`
- Renders full-screen (`position: fixed; inset: 0`), navy background, above NavBar
- Uses `useQuiz().buildFixedQuiz(PLACEMENT_SETS[stage])` for Screen 3, with no new quiz engine
- Calls `useLearnerStage().setStage()` + `completeOnboarding()` before `onComplete`
- Screen transitions: `pageFade` only
- See **Onboarding & Learner Stage** for screen-by-screen copy and result table

### `components/onboarding/StageCard.tsx`
Props: `stage: LearnerStage`, `selected: boolean`, `onSelect: () => void`
- Used on onboarding Screen 2. Progress page uses a compact segmented control instead.
- Tamil label (`var(--font-tamil)`, 22px), English label (Bebas Neue), self-description (Lora italic, 13px)
- Selected: 2px turmeric border. Unselected: 1px `rgba(255,255,255,0.15)`
- `className="tappable"`

### `components/write/WritingPractice.tsx`
- Shows 5 Tamil vowels one at a time
- Two modes (build one, the other is v2):
  - **Spelling choice:** See the romanisation, pick the correct Tamil script from 4 options
  - *(Tracing: v2)*
- Correct: warm feedback, next vowel
- Complete all 5: award 15 XP, show completion message

---

## Hooks

### `hooks/useProgress.ts`
```typescript
useProgress() → {
  progress: ProgressState
  markSeen(module: ModuleKey, id: number): void
  markPractised(module: ModuleKey, id: number): void
  isSeen(module: ModuleKey, id: number): boolean
  isPractised(module: ModuleKey, id: number): boolean
  countSeen(module: ModuleKey): number
  countPractised(module: ModuleKey): number
  clearAll(): void
}
```

### `hooks/useXP.ts`
```typescript
useXP() → {
  xp: number
  currentLevel: Level
  nextLevel: Level | null
  levelProgress: { current: number; required: number; percent: number }
  levelUp: boolean        // true for 3.5s after level threshold crossed
  addXP(action: XPAction): { gained: number; newTotal: number; leveledUp: boolean }
}
```

### `hooks/useSpeech.ts`
```typescript
useSpeech() → {
  speak(text: string): void   // lang: 'ta-IN', rate: 0.85
  stop(): void
  isSpeaking: boolean
  isAvailable: boolean
}
```

### `hooks/useLearnerStage.ts`
```typescript
useLearnerStage() → {
  stage: LearnerStage                 // defaults to 'newbie' if unset
  onboardingComplete: boolean
  mounted: boolean                    // false until localStorage read; use for the hydration guard
  setStage(stage: LearnerStage): void
  completeOnboarding(): void
  resetOnboarding(): void             // clears both keys; called by progress reset
}
```
Named `useLearnerStage`, **not** `useLevel`, so it can't be confused with XP levels in `useXP`.

### `hooks/useQuiz.ts`
```typescript
useQuiz(seenWordIds: number[], seenLetterIds: number[], stage?: LearnerStage) → {
  questions: QuizQuestion[]
  currentQuestion: QuizQuestion | null
  currentIndex: number
  score: number
  isComplete: boolean
  buildQuiz(): void                              // standard Challenge session
  buildFixedQuiz(seeds: PlacementSeed[]): void   // onboarding placement check
  submitAnswer(questionId: string, answer: string): boolean
  advance(): void
}
```

- `buildFixedQuiz` uses the seeds in order, generates distractors the same way as `buildQuiz`, and passes `hideRoman` through on the question so `QuizQuestion` can hide romanisation.
- `stage === 'advanced'` → letter questions allowed in `buildQuiz` without the ≥4-letters-seen rule. Other stages: unchanged.

**Pre-seeded cold start:** Word IDs 7, 1, 2, 9, 10 (vanakkam, amma, appa, aam, illai) always in the pool regardless of seen state.

**Question types:**
- Type A `'word'` — see Tamil → pick English meaning
- Type B `'letter'` — see Tamil letter → pick romanisation (only if ≥4 letters seen)
- 5 questions per session, no repeat items in same session

---

## Page Specs

### `/` — Home

**Gate first:** until `useLearnerStage().mounted`, render a plain navy screen. Then, if `!onboardingComplete`, render `<OnboardingFlow />` (no NavBar). Otherwise render home.

Sections (top to bottom):
1. **Header** — navy background, Tamil watermark 'த' at low opacity, app title தமிழ் large, **stage-specific subline** (see Onboarding table), seen + practised total counts
2. **XPBar** — current level in Tamil, XP total, progress bar to next level
3. **Dialogue of the Day** — date-seeded (`Math.floor(Date.now() / 86400000) % 5`), full card treatment, audio button. Marks dialogue as seen on audio play.
4. **"Start here" card** — full-width, links to `/learn?tab=` for the user's stage (see Onboarding table)
5. **Module cards** — 2×2 grid: Learn, Challenge, Write, Progress. Each: navy background, Tamil title, English label, subtitle, mood-coloured top border, stamp-in animation staggered by index.
6. **Footer** — "No streaks. No pressure. Just Tamil."

### `/learn` — Learn

- Tab bar: Letters | Words | Phrases | Dialogues
- Initial tab: `?tab=` query param if present, otherwise the stage default (Newbie → Words, Intermediate → Letters, Advanced → Dialogues). Read with `useSearchParams()` and wrap the page in `<Suspense>` (Next.js 14 requirement).
- Each tab shows the relevant cards in a scrollable grid/list
- Cards entrance: stampIn, staggered
- First visit empty state per tab: Tamil heading + body + optional CTA (see empty states below)
- Progress counts shown per tab: "6 seen · 2 practised"

**Empty states:**

| Tab | Tamil heading | Body | CTA |
|---|---|---|---|
| Letters | எழுத்துக்கள் | "Every Tamil word starts with one of these shapes." | "Begin →" scrolls to first card |
| Words | வார்த்தைகள் | "Words your family uses every day." | None |
| Phrases | வாக்கியங்கள் | "Things worth saying out loud." | None |
| Dialogues | டயலாக் | "Original lines in the spirit of Tamil cinema." | None |

### `/challenge` — Challenge

**Flow:**
1. Intro screen: "தேர்வு — Let's see what's stayed with you." + "Start →" button
2. 5 questions, progress bar across top (e.g. "2 / 5")
3. Each question: Tamil prompt, 4 options, immediate feedback on tap
4. Correct → VictoryOverlay fires, +25 XP
5. Wrong → inline warm feedback, highlight correct answer, "Next →" after 1.5s
6. After Q5: results screen with score, score-specific copy, +50 XP bonus if ≥3 correct, "Explore more →" CTA

**Cold start:** If fewer than 5 seen items, pre-seeded words fill the gap. Quiz is always playable.

**Stage:** pass `stage` into `useQuiz`. Advanced users can get letter questions from their first session.

### `/write` — Write

**POC mechanic: Spelling choice** (tracing is v2)

**Flow:**
1. Intro: "எழுது — Recognise the shape. Feel the language." + "Start →"
2. Show 5 Tamil vowels one at a time (அ ஆ இ ஈ உ)
3. Each: romanisation shown, "Which Tamil letter makes this sound?" → 4 options
4. Correct → warm praise, next vowel
5. Wrong → inline encouragement, correct answer shown, next vowel
6. Complete all 5: +15 XP, completion screen "நல்லா எழுதினே — you did it."

**Note:** Writing is intentionally lightweight in POC. No actual tracing, no input — pure recognition. Tracing mechanic (canvas-based) is a v2 feature.

### `/progress` — Progress

Sections:
1. **Level card** — Tamil level title large, Roman + English, total XP, level progress bar
2. **Your stage** — segmented control: Newbie / Intermediate / Advanced (Tamil label above each). Tap switches immediately. Copy: "This only changes where we suggest you start. Everything stays open."
3. **Stats grid** — seen and practised count per module (Letters, Words, Phrases, Dialogues)
4. **Reset** — small text link "Reset all progress" in --stone at bottom, behind confirmation modal

**Reset flow:**
- Tap link → modal: "Start fresh?" + "Not yet" + "Yes, reset everything"
- Confirm → clears `tamil-progress`, `tamil-xp`, `tamil-stage`, `tamil-onboarding-complete` → `router.push('/')` → onboarding shows again

---

## Error Boundary

Wrap entire app in `layout.tsx`.

```tsx
// components/ui/ErrorBoundary.tsx — class component
// On error: cream bg, navy heading "ஒரு நிமிடம்...", Lora body, vermillion refresh button
// Log error to console
```

---

## Project Structure

```
/app
  layout.tsx            ← Root layout, fonts, metadata, ErrorBoundary
  globals.css           ← CSS variables, fonts, grain, all keyframes
  page.tsx              ← Home
  /learn/page.tsx
  /challenge/page.tsx
  /write/page.tsx
  /progress/page.tsx

/components
  /ui
    AudioButton.tsx
    XPBar.tsx
    VictoryOverlay.tsx
    NavBar.tsx
    ErrorBoundary.tsx
  /cards
    LetterCard.tsx
    WordCard.tsx
    PhraseCard.tsx
    DialogueCard.tsx
  /challenge
    QuizQuestion.tsx
  /onboarding
    OnboardingFlow.tsx
    StageCard.tsx
  /write
    WritingPractice.tsx

/data
  letters.ts            ← 18 letters
  words.ts              ← 30 words
  phrases.ts            ← 10 phrases
  dialogues.ts          ← 5 cinema-inspired lines
  levels.ts             ← 5 XP levels + helper functions
  stages.ts             ← 3 learner stages: labels, descriptions, home subline, default Learn tab
  placement.ts          ← PLACEMENT_SETS for Intermediate + Advanced

/hooks
  useProgress.ts
  useXP.ts
  useSpeech.ts
  useQuiz.ts
  useLearnerStage.ts

/types
  index.ts              ← All TypeScript interfaces + XP_VALUES + EMPTY_PROGRESS + LearnerStage + PlacementSeed

/styles
  (animations in globals.css — no separate file needed for POC)
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS variables (inline styles for component-level) |
| Fonts | Google Fonts: Tiro Tamil, Noto Sans Tamil, Bebas Neue, Lora |
| Audio | Web Speech API (`ta-IN`, rate 0.85) |
| Progress | localStorage only |
| Deployment | Vercel (free tier) |
| Analytics | None for POC |

---

## Build Order — Tomorrow

Build in this exact sequence. Do not skip ahead. Each step must compile and render before moving to the next.

**Phase 1 — Foundation (first 2 hours)**
1. `npx create-next-app@latest tamil-app --typescript --tailwind --app`
2. `globals.css` — CSS variables, font imports, grain overlay, all keyframes
3. `types/index.ts` — all interfaces (including `LearnerStage`, `PlacementSeed`)
4. All 7 data files — paste from pre-generated content (`stages.ts` + `placement.ts` are new)
5. All 5 hooks — useProgress, useXP, useSpeech, useQuiz (with `buildFixedQuiz` + `stage`), useLearnerStage
6. Deploy empty shell to Vercel immediately — get the URL

**Phase 2 — UI Components (1 hour)**
7. `AudioButton.tsx`
8. `NavBar.tsx`
9. `VictoryOverlay.tsx`
10. `ErrorBoundary.tsx`

**Phase 3 — Home Page (1.5 hours)**
11. `app/page.tsx` — this is the design test. Get it right before anything else. Build it with stage hard-coded to `'newbie'` and no onboarding gate yet.
12. **Gate:** Does the home page feel like a Tamil cinema experience? If no — fix design before continuing.

**Phase 4 — Learn Page (1.5 hours)**
13. `LetterCard.tsx`, `WordCard.tsx`, `PhraseCard.tsx`, `DialogueCard.tsx`
14. `app/learn/page.tsx` with tab navigation + `?tab=` param + stage default

**Phase 5 — Challenge (1 hour)**
15. `QuizQuestion.tsx` (include `hideRoman` + `showNotSure` now, since onboarding needs them)
16. `app/challenge/page.tsx` — full 5-question flow with VictoryOverlay

**Phase 6 — Onboarding (1 hour)**
17. `StageCard.tsx`
18. `OnboardingFlow.tsx` — all 4 screens, reusing `QuizQuestion` + `buildFixedQuiz`
19. Wire into `app/page.tsx`: hydration guard → onboarding gate → stage subline + "Start here" card
20. **Test all three paths:** Newbie (skips check), Intermediate scoring 0, Advanced scoring 5. Clear localStorage between runs.

**Phase 7 — Write + Progress (1 hour)**
21. `WritingPractice.tsx`
22. `app/write/page.tsx`
23. `app/progress/page.tsx` — including "Your stage" control and updated reset

**Phase 8 — Polish + Deploy (30 mins)**
24. Mobile pass — test at 390px in Chrome DevTools
25. Verify Tamil script renders on each page, including all 3 stage labels
26. Verify audio fires on iOS Safari (if device available)
27. `vercel deploy`

**Why onboarding comes after Challenge:** it reuses `QuizQuestion` and `useQuiz`. Building it earlier would mean building the quiz twice.

**Total estimated time: 9–10 hours**

---

## Claude Code Prompting Strategy

**The golden pattern — use this every single time:**
```
Context: [what files already exist]
Task: [ONE specific component or page — nothing else]
Data shape: [paste the relevant TypeScript interface]
Style: [CSS variables to use — paste the list]
Output: [exact file path]
```

**What kills Claude Code sessions:**
- Asking for two components at once
- Not pasting the type interface — it will invent its own
- Forgetting CSS variable names — it will hardcode hex values
- Not specifying the file path — it will put files in wrong places

**Master style prompt — paste at the start of every new Claude Code session:**
```
This project uses these CSS variables: --vermillion (#C1272D), --turmeric (#F5A623), --navy (#1A1F3C), --cream (#FAF3E0), --stone (#8C7B6B), --white (#FDFAF4). Tamil font stack: var(--font-tamil) = 'Tiro Tamil', 'Latha', 'Tamil MN', 'Noto Sans Tamil', serif. Display font: var(--font-display) = 'Bebas Neue'. Body font: var(--font-body) = 'Lora'. Never hardcode colours. Never use 'Tiro Tamil' alone — always var(--font-tamil). All tappable elements have className="tappable" which applies scale(0.97) on :active. Animation keyframes: stampIn, pageFade, victoryFlash, victoryReveal, xpFloat, levelUpStamp, audioPulse — all defined in globals.css. Do not create new keyframes.
```

---

## Pre-Build Checklist

Complete before writing a line of code:

- [ ] App name decided (even a working title — cannot be TBC when building)
- [ ] Content files reviewed by a Tamil-speaking contact — fix all errors before any external testing
- [ ] No real celebrity names in any data file — archetype names only
- [ ] 5 Tamil diaspora testers identified and confirmed for the week after build
- [ ] OG image created: 1200×630px, app name in Tamil on navy/vermillion background
- [ ] Web Speech `ta-IN` tested on your iPhone Safari and Android Chrome before Saturday
- [ ] Phase 3 gate criteria agreed: "Does the home page feel Tamil, or does it feel like a React app?"
- [ ] Stage labels (தொடக்கம் / இடைநிலை / மேம்பட்டவர்) and onboarding Tamil copy checked by native reviewer
- [ ] Placement question IDs picked for Intermediate (5) and Advanced (5) from reviewed `words.ts` / `letters.ts`
- [ ] Testers recruited across all three stages, with at least one self-described Intermediate (speaks, can't read)

---

## Definition of Done — POC

**Build complete when:**
- [ ] All 5 routes render without errors
- [ ] Tamil script renders correctly on every page
- [ ] Audio fires on at least one card per module (Web Speech)
- [ ] XP increments correctly on hear, reveal, quiz correct, challenge complete, write complete
- [ ] VictoryOverlay fires on every correct quiz answer
- [ ] Level-up moment fires when XP crosses a threshold
- [ ] Wrong answers show warm inline copy — never a harsh failure state
- [ ] Seen and practised states persist across browser sessions
- [ ] Challenge is playable on first open (pre-seeded cold start)
- [ ] Progress reset flow works end to end, and onboarding shows again afterwards
- [ ] Onboarding shows on first open only, with no flash of home before it
- [ ] Newbie path skips the quick check; Intermediate + Advanced paths show it
- [ ] Every result-screen outcome lets the user keep their own choice
- [ ] Stage changes home subline, "Start here" card, and Learn default tab
- [ ] Stage can be changed on /progress and takes effect immediately
- [ ] Deep-linking to /learn before onboarding works (Newbie default, no block)
- [ ] NavBar active state correct on all routes, hidden during onboarding
- [ ] Looks correct at 390px width
- [ ] Deployed on Vercel with a shareable URL

**Validation complete when (week after build):**
- [ ] 5+ Tamil diaspora adults have tested it unassisted
- [ ] 24-hour recall follow-up sent and responses collected
- [ ] Zero content errors flagged
- [ ] Decision made: proceed to v2 or fix and retest

---

## v2 — After Validation

Only begin after POC validation passes.

**v2 priority order:**
1. App name locked, domain purchased
2. Speech recognition — Dialogue of the Day speaking challenge (see gamification spec)
3. Full alphabet (60 cards: 12 vowels + 18 consonants + 30 key compounds)
4. 80+ vocabulary words
5. ElevenLabs TTS integration
6. Culture module (festivals, food, proverbs)
7. Social share card (WhatsApp-optimised)
8. About page — the story of the product
9. Supabase — optional sign-up, cloud progress sync
10. Expo wrapper — App Store / Play Store

---

*Single source of truth for the POC build.*
*Everything not in this document is v2.*
*Last updated: October 2026*
