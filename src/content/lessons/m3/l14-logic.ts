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
  requires,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l14-logic',
  moduleId: 'm3',
  title: t('and, or, not: combining conditions', 'and, or, not: שילוב תנאים'),
  tagline: t('Ask two questions at once, or flip an answer.', 'שואלים שתי שאלות בבת אחת, או הופכים תשובה.'),
  estimatedMinutes: 25,
  introduces: ['and', 'or', 'not', 'nested-if'],
  requires: ['if', 'elif', 'else', 'comparison', 'boolean', 'input', 'type-conversion', 'string'],
  runsInBrowser: true,

  objective: t(
    'Combine conditions with and, or and not, write range checks, and decide when to nest ifs and when to flatten them.',
    'לשלב תנאים בעזרת `and`, `or` ו-`not`, לכתוב בדיקות טווח, ולהחליט מתי לקנן משפטי `if` ומתי לשטח אותם.',
  ),
  prerequisiteCheck: t(
    'You can write if / elif / else chains and know that a comparison gives True or False (lessons 11–13).',
    'אתם יודעים לכתוב שרשראות `if` / `elif` / `else`, ויודעים שהשוואה מחזירה `True` או `False` (שיעורים 11–13).',
  ),

  explanation: [
    p(
      'One comparison asks one question. Many decisions need two: "is the age at least 13 **and** under 20?", "is it Saturday **or** Sunday?". Python has three small words that combine or flip `True`/`False` values: `and`, `or` and `not`. They are called **logical operators**.',
      'השוואה אחת שואלת שאלה אחת. הרבה החלטות צריכות שתיים: "האם הגיל לפחות 13 **וגם** מתחת ל-20?", "האם היום שבת **או** ראשון?". לפייתון יש שלוש מילים קטנות שמשלבות או הופכות ערכי `True`/`False`: `and`, `or` ו-`not`. הן נקראות **אופרטורים לוגיים** (logical operators).',
    ),
    term(
      'and',
      '`a and b` is `True` only when **both** sides are `True`. If either side is `False`, the whole thing is `False`.',
      '`a and b` הוא `True` רק כש**שני** הצדדים `True`. אם אחד הצדדים `False`, כל הביטוי `False`.',
    ),
    table(
      [['`a`', '`a`'], ['`b`', '`b`'], ['`a and b`', '`a and b`']],
      [
        [['`True`', '`True`'], ['`True`', '`True`'], ['`True`', '`True`']],
        [['`True`', '`True`'], ['`False`', '`False`'], ['`False`', '`False`']],
        [['`False`', '`False`'], ['`True`', '`True`'], ['`False`', '`False`']],
        [['`False`', '`False`'], ['`False`', '`False`'], ['`False`', '`False`']],
      ],
    ),
    code(py`
      age = 15
      print(age >= 13 and age <= 19)
    `, { output: 'True' }),
    term(
      'or',
      '`a or b` is `True` when **at least one** side is `True`. It is `False` only when both sides are `False`.',
      '`a or b` הוא `True` כשלפחות **אחד** הצדדים `True`. הוא `False` רק כששני הצדדים `False`.',
    ),
    table(
      [['`a`', '`a`'], ['`b`', '`b`'], ['`a or b`', '`a or b`']],
      [
        [['`True`', '`True`'], ['`True`', '`True`'], ['`True`', '`True`']],
        [['`True`', '`True`'], ['`False`', '`False`'], ['`True`', '`True`']],
        [['`False`', '`False`'], ['`True`', '`True`'], ['`True`', '`True`']],
        [['`False`', '`False`'], ['`False`', '`False`'], ['`False`', '`False`']],
      ],
    ),
    code(py`
      day = "Sunday"
      print(day == "Saturday" or day == "Sunday")
    `, { output: 'True' }),
    term(
      'not',
      '`not a` flips the answer: `not True` is `False`, and `not False` is `True`. It reads best in front of a boolean variable: `not raining`.',
      '`not a` הופך את התשובה: `not True` הוא `False`, ו-`not False` הוא `True`. הכי קריא לפני משתנה בוליאני: `not raining`.',
    ),
    table(
      [['`a`', '`a`'], ['`not a`', '`not a`']],
      [
        [['`True`', '`True`'], ['`False`', '`False`']],
        [['`False`', '`False`'], ['`True`', '`True`']],
      ],
    ),
    code(py`
      raining = False
      print(not raining)
    `, { output: 'True' }),
    h('Range checks', 'בדיקות טווח'),
    p(
      '"Between 1 and 10" means two conditions: at least 1 **and** at most 10. Python also lets you write the two comparisons in one go, `1 <= n <= 10`, which means exactly the same as `n >= 1 and n <= 10`.',
      '"בין 1 ל-10" פירושו שני תנאים: לפחות 1 **וגם** לכל היותר 10. פייתון גם מאפשר לכתוב את שתי ההשוואות ברצף, `1 <= n <= 10`, וזה בדיוק כמו `n >= 1 and n <= 10`.',
    ),
    code(py`
      n = 7
      if 1 <= n <= 10:
          print("in range")
      else:
          print("out of range")
    `, { output: 'in range' }),
    callout(
      'warning',
      'You cannot shorten `day == "Saturday" or day == "Sunday"` to `day == "Saturday" or "Sunday"`. Each side of `or` must be a complete question. The right side there is just the word `"Sunday"`, which Python treats as "true", so the whole condition is always true. Repeat the variable on both sides.',
      'אי אפשר לקצר את `day == "Saturday" or day == "Sunday"` ל-`day == "Saturday" or "Sunday"`. כל צד של `or` חייב להיות שאלה שלמה. הצד הימני שם הוא סתם המילה `"Sunday"`, שפייתון מתייחס אליה כאל "אמת", ולכן התנאי כולו תמיד מתקיים. חזרו על המשתנה בשני הצדדים.',
      t('A tempting mistake', 'טעות מפתה'),
    ),
    h('An if inside an if', 'if בתוך if'),
    term(
      'nested if',
      'A block can contain another `if`. The inner `if` is indented one level deeper (8 spaces for its block) and is only reached when the outer condition was `True`. This is called a **nested if**.',
      'בלוק יכול להכיל `if` נוסף. ה-`if` הפנימי מוזח רמה אחת עמוק יותר (8 רווחים לבלוק שלו), ומגיעים אליו רק כשהתנאי החיצוני היה `True`. לזה קוראים **תנאי מקונן** (nested if).',
    ),
    code(py`
      age = 20
      has_ticket = True
      if age >= 18:
          if has_ticket:
              print("Come in")
          else:
              print("You need a ticket")
      else:
          print("Adults only")
    `, { output: 'Come in' }),
    p(
      'Nesting is useful when each failure needs its **own** message, as above. But when you only care whether both things are true, one flat condition with `and` says the same thing in fewer lines and is easier to read:',
      'קינון שימושי כשכל כישלון צריך הודעה **משלו**, כמו למעלה. אבל כשמעניין אתכם רק אם שני הדברים מתקיימים, תנאי שטוח אחד עם `and` אומר אותו דבר בפחות שורות וקל יותר לקריאה:',
    ),
    code(py`
      age = 20
      has_ticket = True
      if age >= 18 and has_ticket:
          print("Come in")
      else:
          print("Sorry, no entry")
    `, { output: 'Come in' }),
    callout(
      'tip',
      'When you mix `and` and `or` in one condition, add parentheses to show what belongs together: `year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)`. Python evaluates `not` first, then `and`, then `or` — but parentheses make the intention clear to a human reader.',
      'כשמערבבים `and` ו-`or` בתנאי אחד, הוסיפו סוגריים שמראים מה שייך למה: `year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)`. פייתון מחשב קודם `not`, אחר כך `and` ולבסוף `or` — אבל הסוגריים מבהירים את הכוונה לקורא האנושי.',
    ),
  ],

  simpler: [
    p(
      '`and` is a door with two locks: you need both keys. `or` is a door with two locks where either key opens it. `not` is a light switch: on becomes off, off becomes on.',
      '`and` הוא דלת עם שני מנעולים: צריך את שני המפתחות. `or` הוא דלת עם שני מנעולים שכל אחד מהמפתחות פותח. `not` הוא מתג אור: דולק הופך לכבוי, וכבוי הופך לדולק.',
    ),
    p(
      '"Between 1 and 10" is two questions — "at least 1?" and "at most 10?" — and both must be yes.',
      '"בין 1 ל-10" הן שתי שאלות — "לפחות 1?" ו"לכל היותר 10?" — ושתיהן חייבות להיות כן.',
    ),
    p(
      'A nested `if` is a question you only ask after the first answer was yes: "Is the shop open?" — and only then — "Do I have money?". If you just want to know whether you can buy something, one question with `and` is enough: "Is the shop open **and** do I have money?"',
      '`if` מקונן הוא שאלה ששואלים רק אחרי שהתשובה הראשונה הייתה כן: "האם החנות פתוחה?" — ורק אז — "האם יש לי כסף?". אם רק רוצים לדעת אם אפשר לקנות משהו, מספיקה שאלה אחת עם `and`: "האם החנות פתוחה **וגם** יש לי כסף?"',
    ),
  ],

  workedExample: [
    p(
      'A ride at the fair has two rules: at least 140 cm tall and at least 10 years old. Step through the program and watch both sides of the `and` being checked.',
      'למתקן בלונה-פארק יש שני כללים: גובה של לפחות 140 ס"מ וגיל של לפחות 10. עברו על התוכנית צעד אחר צעד וצפו בשני הצדדים של ה-`and` נבדקים.',
    ),
    viz(py`
      height = 150
      age = 12
      if height >= 140 and age >= 10:
          print("You may ride")
      else:
          print("Sorry, not this time")
    `),
    list([
      ['Lines 1–2 store the rider\'s height and age.', 'שורות 1–2 שומרות את הגובה והגיל של הרוכב.'],
      ['Line 3: Python checks the left side, `150 >= 140`, which is `True`. Then the right side, `12 >= 10`, also `True`. `True and True` is `True`, so the `if` block runs.', 'שורה 3: פייתון בודק את הצד השמאלי, `150 >= 140`, שהוא `True`. אחר כך את הצד הימני, `12 >= 10`, גם הוא `True`. `True and True` הוא `True`, ולכן הבלוק של ה-`if` רץ.'],
      ['Line 4 prints `You may ride`; the `else` block is skipped.', 'שורה 4 מדפיסה `You may ride`; מדלגים על הבלוק של ה-`else`.'],
      ['Change `age` to 8: the right side becomes `False`, `True and False` is `False`, and the `else` block runs instead. One `False` is enough to close the door.', 'שנו את `age` ל-8: הצד הימני הופך ל-`False`, `True and False` הוא `False`, והבלוק של ה-`else` רץ במקום. `False` אחד מספיק כדי לסגור את הדלת.'],
    ], true),
    code(py`
      You may ride
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('or: is it the weekend?', 'or: האם זה סוף השבוע?'),
      code(py`
        day = "Sunday"
        if day == "Saturday" or day == "Sunday":
            print("Weekend")
        else:
            print("Weekday")
      `, { output: 'Weekend' }),
      p(
        'Only one of the two comparisons is `True`, and for `or` that is enough. Notice that the variable is repeated on both sides of the `or`.',
        'רק אחת משתי ההשוואות היא `True`, ועבור `or` זה מספיק. שימו לב שהמשתנה חוזר בשני הצדדים של ה-`or`.',
      ),
    ],
    [
      h('not: flipping a stored answer', 'not: הפיכת תשובה שמורה'),
      code(py`
        door_locked = True
        if not door_locked:
            print("Come in")
        else:
            print("Knock first")
      `, { output: 'Knock first' }),
      p(
        '`door_locked` is `True`, so `not door_locked` is `False` and the `else` block runs. `not` reads almost like English: "if not locked, come in".',
        '`door_locked` הוא `True`, ולכן `not door_locked` הוא `False` והבלוק של ה-`else` רץ. `not` נקרא כמעט כמו אנגלית: "if not locked, come in".',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l14-hard',
    title: ['Flatten the nested if', 'שטחו את ה-if המקונן'],
    mode: 'modify',
    instructions: [
      p(
        'This program works, but it uses an `if` inside an `if` and repeats `No entry` twice. Rewrite the decision as a **single** `if` with `and`, so that `Welcome` prints only for members who are at least 18 and `No entry` prints in every other case. Also make the membership answer case-insensitive, so that `YES` and `Yes` count as `yes`.',
        'התוכנית הזאת עובדת, אבל היא משתמשת ב-`if` בתוך `if` וחוזרת על `No entry` פעמיים. כתבו מחדש את ההחלטה כ-`if` **יחיד** עם `and`, כך ש-`Welcome` יודפס רק לחברי מועדון בני 18 ומעלה, ו-`No entry` יודפס בכל מקרה אחר. בנוסף, הפכו את תשובת החברות ללא תלויה בגודל האותיות, כך ש-`YES` ו-`Yes` ייחשבו `yes`.',
      ),
    ],
    starterCode: py`
      age = int(input("Age: "))
      member = input("Member (yes/no): ")
      if age >= 18:
          if member == "yes":
              print("Welcome")
          else:
              print("No entry")
      else:
          print("No entry")
    `,
    sampleStdin: ['20', 'yes'],
    check: {
      tests: [
        outputTest('Welcome', { stdin: ['20', 'yes'] }),
        outputTest('No entry', { stdin: ['20', 'no'] }),
        outputTest('No entry', { stdin: ['15', 'yes'] }),
        outputTest('Welcome', { stdin: ['30', 'YES'] }),
        outputTest('No entry', { stdin: ['17', 'Yes'] }),
      ],
      requires: [requires('\\band\\b', 'Combine the two conditions with and.', 'שלבו את שני התנאים בעזרת and.')],
      forbids: [
        requires('^(?: {4,}|\\t+)(if|elif|else)\\b', 'Do not nest: write one if with and instead of an if inside an if.', 'אל תקננו: כתבו if אחד עם and במקום if בתוך if.'),
      ],
    },
    hints: [
      ['Welcome should print only when both things are true: `age >= 18` and the answer is yes. That is one condition with `and`.', 'Welcome צריך להיות מודפס רק כששני הדברים מתקיימים: `age >= 18` והתשובה היא yes. זהו תנאי אחד עם `and`.'],
      ['Use `member.lower() == "yes"` so that capital letters do not matter.', 'השתמשו ב-`member.lower() == "yes"` כדי שאותיות גדולות לא ישנו.'],
      ['`if age >= 18 and member.lower() == "yes":` print Welcome, `else:` print No entry. Delete the inner if completely.', '`if age >= 18 and member.lower() == "yes":` הדפיסו Welcome, `else:` הדפיסו No entry. מחקו את ה-if הפנימי לגמרי.'],
    ],
    solution: py`
      age = int(input("Age: "))
      member = input("Member (yes/no): ")
      if age >= 18 and member.lower() == "yes":
          print("Welcome")
      else:
          print("No entry")
    `,
    concepts: ['and', 'nested-if', 'if', 'else', 'upper-lower'],
  }),

  predict: {
    code: py`
      a = 5
      b = 12
      print(a > 3 and b > 20)
      print(a > 3 or b > 20)
      print(not a > 3)
    `,
    prompt: t('What does this program print? (three lines)', 'מה התוכנית הזאת תדפיס? (שלוש שורות)'),
    answer: 'False\nTrue\nFalse',
    explanation: t(
      'a > 3 is True and b > 20 is False. and needs both, so the first line is False. or needs only one, so the second line is True. not flips the True of a > 3 into False.',
      'a > 3 הוא True ו-b > 20 הוא False. and צריך את שניהם, ולכן השורה הראשונה היא False. or צריך רק אחד, ולכן השורה השנייה היא True. not הופך את ה-True של a > 3 ל-False.',
    ),
  },

  exercise: exercise({
    id: 'l14-ex',
    title: ['Login check', 'בדיקת התחברות'],
    mode: 'write',
    instructions: [
      p(
        'Ask for a username and then a password — two `input()` calls, any prompt text. If the username is exactly `admin` **and** the password is exactly `secret`, print `Welcome`. In every other case print `Access denied`. Use `and` so that a single `if` checks both. Capital letters matter here: `Admin` is not `admin`.',
        'בקשו שם משתמש ואחריו סיסמה — שתי קריאות `input()`, טקסט הבקשה חופשי. אם שם המשתמש הוא בדיוק `admin` **וגם** הסיסמה היא בדיוק `secret`, הדפיסו `Welcome`. בכל מקרה אחר הדפיסו `Access denied`. השתמשו ב-`and` כדי ש-`if` אחד יבדוק את שניהם. גודל האותיות משנה כאן: `Admin` אינו `admin`.',
      ),
    ],
    starterCode: py`
      username = input("Username: ")
      password = input("Password: ")
      # print Welcome only if both are correct, otherwise Access denied

    `,
    sampleStdin: ['admin', 'secret'],
    check: {
      tests: [
        outputTest('Welcome', { stdin: ['admin', 'secret'] }),
        outputTest('Access denied', { stdin: ['admin', 'wrong'] }),
        outputTest('Access denied', { stdin: ['guest', 'secret'] }),
        outputTest('Access denied', { stdin: ['Admin', 'secret'] }),
      ],
      requires: [requires('\\band\\b', 'Use and to check both conditions in one if.', 'השתמשו ב-and כדי לבדוק את שני התנאים ב-if אחד.')],
    },
    hints: [
      ['Each side of the `and` is a complete comparison: `username == "admin"` and `password == "secret"`.', 'כל צד של ה-`and` הוא השוואה שלמה: `username == "admin"` ו-`password == "secret"`.'],
      ['`if username == "admin" and password == "secret":` then print Welcome in the block.', '`if username == "admin" and password == "secret":` ואז הדפיסו Welcome בבלוק.'],
      ['Add `else:` with `print("Access denied")` for every other case.', 'הוסיפו `else:` עם `print("Access denied")` לכל מקרה אחר.'],
    ],
    solution: py`
      username = input("Username: ")
      password = input("Password: ")
      if username == "admin" and password == "secret":
          print("Welcome")
      else:
          print("Access denied")
    `,
    concepts: ['and', 'if', 'else', 'equality'],
  }),

  build: exercise({
    id: 'l14-build',
    title: ['A day planner', 'מתכנן יום'],
    mode: 'build',
    instructions: [
      p(
        'Build a small planner. Ask for the weather as a word (`rain`, `sun` or `cloudy`) and then for the temperature as a whole number — two `input()` calls, any prompt text. Then print exactly one line:',
        'בנו מתכנן קטן. בקשו את מזג האוויר כמילה (`rain`, `sun` או `cloudy`) ואחר כך את הטמפרטורה כמספר שלם — שתי קריאות `input()`, טקסט הבקשה חופשי. אחר כך הדפיסו בדיוק שורה אחת:',
      ),
      list([
        ['`Stay inside` if the weather is `rain` **or** the temperature is below 10.', '`Stay inside` אם מזג האוויר הוא `rain` **או** הטמפרטורה נמוכה מ-10.'],
        ['Otherwise `Beach day` if the weather is `sun` **and** the temperature is at least 25.', 'אחרת `Beach day` אם מזג האוויר הוא `sun` **וגם** הטמפרטורה היא לפחות 25.'],
        ['Otherwise `Go for a walk`.', 'אחרת `Go for a walk`.'],
      ]),
    ],
    starterCode: py`
      weather = input("Weather (rain/sun/cloudy): ")
      temperature = int(input("Temperature: "))
      # print Stay inside, Beach day, or Go for a walk

    `,
    sampleStdin: ['sun', '30'],
    check: {
      tests: [
        outputTest('Stay inside', { stdin: ['rain', '30'] }),
        outputTest('Stay inside', { stdin: ['sun', '5'] }),
        outputTest('Beach day', { stdin: ['sun', '30'] }),
        outputTest('Beach day', { stdin: ['sun', '25'] }),
        outputTest('Go for a walk', { stdin: ['sun', '20'] }),
        outputTest('Go for a walk', { stdin: ['cloudy', '15'] }),
        outputTest('Go for a walk', { stdin: ['cloudy', '28'] }),
        outputTest('Stay inside', { stdin: ['rain', '9'] }),
      ],
    },
    hints: [
      ['Three outcomes means an if / elif / else chain. The first condition uses `or`: `weather == "rain" or temperature < 10`.', 'שלוש תוצאות פירושן שרשרת if / elif / else. התנאי הראשון משתמש ב-`or`: `weather == "rain" or temperature < 10`.'],
      ['The second condition uses `and`: `weather == "sun" and temperature >= 25`.', 'התנאי השני משתמש ב-`and`: `weather == "sun" and temperature >= 25`.'],
      ['The `else` at the end prints `Go for a walk`. Check the order: the "stay inside" test must come first.', 'ה-`else` בסוף מדפיס `Go for a walk`. בדקו את הסדר: הבדיקה של "stay inside" חייבת לבוא ראשונה.'],
    ],
    solution: py`
      weather = input("Weather (rain/sun/cloudy): ")
      temperature = int(input("Temperature: "))
      if weather == "rain" or temperature < 10:
          print("Stay inside")
      elif weather == "sun" and temperature >= 25:
          print("Beach day")
      else:
          print("Go for a walk")
    `,
    solutionNote: [
      'Any prompt texts are fine. What matters is the order of the conditions and the or / and inside them.',
      'כל טקסט בקשה מתאים. מה שחשוב הוא סדר התנאים וה-or / and שבתוכם.',
    ],
    concepts: ['and', 'or', 'elif', 'else', 'input'],
  }),

  check: [
    choice(
      'l14-c1',
      ['`x` holds 7. What is the value of `x > 5 and x < 10`?', '`x` מחזיק 7. מה הערך של `x > 5 and x < 10`?'],
      [
        opt('`True`', '`True`', {
          correct: true,
          feedback: ['Right. Both sides are True, and and needs exactly that.', 'נכון. שני הצדדים True, וזה בדיוק מה ש-and צריך.'],
        }),
        opt('`False`', '`False`', {
          feedback: ['7 is greater than 5 and less than 10, so both comparisons are True.', '7 גדול מ-5 וקטן מ-10, ולכן שתי ההשוואות True.'],
        }),
        opt('`7`', '`7`', {
          feedback: ['and combines two True/False answers; the result is a boolean, not a number.', 'and משלב שתי תשובות True/False; התוצאה היא ערך בוליאני, לא מספר.'],
        }),
        opt('An error', 'שגיאה', {
          feedback: ['This is a perfectly valid condition. It could even be written as 5 < x < 10.', 'זהו תנאי תקין לחלוטין. אפשר אפילו לכתוב אותו כ-5 < x < 10.'],
        }),
      ],
      ['and'],
    ),
    choice(
      'l14-c2',
      [
        p('Which single condition does the same as this nested if?', 'איזה תנאי יחיד עושה אותו דבר כמו ה-if המקונן הזה?'),
        code(py`
          if a > 0:
              if b > 0:
                  print("both positive")
        `, { runnable: false }),
      ],
      [
        opt('`if a > 0 and b > 0:`', '`if a > 0 and b > 0:`', {
          correct: true,
          feedback: ['Yes. The inner block runs only when both conditions are True — exactly what and means.', 'כן. הבלוק הפנימי רץ רק כששני התנאים True — בדיוק המשמעות של and.'],
        }),
        opt('`if a > 0 or b > 0:`', '`if a > 0 or b > 0:`', {
          feedback: ['or would print the message when only one of them is positive. The nested version needs both.', 'or היה מדפיס את ההודעה גם כשרק אחד מהם חיובי. הגרסה המקוננת דורשת את שניהם.'],
        }),
        opt('`if not a > 0:`', '`if not a > 0:`', {
          feedback: ['not flips a single answer; it does not combine two conditions.', 'not הופך תשובה אחת; הוא לא משלב שני תנאים.'],
        }),
        opt('It cannot be written as one condition.', 'אי אפשר לכתוב את זה כתנאי אחד.', {
          feedback: ['It can: whenever the inner if has no else, and does the same job in one line.', 'אפשר: בכל פעם שאין ל-if הפנימי else, and עושה את אותה עבודה בשורה אחת.'],
        }),
      ],
      ['nested-if', 'and'],
    ),
    choice(
      'l14-c3',
      ['What is the value of `not (3 > 5)`?', 'מה הערך של `not (3 > 5)`?'],
      [
        opt('`True`', '`True`', {
          correct: true,
          feedback: ['Correct. 3 > 5 is False, and not flips it to True.', 'נכון. 3 > 5 הוא False, ו-not הופך אותו ל-True.'],
        }),
        opt('`False`', '`False`', {
          feedback: ['3 > 5 is False on its own — but not flips it.', '3 > 5 הוא False בפני עצמו — אבל not הופך אותו.'],
        }),
        opt('`3`', '`3`', {
          feedback: ['not always produces True or False, never a number.', 'not תמיד מייצר True או False, אף פעם לא מספר.'],
        }),
        opt('An error', 'שגיאה', {
          feedback: ['not in front of a comparison in parentheses is valid and common.', 'not לפני השוואה בסוגריים הוא תקין ונפוץ.'],
        }),
      ],
      ['not'],
    ),
  ],

  recap: [
    list([
      ['`and` needs both sides `True`; `or` needs at least one; `not` flips the answer.', '`and` צריך ששני הצדדים יהיו `True`; `or` צריך לפחות אחד; `not` הופך את התשובה.'],
      ['`1 <= n <= 10` is a range check, the same as `n >= 1 and n <= 10`.', '`1 <= n <= 10` היא בדיקת טווח, בדיוק כמו `n >= 1 and n <= 10`.'],
      ['Each side of `and` / `or` must be a complete comparison: `x == 1 or x == 2`, not `x == 1 or 2`.', 'כל צד של `and` / `or` חייב להיות השוואה שלמה: `x == 1 or x == 2`, לא `x == 1 or 2`.'],
      ['An `if` inside an `if` runs only when the outer condition was `True`. If you only need both to be true, flatten it with `and`.', '`if` בתוך `if` רץ רק כשהתנאי החיצוני היה `True`. אם צריך רק ששניהם יתקיימו, שטחו אותו בעזרת `and`.'],
      ['Use parentheses when mixing `and` with `or`.', 'השתמשו בסוגריים כשמערבבים `and` עם `or`.'],
    ]),
    p(
      'With comparisons, if/elif/else and the three logical words you can express any rule: eligibility, validation, game rules, even leap years.',
      'עם השוואות, `if`/`elif`/`else` ושלוש המילים הלוגיות אתם יכולים לבטא כל כלל: זכאות, אימות קלט, חוקי משחק, ואפילו שנים מעוברות.',
    ),
  ],
  next: t(
    'You have finished the decisions module. Take the module test, then move on to loops — where a program repeats work while a condition stays True.',
    'סיימתם את מודול ההחלטות. גשו למבחן המודול, ואז המשיכו ללולאות — שם תוכנית חוזרת על עבודה כל עוד תנאי נשאר `True`.',
  ),
};
