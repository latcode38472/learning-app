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
  pythonTest,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l21-parameters',
  moduleId: 'm5',
  title: t('Parameters: giving a function information', 'פרמטרים: להעביר מידע לפונקציה'),
  tagline: t('The same steps, with different values each time.', 'אותם צעדים, עם ערכים אחרים בכל פעם.'),
  estimatedMinutes: 25,
  introduces: ['parameter', 'argument', 'default-parameter'],
  requires: ['function', 'def', 'call', 'f-string', 'variable', 'arithmetic'],
  runsInBrowser: true,

  objective: t(
    'Write functions that receive values through parameters, call them with different arguments, and give a parameter a default value.',
    'לכתוב פונקציות שמקבלות ערכים דרך פרמטרים, לקרוא להן עם ארגומנטים שונים, ולתת לפרמטר ערך ברירת מחדל.',
  ),
  prerequisiteCheck: t(
    'You can define a function with def and call it, and you can build text with f-strings (lessons 10 and 20).',
    'אתם יודעים להגדיר פונקציה עם `def` ולקרוא לה, ולבנות טקסט בעזרת f-strings (שיעורים 10 ו-20).',
  ),

  explanation: [
    p(
      'In the last lesson `greet()` printed the same text every time. Real functions usually need details: whom to greet, how many stars to print, what price to show. A **parameter** is a name written inside the parentheses of the `def` line. It works like a variable that receives its value from whoever calls the function.',
      'בשיעור הקודם `greet()` הדפיסה בכל פעם את אותו טקסט. פונקציות אמיתיות צריכות בדרך כלל פרטים: את מי לברך, כמה כוכביות להדפיס, איזה מחיר להציג. **פרמטר** (parameter) הוא שם שכותבים בתוך הסוגריים של שורת ה-`def`. הוא עובד כמו משתנה שמקבל את ערכו ממי שקורא לפונקציה.',
    ),
    code(py`
      def greet(name):
          print(f"Hello, {name}")

      greet("Maya")
      greet("Noa")
    `, { output: 'Hello, Maya\nHello, Noa' }),
    term(
      'parameter',
      'A parameter is the name inside the parentheses of the definition: `name` in `def greet(name):`. Inside the body you use it like any variable. Each call gives it a fresh value.',
      'פרמטר הוא השם שבתוך הסוגריים של ההגדרה: `name` ב-`def greet(name):`. בתוך הגוף משתמשים בו כמו בכל משתנה. כל קריאה נותנת לו ערך חדש.',
    ),
    term(
      'argument',
      'An **argument** is the value you put inside the parentheses when you call: `"Maya"` in `greet("Maya")`. Python copies the argument into the parameter and then runs the body. Memory aid: the parameter is the blank in the form, the argument is what you write in the blank.',
      '**ארגומנט** (argument) הוא הערך שאתם שמים בתוך הסוגריים כשאתם קוראים לפונקציה: `"Maya"` ב-`greet("Maya")`. פייתון מעתיק את הארגומנט לתוך הפרמטר ואז מריץ את הגוף. עזר לזיכרון: הפרמטר הוא המקום הריק בטופס, הארגומנט הוא מה שכותבים בו.',
    ),
    h('More than one parameter', 'יותר מפרמטר אחד'),
    p(
      'Separate parameters with commas. The arguments are matched **by position**: the first argument goes into the first parameter, the second into the second. The number of arguments must equal the number of parameters, otherwise Python stops with a TypeError.',
      'מפרידים בין פרמטרים בפסיקים. הארגומנטים מותאמים **לפי המיקום**: הארגומנט הראשון נכנס לפרמטר הראשון, השני לשני. מספר הארגומנטים חייב להיות שווה למספר הפרמטרים, אחרת פייתון עוצר עם שגיאת TypeError.',
    ),
    code(py`
      def rectangle_area(width, height):
          print(width * height)

      rectangle_area(3, 4)
      rectangle_area(10, 2)
    `, { output: '12\n20' }),
    h('Default values', 'ערכי ברירת מחדל'),
    term(
      'greeting="Hello"',
      'A parameter can have a **default value**, written with `=` in the `def` line: `def greet(name, greeting="Hello"):`. If the call does not give an argument for it, the default is used; if it does, the given value wins. Parameters with defaults must come after the ones without.',
      'לפרמטר יכול להיות **ערך ברירת מחדל** (default value), שנכתב עם `=` בשורת ה-`def`: `def greet(name, greeting="Hello"):`. אם הקריאה לא נותנת לו ארגומנט, משתמשים בברירת המחדל; אם היא כן נותנת, הערך שניתן גובר. פרמטרים עם ברירת מחדל חייבים לבוא אחרי אלה שבלי.',
    ),
    code(py`
      def greet(name, greeting="Hello"):
          print(f"{greeting}, {name}")

      greet("Maya")
      greet("Noa", "Good morning")
    `, { output: 'Hello, Maya\nGood morning, Noa' }),
    callout(
      'why',
      'Parameters are what make a function reusable. Without them you would need `greet_maya()`, `greet_noa()` and a new function for every person. With one parameter, one function serves everyone. Default values make the common case short and the special case still possible.',
      'הפרמטרים הם מה שהופך פונקציה לרב-שימושית. בלעדיהם הייתם צריכים `greet_maya()`, `greet_noa()` ופונקציה חדשה לכל אדם. עם פרמטר אחד, פונקציה אחת משרתת את כולם. ערכי ברירת מחדל הופכים את המקרה הרגיל לקצר, ואת המקרה המיוחד לעדיין אפשרי.',
      t('Why parameters?', 'למה פרמטרים?'),
    ),
  ],

  simpler: [
    p(
      'Think of a form with a blank: "Dear ______, welcome!". The blank is the parameter. When you fill in a name, that name is the argument. The same form works for everyone.',
      'חשבו על טופס עם מקום ריק: "שלום ______, ברוכים הבאים!". המקום הריק הוא הפרמטר. כשאתם ממלאים שם, השם הזה הוא הארגומנט. אותו טופס עובד לכולם.',
    ),
    p(
      '`def greet(name):` makes a form with one blank called `name`. `greet("Maya")` fills the blank with Maya and runs the steps.',
      '`def greet(name):` יוצר טופס עם מקום ריק אחד בשם `name`. `greet("Maya")` ממלא את המקום הריק ב-Maya ומריץ את הצעדים.',
    ),
    p(
      'Two blanks mean two values, in the same order. A default value is a blank that is already filled in with pencil: you can leave it, or write something else over it.',
      'שני מקומות ריקים פירושם שני ערכים, באותו סדר. ערך ברירת מחדל הוא מקום ריק שכבר מולא בעיפרון: אפשר להשאיר אותו, או לכתוב עליו משהו אחר.',
    ),
  ],

  workedExample: [
    p(
      'This program prints two lines of a shopping bill. Press play and watch the parameters receive a different value at each call.',
      'התוכנית הזאת מדפיסה שתי שורות של חשבון קניות. לחצו על הפעלה וראו איך הפרמטרים מקבלים ערך אחר בכל קריאה.',
    ),
    viz(py`
      def show_line(item, price, quantity):
          total = price * quantity
          print(f"{quantity} x {item} = {total}")

      show_line("apple", 3, 4)
      show_line("melon", 12, 2)
    `),
    list([
      ['Line 1 defines `show_line` with three parameters: `item`, `price` and `quantity`.', 'שורה 1 מגדירה את `show_line` עם שלושה פרמטרים: `item`, `price` ו-`quantity`.'],
      ['Line 5 calls it with the arguments `"apple"`, `3`, `4`. By position, `item` becomes `"apple"`, `price` becomes `3` and `quantity` becomes `4`.', 'שורה 5 קוראת לה עם הארגומנטים `"apple"`, `3`, `4`. לפי המיקום, `item` הופך ל-`"apple"`, `price` ל-`3` ו-`quantity` ל-`4`.'],
      ['Line 2 computes `total` and line 3 prints `4 x apple = 12`.', 'שורה 2 מחשבת את `total` ושורה 3 מדפיסה `4 x apple = 12`.'],
      ['Line 6 calls again with new arguments; the same body now prints `2 x melon = 24`.', 'שורה 6 קוראת שוב עם ארגומנטים חדשים; אותו גוף מדפיס עכשיו `2 x melon = 24`.'],
    ], true),
    code(py`
      4 x apple = 12
      2 x melon = 24
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('A default value for a number', 'ערך ברירת מחדל למספר'),
      code(py`
        def stars(count=5):
            print("*" * count)

        stars()
        stars(2)
        stars(8)
      `, { output: '*****\n**\n********' }),
      p(
        '`stars()` with no argument uses the default 5. `stars(2)` and `stars(8)` override it.',
        '`stars()` בלי ארגומנט משתמשת בברירת המחדל 5. `stars(2)` ו-`stars(8)` דורסות אותה.',
      ),
    ],
    [
      h('Order matters', 'הסדר חשוב'),
      code(py`
        def introduce(name, age):
            print(f"{name} is {age} years old")

        introduce("Dana", 9)
        introduce(9, "Dana")
      `, { output: 'Dana is 9 years old\n9 is Dana years old' }),
      p(
        'Python does not know what the values mean; it only matches them by position. The second call is not an error, just nonsense. Keep the arguments in the order of the parameters.',
        'פייתון לא יודע מה משמעות הערכים; הוא רק מתאים אותם לפי המיקום. הקריאה השנייה אינה שגיאה, פשוט שטות. שמרו על הארגומנטים בסדר של הפרמטרים.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l21-hard',
    title: ['A box of any size', 'קופסה בכל גודל'],
    mode: 'write',
    instructions: [
      p(
        'Define a function `box(width, height)` that prints a rectangle made of `#` characters: `height` rows, each row `width` characters wide. Use a loop and string repetition. Then call `box(4, 2)` and `box(2, 3)`.',
        'הגדירו פונקציה `box(width, height)` שמדפיסה מלבן של תווי `#`: `height` שורות, כל שורה ברוחב `width` תווים. השתמשו בלולאה ובהכפלת מחרוזת. אחר כך קראו ל-`box(4, 2)` ול-`box(2, 3)`.',
      ),
    ],
    starterCode: py`
      # define box(width, height)


      box(4, 2)
      box(2, 3)
    `,
    check: {
      tests: [
        outputTest('####\n####\n##\n##\n##'),
        pythonTest(py`
          import io, sys
          assert callable(ns.get("box")), "Define a function called box."

          def capture(*args):
              buf = io.StringIO()
              saved = sys.stdout
              sys.stdout = buf
              ns["box"](*args)
              sys.stdout = saved
              return buf.getvalue().rstrip()

          assert capture(5, 1) == "#####", "box(5, 1) should print one row of five # characters."
          assert capture(3, 2) == "###\n###", "box(3, 2) should print two rows of three # characters."
        `),
      ],
    },
    hints: [
      ['The def line needs two parameters: `def box(width, height):`.', 'שורת ה-`def` צריכה שני פרמטרים: `def box(width, height):`.'],
      ['One row is `"#" * width`. Print it `height` times with `for i in range(height):`.', 'שורה אחת היא `"#" * width`. הדפיסו אותה `height` פעמים עם `for i in range(height):`.'],
      ['The whole body is two lines: the for line and, indented under it, `print("#" * width)`.', 'כל הגוף הוא שתי שורות: שורת ה-`for` ומתחתיה, מוזח, `print("#" * width)`.'],
    ],
    solution: py`
      def box(width, height):
          for i in range(height):
              print("#" * width)


      box(4, 2)
      box(2, 3)
    `,
    concepts: ['parameter', 'argument', 'for', 'string-repeat'],
  }),

  predict: {
    code: py`
      def greet(name, greeting="Hi"):
          print(f"{greeting} {name}")

      greet("Sam")
      greet("Sam", "Bye")
    `,
    prompt: t('What does this program print?', 'מה התוכנית הזאת תדפיס?'),
    answer: 'Hi Sam\nBye Sam',
    explanation: t(
      'The first call gives only name, so greeting keeps its default "Hi". The second call gives both arguments, so greeting is "Bye".',
      'הקריאה הראשונה נותנת רק את `name`, ולכן `greeting` שומר על ברירת המחדל "Hi". הקריאה השנייה נותנת את שני הארגומנטים, ולכן `greeting` הוא "Bye".',
    ),
  },

  exercise: exercise({
    id: 'l21-ex',
    title: ['Describe a pet', 'תיאור של חיית מחמד'],
    mode: 'complete',
    instructions: [
      p(
        'Complete the function `describe_pet(name, animal)` so that it prints one line in the shape `Rex is a dog` — the name, then ` is a `, then the animal. Then add a third call for a parrot called `Polly`. The output should be three lines: `Rex is a dog`, `Tom is a cat`, `Polly is a parrot`.',
        'השלימו את הפונקציה `describe_pet(name, animal)` כך שתדפיס שורה אחת בצורה `Rex is a dog` — השם, אחריו ` is a `, ואחריו סוג החיה. אחר כך הוסיפו קריאה שלישית לתוכי (`parrot`) בשם `Polly`. הפלט צריך להיות שלוש שורות: `Rex is a dog`, `Tom is a cat`, `Polly is a parrot`.',
      ),
    ],
    starterCode: py`
      def describe_pet(name, animal):
          # print the line, for example: Rex is a dog
          # ...


      describe_pet("Rex", "dog")
      describe_pet("Tom", "cat")
      # add a call for Polly the parrot
    `,
    check: {
      tests: [
        outputTest('Rex is a dog\nTom is a cat\nPolly is a parrot'),
        pythonTest(py`
          import io, sys
          assert callable(ns.get("describe_pet")), "Keep the function describe_pet."
          buf = io.StringIO()
          saved = sys.stdout
          sys.stdout = buf
          ns["describe_pet"]("Kiki", "bird")
          sys.stdout = saved
          assert buf.getvalue().strip() == "Kiki is a bird", "describe_pet('Kiki', 'bird') should print: Kiki is a bird"
        `),
      ],
    },
    hints: [
      ['Inside the function, use an f-string with both parameters: `f"{name} is a {animal}"`.', 'בתוך הפונקציה השתמשו ב-f-string עם שני הפרמטרים: `f"{name} is a {animal}"`.'],
      ['Replace the `# ...` line with a print of that f-string, keeping the indentation.', 'החליפו את השורה `# ...` ב-`print` של ה-f-string הזה, ושמרו על ההזחה.'],
      ['The third call is `describe_pet("Polly", "parrot")` — name first, animal second.', 'הקריאה השלישית היא `describe_pet("Polly", "parrot")` — קודם השם, אחר כך החיה.'],
    ],
    solution: py`
      def describe_pet(name, animal):
          print(f"{name} is a {animal}")


      describe_pet("Rex", "dog")
      describe_pet("Tom", "cat")
      describe_pet("Polly", "parrot")
    `,
    concepts: ['parameter', 'argument', 'f-string'],
  }),

  build: exercise({
    id: 'l21-build',
    title: ['Party invitations', 'הזמנות למסיבה'],
    mode: 'build',
    instructions: [
      p(
        'Build an invitation printer. Define `invitation(name, day, hour="18:00")` that prints exactly three lines:',
        'בנו מדפסת הזמנות. הגדירו `invitation(name, day, hour="18:00")` שמדפיסה בדיוק שלוש שורות:',
      ),
      code('Dear Maya,\nPlease come on Friday at 18:00.\nSee you there.', { lang: 'text', runnable: false }),
      p(
        'Then invite at least two people of your choice. One of them should get a different hour by passing a third argument, for example `"20:30"`; the other should use the default.',
        'אחר כך הזמינו לפחות שני אנשים לבחירתכם. אחד מהם צריך לקבל שעה אחרת על ידי העברת ארגומנט שלישי, למשל `"20:30"`; השני ישתמש בברירת המחדל.',
      ),
    ],
    starterCode: py`
      # define invitation(name, day, hour="18:00")


      # invite two people; one with a different hour

    `,
    check: {
      tests: [
        pythonTest(py`
          import io, sys
          assert callable(ns.get("invitation")), "Define a function called invitation."

          def capture(*args):
              buf = io.StringIO()
              saved = sys.stdout
              sys.stdout = buf
              ns["invitation"](*args)
              sys.stdout = saved
              return [l.rstrip() for l in buf.getvalue().strip().split("\n")]

          assert capture("Lior", "Sunday") == ["Dear Lior,", "Please come on Sunday at 18:00.", "See you there."], "invitation('Lior', 'Sunday') should print the three lines with the default hour 18:00."
          assert capture("Gal", "Monday", "20:30") == ["Dear Gal,", "Please come on Monday at 20:30.", "See you there."], "A third argument should replace the hour."
          lines = [l.strip() for l in stdout.strip().split("\n") if l.strip()]
          invites = [l for l in lines if l.startswith("Please come on")]
          assert len(invites) >= 2, "Call invitation() for at least two people."
          assert any("18:00" not in l for l in invites), "One call should pass a different hour as a third argument."
          assert any("18:00" in l for l in invites), "One call should use the default hour (only two arguments)."
        `),
      ],
    },
    hints: [
      ['The def line has three parameters and the last one has a default: `def invitation(name, day, hour="18:00"):`.', 'בשורת ה-`def` יש שלושה פרמטרים ולאחרון יש ברירת מחדל: `def invitation(name, day, hour="18:00"):`.'],
      ['Print three lines with f-strings: `f"Dear {name},"`, then `f"Please come on {day} at {hour}."`, then `See you there.`', 'הדפיסו שלוש שורות עם f-strings: `f"Dear {name},"`, אחר כך `f"Please come on {day} at {hour}."`, ואז `See you there.`'],
      ['Call it as `invitation("Maya", "Friday")` and `invitation("Omer", "Saturday", "20:30")`.', 'קראו לה כך: `invitation("Maya", "Friday")` וגם `invitation("Omer", "Saturday", "20:30")`.'],
    ],
    solution: py`
      def invitation(name, day, hour="18:00"):
          print(f"Dear {name},")
          print(f"Please come on {day} at {hour}.")
          print("See you there.")


      invitation("Maya", "Friday")
      invitation("Omer", "Saturday", "20:30")
    `,
    solutionNote: [
      'Any names and days work. What matters is the three-line shape and the default hour.',
      'כל שם ויום מתאימים. מה שחשוב הוא מבנה שלוש השורות וברירת המחדל של השעה.',
    ],
    concepts: ['parameter', 'argument', 'default-parameter', 'f-string'],
  }),

  check: [
    choice(
      'l21-c1',
      ['In `def greet(name):` and the call `greet("Maya")`, which is the parameter and which is the argument?', 'ב-`def greet(name):` ובקריאה `greet("Maya")`, מה הפרמטר ומה הארגומנט?'],
      [
        opt('`name` is the parameter; `"Maya"` is the argument.', '`name` הוא הפרמטר; `"Maya"` הוא הארגומנט.', {
          correct: true,
          feedback: ['Right. The parameter is the name in the definition; the argument is the value in the call.', 'נכון. הפרמטר הוא השם בהגדרה; הארגומנט הוא הערך בקריאה.'],
        }),
        opt('`"Maya"` is the parameter; `name` is the argument.', '`"Maya"` הוא הפרמטר; `name` הוא הארגומנט.', {
          feedback: ['The other way round: parameters live in the def line, arguments in the call.', 'הפוך: פרמטרים נמצאים בשורת ה-def, ארגומנטים בקריאה.'],
        }),
        opt('Both are parameters.', 'שניהם פרמטרים.', {
          feedback: ['Only the name in the def line is a parameter. The value passed in a call is an argument.', 'רק השם בשורת ה-def הוא פרמטר. הערך שמועבר בקריאה הוא ארגומנט.'],
        }),
        opt('Both are arguments.', 'שניהם ארגומנטים.', {
          feedback: ['name is not a value; it is the placeholder that receives the value.', '`name` אינו ערך; הוא המקום ששומר את הערך שמתקבל.'],
        }),
      ],
      ['parameter', 'argument'],
    ),
    choice(
      'l21-c2',
      ['Given `def area(w, h):` with the body `print(w * h)`, what does `area(2, 5)` print?', 'נתון `def area(w, h):` עם הגוף `print(w * h)`. מה מדפיסה הקריאה `area(2, 5)`?'],
      [
        opt('10', '10', {
          correct: true,
          feedback: ['Yes: w receives 2, h receives 5, and 2 * 5 is 10.', 'כן: w מקבל 2, h מקבל 5, ו-2 * 5 הוא 10.'],
        }),
        opt('7', '7', {
          feedback: ['The body multiplies; it does not add.', 'הגוף מכפיל; הוא לא מחבר.'],
        }),
        opt('`w * h`', '`w * h`', {
          feedback: ['Inside the body w and h hold the values 2 and 5, so the product is computed.', 'בתוך הגוף w ו-h מחזיקים את הערכים 2 ו-5, ולכן המכפלה מחושבת.'],
        }),
        opt('An error, because w and h were never assigned.', 'שגיאה, כי w ו-h מעולם לא קיבלו ערך.', {
          feedback: ['Parameters receive their values automatically from the arguments at every call.', 'הפרמטרים מקבלים ערך אוטומטית מהארגומנטים בכל קריאה.'],
        }),
      ],
      ['parameter', 'argument'],
    ),
    choice(
      'l21-c3',
      ['What does the default in `def greet(name, greeting="Hello"):` mean?', 'מה משמעות ברירת המחדל ב-`def greet(name, greeting="Hello"):`?'],
      [
        opt('greeting is optional: if the call does not pass it, it is "Hello".', '`greeting` הוא אופציונלי: אם הקריאה לא מעבירה אותו, הוא "Hello".', {
          correct: true,
          feedback: ['Right. A default is used only when the call leaves that argument out.', 'נכון. ברירת המחדל משמשת רק כשהקריאה משמיטה את הארגומנט הזה.'],
        }),
        opt('greeting must always be "Hello".', '`greeting` חייב תמיד להיות "Hello".', {
          feedback: ['A call like greet("Noa", "Good morning") replaces the default.', 'קריאה כמו greet("Noa", "Good morning") מחליפה את ברירת המחדל.'],
        }),
        opt('name is optional too.', 'גם `name` אופציונלי.', {
          feedback: ['name has no default, so every call must pass it.', 'ל-name אין ברירת מחדל, ולכן כל קריאה חייבת להעביר אותו.'],
        }),
        opt('The line is an error: = is not allowed in a def line.', 'השורה שגויה: אסור להשתמש ב-= בשורת def.', {
          feedback: ['It is allowed: = in a def line gives a parameter its default value.', 'זה מותר: = בשורת def נותן לפרמטר את ערך ברירת המחדל שלו.'],
        }),
      ],
      ['default-parameter'],
    ),
  ],

  recap: [
    list([
      ['A parameter is a name in the def line; an argument is the value passed in the call.', 'פרמטר הוא שם בשורת ה-def; ארגומנט הוא הערך שמועבר בקריאה.'],
      ['Arguments are matched to parameters by position, so order matters.', 'ארגומנטים מותאמים לפרמטרים לפי המיקום, ולכן הסדר חשוב.'],
      ['The number of arguments must match the number of parameters (unless a parameter has a default).', 'מספר הארגומנטים חייב להתאים למספר הפרמטרים (אלא אם לפרמטר יש ברירת מחדל).'],
      ['`parameter=value` in the def line sets a default that a call may leave out or override.', '`parameter=value` בשורת ה-def קובע ברירת מחדל שקריאה יכולה להשמיט או לדרוס.'],
    ]),
    p(
      'With parameters, one function can serve a thousand cases. Notice how the calls now read almost like sentences: `invitation("Maya", "Friday")`.',
      'עם פרמטרים, פונקציה אחת יכולה לשרת אלף מקרים. שימו לב איך הקריאות נקראות עכשיו כמעט כמו משפטים: `invitation("Maya", "Friday")`.',
    ),
  ],
  next: t(
    'So far functions only print. Next you will make them hand a value back with return, so the rest of the program can use the result.',
    'עד עכשיו הפונקציות רק מדפיסות. בשיעור הבא תגרמו להן למסור ערך בחזרה בעזרת `return`, כדי ששאר התוכנית תוכל להשתמש בתוצאה.',
  ),
};
