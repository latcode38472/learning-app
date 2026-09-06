import type { Lesson } from '../../schema';
import {
  p,
  h,
  code,
  list,
  callout,
  term,
  table,
  viz,
  t,
  opt,
  choice,
  exercise,
  outputTest,
  pythonTest,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l28-reading-errors',
  moduleId: 'm7',
  title: t('Reading error messages', 'לקרוא הודעות שגיאה'),
  tagline: t('Python tells you exactly what went wrong, once you know where to look.', 'פייתון אומר לכם בדיוק מה השתבש, ברגע שיודעים איפה להסתכל.'),
  estimatedMinutes: 25,
  introduces: ['traceback', 'name-error', 'value-error', 'zero-division', 'attribute-error'],
  requires: [
    'error-message',
    'syntax-error',
    'debugging',
    'variable',
    'input',
    'type-conversion',
    'type-mismatch',
    'list',
    'append',
    'index-error',
    'dictionary',
    'key-error',
    'function',
    'call',
    'return',
    'f-string',
    'arithmetic',
    'if',
    'split-join',
    'sum-min-max',
  ],
  runsInBrowser: true,

  objective: t(
    'Read a traceback from the bottom up, name the error type, find the line, and fix the most common runtime errors.',
    'לקרוא traceback מלמטה למעלה, לזהות את סוג השגיאה, למצוא את השורה ולתקן את שגיאות זמן הריצה הנפוצות ביותר.',
  ),
  prerequisiteCheck: t(
    'You have met a syntax error (lesson 4) and you use variables, input(), int(), lists, dictionaries and functions (lessons 6–27).',
    'פגשתם שגיאת תחביר (שיעור 4), ואתם משתמשים במשתנים, ב-`input()`, ב-`int()`, ברשימות, במילונים ובפונקציות (שיעורים 6–27).',
  ),

  explanation: [
    p(
      'In lesson 4 you met your first error: a **syntax error**, which Python finds before it runs a single line. This lesson is about the other kind. A **runtime error** happens while the program is running: every line above it already ran, and then one line asked for something impossible. Python stops and prints a report.',
      'בשיעור 4 פגשתם את השגיאה הראשונה שלכם: **שגיאת תחביר** (syntax error), שפייתון מוצא עוד לפני שהוא מריץ שורה אחת. השיעור הזה עוסק בסוג השני. **שגיאת זמן ריצה** (runtime error) קורית בזמן שהתוכנית רצה: כל השורות שמעליה כבר רצו, ואז שורה אחת ביקשה משהו בלתי אפשרי. פייתון עוצר ומדפיס דוח.',
    ),
    term(
      'traceback',
      'The report Python prints when a running program fails. It names the file (in this app always `main.py`) and the line number, shows the line itself, and ends with the error **type** and **message**. The word means "trace back": the path Python took to reach the problem.',
      'הדוח שפייתון מדפיס כשתוכנית שרצה נכשלת. הוא מציין את שם הקובץ (באפליקציה הזאת תמיד `main.py`) ואת מספר השורה, מציג את השורה עצמה, ומסתיים ב**סוג** השגיאה וב**הודעה**. משמעות המילה היא "מעקב לאחור": הדרך שפייתון עבר עד שהגיע לבעיה.',
    ),
    code(py`
      name = "Maya"
      greeting = "Hello, " + nmae
    `, { caption: t('Run it. Line 2 has a typo.', 'הריצו. בשורה 2 יש שגיאת כתיב.') }),
    code(py`
      Traceback (most recent call last):
        File "main.py", line 2, in <module>
          greeting = "Hello, " + nmae
                                 ^^^^
      NameError: name 'nmae' is not defined
    `, { lang: 'text', runnable: false, caption: t('What Python prints', 'מה שפייתון מדפיס') }),
    h('Read it from the bottom up', 'קוראים מלמטה למעלה'),
    list([
      [
        'The **last line** is the most important one: the error type (`NameError`) and the message (`name \'nmae\' is not defined`). Always read it first.',
        'ה**שורה האחרונה** היא החשובה ביותר: סוג השגיאה (`NameError`) וההודעה (`name \'nmae\' is not defined`). תמיד קראו אותה ראשונה.',
      ],
      [
        'Above it, `File "main.py", line 2` tells you **where**, and the line itself is copied underneath. The small arrows `^^^^` point at the exact part that failed.',
        'מעליה, `File "main.py", line 2` אומר לכם **איפה**, והשורה עצמה מועתקת מתחת. החיצים הקטנים `^^^^` מצביעים על החלק המדויק שנכשל.',
      ],
      [
        'The first line, `Traceback (most recent call last)`, is only a heading. When a function is involved there is one `File` entry per call, and the last one is where the error actually happened.',
        'השורה הראשונה, `Traceback (most recent call last)`, היא רק כותרת. כשמעורבת פונקציה יש שורת `File` אחת לכל קריאה, והאחרונה היא המקום שבו השגיאה באמת קרתה.',
      ],
    ], true),
    callout(
      'why',
      'Python never guesses what you meant. `nmae` might be a typo of `name` or a variable you forgot to create; only you can tell. So it stops at the first problem and says exactly what it could not do. Nobody writes programs without errors. The difference between a beginner and an experienced programmer is how quickly they read the message.',
      'פייתון אף פעם לא מנחש למה התכוונתם. `nmae` יכול להיות שגיאת כתיב של `name` או משתנה ששכחתם ליצור; רק אתם יכולים לדעת. לכן הוא עוצר בבעיה הראשונה ואומר בדיוק מה הוא לא הצליח לעשות. אף אחד לא כותב תוכניות בלי שגיאות. ההבדל בין מתחילים למתכנתים מנוסים הוא כמה מהר הם קוראים את ההודעה.',
      t('Why does Python stop?', 'למה פייתון עוצר?'),
    ),
    h('The errors you will meet most often', 'השגיאות שתפגשו הכי הרבה'),
    term(
      'NameError',
      'Python does not know this name. Usual cause: a misspelled variable or function (`nmae`), or a variable used **above** the line that creates it. The message names the unknown word: `name \'total\' is not defined`.',
      'פייתון לא מכיר את השם הזה. סיבה שכיחה: שם משתנה או פונקציה עם שגיאת כתיב (`nmae`), או משתנה שמשתמשים בו **מעל** השורה שיוצרת אותו. ההודעה מציינת את המילה הלא מוכרת: `name \'total\' is not defined`.',
    ),
    term(
      'ValueError',
      'The type is right but the value is impossible. `int("abc")` cannot work: `abc` is text, which `int()` accepts, but it is not a number. Message: `invalid literal for int() with base 10: \'abc\'`. This is the error `input()` causes most often, because people type letters.',
      'הטיפוס נכון אבל הערך בלתי אפשרי. `int("abc")` לא יכול לעבוד: `abc` הוא טקסט, ו-`int()` מקבל טקסט, אבל זה לא מספר. ההודעה: `invalid literal for int() with base 10: \'abc\'`. זו השגיאה ש-`input()` גורם לה הכי הרבה, כי אנשים מקלידים אותיות.',
    ),
    term(
      'ZeroDivisionError',
      'Dividing by zero with `/`, `//` or `%`. Message: `division by zero`. Nobody types `/ 0` on purpose; it happens when a **variable** is 0, most often the length of an empty list while computing an average.',
      'חלוקה באפס עם `/`, `//` או `%`. ההודעה: `division by zero`. אף אחד לא כותב `/ 0` בכוונה; זה קורה כש**משתנה** שווה 0, לרוב האורך של רשימה ריקה בזמן חישוב ממוצע.',
    ),
    term(
      'AttributeError',
      'You asked a value for something it does not have. `word.push("x")` fails because strings have no `push`; `names.append("Dan")` fails when `names` is a string instead of a list. Message: `\'str\' object has no attribute \'append\'`. The message tells you the **real type** of the value, and that is the clue.',
      'ביקשתם מערך משהו שאין לו. `word.push("x")` נכשל כי למחרוזות אין `push`; `names.append("Dan")` נכשל כש-`names` הוא מחרוזת ולא רשימה. ההודעה: `\'str\' object has no attribute \'append\'`. ההודעה מגלה לכם את **הטיפוס האמיתי** של הערך, וזה הרמז.',
    ),
    p(
      'Three more you already know: `TypeError` from lesson 8 (text + number), and `IndexError` and `KeyError` from module 6. Here they all are in one table.',
      'שלוש נוספות כבר מוכרות לכם: `TypeError` משיעור 8 (טקסט + מספר), ו-`IndexError` ו-`KeyError` ממודול 6. הנה כולן בטבלה אחת.',
    ),
    table(
      [['Error', 'שגיאה'], ['Usual cause', 'סיבה שכיחה'], ['Usual fix', 'תיקון שכיח']],
      [
        [['`NameError`', '`NameError`'], ['A misspelled name, or a variable used before the line that creates it.', 'שם עם שגיאת כתיב, או משתנה שמשתמשים בו לפני השורה שיוצרת אותו.'], ['Check the spelling; create the variable earlier.', 'בדקו את האיות; צרו את המשתנה קודם.']],
        [['`TypeError`', '`TypeError`'], ['Mixing types, for example text + number.', 'ערבוב טיפוסים, למשל טקסט + מספר.'], ['Convert with `int()` or `str()`, or use an f-string.', 'המירו עם `int()` או `str()`, או השתמשו ב-f-string.']],
        [['`ValueError`', '`ValueError`'], ['Right type, impossible value: `int("abc")`.', 'טיפוס נכון, ערך בלתי אפשרי: `int("abc")`.'], ['Check the input; the next lesson shows `try` / `except`.', 'בדקו את הקלט; בשיעור הבא תכירו `try` / `except`.']],
        [['`ZeroDivisionError`', '`ZeroDivisionError`'], ['Dividing by a variable that is 0, often the length of an empty list.', 'חלוקה במשתנה ששווה 0, לעיתים קרובות האורך של רשימה ריקה.'], ['Check for 0 with `if` before dividing.', 'בדקו אם הערך 0 עם `if` לפני החלוקה.']],
        [['`IndexError`', '`IndexError`'], ['A list position that does not exist: `items[3]` in a list of three.', 'מיקום ברשימה שלא קיים: `items[3]` ברשימה של שלושה איברים.'], ['Positions start at 0; compare with `len()`.', 'המיקומים מתחילים ב-0; השוו ל-`len()`.']],
        [['`KeyError`', '`KeyError`'], ['A dictionary key that does not exist.', 'מפתח שלא קיים במילון.'], ['Check with `in`, or use `.get()`.', 'בדקו עם `in`, או השתמשו ב-`.get()`.']],
        [['`AttributeError`', '`AttributeError`'], ['Asking a value for something it does not have, e.g. `.append` on a string.', 'בקשה מערך למשהו שאין לו, למשל `.append` על מחרוזת.'], ['Read the type in the message; check what the variable really holds.', 'קראו את הטיפוס בהודעה; בדקו מה המשתנה באמת מחזיק.']],
      ],
    ),
    code(py`
      NameError: name 'total' is not defined
      TypeError: can only concatenate str (not "int") to str
      ValueError: invalid literal for int() with base 10: 'abc'
      ZeroDivisionError: division by zero
      IndexError: list index out of range
      KeyError: 'banana'
      AttributeError: 'str' object has no attribute 'append'
    `, { lang: 'text', runnable: false, caption: t('The last line of each traceback', 'השורה האחרונה של כל traceback') }),
    callout(
      'tip',
      'The line number is where Python **noticed** the problem, not always where the mistake was made. A `ZeroDivisionError` on line 9 may come from a variable that became 0 on line 4. Read the message, look at the line, then read upwards to find where the value came from.',
      'מספר השורה הוא המקום שבו פייתון **שם לב** לבעיה, לא תמיד המקום שבו נעשתה הטעות. `ZeroDivisionError` בשורה 9 יכול לנבוע ממשתנה שהפך ל-0 בשורה 4. קראו את ההודעה, הסתכלו על השורה, ואז קראו למעלה כדי למצוא מאיפה הגיע הערך.',
      t('The line is a clue, not always the culprit', 'השורה היא רמז, לא תמיד האשמה'),
    ),
  ],

  simpler: [
    p(
      'A traceback is like a note from a mechanic. At the bottom it says what is broken ("flat tyre"). Above it says where ("rear left wheel"). You read the bottom line first, then go and look at the place it names.',
      'traceback הוא כמו פתק ממוסכניק. למטה כתוב מה התקלקל ("תקר בצמיג"). מעליו כתוב איפה ("גלגל אחורי שמאלי"). קוראים קודם את השורה התחתונה, ואז הולכים להסתכל במקום שהיא מציינת.',
    ),
    p(
      'The error type is the family of problem; the message is the detail. `NameError: name \'nmae\' is not defined` simply means "I do not know anyone called nmae".',
      'סוג השגיאה הוא משפחת הבעיה; ההודעה היא הפרט. `NameError: name \'nmae\' is not defined` פירושו פשוט "אני לא מכיר אף אחד בשם nmae".',
    ),
    p(
      'Python reads your program like a recipe, step by step. When a step says "add the sauce" and there is no sauce, it cannot continue, so it stops and tells you which step it was on. Everything before that step was already done.',
      'פייתון קורא את התוכנית שלכם כמו מתכון, צעד אחר צעד. כשצעד אומר "הוסיפו את הרוטב" ואין רוטב, אי אפשר להמשיך, אז הוא עוצר ואומר לכם באיזה צעד הוא היה. כל מה שלפני הצעד הזה כבר בוצע.',
    ),
    p(
      'Errors are not a sign that you are bad at this. Every programmer sees them every day; experienced ones simply read them faster. That is the skill this lesson trains.',
      'שגיאות הן לא סימן שאתם לא טובים בזה. כל מתכנת רואה אותן כל יום; המנוסים פשוט קוראים אותן מהר יותר. זו המיומנות שהשיעור הזה מאמן.',
    ),
  ],

  workedExample: [
    p(
      'Here is a short program with a function. Run it and read the traceback from the bottom.',
      'הנה תוכנית קצרה עם פונקציה. הריצו אותה וקראו את ה-traceback מלמטה.',
    ),
    code(py`
      def average(numbers):
          total = sum(numbers)
          return total / len(numbers)

      scores = []
      result = average(scores)
    `),
    code(py`
      Traceback (most recent call last):
        File "main.py", line 6, in <module>
          result = average(scores)
        File "main.py", line 3, in average
          return total / len(numbers)
                 ~~~~~~^~~~~~~~~~~~~~
      ZeroDivisionError: division by zero
    `, { lang: 'text', runnable: false, caption: t('What Python prints', 'מה שפייתון מדפיס') }),
    list([
      [
        'Bottom line first: `ZeroDivisionError: division by zero`. Somewhere the program divided by 0.',
        'קודם השורה התחתונה: `ZeroDivisionError: division by zero`. איפשהו התוכנית חילקה ב-0.',
      ],
      [
        'Above it there are two `File` entries. The first, line 6 `in <module>`, is the main program, where `average(scores)` was called. The second, line 3 `in average`, is inside the function. The **last** entry is where the error really happened: `total / len(numbers)`.',
        'מעליה יש שתי שורות `File`. הראשונה, שורה 6 `in <module>`, היא התוכנית הראשית, שבה נקראה `average(scores)`. השנייה, שורה 3 `in average`, היא בתוך הפונקציה. השורה **האחרונה** היא המקום שבו השגיאה באמת קרתה: `total / len(numbers)`.',
      ],
      [
        'Now the detective work. `len(numbers)` must be 0, so `numbers` is empty. Where did it come from? Line 5: `scores = []`. The average of no scores has no answer.',
        'עכשיו עבודת הבילוש. `len(numbers)` חייב להיות 0, כלומר `numbers` ריקה. מאיפה היא הגיעה? שורה 5: `scores = []`. לממוצע של אפס ציונים אין תשובה.',
      ],
      [
        'Lines 1–5 ran without any problem. The failure came only when line 6 called the function and line 3 tried to divide.',
        'שורות 1–5 רצו בלי שום בעיה. הכישלון הגיע רק כששורה 6 קראה לפונקציה ושורה 3 ניסתה לחלק.',
      ],
    ], true),
    p(
      'The fix is a decision, not a trick: what should the average of no scores be? Here we return 0 when the list is empty. Run the fixed version, then press play to step through it.',
      'התיקון הוא החלטה, לא טריק: מה צריך להיות הממוצע של אפס ציונים? כאן אנחנו מחזירים 0 כשהרשימה ריקה. הריצו את הגרסה המתוקנת, ואז לחצו על כפתור ההפעלה כדי לעבור עליה צעד אחר צעד.',
    ),
    code(py`
      def average(numbers):
          if len(numbers) == 0:
              return 0
          total = sum(numbers)
          return total / len(numbers)

      scores = []
      result = average(scores)
      print("Average:", result)
    `, { output: 'Average: 0' }),
    viz(py`
      def average(numbers):
          if len(numbers) == 0:
              return 0
          total = sum(numbers)
          return total / len(numbers)

      scores = []
      result = average(scores)
      print("Average:", result)
    `, t('Step through the fixed version: the if catches the empty list before the division.', 'עברו צעד אחר צעד על הגרסה המתוקנת: ה-if תופס את הרשימה הריקה לפני החלוקה.')),
  ],

  moreExamples: [
    [
      h('A ValueError from input', 'ValueError שמגיע מ-input'),
      code(py`
        text = input("How old are you? ")
        age = int(text)
        print("Next year you will be", age + 1)
      `),
      p(
        'If the user types `12`, this prints `Next year you will be 13`. If they type `twelve`, line 2 fails:',
        'אם המשתמש מקליד `12`, התוכנית מדפיסה `Next year you will be 13`. אם הוא מקליד `twelve`, שורה 2 נכשלת:',
      ),
      code(py`
        Traceback (most recent call last):
          File "main.py", line 2, in <module>
            age = int(text)
        ValueError: invalid literal for int() with base 10: 'twelve'
      `, { lang: 'text', runnable: false }),
      p(
        'The message quotes the exact text that could not be converted. Notice the line number: reading the input (line 1) worked; converting it (line 2) did not. The next lesson shows how to survive this.',
        'ההודעה מצטטת את הטקסט המדויק שלא ניתן היה להמיר. שימו לב למספר השורה: קריאת הקלט (שורה 1) הצליחה; ההמרה (שורה 2) לא. בשיעור הבא תראו איך לשרוד את זה.',
      ),
    ],
    [
      h('An AttributeError that points at the real bug', 'AttributeError שמצביע על הבאג האמיתי'),
      code(py`
        names = "Maya"
        names.append("Dan")
      `),
      code(py`
        Traceback (most recent call last):
          File "main.py", line 2, in <module>
            names.append("Dan")
            ^^^^^^^^^^^^
        AttributeError: 'str' object has no attribute 'append'
      `, { lang: 'text', runnable: false }),
      p(
        'The message says `\'str\' object`: `names` is a string, not a list. The mistake is not on line 2 at all; it is on line 1, where the square brackets are missing. Fixed:',
        'ההודעה אומרת `\'str\' object`: `names` הוא מחרוזת, לא רשימה. הטעות בכלל לא בשורה 2; היא בשורה 1, שבה חסרים הסוגריים המרובעים. אחרי התיקון:',
      ),
      code(py`
        names = ["Maya"]
        names.append("Dan")
        print(names)
      `, { output: "['Maya', 'Dan']" }),
    ],
  ],

  harderChallenge: exercise({
    id: 'l28-hard',
    title: ['Three bugs in a report', 'שלושה באגים בדוח'],
    mode: 'fix',
    instructions: [
      p(
        'This program should print one line per student: `Maya: 9.0`, `Dan: no scores`, `Noa: 7.0`. It has three bugs. Run it, read the last line of the traceback, fix that bug, run again. One of the bugs is not a typo: a student with no scores has no average, so the function must check for an empty list with `if` and print `no scores` instead of dividing.',
        'התוכנית הזאת אמורה להדפיס שורה אחת לכל תלמיד: `Maya: 9.0`, `Dan: no scores`, `Noa: 7.0`. יש בה שלושה באגים. הריצו אותה, קראו את השורה האחרונה של ה-traceback, תקנו את הבאג הזה והריצו שוב. אחד הבאגים אינו שגיאת כתיב: לתלמיד בלי ציונים אין ממוצע, ולכן הפונקציה צריכה לבדוק רשימה ריקה עם `if` ולהדפיס `no scores` במקום לחלק.',
      ),
    ],
    starterCode: py`
      def describe(name, scores):
          total = sum(scores)
          average = total / len(scores)
          print(name + ": " + average)

      students = {"Maya": [8, 10], "Dan": [], "Noa": [7]}
      for name in students:
          describe(name, students[nam])
    `,
    check: {
      tests: [outputTest('Maya: 9.0\nDan: no scores\nNoa: 7.0')],
    },
    hints: [
      ['The first traceback is a NameError on line 8. Compare the name inside the square brackets with the loop variable.', 'ה-traceback הראשון הוא NameError בשורה 8. השוו את השם בתוך הסוגריים המרובעים למשתנה הלולאה.'],
      ['Then a TypeError: text and a float cannot be joined with +. An f-string solves it: `print(f"{name}: {average}")`.', 'אחר כך TypeError: אי אפשר לחבר טקסט ו-float עם +. f-string פותר את זה: `print(f"{name}: {average}")`.'],
      ['Finally a ZeroDivisionError for Dan. At the start of the function check `if len(scores) == 0:`, print the `no scores` line and `return`.', 'לבסוף ZeroDivisionError עבור Dan. בתחילת הפונקציה בדקו `if len(scores) == 0:`, הדפיסו את שורת `no scores` ובצעו `return`.'],
    ],
    solution: py`
      def describe(name, scores):
          if len(scores) == 0:
              print(f"{name}: no scores")
              return
          total = sum(scores)
          average = total / len(scores)
          print(f"{name}: {average}")

      students = {"Maya": [8, 10], "Dan": [], "Noa": [7]}
      for name in students:
          describe(name, students[name])
    `,
    concepts: ['traceback', 'name-error', 'zero-division', 'type-mismatch', 'f-string'],
  }),

  predict: {
    code: py`
      text = "12"
      number = int(text)
      print(number + 1)
      print(text + "1")
    `,
    prompt: t('What does this program print? (Or does it stop with an error?)', 'מה התוכנית הזאת תדפיס? (או שהיא תיעצר עם שגיאה?)'),
    answer: '13\n121',
    explanation: t(
      'Line 2 turns the text "12" into the number 12, so line 3 prints 13. Line 4 joins two pieces of text, "12" and "1", which is allowed: the result is the text 121. No line mixes text with a number, so there is no error.',
      'שורה 2 הופכת את הטקסט "12" למספר 12, ולכן שורה 3 מדפיסה 13. שורה 4 מחברת שני קטעי טקסט, "12" ו-"1", וזה מותר: התוצאה היא הטקסט 121. אף שורה לא מערבבת טקסט עם מספר, ולכן אין שגיאה.',
    ),
  },

  exercise: exercise({
    id: 'l28-ex',
    title: ['Three bugs, three tracebacks', 'שלושה באגים, שלושה traceback'],
    mode: 'fix',
    instructions: [
      p(
        'This program has three runtime bugs, each of a different type. Run it, read the **last line** of the traceback, fix only that bug, and run again: each run reveals the next one. When it works it prints exactly:',
        'בתוכנית הזאת יש שלושה באגים של זמן ריצה, כל אחד מסוג אחר. הריצו אותה, קראו את **השורה האחרונה** של ה-traceback, תקנו רק את הבאג הזה והריצו שוב: כל הרצה חושפת את הבאג הבא. כשהתוכנית עובדת היא מדפיסה בדיוק:',
      ),
      code('Player: Maya\nTotal: 27\nAverage: 9.0', { lang: 'text', runnable: false }),
    ],
    starterCode: py`
      player = "Maya"
      scores = [7, 9]
      scores.push(11)
      total = sum(scores)
      print("Player: " + playr)
      print("Total: " + total)
      print("Average:", total / len(scores))
    `,
    check: {
      tests: [
        outputTest('Player: Maya\nTotal: 27\nAverage: 9.0'),
        pythonTest(`assert ns.get("scores") == [7, 9, 11], "scores should end up as [7, 9, 11]: use append to add 11."`),
      ],
    },
    hints: [
      ['The first error is an AttributeError: a list has no `push`. Which list method adds an item at the end?', 'השגיאה הראשונה היא AttributeError: לרשימה אין `push`. איזו פעולה של רשימה מוסיפה איבר בסוף?'],
      ['The second is a NameError on line 5. Compare `playr` with the name created on line 1.', 'השנייה היא NameError בשורה 5. השוו את `playr` לשם שנוצר בשורה 1.'],
      ['The third is a TypeError: `"Total: " + total` joins text with a number. Write `print(f"Total: {total}")` instead.', 'השלישית היא TypeError: `"Total: " + total` מחבר טקסט עם מספר. כתבו במקום זה `print(f"Total: {total}")`.'],
    ],
    solution: py`
      player = "Maya"
      scores = [7, 9]
      scores.append(11)
      total = sum(scores)
      print("Player: " + player)
      print(f"Total: {total}")
      print("Average:", total / len(scores))
    `,
    concepts: ['traceback', 'attribute-error', 'name-error', 'type-mismatch'],
  }),

  build: exercise({
    id: 'l28-build',
    title: ['An average that survives an empty line', 'ממוצע ששורד שורה ריקה'],
    mode: 'build',
    instructions: [
      p(
        'Build a small score tool. Read one line of whole numbers separated by spaces (any prompt text), for example `7 9 11`. Cut it into pieces with `split()` and turn each piece into a number with `int()`.',
        'בנו כלי קטן לציונים. קראו שורה אחת של מספרים שלמים מופרדים ברווחים (טקסט הבקשה חופשי), למשל `7 9 11`. חתכו אותה לחלקים עם `split()` והפכו כל חלק למספר עם `int()`.',
      ),
      p(
        'If the line is empty there are no scores, and dividing by their count would raise a ZeroDivisionError. Check for that case with `if` and print exactly `No scores`. Otherwise print two lines: `Average: 9.0` (the sum divided by the count) and `Best: 11` (the largest score).',
        'אם השורה ריקה אין ציונים, וחלוקה במספרם תגרום ל-ZeroDivisionError. בדקו את המקרה הזה עם `if` והדפיסו בדיוק `No scores`. אחרת הדפיסו שתי שורות: `Average: 9.0` (הסכום חלקי הכמות) ו-`Best: 11` (הציון הגבוה ביותר).',
      ),
    ],
    starterCode: py`
      # 1. read one line of scores (any prompt text)

      # 2. split it into pieces and turn each piece into a number

      # 3. if there are no scores, print "No scores"
      #    otherwise print "Average: ..." and "Best: ..."
    `,
    sampleStdin: ['7 9 11'],
    check: {
      tests: [
        outputTest('Average: 9.0\nBest: 11', { stdin: ['7 9 11'] }),
        outputTest('Average: 3.5\nBest: 4', { stdin: ['3 4'] }),
        outputTest('Average: 10.0\nBest: 10', { stdin: ['10'] }),
        outputTest('No scores', { stdin: [''] }),
      ],
    },
    hints: [
      ['`line.split()` gives a list of pieces; an empty line gives an empty list.', '`line.split()` מחזיר רשימה של חלקים; שורה ריקה מחזירה רשימה ריקה.'],
      ['Build a list of numbers with a `for` loop and `append(int(piece))`, then test `len(scores) == 0` before dividing.', 'בנו רשימת מספרים עם לולאת `for` ו-`append(int(piece))`, ואז בדקו `len(scores) == 0` לפני שאתם מחלקים.'],
      ['Use `sum(scores) / len(scores)` for the average and `max(scores)` for the best, inside an f-string.', 'השתמשו ב-`sum(scores) / len(scores)` לממוצע וב-`max(scores)` לציון הגבוה ביותר, בתוך f-string.'],
    ],
    solution: py`
      line = input("Scores: ")
      pieces = line.split()
      scores = []
      for piece in pieces:
          scores.append(int(piece))

      if len(scores) == 0:
          print("No scores")
      else:
          print(f"Average: {sum(scores) / len(scores)}")
          print(f"Best: {max(scores)}")
    `,
    solutionNote: [
      'Checking `line == ""` instead of `len(scores) == 0` works too. The point is to test for the empty case before dividing.',
      'גם בדיקה של `line == ""` במקום `len(scores) == 0` עובדת. העיקר הוא לבדוק את המקרה הריק לפני החלוקה.',
    ],
    concepts: ['zero-division', 'split-join', 'type-conversion', 'if', 'sum-min-max'],
  }),

  check: [
    choice(
      'l28-c1',
      [
        p('A program stops with this traceback. What went wrong?', 'תוכנית נעצרת עם ה-traceback הזה. מה השתבש?'),
        code(py`
          Traceback (most recent call last):
            File "main.py", line 4, in <module>
              print("Total: " + count)
                    ~~~~~~~~~~^~~~~~~
          TypeError: can only concatenate str (not "int") to str
        `, { lang: 'text', runnable: false }),
      ],
      [
        opt('On line 4, text and a whole number were joined with +. Convert the number or use an f-string.', 'בשורה 4 חוברו טקסט ומספר שלם עם +. יש להמיר את המספר או להשתמש ב-f-string.', {
          correct: true,
          feedback: ['Right. The message says it can only join str to str, and the thing it was given was an int.', 'נכון. ההודעה אומרת שאפשר לחבר רק str ל-str, ומה שהיא קיבלה היה int.'],
        }),
        opt('The variable count was never created.', 'המשתנה count מעולם לא נוצר.', {
          feedback: ['That would be a NameError with the message "name \'count\' is not defined". Here the type of count is the problem, so count exists.', 'זה היה NameError עם ההודעה "name \'count\' is not defined". כאן הבעיה היא הטיפוס של count, כלומר count קיים.'],
        }),
        opt('count is zero, so the program divided by zero.', 'count שווה אפס, ולכן התוכנית חילקה באפס.', {
          feedback: ['There is no division on this line, and a ZeroDivisionError would say "division by zero".', 'אין חלוקה בשורה הזאת, ו-ZeroDivisionError היה אומר "division by zero".'],
        }),
        opt('Line 4 has a syntax error.', 'בשורה 4 יש שגיאת תחביר.', {
          feedback: ['A syntax error is found before the program runs and does not produce this kind of traceback. Line 4 is valid Python; it fails only when it runs.', 'שגיאת תחביר מתגלה לפני שהתוכנית רצה ולא מייצרת traceback כזה. שורה 4 היא פייתון תקין; היא נכשלת רק בזמן ריצה.'],
        }),
      ],
      ['traceback'],
    ),
    choice(
      'l28-c2',
      [
        p('What is the most likely cause of this error?', 'מה הסיבה הסבירה ביותר לשגיאה הזאת?'),
        code(py`
          Traceback (most recent call last):
            File "main.py", line 2, in <module>
              names.append("Dan")
              ^^^^^^^^^^^^
          AttributeError: 'str' object has no attribute 'append'
        `, { lang: 'text', runnable: false }),
      ],
      [
        opt('names holds a string, not a list. Look at the line that created it.', 'names מחזיק מחרוזת ולא רשימה. יש להסתכל בשורה שיצרה אותו.', {
          correct: true,
          feedback: ['Yes. The message names the real type: \'str\' object. Lists have append; strings do not. The fix is probably on line 1.', 'כן. ההודעה מציינת את הטיפוס האמיתי: \'str\' object. לרשימות יש append; למחרוזות אין. התיקון הוא כנראה בשורה 1.'],
        }),
        opt('append is spelled wrong.', 'המילה append כתובה לא נכון.', {
          feedback: ['append is spelled correctly; it is the right method for a list. The problem is that names is not a list.', 'המילה append כתובה נכון; זו הפעולה הנכונה לרשימה. הבעיה היא ש-names אינו רשימה.'],
        }),
        opt('The list is empty, so nothing can be added.', 'הרשימה ריקה, ולכן אי אפשר להוסיף אליה.', {
          feedback: ['Adding to an empty list is perfectly fine. The message says the value is a str, not a list at all.', 'הוספה לרשימה ריקה היא בסדר גמור. ההודעה אומרת שהערך הוא str, בכלל לא רשימה.'],
        }),
        opt('"Dan" must be a number, not text.', '"Dan" חייב להיות מספר ולא טקסט.', {
          feedback: ['Lists can hold text. The error is about names, the value before the dot, not about "Dan".', 'רשימות יכולות להכיל טקסט. השגיאה נוגעת ל-names, הערך שלפני הנקודה, ולא ל-"Dan".'],
        }),
      ],
      ['attribute-error'],
    ),
    choice(
      'l28-c3',
      [
        p('Where did this error happen, and what does it mean?', 'איפה קרתה השגיאה הזאת, ומה פירושה?'),
        code(py`
          Traceback (most recent call last):
            File "main.py", line 7, in <module>
              total = price_of("pear")
            File "main.py", line 3, in price_of
              return prices[name]
                     ~~~~~~^^^^^^
          KeyError: 'pear'
        `, { lang: 'text', runnable: false }),
      ],
      [
        opt('On line 3, inside price_of: the dictionary prices has no key "pear".', 'בשורה 3, בתוך price_of: במילון prices אין מפתח "pear".', {
          correct: true,
          feedback: ['Correct. The last File entry is where the error happened, and KeyError names the missing key.', 'נכון. שורת ה-File האחרונה היא המקום שבו השגיאה קרתה, ו-KeyError מציין את המפתח החסר.'],
        }),
        opt('On line 7: the function price_of does not exist.', 'בשורה 7: הפונקציה price_of לא קיימת.', {
          feedback: ['A missing function would be a NameError. Line 7 called the function successfully; the failure came inside it, on line 3.', 'פונקציה חסרה הייתה גורמת ל-NameError. שורה 7 קראה לפונקציה בהצלחה; הכישלון הגיע בתוכה, בשורה 3.'],
        }),
        opt('On line 3: prices is a list and the position is too big.', 'בשורה 3: prices היא רשימה והמיקום גדול מדי.', {
          feedback: ['A bad list position gives IndexError with "list index out of range". KeyError belongs to dictionaries.', 'מיקום לא תקין ברשימה נותן IndexError עם "list index out of range". KeyError שייך למילונים.'],
        }),
        opt('Nowhere: a KeyError is only a warning and the program continues.', 'בשום מקום: KeyError הוא רק אזהרה והתוכנית ממשיכה.', {
          feedback: ['Every traceback means the program stopped. Nothing after line 7 ran.', 'כל traceback פירושו שהתוכנית נעצרה. שום דבר אחרי שורה 7 לא רץ.'],
        }),
      ],
      ['traceback', 'key-error'],
    ),
  ],

  recap: [
    list([
      ['Read a traceback from the bottom: the last line has the error type and the message.', 'קראו traceback מלמטה: בשורה האחרונה נמצאים סוג השגיאה וההודעה.'],
      ['Above it, `File "main.py", line N` says where; when functions are involved, the last `File` entry is where it happened.', 'מעליה, `File "main.py", line N` אומר איפה; כשמעורבות פונקציות, שורת ה-`File` האחרונה היא המקום שבו זה קרה.'],
      ['NameError: unknown name (a typo, or created too late). ValueError: right type, impossible value, such as `int("abc")`.', 'NameError: שם לא מוכר (שגיאת כתיב, או נוצר מאוחר מדי). ValueError: טיפוס נכון, ערך בלתי אפשרי, למשל `int("abc")`.'],
      ['ZeroDivisionError: a variable that is 0 in a division. AttributeError: the value is not the type you think; the message names the real type.', 'ZeroDivisionError: משתנה ששווה 0 בחלוקה. AttributeError: הערך אינו מהטיפוס שחשבתם; ההודעה מציינת את הטיפוס האמיתי.'],
      ['The line number is where Python noticed the problem; the cause may be a few lines earlier.', 'מספר השורה הוא המקום שבו פייתון שם לב לבעיה; הסיבה יכולה להיות כמה שורות קודם.'],
    ]),
    p(
      'From now on an error message is information, not a verdict. Read the last line, go to the line it names, and ask where the value came from. Most bugs give up within a minute of that routine.',
      'מעכשיו הודעת שגיאה היא מידע, לא גזר דין. קראו את השורה האחרונה, לכו לשורה שהיא מציינת, ושאלו מאיפה הגיע הערך. רוב הבאגים נכנעים תוך דקה מהשגרה הזאת.',
    ),
  ],
  next: t(
    'Next you will learn to catch an error while the program runs, so that a user who types letters instead of a number gets a second chance instead of a crash.',
    'בשיעור הבא תלמדו לתפוס שגיאה בזמן שהתוכנית רצה, כך שמשתמש שמקליד אותיות במקום מספר יקבל הזדמנות שנייה במקום קריסה.',
  ),
};
