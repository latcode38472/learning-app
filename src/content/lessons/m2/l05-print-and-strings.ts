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
  requires,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l05-print-and-strings',
  moduleId: 'm2',
  title: t('print and strings: showing text on the screen', 'print ומחרוזות: להציג טקסט על המסך'),
  tagline: t('Say exactly what you want shown, and the computer shows it.', 'אמרו בדיוק מה להציג, והמחשב יציג.'),
  estimatedMinutes: 20,
  introduces: ['print', 'string', 'quotes', 'comment', 'print-multiple'],
  requires: ['print-basic', 'sequence', 'error-message'],
  runsInBrowser: true,

  objective: t(
    'Print text with print(), write strings with the right quotes, print several things on one line, and leave notes in your code with comments.',
    'להדפיס טקסט בעזרת `print()`, לכתוב מחרוזות עם המירכאות הנכונות, להדפיס כמה דברים בשורה אחת, ולהשאיר הערות בתוך הקוד.',
  ),
  prerequisiteCheck: t(
    'You can run a program, and you have seen what an error message looks like (lessons 1–4).',
    'אתם יודעים להריץ תוכנית, וכבר ראיתם איך נראית הודעת שגיאה (שיעורים 1–4).',
  ),

  explanation: [
    p(
      'In lesson 1 you typed `print("Hello")` and pressed Run. Now let us understand exactly what happened. `print` is a built-in command: it shows whatever is between its parentheses on the screen (in the console), and then moves to a new line.',
      'בשיעור 1 הקלדתם `print("Hello")` ולחצתם על Run. עכשיו נבין בדיוק מה קרה שם. `print` היא פקודה מובנית: היא מציגה על המסך (בקונסול) את מה שנמצא בין הסוגריים שלה, ואז עוברת לשורה חדשה.',
    ),
    term(
      'print()',
      'print shows a value on the screen. The parentheses hold what to show, and every print starts on a fresh line. This is how a program talks to you: without print, a program could compute for hours and you would never see a thing.',
      'הפקודה `print` מציגה ערך על המסך. בתוך הסוגריים כותבים מה להציג, וכל `print` מתחיל בשורה חדשה. ככה התוכנית מדברת איתכם: בלי `print` התוכנית יכולה לחשב שעות ואתם לא תראו כלום.',
    ),
    term(
      'string',
      'Text inside quotes is called a **string**: a row of characters — letters, digits, spaces and punctuation. Python does not try to understand a string; it carries it exactly as you typed it, and the quotes themselves are not printed.',
      'טקסט בתוך מירכאות נקרא **מחרוזת** (string): רצף של תווים — אותיות, ספרות, רווחים וסימני פיסוק. פייתון לא מנסה להבין מחרוזת; הוא מעביר אותה הלאה בדיוק כפי שהקלדתם, והמירכאות עצמן לא מודפסות.',
    ),
    code(py`
      print("Hello, World!")
    `, { output: 'Hello, World!' }),
    term(
      '" "  and  \' \'',
      'Double quotes `"` and single quotes `\'` both make a string. The only rule: close with the same kind you opened with. Choosing lets you put the other kind inside the text: `"It\'s late"` works because the apostrophe is not the closing quote.',
      'מירכאות כפולות `"` ומירכאות יחידות `\'` יוצרות שתיהן מחרוזת. הכלל היחיד: סוגרים באותו סוג שבו פתחתם. הבחירה מאפשרת לשים את הסוג השני בתוך הטקסט: `"It\'s late"` עובד כי הגרש אינו המירכאה הסוגרת.',
    ),
    code(py`
      print("It's sunny")
      print('She said "hi"')
    `, { output: 'It\'s sunny\nShe said "hi"' }),
    h('What happens without quotes?', 'מה קורה בלי מירכאות?'),
    p(
      'Without quotes Python does not see text. It sees a **name** and looks for something called `Hello` — a variable, which you will meet in the next lesson. Nothing has that name, so the program stops with a NameError:',
      'בלי מירכאות פייתון לא רואה טקסט. הוא רואה **שם**, ומחפש משהו שנקרא `Hello` — משתנה, שתפגשו בשיעור הבא. אין שום דבר עם השם הזה, ולכן התוכנית נעצרת עם שגיאת NameError:',
    ),
    code(
      'print(Hello)\n\nTraceback (most recent call last):\n  File "main.py", line 1, in <module>\n    print(Hello)\n          ^^^^^\nNameError: name \'Hello\' is not defined',
      { lang: 'text', runnable: false, caption: t('The program and the error it causes', 'התוכנית והשגיאה שהיא גורמת') },
    ),
    callout(
      'tip',
      'If you meant to print text and you see NameError, the fix is almost always the same: add quotes.',
      'אם התכוונתם להדפיס טקסט וקיבלתם NameError, התיקון כמעט תמיד זהה: הוסיפו מירכאות.',
    ),
    h('Several things on one line, and empty lines', 'כמה דברים בשורה אחת, ושורות ריקות'),
    p(
      'Put a comma between the items and print shows them one after another with a single space between each pair. The items can be strings or numbers. And `print()` with nothing inside prints an empty line — useful for spacing out your output.',
      'שימו פסיק בין הפריטים, ו-`print` יציג אותם בזה אחר זה עם רווח אחד בין כל שניים. הפריטים יכולים להיות מחרוזות או מספרים. ו-`print()` בלי כלום בפנים מדפיס שורה ריקה — שימושי כדי לרווח את הפלט.',
    ),
    code(py`
      print("Good", "morning")
      print(3, "cats")
      print()
      print("Bye")
    `, { output: 'Good morning\n3 cats\n\nBye' }),
    term(
      '#',
      'Everything after `#` on a line is a **comment**: a note for people who read the code. Python skips it completely. Use comments to explain why the code does something, or to switch a line off for a while without deleting it.',
      'כל מה שאחרי `#` בשורה הוא **הערה** (comment): פתק לאנשים שקוראים את הקוד. פייתון מדלג עליו לגמרי. השתמשו בהערות כדי להסביר למה הקוד עושה משהו, או כדי לכבות שורה לזמן מה בלי למחוק אותה.',
    ),
    code(py`
      # Greet the user
      print("Welcome")  # this part is a comment too
      # print("This line never runs")
    `, { output: 'Welcome' }),
    callout(
      'warning',
      'A comment is never printed. If you want text to appear on the screen, it has to be inside print and inside quotes.',
      'הערה אף פעם לא מודפסת. אם אתם רוצים שטקסט יופיע על המסך, הוא חייב להיות בתוך `print` ובתוך מירכאות.',
    ),
  ],

  simpler: [
    p(
      'Think of print as a loudspeaker: whatever you hand it, it announces on the screen, one announcement per line.',
      'חשבו על `print` כעל רמקול: כל מה שנותנים לו, הוא מכריז על המסך, הכרזה אחת בכל שורה.',
    ),
    p(
      'The quotes are like a box around the words. They tell Python: "this is just text — carry it as it is, do not try to understand it". Without the box, Python thinks the word is the name of something it should know, and gets confused.',
      'המירכאות הן כמו קופסה סביב המילים. הן אומרות לפייתון: "זה רק טקסט — קח אותו כמו שהוא, אל תנסה להבין אותו". בלי הקופסה, פייתון חושב שהמילה היא שם של משהו שהוא אמור להכיר, ומתבלבל.',
    ),
    p(
      'A comma between two things inside print means: say this, take a small breath (a space), then say that.',
      'פסיק בין שני דברים בתוך `print` פירושו: אמור את הראשון, קח נשימה קטנה (רווח), ואז אמור את השני.',
    ),
    p(
      'A line that starts with `#` is like a sticky note on the fridge. It is for the people who read the code; the computer walks right past it.',
      'שורה שמתחילה ב-`#` היא כמו פתק דביק על המקרר. הוא מיועד לאנשים שקוראים את הקוד; המחשב פשוט עובר לידו.',
    ),
  ],

  workedExample: [
    p(
      'Here is a small welcome sign. Read it line by line, then run it and compare with the output below.',
      'הנה שלט קבלת פנים קטן. קראו אותו שורה אחר שורה, ואז הריצו אותו והשוו לפלט שלמטה.',
    ),
    code(py`
      # A small welcome sign
      print("Welcome to CodePath")
      print()
      print("Lesson", 5, "is about", "print")
      print("Let's start.")
    `, { output: 'Welcome to CodePath\n\nLesson 5 is about print\nLet\'s start.' }),
    list([
      ['Line 1 is a comment. Python skips it; it is there for whoever reads the code.', 'שורה 1 היא הערה. פייתון מדלג עליה; היא שם בשביל מי שקורא את הקוד.'],
      ['Line 2 prints one string. The quotes mark its start and end and are not shown.', 'שורה 2 מדפיסה מחרוזת אחת. המירכאות מסמנות את ההתחלה והסוף שלה ולא מוצגות.'],
      ['Line 3 is an empty print, so the output gets an empty line.', 'שורה 3 היא `print` ריק, ולכן בפלט מופיעה שורה ריקה.'],
      ['Line 4 prints four items separated by commas, with a space between each pair. The `5` has no quotes: it is a number, and print can show numbers too.', 'שורה 4 מדפיסה ארבעה פריטים מופרדים בפסיקים, עם רווח בין כל שניים. ל-`5` אין מירכאות: זה מספר, ו-`print` יודע להציג גם מספרים.'],
      ['Line 5 contains an apostrophe, so the string is wrapped in double quotes.', 'שורה 5 מכילה גרש, ולכן המחרוזת עטופה במירכאות כפולות.'],
    ], true),
  ],

  moreExamples: [
    [
      h('Each print, one line', 'כל print — שורה אחת'),
      code(py`
        print("one")
        print("two")
        print("three", "four")
      `, { output: 'one\ntwo\nthree four' }),
      p(
        'Every print ends its line. Items inside the same print stay together on one line, separated by spaces.',
        'כל `print` מסיים את השורה שלו. פריטים בתוך אותו `print` נשארים יחד בשורה אחת, מופרדים ברווחים.',
      ),
    ],
    [
      h('Comments do not change the output', 'הערות לא משנות את הפלט'),
      code(py`
        # Shopping list
        print("milk")  # we always need milk
        # print("eggs")
        print("bread")
      `, { output: 'milk\nbread' }),
      p(
        'Line 1 is a note. The comment at the end of line 2 is skipped as well. Line 3 is switched off by the `#`, so eggs never appears. Programmers do this to try a program without one line, and later remove the `#` to switch the line back on.',
        'שורה 1 היא פתק. גם ההערה בסוף שורה 2 מדולגת. שורה 3 כבויה בגלל ה-`#`, ולכן eggs לא מופיע בכלל. מתכנתים עושים את זה כדי לנסות תוכנית בלי שורה מסוימת, ואחר כך מסירים את ה-`#` כדי להדליק אותה מחדש.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l05-hard',
    title: ['Quotes inside quotes', 'מירכאות בתוך מירכאות'],
    mode: 'write',
    instructions: [
      p(
        'Print exactly these three lines: the text `Don\'t panic`, then an empty line, then the text `Say "cheese"` (with the double quotes around cheese). You will need both kinds of quotes.',
        'הדפיסו בדיוק את שלוש השורות האלה: הטקסט `Don\'t panic`, אחר כך שורה ריקה, ואז הטקסט `Say "cheese"` (עם המירכאות הכפולות סביב cheese). תצטרכו את שני סוגי המירכאות.',
      ),
      code('Don\'t panic\n\nSay "cheese"', { lang: 'text', runnable: false, caption: t('Expected output', 'הפלט הצפוי') }),
    ],
    starterCode: py`
      # line 1: Don't panic
      # line 2: an empty line
      # line 3: Say "cheese"
    `,
    check: {
      tests: [outputTest('Don\'t panic\n\nSay "cheese"')],
    },
    hints: [
      ['A string that contains an apostrophe should be wrapped in double quotes.', 'מחרוזת שמכילה גרש כדאי לעטוף במירכאות כפולות.'],
      ['A string that contains double quotes should be wrapped in single quotes.', 'מחרוזת שמכילה מירכאות כפולות כדאי לעטוף במירכאות יחידות.'],
      ['`print()` with nothing inside prints the empty line in the middle.', '`print()` בלי כלום בפנים מדפיס את השורה הריקה שבאמצע.'],
    ],
    solution: py`
      print("Don't panic")
      print()
      print('Say "cheese"')
    `,
    concepts: ['print', 'string', 'quotes'],
  }),

  predict: {
    code: py`
      print("Sun", "and", "rain")
      # print("Snow")
      print('Wind')
    `,
    prompt: t('What does this program print?', 'מה התוכנית הזאת תדפיס?'),
    answer: 'Sun and rain\nWind',
    explanation: t(
      'Line 1 prints three items with a space between each pair: Sun and rain. Line 2 is a comment, so Snow is never printed. Line 3 uses single quotes, which make a string just like double quotes, so Wind is printed on its own line.',
      'שורה 1 מדפיסה שלושה פריטים עם רווח בין כל שניים: Sun and rain. שורה 2 היא הערה, ולכן Snow לא מודפס בכלל. שורה 3 משתמשת במירכאות יחידות, שיוצרות מחרוזת בדיוק כמו מירכאות כפולות, ולכן Wind מודפס בשורה משלו.',
    ),
  },

  exercise: exercise({
    id: 'l05-ex',
    title: ['Three bugs, one program', 'שלושה באגים, תוכנית אחת'],
    mode: 'fix',
    instructions: [
      p(
        'This program should print three lines: `Hello`, then `It\'s me`, then `Bye`. It has three bugs — one on each line. Run it, read the error message, fix one bug, and run again until the output is right.',
        'התוכנית הזאת אמורה להדפיס שלוש שורות: `Hello`, אחר כך `It\'s me`, ואז `Bye`. יש בה שלושה באגים — אחד בכל שורה. הריצו אותה, קראו את הודעת השגיאה, תקנו באג אחד, והריצו שוב עד שהפלט נכון.',
      ),
    ],
    starterCode: py`
      print(Hello)
      print('It's me')
      # print("Bye")
    `,
    check: {
      tests: [outputTest('Hello\nIt\'s me\nBye')],
    },
    hints: [
      ['Python reports the first problem it finds — not necessarily on line 1. On line 2 the apostrophe in It\'s is read as the end of the string. Which kind of quotes would fix that?', 'פייתון מדווח על הבעיה הראשונה שהוא מוצא — והיא לא בהכרח בשורה 1. בשורה 2 הגרש שבתוך It\'s נקרא כסיום המחרוזת. איזה סוג מירכאות יפתור את זה?'],
      ['NameError on line 1 means Python looked for something called Hello. Text needs quotes.', 'NameError בשורה 1 פירושו שפייתון חיפש משהו שנקרא Hello. טקסט צריך מירכאות.'],
      ['A line that starts with `#` is a comment and never runs. Remove the `#` so the last line prints.', 'שורה שמתחילה ב-`#` היא הערה ואף פעם לא רצה. הסירו את ה-`#` כדי שהשורה האחרונה תודפס.'],
    ],
    solution: py`
      print("Hello")
      print("It's me")
      print("Bye")
    `,
    concepts: ['print', 'quotes', 'comment'],
  }),

  build: exercise({
    id: 'l05-build',
    title: ['An event poster', 'פוסטר לאירוע'],
    mode: 'build',
    instructions: [
      p(
        'Build a poster for an event of your choice (a party, a game, a science fair), in English or in Hebrew. Print it in this shape: the event name on the first line, then an empty line, then a date line and a place line. The date line starts with the label `Date:` (or `תאריך:`) and the place line with `Place:` (or `מקום:`). For example:',
        'בנו פוסטר לאירוע לבחירתכם (מסיבה, משחק, יריד מדע), בעברית או באנגלית. הדפיסו אותו בצורה הזאת: שם האירוע בשורה הראשונה, אחר כך שורה ריקה, ואז שורת תאריך ושורת מקום. שורת התאריך מתחילה בתווית `תאריך:` (או `Date:`) ושורת המקום ב-`מקום:` (או `Place:`). למשל:',
      ),
      code({ en: 'Science Fair\n\nDate: 14\nPlace: Room 3', he: 'יריד מדע\n\nתאריך: 14\nמקום: חדר 3' }, { lang: 'text', runnable: false }),
      list([
        ['The date must be printed as two items: the label and a number, separated by a comma — like `print("Date:", 14)`.', 'את התאריך יש להדפיס כשני פריטים: התווית ומספר, מופרדים בפסיק — כמו `print("תאריך:", 14)`.'],
        ['Use `print()` for the empty line.', 'השתמשו ב-`print()` בשביל השורה הריקה.'],
        ['Add at least one comment line (starting with `#`) that says what the poster is for.', 'הוסיפו לפחות שורת הערה אחת (שמתחילה ב-`#`) שאומרת בשביל מה הפוסטר.'],
      ]),
    ],
    starterCode: py`
      # write a comment describing your poster here

      # 1. the event name

      # 2. an empty line

      # 3. Date: and a number, separated by a comma

      # 4. Place: and the place
    `,
    check: {
      requires: [
        requires(
          'print\\(\\s*["\'](Date:|תאריך:)["\']\\s*,',
          'Print the date label and the number as two items separated by a comma, like print("Date:", 14).',
          'הדפיסו את תווית התאריך ואת המספר כשני פריטים מופרדים בפסיק, למשל `print("תאריך:", 14)`.',
        ),
      ],
      tests: [
        pythonTest(
          py`
            lines = stdout.split("\n")
            while lines and lines[-1].strip() == "":
                lines.pop()
            assert len(lines) >= 4, M("Print at least four lines: the event name, an empty line, a date line and a place line.", "הדפיסו לפחות ארבע שורות: שם האירוע, שורה ריקה, שורת תאריך ושורת מקום.")
            assert lines[0].strip() != "", M("The first line must be the event name.", "השורה הראשונה חייבת להיות שם האירוע.")
            assert lines[1].strip() == "", M("The second line must be empty: use print() with nothing inside.", "השורה השנייה חייבת להיות ריקה: השתמשו ב-print() בלי כלום בפנים.")
            def after_label(line, labels):
                for label in labels:
                    if line.startswith(label + " "):
                        return line[len(label) + 1:]
                return None
            date_ok = any((rest := after_label(l, ("Date:", "תאריך:"))) is not None and rest.split() and rest.split()[0].isdigit() for l in lines)
            assert date_ok, M("Print a line that starts with 'Date: ' (or 'תאריך: ') followed by a number.", "הדפיסו שורה שמתחילה ב-'תאריך: ' (או 'Date: ') ואחריה מספר.")
            place_ok = any((rest := after_label(l, ("Place:", "מקום:"))) is not None and rest.strip() != "" for l in lines)
            assert place_ok, M("Print a line that starts with 'Place: ' (or 'מקום: ') followed by the place.", "הדפיסו שורה שמתחילה ב-'מקום: ' (או 'Place: ') ואחריה המקום.")
            assert any(l.lstrip().startswith("#") for l in source.split("\n")), M("Add at least one comment line that starts with #.", "הוסיפו לפחות שורת הערה אחת שמתחילה ב-#.")
          `,
        ),
      ],
    },
    hints: [
      ['Start with the title: one print with the event name in quotes. Then `print()` on its own.', 'התחילו מהכותרת: `print` אחד עם שם האירוע במירכאות. אחר כך `print()` לבד.'],
      ['The date line prints two items: `print("Date:", 14)` — the label in quotes, a comma, then the number without quotes.', 'שורת התאריך מדפיסה שני פריטים: `print("תאריך:", 14)` — התווית במירכאות, פסיק, ואז המספר בלי מירכאות.'],
      ['The place line works the same way: `print("Place:", "Room 3")`. Do not forget a comment line starting with `#`.', 'שורת המקום עובדת באותו אופן: `print("מקום:", "חדר 3")`. אל תשכחו שורת הערה שמתחילה ב-`#`.'],
    ],
    solution: py`
      # Poster for the school science fair
      print("Science Fair")
      print()
      print("Date:", 14)
      print("Place:", "Room 3")
    `,
    solutionNote: [
      'Any event, date and place work, in English or Hebrew, as long as the shape is the same.',
      'כל אירוע, תאריך ומקום מתאימים, בעברית או באנגלית, כל עוד הצורה נשארת זהה.',
    ],
    concepts: ['print', 'string', 'print-multiple', 'comment'],
  }),

  check: [
    choice(
      'l05-c1',
      ['Which line prints the word Hello on the screen?', 'איזו שורה מדפיסה את המילה Hello על המסך?'],
      [
        opt('`print("Hello")`', '`print("Hello")`', {
          correct: true,
          feedback: ['Right. The quotes make Hello a string, and print shows it.', 'נכון. המירכאות הופכות את Hello למחרוזת, ו-print מציג אותה.'],
        }),
        opt('`print(Hello)`', '`print(Hello)`', {
          feedback: ['Without quotes Python looks for something named Hello and stops with a NameError.', 'בלי מירכאות פייתון מחפש משהו בשם Hello ונעצר עם NameError.'],
        }),
        opt('`# print("Hello")`', '`# print("Hello")`', {
          feedback: ['The `#` turns the whole line into a comment, so nothing is printed.', 'ה-`#` הופך את כל השורה להערה, ולכן שום דבר לא מודפס.'],
        }),
      ],
      ['print', 'quotes', 'comment'],
    ),
    choice(
      'l05-c2',
      ['What does `print("2", "cats")` show?', 'מה מציג `print("2", "cats")`?'],
      [
        opt('`2 cats`', '`2 cats`', {
          correct: true,
          feedback: ['Yes. The comma separates two items, and print puts one space between them.', 'כן. הפסיק מפריד בין שני פריטים, ו-print שם רווח אחד ביניהם.'],
        }),
        opt('`2cats`', '`2cats`', {
          feedback: ['A comma between items always adds a space.', 'פסיק בין פריטים תמיד מוסיף רווח.'],
        }),
        opt('`"2", "cats"`', '`"2", "cats"`', {
          feedback: ['Quotes and commas are part of the code, not of the output. Only the text inside the quotes is shown.', 'המירכאות והפסיקים הם חלק מהקוד, לא מהפלט. רק הטקסט שבתוך המירכאות מוצג.'],
        }),
      ],
      ['print-multiple', 'quotes'],
    ),
    choice(
      'l05-c3',
      ['What is a comment for?', 'בשביל מה משמשת הערה?'],
      [
        opt('A note for people who read the code; Python ignores it.', 'פתק לאנשים שקוראים את הקוד; פייתון מתעלם ממנו.', {
          correct: true,
          feedback: ['Correct. Comments explain the code and never affect what the program does.', 'נכון. הערות מסבירות את הקוד ואף פעם לא משפיעות על מה שהתוכנית עושה.'],
        }),
        opt('Text that print shows on the screen.', 'טקסט ש-print מציג על המסך.', {
          feedback: ['Comments are never printed. To show text, use print with quotes.', 'הערות אף פעם לא מודפסות. כדי להציג טקסט, השתמשו ב-print עם מירכאות.'],
        }),
        opt('A way to make the program run faster.', 'דרך לגרום לתוכנית לרוץ מהר יותר.', {
          feedback: ['Comments have no effect on speed; Python simply skips them.', 'להערות אין שום השפעה על המהירות; פייתון פשוט מדלג עליהן.'],
        }),
      ],
      ['comment'],
    ),
  ],

  recap: [
    list([
      ['`print(...)` shows what is inside the parentheses and moves to a new line.', '`print(...)` מציג את מה שבתוך הסוגריים ועובר לשורה חדשה.'],
      ['Text must be inside quotes, `"like this"` or `\'like this\'`. The quotes are not printed.', 'טקסט חייב להיות בתוך מירכאות, `"ככה"` או `\'ככה\'`. המירכאות לא מודפסות.'],
      ['Without quotes, Python treats a word as a name and reports a NameError.', 'בלי מירכאות, פייתון מתייחס למילה כאל שם ומדווח על NameError.'],
      ['Commas inside print separate items with a space; `print()` prints an empty line.', 'פסיקים בתוך `print` מפרידים בין פריטים ברווח; `print()` מדפיס שורה ריקה.'],
      ['`#` starts a comment: a note for people, ignored by Python.', '`#` מתחיל הערה: פתק לאנשים, שפייתון מתעלם ממנו.'],
    ]),
    p(
      'Printing looks small, but it is the main way you will see what your programs are doing — and the first tool you reach for when something goes wrong.',
      'הדפסה נראית כמו דבר קטן, אבל היא הדרך העיקרית שבה תראו מה התוכניות שלכם עושות — והכלי הראשון שתשלפו כשמשהו משתבש.',
    ),
  ],
  next: t(
    'Next you will give values a name with variables, so a program can remember things from one line to the next.',
    'בשיעור הבא תיתנו שמות לערכים בעזרת משתנים, כדי שתוכנית תוכל לזכור דברים משורה לשורה.',
  ),

  miniChecks: [
    choice(
      'l05-m1',
      ['What does `print("It\'s late")` show?', 'מה מציג `print("It\'s late")`?'],
      [
        opt('`It\'s late`', '`It\'s late`', { correct: true, feedback: ['Right. The double quotes wrap the text; the apostrophe inside is just a character.', 'נכון. המירכאות הכפולות עוטפות את הטקסט; הגרש שבפנים הוא סתם תו.'] }),
        opt('An error, because there are three quote marks.', 'שגיאה, כי יש שלושה סימני מירכאות.', { feedback: ['The string opens and closes with double quotes; the apostrophe does not close it.', 'המחרוזת נפתחת ונסגרת במירכאות כפולות; הגרש לא סוגר אותה.'] }),
      ],
      ['quotes'],
    ),
    choice(
      'l05-m2',
      ['What does `print("Sum:", 7)` show?', 'מה מציג `print("Sum:", 7)`?'],
      [
        opt('`Sum: 7`', '`Sum: 7`', { correct: true, feedback: ['Right: two items, one space between them.', 'נכון: שני פריטים, רווח אחד ביניהם.'] }),
        opt('`Sum:7`', '`Sum:7`', { feedback: ['A comma between items always adds one space.', 'פסיק בין פריטים תמיד מוסיף רווח אחד.'] }),
      ],
      ['print-multiple'],
    ),
  ],

  briskSummary: [
    list([
      ['`print(...)` shows what is inside the parentheses in the console and then moves to a new line; `print()` prints an empty line.', '`print(...)` מציג בקונסולה את מה שבתוך הסוגריים ואז עובר לשורה חדשה; `print()` מדפיס שורה ריקה.'],
      ['Text inside quotes is a **string**. `"..."` and `\'...\'` both work; close with the kind you opened with, so `"It\'s"` and `\'Say "hi"\'` are fine. The quotes are not printed.', 'טקסט בתוך מירכאות הוא **מחרוזת** (string). גם `"..."` וגם `\'...\'` עובדים; סוגרים באותו סוג שפתחתם, ולכן `"It\'s"` ו-`\'Say "hi"\'` תקינים. המירכאות לא מודפסות.'],
      ['Without quotes Python sees a **name**, looks it up, and stops with `NameError`. The fix: add quotes.', 'בלי מירכאות פייתון רואה **שם**, מחפש אותו, ונעצר עם `NameError`. התיקון: הוסיפו מירכאות.'],
      ['Commas inside print separate items with one space: `print("Good", "morning")` → `Good morning`. Numbers need no quotes.', 'פסיקים בתוך `print` מפרידים בין פריטים ברווח אחד: `print("Good", "morning")` ← `Good morning`. מספרים לא צריכים מירכאות.'],
      ['`#` starts a **comment**: a note for people that Python skips; also handy for switching a line off.', '`#` מתחיל **הערה** (comment): פתק לאנשים שפייתון מדלג עליו; שימושי גם לכיבוי שורה.'],
    ]),
  ],
};
