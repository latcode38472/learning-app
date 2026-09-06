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
  outputTest,
  requires,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l13-elif',
  moduleId: 'm3',
  title: t('elif: more than two paths', 'elif: יותר משני מסלולים'),
  tagline: t('Check several conditions in order; only the first true one runs.', 'בודקים כמה תנאים לפי הסדר; רק הראשון שמתקיים רץ.'),
  estimatedMinutes: 20,
  introduces: ['elif', 'condition-order'],
  requires: ['if', 'else', 'comparison', 'input', 'type-conversion'],
  runsInBrowser: true,

  objective: t(
    'Use elif to choose between three or more paths, order the conditions correctly, and tell an if/elif chain apart from separate ifs.',
    'להשתמש ב-`elif` כדי לבחור בין שלושה מסלולים או יותר, לסדר את התנאים נכון, ולהבדיל בין שרשרת `if`/`elif` לבין משפטי `if` נפרדים.',
  ),
  prerequisiteCheck: t(
    'You can write if and else with an indented block, and read a number with int(input(...)) (lessons 9 and 12).',
    'אתם יודעים לכתוב `if` ו-`else` עם בלוק מוזח, ולקרוא מספר בעזרת `int(input(...))` (שיעורים 9 ו-12).',
  ),

  explanation: [
    p(
      '`if` and `else` choose between two paths. Real decisions often have more: a temperature can be hot, warm, cool or cold; a score can become A, B, C or F. Python adds extra paths to the same decision with `elif`.',
      '`if` ו-`else` בוחרים בין שני מסלולים. להחלטות אמיתיות יש לעיתים קרובות יותר: טמפרטורה יכולה להיות חמה, נעימה, קרירה או קרה; ציון יכול להפוך ל-A, B, C או F. פייתון מוסיף מסלולים נוספים לאותה החלטה בעזרת `elif`.',
    ),
    term(
      'elif',
      'Short for "else if". It is written after an `if` block, at the same indentation as the `if`, with its own condition, colon and block. It means: "the condition above was false — check this one instead." You may use as many `elif` lines as you need, and an optional `else` at the end for "none of the above".',
      'קיצור של "else if" (אחרת, אם). כותבים אותו אחרי בלוק של `if`, באותה הזחה כמו ה-`if`, עם תנאי משלו, נקודתיים ובלוק. פירושו: "התנאי שלמעלה לא התקיים — בדוק את זה במקום." אפשר להשתמש בכמה שורות `elif` שצריך, ובסוף `else` לפי הצורך, עבור "אף אחד מהמקרים".',
    ),
    code(py`
      temperature = 18
      if temperature >= 30:
          print("Hot")
      elif temperature >= 20:
          print("Warm")
      elif temperature >= 10:
          print("Cool")
      else:
          print("Cold")
    `, { output: 'Cool' }),
    p(
      'Python reads the chain from top to bottom. `18 >= 30` is `False`, so it moves on. `18 >= 20` is `False` too. `18 >= 10` is `True`: this block runs, and Python **skips everything else in the chain**, including the `else`. The whole `if`/`elif`/`else` is one decision, and at most one of its blocks runs.',
      'פייתון קורא את השרשרת מלמעלה למטה. `18 >= 30` הוא `False`, אז הוא ממשיך הלאה. גם `18 >= 20` הוא `False`. `18 >= 10` הוא `True`: הבלוק הזה רץ, ופייתון **מדלג על כל שאר השרשרת**, כולל ה-`else`. כל ה-`if`/`elif`/`else` הוא החלטה אחת, ולכל היותר בלוק אחד ממנה רץ.',
    ),
    h('Order matters', 'הסדר קובע'),
    p(
      'Because only the **first** true condition wins, the order of the conditions changes the result. Here is a grade program written in the wrong order:',
      'מכיוון שרק התנאי **הראשון** שמתקיים מנצח, סדר התנאים משנה את התוצאה. הנה תוכנית ציונים שכתובה בסדר הלא נכון:',
    ),
    code(py`
      score = 95
      if score >= 70:
          print("C")
      elif score >= 80:
          print("B")
      elif score >= 90:
          print("A")
    `, { output: 'C' }),
    callout(
      'warning',
      '95 is at least 70, so the first condition is already `True` and the program prints `C`. The later conditions would also be true, but they are never even checked. With "at least" (`>=`) conditions, put the **largest** threshold first; with "less than" (`<`) conditions, put the **smallest** first. Then every value lands in the right branch.',
      '95 הוא לפחות 70, ולכן התנאי הראשון כבר `True` והתוכנית מדפיסה `C`. גם התנאים הבאים היו מתקיימים, אבל הם בכלל לא נבדקים. בתנאים מסוג "לפחות" (`>=`) שימו את הסף **הגדול** ביותר ראשון; בתנאים מסוג "קטן מ-" (`<`) שימו את הסף **הקטן** ביותר ראשון. כך כל ערך יגיע לענף הנכון.',
      t('Condition order', 'סדר התנאים'),
    ),
    h('One chain or separate ifs?', 'שרשרת אחת או משפטי if נפרדים?'),
    p(
      'Two `if` lines in a row are two **separate** decisions: each condition is checked, and both blocks can run. An `if` followed by `elif` is **one** decision: after a true branch, the rest is skipped. Compare:',
      'שני משפטי `if` בזה אחר זה הם שתי החלטות **נפרדות**: כל תנאי נבדק, ושני הבלוקים יכולים לרוץ. `if` ואחריו `elif` הם החלטה **אחת**: אחרי ענף שהתקיים, מדלגים על השאר. השוו:',
    ),
    code(py`
      n = 15
      if n > 10:
          print("more than 10")
      if n > 5:
          print("more than 5")
    `, { output: 'more than 10\nmore than 5' }),
    code(py`
      n = 15
      if n > 10:
          print("more than 10")
      elif n > 5:
          print("more than 5")
    `, { output: 'more than 10' }),
    callout(
      'tip',
      'Rule of thumb: when exactly one of the answers should happen (a grade, a category, a price band), use one `if`/`elif`/`else` chain. When several things may need to happen independently (add a bonus **and** show a warning), use separate `if` statements.',
      'כלל אצבע: כשבדיוק תשובה אחת צריכה לקרות (ציון, קטגוריה, מדרגת מחיר), השתמשו בשרשרת `if`/`elif`/`else` אחת. כשכמה דברים עשויים לקרות בלי קשר זה לזה (להוסיף בונוס **וגם** להציג אזהרה), השתמשו במשפטי `if` נפרדים.',
    ),
  ],

  simpler: [
    p(
      'Think of sorting parcels onto three shelves. You ask the questions in order: "Is it heavy?" If yes, top shelf, done. If not: "Is it medium?" If yes, middle shelf, done. Otherwise: bottom shelf. Every parcel lands on exactly one shelf.',
      'חשבו על מיון חבילות לשלושה מדפים. שואלים את השאלות לפי הסדר: "האם היא כבדה?" אם כן — מדף עליון, וסיימנו. אם לא: "האם היא בינונית?" אם כן — מדף אמצעי, וסיימנו. אחרת: מדף תחתון. כל חבילה מגיעה בדיוק למדף אחד.',
    ),
    p(
      '`elif` is the "if not, then is it...?" question. `else` is the "otherwise" shelf at the end.',
      '`elif` היא השאלה "אם לא, אז האם היא...?". `else` הוא מדף ה"אחרת" שבסוף.',
    ),
    p(
      'The order of the questions matters. If the first question were "Is it more than 1 kg?", every heavy parcel would also answer yes and land on the wrong shelf. Ask the strictest question first.',
      'סדר השאלות חשוב. אם השאלה הראשונה הייתה "האם היא שוקלת יותר מקילו?", גם כל חבילה כבדה הייתה עונה כן ומגיעה למדף הלא נכון. שאלו קודם את השאלה המחמירה ביותר.',
    ),
    p(
      'Separate `if` lines are separate questions asked about every parcel, so a parcel can get several stickers. One `if`/`elif` chain gives it exactly one.',
      'משפטי `if` נפרדים הם שאלות נפרדות ששואלים על כל חבילה, ולכן חבילה יכולה לקבל כמה מדבקות. שרשרת `if`/`elif` אחת נותנת לה בדיוק אחת.',
    ),
  ],

  workedExample: [
    p(
      'Step through this program and watch Python test the conditions one by one until one of them is true.',
      'עברו על התוכנית צעד אחר צעד וצפו בפייתון בודק את התנאים בזה אחר זה עד שאחד מהם מתקיים.',
    ),
    viz(py`
      score = 83
      if score >= 90:
          grade = "A"
      elif score >= 80:
          grade = "B"
      elif score >= 70:
          grade = "C"
      else:
          grade = "F"
      print("Grade:", grade)
    `),
    list([
      ['Line 1: `score` holds 83.', 'שורה 1: `score` מחזיק 83.'],
      ['Line 2: `83 >= 90` is `False`, so line 3 is skipped.', 'שורה 2: `83 >= 90` הוא `False`, ולכן מדלגים על שורה 3.'],
      ['Line 4: `83 >= 80` is `True`. Line 5 stores `"B"` in `grade`, and Python jumps past the rest of the chain.', 'שורה 4: `83 >= 80` הוא `True`. שורה 5 שומרת `"B"` בתוך `grade`, ופייתון קופץ אל מעבר לשאר השרשרת.'],
      ['Lines 6–9 are never checked. Line 10 prints `Grade: B`.', 'שורות 6–9 בכלל לא נבדקות. שורה 10 מדפיסה `Grade: B`.'],
      ['Try `score = 95` and then `score = 40`, and watch which line stores the grade each time.', 'נסו `score = 95` ואחר כך `score = 40`, וצפו איזו שורה שומרת את הציון בכל פעם.'],
    ], true),
    code(py`
      Grade: B
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('Which number is bigger?', 'איזה מספר גדול יותר?'),
      code(py`
        a = 4
        b = 9
        if a > b:
            print("a is bigger")
        elif a < b:
            print("b is bigger")
        else:
            print("they are equal")
      `, { output: 'b is bigger' }),
      p(
        'Three possibilities, three branches. The `else` catches the only case left: `a == b`.',
        'שלוש אפשרויות, שלושה ענפים. ה-`else` תופס את המקרה היחיד שנשאר: `a == b`.',
      ),
    ],
    [
      h('A greeting for the time of day', 'ברכה לפי שעת היום'),
      code(py`
        hour = 14
        if hour < 12:
            print("Good morning")
        elif hour < 18:
            print("Good afternoon")
        else:
            print("Good evening")
      `, { output: 'Good afternoon' }),
      p(
        'With "less than" conditions, the smallest limit comes first. 14 is not less than 12, but it is less than 18, so the second branch runs.',
        'בתנאים מסוג "קטן מ-", הגבול הקטן ביותר בא ראשון. 14 אינו קטן מ-12, אבל הוא קטן מ-18, ולכן הענף השני רץ.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l13-hard',
    title: ['Shipping cost', 'עלות משלוח'],
    mode: 'write',
    instructions: [
      p(
        'Ask for the weight of a parcel in whole kilograms (any prompt text). The shipping cost is 5 for up to 1 kg, 10 for up to 5 kg, 20 for up to 20 kg, and 50 for anything heavier. Print one line in the form `Cost: 10`. Think about the order of the conditions before you write them.',
        'בקשו את משקל החבילה בקילוגרמים שלמים (טקסט הבקשה חופשי). עלות המשלוח היא 5 עד 1 ק"ג, 10 עד 5 ק"ג, 20 עד 20 ק"ג, ו-50 לכל משקל כבד יותר. הדפיסו שורה אחת בצורה `Cost: 10`. חשבו על סדר התנאים לפני שאתם כותבים אותם.',
      ),
    ],
    starterCode: py`
      weight = int(input("Weight in kg: "))
      # work out the cost and print it as "Cost: <number>"

    `,
    sampleStdin: ['3'],
    check: {
      tests: [
        outputTest('Cost: 5', { stdin: ['1'] }),
        outputTest('Cost: 10', { stdin: ['3'] }),
        outputTest('Cost: 10', { stdin: ['5'] }),
        outputTest('Cost: 20', { stdin: ['20'] }),
        outputTest('Cost: 50', { stdin: ['21'] }),
        outputTest('Cost: 5', { stdin: ['0'] }),
      ],
      requires: [requires('\\belif\\b', 'Use elif for the middle cases.', 'השתמשו ב-elif עבור המקרים האמצעיים.')],
    },
    hints: [
      ['"Up to 1 kg" is `weight <= 1`. With "up to" conditions, start from the smallest limit.', '"עד 1 ק"ג" הוא `weight <= 1`. בתנאים מסוג "עד", התחילו מהגבול הקטן ביותר.'],
      ['`if weight <= 1:` cost 5, `elif weight <= 5:` cost 10, `elif weight <= 20:` cost 20, `else:` cost 50.', '`if weight <= 1:` עלות 5, `elif weight <= 5:` עלות 10, `elif weight <= 20:` עלות 20, `else:` עלות 50.'],
      ['Store the cost in a variable in each branch, then print once: `print("Cost:", cost)`.', 'שמרו את העלות במשתנה בכל ענף, ואז הדפיסו פעם אחת: `print("Cost:", cost)`.'],
    ],
    solution: py`
      weight = int(input("Weight in kg: "))
      if weight <= 1:
          cost = 5
      elif weight <= 5:
          cost = 10
      elif weight <= 20:
          cost = 20
      else:
          cost = 50
      print("Cost:", cost)
    `,
    concepts: ['elif', 'condition-order', 'if', 'else'],
  }),

  predict: {
    code: py`
      n = 25
      if n > 10:
          print("big")
      elif n > 20:
          print("huge")
      else:
          print("small")
    `,
    prompt: t('What does this program print?', 'מה התוכנית הזאת תדפיס?'),
    answer: 'big',
    explanation: t(
      '25 > 10 is True, so the first block runs and prints big. The elif is never checked, even though 25 > 20 is also True. If the author wanted huge for 25, the n > 20 condition had to come first.',
      '25 > 10 הוא True, ולכן הבלוק הראשון רץ ומדפיס big. ה-elif בכלל לא נבדק, למרות ש-25 > 20 הוא גם True. אם הכותב רצה huge עבור 25, התנאי n > 20 היה צריך לבוא ראשון.',
    ),
  },

  exercise: exercise({
    id: 'l13-ex',
    title: ['Grade letters', 'ציון באותיות'],
    mode: 'complete',
    instructions: [
      p(
        'Complete the program so that it reads a score and prints one letter: `A` for 90 and above, `B` for 80 and above, `C` for 70 and above, and `F` for anything lower. The `A` and `F` branches are already written; add the two missing `elif` branches in the marked places.',
        'השלימו את התוכנית כך שתקרא ציון ותדפיס אות אחת: `A` ל-90 ומעלה, `B` ל-80 ומעלה, `C` ל-70 ומעלה, ו-`F` לכל ציון נמוך יותר. הענפים של `A` ושל `F` כבר כתובים; הוסיפו את שני ענפי ה-`elif` החסרים במקומות המסומנים.',
      ),
    ],
    starterCode: py`
      score = int(input("Score: "))
      if score >= 90:
          print("A")
      # ... add an elif for 80 and above that prints B

      # ... add an elif for 70 and above that prints C

      else:
          print("F")
    `,
    sampleStdin: ['85'],
    check: {
      tests: [
        outputTest('A', { stdin: ['95'] }),
        outputTest('A', { stdin: ['90'] }),
        outputTest('B', { stdin: ['85'] }),
        outputTest('B', { stdin: ['80'] }),
        outputTest('C', { stdin: ['72'] }),
        outputTest('C', { stdin: ['70'] }),
        outputTest('F', { stdin: ['69'] }),
        outputTest('F', { stdin: ['0'] }),
      ],
      requires: [requires('\\belif\\b', 'Use elif for the B and C branches.', 'השתמשו ב-elif עבור הענפים של B ו-C.')],
    },
    hints: [
      ['An `elif` line looks like the `if` line: `elif score >= 80:` with a colon at the end.', 'שורת `elif` נראית כמו שורת ה-`if`: `elif score >= 80:` עם נקודתיים בסוף.'],
      ['Under each `elif`, indent the print by four spaces, exactly like under the `if`.', 'מתחת לכל `elif`, הזיחו את ההדפסה בארבעה רווחים, בדיוק כמו מתחת ל-`if`.'],
      ['`elif score >= 80:` prints B and `elif score >= 70:` prints C. Keep them in this order, between the if and the else.', '`elif score >= 80:` מדפיס B ו-`elif score >= 70:` מדפיס C. שמרו על הסדר הזה, בין ה-if ל-else.'],
    ],
    solution: py`
      score = int(input("Score: "))
      if score >= 90:
          print("A")
      elif score >= 80:
          print("B")
      elif score >= 70:
          print("C")
      else:
          print("F")
    `,
    concepts: ['elif', 'condition-order', 'if', 'else'],
  }),

  build: exercise({
    id: 'l13-build',
    title: ['A traffic light', 'רמזור'],
    mode: 'build',
    instructions: [
      p(
        'Build a traffic-light helper. Ask for a colour word (any prompt text). For `red` print `Stop`, for `yellow` print `Slow down`, for `green` print `Go`, and for any other word print `Unknown color`. Capital letters must not matter: `Red` and `RED` count as `red`.',
        'בנו עוזר רמזור. בקשו מילת צבע (טקסט הבקשה חופשי). עבור `red` הדפיסו `Stop`, עבור `yellow` הדפיסו `Slow down`, עבור `green` הדפיסו `Go`, ועבור כל מילה אחרת הדפיסו `Unknown color`. גודל האותיות לא אמור לשנות: `Red` ו-`RED` נחשבים `red`.',
      ),
    ],
    starterCode: py`
      color = input("Color: ")
      # print Stop, Slow down, Go, or Unknown color

    `,
    sampleStdin: ['red'],
    check: {
      tests: [
        outputTest('Stop', { stdin: ['red'] }),
        outputTest('Go', { stdin: ['Green'] }),
        outputTest('Slow down', { stdin: ['YELLOW'] }),
        outputTest('Unknown color', { stdin: ['blue'] }),
        outputTest('Go', { stdin: ['green'] }),
      ],
    },
    hints: [
      ['Turn the input into lowercase first: `color = input("Color: ").lower()`.', 'הפכו קודם את הקלט לאותיות קטנות: `color = input("Color: ").lower()`.'],
      ['Compare text with `==`: `if color == "red":` and so on, one branch per colour.', 'השוו טקסט בעזרת `==`: `if color == "red":` וכן הלאה, ענף אחד לכל צבע.'],
      ['The `else` branch at the end handles every other word with `print("Unknown color")`.', 'ענף ה-`else` בסוף מטפל בכל מילה אחרת בעזרת `print("Unknown color")`.'],
    ],
    solution: py`
      color = input("Color: ").lower()
      if color == "red":
          print("Stop")
      elif color == "yellow":
          print("Slow down")
      elif color == "green":
          print("Go")
      else:
          print("Unknown color")
    `,
    solutionNote: [
      'The order of the three colour branches does not matter here, because a word can only equal one of them.',
      'סדר שלושת ענפי הצבעים לא משנה כאן, כי מילה יכולה להיות שווה רק לאחד מהם.',
    ],
    concepts: ['elif', 'else', 'equality', 'upper-lower', 'input'],
  }),

  check: [
    choice(
      'l13-c1',
      ['In one `if` / `elif` / `elif` / `else` chain, how many of the blocks run?', 'בשרשרת אחת של `if` / `elif` / `elif` / `else`, כמה מהבלוקים רצים?'],
      [
        opt('Exactly one: the first whose condition is True, or the else if none is.', 'בדיוק אחד: הראשון שהתנאי שלו True, או ה-else אם אף אחד לא מתקיים.', {
          correct: true,
          feedback: ['Right. The chain is one decision, and Python stops checking after the first true condition.', 'נכון. השרשרת היא החלטה אחת, ופייתון מפסיק לבדוק אחרי התנאי הראשון שמתקיים.'],
        }),
        opt('Every block whose condition is True.', 'כל בלוק שהתנאי שלו True.', {
          feedback: ['That describes separate if statements. In a chain, the later conditions are not even checked.', 'זה מתאר משפטי if נפרדים. בשרשרת, התנאים הבאים בכלל לא נבדקים.'],
        }),
        opt('Always the first block.', 'תמיד הבלוק הראשון.', {
          feedback: ['The first block runs only if its condition is True; otherwise Python moves on to the elif lines.', 'הבלוק הראשון רץ רק אם התנאי שלו True; אחרת פייתון ממשיך לשורות ה-elif.'],
        }),
        opt('Always the else block.', 'תמיד הבלוק של ה-else.', {
          feedback: ['The else block runs only when every condition above it was False.', 'הבלוק של ה-else רץ רק כשכל התנאים שמעליו היו False.'],
        }),
      ],
      ['elif'],
    ),
    choice(
      'l13-c2',
      [
        p('`x` holds 500. What does this print?', '`x` מחזיק 500. מה זה מדפיס?'),
        code(py`
          if x >= 10:
              print("big")
          elif x >= 100:
              print("huge")
        `, { runnable: false }),
      ],
      [
        opt('`big`', '`big`', {
          correct: true,
          feedback: ['Yes. 500 >= 10 is True, so big prints and the elif is skipped. To get huge for large numbers, the >= 100 condition must come first.', 'כן. 500 >= 10 הוא True, ולכן big מודפס ומדלגים על ה-elif. כדי לקבל huge למספרים גדולים, התנאי >= 100 חייב לבוא ראשון.'],
        }),
        opt('`huge`', '`huge`', {
          feedback: ['500 >= 100 is True, but Python never gets there: the first condition already won.', '500 >= 100 הוא True, אבל פייתון אף פעם לא מגיע לשם: התנאי הראשון כבר ניצח.'],
        }),
        opt('`big` and then `huge`', '`big` ואז `huge`', {
          feedback: ['Only one block of an if/elif chain runs. Both would run only with two separate if statements.', 'רק בלוק אחד משרשרת if/elif רץ. שניהם היו רצים רק עם שני משפטי if נפרדים.'],
        }),
        opt('Nothing', 'כלום', {
          feedback: ['The first condition is True, so its block prints big.', 'התנאי הראשון הוא True, ולכן הבלוק שלו מדפיס big.'],
        }),
      ],
      ['condition-order', 'elif'],
    ),
    choice(
      'l13-c3',
      ['When should you write two separate `if` statements instead of `if` / `elif`?', 'מתי כדאי לכתוב שני משפטי `if` נפרדים במקום `if` / `elif`?'],
      [
        opt('When both things may need to happen for the same value.', 'כשייתכן ששני הדברים צריכים לקרות עבור אותו ערך.', {
          correct: true,
          feedback: ['Correct. Separate ifs are separate decisions; each one is checked on its own.', 'נכון. משפטי if נפרדים הם החלטות נפרדות; כל אחד נבדק בנפרד.'],
        }),
        opt('Never; elif is always better.', 'אף פעם; elif תמיד עדיף.', {
          feedback: ['elif is right when exactly one branch should run. Sometimes several things must happen.', 'elif נכון כשבדיוק ענף אחד צריך לרוץ. לפעמים כמה דברים צריכים לקרות.'],
        }),
        opt('When there are more than two conditions.', 'כשיש יותר משני תנאים.', {
          feedback: ['The number of conditions does not decide it; elif chains can be as long as you like. What matters is whether the branches exclude each other.', 'מספר התנאים לא קובע; שרשראות elif יכולות להיות ארוכות כרצונכם. מה שחשוב הוא אם הענפים שוללים זה את זה.'],
        }),
        opt('When the conditions compare strings.', 'כשהתנאים משווים מחרוזות.', {
          feedback: ['Strings work fine in elif chains — the traffic light task is an example.', 'מחרוזות עובדות מצוין בשרשראות elif — משימת הרמזור היא דוגמה לכך.'],
        }),
      ],
      ['elif', 'if'],
    ),
  ],

  recap: [
    list([
      ['`elif` adds another condition to the same decision; chain as many as you need and end with an optional `else`.', '`elif` מוסיף תנאי נוסף לאותה החלטה; שרשרו כמה שצריך וסיימו ב-`else` לפי הצורך.'],
      ['Python checks the conditions from top to bottom and runs only the first block whose condition is `True`.', 'פייתון בודק את התנאים מלמעלה למטה ומריץ רק את הבלוק הראשון שהתנאי שלו `True`.'],
      ['Order matters: with `>=` put the largest threshold first; with `<` the smallest.', 'הסדר קובע: עם `>=` שימו את הסף הגדול ביותר ראשון; עם `<` את הקטן ביותר.'],
      ['Separate `if` statements are separate decisions — several of them can run for the same value.', 'משפטי `if` נפרדים הם החלטות נפרדות — כמה מהם יכולים לרוץ עבור אותו ערך.'],
    ]),
    p(
      'You can now sort any value into categories. Real programs are full of such chains: menus, grades, price bands, game states.',
      'עכשיו אתם יכולים למיין כל ערך לקטגוריות. תוכניות אמיתיות מלאות בשרשראות כאלה: תפריטים, ציונים, מדרגות מחיר, מצבי משחק.',
    ),
  ],
  next: t(
    'Next you will combine conditions with and, or and not — for checks like "at least 13 and under 20" in a single line.',
    'בשיעור הבא תשלבו תנאים בעזרת `and`, `or` ו-`not` — לבדיקות כמו "לפחות 13 ומתחת ל-20" בשורה אחת.',
  ),
};
