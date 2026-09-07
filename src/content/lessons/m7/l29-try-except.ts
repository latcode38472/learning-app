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
  id: 'l29-try-except',
  moduleId: 'm7',
  title: t('try and except: handling errors', 'try ו-except: טיפול בשגיאות'),
  tagline: t('Expect the unexpected and keep the program running.', 'לצפות את הבלתי צפוי ולהשאיר את התוכנית בחיים.'),
  estimatedMinutes: 25,
  introduces: ['try', 'except', 'exception', 'validation-loop'],
  requires: [
    'traceback',
    'name-error',
    'value-error',
    'zero-division',
    'if',
    'while',
    'break',
    'input',
    'type-conversion',
    'function',
    'return',
    'f-string',
    'print',
    'accumulator',
    'for-each',
  ],
  runsInBrowser: true,

  objective: t(
    'Catch a specific error with try / except, keep asking until the input is valid, and know when not to catch an error.',
    'לתפוס שגיאה מסוימת עם try / except, לחזור ולבקש קלט עד שהוא תקין, ולדעת מתי לא לתפוס שגיאה.',
  ),
  prerequisiteCheck: t(
    'You can read a traceback (lesson 28) and you use while loops with break, input(), int() and functions with return.',
    'אתם יודעים לקרוא traceback (שיעור 28), ואתם משתמשים בלולאות while עם break, ב-`input()`, ב-`int()` ובפונקציות עם return.',
  ),

  explanation: [
    p(
      'In the last lesson `int("abc")` raised a ValueError and the program stopped. Sometimes stopping is right: a NameError means you have a bug to fix. But when the problem comes from outside the program, such as a user typing letters where a number was expected, stopping is unfair. The program should notice the problem and recover. That is what `try` and `except` are for.',
      'בשיעור הקודם `int("abc")` גרם ל-ValueError והתוכנית נעצרה. לפעמים לעצור זה נכון: NameError פירושו שיש לכם באג לתקן. אבל כשהבעיה מגיעה מחוץ לתוכנית, למשל משתמש שמקליד אותיות במקום מספר, עצירה היא לא הוגנת. התוכנית צריכה לשים לב לבעיה ולהתאושש. בשביל זה קיימים `try` ו-`except`.',
    ),
    term(
      'exception',
      'The technical name for a runtime error. When something impossible happens, Python **raises** an exception. If nothing catches it, the program stops and you see the traceback. `try` / `except` is how a program catches one.',
      'השם הטכני לשגיאת זמן ריצה: **חריגה** (exception). כשקורה משהו בלתי אפשרי, פייתון **מעלה** (raises) חריגה. אם שום דבר לא תופס אותה, התוכנית נעצרת ואתם רואים את ה-traceback. `try` / `except` הוא הדרך שבה תוכנית תופסת חריגה.',
    ),
    term(
      'try:',
      'Starts a block of lines to attempt. Python runs them normally. If one of them raises an exception, Python leaves the block at once, skipping the lines below the failing one, and looks for a matching `except`.',
      'פותח בלוק של שורות לניסיון. פייתון מריץ אותן כרגיל. אם אחת מהן מעלה חריגה, פייתון יוצא מהבלוק מיד, מדלג על השורות שמתחת לשורה שנכשלה, ומחפש `except` מתאים.',
    ),
    term(
      'except ValueError:',
      'The block that runs only if a `ValueError` happened inside the `try` block. Write the error type exactly as it appears in the last line of the traceback. After the block, the program continues normally.',
      'הבלוק שרץ רק אם קרה `ValueError` בתוך בלוק ה-`try`. כתבו את סוג השגיאה בדיוק כפי שהוא מופיע בשורה האחרונה של ה-traceback. אחרי הבלוק התוכנית ממשיכה כרגיל.',
    ),
    code(py`
      text = "abc"
      try:
          number = int(text)
          print("Twice:", number * 2)
      except ValueError:
          print("That is not a number")
      print("The program continues")
    `, { output: 'That is not a number\nThe program continues' }),
    p(
      'Line 3 raises a ValueError, so line 4 is skipped: `number` was never created, and printing twice its value would make no sense. Python jumps to the `except` block, prints the message, and carries on with line 7. Change `text` to `"21"` and run again: now lines 3 and 4 run, the `except` block is skipped, and line 7 still runs.',
      'שורה 3 מעלה ValueError, ולכן שורה 4 מדולגת: `number` מעולם לא נוצר, והדפסת כפליים מערכו לא הייתה הגיונית. פייתון קופץ לבלוק ה-`except`, מדפיס את ההודעה וממשיך לשורה 7. שנו את `text` ל-`"21"` והריצו שוב: עכשיו שורות 3 ו-4 רצות, בלוק ה-`except` מדולג, ושורה 7 עדיין רצה.',
    ),
    h('Catch the specific error', 'תפסו את השגיאה המסוימת'),
    callout(
      'warning',
      'You can write `except:` with no error type, and it catches **everything**. Do not. If you misspell a variable inside that `try` block, the NameError is caught too, the message says "not a number", and you never see the traceback that would have shown you the bug. Always name the error you expect: `except ValueError:`.',
      'אפשר לכתוב `except:` בלי סוג שגיאה, וזה תופס **הכול**. אל תעשו את זה. אם תטעו באיות של משתנה בתוך בלוק ה-`try` הזה, גם ה-NameError ייתפס, ההודעה תגיד "not a number", ולעולם לא תראו את ה-traceback שהיה מראה לכם את הבאג. תמיד ציינו את השגיאה שאתם מצפים לה: `except ValueError:`.',
      t('A bare except hides bugs', '`except:` ריק מסתיר באגים'),
    ),
    h('The validation loop', 'לולאת אימות הקלט'),
    p(
      'The most useful pattern with `try` is asking for a number until the user gives one. A `while True:` loop keeps asking; the `break` sits inside the `try` block **right after** the conversion, so it only runs if `int()` succeeded. This pattern is called a **validation loop**.',
      'התבנית השימושית ביותר עם `try` היא לבקש מספר עד שהמשתמש נותן אחד. לולאת `while True:` ממשיכה לבקש; ה-`break` יושב בתוך בלוק ה-`try` **מיד אחרי** ההמרה, ולכן הוא רץ רק אם `int()` הצליח. לתבנית הזאת קוראים **לולאת אימות קלט** (validation loop).',
    ),
    code(py`
      while True:
          text = input("Enter a whole number: ")
          try:
              number = int(text)
              break
          except ValueError:
              print("That is not a number")
      print(f"You entered {number}")
    `),
    code(py`
      That is not a number
      You entered 12
    `, { lang: 'text', runnable: false, caption: t('What print shows when the user types abc, then 12', 'מה ש-print מציג כשהמשתמש מקליד abc ואז 12') }),
    h('Several except blocks', 'כמה בלוקים של except'),
    code(py`
      first = "10"
      second = "0"
      try:
          a = int(first)
          b = int(second)
          print("Result:", a / b)
      except ValueError:
          print("That is not a number")
      except ZeroDivisionError:
          print("You cannot divide by zero")
    `, { output: 'You cannot divide by zero' }),
    p(
      'One `try` block can be followed by several `except` blocks, one per error type. Python runs the first one whose type matches; the others are skipped. Here both conversions succeed, the division raises a ZeroDivisionError, and only the second `except` runs. Try `second = "x"` to see the first one instead.',
      'אחרי בלוק `try` אחד יכולים לבוא כמה בלוקים של `except`, אחד לכל סוג שגיאה. פייתון מריץ את הראשון שהסוג שלו מתאים; האחרים מדולגים. כאן שתי ההמרות מצליחות, החלוקה מעלה ZeroDivisionError, ורק ה-`except` השני רץ. נסו `second = "x"` כדי לראות את הראשון במקום.',
    ),
    callout(
      'warning',
      'Do not wrap your whole program in `try`. Catch an error only when you expect it **and** you know what the program should do instead: bad user input, a division by a value that may be 0, a key that may be missing. If the error is a bug in your own code, you want the traceback, because it tells you where to fix it. Rule of thumb: if you cannot say what should happen instead, do not catch.',
      'אל תעטפו את כל התוכנית ב-`try`. תפסו שגיאה רק כשאתם מצפים לה **וגם** יודעים מה התוכנית צריכה לעשות במקום: קלט לא תקין מהמשתמש, חלוקה בערך שעלול להיות 0, מפתח שאולי חסר. אם השגיאה היא באג בקוד שלכם, אתם רוצים את ה-traceback, כי הוא אומר לכם איפה לתקן. כלל אצבע: אם אתם לא יכולים לומר מה צריך לקרות במקום, אל תתפסו.',
      t('When not to catch', 'מתי לא לתפוס'),
    ),
    callout(
      'note',
      'Python also lets a program raise its own exceptions with the keyword `raise`, for example when a function receives a value that makes no sense. You will use it in a later module; for now it is enough to know it exists.',
      'פייתון גם מאפשר לתוכנית להעלות חריגות משלה עם מילת המפתח `raise`, למשל כשפונקציה מקבלת ערך שאין בו היגיון. תשתמשו בזה במודול מאוחר יותר; בינתיים מספיק לדעת שזה קיים.',
    ),
  ],

  simpler: [
    p(
      'Think of a cashier scanning items. The normal plan is "scan the barcode". Sometimes a barcode will not scan; for exactly that case there is a backup plan: "type the number by hand". The shop does not close because one barcode failed.',
      'חשבו על קופאי שסורק מוצרים. המסלול הרגיל הוא "לסרוק את הברקוד". לפעמים ברקוד לא נסרק; בדיוק למקרה הזה יש תוכנית גיבוי: "להקליד את המספר ביד". החנות לא נסגרת בגלל ברקוד אחד שנכשל.',
    ),
    p(
      '`try` is the normal plan. `except ValueError` is the backup plan for one specific problem. Without a backup plan, Python does the only thing it can: it stops and shows the traceback.',
      '`try` הוא המסלול הרגיל. `except ValueError` הוא תוכנית הגיבוי לבעיה מסוימת אחת. בלי תוכנית גיבוי, פייתון עושה את הדבר היחיד שהוא יכול: עוצר ומציג את ה-traceback.',
    ),
    p(
      'The validation loop is simply "ask again until you get an answer you can use". You do it every day: if someone mumbles their phone number, you ask them to repeat it; you do not walk away.',
      'לולאת אימות הקלט היא פשוט "לשאול שוב עד שמקבלים תשובה שאפשר להשתמש בה". אתם עושים את זה כל יום: אם מישהו ממלמל את מספר הטלפון שלו, אתם מבקשים שיחזור עליו; אתם לא הולכים משם.',
    ),
    p(
      'But a backup plan for everything is a bad idea. If the cash register itself is broken, "type the number by hand" hides the real problem. Catch only the problems you planned for.',
      'אבל תוכנית גיבוי לכל דבר היא רעיון רע. אם הקופה עצמה מקולקלת, "להקליד את המספר ביד" מסתיר את הבעיה האמיתית. תפסו רק את הבעיות שתכננתם להן.',
    ),
  ],

  workedExample: [
    p(
      'Here is the validation loop as a complete program. Run it and type `twelve`, then `12`.',
      'הנה לולאת אימות הקלט כתוכנית שלמה. הריצו אותה והקלידו `twelve`, ואז `12`.',
    ),
    code(py`
      while True:
          text = input("How old are you? ")
          try:
              age = int(text)
              break
          except ValueError:
              print("That is not a number")

      print(f"Next year you will be {age + 1}")
    `),
    list([
      [
        'Line 1: `while True:` is a loop with no end condition of its own. Only `break` can leave it.',
        'שורה 1: `while True:` היא לולאה בלי תנאי סיום משלה. רק `break` יכול לצאת ממנה.',
      ],
      [
        'Line 2 reads the text. Say the user types `twelve`.',
        'שורה 2 קוראת את הטקסט. נניח שהמשתמש מקליד `twelve`.',
      ],
      [
        'Line 4: `int("twelve")` raises a ValueError. Line 5 (`break`) is skipped, Python jumps to the `except` block, and line 7 prints `That is not a number`. The loop goes round again.',
        'שורה 4: `int("twelve")` מעלה ValueError. שורה 5 (`break`) מדולגת, פייתון קופץ לבלוק ה-`except`, ושורה 7 מדפיסה `That is not a number`. הלולאה מתחילה סיבוב נוסף.',
      ],
      [
        'Now the user types `12`. Line 4 succeeds, `age` is 12, and line 5 runs `break`: the loop ends.',
        'עכשיו המשתמש מקליד `12`. שורה 4 מצליחה, `age` הוא 12, ושורה 5 מריצה `break`: הלולאה מסתיימת.',
      ],
      [
        'Line 9 prints `Next year you will be 13`. It is safe to use `age` here, because the only way out of the loop was a successful conversion.',
        'שורה 9 מדפיסה `Next year you will be 13`. בטוח להשתמש כאן ב-`age`, כי הדרך היחידה לצאת מהלולאה הייתה המרה מוצלחת.',
      ],
    ], true),
    code(py`
      That is not a number
      Next year you will be 13
    `, { lang: 'text', runnable: false, caption: t('What print shows for the input twelve, then 12', 'מה ש-print מציג עבור הקלט twelve ואז 12') }),
  ],

  moreExamples: [
    [
      h('The same try inside a for loop', 'אותו try בתוך לולאת for'),
      code(py`
        texts = ["7", "abc", "12"]
        for text in texts:
            try:
                number = int(text)
                print("OK:", number)
            except ValueError:
                print("Not a number:", text)
      `, { output: 'OK: 7\nNot a number: abc\nOK: 12' }),
      p(
        'The loop does not stop at `abc`: the `except` block handles it and the loop continues with `12`. Press play to watch Python skip the `print("OK: ...")` line for the bad value.',
        'הלולאה לא נעצרת ב-`abc`: בלוק ה-`except` מטפל בו והלולאה ממשיכה עם `12`. לחצו על כפתור ההפעלה כדי לראות איך פייתון מדלג על השורה `print("OK: ...")` עבור הערך הפגום.',
      ),
      viz(py`
        texts = ["7", "abc", "12"]
        for text in texts:
            try:
                number = int(text)
                print("OK:", number)
            except ValueError:
                print("Not a number:", text)
      `),
    ],
    [
      h('A function that asks until it gets a number', 'פונקציה שמבקשת עד שהיא מקבלת מספר'),
      code(py`
        def ask_number(prompt):
            while True:
                text = input(prompt)
                try:
                    return int(text)
                except ValueError:
                    print("That is not a number")

        age = ask_number("How old are you? ")
        print(f"Next year you will be {age + 1}")
      `),
      p(
        'Putting the loop in a function means you write it once and call it wherever you need a number. `return int(text)` does two jobs: if the conversion works, the value is returned and the loop ends together with the function; if it fails, the `except` block runs and the loop asks again. For the input `twelve` then `12`, this prints `That is not a number` and then `Next year you will be 13`.',
        'כשהלולאה נמצאת בפונקציה, כותבים אותה פעם אחת וקוראים לה בכל מקום שצריך בו מספר. `return int(text)` עושה שתי עבודות: אם ההמרה מצליחה, הערך מוחזר והלולאה מסתיימת יחד עם הפונקציה; אם היא נכשלת, בלוק ה-`except` רץ והלולאה מבקשת שוב. עבור הקלט `twelve` ואז `12`, התוכנית מדפיסה `That is not a number` ואז `Next year you will be 13`.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l29-hard',
    title: ['Divide 100 without crashing', 'לחלק 100 בלי לקרוס'],
    mode: 'write',
    instructions: [
      p(
        'Ask for a whole number (any prompt text) and print `Result: ` followed by 100 divided by it, for example `Result: 25.0` for `4`. If the text is not a whole number print `That is not a number`; if it is `0` print `Cannot divide by zero`. In both cases ask again, until a result is printed. Use one `try` with two `except` blocks.',
        'בקשו מספר שלם (טקסט הבקשה חופשי) והדפיסו `Result: ` ואחריו 100 חלקי המספר, למשל `Result: 25.0` עבור `4`. אם הטקסט אינו מספר שלם הדפיסו `That is not a number`; אם הוא `0` הדפיסו `Cannot divide by zero`. בשני המקרים בקשו שוב, עד שמודפסת תוצאה. השתמשו ב-`try` אחד עם שני בלוקים של `except`.',
      ),
    ],
    starterCode: py`
      text = input("Divide 100 by: ")
      divisor = int(text)
      print(f"Result: {100 / divisor}")
    `,
    sampleStdin: ['abc', '0', '4'],
    check: {
      tests: [
        outputTest('That is not a number\nCannot divide by zero\nResult: 25.0', { stdin: ['abc', '0', '4'] }),
        outputTest('Result: 20.0', { stdin: ['5'] }),
        outputTest('Cannot divide by zero\nThat is not a number\nResult: 12.5', { stdin: ['0', 'x', '8'] }),
      ],
      requires: [
        requires('\\bexcept\\s+ZeroDivisionError\\b', 'Catch the division by zero with its own except ZeroDivisionError block.', 'תפסו את החלוקה באפס עם בלוק `except ZeroDivisionError` משלה.'),
      ],
    },
    hints: [
      ['Wrap the reading, converting and dividing in a `while True:` loop with a `try` block inside.', 'עטפו את הקריאה, ההמרה והחלוקה בלולאת `while True:` עם בלוק `try` בתוכה.'],
      ['Put `print(f"Result: {100 / divisor}")` and then `break` inside the `try`: the division itself may raise a ZeroDivisionError.', 'שימו את `print(f"Result: {100 / divisor}")` ואחריו `break` בתוך ה-`try`: החלוקה עצמה עלולה להעלות ZeroDivisionError.'],
      ['Two blocks after the try: `except ValueError:` prints the first message, `except ZeroDivisionError:` prints the second. Neither has a break, so the loop asks again.', 'שני בלוקים אחרי ה-try: `except ValueError:` מדפיס את ההודעה הראשונה, `except ZeroDivisionError:` את השנייה. לאף אחד מהם אין break, ולכן הלולאה מבקשת שוב.'],
    ],
    solution: py`
      while True:
          text = input("Divide 100 by: ")
          try:
              divisor = int(text)
              print(f"Result: {100 / divisor}")
              break
          except ValueError:
              print("That is not a number")
          except ZeroDivisionError:
              print("Cannot divide by zero")
    `,
    concepts: ['try', 'except', 'validation-loop', 'zero-division', 'value-error'],
  }),

  predict: {
    code: py`
      values = ["4", "four", "40"]
      total = 0
      for v in values:
          try:
              total = total + int(v)
          except ValueError:
              print("skip", v)
      print(total)
    `,
    prompt: t('What does this program print?', 'מה התוכנית הזאת תדפיס?'),
    answer: 'skip four\n44',
    explanation: t(
      'The loop converts "4" (total 4), fails on "four" and prints skip four, then converts "40" (total 44). The except block only handles the bad value; the loop keeps going and the final print shows 44.',
      'הלולאה ממירה את "4" (סכום 4), נכשלת ב-"four" ומדפיסה skip four, ואז ממירה את "40" (סכום 44). בלוק ה-except מטפל רק בערך הפגום; הלולאה ממשיכה, וההדפסה האחרונה מציגה 44.',
    ),
  },

  exercise: exercise({
    id: 'l29-ex',
    title: ['Ask until it is a number', 'לבקש עד שזה מספר'],
    mode: 'complete',
    instructions: [
      p(
        'Complete the program so that it keeps asking until the user types a whole number. When the text is not a number, print exactly `That is not a number` and ask again. When it is, leave the loop and print `You entered ` followed by the number. Any prompt text is fine.',
        'השלימו את התוכנית כך שתמשיך לבקש עד שהמשתמש מקליד מספר שלם. כשהטקסט אינו מספר, הדפיסו בדיוק `That is not a number` ובקשו שוב. כשהוא כן מספר, צאו מהלולאה והדפיסו `You entered ` ואחריו המספר. טקסט הבקשה חופשי.',
      ),
    ],
    starterCode: py`
      while True:
          text = input("Enter a whole number: ")
          # 1. put the next two lines inside a try block
          number = int(text)
          break
          # 2. add an except ValueError block that prints "That is not a number"

      print(f"You entered {number}")
    `,
    sampleStdin: ['abc', '12'],
    check: {
      tests: [
        outputTest('That is not a number\nYou entered 12', { stdin: ['abc', '12'] }),
        outputTest('You entered 5', { stdin: ['5'] }),
        outputTest('That is not a number\nThat is not a number\nYou entered 3', { stdin: ['x', 'y', '3'] }),
      ],
      requires: [
        requires('\\btry\\s*:', 'Use a try block around the conversion.', 'השתמשו בבלוק `try` סביב ההמרה.'),
        requires('\\bexcept\\s+ValueError\\b', 'Catch the ValueError by name: except ValueError:', 'תפסו את ה-ValueError בשמו: `except ValueError:`'),
      ],
    },
    hints: [
      ['Write `try:` above `number = int(text)` and indent the two lines under it.', 'כתבו `try:` מעל `number = int(text)` והזיחו את שתי השורות מתחתיו.'],
      ['After the try block add `except ValueError:` at the same indentation as `try`, with the print inside it.', 'אחרי בלוק ה-try הוסיפו `except ValueError:` באותה הזחה כמו `try`, עם ה-print בתוכו.'],
      ['Keep `break` inside the try, right after the conversion: it must run only when int() succeeded.', 'השאירו את `break` בתוך ה-try, מיד אחרי ההמרה: הוא צריך לרוץ רק כש-int() הצליח.'],
    ],
    solution: py`
      while True:
          text = input("Enter a whole number: ")
          try:
              number = int(text)
              break
          except ValueError:
              print("That is not a number")

      print(f"You entered {number}")
    `,
    concepts: ['try', 'except', 'validation-loop', 'value-error'],
  }),

  build: exercise({
    id: 'l29-build',
    title: ['A number collector', 'אוסף מספרים'],
    mode: 'build',
    instructions: [
      p(
        'Build a tool that collects numbers. Read lines until the user types `done` (any prompt text). Each line that is a whole number is added to a running total; each line that is not a number is skipped with the message `Skipped: ` followed by what was typed, for example `Skipped: abc`.',
        'בנו כלי שאוסף מספרים. קראו שורות עד שהמשתמש מקליד `done` (טקסט הבקשה חופשי). כל שורה שהיא מספר שלם מתווספת לסכום מצטבר; כל שורה שאינה מספר מדולגת עם ההודעה `Skipped: ` ואחריה מה שהוקלד, למשל `Skipped: abc`.',
      ),
      p(
        'When `done` arrives, print `Total: ` with the sum and `Count: ` with how many numbers were accepted. For the input `5`, `abc`, `10`, `done` the output is:',
        'כשמגיע `done`, הדפיסו `Total: ` עם הסכום ו-`Count: ` עם מספר המספרים שהתקבלו. עבור הקלט `5`, `abc`, `10`, `done` הפלט הוא:',
      ),
      code('Skipped: abc\nTotal: 15\nCount: 2', { lang: 'text', runnable: false }),
    ],
    starterCode: py`
      total = 0
      count = 0

      # read lines until the user types "done"
      #   try to turn the line into a whole number and add it to total
      #   if it is not a number, print "Skipped: " and the text

      # print the Total and Count lines
    `,
    sampleStdin: ['5', 'abc', '10', 'done'],
    check: {
      tests: [
        outputTest('Skipped: abc\nTotal: 15\nCount: 2', { stdin: ['5', 'abc', '10', 'done'] }),
        outputTest('Total: 6\nCount: 3', { stdin: ['1', '2', '3', 'done'] }),
        outputTest('Skipped: x\nTotal: 0\nCount: 0', { stdin: ['x', 'done'] }),
        outputTest('Total: 0\nCount: 0', { stdin: ['done'] }),
      ],
    },
    hints: [
      ['Use `while True:` and `break` when the text is `done`. Check for `done` before trying to convert.', 'השתמשו ב-`while True:` וב-`break` כשהטקסט הוא `done`. בדקו את `done` לפני שאתם מנסים להמיר.'],
      ['Inside `try`, convert with `int(text)`, then add it to the total and add 1 to the count. Both lines belong inside the try, after the conversion.', 'בתוך `try`, המירו עם `int(text)`, ואז הוסיפו לסכום והוסיפו 1 למונה. שתי השורות שייכות לתוך ה-try, אחרי ההמרה.'],
      ['In `except ValueError:` print `f"Skipped: {text}"`. After the loop print the two summary lines.', 'ב-`except ValueError:` הדפיסו `f"Skipped: {text}"`. אחרי הלולאה הדפיסו את שתי שורות הסיכום.'],
    ],
    solution: py`
      total = 0
      count = 0

      while True:
          text = input("Number (or done): ")
          if text == "done":
              break
          try:
              number = int(text)
              total = total + number
              count = count + 1
          except ValueError:
              print(f"Skipped: {text}")

      print(f"Total: {total}")
      print(f"Count: {count}")
    `,
    solutionNote: [
      'The count must be increased inside the try block after the conversion, so that skipped lines are not counted.',
      'יש להגדיל את המונה בתוך בלוק ה-try אחרי ההמרה, כדי ששורות שדולגו לא ייספרו.',
    ],
    concepts: ['try', 'except', 'validation-loop', 'accumulator', 'while', 'break'],
  }),

  check: [
    choice(
      'l29-c1',
      [
        'A line inside a `try` block raises a ValueError, and there is an `except ValueError:` block. What happens?',
        'שורה בתוך בלוק `try` מעלה ValueError, ויש בלוק `except ValueError:`. מה קורה?',
      ],
      [
        opt('The rest of the try block is skipped, the except block runs, and the program continues after it.', 'שאר בלוק ה-try מדולג, בלוק ה-except רץ, והתוכנית ממשיכה אחריו.', {
          correct: true,
          feedback: ['Right. That is the whole point: the error is handled and the program keeps running.', 'נכון. זו כל המטרה: השגיאה מטופלת והתוכנית ממשיכה לרוץ.'],
        }),
        opt('The program stops and prints a traceback.', 'התוכנית נעצרת ומדפיסה traceback.', {
          feedback: ['That happens only when no except block matches the error type. Here the type matches, so the exception is caught.', 'זה קורה רק כשאף בלוק except לא מתאים לסוג השגיאה. כאן הסוג מתאים, ולכן החריגה נתפסת.'],
        }),
        opt('The except block runs, and then the try block runs again automatically.', 'בלוק ה-except רץ, ואז בלוק ה-try רץ שוב אוטומטית.', {
          feedback: ['Nothing repeats by itself. If you want to try again you need a loop; that is why the validation loop uses while True.', 'שום דבר לא חוזר על עצמו מאליו. כדי לנסות שוב צריך לולאה; לכן לולאת אימות הקלט משתמשת ב-while True.'],
        }),
        opt('Python repairs the bad value and continues with the next line of the try block.', 'פייתון מתקן את הערך הפגום וממשיך לשורה הבאה בבלוק ה-try.', {
          feedback: ['Python cannot guess a correct value. The lines after the failing one inside the try block are skipped.', 'פייתון לא יכול לנחש ערך נכון. השורות שאחרי השורה שנכשלה בתוך בלוק ה-try מדולגות.'],
        }),
      ],
      ['try', 'except'],
    ),
    choice(
      'l29-c2',
      [
        'Why should you write `except ValueError:` rather than a bare `except:`?',
        'למה כדאי לכתוב `except ValueError:` ולא `except:` ריק, בלי סוג שגיאה?',
      ],
      [
        opt('A bare except also hides bugs such as a NameError, so you would never see their tracebacks.', '`except:` ריק מסתיר גם באגים כמו NameError, ולכן לעולם לא תראו את ה-traceback שלהם.', {
          correct: true,
          feedback: ['Exactly. Catch only the error you expect; let real bugs show themselves.', 'בדיוק. תפסו רק את השגיאה שאתם מצפים לה; תנו לבאגים אמיתיים להתגלות.'],
        }),
        opt('A bare except is a syntax error.', '`except:` ריק הוא שגיאת תחביר.', {
          feedback: ['It is valid Python; it is just a bad habit, because it catches everything.', 'זה פייתון תקין; זה פשוט הרגל רע, כי הוא תופס הכול.'],
        }),
        opt('A bare except only works inside functions.', '`except:` ריק עובד רק בתוך פונקציות.', {
          feedback: ['It works anywhere. The problem is what it catches, not where it can be written.', 'הוא עובד בכל מקום. הבעיה היא מה הוא תופס, לא איפה אפשר לכתוב אותו.'],
        }),
        opt('except ValueError makes the program run faster.', 'except ValueError גורם לתוכנית לרוץ מהר יותר.', {
          feedback: ['Speed is not the issue. Naming the type is about not hiding errors you did not plan for.', 'מהירות היא לא העניין. ציון הסוג נועד לא להסתיר שגיאות שלא תכננתם להן.'],
        }),
      ],
      ['except', 'exception'],
    ),
    choice(
      'l29-c3',
      [
        'In the validation loop, why is `break` written inside the `try` block, right after `number = int(text)`?',
        'בלולאת אימות הקלט, למה `break` כתוב בתוך בלוק ה-`try`, מיד אחרי `number = int(text)`?',
      ],
      [
        opt('If int() fails, Python jumps to except before reaching break, so the loop ends only after a successful conversion.', 'אם int() נכשל, פייתון קופץ ל-except לפני שהוא מגיע ל-break, ולכן הלולאה מסתיימת רק אחרי המרה מוצלחת.', {
          correct: true,
          feedback: ['Yes. The position of break is what guarantees that number holds a real number after the loop.', 'כן. המיקום של break הוא מה שמבטיח ש-number מחזיק מספר אמיתי אחרי הלולאה.'],
        }),
        opt('break must always be the last line of a try block.', 'break חייב תמיד להיות השורה האחרונה בבלוק try.', {
          feedback: ['There is no such rule. It is placed there because of what it means: leave the loop only after success.', 'אין כלל כזה. הוא ממוקם שם בגלל המשמעות שלו: לצאת מהלולאה רק אחרי הצלחה.'],
        }),
        opt('Because break cannot be written inside an except block.', 'כי אי אפשר לכתוב break בתוך בלוק except.', {
          feedback: ['It can. But a break in the except block would leave the loop after a failure, which is the opposite of what we want.', 'אפשר. אבל break בבלוק ה-except היה יוצא מהלולאה אחרי כישלון, ההפך ממה שאנחנו רוצים.'],
        }),
        opt('To make the loop run exactly once.', 'כדי שהלולאה תרוץ בדיוק פעם אחת.', {
          feedback: ['The loop runs as many times as needed. It runs once only if the first answer is already a number.', 'הלולאה רצה כמה פעמים שצריך. היא רצה פעם אחת רק אם התשובה הראשונה כבר מספר.'],
        }),
      ],
      ['validation-loop', 'break'],
    ),
  ],

  recap: [
    list([
      ['`try:` runs a block; if a line raises an exception, the rest of the block is skipped.', '`try:` מריץ בלוק; אם שורה מעלה חריגה, שאר הבלוק מדולג.'],
      ['`except ValueError:` runs only for that error type, then the program continues. Name the type; a bare `except:` hides bugs.', '`except ValueError:` רץ רק עבור סוג השגיאה הזה, ואז התוכנית ממשיכה. ציינו את הסוג; `except:` ריק מסתיר באגים.'],
      ['Validation loop: `while True:`, read, `try` to convert, `break` on success, message in `except`.', 'לולאת אימות קלט: `while True:`, קריאה, `try` להמרה, `break` בהצלחה, הודעה ב-`except`.'],
      ['Several `except` blocks handle several error types; the first matching one runs.', 'כמה בלוקים של `except` מטפלים בכמה סוגי שגיאות; הראשון שמתאים רץ.'],
      ['Catch only errors you expect and can handle. A bug deserves its traceback.', 'תפסו רק שגיאות שאתם מצפים להן ויכולים לטפל בהן. באג ראוי ל-traceback שלו.'],
    ]),
    p(
      'You now have both halves of working with errors: reading them when they are yours, and catching them when they come from outside. Programs that survive bad input feel finished in a way that fragile ones never do.',
      'עכשיו יש לכם את שני החצאים של עבודה עם שגיאות: לקרוא אותן כשהן שלכם, ולתפוס אותן כשהן מגיעות מבחוץ. תוכניות ששורדות קלט לא תקין נראות מוגמרות באופן שתוכניות שבירות לעולם לא ייראו.',
    ),
  ],
  next: t(
    'This closes Stage 1. In the module project you will build a small text adventure that reads commands from the player, and everything from the stage comes together: dictionaries, loops, functions and careful handling of bad commands.',
    'זה סוגר את שלב 1. בפרויקט המודול תבנו הרפתקת טקסט קטנה שקוראת פקודות מהשחקן, וכל מה שלמדתם בשלב מתחבר: מילונים, לולאות, פונקציות וטיפול זהיר בפקודות לא תקינות.',
  ),
};
