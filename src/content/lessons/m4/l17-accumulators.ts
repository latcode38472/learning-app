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
  id: 'l17-accumulators',
  moduleId: 'm4',
  title: t('Accumulators, break and continue', 'צוברים, break ו-continue'),
  tagline: t('Add things up as you go, and leave the loop when you are done.', 'צברו תוצאות תוך כדי, וצאו מהלולאה כשסיימתם.'),
  estimatedMinutes: 25,
  introduces: ['accumulator', 'break', 'continue'],
  requires: ['for', 'range', 'while', 'variable', 'arithmetic', 'if', 'input', 'type-conversion'],
  runsInBrowser: true,

  objective: t(
    'Build a total or a count inside a loop with an accumulator variable, leave a loop early with break, and skip one round with continue.',
    'לבנות סכום או ספירה בתוך לולאה בעזרת משתנה צובר, לצאת מלולאה מוקדם בעזרת break, ולדלג על סיבוב אחד בעזרת continue.',
  ),
  prerequisiteCheck: t(
    'You can write for and while loops, use if inside a loop, and read numbers with int(input()) (lessons 9, 12, 15 and 16).',
    'אתם יודעים לכתוב לולאות for ו-while, להשתמש ב-`if` בתוך לולאה, ולקרוא מספרים בעזרת `int(input())` (שיעורים 9, 12, 15 ו-16).',
  ),

  explanation: [
    p(
      'A loop that prints every number is useful, but often you want one result **after** the loop: the sum of all the numbers, or how many of them passed a test. For that you need a variable that collects the result while the loop runs.',
      'לולאה שמדפיסה כל מספר היא שימושית, אבל לעיתים קרובות אתם רוצים תוצאה אחת **אחרי** הלולאה: הסכום של כל המספרים, או כמה מהם עברו בדיקה. בשביל זה צריך משתנה שאוסף את התוצאה בזמן שהלולאה רצה.',
    ),
    term(
      'accumulator',
      'An accumulator is a variable that is created before the loop, updated in every round, and used after the loop. For a sum: `total = 0` before, `total = total + i` inside, `print(total)` after. Each round adds a little more to what is already there.',
      'צובר (accumulator) הוא משתנה שנוצר לפני הלולאה, מתעדכן בכל סיבוב, ומשמש אחרי הלולאה. עבור סכום: `total = 0` לפני, `total = total + i` בפנים, `print(total)` אחרי. כל סיבוב מוסיף עוד קצת למה שכבר יש.',
    ),
    code(py`
      total = 0
      for i in range(1, 5):
          total = total + i
      print(total)
    `, { output: '10' }),
    p(
      'Round by round: `total` starts at 0. With `i` = 1 it becomes 1, with 2 it becomes 3, with 3 it becomes 6, with 4 it becomes 10. Nothing is printed inside the loop; only the final value is printed once the loop is over.',
      'סיבוב אחר סיבוב: `total` מתחיל ב-0. עם `i` = 1 הוא הופך ל-1, עם 2 ל-3, עם 3 ל-6, עם 4 ל-10. שום דבר לא מודפס בתוך הלולאה; רק הערך הסופי מודפס אחרי שהלולאה הסתיימה.',
    ),
    callout(
      'warning',
      'Create the accumulator before the loop. If total = 0 is inside the block, it is reset to zero in every round and the loop forgets everything it added. Start from 0 for sums and counts, and from 1 for products.',
      'צרו את הצובר לפני הלולאה. אם `total = 0` נמצא בתוך הבלוק, הוא מתאפס בכל סיבוב והלולאה שוכחת את כל מה שהוסיפה. התחילו מ-0 עבור סכומים וספירות, ומ-1 עבור מכפלות.',
      t('Where the accumulator lives', 'איפה הצובר נמצא'),
    ),
    h('Counting matches', 'ספירת התאמות'),
    p(
      'An accumulator does not have to add the loop variable. It can add 1 only when a condition holds: that is how you count. This program counts the even numbers between 1 and 10.',
      'צובר לא חייב להוסיף את משתנה הלולאה. הוא יכול להוסיף 1 רק כשתנאי מתקיים: כך סופרים. התוכנית הזאת סופרת את המספרים הזוגיים בין 1 ל-10.',
    ),
    code(py`
      count = 0
      for n in range(1, 11):
          if n % 2 == 0:
              count += 1
      print(count)
    `, { output: '5' }),
    h('Leaving early and skipping', 'לצאת מוקדם ולדלג'),
    term(
      'break',
      '`break` ends the loop immediately, even if the condition is still True or numbers are still left in the range. Python jumps to the first line after the loop. It is almost always written inside an if: "if this happens, stop looping".',
      '`break` מסיים את הלולאה מיד, גם אם התנאי עדיין True או שנשארו מספרים בטווח. פייתון קופץ לשורה הראשונה שאחרי הלולאה. כמעט תמיד כותבים אותו בתוך if: "אם זה קורה, הפסיקו לחזור".',
    ),
    code(py`
      for n in range(1, 10):
          if n * n > 30:
              break
          print(n)
    `, { output: '1\n2\n3\n4\n5' }),
    term(
      'continue',
      '`continue` skips the rest of the block for this round only and jumps straight to the next round. The loop itself keeps going. Use it to say "not this one, move on".',
      '`continue` מדלג על שאר הבלוק בסיבוב הזה בלבד וקופץ ישר לסיבוב הבא. הלולאה עצמה ממשיכה. השתמשו בו כדי לומר "לא את זה, הלאה".',
    ),
    code(py`
      for n in range(1, 7):
          if n % 3 == 0:
              continue
          print(n)
    `, { output: '1\n2\n4\n5' }),
    callout(
      'tip',
      'Sometimes the value that decides when to stop is only known inside the loop, for example a number the user types. Then write `while True:` — a condition that is always True — and end the loop with break when the stop value arrives. Without a break, `while True:` is an infinite loop.',
      'לפעמים הערך שמחליט מתי לעצור ידוע רק בתוך הלולאה, למשל מספר שהמשתמש מקליד. אז כתבו `while True:` — תנאי שתמיד True — וסיימו את הלולאה עם break כשערך העצירה מגיע. בלי break, `while True:` היא לולאה אינסופית.',
      t('while True and break', 'while True ו-break'),
    ),
  ],

  simpler: [
    p(
      'An accumulator is a piggy bank. Before you start it is empty: that is `total = 0`. Every round of the loop drops one coin in. When the loop is over you open the bank and see how much is inside. If you emptied the bank at the start of every round, you would end with only the last coin.',
      'צובר הוא קופת חיסכון. לפני שמתחילים היא ריקה: זה `total = 0`. כל סיבוב של הלולאה מכניס לתוכה מטבע אחד. כשהלולאה נגמרת פותחים את הקופה ורואים כמה יש בפנים. אם הייתם מרוקנים את הקופה בתחילת כל סיבוב, הייתם נשארים רק עם המטבע האחרון.',
    ),
    p(
      '`break` is leaving a queue. You are standing in line for tickets; the moment the sign says "sold out", you walk away at once. It does not matter how many people are still behind you.',
      '`break` הוא לעזוב תור. אתם עומדים בתור לכרטיסים; ברגע שהשלט אומר "אזל", אתם הולכים מיד. לא משנה כמה אנשים עדיין עומדים אחריכם.',
    ),
    p(
      '`continue` is skipping one item. You are sorting laundry and pick up a sock that is not yours: you put it aside and take the next item. You do not leave the room; you just skip this one.',
      '`continue` הוא לדלג על פריט אחד. אתם ממיינים כביסה ומרימים גרב שלא שלכם: מניחים אותו בצד ולוקחים את הפריט הבא. אתם לא יוצאים מהחדר; רק מדלגים על הפריט הזה.',
    ),
  ],

  workedExample: [
    p(
      'This program adds the numbers 1, 2, 3 … to a total, but stops as soon as the total is above 10. Press play and follow `total` and `n` through the rounds.',
      'התוכנית הזאת מוסיפה את המספרים 1, 2, 3 … לסכום, אבל עוצרת ברגע שהסכום עובר את 10. לחצו על הפעלה ועקבו אחרי `total` ו-`n` לאורך הסיבובים.',
    ),
    viz(py`
      total = 0
      for n in range(1, 10):
          if total > 10:
              break
          total = total + n
      print(total)
    `),
    list([
      ['`total` starts at 0, before the loop.', '`total` מתחיל ב-0, לפני הלולאה.'],
      ['Rounds with `n` = 1, 2, 3, 4: the total is not above 10, so each number is added. The total goes 1, 3, 6, 10.', 'סיבובים עם `n` = 1, 2, 3, 4: הסכום לא מעל 10, ולכן כל מספר מתווסף. הסכום עובר דרך 1, 3, 6, 10.'],
      ['Round with `n` = 5: 10 is not above 10, so 5 is added and the total becomes 15.', 'סיבוב עם `n` = 5: 10 הוא לא מעל 10, ולכן 5 מתווסף והסכום הופך ל-15.'],
      ['Round with `n` = 6: now 15 is above 10, so `break` ends the loop at once. The numbers 6 to 9 are never used.', 'סיבוב עם `n` = 6: עכשיו 15 מעל 10, ולכן `break` מסיים את הלולאה מיד. המספרים 6 עד 9 לא נמצאים בשימוש בכלל.'],
      ['After the loop, `print(total)` shows 15.', 'אחרי הלולאה, `print(total)` מציג 15.'],
    ], true),
    code(py`
      15
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('A product starts from 1', 'מכפלה מתחילה מ-1'),
      code(py`
        product = 1
        for i in range(1, 6):
            product = product * i
        print(product)
      `, { output: '120' }),
      p(
        'To multiply numbers together the accumulator must start at 1, not 0: anything multiplied by 0 stays 0. The rounds give 1, 2, 6, 24, 120. Just like `+=`, there is a shorthand `product *= i` for `product = product * i`.',
        'כדי להכפיל מספרים זה בזה הצובר חייב להתחיל מ-1, לא מ-0: כל דבר כפול 0 נשאר 0. הסיבובים נותנים 1, 2, 6, 24, 120. בדיוק כמו `+=`, יש קיצור `product *= i` עבור `product = product * i`.',
      ),
    ],
    [
      h('Searching with while True', 'חיפוש עם while True'),
      code(py`
        n = 101
        while True:
            if n % 7 == 0:
                break
            n += 1
        print(n)
      `, { output: '105' }),
      p(
        'The program looks for the first number above 100 that is divisible by 7. The condition `True` never becomes False by itself; the loop ends only through `break`, when `n % 7 == 0` finally holds. Before that, each round moves `n` up by one.',
        'התוכנית מחפשת את המספר הראשון מעל 100 שמתחלק ב-7. התנאי `True` אף פעם לא הופך ל-False בעצמו; הלולאה מסתיימת רק דרך `break`, כש-`n % 7 == 0` סוף סוף מתקיים. לפני כן, כל סיבוב מקדם את `n` באחד.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l17-hard',
    title: ['Average until zero', 'ממוצע עד אפס'],
    mode: 'write',
    instructions: [
      p(
        'Read whole numbers (any prompt text) until the user types 0. The 0 is a stop signal and is not part of the data; you can assume at least one number comes before it. Then print `Average:` followed by the average of the numbers, computed as sum divided by count. For 5, 10, 0 the output is `Average: 7.5`. You need two accumulators: one for the sum and one for the count.',
        'קראו מספרים שלמים (טקסט הבקשה חופשי) עד שהמשתמש מקליד 0. ה-0 הוא אות עצירה ולא חלק מהנתונים; אפשר להניח שלפחות מספר אחד מגיע לפניו. אחר כך הדפיסו `Average:` ואחריו את הממוצע של המספרים, שמחושב כסכום חלקי הכמות. עבור 5, 10, 0 הפלט הוא `Average: 7.5`. תצטרכו שני צוברים: אחד לסכום ואחד לספירה.',
      ),
    ],
    starterCode: py`
      total = 0
      count = 0
      # read numbers until 0, adding them up and counting them

      print("Average:", total / count)
    `,
    sampleStdin: ['5', '10', '0'],
    check: {
      tests: [
        outputTest('Average: 7.5', { stdin: ['5', '10', '0'] }),
        outputTest('Average: 3.0', { stdin: ['3', '0'] }),
        outputTest('Average: 6.0', { stdin: ['4', '8', '6', '0'] }),
      ],
      requires: [requires('\\bwhile\\b', 'Use a while loop; you do not know how many numbers will come.', 'השתמשו בלולאת while; אתם לא יודעים כמה מספרים יגיעו.')],
    },
    hints: [
      ['Read the first number before the loop, then loop while it is not 0.', 'קראו את המספר הראשון לפני הלולאה, ואז חזרו בלולאה כל עוד הוא לא 0.'],
      ['Inside the loop: add the number to `total`, add 1 to `count`, and read the next number.', 'בתוך הלולאה: הוסיפו את המספר ל-`total`, הוסיפו 1 ל-`count`, וקראו את המספר הבא.'],
      ['`while number != 0:` with `total += number`, `count += 1` and `number = int(input())` in the block; the print comes after the loop.', '`while number != 0:` עם `total += number`, `count += 1` ו-`number = int(input())` בבלוק; ה-print מגיע אחרי הלולאה.'],
    ],
    solution: py`
      total = 0
      count = 0
      number = int(input("Number (0 to stop): "))
      while number != 0:
          total += number
          count += 1
          number = int(input("Number (0 to stop): "))

      print("Average:", total / count)
    `,
    concepts: ['accumulator', 'while', 'input', 'arithmetic'],
  }),

  predict: {
    code: py`
      total = 0
      for i in range(1, 6):
          if i == 3:
              continue
          total += i
      print(total)
    `,
    prompt: t('What does this program print?', 'מה התוכנית הזאת תדפיס?'),
    answer: '12',
    explanation: t(
      'The loop adds 1, 2, 4 and 5. When i is 3, continue skips the addition for that round, so 3 is left out: 1 + 2 + 4 + 5 = 12. The loop does not stop at 3; it only skips it.',
      'הלולאה מוסיפה 1, 2, 4 ו-5. כש-i הוא 3, continue מדלג על החיבור בסיבוב הזה, ולכן 3 נשאר בחוץ: 1 + 2 + 4 + 5 = 12. הלולאה לא נעצרת ב-3; היא רק מדלגת עליו.',
    ),
  },

  exercise: exercise({
    id: 'l17-ex',
    title: ['Count the positives', 'ספירת החיוביים'],
    mode: 'complete',
    instructions: [
      p(
        'The program reads five whole numbers and should print how many of them are positive (bigger than 0). The loop and the reading are written; the counting is missing. Add the line or lines that increase `count` when the number is positive. For the numbers 3, -1, 5, 0, 2 the output is `3`.',
        'התוכנית קוראת חמישה מספרים שלמים וצריכה להדפיס כמה מהם חיוביים (גדולים מ-0). הלולאה והקריאה כבר כתובות; הספירה חסרה. הוסיפו את השורה או השורות שמגדילות את `count` כשהמספר חיובי. עבור המספרים 3, -1, 5, 0, 2 הפלט הוא `3`.',
      ),
    ],
    starterCode: py`
      count = 0
      for i in range(5):
          number = int(input("Number: "))
          # ... if number is positive, add 1 to count

      print(count)
    `,
    sampleStdin: ['3', '-1', '5', '0', '2'],
    check: {
      tests: [
        outputTest('3', { stdin: ['3', '-1', '5', '0', '2'] }),
        outputTest('5', { stdin: ['1', '1', '1', '1', '1'] }),
        outputTest('0', { stdin: ['-2', '0', '-4', '-5', '-6'] }),
      ],
    },
    hints: [
      ['You need an if inside the loop: the count grows only for some numbers.', 'אתם צריכים if בתוך הלולאה: הספירה גדלה רק עבור חלק מהמספרים.'],
      ['The condition is `number > 0`. Zero is not positive.', 'התנאי הוא `number > 0`. אפס אינו חיובי.'],
      ['`if number > 0:` and, indented under it, `count += 1`.', '`if number > 0:` ומתחתיו, מוזח, `count += 1`.'],
    ],
    solution: py`
      count = 0
      for i in range(5):
          number = int(input("Number: "))
          if number > 0:
              count += 1

      print(count)
    `,
    concepts: ['accumulator', 'for', 'if'],
  }),

  build: exercise({
    id: 'l17-build',
    title: ['Sum until zero', 'סכום עד אפס'],
    mode: 'build',
    instructions: [
      p(
        'Build a small adding machine. Read whole numbers (any prompt text) until the user types 0. Then print exactly `Sum:` followed by a space and the sum of all the numbers before the 0. For 5, 10, 2, 0 the output is `Sum: 17`. If the first number is already 0, the output is `Sum: 0`. Negative numbers are allowed and are simply added.',
        'בנו מכונת חיבור קטנה. קראו מספרים שלמים (טקסט הבקשה חופשי) עד שהמשתמש מקליד 0. אחר כך הדפיסו בדיוק `Sum:` ואחריו רווח והסכום של כל המספרים שלפני ה-0. עבור 5, 10, 2, 0 הפלט הוא `Sum: 17`. אם כבר המספר הראשון הוא 0, הפלט הוא `Sum: 0`. מספרים שליליים מותרים ופשוט מתווספים.',
      ),
    ],
    starterCode: py`
      # read numbers until 0 and add them up

    `,
    sampleStdin: ['5', '10', '2', '0'],
    check: {
      tests: [
        outputTest('Sum: 17', { stdin: ['5', '10', '2', '0'] }),
        outputTest('Sum: 0', { stdin: ['0'] }),
        outputTest('Sum: 7', { stdin: ['-3', '3', '7', '0'] }),
      ],
      requires: [requires('\\bwhile\\b', 'Use a while loop; the number of inputs is not known in advance.', 'השתמשו בלולאת while; מספר הקלטים לא ידוע מראש.')],
    },
    hints: [
      ['Start with `total = 0`. You can loop with `while True:` and break when the number is 0, or read one number first and loop while it is not 0.', 'התחילו עם `total = 0`. אפשר לחזור עם `while True:` ולצאת עם break כשהמספר הוא 0, או לקרוא מספר אחד קודם ולחזור כל עוד הוא לא 0.'],
      ['Inside the loop, read a number with `int(input(...))`; if it is 0, `break`; otherwise `total += number`.', 'בתוך הלולאה, קראו מספר עם `int(input(...))`; אם הוא 0, `break`; אחרת `total += number`.'],
      ['After the loop: `print("Sum:", total)` — print adds the space for you.', 'אחרי הלולאה: `print("Sum:", total)` — ה-print מוסיף את הרווח בשבילכם.'],
    ],
    solution: py`
      total = 0
      while True:
          number = int(input("Number (0 to stop): "))
          if number == 0:
              break
          total += number
      print("Sum:", total)
    `,
    solutionNote: [
      'A loop with `while number != 0:` that reads the next number at the end of the block works just as well.',
      'לולאה עם `while number != 0:` שקוראת את המספר הבא בסוף הבלוק עובדת בדיוק באותה מידה.',
    ],
    concepts: ['accumulator', 'while', 'break', 'input'],
  }),

  check: [
    choice(
      'l17-c1',
      ['Why is `total = 0` written before the loop and not inside it?', 'למה `total = 0` נכתב לפני הלולאה ולא בתוכה?'],
      [
        opt('Inside the loop it would reset the total to 0 in every round, losing everything added so far.', 'בתוך הלולאה הוא היה מאפס את הסכום בכל סיבוב, ומאבד את כל מה שהתווסף עד אז.', {
          correct: true,
          feedback: ['Right. The accumulator must be created once, before the rounds begin.', 'נכון. את הצובר צריך ליצור פעם אחת, לפני שהסיבובים מתחילים.'],
        }),
        opt('Python requires every variable to be created at the top of the program.', 'פייתון דורש שכל משתנה ייווצר בראש התוכנית.', {
          feedback: ['No such rule exists; variables can be created anywhere. The reason is what would happen to the value every round.', 'אין כלל כזה; אפשר ליצור משתנים בכל מקום. הסיבה היא מה שהיה קורה לערך בכל סיבוב.'],
        }),
        opt('Otherwise the loop would not be able to print total.', 'אחרת הלולאה לא הייתה יכולה להדפיס את total.', {
          feedback: ['Printing would still work; the problem is that the value would be wrong, because it restarts from 0 each round.', 'ההדפסה עדיין הייתה עובדת; הבעיה היא שהערך היה שגוי, כי הוא מתחיל מחדש מ-0 בכל סיבוב.'],
        }),
      ],
      ['accumulator'],
    ),
    choice(
      'l17-c2',
      ['What does `break` do inside a loop?', 'מה `break` עושה בתוך לולאה?'],
      [
        opt('Ends the loop immediately and continues after it.', 'מסיים את הלולאה מיד וממשיך אחריה.', {
          correct: true,
          feedback: ['Correct. The rest of the block and all remaining rounds are skipped.', 'נכון. שאר הבלוק וכל הסיבובים שנותרו מדולגים.'],
        }),
        opt('Skips the rest of this round and starts the next one.', 'מדלג על שאר הסיבוב הזה ומתחיל את הבא.', {
          feedback: ['That is what continue does. break leaves the loop altogether.', 'זה מה ש-continue עושה. break עוזב את הלולאה לגמרי.'],
        }),
        opt('Stops the whole program.', 'עוצר את כל התוכנית.', {
          feedback: ['Only the loop ends. The lines after the loop still run.', 'רק הלולאה מסתיימת. השורות שאחרי הלולאה עדיין רצות.'],
        }),
        opt('Pauses the loop until the user presses a key.', 'משהה את הלולאה עד שהמשתמש לוחץ על מקש.', {
          feedback: ['break never waits for anything; it simply leaves the loop.', 'break אף פעם לא מחכה לשום דבר; הוא פשוט יוצא מהלולאה.'],
        }),
      ],
      ['break'],
    ),
    choice(
      'l17-c3',
      [
        'What is printed? `for i in range(5):` then `    if i == 2:` then `        continue` then `    print(i)`',
        'מה מודפס? `for i in range(5):` ואז `    if i == 2:` ואז `        continue` ואז `    print(i)`',
      ],
      [
        opt('0, 1, 3, 4 on separate lines', '0, 1, 3, 4 בשורות נפרדות', {
          correct: true,
          feedback: ['Yes. When i is 2, continue skips the print for that round only; the loop goes on with 3 and 4.', 'כן. כש-i הוא 2, continue מדלג על ההדפסה בסיבוב הזה בלבד; הלולאה ממשיכה עם 3 ו-4.'],
        }),
        opt('0, 1', '0, 1', {
          feedback: ['That would be the output with break. continue skips one round and keeps looping.', 'זה היה הפלט עם break. continue מדלג על סיבוב אחד וממשיך בלולאה.'],
        }),
        opt('0, 1, 2, 3, 4', '0, 1, 2, 3, 4', {
          feedback: ['The print is skipped when i is 2, so 2 does not appear.', 'ההדפסה מדולגת כש-i הוא 2, ולכן 2 לא מופיע.'],
        }),
      ],
      ['continue'],
    ),
  ],

  recap: [
    list([
      ['An accumulator is created before the loop, updated in every round, and used after the loop.', 'צובר נוצר לפני הלולאה, מתעדכן בכל סיבוב, ומשמש אחרי הלולאה.'],
      ['Start at 0 for sums and counts, at 1 for products.', 'התחילו מ-0 עבור סכומים וספירות, מ-1 עבור מכפלות.'],
      ['To count matches, add 1 inside an if.', 'כדי לספור התאמות, הוסיפו 1 בתוך if.'],
      ['`break` leaves the loop at once; `continue` skips to the next round.', '`break` יוצא מהלולאה מיד; `continue` מדלג לסיבוב הבא.'],
      ['`while True:` with a `break` inside is the usual way to read input until a stop value.', '`while True:` עם `break` בפנים היא הדרך המקובלת לקרוא קלט עד ערך עצירה.'],
    ]),
    p(
      'Loops can now produce answers, not just repeat prints. Sums, counts and searches are the building blocks of almost every data task you will meet later.',
      'לולאות יכולות עכשיו לייצר תשובות, לא רק לחזור על הדפסות. סכומים, ספירות וחיפושים הם אבני הבניין של כמעט כל משימת נתונים שתפגשו בהמשך.',
    ),
  ],
  next: t(
    'Next you will put one loop inside another to work with rows and columns, and draw shapes made of characters.',
    'בשיעור הבא תכניסו לולאה אחת לתוך אחרת כדי לעבוד עם שורות ועמודות, ותציירו צורות מתווים.',
  ),
};
