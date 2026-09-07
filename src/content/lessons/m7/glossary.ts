import type { GlossaryEntry } from '../../schema';

export const glossary: GlossaryEntry[] = [
  {
    id: 'traceback',
    term: 'traceback',
    name: { en: 'traceback', he: 'דוח שגיאה (traceback)' },
    definition: {
      en: 'The report Python prints when a running program fails: the file and line where it happened, the line itself, and at the bottom the error type and message. Read it from the bottom up.',
      he: 'הדוח שפייתון מדפיס כשתוכנית שרצה נכשלת: הקובץ והשורה שבהם זה קרה, השורה עצמה, ולמטה סוג השגיאה וההודעה. קוראים אותו מלמטה למעלה.',
    },
    example: 'File "main.py", line 2, in <module>\n    print(nmae)\nNameError: name \'nmae\' is not defined',
    lessonId: 'l28-reading-errors',
  },
  {
    id: 'name-error',
    term: 'NameError',
    name: { en: 'NameError', he: 'שגיאת שם (NameError)' },
    definition: {
      en: 'Python does not know a name you used: it is misspelled, or the variable is only created on a later line.',
      he: 'פייתון לא מכיר שם שהשתמשתם בו: הוא כתוב עם שגיאת כתיב, או שהמשתנה נוצר רק בשורה מאוחרת יותר.',
    },
    example: 'print(totl)  # NameError: name \'totl\' is not defined',
    lessonId: 'l28-reading-errors',
  },
  {
    id: 'value-error',
    term: 'ValueError',
    name: { en: 'ValueError', he: 'שגיאת ערך (ValueError)' },
    definition: {
      en: 'The type is right but the value is impossible, most often int() of text that is not a number.',
      he: 'הטיפוס נכון אבל הערך בלתי אפשרי, לרוב int() של טקסט שאינו מספר.',
    },
    example: 'int("abc")  # ValueError: invalid literal for int() with base 10: \'abc\'',
    lessonId: 'l28-reading-errors',
  },
  {
    id: 'zero-division',
    term: 'ZeroDivisionError',
    name: { en: 'ZeroDivisionError', he: 'חלוקה באפס (ZeroDivisionError)' },
    definition: {
      en: 'Raised when a program divides by 0, usually through a variable that turned out to be zero, such as the length of an empty list.',
      he: 'מועלית כשתוכנית מחלקת ב-0, בדרך כלל דרך משתנה שהתברר כאפס, למשל האורך של רשימה ריקה.',
    },
    example: 'total / len([])  # ZeroDivisionError: division by zero',
    lessonId: 'l28-reading-errors',
  },
  {
    id: 'attribute-error',
    term: 'AttributeError',
    name: { en: 'AttributeError', he: 'שגיאת תכונה (AttributeError)' },
    definition: {
      en: 'You asked a value for a method it does not have, for example .append on a string. The message names the real type of the value, which is the clue to the bug.',
      he: 'ביקשתם מערך פעולה שאין לו, למשל .append על מחרוזת. ההודעה מציינת את הטיפוס האמיתי של הערך, וזה הרמז לבאג.',
    },
    example: '"Maya".append("Dan")  # AttributeError: \'str\' object has no attribute \'append\'',
    lessonId: 'l28-reading-errors',
  },
  {
    id: 'try',
    term: 'try',
    name: { en: 'try', he: 'בלוק try' },
    definition: {
      en: 'Starts a block of lines to attempt. If one of them raises an exception, Python leaves the block at once and looks for a matching except block.',
      he: 'פותח בלוק של שורות לניסיון. אם אחת מהן מעלה חריגה, פייתון יוצא מהבלוק מיד ומחפש בלוק except מתאים.',
    },
    example: 'try:\n    number = int(text)\nexcept ValueError:\n    print("That is not a number")',
    lessonId: 'l29-try-except',
  },
  {
    id: 'except',
    term: 'except',
    name: { en: 'except', he: 'בלוק except' },
    definition: {
      en: 'The block that runs when the named error type happened inside the try block just above it. Always name the type (except ValueError:); a bare except: hides bugs.',
      he: 'הבלוק שרץ כשסוג השגיאה שצוין קרה בתוך בלוק ה-try שמעליו. תמיד ציינו את הסוג (except ValueError:); except: ריק מסתיר באגים.',
    },
    example: 'except ZeroDivisionError:\n    print("Cannot divide by zero")',
    lessonId: 'l29-try-except',
  },
  {
    id: 'exception',
    term: 'exception',
    name: { en: 'exception', he: 'חריגה (exception)' },
    definition: {
      en: 'The technical name for a runtime error. Python raises an exception when something impossible happens; if nothing catches it, the program stops with a traceback.',
      he: 'השם הטכני לשגיאת זמן ריצה. פייתון מעלה חריגה כשקורה משהו בלתי אפשרי; אם שום דבר לא תופס אותה, התוכנית נעצרת עם traceback.',
    },
    lessonId: 'l29-try-except',
  },
  {
    id: 'validation-loop',
    term: 'validation loop',
    name: { en: 'validation loop', he: 'לולאת אימות קלט (validation loop)' },
    definition: {
      en: 'A while True loop that reads input, tries to convert it, and breaks only when the conversion succeeds; otherwise it prints a message and asks again.',
      he: 'לולאת while True שקוראת קלט, מנסה להמיר אותו ויוצאת עם break רק כשההמרה מצליחה; אחרת היא מדפיסה הודעה ומבקשת שוב.',
    },
    example: 'while True:\n    try:\n        number = int(input("Number: "))\n        break\n    except ValueError:\n        print("Try again")',
    lessonId: 'l29-try-except',
  },
];
