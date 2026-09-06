import type { Assessment } from '../../schema';
import { p, t, opt, choice, predictQ, codeQ, outputTest, py } from '../../authoring';

export const test: Assessment = {
  id: 'm3-test',
  kind: 'module-test',
  moduleId: 'm3',
  title: t('Module 3 test: Making decisions', 'מבחן מודול 3: קבלת החלטות'),
  description: [
    p(
      'This test covers comparisons and booleans, if and else, elif chains, and combining conditions with and, or and not. Each attempt draws one question from every pool, so a retry will show different questions.',
      'המבחן הזה מכסה השוואות וערכים בוליאניים, `if` ו-`else`, שרשראות `elif`, ושילוב תנאים בעזרת `and`, `or` ו-`not`. בכל ניסיון נשלפת שאלה אחת מכל מאגר, ולכן בניסיון חוזר יופיעו שאלות שונות.',
    ),
    p(
      'Coding questions are checked by running your program with several inputs. During checking the prompt text of `input()` is not shown and the input is not echoed, so only what you print counts — any prompt wording is fine.',
      'שאלות הקוד נבדקות על ידי הרצת התוכנית שלכם עם כמה קלטים. בזמן הבדיקה טקסט הבקשה של `input()` לא מוצג והקלט לא מוצג בחזרה, ולכן רק מה שאתם מדפיסים נחשב — כל ניסוח של הבקשה מתאים.',
    ),
  ],
  passScore: 0.7,
  hintsAllowed: 1,
  estimatedMinutes: 20,
  pools: [
    // 1. = versus == (l11)
    {
      variants: [
        choice(
          'm3-t-q1-a',
          ['Which line asks whether `x` is equal to 10, without changing `x`?', 'איזו שורה שואלת אם `x` שווה ל-10, בלי לשנות את `x`?'],
          [
            opt('`x == 10`', '`x == 10`', {
              correct: true,
              feedback: ['Right. Two equals signs compare and give True or False.', 'נכון. שני סימני שווה משווים ומחזירים True או False.'],
            }),
            opt('`x = 10`', '`x = 10`', {
              feedback: ['A single = stores 10 in x. It asks nothing.', 'סימן = יחיד שומר 10 בתוך x. הוא לא שואל כלום.'],
            }),
            opt('`x != 10`', '`x != 10`', {
              feedback: ['!= asks the opposite question: is x different from 10?', '!= שואל את השאלה ההפוכה: האם x שונה מ-10?'],
            }),
            opt('`x = = 10`', '`x = = 10`', {
              feedback: ['With a space between them, the two signs are not one operator; this is a SyntaxError.', 'עם רווח ביניהם, שני הסימנים אינם אופרטור אחד; זו שגיאת SyntaxError.'],
            }),
          ],
          ['equality', 'comparison'],
        ),
        choice(
          'm3-t-q1-b',
          ['`x` holds 7. What does `print(x == 7)` print?', '`x` מחזיק 7. מה `print(x == 7)` מדפיס?'],
          [
            opt('`True`', '`True`', {
              correct: true,
              feedback: ['Correct. The comparison is a question, and its answer is the boolean True.', 'נכון. ההשוואה היא שאלה, והתשובה שלה היא הערך הבוליאני True.'],
            }),
            opt('`7`', '`7`', {
              feedback: ['print shows the result of the comparison, not the value of x.', 'print מציג את תוצאת ההשוואה, לא את הערך של x.'],
            }),
            opt('`False`', '`False`', {
              feedback: ['x is 7, so "is x equal to 7?" is answered True.', 'x הוא 7, ולכן התשובה ל"האם x שווה ל-7?" היא True.'],
            }),
            opt('`x == 7`', '`x == 7`', {
              feedback: ['There are no quotes, so Python evaluates the comparison instead of printing the text.', 'אין מירכאות, ולכן פייתון מחשב את ההשוואה במקום להדפיס את הטקסט.'],
            }),
          ],
          ['equality', 'boolean'],
        ),
      ],
    },
    // 2. indentation, colon and blocks (l12)
    {
      variants: [
        choice(
          'm3-t-q2-a',
          ['Why must the lines under `if age >= 18:` be indented?', 'למה השורות שמתחת ל-`if age >= 18:` חייבות להיות מוזחות?'],
          [
            opt('The indentation tells Python which lines belong to the if block.', 'ההזחה אומרת לפייתון אילו שורות שייכות לבלוק של ה-if.', {
              correct: true,
              feedback: ['Yes. Python reads the indentation to find the block; without it you get an IndentationError.', 'כן. פייתון קורא את ההזחה כדי למצוא את הבלוק; בלעדיה מתקבלת שגיאת IndentationError.'],
            }),
            opt('Indentation is optional; it only makes the code prettier.', 'ההזחה אופציונלית; היא רק הופכת את הקוד ליפה יותר.', {
              feedback: ['In Python the indentation is part of the meaning of the program, not decoration.', 'בפייתון ההזחה היא חלק ממשמעות התוכנית, לא קישוט.'],
            }),
            opt('Indented lines run twice.', 'שורות מוזחות רצות פעמיים.', {
              feedback: ['Indented lines run once, and only when the condition is True.', 'שורות מוזחות רצות פעם אחת, ורק כשהתנאי מתקיים.'],
            }),
            opt('The spaces appear in the output.', 'הרווחים מופיעים בפלט.', {
              feedback: ['Indentation is part of the code layout and never appears in the output.', 'ההזחה היא חלק ממבנה הקוד ואף פעם לא מופיעה בפלט.'],
            }),
          ],
          ['indentation', 'block'],
        ),
        choice(
          'm3-t-q2-b',
          ['What does the colon at the end of `if age >= 18:` mean?', 'מה משמעות הנקודתיים בסוף `if age >= 18:`?'],
          [
            opt('An indented block of lines belongs to this if and follows on the next lines.', 'בלוק מוזח של שורות שייך ל-if הזה ומגיע בשורות הבאות.', {
              correct: true,
              feedback: ['Correct. The colon announces the block; the next lines are indented.', 'נכון. הנקודתיים מכריזות על הבלוק; השורות הבאות מוזחות.'],
            }),
            opt('Print the result of the condition.', 'להדפיס את תוצאת התנאי.', {
              feedback: ['Nothing is printed by an if line. Only print shows something.', 'שורת if לא מדפיסה כלום. רק print מציג משהו.'],
            }),
            opt('The colon is optional decoration.', 'הנקודתיים הן קישוט אופציונלי.', {
              feedback: ['Leaving it out is a SyntaxError: expected \':\'.', 'השמטתן היא שגיאת SyntaxError: expected \':\'.'],
            }),
            opt('It ends the program.', 'הן מסיימות את התוכנית.', {
              feedback: ['The program continues; the colon just opens the block.', 'התוכנית ממשיכה; הנקודתיים רק פותחות את הבלוק.'],
            }),
          ],
          ['if', 'block'],
        ),
      ],
    },
    // 3. elif behaviour and logical words (l13, l14)
    {
      variants: [
        choice(
          'm3-t-q3-a',
          ['In an `if` / `elif` / `elif` / `else` chain, the `if` condition and the first `elif` condition are both True. What runs?', 'בשרשרת `if` / `elif` / `elif` / `else`, התנאי של ה-`if` והתנאי של ה-`elif` הראשון שניהם True. מה רץ?'],
          [
            opt('Only the if block.', 'רק הבלוק של ה-if.', {
              correct: true,
              feedback: ['Right. After the first true condition the rest of the chain is skipped, even if later conditions are also true.', 'נכון. אחרי התנאי הראשון שמתקיים מדלגים על שאר השרשרת, גם אם תנאים מאוחרים יותר מתקיימים.'],
            }),
            opt('Both the if block and the first elif block.', 'גם הבלוק של ה-if וגם הבלוק של ה-elif הראשון.', {
              feedback: ['That would happen with two separate if statements. A chain runs at most one block.', 'זה היה קורה עם שני משפטי if נפרדים. שרשרת מריצה לכל היותר בלוק אחד.'],
            }),
            opt('Only the first elif block.', 'רק הבלוק של ה-elif הראשון.', {
              feedback: ['The elif is checked only when the if condition was False.', 'ה-elif נבדק רק כשהתנאי של ה-if היה False.'],
            }),
            opt('The else block.', 'הבלוק של ה-else.', {
              feedback: ['else runs only when every condition above it was False.', 'else רץ רק כשכל התנאים שמעליו היו False.'],
            }),
          ],
          ['elif', 'condition-order'],
        ),
        choice(
          'm3-t-q3-b',
          ['`n` holds 15. Which condition is True?', '`n` מחזיק 15. איזה תנאי הוא True?'],
          [
            opt('`n > 10 and n < 20`', '`n > 10 and n < 20`', {
              correct: true,
              feedback: ['Correct. 15 is greater than 10 and less than 20, so both sides are True.', 'נכון. 15 גדול מ-10 וקטן מ-20, ולכן שני הצדדים True.'],
            }),
            opt('`n > 10 and n > 20`', '`n > 10 and n > 20`', {
              feedback: ['15 > 20 is False, and and needs both sides to be True.', '15 > 20 הוא False, ו-and צריך ששני הצדדים יהיו True.'],
            }),
            opt('`n < 10 or n > 20`', '`n < 10 or n > 20`', {
              feedback: ['Both sides are False, so even or gives False.', 'שני הצדדים False, ולכן גם or מחזיר False.'],
            }),
            opt('`not n > 10`', '`not n > 10`', {
              feedback: ['n > 10 is True, and not flips it to False.', 'n > 10 הוא True, ו-not הופך אותו ל-False.'],
            }),
          ],
          ['and', 'or', 'not'],
        ),
      ],
    },
    // 4. predict comparisons (l11)
    {
      variants: [
        predictQ(
          'm3-t-q4-a',
          py`
            a = 4
            b = 9
            print(a < b)
            print(a * 2 == 8)
            print(a != 4)
          `,
          'True\nTrue\nFalse',
          [
            '4 < 9 is True. a * 2 is 8, so the second line is True. a is 4, so "a is not 4" is False.',
            '4 < 9 הוא True. a * 2 הוא 8, ולכן השורה השנייה היא True. a הוא 4, ולכן "a שונה מ-4" הוא False.',
          ],
          ['comparison', 'equality', 'boolean'],
          { prompt: ['What does this program print? (three lines)', 'מה התוכנית הזאת מדפיסה? (שלוש שורות)'] },
        ),
        predictQ(
          'm3-t-q4-b',
          py`
            word = "Python"
            print(word == "python")
            print(len(word) > 5)
            print(word.lower() == "python")
          `,
          'False\nTrue\nTrue',
          [
            'The capital P makes the first comparison False. The word has 6 letters, and 6 > 5 is True. After lower() the letters match, so the last line is True.',
            'ה-P הגדולה הופכת את ההשוואה הראשונה ל-False. במילה יש 6 אותיות, ו-6 > 5 הוא True. אחרי lower() האותיות מתאימות, ולכן השורה האחרונה היא True.',
          ],
          ['comparison', 'equality', 'boolean'],
          { prompt: ['What does this program print? (three lines)', 'מה התוכנית הזאת מדפיסה? (שלוש שורות)'] },
        ),
      ],
    },
    // 5. predict if / elif chains (l12, l13)
    {
      variants: [
        predictQ(
          'm3-t-q5-a',
          py`
            temperature = 22
            if temperature >= 30:
                print("Hot")
            elif temperature >= 20:
                print("Warm")
            else:
                print("Cold")
            print("Bye")
          `,
          'Warm\nBye',
          [
            '22 >= 30 is False, 22 >= 20 is True, so Warm prints and the else is skipped. The last print is not indented, so it always runs.',
            '22 >= 30 הוא False, 22 >= 20 הוא True, ולכן Warm מודפס ומדלגים על ה-else. ההדפסה האחרונה אינה מוזחת, ולכן היא תמיד רצה.',
          ],
          ['elif', 'else', 'block'],
          { prompt: ['What does this program print? (two lines)', 'מה התוכנית הזאת מדפיסה? (שתי שורות)'] },
        ),
        predictQ(
          'm3-t-q5-b',
          py`
            n = 12
            if n > 20:
                print("big")
            elif n > 10:
                print("medium")
            elif n > 5:
                print("small")
            print("end")
          `,
          'medium\nend',
          [
            '12 > 20 is False. 12 > 10 is True, so medium prints and the second elif is never checked, even though 12 > 5 is also True. Then the unindented print runs.',
            '12 > 20 הוא False. 12 > 10 הוא True, ולכן medium מודפס וה-elif השני בכלל לא נבדק, למרות ש-12 > 5 הוא גם True. אחר כך ההדפסה הלא מוזחת רצה.',
          ],
          ['elif', 'condition-order', 'block'],
          { prompt: ['What does this program print? (two lines)', 'מה התוכנית הזאת מדפיסה? (שתי שורות)'] },
        ),
      ],
    },
    // 6. predict and / or / not (l14)
    {
      variants: [
        predictQ(
          'm3-t-q6-a',
          py`
            x = 8
            print(x > 5 and x < 10)
            print(x > 5 and x > 10)
            print(not x == 8)
          `,
          'True\nFalse\nFalse',
          [
            'Both parts of the first and are True. In the second, x > 10 is False, so and gives False. x == 8 is True and not flips it to False.',
            'שני החלקים של ה-and הראשון True. בשני, x > 10 הוא False, ולכן and מחזיר False. x == 8 הוא True ו-not הופך אותו ל-False.',
          ],
          ['and', 'not', 'boolean'],
          { prompt: ['What does this program print? (three lines)', 'מה התוכנית הזאת מדפיסה? (שלוש שורות)'] },
        ),
        predictQ(
          'm3-t-q6-b',
          py`
            x = 3
            print(x < 0 or x > 2)
            print(1 <= x <= 3)
            print(not x < 0)
          `,
          'True\nTrue\nTrue',
          [
            'x > 2 is True, and one True side is enough for or. 3 is between 1 and 3 (inclusive). x < 0 is False and not flips it to True.',
            'x > 2 הוא True, וצד אחד True מספיק ל-or. 3 נמצא בין 1 ל-3 (כולל). x < 0 הוא False ו-not הופך אותו ל-True.',
          ],
          ['or', 'not', 'comparison'],
          { prompt: ['What does this program print? (three lines)', 'מה התוכנית הזאת מדפיסה? (שלוש שורות)'] },
        ),
      ],
    },
    // 7. code: sort a number into a category (l13)
    {
      variants: [
        codeQ({
          id: 'm3-t-q7-a',
          title: ['Temperature category', 'קטגוריית טמפרטורה'],
          mode: 'write',
          instructions: [
            p(
              'Ask for a temperature as a whole number (any prompt text) and print exactly one word: `Freezing` if it is below 0, `Cold` from 0 up to 14, `Nice` from 15 up to 24, and `Hot` for 25 and above.',
              'בקשו טמפרטורה כמספר שלם (טקסט הבקשה חופשי) והדפיסו בדיוק מילה אחת: `Freezing` אם היא מתחת ל-0, `Cold` מ-0 עד 14, `Nice` מ-15 עד 24, ו-`Hot` עבור 25 ומעלה.',
            ),
          ],
          starterCode: py`
            temperature = int(input("Temperature: "))
            # print Freezing, Cold, Nice or Hot

          `,
          sampleStdin: ['18'],
          check: {
            tests: [
              outputTest('Freezing', { stdin: ['-5'] }),
              outputTest('Cold', { stdin: ['0'] }),
              outputTest('Cold', { stdin: ['14'] }),
              outputTest('Nice', { stdin: ['15'] }),
              outputTest('Nice', { stdin: ['24'] }),
              outputTest('Hot', { stdin: ['25'] }),
              outputTest('Hot', { stdin: ['40'] }),
            ],
          },
          hints: [
            ['Four outcomes: if, two elifs, and an else. With "less than" conditions, start from the smallest limit.', 'ארבע תוצאות: if, שני elif ו-else. בתנאים מסוג "קטן מ-", התחילו מהגבול הקטן ביותר.'],
            ['`if temperature < 0:` Freezing, `elif temperature < 15:` Cold, `elif temperature < 25:` Nice, `else:` Hot.', 'כתבו `if temperature < 0:` עבור Freezing, `elif temperature < 15:` עבור Cold, `elif temperature < 25:` עבור Nice, ו-`else:` עבור Hot.'],
            ['Each branch has one indented print with the exact word.', 'בכל ענף יש הדפסה מוזחת אחת עם המילה המדויקת.'],
          ],
          solution: py`
            temperature = int(input("Temperature: "))
            if temperature < 0:
                print("Freezing")
            elif temperature < 15:
                print("Cold")
            elif temperature < 25:
                print("Nice")
            else:
                print("Hot")
          `,
          concepts: ['elif', 'condition-order', 'if', 'else'],
        }),
        codeQ({
          id: 'm3-t-q7-b',
          title: ['Age category', 'קטגוריית גיל'],
          mode: 'write',
          instructions: [
            p(
              'Ask for an age as a whole number (any prompt text) and print exactly one word: `Child` for ages below 13, `Teen` from 13 up to 17, `Adult` from 18 up to 64, and `Senior` for 65 and above.',
              'בקשו גיל כמספר שלם (טקסט הבקשה חופשי) והדפיסו בדיוק מילה אחת: `Child` לגילאים מתחת ל-13, `Teen` מ-13 עד 17, `Adult` מ-18 עד 64, ו-`Senior` עבור 65 ומעלה.',
            ),
          ],
          starterCode: py`
            age = int(input("Age: "))
            # print Child, Teen, Adult or Senior

          `,
          sampleStdin: ['15'],
          check: {
            tests: [
              outputTest('Child', { stdin: ['5'] }),
              outputTest('Child', { stdin: ['12'] }),
              outputTest('Teen', { stdin: ['13'] }),
              outputTest('Teen', { stdin: ['17'] }),
              outputTest('Adult', { stdin: ['18'] }),
              outputTest('Adult', { stdin: ['64'] }),
              outputTest('Senior', { stdin: ['65'] }),
              outputTest('Senior', { stdin: ['90'] }),
            ],
          },
          hints: [
            ['Four outcomes: if, two elifs, and an else. With "less than" conditions, start from the smallest limit.', 'ארבע תוצאות: if, שני elif ו-else. בתנאים מסוג "קטן מ-", התחילו מהגבול הקטן ביותר.'],
            ['`if age < 13:` Child, `elif age < 18:` Teen, `elif age < 65:` Adult, `else:` Senior.', 'כתבו `if age < 13:` עבור Child, `elif age < 18:` עבור Teen, `elif age < 65:` עבור Adult, ו-`else:` עבור Senior.'],
            ['Each branch has one indented print with the exact word.', 'בכל ענף יש הדפסה מוזחת אחת עם המילה המדויקת.'],
          ],
          solution: py`
            age = int(input("Age: "))
            if age < 13:
                print("Child")
            elif age < 18:
                print("Teen")
            elif age < 65:
                print("Adult")
            else:
                print("Senior")
          `,
          concepts: ['elif', 'condition-order', 'if', 'else'],
        }),
      ],
    },
    // 8. code: compare two numbers (l12, l13)
    {
      variants: [
        codeQ({
          id: 'm3-t-q8-a',
          title: ['The larger number', 'המספר הגדול יותר'],
          mode: 'write',
          instructions: [
            p(
              'Ask for two whole numbers, one per `input()` (any prompt text). Print the larger of the two. If they are equal, print `Equal` instead.',
              'בקשו שני מספרים שלמים, אחד בכל `input()` (טקסט הבקשה חופשי). הדפיסו את הגדול מבין השניים. אם הם שווים, הדפיסו `Equal` במקום.',
            ),
          ],
          starterCode: py`
            a = int(input("First number: "))
            b = int(input("Second number: "))
            # print the larger number, or Equal

          `,
          sampleStdin: ['3', '8'],
          check: {
            tests: [
              outputTest('8', { stdin: ['3', '8'] }),
              outputTest('10', { stdin: ['10', '2'] }),
              outputTest('Equal', { stdin: ['5', '5'] }),
              outputTest('-4', { stdin: ['-4', '-9'] }),
            ],
          },
          hints: [
            ['Three cases: a is bigger, b is bigger, or they are equal — an if / elif / else chain.', 'שלושה מקרים: a גדול יותר, b גדול יותר, או שהם שווים — שרשרת if / elif / else.'],
            ['`if a > b:` print a, `elif b > a:` print b, `else:` print Equal.', '`if a > b:` הדפיסו a, `elif b > a:` הדפיסו b, `else:` הדפיסו Equal.'],
            ['Print the variable itself, without quotes: `print(a)`.', 'הדפיסו את המשתנה עצמו, בלי מירכאות: `print(a)`.'],
          ],
          solution: py`
            a = int(input("First number: "))
            b = int(input("Second number: "))
            if a > b:
                print(a)
            elif b > a:
                print(b)
            else:
                print("Equal")
          `,
          concepts: ['if', 'elif', 'else', 'comparison'],
        }),
        codeQ({
          id: 'm3-t-q8-b',
          title: ['The smaller number', 'המספר הקטן יותר'],
          mode: 'write',
          instructions: [
            p(
              'Ask for two whole numbers, one per `input()` (any prompt text). Print the smaller of the two. If they are equal, print `Equal` instead.',
              'בקשו שני מספרים שלמים, אחד בכל `input()` (טקסט הבקשה חופשי). הדפיסו את הקטן מבין השניים. אם הם שווים, הדפיסו `Equal` במקום.',
            ),
          ],
          starterCode: py`
            a = int(input("First number: "))
            b = int(input("Second number: "))
            # print the smaller number, or Equal

          `,
          sampleStdin: ['3', '8'],
          check: {
            tests: [
              outputTest('3', { stdin: ['3', '8'] }),
              outputTest('2', { stdin: ['10', '2'] }),
              outputTest('Equal', { stdin: ['7', '7'] }),
              outputTest('-9', { stdin: ['-4', '-9'] }),
            ],
          },
          hints: [
            ['Three cases: a is smaller, b is smaller, or they are equal — an if / elif / else chain.', 'שלושה מקרים: a קטן יותר, b קטן יותר, או שהם שווים — שרשרת if / elif / else.'],
            ['`if a < b:` print a, `elif b < a:` print b, `else:` print Equal.', '`if a < b:` הדפיסו a, `elif b < a:` הדפיסו b, `else:` הדפיסו Equal.'],
            ['Print the variable itself, without quotes: `print(a)`.', 'הדפיסו את המשתנה עצמו, בלי מירכאות: `print(a)`.'],
          ],
          solution: py`
            a = int(input("First number: "))
            b = int(input("Second number: "))
            if a < b:
                print(a)
            elif b < a:
                print(b)
            else:
                print("Equal")
          `,
          concepts: ['if', 'elif', 'else', 'comparison'],
        }),
      ],
    },
    // 9. code: combined conditions (l14)
    {
      variants: [
        codeQ({
          id: 'm3-t-q9-a',
          title: ['Club entry', 'כניסה למועדון'],
          mode: 'write',
          instructions: [
            p(
              'Ask for an age (a whole number) and then whether the person is a member (`yes` or `no`) — two `input()` calls, any prompt text. Print `Welcome` only if the age is at least 18 **and** the answer is exactly `yes`. In every other case print `No entry`.',
              'בקשו גיל (מספר שלם) ואחר כך האם האדם חבר מועדון (`yes` או `no`) — שתי קריאות `input()`, טקסט הבקשה חופשי. הדפיסו `Welcome` רק אם הגיל הוא לפחות 18 **וגם** התשובה היא בדיוק `yes`. בכל מקרה אחר הדפיסו `No entry`.',
            ),
          ],
          starterCode: py`
            age = int(input("Age: "))
            member = input("Member (yes/no): ")
            # print Welcome or No entry

          `,
          sampleStdin: ['20', 'yes'],
          check: {
            tests: [
              outputTest('Welcome', { stdin: ['20', 'yes'] }),
              outputTest('No entry', { stdin: ['20', 'no'] }),
              outputTest('No entry', { stdin: ['15', 'yes'] }),
              outputTest('Welcome', { stdin: ['18', 'yes'] }),
            ],
          },
          hints: [
            ['Both things must be true at once, so combine the two comparisons with `and`.', 'שני הדברים חייבים להתקיים בו-זמנית, ולכן שלבו את שתי ההשוואות בעזרת `and`.'],
            ['`if age >= 18 and member == "yes":` then print Welcome.', '`if age >= 18 and member == "yes":` ואז הדפיסו Welcome.'],
            ['Add `else:` with `print("No entry")`.', 'הוסיפו `else:` עם `print("No entry")`.'],
          ],
          solution: py`
            age = int(input("Age: "))
            member = input("Member (yes/no): ")
            if age >= 18 and member == "yes":
                print("Welcome")
            else:
                print("No entry")
          `,
          concepts: ['and', 'if', 'else', 'equality'],
        }),
        codeQ({
          id: 'm3-t-q9-b',
          title: ['In range?', 'בטווח?'],
          mode: 'write',
          instructions: [
            p(
              'Ask for a whole number (any prompt text). Print `In range` if the number is between 1 and 100, including both 1 and 100. Otherwise print `Out of range`.',
              'בקשו מספר שלם (טקסט הבקשה חופשי). הדפיסו `In range` אם המספר נמצא בין 1 ל-100, כולל 1 ו-100 עצמם. אחרת הדפיסו `Out of range`.',
            ),
          ],
          starterCode: py`
            n = int(input("Number: "))
            # print In range or Out of range

          `,
          sampleStdin: ['50'],
          check: {
            tests: [
              outputTest('In range', { stdin: ['1'] }),
              outputTest('In range', { stdin: ['100'] }),
              outputTest('In range', { stdin: ['50'] }),
              outputTest('Out of range', { stdin: ['0'] }),
              outputTest('Out of range', { stdin: ['101'] }),
              outputTest('Out of range', { stdin: ['-5'] }),
            ],
          },
          hints: [
            ['"Between 1 and 100" is two conditions that must both be true: at least 1 and at most 100.', '"בין 1 ל-100" הם שני תנאים שחייבים להתקיים יחד: לפחות 1 ולכל היותר 100.'],
            ['Write `if n >= 1 and n <= 100:` or the shorter `if 1 <= n <= 100:`.', 'כתבו `if n >= 1 and n <= 100:` או את הצורה הקצרה `if 1 <= n <= 100:`.'],
            ['Print In range in the if block and Out of range in the else block.', 'הדפיסו In range בבלוק של ה-if ו-Out of range בבלוק של ה-else.'],
          ],
          solution: py`
            n = int(input("Number: "))
            if 1 <= n <= 100:
                print("In range")
            else:
                print("Out of range")
          `,
          concepts: ['and', 'comparison', 'if', 'else'],
        }),
      ],
    },
  ],
};
