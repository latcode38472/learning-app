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
  pythonTest,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l01-what-computers-do',
  moduleId: 'm1',
  title: t('What computers do', 'מה מחשבים עושים'),
  tagline: t('A machine that follows precise instructions, very fast.', 'מכונה שמבצעת הוראות מדויקות, מהר מאוד.'),
  estimatedMinutes: 15,
  introduces: ['computer-basics', 'input-output', 'program', 'print-basic'],
  requires: [],
  runsInBrowser: true,

  objective: t(
    'Understand what a computer does with input and output, what a program is, and run your very first line of Python.',
    'להבין מה מחשב עושה עם קלט ופלט, מהי תוכנית, ולהריץ את שורת הפייתון הראשונה שלכם.',
  ),
  prerequisiteCheck: t(
    'Nothing. This is the first lesson; you only need to be able to type.',
    'שום דבר. זה השיעור הראשון; צריך רק לדעת להקליד.',
  ),

  explanation: [
    p(
      'A **computer** is a machine that follows instructions. It does not understand, it does not guess, and it never gets bored. It does exactly what it is told, millions of times a second. Every app, game and website you have ever used is a set of instructions being followed.',
      '**מחשב** (computer) הוא מכונה שמבצעת הוראות. הוא לא מבין, לא מנחש ואף פעם לא משתעמם. הוא עושה בדיוק מה שאומרים לו, מיליוני פעמים בשנייה. כל אפליקציה, משחק ואתר שאי פעם השתמשתם בהם הם בסך הכול הוראות שהמחשב מבצע.',
    ),
    h('Input, processing, output', 'קלט, עיבוד, פלט'),
    p(
      'Almost everything a computer does has the same shape. Something goes in: the **input**. The computer works on it: the **processing**. Something comes out: the **output**.',
      'כמעט כל מה שמחשב עושה בנוי באותה צורה. משהו נכנס: ה**קלט** (input). המחשב מעבד אותו: ה**עיבוד** (processing). משהו יוצא: ה**פלט** (output).',
    ),
    table(
      [['Device', 'מכשיר'], ['Input', 'קלט'], ['Processing', 'עיבוד'], ['Output', 'פלט']],
      [
        [['Calculator', 'מחשבון'], ['You press 2 + 3 =', 'אתם מקישים 2 + 3 ='], ['It adds the numbers', 'הוא מחבר את המספרים'], ['The screen shows 5', 'המסך מציג 5']],
        [['Phone', 'טלפון'], ['You tap a friend\'s name', 'אתם מקישים על שם של חבר'], ['It finds the number and connects the call', 'הוא מוצא את המספר ומחייג'], ['You hear ringing', 'אתם שומעים צלצול']],
        [['Game', 'משחק'], ['You press the jump button', 'אתם לוחצים על כפתור הקפיצה'], ['It moves the character and checks for walls', 'הוא מזיז את הדמות ובודק אם יש קיר'], ['The character jumps on the screen', 'הדמות קופצת על המסך']],
      ],
    ),
    h('What is a program?', 'מהי תוכנית?'),
    p(
      'A **program** is a list of instructions written in a language the computer understands. People write the program; the computer follows it. **Python** is one of those languages. It reads a lot like English, which is why it is a good first language.',
      '**תוכנית** (program) היא רשימה של הוראות שכתובה בשפה שהמחשב מבין. בני אדם כותבים את התוכנית; המחשב מבצע אותה. **פייתון** (Python) היא אחת השפות האלה. היא דומה למדי לאנגלית, ולכן היא שפה ראשונה טובה.',
    ),
    h('Your first line of Python', 'שורת הפייתון הראשונה שלכם'),
    p(
      'Here is a complete Python program. It is one line long. Press Run under the code and look at what appears.',
      'הנה תוכנית פייתון שלמה, באורך שורה אחת. לחצו על Run מתחת לקוד והסתכלו מה מופיע.',
    ),
    code(py`
      print("Hello")
    `, { output: 'Hello' }),
    term(
      'print()',
      '`print` shows text on the screen. Read it as "show this". There is a whole lesson about print later; for now you only need to type it exactly as it is here.',
      '`print` מציג טקסט על המסך. קראו את זה כ"הצג את זה". שיעור שלם על `print` יגיע בהמשך; בינתיים צריך רק להקליד אותו בדיוק כמו כאן.',
    ),
    term(
      '( )',
      'The round brackets hold what print should show. They always come as a pair: one opens, one closes.',
      'הסוגריים העגולים (parentheses) מחזיקים את מה ש-`print` צריך להציג. הם תמיד באים בזוג: אחד פותח ואחד סוגר.',
    ),
    term(
      '" "',
      'The quotation marks mark where the text starts and where it ends. Everything between them is shown exactly as you typed it. The marks themselves are not shown.',
      'המירכאות (quotes) מסמנות איפה הטקסט מתחיל ואיפה הוא נגמר. כל מה שביניהן מוצג בדיוק כפי שהקלדתם. המירכאות עצמן לא מוצגות.',
    ),
    callout(
      'warning',
      'Computers are picky. `print` must be spelled exactly like that, in small letters, with both brackets and both quotation marks. If one symbol is missing, the computer stops and tells you. You will learn to read those messages in lesson 4.',
      'מחשבים קפדנים. את `print` צריך לכתוב בדיוק כך, באותיות קטנות, עם שני הסוגריים ושתי המירכאות. אם סימן אחד חסר, המחשב עוצר ואומר לכם. בשיעור 4 תלמדו לקרוא את ההודעות האלה.',
    ),
  ],

  simpler: [
    p(
      'Think of a very obedient helper who cannot think for themselves. If you say "bring me the red cup", they bring the red cup. If you say "bring me a cup", they just stand there, because you did not say which one. A computer is that helper, only much faster.',
      'דמיינו עוזר צייתן מאוד שלא יכול לחשוב בעצמו. אם תגידו לו "תביא לי את הכוס האדומה", הוא יביא את הכוס האדומה. אם תגידו "תביא לי כוס", הוא פשוט יעמוד במקום, כי לא אמרתם איזו. מחשב הוא העוזר הזה, רק הרבה יותר מהיר.',
    ),
    p(
      'Input is what you tell the helper. Output is what the helper brings back. A program is the note with all the instructions written down, so the helper can follow them one after another.',
      'קלט הוא מה שאתם אומרים לעוזר. פלט הוא מה שהעוזר מחזיר לכם. תוכנית היא הפתק שבו כל ההוראות כתובות, כדי שהעוזר יוכל לבצע אותן בזו אחר זו.',
    ),
    p(
      '`print("Hello")` is one instruction on that note. It says: show the word Hello. The brackets and the quotation marks are how Python knows where the word starts and where it ends.',
      '`print("Hello")` היא הוראה אחת בפתק הזה. היא אומרת: הצג את המילה Hello. הסוגריים והמירכאות הם הדרך של פייתון לדעת איפה המילה מתחילה ואיפה היא נגמרת.',
    ),
  ],

  workedExample: [
    p(
      'Let us look at a program with two instructions and follow what the computer does with each one.',
      'בואו נסתכל על תוכנית עם שתי הוראות ונעקוב אחרי מה שהמחשב עושה עם כל אחת מהן.',
    ),
    code(py`
      print("Good morning")
      print("Time to learn")
    `, { output: 'Good morning\nTime to learn' }),
    list([
      ['Line 1: the computer sees `print`, so it will show text. The text between the quotation marks is `Good morning`, so that is what appears.', 'שורה 1: המחשב רואה `print`, ולכן הוא יציג טקסט. הטקסט שבין המירכאות הוא `Good morning`, וזה מה שמופיע.'],
      ['Line 2: the same again, with `Time to learn`. It appears on a new line, under the first one.', 'שורה 2: אותו הדבר שוב, עם `Time to learn`. הוא מופיע בשורה חדשה, מתחת לראשונה.'],
      ['The quotation marks and the brackets do not appear on the screen. They are instructions for the computer, not part of the message.', 'המירכאות והסוגריים לא מופיעים על המסך. הם הוראות למחשב, לא חלק מההודעה.'],
    ], true),
    p(
      'Two instructions, two lines of output. The computer did not "understand" the greeting. It simply showed the characters you put between the quotation marks.',
      'שתי הוראות, שתי שורות פלט. המחשב לא "הבין" את הברכה. הוא פשוט הציג את התווים ששמתם בין המירכאות.',
    ),
  ],

  moreExamples: [
    [
      h('Spaces and punctuation are kept', 'רווחים וסימני פיסוק נשמרים'),
      code(py`
        print("Hi there, friend!")
      `, { output: 'Hi there, friend!' }),
      p(
        'Everything between the quotation marks is shown exactly: the spaces, the comma and the exclamation mark. Only the quotation marks themselves disappear.',
        'כל מה שבין המירכאות מוצג בדיוק: הרווחים, הפסיק וסימן הקריאה. רק המירכאות עצמן נעלמות.',
      ),
    ],
    [
      h('The computer does not read the words', 'המחשב לא קורא את המילים'),
      code(py`
        print("2 + 3")
      `, { output: '2 + 3' }),
      p(
        'Inside quotation marks, `2 + 3` is just five characters. The computer shows them; it does not add anything up. Making it calculate is a different instruction, which comes in a later lesson.',
        'בתוך מירכאות, `2 + 3` הוא בסך הכול חמישה תווים. המחשב מציג אותם; הוא לא מחבר שום דבר. כדי לגרום לו לחשב צריך הוראה אחרת, שתגיע בשיעור מאוחר יותר.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l01-hard',
    title: ['A greeting in a frame', 'ברכה במסגרת'],
    mode: 'write',
    instructions: [
      p(
        'Print exactly these three lines. Every character counts: the plus signs, the five dashes, the vertical bars and the spaces.',
        'הדפיסו בדיוק את שלוש השורות האלה. כל תו חשוב: סימני הפלוס, חמשת המקפים, הקווים האנכיים והרווחים.',
      ),
      code('+-----+\n| Hi! |\n+-----+', { lang: 'text', runnable: false }),
      p(
        'The first line is already written. Add the other two under it.',
        'השורה הראשונה כבר כתובה. הוסיפו את שתי השורות האחרות מתחתיה.',
      ),
    ],
    starterCode: py`
      print("+-----+")
    `,
    check: {
      tests: [outputTest('+-----+\n| Hi! |\n+-----+')],
    },
    hints: [
      ['Each line of output needs its own print line.', 'כל שורת פלט צריכה שורת `print` משלה.'],
      ['The middle line has one space on each side of `Hi!`, between the vertical bars.', 'בשורה האמצעית יש רווח אחד מכל צד של `Hi!`, בין הקווים האנכיים.'],
      ['The third line is the same as the first: `print("+-----+")`.', 'השורה השלישית זהה לראשונה: `print("+-----+")`.'],
    ],
    solution: py`
      print("+-----+")
      print("| Hi! |")
      print("+-----+")
    `,
    concepts: ['print-basic'],
  }),

  predict: {
    code: py`
      print("Hello")
    `,
    prompt: t('What appears on the screen when this program runs?', 'מה יופיע על המסך כשהתוכנית הזאת תרוץ?'),
    options: [
      opt('`Hello`', '`Hello`', {
        correct: true,
        feedback: ['Right. Only the text between the quotation marks is shown.', 'נכון. רק הטקסט שבין המירכאות מוצג.'],
      }),
      opt('`"Hello"`', '`"Hello"`', {
        feedback: ['The quotation marks tell Python where the text starts and ends. They are not part of the text, so they are not shown.', 'המירכאות אומרות לפייתון איפה הטקסט מתחיל ואיפה הוא נגמר. הן לא חלק מהטקסט, ולכן הן לא מוצגות.'],
      }),
      opt('`print("Hello")`', '`print("Hello")`', {
        feedback: ['That is the instruction, not the result. The instruction stays in the editor; only what print shows appears on the screen.', 'זו ההוראה, לא התוצאה. ההוראה נשארת בעורך; על המסך מופיע רק מה ש-`print` מציג.'],
      }),
      opt('Nothing', 'שום דבר', {
        feedback: ['print always shows something. Here it shows the word Hello.', '`print` תמיד מציג משהו. כאן הוא מציג את המילה Hello.'],
      }),
    ],
    explanation: t(
      'print shows the text between the quotation marks and nothing else. The brackets and the quotation marks are instructions for Python; they never appear in the output.',
      '`print` מציג את הטקסט שבין המירכאות ושום דבר אחר. הסוגריים והמירכאות הם הוראות לפייתון; הם אף פעם לא מופיעים בפלט.',
    ),
  },

  exercise: exercise({
    id: 'l01-ex',
    title: ['Hello, world!', 'Hello, world!'],
    mode: 'modify',
    instructions: [
      p(
        'The program below prints `Hello`. Press Run to see it. Then change the text between the quotation marks so that the program prints exactly `Hello, world!` — with the comma, the space, a small w and the exclamation mark.',
        'התוכנית שלמטה מדפיסה `Hello`. לחצו על Run כדי לראות זאת. אחר כך שנו את הטקסט שבין המירכאות כך שהתוכנית תדפיס בדיוק `Hello, world!` — עם הפסיק, הרווח, w קטנה וסימן הקריאה.',
      ),
    ],
    starterCode: py`
      print("Hello")
    `,
    check: {
      tests: [outputTest('Hello, world!')],
    },
    hints: [
      ['Only the text between the quotation marks needs to change. Leave print, the brackets and the quotation marks as they are.', 'רק הטקסט שבין המירכאות צריך להשתנות. השאירו את `print`, את הסוגריים ואת המירכאות כמו שהם.'],
      ['The comma and the exclamation mark are part of the text: `Hello, world!`', 'הפסיק וסימן הקריאה הם חלק מהטקסט: `Hello, world!`'],
      ['The whole line should be `print("Hello, world!")`.', 'השורה כולה צריכה להיות `print("Hello, world!")`.'],
    ],
    solution: py`
      print("Hello, world!")
    `,
    solutionNote: [
      'Programmers have printed "Hello, world!" as their first program for about fifty years. You are now one of them.',
      'כבר כחמישים שנה מתכנתים מדפיסים "Hello, world!" בתור התוכנית הראשונה שלהם. עכשיו גם אתם בחבורה.',
    ],
    concepts: ['print-basic'],
  }),

  build: exercise({
    id: 'l01-build',
    title: ['Three lines about you', 'שלוש שורות עליכם'],
    mode: 'build',
    instructions: [
      p(
        'Write a program that prints three lines about yourself: for example your name, something you like, and the place you live. Write them in any language you like; what matters is that there are exactly three lines and that they are different from each other.',
        'כתבו תוכנית שמדפיסה שלוש שורות עליכם: למשל השם שלכם, משהו שאתם אוהבים, והמקום שבו אתם גרים. כתבו אותן בכל שפה שתרצו, גם בעברית; מה שחשוב הוא שיהיו בדיוק שלוש שורות, שונות זו מזו.',
      ),
      p(
        'The first line is written for you. Change it to say something about you, then add two more.',
        'השורה הראשונה כבר כתובה בשבילכם. שנו אותה כך שתספר משהו עליכם, ואז הוסיפו עוד שתיים.',
      ),
    ],
    starterCode: py`
      print("My name is Noam.")
    `,
    check: {
      tests: [
        pythonTest(
          py`
            lines = [l.strip() for l in stdout.strip().split("\n") if l.strip()]
            assert len(lines) == 3, M("Print exactly three lines (you printed " + str(len(lines)) + ").", "הדפיסו בדיוק שלוש שורות (הדפסתם " + str(len(lines)) + ").")
            assert len(set(lines)) == 3, M("Make the three lines different from each other.", "הפכו את שלוש השורות לשונות זו מזו.")
          `,
        ),
      ],
    },
    hints: [
      ['Each print shows one line, so you need three print lines, one under the other.', 'כל `print` מציג שורה אחת, ולכן אתם צריכים שלוש שורות `print`, אחת מתחת לשנייה.'],
      ['Keep the shape `print("...")` and change only the text between the quotation marks.', 'שמרו על הצורה `print("...")` ושנו רק את הטקסט שבין המירכאות.'],
      ['For example: `print("My name is Noam.")`, then `print("I like football.")`, then `print("I live in Haifa.")`.', 'למשל: `print("קוראים לי נועם.")`, אחר כך `print("אני אוהב כדורגל.")`, ואז `print("אני גר בחיפה.")`.'],
    ],
    solution: py`
      print("My name is Noam.")
      print("I like football.")
      print("I live in Haifa.")
    `,
    solutionNote: [
      'Any three different lines pass. What matters is the shape of each line: print, brackets, quotation marks, text.',
      'כל שלוש שורות שונות עוברות. מה שחשוב הוא הצורה של כל שורה: `print`, סוגריים, מירכאות, טקסט.',
    ],
    concepts: ['print-basic', 'program'],
  }),

  check: [
    choice(
      'l01-c1',
      ['What is a program?', 'מהי תוכנית?'],
      [
        opt('A list of instructions that the computer follows.', 'רשימה של הוראות שהמחשב מבצע.', {
          correct: true,
          feedback: ['Right. People write the instructions; the computer follows them one after another.', 'נכון. בני אדם כותבים את ההוראות; המחשב מבצע אותן בזו אחר זו.'],
        }),
        opt('A machine that thinks on its own.', 'מכונה שחושבת בעצמה.', {
          feedback: ['A computer does not think on its own. It follows the instructions in the program exactly.', 'מחשב לא חושב בעצמו. הוא מבצע בדיוק את ההוראות שבתוכנית.'],
        }),
        opt('The screen of the computer.', 'המסך של המחשב.', {
          feedback: ['The screen is where output appears. The program is the list of instructions that produces that output.', 'המסך הוא המקום שבו הפלט מופיע. התוכנית היא רשימת ההוראות שיוצרת את הפלט הזה.'],
        }),
      ],
      ['program'],
    ),
    choice(
      'l01-c2',
      ['You type 4 × 5 into a calculator and it shows 20. Which part is the output?', 'אתם מקישים 4 × 5 במחשבון והוא מציג 20. איזה חלק הוא הפלט?'],
      [
        opt('The number 20 on the screen.', 'המספר 20 על המסך.', {
          correct: true,
          feedback: ['Right. Output is what comes out at the end.', 'נכון. פלט הוא מה שיוצא בסוף.'],
        }),
        opt('The buttons you pressed.', 'הכפתורים שלחצתם עליהם.', {
          feedback: ['The buttons you press are the input: what goes in.', 'הכפתורים שאתם לוחצים עליהם הם הקלט: מה שנכנס.'],
        }),
        opt('The multiplying the calculator does.', 'הכפל שהמחשבון מבצע.', {
          feedback: ['That is the processing: the work in the middle, between input and output.', 'זה העיבוד: העבודה שבאמצע, בין הקלט לפלט.'],
        }),
      ],
      ['input-output'],
    ),
    choice(
      'l01-c3',
      ['Which of these lines is typed exactly right?', 'איזו מהשורות האלה כתובה בדיוק נכון?'],
      [
        opt('`print("Hi")`', '`print("Hi")`', {
          correct: true,
          feedback: ['Correct: print in small letters, both brackets, both quotation marks.', 'נכון: `print` באותיות קטנות, שני הסוגריים, שתי המירכאות.'],
        }),
        opt('`Print("Hi")`', '`Print("Hi")`', {
          feedback: ['A capital P makes it a different word. Python only knows print with a small p.', 'P גדולה הופכת את זה למילה אחרת. פייתון מכיר רק את `print` עם p קטנה.'],
        }),
        opt('`print(Hi)`', '`print(Hi)`', {
          feedback: ['The quotation marks are missing. Without them Python does not know that Hi is text.', 'המירכאות חסרות. בלעדיהן פייתון לא יודע ש-Hi הוא טקסט.'],
        }),
        opt('`print "Hi"`', '`print "Hi"`', {
          feedback: ['The brackets are missing. What print shows always goes inside ( ).', 'הסוגריים חסרים. מה ש-`print` מציג תמיד נמצא בתוך ( ).'],
        }),
      ],
      ['print-basic'],
    ),
  ],

  recap: [
    list([
      ['A computer follows instructions exactly and very fast. It does not understand or guess.', 'מחשב מבצע הוראות בדיוק ומהר מאוד. הוא לא מבין ולא מנחש.'],
      ['Input goes in, the computer processes it, output comes out.', 'קלט נכנס, המחשב מעבד אותו, פלט יוצא.'],
      ['A program is a list of instructions in a language the computer understands. Python is one such language.', 'תוכנית היא רשימה של הוראות בשפה שהמחשב מבין. פייתון היא שפה כזאת.'],
      ['`print("...")` shows the text between the quotation marks. The brackets and quotation marks are not shown.', '`print("...")` מציג את הטקסט שבין המירכאות. הסוגריים והמירכאות לא מוצגים.'],
      ['Every symbol must be typed exactly.', 'כל סימן חייב להיות כתוב בדיוק.'],
    ]),
    p(
      'You have run a real program. Everything that follows in this course is more instructions of the same kind, written for a machine that does exactly what it is told.',
      'הרצתם תוכנית אמיתית. כל מה שיבוא בהמשך הקורס הוא עוד הוראות מאותו סוג, שכתובות למכונה שעושה בדיוק מה שאומרים לה.',
    ),
  ],
  next: t(
    'Next you will see where a program lives (a file), what happens when you press Run, and the first rule of reading a program: in programs like these, lines run from top to bottom.',
    'בשיעור הבא תראו איפה תוכנית נמצאת (בקובץ), מה קורה כשלוחצים על Run, והכלל הראשון של קריאת תוכנית: בתוכניות כמו אלה, השורות מתבצעות מלמעלה למטה.',
  ),

  miniChecks: [
    choice(
      'l01-m1',
      ['A computer is best described as…', 'הכי מדויק לתאר מחשב בתור…'],
      [
        opt('a machine that follows instructions exactly.', 'מכונה שמבצעת הוראות בדיוק.', { correct: true, feedback: ['Right. Exactly, and very fast.', 'נכון. בדיוק, ומהר מאוד.'] }),
        opt('a machine that understands what you want.', 'מכונה שמבינה מה אתם רוצים.', { feedback: ['It does not understand or guess. It only follows what it is told.', 'הוא לא מבין ולא מנחש. הוא רק מבצע מה שאומרים לו.'] }),
      ],
      ['computer-basics'],
    ),
    choice(
      'l01-m2',
      ['In `print("Hello")`, what do the quotation marks do?', 'ב-`print("Hello")`, מה עושות המירכאות?'],
      [
        opt('They mark where the text starts and ends.', 'הן מסמנות איפה הטקסט מתחיל ואיפה הוא נגמר.', { correct: true, feedback: ['Right. They are instructions for Python and are not shown.', 'נכון. הן הוראות לפייתון ולא מוצגות.'] }),
        opt('They are printed on the screen with the word.', 'הן מודפסות על המסך יחד עם המילה.', { feedback: ['Only the text between them is shown. The marks themselves are not.', 'רק הטקסט שביניהן מוצג. המירכאות עצמן לא.'] }),
      ],
      ['print-basic'],
    ),
  ],

  briskSummary: [
    list([
      ['A **computer** follows instructions exactly, very fast, without understanding or guessing.', '**מחשב** (computer) מבצע הוראות בדיוק, מהר מאוד, בלי להבין ובלי לנחש.'],
      ['**Input** goes in, the computer **processes** it, **output** comes out (calculator: keys → adding → 5 on the screen).', '**קלט** (input) נכנס, המחשב **מעבד** (processing), **פלט** (output) יוצא (מחשבון: מקשים ← חיבור ← 5 על המסך).'],
      ['A **program** is a list of instructions in a language the computer understands; **Python** is one such language.', '**תוכנית** (program) היא רשימת הוראות בשפה שהמחשב מבין; **פייתון** (Python) היא שפה כזאת.'],
      ['`print("Hello")` shows `Hello`. `print` must be in small letters; the round brackets hold what to show; the quotation marks mark where the text starts and ends and are not shown.', '`print("Hello")` מציג `Hello`. את `print` כותבים באותיות קטנות; הסוגריים העגולים מחזיקים את מה שמציגים; המירכאות מסמנות את תחילת הטקסט וסופו ואינן מוצגות.'],
      ['Every symbol must be typed exactly; a missing one stops the program with a message (lesson 4 reads those messages).', 'כל סימן חייב להיות כתוב בדיוק; סימן חסר עוצר את התוכנית עם הודעה (בשיעור 4 קוראים את ההודעות האלה).'],
    ]),
  ],
};
