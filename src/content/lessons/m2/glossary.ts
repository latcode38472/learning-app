import type { GlossaryEntry } from '../../schema';

/** Glossary for module 2: Python basics (lessons 5–10). One entry per concept id. */
export const glossary: GlossaryEntry[] = [
  // ---------------------------------------------------------------- l05
  {
    id: 'print',
    term: 'print()',
    name: { en: 'print', he: 'print (הדפסה)' },
    definition: {
      en: 'Shows a value on the screen and moves to a new line. It is how a program talks to you.',
      he: 'מציגה ערך על המסך ועוברת לשורה חדשה. זו הדרך שבה תוכנית מדברת איתכם.',
    },
    example: 'print("Hello")',
    lessonId: 'l05-print-and-strings',
  },
  {
    id: 'string',
    term: 'string',
    name: { en: 'string', he: 'מחרוזת (string)' },
    definition: {
      en: 'Text: a row of characters inside quotes. Python carries it exactly as typed and does not try to understand it.',
      he: 'טקסט: שורה של תווים בתוך מירכאות. פייתון נושא אותו בדיוק כפי שהוקלד ולא מנסה להבין אותו.',
    },
    example: '"Hello, World!"',
    lessonId: 'l05-print-and-strings',
  },
  {
    id: 'quotes',
    term: '" " / \' \'',
    name: { en: 'quotes', he: 'מירכאות (quotes)' },
    definition: {
      en: 'Double or single quotes mark where a string starts and ends. Close with the same kind you opened with; the quotes themselves are not printed.',
      he: 'מירכאות כפולות או יחידות מסמנות איפה מחרוזת מתחילה ואיפה היא נגמרת. סוגרים באותו סוג שבו פתחתם; המירכאות עצמן לא מודפסות.',
    },
    example: 'print("It\'s sunny")',
    lessonId: 'l05-print-and-strings',
  },
  {
    id: 'comment',
    term: '#',
    name: { en: 'comment', he: 'הערה (comment)' },
    definition: {
      en: 'Everything after # on a line is a note for people who read the code. Python skips it completely.',
      he: 'כל מה שאחרי # בשורה הוא פתק לאנשים שקוראים את הקוד. פייתון מדלג עליו לגמרי.',
    },
    example: '# this line is ignored',
    lessonId: 'l05-print-and-strings',
  },
  {
    id: 'print-multiple',
    term: 'print(a, b)',
    name: { en: 'printing several items', he: 'הדפסת כמה פריטים' },
    definition: {
      en: 'Items separated by commas inside print are shown on one line with a single space between them. print() with nothing inside prints an empty line.',
      he: 'פריטים מופרדים בפסיקים בתוך print מוצגים בשורה אחת עם רווח אחד ביניהם. print() בלי כלום בפנים מדפיס שורה ריקה.',
    },
    example: 'print("Score:", 10)',
    lessonId: 'l05-print-and-strings',
  },
  // ---------------------------------------------------------------- l06
  {
    id: 'variable',
    term: 'variable',
    name: { en: 'variable', he: 'משתנה (variable)' },
    definition: {
      en: 'A name that remembers a value, so you can use the value again later in the program.',
      he: 'שם שזוכר ערך, כדי שתוכלו להשתמש בערך שוב בהמשך התוכנית.',
    },
    example: 'name = "Maya"',
    lessonId: 'l06-variables',
  },
  {
    id: 'assignment',
    term: '=',
    name: { en: 'assignment', he: 'השמה (assignment)' },
    definition: {
      en: 'The = sign stores the value on the right under the name on the left. It is an instruction, never a question.',
      he: 'הסימן = שומר את הערך שמימין תחת השם שמשמאל. זו הוראה, אף פעם לא שאלה.',
    },
    example: 'score = 10',
    lessonId: 'l06-variables',
  },
  {
    id: 'naming',
    term: 'variable name',
    name: { en: 'naming rules', he: 'כללי שמות' },
    definition: {
      en: 'A name uses letters, digits and underscores, cannot start with a digit or contain spaces, and should describe the value. Capital letters matter.',
      he: 'שם מורכב מאותיות, ספרות וקווים תחתונים, לא מתחיל בספרה ולא מכיל רווחים, וכדאי שיתאר את הערך. אותיות גדולות וקטנות נחשבות שונות.',
    },
    example: 'player_name = "Dana"',
    lessonId: 'l06-variables',
  },
  {
    id: 'reassignment',
    term: 'reassignment',
    name: { en: 'reassignment', he: 'השמה מחדש (reassignment)' },
    definition: {
      en: 'Storing a new value under an existing name. The old value is forgotten.',
      he: 'שמירת ערך חדש תחת שם קיים. הערך הישן נשכח.',
    },
    example: 'mood = "sleepy"\nmood = "awake"',
    lessonId: 'l06-variables',
  },
  // ---------------------------------------------------------------- l07
  {
    id: 'int',
    term: 'int',
    name: { en: 'int (whole number)', he: 'int (מספר שלם)' },
    definition: {
      en: 'A whole number, positive or negative, with no decimal point. Used for things you count.',
      he: 'מספר שלם, חיובי או שלילי, בלי נקודה עשרונית. משמש לדברים שסופרים.',
    },
    example: '42',
    lessonId: 'l07-numbers-and-math',
  },
  {
    id: 'float',
    term: 'float',
    name: { en: 'float (decimal number)', he: 'float (מספר עשרוני)' },
    definition: {
      en: 'A number with a decimal point, such as 2.5 or 3.0. Used for things you measure. Division with / always gives a float.',
      he: 'מספר עם נקודה עשרונית, כמו 2.5 או 3.0. משמש לדברים שמודדים. חילוק עם / תמיד נותן float.',
    },
    example: '3.14',
    lessonId: 'l07-numbers-and-math',
  },
  {
    id: 'arithmetic',
    term: '+ - * /',
    name: { en: 'arithmetic', he: 'פעולות חשבון (arithmetic)' },
    definition: {
      en: 'Add, subtract, multiply (a star) and divide. Numbers are written without quotes, and Python calculates the result.',
      he: 'חיבור, חיסור, כפל (כוכבית) וחילוק. מספרים נכתבים בלי מירכאות, ופייתון מחשב את התוצאה.',
    },
    example: 'print(10 * 3 - 4)',
    lessonId: 'l07-numbers-and-math',
  },
  {
    id: 'integer-division',
    term: '//',
    name: { en: 'whole-number division', he: 'חילוק שלם (integer division)' },
    definition: {
      en: 'How many whole times one number fits into another; the leftover is dropped. 7 // 2 is 3.',
      he: 'כמה פעמים שלמות מספר אחד נכנס במספר אחר; מה שנשאר נזרק. 7 // 2 הוא 3.',
    },
    example: '7 // 2',
    lessonId: 'l07-numbers-and-math',
  },
  {
    id: 'modulo',
    term: '%',
    name: { en: 'remainder (modulo)', he: 'שארית (modulo)' },
    definition: {
      en: 'What is left after whole-number division. 7 % 2 is 1. Useful for even/odd checks and for splitting minutes into hours.',
      he: 'מה שנשאר אחרי חילוק שלם. 7 % 2 הוא 1. שימושי לבדיקת זוגי/אי-זוגי ולפיצול דקות לשעות.',
    },
    example: '7 % 2',
    lessonId: 'l07-numbers-and-math',
  },
  {
    id: 'power',
    term: '**',
    name: { en: 'power', he: 'חזקה (power)' },
    definition: {
      en: 'Raises a number to a power: 2 ** 3 is 2 × 2 × 2, which is 8.',
      he: 'מעלה מספר בחזקה: 2 ** 3 הוא 2 × 2 × 2, כלומר 8.',
    },
    example: '2 ** 10',
    lessonId: 'l07-numbers-and-math',
  },
  {
    id: 'precedence',
    term: 'order of operations',
    name: { en: 'order of operations', he: 'סדר פעולות (precedence)' },
    definition: {
      en: 'Power first, then multiply and divide, then add and subtract, from left to right. Parentheses are calculated first and change the order.',
      he: 'קודם חזקה, אחר כך כפל וחילוק, ואז חיבור וחיסור, משמאל לימין. סוגריים מחושבים קודם ומשנים את הסדר.',
    },
    example: '(2 + 3) * 4',
    lessonId: 'l07-numbers-and-math',
  },
  // ---------------------------------------------------------------- l08
  {
    id: 'type',
    term: 'type()',
    name: { en: 'type', he: 'טיפוס (type)' },
    definition: {
      en: 'The kind of a value: int, float or str. The type decides what Python can do with the value. type(x) shows the type of x.',
      he: 'הסוג של ערך: int, float או str. הטיפוס קובע מה פייתון יכול לעשות עם הערך. type(x) מציגה את הטיפוס של x.',
    },
    example: 'print(type(2.5))',
    lessonId: 'l08-data-types',
  },
  {
    id: 'type-conversion',
    term: 'int(), float(), str()',
    name: { en: 'type conversion', he: 'המרת טיפוסים (type conversion)' },
    definition: {
      en: 'Turning a value into another type: int("12") gives the number 12, str(7) gives the text "7". The original value does not change.',
      he: 'הפיכת ערך לטיפוס אחר: int("12") נותנת את המספר 12, str(7) נותנת את הטקסט "7". הערך המקורי לא משתנה.',
    },
    example: 'int("12") + 1',
    lessonId: 'l08-data-types',
  },
  {
    id: 'type-mismatch',
    term: 'TypeError',
    name: { en: 'type mismatch (TypeError)', he: 'אי-התאמת טיפוסים (TypeError)' },
    definition: {
      en: 'An error raised when an operation does not fit the types, such as adding a number to a string. Fix it by converting one side.',
      he: 'שגיאה שמופיעה כשפעולה לא מתאימה לטיפוסים, למשל חיבור של מספר למחרוזת. מתקנים אותה על ידי המרה של צד אחד.',
    },
    example: '"1" + 1  # TypeError',
    lessonId: 'l08-data-types',
  },
  // ---------------------------------------------------------------- l09
  {
    id: 'input',
    term: 'input()',
    name: { en: 'input', he: 'קלט (input)' },
    definition: {
      en: 'Shows a prompt, pauses the program until the user types a line and presses Enter, and gives that line back.',
      he: 'מציגה הנחיה, עוצרת את התוכנית עד שהמשתמש מקליד שורה ולוחץ Enter, ומחזירה את השורה הזאת.',
    },
    example: 'name = input("Name: ")',
    lessonId: 'l09-input',
  },
  {
    id: 'input-is-text',
    term: 'input() returns text',
    name: { en: 'input gives a string', he: 'קלט הוא תמיד טקסט' },
    definition: {
      en: 'Whatever the user types arrives as a string, even digits. Convert with int() or float() before calculating.',
      he: 'כל מה שהמשתמש מקליד מגיע כמחרוזת, גם ספרות. המירו בעזרת int() או float() לפני שמחשבים.',
    },
    example: 'age = int(input("Age: "))',
    lessonId: 'l09-input',
  },
  // ---------------------------------------------------------------- l10
  {
    id: 'f-string',
    term: 'f-string',
    name: { en: 'f-string', he: 'מחרוזת f (f-string)' },
    definition: {
      en: 'A string with an f before the opening quote. Anything inside curly braces { } is replaced by its value, converted to text automatically.',
      he: 'מחרוזת עם f לפני המירכאה הפותחת. כל מה שבתוך סוגריים מסולסלים { } מוחלף בערך שלו, מומר לטקסט אוטומטית.',
    },
    example: 'f"Hello {name}, you are {age}"',
    lessonId: 'l10-fstrings',
  },
  {
    id: 'concatenation',
    term: '+ (strings)',
    name: { en: 'concatenation', he: 'שרשור (concatenation)' },
    definition: {
      en: 'Joining strings end to end with +. Works only between strings, so numbers must be converted with str() first. No spaces are added.',
      he: 'חיבור מחרוזות זו אחרי זו בעזרת +. עובד רק בין מחרוזות, ולכן מספרים צריך להמיר קודם עם str(). לא נוספים רווחים.',
    },
    example: '"Age: " + str(12)',
    lessonId: 'l10-fstrings',
  },
  {
    id: 'len',
    term: 'len()',
    name: { en: 'len (length)', he: 'len (אורך)' },
    definition: {
      en: 'Gives the number of characters in a string, spaces included.',
      he: 'נותנת את מספר התווים במחרוזת, כולל רווחים.',
    },
    example: 'len("hi there")  # 8',
    lessonId: 'l10-fstrings',
  },
  {
    id: 'upper-lower',
    term: '.upper() / .lower()',
    name: { en: 'upper and lower case', he: 'אותיות גדולות וקטנות' },
    definition: {
      en: 'Written after a string with a dot, they give a new string in capital or small letters. The original string does not change.',
      he: 'נכתבות אחרי מחרוזת עם נקודה, ונותנות מחרוזת חדשה באותיות גדולות או קטנות. המחרוזת המקורית לא משתנה.',
    },
    example: '"Python".upper()  # PYTHON',
    lessonId: 'l10-fstrings',
  },
];
