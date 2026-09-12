import type { Lesson } from '../../schema';
import {
  p,
  h,
  code,
  list,
  callout,
  term,
  table,
  t,
  opt,
  choice,
  exercise,
  outputTest,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l04-first-bug',
  moduleId: 'm1',
  title: t('Your first bug', 'הבאג הראשון שלכם'),
  tagline: t('What an error message says, and how to fix it calmly.', 'מה הודעת שגיאה אומרת, ואיך מתקנים אותה ברוגע.'),
  estimatedMinutes: 20,
  introduces: ['bug', 'error-message', 'syntax-error', 'debugging'],
  requires: ['print-basic', 'sequence'],
  runsInBrowser: true,

  objective: t(
    'Read an error message, find the line it points to, and fix the most common beginner mistakes.',
    'לקרוא הודעת שגיאה, למצוא את השורה שהיא מצביעה עליה, ולתקן את הטעויות הנפוצות ביותר של מתחילים.',
  ),
  prerequisiteCheck: t(
    'You can write a few print lines and run them (lessons 1–3).',
    'אתם יודעים לכתוב כמה שורות `print` ולהריץ אותן (שיעורים 1–3).',
  ),

  explanation: [
    p(
      'A **bug** is a mistake in a program. Every programmer makes them, every day. The difference between a beginner and an expert is not fewer bugs; it is calmer fixing. Many bugs make Python stop and print an **error message**. The message is not a punishment. It is the computer telling you, as precisely as it can, where it got stuck.',
      '**באג** (bug) הוא טעות בתוכנית. כל מתכנת עושה טעויות כאלה, כל יום. ההבדל בין מתחילים למומחים הוא לא פחות באגים, אלא תיקון רגוע יותר. באגים רבים גורמים לפייתון לעצור ולהדפיס **הודעת שגיאה** (error message). ההודעה היא לא עונש. היא הדרך של המחשב להגיד לכם, בדיוק רב ככל שהוא יכול, איפה הוא נתקע.',
    ),
    h('Reading an error message', 'איך קוראים הודעת שגיאה'),
    p(
      'Here is a program with one bug: the closing quotation mark is missing.',
      'הנה תוכנית עם באג אחד: המירכאות הסוגרות חסרות.',
    ),
    code('print("Hello)', { lang: 'text', runnable: false, caption: t('The program', 'התוכנית') }),
    code(py`
        File "main.py", line 1
          print("Hello)
                ^
      SyntaxError: unterminated string literal (detected at line 1)
    `, { lang: 'text', runnable: false, caption: t('What Python reports', 'מה פייתון מדווח') }),
    list([
      ['**The error type**, at the start of the last line: `SyntaxError`. It says what kind of problem this is.', '**סוג השגיאה**, בתחילת השורה האחרונה: `SyntaxError`. הוא אומר מאיזה סוג הבעיה.'],
      ['**The line number**: `line 1`. Python points at the line where it got stuck. Look there first. The `^` mark shows where in the line.', '**מספר השורה**: `line 1`. פייתון מצביע על השורה שבה הוא נתקע. הסתכלו שם קודם. הסימן `^` מראה איפה בשורה.'],
      ['**The message**, after the colon: `unterminated string literal`. "String literal" is Python\'s name for text in quotation marks; "unterminated" means it never ended. In plain words: a closing quotation mark is missing.', '**ההודעה**, אחרי הנקודתיים: `unterminated string literal`. "string literal" הוא השם בפייתון לטקסט בתוך מירכאות; "unterminated" פירושו שהוא לא נסגר. במילים פשוטות: חסרות מירכאות סוגרות.'],
    ], true),
    term(
      'SyntaxError',
      'Syntax means the spelling and grammar of Python. A SyntaxError means Python could not even read the line: a quotation mark or bracket is missing, or something is in the wrong place. Python checks the whole file before running it, so with a SyntaxError nothing runs, not even the lines above the mistake.',
      '"תחביר" (syntax) הוא הכתיב והדקדוק של פייתון. שגיאת תחביר (SyntaxError) פירושה שפייתון לא הצליח אפילו לקרוא את השורה: חסרות מירכאות או סוגריים, או שמשהו נמצא במקום הלא נכון. פייתון בודק את כל הקובץ לפני שהוא מריץ אותו, ולכן עם שגיאת תחביר שום דבר לא רץ, אפילו לא השורות שמעל הטעות.',
    ),
    term(
      'NameError',
      'Python met a word it does not know. This happens when print is misspelled (`pirnt`, or `Print` with a capital P), or when text is written without quotation marks, so Python thinks the word is a name it should look up. A NameError happens while the program runs, so the lines above it have already done their work.',
      'פייתון נתקל במילה שהוא לא מכיר. זה קורה כש-`print` כתוב עם שגיאת כתיב (`pirnt`, או `Print` עם P גדולה), או כשטקסט נכתב בלי מירכאות, ואז פייתון חושב שהמילה היא שם שהוא צריך לחפש. שגיאת שם (NameError) קורית בזמן שהתוכנית רצה, ולכן השורות שמעליה כבר עשו את שלהן.',
    ),
    h('The three most common bugs right now', 'שלושת הבאגים הנפוצים ביותר כרגע'),
    table(
      [['The bug', 'הבאג'], ['What was typed', 'מה הוקלד'], ['What Python says', 'מה פייתון אומר']],
      [
        [['A missing quotation mark', 'מירכאות חסרות'], ['`print("Hello)`', '`print("Hello)`'], ['`SyntaxError: unterminated string literal` (the text never ends)', '`SyntaxError: unterminated string literal` (הטקסט לא נסגר)']],
        [['A missing bracket', 'סוגר חסר'], ['`print("Hello"`', '`print("Hello"`'], ['`SyntaxError: \'(\' was never closed` (a bracket never closes)', '`SyntaxError: \'(\' was never closed` (סוגר לא נסגר)']],
        [['print misspelled', 'שגיאת כתיב ב-print'], ['`pirnt("Hello")`', '`pirnt("Hello")`'], ['`NameError: name \'pirnt\' is not defined` (unknown word)', '`NameError: name \'pirnt\' is not defined` (מילה לא מוכרת)']],
        [['Text without quotation marks', 'טקסט בלי מירכאות'], ['`print(Hello)`', '`print(Hello)`'], ['`NameError: name \'Hello\' is not defined` (unknown word)', '`NameError: name \'Hello\' is not defined` (מילה לא מוכרת)']],
      ],
    ),
    h('A three-step habit', 'הרגל בן שלושה צעדים'),
    list([
      ['**Read the message.** Find the error type and the line number. Do not guess before you have read it.', '**קראו את ההודעה.** מצאו את סוג השגיאה ואת מספר השורה. אל תנחשו לפני שקראתם.'],
      ['**Go to that line.** Look at it character by character: `print` spelled right, both brackets, both quotation marks.', '**לכו לשורה הזאת.** הסתכלו עליה תו אחר תו: `print` כתוב נכון, שני הסוגריים, שתי המירכאות.'],
      ['**Compare with a working line.** `print("Hello")` is your model. Whatever differs is probably the bug. Fix one thing, run again, read again.', '**השוו לשורה שעובדת.** `print("Hello")` היא הדוגמה שלכם. מה ששונה הוא כנראה הבאג. תקנו דבר אחד, הריצו שוב, קראו שוב.'],
    ], true),
    p(
      'This habit of reading, locating and fixing is called **debugging**. It is a skill, and like any skill it gets faster with practice.',
      'להרגל הזה של קריאה, איתור ותיקון קוראים **ניפוי שגיאות** (debugging), ובעברית מדוברת פשוט "דיבוג". זו מיומנות, וכמו כל מיומנות היא נעשית מהירה יותר עם תרגול.',
    ),
    callout(
      'note',
      'Python reports only the first problem it finds. Fix it, run again, and you may see a second message. That is normal. It is not a new failure; it is progress.',
      'פייתון מדווח רק על הבעיה הראשונה שהוא מוצא. תקנו אותה, הריצו שוב, ואולי תראו הודעה שנייה. זה רגיל. זה לא כישלון חדש; זו התקדמות.',
    ),
  ],

  simpler: [
    p(
      'Remember the literal helper from lesson 1? Imagine you hand them a note that says "bring me the red cu". They stop and say: "Line 1: I do not know what a cu is." That is an error message. The helper is not angry. They are stuck, and they are telling you where.',
      'זוכרים את העוזר המילולי משיעור 1? דמיינו שאתם מוסרים לו פתק שכתוב בו "תביא לי את הכוס האדו". הוא עוצר ואומר: "שורה 1: אני לא יודע מה זה אדו." זו הודעת שגיאה. העוזר לא כועס. הוא נתקע, והוא אומר לכם איפה.',
    ),
    p(
      'Most stuck moments right now are typing slips: a missing quotation mark, a missing bracket, or print spelled wrong. Look at the line the helper named, compare it with a line that worked, and fix the difference.',
      'רוב הפעמים שנתקעים כרגע הן פליטות מקלדת: מירכאות חסרות, סוגר חסר, או `print` שכתוב לא נכון. הסתכלו על השורה שהעוזר ציין, השוו אותה לשורה שעבדה, ותקנו את ההבדל.',
    ),
    p(
      'Then hand the note back: press Run. If you get another note, do the same thing again. Every fix moves you forward.',
      'אחר כך מסרו את הפתק בחזרה: לחצו על Run. אם תקבלו עוד פתק, עשו שוב את אותו הדבר. כל תיקון מקדם אתכם.',
    ),
  ],

  workedExample: [
    p(
      'Here is a program with one bug. Read it, then read the message Python gives.',
      'הנה תוכנית עם באג אחד. קראו אותה, ואז קראו את ההודעה שפייתון נותן.',
    ),
    code(py`
      print("Good morning")
      prnt("Good night")
    `, { lang: 'text', runnable: false, caption: t('The program', 'התוכנית') }),
    code(py`
      Traceback (most recent call last):
        File "main.py", line 2, in <module>
          prnt("Good night")
          ^^^^
      NameError: name 'prnt' is not defined
    `, { lang: 'text', runnable: false, caption: t('What Python reports', 'מה פייתון מדווח') }),
    list([
      ['Step 1, read: the type is `NameError`, the line is 2, and the message says the name `prnt` is not defined.', 'צעד 1, קריאה: הסוג הוא `NameError`, השורה היא 2, וההודעה אומרת שהשם `prnt` לא מוגדר.'],
      ['Step 2, go to line 2: `prnt("Good night")`.', 'צעד 2, הולכים לשורה 2: `prnt("Good night")`.'],
      ['Step 3, compare with line 1, which worked: `print` against `prnt`. The letter i is missing.', 'צעד 3, משווים לשורה 1, שעבדה: `print` מול `prnt`. האות i חסרה.'],
      ['Notice that `Good morning` was printed before the message appeared: line 1 ran fine, and Python stopped only at line 2.', 'שימו לב ש-`Good morning` הודפס לפני שההודעה הופיעה: שורה 1 רצה כרגיל, ופייתון עצר רק בשורה 2.'],
    ], true),
    code(py`
      print("Good morning")
      print("Good night")
    `, { output: 'Good morning\nGood night', caption: t('Fixed', 'אחרי התיקון') }),
    p(
      'One letter, one fix, and the program works. Most bugs you will meet in the next few weeks are exactly this size.',
      'אות אחת, תיקון אחד, והתוכנית עובדת. רוב הבאגים שתפגשו בשבועות הקרובים הם בדיוק בגודל הזה.',
    ),
  ],

  moreExamples: [
    [
      h('A bracket that never closes', 'סוגר שלא נסגר'),
      code('print("See you"', { lang: 'text', runnable: false, caption: t('The program', 'התוכנית') }),
      code(py`
        File "main.py", line 1
          print("See you"
               ^
      SyntaxError: '(' was never closed
      `, { lang: 'text', runnable: false, caption: t('What Python reports', 'מה פייתון מדווח') }),
      p(
        'The message even names the character: the `(` was never closed. Add `)` at the end of the line and the program prints `See you`.',
        'ההודעה אפילו מציינת את התו: הסוגר `(` אף פעם לא נסגר. הוסיפו `)` בסוף השורה והתוכנית תדפיס `See you`.',
      ),
    ],
    [
      h('Text without quotation marks', 'טקסט בלי מירכאות'),
      code(py`
        print("Hi")
        print(Bye)
      `, { lang: 'text', runnable: false, caption: t('The program', 'התוכנית') }),
      code(py`
        Traceback (most recent call last):
          File "main.py", line 2, in <module>
            print(Bye)
                  ^^^
        NameError: name 'Bye' is not defined
      `, { lang: 'text', runnable: false, caption: t('What Python reports', 'מה פייתון מדווח') }),
      p(
        'Without quotation marks Python does not see text; it sees a name, and looks for something called Bye. There is nothing, so: NameError. The fix is `print("Bye")`. Notice that `Hi` was printed first, because line 1 had already run.',
        'בלי מירכאות פייתון לא רואה טקסט; הוא רואה שם, ומחפש משהו שנקרא Bye. אין דבר כזה, ולכן: NameError. התיקון הוא `print("Bye")`. שימו לב ש-`Hi` הודפס קודם, כי שורה 1 כבר רצה.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l04-hard',
    title: ['Four bugs, one program', 'ארבעה באגים, תוכנית אחת'],
    mode: 'fix',
    instructions: [
      p(
        'This program should print the six lines below, but it has four bugs. Fix them one at a time: run, read the message, fix that line, run again. One of the messages is new to you; read it anyway, it tells you what to do.',
        'התוכנית הזאת אמורה להדפיס את שש השורות שלמטה, אבל יש בה ארבעה באגים. תקנו אותם אחד-אחד: הריצו, קראו את ההודעה, תקנו את השורה, הריצו שוב. אחת ההודעות חדשה לכם; קראו אותה בכל זאת, היא אומרת מה לעשות.',
      ),
      code('Welcome to the game\nYou have three lives\nLevel one starts now\nWatch out for the dragon\nReady\nGo!', { lang: 'text', runnable: false }),
    ],
    starterCode: py`
      print("Welcome to the game")
      Print("You have three lives")
      print("Level one starts now"))
      print("Watch out for the dragon)
      print(Ready)
      print("Go!")
    `,
    check: {
      tests: [outputTest('Welcome to the game\nYou have three lives\nLevel one starts now\nWatch out for the dragon\nReady\nGo!')],
    },
    hints: [
      ['Python shows one problem at a time. After each fix, run again and read the new message.', 'פייתון מציג בעיה אחת בכל פעם. אחרי כל תיקון, הריצו שוב וקראו את ההודעה החדשה.'],
      ['Two bugs are SyntaxErrors (one bracket too many, one quotation mark too few) and two are NameErrors (a capital letter, and text without quotation marks).', 'שני באגים הם שגיאות תחביר (סוגר אחד יותר מדי, מירכאות אחת פחות מדי) ושניים הם שגיאות שם (אות גדולה, וטקסט בלי מירכאות).'],
      ['Line 2: print with a small p. Line 3: remove one `)`. Line 4: add `"` before the `)`. Line 5: put quotation marks around Ready.', 'שורה 2: `print` עם p קטנה. שורה 3: הסירו `)` אחד. שורה 4: הוסיפו `"` לפני ה-`)`. שורה 5: שימו מירכאות סביב Ready.'],
    ],
    solution: py`
      print("Welcome to the game")
      print("You have three lives")
      print("Level one starts now")
      print("Watch out for the dragon")
      print("Ready")
      print("Go!")
    `,
    concepts: ['bug', 'error-message', 'syntax-error', 'debugging'],
  }),

  predict: {
    code: py`
      print("pirnt")
    `,
    prompt: t('Does this program have a bug? What happens when it runs?', 'האם יש בתוכנית הזאת באג? מה קורה כשהיא רצה?'),
    options: [
      opt('It prints `pirnt`. The misspelling is inside the quotation marks, so it is just text.', 'היא מדפיסה `pirnt`. שגיאת הכתיב נמצאת בתוך המירכאות, ולכן היא סתם טקסט.', {
        correct: true,
        feedback: ['Right. The instruction, print, is spelled correctly. What is between the quotation marks can be anything.', 'נכון. ההוראה, `print`, כתובה נכון. מה שבין המירכאות יכול להיות כל דבר.'],
      }),
      opt('It stops with `NameError: name \'pirnt\' is not defined`.', 'היא עוצרת עם `NameError: name \'pirnt\' is not defined`.', {
        feedback: ['A NameError would happen if pirnt were outside the quotation marks. Inside them, Python does not try to understand the word.', 'שגיאת שם הייתה קורית אם pirnt היה מחוץ למירכאות. בתוכן, פייתון לא מנסה להבין את המילה.'],
      }),
      opt('SyntaxError, because pirnt is not a word.', 'SyntaxError, כי pirnt היא לא מילה.', {
        feedback: ['A SyntaxError is about missing or misplaced symbols. Here every symbol is in place: print, both brackets, both quotation marks.', 'שגיאת תחביר קשורה לסימנים חסרים או במקום הלא נכון. כאן כל סימן במקומו: `print`, שני הסוגריים, שתי המירכאות.'],
      }),
    ],
    explanation: t(
      'Python only checks the parts outside the quotation marks: print, the brackets, the quotation marks. All of them are correct, so the program runs and shows the text between the marks, which happens to be the word pirnt.',
      'פייתון בודק רק את החלקים שמחוץ למירכאות: `print`, הסוגריים, המירכאות. כולם תקינים, ולכן התוכנית רצה ומציגה את הטקסט שבין המירכאות, שבמקרה הוא המילה pirnt.',
    ),
  },

  exercise: exercise({
    id: 'l04-ex',
    title: ['Two bugs', 'שני באגים'],
    mode: 'fix',
    instructions: [
      p(
        'This program has two bugs. It should print exactly these three lines:',
        'בתוכנית הזאת יש שני באגים. היא אמורה להדפיס בדיוק את שלוש השורות האלה:',
      ),
      code('Hello\nI am learning Python\nThis is fun', { lang: 'text', runnable: false }),
      p(
        'Press Run, read the message, fix the line it points to, and run again. Repeat until the output is right.',
        'לחצו על Run, קראו את ההודעה, תקנו את השורה שהיא מצביעה עליה, והריצו שוב. חזרו על זה עד שהפלט נכון.',
      ),
    ],
    starterCode: py`
      print("Hello)
      print("I am learning Python")
      pirnt("This is fun")
    `,
    check: {
      tests: [outputTest('Hello\nI am learning Python\nThis is fun')],
    },
    hints: [
      ['Run the program and read the last line of the message: which type of error, and which line number?', 'הריצו את התוכנית וקראו את השורה האחרונה של ההודעה: איזה סוג שגיאה, ואיזה מספר שורה?'],
      ['Line 1 is missing its closing quotation mark. After you fix it, run again: there is a second bug.', 'בשורה 1 חסרות המירכאות הסוגרות. אחרי שתתקנו, הריצו שוב: יש באג שני.'],
      ['Line 3: the word print is misspelled. It must be exactly `print`.', 'שורה 3: המילה print כתובה עם שגיאת כתיב. היא חייבת להיות בדיוק `print`.'],
    ],
    solution: py`
      print("Hello")
      print("I am learning Python")
      print("This is fun")
    `,
    concepts: ['bug', 'error-message', 'syntax-error', 'debugging'],
  }),

  build: exercise({
    id: 'l04-build',
    title: ['Fix the welcome program', 'תקנו את תוכנית הפתיחה'],
    mode: 'fix',
    instructions: [
      p(
        'A friend wrote this five-line program, but it does not run. It has three bugs. Use the three-step habit — read, go to the line, compare with a working line — until it prints exactly:',
        'חבר כתב את התוכנית הזאת בת חמש השורות, אבל היא לא רצה. יש בה שלושה באגים. השתמשו בהרגל בן שלושת הצעדים — קראו, לכו לשורה, השוו לשורה שעובדת — עד שהיא תדפיס בדיוק:',
      ),
      code('Welcome\nToday we learn Python\nStep one: read\nStep two: try\nDone', { lang: 'text', runnable: false }),
    ],
    starterCode: py`
      print("Welcome")
      print("Today we learn Python"
      prnit("Step one: read")
      print("Step two: try")
      print(Done)
    `,
    check: {
      tests: [outputTest('Welcome\nToday we learn Python\nStep one: read\nStep two: try\nDone')],
    },
    hints: [
      ['Start with the message Python shows first. It names a line; look only at that line.', 'התחילו מההודעה שפייתון מציג ראשונה. היא מציינת שורה; הסתכלו רק על השורה הזאת.'],
      ['One line is missing a closing bracket, one has print misspelled, and one has text without quotation marks.', 'בשורה אחת חסר סוגר סוגר, באחת `print` כתוב עם שגיאת כתיב, ובאחת יש טקסט בלי מירכאות.'],
      ['Line 2 needs `)` at the end. Line 3 must start with `print`. Line 5 must be `print("Done")`.', 'שורה 2 צריכה `)` בסוף. שורה 3 חייבת להתחיל ב-`print`. שורה 5 חייבת להיות `print("Done")`.'],
    ],
    solution: py`
      print("Welcome")
      print("Today we learn Python")
      print("Step one: read")
      print("Step two: try")
      print("Done")
    `,
    solutionNote: [
      'Python found the bracket first (a SyntaxError stops everything), then the misspelled print, then the missing quotation marks — one at a time.',
      'פייתון מצא קודם את הסוגר (שגיאת תחביר עוצרת הכול), אחר כך את ה-`print` השגוי, ואז את המירכאות החסרות — אחד בכל פעם.',
    ],
    concepts: ['bug', 'error-message', 'syntax-error', 'debugging'],
  }),

  check: [
    choice(
      'l04-c1',
      ['What is an error message?', 'מהי הודעת שגיאה?'],
      [
        opt('Python telling you the type of problem and the line where it got stuck.', 'פייתון אומר לכם מה סוג הבעיה ובאיזו שורה הוא נתקע.', {
          correct: true,
          feedback: ['Right. It is information, and the line number is the most useful part of it.', 'נכון. זה מידע, ומספר השורה הוא החלק הכי שימושי בו.'],
        }),
        opt('A sign that the computer is broken.', 'סימן שהמחשב מקולקל.', {
          feedback: ['The computer is fine. The message is about a mistake in the program text, which you can fix.', 'המחשב בסדר גמור. ההודעה עוסקת בטעות בטקסט של התוכנית, ואותה אתם יכולים לתקן.'],
        }),
        opt('A message that appears when the program finishes correctly.', 'הודעה שמופיעה כשהתוכנית מסתיימת בהצלחה.', {
          feedback: ['When a program finishes correctly you see only its output. An error message means Python stopped.', 'כשתוכנית מסתיימת בהצלחה רואים רק את הפלט שלה. הודעת שגיאה פירושה שפייתון עצר.'],
        }),
      ],
      ['error-message'],
    ),
    choice(
      'l04-c2',
      ['Python reports `NameError: name \'pirnt\' is not defined` at line 3. What is the most likely fix?', 'פייתון מדווח `NameError: name \'pirnt\' is not defined` בשורה 3. מה התיקון הסביר ביותר?'],
      [
        opt('Spell print correctly on line 3.', 'לכתוב את print נכון בשורה 3.', {
          correct: true,
          feedback: ['Right. Python does not know a word called pirnt; the instruction is print.', 'נכון. פייתון לא מכיר מילה בשם pirnt; ההוראה היא `print`.'],
        }),
        opt('Put quotation marks around pirnt.', 'לשים מירכאות סביב pirnt.', {
          feedback: ['That would turn the instruction into text, and then nothing would print it. The word before the bracket must be the instruction print.', 'זה יהפוך את ההוראה לטקסט, ואז שום דבר לא ידפיס אותו. המילה שלפני הסוגר חייבת להיות ההוראה `print`.'],
        }),
        opt('Delete line 3.', 'למחוק את שורה 3.', {
          feedback: ['Deleting removes the message but also removes the line the program needed. Fix the spelling instead.', 'מחיקה מעלימה את ההודעה אבל גם מעלימה שורה שהתוכנית צריכה. תקנו את הכתיב במקום זאת.'],
        }),
        opt('Fix line 1, because errors always come from the first line.', 'לתקן את שורה 1, כי שגיאות תמיד מגיעות מהשורה הראשונה.', {
          feedback: ['The message says line 3. Trust the line number; that is what it is for.', 'ההודעה אומרת שורה 3. סמכו על מספר השורה; בשביל זה הוא קיים.'],
        }),
      ],
      ['debugging'],
    ),
    choice(
      'l04-c3',
      ['A five-line program has a SyntaxError on line 4. What did lines 1 to 3 do?', 'בתוכנית בת חמש שורות יש שגיאת תחביר (SyntaxError) בשורה 4. מה עשו שורות 1 עד 3?'],
      [
        opt('Nothing. With a SyntaxError, Python does not run any line of the file.', 'שום דבר. עם שגיאת תחביר, פייתון לא מריץ אף שורה בקובץ.', {
          correct: true,
          feedback: ['Right. Python reads the whole file before running it. If it cannot read one line, it does not start.', 'נכון. פייתון קורא את כל הקובץ לפני שהוא מריץ אותו. אם הוא לא מצליח לקרוא שורה אחת, הוא לא מתחיל.'],
        }),
        opt('They ran and printed their text, then Python stopped.', 'הן רצו והדפיסו את הטקסט שלהן, ואז פייתון עצר.', {
          feedback: ['That is what happens with a NameError, which occurs while running. A SyntaxError is found before anything runs.', 'זה מה שקורה עם שגיאת שם (NameError), שמתרחשת בזמן הריצה. שגיאת תחביר מתגלה לפני שמשהו רץ בכלל.'],
        }),
        opt('They ran, but their output was deleted.', 'הן רצו, אבל הפלט שלהן נמחק.', {
          feedback: ['Python never deletes output. Those lines simply never ran.', 'פייתון אף פעם לא מוחק פלט. השורות האלה פשוט לא רצו בכלל.'],
        }),
      ],
      ['syntax-error'],
    ),
  ],

  recap: [
    list([
      ['A bug is a mistake in a program. Everyone makes them.', 'באג הוא טעות בתוכנית. כולם עושים טעויות כאלה.'],
      ['An error message tells you the error type, the line number and a short description.', 'הודעת שגיאה אומרת לכם את סוג השגיאה, את מספר השורה ותיאור קצר.'],
      ['SyntaxError: a missing or misplaced symbol; nothing in the file runs. NameError: an unknown word, such as a misspelled print or text without quotation marks.', 'SyntaxError: סימן חסר או במקום הלא נכון; שום דבר בקובץ לא רץ. NameError: מילה לא מוכרת, כמו `print` עם שגיאת כתיב או טקסט בלי מירכאות.'],
      ['Debugging habit: read the message, go to the line, compare with a working line. Fix one thing, run again.', 'הרגל ניפוי שגיאות: קראו את ההודעה, לכו לשורה, השוו לשורה שעובדת. תקנו דבר אחד, הריצו שוב.'],
    ]),
    p(
      'You now know how a computer thinks: it follows precise steps in order, and it tells you clearly when a step is not precise enough. From here on, an error message is a helper, not a wall.',
      'עכשיו אתם יודעים איך מחשב חושב: הוא מבצע צעדים מדויקים לפי הסדר, ואומר לכם בבירור כשצעד לא מדויק מספיק. מכאן והלאה, הודעת שגיאה היא עוזר, לא קיר.',
    ),
  ],
  next: t(
    'Next module: talking to the computer properly. You will learn print in full, what text and quotation marks really are, and how to leave notes in your code.',
    'המודול הבא: לדבר עם המחשב כמו שצריך. תלמדו את `print` לעומק, מה באמת הם טקסט ומירכאות, ואיך משאירים הערות בקוד.',
  ),

  miniChecks: [
    choice(
      'l04-m1',
      ['Python reports `SyntaxError` with `line 3`. Where do you look first?', 'פייתון מדווח `SyntaxError` עם `line 3`. איפה מסתכלים קודם?'],
      [
        opt('At line 3, character by character.', 'על שורה 3, תו אחר תו.', { correct: true, feedback: ['Right. The line number is the most useful part of the message.', 'נכון. מספר השורה הוא החלק הכי שימושי בהודעה.'] }),
        opt('At line 1, because problems always start at the top.', 'על שורה 1, כי בעיות תמיד מתחילות למעלה.', { feedback: ['Trust the line number Python gives you.', 'סמכו על מספר השורה שפייתון נותן.'] }),
      ],
      ['error-message'],
    ),
    choice(
      'l04-m2',
      ['`pirnt("Hi")` gives which kind of error?', 'איזו שגיאה נותן `pirnt("Hi")`?'],
      [
        opt('`NameError`: Python does not know a word called pirnt.', '`NameError`: פייתון לא מכיר מילה בשם pirnt.', { correct: true, feedback: ['Right. The symbols are all there; the word is wrong.', 'נכון. כל הסימנים במקום; המילה שגויה.'] }),
        opt('`SyntaxError`: a symbol is missing.', '`SyntaxError`: חסר סימן.', { feedback: ['Both brackets and both quotation marks are present, so the shape is fine. The word is unknown.', 'שני הסוגריים ושתי המירכאות קיימים, ולכן הצורה תקינה. המילה לא מוכרת.'] }),
      ],
      ['syntax-error'],
    ),
  ],

  briskSummary: [
    list([
      ['A **bug** is a mistake in a program; an **error message** says the error type, the line number and a short description. It is information, not a punishment.', '**באג** (bug) הוא טעות בתוכנית; **הודעת שגיאה** (error message) אומרת את סוג השגיאה, את מספר השורה ותיאור קצר. זה מידע, לא עונש.'],
      ['`SyntaxError`: a missing or misplaced symbol (quotation mark, bracket). Python checks the whole file first, so nothing runs.', '`SyntaxError`: סימן חסר או במקום הלא נכון (מירכאות, סוגר). פייתון בודק קודם את כל הקובץ, ולכן שום דבר לא רץ.'],
      ['`NameError`: an unknown word, such as `pirnt` or text without quotation marks. It happens while running, so earlier lines already ran.', '`NameError`: מילה לא מוכרת, כמו `pirnt` או טקסט בלי מירכאות. זה קורה בזמן הריצה, ולכן שורות קודמות כבר רצו.'],
      ['**Debugging** habit: read the message, go to that line, compare it with a line that works (`print("Hello")`). Fix one thing, run again. Python shows one problem at a time.', 'הרגל **ניפוי שגיאות** (debugging): קראו את ההודעה, לכו לשורה, השוו לשורה שעובדת (`print("Hello")`). תקנו דבר אחד, הריצו שוב. פייתון מציג בעיה אחת בכל פעם.'],
    ]),
  ],
};
