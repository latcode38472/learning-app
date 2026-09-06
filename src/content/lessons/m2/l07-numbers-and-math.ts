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
  pythonTest,
  requires,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l07-numbers-and-math',
  moduleId: 'm2',
  title: t('Numbers and math', 'מספרים וחישובים'),
  tagline: t('Python is a calculator that never gets tired.', 'פייתון הוא מחשבון שאף פעם לא מתעייף.'),
  estimatedMinutes: 25,
  introduces: ['int', 'float', 'arithmetic', 'integer-division', 'modulo', 'power', 'precedence'],
  requires: ['print', 'variable', 'assignment'],
  runsInBrowser: true,

  objective: t(
    'Tell whole numbers from decimals, calculate with + - * / // % and **, understand the order of operations, and store numbers in variables.',
    'להבדיל בין מספרים שלמים למספרים עשרוניים, לחשב עם `+ - * / // %` ו-`**`, להבין את סדר הפעולות, ולשמור מספרים במשתנים.',
  ),
  prerequisiteCheck: t(
    'You can print values and store a value in a variable with = (lessons 5–6).',
    'אתם יודעים להדפיס ערכים ולשמור ערך במשתנה בעזרת `=` (שיעורים 5–6).',
  ),

  explanation: [
    p(
      'Python works with two kinds of numbers. Whole numbers such as `3`, `-10` and `2024` are called **int** (short for integer). Numbers with a decimal point such as `2.5`, `0.1` and `3.0` are called **float**. Numbers are written **without quotes**: `3` is a number you can calculate with, while `"3"` is a string — just the character 3.',
      'פייתון עובד עם שני סוגים של מספרים. מספרים שלמים כמו `3`, `-10` ו-`2024` נקראים **int** (קיצור של integer, מספר שלם). מספרים עם נקודה עשרונית כמו `2.5`, `0.1` ו-`3.0` נקראים **float** (מספר עשרוני). מספרים נכתבים **בלי מירכאות**: `3` הוא מספר שאפשר לחשב איתו, ואילו `"3"` הוא מחרוזת — רק התו 3.',
    ),
    term(
      'int',
      'A whole number, positive or negative, with no decimal point: `7`, `0`, `-42`. Use int for things you count: people, points, days.',
      'מספר שלם, חיובי או שלילי, בלי נקודה עשרונית: `7`, `0`, `-42`. השתמשו ב-int לדברים שסופרים: אנשים, נקודות, ימים.',
    ),
    term(
      'float',
      'A number with a decimal point: `2.5`, `0.1`, `3.0`. Use float for things you measure: prices, weights, temperatures. Even `3.0` is a float, because of the point.',
      'מספר עם נקודה עשרונית: `2.5`, `0.1`, `3.0`. השתמשו ב-float לדברים שמודדים: מחירים, משקלים, טמפרטורות. גם `3.0` הוא float, בגלל הנקודה.',
    ),
    code(py`
      print(3 + 4)
      print("3 + 4")
    `, { output: '7\n3 + 4' }),
    p(
      'Without quotes, Python calculates and prints the result. With quotes it is a string, and a string is printed exactly as typed.',
      'בלי מירכאות, פייתון מחשב ומדפיס את התוצאה. עם מירכאות זו מחרוזת, ומחרוזת מודפסת בדיוק כפי שהוקלדה.',
    ),
    term(
      '+  -  *  /',
      'The four basic operations: add with `+`, subtract with `-`, multiply with `*` (a star, not the letter x) and divide with `/`. Spaces around them are optional, but they make the code easier to read.',
      'ארבע פעולות החשבון הבסיסיות: חיבור עם `+`, חיסור עם `-`, כפל עם `*` (כוכבית, לא האות x) וחילוק עם `/`. רווחים סביבן אינם חובה, אבל הם הופכים את הקוד לקריא יותר.',
    ),
    code(py`
      print(10 + 3)
      print(10 - 3)
      print(10 * 3)
      print(10 / 4)
      print(8 / 2)
    `, { output: '13\n7\n30\n2.5\n4.0' }),
    callout(
      'note',
      'Division with `/` always gives a float, even when the result is a whole number: `8 / 2` is `4.0`, not `4`. Python cannot know in advance whether a division will come out even, so it always uses the type that can hold a fraction.',
      'חילוק עם `/` תמיד נותן float, גם כשהתוצאה היא מספר שלם: `8 / 2` הוא `4.0`, לא `4`. פייתון לא יכול לדעת מראש אם החילוק ייצא שלם, ולכן הוא תמיד משתמש בטיפוס שיכול להכיל שבר.',
    ),
    term(
      '//',
      'Whole-number division (also called integer division): how many **whole** times one number fits into another. `7 // 2` is `3`, because 2 fits into 7 three whole times. Whatever is left over is dropped.',
      'חילוק שלם (integer division): כמה פעמים **שלמות** מספר אחד נכנס במספר אחר. `7 // 2` הוא `3`, כי 2 נכנס ב-7 שלוש פעמים שלמות. מה שנשאר פשוט נזרק.',
    ),
    term(
      '%',
      'The remainder (also called modulo): what is left after whole-number division. `7 % 2` is `1`, because after taking three 2s out of 7, one remains. Two everyday uses: `n % 2` is `0` for even numbers and `1` for odd numbers, and `minutes % 60` gives the minutes that do not fill a whole hour.',
      'השארית (remainder, או בשמה השני modulo): מה שנשאר אחרי חילוק שלם. `7 % 2` הוא `1`, כי אחרי שמוציאים מ-7 שלוש פעמים 2, נשאר 1. שני שימושים יומיומיים: `n % 2` הוא `0` למספרים זוגיים ו-`1` לאי-זוגיים, ו-`minutes % 60` נותן את הדקות שלא ממלאות שעה שלמה.',
    ),
    code(py`
      minutes = 135
      print(minutes // 60, "hours and", minutes % 60, "minutes")
      print(10 % 2, 7 % 2)
    `, { output: '2 hours and 15 minutes\n0 1' }),
    term(
      '**',
      'Power: `2 ** 3` means 2 × 2 × 2, which is `8`. `5 ** 2` is 5 squared, `25`.',
      'חזקה (power): `2 ** 3` פירושו 2 × 2 × 2, כלומר `8`. `5 ** 2` הוא 5 בריבוע, `25`.',
    ),
    h('Order of operations', 'סדר פעולות'),
    p(
      'Python follows the same rules as a math class: first `**`, then `*`, `/`, `//` and `%`, and only then `+` and `-`. Operations of the same rank run from left to right. To change the order, use parentheses — whatever is inside them is calculated first.',
      'פייתון פועל לפי אותם כללים כמו בשיעור חשבון: קודם `**`, אחר כך `*`, `/`, `//` ו-`%`, ורק בסוף `+` ו-`-`. פעולות מאותה דרגה מתבצעות משמאל לימין. כדי לשנות את הסדר משתמשים בסוגריים — מה שבתוכם מחושב קודם.',
    ),
    code(py`
      print(2 + 3 * 4)
      print((2 + 3) * 4)
      print(2 ** 3 + 1)
    `, { output: '14\n20\n9' }),
    h('Numbers in variables', 'מספרים במשתנים'),
    code(py`
      price = 40
      amount = 3
      total = price * amount
      print(total)
      print(total - 20)
    `, { output: '120\n100' }),
    p(
      'A variable can hold a number, and calculations on variables work exactly like calculations on plain numbers. The result can be stored in a new variable, as `total` shows. Note that `print(total - 20)` does not change `total`: it only prints the result of the calculation.',
      'משתנה יכול להחזיק מספר, וחישובים על משתנים עובדים בדיוק כמו חישובים על מספרים רגילים. את התוצאה אפשר לשמור במשתנה חדש, כמו שרואים ב-`total`. שימו לב ש-`print(total - 20)` לא משנה את `total`: הוא רק מדפיס את תוצאת החישוב.',
    ),
    code(py`
      print(0.1 + 0.2)
    `, { output: '0.30000000000000004' }),
    callout(
      'note',
      'Surprised? Computers store decimal numbers in binary, and some decimals — like 0.1 — cannot be stored exactly, just as 1/3 cannot be written exactly as a decimal (0.333...). The stored value is off by a tiny amount, and sometimes that shows up in the last digits. This is normal, it happens in every programming language, and for everyday programs it does not matter. Later you will learn how to round results before showing them.',
      'מופתעים? מחשבים שומרים מספרים עשרוניים בבסיס בינארי, וחלק מהמספרים העשרוניים — כמו 0.1 — אי אפשר לשמור במדויק, בדיוק כמו שאת 1/3 אי אפשר לכתוב במדויק כשבר עשרוני (0.333...). הערך השמור סוטה בכמות זעירה, ולפעמים זה נראה בספרות האחרונות. זה נורמלי, זה קורה בכל שפת תכנות, ולתוכניות יומיומיות זה לא משנה. בהמשך תלמדו לעגל תוצאות לפני שמציגים אותן.',
      t('A tiny surprise with decimals', 'הפתעה קטנה עם מספרים עשרוניים'),
    ),
  ],

  simpler: [
    p(
      'A whole number is like counting apples: 1, 2, 3. A decimal is like measuring: 1.5 metres. Python calls the first kind int and the second kind float, and it tells them apart by the dot.',
      'מספר שלם הוא כמו לספור תפוחים: 1, 2, 3. מספר עשרוני הוא כמו למדוד: 1.5 מטר. פייתון קורא לסוג הראשון int ולסוג השני float, והוא מבדיל ביניהם לפי הנקודה.',
    ),
    p(
      '`+`, `-`, `*` and `/` are the buttons of a calculator. The only surprises: multiply is a star, and divide always answers with a decimal point, even `8 / 2`, which gives `4.0`.',
      '`+`, `-`, `*` ו-`/` הם הכפתורים של מחשבון. ההפתעות היחידות: כפל הוא כוכבית, וחילוק תמיד עונה עם נקודה עשרונית, אפילו `8 / 2`, שנותן `4.0`.',
    ),
    p(
      '`//` and `%` are about sharing. Share 7 sweets between 2 children: each child gets 3 (that is `7 // 2`) and 1 sweet is left over (that is `7 % 2`).',
      '`//` ו-`%` עוסקים בחלוקה. חלקו 7 סוכריות בין 2 ילדים: כל ילד מקבל 3 (זה `7 // 2`) ונשארת סוכרייה אחת (זה `7 % 2`).',
    ),
    p(
      '`**` means "times itself": `2 ** 3` is 2 × 2 × 2. And just like at school, multiplication happens before addition, unless parentheses say otherwise.',
      '`**` פירושו "כפול עצמו": `2 ** 3` הוא 2 × 2 × 2. ובדיוק כמו בבית הספר, כפל מתבצע לפני חיבור, אלא אם הסוגריים אומרים אחרת.',
    ),
  ],

  workedExample: [
    p(
      'A pizza party: 27 slices for 4 friends. Press the play button under the code to watch the variables fill up step by step.',
      'מסיבת פיצה: 27 משולשים ל-4 חברים. לחצו על כפתור ההפעלה מתחת לקוד כדי לראות איך המשתנים מתמלאים צעד אחר צעד.',
    ),
    viz(py`
      slices = 27
      friends = 4
      each = slices // friends
      left = slices % friends
      print("Each friend gets", each, "slices")
      print("Slices left over:", left)
      print("Total cost:", 3.5 * slices)
    `),
    list([
      ['Lines 1–2 store two whole numbers (ints).', 'שורות 1–2 שומרות שני מספרים שלמים (int).'],
      ['Line 3: `27 // 4` — 4 fits into 27 six whole times, so `each` becomes `6`.', 'שורה 3: `27 // 4` — 4 נכנס ב-27 שש פעמים שלמות, ולכן `each` מקבל `6`.'],
      ['Line 4: `27 % 4` — after 6 × 4 = 24 slices are handed out, 3 remain, so `left` becomes `3`.', 'שורה 4: `27 % 4` — אחרי שמחלקים 6 × 4 = 24 משולשים, נשארים 3, ולכן `left` מקבל `3`.'],
      ['Lines 5–6 print the results with labels, using commas.', 'שורות 5–6 מדפיסות את התוצאות עם תוויות, בעזרת פסיקים.'],
      ['Line 7 multiplies a float by an int. The result is a float: `94.5`.', 'שורה 7 מכפילה float ב-int. התוצאה היא float: `94.5`.'],
    ], true),
    code(py`
      Each friend gets 6 slices
      Slices left over: 3
      Total cost: 94.5
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('Seconds into minutes and seconds', 'שניות לדקות ושניות'),
      code(py`
        seconds = 200
        print(seconds // 60, "minutes and", seconds % 60, "seconds")
      `, { output: '3 minutes and 20 seconds' }),
      p(
        '`//` and `%` work as a pair: `//` tells you how many whole minutes fit in 200 seconds, and `%` tells you how many seconds are left. This pattern splits any amount into bigger and smaller units.',
        '`//` ו-`%` עובדים כזוג: `//` אומר כמה דקות שלמות נכנסות ב-200 שניות, ו-`%` אומר כמה שניות נשארות. התבנית הזאת מפצלת כל כמות ליחידות גדולות וקטנות.',
      ),
    ],
    [
      h('Parentheses change the answer', 'סוגריים משנים את התשובה'),
      code(py`
        a = 70
        b = 80
        c = 90
        print(a + b + c / 3)
        print((a + b + c) / 3)
      `, { output: '180.0\n80.0' }),
      p(
        'In line 4 only `c` is divided by 3, because division comes before addition. Line 5 adds the three grades first and gives the real average, `80.0` — a float, because `/` always gives a float.',
        'בשורה 4 רק `c` מחולק ב-3, כי חילוק מתבצע לפני חיבור. שורה 5 מחברת קודם את שלושת הציונים ונותנת את הממוצע האמיתי, `80.0` — float, כי `/` תמיד נותן float.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l07-hard',
    title: ['Hours, minutes and seconds', 'שעות, דקות ושניות'],
    mode: 'write',
    instructions: [
      p(
        'The variable `total` holds a number of seconds. Split it into whole hours, whole minutes and remaining seconds, and print three lines: `Hours: ` with the hours, `Minutes: ` with the minutes, `Seconds: ` with the seconds. For 3725 seconds the answer is 1 hour, 2 minutes and 5 seconds. An hour has 3600 seconds. Use `//` and `%` — do not type the answers yourself.',
        'המשתנה `total` מחזיק מספר שניות. פצלו אותו לשעות שלמות, דקות שלמות ושניות שנותרו, והדפיסו שלוש שורות: `Hours: ` עם השעות, `Minutes: ` עם הדקות, `Seconds: ` עם השניות. עבור 3725 שניות התשובה היא שעה אחת, 2 דקות ו-5 שניות. בשעה יש 3600 שניות. השתמשו ב-`//` וב-`%` — אל תקלידו את התשובות בעצמכם.',
      ),
      code('Hours: 1\nMinutes: 2\nSeconds: 5', { lang: 'text', runnable: false, caption: t('Expected output', 'הפלט הצפוי') }),
    ],
    starterCode: py`
      total = 3725
      # calculate hours, minutes and seconds, then print the three lines
    `,
    check: {
      requires: [
        requires('//', 'Use // for whole-number division.', 'השתמשו ב-`//` לחילוק שלם.'),
        requires('%', 'Use % to find what remains.', 'השתמשו ב-`%` כדי למצוא מה נשאר.'),
      ],
      tests: [outputTest('Hours: 1\nMinutes: 2\nSeconds: 5')],
    },
    hints: [
      ['The whole hours are `total // 3600`.', 'השעות השלמות הן `total // 3600`.'],
      ['`total % 3600` gives the seconds that do not fill a whole hour. Divide those by 60 with `//` to get the minutes.', '`total % 3600` נותן את השניות שלא ממלאות שעה שלמה. חלקו אותן ב-60 עם `//` כדי לקבל את הדקות.'],
      ['The remaining seconds are `total % 60`. Then print each value with its label, for example `print("Hours:", hours)`.', 'השניות שנותרו הן `total % 60`. אחר כך הדפיסו כל ערך עם התווית שלו, למשל `print("Hours:", hours)`.'],
    ],
    solution: py`
      total = 3725
      hours = total // 3600
      minutes = total % 3600 // 60
      seconds = total % 60
      print("Hours:", hours)
      print("Minutes:", minutes)
      print("Seconds:", seconds)
    `,
    concepts: ['integer-division', 'modulo', 'arithmetic'],
  }),

  predict: {
    code: py`
      x = 7
      print(x // 2, x % 2)
      print(x / 2)
      print(2 + 3 * 2)
    `,
    prompt: t('What does this program print? (three lines)', 'מה התוכנית הזאת תדפיס? (שלוש שורות)'),
    answer: '3 1\n3.5\n8',
    explanation: t(
      'Line 2: 2 fits into 7 three whole times with 1 left over, so it prints 3 and 1 with a space between them. Line 3: `/` always gives a float, so 7 / 2 is 3.5. Line 4: multiplication comes first, 3 * 2 = 6, then 2 + 6 = 8.',
      'שורה 2: 2 נכנס ב-7 שלוש פעמים שלמות ונשאר 1, ולכן מודפסים 3 ו-1 עם רווח ביניהם. שורה 3: `/` תמיד נותן float, ולכן 7 / 2 הוא 3.5. שורה 4: הכפל קודם, 3 * 2 = 6, ואז 2 + 6 = 8.',
    ),
  },

  exercise: exercise({
    id: 'l07-ex',
    title: ['Minutes into hours', 'מדקות לשעות'],
    mode: 'complete',
    instructions: [
      p(
        'The program below has two gaps. `minutes` holds 250 minutes. Create a variable `hours` with the number of whole hours in it (using `//`), and a variable `left` with the minutes that remain (using `%`). The program should print `Hours: 4` and then `Minutes: 10`.',
        'בתוכנית שלמטה יש שני חורים. `minutes` מחזיק 250 דקות. צרו משתנה `hours` עם מספר השעות השלמות שיש בו (בעזרת `//`), ומשתנה `left` עם הדקות שנותרות (בעזרת `%`). התוכנית צריכה להדפיס `Hours: 4` ואז `Minutes: 10`.',
      ),
    ],
    starterCode: py`
      minutes = 250

      # ... hours: the whole hours in minutes (use //)

      # ... left: the minutes that remain (use %)

      print("Hours:", hours)
      print("Minutes:", left)
    `,
    check: {
      requires: [
        requires('//', 'Use // to get the whole hours.', 'השתמשו ב-`//` כדי לקבל את השעות השלמות.'),
        requires('%', 'Use % to get the remaining minutes.', 'השתמשו ב-`%` כדי לקבל את הדקות שנותרות.'),
      ],
      tests: [
        outputTest('Hours: 4\nMinutes: 10'),
        pythonTest(py`
          assert "hours" in ns, "Create a variable called hours."
          assert "left" in ns, "Create a variable called left."
          assert ns["hours"] == 4, "hours should be 4 for 250 minutes: use minutes // 60."
          assert ns["left"] == 10, "left should be 10 for 250 minutes: use minutes % 60."
        `),
      ],
    },
    hints: [
      ['There are 60 minutes in an hour. Whole hours means whole-number division.', 'בשעה יש 60 דקות. שעות שלמות פירושן חילוק שלם.'],
      ['`hours = minutes // 60` gives 4, because 60 fits into 250 four whole times.', '`hours = minutes // 60` נותן 4, כי 60 נכנס ב-250 ארבע פעמים שלמות.'],
      ['`left = minutes % 60` gives what remains after those 4 hours: 10.', '`left = minutes % 60` נותן את מה שנשאר אחרי 4 השעות האלה: 10.'],
    ],
    solution: py`
      minutes = 250

      hours = minutes // 60

      left = minutes % 60

      print("Hours:", hours)
      print("Minutes:", left)
    `,
    concepts: ['integer-division', 'modulo', 'variable'],
  }),

  build: exercise({
    id: 'l07-build',
    title: ['A calculator card', 'כרטיס מחשבון'],
    mode: 'build',
    instructions: [
      p(
        'Build a card that shows everything Python can do with two numbers. Store two numbers of your choice in `a` and `b` (`b` must not be 0), and print six lines: the sum, the difference, the product, the quotient (`/`), the remainder (`%`) and the power (`a ** b`), each with its label. For `a = 10` and `b = 4` the card looks like this:',
        'בנו כרטיס שמראה כל מה שפייתון יודע לעשות עם שני מספרים. שמרו שני מספרים לבחירתכם ב-`a` וב-`b` (`b` לא יכול להיות 0), והדפיסו שש שורות: הסכום, ההפרש, המכפלה, המנה (`/`), השארית (`%`) והחזקה (`a ** b`), כל אחת עם התווית שלה. עבור `a = 10` ו-`b = 4` הכרטיס נראה כך:',
      ),
      code('Sum: 14\nDifference: 6\nProduct: 40\nQuotient: 2.5\nRemainder: 2\nPower: 10000', { lang: 'text', runnable: false }),
      p(
        'Use the variables in every calculation — do not type the results yourself. The check works for any numbers you choose.',
        'השתמשו במשתנים בכל חישוב — אל תקלידו את התוצאות בעצמכם. הבדיקה עובדת עם כל מספרים שתבחרו.',
      ),
    ],
    starterCode: py`
      # choose your two numbers (b must not be 0)
      a = 10
      b = 4

      # print the six lines here
    `,
    check: {
      tests: [
        pythonTest(
          py`
            assert "a" in ns and "b" in ns, "Create two variables called a and b."
            a = ns["a"]
            b = ns["b"]
            assert isinstance(a, (int, float)) and isinstance(b, (int, float)), "a and b must be numbers, written without quotes."
            assert b != 0, "b must not be 0 (dividing by zero is impossible)."
            lines = [l.strip() for l in stdout.strip().split("\n") if l.strip()]
            assert len(lines) == 6, "Print exactly six lines: Sum, Difference, Product, Quotient, Remainder, Power."
            assert lines[0] == "Sum: " + str(a + b), "Line 1 must be 'Sum: ' followed by a + b."
            assert lines[1] == "Difference: " + str(a - b), "Line 2 must be 'Difference: ' followed by a - b."
            assert lines[2] == "Product: " + str(a * b), "Line 3 must be 'Product: ' followed by a * b."
            assert lines[3] == "Quotient: " + str(a / b), "Line 4 must be 'Quotient: ' followed by a / b."
            assert lines[4] == "Remainder: " + str(a % b), "Line 5 must be 'Remainder: ' followed by a % b."
            assert lines[5] == "Power: " + str(a ** b), "Line 6 must be 'Power: ' followed by a ** b."
          `,
        ),
      ],
    },
    hints: [
      ['Each line is one print with a label and a calculation: `print("Sum:", a + b)`.', 'כל שורה היא `print` אחד עם תווית וחישוב: `print("Sum:", a + b)`.'],
      ['The labels are `Sum:`, `Difference:`, `Product:`, `Quotient:`, `Remainder:` and `Power:`, in that order.', 'התוויות הן `Sum:`, `Difference:`, `Product:`, `Quotient:`, `Remainder:` ו-`Power:`, בסדר הזה.'],
      ['The operations, in order: `a + b`, `a - b`, `a * b`, `a / b`, `a % b`, `a ** b`.', 'הפעולות, לפי הסדר: `a + b`, `a - b`, `a * b`, `a / b`, `a % b`, `a ** b`.'],
    ],
    solution: py`
      a = 10
      b = 4

      print("Sum:", a + b)
      print("Difference:", a - b)
      print("Product:", a * b)
      print("Quotient:", a / b)
      print("Remainder:", a % b)
      print("Power:", a ** b)
    `,
    solutionNote: [
      'Any two numbers work, as long as b is not 0 and every line is calculated from a and b.',
      'כל שני מספרים מתאימים, כל עוד b אינו 0 וכל שורה מחושבת מ-a ומ-b.',
    ],
    concepts: ['arithmetic', 'modulo', 'power', 'variable'],
  }),

  check: [
    choice(
      'l07-c1',
      ['What does `print(9 / 3)` show?', 'מה מציג `print(9 / 3)`?'],
      [
        opt('`3.0`', '`3.0`', {
          correct: true,
          feedback: ['Right. `/` always gives a float, even when the division comes out even.', 'נכון. `/` תמיד נותן float, גם כשהחילוק יוצא שלם.'],
        }),
        opt('`3`', '`3`', {
          feedback: ['That is what `9 // 3` gives. Plain `/` always answers with a decimal point.', 'זה מה ש-`9 // 3` נותן. `/` רגיל תמיד עונה עם נקודה עשרונית.'],
        }),
        opt('An error, because 9 is not divisible into a decimal', 'שגיאה, כי 9 לא מתחלק לשבר עשרוני', {
          feedback: ['Dividing whole numbers is always allowed (except by 0). The result is simply a float.', 'חילוק של מספרים שלמים תמיד מותר (חוץ מב-0). התוצאה היא פשוט float.'],
        }),
      ],
      ['arithmetic', 'float'],
    ),
    choice(
      'l07-c2',
      ['What does `print(14 % 5)` show?', 'מה מציג `print(14 % 5)`?'],
      [
        opt('`4`', '`4`', {
          correct: true,
          feedback: ['Yes. 5 fits into 14 twice (10), and 4 is left over.', 'כן. 5 נכנס ב-14 פעמיים (10), ונשאר 4.'],
        }),
        opt('`2`', '`2`', {
          feedback: ['2 is how many times 5 fits into 14 — that is `14 // 5`. The `%` sign gives what is left over.', '2 הוא כמה פעמים 5 נכנס ב-14 — זה `14 // 5`. הסימן `%` נותן את מה שנשאר.'],
        }),
        opt('`2.8`', '`2.8`', {
          feedback: ['2.8 is the result of `14 / 5`. The `%` sign does not divide; it gives the remainder.', '2.8 היא התוצאה של `14 / 5`. הסימן `%` לא מחלק; הוא נותן את השארית.'],
        }),
      ],
      ['modulo', 'integer-division'],
    ),
    choice(
      'l07-c3',
      ['What does `print(2 + 2 * 3)` show?', 'מה מציג `print(2 + 2 * 3)`?'],
      [
        opt('`8`', '`8`', {
          correct: true,
          feedback: ['Correct. Multiplication first: 2 * 3 = 6, then 2 + 6 = 8.', 'נכון. קודם הכפל: 2 * 3 = 6, ואז 2 + 6 = 8.'],
        }),
        opt('`12`', '`12`', {
          feedback: ['That would need parentheses: `(2 + 2) * 3`. Without them, multiplication happens before addition.', 'בשביל זה צריך סוגריים: `(2 + 2) * 3`. בלעדיהם, הכפל מתבצע לפני החיבור.'],
        }),
        opt('`10`', '`10`', {
          feedback: ['Check the order: 2 * 3 is 6, and 2 + 6 is 8.', 'בדקו את הסדר: 2 * 3 הוא 6, ו-2 + 6 הוא 8.'],
        }),
      ],
      ['precedence'],
    ),
  ],

  recap: [
    list([
      ['int is a whole number; float has a decimal point. Both are written without quotes.', 'int הוא מספר שלם; ל-float יש נקודה עשרונית. שניהם נכתבים בלי מירכאות.'],
      ['`+ - * /` are the basic operations, and `/` always gives a float.', '`+ - * /` הן הפעולות הבסיסיות, ו-`/` תמיד נותן float.'],
      ['`//` gives the whole part of a division, `%` gives the remainder, `**` is a power.', '`//` נותן את החלק השלם של חילוק, `%` נותן את השארית, `**` הוא חזקה.'],
      ['Power first, then multiply and divide, then add and subtract. Parentheses change the order.', 'קודם חזקה, אחר כך כפל וחילוק, ואז חיבור וחיסור. סוגריים משנים את הסדר.'],
      ['Variables can hold numbers, and calculations on them work like on plain numbers.', 'משתנים יכולים להחזיק מספרים, וחישובים עליהם עובדים כמו על מספרים רגילים.'],
    ]),
    p(
      'Every game score, every price and every countdown is arithmetic on variables. You now have the full set of tools for it, including the two that surprise beginners most: `//` and `%`.',
      'כל ניקוד במשחק, כל מחיר וכל ספירה לאחור הם חישוב על משתנים. עכשיו יש לכם את כל סט הכלים בשביל זה, כולל השניים שהכי מפתיעים מתחילים: `//` ו-`%`.',
    ),
  ],
  next: t(
    'Next you will look closely at the difference between numbers and text — the types of values — and learn how to convert between them.',
    'בשיעור הבא תסתכלו מקרוב על ההבדל בין מספרים לטקסט — הטיפוסים של ערכים — ותלמדו להמיר ביניהם.',
  ),
};
