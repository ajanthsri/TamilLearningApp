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
| `app/` | Routes: `/`, `/pack/[id]`, `/learn`, `/challenge`, `/write`, `/progress` (Stats) |
| `components/` | `ui/` shared pieces, `cards/` Learn cards, `challenge/`, `onboarding/`, `write/` |
| `data/` | All content: words, phrases, dialogues, packs, avatars, and `copy.ts` for Tamil UI lines. Sri Lankan Tamil |
| `hooks/` | `useProgress`, `useXP`, `useQuiz`, `useSpeech`, `useLearnerStage` |
| `lib/store.ts` | Shared localStorage store, so every screen sees the same XP and progress |

## localStorage keys

`tamil-progress`, `tamil-xp`, `tamil-xp-awarded` (one-time XP tags), `tamil-stage`, `tamil-onboarding-complete`, `tamil-packs-complete`, `tamil-avatar`, `tamil-dialect`, `tamil-sfx`.

## Audio: recording real voices

Every play button uses a real recording if one exists, otherwise the phone's Tamil voice (Sri Lankan `ta-LK` first, then `ta-IN`).

1. `npm run audio:list` writes `audio/recording-list-lk.csv`: every Tamil line in the app with the filename to save it as.
2. Record each line (a phone voice memo is fine) and save it into `public/audio/lk/` using that filename, e.g. `word-07-vanakkam.m4a`. `.mp3`, `.m4a` and `.wav` all work.
3. Commit and push. The build matches the files to their Tamil text automatically. `npm run audio:manifest` shows how many are done.

If you change any Tamil text in `data/`, run `npm run audio:list` again so the list matches.

## Switches

`lib/config.ts`: `SHOW_STAGE_SELECTION` turns the Newbie / Intermediate / Advanced choice back on.
