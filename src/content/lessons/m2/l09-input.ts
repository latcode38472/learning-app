import type { Lesson } from '../../schema';
import {
  p,
  h,
  code,
  list,
  callout,
  term,
  t,
  opt,
  choice,
  exercise,
  outputTest,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l09-input',
  moduleId: 'm2',
  title: t('input: asking the user a question', 'input: לשאול את המשתמש שאלה'),
  tagline: t('Programs that listen, not only talk.', 'תוכניות שמקשיבות, לא רק מדברות.'),
  estimatedMinutes: 25,
  introduces: ['input', 'input-is-text'],
  requires: ['print', 'variable', 'type-conversion', 'string'],
  runsInBrowser: true,

  objective: t(
    'Read what the user types with input(), store it in a variable, and convert it to a number when you need to calculate with it.',
    'לקרוא את מה שהמשתמש מקליד בעזרת `input()`, לשמור את זה במשתנה, ולהמיר למספר כשצריך לחשב איתו.',
  ),
  prerequisiteCheck: t(
    'You can store values in variables and convert text to numbers with int() and float() (lessons 6 and 8).',
    'אתם יודעים לשמור ערכים במשתנים ולהמיר טקסט למספרים בעזרת `int()` ו-`float()` (שיעורים 6 ו-8).',
  ),

  explanation: [
    p(
      'Until now your programs only talked. With `input()` they can also listen. When Python reaches `input()`, the program **pauses** and waits for the user to type a line and press Enter. The typed text is then handed to your program, and you usually store it in a variable.',
      'עד עכשיו התוכניות שלכם רק דיברו. עם `input()` הן יכולות גם להקשיב. כשפייתון מגיע ל-`input()`, התוכנית **עוצרת** ומחכה שהמשתמש יקליד שורה וילחץ Enter. הטקסט שהוקלד מועבר לתוכנית שלכם, ובדרך כלל שומרים אותו במשתנה.',
    ),
    term(
      'input()',
      'Shows the text you give it (the **prompt**), waits for the user to type a line, and hands that line back. `name = input("Your name: ")` shows the prompt, waits, and stores the answer in `name`. End the prompt with a space, so the cursor does not stick to the question.',
      'מציגה את הטקסט שנותנים לה (ה**הנחיה**, prompt), מחכה שהמשתמש יקליד שורה, ומחזירה את השורה הזאת. `name = input("Your name: ")` מציגה את ההנחיה, מחכה, ושומרת את התשובה ב-`name`. סיימו את ההנחיה ברווח, כדי שהסמן לא יידבק לשאלה.',
    ),
    code(py`
      name = input("What is your name? ")
      print("Nice to meet you,", name)
    `, {
      output: 'What is your name? Maya\nNice to meet you, Maya',
      caption: t('If the user types Maya, the console shows:', 'אם המשתמש מקליד Maya, הקונסול מציג:'),
    }),
    callout(
      'note',
      'In this app, the console under the code lets you type answers while the program waits. In exercises the app pre-fills sample answers, so you can press Run right away — feel free to change them. When your program is checked automatically, the checker types the answers for you and compares **only what print prints**: the prompt text is not compared, so word your questions however you like.',
      'באפליקציה הזאת, הקונסול שמתחת לקוד מאפשר לכם להקליד תשובות בזמן שהתוכנית מחכה. בתרגילים האפליקציה ממלאת מראש תשובות לדוגמה, כדי שתוכלו ללחוץ על Run מיד — אתם מוזמנים לשנות אותן. כשהתוכנית שלכם נבדקת אוטומטית, הבודק מקליד את התשובות בשבילכם ומשווה **רק את מה ש-`print` מדפיס**: טקסט ההנחיה לא מושווה, ולכן נסחו את השאלות שלכם איך שתרצו.',
      t('How input works in this app', 'איך קלט עובד באפליקציה הזאת'),
    ),
    h('The answer is always text', 'התשובה היא תמיד טקסט'),
    p(
      'Whatever the user types, `input()` gives you a **string** — even when they typed digits. If the user types `25`, you get `"25"`: the two characters 2 and 5, not the number twenty-five. So `"25" + 5` fails with a TypeError (lesson 8), and `"25" * 2` gives `"2525"`.',
      'לא משנה מה המשתמש מקליד, `input()` נותנת לכם **מחרוזת** — גם כשהוקלדו ספרות. אם המשתמש מקליד `25`, אתם מקבלים `"25"`: שני התווים 2 ו-5, לא המספר עשרים וחמש. לכן `"25" + 5` נכשל עם TypeError (שיעור 8), ו-`"25" * 2` נותן `"2525"`.',
    ),
    code(py`
      age = input("Your age: ")
      print(type(age))
    `, {
      output: "Your age: 25\n<class 'str'>",
      caption: t('The user types 25:', 'המשתמש מקליד 25:'),
    }),
    p(
      'To calculate with the answer, convert it with `int()` or `float()`. You can do that in two steps, or in one line by putting `input(...)` inside `int(...)`: Python runs the inner call first (it asks and waits), then hands the answer to `int()`.',
      'כדי לחשב עם התשובה, המירו אותה בעזרת `int()` או `float()`. אפשר לעשות את זה בשני שלבים, או בשורה אחת על ידי הכנסת `input(...)` לתוך `int(...)`: פייתון מריץ קודם את הקריאה הפנימית (היא שואלת ומחכה), ואז מעביר את התשובה ל-`int()`.',
    ),
    code(py`
      age = input("Your age: ")
      age = int(age)
      print("Next year you will be", age + 1)

      height = float(input("Height in metres: "))
      print("In centimetres:", height * 100)
    `, {
      output: 'Your age: 25\nNext year you will be 26\nHeight in metres: 1.75\nIn centimetres: 175.0',
      caption: t('With the answers 25 and 1.75:', 'עם התשובות 25 ו-1.75:'),
    }),
    callout(
      'warning',
      'If the user types something that is not a number, `int()` stops the program with a ValueError. For now, assume the user answers properly. In module 7 you will learn how to handle wrong answers gracefully.',
      'אם המשתמש מקליד משהו שאינו מספר, `int()` עוצרת את התוכנית עם ValueError. בינתיים, הניחו שהמשתמש עונה כמו שצריך. במודול 7 תלמדו לטפל בתשובות שגויות בצורה נעימה.',
    ),
  ],

  simpler: [
    p(
      '`input()` is like a waiter with a notepad. It asks your question, stands there until the customer finishes talking, and brings back exactly what was said — written down as words.',
      '`input()` היא כמו מלצר עם פנקס. היא שואלת את השאלה שלכם, עומדת שם עד שהלקוח מסיים לדבר, ומביאה בחזרה בדיוק את מה שנאמר — כתוב כמילים.',
    ),
    p(
      'Even if the customer said "twenty-five", the notepad holds words, not a number you can add to. `int()` reads the words and turns them into a real number.',
      'גם אם הלקוח אמר "עשרים וחמש", בפנקס יש מילים, לא מספר שאפשר לחבר אליו. `int()` קורא את המילים והופך אותן למספר אמיתי.',
    ),
    p(
      'The text inside `input("...")` is only the question the waiter asks. The answer is what matters — save it in a variable so you can use it later.',
      'הטקסט שבתוך `input("...")` הוא רק השאלה שהמלצר שואל. התשובה היא מה שחשוב — שמרו אותה במשתנה כדי שתוכלו להשתמש בה אחר כך.',
    ),
  ],

  workedExample: [
    p(
      'A small age calculator. Run it, answer the two questions in the console, and compare with the walkthrough below.',
      'מחשבון גיל קטן. הריצו אותו, ענו על שתי השאלות בקונסול, והשוו להסבר שלמטה.',
    ),
    code(py`
      name = input("Name: ")
      year = int(input("Birth year: "))
      age = 2026 - year
      print("Hello,", name)
      print("This year you turn", age)
    `),
    list([
      ['Line 1 asks for a name and waits. The answer, say `Dana`, is stored as text in `name`.', 'שורה 1 מבקשת שם ומחכה. התשובה, נניח `Dana`, נשמרת כטקסט ב-`name`.'],
      ['Line 2 asks for a year. The answer `"2010"` arrives as text, so `int()` turns it into the number 2010 before it is stored.', 'שורה 2 מבקשת שנה. התשובה `"2010"` מגיעה כטקסט, ולכן `int()` הופכת אותה למספר 2010 לפני השמירה.'],
      ['Line 3 subtracts: `2026 - 2010` is `16`. This works only because `year` is a number now.', 'שורה 3 מחסרת: `2026 - 2010` הוא `16`. זה עובד רק כי `year` הוא עכשיו מספר.'],
      ['Lines 4–5 print the results. Try it with your own name and year.', 'שורות 4–5 מדפיסות את התוצאות. נסו עם השם והשנה שלכם.'],
    ], true),
    code(py`
      Name: Dana
      Birth year: 2010
      Hello, Dana
      This year you turn 16
    `, { lang: 'text', caption: t('The console, when the user types Dana and 2010', 'הקונסול, כשהמשתמש מקליד Dana ו-2010'), runnable: false }),
  ],

  moreExamples: [
    [
      h('Two numbers', 'שני מספרים'),
      code(py`
        a = int(input("First number: "))
        b = int(input("Second number: "))
        print("Sum:", a + b)
        print("Product:", a * b)
      `, {
        output: 'First number: 6\nSecond number: 7\nSum: 13\nProduct: 42',
        caption: t('With the answers 6 and 7:', 'עם התשובות 6 ו-7:'),
      }),
      p(
        'Each answer is converted as soon as it arrives, so `a` and `b` are ints and the arithmetic works. Without the two `int()` calls, `a + b` would glue the texts into `"67"`, and `a * b` would be a TypeError.',
        'כל תשובה מומרת ברגע שהיא מגיעה, ולכן `a` ו-`b` הם int והחישוב עובד. בלי שתי הקריאות ל-`int()`, `a + b` היה מדביק את הטקסטים ל-`"67"`, ו-`a * b` היה TypeError.',
      ),
    ],
    [
      h('The answer used as text', 'התשובה בשימוש כטקסט'),
      code(py`
        word = input("Type a word: ")
        print(word, word, word)
      `, {
        output: 'Type a word: echo\necho echo echo',
        caption: t('With the answer echo:', 'עם התשובה echo:'),
      }),
      p(
        'Text answers need no conversion. Use them as they are: print them, store them, or combine them with other text.',
        'תשובות טקסט לא צריכות המרה. השתמשו בהן כמו שהן: הדפיסו אותן, שמרו אותן, או שלבו אותן עם טקסט אחר.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l09-hard',
    title: ['Split the bill', 'לחלק את החשבון'],
    mode: 'complete',
    instructions: [
      p(
        'Fill in the two gaps. Ask for the bill total (a decimal number, so use `float()`) and then for the number of people (a whole number, so use `int()`). Any prompt text is fine. The last line prints `Each pays: ` followed by the total divided by the number of people. For 100 and 4 it prints `Each pays: 25.0`.',
        'מלאו את שני החורים. בקשו את סכום החשבון (מספר עשרוני, לכן השתמשו ב-`float()`) ואחר כך את מספר האנשים (מספר שלם, לכן השתמשו ב-`int()`). כל טקסט הנחיה מתאים. השורה האחרונה מדפיסה `Each pays: ` ואחריו הסכום חלקי מספר האנשים. עבור 100 ו-4 היא מדפיסה `Each pays: 25.0`.',
      ),
    ],
    starterCode: py`
      # ... ask for the bill total (a decimal number) and store it in total

      # ... ask for the number of people (a whole number) and store it in people

      print("Each pays:", total / people)
    `,
    sampleStdin: ['100', '4'],
    check: {
      tests: [
        outputTest('Each pays: 25.0', { stdin: ['100', '4'] }),
        outputTest('Each pays: 17.5', { stdin: ['87.5', '5'] }),
        outputTest('Each pays: 7.5', { stdin: ['60', '8'] }),
      ],
    },
    hints: [
      ['Each gap is one line: a variable, `=`, a conversion, and `input(...)` inside it.', 'כל חור הוא שורה אחת: משתנה, `=`, המרה, ו-`input(...)` בתוכה.'],
      ['The total can have a decimal point, so: `total = float(input("Total: "))`.', 'לסכום יכולה להיות נקודה עשרונית, ולכן: `total = float(input("Total: "))`.'],
      ['The number of people is whole: `people = int(input("People: "))`.', 'מספר האנשים שלם: `people = int(input("People: "))`.'],
    ],
    solution: py`
      total = float(input("Total: "))

      people = int(input("People: "))

      print("Each pays:", total / people)
    `,
    concepts: ['input', 'type-conversion', 'float'],
  }),

  predict: {
    code: py`
      # the user typed 12, so input() gave us:
      answer = "12"
      print(answer * 2)
      print(int(answer) * 2)
    `,
    prompt: t('What does this program print? (two lines)', 'מה התוכנית הזאת תדפיס? (שתי שורות)'),
    answer: '1212\n24',
    explanation: t(
      'input() always gives text, so `answer` is the string "12". Text times 2 is the text repeated: 1212. `int(answer)` turns it into the number 12, and 12 times 2 is 24.',
      '`input()` תמיד נותנת טקסט, ולכן `answer` הוא המחרוזת "12". טקסט כפול 2 הוא הטקסט משוכפל: 1212. `int(answer)` הופך אותו למספר 12, ו-12 כפול 2 הוא 24.',
    ),
  },

  exercise: exercise({
    id: 'l09-ex',
    title: ['Hello, and ten years on', 'שלום, ועוד עשר שנים'],
    mode: 'write',
    instructions: [
      p(
        'Ask the user for their name, then for their age (any prompt text is fine). Print two lines: `Hello, ` followed by the name, and `In 10 years: ` followed by the age plus 10. For the answers `Maya` and `12` the output is:',
        'בקשו מהמשתמש את שמו, ואחר כך את גילו (כל טקסט הנחיה מתאים). הדפיסו שתי שורות: `Hello, ` ואחריו השם, ו-`In 10 years: ` ואחריו הגיל ועוד 10. עבור התשובות `Maya` ו-`12` הפלט הוא:',
      ),
      code('Hello, Maya\nIn 10 years: 22', { lang: 'text', runnable: false }),
      p(
        'Tip: `print("Hello,", name)` prints the comma, a space and then the name.',
        'טיפ: `print("Hello,", name)` מדפיס את הפסיק, רווח ואז את השם.',
      ),
    ],
    starterCode: py`
      # 1. ask for the name and store it

      # 2. ask for the age, convert it to a number, and store it

      # 3. print the two lines

    `,
    sampleStdin: ['Maya', '12'],
    check: {
      tests: [
        outputTest('Hello, Maya\nIn 10 years: 22', { stdin: ['Maya', '12'] }),
        outputTest('Hello, Tom\nIn 10 years: 50', { stdin: ['Tom', '40'] }),
      ],
    },
    hints: [
      ['Start with `name = input("Name: ")`. The name is text, so it needs no conversion.', 'התחילו עם `name = input("Name: ")`. השם הוא טקסט, ולכן הוא לא צריך המרה.'],
      ['The age must become a number: `age = int(input("Age: "))`.', 'הגיל חייב להפוך למספר: `age = int(input("Age: "))`.'],
      ['Then `print("Hello,", name)` and `print("In 10 years:", age + 10)`.', 'ואז `print("Hello,", name)` ו-`print("In 10 years:", age + 10)`.'],
    ],
    solution: py`
      name = input("Name: ")
      age = int(input("Age: "))
      print("Hello,", name)
      print("In 10 years:", age + 10)
    `,
    concepts: ['input', 'input-is-text', 'type-conversion'],
  }),

  build: exercise({
    id: 'l09-build',
    title: ['A pizza order', 'הזמנת פיצה'],
    mode: 'build',
    instructions: [
      p(
        'Build a small ordering tool. Ask three questions, in this order: the customer\'s name, the number of pizzas, and the number of drinks (any prompt texts). A pizza costs 35 and a drink costs 8. Then print four lines: `Order for ` with the name, `Pizzas: ` with the number, `Drinks: ` with the number, and `Total: ` with the total price. For `Dana`, `3` and `2`:',
        'בנו כלי הזמנות קטן. שאלו שלוש שאלות, בסדר הזה: שם הלקוח, מספר הפיצות, ומספר המשקאות (כל טקסטי הנחיה מתאימים). פיצה עולה 35 ומשקה עולה 8. אחר כך הדפיסו ארבע שורות: `Order for ` עם השם, `Pizzas: ` עם המספר, `Drinks: ` עם המספר, ו-`Total: ` עם המחיר הכולל. עבור `Dana`, `3` ו-`2`:',
      ),
      code('Order for Dana\nPizzas: 3\nDrinks: 2\nTotal: 121', { lang: 'text', runnable: false }),
    ],
    starterCode: py`
      # ask for the name, the number of pizzas and the number of drinks

      # calculate the total: 35 per pizza, 8 per drink

      # print the four lines

    `,
    sampleStdin: ['Dana', '3', '2'],
    check: {
      tests: [
        outputTest('Order for Dana\nPizzas: 3\nDrinks: 2\nTotal: 121', { stdin: ['Dana', '3', '2'] }),
        outputTest('Order for Omer\nPizzas: 1\nDrinks: 0\nTotal: 35', { stdin: ['Omer', '1', '0'] }),
        outputTest('Order for Noa\nPizzas: 2\nDrinks: 4\nTotal: 102', { stdin: ['Noa', '2', '4'] }),
      ],
    },
    hints: [
      ['Three inputs: the name stays text; the two numbers need `int()`.', 'שלוש קריאות `input`: השם נשאר טקסט; שני המספרים צריכים `int()`.'],
      ['The total is `pizzas * 35 + drinks * 8`. Store it in a variable.', 'הסכום הוא `pizzas * 35 + drinks * 8`. שמרו אותו במשתנה.'],
      ['Print each line with a label and a value: `print("Order for", name)`, `print("Pizzas:", pizzas)`, and so on.', 'הדפיסו כל שורה עם תווית וערך: `print("Order for", name)`, `print("Pizzas:", pizzas)`, וכן הלאה.'],
    ],
    solution: py`
      name = input("Name: ")
      pizzas = int(input("How many pizzas? "))
      drinks = int(input("How many drinks? "))

      total = pizzas * 35 + drinks * 8

      print("Order for", name)
      print("Pizzas:", pizzas)
      print("Drinks:", drinks)
      print("Total:", total)
    `,
    concepts: ['input', 'type-conversion', 'arithmetic', 'print-multiple'],
  }),

  check: [
    choice(
      'l09-c1',
      ['What kind of value does `input()` give back?', 'איזה סוג ערך `input()` מחזירה?'],
      [
        opt('Always a string, even when the user typed digits.', 'תמיד מחרוזת, גם כשהמשתמש הקליד ספרות.', {
          correct: true,
          feedback: ['Right. Whatever is typed arrives as text. Convert it yourself when you need a number.', 'נכון. כל מה שמוקלד מגיע כטקסט. המירו אותו בעצמכם כשאתם צריכים מספר.'],
        }),
        opt('An int when the user typed digits, otherwise a string.', 'int כשהמשתמש הקליד ספרות, אחרת מחרוזת.', {
          feedback: ['input() never guesses. Digits arrive as text too, which is why `"25" + 5` fails.', '`input()` אף פעם לא מנחשת. גם ספרות מגיעות כטקסט, ולכן `"25" + 5` נכשל.'],
        }),
        opt('It depends on the prompt text.', 'זה תלוי בטקסט ההנחיה.', {
          feedback: ['The prompt is only shown to the user; it has no effect on the answer, which is always text.', 'ההנחיה רק מוצגת למשתמש; אין לה השפעה על התשובה, שהיא תמיד טקסט.'],
        }),
      ],
      ['input-is-text'],
    ),
    choice(
      'l09-c2',
      ['The user types `8` at `n = input("Number: ")`. What does `print(n + 1)` do?', 'המשתמש מקליד `8` ב-`n = input("Number: ")`. מה עושה `print(n + 1)`?'],
      [
        opt('It stops with a TypeError.', 'זה נעצר עם TypeError.', {
          correct: true,
          feedback: ['Yes. `n` is the text "8", and text plus a number is a type mismatch.', 'כן. `n` הוא הטקסט "8", וטקסט ועוד מספר זו אי-התאמת טיפוסים.'],
        }),
        opt('It prints 9.', 'זה מדפיס 9.', {
          feedback: ['That needs `int(n) + 1`. Without the conversion, `n` is text.', 'בשביל זה צריך `int(n) + 1`. בלי ההמרה, `n` הוא טקסט.'],
        }),
        opt('It prints 81.', 'זה מדפיס 81.', {
          feedback: ['81 would come from `n + "1"` — two strings glued together. Here 1 is a number, so Python refuses.', '81 היה מתקבל מ-`n + "1"` — שתי מחרוזות מודבקות. כאן 1 הוא מספר, ולכן פייתון מסרב.'],
        }),
      ],
      ['input-is-text', 'type-mismatch'],
    ),
    choice(
      'l09-c3',
      ['Which line reads a whole number from the user, ready for arithmetic?', 'איזו שורה קוראת מספר שלם מהמשתמש, מוכן לחישובים?'],
      [
        opt('`n = int(input("Number: "))`', '`n = int(input("Number: "))`', {
          correct: true,
          feedback: ['Correct. input() asks and returns text; int() converts it; the number is stored in n.', 'נכון. `input()` שואלת ומחזירה טקסט; `int()` ממירה אותו; המספר נשמר ב-n.'],
        }),
        opt('`n = input("Number: ")`', '`n = input("Number: ")`', {
          feedback: ['This stores text. You would still need `int(n)` before adding or multiplying.', 'זה שומר טקסט. עדיין תצטרכו `int(n)` לפני חיבור או כפל.'],
        }),
        opt('`n = input(int("Number: "))`', '`n = input(int("Number: "))`', {
          feedback: ['This tries to convert the prompt text to a number and fails with a ValueError. The conversion belongs around input(), not inside it.', 'זה מנסה להמיר את טקסט ההנחיה למספר ונכשל עם ValueError. ההמרה צריכה לעטוף את `input()`, לא להיות בתוכה.'],
        }),
      ],
      ['input', 'type-conversion'],
    ),
  ],

  recap: [
    list([
      ['`input("question ")` shows the question, waits for a line, and gives it back.', '`input("question ")` מציגה את השאלה, מחכה לשורה, ומחזירה אותה.'],
      ['Store the answer in a variable to use it later.', 'שמרו את התשובה במשתנה כדי להשתמש בה אחר כך.'],
      ['The answer is always a string. For math, convert it with `int()` or `float()`.', 'התשובה היא תמיד מחרוזת. לחישובים, המירו אותה בעזרת `int()` או `float()`.'],
      ['`int(input("..."))` asks and converts in one line.', '`int(input("..."))` שואלת וממירה בשורה אחת.'],
      ['During automatic checks only what print prints is compared; the prompt wording is up to you.', 'בבדיקות אוטומטיות מושווה רק מה ש-`print` מדפיס; ניסוח ההנחיה נתון לבחירתכם.'],
    ]),
    p(
      'With input, your programs are no longer fixed scripts: the same code gives a different result for every person who runs it. That is what makes a program feel like a real tool.',
      'עם קלט, התוכניות שלכם כבר לא תסריטים קבועים: אותו קוד נותן תוצאה שונה לכל מי שמריץ אותו. זה מה שגורם לתוכנית להרגיש כמו כלי אמיתי.',
    ),
  ],
  next: t(
    'Next you will learn f-strings — the neat way to mix text and values into exactly the message you want, without fighting with spaces and commas.',
    'בשיעור הבא תלמדו מחרוזות f — הדרך הנוחה לשלב טקסט וערכים בדיוק להודעה שאתם רוצים, בלי להילחם ברווחים ובפסיקים.',
  ),
};
