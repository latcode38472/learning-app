import type { GlossaryEntry } from '../../schema';

/** Glossary for module m1 — one entry per concept id introduced in the module. */
export const glossary: GlossaryEntry[] = [
  /* ------------------------------------------------ l01-what-computers-do */
  {
    id: 'computer-basics',
    term: 'computer',
    name: { en: 'computer', he: 'מחשב' },
    definition: {
      en: 'A machine that follows instructions exactly and very fast. It does not understand or guess; it does only what the instructions say.',
      he: 'מכונה שמבצעת הוראות בדיוק ומהר מאוד. היא לא מבינה ולא מנחשת; היא עושה רק מה שההוראות אומרות.',
    },
    lessonId: 'l01-what-computers-do',
  },
  {
    id: 'input-output',
    term: 'input / output',
    name: { en: 'input and output', he: 'קלט ופלט' },
    definition: {
      en: 'Input is what goes into the computer (a key press, a tap). Output is what comes out (text on the screen, a sound). In between, the computer processes the input.',
      he: 'קלט (input) הוא מה שנכנס למחשב (לחיצה על מקש, הקשה על המסך). פלט (output) הוא מה שיוצא (טקסט על המסך, צליל). בין לבין, המחשב מעבד את הקלט.',
    },
    lessonId: 'l01-what-computers-do',
  },
  {
    id: 'program',
    term: 'program',
    name: { en: 'program', he: 'תוכנית' },
    definition: {
      en: 'A list of instructions written in a language the computer understands, such as Python. People write it; the computer follows it line by line.',
      he: 'רשימה של הוראות שכתובה בשפה שהמחשב מבין, כמו פייתון. בני אדם כותבים אותה; המחשב מבצע אותה שורה אחרי שורה.',
    },
    example: 'print("Hello")',
    lessonId: 'l01-what-computers-do',
  },
  {
    id: 'print-basic',
    term: 'print()',
    name: { en: 'print', he: 'print' },
    definition: {
      en: 'Shows text on the screen. The text goes between quotation marks, inside the round brackets. The brackets and quotation marks themselves are not shown.',
      he: 'מציג טקסט על המסך. הטקסט נכתב בין מירכאות, בתוך הסוגריים העגולים. הסוגריים והמירכאות עצמם לא מוצגים.',
    },
    example: 'print("Hello, world!")',
    lessonId: 'l01-what-computers-do',
  },

  /* ------------------------------------------------ l02-programs-and-files */
  {
    id: 'file',
    term: 'file',
    name: { en: 'file', he: 'קובץ' },
    definition: {
      en: 'A named place on the computer that stores information. A Python program is a text file whose name ends with .py.',
      he: 'מקום עם שם במחשב ששומר מידע. תוכנית פייתון היא קובץ טקסט ששמו מסתיים ב-.py.',
    },
    example: 'hello.py',
    lessonId: 'l02-programs-and-files',
  },
  {
    id: 'running-programs',
    term: 'run',
    name: { en: 'running a program', he: 'הרצת תוכנית' },
    definition: {
      en: 'Making Python read the program file and perform each line, from the first line to the last. In this app you run a program with the Run button.',
      he: 'לגרום לפייתון לקרוא את קובץ התוכנית ולבצע כל שורה, מהשורה הראשונה עד האחרונה. באפליקציה הזאת מריצים תוכנית בעזרת כפתור Run.',
    },
    lessonId: 'l02-programs-and-files',
  },
  {
    id: 'console',
    term: 'console',
    name: { en: 'console', he: 'קונסולה' },
    definition: {
      en: 'The area under the editor where the output of a program appears. Everything print shows lands there, and so do error messages.',
      he: 'האזור שמתחת לעורך שבו הפלט של התוכנית מופיע. כל מה ש-print מציג מגיע לשם, וגם הודעות שגיאה.',
    },
    lessonId: 'l02-programs-and-files',
  },
  {
    id: 'sequence',
    term: 'sequence',
    name: { en: 'sequence', he: 'רצף' },
    definition: {
      en: 'The order in which lines run: from the top of the file to the bottom, one after another, never skipping. The order of the lines is the order of the output.',
      he: 'הסדר שבו השורות מתבצעות: מראש הקובץ לסופו, בזו אחר זו, בלי לדלג. סדר השורות הוא סדר הפלט.',
    },
    example: 'print("First")\nprint("Second")',
    lessonId: 'l02-programs-and-files',
  },

  /* ------------------------------------------------ l03-thinking-in-steps */
  {
    id: 'algorithm',
    term: 'algorithm',
    name: { en: 'algorithm', he: 'אלגוריתם' },
    definition: {
      en: 'A precise list of steps that completes a task. A recipe is an algorithm; a program is an algorithm written in a language the computer understands.',
      he: 'רשימה מדויקת של צעדים שמשלימה משימה. מתכון הוא אלגוריתם; תוכנית היא אלגוריתם שכתוב בשפה שהמחשב מבין.',
    },
    lessonId: 'l03-thinking-in-steps',
  },
  {
    id: 'precision',
    term: 'precision',
    name: { en: 'precision', he: 'דיוק' },
    definition: {
      en: 'Saying exactly what should happen, with nothing left to guess. Computers need it because they do what you wrote, not what you meant.',
      he: 'לומר בדיוק מה צריך לקרות, בלי להשאיר שום דבר לניחוש. מחשבים זקוקים לזה כי הם עושים מה שכתבתם, לא מה שהתכוונתם.',
    },
    lessonId: 'l03-thinking-in-steps',
  },
  {
    id: 'step-by-step',
    term: 'step by step',
    name: { en: 'step by step', he: 'צעד אחר צעד' },
    definition: {
      en: 'Breaking a task into small steps, each clear enough to do without thinking, and putting them in the right order. This is the thinking behind every program.',
      he: 'לפרק משימה לצעדים קטנים, שכל אחד מהם ברור מספיק כדי לבצע אותו בלי לחשוב, ולסדר אותם בסדר הנכון. זו החשיבה שמאחורי כל תוכנית.',
    },
    lessonId: 'l03-thinking-in-steps',
  },

  /* ------------------------------------------------ l04-first-bug */
  {
    id: 'bug',
    term: 'bug',
    name: { en: 'bug', he: 'באג' },
    definition: {
      en: 'A mistake in a program. Every programmer makes them; finding and fixing them is a normal part of programming.',
      he: 'טעות בתוכנית. כל מתכנת עושה טעויות כאלה; למצוא ולתקן אותן הוא חלק רגיל מהתכנות.',
    },
    lessonId: 'l04-first-bug',
  },
  {
    id: 'error-message',
    term: 'error message',
    name: { en: 'error message', he: 'הודעת שגיאה' },
    definition: {
      en: 'The text Python shows when it gets stuck. It names the error type, the line number and a short description of the problem.',
      he: 'הטקסט שפייתון מציג כשהוא נתקע. הוא מציין את סוג השגיאה, את מספר השורה ותיאור קצר של הבעיה.',
    },
    example: "NameError: name 'pirnt' is not defined",
    lessonId: 'l04-first-bug',
  },
  {
    id: 'syntax-error',
    term: 'SyntaxError',
    name: { en: 'SyntaxError', he: 'שגיאת תחביר (SyntaxError)' },
    definition: {
      en: 'Python could not read a line: a quotation mark or bracket is missing, or something is in the wrong place. With a SyntaxError nothing in the file runs.',
      he: 'פייתון לא הצליח לקרוא שורה: חסרות מירכאות או סוגריים, או שמשהו נמצא במקום הלא נכון. עם שגיאת תחביר שום דבר בקובץ לא רץ.',
    },
    example: 'print("Hello)',
    lessonId: 'l04-first-bug',
  },
  {
    id: 'debugging',
    term: 'debugging',
    name: { en: 'debugging', he: 'ניפוי שגיאות (debugging)' },
    definition: {
      en: 'Finding and fixing bugs. The habit: read the error message, go to the line it names, compare with a working line, fix one thing, run again.',
      he: 'למצוא ולתקן באגים. ההרגל: קראו את הודעת השגיאה, לכו לשורה שהיא מציינת, השוו לשורה שעובדת, תקנו דבר אחד, הריצו שוב.',
    },
    lessonId: 'l04-first-bug',
  },
];
