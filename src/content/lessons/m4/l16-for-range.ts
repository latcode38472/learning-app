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
  id: 'l16-for-range',
  moduleId: 'm4',
  title: t('for loops and range(): counting made easy', 'לולאות for ו-range(): לספור בקלות'),
  tagline: t('When you know how many times, let Python count for you.', 'כשיודעים כמה פעמים, תנו לפייתון לספור בשבילכם.'),
  estimatedMinutes: 20,
  introduces: ['for', 'range', 'loop-variable'],
  requires: ['while', 'counter', 'print', 'variable', 'arithmetic', 'f-string'],
  runsInBrowser: true,

  objective: t(
    'Use for with range() to run a block a known number of times, choose the start, stop and step, and decide when for fits better than while.',
    'להשתמש ב-for עם `range()` כדי להריץ בלוק מספר ידוע של פעמים, לבחור התחלה, סוף וקפיצה, ולהחליט מתי for מתאים יותר מ-while.',
  ),
  prerequisiteCheck: t(
    'You can write a while loop with a counter, and print with an f-string such as f"{x} squared is {x * x}" (lessons 10 and 15).',
    'אתם יודעים לכתוב לולאת while עם מונה, ולהדפיס עם f-string כמו `f"{x} squared is {x * x}"` (שיעורים 10 ו-15).',
  ),

  explanation: [
    p(
      'In the last lesson every counting loop needed three parts: a start value, a condition and a change. That pattern is so common that Python has a shorter loop for it. With `for` and `range()` you say how many numbers you want and Python does the counting.',
      'בשיעור הקודם כל לולאת ספירה דרשה שלושה חלקים: ערך התחלה, תנאי ושינוי. התבנית הזאת כל כך נפוצה שלפייתון יש לולאה קצרה יותר בשבילה. עם `for` ו-`range()` אתם אומרים כמה מספרים אתם רוצים, ופייתון סופר.',
    ),
    term(
      'for',
      '`for i in range(5):` runs the indented block once for every number that `range(5)` produces. Before each round Python puts the next number into the variable `i`. When the numbers run out, the loop ends.',
      '`for i in range(5):` מריץ את הבלוק המוזח פעם אחת עבור כל מספר ש-`range(5)` מייצר. לפני כל סיבוב פייתון מכניס את המספר הבא למשתנה `i`. כשהמספרים נגמרים, הלולאה מסתיימת.',
    ),
    term(
      'range()',
      '`range(n)` produces the whole numbers from 0 up to, but not including, n. So `range(5)` gives five numbers: 0, 1, 2, 3, 4. Counting from zero feels odd at first, but it is how Python counts almost everywhere.',
      '`range(n)` מייצר את המספרים השלמים מ-0 ועד n, לא כולל n. כך `range(5)` נותן חמישה מספרים: 0, 1, 2, 3, 4. לספור מאפס מרגיש מוזר בהתחלה, אבל כך פייתון סופר כמעט בכל מקום.',
    ),
    code(py`
      for i in range(5):
          print(i)
    `, { output: '0\n1\n2\n3\n4' }),
    p(
      'The variable `i` is the **loop variable**: it holds the number that `range` produced for the current round. You choose its name like any variable; `i` is a common choice for a simple count, but `day` or `row` is clearer when the number means something. Compare this with the same program written with while: four lines become two, and there is no counter to forget.',
      'המשתנה `i` הוא **משתנה הלולאה** (loop variable): הוא מחזיק את המספר ש-`range` ייצר עבור הסיבוב הנוכחי. את שמו אתם בוחרים כמו לכל משתנה; `i` הוא בחירה נפוצה לספירה פשוטה, אבל `day` או `row` ברור יותר כשלמספר יש משמעות. השוו עם אותה תוכנית שנכתבה עם while: ארבע שורות הופכות לשתיים, ואין מונה שאפשר לשכוח.',
    ),
    code(py`
      i = 0
      while i < 5:
          print(i)
          i += 1
    `, { output: '0\n1\n2\n3\n4', caption: t('The same loop written with while.', 'אותה לולאה כתובה עם while.') }),
    h('Choosing where to start and stop', 'לבחור איפה להתחיל ואיפה לעצור'),
    p(
      '`range` accepts up to three numbers: `range(start, stop)` begins at `start` instead of 0, and `range(start, stop, step)` jumps by `step` each time. The step can be negative to count down. In every form the `stop` value itself is **not** produced.',
      '`range` מקבל עד שלושה מספרים: `range(start, stop)` מתחיל ב-`start` במקום ב-0, ו-`range(start, stop, step)` קופץ ב-`step` בכל פעם. הקפיצה יכולה להיות שלילית כדי לספור לאחור. בכל הצורות הערך `stop` עצמו **לא** מיוצר.',
    ),
    table(
      [['Expression', 'ביטוי'], ['Numbers produced', 'המספרים שמתקבלים'], ['How many', 'כמה']],
      [
        [['`range(5)`', '`range(5)`'], ['0 1 2 3 4', '0 1 2 3 4'], ['5', '5']],
        [['`range(1, 6)`', '`range(1, 6)`'], ['1 2 3 4 5', '1 2 3 4 5'], ['5', '5']],
        [['`range(0, 10, 3)`', '`range(0, 10, 3)`'], ['0 3 6 9', '0 3 6 9'], ['4', '4']],
        [['`range(5, 0, -1)`', '`range(5, 0, -1)`'], ['5 4 3 2 1', '5 4 3 2 1'], ['5', '5']],
      ],
    ),
    callout(
      'note',
      'To print 1 to 10 you need range(1, 11). Forgetting that the stop value is left out is the most common range mistake; when a loop stops one short, check the stop value first.',
      'כדי להדפיס מ-1 עד 10 צריך `range(1, 11)`. הטעות הנפוצה ביותר עם range היא לשכוח שערך העצירה לא נכלל; כשלולאה עוצרת אחד מוקדם מדי, בדקו קודם את ערך העצירה.',
      t('One short', 'אחד פחות'),
    ),
    callout(
      'tip',
      'Use for when you know in advance how many rounds you want, or when you walk through a sequence of numbers. Use while when you repeat until something happens, like waiting for the user to type yes. Both loops can do everything; for is simply shorter for counting.',
      'השתמשו ב-for כשאתם יודעים מראש כמה סיבובים אתם רוצים, או כשאתם עוברים על סדרה של מספרים. השתמשו ב-while כשחוזרים עד שמשהו קורה, למשל המתנה שהמשתמש יקליד yes. שתי הלולאות יכולות לעשות הכול; for פשוט קצרה יותר לספירה.',
      t('for or while?', 'for או while?'),
    ),
  ],

  simpler: [
    p(
      'Imagine a stack of numbered tickets. `range(5)` prepares five tickets: 0, 1, 2, 3 and 4. The for loop takes the top ticket, does the block with it, throws it away, and takes the next one.',
      'דמיינו ערימה של כרטיסים ממוספרים. `range(5)` מכין חמישה כרטיסים: 0, 1, 2, 3 ו-4. לולאת for לוקחת את הכרטיס העליון, מבצעת איתו את הבלוק, זורקת אותו, ולוקחת את הבא.',
    ),
    p(
      'The loop variable is the ticket in your hand right now. Inside the block, `i` is whatever number is written on that ticket.',
      'משתנה הלולאה הוא הכרטיס שביד שלכם ברגע זה. בתוך הבלוק, `i` הוא המספר שכתוב על הכרטיס הזה.',
    ),
    p(
      'When the stack is empty the loop is over. You never have to count the tickets yourself or remember to move to the next one: that is the whole point of for.',
      'כשהערימה ריקה הלולאה נגמרה. אתם אף פעם לא צריכים לספור את הכרטיסים בעצמכם או לזכור לעבור לכרטיס הבא: זו כל הפואנטה של for.',
    ),
  ],

  workedExample: [
    p(
      'This program prints each number from 1 to 4 next to its square. Press play and watch the loop variable `n` take a new value at the start of every round.',
      'התוכנית הזאת מדפיסה כל מספר מ-1 עד 4 לצד הריבוע שלו. לחצו על הפעלה וצפו במשתנה הלולאה `n` מקבל ערך חדש בתחילת כל סיבוב.',
    ),
    viz(py`
      for n in range(1, 5):
          print(n, n * n)
    `),
    list([
      ['`range(1, 5)` prepares the numbers 1, 2, 3, 4. The 5 is the stop value and is left out.', '`range(1, 5)` מכין את המספרים 1, 2, 3, 4. ה-5 הוא ערך העצירה והוא נשאר בחוץ.'],
      ['Round 1: `n` is 1, so the line prints `1 1`.', 'סיבוב 1: `n` הוא 1, ולכן השורה מדפיסה `1 1`.'],
      ['Round 2: `n` is 2, and `n * n` is 4. Rounds 3 and 4 print 9 and 16.', 'סיבוב 2: `n` הוא 2, ו-`n * n` הוא 4. סיבובים 3 ו-4 מדפיסים 9 ו-16.'],
      ['After the fourth round there are no numbers left, so the loop ends. Nothing in the block changed `n`; the for loop did that by itself.', 'אחרי הסיבוב הרביעי לא נשארו מספרים, ולכן הלולאה מסתיימת. שום דבר בבלוק לא שינה את `n`; לולאת for עשתה זאת בעצמה.'],
    ], true),
    code(py`
      1 1
      2 4
      3 9
      4 16
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('Counting down with a negative step', 'ספירה לאחור עם קפיצה שלילית'),
      code(py`
        for i in range(3, 0, -1):
            print(i)
        print("Go!")
      `, { output: '3\n2\n1\nGo!' }),
      p(
        'With a step of -1 the numbers go down: 3, 2, 1. The stop value 0 is not produced, which is exactly what a countdown needs. The last print is not indented, so it runs once after the loop.',
        'עם קפיצה של -1 המספרים יורדים: 3, 2, 1. ערך העצירה 0 לא מיוצר, וזה בדיוק מה שספירה לאחור צריכה. ה-print האחרון לא מוזח, ולכן הוא רץ פעם אחת אחרי הלולאה.',
      ),
    ],
    [
      h('A times table with f-strings', 'לוח כפל עם f-strings'),
      code(py`
        for i in range(1, 4):
            print(f"3 x {i} = {3 * i}")
      `, { output: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9' }),
      p(
        'The loop variable can be used inside calculations and f-strings like any other variable. Change `range(1, 4)` to `range(1, 11)` and you get the full table of 3.',
        'אפשר להשתמש במשתנה הלולאה בתוך חישובים ו-f-strings כמו בכל משתנה אחר. שנו את `range(1, 4)` ל-`range(1, 11)` ותקבלו את לוח הכפל המלא של 3.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l16-hard',
    title: ['Multiples of three', 'כפולות של שלוש'],
    mode: 'write',
    instructions: [
      p(
        'Read two whole numbers, `start` and `end` (any prompt text). Print every number from `start` to `end`, including both, that is divisible by 3 — one per line. For 1 and 10 the output is `3`, `6`, `9`. Remember that `n % 3 == 0` is True exactly when `n` is divisible by 3.',
        'קראו שני מספרים שלמים, `start` ו-`end` (טקסט הבקשה חופשי). הדפיסו כל מספר מ-`start` עד `end`, כולל שניהם, שמתחלק ב-3 — אחד בכל שורה. עבור 1 ו-10 הפלט הוא `3`, `6`, `9`. זכרו ש-`n % 3 == 0` הוא True בדיוק כאשר `n` מתחלק ב-3.',
      ),
    ],
    starterCode: py`
      start = int(input("Start: "))
      end = int(input("End: "))
      # print every number from start to end that is divisible by 3

    `,
    sampleStdin: ['1', '10'],
    check: {
      tests: [
        outputTest('3\n6\n9', { stdin: ['1', '10'] }),
        outputTest('6', { stdin: ['6', '6'] }),
        outputTest('12\n15', { stdin: ['10', '15'] }),
      ],
      requires: [requires('\\bfor\\b', 'Use a for loop with range.', 'השתמשו בלולאת for עם range.')],
    },
    hints: [
      ['Loop over every number from start to end, and inside the loop decide with an if whether to print it.', 'עברו בלולאה על כל מספר מ-start עד end, ובתוך הלולאה החליטו עם if אם להדפיס אותו.'],
      ['To include `end`, the stop value must be one bigger: `range(start, end + 1)`.', 'כדי לכלול את `end`, ערך העצירה חייב להיות גדול באחד: `range(start, end + 1)`.'],
      ['`for n in range(start, end + 1):` then `if n % 3 == 0:` then `print(n)`.', '`for n in range(start, end + 1):` ואז `if n % 3 == 0:` ואז `print(n)`.'],
    ],
    solution: py`
      start = int(input("Start: "))
      end = int(input("End: "))
      for n in range(start, end + 1):
          if n % 3 == 0:
              print(n)
    `,
    concepts: ['for', 'range', 'modulo', 'if'],
  }),

  predict: {
    code: py`
      for i in range(2, 8, 3):
          print(i)
    `,
    prompt: t('What does this program print?', 'מה התוכנית הזאת תדפיס?'),
    answer: '2\n5',
    explanation: t(
      'The loop starts at 2 and adds 3 each time: 2, then 5. The next number would be 8, but 8 is the stop value and is not produced, so only 2 and 5 are printed.',
      'הלולאה מתחילה ב-2 ומוסיפה 3 בכל פעם: 2, ואז 5. המספר הבא היה 8, אבל 8 הוא ערך העצירה והוא לא מיוצר, ולכן רק 2 ו-5 מודפסים.',
    ),
  },

  exercise: exercise({
    id: 'l16-ex',
    title: ['One short', 'אחד פחות'],
    mode: 'fix',
    instructions: [
      p(
        'This program should read a number `n` and print the numbers from 1 to `n`, one per line, and then `Done`. Right now it starts at 0 and stops one number too early: for 5 it prints 0 to 4. Fix the `range` so the output for 5 is `1`, `2`, `3`, `4`, `5`, `Done`.',
        'התוכנית הזאת צריכה לקרוא מספר `n` ולהדפיס את המספרים מ-1 עד `n`, אחד בכל שורה, ואז `Done`. כרגע היא מתחילה ב-0 ועוצרת מספר אחד מוקדם מדי: עבור 5 היא מדפיסה 0 עד 4. תקנו את ה-`range` כך שהפלט עבור 5 יהיה `1`, `2`, `3`, `4`, `5`, `Done`.',
      ),
    ],
    starterCode: py`
      n = int(input("Up to: "))
      for i in range(n):
          print(i)
      print("Done")
    `,
    sampleStdin: ['5'],
    check: {
      tests: [
        outputTest('1\n2\n3\n4\n5\nDone', { stdin: ['5'] }),
        outputTest('1\nDone', { stdin: ['1'] }),
        outputTest('1\n2\n3\nDone', { stdin: ['3'] }),
      ],
      requires: [requires('\\bfor\\b', 'Keep the for loop.', 'השאירו את לולאת ה-for.')],
    },
    hints: [
      ['`range(n)` starts at 0. Give range a start value as well.', '`range(n)` מתחיל ב-0. תנו ל-range גם ערך התחלה.'],
      ['The stop value is never produced, so to reach `n` the stop must be `n + 1`.', 'ערך העצירה אף פעם לא מיוצר, ולכן כדי להגיע ל-`n` העצירה חייבת להיות `n + 1`.'],
      ['Use `range(1, n + 1)`.', 'השתמשו ב-`range(1, n + 1)`.'],
    ],
    solution: py`
      n = int(input("Up to: "))
      for i in range(1, n + 1):
          print(i)
      print("Done")
    `,
    concepts: ['for', 'range'],
  }),

  build: exercise({
    id: 'l16-build',
    title: ['A times table', 'לוח כפל'],
    mode: 'build',
    instructions: [
      p(
        'Build a times-table printer. Read a whole number (any prompt text) and print its table from 1 to 10: ten lines in the exact shape `7 x 1 = 7`, `7 x 2 = 14`, and so on up to `7 x 10 = 70`. Use a for loop and an f-string; do not write ten print lines.',
        'בנו תוכנית שמדפיסה לוח כפל.קראו מספר שלם (טקסט הבקשה חופשי) והדפיסו את לוח הכפל שלו מ-1 עד 10: עשר שורות בצורה המדויקת `7 x 1 = 7`, `7 x 2 = 14`, וכן הלאה עד `7 x 10 = 70`. השתמשו בלולאת for וב-f-string; אל תכתבו עשר שורות print.',
      ),
      code('7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n...\n7 x 10 = 70', { lang: 'text', runnable: false }),
    ],
    starterCode: py`
      number = int(input("Which table? "))
      # print the table from 1 to 10

    `,
    sampleStdin: ['7'],
    check: {
      tests: [
        outputTest(
          '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70',
          { stdin: ['7'] },
        ),
        outputTest(
          '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30',
          { stdin: ['3'] },
        ),
      ],
      requires: [requires('\\bfor\\b', 'Use a for loop.', 'השתמשו בלולאת for.')],
    },
    hints: [
      ['You need the numbers 1 to 10, so the range is `range(1, 11)`.', 'אתם צריכים את המספרים מ-1 עד 10, ולכן הטווח הוא `range(1, 11)`.'],
      ['Each line has three changing parts: the number, the loop variable, and their product.', 'בכל שורה יש שלושה חלקים שמשתנים: המספר, משתנה הלולאה, והמכפלה שלהם.'],
      ['`print(f"{number} x {i} = {number * i}")` inside `for i in range(1, 11):`.', '`print(f"{number} x {i} = {number * i}")` בתוך `for i in range(1, 11):`.'],
    ],
    solution: py`
      number = int(input("Which table? "))
      for i in range(1, 11):
          print(f"{number} x {i} = {number * i}")
    `,
    concepts: ['for', 'range', 'loop-variable', 'f-string'],
  }),

  check: [
    choice(
      'l16-c1',
      ['Which numbers does `range(4)` produce?', 'אילו מספרים `range(4)` מייצר?'],
      [
        opt('0, 1, 2, 3', '0, 1, 2, 3', {
          correct: true,
          feedback: ['Right. It starts at 0 and stops before 4, so there are four numbers.', 'נכון. הוא מתחיל ב-0 ועוצר לפני 4, ולכן יש ארבעה מספרים.'],
        }),
        opt('1, 2, 3, 4', '1, 2, 3, 4', {
          feedback: ['range starts at 0 unless you give it a start value. For 1 to 4 you would write `range(1, 5)`.', 'range מתחיל ב-0 אלא אם נותנים לו ערך התחלה. בשביל 1 עד 4 כותבים `range(1, 5)`.'],
        }),
        opt('0, 1, 2, 3, 4', '0, 1, 2, 3, 4', {
          feedback: ['The stop value is never produced. 4 is left out.', 'ערך העצירה אף פעם לא מיוצר. 4 נשאר בחוץ.'],
        }),
        opt('Only 4', 'רק 4', {
          feedback: ['range(4) is a whole sequence of numbers, not a single value.', '`range(4)` הוא סדרה שלמה של מספרים, לא ערך יחיד.'],
        }),
      ],
      ['range'],
    ),
    choice(
      'l16-c2',
      ['How many times does the block run in `for i in range(3, 9, 2):`?', 'כמה פעמים הבלוק רץ ב-`for i in range(3, 9, 2):`?'],
      [
        opt('3 times: i is 3, 5, 7', '3 פעמים: i הוא 3, 5, 7', {
          correct: true,
          feedback: ['Correct. Start at 3, add 2 each time, and stop before 9.', 'נכון. מתחילים ב-3, מוסיפים 2 בכל פעם, ועוצרים לפני 9.'],
        }),
        opt('4 times: i is 3, 5, 7, 9', '4 פעמים: i הוא 3, 5, 7, 9', {
          feedback: ['9 is the stop value, and the stop value is never produced.', '9 הוא ערך העצירה, וערך העצירה אף פעם לא מיוצר.'],
        }),
        opt('6 times: i is 3, 4, 5, 6, 7, 8', '6 פעמים: i הוא 3, 4, 5, 6, 7, 8', {
          feedback: ['The third number, 2, is the step: the loop jumps by 2 instead of 1.', 'המספר השלישי, 2, הוא הקפיצה: הלולאה קופצת ב-2 במקום ב-1.'],
        }),
      ],
      ['range', 'loop-variable'],
    ),
    choice(
      'l16-c3',
      ['You want to keep asking a question until the user types `quit`. Which loop fits best?', 'אתם רוצים להמשיך לשאול שאלה עד שהמשתמש מקליד `quit`. איזו לולאה מתאימה יותר?'],
      [
        opt('A while loop, because you do not know in advance how many answers there will be.', 'לולאת while, כי אתם לא יודעים מראש כמה תשובות יהיו.', {
          correct: true,
          feedback: ['Yes. Repeating until something happens is exactly what while is for.', 'כן. לחזור עד שמשהו קורה — בדיוק לזה נועדה while.'],
        }),
        opt('A for loop with range(100), because 100 answers should be enough.', 'לולאת for עם `range(100)`, כי 100 תשובות אמורות להספיק.', {
          feedback: ['A for loop is built for a fixed number of rounds: stopping when the user types quit would need extra work, and 100 may not be enough.', 'לולאת for בנויה למספר קבוע של סיבובים: כדי לעצור כשהמשתמש מקליד quit היא תצטרך עבודה נוספת, ו-100 אולי לא יספיקו.'],
        }),
        opt('Neither: only an if statement can check what the user typed.', 'אף אחת מהן: רק משפט if יכול לבדוק מה המשתמש הקליד.', {
          feedback: ['The while condition checks the answer itself: `while answer != "quit":`.', 'התנאי של while בודק את התשובה בעצמו: `while answer != "quit":`.'],
        }),
      ],
      ['for', 'while'],
    ),
  ],

  recap: [
    list([
      ['`for i in range(n):` runs the block once for each of the numbers 0 to n - 1.', '`for i in range(n):` מריץ את הבלוק פעם אחת עבור כל אחד מהמספרים 0 עד n - 1.'],
      ['`range(start, stop)` begins at start; `range(start, stop, step)` jumps by step, which may be negative.', '`range(start, stop)` מתחיל ב-start; `range(start, stop, step)` קופץ ב-step, שיכול להיות שלילי.'],
      ['The stop value is never produced: to reach 10 write `range(1, 11)`.', 'ערך העצירה אף פעם לא מיוצר: כדי להגיע ל-10 כתבו `range(1, 11)`.'],
      ['The loop variable holds the number `range` produced for the current round and can be used in the block.', 'משתנה הלולאה מחזיק את המספר ש-`range` ייצר לסיבוב הנוכחי, ואפשר להשתמש בו בבלוק.'],
      ['for is for a known number of rounds; while is for repeating until something happens.', 'for מתאימה למספר ידוע של סיבובים; while מתאימה לחזרה עד שמשהו קורה.'],
    ]),
    p(
      'You now have two loops. Most of the programs you write from here on will use a for loop somewhere, because counting a known number of times is the most common kind of repetition.',
      'עכשיו יש לכם שתי לולאות. רוב התוכניות שתכתבו מכאן והלאה ישתמשו בלולאת for איפשהו, כי ספירה של מספר ידוע של פעמים היא סוג החזרה הנפוץ ביותר.',
    ),
  ],
  next: t(
    'Next you will use loops to build up a result — a total, a count — and learn how to leave a loop early with break.',
    'בשיעור הבא תשתמשו בלולאות כדי לבנות תוצאה — סכום, ספירה — ותלמדו לצאת מלולאה מוקדם בעזרת break.',
  ),
};
