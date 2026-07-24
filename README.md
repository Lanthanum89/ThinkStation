# ThinkStation

ThinkStation is a retro-inspired puzzle game based on classic 1990s electronic
tabletop games, featuring timed word, number and conundrum challenges in a
nostalgic digital interface — modelled after handheld gadgets like the
Lexibook electronic Countdown game.

## Rounds

- **Letters** — pick 9 vowels/consonants, then race the 30-second clock to
  enter the longest word you can make. Words are checked against a bundled
  ~150k word dictionary, scored by length (with a bonus for using all 9
  letters), and the "Expert" reveal shows a top word you could have played.
- **Numbers** — pick 6 numbers (big tiles: 25/50/75/100, small tiles: 1–10)
  and use +, −, ×, ÷ to hit a random 3-digit target before time runs out.
  Scoring follows the classic rules (10 pts exact, 7 within 5, 5 within 10).
  A built-in solver reveals an exact or closest-possible answer.
- **Conundrum** — unscramble a 9-letter anagram against the clock for a
  single all-or-nothing guess.

Play any round standalone in **Practice** mode, or run the **Full Game** — a
sequence of Letters, Numbers and Conundrum rounds with a running score, just
like the handheld's TV Challenge mode.

## Tech

- React + TypeScript + Vite
- Installable as a PWA (offline-capable, works fully client-side)
- No backend — the dictionary, number solver and conundrum generator all run
  in the browser

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run preview  # preview the production build
```
