import type { Assessment } from '../../schema';
import {
  p,
  code,
  t,
  opt,
  choice,
  predictQ,
  codeQ,
  outputTest,
  functionTest,
  requires,
  py,
} from '../../authoring';

export const test: Assessment = {
  id: 'm7-test',
  kind: 'module-test',
  moduleId: 'm7',
  title: t('Module 7 test: errors', 'מבחן מודול 7: שגיאות'),
  description: [
    p(
      'Eight questions on reading tracebacks and handling errors with try / except. Three of them are small coding tasks. You need 70% to pass.',
      'שמונה שאלות על קריאת traceback וטיפול בשגיאות עם try / except. שלוש מהן הן משימות תכנות קטנות. כדי לעבור צריך 70%.',
    ),
  ],
  passScore: 0.7,
  hintsAllowed: 1,
  estimatedMinutes: 20,
  pools: [
    // 1. Which error does this code raise? (NameError / ZeroDivisionError)
    {
      variants: [
        choice(
          'm7-t-q1-a',
          [
            p('Which error does this program raise?', 'איזו שגיאה התוכנית הזאת מעלה?'),
            code(py`
              total = 0
              for n in [1, 2, 3]:
                  total = total + n
              print(totl)
            `, { runnable: false }),
          ],
          [
            opt('NameError', 'NameError', {
              correct: true,
              feedback: ['Right. The name totl was never created; the variable is called total. A misspelled name is a NameError.', 'נכון. השם totl מעולם לא נוצר; המשתנה נקרא total. שם עם שגיאת כתיב הוא NameError.'],
            }),
            opt('TypeError', 'TypeError', {
              feedback: ['A TypeError is about mixing types. Here the problem is an unknown name.', 'TypeError עוסק בערבוב טיפוסים. כאן הבעיה היא שם לא מוכר.'],
            }),
            opt('ValueError', 'ValueError', {
              feedback: ['A ValueError needs a conversion such as int() with an impossible value. There is none here.', 'ValueError דורש המרה כמו int() עם ערך בלתי אפשרי. אין כאן כזו.'],
            }),
            opt('SyntaxError', 'SyntaxError', {
              feedback: ['The program is valid Python; the problem appears only when line 4 runs.', 'התוכנית היא פייתון תקין; הבעיה מופיעה רק כששורה 4 רצה.'],
            }),
          ],
          ['name-error', 'traceback'],
        ),
        choice(
          'm7-t-q1-b',
          [
            p('Which error does this program raise?', 'איזו שגיאה התוכנית הזאת מעלה?'),
            code(py`
              scores = []
              average = sum(scores) / len(scores)
              print(average)
            `, { runnable: false }),
          ],
          [
            opt('ZeroDivisionError', 'ZeroDivisionError', {
              correct: true,
              feedback: ['Right. The list is empty, so len(scores) is 0 and the division fails.', 'נכון. הרשימה ריקה, ולכן len(scores) הוא 0 והחלוקה נכשלת.'],
            }),
            opt('IndexError', 'IndexError', {
              feedback: ['Nothing is looked up by position here, so there is no IndexError.', 'שום דבר לא נשלף לפי מיקום כאן, ולכן אין IndexError.'],
            }),
            opt('ValueError', 'ValueError', {
              feedback: ['sum() and len() accept an empty list without complaint. Only the division fails.', 'sum() ו-len() מקבלים רשימה ריקה בלי בעיה. רק החלוקה נכשלת.'],
            }),
            opt('NameError', 'NameError', {
              feedback: ['Every name here exists. The empty list makes len(scores) zero, and dividing by zero is the error.', 'כל השמות כאן קיימים. הרשימה הריקה הופכת את len(scores) לאפס, וחלוקה באפס היא השגיאה.'],
            }),
          ],
          ['zero-division', 'traceback'],
        ),
      ],
    },
    // 2. Which error does this code raise? (ValueError / AttributeError)
    {
      variants: [
        choice(
          'm7-t-q2-a',
          [
            p('Which error does this program raise?', 'איזו שגיאה התוכנית הזאת מעלה?'),
            code(py`
              age = int("twelve")
              print(age)
            `, { runnable: false }),
          ],
          [
            opt('ValueError', 'ValueError', {
              correct: true,
              feedback: ['Right. int() accepts text, but "twelve" is not a number: right type, impossible value.', 'נכון. int() מקבל טקסט, אבל "twelve" אינו מספר: טיפוס נכון, ערך בלתי אפשרי.'],
            }),
            opt('TypeError', 'TypeError', {
              feedback: ['int() is allowed to receive text. The value, not the type, is the problem.', 'מותר ל-int() לקבל טקסט. הבעיה היא הערך, לא הטיפוס.'],
            }),
            opt('NameError', 'NameError', {
              feedback: ['int is a built-in function and no unknown name is used.', 'int היא פונקציה מובנית, ולא נעשה שימוש בשם לא מוכר.'],
            }),
            opt('ZeroDivisionError', 'ZeroDivisionError', {
              feedback: ['There is no division in this program.', 'אין חלוקה בתוכנית הזאת.'],
            }),
          ],
          ['value-error'],
        ),
        choice(
          'm7-t-q2-b',
          [
            p('Which error does this program raise?', 'איזו שגיאה התוכנית הזאת מעלה?'),
            code(py`
              names = "Maya"
              names.append("Dan")
              print(names)
            `, { runnable: false }),
          ],
          [
            opt('AttributeError', 'AttributeError', {
              correct: true,
              feedback: ['Right. names is a string, and strings have no append. The message names the real type: \'str\' object.', 'נכון. names הוא מחרוזת, ולמחרוזות אין append. ההודעה מציינת את הטיפוס האמיתי: \'str\' object.'],
            }),
            opt('TypeError', 'TypeError', {
              feedback: ['Close, but a missing method is reported as an AttributeError, and its message tells you the real type of the value.', 'קרוב, אבל פעולה חסרה מדווחת כ-AttributeError, וההודעה שלה מגלה את הטיפוס האמיתי של הערך.'],
            }),
            opt('NameError', 'NameError', {
              feedback: ['names exists. The problem is what kind of value it holds.', 'names קיים. הבעיה היא איזה סוג ערך הוא מחזיק.'],
            }),
            opt('IndexError', 'IndexError', {
              feedback: ['No list position is used here.', 'לא נעשה כאן שימוש במיקום ברשימה.'],
            }),
          ],
          ['attribute-error'],
        ),
      ],
    },
    // 3. What try / except does
    {
      variants: [
        choice(
          'm7-t-q3-a',
          ['What does the block `except ValueError:` do?', 'מה עושה הבלוק `except ValueError:`?'],
          [
            opt('It runs only if a ValueError was raised inside the try block above it; then the program continues.', 'הוא רץ רק אם הועלה ValueError בתוך בלוק ה-try שמעליו; אחר כך התוכנית ממשיכה.', {
              correct: true,
              feedback: ['Correct. The except block is the backup plan for that one error type.', 'נכון. בלוק ה-except הוא תוכנית הגיבוי לסוג השגיאה האחד הזה.'],
            }),
            opt('It runs after the try block every time, like the next line.', 'הוא רץ אחרי בלוק ה-try בכל פעם, כמו השורה הבאה.', {
              feedback: ['If the try block finishes without an error, the except block is skipped entirely.', 'אם בלוק ה-try מסתיים בלי שגיאה, בלוק ה-except מדולג לגמרי.'],
            }),
            opt('It checks the code for ValueErrors before the program starts.', 'הוא בודק את הקוד לאיתור ValueError לפני שהתוכנית מתחילה.', {
              feedback: ['Exceptions happen while the program runs; nothing is checked in advance.', 'חריגות קורות בזמן שהתוכנית רצה; שום דבר לא נבדק מראש.'],
            }),
            opt('It runs the try block again until it succeeds.', 'הוא מריץ את בלוק ה-try שוב עד שהוא מצליח.', {
              feedback: ['Nothing repeats by itself. To try again you need a loop, which is what the validation loop adds.', 'שום דבר לא חוזר מאליו. כדי לנסות שוב צריך לולאה, וזה מה שלולאת אימות הקלט מוסיפה.'],
            }),
          ],
          ['except', 'try'],
        ),
        choice(
          'm7-t-q3-b',
          ['A program uses `try:` followed by `except:` with no error type. What is the problem with that?', 'תוכנית משתמשת ב-`try:` ואחריו `except:` בלי סוג שגיאה. מה הבעיה בזה?'],
          [
            opt('It catches every error, including bugs such as a NameError, so their tracebacks are hidden.', 'הוא תופס כל שגיאה, כולל באגים כמו NameError, ולכן ה-traceback שלהם מוסתר.', {
              correct: true,
              feedback: ['Correct. Name the error you expect so that real bugs still show themselves.', 'נכון. ציינו את השגיאה שאתם מצפים לה, כדי שבאגים אמיתיים עדיין יתגלו.'],
            }),
            opt('It is a syntax error: except always needs a type.', 'זו שגיאת תחביר: except תמיד דורש סוג.', {
              feedback: ['A bare except is valid Python. It is a bad habit, not a syntax error.', 'except חשוף הוא פייתון תקין. זה הרגל רע, לא שגיאת תחביר.'],
            }),
            opt('It only catches ValueError.', 'הוא תופס רק ValueError.', {
              feedback: ['The opposite: with no type it catches everything.', 'ההפך: בלי סוג הוא תופס הכול.'],
            }),
            opt('It stops the program instead of continuing.', 'הוא עוצר את התוכנית במקום להמשיך.', {
              feedback: ['It does continue; that is exactly the problem, because it continues even after a real bug.', 'הוא כן ממשיך; זו בדיוק הבעיה, כי הוא ממשיך גם אחרי באג אמיתי.'],
            }),
          ],
          ['except', 'exception'],
        ),
      ],
    },
    // 4. Predict: try / except with fixed values
    {
      variants: [
        predictQ(
          'm7-t-q4-a',
          py`
            text = "abc"
            try:
                number = int(text)
                print("OK")
            except ValueError:
                print("Bad input")
            print("Done")
          `,
          'Bad input\nDone',
          [
            'int("abc") raises a ValueError, so print("OK") is skipped, the except block prints Bad input, and the program continues with Done.',
            'int("abc") מעלה ValueError, ולכן print("OK") מדולג, בלוק ה-except מדפיס Bad input, והתוכנית ממשיכה עם Done.',
          ],
          ['try', 'except'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
        predictQ(
          'm7-t-q4-b',
          py`
            values = ["3", "x", "4"]
            total = 0
            for v in values:
                try:
                    total = total + int(v)
                except ValueError:
                    print("Skipped", v)
            print(total)
          `,
          'Skipped x\n7',
          [
            'The loop adds 3, fails on "x" and prints Skipped x, then adds 4. The except block handles only the bad value, and the total is 7.',
            'הלולאה מוסיפה 3, נכשלת ב-"x" ומדפיסה Skipped x, ואז מוסיפה 4. בלוק ה-except מטפל רק בערך הפגום, והסכום הוא 7.',
          ],
          ['try', 'except'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
      ],
    },
    // 5. Predict: several except blocks / no error at all
    {
      variants: [
        predictQ(
          'm7-t-q5-a',
          py`
            a = "10"
            b = "0"
            try:
                result = int(a) / int(b)
                print(result)
            except ValueError:
                print("Not a number")
            except ZeroDivisionError:
                print("Cannot divide by zero")
          `,
          'Cannot divide by zero',
          [
            'Both conversions succeed, then 10 / 0 raises a ZeroDivisionError. Python runs the except block whose type matches, the second one, and skips the first.',
            'שתי ההמרות מצליחות, ואז 10 / 0 מעלה ZeroDivisionError. פייתון מריץ את בלוק ה-except שהסוג שלו מתאים, השני, ומדלג על הראשון.',
          ],
          ['except', 'zero-division'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
        predictQ(
          'm7-t-q5-b',
          py`
            text = "12"
            try:
                number = int(text)
                print(number * 2)
            except ValueError:
                print("Bad")
            print("End")
          `,
          '24\nEnd',
          [
            '"12" converts without any error, so the whole try block runs and prints 24, the except block is skipped, and End is printed last.',
            '"12" מומר בלי שום שגיאה, ולכן כל בלוק ה-try רץ ומדפיס 24, בלוק ה-except מדולג, ו-End מודפס אחרון.',
          ],
          ['try', 'except'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
      ],
    },
    // 6. Code: fix a program with runtime bugs
    {
      variants: [
        codeQ({
          id: 'm7-t-q6-a',
          title: ['Fix three runtime bugs', 'תקנו שלושה באגים של זמן ריצה'],
          mode: 'fix',
          instructions: [
            p(
              'This program has three runtime bugs. Run it, read the last line of each traceback, and fix them one at a time. When it works it prints exactly `Items: 3` and then `pen`.',
              'בתוכנית הזאת יש שלושה באגים של זמן ריצה. הריצו אותה, קראו את השורה האחרונה של כל traceback, ותקנו אותם אחד אחרי השני. כשהיא עובדת היא מדפיסה בדיוק `Items: 3` ואז `pen`.',
            ),
          ],
          starterCode: py`
            items = ["pen", "cup"]
            items.push("key")
            count = len(itmes)
            print("Items: " + count)
            print(items[0])
          `,
          check: {
            tests: [outputTest('Items: 3\npen')],
          },
          hints: [
            ['Lists have no push; the method that adds an item is append. Then check the spelling of itmes.', 'לרשימות אין push; הפעולה שמוסיפה איבר היא append. אחר כך בדקו את האיות של itmes.'],
            ['"Items: " + count joins text with a number. Use an f-string: `print(f"Items: {count}")`.', '"Items: " + count מחבר טקסט עם מספר. השתמשו ב-f-string: `print(f"Items: {count}")`.'],
            ['Line 2: `items.append("key")`; line 3: `count = len(items)`; line 4: `print(f"Items: {count}")`.', 'שורה 2: `items.append("key")`; שורה 3: `count = len(items)`; שורה 4: `print(f"Items: {count}")`.'],
          ],
          solution: py`
            items = ["pen", "cup"]
            items.append("key")
            count = len(items)
            print(f"Items: {count}")
            print(items[0])
          `,
          concepts: ['traceback', 'attribute-error', 'name-error', 'type-mismatch'],
        }),
        codeQ({
          id: 'm7-t-q6-b',
          title: ['Fix three runtime bugs', 'תקנו שלושה באגים של זמן ריצה'],
          mode: 'fix',
          instructions: [
            p(
              'This program has three runtime bugs. Run it, read the last line of each traceback, and fix them one at a time. When it works it prints exactly `Average: 6.0` and then `2` (the number of scores).',
              'בתוכנית הזאת יש שלושה באגים של זמן ריצה. הריצו אותה, קראו את השורה האחרונה של כל traceback, ותקנו אותם אחד אחרי השני. כשהיא עובדת היא מדפיסה בדיוק `Average: 6.0` ואז `2` (מספר הציונים).',
            ),
          ],
          starterCode: py`
            def average(values):
                return sum(values) / len(valeus)

            scores = [4, 8]
            print("Average: " + average(scores))
            print(scores.length)
          `,
          check: {
            tests: [outputTest('Average: 6.0\n2')],
          },
          hints: [
            ['The NameError inside average is a misspelled parameter name. Then the TypeError: use an f-string to print the average.', 'ה-NameError בתוך average הוא שם פרמטר עם שגיאת כתיב. אחר כך ה-TypeError: השתמשו ב-f-string כדי להדפיס את הממוצע.'],
            ['Lists have no length attribute in Python; the number of items is `len(scores)`.', 'לרשימות בפייתון אין תכונה בשם length; מספר האיברים הוא `len(scores)`.'],
            ['Fixed lines: `len(values)`, `print(f"Average: {average(scores)}")` and `print(len(scores))`.', 'השורות המתוקנות: `len(values)`, `print(f"Average: {average(scores)}")` ו-`print(len(scores))`.'],
          ],
          solution: py`
            def average(values):
                return sum(values) / len(values)

            scores = [4, 8]
            print(f"Average: {average(scores)}")
            print(len(scores))
          `,
          concepts: ['traceback', 'name-error', 'attribute-error', 'type-mismatch'],
        }),
      ],
    },
    // 7. Code: a function that returns a value or None (functionTest)
    {
      variants: [
        codeQ({
          id: 'm7-t-q7-a',
          title: ['safe_int', 'safe_int'],
          mode: 'write',
          instructions: [
            p(
              'Write a function `safe_int(text)` that returns the whole number written in `text`, or `None` if the text is not a whole number. For example `safe_int("42")` returns `42` and `safe_int("abc")` returns `None`. Use `try` / `except ValueError` inside the function; the function must never raise an error itself.',
              'כתבו פונקציה `safe_int(text)` שמחזירה את המספר השלם שכתוב ב-`text`, או `None` אם הטקסט אינו מספר שלם. למשל `safe_int("42")` מחזירה `42` ו-`safe_int("abc")` מחזירה `None`. השתמשו ב-`try` / `except ValueError` בתוך הפונקציה; הפונקציה עצמה לעולם לא צריכה להעלות שגיאה.',
            ),
          ],
          starterCode: py`
            def safe_int(text):
                # return int(text), or None if that is impossible
                return int(text)
          `,
          check: {
            tests: [
              functionTest('safe_int("42")', '42'),
              functionTest('safe_int("abc")', 'None'),
              functionTest('safe_int("-7")', '-7'),
              functionTest('safe_int("3.5")', 'None'),
            ],
            requires: [
              requires('\\btry\\s*:', 'Use a try block inside the function.', 'השתמשו בבלוק `try` בתוך הפונקציה.'),
              requires('\\bexcept\\s+ValueError\\b', 'Catch the ValueError by name.', 'תפסו את ה-ValueError בשמו.'),
            ],
          },
          hints: [
            ['Put `return int(text)` inside a try block; if it works, the function is done.', 'שימו את `return int(text)` בתוך בלוק try; אם זה עובד, הפונקציה סיימה.'],
            ['In the `except ValueError:` block write `return None`.', 'בבלוק `except ValueError:` כתבו `return None`.'],
            ['The whole function is four lines: `try:`, `return int(text)`, `except ValueError:`, `return None`.', 'כל הפונקציה היא ארבע שורות: `try:`, `return int(text)`, `except ValueError:`, `return None`.'],
          ],
          solution: py`
            def safe_int(text):
                try:
                    return int(text)
                except ValueError:
                    return None
          `,
          concepts: ['try', 'except', 'value-error', 'return', 'none'],
        }),
        codeQ({
          id: 'm7-t-q7-b',
          title: ['safe_divide', 'safe_divide'],
          mode: 'write',
          instructions: [
            p(
              'Write a function `safe_divide(a, b)` that returns `a / b`, or `None` when `b` is 0. For example `safe_divide(10, 4)` returns `2.5` and `safe_divide(1, 0)` returns `None`. Use `try` / `except ZeroDivisionError` inside the function; the function must never raise an error itself.',
              'כתבו פונקציה `safe_divide(a, b)` שמחזירה `a / b`, או `None` כאשר `b` הוא 0. למשל `safe_divide(10, 4)` מחזירה `2.5` ו-`safe_divide(1, 0)` מחזירה `None`. השתמשו ב-`try` / `except ZeroDivisionError` בתוך הפונקציה; הפונקציה עצמה לעולם לא צריכה להעלות שגיאה.',
            ),
          ],
          starterCode: py`
            def safe_divide(a, b):
                # return a / b, or None when b is 0
                return a / b
          `,
          check: {
            tests: [
              functionTest('safe_divide(10, 4)', '2.5'),
              functionTest('safe_divide(1, 0)', 'None'),
              functionTest('safe_divide(9, 3)', '3.0'),
              functionTest('safe_divide(0, 5)', '0.0'),
            ],
            requires: [
              requires('\\btry\\s*:', 'Use a try block inside the function.', 'השתמשו בבלוק `try` בתוך הפונקציה.'),
              requires('\\bexcept\\s+ZeroDivisionError\\b', 'Catch the ZeroDivisionError by name.', 'תפסו את ה-ZeroDivisionError בשמו.'),
            ],
          },
          hints: [
            ['Put `return a / b` inside a try block; if it works, the function is done.', 'שימו את `return a / b` בתוך בלוק try; אם זה עובד, הפונקציה סיימה.'],
            ['In the `except ZeroDivisionError:` block write `return None`.', 'בבלוק `except ZeroDivisionError:` כתבו `return None`.'],
            ['The whole function is four lines: `try:`, `return a / b`, `except ZeroDivisionError:`, `return None`.', 'כל הפונקציה היא ארבע שורות: `try:`, `return a / b`, `except ZeroDivisionError:`, `return None`.'],
          ],
          solution: py`
            def safe_divide(a, b):
                try:
                    return a / b
                except ZeroDivisionError:
                    return None
          `,
          concepts: ['try', 'except', 'zero-division', 'return', 'none'],
        }),
      ],
    },
    // 8. Code: a validation loop with stdin
    {
      variants: [
        codeQ({
          id: 'm7-t-q8-a',
          title: ['Ask until it is a number', 'לבקש עד שזה מספר'],
          mode: 'write',
          instructions: [
            p(
              'Ask for a whole number (any prompt text) until the user types one. For every text that is not a whole number print exactly `That is not a number` and ask again. Then print `You entered ` followed by the number, for example `You entered 12`.',
              'בקשו מספר שלם (טקסט הבקשה חופשי) עד שהמשתמש מקליד אחד. עבור כל טקסט שאינו מספר שלם הדפיסו בדיוק `That is not a number` ובקשו שוב. אחר כך הדפיסו `You entered ` ואחריו המספר, למשל `You entered 12`.',
            ),
          ],
          starterCode: py`
            text = input("Enter a whole number: ")
            number = int(text)
            print(f"You entered {number}")
          `,
          sampleStdin: ['abc', '12'],
          check: {
            tests: [
              outputTest('That is not a number\nYou entered 12', { stdin: ['abc', '12'] }),
              outputTest('You entered 7', { stdin: ['7'] }),
              outputTest('That is not a number\nThat is not a number\nYou entered 3', { stdin: ['x', 'y', '3'] }),
            ],
            requires: [
              requires('\\btry\\s*:', 'Use a try block around the conversion.', 'השתמשו בבלוק `try` סביב ההמרה.'),
            ],
          },
          hints: [
            ['Wrap everything in `while True:`; convert inside `try` and `break` right after a successful conversion.', 'עטפו הכול ב-`while True:`; המירו בתוך `try` ובצעו `break` מיד אחרי המרה מוצלחת.'],
            ['`except ValueError:` prints the message; because it has no break, the loop asks again.', '`except ValueError:` מדפיס את ההודעה; מכיוון שאין בו break, הלולאה מבקשת שוב.'],
            ['After the loop, `print(f"You entered {number}")`: the variable is safe to use because the loop only ends after a successful int().', 'אחרי הלולאה, `print(f"You entered {number}")`: בטוח להשתמש במשתנה כי הלולאה מסתיימת רק אחרי int() מוצלח.'],
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
          concepts: ['validation-loop', 'try', 'except', 'value-error'],
        }),
        codeQ({
          id: 'm7-t-q8-b',
          title: ['Double it, once the input is valid', 'להכפיל, ברגע שהקלט תקין'],
          mode: 'write',
          instructions: [
            p(
              'Ask for a whole number (any prompt text) until the user types one. For every text that is not a whole number print exactly `Try again` and ask again. Then print `Double: ` followed by twice the number, for example `Double: 10` for the input `5`.',
              'בקשו מספר שלם (טקסט הבקשה חופשי) עד שהמשתמש מקליד אחד. עבור כל טקסט שאינו מספר שלם הדפיסו בדיוק `Try again` ובקשו שוב. אחר כך הדפיסו `Double: ` ואחריו כפליים מהמספר, למשל `Double: 10` עבור הקלט `5`.',
            ),
          ],
          starterCode: py`
            text = input("Number: ")
            number = int(text)
            print(f"Double: {number * 2}")
          `,
          sampleStdin: ['ten', '5'],
          check: {
            tests: [
              outputTest('Try again\nDouble: 10', { stdin: ['ten', '5'] }),
              outputTest('Double: 8', { stdin: ['4'] }),
              outputTest('Try again\nTry again\nDouble: 12', { stdin: ['a', 'b', '6'] }),
            ],
            requires: [
              requires('\\btry\\s*:', 'Use a try block around the conversion.', 'השתמשו בבלוק `try` סביב ההמרה.'),
            ],
          },
          hints: [
            ['Wrap everything in `while True:`; convert inside `try` and `break` right after a successful conversion.', 'עטפו הכול ב-`while True:`; המירו בתוך `try` ובצעו `break` מיד אחרי המרה מוצלחת.'],
            ['`except ValueError:` prints Try again; because it has no break, the loop asks again.', '`except ValueError:` מדפיס Try again; מכיוון שאין בו break, הלולאה מבקשת שוב.'],
            ['After the loop, `print(f"Double: {number * 2}")`: the variable is safe to use because the loop only ends after a successful int().', 'אחרי הלולאה, `print(f"Double: {number * 2}")`: בטוח להשתמש במשתנה כי הלולאה מסתיימת רק אחרי int() מוצלח.'],
          ],
          solution: py`
            while True:
                text = input("Number: ")
                try:
                    number = int(text)
                    break
                except ValueError:
                    print("Try again")

            print(f"Double: {number * 2}")
          `,
          concepts: ['validation-loop', 'try', 'except', 'value-error'],
        }),
      ],
    },
  ],
};
