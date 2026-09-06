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
  id: 'l20-def',
  moduleId: 'm5',
  title: t('Functions: a name for a set of steps', 'פונקציות: שם לקבוצת צעדים'),
  tagline: t('Write the steps once, run them whenever you like.', 'כותבים את הצעדים פעם אחת, ומריצים אותם מתי שרוצים.'),
  estimatedMinutes: 20,
  introduces: ['function', 'def', 'call'],
  requires: ['print', 'variable', 'for', 'range', 'if', 'f-string'],
  runsInBrowser: true,

  objective: t(
    'Define a function with def, call it by name, and explain why defining and calling are two different things.',
    'להגדיר פונקציה בעזרת `def`, לקרוא לה בשמה, ולהסביר למה הגדרה וקריאה הן שני דברים שונים.',
  ),
  prerequisiteCheck: t(
    'You can print text, use variables and f-strings, and write a for loop with range (lessons 5–16).',
    'אתם יודעים להדפיס טקסט, להשתמש במשתנים וב-f-strings, ולכתוב לולאת `for` עם `range` (שיעורים 5–16).',
  ),

  explanation: [
    p(
      'Until now, if you wanted the same three lines of code to run in two places, you had to copy them. A **function** is a named block of code: you write the steps once, give them a name, and then run them whenever you want by using that name. Think of a recipe card: you write it once and can cook from it many times.',
      'עד עכשיו, אם רציתם שאותן שלוש שורות קוד ירוצו בשני מקומות, הייתם צריכים להעתיק אותן. **פונקציה** (function) היא קטע קוד עם שם: כותבים את הצעדים פעם אחת, נותנים להם שם, ואחר כך מריצים אותם מתי שרוצים בעזרת השם הזה. חשבו על כרטיס מתכון: כותבים אותו פעם אחת ואפשר לבשל לפיו פעמים רבות.',
    ),
    term(
      'def',
      'The keyword `def` **defines** a function. The line looks like `def greet():` — the word `def`, a name you choose (same rules as variable names), empty parentheses, and a colon. The lines below it, indented, are the **body** of the function: the steps that run when the function is used.',
      'מילת המפתח `def` **מגדירה** (defines) פונקציה. השורה נראית כך: `def greet():` — המילה `def`, שם שאתם בוחרים (לפי אותם כללים כמו שמות של משתנים), סוגריים ריקים ונקודתיים. השורות שמתחתיה, מוזחות פנימה, הן **גוף** הפונקציה: הצעדים שרצים כשמשתמשים בפונקציה.',
    ),
    code(py`
      def greet():
          print("Hello")
          print("Welcome to the program")

      greet()
      greet()
    `, { output: 'Hello\nWelcome to the program\nHello\nWelcome to the program' }),
    p(
      'Lines 1–3 only **define** the function. Nothing is printed yet: Python remembers that `greet` means "print these two lines" and moves on. Line 5 **calls** the function, so the body runs. Line 6 calls it again, and the body runs a second time.',
      'שורות 1–3 רק **מגדירות** את הפונקציה. עדיין לא מודפס שום דבר: פייתון זוכר ש-`greet` פירושו "הדפס את שתי השורות האלה" וממשיך הלאה. שורה 5 **קוראת** לפונקציה, ולכן הגוף רץ. שורה 6 קוראת לה שוב, והגוף רץ פעם שנייה.',
    ),
    term(
      'greet()',
      'Writing the name of a function followed by parentheses is a **call**: it means "run this function now". Every call runs the whole body from the top. The parentheses are required — `greet` without them only looks at the function and runs nothing.',
      'כתיבת שם הפונקציה ואחריו סוגריים היא **קריאה** (call): פירושה "הרץ את הפונקציה הזאת עכשיו". כל קריאה מריצה את כל הגוף מההתחלה. הסוגריים הכרחיים — `greet` בלי סוגריים רק מסתכל על הפונקציה ולא מריץ כלום.',
    ),
    callout(
      'why',
      'Why do functions exist? Three reasons. First, to avoid repetition: the steps are written once and used many times, so a fix in one place fixes every use. Second, to give a set of steps a name, so a program reads like a story: `show_menu()`, `play_round()`, `show_score()`. Third, to organise: a big program made of small named pieces is much easier to understand and to test.',
      'למה בכלל צריך פונקציות? שלוש סיבות. ראשית, כדי להימנע מחזרות: הצעדים נכתבים פעם אחת ומשמשים פעמים רבות, ולכן תיקון במקום אחד מתקן את כל השימושים. שנית, כדי לתת שם לקבוצת צעדים, כך שהתוכנית נקראת כמו סיפור: `show_menu()`, `play_round()`, `show_score()`. שלישית, כדי לארגן: תוכנית גדולה שמורכבת מחלקים קטנים עם שמות הרבה יותר קלה להבנה ולבדיקה.',
      t('Why functions?', 'למה פונקציות?'),
    ),
    h('Define first, call later', 'קודם מגדירים, אחר כך קוראים'),
    p(
      'Python reads the file from top to bottom. A call must come **below** the definition, because at the moment of the call Python must already know the name. Calling `greet()` above its `def` gives a NameError, exactly like using a variable before creating it. And a function that is defined but never called simply never runs.',
      'פייתון קורא את הקובץ מלמעלה למטה. הקריאה חייבת להופיע **מתחת** להגדרה, כי ברגע הקריאה פייתון כבר צריך להכיר את השם. קריאה ל-`greet()` מעל ה-`def` שלה גורמת לשגיאת NameError, בדיוק כמו שימוש במשתנה לפני שיצרתם אותו. ופונקציה שהוגדרה אבל אף פעם לא קראו לה — פשוט אף פעם לא רצה.',
    ),
    callout(
      'warning',
      'Two common slips: forgetting the parentheses in the call (`greet` instead of `greet()`), and forgetting to indent the body. The body must be indented under the `def` line, just like the body of an `if` or a loop. The first line that is not indented is already outside the function.',
      'שתי טעויות נפוצות: לשכוח את הסוגריים בקריאה (`greet` במקום `greet()`), ולשכוח להזיח את הגוף. הגוף חייב להיות מוזח מתחת לשורת ה-`def`, בדיוק כמו הגוף של `if` או של לולאה. השורה הראשונה שאינה מוזחת כבר נמצאת מחוץ לפונקציה.',
    ),
  ],

  simpler: [
    p(
      'Think of a recipe card with a title on top. Writing the card does not cook anything. It only means that from now on, "make pancakes" has a meaning.',
      'חשבו על כרטיס מתכון עם כותרת למעלה. כתיבת הכרטיס לא מבשלת שום דבר. היא רק אומרת שמעכשיו ל"להכין פנקייקים" יש משמעות.',
    ),
    p(
      '`def greet():` writes the card with the title `greet`. The indented lines under it are the steps of the recipe.',
      '`def greet():` כותב את הכרטיס עם הכותרת `greet`. השורות המוזחות מתחתיו הן הצעדים של המתכון.',
    ),
    p(
      '`greet()` means "do it now". Say it three times and the steps happen three times. Never say it, and the card just stays in the drawer.',
      '`greet()` פירושו "בצעו את זה עכשיו". אמרו את זה שלוש פעמים והצעדים יתבצעו שלוש פעמים. אם לא תאמרו את זה בכלל, הכרטיס פשוט יישאר במגירה.',
    ),
  ],

  workedExample: [
    p(
      'Read this program and then press play under the code. Watch how Python jumps into the function at each call and comes back to the line after the call.',
      'קראו את התוכנית ואז לחצו על כפתור ההפעלה מתחת לקוד. שימו לב איך פייתון קופץ אל תוך הפונקציה בכל קריאה וחוזר לשורה שאחרי הקריאה.',
    ),
    viz(py`
      def cheer():
          print("Hip hip")
          print("Hooray")

      print("Start")
      cheer()
      print("Middle")
      cheer()
      print("End")
    `),
    list([
      ['Lines 1–3 define `cheer`. Python remembers the body and skips over it.', 'שורות 1–3 מגדירות את `cheer`. פייתון זוכר את הגוף ומדלג מעליו.'],
      ['Line 5 prints `Start`.', 'שורה 5 מדפיסה `Start`.'],
      ['Line 6 calls `cheer()`: Python jumps to line 2, prints `Hip hip`, prints `Hooray`, reaches the end of the body and jumps back to the line after the call.', 'שורה 6 קוראת ל-`cheer()`: פייתון קופץ לשורה 2, מדפיס `Hip hip`, מדפיס `Hooray`, מגיע לסוף הגוף וקופץ בחזרה לשורה שאחרי הקריאה.'],
      ['Line 7 prints `Middle`, line 8 runs the whole body again, and line 9 prints `End`.', 'שורה 7 מדפיסה `Middle`, שורה 8 מריצה שוב את כל הגוף, ושורה 9 מדפיסה `End`.'],
    ], true),
    code(py`
      Start
      Hip hip
      Hooray
      Middle
      Hip hip
      Hooray
      End
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('A function inside a loop', 'פונקציה בתוך לולאה'),
      code(py`
        def separator():
            print("-" * 12)

        for i in range(3):
            print("Row", i)
            separator()
      `, { output: 'Row 0\n------------\nRow 1\n------------\nRow 2\n------------' }),
      p(
        'The loop calls `separator()` three times. If you later want a fancier separator, you change the body once and every row gets it.',
        'הלולאה קוראת ל-`separator()` שלוש פעמים. אם תרצו אחר כך קו מפריד יפה יותר, תשנו את הגוף פעם אחת וכל השורות יקבלו אותו.',
      ),
    ],
    [
      h('A function that calls another function', 'פונקציה שקוראת לפונקציה אחרת'),
      code(py`
        def stars():
            print("*****")

        def box():
            stars()
            print("*   *")
            stars()

        box()
        box()
      `, { output: '*****\n*   *\n*****\n*****\n*   *\n*****' }),
      p(
        '`box` uses `stars` twice. Functions built from smaller functions are the normal way to organise a program: each piece has one clear job.',
        '`box` משתמשת ב-`stars` פעמיים. פונקציות שבנויות מפונקציות קטנות יותר הן הדרך הרגילה לארגן תוכנית: לכל חלק יש תפקיד אחד ברור.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l20-hard',
    title: ['A triangle function', 'פונקציית משולש'],
    mode: 'write',
    instructions: [
      p(
        'Define a function `triangle()` that prints a triangle of stars with three rows: `*`, `**`, `***`. Use a `for` loop with `range` inside the function (do not write three print lines). Then call `triangle()` twice, so the output is six lines.',
        'הגדירו פונקציה `triangle()` שמדפיסה משולש כוכביות בן שלוש שורות: `*`, `**`, `***`. השתמשו בלולאת `for` עם `range` בתוך הפונקציה (אל תכתבו שלוש שורות `print`). אחר כך קראו ל-`triangle()` פעמיים, כך שהפלט יהיה שש שורות.',
      ),
    ],
    starterCode: py`
      # define triangle() here


      # call it twice

    `,
    check: {
      tests: [
        outputTest('*\n**\n***\n*\n**\n***'),
        pythonTest(py`
          import io, sys
          assert callable(ns.get("triangle")), "Define a function called triangle."
          buf = io.StringIO()
          saved = sys.stdout
          sys.stdout = buf
          ns["triangle"]()
          sys.stdout = saved
          assert buf.getvalue().rstrip() == "*\n**\n***", "triangle() should print *, ** and *** on three lines."
        `),
      ],
      requires: [requires('\\bfor\\b', 'Use a for loop inside the function.', 'השתמשו בלולאת for בתוך הפונקציה.')],
    },
    hints: [
      ['Start with `def triangle():` and put the loop indented under it.', 'התחילו ב-`def triangle():` ושימו את הלולאה מוזחת מתחתיה.'],
      ['`for i in range(1, 4):` gives i = 1, 2, 3. Print `"*" * i` on each round.', '`for i in range(1, 4):` נותן i = 1, 2, 3. בכל סיבוב הדפיסו `"*" * i`.'],
      ['After the function, write `triangle()` on two separate lines.', 'אחרי הפונקציה כתבו `triangle()` בשתי שורות נפרדות.'],
    ],
    solution: py`
      def triangle():
          for i in range(1, 4):
              print("*" * i)


      triangle()
      triangle()
    `,
    concepts: ['function', 'def', 'call', 'for', 'string-repeat'],
  }),

  predict: {
    code: py`
      def bark():
          print("Woof")

      def meow():
          print("Meow")

      print("Start")
      bark()
      bark()
      print("End")
    `,
    prompt: t('What does this program print?', 'מה התוכנית הזאת תדפיס?'),
    answer: 'Start\nWoof\nWoof\nEnd',
    explanation: t(
      'Defining bark and meow prints nothing. Then Start prints, bark() runs twice and prints Woof each time, and End prints. meow is defined but never called, so Meow never appears.',
      'הגדרת `bark` ו-`meow` לא מדפיסה שום דבר. אחר כך מודפס `Start`, `bark()` רץ פעמיים ומדפיס `Woof` בכל פעם, ומודפס `End`. `meow` מוגדרת אבל אף פעם לא קוראים לה, ולכן `Meow` לא מופיע בכלל.',
    ),
  },

  exercise: exercise({
    id: 'l20-ex',
    title: ['Your first function', 'הפונקציה הראשונה שלכם'],
    mode: 'write',
    instructions: [
      p(
        'Define a function called `greet` that prints two lines: `Hello` and then `Welcome`. Then call it twice. The output should be four lines: `Hello`, `Welcome`, `Hello`, `Welcome`.',
        'הגדירו פונקציה בשם `greet` שמדפיסה שתי שורות: `Hello` ואחריה `Welcome`. אחר כך קראו לה פעמיים. הפלט צריך להיות ארבע שורות: `Hello`, `Welcome`, `Hello`, `Welcome`.',
      ),
    ],
    starterCode: py`
      # 1. define greet: it prints Hello and then Welcome


      # 2. call greet twice

    `,
    check: {
      tests: [
        outputTest('Hello\nWelcome\nHello\nWelcome'),
        pythonTest(`assert 'greet' in ns and callable(ns['greet']), "Define a function called greet with def greet():"`),
      ],
      requires: [requires('\\bdef\\s+greet\\s*\\(\\s*\\)\\s*:', 'Define the function with def greet():', 'הגדירו את הפונקציה עם `def greet():`')],
    },
    hints: [
      ['A definition starts with `def greet():` and the body is indented under it.', 'הגדרה מתחילה ב-`def greet():` והגוף מוזח מתחתיה.'],
      ['Inside the body write two print lines, one for `Hello` and one for `Welcome`.', 'בתוך הגוף כתבו שתי שורות `print`, אחת ל-`Hello` ואחת ל-`Welcome`.'],
      ['Below the function, not indented, write `greet()` twice on two lines.', 'מתחת לפונקציה, בלי הזחה, כתבו `greet()` פעמיים בשתי שורות.'],
    ],
    solution: py`
      def greet():
          print("Hello")
          print("Welcome")


      greet()
      greet()
    `,
    concepts: ['function', 'def', 'call'],
  }),

  build: exercise({
    id: 'l20-build',
    title: ['Two tickets', 'שני כרטיסים'],
    mode: 'build',
    instructions: [
      p(
        'Build a small ticket printer with two functions. `line()` prints exactly ten equals signs: `==========`. `ticket()` prints a ticket: a line (by calling `line()`), two lines of text of your choice — for example `CINEMA` and `Row 5, Seat 12` — and a line again. Finally call `ticket()` twice, because two friends need tickets. The output should be 8 lines, like this:',
        'בנו מדפסת כרטיסים קטנה עם שתי פונקציות. `line()` מדפיסה בדיוק עשרה סימני שווה: `==========`. `ticket()` מדפיסה כרטיס: קו (בעזרת קריאה ל-`line()`), שתי שורות טקסט לבחירתכם — למשל `CINEMA` ו-`Row 5, Seat 12` — ושוב קו. לבסוף קראו ל-`ticket()` פעמיים, כי שני חברים צריכים כרטיס. הפלט צריך להיות 8 שורות, כך:',
      ),
      code('==========\nCINEMA\nRow 5, Seat 12\n==========\n==========\nCINEMA\nRow 5, Seat 12\n==========', { lang: 'text', runnable: false }),
      p(
        'Do not type the equals signs inside `ticket()` — call `line()` instead. That is the whole point: one function using another.',
        'אל תכתבו את סימני השווה בתוך `ticket()` — קראו ל-`line()` במקום. זו כל הנקודה: פונקציה אחת שמשתמשת באחרת.',
      ),
    ],
    starterCode: py`
      # define line(): prints ==========


      # define ticket(): line, two text lines, line


      # call ticket() twice

    `,
    check: {
      tests: [
        pythonTest(py`
          import io, sys, re
          assert callable(ns.get("line")), "Define a function called line."
          assert callable(ns.get("ticket")), "Define a function called ticket."
          lines = [l.rstrip() for l in stdout.strip().split("\n")]
          assert len(lines) == 8, "The program should print exactly 8 lines: two tickets of 4 lines each."
          for i in (0, 3, 4, 7):
              assert lines[i] == "==========", "Line " + str(i + 1) + " should be the frame =========="
          assert lines[1].strip() != "" and lines[2].strip() != "", "Put two lines of text inside each ticket."
          assert lines[0:4] == lines[4:8], "Both tickets should look the same: call ticket() twice."
          buf = io.StringIO()
          saved = sys.stdout
          sys.stdout = buf
          ns["ticket"]()
          sys.stdout = saved
          printed = [l.rstrip() for l in buf.getvalue().strip().split("\n")]
          assert len(printed) == 4 and printed[0] == "==========" and printed[3] == "==========", "ticket() should print a frame line, two text lines, and a frame line."
          assert len(re.findall(r"^\s+line\(\)", source, re.M)) >= 2, "Inside ticket(), call line() for the top and bottom frame."
        `),
      ],
    },
    hints: [
      ['Start with `def line():` whose body is one print of ten `=` signs. Tip: `"=" * 10`.', 'התחילו ב-`def line():` שגופה הוא `print` אחד של עשרה סימני `=`. טיפ: `"=" * 10`.'],
      ['In `ticket()`, the first and last lines of the body are `line()`; between them print your two texts.', 'ב-`ticket()`, השורה הראשונה והאחרונה בגוף הן `line()`; ביניהן הדפיסו את שני הטקסטים שלכם.'],
      ['At the bottom, without indentation, write `ticket()` on two lines.', 'בתחתית, בלי הזחה, כתבו `ticket()` בשתי שורות.'],
    ],
    solution: py`
      def line():
          print("=" * 10)


      def ticket():
          line()
          print("CINEMA")
          print("Row 5, Seat 12")
          line()


      ticket()
      ticket()
    `,
    solutionNote: [
      'Any two text lines work, as long as the frame lines come from line().',
      'כל שתי שורות טקסט מתאימות, כל עוד קווי המסגרת מגיעים מ-`line()`.',
    ],
    concepts: ['function', 'def', 'call', 'string-repeat'],
  }),

  check: [
    choice(
      'l20-c1',
      ['What happens when Python reaches the line `def greet():`?', 'מה קורה כשפייתון מגיע לשורה `def greet():`?'],
      [
        opt('It remembers the steps under the name greet, but does not run them yet.', 'הוא זוכר את הצעדים תחת השם greet, אבל עדיין לא מריץ אותם.', {
          correct: true,
          feedback: ['Right. Defining stores the recipe; only a call runs it.', 'נכון. ההגדרה שומרת את המתכון; רק קריאה מריצה אותו.'],
        }),
        opt('It runs the body of the function immediately.', 'הוא מריץ מיד את גוף הפונקציה.', {
          feedback: ['No. The body runs only when the function is called with greet().', 'לא. הגוף רץ רק כשקוראים לפונקציה עם greet().'],
        }),
        opt('It prints the word greet.', 'הוא מדפיס את המילה greet.', {
          feedback: ['A definition prints nothing. Only print shows something on the screen.', 'הגדרה לא מדפיסה שום דבר. רק print מציג משהו על המסך.'],
        }),
        opt('It causes an error, because greet was not called yet.', 'הוא גורם לשגיאה, כי עוד לא קראו ל-greet.', {
          feedback: ['Defining before calling is exactly the right order; there is no error.', 'להגדיר לפני שקוראים זה בדיוק הסדר הנכון; אין כאן שגיאה.'],
        }),
      ],
      ['def'],
    ),
    choice(
      'l20-c2',
      ['Which line runs the function greet?', 'איזו שורה מריצה את הפונקציה greet?'],
      [
        opt('`greet()`', '`greet()`', {
          correct: true,
          feedback: ['Yes. The name followed by parentheses is a call.', 'כן. השם ואחריו סוגריים הם קריאה.'],
        }),
        opt('`greet`', '`greet`', {
          feedback: ['Without parentheses Python only looks at the function; nothing runs.', 'בלי סוגריים פייתון רק מסתכל על הפונקציה; שום דבר לא רץ.'],
        }),
        opt('`def greet():`', 'השורה `def greet():`', {
          feedback: ['This line defines the function; it does not run it.', 'השורה הזאת מגדירה את הפונקציה; היא לא מריצה אותה.'],
        }),
        opt('`print(greet)`', '`print(greet)`', {
          feedback: ['This prints information about the function itself, not its output. A call needs parentheses after the name: greet().', 'זה מדפיס מידע על הפונקציה עצמה, לא את הפלט שלה. קריאה צריכה סוגריים אחרי השם: greet().'],
        }),
      ],
      ['call'],
    ),
    choice(
      'l20-c3',
      ['A function body is written once and the function is called four times. How many times does the body run?', 'גוף הפונקציה נכתב פעם אחת, וקוראים לפונקציה ארבע פעמים. כמה פעמים רץ הגוף?'],
      [
        opt('4', '4', {
          correct: true,
          feedback: ['Every call runs the whole body once.', 'כל קריאה מריצה את כל הגוף פעם אחת.'],
        }),
        opt('1', '1', {
          feedback: ['The body is written once, but it runs at every call.', 'הגוף נכתב פעם אחת, אבל הוא רץ בכל קריאה.'],
        }),
        opt('5', '5', {
          feedback: ['The def line does not run the body; only the four calls do.', 'שורת ה-def לא מריצה את הגוף; רק ארבע הקריאות מריצות אותו.'],
        }),
        opt('0', '0', {
          feedback: ['Four calls run the body four times.', 'ארבע קריאות מריצות את הגוף ארבע פעמים.'],
        }),
      ],
      ['call', 'function'],
    ),
  ],

  recap: [
    list([
      ['A function is a named block of code; `def name():` defines it and the indented lines are its body.', 'פונקציה היא קטע קוד עם שם; `def name():` מגדיר אותה והשורות המוזחות הן הגוף שלה.'],
      ['Defining runs nothing. `name()` calls the function and runs the body from the top.', 'ההגדרה לא מריצה שום דבר. `name()` קורא לפונקציה ומריץ את הגוף מההתחלה.'],
      ['Every call runs the body again; the parentheses are required.', 'כל קריאה מריצה את הגוף מחדש; הסוגריים הכרחיים.'],
      ['Define above, call below: Python must already know the name when the call happens.', 'מגדירים למעלה, קוראים למטה: פייתון צריך להכיר את השם כבר ברגע הקריאה.'],
      ['Functions avoid repetition, give steps a name, and organise a program.', 'פונקציות מונעות חזרות, נותנות שם לצעדים ומארגנות את התוכנית.'],
    ]),
    p(
      'Functions are the first tool for building bigger programs out of small, understandable pieces. From now on, when you notice the same lines twice, you will think: this should be a function.',
      'פונקציות הן הכלי הראשון לבניית תוכניות גדולות מחלקים קטנים ומובנים. מעכשיו, כשתראו את אותן שורות פעמיים, תחשבו: זה צריך להיות פונקציה.',
    ),
  ],
  next: t(
    'Next, functions will receive information — a name to greet, a number to count to — so the same function can do slightly different things each time.',
    'בשיעור הבא הפונקציות יקבלו מידע — שם לברך, מספר לספור עד אליו — כך שאותה פונקציה תוכל לעשות משהו קצת שונה בכל פעם.',
  ),
};
