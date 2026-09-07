import type { Assessment } from '../../schema';
import { p, t, opt, choice, predictQ, codeQ, outputTest, requires, py } from '../../authoring';

export const test: Assessment = {
  id: 'm4-test',
  kind: 'module-test',
  moduleId: 'm4',
  title: t('Module 4 test: loops', 'מבחן מודול 4: לולאות'),
  description: [
    p(
      'This test covers while and for loops, range(), accumulators, break and continue, nested loops and modules. It mixes questions, output predictions and three small programs. You may use one hint per coding task.',
      'המבחן הזה מכסה לולאות while ו-for, `range()`, צוברים, break ו-continue, לולאות מקוננות ומודולים. הוא משלב שאלות, חיזוי פלט ושלוש תוכניות קטנות. מותר להשתמש ברמז אחד לכל משימת קוד.',
    ),
  ],
  passScore: 0.7,
  hintsAllowed: 1,
  estimatedMinutes: 25,
  pools: [
    /* ---------------------------------------------------- 1. while (choice) */
    {
      variants: [
        choice(
          'm4-t-q1-a',
          ['When does a while loop check its condition?', 'מתי לולאת while בודקת את התנאי שלה?'],
          [
            opt('Before every round, including the first.', 'לפני כל סיבוב, כולל הראשון.', {
              correct: true,
              feedback: ['Right. If the condition is False at the very start, the block never runs.', 'נכון. אם התנאי הוא False כבר בהתחלה, הבלוק לא רץ בכלל.'],
            }),
            opt('Only once, before the loop starts.', 'רק פעם אחת, לפני שהלולאה מתחילה.', {
              feedback: ['It is checked again after every round; that is how the loop knows when to stop.', 'הוא נבדק שוב אחרי כל סיבוב; כך הלולאה יודעת מתי לעצור.'],
            }),
            opt('Only after the block has run at least once.', 'רק אחרי שהבלוק רץ לפחות פעם אחת.', {
              feedback: ['The condition comes first. A False condition at the start means zero rounds.', 'התנאי בא קודם. תנאי False בהתחלה פירושו אפס סיבובים.'],
            }),
          ],
          ['while', 'loop-condition'],
        ),
        choice(
          'm4-t-q1-b',
          ['What is an infinite loop?', 'מהי לולאה אינסופית?'],
          [
            opt('A loop whose condition never becomes False, so it never ends on its own.', 'לולאה שהתנאי שלה אף פעם לא הופך ל-False, ולכן היא אף פעם לא מסתיימת בעצמה.', {
              correct: true,
              feedback: ['Correct. Usually the counter was never changed inside the block.', 'נכון. בדרך כלל המונה לא שונה בתוך הבלוק.'],
            }),
            opt('A loop that uses range with a very large number.', 'לולאה שמשתמשת ב-range עם מספר גדול מאוד.', {
              feedback: ['That loop is long but it ends. Infinite means it can never end.', 'הלולאה הזאת ארוכה אבל היא מסתיימת. אינסופית פירושה שהיא לא יכולה להסתיים לעולם.'],
            }),
            opt('A loop that contains an error.', 'לולאה שמכילה שגיאה.', {
              feedback: ['An error stops the program. An infinite loop is valid code that keeps running.', 'שגיאה עוצרת את התוכנית. לולאה אינסופית היא קוד תקין שממשיך לרוץ.'],
            }),
          ],
          ['infinite-loop', 'counter'],
        ),
      ],
    },
    /* ---------------------------------------------------- 2. while (predict) */
    {
      variants: [
        predictQ(
          'm4-t-q2-a',
          py`
            n = 5
            while n > 0:
                n = n - 2
            print(n)
          `,
          '-1',
          ['n goes 5, 3, 1, -1. When n is -1 the condition -1 > 0 is False, so the loop stops and -1 is printed.', 'n עובר דרך 5, 3, 1, -1. כש-n הוא -1 התנאי -1 > 0 הוא False, ולכן הלולאה נעצרת ו-1- מודפס.'],
          ['while', 'loop-condition'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
        predictQ(
          'm4-t-q2-b',
          py`
            x = 2
            while x < 50:
                x = x * x
            print(x)
          `,
          '256',
          ['x goes 2, 4, 16, 256. 16 is still under 50, so one more round runs and x becomes 256, which ends the loop.', 'x עובר דרך 2, 4, 16, 256. 16 עדיין קטן מ-50, ולכן רץ עוד סיבוב ו-x הופך ל-256, וזה מסיים את הלולאה.'],
          ['while', 'loop-condition'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
      ],
    },
    /* ---------------------------------------------------- 3. range (choice) */
    {
      variants: [
        choice(
          'm4-t-q3-a',
          ['Which range produces exactly 1, 2, 3, 4, 5?', 'איזה range מייצר בדיוק 1, 2, 3, 4, 5?'],
          [
            opt('`range(1, 6)`', '`range(1, 6)`', {
              correct: true,
              feedback: ['Right. It starts at 1 and stops before 6.', 'נכון. הוא מתחיל ב-1 ועוצר לפני 6.'],
            }),
            opt('`range(1, 5)`', '`range(1, 5)`', {
              feedback: ['The stop value is left out, so this ends at 4.', 'ערך העצירה נשאר בחוץ, ולכן זה מסתיים ב-4.'],
            }),
            opt('`range(5)`', '`range(5)`', {
              feedback: ['With one number range starts at 0: this gives 0 to 4.', 'עם מספר אחד range מתחיל ב-0: זה נותן 0 עד 4.'],
            }),
            opt('`range(0, 5)`', '`range(0, 5)`', {
              feedback: ['This starts at 0 and ends at 4.', 'זה מתחיל ב-0 ומסתיים ב-4.'],
            }),
          ],
          ['range'],
        ),
        choice(
          'm4-t-q3-b',
          ['Which numbers does `range(10, 0, -2)` produce?', 'אילו מספרים `range(10, 0, -2)` מייצר?'],
          [
            opt('10, 8, 6, 4, 2', '10, 8, 6, 4, 2', {
              correct: true,
              feedback: ['Correct. The step -2 counts down, and the stop value 0 is not produced.', 'נכון. הקפיצה 2- סופרת לאחור, וערך העצירה 0 לא מיוצר.'],
            }),
            opt('10, 8, 6, 4, 2, 0', '10, 8, 6, 4, 2, 0', {
              feedback: ['The stop value is never included, even when counting down.', 'ערך העצירה אף פעם לא נכלל, גם כשסופרים לאחור.'],
            }),
            opt('0, 2, 4, 6, 8, 10', '0, 2, 4, 6, 8, 10', {
              feedback: ['The first number is the start, 10, and a negative step goes down.', 'המספר הראשון הוא ההתחלה, 10, וקפיצה שלילית יורדת.'],
            }),
            opt('Nothing: a negative step is an error.', 'כלום: קפיצה שלילית היא שגיאה.', {
              feedback: ['Negative steps are allowed; they are how you count down with range.', 'קפיצות שליליות מותרות; כך סופרים לאחור עם range.'],
            }),
          ],
          ['range', 'for'],
        ),
      ],
    },
    /* ---------------------------------------------------- 4. for (predict) */
    {
      variants: [
        predictQ(
          'm4-t-q4-a',
          py`
            for i in range(1, 10, 4):
                print(i)
          `,
          '1\n5\n9',
          ['Start at 1 and add 4 each time: 1, 5, 9. The next number, 13, is past the stop value 10.', 'מתחילים ב-1 ומוסיפים 4 בכל פעם: 1, 5, 9. המספר הבא, 13, עבר את ערך העצירה 10.'],
          ['for', 'range', 'loop-variable'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
        predictQ(
          'm4-t-q4-b',
          py`
            for i in range(3):
                print(i * 10)
          `,
          '0\n10\n20',
          ['range(3) gives 0, 1, 2. Each is multiplied by 10 before printing.', '`range(3)` נותן 0, 1, 2. כל אחד מוכפל ב-10 לפני ההדפסה.'],
          ['for', 'range', 'loop-variable'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
      ],
    },
    /* ---------------------------------------------------- 5. accumulators, break, continue (choice) */
    {
      variants: [
        choice(
          'm4-t-q5-a',
          ['What does `continue` do inside a loop?', 'מה `continue` עושה בתוך לולאה?'],
          [
            opt('Skips the rest of the current round and goes on to the next round.', 'מדלג על שאר הסיבוב הנוכחי וממשיך לסיבוב הבא.', {
              correct: true,
              feedback: ['Right. The loop itself keeps running.', 'נכון. הלולאה עצמה ממשיכה לרוץ.'],
            }),
            opt('Leaves the loop immediately.', 'יוצא מהלולאה מיד.', {
              feedback: ['That is break. continue only skips one round.', 'זה break. continue רק מדלג על סיבוב אחד.'],
            }),
            opt('Restarts the loop from the first number.', 'מתחיל את הלולאה מחדש מהמספר הראשון.', {
              feedback: ['The loop never goes back; continue moves forward to the next round.', 'הלולאה אף פעם לא חוזרת אחורה; continue מתקדם לסיבוב הבא.'],
            }),
          ],
          ['continue'],
        ),
        choice(
          'm4-t-q5-b',
          ['A program that adds the numbers 1 to 5 writes `total = 0` inside the loop block instead of before the loop. What is printed at the end?', 'תוכנית שמחברת את המספרים 1 עד 5 כותבת `total = 0` בתוך בלוק הלולאה במקום לפני הלולאה. מה מודפס בסוף?'],
          [
            opt('5, because total is reset to 0 in every round and only the last number survives.', '5, כי total מתאפס בכל סיבוב ורק המספר האחרון שורד.', {
              correct: true,
              feedback: ['Correct. The accumulator must be created once, before the loop.', 'נכון. את הצובר צריך ליצור פעם אחת, לפני הלולאה.'],
            }),
            opt('15, the same as before.', '15, בדיוק כמו קודם.', {
              feedback: ['Each round starts again from 0, so the earlier numbers are lost.', 'כל סיבוב מתחיל מחדש מ-0, ולכן המספרים הקודמים אובדים.'],
            }),
            opt('An error, because total is created more than once.', 'שגיאה, כי total נוצר יותר מפעם אחת.', {
              feedback: ['Assigning a variable again is allowed. The program runs; it just gives the wrong answer.', 'השמה חוזרת למשתנה מותרת. התוכנית רצה; היא פשוט נותנת תשובה שגויה.'],
            }),
          ],
          ['accumulator'],
        ),
      ],
    },
    /* ---------------------------------------------------- 6. accumulators / break (predict) */
    {
      variants: [
        predictQ(
          'm4-t-q6-a',
          py`
            total = 0
            for i in range(1, 5):
                if i == 2:
                    continue
                total += i
            print(total)
          `,
          '8',
          ['The loop adds 1, 3 and 4; the round with i = 2 is skipped by continue. 1 + 3 + 4 = 8.', 'הלולאה מוסיפה 1, 3 ו-4; הסיבוב עם i = 2 מדולג בגלל continue. 1 + 3 + 4 = 8.'],
          ['accumulator', 'continue'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
        predictQ(
          'm4-t-q6-b',
          py`
            count = 0
            for n in range(10):
                if n * n > 20:
                    break
                count += 1
            print(count)
          `,
          '5',
          ['For n = 0 to 4 the square is at most 16, so count grows to 5. When n is 5 the square is 25, which is above 20, so break ends the loop.', 'עבור n = 0 עד 4 הריבוע הוא לכל היותר 16, ולכן count גדל ל-5. כש-n הוא 5 הריבוע הוא 25, מעל 20, ולכן break מסיים את הלולאה.'],
          ['accumulator', 'break'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
      ],
    },
    /* ---------------------------------------------------- 7. nested loops (predict) */
    {
      variants: [
        predictQ(
          'm4-t-q7-a',
          py`
            for row in range(1, 4):
                print("#" * row)
          `,
          '#\n##\n###',
          ['Row 1 prints one #, row 2 prints two, row 3 prints three: string repetition with the row number.', 'שורה 1 מדפיסה # אחד, שורה 2 מדפיסה שניים, שורה 3 מדפיסה שלושה: שכפול מחרוזת עם מספר השורה.'],
          ['string-repeat', 'for'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
        predictQ(
          'm4-t-q7-b',
          py`
            for i in range(2):
                for j in range(2):
                    print(i, j)
          `,
          '0 0\n0 1\n1 0\n1 1',
          ['For i = 0 the inner loop prints 0 0 and 0 1; then for i = 1 it prints 1 0 and 1 1. The inner loop runs fully for every outer round.', 'עבור i = 0 הלולאה הפנימית מדפיסה 0 0 ו-0 1; ואז עבור i = 1 היא מדפיסה 1 0 ו-1 1. הלולאה הפנימית רצה במלואה עבור כל סיבוב חיצוני.'],
          ['nested-loop'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
      ],
    },
    /* ---------------------------------------------------- 8. modules (choice) */
    {
      variants: [
        choice(
          'm4-t-q8-a',
          ['Which values can `random.randint(1, 4)` return?', 'אילו ערכים `random.randint(1, 4)` יכול להחזיר?'],
          [
            opt('1, 2, 3 or 4', '1, 2, 3 או 4', {
              correct: true,
              feedback: ['Right. randint includes both ends.', 'נכון. randint כולל את שני הקצוות.'],
            }),
            opt('1, 2 or 3', '1, 2 או 3', {
              feedback: ['That is how range behaves; randint includes the last value as well.', 'כך range מתנהג; randint כולל גם את הערך האחרון.'],
            }),
            opt('0, 1, 2, 3 or 4', '0, 1, 2, 3 או 4', {
              feedback: ['The smallest possible result is the first number, 1.', 'התוצאה הקטנה ביותר האפשרית היא המספר הראשון, 1.'],
            }),
            opt('Any decimal between 1 and 4', 'כל מספר עשרוני בין 1 ל-4', {
              feedback: ['randint gives whole numbers only.', 'randint נותן מספרים שלמים בלבד.'],
            }),
          ],
          ['random-randint'],
        ),
        choice(
          'm4-t-q8-b',
          ['What must appear in a program before `math.sqrt(9)` can work?', 'מה חייב להופיע בתוכנית לפני ש-`math.sqrt(9)` יכול לעבוד?'],
          [
            opt('The line `import math`', 'השורה `import math`', {
              correct: true,
              feedback: ['Correct. The module is loaded by import, and then its tools are reached with a dot.', 'נכון. המודול נטען עם import, ואז מגיעים לכלים שלו עם נקודה.'],
            }),
            opt('The line `import sqrt`', 'השורה `import sqrt`', {
              feedback: ['sqrt is a tool inside the math module, not a module of its own.', 'sqrt הוא כלי בתוך המודול math, לא מודול בפני עצמו.'],
            }),
            opt('Nothing; math is always available.', 'כלום; math תמיד זמין.', {
              feedback: ['Without the import, Python raises a NameError for the name math.', 'בלי ה-import, פייתון זורק NameError עבור השם math.'],
            }),
          ],
          ['import', 'math-module'],
        ),
      ],
    },
    /* ---------------------------------------------------- 9. code: counting */
    {
      variants: [
        codeQ({
          id: 'm4-t-q9-a',
          title: ['Count up', 'ספירה עולה'],
          mode: 'write',
          instructions: [
            p(
              'Read a whole number n (any prompt text) and print the numbers from 1 to n, one per line. For 4 the output is `1`, `2`, `3`, `4`.',
              'קראו מספר שלם n (טקסט הבקשה חופשי) והדפיסו את המספרים מ-1 עד n, אחד בכל שורה. עבור 4 הפלט הוא `1`, `2`, `3`, `4`.',
            ),
          ],
          starterCode: py`
            n = int(input("n: "))
            # print 1 to n

          `,
          sampleStdin: ['4'],
          check: {
            tests: [
              outputTest('1\n2\n3\n4', { stdin: ['4'] }),
              outputTest('1', { stdin: ['1'] }),
              outputTest('1\n2\n3\n4\n5\n6\n7', { stdin: ['7'] }),
            ],
            requires: [requires('\\b(for|while)\\b', 'Use a loop.', 'השתמשו בלולאה.')],
          },
          hints: [
            ['A for loop with range is the shortest way. Remember that the stop value is not included.', 'לולאת for עם range היא הדרך הקצרה ביותר. זכרו שערך העצירה לא נכלל.'],
            ['`range(1, n + 1)` produces 1 up to n.', '`range(1, n + 1)` מייצר מ-1 עד n.'],
            ['`for i in range(1, n + 1):` then `print(i)`.', '`for i in range(1, n + 1):` ואז `print(i)`.'],
          ],
          solution: py`
            n = int(input("n: "))
            for i in range(1, n + 1):
                print(i)
          `,
          concepts: ['for', 'range', 'input'],
        }),
        codeQ({
          id: 'm4-t-q9-b',
          title: ['Count down', 'ספירה לאחור'],
          mode: 'write',
          instructions: [
            p(
              'Read a whole number n (any prompt text) and print the numbers from n down to 1, one per line, followed by the word `Go`. For 3 the output is `3`, `2`, `1`, `Go`.',
              'קראו מספר שלם n (טקסט הבקשה חופשי) והדפיסו את המספרים מ-n עד 1 בסדר יורד, אחד בכל שורה, ואחריהם המילה `Go`. עבור 3 הפלט הוא `3`, `2`, `1`, `Go`.',
            ),
          ],
          starterCode: py`
            n = int(input("n: "))
            # print n down to 1, then Go

          `,
          sampleStdin: ['3'],
          check: {
            tests: [
              outputTest('3\n2\n1\nGo', { stdin: ['3'] }),
              outputTest('1\nGo', { stdin: ['1'] }),
              outputTest('5\n4\n3\n2\n1\nGo', { stdin: ['5'] }),
            ],
            requires: [requires('\\b(for|while)\\b', 'Use a loop.', 'השתמשו בלולאה.')],
          },
          hints: [
            ['Either a while loop that subtracts 1 each round, or a for loop with a negative step.', 'או לולאת while שמחסירה 1 בכל סיבוב, או לולאת for עם קפיצה שלילית.'],
            ['`range(n, 0, -1)` produces n down to 1.', '`range(n, 0, -1)` מייצר מ-n עד 1.'],
            ['`for i in range(n, 0, -1):` then `print(i)`, and `print("Go")` after the loop.', '`for i in range(n, 0, -1):` ואז `print(i)`, ו-`print("Go")` אחרי הלולאה.'],
          ],
          solution: py`
            n = int(input("n: "))
            for i in range(n, 0, -1):
                print(i)
            print("Go")
          `,
          concepts: ['for', 'range', 'input'],
        }),
      ],
    },
    /* ---------------------------------------------------- 10. code: accumulate until 0 */
    {
      variants: [
        codeQ({
          id: 'm4-t-q10-a',
          title: ['Total until zero', 'סכום עד אפס'],
          mode: 'write',
          instructions: [
            p(
              'Read whole numbers (any prompt text) until the user types 0. Then print exactly `Total:` followed by a space and the sum of the numbers before the 0. For 4, 6, 0 the output is `Total: 10`; if the first number is 0 the output is `Total: 0`.',
              'קראו מספרים שלמים (טקסט הבקשה חופשי) עד שהמשתמש מקליד 0. אחר כך הדפיסו בדיוק `Total:` ואחריו רווח והסכום של המספרים שלפני ה-0. עבור 4, 6, 0 הפלט הוא `Total: 10`; אם המספר הראשון הוא 0 הפלט הוא `Total: 0`.',
            ),
          ],
          starterCode: py`
            total = 0
            # read numbers until 0 and add them up

          `,
          sampleStdin: ['4', '6', '0'],
          check: {
            tests: [
              outputTest('Total: 10', { stdin: ['4', '6', '0'] }),
              outputTest('Total: 0', { stdin: ['0'] }),
              outputTest('Total: 10', { stdin: ['1', '2', '3', '4', '0'] }),
            ],
            requires: [requires('\\bwhile\\b', 'Use a while loop.', 'השתמשו בלולאת while.')],
          },
          hints: [
            ['Use `while True:` and break when the number is 0, or read the first number before the loop and loop while it is not 0.', 'השתמשו ב-`while True:` וצאו עם break כשהמספר הוא 0, או קראו את המספר הראשון לפני הלולאה וחזרו כל עוד הוא לא 0.'],
            ['Add each number to `total` with `total += number`.', 'הוסיפו כל מספר ל-`total` עם `total += number`.'],
            ['After the loop: `print("Total:", total)`.', 'אחרי הלולאה: `print("Total:", total)`.'],
          ],
          solution: py`
            total = 0
            while True:
                number = int(input("Number: "))
                if number == 0:
                    break
                total += number
            print("Total:", total)
          `,
          concepts: ['accumulator', 'while', 'break', 'input'],
        }),
        codeQ({
          id: 'm4-t-q10-b',
          title: ['Count until zero', 'ספירה עד אפס'],
          mode: 'write',
          instructions: [
            p(
              'Read whole numbers (any prompt text) until the user types 0. Then print exactly `Count:` followed by a space and how many numbers came before the 0. For 4, 6, 0 the output is `Count: 2`; if the first number is 0 the output is `Count: 0`.',
              'קראו מספרים שלמים (טקסט הבקשה חופשי) עד שהמשתמש מקליד 0. אחר כך הדפיסו בדיוק `Count:` ואחריו רווח וכמה מספרים הגיעו לפני ה-0. עבור 4, 6, 0 הפלט הוא `Count: 2`; אם המספר הראשון הוא 0 הפלט הוא `Count: 0`.',
            ),
          ],
          starterCode: py`
            count = 0
            # read numbers until 0 and count them

          `,
          sampleStdin: ['4', '6', '0'],
          check: {
            tests: [
              outputTest('Count: 2', { stdin: ['4', '6', '0'] }),
              outputTest('Count: 0', { stdin: ['0'] }),
              outputTest('Count: 3', { stdin: ['5', '5', '5', '0'] }),
            ],
            requires: [requires('\\bwhile\\b', 'Use a while loop.', 'השתמשו בלולאת while.')],
          },
          hints: [
            ['Use `while True:` and break when the number is 0.', 'השתמשו ב-`while True:` וצאו עם break כשהמספר הוא 0.'],
            ['Add 1 to `count` for every number that is not 0.', 'הוסיפו 1 ל-`count` עבור כל מספר שאינו 0.'],
            ['After the loop: `print("Count:", count)`.', 'אחרי הלולאה: `print("Count:", count)`.'],
          ],
          solution: py`
            count = 0
            while True:
                number = int(input("Number: "))
                if number == 0:
                    break
                count += 1
            print("Count:", count)
          `,
          concepts: ['accumulator', 'while', 'break', 'input'],
        }),
      ],
    },
    /* ---------------------------------------------------- 11. code: drawing */
    {
      variants: [
        codeQ({
          id: 'm4-t-q11-a',
          title: ['A star triangle', 'משולש כוכביות'],
          mode: 'write',
          instructions: [
            p(
              'Read the number of rows (any prompt text) and print a triangle of stars: row number r has r stars. For 3 the output is `*`, `**`, `***`.',
              'קראו את מספר השורות (טקסט הבקשה חופשי) והדפיסו משולש של כוכביות: בשורה מספר r יש r כוכביות. עבור 3 הפלט הוא `*`, `**`, `***`.',
            ),
          ],
          starterCode: py`
            rows = int(input("Rows: "))
            # draw the triangle

          `,
          sampleStdin: ['3'],
          check: {
            tests: [
              outputTest('*\n**\n***', { stdin: ['3'] }),
              outputTest('*', { stdin: ['1'] }),
              outputTest('*\n**\n***\n****\n*****', { stdin: ['5'] }),
            ],
            requires: [requires('\\bfor\\b', 'Use a for loop.', 'השתמשו בלולאת for.')],
          },
          hints: [
            ['Loop over the row numbers from 1 to rows.', 'עברו בלולאה על מספרי השורות מ-1 עד rows.'],
            ['String repetition gives a whole row at once: `"*" * r`.', 'שכפול מחרוזת נותן שורה שלמה בבת אחת: `"*" * r`.'],
            ['`for r in range(1, rows + 1):` then `print("*" * r)`.', '`for r in range(1, rows + 1):` ואז `print("*" * r)`.'],
          ],
          solution: py`
            rows = int(input("Rows: "))
            for r in range(1, rows + 1):
                print("*" * r)
          `,
          concepts: ['string-repeat', 'for', 'range'],
        }),
        codeQ({
          id: 'm4-t-q11-b',
          title: ['A star rectangle', 'מלבן כוכביות'],
          mode: 'write',
          instructions: [
            p(
              'Read the height and then the width (two whole numbers, any prompt texts) and print a rectangle of stars with that many rows and columns. For 2 and 3 the output is two rows of `***`.',
              'קראו את הגובה ואחר כך את הרוחב (שני מספרים שלמים, טקסטי הבקשה חופשיים) והדפיסו מלבן של כוכביות עם מספר השורות והעמודות שהתקבלו. עבור 2 ו-3 הפלט הוא שתי שורות של `***`.',
            ),
          ],
          starterCode: py`
            height = int(input("Height: "))
            width = int(input("Width: "))
            # draw the rectangle

          `,
          sampleStdin: ['2', '3'],
          check: {
            tests: [
              outputTest('***\n***', { stdin: ['2', '3'] }),
              outputTest('****', { stdin: ['1', '4'] }),
              outputTest('*\n*\n*', { stdin: ['3', '1'] }),
            ],
            requires: [requires('\\bfor\\b', 'Use a for loop.', 'השתמשו בלולאת for.')],
          },
          hints: [
            ['One loop over the rows is enough if each row is printed in one go.', 'לולאה אחת על השורות מספיקה אם כל שורה מודפסת בבת אחת.'],
            ['A row of width stars is `"*" * width`.', 'שורה של width כוכביות היא `"*" * width`.'],
            ['`for r in range(height):` then `print("*" * width)`.', '`for r in range(height):` ואז `print("*" * width)`.'],
          ],
          solution: py`
            height = int(input("Height: "))
            width = int(input("Width: "))
            for r in range(height):
                print("*" * width)
          `,
          concepts: ['string-repeat', 'nested-loop', 'for'],
        }),
      ],
    },
  ],
};
