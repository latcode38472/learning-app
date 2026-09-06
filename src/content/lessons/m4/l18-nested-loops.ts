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
  id: 'l18-nested-loops',
  moduleId: 'm4',
  title: t('Nested loops: rows and columns', 'לולאות מקוננות: שורות ועמודות'),
  tagline: t('A loop inside a loop draws shapes and tables.', 'לולאה בתוך לולאה מציירת צורות וטבלאות.'),
  estimatedMinutes: 25,
  introduces: ['nested-loop', 'string-repeat', 'print-end'],
  requires: ['for', 'range', 'print', 'variable', 'arithmetic', 'f-string'],
  runsInBrowser: true,

  objective: t(
    'Put a loop inside a loop to work with rows and columns, keep several prints on one line with end="", repeat text with *, and draw rectangles, triangles and a small multiplication table.',
    'להכניס לולאה לתוך לולאה כדי לעבוד עם שורות ועמודות, להשאיר כמה הדפסות על שורה אחת בעזרת `end=""`, לשכפל טקסט בעזרת `*`, ולצייר מלבנים, משולשים ולוח כפל קטן.',
  ),
  prerequisiteCheck: t(
    'You can write a for loop with range and use the loop variable inside the block (lesson 16).',
    'אתם יודעים לכתוב לולאת for עם `range` ולהשתמש במשתנה הלולאה בתוך הבלוק (שיעור 16).',
  ),

  explanation: [
    p(
      'Some jobs have two levels of repetition. A table has rows, and every row has several cells. A picture made of characters has lines, and every line has several characters. To handle "for every row, do something for every column" you put one loop inside another.',
      'לחלק מהמשימות יש שתי רמות של חזרה. לטבלה יש שורות, ובכל שורה יש כמה תאים. לתמונה שעשויה מתווים יש שורות, ובכל שורה יש כמה תווים. כדי לטפל ב"לכל שורה, עשו משהו לכל עמודה" מכניסים לולאה אחת לתוך אחרת.',
    ),
    term(
      'nested loop',
      'A nested loop is a loop written inside the block of another loop. The inner loop runs completely — all of its rounds — for every single round of the outer loop. The inner block is indented twice.',
      'לולאה מקוננת (nested loop) היא לולאה שכתובה בתוך הבלוק של לולאה אחרת. הלולאה הפנימית רצה במלואה — כל הסיבובים שלה — עבור כל סיבוב בודד של הלולאה החיצונית. הבלוק הפנימי מוזח פעמיים.',
    ),
    code(py`
      for row in range(1, 3):
          for col in range(1, 4):
              print(row, col)
    `, { output: '1 1\n1 2\n1 3\n2 1\n2 2\n2 3' }),
    p(
      'The outer loop gives `row` the value 1. Then the inner loop runs all its rounds with `col` = 1, 2, 3, printing three lines. Only then does the outer loop move on to `row` = 2, and the inner loop runs three rounds again. Two outer rounds times three inner rounds make six lines.',
      'הלולאה החיצונית נותנת ל-`row` את הערך 1. אז הלולאה הפנימית מריצה את כל הסיבובים שלה עם `col` = 1, 2, 3, ומדפיסה שלוש שורות. רק אז הלולאה החיצונית עוברת ל-`row` = 2, והלולאה הפנימית רצה שוב שלושה סיבובים. שני סיבובים חיצוניים כפול שלושה סיבובים פנימיים נותנים שש שורות.',
    ),
    h('Staying on the same line', 'להישאר על אותה שורה'),
    term(
      'end=""',
      'Normally print finishes with a line break, so the next print starts a new line. Adding `end=""` inside the parentheses tells print to finish with nothing instead, so the next print continues on the same line. A plain `print()` with nothing inside prints only a line break: use it to end the line.',
      'בדרך כלל print מסיים בירידת שורה, ולכן ה-print הבא מתחיל שורה חדשה. הוספת `end=""` בתוך הסוגריים אומרת ל-print לסיים בלי כלום במקום זאת, ולכן ה-print הבא ממשיך על אותה שורה. `print()` ריק, בלי שום דבר בפנים, מדפיס רק ירידת שורה: השתמשו בו כדי לסיים את השורה.',
    ),
    code(py`
      for i in range(3):
          print("*", end="")
      print()
      print("next line")
    `, { output: '***\nnext line' }),
    p(
      'Now the two ideas combine. The inner loop prints one star per column and stays on the line; the `print()` after it ends the row. Notice that `print()` is indented once: it belongs to the outer loop, not to the inner one, so it runs once per row.',
      'עכשיו שני הרעיונות מתחברים. הלולאה הפנימית מדפיסה כוכבית אחת לכל עמודה ונשארת על השורה; ה-`print()` שאחריה מסיים את השורה. שימו לב ש-`print()` מוזח פעם אחת: הוא שייך ללולאה החיצונית, לא לפנימית, ולכן הוא רץ פעם אחת לכל שורה.',
    ),
    code(py`
      for row in range(2):
          for col in range(5):
              print("*", end="")
          print()
    `, { output: '*****\n*****' }),
    h('Repeating text', 'שכפול טקסט'),
    term(
      '"*" * 5',
      'Multiplying a piece of text by a whole number repeats it: `"*" * 5` is `"*****"` and `"ab" * 3` is `"ababab"`. This is called string repetition. With it, a whole row of stars is a single print, and a triangle is a loop where row number `r` prints `"*" * r`.',
      'הכפלה של טקסט במספר שלם משכפלת אותו: `"*" * 5` הוא `"*****"` ו-`"ab" * 3` הוא `"ababab"`. לזה קוראים שכפול מחרוזת (string repetition). בעזרתו, שורה שלמה של כוכביות היא print אחד, ומשולש הוא לולאה שבה שורה מספר `r` מדפיסה `"*" * r`.',
    ),
    code(py`
      print("*" * 5)
      print("ab" * 3)
      for row in range(1, 5):
          print("*" * row)
    `, { output: '*****\nababab\n*\n**\n***\n****' }),
    callout(
      'tip',
      'There are two ways to draw a row: a nested loop with end="" prints one character at a time and can vary each character, while string repetition builds the whole row in one print. Both are correct; choose the one that reads better for the job.',
      'יש שתי דרכים לצייר שורה: לולאה מקוננת עם `end=""` מדפיסה תו אחד בכל פעם ויכולה לשנות כל תו, ואילו שכפול מחרוזת בונה את כל השורה ב-print אחד. שתי הדרכים נכונות; בחרו את זו שנקראת טוב יותר למשימה.',
      t('Two ways to draw', 'שתי דרכים לצייר'),
    ),
  ],

  simpler: [
    p(
      'Picture a classroom with rows of desks. To hand out papers you go row by row, and inside each row desk by desk. You finish a whole row before you start the next one. The rows are the outer loop and the desks are the inner loop.',
      'דמיינו כיתה עם שורות של שולחנות. כדי לחלק דפים אתם עוברים שורה אחר שורה, ובתוך כל שורה שולחן אחר שולחן. אתם מסיימים שורה שלמה לפני שמתחילים את הבאה. השורות הן הלולאה החיצונית והשולחנות הם הלולאה הפנימית.',
    ),
    p(
      '`end=""` is like typing without pressing Enter: the next thing you type continues on the same line. A plain `print()` is pressing Enter once.',
      '`end=""` הוא כמו להקליד בלי ללחוץ על Enter: הדבר הבא שתקלידו ימשיך על אותה שורה. `print()` ריק הוא לחיצה אחת על Enter.',
    ),
    p(
      '`"*" * 5` is a rubber stamp pressed five times in a row. The stamp can hold any text, and the number says how many times to press.',
      '`"*" * 5` הוא חותמת שלוחצים עליה חמש פעמים ברצף. החותמת יכולה להכיל כל טקסט, והמספר אומר כמה פעמים ללחוץ.',
    ),
  ],

  workedExample: [
    p(
      'This program draws a triangle of numbers: row 1 holds the number 1, row 2 holds 1 and 2, row 3 holds 1, 2 and 3. Press play and watch how the inner loop gets longer with every row.',
      'התוכנית הזאת מציירת משולש של מספרים: שורה 1 מכילה את המספר 1, שורה 2 מכילה 1 ו-2, שורה 3 מכילה 1, 2 ו-3. לחצו על הפעלה וצפו איך הלולאה הפנימית מתארכת עם כל שורה.',
    ),
    viz(py`
      for row in range(1, 4):
          for col in range(1, row + 1):
              print(col, end=" ")
          print()
    `),
    list([
      ['The outer loop runs with `row` = 1, 2, 3.', 'הלולאה החיצונית רצה עם `row` = 1, 2, 3.'],
      ['The inner range is `range(1, row + 1)`, so it produces the numbers 1 up to the current row: one number in the first row, two in the second, three in the third.', 'הטווח הפנימי הוא `range(1, row + 1)`, ולכן הוא מייצר את המספרים מ-1 עד השורה הנוכחית: מספר אחד בשורה הראשונה, שניים בשנייה, שלושה בשלישית.'],
      ['`print(col, end=" ")` prints the number followed by a space instead of a line break, so the numbers of one row stay together.', '`print(col, end=" ")` מדפיס את המספר ואחריו רווח במקום ירידת שורה, ולכן המספרים של שורה אחת נשארים יחד.'],
      ['`print()` after the inner loop ends the row. It is indented once, so it runs once per row.', '`print()` אחרי הלולאה הפנימית מסיים את השורה. הוא מוזח פעם אחת, ולכן רץ פעם אחת לכל שורה.'],
    ], true),
    code(py`
      1
      1 2
      1 2 3
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('A small multiplication table', 'לוח כפל קטן'),
      code(py`
        for row in range(1, 4):
            for col in range(1, 4):
                print(row * col, end=" ")
            print()
      `, { output: '1 2 3\n2 4 6\n3 6 9' }),
      p(
        'Each cell is the row number times the column number. The inner loop prints the three cells of one row with spaces between them; `print()` moves to the next row. Change both ranges to `range(1, 11)` for the full table.',
        'כל תא הוא מספר השורה כפול מספר העמודה. הלולאה הפנימית מדפיסה את שלושת התאים של שורה אחת עם רווחים ביניהם; `print()` עובר לשורה הבאה. שנו את שני הטווחים ל-`range(1, 11)` בשביל הלוח המלא.',
      ),
    ],
    [
      h('A triangle that leans right', 'משולש שנשען ימינה'),
      code(py`
        for row in range(1, 5):
            print(" " * (4 - row) + "*" * row)
      `, { output: '   *\n  **\n ***\n****' }),
      p(
        'Spaces can be repeated too. Row 1 gets three spaces and one star, row 4 gets no spaces and four stars. The `+` joins the two pieces of text into one line before printing.',
        'גם רווחים אפשר לשכפל. שורה 1 מקבלת שלושה רווחים וכוכבית אחת, שורה 4 מקבלת אפס רווחים וארבע כוכביות. ה-`+` מחבר את שני חלקי הטקסט לשורה אחת לפני ההדפסה.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l18-hard',
    title: ['A pyramid', 'פירמידה'],
    mode: 'write',
    instructions: [
      p(
        'Read the number of rows (any prompt text) and draw a centred pyramid of stars. Row number `r` (counting from 1) has `n - r` spaces on the left and then `2 * r - 1` stars. For 3 rows the output is:',
        'קראו את מספר השורות (טקסט הבקשה חופשי) וציירו פירמידה ממורכזת של כוכביות. בשורה מספר `r` (סופרים מ-1) יש `n - r` רווחים משמאל ואחריהם `2 * r - 1` כוכביות. עבור 3 שורות הפלט הוא:',
      ),
      code('  *\n ***\n*****', { lang: 'text', runnable: false }),
    ],
    starterCode: py`
      n = int(input("Rows: "))
      # draw the pyramid

    `,
    sampleStdin: ['3'],
    check: {
      tests: [
        outputTest('  *\n ***\n*****', { stdin: ['3'] }),
        outputTest('*', { stdin: ['1'] }),
        outputTest('   *\n  ***\n *****\n*******', { stdin: ['4'] }),
      ],
      requires: [requires('\\bfor\\b', 'Use a for loop over the rows.', 'השתמשו בלולאת for על השורות.')],
    },
    hints: [
      ['One loop over the rows is enough if you build each row with string repetition.', 'לולאה אחת על השורות מספיקה אם בונים כל שורה בעזרת שכפול מחרוזת.'],
      ['For row `r`, the spaces are `" " * (n - r)` and the stars are `"*" * (2 * r - 1)`.', 'עבור שורה `r`, הרווחים הם `" " * (n - r)` והכוכביות הן `"*" * (2 * r - 1)`.'],
      ['`for r in range(1, n + 1):` then `print(" " * (n - r) + "*" * (2 * r - 1))`.', '`for r in range(1, n + 1):` ואז `print(" " * (n - r) + "*" * (2 * r - 1))`.'],
    ],
    solution: py`
      n = int(input("Rows: "))
      for r in range(1, n + 1):
          print(" " * (n - r) + "*" * (2 * r - 1))
    `,
    concepts: ['string-repeat', 'for', 'range', 'concatenation'],
  }),

  predict: {
    code: py`
      for i in range(1, 3):
          for j in range(1, 3):
              print(i * j)
    `,
    prompt: t('What does this program print?', 'מה התוכנית הזאת תדפיס?'),
    answer: '1\n2\n2\n4',
    explanation: t(
      'For i = 1 the inner loop prints 1 × 1 and 1 × 2: the lines 1 and 2. For i = 2 it prints 2 × 1 and 2 × 2: the lines 2 and 4. Four lines in total, because two outer rounds each run two inner rounds.',
      'עבור i = 1 הלולאה הפנימית מדפיסה 1 × 1 ו-1 × 2: השורות 1 ו-2. עבור i = 2 היא מדפיסה 2 × 1 ו-2 × 2: השורות 2 ו-4. ארבע שורות בסך הכול, כי כל אחד משני הסיבובים החיצוניים מריץ שני סיבובים פנימיים.',
    ),
  },

  exercise: exercise({
    id: 'l18-ex',
    title: ['A rectangle of any size', 'מלבן בכל גודל'],
    mode: 'modify',
    instructions: [
      p(
        'This program draws a rectangle of stars that is always 3 rows high and 4 columns wide. Change it so that it reads the height and then the width from input (any prompt texts, two separate numbers) and draws the rectangle with `#` instead of `*`. For the inputs 2 and 5 the output is two rows of `#####`.',
        'התוכנית הזאת מציירת מלבן של כוכביות שתמיד בגובה 3 שורות וברוחב 4 עמודות. שנו אותה כך שתקרא מהקלט את הגובה ואחר כך את הרוחב (טקסטי הבקשה חופשיים, שני מספרים נפרדים) ותצייר את המלבן עם `#` במקום `*`. עבור הקלטים 2 ו-5 הפלט הוא שתי שורות של `#####`.',
      ),
    ],
    starterCode: py`
      for row in range(3):
          for col in range(4):
              print("*", end="")
          print()
    `,
    sampleStdin: ['2', '5'],
    check: {
      tests: [
        outputTest('#####\n#####', { stdin: ['2', '5'] }),
        outputTest('##\n##\n##', { stdin: ['3', '2'] }),
        outputTest('#', { stdin: ['1', '1'] }),
      ],
      requires: [requires('\\bfor\\b', 'Keep using a for loop.', 'המשיכו להשתמש בלולאת for.')],
    },
    hints: [
      ['Read two numbers first: `height = int(input("Height: "))` and then the width in the same way.', 'קראו קודם שני מספרים: `height = int(input("Height: "))` ואחר כך את הרוחב באותה דרך.'],
      ['Replace the 3 and the 4 in the two ranges with the variables you read.', 'החליפו את ה-3 ואת ה-4 בשני הטווחים במשתנים שקראתם.'],
      ['Change `"*"` to `"#"` in the inner print. The `print()` that ends each row stays as it is.', 'שנו את `"*"` ל-`"#"` ב-print הפנימי. ה-`print()` שמסיים כל שורה נשאר כמו שהוא.'],
    ],
    solution: py`
      height = int(input("Height: "))
      width = int(input("Width: "))
      for row in range(height):
          for col in range(width):
              print("#", end="")
          print()
    `,
    solutionNote: [
      'Using string repetition, `print("#" * width)` inside a single loop over the rows, is also a correct solution.',
      'גם שימוש בשכפול מחרוזת, `print("#" * width)` בתוך לולאה אחת על השורות, הוא פתרון נכון.',
    ],
    concepts: ['nested-loop', 'print-end', 'input'],
  }),

  build: exercise({
    id: 'l18-build',
    title: ['A number triangle', 'משולש מספרים'],
    mode: 'build',
    instructions: [
      p(
        'Build a triangle printer. Read the number of rows (any prompt text). Row number `r` should show the numbers from 1 to `r` separated by single spaces. For 3 rows the output is:',
        'בנו מדפסת משולשים. קראו את מספר השורות (טקסט הבקשה חופשי). שורה מספר `r` צריכה להציג את המספרים מ-1 עד `r` מופרדים ברווחים בודדים. עבור 3 שורות הפלט הוא:',
      ),
      code('1\n1 2\n1 2 3', { lang: 'text', runnable: false }),
      p(
        'A space at the very end of a line is fine; the check ignores it.',
        'רווח ממש בסוף השורה זה בסדר; הבדיקה מתעלמת ממנו.',
      ),
    ],
    starterCode: py`
      rows = int(input("Rows: "))
      # draw the triangle

    `,
    sampleStdin: ['3'],
    check: {
      tests: [
        outputTest('1\n1 2\n1 2 3', { stdin: ['3'] }),
        outputTest('1', { stdin: ['1'] }),
        outputTest('1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5', { stdin: ['5'] }),
      ],
      requires: [requires('\\bfor\\b', 'Use for loops.', 'השתמשו בלולאות for.')],
    },
    hints: [
      ['You need an outer loop over the rows and an inner loop over the numbers of the current row.', 'אתם צריכים לולאה חיצונית על השורות ולולאה פנימית על המספרים של השורה הנוכחית.'],
      ['The inner range depends on the row: `range(1, r + 1)`.', 'הטווח הפנימי תלוי בשורה: `range(1, r + 1)`.'],
      ['Print each number with `end=" "` and call `print()` after the inner loop to end the row.', 'הדפיסו כל מספר עם `end=" "` וקראו ל-`print()` אחרי הלולאה הפנימית כדי לסיים את השורה.'],
    ],
    solution: py`
      rows = int(input("Rows: "))
      for r in range(1, rows + 1):
          for n in range(1, r + 1):
              print(n, end=" ")
          print()
    `,
    concepts: ['nested-loop', 'print-end', 'for', 'range'],
  }),

  check: [
    choice(
      'l18-c1',
      ['The outer loop is `for i in range(3):` and inside it is `for j in range(4):`. How many times does the inner block run in total?', 'הלולאה החיצונית היא `for i in range(3):` ובתוכה `for j in range(4):`. כמה פעמים הבלוק הפנימי רץ בסך הכול?'],
      [
        opt('12 times', '12 פעמים', {
          correct: true,
          feedback: ['Right. The inner loop runs its 4 rounds for each of the 3 outer rounds: 3 × 4 = 12.', 'נכון. הלולאה הפנימית מריצה את 4 הסיבובים שלה עבור כל אחד מ-3 הסיבובים החיצוניים: 3 × 4 = 12.'],
        }),
        opt('7 times', '7 פעמים', {
          feedback: ['The rounds multiply, they do not add. Every outer round restarts the whole inner loop.', 'הסיבובים מוכפלים, לא מתחברים. כל סיבוב חיצוני מפעיל מחדש את כל הלולאה הפנימית.'],
        }),
        opt('4 times', '4 פעמים', {
          feedback: ['That is one pass of the inner loop. It happens once per outer round, and there are three outer rounds.', 'זה מעבר אחד של הלולאה הפנימית. הוא קורה פעם אחת בכל סיבוב חיצוני, ויש שלושה סיבובים חיצוניים.'],
        }),
      ],
      ['nested-loop'],
    ),
    choice(
      'l18-c2',
      ['What does `print("ab" * 3)` print?', 'מה `print("ab" * 3)` מדפיס?'],
      [
        opt('ababab', 'ababab', {
          correct: true,
          feedback: ['Correct. The text is repeated three times with nothing in between.', 'נכון. הטקסט משוכפל שלוש פעמים בלי שום דבר ביניהם.'],
        }),
        opt('ab ab ab', 'ab ab ab', {
          feedback: ['Repetition does not add spaces. To get spaces, repeat `"ab "` instead.', 'שכפול לא מוסיף רווחים. כדי לקבל רווחים, שכפלו `"ab "` במקום.'],
        }),
        opt('ab3', 'ab3', {
          feedback: ['The number is not glued to the text; it says how many times to repeat it.', 'המספר לא מודבק לטקסט; הוא אומר כמה פעמים לשכפל אותו.'],
        }),
        opt('An error, because you cannot multiply text', 'שגיאה, כי אי אפשר להכפיל טקסט', {
          feedback: ['Text times a whole number is allowed and means repetition. Text times text would be an error.', 'טקסט כפול מספר שלם מותר ומשמעותו שכפול. טקסט כפול טקסט היה שגיאה.'],
        }),
      ],
      ['string-repeat'],
    ),
    choice(
      'l18-c3',
      ['What does `end=""` do in `print("*", end="")`?', 'מה `end=""` עושה ב-`print("*", end="")`?'],
      [
        opt('It stops print from adding a line break, so the next print continues on the same line.', 'הוא מונע מ-print להוסיף ירידת שורה, ולכן ה-print הבא ממשיך על אותה שורה.', {
          correct: true,
          feedback: ['Yes. Without it, every print would put its star on a new line.', 'כן. בלעדיו, כל print היה שם את הכוכבית שלו בשורה חדשה.'],
        }),
        opt('It ends the loop after printing the star.', 'הוא מסיים את הלולאה אחרי הדפסת הכוכבית.', {
          feedback: ['end="" only changes what print writes after its text. Ending a loop is the job of break.', '`end=""` משנה רק מה ש-print כותב אחרי הטקסט שלו. סיום לולאה הוא התפקיד של break.'],
        }),
        opt('It prints an empty string instead of the star.', 'הוא מדפיס מחרוזת ריקה במקום הכוכבית.', {
          feedback: ['The star is still printed; end="" is what comes after it, which is nothing.', 'הכוכבית עדיין מודפסת; `end=""` הוא מה שבא אחריה, כלומר כלום.'],
        }),
      ],
      ['print-end'],
    ),
  ],

  recap: [
    list([
      ['A nested loop runs the whole inner loop for every round of the outer loop: rows times columns.', 'לולאה מקוננת מריצה את כל הלולאה הפנימית עבור כל סיבוב של החיצונית: שורות כפול עמודות.'],
      ['`print(x, end="")` stays on the same line; a plain `print()` ends the line.', '`print(x, end="")` נשאר על אותה שורה; `print()` ריק מסיים את השורה.'],
      ['`"*" * 5` repeats text: a whole row in one print.', '`"*" * 5` משכפל טקסט: שורה שלמה ב-print אחד.'],
      ['A triangle is a loop where row r prints r characters; a table is a loop inside a loop.', 'משולש הוא לולאה שבה שורה r מדפיסה r תווים; טבלה היא לולאה בתוך לולאה.'],
    ]),
    p(
      'Rows and columns appear everywhere: tables, grids, game boards, images. The nested loop you learned here is the same one that will later walk through a grid of cells or the pixels of a picture.',
      'שורות ועמודות מופיעות בכל מקום: טבלאות, רשתות, לוחות משחק, תמונות. הלולאה המקוננת שלמדתם כאן היא אותה לולאה שבהמשך תעבור על רשת של תאים או על הפיקסלים של תמונה.',
    ),
  ],
  next: t(
    'Next you will borrow ready-made tools from Python with import, including random numbers, and use them in loops.',
    'בשיעור הבא תשאלו מפייתון כלים מוכנים בעזרת `import`, כולל מספרים אקראיים, ותשתמשו בהם בלולאות.',
  ),
};
