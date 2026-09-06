import type { Lesson } from '../../schema';
import {
  p,
  h,
  code,
  list,
  callout,
  term,
  table,
  viz,
  t,
  opt,
  choice,
  exercise,
  outputTest,
  functionTest,
  pythonTest,
  requires,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l24-lists',
  moduleId: 'm6',
  title: t('Lists: many values in one place', 'רשימות: הרבה ערכים במקום אחד'),
  tagline: t('One name for a whole row of values.', 'שם אחד לשורה שלמה של ערכים.'),
  estimatedMinutes: 25,
  introduces: ['list', 'index', 'append', 'index-error', 'negative-index'],
  requires: ['variable', 'print', 'string', 'int', 'f-string', 'for', 'range', 'function', 'return'],
  runsInBrowser: true,

  objective: t(
    'Create a list, read items by their position, add items to the end, and understand why an index can be "out of range".',
    'ליצור רשימה, לקרוא פריטים לפי המיקום שלהם, להוסיף פריטים לסוף, ולהבין למה אינדקס יכול להיות "מחוץ לטווח".',
  ),
  prerequisiteCheck: t(
    'You can use variables and f-strings, and you can write a function that returns a value (lessons 6, 10 and 20–22).',
    'אתם יודעים להשתמש במשתנים וב-f-strings, ולכתוב פונקציה שמחזירה ערך (שיעורים 6, 10 ו-20–22).',
  ),

  explanation: [
    p(
      'So far every variable held exactly one value. But a program often needs many values that belong together: the names in a class, the scores of a game, the items in a shopping basket. A **list** holds many values in one variable, in a fixed order.',
      'עד עכשיו כל משתנה החזיק בדיוק ערך אחד. אבל תוכנית צריכה לעיתים קרובות הרבה ערכים ששייכים יחד: השמות בכיתה, הניקוד במשחק, הפריטים בסל הקניות. **רשימה** (list) מחזיקה הרבה ערכים במשתנה אחד, בסדר קבוע.',
    ),
    term(
      '[]',
      'Square brackets create a list. The items go inside, separated by commas. `[]` with nothing inside is an empty list — a list that is waiting to be filled.',
      'סוגריים מרובעים יוצרים רשימה. הפריטים נכתבים בפנים, מופרדים בפסיקים. `[]` בלי שום דבר בפנים הוא רשימה ריקה — רשימה שמחכה שימלאו אותה.',
    ),
    code(py`
      colors = ["red", "green", "blue"]
      print(colors)
      print(len(colors))
    `, { output: "['red', 'green', 'blue']\n3" }),
    p(
      'Line 2 prints the whole list: Python shows the brackets and puts single quotes around each text item. Line 3 uses `len`, which you know from strings — for a list it counts the items.',
      'שורה 2 מדפיסה את הרשימה כולה: פייתון מציג את הסוגריים ושם מירכאות בודדות סביב כל פריט טקסט. שורה 3 משתמשת ב-`len`, שאתם מכירים ממחרוזות — ברשימה היא סופרת את הפריטים.',
    ),
    h('Reading one item: the index', 'קריאת פריט אחד: האינדקס'),
    term(
      'index',
      'Every item in a list has a position number called its **index**. Counting starts at 0, not 1: the first item is at index 0, the second at index 1. The index says how many steps the item is from the start. To read an item, write the list name and the index in square brackets: `colors[0]`.',
      'לכל פריט ברשימה יש מספר מיקום שנקרא **אינדקס** (index). הספירה מתחילה מ-0 ולא מ-1: הפריט הראשון נמצא באינדקס 0, השני באינדקס 1. האינדקס אומר כמה צעדים הפריט רחוק מההתחלה. כדי לקרוא פריט, כתבו את שם הרשימה ואת האינדקס בסוגריים מרובעים: `colors[0]`.',
    ),
    table(
      [['Index', 'אינדקס'], ['Item', 'פריט']],
      [
        [['0', '0'], ['`"red"`', '`"red"`']],
        [['1', '1'], ['`"green"`', '`"green"`']],
        [['2', '2'], ['`"blue"`', '`"blue"`']],
      ],
    ),
    code(py`
      colors = ["red", "green", "blue"]
      print(colors[0])
      print(colors[2])
    `, { output: 'red\nblue' }),
    callout(
      'why',
      'Starting at 0 feels odd at first, but it makes the arithmetic of positions simple, and every programming language you meet later does the same. After a few programs it becomes natural. Remember: with 3 items, the indexes are 0, 1 and 2.',
      'להתחיל מ-0 מרגיש מוזר בהתחלה, אבל זה הופך את חשבון המיקומים לפשוט, וכל שפת תכנות שתפגשו בהמשך עושה אותו דבר. אחרי כמה תוכניות זה נעשה טבעי. זכרו: ברשימה עם 3 פריטים האינדקסים הם 0, 1 ו-2.',
      t('Why 0?', 'למה 0?'),
    ),
    h('Adding an item to the end', 'הוספת פריט לסוף'),
    term(
      '.append()',
      'Adds one value to the end of a list. Write the list name, a dot, `append`, and the value in parentheses: `tasks.append("piano")`. The list grows by one item; nothing else moves.',
      'מוסיף ערך אחד לסוף הרשימה. כתבו את שם הרשימה, נקודה, `append`, ואת הערך בסוגריים: `tasks.append("piano")`. הרשימה גדלה בפריט אחד; שום דבר אחר לא זז.',
    ),
    code(py`
      tasks = []
      tasks.append("homework")
      tasks.append("piano")
      print(tasks)
      print(len(tasks))
    `, { output: "['homework', 'piano']\n2" }),
    h('An index that is too big', 'אינדקס גדול מדי'),
    p(
      '`colors` has 3 items, so the valid indexes are 0, 1 and 2. `colors[3]` asks for a fourth item that does not exist, and Python stops the program:',
      '`colors` מכילה 3 פריטים, ולכן האינדקסים החוקיים הם 0, 1 ו-2. הביטוי `colors[3]` מבקש פריט רביעי שלא קיים, ופייתון עוצר את התוכנית:',
    ),
    code(py`
      colors = ["red", "green", "blue"]
      fourth = colors[3]
    `),
    code(
      'Traceback (most recent call last):\n  File "main.py", line 2, in <module>\nIndexError: list index out of range',
      { lang: 'text', runnable: false, caption: t('The error message', 'הודעת השגיאה') },
    ),
    callout(
      'warning',
      '**IndexError: list index out of range** means "there is no item at that index". The biggest valid index is always `len(list) - 1`. This is one of the most common errors in Python, so learn to recognise it.',
      '**IndexError: list index out of range** פירושו "אין פריט באינדקס הזה". האינדקס החוקי הגדול ביותר הוא תמיד `len(list) - 1`. זו אחת השגיאות הנפוצות ביותר בפייתון, אז כדאי ללמוד לזהות אותה.',
    ),
    h('Counting from the end', 'ספירה מהסוף'),
    term(
      '[-1]',
      'A **negative index** counts from the end: `-1` is the last item, `-2` the one before it, and so on. `colors[-1]` gives the last colour no matter how long the list is.',
      '**אינדקס שלילי** (negative index) סופר מהסוף: `-1` הוא הפריט האחרון, `-2` זה שלפניו, וכן הלאה. `colors[-1]` נותן את הצבע האחרון בלי קשר לאורך הרשימה.',
    ),
    code(py`
      colors = ["red", "green", "blue"]
      print(colors[-1])
      print(colors[-2])
    `, { output: 'blue\ngreen' }),
    p(
      'A list can hold numbers just as well as text, for example `scores = [90, 85, 77]`; then `scores[0] + scores[1]` is `175`. In this lesson we only read lists and add to them. Changing an item that is already there comes in the next lesson.',
      'רשימה יכולה להחזיק מספרים בדיוק כמו טקסט, למשל `scores = [90, 85, 77]`; אז `scores[0] + scores[1]` הוא `175`. בשיעור הזה אנחנו רק קוראים מרשימות ומוסיפים להן. שינוי של פריט שכבר נמצא ברשימה יגיע בשיעור הבא.',
    ),
  ],

  simpler: [
    p(
      'Think of a row of boxes on a shelf. The whole shelf has one name, like `colors`. Each box has a number painted on it, and the numbers start at 0.',
      'דמיינו שורה של קופסאות על מדף. למדף כולו יש שם אחד, למשל `colors`. על כל קופסה כתוב מספר, והמספרים מתחילים מ-0.',
    ),
    p(
      '`colors[0]` means: open box number 0 and look inside. `colors[-1]` means: open the last box, whatever its number is.',
      '`colors[0]` פירושו: פתחו את קופסה מספר 0 והסתכלו בפנים. `colors[-1]` פירושו: פתחו את הקופסה האחרונה, לא משנה מה המספר שלה.',
    ),
    p(
      '`colors.append("pink")` puts a new box at the end of the row. `len(colors)` counts the boxes.',
      '`colors.append("pink")` מציב קופסה חדשה בסוף השורה. `len(colors)` סופר את הקופסאות.',
    ),
    p(
      'If there are three boxes (0, 1 and 2) and you ask for box 3, there is nothing to open. That is the IndexError: the shelf is fine, the box simply does not exist.',
      'אם יש שלוש קופסאות (0, 1 ו-2) ואתם מבקשים את קופסה 3, אין מה לפתוח. זו שגיאת IndexError: המדף בסדר גמור, פשוט אין קופסה כזאת.',
    ),
  ],

  workedExample: [
    p(
      'Read the program line by line, then press play under the code to watch the list grow step by step.',
      'קראו את התוכנית שורה אחר שורה, ואז לחצו על כפתור ההפעלה מתחת לקוד כדי לראות את הרשימה גדלה צעד אחר צעד.',
    ),
    viz(py`
      names = ["Maya", "Omer"]
      names.append("Lia")
      first = names[0]
      last = names[-1]
      print(first, last)
      print(len(names))
    `),
    list([
      ['Line 1: `names` is a list with two items. `"Maya"` is at index 0, `"Omer"` at index 1.', 'שורה 1: `names` היא רשימה עם שני פריטים. `"Maya"` באינדקס 0, `"Omer"` באינדקס 1.'],
      ['Line 2: `append` adds `"Lia"` at the end, at index 2. The list now has three items.', 'שורה 2: `append` מוסיף את `"Lia"` בסוף, באינדקס 2. עכשיו ברשימה שלושה פריטים.'],
      ['Line 3 copies the first item into `first`; line 4 copies the last item into `last` using `-1`.', 'שורה 3 מעתיקה את הפריט הראשון אל `first`; שורה 4 מעתיקה את הפריט האחרון אל `last` בעזרת `-1`.'],
      ['Line 5 prints both values, and line 6 prints how many items the list holds now.', 'שורה 5 מדפיסה את שני הערכים, ושורה 6 מדפיסה כמה פריטים יש ברשימה עכשיו.'],
    ], true),
    code(py`
      Maya Lia
      3
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('Numbers in a list', 'מספרים ברשימה'),
      code(py`
        scores = [90, 85, 77]
        total = scores[0] + scores[1] + scores[2]
        print(total)
        print(f"Best: {scores[0]}, last: {scores[-1]}")
      `, { output: '252\nBest: 90, last: 77' }),
      p(
        'Items that are numbers behave like any other numbers: you can add them, compare them and put them in f-strings. Adding up a long list one index at a time is tiring — the next lesson shows a loop that does it for you.',
        'פריטים שהם מספרים מתנהגים כמו כל מספר אחר: אפשר לחבר אותם, להשוות אותם ולשלב אותם ב-f-strings. לחבר רשימה ארוכה אינדקס אחרי אינדקס זה מייגע — בשיעור הבא תראו לולאה שעושה את זה בשבילכם.',
      ),
    ],
    [
      h('Indexes and range', 'אינדקסים ו-range'),
      code(py`
        colors = ["red", "green", "blue"]
        for i in range(3):
            print(i, colors[i])
      `, { output: '0 red\n1 green\n2 blue' }),
      p(
        '`range(3)` produces 0, 1, 2 — exactly the indexes of a three-item list, so `colors[i]` visits every item in order. Notice that the printed index is one less than the position you would say in everyday speech ("the first colour").',
        '`range(3)` מייצר 0, 1, 2 — בדיוק האינדקסים של רשימה עם שלושה פריטים, ולכן `colors[i]` עובר על כל פריט לפי הסדר. שימו לב שהאינדקס המודפס קטן באחד מהמיקום שהייתם אומרים בדיבור יומיומי ("הצבע הראשון").',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l24-hard',
    title: ['The middle item', 'הפריט האמצעי'],
    mode: 'write',
    instructions: [
      p(
        'Write a function `middle(items)` that returns the item in the middle of a list with an odd number of items. For `["a", "b", "c"]` it returns `"b"`; for `[1, 2, 3, 4, 5]` it returns `3`. Hint: the middle index is `len(items) // 2` (whole-number division from lesson 7).',
        'כתבו פונקציה `middle(items)` שמחזירה את הפריט שנמצא באמצע רשימה עם מספר אי-זוגי של פריטים. עבור `["a", "b", "c"]` היא מחזירה `"b"`; עבור `[1, 2, 3, 4, 5]` היא מחזירה `3`. רמז: האינדקס האמצעי הוא `len(items) // 2` (חילוק שלם משיעור 7).',
      ),
    ],
    starterCode: py`
      def middle(items):
          # 1. the middle index is len(items) // 2
          # 2. return the item at that index
          return items[0]


      print(middle(["a", "b", "c"]))
    `,
    check: {
      tests: [
        functionTest('middle(["a", "b", "c"])', "'b'"),
        functionTest('middle([1, 2, 3, 4, 5])', '3'),
        functionTest('middle([7])', '7'),
      ],
    },
    hints: [
      ['`len(items)` tells you how many items there are. With 5 items the middle one is at index 2, with 3 items at index 1.', '`len(items)` אומר לכם כמה פריטים יש. ב-5 פריטים האמצעי נמצא באינדקס 2, ב-3 פריטים באינדקס 1.'],
      ['Compute the index first: `i = len(items) // 2`. Then use `items[i]`.', 'חשבו קודם את האינדקס: `i = len(items) // 2`. אחר כך השתמשו ב-`items[i]`.'],
      ['The whole function can be one line: `return items[len(items) // 2]`.', 'כל הפונקציה יכולה להיות שורה אחת: `return items[len(items) // 2]`.'],
    ],
    solution: py`
      def middle(items):
          i = len(items) // 2
          return items[i]


      print(middle(["a", "b", "c"]))
    `,
    concepts: ['list', 'index', 'return'],
  }),

  predict: {
    code: py`
      animals = ["cat", "dog"]
      animals.append("owl")
      print(animals[1])
      print(animals[-1])
      print(len(animals))
    `,
    prompt: t('What does this program print? Write all three lines.', 'מה התוכנית הזאת תדפיס? כתבו את כל שלוש השורות.'),
    answer: 'dog\nowl\n3',
    explanation: t(
      '`animals[1]` is the second item, "dog", because indexes start at 0. After append the list is ["cat", "dog", "owl"], so `[-1]` is "owl" and `len` is 3.',
      '`animals[1]` הוא הפריט השני, "dog", כי האינדקסים מתחילים מ-0. אחרי `append` הרשימה היא ["cat", "dog", "owl"], ולכן `[-1]` הוא "owl" ו-`len` הוא 3.',
    ),
  },

  exercise: exercise({
    id: 'l24-ex',
    title: ['Fruit basket', 'סל פירות'],
    mode: 'complete',
    instructions: [
      p(
        'Complete the program so that it prints the first fruit, then adds `"kiwi"` to the end of the list, prints the last fruit, and finally prints how many fruits the list holds. The output should be exactly:',
        'השלימו את התוכנית כך שתדפיס את הפרי הראשון, אחר כך תוסיף את `"kiwi"` לסוף הרשימה, תדפיס את הפרי האחרון, ולבסוף תדפיס כמה פירות יש ברשימה. הפלט צריך להיות בדיוק:',
      ),
      code('apple\nkiwi\n4', { lang: 'text', runnable: false }),
    ],
    starterCode: py`
      fruits = ["apple", "banana", "cherry"]

      # 1. print the first fruit

      # 2. add "kiwi" to the end of the list

      # 3. print the last fruit (use a negative index)

      # 4. print how many fruits the list holds
    `,
    check: {
      tests: [
        outputTest('apple\nkiwi\n4'),
        pythonTest(
          `assert ns.get("fruits") == ["apple", "banana", "cherry", "kiwi"], "After your code runs, fruits should be ['apple', 'banana', 'cherry', 'kiwi']."`,
        ),
      ],
      requires: [requires('\\.append\\(', 'Use .append() to add kiwi to the list.', 'השתמשו ב-`.append()` כדי להוסיף את kiwi לרשימה.')],
    },
    hints: [
      ['The first item is at index 0: `print(fruits[0])`.', 'הפריט הראשון נמצא באינדקס 0: `print(fruits[0])`.'],
      ['Add with `fruits.append("kiwi")` — no `=` is needed; the list changes by itself.', 'הוסיפו עם `fruits.append("kiwi")` — לא צריך `=`; הרשימה משתנה בעצמה.'],
      ['The last item is `fruits[-1]`, and `len(fruits)` counts the items.', 'הפריט האחרון הוא `fruits[-1]`, ו-`len(fruits)` סופר את הפריטים.'],
    ],
    solution: py`
      fruits = ["apple", "banana", "cherry"]

      print(fruits[0])
      fruits.append("kiwi")
      print(fruits[-1])
      print(len(fruits))
    `,
    concepts: ['list', 'index', 'append', 'negative-index'],
  }),

  build: exercise({
    id: 'l24-build',
    title: ['Your playlist', 'הפלייליסט שלכם'],
    mode: 'build',
    instructions: [
      p(
        'Build a tiny playlist. Start with an empty list called `playlist`, then add at least three song names with `append` (any names, in English letters). Finally print three lines in exactly this shape, with your own songs and count:',
        'בנו פלייליסט קטן. התחילו מרשימה ריקה בשם `playlist`, ואז הוסיפו לפחות שלושה שמות של שירים בעזרת `append` (כל שם שתרצו, באותיות אנגליות). לבסוף הדפיסו שלוש שורות בדיוק בצורה הזאת, עם השירים והמספר שלכם:',
      ),
      code('Songs: 3\nFirst: Blue Sky\nLast: Night Drive', { lang: 'text', runnable: false }),
      p(
        'Use `len(playlist)`, `playlist[0]` and `playlist[-1]` when printing — do not type the song names a second time.',
        'השתמשו ב-`len(playlist)`, ב-`playlist[0]` וב-`playlist[-1]` בזמן ההדפסה — אל תכתבו את שמות השירים פעם נוספת.',
      ),
    ],
    starterCode: py`
      # 1. create an empty list called playlist

      # 2. append at least three songs

      # 3. print the three lines: Songs: / First: / Last:
    `,
    check: {
      tests: [
        pythonTest(
          py`
            pl = ns.get("playlist")
            assert isinstance(pl, list), "Create a list called playlist."
            assert len(pl) >= 3, "Add at least three songs to playlist."
            for s in pl:
                assert isinstance(s, str) and s.strip() != "", "Every song must be a text value in quotes."
            lines = [l.strip() for l in stdout.strip().split("\n") if l.strip()]
            assert len(lines) == 3, "Print exactly three lines."
            assert lines[0] == "Songs: " + str(len(pl)), "The first line must be 'Songs: ' followed by the number of songs."
            assert lines[1] == "First: " + pl[0], "The second line must be 'First: ' followed by the first song."
            assert lines[2] == "Last: " + pl[-1], "The third line must be 'Last: ' followed by the last song."
          `,
        ),
      ],
      requires: [requires('\\.append\\(', 'Add the songs with .append().', 'הוסיפו את השירים בעזרת `.append()`.')],
    },
    hints: [
      ['An empty list is `playlist = []`. Then `playlist.append("Blue Sky")` adds one song.', 'רשימה ריקה היא `playlist = []`. אחר כך `playlist.append("Blue Sky")` מוסיף שיר אחד.'],
      ['The number of songs is `len(playlist)`: `print(f"Songs: {len(playlist)}")`.', 'מספר השירים הוא `len(playlist)`: `print(f"Songs: {len(playlist)}")`.'],
      ['The first song is `playlist[0]` and the last one is `playlist[-1]`.', 'השיר הראשון הוא `playlist[0]` והאחרון הוא `playlist[-1]`.'],
    ],
    solution: py`
      playlist = []
      playlist.append("Blue Sky")
      playlist.append("River Song")
      playlist.append("Night Drive")

      print(f"Songs: {len(playlist)}")
      print(f"First: {playlist[0]}")
      print(f"Last: {playlist[-1]}")
    `,
    solutionNote: [
      'Any song names work, as long as the three lines are built from the list itself.',
      'כל שמות השירים מתאימים, כל עוד שלוש השורות נבנות מהרשימה עצמה.',
    ],
    concepts: ['list', 'append', 'index', 'negative-index', 'f-string'],
  }),

  check: [
    choice(
      'l24-c1',
      ['`colors = ["red", "green", "blue"]`. What is `colors[0]`?', '`colors = ["red", "green", "blue"]`. מה הערך של `colors[0]`?'],
      [
        opt('`"red"`', '`"red"`', {
          correct: true,
          feedback: ['Right. Index 0 is the first item.', 'נכון. אינדקס 0 הוא הפריט הראשון.'],
        }),
        opt('`"green"`', '`"green"`', {
          feedback: ['"green" is at index 1. Counting starts at 0, so the first item has index 0.', '"green" נמצא באינדקס 1. הספירה מתחילה מ-0, ולכן לפריט הראשון יש אינדקס 0.'],
        }),
        opt('An error, because there is no item number 0', 'שגיאה, כי אין פריט מספר 0', {
          feedback: ['Index 0 is always valid in a list that has at least one item — it is the first item.', 'אינדקס 0 תמיד חוקי ברשימה עם פריט אחד לפחות — זה הפריט הראשון.'],
        }),
      ],
      ['index'],
    ),
    choice(
      'l24-c2',
      ['`nums = [4, 8, 15]`. What happens when Python runs `print(nums[3])`?', '`nums = [4, 8, 15]`. מה קורה כשפייתון מריץ `print(nums[3])`?'],
      [
        opt('It prints 15', 'מודפס 15', {
          feedback: ['15 is at index 2. With three items the indexes are 0, 1 and 2 — there is no index 3.', '15 נמצא באינדקס 2. בשלושה פריטים האינדקסים הם 0, 1 ו-2 — אין אינדקס 3.'],
        }),
        opt('It stops with IndexError: list index out of range', 'התוכנית נעצרת עם IndexError: list index out of range', {
          correct: true,
          feedback: ['Yes. The biggest valid index is len(nums) - 1, which is 2.', 'כן. האינדקס החוקי הגדול ביותר הוא len(nums) - 1, כלומר 2.'],
        }),
        opt('It prints 3', 'מודפס 3', {
          feedback: ['The number in the brackets is a position, not a value to print.', 'המספר בסוגריים הוא מיקום, לא ערך להדפסה.'],
        }),
      ],
      ['index-error'],
    ),
    choice(
      'l24-c3',
      ['`nums = [4, 8, 15]`. What is `nums[-1]`?', '`nums = [4, 8, 15]`. מה הערך של `nums[-1]`?'],
      [
        opt('15', '15', {
          correct: true,
          feedback: ['Correct. -1 always means the last item.', 'נכון. -1 תמיד מציין את הפריט האחרון.'],
        }),
        opt('4', '4', {
          feedback: ['4 is the first item, index 0. Negative indexes count from the end, so -1 is the last item.', '4 הוא הפריט הראשון, אינדקס 0. אינדקסים שליליים סופרים מהסוף, ולכן -1 הוא הפריט האחרון.'],
        }),
        opt('An error, because indexes cannot be negative', 'שגיאה, כי אינדקס לא יכול להיות שלילי', {
          feedback: ['Negative indexes are allowed: they count from the end of the list.', 'אינדקסים שליליים מותרים: הם סופרים מסוף הרשימה.'],
        }),
      ],
      ['negative-index'],
    ),
  ],

  recap: [
    list([
      ['A list holds many values in order: `colors = ["red", "green", "blue"]`.', 'רשימה מחזיקה הרבה ערכים לפי סדר: `colors = ["red", "green", "blue"]`.'],
      ['Indexes start at 0: `colors[0]` is the first item and `colors[-1]` the last.', 'האינדקסים מתחילים מ-0: `colors[0]` הוא הפריט הראשון ו-`colors[-1]` האחרון.'],
      ['`len(colors)` counts the items; the biggest valid index is `len(colors) - 1`.', '`len(colors)` סופר את הפריטים; האינדקס החוקי הגדול ביותר הוא `len(colors) - 1`.'],
      ['`colors.append("pink")` adds an item at the end.', '`colors.append("pink")` מוסיף פריט בסוף.'],
      ['Asking for an index that does not exist gives `IndexError: list index out of range`.', 'בקשה של אינדקס שלא קיים נותנת `IndexError: list index out of range`.'],
    ]),
    p(
      'Lists are your first tool for handling many things at once. Nearly every real program keeps its data in lists, so it is worth getting comfortable with indexes now.',
      'רשימות הן הכלי הראשון שלכם לטיפול בהרבה דברים בבת אחת. כמעט כל תוכנית אמיתית שומרת את הנתונים שלה ברשימות, ולכן כדאי להתרגל לאינדקסים כבר עכשיו.',
    ),
  ],
  next: t(
    'Next you will loop over a list to visit every item, change items in place, and let Python add up or sort a list for you.',
    'בשיעור הבא תעברו בלולאה על רשימה כדי לבקר בכל פריט, תשנו פריטים במקומם, ותיתנו לפייתון לסכום או למיין רשימה בשבילכם.',
  ),
};
