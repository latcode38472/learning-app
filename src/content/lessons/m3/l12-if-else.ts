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
  id: 'l12-if-else',
  moduleId: 'm3',
  title: t('if and else: choosing a path', 'if ו-else: בחירת מסלול'),
  tagline: t('Run some lines only when a condition is true.', 'מריצים שורות מסוימות רק כשתנאי מתקיים.'),
  estimatedMinutes: 25,
  introduces: ['if', 'else', 'indentation', 'block'],
  requires: ['comparison', 'boolean', 'input', 'type-conversion', 'print', 'f-string'],
  runsInBrowser: true,

  objective: t(
    'Write an if statement with a condition, a colon and an indented block, add an else branch, and tell which lines run for a given value.',
    'לכתוב משפט `if` עם תנאי, נקודתיים ובלוק מוזח, להוסיף ענף `else`, ולדעת אילו שורות ירוצו עבור ערך נתון.',
  ),
  prerequisiteCheck: t(
    'You can write a comparison such as age >= 18 and know that it gives True or False (lesson 11).',
    'אתם יודעים לכתוב השוואה כמו `age >= 18` ויודעים שהיא מחזירה `True` או `False` (שיעור 11).',
  ),

  explanation: [
    p(
      'A comparison gives `True` or `False`. Now the program can **act** on that answer: run a few lines only when the answer is `True`, and skip them otherwise. That is what an `if` statement does — and it is the first time your program will not run every single line.',
      'השוואה מחזירה `True` או `False`. עכשיו התוכנית יכולה **לפעול** לפי התשובה: להריץ כמה שורות רק כשהתשובה היא `True`, ולדלג עליהן אחרת. זה בדיוק מה שמשפט `if` עושה — וזו הפעם הראשונה שהתוכנית שלכם לא תריץ כל שורה ושורה.',
    ),
    term(
      'if',
      'The word `if` starts a **condition**. Its line has three parts: the word `if`, a comparison (the condition), and a colon. If the condition is `True`, the lines under it run. If it is `False`, they are skipped.',
      'המילה `if` (אם) פותחת **תנאי** (condition). בשורה שלה יש שלושה חלקים: המילה `if`, השוואה (התנאי) ונקודתיים. אם התנאי הוא `True`, השורות שמתחתיו רצות. אם הוא `False`, מדלגים עליהן.',
    ),
    term(
      ':',
      'The colon at the end of the `if` line means "a group of lines belongs to me — here it comes". Forgetting it gives a SyntaxError: `expected \':\'`.',
      'הנקודתיים בסוף שורת ה-`if` אומרות "קבוצת שורות שייכת לי — הנה היא באה". אם שוכחים אותן מתקבלת שגיאת SyntaxError: `expected \':\'`.',
    ),
    code(py`
      age = 20
      if age >= 18:
          print("You can vote")
      print("Goodbye")
    `, { output: 'You can vote\nGoodbye' }),
    term(
      'indentation',
      'Line 3 starts with four spaces. This is **indentation**: pushing a line inward to show that it belongs to the `if` above it. Python uses exactly this to know which lines are inside the `if`. Use 4 spaces every time (the editor inserts them when you press Tab).',
      'שורה 3 מתחילה בארבעה רווחים. זו **הזחה** (indentation): הזזת השורה פנימה כדי להראות שהיא שייכת ל-`if` שמעליה. פייתון משתמש בדיוק בזה כדי לדעת אילו שורות נמצאות בתוך ה-`if`. השתמשו תמיד ב-4 רווחים (העורך מכניס אותם כשלוחצים Tab).',
    ),
    term(
      'block',
      'All the indented lines directly under the `if` form its **block**. A block can be one line or many. The first line that is **not** indented — `print("Goodbye")` here — is outside the block: it runs no matter what the condition was.',
      'כל השורות המוזחות שנמצאות ישירות מתחת ל-`if` מרכיבות את ה**בלוק** (block) שלו. בלוק יכול להיות שורה אחת או הרבה שורות. השורה הראשונה ש**אינה** מוזחת — כאן `print("Goodbye")` — נמצאת מחוץ לבלוק: היא רצה בכל מקרה, לא משנה מה היה התנאי.',
    ),
    p(
      'Change `age` to 15 and the condition `15 >= 18` is `False`. Python skips the whole block and continues at the first unindented line:',
      'שנו את `age` ל-15 והתנאי `15 >= 18` יהיה `False`. פייתון מדלג על כל הבלוק וממשיך בשורה הראשונה שאינה מוזחת:',
    ),
    code(py`
      age = 15
      if age >= 18:
          print("You can vote")
      print("Goodbye")
    `, { output: 'Goodbye' }),
    h('else: the other path', 'else: המסלול השני'),
    term(
      'else',
      '`else:` comes right after the `if` block, at the same indentation as the `if`, with its own colon and its own block. It means "otherwise": its block runs only when the condition was `False`. Exactly one of the two blocks runs — never both, never neither.',
      '`else:` (אחרת) מגיע מיד אחרי הבלוק של ה-`if`, באותה הזחה כמו ה-`if`, עם נקודתיים משלו ובלוק משלו. פירושו "אחרת": הבלוק שלו רץ רק כשהתנאי היה `False`. בדיוק אחד משני הבלוקים רץ — אף פעם לא שניהם, ואף פעם לא אף אחד מהם.',
    ),
    code(py`
      age = 15
      if age >= 18:
          print("You can vote")
      else:
          print("Not yet")
      print("Goodbye")
    `, { output: 'Not yet\nGoodbye' }),
    h('Two errors you will meet', 'שתי שגיאות שתפגשו'),
    p(
      'If you forget to indent, Python complains before running anything. The message says exactly what it expected:',
      'אם שוכחים להזיח, פייתון מתלונן עוד לפני שהוא מריץ משהו. ההודעה אומרת בדיוק למה הוא ציפה:',
    ),
    code('age = 20\nif age >= 18:\nprint("You can vote")', { lang: 'text', runnable: false, caption: t('Line 3 is not indented', 'שורה 3 אינה מוזחת') }),
    code(
      '  File "main.py", line 3\n    print("You can vote")\n    ^^^^^\nIndentationError: expected an indented block after \'if\' statement on line 2',
      { lang: 'text', runnable: false, caption: t('Error', 'שגיאה') },
    ),
    p(
      'The other classic is writing a single `=` in the condition. `=` stores a value, it does not compare, so Python refuses to run — and even suggests the fix:',
      'השגיאה הקלאסית השנייה היא כתיבת `=` יחיד בתנאי. `=` שומר ערך ולא משווה, ולכן פייתון מסרב להריץ — ואפילו מציע את התיקון:',
    ),
    code(
      '  File "main.py", line 2\n    if age = 18:\n       ^^^^^^^^\nSyntaxError: invalid syntax. Maybe you meant \'==\' or \':=\' instead of \'=\'?',
      { lang: 'text', runnable: false, caption: t('Error', 'שגיאה') },
    ),
    callout(
      'note',
      'A condition can be any expression that gives `True` or `False`: a comparison such as `n % 2 == 0`, or a variable that already holds a boolean, like `if is_adult:`. The block can contain anything — several prints, assignments, even another `input()` — as long as every line in it is indented the same way.',
      'תנאי יכול להיות כל ביטוי שמחזיר `True` או `False`: השוואה כמו `n % 2 == 0`, או משתנה שכבר מחזיק ערך בוליאני, כמו `if is_adult:`. הבלוק יכול להכיל כל דבר — כמה הדפסות, השמות, ואפילו `input()` נוסף — כל עוד כל השורות שבו מוזחות באותו אופן.',
    ),
  ],

  simpler: [
    p(
      'Imagine a fork in a path with a sign: "If it is raining, take the covered way." Otherwise you take the open way. A little further on, the two ways join again and everyone continues together.',
      'דמיינו התפצלות בשביל עם שלט: "אם יורד גשם, לכו בדרך המקורה." אחרת הולכים בדרך הפתוחה. קצת הלאה שתי הדרכים מתחברות שוב וכולם ממשיכים יחד.',
    ),
    p(
      'The `if` line is the sign. The indented lines are the covered way. `else` is the open way. The first line that is not indented is the place where the ways join: it runs for everyone.',
      'שורת ה-`if` היא השלט. השורות המוזחות הן הדרך המקורה. `else` הוא הדרך הפתוחה. השורה הראשונה שאינה מוזחת היא המקום שבו הדרכים מתחברות: היא רצה עבור כולם.',
    ),
    p(
      'Indentation — the four spaces — is how Python tells the ways apart. Lines pushed inward belong to the sign above them; lines at the edge belong to everyone.',
      'ההזחה — ארבעת הרווחים — היא הדרך של פייתון להבחין בין הדרכים. שורות שמוזזות פנימה שייכות לשלט שמעליהן; שורות בקצה שייכות לכולם.',
    ),
  ],

  workedExample: [
    p(
      'Step through this program with the play button and watch which lines Python visits and which it skips.',
      'עברו על התוכנית הזאת צעד אחר צעד עם כפתור ההפעלה, וצפו באילו שורות פייתון מבקר ועל אילו הוא מדלג.',
    ),
    viz(py`
      number = 7
      if number % 2 == 0:
          print("even")
      else:
          print("odd")
      print("done")
    `),
    list([
      ['Line 1: `number` holds 7.', 'שורה 1: `number` מחזיק 7.'],
      ['Line 2: Python computes `7 % 2`, which is 1, and asks `1 == 0`. The answer is `False`, so the `if` block (line 3) is skipped.', 'שורה 2: פייתון מחשב את `7 % 2`, שהוא 1, ושואל `1 == 0`. התשובה היא `False`, ולכן מדלגים על הבלוק של ה-`if` (שורה 3).'],
      ['Lines 4–5: because the condition was `False`, the `else` block runs and prints `odd`.', 'שורות 4–5: מכיוון שהתנאי היה `False`, הבלוק של ה-`else` רץ ומדפיס `odd`.'],
      ['Line 6 is not indented, so it runs in every case and prints `done`.', 'שורה 6 אינה מוזחת, ולכן היא רצה בכל מקרה ומדפיסה `done`.'],
      ['Change line 1 to `number = 8` and run again: now line 3 runs and line 5 is skipped.', 'שנו את שורה 1 ל-`number = 8` והריצו שוב: עכשיו שורה 3 רצה ומדלגים על שורה 5.'],
    ], true),
    code(py`
      odd
      done
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('A password check', 'בדיקת סיסמה'),
      code(py`
        password = "sesame"
        guess = "Sesame"
        if guess == password:
            print("Welcome")
        else:
            print("Wrong password")
      `, { output: 'Wrong password' }),
      p(
        'The comparison is exact, so the capital S makes `guess == password` False and the `else` block runs. Try `guess.lower() == password` as the condition and run again.',
        'ההשוואה מדויקת, ולכן ה-S הגדולה הופכת את `guess == password` ל-False והבלוק של ה-`else` רץ. נסו את `guess.lower() == password` כתנאי והריצו שוב.',
      ),
    ],
    [
      h('A block can change a variable', 'בלוק יכול לשנות משתנה'),
      code(py`
        price = 120
        if price > 100:
            price = price - 20
        print("Final price:", price)
      `, { output: 'Final price: 100' }),
      p(
        'There is no `else` here: when the price is 100 or less, nothing is subtracted. Line 4 is outside the block, so it runs every time and shows whatever `price` holds by then.',
        'כאן אין `else`: כשהמחיר הוא 100 או פחות, לא מחסירים כלום. שורה 4 נמצאת מחוץ לבלוק, ולכן היא רצה בכל מקרה ומציגה את מה ש-`price` מחזיק באותו רגע.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l12-hard',
    title: ['Fix the even-or-odd checker', 'תקנו את בודק הזוגיות'],
    mode: 'fix',
    instructions: [
      p(
        'This program should read a whole number and print `Even` or `Odd`, but it has three mistakes: a missing colon, a missing indentation, and a `=` that should be a comparison. Fix all three without changing what the program is meant to do.',
        'התוכנית הזאת אמורה לקרוא מספר שלם ולהדפיס `Even` או `Odd`, אבל יש בה שלוש טעויות: נקודתיים חסרות, הזחה חסרה, ו-`=` שאמור להיות השוואה. תקנו את שלושתן בלי לשנות את מה שהתוכנית אמורה לעשות.',
      ),
    ],
    starterCode: py`
      n = int(input("Number: "))
      if n % 2 = 0
      print("Even")
      else:
          print("Odd")
    `,
    sampleStdin: ['4'],
    check: {
      tests: [
        outputTest('Even', { stdin: ['4'] }),
        outputTest('Odd', { stdin: ['7'] }),
        outputTest('Even', { stdin: ['0'] }),
        outputTest('Odd', { stdin: ['-3'] }),
      ],
    },
    hints: [
      ['Read the error message: it points at the first problem. Fix it, run again, and read the next message.', 'קראו את הודעת השגיאה: היא מצביעה על הבעיה הראשונה. תקנו אותה, הריצו שוב, וקראו את ההודעה הבאה.'],
      ['A condition compares with `==`, and the `if` line must end with a colon.', 'תנאי משווה בעזרת `==`, ושורת ה-`if` חייבת להסתיים בנקודתיים.'],
      ['The `print("Even")` line must be indented by four spaces so that it belongs to the `if`.', 'השורה `print("Even")` חייבת להיות מוזחת בארבעה רווחים כדי שתשתייך ל-`if`.'],
    ],
    solution: py`
      n = int(input("Number: "))
      if n % 2 == 0:
          print("Even")
      else:
          print("Odd")
    `,
    concepts: ['if', 'else', 'indentation', 'equality', 'modulo'],
  }),

  predict: {
    code: py`
      score = 85
      if score >= 90:
          print("Excellent")
      else:
          print("Good")
      print("Score:", score)
    `,
    prompt: t('What does this program print? (two lines)', 'מה התוכנית הזאת תדפיס? (שתי שורות)'),
    answer: 'Good\nScore: 85',
    explanation: t(
      '85 >= 90 is False, so the if block is skipped and the else block prints Good. The last print is not indented, so it runs in every case and prints Score: 85.',
      '85 >= 90 הוא False, ולכן מדלגים על הבלוק של ה-if והבלוק של ה-else מדפיס Good. ההדפסה האחרונה אינה מוזחת, ולכן היא רצה בכל מקרה ומדפיסה Score: 85.',
    ),
  },

  exercise: exercise({
    id: 'l12-ex',
    title: ['Positive or not', 'חיובי או לא'],
    mode: 'write',
    instructions: [
      p(
        'Ask for a whole number (any prompt text). If the number is greater than 0, print `Positive`. Otherwise print `Not positive`. Remember that zero is not positive. During checking the prompt is not shown, so the expected output is a single line.',
        'בקשו מספר שלם (טקסט הבקשה חופשי). אם המספר גדול מ-0, הדפיסו `Positive`. אחרת הדפיסו `Not positive`. זכרו שאפס אינו חיובי. בזמן הבדיקה טקסט הבקשה לא מוצג, ולכן הפלט הצפוי הוא שורה אחת.',
      ),
    ],
    starterCode: py`
      n = int(input("Enter a number: "))
      # if n is greater than 0, print Positive
      # otherwise print Not positive

    `,
    sampleStdin: ['5'],
    check: {
      tests: [
        outputTest('Positive', { stdin: ['5'] }),
        outputTest('Not positive', { stdin: ['-2'] }),
        outputTest('Not positive', { stdin: ['0'] }),
        outputTest('Positive', { stdin: ['100'] }),
      ],
      requires: [
        requires('\\bif\\b', 'Use an if statement.', 'השתמשו במשפט if.'),
        requires('\\belse\\b', 'Use else for the other case.', 'השתמשו ב-else עבור המקרה השני.'),
      ],
    },
    hints: [
      ['The condition is `n > 0`. Write it after `if`, and do not forget the colon.', 'התנאי הוא `n > 0`. כתבו אותו אחרי `if`, ואל תשכחו את הנקודתיים.'],
      ['Indent the print under the `if` by four spaces. Then add `else:` on its own line.', 'הזיחו את ההדפסה שמתחת ל-`if` בארבעה רווחים. אחר כך הוסיפו `else:` בשורה משלו.'],
      ['`if n > 0:` then `print("Positive")` indented, then `else:` then `print("Not positive")` indented.', '`if n > 0:` ואז `print("Positive")` מוזח, אחר כך `else:` ואז `print("Not positive")` מוזח.'],
    ],
    solution: py`
      n = int(input("Enter a number: "))
      if n > 0:
          print("Positive")
      else:
          print("Not positive")
    `,
    concepts: ['if', 'else', 'block', 'comparison'],
  }),

  build: exercise({
    id: 'l12-build',
    title: ['A cinema ticket machine', 'מכונת כרטיסים לקולנוע'],
    mode: 'build',
    instructions: [
      p(
        'Build a small ticket machine. Ask for the visitor\'s age (any prompt text). Children under 12 pay 5; everyone else pays 10. Print `Price: 5` or `Price: 10`, and after that always print `Enjoy the movie`.',
        'בנו מכונת כרטיסים קטנה. בקשו את גיל המבקר (טקסט הבקשה חופשי). ילדים מתחת לגיל 12 משלמים 5; כל השאר משלמים 10. הדפיסו `Price: 5` או `Price: 10`, ואחר כך הדפיסו תמיד `Enjoy the movie`.',
      ),
      code('Price: 5\nEnjoy the movie', { lang: 'text', caption: t('Output for age 8', 'הפלט עבור גיל 8'), runnable: false }),
      p(
        'Suggested shape: store the price in a variable inside the `if` and `else` blocks, then print once after them with an f-string: `print(f"Price: {price}")`.',
        'מבנה מוצע: שמרו את המחיר במשתנה בתוך הבלוקים של ה-`if` וה-`else`, ואז הדפיסו פעם אחת אחריהם בעזרת f-string: `print(f"Price: {price}")`.',
      ),
    ],
    starterCode: py`
      age = int(input("Age: "))
      # decide the price: 5 for under 12, otherwise 10

      # print the price line, then "Enjoy the movie"

    `,
    sampleStdin: ['8'],
    check: {
      tests: [
        outputTest('Price: 5\nEnjoy the movie', { stdin: ['8'] }),
        outputTest('Price: 10\nEnjoy the movie', { stdin: ['12'] }),
        outputTest('Price: 5\nEnjoy the movie', { stdin: ['11'] }),
        outputTest('Price: 10\nEnjoy the movie', { stdin: ['40'] }),
      ],
    },
    hints: [
      ['"Under 12" is the condition `age < 12`.', '"מתחת לגיל 12" הוא התנאי `age < 12`.'],
      ['Inside the `if` block write `price = 5`; inside the `else` block write `price = 10`.', 'בתוך הבלוק של ה-`if` כתבו `price = 5`; בתוך הבלוק של ה-`else` כתבו `price = 10`.'],
      ['After the blocks, unindented: `print(f"Price: {price}")` and then `print("Enjoy the movie")`.', 'אחרי הבלוקים, בלי הזחה: `print(f"Price: {price}")` ואז `print("Enjoy the movie")`.'],
    ],
    solution: py`
      age = int(input("Age: "))
      if age < 12:
          price = 5
      else:
          price = 10
      print(f"Price: {price}")
      print("Enjoy the movie")
    `,
    solutionNote: [
      'Printing directly inside each block also works, as long as the two lines come out in the right order.',
      'גם הדפסה ישירה בתוך כל בלוק עובדת, כל עוד שתי השורות יוצאות בסדר הנכון.',
    ],
    concepts: ['if', 'else', 'block', 'f-string', 'input'],
  }),

  check: [
    choice(
      'l12-c1',
      [
        p('What does this program print?', 'מה התוכנית הזאת מדפיסה?'),
        code(py`
          x = 3
          if x > 5:
              print("big")
          print("done")
        `, { runnable: false }),
      ],
      [
        opt('`done`', '`done`', {
          correct: true,
          feedback: ['Right. 3 > 5 is False, so the indented line is skipped. The last line is not indented, so it always runs.', 'נכון. 3 > 5 הוא False, ולכן מדלגים על השורה המוזחת. השורה האחרונה אינה מוזחת, ולכן היא תמיד רצה.'],
        }),
        opt('`big` and then `done`', '`big` ואז `done`', {
          feedback: ['big would print only if the condition were True. 3 is not greater than 5.', 'big היה מודפס רק אם התנאי היה True. 3 אינו גדול מ-5.'],
        }),
        opt('`big`', '`big`', {
          feedback: ['The condition is False, so big is skipped — and done is outside the block, so it prints anyway.', 'התנאי הוא False, ולכן מדלגים על big — ו-done נמצא מחוץ לבלוק, ולכן הוא מודפס בכל מקרה.'],
        }),
        opt('Nothing', 'כלום', {
          feedback: ['The last print is not part of the if block, so it runs no matter what.', 'ההדפסה האחרונה אינה חלק מהבלוק של ה-if, ולכן היא רצה בכל מקרה.'],
        }),
      ],
      ['if', 'block'],
    ),
    choice(
      'l12-c2',
      ['Why are the lines under an `if` indented by four spaces?', 'למה השורות שמתחת ל-`if` מוזחות בארבעה רווחים?'],
      [
        opt('The indentation tells Python which lines belong to the if block.', 'ההזחה אומרת לפייתון אילו שורות שייכות לבלוק של ה-if.', {
          correct: true,
          feedback: ['Yes. In Python, indentation is not decoration: it defines the block.', 'כן. בפייתון ההזחה אינה קישוט: היא מגדירה את הבלוק.'],
        }),
        opt('They only make the code look nicer; Python ignores them.', 'הן רק גורמות לקוד להיראות יפה יותר; פייתון מתעלם מהן.', {
          feedback: ['Python reads the indentation. Without it you get an IndentationError.', 'פייתון קורא את ההזחה. בלעדיה מתקבלת שגיאת IndentationError.'],
        }),
        opt('They are needed only after else, not after if.', 'הן נחוצות רק אחרי else, לא אחרי if.', {
          feedback: ['Both if and else are followed by an indented block.', 'גם אחרי if וגם אחרי else מגיע בלוק מוזח.'],
        }),
        opt('They print four spaces before the output.', 'הן מדפיסות ארבעה רווחים לפני הפלט.', {
          feedback: ['Indentation is part of the code layout; it never appears in the output.', 'ההזחה היא חלק ממבנה הקוד; היא אף פעם לא מופיעה בפלט.'],
        }),
      ],
      ['indentation', 'block'],
    ),
    choice(
      'l12-c3',
      ['What is wrong with the line `if age = 18:`?', 'מה לא בסדר בשורה `if age = 18:`?'],
      [
        opt('A single = stores a value; a condition needs the comparison ==.', 'סימן = יחיד שומר ערך; תנאי צריך את ההשוואה ==.', {
          correct: true,
          feedback: ['Correct. Python even suggests it in the error message: "Maybe you meant \'==\'".', 'נכון. פייתון אפילו מציע זאת בהודעת השגיאה: "Maybe you meant \'==\'".'],
        }),
        opt('Nothing, it works.', 'שום דבר, זה עובד.', {
          feedback: ['It is a SyntaxError. = cannot be used as a question.', 'זו שגיאת SyntaxError. אי אפשר להשתמש ב-= כשאלה.'],
        }),
        opt('The condition must be inside parentheses.', 'התנאי חייב להיות בתוך סוגריים.', {
          feedback: ['Python does not need parentheses around a condition. The problem is the single =.', 'פייתון לא צריך סוגריים סביב תנאי. הבעיה היא סימן ה-= היחיד.'],
        }),
        opt('18 must be written in quotes.', 'צריך לכתוב את 18 במירכאות.', {
          feedback: ['Comparing with a number is fine; "18" in quotes would be text and never equal to a number.', 'השוואה למספר בסדר גמור; "18" במירכאות היה טקסט, שאף פעם לא שווה למספר.'],
        }),
      ],
      ['if', 'equality'],
    ),
  ],

  recap: [
    list([
      ['`if condition:` runs its block only when the condition is `True`.', '`if condition:` מריץ את הבלוק שלו רק כשהתנאי הוא `True`.'],
      ['The colon ends the `if` line; the block below it is indented by four spaces.', 'הנקודתיים מסיימות את שורת ה-`if`; הבלוק שמתחתיה מוזח בארבעה רווחים.'],
      ['The first unindented line after the block runs in every case.', 'השורה הראשונה שאינה מוזחת אחרי הבלוק רצה בכל מקרה.'],
      ['`else:` holds the block for when the condition is `False`; exactly one of the two blocks runs.', '`else:` מחזיק את הבלוק למקרה שהתנאי הוא `False`; בדיוק אחד משני הבלוקים רץ.'],
      ['A missing colon, a missing indentation, or `=` instead of `==` — the error message tells you which.', 'נקודתיים חסרות, הזחה חסרה, או `=` במקום `==` — הודעת השגיאה אומרת לכם מה מהם.'],
    ]),
    p(
      'Your programs can now take two different paths. That is the heart of every game, form and app: look at a value, decide, act.',
      'התוכניות שלכם יכולות עכשיו ללכת בשני מסלולים שונים. זה הלב של כל משחק, טופס ואפליקציה: מסתכלים על ערך, מחליטים, פועלים.',
    ),
  ],
  next: t(
    'Next you will handle more than two paths with elif — for example turning a score into a grade letter.',
    'בשיעור הבא תטפלו ביותר משני מסלולים בעזרת `elif` — למשל, הפיכת ציון מספרי לאות.',
  ),
};
