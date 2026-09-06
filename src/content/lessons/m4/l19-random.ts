import type { Lesson } from '../../schema';
import {
  p,
  h,
  code,
  list,
  callout,
  term,
  viz,
  t,
  opt,
  choice,
  exercise,
  pythonTest,
  requires,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l19-random',
  moduleId: 'm4',
  title: t('Modules: random numbers and math tools', 'מודולים: מספרים אקראיים וכלי מתמטיקה'),
  tagline: t('Borrow ready-made tools with import.', 'שאלו כלים מוכנים בעזרת import.'),
  estimatedMinutes: 20,
  introduces: ['import', 'module', 'random-randint', 'math-module'],
  requires: ['variable', 'print', 'if', 'while', 'comparison', 'int', 'f-string', 'for', 'range', 'counter'],
  runsInBrowser: true,

  objective: t(
    'Import a module, get a random whole number with random.randint, use math.sqrt and math.pi, and combine random numbers with loops.',
    'לייבא מודול, לקבל מספר שלם אקראי בעזרת `random.randint`, להשתמש ב-`math.sqrt` וב-`math.pi`, ולשלב מספרים אקראיים עם לולאות.',
  ),
  prerequisiteCheck: t(
    'You can write for and while loops with a counter, and use if with comparisons (lessons 12, 15 and 16).',
    'אתם יודעים לכתוב לולאות for ו-while עם מונה, ולהשתמש ב-`if` עם השוואות (שיעורים 12, 15 ו-16).',
  ),

  explanation: [
    p(
      'Python comes with hundreds of ready-made tools that are not loaded until you ask for them. They are grouped into toolboxes called modules. Today you will use two: `random`, which produces random numbers for games and simulations, and `math`, which holds mathematical functions and constants.',
      'פייתון מגיע עם מאות כלים מוכנים שלא נטענים עד שמבקשים אותם. הם מקובצים בארגזי כלים שנקראים מודולים. היום תשתמשו בשניים: `random`, שמייצר מספרים אקראיים למשחקים ולסימולציות, ו-`math`, שמכיל פונקציות וקבועים מתמטיים.',
    ),
    term(
      'module',
      'A module is a file of ready-made Python tools — functions and values — that you can bring into your program. Python ships with many of them, so you do not write dice or square roots yourself.',
      'מודול (module) הוא קובץ של כלי פייתון מוכנים — פונקציות וערכים — שאפשר להכניס לתוכנית שלכם. פייתון מגיע עם רבים כאלה, ולכן אתם לא כותבים קוביות או שורשים ריבועיים בעצמכם.',
    ),
    term(
      'import',
      '`import random` loads the random module so your program can use it. Write it once, at the top of the program, before the lines that need it. Importing costs nothing if you never use the module, but forgetting it is an error.',
      '`import random` טוען את המודול random כדי שהתוכנית שלכם תוכל להשתמש בו. כתבו אותו פעם אחת, בראש התוכנית, לפני השורות שצריכות אותו. ייבוא (import) לא עולה כלום אם לא משתמשים במודול, אבל לשכוח אותו זו שגיאה.',
    ),
    code(py`
      import random

      number = random.randint(1, 6)
      print(number)
    `, {
      caption: t(
        'Prints a whole number from 1 to 6. Run it a few times: the number changes.',
        'מדפיס מספר שלם מ-1 עד 6. הריצו כמה פעמים: המספר משתנה.',
      ),
    }),
    term(
      '.',
      'The dot joins the module name and the tool inside it. `random.randint(1, 6)` means "the randint tool from the random module". Read `module.tool` as "the module\'s tool": module name first, then a dot, then the tool with its parentheses.',
      'הנקודה מחברת את שם המודול לכלי שבתוכו. `random.randint(1, 6)` פירושו "הכלי randint מהמודול random". קראו את `module.tool` כ"הכלי של המודול": קודם שם המודול, אחר כך נקודה, ואז הכלי עם הסוגריים שלו.',
    ),
    term(
      'random.randint(a, b)',
      '`random.randint(a, b)` gives a whole number from a to b. Unlike range, **both ends are included**: `random.randint(1, 6)` can give 1, 2, 3, 4, 5 or 6, exactly like a die. Every call gives a fresh number.',
      '`random.randint(a, b)` נותן מספר שלם מ-a עד b. בניגוד ל-range, **שני הקצוות כלולים**: `random.randint(1, 6)` יכול לתת 1, 2, 3, 4, 5 או 6, בדיוק כמו קובייה. כל קריאה נותנת מספר חדש.',
    ),
    callout(
      'note',
      'Random numbers make checking tricky: a program that prints a die roll can be right and still print something different every time. So during a check the app starts the random numbers from a fixed starting point (called a seed), and every check run of the same program sees the same numbers. You do not need to do anything about it.',
      'מספרים אקראיים מקשים על הבדיקה: תוכנית שמדפיסה הטלת קובייה יכולה להיות נכונה ועדיין להדפיס משהו אחר בכל פעם. לכן בזמן בדיקה האפליקציה מתחילה את המספרים האקראיים מנקודת התחלה קבועה (שנקראת seed), וכל הרצת בדיקה של אותה תוכנית רואה את אותם מספרים. אתם לא צריכים לעשות שום דבר בקשר לזה.',
      t('Random, but repeatable while checking', 'אקראי, אבל חוזר על עצמו בזמן בדיקה'),
    ),
    h('The math module', 'המודול math'),
    code(py`
      import math

      print(math.sqrt(16))
      print(math.pi)
    `, { output: '4.0\n3.141592653589793' }),
    p(
      '`math.sqrt(x)` gives the square root of x. Its answer is always a float, which is why 16 gives `4.0` and not `4`. `math.pi` is a **value**, not a function, so it has no parentheses: it is simply the number pi, ready to use in a calculation.',
      '`math.sqrt(x)` נותן את השורש הריבועי של x. התשובה שלו היא תמיד מספר עשרוני (float), ולכן 16 נותן `4.0` ולא `4`. `math.pi` הוא **ערך**, לא פונקציה, ולכן אין לו סוגריים: הוא פשוט המספר פאי, מוכן לשימוש בחישוב.',
    ),
    callout(
      'warning',
      'Using a module without importing it gives NameError: name \'random\' is not defined. Python is telling you it has never heard of that name. The fix is always the same: add the import line at the top.',
      'שימוש במודול בלי לייבא אותו נותן `NameError: name \'random\' is not defined`. פייתון אומר לכם שהוא מעולם לא שמע על השם הזה. התיקון תמיד זהה: הוסיפו את שורת ה-import בראש התוכנית.',
      t('Forgot the import?', 'שכחתם את ה-import?'),
    ),
  ],

  simpler: [
    p(
      'Think of a garage full of labelled toolboxes. The tools exist, but they are not in the room with you. `import random` carries the box labelled "random" into the room.',
      'חשבו על מוסך מלא בארגזי כלים עם תוויות. הכלים קיימים, אבל הם לא בחדר איתכם. `import random` מביא לחדר את הארגז עם התווית "random".',
    ),
    p(
      'To use a tool you say which box it came from: `random.randint` is "the randint tool from the random box". The dot is the word "from", written backwards.',
      'כדי להשתמש בכלי אומרים מאיזה ארגז הוא הגיע: `random.randint` הוא "הכלי randint מהארגז random". הנקודה היא המילה "מתוך", כתובה הפוך.',
    ),
    p(
      '`random.randint(1, 6)` is a die with faces 1 to 6. You choose the smallest and biggest face; the module rolls it for you and hands back one number.',
      '`random.randint(1, 6)` היא קובייה עם פאות 1 עד 6. אתם בוחרים את הפאה הקטנה והגדולה ביותר; המודול מטיל אותה בשבילכם ומחזיר מספר אחד.',
    ),
  ],

  workedExample: [
    p(
      'How many rolls does it take to get a 6? This program rolls until a 6 appears and counts the rolls. Press play to follow it; because the numbers are random, your run will take a different number of rounds.',
      'כמה הטלות צריך כדי לקבל 6? התוכנית הזאת מטילה קובייה עד שמופיע 6 וסופרת את ההטלות. לחצו על הפעלה כדי לעקוב; מכיוון שהמספרים אקראיים, ההרצה שלכם תיקח מספר שונה של סיבובים.',
    ),
    viz(py`
      import random

      rolls = 0
      dice = 0
      while dice != 6:
          dice = random.randint(1, 6)
          rolls += 1
      print(rolls)
    `),
    list([
      ['`import random` loads the module. `rolls` will count, and `dice` starts at 0 so that the condition `dice != 6` is True the first time.', '`import random` טוען את המודול. `rolls` יספור, ו-`dice` מתחיל ב-0 כדי שהתנאי `dice != 6` יהיה True בפעם הראשונה.'],
      ['Each round rolls the die into `dice` and adds one to `rolls`.', 'כל סיבוב מטיל את הקובייה לתוך `dice` ומוסיף אחד ל-`rolls`.'],
      ['When the roll is a 6, the condition becomes False and the loop ends. The count is printed.', 'כשההטלה היא 6, התנאי הופך ל-False והלולאה מסתיימת. הספירה מודפסת.'],
      ['This is a while loop, not a for loop, because nobody knows in advance how many rolls it will take.', 'זו לולאת while ולא לולאת for, כי אף אחד לא יודע מראש כמה הטלות זה ייקח.'],
    ], true),
    code(py`
      4
    `, { lang: 'text', caption: t('One possible output; yours may differ.', 'פלט אפשרי אחד; שלכם עשוי להיות שונה.'), runnable: false }),
  ],

  moreExamples: [
    [
      h('Heads or tails', 'עץ או פלי'),
      code(py`
        import random

        coin = random.randint(0, 1)
        if coin == 0:
            print("Heads")
        else:
            print("Tails")
      `),
      p(
        'A coin has two sides, so `random.randint(0, 1)` is enough: 0 means heads and 1 means tails. Any two-way decision can be made random this way.',
        'למטבע יש שני צדדים, ולכן `random.randint(0, 1)` מספיק: 0 פירושו עץ ו-1 פירושו פלי. כל החלטה דו-כיוונית יכולה להיעשות אקראית בדרך הזאת.',
      ),
    ],
    [
      h('A circle and a square root', 'מעגל ושורש ריבועי'),
      code(py`
        import math

        radius = 2
        area = math.pi * radius * radius
        print(area)
        print(math.sqrt(2))
      `, { output: '12.566370614359172\n1.4142135623730951' }),
      p(
        'The area of a circle is pi times the radius squared. `math.pi` is used inside the calculation like any number. The square root of 2 is not a whole number, so `math.sqrt(2)` gives a long float.',
        'שטח מעגל הוא פאי כפול הרדיוס בריבוע. `math.pi` משמש בתוך החישוב כמו כל מספר. השורש הריבועי של 2 אינו מספר שלם, ולכן `math.sqrt(2)` נותן מספר עשרוני ארוך.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l19-hard',
    title: ['Doubles', 'דאבל'],
    mode: 'write',
    instructions: [
      p(
        'Roll two dice at once, again and again, until both show the same number. Print each pair on its own line as the two numbers separated by a space, for example `2 5`. When the dice match, print that pair too and then exactly `Rolls until doubles: N`, where N is how many pairs were rolled.',
        'הטילו שתי קוביות בבת אחת, שוב ושוב, עד ששתיהן מראות את אותו מספר. הדפיסו כל זוג בשורה משלו כשני מספרים מופרדים ברווח, למשל `2 5`. כשהקוביות תואמות, הדפיסו גם את הזוג הזה ואחר כך בדיוק `Rolls until doubles: N`, כאשר N הוא כמה זוגות הוטלו.',
      ),
      code('2 5\n3 1\n4 4\nRolls until doubles: 3', { lang: 'text', runnable: false, caption: t('One possible output', 'פלט אפשרי אחד') }),
    ],
    starterCode: py`
      import random

      # roll two dice until they match

    `,
    check: {
      tests: [
        pythonTest(py`
          lines = [l.strip() for l in stdout.strip().split("\n") if l.strip()]
          assert len(lines) >= 2, "Print each pair of dice on its own line, then the final message."
          last = lines[-1]
          assert last.startswith("Rolls until doubles: "), "The last line must be 'Rolls until doubles: N'."
          n_text = last[len("Rolls until doubles: "):].strip()
          assert n_text.isdigit(), "N in the last line must be a whole number."
          pairs = lines[:-1]
          assert int(n_text) == len(pairs), "N must equal the number of pairs printed."
          for i, pair in enumerate(pairs):
              parts = pair.split()
              assert len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit(), "Print each pair as two numbers separated by a space, like 2 5."
              a, b = int(parts[0]), int(parts[1])
              assert 1 <= a <= 6 and 1 <= b <= 6, "Each die must be a whole number from 1 to 6."
              if i < len(pairs) - 1:
                  assert a != b, "Stop rolling as soon as the two dice are equal."
          assert pairs[-1].split()[0] == pairs[-1].split()[1], "The last pair printed must be the doubles."
          import random
          real = random.randint
          calls = []
          seq = [2, 5, 4, 4]
          def fake(a, b):
              calls.append((a, b))
              if len(calls) > 10000:
                  raise RuntimeError("too many rolls")
              return seq[(len(calls) - 1) % len(seq)]
          random.randint = fake
          try:
              out = run([])
          finally:
              random.randint = real
          assert calls and all(c == (1, 6) for c in calls), "Roll each die with random.randint(1, 6)."
          got = [l.strip() for l in out.strip().split("\n") if l.strip()]
          assert got == ["2 5", "4 4", "Rolls until doubles: 2"], "With the rolls 2, 5, 4, 4 the output should be '2 5', '4 4', 'Rolls until doubles: 2'."
        `),
      ],
      requires: [
        requires('\\bimport\\s+random\\b', 'Start with import random.', 'התחילו ב-`import random`.'),
        requires('random\\.randint\\(\\s*1\\s*,\\s*6\\s*\\)', 'Roll each die with random.randint(1, 6).', 'הטילו כל קובייה עם `random.randint(1, 6)`.'),
      ],
    },
    hints: [
      ['Use `while True:` and roll both dice inside the loop, each with its own `random.randint(1, 6)`.', 'השתמשו ב-`while True:` והטילו את שתי הקוביות בתוך הלולאה, כל אחת עם `random.randint(1, 6)` משלה.'],
      ['Count the rounds with `rolls += 1`, print the pair with `print(a, b)`, and `break` when `a == b`.', 'ספרו את הסיבובים עם `rolls += 1`, הדפיסו את הזוג עם `print(a, b)`, ו-`break` כש-`a == b`.'],
      ['After the loop: `print(f"Rolls until doubles: {rolls}")`.', 'אחרי הלולאה: `print(f"Rolls until doubles: {rolls}")`.'],
    ],
    solution: py`
      import random

      rolls = 0
      while True:
          a = random.randint(1, 6)
          b = random.randint(1, 6)
          rolls += 1
          print(a, b)
          if a == b:
              break
      print(f"Rolls until doubles: {rolls}")
    `,
    concepts: ['random-randint', 'while', 'break', 'counter'],
  }),

  predict: {
    code: py`
      import math

      print(math.sqrt(25))
      print(math.pi > 3)
    `,
    prompt: t('What does this program print?', 'מה התוכנית הזאת תדפיס?'),
    answer: '5.0\nTrue',
    explanation: t(
      'math.sqrt always gives a float, so the square root of 25 prints as 5.0, not 5. math.pi is about 3.14159, so the comparison pi > 3 is True.',
      '`math.sqrt` תמיד נותן מספר עשרוני, ולכן השורש של 25 מודפס כ-5.0 ולא כ-5. `math.pi` הוא בערך 3.14159, ולכן ההשוואה pi > 3 היא True.',
    ),
  },

  exercise: exercise({
    id: 'l19-ex',
    title: ['Five rolls', 'חמש הטלות'],
    mode: 'write',
    instructions: [
      p(
        'Roll a six-sided die five times with a for loop. Print each roll on its own line — just the number, nothing else. Every line must be a whole number from 1 to 6.',
        'הטילו קובייה בעלת שש פאות חמש פעמים בעזרת לולאת for. הדפיסו כל הטלה בשורה משלה — רק המספר, בלי שום דבר נוסף. כל שורה חייבת להיות מספר שלם מ-1 עד 6.',
      ),
    ],
    starterCode: py`
      import random

      # roll the die five times and print each roll

    `,
    check: {
      tests: [
        pythonTest(py`
          lines = [l.strip() for l in stdout.strip().split("\n") if l.strip()]
          assert len(lines) == 5, "Print exactly five lines, one roll per line."
          for l in lines:
              assert l.isdigit() and 1 <= int(l) <= 6, "Each line must be a whole number from 1 to 6."
          import random
          real = random.randint
          calls = []
          seq = [4, 1, 6, 2, 5]
          def fake(a, b):
              calls.append((a, b))
              if len(calls) > 10000:
                  raise RuntimeError("too many rolls")
              return seq[(len(calls) - 1) % len(seq)]
          random.randint = fake
          try:
              out = run([])
          finally:
              random.randint = real
          assert calls and all(c == (1, 6) for c in calls), "Call random.randint(1, 6) for every roll."
          got = [l.strip() for l in out.strip().split("\n") if l.strip()]
          assert got == ["4", "1", "6", "2", "5"], "Print the number that random.randint gave you, one per line and nothing else."
        `),
      ],
      requires: [
        requires('\\bimport\\s+random\\b', 'Start with import random.', 'התחילו ב-`import random`.'),
        requires('random\\.randint\\(\\s*1\\s*,\\s*6\\s*\\)', 'Roll with random.randint(1, 6).', 'הטילו עם `random.randint(1, 6)`.'),
        requires('\\bfor\\b', 'Use a for loop for the five rolls.', 'השתמשו בלולאת for עבור חמש ההטלות.'),
      ],
    },
    hints: [
      ['Five rounds means `for i in range(5):`.', 'חמישה סיבובים פירושם `for i in range(5):`.'],
      ['Inside the loop, roll with `random.randint(1, 6)` and store the result in a variable.', 'בתוך הלולאה, הטילו עם `random.randint(1, 6)` ושמרו את התוצאה במשתנה.'],
      ['`dice = random.randint(1, 6)` and then `print(dice)`, both indented inside the loop.', '`dice = random.randint(1, 6)` ואז `print(dice)`, שניהם מוזחים בתוך הלולאה.'],
    ],
    solution: py`
      import random

      for i in range(5):
          dice = random.randint(1, 6)
          print(dice)
    `,
    concepts: ['import', 'random-randint', 'for'],
  }),

  build: exercise({
    id: 'l19-build',
    title: ['Rolling for a six', 'מטילים עד שש'],
    mode: 'build',
    instructions: [
      p(
        'Build a small experiment. Roll a die again and again until it shows a 6. Print every roll on its own line, including the final 6. After the loop print exactly `Rolls until 6: N`, where N is the number of rolls it took. A possible output:',
        'בנו ניסוי קטן. הטילו קובייה שוב ושוב עד שהיא מראה 6. הדפיסו כל הטלה בשורה משלה, כולל ה-6 האחרון. אחרי הלולאה הדפיסו בדיוק `Rolls until 6: N`, כאשר N הוא מספר ההטלות שנדרשו. פלט אפשרי:',
      ),
      code('3\n5\n6\nRolls until 6: 3', { lang: 'text', runnable: false }),
      p(
        'You do not know in advance how many rolls it will take, so this is a job for a while loop.',
        'אתם לא יודעים מראש כמה הטלות זה ייקח, ולכן זו עבודה ללולאת while.',
      ),
    ],
    starterCode: py`
      import random

      # roll until you get a 6, printing every roll
      # then print how many rolls it took

    `,
    check: {
      tests: [
        pythonTest(py`
          lines = [l.strip() for l in stdout.strip().split("\n") if l.strip()]
          assert len(lines) >= 2, "Print every roll on its own line, then the final message."
          last = lines[-1]
          assert last.startswith("Rolls until 6: "), "The last line must be 'Rolls until 6: N'."
          n_text = last[len("Rolls until 6: "):].strip()
          assert n_text.isdigit(), "N in the last line must be a whole number."
          rolls = lines[:-1]
          assert int(n_text) == len(rolls), "N must equal the number of rolls printed."
          for r in rolls:
              assert r.isdigit() and 1 <= int(r) <= 6, "Each roll must be a whole number from 1 to 6."
          for r in rolls[:-1]:
              assert r != "6", "Stop rolling as soon as a 6 appears."
          assert rolls[-1] == "6", "The last roll printed must be the 6."
          import random
          real = random.randint
          calls = []
          seq = [3, 5, 6]
          def fake(a, b):
              calls.append((a, b))
              if len(calls) > 10000:
                  raise RuntimeError("too many rolls")
              return seq[(len(calls) - 1) % len(seq)]
          random.randint = fake
          try:
              out = run([])
          finally:
              random.randint = real
          assert calls and all(c == (1, 6) for c in calls), "Roll with random.randint(1, 6)."
          got = [l.strip() for l in out.strip().split("\n") if l.strip()]
          assert got == ["3", "5", "6", "Rolls until 6: 3"], "With the rolls 3, 5, 6 the output should be 3, 5, 6 and then 'Rolls until 6: 3'."
        `),
      ],
      requires: [
        requires('\\bimport\\s+random\\b', 'Start with import random.', 'התחילו ב-`import random`.'),
        requires('random\\.randint\\(\\s*1\\s*,\\s*6\\s*\\)', 'Roll with random.randint(1, 6).', 'הטילו עם `random.randint(1, 6)`.'),
        requires('\\bwhile\\b', 'Use a while loop; the number of rolls is unknown.', 'השתמשו בלולאת while; מספר ההטלות לא ידוע.'),
      ],
    },
    hints: [
      ['Start a counter at 0 and a `dice` variable at 0, then loop while `dice != 6`.', 'התחילו מונה ב-0 ומשתנה `dice` ב-0, ואז חזרו בלולאה כל עוד `dice != 6`.'],
      ['Inside the loop: roll into `dice`, add one to the counter, and print `dice`.', 'בתוך הלולאה: הטילו לתוך `dice`, הוסיפו אחד למונה, והדפיסו את `dice`.'],
      ['After the loop: `print(f"Rolls until 6: {rolls}")`.', 'אחרי הלולאה: `print(f"Rolls until 6: {rolls}")`.'],
    ],
    solution: py`
      import random

      rolls = 0
      dice = 0
      while dice != 6:
          dice = random.randint(1, 6)
          rolls += 1
          print(dice)
      print(f"Rolls until 6: {rolls}")
    `,
    solutionNote: [
      'A `while True:` loop that breaks after printing a 6 is also correct.',
      'גם לולאת `while True:` שיוצאת עם break אחרי הדפסת 6 היא פתרון נכון.',
    ],
    concepts: ['random-randint', 'while', 'counter', 'f-string'],
  }),

  check: [
    choice(
      'l19-c1',
      ['Which values can `random.randint(1, 3)` give?', 'אילו ערכים `random.randint(1, 3)` יכול לתת?'],
      [
        opt('1, 2 or 3', '1, 2 או 3', {
          correct: true,
          feedback: ['Right. Unlike range, randint includes both ends.', 'נכון. בניגוד ל-range, randint כולל את שני הקצוות.'],
        }),
        opt('1 or 2', '1 או 2', {
          feedback: ['That is how range behaves. randint includes the last value too, so 3 is possible.', 'כך range מתנהג. randint כולל גם את הערך האחרון, ולכן 3 אפשרי.'],
        }),
        opt('0, 1, 2 or 3', '0, 1, 2 או 3', {
          feedback: ['The first number, 1, is the smallest possible result. 0 cannot appear.', 'המספר הראשון, 1, הוא התוצאה הקטנה ביותר האפשרית. 0 לא יכול להופיע.'],
        }),
        opt('Any decimal between 1 and 3, such as 2.37', 'כל מספר עשרוני בין 1 ל-3, כמו 2.37', {
          feedback: ['randint gives whole numbers only; the "int" in its name says so.', 'randint נותן מספרים שלמים בלבד; ה-"int" בשמו אומר זאת.'],
        }),
      ],
      ['random-randint'],
    ),
    choice(
      'l19-c2',
      ['A program calls `random.randint(1, 6)` but has no `import random` line. What happens?', 'תוכנית קוראת ל-`random.randint(1, 6)` אבל אין בה שורת `import random`. מה קורה?'],
      [
        opt('A NameError: Python does not know the name random.', 'שגיאת NameError: פייתון לא מכיר את השם random.', {
          correct: true,
          feedback: ['Correct. The module exists, but it is not loaded until you import it.', 'נכון. המודול קיים, אבל הוא לא נטען עד שמייבאים אותו.'],
        }),
        opt('It works, because random is built into Python.', 'זה עובד, כי random מובנה בפייתון.', {
          feedback: ['random ships with Python, but like every module it must be imported before use.', 'random מגיע עם פייתון, אבל כמו כל מודול צריך לייבא אותו לפני השימוש.'],
        }),
        opt('It always returns 0.', 'זה תמיד מחזיר 0.', {
          feedback: ['Python never guesses a value for an unknown name; it stops with an error.', 'פייתון אף פעם לא מנחש ערך לשם לא מוכר; הוא עוצר עם שגיאה.'],
        }),
      ],
      ['import', 'module'],
    ),
    choice(
      'l19-c3',
      ['After `import math`, which line prints the value of pi?', 'אחרי `import math`, איזו שורה מדפיסה את הערך של פאי?'],
      [
        opt('`print(math.pi)`', '`print(math.pi)`', {
          correct: true,
          feedback: ['Yes. pi is a value inside the math module, reached with a dot and no parentheses.', 'כן. pi הוא ערך בתוך המודול math, שמגיעים אליו עם נקודה ובלי סוגריים.'],
        }),
        opt('`print(math.pi())`', '`print(math.pi())`', {
          feedback: ['pi is a number, not a function, so it cannot be called with parentheses. That line is an error.', 'pi הוא מספר, לא פונקציה, ולכן אי אפשר לקרוא לו עם סוגריים. השורה הזאת היא שגיאה.'],
        }),
        opt('`print(pi)`', '`print(pi)`', {
          feedback: ['Without the module name Python does not know what pi is. Write `math.pi`.', 'בלי שם המודול פייתון לא יודע מה זה pi. כתבו `math.pi`.'],
        }),
      ],
      ['math-module'],
    ),
  ],

  recap: [
    list([
      ['A module is a toolbox of ready-made functions and values; `import random` loads it.', 'מודול הוא ארגז כלים של פונקציות וערכים מוכנים; `import random` טוען אותו.'],
      ['`module.tool` reaches a tool inside a module: `random.randint`, `math.sqrt`, `math.pi`.', '`module.tool` מגיע לכלי בתוך מודול: `random.randint`, `math.sqrt`, `math.pi`.'],
      ['`random.randint(a, b)` gives a whole number from a to b, both included.', '`random.randint(a, b)` נותן מספר שלם מ-a עד b, כולל שניהם.'],
      ['`math.sqrt` returns a float; `math.pi` is a value with no parentheses.', '`math.sqrt` מחזיר מספר עשרוני; `math.pi` הוא ערך בלי סוגריים.'],
      ['Random numbers plus a while loop let you repeat until luck strikes, like rolling for a 6.', 'מספרים אקראיים ולולאת while מאפשרים לחזור עד שהמזל מגיע, כמו להטיל עד שיוצא 6.'],
    ]),
    p(
      'You can now use tools that other people wrote. The Python standard library has modules for dates, files, text and much more, and they all work the same way: import, then module.tool.',
      'עכשיו אתם יכולים להשתמש בכלים שאנשים אחרים כתבו. הספרייה הסטנדרטית של פייתון כוללת מודולים לתאריכים, קבצים, טקסט ועוד הרבה, וכולם עובדים באותה דרך: import, ואז `module.tool`.',
    ),
  ],
  next: t(
    'You are ready for the guessing-game project, and then for the next module, where you will write functions — tools of your own, just like the ones you imported.',
    'אתם מוכנים לפרויקט משחק הניחושים, ואחריו למודול הבא, שבו תכתבו פונקציות — כלים משלכם, בדיוק כמו אלה שייבאתם.',
  ),
};
