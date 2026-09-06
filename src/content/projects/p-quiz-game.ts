import type { Project } from '../schema';
import { p, code, callout, term, t, pythonTest, requires, py } from '../authoring';

/**
 * Input lines for the initial run of every check: the right answers to the
 * three given questions, then spare lines so a quiz with extra questions never
 * runs out of input. Lines the program does not read are simply ignored.
 */
const answerLines = ['4', 'Paris', '7', 'x', 'x', 'x', 'x', 'x', 'x', 'x'];

export const project: Project = {
  id: 'p-quiz-game',
  moduleId: 'm6',
  title: t('The quiz game', 'משחק החידון'),
  tagline: t('A list of question dictionaries, a scoring loop and a final verdict.', 'רשימה של מילוני שאלות, לולאת ניקוד ופסק דין סופי.'),
  description: [
    p(
      'You will build a quiz game. The questions live in a list of dictionaries, each holding a question and its answer. The game asks every question, tells the player whether they were right, and ends with a score, a percentage and a short verdict. A game might look like this:',
      'תבנו משחק חידון. השאלות נמצאות ברשימה של מילונים, שכל אחד מהם מחזיק שאלה ואת התשובה שלה. המשחק שואל כל שאלה, אומר לשחקן אם הוא צדק, ומסתיים בניקוד, באחוזים ובפסק דין קצר. משחק יכול להיראות כך:',
    ),
    code(
      'What is 2 + 2?\nYour answer: 4\nCorrect!\nWhat is the capital of France?\nYour answer: paris\nCorrect!\nHow many days are in a week?\nYour answer: 5\nWrong! The answer is 7\nYou scored 2 out of 3\nPercent: 66%\nGood',
      { lang: 'text', runnable: false, caption: t('A sample game (the lines the player typed are shown after the prompts).', 'משחק לדוגמה (השורות שהשחקן הקליד מוצגות אחרי הבקשות).') },
    ),
    p(
      'You build the game in five steps. Each step has its own check, and the checks stay in force: the finished game must still pass every earlier step. The checks play the game for you by typing answers, so the exact English messages matter.',
      'אתם בונים את המשחק בחמישה שלבים. לכל שלב יש בדיקה משלו, והבדיקות נשארות בתוקף: המשחק המוגמר חייב עדיין לעבור כל שלב קודם. הבדיקות משחקות את המשחק בשבילכם על ידי הקלדת תשובות, ולכן ההודעות המדויקות באנגלית חשובות.',
    ),
    callout(
      'note',
      'The messages the checks look for: Correct! / Wrong! The answer is X / You scored N out of M / Percent: P% / Excellent / Good / Keep practising. The prompt text of input() is up to you.',
      'ההודעות שהבדיקות מחפשות: `Correct!` / `Wrong! The answer is X` / `You scored N out of M` / `Percent: P%` / `Excellent` / `Good` / `Keep practising`. טקסט הבקשה של `input()` לבחירתכם.',
      t('Exact messages', 'הודעות מדויקות'),
    ),
  ],
  prerequisites: ['l24-lists', 'l25-list-loops', 'l26-dictionaries', 'l27-nested-data'],
  estimatedMinutes: 50,
  starterCode: py`
    # The quiz game
    # Step 1: a list of question dictionaries, and a function ask(q)

  `,
  sampleStdin: ['4', 'paris', '7', 'x'],
  steps: [
    /* ------------------------------------------------------------ step 1 */
    {
      id: 'step-1',
      title: t('The questions and ask(q)', 'השאלות ו-ask(q)'),
      instructions: [
        p(
          'Create a list called `questions`. Each item is a dictionary with two keys, `"question"` and `"answer"`. Start with exactly these three — copy them, because the checks rely on them:',
          'צרו רשימה בשם `questions`. כל פריט הוא מילון עם שני מפתחות, `"question"` ו-`"answer"`. התחילו בדיוק משלוש אלה — העתיקו אותן, כי הבדיקות מסתמכות עליהן:',
        ),
        code(py`
          questions = [
              {"question": "What is 2 + 2?", "answer": "4"},
              {"question": "What is the capital of France?", "answer": "Paris"},
              {"question": "How many days are in a week?", "answer": "7"},
          ]
        `, { runnable: false }),
        p(
          'Then write a function `ask(q)` that receives one question dictionary. It prints `q["question"]`, reads the answer with `input()` (any prompt text), and returns `True` if the answer is right and `False` otherwise. Be forgiving: ignore capital letters and spaces around the answer, so that `paris` and ` Paris ` both count as right.',
          'אחר כך כתבו פונקציה `ask(q)` שמקבלת מילון שאלה אחד. היא מדפיסה את `q["question"]`, קוראת את התשובה בעזרת `input()` (טקסט הבקשה חופשי), ומחזירה `True` אם התשובה נכונה ו-`False` אחרת. היו סלחניים: התעלמו מאותיות גדולות ומרווחים סביב התשובה, כך שגם `paris` וגם ` Paris ` ייחשבו נכונים.',
        ),
        term(
          '.strip()',
          'A string operation that returns the same text without the spaces at its start and end: `" 4 ".strip()` is `"4"`. Chain it with `.lower()` from lesson 10: `answer.strip().lower()`.',
          'פעולה על מחרוזת שמחזירה את אותו טקסט בלי הרווחים שבתחילתו ובסופו: `" 4 ".strip()` הוא `"4"`. שרשרו אותה עם `.lower()` משיעור 10: `answer.strip().lower()`.',
        ),
        p(
          'To try it out, call `ask(questions[0])` at the bottom of the file and print what it returns. That line will be replaced by a loop in the next step.',
          'כדי לנסות, קראו ל-`ask(questions[0])` בתחתית הקובץ והדפיסו את מה שהיא מחזירה. השורה הזאת תוחלף בלולאה בשלב הבא.',
        ),
      ],
      check: {
        tests: [
          pythonTest(
            py`
              qs = ns.get("questions")
              assert isinstance(qs, list), "Create a list called questions."
              assert len(qs) >= 3, "questions needs at least 3 question dictionaries."
              for q in qs:
                  assert isinstance(q, dict), "Every item of questions must be a dictionary."
                  assert "question" in q and "answer" in q, "Every question dictionary needs the keys 'question' and 'answer'."
                  assert isinstance(q["answer"], str), "Write every answer as text in quotes, even a number such as 4."
              given = [q["answer"].strip().lower() for q in qs[:3]]
              assert given == ["4", "paris", "7"], "Copy the three given questions exactly (answers 4, Paris and 7, in that order)."
              assert callable(ns.get("ask")), "Define a function called ask(q)."
            `,
            { stdin: answerLines, name: ['The questions list and ask exist', 'רשימת השאלות ו-ask קיימות'] },
          ),
          pythonTest(
            py`
              import builtins
              ask = ns["ask"]
              q = {"question": "What is 1 + 1?", "answer": "2"}
              results = []
              saved = builtins.input
              try:
                  for typed in ["2", " 2 ", "5"]:
                      builtins.input = lambda prompt="", _t=typed: _t
                      results.append(ask(q))
              finally:
                  builtins.input = saved
              assert results[0] is True, "ask(q) must return True when the typed answer equals q['answer']."
              assert results[1] is True, "ask(q) must ignore spaces around the answer: use .strip()."
              assert results[2] is False, "ask(q) must return False when the typed answer is wrong."
              q2 = {"question": "Capital of France?", "answer": "Paris"}
              saved = builtins.input
              try:
                  builtins.input = lambda prompt="": "paris"
                  r = ask(q2)
              finally:
                  builtins.input = saved
              assert r is True, "ask(q) must ignore capital letters: compare with .lower()."
            `,
            { stdin: answerLines, name: ['ask(q) returns True or False', 'ask(q) מחזירה True או False'] },
          ),
        ],
      },
      hints: [
        t('The list is a list of dictionaries, like the students table in lesson 27. Keep the keys exactly `"question"` and `"answer"`.', 'הרשימה היא רשימה של מילונים, כמו טבלת התלמידים בשיעור 27. שמרו על המפתחות בדיוק `"question"` ו-`"answer"`.'),
        t('Inside `ask`: `print(q["question"])`, then `answer = input("Your answer: ")`.', 'בתוך `ask`: `print(q["question"])`, ואז `answer = input("Your answer: ")`.'),
        t('Return the comparison itself: `return answer.strip().lower() == q["answer"].lower()`.', 'החזירו את ההשוואה עצמה: `return answer.strip().lower() == q["answer"].lower()`.'),
      ],
      referenceCode: py`
        questions = [
            {"question": "What is 2 + 2?", "answer": "4"},
            {"question": "What is the capital of France?", "answer": "Paris"},
            {"question": "How many days are in a week?", "answer": "7"},
        ]


        def ask(q):
            print(q["question"])
            answer = input("Your answer: ")
            return answer.strip().lower() == q["answer"].lower()


        result = ask(questions[0])
        print(result)
      `,
    },
    /* ------------------------------------------------------------ step 2 */
    {
      id: 'step-2',
      title: t('Ask every question and keep score', 'שאלו כל שאלה ושמרו ניקוד'),
      instructions: [
        p(
          'Remove the test call from step 1. Loop over `questions` with a for-each loop and call `ask(q)` for each one, keeping a counter of correct answers. After each question print exactly `Correct!` when `ask` returned True, or `Wrong! The answer is X` where X is the right answer — for example `Wrong! The answer is Paris`. After the loop print `You scored N out of M`, where N is the number of correct answers and M is the number of questions. Use `len(questions)` for M rather than typing 3.',
          'הסירו את קריאת הניסיון משלב 1. עברו בלולאת for על `questions` וקראו ל-`ask(q)` עבור כל שאלה, תוך שמירת מונה של תשובות נכונות. אחרי כל שאלה הדפיסו בדיוק `Correct!` כאשר `ask` החזירה True, או `Wrong! The answer is X` כאשר X היא התשובה הנכונה — למשל `Wrong! The answer is Paris`. אחרי הלולאה הדפיסו `You scored N out of M`, כאשר N הוא מספר התשובות הנכונות ו-M הוא מספר השאלות. השתמשו ב-`len(questions)` עבור M במקום לכתוב 3.',
        ),
        code(
          'What is 2 + 2?\nCorrect!\nWhat is the capital of France?\nCorrect!\nHow many days are in a week?\nWrong! The answer is 7\nYou scored 2 out of 3',
          { lang: 'text', runnable: false, caption: t('Output for the answers 4, paris and 5 (prompts not shown).', 'הפלט עבור התשובות 4, paris ו-5 (הבקשות לא מוצגות).') },
        ),
      ],
      check: {
        tests: [
          pythonTest(
            py`
              qs = ns["questions"]

              def norm(s):
                  return s.strip().lower()

              def play(answers):
                  out = run(answers + ["zzz"] * 10)
                  right = 0
                  for i in range(len(qs)):
                      a = answers[i] if i < len(answers) else "zzz"
                      if norm(a) == norm(qs[i]["answer"]):
                          right += 1
                  return out, right

              out, right = play(["4", "Paris", "7"])
              assert out.count("Correct!") == right, "Print Correct! once for every right answer (4, Paris and 7 are all right)."
              wrong_lines = [l for l in out.split("\n") if l.strip().startswith("Wrong! The answer is")]
              assert len(wrong_lines) == len(qs) - right, "Print 'Wrong! The answer is X' once for every wrong answer, and nothing like it for right ones."
              assert "You scored " + str(right) + " out of " + str(len(qs)) in out, "At the end print 'You scored N out of M' (N right answers, M questions)."

              out, right = play(["zzz", "zzz", "zzz"])
              assert out.count("Correct!") == right, "Do not print Correct! for a wrong answer."
              for q in qs:
                  assert "Wrong! The answer is " + q["answer"] in out, "For a wrong answer print 'Wrong! The answer is ' followed by the right answer from the dictionary."
              assert "You scored " + str(right) + " out of " + str(len(qs)) in out, "With every answer wrong, print 'You scored 0 out of M'."

              out, right = play([" 4 ", "paris", "7"])
              assert out.count("Correct!") == right, "Ignore capital letters and spaces around the answer: ' 4 ' and 'paris' are right. Use .strip().lower()."
            `,
            { stdin: answerLines, name: ['Every question is asked and scored', 'כל שאלה נשאלת ומנוקדת'] },
          ),
        ],
        requires: [requires('\\bfor\\b', 'Loop over the questions with a for loop.', 'עברו על השאלות בלולאת for.')],
      },
      hints: [
        t('`for q in questions:` gives you one dictionary at a time; `if ask(q):` decides which message to print.', '`for q in questions:` נותן לכם מילון אחד בכל פעם; `if ask(q):` מחליט איזו הודעה להדפיס.'),
        t('Start `correct = 0` before the loop and add 1 inside the `if`.', 'התחילו `correct = 0` לפני הלולאה והוסיפו 1 בתוך ה-`if`.'),
        t('The wrong message needs the answer from the dictionary: `print("Wrong! The answer is", q["answer"])`. The last line: `print(f"You scored {correct} out of {len(questions)}")`.', 'הודעת הטעות צריכה את התשובה מהמילון: `print("Wrong! The answer is", q["answer"])`. השורה האחרונה: `print(f"You scored {correct} out of {len(questions)}")`.'),
      ],
      referenceCode: py`
        questions = [
            {"question": "What is 2 + 2?", "answer": "4"},
            {"question": "What is the capital of France?", "answer": "Paris"},
            {"question": "How many days are in a week?", "answer": "7"},
        ]


        def ask(q):
            print(q["question"])
            answer = input("Your answer: ")
            return answer.strip().lower() == q["answer"].lower()


        correct = 0
        for q in questions:
            if ask(q):
                print("Correct!")
                correct = correct + 1
            else:
                print("Wrong! The answer is", q["answer"])

        print(f"You scored {correct} out of {len(questions)}")
      `,
    },
    /* ------------------------------------------------------------ step 3 */
    {
      id: 'step-3',
      title: t('A percentage', 'אחוזים'),
      instructions: [
        p(
          'Write a function `percent(correct, total)` that returns the score as a whole-number percentage: `percent(3, 4)` returns `75` and `percent(1, 4)` returns `25`. Compute `correct / total * 100` and turn the result into an `int`. Then, after the "You scored" line, print `Percent: 75%` — the number followed by a percent sign.',
          'כתבו פונקציה `percent(correct, total)` שמחזירה את הניקוד כאחוז במספר שלם: `percent(3, 4)` מחזירה `75` ו-`percent(1, 4)` מחזירה `25`. חשבו `correct / total * 100` והפכו את התוצאה ל-`int`. אחר כך, אחרי שורת ה-"You scored", הדפיסו `Percent: 75%` — המספר ואחריו סימן אחוז.',
        ),
        p(
          'Put the new function above the loop, next to `ask`, and call it once after the loop.',
          'שימו את הפונקציה החדשה מעל הלולאה, ליד `ask`, וקראו לה פעם אחת אחרי הלולאה.',
        ),
      ],
      check: {
        tests: [
          pythonTest(
            py`
              f = ns.get("percent")
              assert callable(f), "Define a function called percent(correct, total)."
              assert f(3, 4) == 75, "percent(3, 4) should return 75."
              assert f(1, 4) == 25, "percent(1, 4) should return 25."
              assert f(0, 5) == 0, "percent(0, 5) should return 0."
              assert f(4, 4) == 100, "percent(4, 4) should return 100."
              assert isinstance(f(3, 4), int), "percent must return a whole number (use int()), not a float like 75.0."
              qs = ns["questions"]
              right = [q["answer"] for q in qs]
              out = run(right + ["zzz"] * 10)
              assert "Percent: 100%" in out, "When every answer is right, print 'Percent: 100%'."
              out = run(["zzz"] * 13)
              assert "Percent: 0%" in out, "When every answer is wrong, print 'Percent: 0%'."
            `,
            { stdin: answerLines, name: ['percent() and the Percent line', 'percent() ושורת ה-Percent'] },
          ),
        ],
      },
      hints: [
        t('A function with two parameters and a return value: `def percent(correct, total):`.', 'פונקציה עם שני פרמטרים וערך מוחזר: `def percent(correct, total):`.'),
        t('`correct / total * 100` gives a float such as 75.0; `int(...)` around it makes 75.', '`correct / total * 100` נותן float כמו 75.0; `int(...)` סביבו נותן 75.'),
        t('After the loop: `score = percent(correct, len(questions))` and then `print(f"Percent: {score}%")`.', 'אחרי הלולאה: `score = percent(correct, len(questions))` ואז `print(f"Percent: {score}%")`.'),
      ],
      referenceCode: py`
        questions = [
            {"question": "What is 2 + 2?", "answer": "4"},
            {"question": "What is the capital of France?", "answer": "Paris"},
            {"question": "How many days are in a week?", "answer": "7"},
        ]


        def ask(q):
            print(q["question"])
            answer = input("Your answer: ")
            return answer.strip().lower() == q["answer"].lower()


        def percent(correct, total):
            return int(correct / total * 100)


        correct = 0
        for q in questions:
            if ask(q):
                print("Correct!")
                correct = correct + 1
            else:
                print("Wrong! The answer is", q["answer"])

        print(f"You scored {correct} out of {len(questions)}")
        score = percent(correct, len(questions))
        print(f"Percent: {score}%")
      `,
    },
    /* ------------------------------------------------------------ step 4 */
    {
      id: 'step-4',
      title: t('A final verdict', 'פסק דין סופי'),
      instructions: [
        p(
          'After the Percent line, print one final word depending on the percentage: `Excellent` when it is 80 or more, `Good` when it is 50 or more but below 80, and `Keep practising` otherwise. Use `if` / `elif` / `else` on the number that `percent` returned, checking the bigger threshold first.',
          'אחרי שורת ה-Percent, הדפיסו מילה אחת אחרונה בהתאם לאחוז: `Excellent` כשהוא 80 או יותר, `Good` כשהוא 50 או יותר אבל פחות מ-80, ו-`Keep practising` אחרת. השתמשו ב-`if` / `elif` / `else` על המספר ש-`percent` החזירה, ובדקו קודם את הסף הגדול יותר.',
        ),
      ],
      check: {
        tests: [
          pythonTest(
            py`
              qs = ns["questions"]

              def verdict(pct):
                  if pct >= 80:
                      return "Excellent"
                  if pct >= 50:
                      return "Good"
                  return "Keep practising"

              def norm(s):
                  return s.strip().lower()

              def play(answers):
                  out = run(answers + ["zzz"] * 10)
                  right = 0
                  for i in range(len(qs)):
                      a = answers[i] if i < len(answers) else "zzz"
                      if norm(a) == norm(qs[i]["answer"]):
                          right += 1
                  return out, int(right / len(qs) * 100)

              all_right = [q["answer"] for q in qs]
              for answers in (all_right, all_right[:2], all_right[:1], []):
                  out, pct = play(answers)
                  expected = verdict(pct)
                  lines = [l.strip() for l in out.split("\n")]
                  assert expected in lines, "For a score of " + str(pct) + "% print exactly '" + expected + "' on its own line."
                  for other in ("Excellent", "Good", "Keep practising"):
                      if other != expected:
                          assert other not in lines, "For a score of " + str(pct) + "% print only '" + expected + "', not '" + other + "'."
            `,
            { stdin: answerLines, name: ['The verdict matches the percentage', 'פסק הדין תואם לאחוז'] },
          ),
        ],
      },
      hints: [
        t('You already have the percentage in a variable such as `score`. The verdict is a decision about that number.', 'האחוז כבר נמצא אצלכם במשתנה כמו `score`. פסק הדין הוא החלטה על המספר הזה.'),
        t('`if score >= 80:` … `elif score >= 50:` … `else:` — as in lesson 13, the order of the conditions matters.', '`if score >= 80:` … `elif score >= 50:` … `else:` — כמו בשיעור 13, סדר התנאים חשוב.'),
        t('Each branch prints exactly one message: `print("Excellent")`, `print("Good")` or `print("Keep practising")`.', 'כל ענף מדפיס בדיוק הודעה אחת: `print("Excellent")`, `print("Good")` או `print("Keep practising")`.'),
      ],
      referenceCode: py`
        questions = [
            {"question": "What is 2 + 2?", "answer": "4"},
            {"question": "What is the capital of France?", "answer": "Paris"},
            {"question": "How many days are in a week?", "answer": "7"},
        ]


        def ask(q):
            print(q["question"])
            answer = input("Your answer: ")
            return answer.strip().lower() == q["answer"].lower()


        def percent(correct, total):
            return int(correct / total * 100)


        correct = 0
        for q in questions:
            if ask(q):
                print("Correct!")
                correct = correct + 1
            else:
                print("Wrong! The answer is", q["answer"])

        print(f"You scored {correct} out of {len(questions)}")
        score = percent(correct, len(questions))
        print(f"Percent: {score}%")
        if score >= 80:
            print("Excellent")
        elif score >= 50:
            print("Good")
        else:
            print("Keep practising")
      `,
    },
    /* ------------------------------------------------------------ step 5 */
    {
      id: 'step-5',
      title: t('Your own questions and main()', 'השאלות שלכם ו-main()'),
      instructions: [
        p(
          'Add at least one question of your own to the **end** of `questions` — keep the first three exactly as they are — so the list has four or more dictionaries. Then organise the program as in lesson 23: keep `questions`, `ask` and `percent` at the top, move the loop and the final messages into a function `main()`, and call `main()` on the last line.',
          'הוסיפו לפחות שאלה אחת משלכם ל**סוף** של `questions` — השאירו את שלוש הראשונות בדיוק כפי שהן — כך שברשימה יהיו ארבעה מילונים או יותר. אחר כך ארגנו את התוכנית כמו בשיעור 23: השאירו את `questions`, `ask` ו-`percent` בראש הקובץ, העבירו את הלולאה ואת ההודעות הסופיות לפונקציה `main()`, וקראו ל-`main()` בשורה האחרונה.',
        ),
        callout(
          'tip',
          'Because the loop uses len(questions), nothing else has to change when you add questions. Press Run and type the answer to your new question too.',
          'מכיוון שהלולאה משתמשת ב-`len(questions)`, שום דבר אחר לא צריך להשתנות כשמוסיפים שאלות. לחצו על Run והקלידו גם את התשובה לשאלה החדשה שלכם.',
        ),
      ],
      check: {
        tests: [
          pythonTest(
            py`
              qs = ns.get("questions")
              assert isinstance(qs, list) and len(qs) >= 4, "Add at least one question of your own so that questions has 4 or more dictionaries."
              for q in qs:
                  assert isinstance(q, dict) and "question" in q and "answer" in q, "Every question dictionary needs the keys 'question' and 'answer'."
                  assert isinstance(q["question"], str) and q["question"].strip() != "", "Every question needs some text."
                  assert isinstance(q["answer"], str) and q["answer"].strip() != "", "Every answer must be a non-empty string in quotes."
              given = [q["answer"].strip().lower() for q in qs[:3]]
              assert given == ["4", "paris", "7"], "Keep the first three questions as they were; add your own after them."
              assert callable(ns.get("main")), "Define a function called main() that runs the quiz."
              right = [q["answer"] for q in qs]
              out = run(right + ["zzz"] * 10)
              assert "You scored " + str(len(qs)) + " out of " + str(len(qs)) in out, "main() must run the whole quiz: with every answer right, print 'You scored M out of M' where M is the number of questions."
            `,
            { stdin: answerLines, name: ['Four or more questions, run from main()', 'ארבע שאלות או יותר, מופעלות מ-main()'] },
          ),
        ],
        requires: [
          requires('\\bdef\\s+main\\s*\\(', 'Define a function called main().', 'הגדירו פונקציה בשם `main()`.'),
          requires('^main\\(\\)', 'Call main() at the bottom of the program (at the start of a line, without indentation).', 'קראו ל-`main()` בתחתית התוכנית (בתחילת שורה, בלי הזחה).'),
        ],
      },
      hints: [
        t('A new question is one more dictionary in the list, for example `{"question": "What colour is a banana?", "answer": "yellow"}`.', 'שאלה חדשה היא עוד מילון אחד ברשימה, למשל `{"question": "What colour is a banana?", "answer": "yellow"}`.'),
        t('Write `def main():` and indent the whole scoring part — the counter, the loop and the prints — under it.', 'כתבו `def main():` והזיחו את כל חלק הניקוד — המונה, הלולאה וההדפסות — תחתיה.'),
        t('`main()` can read `questions` because it is a global variable (lesson 23). The very last line of the file is `main()`.', '`main()` יכולה לקרוא את `questions` כי זה משתנה גלובלי (שיעור 23). השורה האחרונה ממש בקובץ היא `main()`.'),
      ],
      referenceCode: py`
        questions = [
            {"question": "What is 2 + 2?", "answer": "4"},
            {"question": "What is the capital of France?", "answer": "Paris"},
            {"question": "How many days are in a week?", "answer": "7"},
            {"question": "What colour is a banana?", "answer": "yellow"},
        ]


        def ask(q):
            print(q["question"])
            answer = input("Your answer: ")
            return answer.strip().lower() == q["answer"].lower()


        def percent(correct, total):
            return int(correct / total * 100)


        def main():
            correct = 0
            for q in questions:
                if ask(q):
                    print("Correct!")
                    correct = correct + 1
                else:
                    print("Wrong! The answer is", q["answer"])

            print(f"You scored {correct} out of {len(questions)}")
            score = percent(correct, len(questions))
            print(f"Percent: {score}%")
            if score >= 80:
                print("Excellent")
            elif score >= 50:
                print("Good")
            else:
                print("Keep practising")


        main()
      `,
    },
  ],
  extensions: [
    t('Keep a list of the questions the player got wrong, and print them again at the end so the player can learn from them.', 'שמרו רשימה של השאלות שהשחקן טעה בהן, והדפיסו אותן שוב בסוף כדי שהשחקן יוכל ללמוד מהן.'),
    t('Give each question a "points" key (easy questions 1 point, hard ones 3) and add up points instead of counting answers.', 'תנו לכל שאלה מפתח "points" (שאלות קלות נקודה אחת, קשות 3) וסכמו נקודות במקום לספור תשובות.'),
    t('Add a "hint" key to each dictionary. After a wrong answer, show the hint and allow one more try.', 'הוסיפו מפתח "hint" לכל מילון. אחרי תשובה שגויה, הציגו את הרמז ואפשרו ניסיון נוסף אחד.'),
    t('Use random.randint(0, len(questions) - 1) to pick a random question to start with.', 'השתמשו ב-`random.randint(0, len(questions) - 1)` כדי לבחור שאלה אקראית להתחיל בה.'),
    t('Wrap the whole quiz in a while loop that asks "Play again?" and keeps the best score across rounds.', 'עטפו את כל החידון בלולאת while ששואלת "Play again?" ושומרת את הניקוד הטוב ביותר בין הסיבובים.'),
  ],
  concepts: ['list', 'dictionary', 'nested-data', 'for-each', 'key-value', 'accumulator', 'function', 'return', 'if', 'program-structure'],
};
