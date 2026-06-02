# AI-generated diff -- five-point review checklist

Print this. Tape it to your monitor for the first month.

## 1. Scope creep
Does the diff touch things you didn't ask for? Renames outside scope, "helpful"
reformatting, new imports? → revert anything outside the task, prompt again.

## 2. Fabricated APIs
Pick any unfamiliar function, library, or config key. Search the docs / grep
the repo. Does it actually exist? Models invent things that feel right.

## 3. Plausible-but-wrong logic
Read each new line out loud. Walk a real input through on paper. Off-by-one,
inverted condition, wrong default -- these read fine and run wrong.

## 4. Tests
Were any tests deleted, skipped, or weakened? Search for `skip`, `xfail`,
`pytest.mark.skip`, `// TODO`, `// FIXME` added in this diff.

## 5. Failure modes
What happens on: null input, empty list, network error, large input?
If the diff has no handling, that's a question for the prompter.

---

Once these are habit, you can stop using the checklist. Until then, use it.
