import type { GlossaryEntry } from '../../schema';

export const glossary: GlossaryEntry[] = [
  {
    id: 'function',
    term: 'function',
    name: { en: 'function', he: 'פונקציה' },
    definition: {
      en: 'A named block of code that you write once and can run as many times as you like by calling its name.',
      he: 'קטע קוד עם שם, שכותבים פעם אחת ואפשר להריץ כמה פעמים שרוצים על ידי קריאה בשמו.',
    },
    example: 'def greet():\n    print("Hello")\n\ngreet()',
    lessonId: 'l20-def',
  },
  {
    id: 'def',
    term: 'def',
    name: { en: 'def', he: 'def' },
    definition: {
      en: 'The keyword that defines a function: def, a name, parentheses and a colon, followed by an indented body. Defining runs nothing by itself.',
      he: 'מילת המפתח שמגדירה פונקציה: `def`, שם, סוגריים ונקודתיים, ואחריהם גוף מוזח. ההגדרה עצמה לא מריצה שום דבר.',
    },
    example: 'def show_menu():\n    print("1. Play")',
    lessonId: 'l20-def',
  },
  {
    id: 'call',
    term: 'call',
    name: { en: 'call', he: 'קריאה לפונקציה' },
    definition: {
      en: 'Running a function by writing its name followed by parentheses. Every call runs the whole body from the top.',
      he: 'הרצה של פונקציה על ידי כתיבת שמה ואחריו סוגריים. כל קריאה מריצה את כל הגוף מההתחלה.',
    },
    example: 'show_menu()',
    lessonId: 'l20-def',
  },
  {
    id: 'parameter',
    term: 'parameter',
    name: { en: 'parameter', he: 'פרמטר' },
    definition: {
      en: 'A name inside the parentheses of a def line. Inside the function it works like a variable whose value comes from the call.',
      he: 'שם בתוך הסוגריים של שורת `def`. בתוך הפונקציה הוא עובד כמו משתנה שערכו מגיע מהקריאה.',
    },
    example: 'def greet(name):\n    print(f"Hello, {name}")',
    lessonId: 'l21-parameters',
  },
  {
    id: 'argument',
    term: 'argument',
    name: { en: 'argument', he: 'ארגומנט' },
    definition: {
      en: 'A value written inside the parentheses of a call. Arguments are copied into the parameters by position.',
      he: 'ערך שכותבים בתוך הסוגריים של קריאה. הארגומנטים מועתקים לתוך הפרמטרים לפי המיקום.',
    },
    example: 'greet("Maya")',
    lessonId: 'l21-parameters',
  },
  {
    id: 'default-parameter',
    term: 'default value',
    name: { en: 'default value', he: 'ערך ברירת מחדל' },
    definition: {
      en: 'A value given to a parameter with = in the def line. It is used when the call does not pass an argument for that parameter.',
      he: 'ערך שניתן לפרמטר עם `=` בשורת `def`. משתמשים בו כשהקריאה לא מעבירה ארגומנט לפרמטר הזה.',
    },
    example: 'def greet(name, greeting="Hello"):\n    print(f"{greeting}, {name}")',
    lessonId: 'l21-parameters',
  },
  {
    id: 'return',
    term: 'return',
    name: { en: 'return', he: 'return' },
    definition: {
      en: 'The keyword that ends a function immediately and sends a value back to the place where it was called.',
      he: 'מילת המפתח שמסיימת פונקציה מיד ושולחת ערך בחזרה למקום שבו קראו לה.',
    },
    example: 'def add(a, b):\n    return a + b',
    lessonId: 'l22-return',
  },
  {
    id: 'return-value',
    term: 'return value',
    name: { en: 'return value', he: 'ערך מוחזר' },
    definition: {
      en: 'The value a function hands back. The call itself becomes that value, so it can be stored, printed or used in a calculation.',
      he: 'הערך שפונקציה מוסרת בחזרה. הקריאה עצמה הופכת לערך הזה, ולכן אפשר לשמור אותו, להדפיס אותו או להשתמש בו בחישוב.',
    },
    example: 'result = add(2, 3)',
    lessonId: 'l22-return',
  },
  {
    id: 'none',
    term: 'None',
    name: { en: 'None', he: 'None' },
    definition: {
      en: 'The Python value that means "nothing". A function without a return statement returns None; seeing None printed usually means a function printed instead of returning.',
      he: 'הערך בפייתון שפירושו "כלום". פונקציה בלי משפט `return` מחזירה `None`; אם `None` מודפס, בדרך כלל פונקציה הדפיסה במקום להחזיר.',
    },
    example: 'x = print("hi")\nprint(x)   # None',
    lessonId: 'l22-return',
  },
  {
    id: 'scope',
    term: 'scope',
    name: { en: 'scope', he: 'תחום' },
    definition: {
      en: 'The part of a program where a name can be used. Names created inside a function have local scope; names created at the top level have global scope.',
      he: 'החלק בתוכנית שבו אפשר להשתמש בשם. שמות שנוצרים בתוך פונקציה הם בתחום מקומי; שמות שנוצרים ברמה העליונה הם בתחום גלובלי.',
    },
    lessonId: 'l23-scope',
  },
  {
    id: 'local-variable',
    term: 'local variable',
    name: { en: 'local variable', he: 'משתנה מקומי' },
    definition: {
      en: 'A variable created inside a function. It exists only while that call runs and cannot be seen from outside.',
      he: 'משתנה שנוצר בתוך פונקציה. הוא קיים רק בזמן שהקריאה רצה ואי אפשר לראות אותו מבחוץ.',
    },
    example: 'def area(w, h):\n    result = w * h\n    return result',
    lessonId: 'l23-scope',
  },
  {
    id: 'global-variable',
    term: 'global variable',
    name: { en: 'global variable', he: 'משתנה גלובלי' },
    definition: {
      en: 'A variable created at the top level of the file. Functions can read it, but assigning to its name inside a function creates a local variable instead.',
      he: 'משתנה שנוצר ברמה העליונה של הקובץ. פונקציות יכולות לקרוא אותו, אבל השמה לשם שלו בתוך פונקציה יוצרת משתנה מקומי במקום זה.',
    },
    example: 'tax = 17\n\ndef with_tax(price):\n    return price + price * tax / 100',
    lessonId: 'l23-scope',
  },
  {
    id: 'program-structure',
    term: 'main()',
    name: { en: 'program structure (main)', he: 'מבנה תוכנית (main)' },
    definition: {
      en: 'Organising a program as small functions that each do one job, plus a main() function that runs the whole program and is called on the last line.',
      he: 'ארגון של תוכנית כפונקציות קטנות שכל אחת עושה דבר אחד, ועוד פונקציית `main()` שמריצה את התוכנית כולה ונקראת בשורה האחרונה.',
    },
    example: 'def main():\n    n = ask_number()\n    print(double(n))\n\nmain()',
    lessonId: 'l23-scope',
  },
];
