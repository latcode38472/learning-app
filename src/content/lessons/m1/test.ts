import type { Assessment } from '../../schema';
import { p, code, t, opt, choice, predictQ, codeQ, outputTest, py } from '../../authoring';

export const test: Assessment = {
  id: 'm1-test',
  kind: 'module-test',
  moduleId: 'm1',
  title: t('Module 1 test: How computers think', 'מבחן מודול 1: איך מחשבים חושבים'),
  description: [
    p(
      'Eight questions covering lessons 1–4: what a program is, input and output, running a program, the top-to-bottom rule, thinking in steps, and reading error messages. Two of the questions ask you to write or fix a small program.',
      'שמונה שאלות על שיעורים 1–4: מהי תוכנית, קלט ופלט, הרצת תוכנית, כלל "מלמעלה למטה", חשיבה בצעדים וקריאת הודעות שגיאה. בשתיים מהשאלות תתבקשו לכתוב או לתקן תוכנית קטנה.',
    ),
  ],
  passScore: 0.7,
  hintsAllowed: 1,
  estimatedMinutes: 15,
  pools: [
    /* ---------------------------------------------------- 1. programs (l01) */
    {
      variants: [
        choice(
          'm1-t-q1-a',
          ['What is a program?', 'מהי תוכנית?'],
          [
            opt('A list of instructions written in a language the computer understands.', 'רשימה של הוראות שכתובה בשפה שהמחשב מבין.', {
              correct: true,
              feedback: ['Right. People write it; the computer follows it.', 'נכון. בני אדם כותבים אותה; המחשב מבצע אותה.'],
            }),
            opt('A machine that can think for itself.', 'מכונה שיכולה לחשוב בעצמה.', {
              feedback: ['A computer does not think for itself. It follows the program exactly.', 'מחשב לא חושב בעצמו. הוא מבצע את התוכנית בדיוק.'],
            }),
            opt('The output that appears in the console.', 'הפלט שמופיע בקונסולה.', {
              feedback: ['The output is the result. The program is the list of instructions that produced it.', 'הפלט הוא התוצאה. התוכנית היא רשימת ההוראות שיצרה אותו.'],
            }),
            opt('The screen and the keyboard together.', 'המסך והמקלדת יחד.', {
              feedback: ['Those are parts of the computer. A program is text: instructions the computer follows.', 'אלה חלקים של המחשב. תוכנית היא טקסט: הוראות שהמחשב מבצע.'],
            }),
          ],
          ['program'],
        ),
        choice(
          'm1-t-q1-b',
          ['Which sentence about computers is true?', 'איזה משפט על מחשבים נכון?'],
          [
            opt('A computer does exactly what its instructions say, very fast.', 'מחשב עושה בדיוק מה שההוראות שלו אומרות, מהר מאוד.', {
              correct: true,
              feedback: ['Right. Speed and exactness are what a computer offers; understanding is your job.', 'נכון. מהירות ודיוק הם מה שמחשב מציע; ההבנה היא התפקיד שלכם.'],
            }),
            opt('A computer understands what you mean, even if you write it badly.', 'מחשב מבין למה אתם מתכוונים, גם אם כתבתם את זה לא טוב.', {
              feedback: ['A computer only knows what you wrote, never what you meant.', 'מחשב יודע רק מה כתבתם, אף פעם לא למה התכוונתם.'],
            }),
            opt('A computer skips instructions that seem silly.', 'מחשב מדלג על הוראות שנראות מטופשות.', {
              feedback: ['It never skips. It performs every instruction, sensible or not.', 'הוא אף פעם לא מדלג. הוא מבצע כל הוראה, הגיונית או לא.'],
            }),
            opt('A computer can only run programs written in English.', 'מחשב יכול להריץ רק תוכניות שכתובות באנגלית.', {
              feedback: ['Programs are written in programming languages such as Python. Python uses English words, but it is not English.', 'תוכניות נכתבות בשפות תכנות כמו פייתון. פייתון משתמשת במילים באנגלית, אבל היא לא אנגלית.'],
            }),
          ],
          ['computer-basics'],
        ),
      ],
    },
    /* ---------------------------------------------------- 2. input / output (l01) */
    {
      variants: [
        choice(
          'm1-t-q2-a',
          ['You tap a friend\'s name on your phone and it starts ringing. Which part is the input?', 'אתם מקישים על שם של חבר בטלפון והוא מתחיל לצלצל. איזה חלק הוא הקלט?'],
          [
            opt('Tapping the name.', 'ההקשה על השם.', {
              correct: true,
              feedback: ['Right. Input is what goes in: what you did.', 'נכון. קלט הוא מה שנכנס: מה שאתם עשיתם.'],
            }),
            opt('The ringing sound.', 'צליל הצלצול.', {
              feedback: ['The ringing is the output: what comes out at the end.', 'הצלצול הוא הפלט: מה שיוצא בסוף.'],
            }),
            opt('Finding the number.', 'מציאת המספר.', {
              feedback: ['Finding the number is the processing: the work between input and output.', 'מציאת המספר היא העיבוד: העבודה שבין הקלט לפלט.'],
            }),
          ],
          ['input-output'],
        ),
        choice(
          'm1-t-q2-b',
          ['In a program that only has `print("Hi")`, what is the output?', 'בתוכנית שיש בה רק `print("Hi")`, מה הפלט?'],
          [
            opt('The word Hi shown in the console.', 'המילה Hi שמוצגת בקונסולה.', {
              correct: true,
              feedback: ['Right. Output is what the program shows on the screen.', 'נכון. פלט הוא מה שהתוכנית מציגה על המסך.'],
            }),
            opt('The text `print("Hi")` in the editor.', 'הטקסט `print("Hi")` בעורך.', {
              feedback: ['That is the program itself: the instruction, not the result.', 'זו התוכנית עצמה: ההוראה, לא התוצאה.'],
            }),
            opt('The Run button.', 'כפתור Run.', {
              feedback: ['Pressing Run starts the program. The output is what appears afterwards.', 'לחיצה על Run מפעילה את התוכנית. הפלט הוא מה שמופיע אחר כך.'],
            }),
          ],
          ['input-output', 'print-basic'],
        ),
      ],
    },
    /* ---------------------------------------------------- 3. files, running, sequence (l02) */
    {
      variants: [
        choice(
          'm1-t-q3-a',
          ['What does Python do when you run a program?', 'מה פייתון עושה כשמריצים תוכנית?'],
          [
            opt('Reads the file and performs each line, from the first to the last.', 'קורא את הקובץ ומבצע כל שורה, מהראשונה עד האחרונה.', {
              correct: true,
              feedback: ['Right. Top to bottom, one line after another.', 'נכון. מלמעלה למטה, שורה אחרי שורה.'],
            }),
            opt('Performs the lines in whatever order makes the most sense.', 'מבצע את השורות בסדר שהכי הגיוני.', {
              feedback: ['Python never reorders lines. The written order is the running order.', 'פייתון אף פעם לא משנה את סדר השורות. הסדר שנכתב הוא סדר הביצוע.'],
            }),
            opt('Performs all the lines at the same time.', 'מבצע את כל השורות באותו זמן.', {
              feedback: ['Lines run one after another. A line starts only after the one above it has finished.', 'שורות מתבצעות בזו אחר זו. שורה מתחילה רק אחרי שהשורה שמעליה הסתיימה.'],
            }),
            opt('Saves the file and waits.', 'שומר את הקובץ ומחכה.', {
              feedback: ['Saving keeps the text. Running performs it.', 'שמירה שומרת את הטקסט. הרצה מבצעת אותו.'],
            }),
          ],
          ['running-programs', 'sequence'],
        ),
        choice(
          'm1-t-q3-b',
          ['Which of these is true about a file called `story.py`?', 'מה נכון לגבי קובץ בשם `story.py`?'],
          [
            opt('It is a text file that holds a Python program.', 'זה קובץ טקסט שמכיל תוכנית פייתון.', {
              correct: true,
              feedback: ['Right. The .py ending marks a Python program.', 'נכון. הסיומת .py מסמנת תוכנית פייתון.'],
            }),
            opt('It runs by itself as soon as it is saved.', 'הוא רץ מעצמו ברגע שהוא נשמר.', {
              feedback: ['A file does nothing until someone runs it.', 'קובץ לא עושה כלום עד שמישהו מריץ אותו.'],
            }),
            opt('Its lines run from the bottom up.', 'השורות שלו מתבצעות מלמטה למעלה.', {
              feedback: ['Lines always run from the top down.', 'שורות תמיד מתבצעות מלמעלה למטה.'],
            }),
            opt('It can only contain one line.', 'הוא יכול להכיל רק שורה אחת.', {
              feedback: ['A program file can have as many lines as you like; they run in order.', 'קובץ תוכנית יכול להכיל כמה שורות שתרצו; הן מתבצעות לפי הסדר.'],
            }),
          ],
          ['file', 'sequence'],
        ),
      ],
    },
    /* ---------------------------------------------------- 4. algorithms, errors (l03, l04) */
    {
      variants: [
        choice(
          'm1-t-q4-a',
          ['Which instruction is precise enough for a very literal robot?', 'איזו הוראה מדויקת מספיק בשביל רובוט מילולי מאוד?'],
          [
            opt('"Put one tea bag in the cup."', '"שים שקית תה אחת בכוס."', {
              correct: true,
              feedback: ['Right. It says what, how many and where.', 'נכון. היא אומרת מה, כמה ואיפה.'],
            }),
            opt('"Make some tea."', '"תכין קצת תה."', {
              feedback: ['This is a goal, not a step. The robot cannot follow it without more detail.', 'זו מטרה, לא צעד. הרובוט לא יכול לבצע אותה בלי עוד פרטים.'],
            }),
            opt('"Do the usual."', '"תעשה כרגיל."', {
              feedback: ['A computer has no idea what "usual" means. Every step must be spelled out.', 'למחשב אין מושג מה זה "כרגיל". כל צעד חייב להיות כתוב במפורש.'],
            }),
            opt('"Make it taste good."', '"תדאג שיהיה טעים."', {
              feedback: ['This cannot be followed or checked. Precise steps say exactly what to do.', 'את זה אי אפשר לבצע ואי אפשר לבדוק. צעדים מדויקים אומרים בדיוק מה לעשות.'],
            }),
          ],
          ['precision', 'algorithm'],
        ),
        choice(
          'm1-t-q4-b',
          ['Python shows `NameError: name \'prnt\' is not defined` and `line 2`. What does this tell you?', 'פייתון מציג `NameError: name \'prnt\' is not defined` ו-`line 2`. מה זה אומר לכם?'],
          [
            opt('On line 2 there is a word Python does not know, probably a misspelled print.', 'בשורה 2 יש מילה שפייתון לא מכיר, כנראה print עם שגיאת כתיב.', {
              correct: true,
              feedback: ['Right. The type says "unknown name", the line number says where, and prnt is print with a letter missing.', 'נכון. הסוג אומר "שם לא מוכר", מספר השורה אומר איפה, ו-prnt הוא print עם אות חסרה.'],
            }),
            opt('The computer is broken and needs a restart.', 'המחשב מקולקל וצריך הפעלה מחדש.', {
              feedback: ['The computer is fine. The message describes a mistake in the program text.', 'המחשב בסדר. ההודעה מתארת טעות בטקסט של התוכנית.'],
            }),
            opt('Line 1 has a bug.', 'בשורה 1 יש באג.', {
              feedback: ['The message says line 2. The line number is the most useful part; trust it.', 'ההודעה אומרת שורה 2. מספר השורה הוא החלק הכי שימושי; סמכו עליו.'],
            }),
            opt('A quotation mark is missing.', 'חסרות מירכאות.', {
              feedback: ['A missing quotation mark gives a SyntaxError. A NameError means an unknown word.', 'מירכאות חסרות נותנות שגיאת תחביר (SyntaxError). שגיאת שם (NameError) פירושה מילה לא מוכרת.'],
            }),
          ],
          ['error-message', 'debugging'],
        ),
      ],
    },
    /* ---------------------------------------------------- 5. predict: order of lines */
    {
      variants: [
        predictQ(
          'm1-t-q5-a',
          py`
            print("Red")
            print("Yellow")
            print("Green")
          `,
          'Red\nYellow\nGreen',
          ['Three print lines give three lines of output, in the order they are written.', 'שלוש שורות `print` נותנות שלוש שורות פלט, בסדר שבו הן כתובות.'],
          ['sequence', 'print-basic'],
          { prompt: ['What does this program print? Write the output exactly, one line under the other.', 'מה התוכנית הזאת מדפיסה? כתבו את הפלט בדיוק, שורה מתחת לשורה.'] },
        ),
        predictQ(
          'm1-t-q5-b',
          py`
            print("Close the box")
            print("Open the box")
            print("Look inside")
          `,
          'Close the box\nOpen the box\nLook inside',
          ['Python prints the lines in the written order, even though closing before opening makes no sense. It does not check the meaning.', 'פייתון מדפיס את השורות בסדר שנכתבו, למרות שלסגור לפני שפותחים לא הגיוני. הוא לא בודק את המשמעות.'],
          ['sequence', 'precision'],
          { prompt: ['What does this program print? Write the output exactly, one line under the other.', 'מה התוכנית הזאת מדפיסה? כתבו את הפלט בדיוק, שורה מתחת לשורה.'] },
        ),
      ],
    },
    /* ---------------------------------------------------- 6. predict: what is shown */
    {
      variants: [
        predictQ(
          'm1-t-q6-a',
          py`
            print("Go!")
            print("Set")
          `,
          'Go!\nSet',
          ['The first line runs first, so Go! is printed before Set. The quotation marks are not shown.', 'השורה הראשונה מתבצעת ראשונה, ולכן Go! מודפס לפני Set. המירכאות לא מוצגות.'],
          ['sequence', 'print-basic'],
          { prompt: ['What does this program print? Write the output exactly, one line under the other.', 'מה התוכנית הזאת מדפיסה? כתבו את הפלט בדיוק, שורה מתחת לשורה.'] },
        ),
        predictQ(
          'm1-t-q6-b',
          py`
            print("1 + 1")
          `,
          '1 + 1',
          ['Inside quotation marks, 1 + 1 is just text. Python shows it exactly; it does not calculate.', 'בתוך מירכאות, 1 + 1 הוא סתם טקסט. פייתון מציג אותו בדיוק; הוא לא מחשב.'],
          ['print-basic', 'precision'],
          { prompt: ['What does this program print? Write the output exactly.', 'מה התוכנית הזאת מדפיסה? כתבו את הפלט בדיוק.'] },
        ),
      ],
    },
    /* ---------------------------------------------------- 7. code: fix a broken program */
    {
      variants: [
        codeQ({
          id: 'm1-t-q7-a',
          title: ['Fix the two bugs', 'תקנו את שני הבאגים'],
          mode: 'fix',
          instructions: [
            p(
              'This program has two bugs. Fix them so that it prints exactly:',
              'בתוכנית הזאת יש שני באגים. תקנו אותם כך שהיא תדפיס בדיוק:',
            ),
            code('One\nTwo\nThree', { lang: 'text', runnable: false }),
          ],
          starterCode: py`
            print("One)
            prnt("Two")
            print("Three")
          `,
          check: { tests: [outputTest('One\nTwo\nThree')] },
          hints: [
            ['Run it and read the message: the type of error and the line number tell you where to look.', 'הריצו וקראו את ההודעה: סוג השגיאה ומספר השורה אומרים לכם איפה להסתכל.'],
            ['Line 1 is missing a quotation mark; line 2 has print misspelled.', 'בשורה 1 חסרות מירכאות; בשורה 2 `print` כתוב עם שגיאת כתיב.'],
            ['Line 1: `print("One")`. Line 2: `print("Two")`.', 'שורה 1: `print("One")`. שורה 2: `print("Two")`.'],
          ],
          solution: py`
            print("One")
            print("Two")
            print("Three")
          `,
          concepts: ['bug', 'syntax-error', 'debugging'],
        }),
        codeQ({
          id: 'm1-t-q7-b',
          title: ['Fix the two bugs', 'תקנו את שני הבאגים'],
          mode: 'fix',
          instructions: [
            p(
              'This program has two bugs. Fix them so that it prints exactly:',
              'בתוכנית הזאת יש שני באגים. תקנו אותם כך שהיא תדפיס בדיוק:',
            ),
            code('Red\nYellow\nGreen', { lang: 'text', runnable: false }),
          ],
          starterCode: py`
            print("Red")
            print("Yellow"
            print(Green)
          `,
          check: { tests: [outputTest('Red\nYellow\nGreen')] },
          hints: [
            ['Run it and read the message. Fix the line it names, then run again for the second bug.', 'הריצו וקראו את ההודעה. תקנו את השורה שהיא מציינת, ואז הריצו שוב בשביל הבאג השני.'],
            ['Line 2 is missing its closing bracket; line 3 has text without quotation marks.', 'בשורה 2 חסר הסוגר הסוגר; בשורה 3 יש טקסט בלי מירכאות.'],
            ['Line 2: `print("Yellow")`. Line 3: `print("Green")`.', 'שורה 2: `print("Yellow")`. שורה 3: `print("Green")`.'],
          ],
          solution: py`
            print("Red")
            print("Yellow")
            print("Green")
          `,
          concepts: ['bug', 'syntax-error', 'debugging'],
        }),
      ],
    },
    /* ---------------------------------------------------- 8. code: print lines in order */
    {
      variants: [
        codeQ({
          id: 'm1-t-q8-a',
          title: ['Three lines in order', 'שלוש שורות לפי הסדר'],
          mode: 'write',
          instructions: [
            p(
              'Write a program that prints exactly these three lines, in this order:',
              'כתבו תוכנית שמדפיסה בדיוק את שלוש השורות האלה, בסדר הזה:',
            ),
            code('Ready\nSet\nGo', { lang: 'text', runnable: false }),
          ],
          starterCode: '',
          check: { tests: [outputTest('Ready\nSet\nGo')] },
          hints: [
            ['One print line for each line of output, in the same order.', 'שורת `print` אחת לכל שורת פלט, באותו סדר.'],
            ['The shape of each line is `print("...")` with the text between the quotation marks.', 'הצורה של כל שורה היא `print("...")` עם הטקסט בין המירכאות.'],
            ['`print("Ready")`, then `print("Set")`, then `print("Go")`.', '`print("Ready")`, אחר כך `print("Set")`, ואז `print("Go")`.'],
          ],
          solution: py`
            print("Ready")
            print("Set")
            print("Go")
          `,
          concepts: ['print-basic', 'sequence'],
        }),
        codeQ({
          id: 'm1-t-q8-b',
          title: ['Steps in order', 'צעדים לפי הסדר'],
          mode: 'write',
          instructions: [
            p(
              'Write a program that prints these four steps, in this order:',
              'כתבו תוכנית שמדפיסה את ארבעת הצעדים האלה, בסדר הזה:',
            ),
            code('Open the door\nWalk in\nTurn on the light\nSit down', { lang: 'text', runnable: false }),
          ],
          starterCode: '',
          check: { tests: [outputTest('Open the door\nWalk in\nTurn on the light\nSit down')] },
          hints: [
            ['Four lines of output need four print lines, top to bottom in the same order.', 'ארבע שורות פלט צריכות ארבע שורות `print`, מלמעלה למטה באותו סדר.'],
            ['Copy each step exactly, including capital letters and spaces, between the quotation marks.', 'העתיקו כל צעד בדיוק, כולל אותיות גדולות ורווחים, בין המירכאות.'],
            ['The first line is `print("Open the door")`; continue with the other three.', 'השורה הראשונה היא `print("Open the door")`; המשיכו עם שלוש האחרות.'],
          ],
          solution: py`
            print("Open the door")
            print("Walk in")
            print("Turn on the light")
            print("Sit down")
          `,
          concepts: ['print-basic', 'sequence', 'step-by-step'],
        }),
      ],
    },
  ],
};
