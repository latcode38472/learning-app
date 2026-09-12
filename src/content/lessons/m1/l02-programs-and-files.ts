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
  pythonTest,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l02-programs-and-files',
  moduleId: 'm1',
  title: t('Programs and files', 'תוכניות וקבצים'),
  tagline: t('Where a program lives, and what happens when you press Run.', 'איפה תוכנית נמצאת, ומה קורה כשלוחצים על Run.'),
  estimatedMinutes: 15,
  introduces: ['file', 'running-programs', 'console', 'sequence'],
  requires: ['print-basic'],
  runsInBrowser: true,

  objective: t(
    'Know what a program file is, what "running" means, where the output appears, and that in these programs lines run in order from top to bottom.',
    'לדעת מהו קובץ של תוכנית, מה פירוש "להריץ", איפה הפלט מופיע, ושבתוכניות האלה השורות מתבצעות לפי הסדר מלמעלה למטה.',
  ),
  prerequisiteCheck: t(
    'You have typed and run print("Hello") (lesson 1).',
    'הקלדתם והרצתם `print("Hello")` (שיעור 1).',
  ),

  explanation: [
    p(
      'Where does a program live? In a **file**. A file is a named place on the computer that stores information: a photo, a song, a letter. A Python program is a plain text file whose name ends with `.py`, for example `hello.py`. The ending tells the computer: the text in here is a Python program.',
      'איפה תוכנית נמצאת? ב**קובץ** (file). קובץ הוא מקום עם שם במחשב ששומר מידע: תמונה, שיר, מכתב. תוכנית פייתון היא קובץ טקסט פשוט ששמו מסתיים ב-`.py`, למשל `hello.py`. הסיומת אומרת למחשב: הטקסט שכאן הוא תוכנית פייתון.',
    ),
    term(
      '.py',
      'The ending of a Python file name. `hello.py` is a Python program called hello. In this app the file is created for you; when you work on your own computer you will name it yourself.',
      'הסיומת של שם קובץ פייתון. `hello.py` הוא תוכנית פייתון בשם hello. באפליקציה הזאת הקובץ נוצר בשבילכם; כשתעבדו במחשב שלכם, אתם תבחרו לו שם.',
    ),
    h('What "running" means', 'מה פירוש "להריץ"'),
    p(
      'A file just sits there; nothing happens until you **run** it. Running a program means: Python opens the file, reads the first line and does what it says, then reads the next line and does that, and so on until the last line. When you press Run in this app, that is exactly what happens.',
      'קובץ פשוט יושב במקומו; שום דבר לא קורה עד ש**מריצים** (run) אותו. להריץ תוכנית פירושו: פייתון פותח את הקובץ, קורא את השורה הראשונה ומבצע מה שכתוב בה, אחר כך קורא את השורה הבאה ומבצע אותה, וכך הלאה עד השורה האחרונה. כשאתם לוחצים על Run באפליקציה הזאת, זה בדיוק מה שקורה.',
    ),
    h('The three parts of your screen', 'שלושת החלקים של המסך'),
    list([
      ['The **editor** is where you type the program. What you see there is the file.', 'ה**עורך** (editor) הוא המקום שבו מקלידים את התוכנית. מה שרואים שם הוא הקובץ.'],
      ['The **Run** button hands the file to Python.', 'כפתור **Run** מוסר את הקובץ לפייתון.'],
      ['The **console** is the area where the output appears. Everything that print shows lands there.', 'ה**קונסולה** (console) היא האזור שבו הפלט מופיע. כל מה ש-`print` מציג מגיע לשם.'],
    ]),
    h('The first rule: top to bottom', 'הכלל הראשון: מלמעלה למטה'),
    p(
      'In the programs you are writing now, lines run one after another, in the order they are written: the first line first, the last line last. This order is called the **sequence**. If you want something to appear first, it has to be written first.',
      'בתוכניות שאתם כותבים עכשיו, השורות מתבצעות בזו אחר זו, בסדר שבו הן כתובות: השורה הראשונה קודם, האחרונה בסוף. לסדר הזה קוראים **רצף** (sequence). אם אתם רוצים שמשהו יופיע ראשון, הוא חייב להיות כתוב ראשון.',
    ),
    callout(
      'note',
      'Later in the course you will meet instructions that let a program choose between lines or repeat some of them (module 3 and module 4). Even then, Python only ever moves the way the program tells it to. Nothing is skipped or repeated on its own.',
      'בהמשך הקורס תפגשו הוראות שמאפשרות לתוכנית לבחור בין שורות או לחזור על חלק מהן (מודול 3 ומודול 4). גם אז, פייתון זז רק כפי שהתוכנית אומרת לו. שום דבר לא מדולג ולא חוזר מעצמו.',
    ),
    code(py`
      print("First")
      print("Second")
      print("Third")
    `, { output: 'First\nSecond\nThird' }),
    callout(
      'tip',
      'When a program like this prints things in the wrong order, do not look for a clever cause. Look at the order of the lines: with only print lines, the order of the output is the order of the lines.',
      'כשתוכנית כזאת מדפיסה דברים בסדר לא נכון, אל תחפשו סיבה מתוחכמת. הסתכלו על סדר השורות: כשיש רק שורות `print`, סדר הפלט הוא סדר השורות.',
    ),
  ],

  simpler: [
    p(
      'A file is like a page in a notebook with a name written at the top. The program is what is written on that page.',
      'קובץ הוא כמו דף במחברת עם שם כתוב למעלה. התוכנית היא מה שכתוב על הדף הזה.',
    ),
    p(
      'Running the program is like handing the page to a helper who reads it from the top line to the bottom line, doing each thing as they read it. In these programs they never start from the bottom and never skip a line; later you will learn how to write "if…" and "repeat…" notes that tell the helper to choose or repeat.',
      'להריץ את התוכנית זה כמו למסור את הדף לעוזר שקורא אותו מהשורה העליונה עד התחתונה, ומבצע כל דבר בזמן שהוא קורא. בתוכניות האלה הוא אף פעם לא מתחיל מלמטה ולא מדלג על שורה; בהמשך תלמדו לכתוב הערות "אם…" ו"חזור…" שאומרות לעוזר לבחור או לחזור.',
    ),
    p(
      'The editor is the page you write on. The Run button hands the page over. The console is where you see what the helper did.',
      'העורך הוא הדף שעליו אתם כותבים. כפתור Run מוסר את הדף. הקונסולה היא המקום שבו רואים מה העוזר עשה.',
    ),
  ],

  workedExample: [
    p(
      'Read this program before running it and say the output to yourself, in order. Then press Run and compare.',
      'קראו את התוכנית הזאת לפני שאתם מריצים אותה ואמרו לעצמכם את הפלט, לפי הסדר. אחר כך לחצו על Run והשוו.',
    ),
    code(py`
      print("Open the door")
      print("Walk in")
      print("Close the door")
    `, { output: 'Open the door\nWalk in\nClose the door' }),
    list([
      ['Python reads line 1 and prints `Open the door`.', 'פייתון קורא את שורה 1 ומדפיס `Open the door`.'],
      ['Only then does it read line 2 and print `Walk in`.', 'רק אז הוא קורא את שורה 2 ומדפיס `Walk in`.'],
      ['Last, line 3: `Close the door`. The program is finished.', 'לבסוף, שורה 3: `Close the door`. התוכנית הסתיימה.'],
    ], true),
    p(
      'If you moved the last line to the top, `Close the door` would be printed first, even though closing a door before opening it makes no sense to us. The computer does not check whether the order is sensible. It only follows it.',
      'אם תעבירו את השורה האחרונה לראש התוכנית, `Close the door` יודפס ראשון, למרות שלסגור דלת לפני שפותחים אותה לא הגיוני בעינינו. המחשב לא בודק אם הסדר הגיוני. הוא רק מבצע אותו.',
    ),
  ],

  moreExamples: [
    [
      h('Same lines, different order', 'אותן שורות, סדר אחר'),
      code(py`
        print("Close the door")
        print("Open the door")
        print("Walk in")
      `, { output: 'Close the door\nOpen the door\nWalk in' }),
      p(
        'The three lines are the same as in the worked example, but their order changed, so the order of the output changed with it. Python did exactly what the file said.',
        'שלוש השורות זהות לאלה שבדוגמה המפורטת, אבל הסדר שלהן השתנה, ולכן גם סדר הפלט השתנה. פייתון עשה בדיוק מה שכתוב בקובץ.',
      ),
    ],
    [
      h('A file can be short or long', 'קובץ יכול להיות קצר או ארוך'),
      code(py`
        print("Monday")
        print("Tuesday")
        print("Wednesday")
        print("Thursday")
        print("Friday")
      `, { output: 'Monday\nTuesday\nWednesday\nThursday\nFriday' }),
      p(
        'Five lines, five outputs, in the same order. A real program can have thousands of lines. The rule does not change: top to bottom, one line at a time.',
        'חמש שורות, חמישה פלטים, באותו סדר. תוכנית אמיתית יכולה להכיל אלפי שורות. הכלל לא משתנה: מלמעלה למטה, שורה אחת בכל פעם.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l02-hard',
    title: ['The whole week', 'שבוע שלם'],
    mode: 'write',
    instructions: [
      p(
        'Print the seven days of the week, one per line, from `Sunday` to `Saturday`. Each name starts with a capital letter. The first day is already written.',
        'הדפיסו את שבעת ימי השבוע, אחד בכל שורה, מ-`Sunday` עד `Saturday`. כל שם מתחיל באות גדולה. היום הראשון כבר כתוב.',
      ),
    ],
    starterCode: py`
      print("Sunday")
    `,
    check: {
      tests: [outputTest('Sunday\nMonday\nTuesday\nWednesday\nThursday\nFriday\nSaturday')],
    },
    hints: [
      ['One print line per day, in the order of the week.', 'שורת `print` אחת לכל יום, לפי סדר ימי השבוע.'],
      ['After Sunday come Monday, Tuesday, Wednesday, Thursday, Friday and Saturday. Check the spelling of Wednesday.', 'אחרי Sunday באים Monday, Tuesday, Wednesday, Thursday, Friday ו-Saturday. בדקו את האיות של Wednesday.'],
      ['The second line is `print("Monday")`; continue the same way until `print("Saturday")`.', 'השורה השנייה היא `print("Monday")`; המשיכו באותה צורה עד `print("Saturday")`.'],
    ],
    solution: py`
      print("Sunday")
      print("Monday")
      print("Tuesday")
      print("Wednesday")
      print("Thursday")
      print("Friday")
      print("Saturday")
    `,
    concepts: ['sequence', 'print-basic'],
  }),

  predict: {
    code: py`
      print("Stop")
      print("Look")
      print("Go")
    `,
    prompt: t(
      'What does this program print? Write the output exactly, one line under the other.',
      'מה התוכנית הזאת מדפיסה? כתבו את הפלט בדיוק, שורה מתחת לשורה.',
    ),
    answer: 'Stop\nLook\nGo',
    explanation: t(
      'Three print lines, so three lines of output, in the order they are written: Stop, then Look, then Go.',
      'שלוש שורות `print`, ולכן שלוש שורות פלט, בסדר שבו הן כתובות: Stop, אחר כך Look, ואז Go.',
    ),
  },

  exercise: exercise({
    id: 'l02-ex',
    title: ['Three greetings, in order', 'שלוש ברכות, לפי הסדר'],
    mode: 'write',
    instructions: [
      p(
        'Write a program that prints these three lines, in this order:',
        'כתבו תוכנית שמדפיסה את שלוש השורות האלה, בסדר הזה:',
      ),
      code('Good morning\nGood afternoon\nGood evening', { lang: 'text', runnable: false }),
      p(
        'The first line is already written. Add the other two under it. Then press Run and check that the console shows the three lines in the right order.',
        'השורה הראשונה כבר כתובה. הוסיפו את שתי האחרות מתחתיה. אחר כך לחצו על Run ובדקו שהקונסולה מציגה את שלוש השורות בסדר הנכון.',
      ),
    ],
    starterCode: py`
      print("Good morning")
    `,
    check: {
      tests: [outputTest('Good morning\nGood afternoon\nGood evening')],
    },
    hints: [
      ['Each line of output comes from its own print line. You need three in total.', 'כל שורת פלט מגיעה משורת `print` משלה. צריך שלוש בסך הכול.'],
      ['The order of the print lines decides the order of the output: morning, then afternoon, then evening.', 'סדר שורות ה-`print` קובע את סדר הפלט: קודם morning, אחר כך afternoon, ואז evening.'],
      ['Add `print("Good afternoon")` and then `print("Good evening")` under the first line.', 'הוסיפו `print("Good afternoon")` ואז `print("Good evening")` מתחת לשורה הראשונה.'],
    ],
    solution: py`
      print("Good morning")
      print("Good afternoon")
      print("Good evening")
    `,
    concepts: ['sequence', 'print-basic'],
  }),

  build: exercise({
    id: 'l02-build',
    title: ['Your morning routine', 'שגרת הבוקר שלכם'],
    mode: 'build',
    instructions: [
      p(
        'Write your own morning routine as a program: one step per line, in the order you really do them, from waking up to leaving the house. Use between 4 and 6 lines, in any language you like, and make every step different. Because the routine is yours, the check only looks at the shape: the number of lines and that no line repeats.',
        'כתבו את שגרת הבוקר שלכם בתור תוכנית: צעד אחד בכל שורה, בסדר שבו אתם באמת עושים אותם, מההשכמה ועד היציאה מהבית. השתמשו ב-4 עד 6 שורות, בכל שפה שתרצו, ודאגו שכל צעד יהיה שונה. מכיוון שהשגרה היא שלכם, הבדיקה מסתכלת רק על הצורה: מספר השורות, ושאף שורה לא חוזרת.',
      ),
      p(
        'The first step is written for you. You can keep it, translate it, or change it.',
        'הצעד הראשון כבר כתוב בשבילכם. אפשר להשאיר אותו, לתרגם אותו או לשנות אותו.',
      ),
    ],
    starterCode: py`
      print("Wake up")
    `,
    check: {
      tests: [
        pythonTest(
          py`
            lines = [l.strip() for l in stdout.strip().split("\n") if l.strip()]
            assert 4 <= len(lines) <= 6, M("Print between 4 and 6 lines, one step per line (you printed " + str(len(lines)) + ").", "הדפיסו בין 4 ל-6 שורות, צעד אחד בכל שורה (הדפסתם " + str(len(lines)) + ").")
            assert len(set(l.lower() for l in lines)) == len(lines), M("Each step should be different from the others.", "כל צעד צריך להיות שונה מהאחרים.")
          `,
        ),
      ],
    },
    hints: [
      ['Think of what you do between waking up and leaving: brushing teeth, getting dressed, eating breakfast.', 'חשבו מה אתם עושים בין ההשכמה ליציאה מהבית: לצחצח שיניים, להתלבש, לאכול ארוחת בוקר.'],
      ['Each step is one print line. Put them in the order you really do them.', 'כל צעד הוא שורת `print` אחת. סדרו אותם בסדר שבו אתם באמת עושים אותם.'],
      ['End with a line such as `print("Leave the house")` so it is the last line printed. Four lines are enough.', 'סיימו בשורה כמו `print("יוצאים מהבית")` כדי שזו תהיה השורה האחרונה שמודפסת. ארבע שורות מספיקות.'],
    ],
    solution: py`
      print("Wake up")
      print("Brush teeth")
      print("Get dressed")
      print("Eat breakfast")
      print("Leave the house")
    `,
    solutionNote: [
      'Any steps in any language pass, as long as there are 4 to 6 lines and they are all different.',
      'כל צעדים בכל שפה עוברים, כל עוד יש 4 עד 6 שורות וכולן שונות זו מזו.',
    ],
    concepts: ['sequence', 'print-basic', 'running-programs'],
  }),

  check: [
    choice(
      'l02-c1',
      ['What happens when you press Run?', 'מה קורה כשלוחצים על Run?'],
      [
        opt('Python reads the file and performs each line, from the top down.', 'פייתון קורא את הקובץ ומבצע כל שורה, מלמעלה למטה.', {
          correct: true,
          feedback: ['Right. Running means reading and performing the lines in order.', 'נכון. להריץ פירושו לקרוא ולבצע את השורות לפי הסדר.'],
        }),
        opt('The computer checks whether the program makes sense and fixes it.', 'המחשב בודק אם התוכנית הגיונית ומתקן אותה.', {
          feedback: ['The computer never judges whether a program makes sense, and it never changes your file. It just follows it.', 'המחשב אף פעם לא שופט אם התוכנית הגיונית, ואף פעם לא משנה את הקובץ שלכם. הוא פשוט מבצע אותו.'],
        }),
        opt('The file is saved and nothing else happens.', 'הקובץ נשמר ושום דבר אחר לא קורה.', {
          feedback: ['Saving keeps the text; running performs it. Run is what makes the output appear in the console.', 'שמירה משאירה את הטקסט; הרצה מבצעת אותו. Run הוא מה שגורם לפלט להופיע בקונסולה.'],
        }),
      ],
      ['running-programs'],
    ),
    choice(
      'l02-c2',
      ['A file is called `game.py`. What does the ending tell you?', 'קובץ נקרא `game.py`. מה הסיומת אומרת לכם?'],
      [
        opt('It is a Python program.', 'זו תוכנית פייתון.', {
          correct: true,
          feedback: ['Right. The .py ending marks a text file that holds a Python program.', 'נכון. הסיומת .py מסמנת קובץ טקסט שמכיל תוכנית פייתון.'],
        }),
        opt('It is a picture of a game.', 'זו תמונה של משחק.', {
          feedback: ['Pictures have other endings, such as .png or .jpg. .py means Python.', 'לתמונות יש סיומות אחרות, כמו .png או .jpg. הסיומת .py פירושה פייתון.'],
        }),
        opt('The program has already been run.', 'התוכנית כבר הורצה.', {
          feedback: ['The name says nothing about running. A file just sits there until you run it.', 'השם לא אומר שום דבר על הרצה. קובץ פשוט יושב במקומו עד שמריצים אותו.'],
        }),
      ],
      ['file'],
    ),
    choice(
      'l02-c3',
      ['A program has `print("B")` on line 1 and `print("A")` on line 2. What is printed first?', 'בתוכנית יש `print("B")` בשורה 1 ו-`print("A")` בשורה 2. מה מודפס ראשון?'],
      [
        opt('B, because line 1 runs first.', 'B, כי שורה 1 מתבצעת ראשונה.', {
          correct: true,
          feedback: ['Right. Line order is output order, whatever the text says.', 'נכון. סדר השורות הוא סדר הפלט, לא משנה מה כתוב בטקסט.'],
        }),
        opt('A, because A comes before B in the alphabet.', 'A, כי A באה לפני B באלפבית.', {
          feedback: ['Python does not sort anything. It runs line 1, then line 2.', 'פייתון לא ממיין שום דבר. הוא מבצע את שורה 1, ואז את שורה 2.'],
        }),
        opt('Both at the same time.', 'שניהם באותו זמן.', {
          feedback: ['Lines run one after another, not together. Line 1 finishes before line 2 starts.', 'שורות מתבצעות בזו אחר זו, לא יחד. שורה 1 מסתיימת לפני ששורה 2 מתחילה.'],
        }),
      ],
      ['sequence'],
    ),
  ],

  recap: [
    list([
      ['A program lives in a file. Python files end with `.py`.', 'תוכנית נמצאת בקובץ. קובצי פייתון מסתיימים ב-`.py`.'],
      ['Running a program means Python reads the file and performs each line.', 'להריץ תוכנית פירושו שפייתון קורא את הקובץ ומבצע כל שורה.'],
      ['You type in the editor, press Run, and read the output in the console.', 'מקלידים בעורך, לוחצים על Run, וקוראים את הפלט בקונסולה.'],
      ['In these programs, lines run in sequence: top to bottom, one after another. Choosing and repeating come in later modules.', 'בתוכניות האלה השורות מתבצעות ברצף: מלמעלה למטה, בזו אחר זו. בחירה וחזרה מגיעות במודולים הבאים.'],
    ]),
    p(
      'The top-to-bottom rule is so simple that it is easy to forget, and yet almost every question of the form "why did my program do that?" is answered by reading the lines in order.',
      'הכלל "מלמעלה למטה" כל כך פשוט שקל לשכוח אותו, ובכל זאת כמעט כל שאלה מהסוג "למה התוכנית שלי עשתה את זה?" נענית על ידי קריאת השורות לפי הסדר.',
    ),
  ],
  next: t(
    'Next you will practise thinking in steps: turning an everyday task into a precise list of instructions, which is what programming really is.',
    'בשיעור הבא תתאמנו בחשיבה בצעדים: להפוך משימה יומיומית לרשימה מדויקת של הוראות, וזה בעצם מה שתכנות באמת הוא.',
  ),

  miniChecks: [
    choice(
      'l02-m1',
      ['A file called `story.py` is…', 'קובץ בשם `story.py` הוא…'],
      [
        opt('a text file that holds a Python program.', 'קובץ טקסט שמכיל תוכנית פייתון.', { correct: true, feedback: ['Right. The .py ending says: Python program inside.', 'נכון. הסיומת .py אומרת: בפנים יש תוכנית פייתון.'] }),
        opt('a program that is already running.', 'תוכנית שכבר רצה.', { feedback: ['A file just sits there until you run it.', 'קובץ פשוט יושב במקומו עד שמריצים אותו.'] }),
      ],
      ['file'],
    ),
    choice(
      'l02-m2',
      ['Where does the text from `print` appear?', 'איפה מופיע הטקסט של `print`?'],
      [
        opt('In the console, under the editor.', 'בקונסולה, מתחת לעורך.', { correct: true, feedback: ['Right. The editor holds the file; the console shows the output.', 'נכון. בעורך נמצא הקובץ; הקונסולה מציגה את הפלט.'] }),
        opt('Inside the editor, next to the code.', 'בתוך העורך, ליד הקוד.', { feedback: ['The editor only shows what you typed. Output goes to the console.', 'העורך מציג רק מה שהקלדתם. הפלט הולך לקונסולה.'] }),
      ],
      ['console'],
    ),
  ],

  briskSummary: [
    list([
      ['A program lives in a **file**; Python files end in `.py`. Here the file is created for you.', 'תוכנית נמצאת ב**קובץ** (file); קובצי פייתון מסתיימים ב-`.py`. כאן הקובץ נוצר בשבילכם.'],
      ['**Running** a program means Python reads the file and performs each line. The **editor** holds the file, the Run button hands it to Python, and the **console** shows the output.', '**להריץ** (run) תוכנית פירושו שפייתון קורא את הקובץ ומבצע כל שורה. ה**עורך** (editor) מחזיק את הקובץ, כפתור Run מוסר אותו לפייתון, וה**קונסולה** (console) מציגה את הפלט.'],
      ['In programs like these, lines run in **sequence**, top to bottom. The order of the print lines is the order of the output. Choosing and repeating lines come in later modules.', 'בתוכניות כמו אלה השורות מתבצעות ב**רצף** (sequence), מלמעלה למטה. סדר שורות ה-`print` הוא סדר הפלט. בחירה וחזרה על שורות מגיעות במודולים הבאים.'],
    ]),
    code(py`
      print("First")
      print("Second")
    `, { output: 'First\nSecond' }),
  ],
};
