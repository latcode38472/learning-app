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
  id: 'l10-fstrings',
  moduleId: 'm2',
  title: t('f-strings: mixing text and values', 'מחרוזות f: לשלב טקסט וערכים'),
  tagline: t('Build exactly the message you want.', 'בנו בדיוק את ההודעה שאתם רוצים.'),
  estimatedMinutes: 25,
  introduces: ['f-string', 'concatenation', 'len', 'upper-lower'],
  requires: ['print', 'string', 'variable', 'int', 'type-conversion', 'input'],
  runsInBrowser: true,

  objective: t(
    'Put values inside text with f-strings, join strings with +, and use len(), .upper() and .lower() to work with text.',
    'לשבץ ערכים בתוך טקסט בעזרת מחרוזות f, לחבר מחרוזות עם `+`, ולהשתמש ב-`len()`, `.upper()` ו-`.lower()` כדי לעבוד עם טקסט.',
  ),
  prerequisiteCheck: t(
    'You can store text and numbers in variables, convert between them, and read input from the user (lessons 6–9).',
    'אתם יודעים לשמור טקסט ומספרים במשתנים, להמיר ביניהם, ולקרוא קלט מהמשתמש (שיעורים 6–9).',
  ),

  explanation: [
    p(
      'You have been printing labels and values with commas: `print("Age:", age)`. That works, but you cannot control the spaces. `print("Hello", name, "!")` prints `Hello Maya !`, with a gap before the exclamation mark. An **f-string** lets you build exactly the text you want, with values dropped in wherever you like.',
      'עד עכשיו הדפסתם תוויות וערכים עם פסיקים: `print("Age:", age)`. זה עובד, אבל אין לכם שליטה על הרווחים. `print("Hello", name, "!")` מדפיס `Hello Maya !`, עם רווח לפני סימן הקריאה. **מחרוזת f** (f-string) מאפשרת לכם לבנות בדיוק את הטקסט שאתם רוצים, עם ערכים משובצים בכל מקום שתבחרו.',
    ),
    term(
      'f"..."',
      'An f-string is a string with the letter `f` right before the opening quote. Inside it, anything written between curly braces `{ }` is replaced by its value: `f"Hi {name}"` becomes `Hi Maya` when `name` holds `"Maya"`. The f stands for "format".',
      'מחרוזת f היא מחרוזת עם האות `f` ממש לפני המירכאה הפותחת. בתוכה, כל מה שכתוב בין סוגריים מסולסלים `{ }` מוחלף בערך שלו: `f"Hi {name}"` הופך ל-`Hi Maya` כש-`name` מחזיק `"Maya"`. ה-f מייצגת את המילה format (עיצוב).',
    ),
    term(
      '{ }',
      'Curly braces inside an f-string are placeholders. Put a variable or a small calculation inside, and Python replaces the braces with the result, converted to text automatically — numbers included, no `str()` needed.',
      'סוגריים מסולסלים בתוך מחרוזת f הם מקומות שמורים. שימו בפנים משתנה או חישוב קטן, ופייתון מחליף את הסוגריים בתוצאה, מומרת לטקסט אוטומטית — כולל מספרים, בלי צורך ב-`str()`.',
    ),
    code(py`
      name = "Maya"
      age = 12
      print(f"Hello {name}, you are {age} years old.")
      print(f"Next year you will be {age + 1}.")
    `, { output: 'Hello Maya, you are 12 years old.\nNext year you will be 13.' }),
    callout(
      'warning',
      'If you forget the `f`, nothing is replaced: `print("Hello {name}")` prints `Hello {name}`, braces and all. When you see braces in your output, add the missing f.',
      'אם שוכחים את ה-`f`, שום דבר לא מוחלף: `print("Hello {name}")` מדפיס `Hello {name}`, כולל הסוגריים. כשאתם רואים סוגריים מסולסלים בפלט, הוסיפו את ה-f החסרה.',
    ),
    h('The older way: joining strings with +', 'הדרך הישנה: חיבור מחרוזות עם +'),
    term(
      '+ (between strings)',
      '**Concatenation** means joining strings end to end: `"Hello " + name` makes one longer string. It works only between strings — to join a number you must first convert it with `str()`, otherwise you get the TypeError from lesson 8. Note that `+` adds no spaces; put them inside the quotes yourself.',
      '**שרשור** (concatenation) פירושו חיבור מחרוזות זו אחרי זו: `"Hello " + name` יוצר מחרוזת אחת ארוכה יותר. זה עובד רק בין מחרוזות — כדי לצרף מספר צריך קודם להמיר אותו בעזרת `str()`, אחרת מקבלים את ה-TypeError משיעור 8. שימו לב ש-`+` לא מוסיף רווחים; שימו אותם בעצמכם בתוך המירכאות.',
    ),
    code(py`
      name = "Maya"
      age = 12
      print("Hello " + name + ", you are " + str(age) + " years old.")
    `, { output: 'Hello Maya, you are 12 years old.' }),
    p(
      'Same result as the f-string, with more typing and more places to make a mistake. f-strings are usually the better choice, but `+` appears in a lot of code, so you need to be able to read it.',
      'אותה תוצאה כמו במחרוזת f, עם יותר הקלדה ויותר מקומות לטעות בהם. מחרוזות f הן בדרך כלל הבחירה הטובה יותר, אבל `+` מופיע בהרבה קוד, ולכן אתם צריכים לדעת לקרוא אותו.',
    ),
    h('Three useful string tools', 'שלושה כלים שימושיים למחרוזות'),
    term(
      'len()',
      '`len(text)` gives the number of characters in a string, spaces included: `len("hi there")` is `8`.',
      '`len(text)` נותנת את מספר התווים במחרוזת, כולל רווחים: `len("hi there")` הוא `8`.',
    ),
    term(
      '.upper()  .lower()',
      'Written after a string or a variable, with a dot: `name.upper()` gives the same text in CAPITAL letters, and `name.lower()` gives it in small letters. The original string is not changed — you get a new one, which you can print or store.',
      'נכתבות אחרי מחרוזת או משתנה, עם נקודה: `name.upper()` נותנת את אותו טקסט באותיות גדולות, ו-`name.lower()` נותנת אותו באותיות קטנות. המחרוזת המקורית לא משתנה — מקבלים מחרוזת חדשה, שאפשר להדפיס או לשמור.',
    ),
    code(py`
      word = "Python"
      print(word.upper())
      print(word.lower())
      print(len(word))
      print(f"{word.upper()} has {len(word)} letters")
      print(word)
    `, { output: 'PYTHON\npython\n6\nPYTHON has 6 letters\nPython' }),
    p(
      'Line 5 shows that these tools can be used inside the braces of an f-string. Line 6 shows that `word` itself still holds `Python`.',
      'שורה 5 מראה שאפשר להשתמש בכלים האלה בתוך הסוגריים המסולסלים של מחרוזת f. שורה 6 מראה ש-`word` עצמו עדיין מחזיק `Python`.',
    ),
  ],

  simpler: [
    p(
      'An f-string is like a form letter with blanks: "Dear ____, you are ____ years old." The curly braces are the blanks, and Python fills them in with your values.',
      'מחרוזת f היא כמו מכתב מוכן עם חורים: "____ היקר/ה, גילך ____." הסוגריים המסולסלים הם החורים, ופייתון ממלא אותם בערכים שלכם.',
    ),
    p(
      '`+` between strings is like taping two pieces of paper together. It can only tape paper to paper — a number must first be written on paper with `str()`.',
      '`+` בין מחרוזות הוא כמו להדביק שני פתקים זה לזה. אפשר להדביק רק נייר לנייר — מספר צריך קודם להיכתב על נייר בעזרת `str()`.',
    ),
    p(
      '`len()` counts the characters, like counting the letters in a word. `.upper()` shouts the word in capitals, and `.lower()` whispers it in small letters.',
      '`len()` סופרת את התווים, כמו לספור את האותיות במילה. `.upper()` צועקת את המילה באותיות גדולות, ו-`.lower()` לוחשת אותה באותיות קטנות.',
    ),
  ],

  workedExample: [
    p(
      'A name in pieces. Press the play button under the code to see each variable being built.',
      'שם בחלקים. לחצו על כפתור ההפעלה מתחת לקוד כדי לראות איך כל משתנה נבנה.',
    ),
    viz(py`
      first = "ada"
      last = "lovelace"
      full = f"{first} {last}"
      print(full.upper())
      print(f"{full} has {len(full)} characters")
      print(f"Shout the last name: {last.upper()}")
    `),
    list([
      ['Lines 1–2 store two strings in small letters.', 'שורות 1–2 שומרות שתי מחרוזות באותיות קטנות.'],
      ['Line 3 builds a new string from both, with a space between them, and stores it in `full`.', 'שורה 3 בונה מחרוזת חדשה משתיהן, עם רווח ביניהן, ושומרת אותה ב-`full`.'],
      ['Line 4 prints `full` in capitals. `full` itself stays in small letters.', 'שורה 4 מדפיסה את `full` באותיות גדולות. `full` עצמו נשאר באותיות קטנות.'],
      ['Line 5 uses two placeholders: the text and its length. The space counts, so the length is 12.', 'שורה 5 משתמשת בשני מקומות שמורים: הטקסט והאורך שלו. הרווח נספר, ולכן האורך הוא 12.'],
      ['Line 6 calls `.upper()` inside the braces — tools and variables can be mixed freely inside an f-string.', 'שורה 6 קוראת ל-`.upper()` בתוך הסוגריים המסולסלים — אפשר לערבב כלים ומשתנים בחופשיות בתוך מחרוזת f.'],
    ], true),
    code(py`
      ADA LOVELACE
      ada lovelace has 12 characters
      Shout the last name: LOVELACE
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('A receipt line', 'שורה בקבלה'),
      code(py`
        item = "notebook"
        price = 12.5
        amount = 3
        print(f"{amount} x {item} = {price * amount}")
      `, { output: '3 x notebook = 37.5' }),
      p(
        'Three placeholders in one line: an int, a string and a calculation. Notice how every space and the `x` and `=` signs sit exactly where they were typed.',
        'שלושה מקומות שמורים בשורה אחת: int, מחרוזת וחישוב. שימו לב איך כל רווח והסימנים `x` ו-`=` יושבים בדיוק במקום שבו הוקלדו.',
      ),
    ],
    [
      h('With input', 'עם קלט'),
      code(py`
        city = input("City: ")
        print(f"{city.upper()} has {len(city)} letters")
      `, {
        output: 'City: Haifa\nHAIFA has 5 letters',
        caption: t('With the answer Haifa:', 'עם התשובה Haifa:'),
      }),
      p(
        'The answer from input() is a string, so `.upper()` and `len()` work on it directly. This is the shape of most small programs: read something, work on it, print a nicely formatted result.',
        'התשובה מ-`input()` היא מחרוזת, ולכן `.upper()` ו-`len()` עובדות עליה ישירות. זו הצורה של רוב התוכניות הקטנות: לקרוא משהו, לעבד אותו, ולהדפיס תוצאה מעוצבת יפה.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l10-hard',
    title: ['A name badge', 'תג שם'],
    mode: 'write',
    instructions: [
      p(
        'Ask for a first name and then a last name (any prompts). Print three lines: the full name (first, space, last) in capital letters; an email address made of the first name, a dot, the last name — all in small letters — followed by `@example.com`; and `Badge width: ` followed by the number of characters in the full name, including the space. For `Dana` and `Levi`:',
        'בקשו שם פרטי ואחר כך שם משפחה (כל הנחיה מתאימה). הדפיסו שלוש שורות: השם המלא (פרטי, רווח, משפחה) באותיות גדולות; כתובת אימייל שמורכבת מהשם הפרטי, נקודה, שם המשפחה — הכול באותיות קטנות — ואחריהם `@example.com`; ו-`Badge width: ` ואחריו מספר התווים בשם המלא, כולל הרווח. עבור `Dana` ו-`Levi`:',
      ),
      code('DANA LEVI\ndana.levi@example.com\nBadge width: 9', { lang: 'text', runnable: false }),
    ],
    starterCode: py`
      # ask for the first name and the last name

      # build the full name, then print the three lines

    `,
    sampleStdin: ['Dana', 'Levi'],
    check: {
      tests: [
        outputTest('DANA LEVI\ndana.levi@example.com\nBadge width: 9', { stdin: ['Dana', 'Levi'] }),
        outputTest('OMER COHEN\nomer.cohen@example.com\nBadge width: 10', { stdin: ['Omer', 'Cohen'] }),
      ],
    },
    hints: [
      ['Build the full name first: `full = f"{first} {last}"`. Then `full.upper()` is the first line.', 'בנו קודם את השם המלא: `full = f"{first} {last}"`. אז `full.upper()` הוא השורה הראשונה.'],
      ['The email is an f-string with three parts: `f"{first.lower()}.{last.lower()}@example.com"`.', 'האימייל הוא מחרוזת f עם שלושה חלקים: `f"{first.lower()}.{last.lower()}@example.com"`.'],
      ['The width is `len(full)`: `print(f"Badge width: {len(full)}")`.', 'הרוחב הוא `len(full)`: `print(f"Badge width: {len(full)}")`.'],
    ],
    solution: py`
      first = input("First name: ")
      last = input("Last name: ")

      full = f"{first} {last}"
      print(full.upper())
      print(f"{first.lower()}.{last.lower()}@example.com")
      print(f"Badge width: {len(full)}")
    `,
    concepts: ['f-string', 'upper-lower', 'len', 'input'],
  }),

  predict: {
    code: py`
      pet = "Rex"
      print(f"{pet} has {len(pet)} letters")
      print(pet.upper() + "!")
    `,
    prompt: t('What does this program print? (two lines)', 'מה התוכנית הזאת תדפיס? (שתי שורות)'),
    answer: 'Rex has 3 letters\nREX!',
    explanation: t(
      'Line 2 fills two placeholders: the value of pet and its length, 3. Line 3 turns pet into capitals and joins the "!" directly to it with +, so there is no space before the exclamation mark.',
      'שורה 2 ממלאת שני מקומות שמורים: הערך של pet והאורך שלו, 3. שורה 3 הופכת את pet לאותיות גדולות ומצרפת אליו את "!" ישירות בעזרת +, ולכן אין רווח לפני סימן הקריאה.',
    ),
  },

  exercise: exercise({
    id: 'l10-ex',
    title: ['From commas to f-strings', 'מפסיקים למחרוזות f'],
    mode: 'modify',
    instructions: [
      p(
        'This program works, but its output has ugly spaces: `Hello Maya !` and `In 5 years you will be 17 .` Change the two print lines to use f-strings, so that for the answers `Maya` and `12` the program prints exactly:',
        'התוכנית הזאת עובדת, אבל בפלט שלה יש רווחים מכוערים: `Hello Maya !` ו-`In 5 years you will be 17 .` שנו את שתי שורות ה-`print` כך שישתמשו במחרוזות f, כדי שעבור התשובות `Maya` ו-`12` התוכנית תדפיס בדיוק:',
      ),
      code('Hello, Maya!\nIn 5 years you will be 17.', { lang: 'text', runnable: false }),
      p(
        'Note the comma after Hello and the full stop at the end. The input lines stay as they are; any prompt text is fine.',
        'שימו לב לפסיק אחרי Hello ולנקודה בסוף. שורות הקלט נשארות כפי שהן; כל טקסט הנחיה מתאים.',
      ),
    ],
    starterCode: py`
      name = input("Name: ")
      age = int(input("Age: "))
      print("Hello", name, "!")
      print("In 5 years you will be", age + 5, ".")
    `,
    sampleStdin: ['Maya', '12'],
    check: {
      requires: [
        requires(
          '(^|[^A-Za-z0-9_])f["\']',
          'Use an f-string: f"..." with the values inside curly braces.',
          'השתמשו במחרוזת f: `f"..."` עם הערכים בתוך סוגריים מסולסלים.',
        ),
      ],
      tests: [
        outputTest('Hello, Maya!\nIn 5 years you will be 17.', { stdin: ['Maya', '12'] }),
        outputTest('Hello, Ben!\nIn 5 years you will be 35.', { stdin: ['Ben', '30'] }),
      ],
    },
    hints: [
      ['An f-string starts with `f"` and puts variables in curly braces: `f"Hello, {name}!"`.', 'מחרוזת f מתחילה ב-`f"` ושמה משתנים בסוגריים מסולסלים: `f"Hello, {name}!"`.'],
      ['Calculations can go inside the braces too: `{age + 5}`.', 'גם חישובים יכולים להיכנס לתוך הסוגריים המסולסלים: `{age + 5}`.'],
      ['The second line: `print(f"In 5 years you will be {age + 5}.")` — the full stop is right after the closing brace.', 'השורה השנייה: `print(f"In 5 years you will be {age + 5}.")` — הנקודה באה מיד אחרי הסוגר המסולסל.'],
    ],
    solution: py`
      name = input("Name: ")
      age = int(input("Age: "))
      print(f"Hello, {name}!")
      print(f"In 5 years you will be {age + 5}.")
    `,
    concepts: ['f-string', 'input', 'type-conversion'],
  }),

  build: exercise({
    id: 'l10-build',
    title: ['A profile card generator', 'מחולל כרטיסי פרופיל'],
    mode: 'build',
    instructions: [
      p(
        'Build a tool that turns two answers into a profile card. Ask for a name and then for a city (any prompts), and print exactly four lines: the name in capitals between `=== ` and ` ===`; the sentence `<name> lives in <city>.`; `Name length: ` with the number of characters in the name; and `City in capitals: ` with the city in capital letters. For `Maya` and `Haifa`:',
        'בנו כלי שהופך שתי תשובות לכרטיס פרופיל. בקשו שם ואחר כך עיר (כל הנחיה מתאימה), והדפיסו בדיוק ארבע שורות: השם באותיות גדולות בין `=== ` ל-` ===`; המשפט `<name> lives in <city>.`; `Name length: ` עם מספר התווים בשם; ו-`City in capitals: ` עם העיר באותיות גדולות. עבור `Maya` ו-`Haifa`:',
      ),
      code('=== MAYA ===\nMaya lives in Haifa.\nName length: 4\nCity in capitals: HAIFA', { lang: 'text', runnable: false }),
      p(
        'f-strings make this easy, but any way of building the lines is accepted.',
        'מחרוזות f הופכות את זה לקל, אבל כל דרך לבנות את השורות מתקבלת.',
      ),
    ],
    starterCode: py`
      # ask for the name and the city

      # print the four lines of the card

    `,
    sampleStdin: ['Maya', 'Haifa'],
    check: {
      tests: [
        outputTest('=== MAYA ===\nMaya lives in Haifa.\nName length: 4\nCity in capitals: HAIFA', { stdin: ['Maya', 'Haifa'] }),
        outputTest('=== BEN ===\nBen lives in Tel Aviv.\nName length: 3\nCity in capitals: TEL AVIV', { stdin: ['Ben', 'Tel Aviv'] }),
      ],
    },
    hints: [
      ['Two inputs first: `name = input("Name: ")` and `city = input("City: ")`.', 'קודם שתי קריאות `input`: `name = input("Name: ")` ו-`city = input("City: ")`.'],
      ['The first line is `f"=== {name.upper()} ==="`. The second is `f"{name} lives in {city}."`.', 'השורה הראשונה היא `f"=== {name.upper()} ==="`. השנייה היא `f"{name} lives in {city}."`.'],
      ['Then `f"Name length: {len(name)}"` and `f"City in capitals: {city.upper()}"`.', 'ואז `f"Name length: {len(name)}"` ו-`f"City in capitals: {city.upper()}"`.'],
    ],
    solution: py`
      name = input("Name: ")
      city = input("City: ")

      print(f"=== {name.upper()} ===")
      print(f"{name} lives in {city}.")
      print(f"Name length: {len(name)}")
      print(f"City in capitals: {city.upper()}")
    `,
    concepts: ['f-string', 'len', 'upper-lower', 'input'],
  }),

  check: [
    choice(
      'l10-c1',
      ['What does `print(f"{2 + 3} apples")` show?', 'מה מציג `print(f"{2 + 3} apples")`?'],
      [
        opt('`5 apples`', '`5 apples`', {
          correct: true,
          feedback: ['Right. Whatever is inside the braces is calculated and its result is placed in the text.', 'נכון. מה שבתוך הסוגריים המסולסלים מחושב, והתוצאה משובצת בטקסט.'],
        }),
        opt('`{2 + 3} apples`', '`{2 + 3} apples`', {
          feedback: ['That is what you would get without the f. With the f, the braces are replaced.', 'זה מה שהייתם מקבלים בלי ה-f. עם ה-f, הסוגריים המסולסלים מוחלפים.'],
        }),
        opt('`2 + 3 apples`', '`2 + 3 apples`', {
          feedback: ['The braces do not just drop their content into the text; they calculate it first.', 'הסוגריים המסולסלים לא סתם משליכים את התוכן שלהם לטקסט; הם קודם מחשבים אותו.'],
        }),
      ],
      ['f-string'],
    ),
    choice(
      'l10-c2',
      ['Which line runs without an error?', 'איזו שורה רצה בלי שגיאה?'],
      [
        opt('`print("Age: " + str(7))`', '`print("Age: " + str(7))`', {
          correct: true,
          feedback: ['Correct. str(7) is the text "7", and joining two strings with + is allowed.', 'נכון. `str(7)` הוא הטקסט "7", וחיבור שתי מחרוזות עם + מותר.'],
        }),
        opt('`print("Age: " + 7)`', '`print("Age: " + 7)`', {
          feedback: ['A string cannot be joined to a number: TypeError. Convert with str() or use an f-string.', 'אי אפשר לחבר מחרוזת למספר: TypeError. המירו בעזרת `str()` או השתמשו במחרוזת f.'],
        }),
        opt('`print("Age: " + "7" + 1)`', '`print("Age: " + "7" + 1)`', {
          feedback: ['The first + is fine, but then a string is joined to the number 1: TypeError.', 'ה-+ הראשון בסדר, אבל אז מחרוזת מחוברת למספר 1: TypeError.'],
        }),
      ],
      ['concatenation', 'type-conversion'],
    ),
    choice(
      'l10-c3',
      ['What does `print(len("hi there"))` show?', 'מה מציג `print(len("hi there"))`?'],
      [
        opt('`8`', '`8`', {
          correct: true,
          feedback: ['Yes. len counts every character, and the space is a character too.', 'כן. `len` סופרת כל תו, וגם הרווח הוא תו.'],
        }),
        opt('`7`', '`7`', {
          feedback: ['The space counts as a character: h-i-space-t-h-e-r-e is 8.', 'הרווח נספר כתו: h-i-רווח-t-h-e-r-e זה 8.'],
        }),
        opt('`2`', '`2`', {
          feedback: ['len counts characters, not words.', '`len` סופרת תווים, לא מילים.'],
        }),
      ],
      ['len'],
    ),
  ],

  recap: [
    list([
      ['`f"..."` is an f-string: values in `{ }` are placed into the text, numbers included.', '`f"..."` היא מחרוזת f: ערכים בתוך `{ }` משובצים בטקסט, כולל מספרים.'],
      ['`+` joins strings end to end; numbers need `str()` first, and you add the spaces yourself.', '`+` מחבר מחרוזות זו אחרי זו; מספרים צריכים קודם `str()`, ואת הרווחים אתם מוסיפים בעצמכם.'],
      ['`len(text)` counts characters, spaces included.', '`len(text)` סופרת תווים, כולל רווחים.'],
      ['`.upper()` and `.lower()` give a new string in capital or small letters; the original stays the same.', '`.upper()` ו-`.lower()` נותנות מחרוזת חדשה באותיות גדולות או קטנות; המקורית נשארת כפי שהיא.'],
    ]),
    p(
      'This closes the module: you can print, store, calculate, convert, read input and now format the result exactly the way you want. That is everything a program needs to talk with a person.',
      'זה סוגר את המודול: אתם יודעים להדפיס, לשמור, לחשב, להמיר, לקרוא קלט ועכשיו גם לעצב את התוצאה בדיוק כמו שאתם רוצים. זה כל מה שתוכנית צריכה כדי לדבר עם אדם.',
    ),
  ],
  next: t(
    'The module test comes next. After that, programs start making decisions: comparing values and choosing what to do with if.',
    'הבא בתור הוא מבחן המודול. אחריו, התוכניות מתחילות לקבל החלטות: להשוות ערכים ולבחור מה לעשות בעזרת `if`.',
  ),
};
