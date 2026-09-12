# Pilot plan: 5–10 complete beginners

Purpose: find out whether a beginner who has never programmed can, on their
own, finish the first lessons and the first project milestone, and whether
they come back. Nothing here is a result; it is the plan for getting results.

## Who

- 5–10 people who have never written code. Aim for a mix: two or three
  children (about 10–14) with a parent nearby, and adults. At least two Hebrew
  speakers who prefer Hebrew, at least two who prefer English.
- Their own device and browser if possible (laptop or desktop; one tablet is
  useful to see how the editor behaves on touch).

## What they do

Session 1 (45–60 minutes, observed, ideally screen-shared or in the room):

1. Open the site cold. No introduction beyond "this teaches programming; try it".
2. Onboarding → lesson 1 → lesson 2. Stop at 45 minutes wherever they are.
3. Ask them to open the project *Your text adventure* if they reached lesson 5;
   otherwise skip.

Between sessions (one to two weeks, unobserved): "use it whenever you like".

Session 2 (30 minutes): open the app again in front of you; ask them to show
you the last thing they did, then to change one line of their own program and
predict what will happen before running it.

## What to observe and record (per learner)

| Measure | How to capture |
|---|---|
| First-task completion | Did lesson 1's exercise pass without help? Minutes from opening the site to the first passing check. |
| Confusion points | Every moment they stop, re-read, or ask. Note the step id (visible in the URL and the "Step i of n" label) and their words. |
| Help used | Hints opened, solution revealed, built-in guide questions, AI assistant questions (the owner page shows counts per device). |
| Understanding check | Passed first time / after retry / not passed. |
| Pace | Which pace they chose (or left at Standard), whether they switched. |
| Return visits | Days active between sessions (the learner can export progress; the `activeDays` list is in the export). |
| Project | Furthest milestone reached; whether their story is their own words. |
| Explain and modify | In session 2: can they say what each line of their program does? Can they change it and predict the result correctly? |
| Language | For Hebrew users: any place the Hebrew read oddly, any mixed-direction text that looked wrong. |

Keep a one-page log per learner with those rows plus free notes. Do not
summarise across learners until all sessions are done.

## Decision after the pilot

Continue toward a paid product only if most learners pass lesson 1's exercise
without help, most return at least once unprompted, and at least half can
explain and modify their own program in session 2. If confusion clusters on a
few steps, fix those before any pricing work. If the AI assistant was used,
compare the usage report on the owner page with the perceived help; the
built-in guide is free and must remain useful on its own.

## Not in scope

No payment, no accounts, no analytics beacon. Everything the learner does stays
in their browser except AI assistant messages, which go to the model through
the site's server and are not stored there.
