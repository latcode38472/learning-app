import type { GlossaryEntry } from '../../schema';

export const glossary: GlossaryEntry[] = [
  /* ---------------------------------------------------- l15-while */
  {
    id: 'while',
    term: 'while',
    name: { en: 'while loop', he: 'לולאת while' },
    definition: {
      en: 'A loop that repeats its indented block as long as a condition is True. The condition is checked before every round.',
      he: 'לולאה שחוזרת על הבלוק המוזח שלה כל עוד תנאי הוא True. התנאי נבדק לפני כל סיבוב.',
    },
    example: 'while count <= 3:\n    print(count)\n    count += 1',
    lessonId: 'l15-while',
  },
  {
    id: 'loop-condition',
    term: 'loop condition',
    name: { en: 'loop condition', he: 'תנאי הלולאה' },
    definition: {
      en: 'The comparison after while that decides whether the block runs again. When it becomes False the loop ends.',
      he: 'ההשוואה שאחרי while שמחליטה אם הבלוק ירוץ שוב. כשהיא הופכת ל-False הלולאה מסתיימת.',
    },
    example: 'while n > 0:',
    lessonId: 'l15-while',
  },
  {
    id: 'counter',
    term: 'counter',
    name: { en: 'counter', he: 'מונה' },
    definition: {
      en: 'A variable that counts the rounds of a loop: it gets a start value before the loop and changes inside it, usually with count += 1.',
      he: 'משתנה שסופר את הסיבובים של לולאה: הוא מקבל ערך התחלה לפני הלולאה ומשתנה בתוכה, בדרך כלל עם `count += 1`.',
    },
    example: 'count = 0\nwhile count < 5:\n    count += 1',
    lessonId: 'l15-while',
  },
  {
    id: 'infinite-loop',
    term: 'infinite loop',
    name: { en: 'infinite loop', he: 'לולאה אינסופית' },
    definition: {
      en: 'A loop whose condition never becomes False, so it never ends by itself. Usually the counter was never changed inside the block.',
      he: 'לולאה שהתנאי שלה אף פעם לא הופך ל-False, ולכן היא לא מסתיימת בעצמה. בדרך כלל המונה לא שונה בתוך הבלוק.',
    },
    example: 'n = 1\nwhile n < 3:\n    print(n)   # n never changes',
    lessonId: 'l15-while',
  },
  /* ---------------------------------------------------- l16-for-range */
  {
    id: 'for',
    term: 'for',
    name: { en: 'for loop', he: 'לולאת for' },
    definition: {
      en: 'A loop that runs its block once for every item in a sequence, such as the numbers produced by range(). Python moves to the next item by itself.',
      he: 'לולאה שמריצה את הבלוק שלה פעם אחת עבור כל פריט בסדרה, כמו המספרים ש-`range()` מייצר. פייתון עובר לפריט הבא בעצמו.',
    },
    example: 'for i in range(3):\n    print(i)',
    lessonId: 'l16-for-range',
  },
  {
    id: 'range',
    term: 'range()',
    name: { en: 'range()', he: 'range()' },
    definition: {
      en: 'Produces a sequence of whole numbers for a for loop. range(5) gives 0 to 4; range(1, 6) gives 1 to 5; range(0, 10, 2) jumps by 2. The stop value is never included.',
      he: 'מייצר סדרה של מספרים שלמים ללולאת for. `range(5)` נותן 0 עד 4; `range(1, 6)` נותן 1 עד 5; `range(0, 10, 2)` קופץ ב-2. ערך העצירה אף פעם לא נכלל.',
    },
    example: 'range(1, 11)   # 1, 2, ..., 10',
    lessonId: 'l16-for-range',
  },
  {
    id: 'loop-variable',
    term: 'loop variable',
    name: { en: 'loop variable', he: 'משתנה הלולאה' },
    definition: {
      en: 'The variable named after for that holds the current item of the round, for example i in for i in range(5). Its value changes at the start of every round.',
      he: 'המשתנה שכתוב אחרי for ומחזיק את הפריט הנוכחי של הסיבוב, למשל `i` ב-`for i in range(5)`. הערך שלו משתנה בתחילת כל סיבוב.',
    },
    example: 'for day in range(1, 8):\n    print("Day", day)',
    lessonId: 'l16-for-range',
  },
  /* ---------------------------------------------------- l17-accumulators */
  {
    id: 'accumulator',
    term: 'accumulator',
    name: { en: 'accumulator', he: 'צובר' },
    definition: {
      en: 'A variable created before a loop, updated in every round, and used after the loop: a running total, a product, or a count of matches.',
      he: 'משתנה שנוצר לפני לולאה, מתעדכן בכל סיבוב, ומשמש אחרי הלולאה: סכום מצטבר, מכפלה, או ספירה של התאמות.',
    },
    example: 'total = 0\nfor i in range(1, 5):\n    total += i',
    lessonId: 'l17-accumulators',
  },
  {
    id: 'break',
    term: 'break',
    name: { en: 'break', he: 'break' },
    definition: {
      en: 'Ends the loop immediately, skipping all remaining rounds. The program continues with the first line after the loop.',
      he: 'מסיים את הלולאה מיד ומדלג על כל הסיבובים שנותרו. התוכנית ממשיכה בשורה הראשונה שאחרי הלולאה.',
    },
    example: 'while True:\n    n = int(input())\n    if n == 0:\n        break',
    lessonId: 'l17-accumulators',
  },
  {
    id: 'continue',
    term: 'continue',
    name: { en: 'continue', he: 'continue' },
    definition: {
      en: 'Skips the rest of the block for the current round and jumps straight to the next round of the loop.',
      he: 'מדלג על שאר הבלוק בסיבוב הנוכחי וקופץ ישר לסיבוב הבא של הלולאה.',
    },
    example: 'for n in range(6):\n    if n % 2 == 1:\n        continue\n    print(n)',
    lessonId: 'l17-accumulators',
  },
  /* ---------------------------------------------------- l18-nested-loops */
  {
    id: 'nested-loop',
    term: 'nested loop',
    name: { en: 'nested loop', he: 'לולאה מקוננת' },
    definition: {
      en: 'A loop written inside the block of another loop. The inner loop runs all of its rounds for every single round of the outer loop, like columns inside rows.',
      he: 'לולאה שכתובה בתוך הבלוק של לולאה אחרת. הלולאה הפנימית מריצה את כל הסיבובים שלה עבור כל סיבוב בודד של הלולאה החיצונית, כמו עמודות בתוך שורות.',
    },
    example: 'for row in range(2):\n    for col in range(3):\n        print(row, col)',
    lessonId: 'l18-nested-loops',
  },
  {
    id: 'string-repeat',
    term: 'string repetition',
    name: { en: 'string repetition', he: 'שכפול מחרוזת' },
    definition: {
      en: 'Multiplying a piece of text by a whole number repeats it: "*" * 5 is "*****". Handy for drawing rows of characters.',
      he: 'הכפלה של טקסט במספר שלם משכפלת אותו: `"*" * 5` הוא `"*****"`. שימושי לציור שורות של תווים.',
    },
    example: 'print("ab" * 3)   # ababab',
    lessonId: 'l18-nested-loops',
  },
  {
    id: 'print-end',
    term: 'end=""',
    name: { en: 'print with end=""', he: 'print עם end=""' },
    definition: {
      en: 'An extra part inside print that replaces the line break at the end of its output. With end="" the next print continues on the same line; a plain print() ends the line.',
      he: 'חלק נוסף בתוך print שמחליף את ירידת השורה בסוף הפלט שלו. עם `end=""` ה-print הבא ממשיך על אותה שורה; `print()` ריק מסיים את השורה.',
    },
    example: 'print("*", end="")\nprint("*")   # **',
    lessonId: 'l18-nested-loops',
  },
  /* ---------------------------------------------------- l19-random */
  {
    id: 'import',
    term: 'import',
    name: { en: 'import', he: 'ייבוא (import)' },
    definition: {
      en: 'Loads a module so the program can use its tools. Written once at the top of the program, for example import random.',
      he: 'טוען מודול כדי שהתוכנית תוכל להשתמש בכלים שלו. נכתב פעם אחת בראש התוכנית, למשל `import random`.',
    },
    example: 'import random',
    lessonId: 'l19-random',
  },
  {
    id: 'module',
    term: 'module',
    name: { en: 'module', he: 'מודול' },
    definition: {
      en: 'A toolbox of ready-made functions and values that comes with Python, such as random or math. After importing it, its tools are reached with a dot: module.tool.',
      he: 'ארגז כלים של פונקציות וערכים מוכנים שמגיע עם פייתון, כמו random או math. אחרי הייבוא מגיעים לכלים שלו עם נקודה: `module.tool`.',
    },
    example: 'import math\nprint(math.sqrt(16))',
    lessonId: 'l19-random',
  },
  {
    id: 'random-randint',
    term: 'random.randint()',
    name: { en: 'random.randint()', he: 'random.randint()' },
    definition: {
      en: 'Gives a random whole number between two values, both included: random.randint(1, 6) is a six-sided die. Needs import random first.',
      he: 'נותן מספר שלם אקראי בין שני ערכים, כולל שניהם: `random.randint(1, 6)` הוא קובייה עם שש פאות. דורש קודם `import random`.',
    },
    example: 'import random\ndice = random.randint(1, 6)',
    lessonId: 'l19-random',
  },
  {
    id: 'math-module',
    term: 'math',
    name: { en: 'math module', he: 'המודול math' },
    definition: {
      en: 'The module of mathematical tools. math.sqrt(x) gives the square root as a float and math.pi is the number pi. Needs import math first.',
      he: 'המודול של הכלים המתמטיים. `math.sqrt(x)` נותן את השורש הריבועי כמספר עשרוני ו-`math.pi` הוא המספר פאי. דורש קודם `import math`.',
    },
    example: 'import math\nprint(math.sqrt(25))   # 5.0',
    lessonId: 'l19-random',
  },
];
