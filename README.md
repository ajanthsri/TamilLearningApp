# தமிழ் — Tamil learning app (POC)

Mobile-first Tamil learning web app for diaspora adults. No sign-up, no backend. All progress lives in the browser's localStorage. The PRD (`tamil-app-prd-final.md`) is the source of truth.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

To test on your phone on the same Wi-Fi: `npx next dev -H 0.0.0.0`, then open `http://<your-laptop-ip>:3000`.

To see onboarding again, use Progress → Reset all progress, or clear site data.

## Deploy

1. Push this folder to a GitHub repo.
2. In Vercel: Add New → Project → import the repo. No settings to change.
3. Every push to `main` redeploys.

## Where things live

| Folder | What's in it |
|---|---|
| `app/` | The five routes: `/`, `/learn`, `/challenge`, `/write`, `/progress` |
| `components/` | `ui/` shared pieces, `cards/` Learn cards, `challenge/`, `onboarding/`, `write/` |
| `data/` | All content. Edit these files to change words, phrases, dialogues, stages, placement questions |
| `hooks/` | `useProgress`, `useXP`, `useQuiz`, `useSpeech`, `useLearnerStage` |
| `lib/store.ts` | Shared localStorage store, so every screen sees the same XP and progress |

## localStorage keys

`tamil-progress`, `tamil-xp`, `tamil-xp-awarded` (one-time XP tags), `tamil-stage`, `tamil-onboarding-complete`.

## Audio

Uses the browser's built-in Tamil voice (Web Speech API, `ta-IN`). Many phones have no Tamil voice installed, in which case it may be silent or read with the wrong accent. Check on your own iPhone and Android before testing with others.
