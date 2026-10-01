# FMD Diagnostic Bench

Interactive Module 1, "Consideration of diagnostic tools for the epidemiology approach", for veterinary students. Foot-and-mouth disease is the case study. Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Pages

| File | Learning outcome |
|---|---|
| `index.html` | Contents and progress |
| `00-know-fmd.html` | Know the disease: triad, need for tests, SP vs NSP (DIVA) |
| `01-test-performance.html` | 01 Diagnostic test performance: 2×2 table, Se, Sp, PPV, NPV |
| `02-reference-standards.html` | 02 Evaluate reference standards |
| `03-testing-strategy.html` | 03 Choose a testing strategy |
| `04-surveillance.html` | 04 Plan surveillance and timing |
| `05-combining-tests.html` | 05 Combine tests (parallel and serial) |

## Files in `assets/`

- `style.css`: all styles, light and dark mode.
- `common.js`: shared helpers (quiz engine, chart, progress tracking). Loaded on every page.
- `data.js`: the 32-serum dataset from Jauhari et al. (2024). Loaded on page 02.
- `s00.js` to `s06.js`: the interactive parts of each page.

## Run locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder.

## Publish with GitHub Pages

1. Push this folder to a repository (files at the repository root).
2. Settings, Pages, Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site appears at `https://<user>.github.io/<repo>/`.

## Notes

- "Mark done" progress is stored in the browser (localStorage) and is shared across pages.
- Fonts load from Google Fonts. Without a connection the page falls back to system fonts.
- Only the 32-serum comparison is real data. All other example numbers are hypothetical teaching values.
- The WOAH Manual chapter and slides used are earlier versions. The current Manual chapter is 3.1.8 and the Code chapter is 8.8.
- To add a page: copy an existing page, add a script `assets/sNN.js`, and add the page to the nav links.
