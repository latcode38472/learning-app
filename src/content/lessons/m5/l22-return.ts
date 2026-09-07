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
  functionTest,
  pythonTest,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l22-return',
  moduleId: 'm5',
  title: t('Return: getting an answer back', 'return: לקבל תשובה בחזרה'),
  tagline: t('A function can hand a value back to whoever called it.', 'פונקציה יכולה למסור ערך בחזרה למי שקרא לה.'),
  estimatedMinutes: 25,
  introduces: ['return', 'return-value', 'none'],
  requires: ['function', 'def', 'call', 'parameter', 'argument', 'variable', 'arithmetic', 'if', 'f-string'],
  runsInBrowser: true,

  objective: t(
    'Write functions that return a value, use that value in the rest of the program, and tell the difference between printing and returning.',
    'לכתוב פונקציות שמחזירות ערך, להשתמש בערך הזה בהמשך התוכנית, ולהבחין בין הדפסה להחזרה.',
  ),
  prerequisiteCheck: t(
    'You can define a function with parameters and call it with arguments (lessons 20–21), and you can write an if statement (lesson 12).',
    'אתם יודעים להגדיר פונקציה עם פרמטרים ולקרוא לה עם ארגומנטים (שיעורים 20–21), ולכתוב משפט `if` (שיעור 12).',
  ),

  explanation: [
    p(
      'So far our functions only printed. But often you want a function to **compute** something and hand the result back, so the rest of the program can store it, add to it or compare it. That is what `return` does.',
      'עד עכשיו הפונקציות שלנו רק הדפיסו. אבל לעיתים קרובות רוצים שפונקציה **תחשב** משהו ותמסור את התוצאה בחזרה, כדי ששאר התוכנית תוכל לשמור אותה, להוסיף לה או להשוות אותה. בדיוק לזה משמש `return`.',
    ),
    term(
      'return',
      'The keyword `return` ends the function immediately and sends a value back to the place where the function was called. That value is called the **return value**.',
      'מילת המפתח `return` מסיימת את הפונקציה מיד ושולחת ערך בחזרה למקום שבו קראו לפונקציה. הערך הזה נקרא **ערך מוחזר** (return value).',
    ),
    code(py`
      def add(a, b):
          return a + b

      result = add(2, 3)
      print(result)
      print(add(10, 5) * 2)
    `, { output: '5\n30' }),
    p(
      'Here is the key idea: the call `add(2, 3)` **becomes** the value 5. Wherever you write the call, imagine the returned value standing in its place. So you can store it in a variable (line 4), print it, or use it inside a bigger calculation (line 6).',
      'הנה הרעיון המרכזי: הקריאה `add(2, 3)` **הופכת** לערך 5. בכל מקום שבו כתובה הקריאה, דמיינו את הערך המוחזר עומד במקומה. לכן אפשר לשמור אותו במשתנה (שורה 4), להדפיס אותו, או להשתמש בו בתוך חישוב גדול יותר (שורה 6).',
    ),
    h('print or return?', 'print או return?'),
    p(
      'This is the most common confusion in this module. `print` shows a value on the screen and gives the program nothing. `return` gives a value to the program and shows nothing. Look what happens when a function prints but the caller expects a value:',
      'זה הבלבול הנפוץ ביותר במודול הזה. `print` מציג ערך על המסך ולא נותן לתוכנית שום דבר. `return` נותן ערך לתוכנית ולא מציג שום דבר. ראו מה קורה כשפונקציה מדפיסה אבל הקורא מצפה לערך:',
    ),
    code(py`
      def say_hi():
          print("hi")

      x = say_hi()
      print(x)
    `, { output: 'hi\nNone' }),
    term(
      'None',
      '`None` is the Python value that means "nothing here". A function that finishes without a `return` returns `None`. When you see `None` printed unexpectedly, it almost always means a function printed its answer instead of returning it.',
      '`None` הוא הערך בפייתון שפירושו "אין כאן כלום". פונקציה שמסתיימת בלי `return` מחזירה `None`. כש-`None` מודפס במפתיע, זה כמעט תמיד אומר שפונקציה הדפיסה את התשובה שלה במקום להחזיר אותה.',
    ),
    callout(
      'warning',
      '`return` ends the function at once: any line after it inside the function never runs. That is useful with `if`: a function can return one value in one case and a different value otherwise.',
      '`return` מסיים את הפונקציה מיד: שום שורה אחריו בתוך הפונקציה לא רצה. זה שימושי עם `if`: פונקציה יכולה להחזיר ערך אחד במקרה אחד וערך אחר במקרה אחר.',
    ),
    code(py`
      def size(n):
          if n > 10:
              return "big"
          return "small"

      print(size(50))
      print(size(3))
    `, { output: 'big\nsmall' }),
    callout(
      'tip',
      'A good habit: functions that compute something should return it, not print it. Let the code that called the function decide what to do with the value. Printing happens at the edges of the program; computing happens inside functions.',
      'הרגל טוב: פונקציות שמחשבות משהו צריכות להחזיר אותו, לא להדפיס. תנו לקוד שקרא לפונקציה להחליט מה לעשות עם הערך. ההדפסה קורית בקצוות של התוכנית; החישוב קורה בתוך הפונקציות.',
    ),
  ],

  simpler: [
    p(
      'Imagine a vending machine. `print` is the screen on the machine: it can show a message, but you walk away with nothing in your hand. `return` is the tray at the bottom: the machine hands you the item, and now you can do whatever you like with it.',
      'דמיינו מכונת ממכר. `print` הוא המסך של המכונה: הוא יכול להציג הודעה, אבל אתם הולכים משם בלי כלום ביד. `return` הוא המגש שלמטה: המכונה מוסרת לכם את המוצר, ועכשיו אתם יכולים לעשות איתו מה שתרצו.',
    ),
    p(
      '`result = add(2, 3)` means: ask the `add` machine for 2 and 3, take what comes out of the tray, and put it in the jar called `result`.',
      '`result = add(2, 3)` פירושו: בקשו ממכונת `add` את 2 ו-3, קחו מה שיצא מהמגש, והכניסו אותו לצנצנת בשם `result`.',
    ),
    p(
      'If the machine only shows the answer on its screen and drops nothing in the tray, the jar stays empty. Python calls that empty value `None`.',
      'אם המכונה רק מציגה את התשובה על המסך ולא מפילה כלום למגש, הצנצנת נשארת ריקה. פייתון קורא לערך הריק הזה `None`.',
    ),
  ],

  workedExample: [
    p(
      'This program computes with two functions, one of which uses the other. Press play and watch the returned values travel back to the caller.',
      'התוכנית הזאת מחשבת בעזרת שתי פונקציות, שאחת מהן משתמשת בשנייה. לחצו על הפעלה וראו איך הערכים המוחזרים חוזרים אל הקורא.',
    ),
    viz(py`
      def square(n):
          return n * n

      def two_squares(a, b):
          return square(a) + square(b)

      first = square(3)
      print(first)
      print(two_squares(2, 3))
    `),
    list([
      ['Line 7 calls `square(3)`. Inside, `n` is 3, and `return n * n` sends 9 back. The call becomes 9, which is stored in `first`.', 'שורה 7 קוראת ל-`square(3)`. בפנים, `n` הוא 3, ו-`return n * n` שולח 9 בחזרה. הקריאה הופכת ל-9, שנשמר ב-`first`.'],
      ['Line 8 prints 9.', 'שורה 8 מדפיסה 9.'],
      ['Line 9 calls `two_squares(2, 3)`. Its body calls `square(2)`, which returns 4, then `square(3)`, which returns 9, adds them and returns 13.', 'שורה 9 קוראת ל-`two_squares(2, 3)`. הגוף שלה קורא ל-`square(2)`, שמחזירה 4, אחר כך ל-`square(3)`, שמחזירה 9, מחבר אותם ומחזיר 13.'],
      ['`print` receives 13 and shows it. Notice that neither function prints anything itself.', '`print` מקבל 13 ומציג אותו. שימו לב שאף אחת מהפונקציות לא מדפיסה בעצמה.'],
    ], true),
    code(py`
      9
      13
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('A return inside an if', 'return בתוך if'),
      code(py`
        def bigger(a, b):
            if a > b:
                return a
            return b

        print(bigger(4, 9))
        print(bigger(7, 2))
      `, { output: '9\n7' }),
      p(
        'When `a > b` is true, the first `return` runs and the function is finished; the last line is never reached. When it is false, the `if` block is skipped and `return b` runs.',
        'כש-`a > b` מתקיים, ה-`return` הראשון רץ והפונקציה מסתיימת; לשורה האחרונה בכלל לא מגיעים. כשהוא לא מתקיים, בלוק ה-`if` מדולג ו-`return b` רץ.',
      ),
    ],
    [
      h('Using the value again and again', 'שימוש בערך שוב ושוב'),
      code(py`
        def double(n):
            return n * 2

        x = double(5)
        y = double(x)
        print(x, y)
        if double(4) == 8:
            print("double works")
      `, { output: '10 20\ndouble works' }),
      p(
        'A returned value can be stored, passed into another call, or compared in a condition. That is only possible because `double` returns instead of printing.',
        'ערך מוחזר אפשר לשמור, להעביר לקריאה אחרת, או להשוות בתנאי. כל זה אפשרי רק מפני ש-`double` מחזירה במקום להדפיס.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l22-hard',
    title: ['Keep it between 0 and 100', 'לשמור בין 0 ל-100'],
    mode: 'write',
    instructions: [
      p(
        'Define `clamp(n)` that returns `0` when `n` is below 0, returns `100` when `n` is above 100, and otherwise returns `n` unchanged. Use `return` inside `if` statements. Then print `clamp(120)`, `clamp(-5)` and `clamp(42)` on three lines.',
        'הגדירו `clamp(n)` שמחזירה `0` כש-`n` קטן מ-0, מחזירה `100` כש-`n` גדול מ-100, ואחרת מחזירה את `n` כמו שהוא. השתמשו ב-`return` בתוך משפטי `if`. אחר כך הדפיסו את `clamp(120)`, `clamp(-5)` ו-`clamp(42)` בשלוש שורות.',
      ),
    ],
    starterCode: py`
      # define clamp(n)


      print(clamp(120))
      print(clamp(-5))
      print(clamp(42))
    `,
    check: {
      tests: [
        functionTest('clamp(50)', '50'),
        functionTest('clamp(-3)', '0'),
        functionTest('clamp(250)', '100'),
        functionTest('clamp(0)', '0'),
        functionTest('clamp(100)', '100'),
        outputTest('100\n0\n42'),
      ],
    },
    hints: [
      ['Start with `if n < 0:` and return 0 inside it.', 'התחילו ב-`if n < 0:` והחזירו 0 בתוכו.'],
      ['Add a second `if n > 100:` that returns 100.', 'הוסיפו `if n > 100:` שני שמחזיר 100.'],
      ['After both ifs, `return n` handles every other case — it only runs if neither earlier return happened.', 'אחרי שני ה-`if`, `return n` מטפל בכל מקרה אחר — הוא רץ רק אם אף אחד מה-`return` הקודמים לא קרה.'],
    ],
    solution: py`
      def clamp(n):
          if n < 0:
              return 0
          if n > 100:
              return 100
          return n


      print(clamp(120))
      print(clamp(-5))
      print(clamp(42))
    `,
    concepts: ['return', 'return-value', 'if', 'comparison'],
  }),

  predict: {
    code: py`
      def double(n):
          print(n * 2)

      x = double(4)
      print(x)
    `,
    prompt: t('What does this program print?', 'מה התוכנית הזאת תדפיס?'),
    answer: '8\nNone',
    explanation: t(
      'double prints 8 while it runs. But it has no return, so the call gives back None, and that is what x holds. The second print shows None.',
      '`double` מדפיסה 8 בזמן שהיא רצה. אבל אין בה `return`, ולכן הקריאה מחזירה `None`, וזה מה ש-`x` מחזיק. ה-`print` השני מציג `None`.',
    ),
  },

  exercise: exercise({
    id: 'l22-ex',
    title: ['Return, do not print', 'להחזיר, לא להדפיס'],
    mode: 'fix',
    instructions: [
      p(
        'This program should print `14`: the sum of `add(2, 3)` and `add(4, 5)`. Instead it crashes with a TypeError, because `add` prints its answer instead of returning it. Fix `add` so that it returns the sum. Do not change the last two lines.',
        'התוכנית הזאת אמורה להדפיס `14`: הסכום של `add(2, 3)` ו-`add(4, 5)`. במקום זה היא קורסת עם שגיאת TypeError, כי `add` מדפיסה את התשובה שלה במקום להחזיר אותה. תקנו את `add` כך שתחזיר את הסכום. אל תשנו את שתי השורות האחרונות.',
      ),
    ],
    starterCode: py`
      def add(a, b):
          print(a + b)


      total = add(2, 3) + add(4, 5)
      print(total)
    `,
    check: {
      tests: [
        functionTest('add(2, 3)', '5'),
        functionTest('add(10, -4)', '6'),
        outputTest('14'),
      ],
    },
    hints: [
      ['Read the error: Python cannot add None and None. Where do those Nones come from?', 'קראו את השגיאה: פייתון לא יכול לחבר None ו-None. מאיפה ה-None-ים האלה מגיעים?'],
      ['A function without return gives back None. Replace the print in add with a return.', 'פונקציה בלי `return` מחזירה None. החליפו את ה-`print` ב-`add` ב-`return`.'],
      ['The body should be exactly `return a + b`.', 'הגוף צריך להיות בדיוק `return a + b`.'],
    ],
    solution: py`
      def add(a, b):
          return a + b


      total = add(2, 3) + add(4, 5)
      print(total)
    `,
    concepts: ['return', 'return-value', 'none'],
  }),

  build: exercise({
    id: 'l22-build',
    title: ['A tiny shop bill', 'חשבון קטן בחנות'],
    mode: 'build',
    instructions: [
      p(
        'Build a bill for a small shop using two functions that **return** values:',
        'בנו חשבון לחנות קטנה בעזרת שתי פונקציות ש**מחזירות** ערכים:',
      ),
      list([
        ['`line_total(price, quantity)` returns `price * quantity`.', '`line_total(price, quantity)` מחזירה `price * quantity`.'],
        ['`shipping(total)` returns `0` if `total` is at least 100, otherwise `20`.', '`shipping(total)` מחזירה `0` אם `total` הוא לפחות 100, אחרת `20`.'],
      ]),
      p(
        'Then choose two items with any prices and quantities, add their line totals, and print three lines exactly in this shape (with your own numbers):',
        'אחר כך בחרו שני פריטים עם מחירים וכמויות כלשהם, חברו את סכומי השורות שלהם, והדפיסו שלוש שורות בדיוק בצורה הזאת (עם המספרים שלכם):',
      ),
      code('Items: 46\nShipping: 20\nTotal: 66', { lang: 'text', runnable: false }),
      p(
        'The functions must not print anything; all printing happens outside them.',
        'אסור לפונקציות להדפיס שום דבר; כל ההדפסה מתבצעת מחוץ להן.',
      ),
    ],
    starterCode: py`
      # define line_total(price, quantity)


      # define shipping(total)


      # compute the bill for two items and print Items, Shipping, Total

    `,
    check: {
      tests: [
        functionTest('line_total(12, 3)', '36'),
        functionTest('line_total(5, 2)', '10'),
        functionTest('shipping(46)', '20'),
        functionTest('shipping(100)', '0'),
        functionTest('shipping(250)', '0'),
        pythonTest(py`
          lines = [l.strip() for l in stdout.strip().split("\n") if l.strip()]
          assert len(lines) == 3, "Print exactly three lines: Items, Shipping and Total."
          labels = ("Items:", "Shipping:", "Total:")
          values = []
          for label, line in zip(labels, lines):
              assert line.startswith(label), "This line should start with " + label + " -> " + line
              number = line[len(label):].strip()
              assert number.replace(".", "", 1).replace("-", "", 1).isdigit(), "After " + label + " print just a number."
              values.append(float(number))
          items, ship, total = values
          assert items > 0, "The items total should be bigger than 0."
          assert ship == (0 if items >= 100 else 20), "Shipping must be 0 when the items total is at least 100, otherwise 20."
          assert total == items + ship, "Total must be the items total plus shipping."
        `),
      ],
    },
    hints: [
      ['`line_total` is one line: `return price * quantity`.', '`line_total` היא שורה אחת: `return price * quantity`.'],
      ['In `shipping`, write `if total >= 100:` and `return 0` inside it, then `return 20` after the if.', 'ב-`shipping` כתבו `if total >= 100:` ובתוכו `return 0`, ואחרי ה-`if` כתבו `return 20`.'],
      ['Outside the functions: `items = line_total(12, 3) + line_total(5, 2)`, then `cost = shipping(items)`, then print the three lines with f-strings.', 'מחוץ לפונקציות: `items = line_total(12, 3) + line_total(5, 2)`, אחר כך `cost = shipping(items)`, ואז הדפיסו את שלוש השורות עם f-strings.'],
    ],
    solution: py`
      def line_total(price, quantity):
          return price * quantity


      def shipping(total):
          if total >= 100:
              return 0
          return 20


      items = line_total(12, 3) + line_total(5, 2)
      cost = shipping(items)
      print(f"Items: {items}")
      print(f"Shipping: {cost}")
      print(f"Total: {items + cost}")
    `,
    solutionNote: [
      'Any prices and quantities work. The check recomputes shipping and total from your Items line.',
      'כל מחיר וכמות מתאימים. הבדיקה מחשבת מחדש את המשלוח ואת הסכום מתוך שורת ה-Items שלכם.',
    ],
    concepts: ['return', 'return-value', 'if', 'f-string'],
  }),

  check: [
    choice(
      'l22-c1',
      ['A function has no return statement. What does `x = f()` store in x?', 'לפונקציה אין משפט `return`. מה `x = f()` שומר ב-x?'],
      [
        opt('`None`', '`None`', {
          correct: true,
          feedback: ['Yes. Without return, a function gives back None.', 'כן. בלי return, פונקציה מחזירה None.'],
        }),
        opt('0', '0', {
          feedback: ['Python does not invent a number. Nothing returned means None.', 'פייתון לא ממציא מספר. כשלא מוחזר כלום, הערך הוא None.'],
        }),
        opt('Whatever the function printed.', 'מה שהפונקציה הדפיסה.', {
          feedback: ['Printed text goes to the screen only; it never comes back to the caller.', 'טקסט שמודפס הולך למסך בלבד; הוא אף פעם לא חוזר אל הקורא.'],
        }),
        opt('An error.', 'שגיאה.', {
          feedback: ['Calling a function without return is allowed; the result is simply None.', 'קריאה לפונקציה בלי return מותרת; התוצאה היא פשוט None.'],
        }),
      ],
      ['none', 'return-value'],
    ),
    choice(
      'l22-c2',
      ['Inside a function there is `return 5` and, on the next line, `print("after")`. What happens when the function is called?', 'בתוך פונקציה יש `return 5` ובשורה הבאה `print("after")`. מה קורה כשקוראים לפונקציה?'],
      [
        opt('The function returns 5; "after" is never printed.', 'הפונקציה מחזירה 5; "after" לא מודפס אף פעם.', {
          correct: true,
          feedback: ['Right. return ends the function immediately.', 'נכון. return מסיים את הפונקציה מיד.'],
        }),
        opt('"after" is printed, then 5 is returned.', '"after" מודפס, ואז מוחזר 5.', {
          feedback: ['Nothing after a return runs. Python leaves the function at the return.', 'שום דבר אחרי return לא רץ. פייתון יוצא מהפונקציה ב-return.'],
        }),
        opt('Both happen: 5 is returned and "after" is printed.', 'שני הדברים קורים: 5 מוחזר ו-"after" מודפס.', {
          feedback: ['return ends the function at once; the print line is skipped.', 'return מסיים את הפונקציה מיד; שורת ה-print מדולגת.'],
        }),
        opt('An error, because code after return is not allowed.', 'שגיאה, כי אסור לכתוב קוד אחרי return.', {
          feedback: ['It is allowed (just never reached); Python does not complain.', 'זה מותר (פשוט לא מגיעים לשם); פייתון לא מתלונן.'],
        }),
      ],
      ['return'],
    ),
    choice(
      'l22-c3',
      ['Which sentence is true?', 'איזה משפט נכון?'],
      [
        opt('`return` gives a value back to the caller; `print` only shows text on the screen.', '`return` נותן ערך בחזרה לקורא; `print` רק מציג טקסט על המסך.', {
          correct: true,
          feedback: ['Exactly. That is why computed values should be returned.', 'בדיוק. לכן ערכים מחושבים צריכים להיות מוחזרים.'],
        }),
        opt('`print` and `return` do the same thing.', '`print` ו-`return` עושים אותו דבר.', {
          feedback: ['No: after print the caller receives None; after return it receives the value.', 'לא: אחרי print הקורא מקבל None; אחרי return הוא מקבל את הערך.'],
        }),
        opt('`return` shows the value on the screen.', '`return` מציג את הערך על המסך.', {
          feedback: ['return shows nothing. To see the value, the caller must print it.', 'return לא מציג שום דבר. כדי לראות את הערך, הקורא צריך להדפיס אותו.'],
        }),
        opt('A function can print or return, but never both.', 'פונקציה יכולה להדפיס או להחזיר, אבל אף פעם לא את שניהם.', {
          feedback: ['Both are allowed in one function; but a function that computes should usually return.', 'שניהם מותרים באותה פונקציה; אבל פונקציה שמחשבת צריכה בדרך כלל להחזיר.'],
        }),
      ],
      ['return', 'return-value'],
    ),
  ],

  recap: [
    list([
      ['`return value` ends the function and sends the value back to the caller.', '`return value` מסיים את הפונקציה ושולח את הערך בחזרה לקורא.'],
      ['The call becomes the returned value: store it, print it, or compute with it.', 'הקריאה הופכת לערך המוחזר: שמרו אותו, הדפיסו אותו או חשבו איתו.'],
      ['`print` shows; `return` gives. A function without return gives back `None`.', '`print` מציג; `return` נותן. פונקציה בלי `return` מחזירה `None`.'],
      ['Nothing after a `return` runs, so `return` inside an `if` picks between answers.', 'שום דבר אחרי `return` לא רץ, ולכן `return` בתוך `if` בוחר בין תשובות.'],
    ]),
    p(
      'Returning values is what turns functions from "named blocks of prints" into building blocks you can combine: one function computes, another decides, a third prints.',
      'החזרת ערכים היא מה שהופך פונקציות מ"קטעי הדפסה עם שם" לאבני בניין שאפשר לשלב: פונקציה אחת מחשבת, אחרת מחליטה, ושלישית מדפיסה.',
    ),
  ],
  next: t(
    'Next you will see where variables created inside a function live, and how to organise a whole program as a set of small functions.',
    'בשיעור הבא תראו איפה חיים המשתנים שנוצרים בתוך פונקציה, ואיך לארגן תוכנית שלמה כאוסף של פונקציות קטנות.',
  ),
};
