import type { GlossaryEntry } from '../../schema';
import { t } from '../../authoring';

export const glossary: GlossaryEntry[] = [
  // l11 — comparisons
  {
    id: 'comparison',
    term: 'comparison',
    name: { en: 'comparison', he: 'השוואה' },
    definition: t(
      'A question about two values, such as age >= 18, that Python answers with True or False.',
      'שאלה על שני ערכים, כמו `age >= 18`, שפייתון עונה עליה ב-`True` או ב-`False`.',
    ),
    example: 'print(5 > 3)   # True',
    lessonId: 'l11-comparisons',
  },
  {
    id: 'boolean',
    term: 'bool',
    name: { en: 'boolean', he: 'ערך בוליאני' },
    definition: t(
      'A value that is either True or False. Every comparison produces a boolean, and you can store one in a variable.',
      'ערך שהוא `True` או `False`. כל השוואה מייצרת ערך בוליאני, ואפשר לשמור אותו במשתנה.',
    ),
    example: 'is_adult = age >= 18',
    lessonId: 'l11-comparisons',
  },
  {
    id: 'equality',
    term: '==',
    name: { en: 'equality check', he: 'בדיקת שוויון' },
    definition: t(
      'Two equals signs ask whether two values are equal and give True or False. A single = stores a value instead of asking.',
      'שני סימני שווה שואלים אם שני ערכים שווים ומחזירים `True` או `False`. סימן `=` יחיד, לעומת זאת, שומר ערך במקום לשאול.',
    ),
    example: 'print(x == 5)',
    lessonId: 'l11-comparisons',
  },
  // l12 — if / else
  {
    id: 'if',
    term: 'if',
    name: { en: 'if statement', he: 'משפט if' },
    definition: t(
      'Runs the indented block under it only when its condition is True; otherwise the block is skipped.',
      'מריץ את הבלוק המוזח שמתחתיו רק כשהתנאי שלו `True`; אחרת מדלגים על הבלוק.',
    ),
    example: 'if age >= 18:\n    print("You can vote")',
    lessonId: 'l12-if-else',
  },
  {
    id: 'else',
    term: 'else',
    name: { en: 'else', he: 'else (אחרת)' },
    definition: t(
      'The block that runs when the if condition was False. Exactly one of the if block and the else block runs.',
      'הבלוק שרץ כשהתנאי של ה-`if` היה `False`. בדיוק אחד מהבלוק של ה-`if` והבלוק של ה-`else` רץ.',
    ),
    example: 'if age >= 18:\n    print("You can vote")\nelse:\n    print("Not yet")',
    lessonId: 'l12-if-else',
  },
  {
    id: 'indentation',
    term: 'indentation',
    name: { en: 'indentation', he: 'הזחה' },
    definition: t(
      'The four spaces at the start of a line that show it belongs to the if, elif or else above it. Python uses indentation to find the block.',
      'ארבעת הרווחים בתחילת שורה שמראים שהיא שייכת ל-`if`, ל-`elif` או ל-`else` שמעליה. פייתון משתמש בהזחה כדי לזהות את הבלוק.',
    ),
    example: 'if x > 0:\n    print("positive")   # indented by 4 spaces',
    lessonId: 'l12-if-else',
  },
  {
    id: 'block',
    term: 'block',
    name: { en: 'block', he: 'בלוק' },
    definition: t(
      'A group of lines indented by the same amount under an if, elif or else. The whole group runs or is skipped together.',
      'קבוצת שורות שמוזחות באותה מידה מתחת ל-`if`, `elif` או `else`. כל הקבוצה רצה או מדולגת יחד.',
    ),
    example: 'if hot:\n    print("Drink water")\n    print("Find shade")',
    lessonId: 'l12-if-else',
  },
  // l13 — elif
  {
    id: 'elif',
    term: 'elif',
    name: { en: 'elif', he: 'elif (אחרת, אם)' },
    definition: t(
      'Short for "else if": another condition in the same decision, checked only when the conditions above it were False.',
      'קיצור של "else if": תנאי נוסף באותה החלטה, שנבדק רק כשהתנאים שמעליו היו `False`.',
    ),
    example: 'if score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("C")',
    lessonId: 'l13-elif',
  },
  {
    id: 'condition-order',
    term: 'condition order',
    name: { en: 'condition order', he: 'סדר התנאים' },
    definition: t(
      'In an if/elif chain only the first true condition runs, so the order matters: with >= put the largest threshold first, with < the smallest.',
      'בשרשרת `if`/`elif` רק התנאי הראשון שמתקיים רץ, ולכן הסדר משנה: עם `>=` שימו את הסף הגדול ביותר ראשון, ועם `<` את הקטן ביותר.',
    ),
    example: 'if score >= 90:   # largest first\n    ...\nelif score >= 80:\n    ...',
    lessonId: 'l13-elif',
  },
  // l14 — logic
  {
    id: 'and',
    term: 'and',
    name: { en: 'and', he: 'and (וגם)' },
    definition: t(
      'Combines two conditions; the result is True only when both of them are True.',
      'משלב שני תנאים; התוצאה היא `True` רק כששניהם `True`.',
    ),
    example: 'if age >= 13 and age <= 19:',
    lessonId: 'l14-logic',
  },
  {
    id: 'or',
    term: 'or',
    name: { en: 'or', he: 'or (או)' },
    definition: t(
      'Combines two conditions; the result is True when at least one of them is True.',
      'משלב שני תנאים; התוצאה היא `True` כשלפחות אחד מהם `True`.',
    ),
    example: 'if day == "Saturday" or day == "Sunday":',
    lessonId: 'l14-logic',
  },
  {
    id: 'not',
    term: 'not',
    name: { en: 'not', he: 'not (לא)' },
    definition: t(
      'Flips a True/False value: not True is False, and not False is True.',
      'הופך ערך `True`/`False`: `not True` הוא `False`, ו-`not False` הוא `True`.',
    ),
    example: 'if not raining:',
    lessonId: 'l14-logic',
  },
  {
    id: 'nested-if',
    term: 'nested if',
    name: { en: 'nested if', he: 'תנאי מקונן' },
    definition: t(
      'An if written inside the block of another if. The inner one is checked only when the outer condition was True.',
      '`if` שכתוב בתוך הבלוק של `if` אחר. הפנימי נבדק רק כשהתנאי החיצוני היה `True`.',
    ),
    example: 'if age >= 18:\n    if has_ticket:\n        print("Come in")',
    lessonId: 'l14-logic',
  },
];
