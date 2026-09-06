import type { Assessment } from '../../schema';
import { p, t, opt, choice, predictQ, codeQ, functionTest, requires, py } from '../../authoring';

export const test: Assessment = {
  id: 'm5-test',
  kind: 'module-test',
  moduleId: 'm5',
  title: t('Module 5 test: functions', 'מבחן מודול 5: פונקציות'),
  description: [
    p(
      'Nine questions about defining and calling functions, parameters and arguments, return values, and scope. Three of them are small coding tasks. You need 70% to pass, and you may use one hint per coding task.',
      'תשע שאלות על הגדרה וקריאה של פונקציות, פרמטרים וארגומנטים, ערכים מוחזרים ותחום. שלוש מהן הן משימות תכנות קטנות. כדי לעבור צריך 70%, ואפשר להשתמש ברמז אחד בכל משימת תכנות.',
    ),
  ],
  passScore: 0.7,
  hintsAllowed: 1,
  estimatedMinutes: 25,
  pools: [
    /* ---------------------------------------------------- 1. def / call (l20) */
    {
      variants: [
        choice(
          'm5-t-q1-a',
          ['What does the line `def show():` do?', 'מה עושה השורה `def show():`?'],
          [
            opt('It defines a function named show; its body runs only when show() is called.', 'היא מגדירה פונקציה בשם show; הגוף שלה רץ רק כשקוראים ל-show().', {
              correct: true,
              feedback: ['Right. Defining stores the steps; calling runs them.', 'נכון. ההגדרה שומרת את הצעדים; הקריאה מריצה אותם.'],
            }),
            opt('It runs the function show immediately.', 'היא מריצה מיד את הפונקציה show.', {
              feedback: ['A def line never runs the body. Only a call such as show() does.', 'שורת def אף פעם לא מריצה את הגוף. רק קריאה כמו show() עושה זאת.'],
            }),
            opt('It prints the word show.', 'היא מדפיסה את המילה show.', {
              feedback: ['Nothing is printed by a definition.', 'הגדרה לא מדפיסה שום דבר.'],
            }),
            opt('It asks the user to type something.', 'היא מבקשת מהמשתמש להקליד משהו.', {
              feedback: ['Only input() asks the user for text. def defines a function.', 'רק input() מבקש טקסט מהמשתמש. def מגדיר פונקציה.'],
            }),
          ],
          ['def', 'function'],
        ),
        choice(
          'm5-t-q1-b',
          ['A function `show` is defined above. Which line runs it?', 'הפונקציה `show` מוגדרת למעלה. איזו שורה מריצה אותה?'],
          [
            opt('`show()`', '`show()`', {
              correct: true,
              feedback: ['Yes. The name followed by parentheses is a call.', 'כן. השם ואחריו סוגריים הם קריאה.'],
            }),
            opt('`show`', '`show`', {
              feedback: ['Without the parentheses nothing runs.', 'בלי הסוגריים שום דבר לא רץ.'],
            }),
            opt('`def show():`', 'השורה `def show():`', {
              feedback: ['That line defines the function; it does not run it.', 'השורה הזאת מגדירה את הפונקציה; היא לא מריצה אותה.'],
            }),
            opt('`run show`', '`run show`', {
              feedback: ['That is not Python. A call is the name with parentheses: show().', 'זה לא פייתון. קריאה היא השם עם סוגריים: show().'],
            }),
          ],
          ['call'],
        ),
      ],
    },
    /* ---------------------------------------------------- 2. predict: define vs call (l20 / l21) */
    {
      variants: [
        predictQ(
          'm5-t-q2-a',
          py`
            def beep():
                print("Beep")

            print("Start")
            print("End")
          `,
          'Start\nEnd',
          ['beep is defined but never called, so Beep is never printed. Only Start and End print.', '`beep` מוגדרת אבל אף פעם לא קוראים לה, ולכן `Beep` לא מודפס. רק `Start` ו-`End` מודפסים.'],
          ['def', 'call'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
        predictQ(
          'm5-t-q2-b',
          py`
            def power(base, exp=2):
                print(base ** exp)

            power(3)
            power(2, 3)
          `,
          '9\n8',
          ['power(3) uses the default exp=2, so 3 ** 2 is 9. power(2, 3) gives exp the value 3, so 2 ** 3 is 8.', '`power(3)` משתמשת בברירת המחדל `exp=2`, ולכן `3 ** 2` הוא 9. `power(2, 3)` נותנת ל-`exp` את הערך 3, ולכן `2 ** 3` הוא 8.'],
          ['default-parameter', 'argument'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
      ],
    },
    /* ---------------------------------------------------- 3. parameters (l21) */
    {
      variants: [
        choice(
          'm5-t-q3-a',
          ['In `def area(width, height):` and the call `area(3, 4)`, what are `width` and `height`?', 'ב-`def area(width, height):` ובקריאה `area(3, 4)`, מה הם `width` ו-`height`?'],
          [
            opt('Parameters: names that receive the values 3 and 4.', 'פרמטרים: שמות שמקבלים את הערכים 3 ו-4.', {
              correct: true,
              feedback: ['Right. The names in the def line are parameters; 3 and 4 are the arguments.', 'נכון. השמות בשורת ה-def הם פרמטרים; 3 ו-4 הם הארגומנטים.'],
            }),
            opt('Arguments: the values passed in the call.', 'ארגומנטים: הערכים שמועברים בקריאה.', {
              feedback: ['3 and 4 are the arguments. width and height are the parameters that receive them.', '3 ו-4 הם הארגומנטים. width ו-height הם הפרמטרים שמקבלים אותם.'],
            }),
            opt('Return values of the function.', 'ערכים מוחזרים של הפונקציה.', {
              feedback: ['A return value comes out of the function; parameters carry values in.', 'ערך מוחזר יוצא מהפונקציה; פרמטרים מכניסים ערכים פנימה.'],
            }),
            opt('Global variables.', 'משתנים גלובליים.', {
              feedback: ['Parameters are local to the function, not global.', 'פרמטרים הם מקומיים לפונקציה, לא גלובליים.'],
            }),
          ],
          ['parameter', 'argument'],
        ),
        choice(
          'm5-t-q3-b',
          ['What does `def greet(name, greeting="Hi"):` allow?', 'מה מאפשרת ההגדרה `def greet(name, greeting="Hi"):`?'],
          [
            opt('Calling greet with one argument or with two.', 'לקרוא ל-greet עם ארגומנט אחד או עם שניים.', {
              correct: true,
              feedback: ['Right. With one argument, greeting is "Hi"; with two, the second argument replaces it.', 'נכון. עם ארגומנט אחד, greeting הוא "Hi"; עם שניים, הארגומנט השני מחליף אותו.'],
            }),
            opt('Calling greet only with exactly one argument.', 'לקרוא ל-greet רק עם ארגומנט אחד בדיוק.', {
              feedback: ['A second argument is allowed; it overrides the default.', 'ארגומנט שני מותר; הוא דורס את ברירת המחדל.'],
            }),
            opt('greeting can never be anything but "Hi".', 'greeting לא יכול להיות שום דבר חוץ מ-"Hi".', {
              feedback: ['greet("Noa", "Bye") sets greeting to "Bye".', 'greet("Noa", "Bye") קובע את greeting ל-"Bye".'],
            }),
            opt('Calling greet with no arguments at all.', 'לקרוא ל-greet בלי ארגומנטים בכלל.', {
              feedback: ['name has no default, so at least one argument is required.', 'ל-name אין ברירת מחדל, ולכן נדרש לפחות ארגומנט אחד.'],
            }),
          ],
          ['default-parameter'],
        ),
      ],
    },
    /* ---------------------------------------------------- 4. predict: print vs return (l22) */
    {
      variants: [
        predictQ(
          'm5-t-q4-a',
          py`
            def triple(n):
                print(n * 3)

            result = triple(2)
            print(result)
          `,
          '6\nNone',
          ['triple prints 6 while running, but it has no return, so the call gives back None. That is what result holds and what the last line prints.', '`triple` מדפיסה 6 בזמן הריצה, אבל אין בה `return`, ולכן הקריאה מחזירה `None`. זה מה ש-`result` מחזיק ומה שהשורה האחרונה מדפיסה.'],
          ['return-value', 'none'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
        predictQ(
          'm5-t-q4-b',
          py`
            def half(n):
                return n / 2
                print("done")

            print(half(8))
          `,
          '4.0',
          ['return ends the function immediately, so "done" is never printed. 8 / 2 is the float 4.0, which is printed.', '`return` מסיים את הפונקציה מיד, ולכן `done` לא מודפס אף פעם. `8 / 2` הוא המספר העשרוני 4.0, וזה מה שמודפס.'],
          ['return', 'return-value'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
      ],
    },
    /* ---------------------------------------------------- 5. None / local variables (l22, l23) */
    {
      variants: [
        choice(
          'm5-t-q5-a',
          ['A function ends without a return statement. What does its call give back?', 'פונקציה מסתיימת בלי משפט `return`. מה הקריאה אליה מחזירה?'],
          [
            opt('`None`', '`None`', {
              correct: true,
              feedback: ['Yes. No return means the value None.', 'כן. בלי return הערך הוא None.'],
            }),
            opt('0', '0', {
              feedback: ['Python does not invent a number; the value is None.', 'פייתון לא ממציא מספר; הערך הוא None.'],
            }),
            opt('The last text the function printed.', 'הטקסט האחרון שהפונקציה הדפיסה.', {
              feedback: ['Printed text goes to the screen, never back to the caller.', 'טקסט שמודפס הולך למסך, אף פעם לא בחזרה לקורא.'],
            }),
            opt('An error.', 'שגיאה.', {
              feedback: ['It is allowed; the result is simply None.', 'זה מותר; התוצאה היא פשוט None.'],
            }),
          ],
          ['none', 'return-value'],
        ),
        choice(
          'm5-t-q5-b',
          ['Which sentence about a variable created inside a function is true?', 'איזה משפט על משתנה שנוצר בתוך פונקציה נכון?'],
          [
            opt('It disappears when the function returns; code outside cannot use it.', 'הוא נעלם כשהפונקציה מחזירה; קוד מחוץ לה לא יכול להשתמש בו.', {
              correct: true,
              feedback: ['Right. It is local to that call of the function.', 'נכון. הוא מקומי לקריאה הזאת של הפונקציה.'],
            }),
            opt('It can be printed from anywhere after the function was called.', 'אפשר להדפיס אותו מכל מקום אחרי שקראו לפונקציה.', {
              feedback: ['Outside the function the name is unknown: NameError.', 'מחוץ לפונקציה השם לא מוכר: NameError.'],
            }),
            opt('It is shared by all functions in the file.', 'הוא משותף לכל הפונקציות בקובץ.', {
              feedback: ['Each function has its own local variables.', 'לכל פונקציה יש משתנים מקומיים משלה.'],
            }),
            opt('It must be declared with the word local.', 'צריך להכריז עליו עם המילה local.', {
              feedback: ['There is no such keyword; assigning inside a function makes it local automatically.', 'אין מילת מפתח כזאת; השמה בתוך פונקציה הופכת אותו למקומי אוטומטית.'],
            }),
          ],
          ['local-variable', 'scope'],
        ),
      ],
    },
    /* ---------------------------------------------------- 6. predict: scope (l23) */
    {
      variants: [
        predictQ(
          'm5-t-q6-a',
          py`
            name = "Dana"

            def change():
                name = "Omer"

            change()
            print(name)
          `,
          'Dana',
          ['Inside change, name = "Omer" creates a local variable. The global name is untouched, so Dana is printed.', 'בתוך `change`, `name = "Omer"` יוצר משתנה מקומי. ה-`name` הגלובלי לא משתנה, ולכן מודפס `Dana`.'],
          ['local-variable', 'global-variable'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
        predictQ(
          'm5-t-q6-b',
          py`
            bonus = 10

            def add_bonus(score):
                return score + bonus

            print(add_bonus(5))
            print(bonus)
          `,
          '15\n10',
          ['add_bonus reads the global bonus (10) and returns 5 + 10 = 15. Reading a global does not change it, so the second line prints 10.', '`add_bonus` קוראת את `bonus` הגלובלי (10) ומחזירה 5 + 10 = 15. קריאה של משתנה גלובלי לא משנה אותו, ולכן השורה השנייה מדפיסה 10.'],
          ['global-variable', 'return'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
      ],
    },
    /* ---------------------------------------------------- 7. code: square / cube */
    {
      variants: [
        codeQ({
          id: 'm5-t-q7-a',
          title: ['square(n)', 'square(n)'],
          mode: 'write',
          instructions: [
            p(
              'Write a function `square(n)` that **returns** `n` multiplied by itself. For example `square(4)` returns `16`. The function must return the value, not print it.',
              'כתבו פונקציה `square(n)` ש**מחזירה** את `n` כפול עצמו. למשל `square(4)` מחזירה `16`. הפונקציה חייבת להחזיר את הערך, לא להדפיס אותו.',
            ),
          ],
          starterCode: py`
            # define square(n)

          `,
          check: {
            tests: [
              functionTest('square(4)', '16'),
              functionTest('square(0)', '0'),
              functionTest('square(-3)', '9'),
              functionTest('square(2.5)', '6.25'),
            ],
          },
          hints: [
            ['Start with `def square(n):`.', 'התחילו ב-`def square(n):`.'],
            ['The body is one line that returns `n * n`.', 'הגוף הוא שורה אחת שמחזירה `n * n`.'],
            ['`return n * n` — with return, not print.', '`return n * n` — עם return, לא print.'],
          ],
          solution: py`
            def square(n):
                return n * n
          `,
          concepts: ['def', 'parameter', 'return'],
        }),
        codeQ({
          id: 'm5-t-q7-b',
          title: ['cube(n)', 'cube(n)'],
          mode: 'write',
          instructions: [
            p(
              'Write a function `cube(n)` that **returns** `n` multiplied by itself twice: `n * n * n`. For example `cube(2)` returns `8`. The function must return the value, not print it.',
              'כתבו פונקציה `cube(n)` ש**מחזירה** את `n` כפול עצמו פעמיים: `n * n * n`. למשל `cube(2)` מחזירה `8`. הפונקציה חייבת להחזיר את הערך, לא להדפיס אותו.',
            ),
          ],
          starterCode: py`
            # define cube(n)

          `,
          check: {
            tests: [
              functionTest('cube(2)', '8'),
              functionTest('cube(0)', '0'),
              functionTest('cube(-2)', '-8'),
              functionTest('cube(1.5)', '3.375'),
            ],
          },
          hints: [
            ['Start with `def cube(n):`.', 'התחילו ב-`def cube(n):`.'],
            ['The body is one line that returns `n * n * n`.', 'הגוף הוא שורה אחת שמחזירה `n * n * n`.'],
            ['`return n * n * n` — with return, not print.', '`return n * n * n` — עם return, לא print.'],
          ],
          solution: py`
            def cube(n):
                return n * n * n
          `,
          concepts: ['def', 'parameter', 'return'],
        }),
      ],
    },
    /* ---------------------------------------------------- 8. code: True/False functions */
    {
      variants: [
        codeQ({
          id: 'm5-t-q8-a',
          title: ['is_even(n)', 'is_even(n)'],
          mode: 'write',
          instructions: [
            p(
              'Write a function `is_even(n)` that returns `True` when `n` is even and `False` when it is odd. Tip: a number is even when `n % 2 == 0`. Return the value; do not print it.',
              'כתבו פונקציה `is_even(n)` שמחזירה `True` כש-`n` זוגי ו-`False` כשהוא אי-זוגי. טיפ: מספר הוא זוגי כאשר `n % 2 == 0`. החזירו את הערך; אל תדפיסו אותו.',
            ),
          ],
          starterCode: py`
            # define is_even(n)

          `,
          check: {
            tests: [
              functionTest('is_even(4)', 'True'),
              functionTest('is_even(7)', 'False'),
              functionTest('is_even(0)', 'True'),
              functionTest('is_even(-2)', 'True'),
              functionTest('is_even(13)', 'False'),
            ],
          },
          hints: [
            ['`n % 2` is the remainder after dividing by 2; it is 0 for even numbers.', '`n % 2` הוא השארית מחלוקה ב-2; היא 0 למספרים זוגיים.'],
            ['Use an if: `if n % 2 == 0:` return True, otherwise return False.', 'השתמשו ב-if: `if n % 2 == 0:` החזירו True, אחרת החזירו False.'],
            ['Shortest version: `return n % 2 == 0` — the comparison is already True or False.', 'הגרסה הקצרה ביותר: `return n % 2 == 0` — ההשוואה כבר נותנת True או False.'],
          ],
          solution: py`
            def is_even(n):
                return n % 2 == 0
          `,
          concepts: ['def', 'return', 'modulo', 'boolean'],
        }),
        codeQ({
          id: 'm5-t-q8-b',
          title: ['is_positive(n)', 'is_positive(n)'],
          mode: 'write',
          instructions: [
            p(
              'Write a function `is_positive(n)` that returns `True` when `n` is bigger than 0 and `False` otherwise (0 is not positive). Return the value; do not print it.',
              'כתבו פונקציה `is_positive(n)` שמחזירה `True` כש-`n` גדול מ-0 ו-`False` אחרת (0 אינו חיובי). החזירו את הערך; אל תדפיסו אותו.',
            ),
          ],
          starterCode: py`
            # define is_positive(n)

          `,
          check: {
            tests: [
              functionTest('is_positive(5)', 'True'),
              functionTest('is_positive(-5)', 'False'),
              functionTest('is_positive(0)', 'False'),
              functionTest('is_positive(0.5)', 'True'),
            ],
          },
          hints: [
            ['The condition is `n > 0`.', 'התנאי הוא `n > 0`.'],
            ['Use an if: `if n > 0:` return True, otherwise return False.', 'השתמשו ב-if: `if n > 0:` החזירו True, אחרת החזירו False.'],
            ['Shortest version: `return n > 0` — the comparison is already True or False.', 'הגרסה הקצרה ביותר: `return n > 0` — ההשוואה כבר נותנת True או False.'],
          ],
          solution: py`
            def is_positive(n):
                return n > 0
          `,
          concepts: ['def', 'return', 'comparison', 'boolean'],
        }),
      ],
    },
    /* ---------------------------------------------------- 9. code: decisions inside functions */
    {
      variants: [
        codeQ({
          id: 'm5-t-q9-a',
          title: ['max_of_three(a, b, c)', 'max_of_three(a, b, c)'],
          mode: 'write',
          instructions: [
            p(
              'Write a function `max_of_three(a, b, c)` that returns the biggest of the three numbers, using `if` statements (do not use a built-in `max`). For example `max_of_three(1, 8, 3)` returns `8`. Return the value; do not print it.',
              'כתבו פונקציה `max_of_three(a, b, c)` שמחזירה את הגדול מבין שלושת המספרים, בעזרת משפטי `if` (בלי להשתמש ב-`max` המובנה). למשל `max_of_three(1, 8, 3)` מחזירה `8`. החזירו את הערך; אל תדפיסו אותו.',
            ),
          ],
          starterCode: py`
            # define max_of_three(a, b, c)

          `,
          check: {
            tests: [
              functionTest('max_of_three(1, 2, 3)', '3'),
              functionTest('max_of_three(9, 2, 3)', '9'),
              functionTest('max_of_three(1, 8, 3)', '8'),
              functionTest('max_of_three(5, 5, 5)', '5'),
              functionTest('max_of_three(-1, -5, -3)', '-1'),
            ],
            forbids: [requires('\\bmax\\s*\\(', 'Use if statements instead of the built-in max().', 'השתמשו במשפטי if במקום ב-max() המובנה.')],
          },
          hints: [
            ['Start by assuming `a` is the biggest: `biggest = a`.', 'התחילו בהנחה ש-`a` הוא הגדול ביותר: `biggest = a`.'],
            ['Then `if b > biggest: biggest = b`, and the same for `c`.', 'אחר כך `if b > biggest: biggest = b`, ואותו דבר עבור `c`.'],
            ['Finish with `return biggest`.', 'סיימו ב-`return biggest`.'],
          ],
          solution: py`
            def max_of_three(a, b, c):
                biggest = a
                if b > biggest:
                    biggest = b
                if c > biggest:
                    biggest = c
                return biggest
          `,
          concepts: ['def', 'parameter', 'return', 'if', 'comparison'],
        }),
        codeQ({
          id: 'm5-t-q9-b',
          title: ['describe(temp)', 'describe(temp)'],
          mode: 'write',
          instructions: [
            p(
              'Write a function `describe(temp)` that returns one word: `cold` when `temp` is below 10, `hot` when `temp` is 25 or more, and `warm` otherwise. For example `describe(30)` returns `"hot"`. Return the word; do not print it.',
              'כתבו פונקציה `describe(temp)` שמחזירה מילה אחת: `cold` כש-`temp` קטן מ-10, `hot` כש-`temp` הוא 25 או יותר, ו-`warm` אחרת. למשל `describe(30)` מחזירה `"hot"`. החזירו את המילה; אל תדפיסו אותה.',
            ),
          ],
          starterCode: py`
            # define describe(temp)

          `,
          check: {
            tests: [
              functionTest('describe(5)', '"cold"'),
              functionTest('describe(-3)', '"cold"'),
              functionTest('describe(10)', '"warm"'),
              functionTest('describe(24)', '"warm"'),
              functionTest('describe(25)', '"hot"'),
              functionTest('describe(40)', '"hot"'),
            ],
          },
          hints: [
            ['Check the cold case first: `if temp < 10: return "cold"`.', 'בדקו קודם את המקרה הקר: `if temp < 10: return "cold"`.'],
            ['Then `if temp >= 25: return "hot"`.', 'אחר כך `if temp >= 25: return "hot"`.'],
            ['After both ifs, `return "warm"` covers everything in between.', 'אחרי שני ה-if, `return "warm"` מכסה את כל מה שביניהם.'],
          ],
          solution: py`
            def describe(temp):
                if temp < 10:
                    return "cold"
                if temp >= 25:
                    return "hot"
                return "warm"
          `,
          concepts: ['def', 'parameter', 'return', 'if', 'comparison'],
        }),
      ],
    },
  ],
};
