import type { Project } from '../schema';
import { p, code, list, callout, t, pythonTest, requires, py } from '../authoring';

/*
 * The calculator grows step by step. Input order is the same in every step:
 * the operator first, then the first number, then the second number.
 *
 * Checks are cumulative (the final program must pass every step's check), so
 * every check runs the program with stdin that ends with "q" and looks for
 * lines in the output instead of comparing the whole output.
 *
 * Note: functionTest cannot be used here because the program reads input from
 * step 2 on; a functionTest runs the program with no input lines. The
 * pythonTest below calls the learner's functions through `ns` instead.
 */

const helpers = py`
  def lines_of(text):
      return [l.strip() for l in text.strip().split("\n") if l.strip()]
`;

const needsMain = requires(
  '^def\\s+main\\s*\\(\\s*\\)\\s*:',
  'Define a function called main() that runs the calculator.',
  'הגדירו פונקציה בשם `main()` שמריצה את המחשבון.',
);

export const project: Project = {
  id: 'p-calculator',
  moduleId: 'm5',
  title: t('Calculator', 'מחשבון'),
  tagline: t('Four small functions, one loop, and a main() that ties them together.', 'ארבע פונקציות קטנות, לולאה אחת, ו-`main()` שמחברת ביניהן.'),
  description: [
    p(
      'You will build a calculator that runs in the console. It starts as four tiny functions that return results, then grows into a program that reads an operator and two numbers, handles mistakes, keeps going until the user quits, counts the calculations, and finally is organised around a `main()` function.',
      'תבנו מחשבון שרץ בקונסול. הוא מתחיל כארבע פונקציות זעירות שמחזירות תוצאות, ואז גדל לתוכנית שקוראת אופרטור ושני מספרים, מטפלת בטעויות, ממשיכה עד שהמשתמש מסיים, סופרת את החישובים, ולבסוף מאורגנת סביב פונקציית `main()`.',
    ),
    p(
      'The input order is the same in every step: **first the operator, then the first number, then the second number**. The Run button is pre-filled with a short session: `+ 3 4`, then `* 2 5`, then `q`.',
      'סדר הקלט זהה בכל השלבים: **קודם האופרטור, אחר כך המספר הראשון, ואז המספר השני**. כפתור ההרצה ממולא מראש בסשן קצר: `+ 3 4`, אחר כך `* 2 5`, ואז `q`.',
    ),
    callout(
      'note',
      'During the checks input() does not show its prompt, so the prompt wording is entirely up to you. Only what you print with print() is compared.',
      'בזמן הבדיקות `input()` לא מציג את טקסט ההנחיה, ולכן ניסוח ההנחיה נתון לגמרי לבחירתכם. רק מה שמודפס עם `print()` נבדק.',
    ),
  ],
  prerequisites: ['l20-def', 'l21-parameters', 'l22-return', 'l23-scope'],
  estimatedMinutes: 45,
  starterCode: py`
    # Calculator
    # Step 1: define add, subtract, multiply and divide here


    # Step 2 and later: the program that uses them goes below

  `,
  sampleStdin: ['+', '3', '4', '*', '2', '5', 'q'],
  steps: [
    /* ------------------------------------------------------------ step 1 */
    {
      id: 'p-calc-s1',
      title: t('Four functions that return', 'ארבע פונקציות שמחזירות'),
      instructions: [
        p(
          'Define four functions, each with two parameters `a` and `b`, and each **returning** its result (no printing):',
          'הגדירו ארבע פונקציות, לכל אחת שני פרמטרים `a` ו-`b`, וכל אחת **מחזירה** את התוצאה שלה (בלי הדפסה):',
        ),
        list([
          ['`add(a, b)` returns `a + b`.', '`add(a, b)` מחזירה `a + b`.'],
          ['`subtract(a, b)` returns `a - b`.', '`subtract(a, b)` מחזירה `a - b`.'],
          ['`multiply(a, b)` returns `a * b`.', '`multiply(a, b)` מחזירה `a * b`.'],
          ['`divide(a, b)` returns `a / b`. But if `b` is 0, it returns the text `Cannot divide by zero` instead.', '`divide(a, b)` מחזירה `a / b`. אבל אם `b` הוא 0, היא מחזירה במקום זה את הטקסט `Cannot divide by zero`.'],
        ]),
        p(
          'Nothing is printed in this step. The check calls your functions directly, for example `add(2, 3)` should give `5` and `divide(5, 0)` should give `Cannot divide by zero`.',
          'בשלב הזה לא מדפיסים שום דבר. הבדיקה קוראת לפונקציות שלכם ישירות; למשל `add(2, 3)` צריכה לתת `5` ו-`divide(5, 0)` צריכה לתת `Cannot divide by zero`.',
        ),
      ],
      hints: [
        ['Each function is two lines: `def add(a, b):` and, indented, `return a + b`.', 'כל פונקציה היא שתי שורות: `def add(a, b):` ומתחתיה, מוזח, `return a + b`.'],
        ['In divide, check first: `if b == 0:` then `return "Cannot divide by zero"`; after the if, `return a / b`.', 'ב-divide בדקו קודם: `if b == 0:` ואז `return "Cannot divide by zero"`; אחרי ה-if, `return a / b`.'],
        ['If the check says a function returned None, you printed instead of returning.', 'אם הבדיקה אומרת שפונקציה החזירה None, הדפסתם במקום להחזיר.'],
      ],
      check: {
        tests: [
          pythonTest(py`
            def check(name, args, expected):
                assert callable(ns.get(name)), "Define a function called " + name + "."
                value = ns[name](*args)
                call = name + str(args)
                assert value is not None, call + " returned None. Use return, not print."
                assert value == expected, call + " should return " + repr(expected) + " but returned " + repr(value) + "."

            check("add", (2, 3), 5)
            check("add", (2.5, 1), 3.5)
            check("subtract", (10, 4), 6)
            check("subtract", (3, 8), -5)
            check("multiply", (3, 4), 12)
            check("multiply", (2.5, 2), 5.0)
            check("divide", (8, 2), 4.0)
            check("divide", (7, 2), 3.5)
            check("divide", (5, 0), "Cannot divide by zero")
          `, { stdin: ['+', '3', '4', 'q'], name: ['The four functions return the right values', 'ארבע הפונקציות מחזירות את הערכים הנכונים'] }),
        ],
      },
      referenceCode: py`
        def add(a, b):
            return a + b


        def subtract(a, b):
            return a - b


        def multiply(a, b):
            return a * b


        def divide(a, b):
            if b == 0:
                return "Cannot divide by zero"
            return a / b
      `,
    },
    /* ------------------------------------------------------------ step 2 */
    {
      id: 'p-calc-s2',
      title: t('Read the operator and two numbers', 'קריאת האופרטור ושני המספרים'),
      instructions: [
        p(
          'Below the functions, read three lines from the user, in this order: the **operator** (`+`, `-`, `*` or `/`), then the **first number**, then the **second number**. Convert both numbers with `float()`. Then use the matching function and print **just the result**, nothing else — for example `7.0`.',
          'מתחת לפונקציות, קראו שלוש שורות מהמשתמש, בסדר הזה: ה**אופרטור** (`+`, `-`, `*` או `/`), אחר כך ה**מספר הראשון**, ואז ה**מספר השני**. המירו את שני המספרים עם `float()`. אחר כך השתמשו בפונקציה המתאימה והדפיסו **רק את התוצאה**, בלי שום דבר נוסף — למשל `7.0`.',
        ),
        code('+\n3\n4', { lang: 'text', runnable: false, caption: t('Example input', 'קלט לדוגמה') }),
        code('7.0', { lang: 'text', runnable: false, caption: t('Expected output', 'פלט צפוי') }),
        p(
          'The prompt texts are up to you. Use `if` / `elif` on the operator to choose the function, store what it returns in a variable, and print that variable. Because `divide` returns a text when the second number is 0, printing the result also prints `Cannot divide by zero` in that case.',
          'טקסטי ההנחיה לבחירתכם. השתמשו ב-`if` / `elif` על האופרטור כדי לבחור את הפונקציה, שמרו את מה שהיא מחזירה במשתנה, והדפיסו את המשתנה. מכיוון ש-`divide` מחזירה טקסט כשהמספר השני הוא 0, הדפסת התוצאה מדפיסה במקרה הזה גם את `Cannot divide by zero`.',
        ),
      ],
      hints: [
        ['`operator = input("Operator: ")`, then `first = float(input("First: "))` and `second = float(input("Second: "))`.', '`operator = input("Operator: ")`, אחר כך `first = float(input("First: "))` ו-`second = float(input("Second: "))`.'],
        ['`if operator == "+": result = add(first, second)` — and an elif for each of the other three operators.', '`if operator == "+": result = add(first, second)` — ו-elif לכל אחד משלושת האופרטורים האחרים.'],
        ['Finish with `print(result)` after the if / elif chain.', 'סיימו ב-`print(result)` אחרי שרשרת ה-if / elif.'],
      ],
      check: {
        tests: [
          pythonTest(helpers + '\n' + py`
            def expect(inputs, wanted):
                out = lines_of(run(inputs))
                assert wanted in out, "For the input " + " ".join(inputs[:3]) + " the program should print a line with exactly " + wanted + " (it printed: " + " | ".join(out) + ")."

            assert "7.0" in lines_of(stdout), "For + 3 4 the program should print 7.0 (convert the numbers with float)."
            expect(["-", "10", "4", "q"], "6.0")
            expect(["*", "2.5", "4", "q"], "10.0")
            expect(["/", "7", "2", "q"], "3.5")
            expect(["/", "5", "0", "q"], "Cannot divide by zero")
          `, { stdin: ['+', '3', '4', 'q'], name: ['Each operator prints its result', 'כל אופרטור מדפיס את התוצאה שלו'] }),
        ],
        requires: [requires('\\bfloat\\s*\\(', 'Convert the numbers with float().', 'המירו את המספרים עם `float()`.')],
      },
      referenceCode: py`
        def add(a, b):
            return a + b


        def subtract(a, b):
            return a - b


        def multiply(a, b):
            return a * b


        def divide(a, b):
            if b == 0:
                return "Cannot divide by zero"
            return a / b


        operator = input("Operator (+ - * /): ")
        first = float(input("First number: "))
        second = float(input("Second number: "))

        if operator == "+":
            result = add(first, second)
        elif operator == "-":
            result = subtract(first, second)
        elif operator == "*":
            result = multiply(first, second)
        elif operator == "/":
            result = divide(first, second)

        print(result)
      `,
    },
    /* ------------------------------------------------------------ step 3 */
    {
      id: 'p-calc-s3',
      title: t('Unknown operator', 'אופרטור לא מוכר'),
      instructions: [
        p(
          'Try running the program with the operator `x`. Right now it crashes, because `result` never gets a value. Add an `else` branch so that for any operator other than `+`, `-`, `*`, `/` the program prints exactly `Unknown operator`.',
          'נסו להריץ את התוכנית עם האופרטור `x`. כרגע היא קורסת, כי `result` אף פעם לא מקבל ערך. הוסיפו ענף `else` כך שלכל אופרטור שאינו `+`, `-`, `*`, `/` התוכנית תדפיס בדיוק `Unknown operator`.',
        ),
        p(
          'Keep the input order: the program still reads the operator and **both** numbers first, and only then decides what to print.',
          'שמרו על סדר הקלט: התוכנית עדיין קוראת קודם את האופרטור ואת **שני** המספרים, ורק אחר כך מחליטה מה להדפיס.',
        ),
      ],
      hints: [
        ['Add `else:` after the last `elif`.', 'הוסיפו `else:` אחרי ה-`elif` האחרון.'],
        ['Inside the else, give result the text: `result = "Unknown operator"`. The print at the end stays as it is.', 'בתוך ה-else, תנו ל-result את הטקסט: `result = "Unknown operator"`. ה-print בסוף נשאר כמו שהוא.'],
        ['Check the spelling and the capital U: the check looks for exactly Unknown operator.', 'בדקו את האיות ואת ה-U הגדולה: הבדיקה מחפשת בדיוק Unknown operator.'],
      ],
      check: {
        tests: [
          pythonTest(helpers + '\n' + py`
            assert "Unknown operator" in lines_of(stdout), "For the operator x the program should print exactly: Unknown operator"
            assert "Unknown operator" in lines_of(run(["%", "1", "2", "q"])), "For the operator % the program should print exactly: Unknown operator"
            assert "7.0" in lines_of(run(["+", "3", "4", "q"])), "The + operator should still print 7.0."
          `, { stdin: ['x', '3', '4', 'q'], name: ['Unknown operators are reported', 'אופרטורים לא מוכרים מדווחים'] }),
        ],
      },
      referenceCode: py`
        def add(a, b):
            return a + b


        def subtract(a, b):
            return a - b


        def multiply(a, b):
            return a * b


        def divide(a, b):
            if b == 0:
                return "Cannot divide by zero"
            return a / b


        operator = input("Operator (+ - * /): ")
        first = float(input("First number: "))
        second = float(input("Second number: "))

        if operator == "+":
            result = add(first, second)
        elif operator == "-":
            result = subtract(first, second)
        elif operator == "*":
            result = multiply(first, second)
        elif operator == "/":
            result = divide(first, second)
        else:
            result = "Unknown operator"

        print(result)
      `,
    },
    /* ------------------------------------------------------------ step 4 */
    {
      id: 'p-calc-s4',
      title: t('Keep calculating until q', 'להמשיך לחשב עד q'),
      instructions: [
        p(
          'Put the reading and calculating inside a `while` loop so the user can do several calculations. Each round reads the operator first. If the operator is `q`, print exactly `Goodbye` and stop. Otherwise read the two numbers, print the result as before, and go round again.',
          'הכניסו את הקריאה והחישוב לתוך לולאת `while`, כדי שהמשתמש יוכל לבצע כמה חישובים. כל סיבוב קורא קודם את האופרטור. אם האופרטור הוא `q`, הדפיסו בדיוק `Goodbye` ועצרו. אחרת קראו את שני המספרים, הדפיסו את התוצאה כמו קודם, וחזרו לסיבוב הבא.',
        ),
        code('+\n1\n2\n*\n2\n5\nq', { lang: 'text', runnable: false, caption: t('Example input', 'קלט לדוגמה') }),
        code('3.0\n10.0\nGoodbye', { lang: 'text', runnable: false, caption: t('Expected output', 'פלט צפוי') }),
      ],
      hints: [
        ['Use `while True:` and indent everything that was below the functions into the loop.', 'השתמשו ב-`while True:` והזיחו לתוך הלולאה את כל מה שהיה מתחת לפונקציות.'],
        ['Right after reading the operator: `if operator == "q": break`. Then read the numbers.', 'מיד אחרי קריאת האופרטור: `if operator == "q": break`. אחר כך קראו את המספרים.'],
        ['After the loop (not indented) print `Goodbye`.', 'אחרי הלולאה (בלי הזחה) הדפיסו `Goodbye`.'],
      ],
      check: {
        tests: [
          pythonTest(helpers + '\n' + py`
            out = lines_of(stdout)
            assert "3.0" in out, "After + 1 2 the program should print 3.0."
            assert "10.0" in out, "The program should keep going: after * 2 5 it should print 10.0."
            assert out[-1] == "Goodbye", "When the operator is q, print exactly Goodbye and stop."
            assert out.index("3.0") < out.index("10.0") < len(out) - 1, "Print each result right after its calculation, and Goodbye last."
            first = lines_of(run(["q"]))
            assert first and first[-1] == "Goodbye", "Typing q as the very first operator should print Goodbye."
          `, { stdin: ['+', '1', '2', '*', '2', '5', 'q'], name: ['The loop runs until q', 'הלולאה רצה עד q'] }),
        ],
        requires: [requires('\\bwhile\\b', 'Use a while loop.', 'השתמשו בלולאת while.')],
      },
      referenceCode: py`
        def add(a, b):
            return a + b


        def subtract(a, b):
            return a - b


        def multiply(a, b):
            return a * b


        def divide(a, b):
            if b == 0:
                return "Cannot divide by zero"
            return a / b


        while True:
            operator = input("Operator (+ - * /) or q to quit: ")
            if operator == "q":
                break
            first = float(input("First number: "))
            second = float(input("Second number: "))

            if operator == "+":
                result = add(first, second)
            elif operator == "-":
                result = subtract(first, second)
            elif operator == "*":
                result = multiply(first, second)
            elif operator == "/":
                result = divide(first, second)
            else:
                result = "Unknown operator"

            print(result)

        print("Goodbye")
      `,
    },
    /* ------------------------------------------------------------ step 5 */
    {
      id: 'p-calc-s5',
      title: t('Count the calculations', 'ספירת החישובים'),
      instructions: [
        p(
          'Keep a count of how many calculations were done. Every round with a known operator (`+`, `-`, `*`, `/`) counts as one calculation — including a division by zero, because the user did ask for one. A round with an unknown operator does **not** count. When the user quits, print exactly `Calculations done: N` (with the number) and then `Goodbye`.',
          'שמרו ספירה של כמה חישובים בוצעו. כל סיבוב עם אופרטור מוכר (`+`, `-`, `*`, `/`) נחשב לחישוב אחד — כולל חלוקה באפס, כי המשתמש ביקש אותה. סיבוב עם אופרטור לא מוכר **לא** נספר. כשהמשתמש מסיים, הדפיסו בדיוק `Calculations done: N` (עם המספר) ואחר כך `Goodbye`.',
        ),
        code('+\n1\n2\n*\n2\n5\nq', { lang: 'text', runnable: false, caption: t('Example input', 'קלט לדוגמה') }),
        code('3.0\n10.0\nCalculations done: 2\nGoodbye', { lang: 'text', runnable: false, caption: t('Expected output', 'פלט צפוי') }),
      ],
      hints: [
        ['Create `count = 0` before the loop.', 'צרו `count = 0` לפני הלולאה.'],
        ['After printing the result, add 1 to count — but only if the result is not the text "Unknown operator": `if result != "Unknown operator": count = count + 1`.', 'אחרי הדפסת התוצאה, הוסיפו 1 ל-count — אבל רק אם התוצאה אינה הטקסט "Unknown operator": `if result != "Unknown operator": count = count + 1`.'],
        ['After the loop: `print(f"Calculations done: {count}")` and then the Goodbye line.', 'אחרי הלולאה: `print(f"Calculations done: {count}")` ואז שורת ה-Goodbye.'],
      ],
      check: {
        tests: [
          pythonTest(helpers + '\n' + py`
            out = lines_of(stdout)
            assert len(out) >= 2 and out[-2] == "Calculations done: 2" and out[-1] == "Goodbye", "After two calculations the last two lines should be: Calculations done: 2, then Goodbye."
            zero = lines_of(run(["q"]))
            assert len(zero) >= 2 and zero[-2] == "Calculations done: 0", "With no calculations print Calculations done: 0 before Goodbye."
            mixed = lines_of(run(["+", "1", "2", "x", "1", "2", "q"]))
            assert "Calculations done: 1" in mixed, "An unknown operator does not count: + 1 2 and then x 1 2 gives Calculations done: 1."
            div = lines_of(run(["/", "1", "0", "q"]))
            assert "Calculations done: 1" in div, "A division by zero still counts as a calculation."
          `, { stdin: ['+', '1', '2', '*', '2', '5', 'q'], name: ['Calculations are counted', 'החישובים נספרים'] }),
        ],
      },
      referenceCode: py`
        def add(a, b):
            return a + b


        def subtract(a, b):
            return a - b


        def multiply(a, b):
            return a * b


        def divide(a, b):
            if b == 0:
                return "Cannot divide by zero"
            return a / b


        count = 0
        while True:
            operator = input("Operator (+ - * /) or q to quit: ")
            if operator == "q":
                break
            first = float(input("First number: "))
            second = float(input("Second number: "))

            if operator == "+":
                result = add(first, second)
            elif operator == "-":
                result = subtract(first, second)
            elif operator == "*":
                result = multiply(first, second)
            elif operator == "/":
                result = divide(first, second)
            else:
                result = "Unknown operator"

            print(result)
            if result != "Unknown operator":
                count = count + 1

        print(f"Calculations done: {count}")
        print("Goodbye")
      `,
    },
    /* ------------------------------------------------------------ step 6 */
    {
      id: 'p-calc-s6',
      title: t('Organise with main()', 'ארגון עם main()'),
      instructions: [
        p(
          'The program works. Now give it a clean shape. Move the loop, the count and the final two prints into a function `main()`, and call `main()` on the last line of the file. Nothing except function definitions and that final call should be at the top level: no `while` and no `input` outside a function, and no `global`.',
          'התוכנית עובדת. עכשיו תנו לה צורה נקייה. העבירו את הלולאה, הספירה ושתי ההדפסות האחרונות לפונקציה `main()`, וקראו ל-`main()` בשורה האחרונה של הקובץ. ברמה העליונה לא צריך להישאר דבר מלבד הגדרות פונקציות והקריאה הסופית: בלי `while` ובלי `input` מחוץ לפונקציה, ובלי `global`.',
        ),
        p(
          'Optional but recommended: move the `if` / `elif` chain into its own function `calculate(operator, first, second)` that **returns** the result (or `Unknown operator`). Then the loop body becomes short: read, `result = calculate(...)`, print, count.',
          'רשות אבל מומלץ: העבירו את שרשרת ה-`if` / `elif` לפונקציה משלה, `calculate(operator, first, second)`, ש**מחזירה** את התוצאה (או `Unknown operator`). אז גוף הלולאה נעשה קצר: קריאה, `result = calculate(...)`, הדפסה, ספירה.',
        ),
        p(
          'The behaviour must stay exactly the same; every earlier check still runs.',
          'ההתנהגות חייבת להישאר בדיוק אותו דבר; כל הבדיקות הקודמות עדיין רצות.',
        ),
      ],
      hints: [
        ['Write `def main():` under the four functions and indent the whole loop (and the two final prints) into it. `count = 0` goes inside main too.', 'כתבו `def main():` מתחת לארבע הפונקציות והזיחו לתוכה את כל הלולאה (ואת שתי ההדפסות האחרונות). גם `count = 0` נכנס לתוך main.'],
        ['For calculate: each branch does `return add(first, second)` and so on; the last line of the function is `return "Unknown operator"`.', 'עבור calculate: כל ענף עושה `return add(first, second)` וכן הלאה; השורה האחרונה בפונקציה היא `return "Unknown operator"`.'],
        ['The very last line of the file, not indented, is `main()`.', 'השורה האחרונה ממש בקובץ, בלי הזחה, היא `main()`.'],
      ],
      check: {
        tests: [
          pythonTest(helpers + '\n' + py`
            assert callable(ns.get("main")), "Define a function called main that runs the calculator."
            out = lines_of(stdout)
            assert "3.0" in out and out[-1] == "Goodbye", "main() must be called at the bottom so the calculator still runs."
          `, { stdin: ['+', '1', '2', 'q'], name: ['main() runs the calculator', 'main() מריצה את המחשבון'] }),
        ],
        requires: [needsMain],
        forbids: [
          requires('^while\\b', 'The loop must be inside main(), not at the top level of the file.', 'הלולאה חייבת להיות בתוך `main()`, לא ברמה העליונה של הקובץ.'),
          requires('^\\S[^\\n]*\\binput\\s*\\(', 'Read input inside a function, not at the top level of the file.', 'קראו קלט בתוך פונקציה, לא ברמה העליונה של הקובץ.'),
          requires('\\bglobal\\b', 'Do not use the global keyword; keep count as a local variable of main().', 'אל תשתמשו במילת המפתח global; שמרו את count כמשתנה מקומי של `main()`.'),
        ],
      },
      referenceCode: py`
        def add(a, b):
            return a + b


        def subtract(a, b):
            return a - b


        def multiply(a, b):
            return a * b


        def divide(a, b):
            if b == 0:
                return "Cannot divide by zero"
            return a / b


        def calculate(operator, first, second):
            if operator == "+":
                return add(first, second)
            if operator == "-":
                return subtract(first, second)
            if operator == "*":
                return multiply(first, second)
            if operator == "/":
                return divide(first, second)
            return "Unknown operator"


        def main():
            count = 0
            while True:
                operator = input("Operator (+ - * /) or q to quit: ")
                if operator == "q":
                    break
                first = float(input("First number: "))
                second = float(input("Second number: "))
                result = calculate(operator, first, second)
                print(result)
                if result != "Unknown operator":
                    count = count + 1
            print(f"Calculations done: {count}")
            print("Goodbye")


        main()
      `,
    },
  ],
  extensions: [
    t('Add a power operator `^` with a `power(a, b)` function that returns `a ** b`.', 'הוסיפו אופרטור חזקה `^` עם פונקציה `power(a, b)` שמחזירה `a ** b`.'),
    t('Print the whole calculation, for example `3.0 + 4.0 = 7.0`, instead of only the result.', 'הדפיסו את החישוב כולו, למשל `3.0 + 4.0 = 7.0`, במקום רק את התוצאה.'),
    t('Keep a running total of all results and print it before Goodbye.', 'שמרו סכום מצטבר של כל התוצאות והדפיסו אותו לפני Goodbye.'),
    t('Let the user type `avg` as the operator to get the average of the two numbers.', 'אפשרו למשתמש להקליד `avg` כאופרטור כדי לקבל את הממוצע של שני המספרים.'),
    t('Remember the last result and let the user type `ans` instead of a number to reuse it.', 'זכרו את התוצאה האחרונה ואפשרו למשתמש להקליד `ans` במקום מספר כדי להשתמש בה שוב.'),
  ],
  concepts: [
    'function',
    'def',
    'call',
    'parameter',
    'argument',
    'return',
    'return-value',
    'program-structure',
    'local-variable',
    'while',
    'break',
    'if',
    'elif',
    'else',
    'input',
    'type-conversion',
    'float',
    'f-string',
  ],
};
