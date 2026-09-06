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

/** Lines that must not appear at the top level of the file (outside any function). */
const noTopLevelInput = requires(
  '^\\S[^\\n]*\\binput\\s*\\(',
  'Read input inside a function, not at the top level of the file.',
  'קראו קלט בתוך פונקציה, לא ברמה העליונה של הקובץ.',
);
const noTopLevelWhile = requires(
  '^while\\b',
  'The loop must be inside main(), not at the top level of the file.',
  'הלולאה חייבת להיות בתוך `main()`, לא ברמה העליונה של הקובץ.',
);
const noGlobalKeyword = requires(
  '\\bglobal\\b',
  'Do not use the global keyword; pass values in and return them out.',
  'אל תשתמשו במילת המפתח global; העבירו ערכים פנימה והחזירו אותם החוצה.',
);
const needsMain = requires(
  '^def\\s+main\\s*\\(\\s*\\)\\s*:',
  'Define a function called main().',
  'הגדירו פונקציה בשם `main()`.',
);

export const lesson: Lesson = {
  id: 'l23-scope',
  moduleId: 'm5',
  title: t('Scope and the shape of a program', 'תחום משתנים ומבנה של תוכנית'),
  tagline: t('Variables inside a function stay inside. Programs are built from small functions.', 'משתנים שנוצרים בתוך פונקציה נשארים בפנים. תוכניות בונים מפונקציות קטנות.'),
  estimatedMinutes: 30,
  introduces: ['scope', 'local-variable', 'global-variable', 'program-structure'],
  requires: ['function', 'def', 'call', 'parameter', 'return', 'variable', 'while', 'if', 'input', 'type-conversion'],
  runsInBrowser: true,

  objective: t(
    'Explain which variables a function can see, pass values in and out instead of changing global variables, and organise a program with a main() function.',
    'להסביר אילו משתנים פונקציה רואה, להעביר ערכים פנימה והחוצה במקום לשנות משתנים גלובליים, ולארגן תוכנית עם פונקציית `main()`.',
  ),
  prerequisiteCheck: t(
    'You can write functions with parameters and return values (lessons 20–22), read input and convert it with int or float (lessons 8–9), and write a while loop (lesson 15).',
    'אתם יודעים לכתוב פונקציות עם פרמטרים וערכים מוחזרים (שיעורים 20–22), לקלוט קלט ולהמיר אותו עם `int` או `float` (שיעורים 8–9), ולכתוב לולאת `while` (שיעור 15).',
  ),

  explanation: [
    p(
      'A variable created inside a function is **local**: it is born when the function starts running and disappears when the function returns. Code outside the function cannot see it at all. Parameters are local too.',
      'משתנה שנוצר בתוך פונקציה הוא **מקומי** (local): הוא נולד כשהפונקציה מתחילה לרוץ ונעלם כשהפונקציה מחזירה. קוד מחוץ לפונקציה לא רואה אותו בכלל. גם פרמטרים הם מקומיים.',
    ),
    term(
      'local variable',
      'A **local variable** is a variable assigned inside a function body. It exists only during that call. Each call gets fresh local variables, and two functions can use the same name without disturbing each other.',
      '**משתנה מקומי** (local variable) הוא משתנה שמקבל ערך בתוך גוף של פונקציה. הוא קיים רק במהלך הקריאה הזאת. כל קריאה מקבלת משתנים מקומיים חדשים, ושתי פונקציות יכולות להשתמש באותו שם בלי להפריע זו לזו.',
    ),
    code(py`
      def compute():
          result = 10 * 2
          return result

      print(compute())
      print(result)      # NameError: name 'result' is not defined
    `, {
      lang: 'text',
      runnable: false,
      caption: t('Line 5 prints 20. Line 6 fails: result lived only inside compute.', 'שורה 5 מדפיסה 20. שורה 6 נכשלת: `result` חי רק בתוך `compute`.'),
    }),
    p(
      'The value 20 did come out of the function — but only because line 3 **returned** it. The variable `result` itself stays inside. This is the rule: values travel out through `return`; names do not.',
      'הערך 20 אכן יצא מהפונקציה — אבל רק מפני ששורה 3 **החזירה** אותו. המשתנה `result` עצמו נשאר בפנים. זה הכלל: ערכים יוצאים החוצה דרך `return`; שמות לא.',
    ),
    term(
      'global variable',
      'A **global variable** is created at the top level of the file, outside every function. Functions can **read** it. But assigning to that name inside a function does not change the global — it quietly creates a new local variable with the same name.',
      '**משתנה גלובלי** (global variable) הוא משתנה שנוצר ברמה העליונה של הקובץ, מחוץ לכל פונקציה. פונקציות יכולות **לקרוא** אותו. אבל השמה לשם הזה בתוך פונקציה לא משנה את הגלובלי — היא יוצרת בשקט משתנה מקומי חדש עם אותו שם.',
    ),
    code(py`
      tax = 17

      def with_tax(price):
          return price + price * tax / 100

      print(with_tax(100))
    `, { output: '117.0' }),
    code(py`
      count = 0

      def bump():
          count = 1

      bump()
      print(count)
    `, { output: '0' }),
    p(
      '`bump` did not change the global `count`: its `count = 1` created a local variable that vanished when the function ended. Python does have a `global` keyword that allows changing a global from inside a function, but programs that use it become hard to follow, because any function might change anything. The advice: pass values **in** as arguments and get results **out** with `return`.',
      '`bump` לא שינתה את `count` הגלובלי: `count = 1` שלה יצר משתנה מקומי שנעלם כשהפונקציה הסתיימה. בפייתון יש אמנם מילת מפתח `global` שמאפשרת לשנות משתנה גלובלי מתוך פונקציה, אבל תוכניות שמשתמשות בה נעשות קשות למעקב, כי כל פונקציה עלולה לשנות כל דבר. העצה: העבירו ערכים **פנימה** כארגומנטים וקבלו תוצאות **החוצה** עם `return`.',
    ),
    code(py`
      def bump(count):
          return count + 1

      count = 0
      count = bump(count)
      print(count)
    `, { output: '1' }),
    term(
      'scope',
      'The **scope** of a name is the part of the program where that name can be used. Python has two scopes that matter now: inside a function (local) and the whole file (global).',
      '**תחום** (scope) של שם הוא החלק בתוכנית שבו אפשר להשתמש בשם הזה. בפייתון יש כרגע שני תחומים שחשובים לנו: בתוך פונקציה (מקומי) והקובץ כולו (גלובלי).',
    ),
    h('The shape of a program', 'המבנה של תוכנית'),
    term(
      'main()',
      'As programs grow, a good shape is: small functions at the top, each doing one job, and a function called `main()` that runs the whole program by calling them. The last line of the file is `main()`. Anyone reading the file sees the tools first and "start here" at the bottom.',
      'כשהתוכניות גדלות, מבנה טוב הוא: פונקציות קטנות למעלה, כל אחת עם תפקיד אחד, ופונקציה בשם `main()` שמריצה את התוכנית כולה על ידי קריאה להן. השורה האחרונה בקובץ היא `main()`. מי שקורא את הקובץ רואה קודם את הכלים, ובתחתית את "מכאן מתחילים".',
    ),
    code(py`
      def ask_number():
          return int(input("Number: "))

      def double(n):
          return n * 2

      def main():
          n = ask_number()
          print(double(n))

      main()
    `, { output: '8', caption: t('If the user types 4, the program prints 8.', 'אם המשתמש מקליד 4, התוכנית מדפיסה 8.') }),
    callout(
      'why',
      'Why bother with main()? Because a program that is one long list of lines is hard to change, while a program made of named pieces is easy: to change how a number is asked, you edit `ask_number` only. It also keeps the global scope almost empty, so there are no surprises about who changed what.',
      'למה בכלל צריך `main()`? כי תוכנית שהיא רשימה ארוכה אחת של שורות קשה לשינוי, ואילו תוכנית שבנויה מחלקים עם שמות קלה לשינוי: כדי לשנות איך מבקשים מספר, עורכים רק את `ask_number`. זה גם משאיר את התחום הגלובלי כמעט ריק, כך שאין הפתעות בשאלה מי שינה מה.',
      t('Why main()?', 'למה main()?'),
    ),
  ],

  simpler: [
    p(
      'Think of a function as a room. Whatever you write on the whiteboard inside the room is local: when you leave the room, the board is wiped. Someone in the hallway cannot read it.',
      'חשבו על פונקציה כעל חדר. כל מה שאתם כותבים על הלוח שבתוך החדר הוא מקומי: כשאתם יוצאים מהחדר, הלוח נמחק. מי שנמצא במסדרון לא יכול לקרוא אותו.',
    ),
    p(
      'A sign in the hallway is global: every room can look out and read it. But if you write the same word on the room\'s whiteboard, the hallway sign does not change.',
      'שלט במסדרון הוא גלובלי: מכל חדר אפשר להציץ החוצה ולקרוא אותו. אבל אם תכתבו את אותה מילה על הלוח שבחדר, השלט במסדרון לא ישתנה.',
    ),
    p(
      'To bring something out of the room, carry it out with `return`. To bring something in, hand it over as an argument. And `main()` is the front door: the place where the program starts.',
      'כדי להוציא משהו מהחדר, קחו אותו החוצה עם `return`. כדי להכניס משהו, מסרו אותו כארגומנט. ו-`main()` היא דלת הכניסה: המקום שבו התוכנית מתחילה.',
    ),
  ],

  workedExample: [
    p(
      'Press play and watch the variables. Notice that each function has its own set: `width`, `height` and `result` exist only while `area` runs, and `main` has its own `w`, `h` and `a`.',
      'לחצו על הפעלה ועקבו אחרי המשתנים. שימו לב שלכל פונקציה יש קבוצה משלה: `width`, `height` ו-`result` קיימים רק בזמן ש-`area` רצה, ול-`main` יש `w`, `h` ו-`a` משלה.',
    ),
    viz(py`
      def area(width, height):
          result = width * height
          return result

      def main():
          w = 3
          h = 4
          a = area(w, h)
          print(f"Area: {a}")

      main()
    `),
    list([
      ['Line 11 calls `main()`. Inside it, `w` and `h` are created as locals of `main`.', 'שורה 11 קוראת ל-`main()`. בתוכה נוצרים `w` ו-`h` כמשתנים מקומיים של `main`.'],
      ['Line 8 calls `area(w, h)`: the values 3 and 4 are copied into the parameters `width` and `height`. `area` cannot see `w` or `h`; it only has the copies.', 'שורה 8 קוראת ל-`area(w, h)`: הערכים 3 ו-4 מועתקים לפרמטרים `width` ו-`height`. `area` לא רואה את `w` או `h`; יש לה רק את העותקים.'],
      ['`result` is created inside `area`, returned as 12, and then vanishes together with `width` and `height`.', '`result` נוצר בתוך `area`, מוחזר כ-12, ואז נעלם יחד עם `width` ו-`height`.'],
      ['Back in `main`, the 12 is stored in `a` and printed. When `main` finishes, its variables disappear too, and the global scope holds only the two function names.', 'בחזרה ב-`main`, ה-12 נשמר ב-`a` ומודפס. כש-`main` מסתיימת, גם המשתנים שלה נעלמים, והתחום הגלובלי מחזיק רק את שני שמות הפונקציות.'],
    ], true),
    code(py`
      Area: 12
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('The same name in two functions', 'אותו שם בשתי פונקציות'),
      code(py`
        def first():
            x = 1
            print("first:", x)

        def second():
            x = 100
            print("second:", x)

        first()
        second()
        first()
      `, { output: 'first: 1\nsecond: 100\nfirst: 1' }),
      p(
        'Each function has its own `x`. Calling `second` does not touch the `x` of `first`, and every call of `first` creates its `x` fresh.',
        'לכל פונקציה יש `x` משלה. קריאה ל-`second` לא נוגעת ב-`x` של `first`, וכל קריאה ל-`first` יוצרת את ה-`x` שלה מחדש.',
      ),
    ],
    [
      h('A loop inside a function', 'לולאה בתוך פונקציה'),
      code(py`
        def countdown(start):
            n = start
            while n > 0:
                print(n)
                n = n - 1
            print("Go")

        def main():
            countdown(3)
            countdown(2)

        main()
      `, { output: '3\n2\n1\nGo\n2\n1\nGo' }),
      p(
        '`n` is local to `countdown`, so the second call starts cleanly from 2 with nothing left over from the first call. `main` only decides what to run and in which order.',
        '`n` הוא מקומי ל-`countdown`, ולכן הקריאה השנייה מתחילה נקי מ-2, בלי שאריות מהקריאה הראשונה. `main` רק מחליטה מה להריץ ובאיזה סדר.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l23-hard',
    title: ['Guess the secret, with functions', 'לנחש את הסוד, עם פונקציות'],
    mode: 'write',
    instructions: [
      p(
        'The global variable `secret` holds the number 7. Write `check_guess(guess)` that returns the word `higher` if the guess is smaller than `secret`, `lower` if it is bigger, and `correct` if they are equal. Then write `main()` that keeps reading a number (any prompt text) and printing the word returned by `check_guess`, until the word is `correct`; then it stops. Call `main()` at the bottom. `check_guess` may read `secret`, but must not change it, and do not use the `global` keyword.',
        'המשתנה הגלובלי `secret` מחזיק את המספר 7. כתבו `check_guess(guess)` שמחזירה את המילה `higher` אם הניחוש קטן מ-`secret`, `lower` אם הוא גדול ממנו, ו-`correct` אם הם שווים. אחר כך כתבו `main()` שממשיכה לקרוא מספר (טקסט ההנחיה חופשי) ולהדפיס את המילה שמחזירה `check_guess`, עד שהמילה היא `correct`; ואז היא עוצרת. קראו ל-`main()` בתחתית. `check_guess` יכולה לקרוא את `secret`, אבל אסור לה לשנות אותו, ואל תשתמשו במילת המפתח `global`.',
      ),
    ],
    starterCode: py`
      secret = 7

      # define check_guess(guess)


      # define main()


      # call main()
    `,
    sampleStdin: ['3', '9', '7'],
    check: {
      tests: [
        pythonTest(py`
          assert callable(ns.get("check_guess")), "Define a function called check_guess."
          assert callable(ns.get("main")), "Define a function called main."
          assert ns["check_guess"](3) == "higher", "check_guess(3) should return 'higher'."
          assert ns["check_guess"](9) == "lower", "check_guess(9) should return 'lower'."
          assert ns["check_guess"](7) == "correct", "check_guess(7) should return 'correct'."
          lines = [l.strip() for l in stdout.strip().split("\n") if l.strip()]
          assert lines == ["higher", "lower", "correct"], "With the guesses 3, 9, 7 the program should print higher, lower, correct."
          again = [l.strip() for l in run(["7"]).strip().split("\n") if l.strip()]
          assert again == ["correct"], "Guessing 7 right away should print only correct."
        `, { stdin: ['3', '9', '7'] }),
      ],
      requires: [needsMain],
      forbids: [noGlobalKeyword, noTopLevelInput],
    },
    hints: [
      ['`check_guess` compares `guess` with `secret` using if: three cases, three returns.', '`check_guess` משווה את `guess` ל-`secret` בעזרת `if`: שלושה מקרים, שלושה `return`.'],
      ['In `main`, use `while True:` — read a number with `int(input())`, store the returned word, print it, and `break` when the word is "correct".', 'ב-`main` השתמשו ב-`while True:` — קראו מספר עם `int(input())`, שמרו את המילה המוחזרת, הדפיסו אותה, ועשו `break` כשהמילה היא "correct".'],
      ['Skeleton of the loop body: `word = check_guess(guess)`, `print(word)`, `if word == "correct": break`.', 'שלד של גוף הלולאה: `word = check_guess(guess)`, `print(word)`, `if word == "correct": break`.'],
    ],
    solution: py`
      secret = 7


      def check_guess(guess):
          if guess < secret:
              return "higher"
          if guess > secret:
              return "lower"
          return "correct"


      def main():
          while True:
              guess = int(input("Guess: "))
              word = check_guess(guess)
              print(word)
              if word == "correct":
                  break


      main()
    `,
    concepts: ['global-variable', 'return', 'while', 'break', 'program-structure'],
  }),

  predict: {
    code: py`
      x = 5

      def change():
          x = 10
          print(x)

      change()
      print(x)
    `,
    prompt: t('What does this program print?', 'מה התוכנית הזאת תדפיס?'),
    answer: '10\n5',
    explanation: t(
      'Inside change, x = 10 creates a local x, so the first print shows 10. The global x was never touched, so the last line prints 5.',
      'בתוך `change`, `x = 10` יוצר `x` מקומי, ולכן ה-`print` הראשון מציג 10. ב-`x` הגלובלי לא נגעו בכלל, ולכן השורה האחרונה מדפיסה 5.',
    ),
  },

  exercise: exercise({
    id: 'l23-ex',
    title: ['From one long script to functions', 'מסקריפט ארוך אחד לפונקציות'],
    mode: 'modify',
    instructions: [
      p(
        'This program works, but it is one long list of lines. Reorganise it into functions without changing what it prints: `to_fahrenheit(celsius)` returns the converted value, and `main()` reads the number (any prompt text), calls `to_fahrenheit`, and prints the line. The last line of the file must be the call `main()`. No `input` outside a function.',
        'התוכנית הזאת עובדת, אבל היא רשימה ארוכה אחת של שורות. ארגנו אותה מחדש לפונקציות בלי לשנות את מה שהיא מדפיסה: `to_fahrenheit(celsius)` מחזירה את הערך המומר, ו-`main()` קוראת את המספר (טקסט ההנחיה חופשי), קוראת ל-`to_fahrenheit` ומדפיסה את השורה. השורה האחרונה בקובץ חייבת להיות הקריאה `main()`. בלי `input` מחוץ לפונקציה.',
      ),
    ],
    starterCode: py`
      celsius = float(input("Celsius: "))
      fahrenheit = celsius * 9 / 5 + 32
      print(f"{celsius} C = {fahrenheit} F")
    `,
    sampleStdin: ['100'],
    check: {
      tests: [
        outputTest('100.0 C = 212.0 F', { stdin: ['100'] }),
        outputTest('-40.0 C = -40.0 F', { stdin: ['-40'] }),
        outputTest('37.5 C = 99.5 F', { stdin: ['37.5'] }),
        pythonTest(py`
          assert callable(ns.get("to_fahrenheit")), "Define a function called to_fahrenheit."
          assert callable(ns.get("main")), "Define a function called main."
          value = ns["to_fahrenheit"](100)
          assert value is not None, "to_fahrenheit should return the value, not print it."
          assert value == 212.0, "to_fahrenheit(100) should return 212.0."
          assert ns["to_fahrenheit"](0) == 32.0, "to_fahrenheit(0) should return 32.0."
        `, { stdin: ['0'] }),
      ],
      requires: [needsMain],
      forbids: [noTopLevelInput],
    },
    hints: [
      ['Start by moving the formula into a function: `def to_fahrenheit(celsius):` with `return celsius * 9 / 5 + 32`.', 'התחילו בהעברת הנוסחה לפונקציה: `def to_fahrenheit(celsius):` עם `return celsius * 9 / 5 + 32`.'],
      ['Then write `def main():` that reads the input, calls the function and prints the same f-string as before.', 'אחר כך כתבו `def main():` שקוראת את הקלט, קוראת לפונקציה ומדפיסה את אותו f-string כמו קודם.'],
      ['Finish with `main()` on its own line at the bottom, not indented.', 'סיימו עם `main()` בשורה משלה בתחתית, בלי הזחה.'],
    ],
    solution: py`
      def to_fahrenheit(celsius):
          return celsius * 9 / 5 + 32


      def main():
          celsius = float(input("Celsius: "))
          fahrenheit = to_fahrenheit(celsius)
          print(f"{celsius} C = {fahrenheit} F")


      main()
    `,
    concepts: ['program-structure', 'local-variable', 'return', 'input', 'type-conversion'],
  }),

  build: exercise({
    id: 'l23-build',
    title: ['Sum until zero, organised', 'סכום עד אפס, מאורגן'],
    mode: 'build',
    instructions: [
      p(
        'Build a program that adds up numbers the user types, organised as functions:',
        'בנו תוכנית שמסכמת מספרים שהמשתמש מקליד, מאורגנת בפונקציות:',
      ),
      list([
        ['`read_number()` reads one line (any prompt text) and returns it as an `int`.', '`read_number()` קוראת שורה אחת (טקסט ההנחיה חופשי) ומחזירה אותה כ-`int`.'],
        ['`main()` keeps calling `read_number()` until the number is `0`. It counts how many numbers were entered (not counting the 0) and adds them up. Then it prints two lines: `Count: N` and `Sum: S`.', '`main()` ממשיכה לקרוא ל-`read_number()` עד שהמספר הוא `0`. היא סופרת כמה מספרים הוקלדו (בלי ה-0) ומחברת אותם. אחר כך היא מדפיסה שתי שורות: `Count: N` ו-`Sum: S`.'],
        ['The last line of the file is `main()`. No loops or `input` outside functions, and no `global`.', 'השורה האחרונה בקובץ היא `main()`. בלי לולאות או `input` מחוץ לפונקציות, ובלי `global`.'],
      ]),
      p(
        'For the input `5`, `7`, `0` the program prints `Count: 2` and `Sum: 12`.',
        'עבור הקלט `5`, `7`, `0` התוכנית מדפיסה `Count: 2` ו-`Sum: 12`.',
      ),
    ],
    starterCode: py`
      # define read_number(): returns int(input(...))


      # define main(): loop until 0, then print Count and Sum


      # call main()
    `,
    sampleStdin: ['5', '7', '0'],
    check: {
      tests: [
        outputTest('Count: 2\nSum: 12', { stdin: ['5', '7', '0'] }),
        outputTest('Count: 0\nSum: 0', { stdin: ['0'] }),
        outputTest('Count: 3\nSum: 6', { stdin: ['3', '-1', '4', '0'] }),
        pythonTest(py`
          assert callable(ns.get("read_number")), "Define a function called read_number."
          assert callable(ns.get("main")), "Define a function called main."
        `, { stdin: ['0'] }),
      ],
      requires: [
        needsMain,
        requires('^def\\s+read_number\\s*\\(\\s*\\)\\s*:', 'Define a function called read_number().', 'הגדירו פונקציה בשם `read_number()`.'),
      ],
      forbids: [noTopLevelWhile, noTopLevelInput, noGlobalKeyword],
    },
    hints: [
      ['`read_number` is one line: `return int(input("Number: "))`.', '`read_number` היא שורה אחת: `return int(input("Number: "))`.'],
      ['In `main`: `count = 0`, `total = 0`, then `while True:` — read a number, `break` if it is 0, otherwise add 1 to `count` and the number to `total`.', 'ב-`main`: `count = 0`, `total = 0`, ואז `while True:` — קראו מספר, `break` אם הוא 0, אחרת הוסיפו 1 ל-`count` ואת המספר ל-`total`.'],
      ['After the loop print `f"Count: {count}"` and `f"Sum: {total}"`, then call `main()` at the bottom.', 'אחרי הלולאה הדפיסו `f"Count: {count}"` ו-`f"Sum: {total}"`, ואז קראו ל-`main()` בתחתית.'],
    ],
    solution: py`
      def read_number():
          return int(input("Number: "))


      def main():
          count = 0
          total = 0
          while True:
              number = read_number()
              if number == 0:
                  break
              count = count + 1
              total = total + number
          print(f"Count: {count}")
          print(f"Sum: {total}")


      main()
    `,
    concepts: ['program-structure', 'local-variable', 'return', 'while', 'break', 'accumulator', 'input'],
  }),

  check: [
    choice(
      'l23-c1',
      ['A variable is created inside a function. Where can it be used?', 'משתנה נוצר בתוך פונקציה. איפה אפשר להשתמש בו?'],
      [
        opt('Only inside that function, while it runs.', 'רק בתוך הפונקציה הזאת, בזמן שהיא רצה.', {
          correct: true,
          feedback: ['Right. It is local: it disappears when the function returns.', 'נכון. הוא מקומי: הוא נעלם כשהפונקציה מחזירה.'],
        }),
        opt('Anywhere in the file, after the function has been called.', 'בכל מקום בקובץ, אחרי שקראו לפונקציה.', {
          feedback: ['No. After the call the local variables are gone; using the name outside gives a NameError.', 'לא. אחרי הקריאה המשתנים המקומיים נעלמים; שימוש בשם בחוץ נותן NameError.'],
        }),
        opt('In any other function.', 'בכל פונקציה אחרת.', {
          feedback: ['Other functions cannot see it. Pass it as an argument if they need it.', 'פונקציות אחרות לא רואות אותו. העבירו אותו כארגומנט אם הן צריכות אותו.'],
        }),
        opt('Only on the line where it was created.', 'רק בשורה שבה הוא נוצר.', {
          feedback: ['It can be used on every line of the function body after it is created.', 'אפשר להשתמש בו בכל שורה בגוף הפונקציה אחרי שנוצר.'],
        }),
      ],
      ['local-variable', 'scope'],
    ),
    choice(
      'l23-c2',
      ['`total` is a global variable. Inside a function you write `total = 5`. What happens to the global `total`?', '`total` הוא משתנה גלובלי. בתוך פונקציה אתם כותבים `total = 5`. מה קורה ל-`total` הגלובלי?'],
      [
        opt('Nothing: the line creates a local variable named total.', 'שום דבר: השורה יוצרת משתנה מקומי בשם total.', {
          correct: true,
          feedback: ['Exactly. Assignment inside a function makes a local, unless you use the global keyword — which we avoid.', 'בדיוק. השמה בתוך פונקציה יוצרת משתנה מקומי, אלא אם משתמשים במילת המפתח global — שממנה אנחנו נמנעים.'],
        }),
        opt('It becomes 5.', 'הוא הופך ל-5.', {
          feedback: ['The global is untouched. To change it, return the new value and assign it outside.', 'הגלובלי לא משתנה. כדי לשנות אותו, החזירו את הערך החדש והציבו אותו בחוץ.'],
        }),
        opt('An error, because the name is already used.', 'שגיאה, כי השם כבר בשימוש.', {
          feedback: ['It is allowed: the function simply gets its own local total.', 'זה מותר: הפונקציה פשוט מקבלת total מקומי משלה.'],
        }),
        opt('Both the global and the local become 5.', 'גם הגלובלי וגם המקומי הופכים ל-5.', {
          feedback: ['Only the local is created; the global keeps its old value.', 'רק המקומי נוצר; הגלובלי שומר על ערכו הישן.'],
        }),
      ],
      ['global-variable', 'scope'],
    ),
    choice(
      'l23-c3',
      ['What is the recommended way to get a result out of a function?', 'מה הדרך המומלצת להוציא תוצאה מפונקציה?'],
      [
        opt('Return it, and store it in a variable where the function is called.', 'להחזיר אותה, ולשמור אותה במשתנה במקום שבו קוראים לפונקציה.', {
          correct: true,
          feedback: ['Right. Values in through arguments, values out through return.', 'נכון. ערכים נכנסים דרך ארגומנטים, ויוצאים דרך return.'],
        }),
        opt('Change a global variable inside the function with the global keyword.', 'לשנות משתנה גלובלי בתוך הפונקציה עם מילת המפתח global.', {
          feedback: ['It works, but it makes programs hard to follow. Prefer return.', 'זה עובד, אבל זה הופך תוכניות לקשות למעקב. העדיפו return.'],
        }),
        opt('Print it inside the function.', 'להדפיס אותה בתוך הפונקציה.', {
          feedback: ['Printing shows the value but gives the program nothing to work with.', 'הדפסה מציגה את הערך אבל לא נותנת לתוכנית שום דבר לעבוד איתו.'],
        }),
        opt('Give the local variable the same name as a variable outside.', 'לתת למשתנה המקומי אותו שם כמו למשתנה שבחוץ.', {
          feedback: ['Same name does not mean same variable: the local one still disappears.', 'אותו שם לא אומר אותו משתנה: המקומי עדיין נעלם.'],
        }),
      ],
      ['program-structure', 'return'],
    ),
  ],

  recap: [
    list([
      ['Variables created inside a function are local: they exist only during the call, and other code cannot see them.', 'משתנים שנוצרים בתוך פונקציה הם מקומיים: הם קיימים רק במהלך הקריאה, וקוד אחר לא רואה אותם.'],
      ['Functions can read global variables, but assigning to that name inside a function creates a new local instead.', 'פונקציות יכולות לקרוא משתנים גלובליים, אבל השמה לשם הזה בתוך פונקציה יוצרת משתנה מקומי חדש במקום זה.'],
      ['Pass values in as arguments and get them out with return; avoid the global keyword.', 'העבירו ערכים פנימה כארגומנטים והוציאו אותם עם `return`; הימנעו ממילת המפתח `global`.'],
      ['Organise a program as small functions plus a main() function called on the last line.', 'ארגנו תוכנית כפונקציות קטנות ועוד פונקציית `main()` שנקראת בשורה האחרונה.'],
    ]),
    p(
      'You now know the whole toolkit of functions: defining, parameters, return values and scope. From here on, every program you write can be split into pieces that each do one clear thing.',
      'עכשיו אתם מכירים את כל ארגז הכלים של פונקציות: הגדרה, פרמטרים, ערכים מוחזרים ותחום. מכאן והלאה, כל תוכנית שתכתבו יכולה להתפצל לחלקים שכל אחד מהם עושה דבר אחד ברור.',
    ),
  ],
  next: t(
    'Next module: lists — a way to keep many values in one variable, which your functions can receive and return.',
    'המודול הבא: רשימות — דרך לשמור ערכים רבים במשתנה אחד, שהפונקציות שלכם יכולות לקבל ולהחזיר.',
  ),
};
