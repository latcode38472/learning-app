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
  id: 'l15-while',
  moduleId: 'm4',
  title: t('while loops: repeat while a condition holds', 'לולאות while: לחזור כל עוד תנאי מתקיים'),
  tagline: t('Do it again, and again, until something changes.', 'שוב ושוב, עד שמשהו משתנה.'),
  estimatedMinutes: 25,
  introduces: ['while', 'loop-condition', 'counter', 'infinite-loop'],
  requires: ['if', 'comparison', 'variable', 'arithmetic', 'print', 'input', 'type-conversion'],
  runsInBrowser: true,

  objective: t(
    'Write a while loop that repeats a block while a condition is true, count with a counter variable, and recognise an infinite loop.',
    'לכתוב לולאת while שחוזרת על בלוק כל עוד תנאי מתקיים, לספור בעזרת משתנה מונה, ולזהות לולאה אינסופית.',
  ),
  prerequisiteCheck: t(
    'You can write an if statement with a condition and an indented block, and read a number with int(input()) (lessons 8, 9 and 12).',
    'אתם יודעים לכתוב משפט `if` עם תנאי ובלוק מוזח, ולקרוא מספר בעזרת `int(input())` (שיעורים 8, 9 ו-12).',
  ),

  explanation: [
    p(
      'Until now every line of a program ran once, from top to bottom. But programs often need to do the same thing many times: count to ten, ask a question again until the answer makes sense, add up a list of prices. A **loop** repeats a block of code. The first loop you will learn is `while`.',
      'עד עכשיו כל שורה בתוכנית רצה פעם אחת, מלמעלה למטה. אבל תוכניות צריכות לעיתים קרובות לעשות את אותו הדבר הרבה פעמים: לספור עד עשר, לשאול שאלה שוב עד שהתשובה הגיונית, לחבר רשימה של מחירים. **לולאה** (loop) חוזרת על בלוק של קוד. הלולאה הראשונה שתלמדו היא `while`.',
    ),
    term(
      'while',
      '`while condition:` repeats the indented block as long as the condition is True. Each time the block finishes, Python goes back up, checks the condition again, and runs the block once more if it is still True. When the condition is False, Python skips the block and continues with the first line after it.',
      '`while condition:` חוזר על הבלוק המוזח כל עוד התנאי הוא True. בכל פעם שהבלוק מסתיים, פייתון חוזר למעלה, בודק את התנאי שוב, ומריץ את הבלוק פעם נוספת אם הוא עדיין True. כשהתנאי הוא False, פייתון מדלג על הבלוק וממשיך בשורה הראשונה שאחריו.',
    ),
    code(py`
      count = 1
      while count <= 3:
          print(count)
          count = count + 1
      print("Done")
    `, { output: '1\n2\n3\nDone' }),
    p(
      'Line 1 creates `count` with the value 1. Line 2 checks the **loop condition** `count <= 3`: it is True, so the block runs. The block prints the number and then makes `count` bigger by one. Back to line 2: 2 is still at most 3, so the block runs again. After the third round `count` is 4, the condition is False, and the program goes on to `print("Done")`. The condition is checked **before** every round, never in the middle of one.',
      'שורה 1 יוצרת את `count` עם הערך 1. שורה 2 בודקת את **תנאי הלולאה** (loop condition) `count <= 3`: הוא True, ולכן הבלוק רץ. הבלוק מדפיס את המספר ואז מגדיל את `count` באחד. חזרה לשורה 2: 2 הוא עדיין לכל היותר 3, ולכן הבלוק רץ שוב. אחרי הסיבוב השלישי `count` הוא 4, התנאי הוא False, והתוכנית ממשיכה ל-`print("Done")`. התנאי נבדק **לפני** כל סיבוב, אף פעם לא באמצע סיבוב.',
    ),
    term(
      '+=',
      '`count += 1` is a shorthand for `count = count + 1`: take the current value of `count`, add 1, and store the result back in `count`. It works with any number: `score += 10` adds ten. You will see this shorthand in almost every loop.',
      '`count += 1` הוא קיצור של `count = count + 1`: קחו את הערך הנוכחי של `count`, הוסיפו 1, ושמרו את התוצאה בחזרה ב-`count`. זה עובד עם כל מספר: `score += 10` מוסיף עשר. תראו את הקיצור הזה כמעט בכל לולאה.',
    ),
    h('The counter pattern', 'תבנית המונה'),
    p(
      'A variable that counts the rounds is called a **counter**. Almost every counting loop has the same three parts: a start value before the loop (`count = 1`), a condition that says when to keep going (`count <= 3`), and a change inside the loop that moves the counter towards the end (`count += 1`). If one of the three is missing, the loop does not behave.',
      'משתנה שסופר את הסיבובים נקרא **מונה** (counter). כמעט לכל לולאת ספירה יש אותם שלושה חלקים: ערך התחלה לפני הלולאה (`count = 1`), תנאי שאומר מתי להמשיך (`count <= 3`), ושינוי בתוך הלולאה שמקדם את המונה לעבר הסוף (`count += 1`). אם אחד משלושת החלקים חסר, הלולאה לא מתנהגת כמו שצריך.',
    ),
    h('Infinite loops', 'לולאות אינסופיות'),
    callout(
      'warning',
      'If nothing inside the loop can ever make the condition False, the loop never ends. This is an **infinite loop**, and the most common cause is forgetting to change the counter. In this app a program that runs for too long is stopped after a few seconds and you see what it managed to print; on your own computer it would run until you force it to stop.',
      'אם שום דבר בתוך הלולאה לא יכול להפוך את התנאי ל-False, הלולאה לעולם לא מסתיימת. זו **לולאה אינסופית** (infinite loop), והסיבה הנפוצה ביותר היא שכחה של שינוי המונה. באפליקציה הזאת תוכנית שרצה יותר מדי זמן נעצרת אחרי כמה שניות ואתם רואים מה היא הספיקה להדפיס; במחשב שלכם היא הייתה רצה עד שתעצרו אותה בכוח.',
      t('Watch out', 'שימו לב'),
    ),
    code(py`
      count = 1
      while count <= 3:
          print(count)
    `, {
      caption: t(
        'The counter never changes, so the condition stays True forever. If you run this, the app stops it after a few seconds.',
        'המונה אף פעם לא משתנה, ולכן התנאי נשאר True לנצח. אם תריצו את זה, האפליקציה תעצור את התוכנית אחרי כמה שניות.',
      ),
    }),
    h('Waiting for the right input', 'להמתין לקלט הנכון'),
    p(
      'A while loop does not have to count. It can repeat a question until the answer is the one you want. Here the loop asks again as long as the answer is not `yes`. If the very first answer is `yes`, the condition is False right away and the block does not run at all.',
      'לולאת while לא חייבת לספור. היא יכולה לחזור על שאלה עד שהתשובה היא זו שרציתם. כאן הלולאה שואלת שוב כל עוד התשובה אינה `yes`. אם כבר התשובה הראשונה היא `yes`, התנאי הוא False מיד והבלוק לא רץ בכלל.',
    ),
    code(py`
      answer = input("Do you want to continue? ")
      while answer != "yes":
          answer = input("Please type yes: ")
      print("Great, moving on")
    `),
  ],

  simpler: [
    p(
      'Think of washing dishes. The rule is: while there is a dirty dish, wash one dish. Before each dish you look at the pile. Dirty dish there? Wash it and look again. Pile empty? Stop and dry your hands.',
      'חשבו על שטיפת כלים. הכלל הוא: כל עוד יש כלי מלוכלך, שטפו כלי אחד. לפני כל כלי אתם מסתכלים על הערימה. יש כלי מלוכלך? שוטפים אותו ומסתכלים שוב. הערימה ריקה? עוצרים ומנגבים ידיים.',
    ),
    p(
      '`while count <= 3:` is the same idea: "while the count has not passed 3, do the block". Python looks at the condition, does the block, looks again, does the block again, and stops the moment the condition fails.',
      '`while count <= 3:` הוא אותו רעיון: "כל עוד המונה לא עבר את 3, בצעו את הבלוק". פייתון מסתכל על התנאי, מבצע את הבלוק, מסתכל שוב, מבצע שוב, ועוצר ברגע שהתנאי לא מתקיים.',
    ),
    p(
      'The counter is like tally marks on a piece of paper: after every round you add one mark. If you forget to add the mark, the paper always shows the same number and you keep washing the same dish forever. That is an infinite loop.',
      'המונה הוא כמו קווי ספירה על דף: אחרי כל סיבוב מוסיפים קו אחד. אם שוכחים להוסיף את הקו, הדף תמיד מראה את אותו מספר ואתם שוטפים את אותו כלי לנצח. זו לולאה אינסופית.',
    ),
  ],

  workedExample: [
    p(
      'Let us follow a countdown round by round. Press the play button under the code and watch `n` shrink until the condition fails.',
      'בואו נעקוב אחרי ספירה לאחור סיבוב אחר סיבוב. לחצו על כפתור ההפעלה מתחת לקוד וצפו ב-`n` קטן עד שהתנאי מפסיק להתקיים.',
    ),
    viz(py`
      n = 3
      while n > 0:
          print(n)
          n = n - 1
      print("Liftoff")
    `),
    list([
      ['Line 1: `n` starts at 3.', 'שורה 1: `n` מתחיל ב-3.'],
      ['Line 2: is `n > 0`? 3 is bigger than 0, so the block runs: it prints 3 and changes `n` to 2.', 'שורה 2: האם `n > 0`? 3 גדול מ-0, ולכן הבלוק רץ: הוא מדפיס 3 ומשנה את `n` ל-2.'],
      ['Back to line 2 with `n` = 2, then with `n` = 1. Each time the block prints and subtracts one.', 'חזרה לשורה 2 עם `n` = 2, ואחר כך עם `n` = 1. בכל פעם הבלוק מדפיס ומחסיר אחד.'],
      ['When `n` is 0 the condition `0 > 0` is False. Python skips the block and runs line 5.', 'כש-`n` הוא 0 התנאי `0 > 0` הוא False. פייתון מדלג על הבלוק ומריץ את שורה 5.'],
    ], true),
    code(py`
      3
      2
      1
      Liftoff
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('Doubling until we pass 100', 'הכפלה עד שעוברים את 100'),
      code(py`
        money = 10
        years = 0
        while money < 100:
            money = money * 2
            years += 1
        print(years)
        print(money)
      `, { output: '4\n160' }),
      p(
        'The loop keeps doubling `money` while it is under 100: 10, 20, 40, 80, 160. That took four rounds, so `years` is 4. Notice that the loop does not stop at exactly 100: the condition is checked only between rounds, and after the fourth round 160 is already past it.',
        'הלולאה ממשיכה להכפיל את `money` כל עוד הוא מתחת ל-100: 10, 20, 40, 80, 160. זה לקח ארבעה סיבובים, ולכן `years` הוא 4. שימו לב שהלולאה לא נעצרת בדיוק ב-100: התנאי נבדק רק בין סיבובים, ואחרי הסיבוב הרביעי 160 כבר עבר אותו.',
      ),
    ],
    [
      h('Asking until the answer is valid', 'לשאול עד שהתשובה תקינה'),
      code(py`
        age = int(input("How old are you? "))
        while age < 0:
            print("An age cannot be negative")
            age = int(input("How old are you? "))
        print("Thanks")
      `),
      p(
        'The program refuses a negative age. Each wrong answer prints a message and asks again; the first valid answer makes the condition False and the loop ends. Try it with -5, -1 and then 12. Type a whole number only: `int()` would fail on text.',
        'התוכנית מסרבת לקבל גיל שלילי. כל תשובה שגויה מדפיסה הודעה ושואלת שוב; התשובה התקינה הראשונה הופכת את התנאי ל-False והלולאה מסתיימת. נסו עם -5, -1 ואז 12. הקלידו מספר שלם בלבד: `int()` ייכשל על טקסט.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l15-hard',
    title: ['Count the digits', 'ספירת ספרות'],
    mode: 'write',
    instructions: [
      p(
        'Read a positive whole number (any prompt text) and print how many digits it has. Do it with a while loop, not with `len`: while the number is bigger than 0, divide it by 10 with `//` and add one to a counter. For example 12345 becomes 1234, 123, 12, 1, 0 — five divisions, so the answer is 5.',
        'קראו מספר שלם חיובי (טקסט הבקשה חופשי) והדפיסו כמה ספרות יש בו. עשו זאת עם לולאת while, לא עם `len`: כל עוד המספר גדול מ-0, חלקו אותו ב-10 בעזרת `//` והוסיפו אחד למונה. למשל 12345 הופך ל-1234, 123, 12, 1, 0 — חמש חלוקות, ולכן התשובה היא 5.',
      ),
    ],
    starterCode: py`
      n = int(input("Number: "))
      digits = 0
      # divide n by 10 again and again, counting the divisions

      print(digits)
    `,
    sampleStdin: ['12345'],
    check: {
      tests: [
        outputTest('5', { stdin: ['12345'] }),
        outputTest('1', { stdin: ['7'] }),
        outputTest('3', { stdin: ['100'] }),
      ],
      requires: [requires('\\bwhile\\b', 'Use a while loop.', 'השתמשו בלולאת while.')],
      forbids: [requires('\\blen\\s*\\(', 'Count with a loop, not with len().', 'ספרו בעזרת לולאה, לא בעזרת len().')],
    },
    hints: [
      ['The condition is `n > 0`. Inside the loop, two things must happen: `n` gets smaller and `digits` gets bigger.', 'התנאי הוא `n > 0`. בתוך הלולאה צריכים לקרות שני דברים: `n` נעשה קטן יותר ו-`digits` נעשה גדול יותר.'],
      ['`n = n // 10` drops the last digit: 12345 // 10 is 1234.', '`n = n // 10` מוריד את הספרה האחרונה: 12345 // 10 הוא 1234.'],
      ['`while n > 0:` then `n = n // 10` and `digits += 1` inside the block.', '`while n > 0:` ואז `n = n // 10` ו-`digits += 1` בתוך הבלוק.'],
    ],
    solution: py`
      n = int(input("Number: "))
      digits = 0
      while n > 0:
          n = n // 10
          digits += 1
      print(digits)
    `,
    concepts: ['while', 'counter', 'integer-division'],
  }),

  predict: {
    code: py`
      x = 1
      while x < 20:
          x = x * 3
      print(x)
    `,
    prompt: t('What does this program print?', 'מה התוכנית הזאת תדפיס?'),
    answer: '27',
    explanation: t(
      'x goes 1, 3, 9, 27. After it becomes 27 the condition 27 < 20 is False, so the loop stops and 27 is printed. The loop does not stop at 9, because 9 is still under 20 when the condition is checked.',
      'x עובר דרך 1, 3, 9, 27. אחרי שהוא הופך ל-27 התנאי 27 < 20 הוא False, ולכן הלולאה נעצרת ו-27 מודפס. הלולאה לא נעצרת ב-9, כי כשהתנאי נבדק 9 עדיין קטן מ-20.',
    ),
  },

  exercise: exercise({
    id: 'l15-ex',
    title: ['Countdown', 'ספירה לאחור'],
    mode: 'complete',
    instructions: [
      p(
        'The program reads a starting number and should count down from it to 1, one number per line, then print `Liftoff`. Two pieces are missing: the line that makes `n` smaller inside the loop, and the final print after the loop. Fill them in. With the input 3 the output is `3`, `2`, `1`, `Liftoff`. With 0 it prints only `Liftoff`.',
        'התוכנית קוראת מספר התחלה וצריכה לספור ממנו לאחור עד 1, מספר בכל שורה, ואז להדפיס `Liftoff`. חסרים שני חלקים: השורה שמקטינה את `n` בתוך הלולאה, וההדפסה האחרונה אחרי הלולאה. השלימו אותם. עם הקלט 3 הפלט הוא `3`, `2`, `1`, `Liftoff`. עם 0 מודפס רק `Liftoff`.',
      ),
    ],
    starterCode: py`
      n = int(input("Start from: "))
      while n > 0:
          print(n)
          # ... make n smaller by 1

      # ... print Liftoff after the loop
    `,
    sampleStdin: ['3'],
    check: {
      tests: [
        outputTest('3\n2\n1\nLiftoff', { stdin: ['3'] }),
        outputTest('1\nLiftoff', { stdin: ['1'] }),
        outputTest('Liftoff', { stdin: ['0'] }),
      ],
    },
    hints: [
      ['Right now `n` never changes, so the loop would run forever. Something inside the block has to make `n` smaller.', 'כרגע `n` אף פעם לא משתנה, ולכן הלולאה תרוץ לנצח. משהו בתוך הבלוק צריך להקטין את `n`.'],
      ['`n -= 1` (or `n = n - 1`) takes one away. It must be indented like the print, so it is part of the loop.', '`n -= 1` (או `n = n - 1`) מוריד אחד. השורה חייבת להיות מוזחת כמו ה-print, כדי שתהיה חלק מהלולאה.'],
      ['The last line, `print("Liftoff")`, is not indented: it runs once, after the loop has finished.', 'השורה האחרונה, `print("Liftoff")`, לא מוזחת: היא רצה פעם אחת, אחרי שהלולאה הסתיימה.'],
    ],
    solution: py`
      n = int(input("Start from: "))
      while n > 0:
          print(n)
          n = n - 1

      print("Liftoff")
    `,
    concepts: ['while', 'loop-condition', 'counter'],
  }),

  build: exercise({
    id: 'l15-build',
    title: ['The password gate', 'שער הסיסמה'],
    mode: 'build',
    instructions: [
      p(
        'Build a small gate. Ask for a password (any prompt text) until the user types exactly `open`. For every wrong answer print exactly `Wrong password`. When the right password arrives, print `Welcome` and then `Attempts: N`, where N counts every answer including the correct one. For the answers `a`, `b`, `open` the output is:',
        'בנו שער קטן. בקשו סיסמה (טקסט הבקשה חופשי) עד שהמשתמש מקליד בדיוק `open`. על כל תשובה שגויה הדפיסו בדיוק `Wrong password`. כשהסיסמה הנכונה מגיעה, הדפיסו `Welcome` ואחר כך `Attempts: N`, כאשר N סופר כל תשובה כולל הנכונה. עבור התשובות `a`, `b`, `open` הפלט הוא:',
      ),
      code('Wrong password\nWrong password\nWelcome\nAttempts: 3', { lang: 'text', runnable: false }),
      p(
        'If the first answer is already `open`, nothing is printed before `Welcome` and the count is 1.',
        'אם כבר התשובה הראשונה היא `open`, לא מודפס דבר לפני `Welcome` והספירה היא 1.',
      ),
    ],
    starterCode: py`
      # ask for the password until the user types open
      # count every attempt

    `,
    sampleStdin: ['a', 'b', 'open'],
    check: {
      tests: [
        outputTest('Wrong password\nWrong password\nWelcome\nAttempts: 3', { stdin: ['a', 'b', 'open'] }),
        outputTest('Welcome\nAttempts: 1', { stdin: ['open'] }),
        outputTest('Wrong password\nWelcome\nAttempts: 2', { stdin: ['Open', 'open'] }),
      ],
      requires: [requires('\\bwhile\\b', 'Use a while loop to keep asking.', 'השתמשו בלולאת while כדי להמשיך לשאול.')],
    },
    hints: [
      ['Read the first answer before the loop, then loop while the answer is not `open`.', 'קראו את התשובה הראשונה לפני הלולאה, ואז חזרו בלולאה כל עוד התשובה אינה `open`.'],
      ['Keep a counter that starts at 1 for the first answer and grows by one every time you ask again.', 'החזיקו מונה שמתחיל ב-1 עבור התשובה הראשונה וגדל באחד בכל פעם שאתם שואלים שוב.'],
      ['Inside the loop: print `Wrong password`, ask again, `attempts += 1`. After the loop: print `Welcome` and `print("Attempts:", attempts)`.', 'בתוך הלולאה: הדפיסו `Wrong password`, שאלו שוב, `attempts += 1`. אחרי הלולאה: הדפיסו `Welcome` ו-`print("Attempts:", attempts)`.'],
    ],
    solution: py`
      attempts = 1
      password = input("Password: ")
      while password != "open":
          print("Wrong password")
          password = input("Password: ")
          attempts += 1
      print("Welcome")
      print("Attempts:", attempts)
    `,
    solutionNote: [
      'The prompt text is up to you. What matters is the printed lines and the count.',
      'טקסט הבקשה לבחירתכם. מה שחשוב הוא השורות המודפסות והספירה.',
    ],
    concepts: ['while', 'loop-condition', 'counter', 'input'],
  }),

  check: [
    choice(
      'l15-c1',
      ['When does a `while` loop stop?', 'מתי לולאת `while` נעצרת?'],
      [
        opt('When its condition is checked and turns out to be False.', 'כשהתנאי שלה נבדק ומתברר שהוא False.', {
          correct: true,
          feedback: ['Right. The condition is checked before every round; the first time it is False, the loop ends.', 'נכון. התנאי נבדק לפני כל סיבוב; בפעם הראשונה שהוא False, הלולאה מסתיימת.'],
        }),
        opt('After the block has run once.', 'אחרי שהבלוק רץ פעם אחת.', {
          feedback: ['That is what `if` does. A while loop runs the block again and again while the condition holds.', 'זה מה ש-`if` עושה. לולאת while מריצה את הבלוק שוב ושוב כל עוד התנאי מתקיים.'],
        }),
        opt('When the program reaches the last line of the block.', 'כשהתוכנית מגיעה לשורה האחרונה של הבלוק.', {
          feedback: ['At the end of the block Python goes back up and checks the condition again. Only a False condition ends the loop.', 'בסוף הבלוק פייתון חוזר למעלה ובודק את התנאי שוב. רק תנאי False מסיים את הלולאה.'],
        }),
      ],
      ['while', 'loop-condition'],
    ),
    choice(
      'l15-c2',
      [
        'What happens when this runs? `count = 1` then `while count <= 3:` then `    print(count)`',
        'מה קורה כשזה רץ? `count = 1` ואז `while count <= 3:` ואז `    print(count)`',
      ],
      [
        opt('It prints 1 again and again: an infinite loop, because count never changes.', 'הוא מדפיס 1 שוב ושוב: לולאה אינסופית, כי count אף פעם לא משתנה.', {
          correct: true,
          feedback: ['Yes. Nothing inside the block changes count, so the condition 1 <= 3 stays True forever.', 'כן. שום דבר בתוך הבלוק לא משנה את count, ולכן התנאי 1 <= 3 נשאר True לנצח.'],
        }),
        opt('It prints 1, 2, 3.', 'הוא מדפיס 1, 2, 3.', {
          feedback: ['That needs `count += 1` inside the block. Without it the counter is stuck at 1.', 'בשביל זה צריך `count += 1` בתוך הבלוק. בלעדיו המונה תקוע על 1.'],
        }),
        opt('It prints nothing.', 'הוא לא מדפיס כלום.', {
          feedback: ['The condition is True at the start, so the block runs and prints 1 — and keeps doing so.', 'התנאי הוא True בהתחלה, ולכן הבלוק רץ ומדפיס 1 — וממשיך לעשות זאת.'],
        }),
        opt('An error, because the loop has no counter change.', 'שגיאה, כי בלולאה אין שינוי של המונה.', {
          feedback: ['Python does not check for this. The program is valid; it just never finishes on its own.', 'פייתון לא בודק את זה. התוכנית תקינה; היא פשוט אף פעם לא מסתיימת בעצמה.'],
        }),
      ],
      ['infinite-loop', 'counter'],
    ),
    choice(
      'l15-c3',
      ['What does `total += 5` do?', 'מה עושה `total += 5`?'],
      [
        opt('Adds 5 to the current value of total and stores the result back in total.', 'מוסיף 5 לערך הנוכחי של total ושומר את התוצאה בחזרה ב-total.', {
          correct: true,
          feedback: ['Correct. It is the same as `total = total + 5`.', 'נכון. זה בדיוק כמו `total = total + 5`.'],
        }),
        opt('Checks whether total is bigger than 5.', 'בודק אם total גדול מ-5.', {
          feedback: ['Comparisons use `>` or `>=`. `+=` changes the variable; it never asks a question.', 'השוואות משתמשות ב-`>` או `>=`. `+=` משנה את המשתנה; הוא אף פעם לא שואל שאלה.'],
        }),
        opt('Creates a new variable with the value 5.', 'יוצר משתנה חדש עם הערך 5.', {
          feedback: ['`+=` needs total to exist already; it adds to the old value instead of replacing it.', '`+=` דורש ש-total כבר יהיה קיים; הוא מוסיף לערך הישן במקום להחליף אותו.'],
        }),
      ],
      ['counter'],
    ),
  ],

  recap: [
    list([
      ['`while condition:` repeats the indented block as long as the condition is True.', '`while condition:` חוזר על הבלוק המוזח כל עוד התנאי הוא True.'],
      ['The condition is checked before every round; when it is False the loop ends and the program continues below it.', 'התנאי נבדק לפני כל סיבוב; כשהוא False הלולאה מסתיימת והתוכנית ממשיכה מתחתיה.'],
      ['The counter pattern: a start value before the loop, a condition, and a change inside the loop such as `count += 1`.', 'תבנית המונה: ערך התחלה לפני הלולאה, תנאי, ושינוי בתוך הלולאה כמו `count += 1`.'],
      ['If nothing in the loop can make the condition False, you have an infinite loop.', 'אם שום דבר בלולאה לא יכול להפוך את התנאי ל-False, יש לכם לולאה אינסופית.'],
      ['A while loop can wait for the right input: keep asking until the answer is the one you want.', 'לולאת while יכולה להמתין לקלט הנכון: המשיכו לשאול עד שהתשובה היא זו שרציתם.'],
    ]),
    p(
      'You can now make a program repeat work instead of copying lines. Counting with a while loop takes three parts, and you will soon meet a loop that handles those parts for you.',
      'עכשיו אתם יכולים לגרום לתוכנית לחזור על עבודה במקום להעתיק שורות. ספירה עם לולאת while דורשת שלושה חלקים, ובקרוב תפגשו לולאה שמטפלת בחלקים האלה בשבילכם.',
    ),
  ],
  next: t(
    'Next you will learn the for loop with range(), a shorter way to run a block a known number of times.',
    'בשיעור הבא תלמדו את לולאת for עם `range()`, דרך קצרה יותר להריץ בלוק מספר ידוע של פעמים.',
  ),
};
