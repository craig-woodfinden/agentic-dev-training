# Brand assets

Drop the Indiqator logo here:

- `indiqator-logo.png` -- the wordmark (used in the app sidebar and the placement-quiz page).
  Suggested size: at least 600px wide on a transparent background.

The app uses `st.image("assets/indiqator-logo.png", width=220)` if the file
exists, and falls back to a styled wordmark if it doesn't. So this folder
must contain the PNG before the brand block looks right.
