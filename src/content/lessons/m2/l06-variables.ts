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
  id: 'l06-variables',
  moduleId: 'm2',
  title: t('Variables: giving a value a name', 'משתנים: לתת שם לערך'),
  tagline: t('Store something now, use it later.', 'שומרים משהו עכשיו ומשתמשים בו אחר כך.'),
  estimatedMinutes: 20,
  introduces: ['variable', 'assignment', 'naming', 'reassignment'],
  requires: ['print', 'string', 'print-multiple'],
  runsInBrowser: true,

  objective: t(
    'Create a variable, store a value in it, print it, and change it later.',
    'ליצור משתנה, לשמור בו ערך, להדפיס אותו ולשנות אותו אחר כך.',
  ),
  prerequisiteCheck: t(
    'You can run a program and print text with print("...") (lessons 1–5).',
    'אתם יודעים להריץ תוכנית ולהדפיס טקסט בעזרת `print("...")` (שיעורים 1–5).',
  ),

  explanation: [
    p(
      'Until now every program forgot everything the moment a line finished. A **variable** is a name that remembers a value, so you can use that value again later in the program.',
      'עד עכשיו כל תוכנית שכחה הכול ברגע שהשורה הסתיימה. **משתנה** (variable) הוא שם שזוכר ערך, כדי שתוכלו להשתמש בערך הזה שוב בהמשך התוכנית.',
    ),
    term(
      '=',
      'The equals sign is the **assignment** symbol. It takes the value on the right and stores it under the name on the left. It is not a question ("are these equal?") — it is an instruction ("remember this").',
      'סימן השווה הוא סימן ה**השמה** (assignment). הוא לוקח את הערך שמימין ושומר אותו תחת השם שמשמאל. זו לא שאלה ("האם אלה שווים?") אלא הוראה ("תזכור את זה").',
    ),
    code(py`
      name = "Maya"
      print(name)
    `, { output: 'Maya' }),
    p(
      'Line 1 creates a variable called `name` and stores the text `"Maya"` in it. Line 2 prints the variable. Notice there are **no quotes** around `name` in the second line: we want the value stored inside the variable, not the word "name" itself.',
      'שורה 1 יוצרת משתנה בשם `name` ושומרת בו את הטקסט `"Maya"`. שורה 2 מדפיסה את המשתנה. שימו לב שבשורה השנייה **אין מירכאות** סביב `name`: אנחנו רוצים את הערך ששמור בתוך המשתנה, לא את המילה "name" עצמה.',
    ),
    callout(
      'why',
      'Why do variables exist? Because programs deal with values that change or that are used in many places. If a name appears in five places, you store it once and change it in one place. A good variable name also explains what the value means.',
      'למה בכלל צריך משתנים? כי תוכניות מטפלות בערכים שמשתנים או שמשתמשים בהם במקומות רבים. אם שם מופיע בחמישה מקומות, שומרים אותו פעם אחת ומשנים אותו במקום אחד. שם טוב למשתנה גם מסביר מה משמעות הערך.',
      t('Why variables?', 'למה משתנים?'),
    ),
    h('Naming rules', 'כללי שמות'),
    list([
      ['A name can use letters, digits and the underscore `_`, for example `score`, `player_name`, `round2`.', 'שם יכול להכיל אותיות באנגלית, ספרות וקו תחתון `_`, למשל `score`, `player_name`, `round2`.'],
      ['It cannot start with a digit and cannot contain spaces: `2players` and `my score` are not allowed.', 'שם לא יכול להתחיל בספרה ולא יכול להכיל רווחים: `2players` ו-`my score` אסורים.'],
      ['Capital letters matter: `Score` and `score` are two different variables.', 'אותיות גדולות וקטנות נחשבות שונות: `Score` ו-`score` הם שני משתנים שונים.'],
      ['Choose names that describe the value. `age` is better than `a`.', 'בחרו שמות שמתארים את הערך. `age` עדיף על `a`.'],
    ]),
    h('Changing a variable', 'שינוי ערך של משתנה'),
    p(
      'You can store a new value under the same name at any time. The old value is forgotten. This is called **reassignment**.',
      'אפשר לשמור ערך חדש תחת אותו שם בכל רגע. הערך הישן נשכח. לזה קוראים **השמה מחדש** (reassignment).',
    ),
    code(py`
      mood = "sleepy"
      mood = "awake"
      print(mood)
    `, { output: 'awake' }),
    callout(
      'warning',
      'Using a name before creating it causes a NameError: Python says it does not know that name. Always create the variable (with =) on a line above the line that uses it.',
      'שימוש בשם לפני שיצרתם אותו גורם לשגיאת NameError: פייתון אומר שהוא לא מכיר את השם הזה. תמיד צרו את המשתנה (עם `=`) בשורה שנמצאת מעל השורה שמשתמשת בו.',
    ),
  ],

  simpler: [
    p(
      'Imagine a jar with a sticky note on it. The note is the variable name. What is inside the jar is the value.',
      'דמיינו צנצנת עם פתק דביק עליה. הפתק הוא שם המשתנה. מה שבתוך הצנצנת הוא הערך.',
    ),
    p(
      '`name = "Maya"` means: take a jar, write "name" on the note, and put "Maya" inside.',
      '`name = "Maya"` פירושו: קחו צנצנת, כתבו על הפתק "name", והכניסו פנימה את "Maya".',
    ),
    p(
      '`print(name)` means: look at the jar labelled "name" and show what is inside. If you later put something else in the jar, the old thing is gone.',
      '`print(name)` פירושו: הסתכלו בצנצנת עם הפתק "name" והראו מה יש בפנים. אם אחר כך תכניסו לצנצנת משהו אחר, הדבר הישן ייעלם.',
    ),
  ],

  workedExample: [
    p(
      'Let us read a program line by line. Press the play button under the code to watch the variables change step by step.',
      'בואו נקרא תוכנית שורה אחר שורה. לחצו על כפתור ההפעלה מתחת לקוד כדי לראות איך המשתנים משתנים צעד אחר צעד.',
    ),
    viz(py`
      pet = "cat"
      sound = "meow"
      print(pet, "says", sound)
      pet = "dog"
      sound = "woof"
      print(pet, "says", sound)
    `),
    list([
      ['Line 1: a variable `pet` is created holding `"cat"`.', 'שורה 1: נוצר משתנה `pet` שמחזיק `"cat"`.'],
      ['Line 2: a second variable `sound` holds `"meow"`.', 'שורה 2: משתנה שני, `sound`, מחזיק `"meow"`.'],
      ['Line 3 prints three things separated by spaces: the value of `pet`, the text `says`, and the value of `sound`.', 'שורה 3 מדפיסה שלושה דברים עם רווחים ביניהם: הערך של `pet`, הטקסט `says`, והערך של `sound`.'],
      ['Lines 4–5 replace both values. Line 6 prints the new ones.', 'שורות 4–5 מחליפות את שני הערכים. שורה 6 מדפיסה את הערכים החדשים.'],
    ], true),
    code(py`
      cat says meow
      dog says woof
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('The quotes decide what you mean', 'המירכאות קובעות למה אתם מתכוונים'),
      code(py`
        city = "Haifa"
        print(city)
        print("city")
      `, { output: 'Haifa\ncity' }),
      p(
        'Without quotes, `city` means "the value stored in the variable city". With quotes, `"city"` is just the four letters c-i-t-y.',
        'בלי מירכאות, `city` פירושו "הערך ששמור במשתנה city". עם מירכאות, `"city"` הוא פשוט ארבע האותיות c-i-t-y.',
      ),
    ],
    [
      h('One value, many uses', 'ערך אחד, הרבה שימושים'),
      code(py`
        team = "Blue Foxes"
        print("Welcome,", team)
        print(team, "are playing today")
        print("Go", team)
      `, { output: 'Welcome, Blue Foxes\nBlue Foxes are playing today\nGo Blue Foxes' }),
      p(
        'The team name is typed once. To rename the team you change only line 1, and all three messages update.',
        'שם הקבוצה נכתב פעם אחת בלבד. כדי לשנות את שם הקבוצה משנים רק את שורה 1, וכל שלוש ההודעות מתעדכנות.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l06-hard',
    title: ['Swap two values', 'החלפה בין שני ערכים'],
    mode: 'write',
    instructions: [
      p(
        'The variables `left` and `right` hold `"apple"` and `"pear"`. Swap their values using a **third** variable, so that printing `left` shows `pear` and printing `right` shows `apple`. Do not write the words "apple" or "pear" again — move the values between variables.',
        'המשתנים `left` ו-`right` מחזיקים `"apple"` ו-`"pear"`. החליפו ביניהם בעזרת משתנה **שלישי**, כך שהדפסת `left` תציג `pear` והדפסת `right` תציג `apple`. אל תכתבו שוב את המילים "apple" או "pear" — העבירו את הערכים בין המשתנים.',
      ),
    ],
    starterCode: py`
      left = "apple"
      right = "pear"
      # swap them here

      print(left)
      print(right)
    `,
    check: {
      tests: [
        outputTest('pear\napple'),
        pythonTest(
          `assert source.count('"apple"') + source.count("'apple'") == 1, "Do not type the word apple again; move the value between variables."\nassert source.count('"pear"') + source.count("'pear'") == 1, "Do not type the word pear again; move the value between variables."`,
        ),
      ],
    },
    hints: [
      ['If you write `left = right`, the value of left is lost. Save it somewhere first.', 'אם תכתבו `left = right`, הערך של left יאבד. שמרו אותו קודם במקום אחר.'],
      ['Create a variable like `temp = left` before changing left.', 'צרו משתנה כמו `temp = left` לפני שאתם משנים את left.'],
      ['Three lines: `temp = left`, then `left = right`, then `right = temp`.', 'שלוש שורות: `temp = left`, אחר כך `left = right`, ואז `right = temp`.'],
    ],
    solution: py`
      left = "apple"
      right = "pear"
      temp = left
      left = right
      right = temp

      print(left)
      print(right)
    `,
    concepts: ['variable', 'assignment', 'reassignment'],
  }),

  predict: {
    code: py`
      color = "blue"
      color = "green"
      print(color)
    `,
    prompt: t('What does this program print?', 'מה התוכנית הזאת תדפיס?'),
    answer: 'green',
    explanation: t(
      'Line 2 replaces the value stored in color. When line 3 runs, the variable holds "green", so that is what prints. The old value "blue" is gone.',
      'שורה 2 מחליפה את הערך ששמור ב-color. כששורה 3 רצה, המשתנה מחזיק "green", ולכן זה מה שמודפס. הערך הישן "blue" נעלם.',
    ),
  },

  exercise: exercise({
    id: 'l06-ex',
    title: ['Your first variable', 'המשתנה הראשון שלכם'],
    mode: 'write',
    instructions: [
      p(
        'Create a variable called `animal` that holds the text `cat`, and print it. Then change `animal` to `dog` and print it again. The output should be two lines: `cat` and then `dog`.',
        'צרו משתנה בשם `animal` שמחזיק את הטקסט `cat`, והדפיסו אותו. אחר כך שנו את `animal` ל-`dog` והדפיסו אותו שוב. הפלט צריך להיות שתי שורות: `cat` ואז `dog`.',
      ),
    ],
    starterCode: py`
      # 1. create the variable animal with the value "cat"

      # 2. print it

      # 3. change animal to "dog"

      # 4. print it again
    `,
    check: {
      tests: [
        outputTest('cat\ndog'),
        pythonTest(`assert 'animal' in ns, "Create a variable called animal."`),
      ],
    },
    hints: [
      ['A variable is created with a name, `=`, and a value: `animal = "cat"`.', 'משתנה נוצר עם שם, `=`, וערך: `animal = "cat"`.'],
      ['To print a variable, write its name inside print without quotes: `print(animal)`.', 'כדי להדפיס משתנה, כתבו את שמו בתוך print בלי מירכאות: `print(animal)`.'],
      ['Assign again with `animal = "dog"` and print a second time.', 'בצעו השמה נוספת עם `animal = "dog"` והדפיסו פעם שנייה.'],
    ],
    solution: py`
      animal = "cat"
      print(animal)
      animal = "dog"
      print(animal)
    `,
    concepts: ['variable', 'assignment', 'reassignment'],
  }),

  build: exercise({
    id: 'l06-build',
    title: ['An "about me" card', 'כרטיס "קצת עליי"'],
    mode: 'build',
    instructions: [
      p(
        'Build a small profile card. Create three variables: `name`, `city` and `hobby`, with any values you like (in English letters). Then print three lines in this shape:',
        'בנו כרטיס פרופיל קטן. צרו שלושה משתנים: `name`, `city` ו-`hobby`, עם ערכים לבחירתכם (באותיות אנגליות). אחר כך הדפיסו שלוש שורות בצורה הזאת:',
      ),
      code('Name: Maya\nCity: Haifa\nHobby: drawing', { lang: 'text', runnable: false }),
      p(
        'Use the variables when printing — do not type the values twice. Tip: `print("Name:", name)` prints the label, a space, and the value.',
        'השתמשו במשתנים בזמן ההדפסה — אל תכתבו את הערכים פעמיים. טיפ: `print("Name:", name)` מדפיס את התווית, רווח, ואת הערך.',
      ),
    ],
    starterCode: py`
      # create name, city and hobby


      # print the three lines

    `,
    check: {
      tests: [
        pythonTest(
          py`
            for v in ("name", "city", "hobby"):
                assert v in ns, "Create a variable called " + v + "."
                assert isinstance(ns[v], str) and ns[v].strip() != "", "Give " + v + " a text value in quotes."
            lines = [l.strip() for l in stdout.strip().split("\n") if l.strip()]
            assert len(lines) == 3, "Print exactly three lines."
            assert lines[0] == "Name: " + ns["name"], "The first line must be 'Name: ' followed by the value of name."
            assert lines[1] == "City: " + ns["city"], "The second line must be 'City: ' followed by the value of city."
            assert lines[2] == "Hobby: " + ns["hobby"], "The third line must be 'Hobby: ' followed by the value of hobby."
          `,
        ),
      ],
    },
    hints: [
      ['Start with the three assignments, one per line, for example `name = "Maya"`.', 'התחילו בשלוש השמות, אחת בכל שורה, למשל `name = "Maya"`.'],
      ['Print a label and a variable together: `print("Name:", name)`.', 'הדפיסו תווית ומשתנה יחד: `print("Name:", name)`.'],
      ['Repeat the same print pattern for city and hobby, with the labels `City:` and `Hobby:`.', 'חזרו על אותה תבנית הדפסה עבור city ו-hobby, עם התוויות `City:` ו-`Hobby:`.'],
    ],
    solution: py`
      name = "Maya"
      city = "Haifa"
      hobby = "drawing"

      print("Name:", name)
      print("City:", city)
      print("Hobby:", hobby)
    `,
    solutionNote: [
      'Any names and values work, as long as each line starts with the right label.',
      'כל שם וערך מתאימים, כל עוד כל שורה מתחילה בתווית הנכונה.',
    ],
    concepts: ['variable', 'assignment', 'print-multiple'],
  }),

  check: [
    choice(
      'l06-c1',
      ['What does the line `score = 10` do?', 'מה עושה השורה `score = 10`?'],
      [
        opt('It stores the value 10 under the name score.', 'היא שומרת את הערך 10 תחת השם score.', {
          correct: true,
          feedback: ['Right. The = sign is an instruction to remember a value.', 'נכון. סימן = הוא הוראה לזכור ערך.'],
        }),
        opt('It checks whether score is equal to 10.', 'היא בודקת אם score שווה ל-10.', {
          feedback: ['A single = never asks a question. Comparing values uses a different symbol, which you will meet in the lesson on comparisons.', 'סימן = יחיד אף פעם לא שואל שאלה. להשוואת ערכים יש סימן אחר, שתפגשו בשיעור על השוואות.'],
        }),
        opt('It prints 10.', 'היא מדפיסה 10.', {
          feedback: ['Nothing is printed by an assignment. Only print shows something on the screen.', 'השמה לא מדפיסה שום דבר. רק print מציג משהו על המסך.'],
        }),
      ],
      ['assignment'],
    ),
    choice(
      'l06-c2',
      ['Which of these is a valid variable name?', 'איזה מהשמות האלה הוא שם חוקי למשתנה?'],
      [
        opt('`total_points`', '`total_points`', {
          correct: true,
          feedback: ['Correct: letters and underscores are allowed.', 'נכון: אותיות וקווים תחתונים מותרים.'],
        }),
        opt('`2nd_place`', '`2nd_place`', {
          feedback: ['A name cannot start with a digit. `second_place` would work.', 'שם לא יכול להתחיל בספרה. `second_place` היה עובד.'],
        }),
        opt('`my score`', '`my score`', {
          feedback: ['Spaces are not allowed inside a name. Use an underscore: `my_score`.', 'רווחים אסורים בתוך שם. השתמשו בקו תחתון: `my_score`.'],
        }),
      ],
      ['naming'],
    ),
    choice(
      'l06-c3',
      [
        'What prints after these lines? `x = "a"` then `x = "b"` then `print(x)`',
        'מה יודפס אחרי השורות האלה? `x = "a"` ואז `x = "b"` ואז `print(x)`',
      ],
      [
        opt('b', 'b', {
          correct: true,
          feedback: ['Yes. The second assignment replaces the first value.', 'כן. ההשמה השנייה מחליפה את הערך הראשון.'],
        }),
        opt('a', 'a', {
          feedback: ['The value "a" was replaced by "b" on the second line.', 'הערך "a" הוחלף ב-"b" בשורה השנייה.'],
        }),
        opt('ab', 'ab', {
          feedback: ['Assignment replaces; it does not add to the old value.', 'השמה מחליפה; היא לא מוסיפה לערך הישן.'],
        }),
        opt('An error', 'שגיאה', {
          feedback: ['Storing a new value under an existing name is allowed and common.', 'שמירת ערך חדש תחת שם קיים מותרת ונפוצה.'],
        }),
      ],
      ['reassignment'],
    ),
  ],

  recap: [
    list([
      ['A variable is a name that remembers a value.', 'משתנה הוא שם שזוכר ערך.'],
      ['`name = value` stores the value; it never asks a question.', '`name = value` שומר את הערך; זו אף פעם לא שאלה.'],
      ['Use the name without quotes to get the value back.', 'כתבו את השם בלי מירכאות כדי לקבל את הערך בחזרה.'],
      ['Assigning again replaces the old value.', 'השמה נוספת מחליפה את הערך הישן.'],
      ['Names use letters, digits and underscores, and cannot start with a digit.', 'שמות מורכבים מאותיות, ספרות וקווים תחתונים, ולא מתחילים בספרה.'],
    ]),
    p(
      'You now have a way to keep information around while a program runs. Almost every program you will ever write starts by putting values into variables.',
      'עכשיו יש לכם דרך לשמור מידע בזמן שהתוכנית רצה. כמעט כל תוכנית שתכתבו אי פעם מתחילה בהכנסת ערכים למשתנים.',
    ),
  ],
  next: t(
    'Next you will store numbers in variables and do arithmetic with them — which is where variables become really useful.',
    'בשיעור הבא תשמרו מספרים במשתנים ותבצעו איתם חישובים — ושם המשתנים נעשים שימושיים באמת.',
  ),
};
