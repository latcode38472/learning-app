import type { GlossaryEntry } from '../../schema';

export const glossary: GlossaryEntry[] = [
  /* ---------------------------------------------------- l24-lists */
  {
    id: 'list',
    term: 'list',
    name: { en: 'list', he: 'רשימה' },
    definition: {
      en: 'A value that holds many items in order, written inside square brackets. Items are reached by their index, and the list can grow with append.',
      he: 'ערך שמחזיק הרבה פריטים לפי סדר, נכתב בתוך סוגריים מרובעים. מגיעים לפריטים לפי האינדקס שלהם, והרשימה יכולה לגדול עם `append`.',
    },
    example: 'colors = ["red", "green", "blue"]',
    lessonId: 'l24-lists',
  },
  {
    id: 'index',
    term: 'index',
    name: { en: 'index', he: 'אינדקס' },
    definition: {
      en: 'The position number of an item in a list. Counting starts at 0, so the first item is lst[0] and the last valid index is len(lst) - 1.',
      he: 'מספר המיקום של פריט ברשימה. הספירה מתחילה מ-0, ולכן הפריט הראשון הוא `lst[0]` והאינדקס החוקי האחרון הוא `len(lst) - 1`.',
    },
    example: 'colors[0]',
    lessonId: 'l24-lists',
  },
  {
    id: 'append',
    term: '.append()',
    name: { en: 'append', he: 'append (הוספה לסוף)' },
    definition: {
      en: 'A list operation that adds one value to the end of the list, making it one item longer.',
      he: 'פעולה של רשימה שמוסיפה ערך אחד לסוף הרשימה ומאריכה אותה בפריט אחד.',
    },
    example: 'tasks.append("piano")',
    lessonId: 'l24-lists',
  },
  {
    id: 'index-error',
    term: 'IndexError',
    name: { en: 'IndexError', he: 'שגיאת IndexError' },
    definition: {
      en: 'The error Python raises when you ask for an index that does not exist, for example item 3 of a three-item list. The message is "list index out of range".',
      he: 'השגיאה שפייתון מציג כשמבקשים אינדקס שלא קיים, למשל פריט 3 ברשימה של שלושה פריטים. ההודעה היא "list index out of range".',
    },
    example: 'colors = ["a", "b", "c"]\ncolors[3]  # IndexError',
    lessonId: 'l24-lists',
  },
  {
    id: 'negative-index',
    term: 'negative index',
    name: { en: 'negative index', he: 'אינדקס שלילי' },
    definition: {
      en: 'An index that counts from the end of a list: -1 is the last item, -2 the one before it.',
      he: 'אינדקס שסופר מסוף הרשימה: `-1` הוא הפריט האחרון, `-2` זה שלפניו.',
    },
    example: 'colors[-1]',
    lessonId: 'l24-lists',
  },

  /* ---------------------------------------------------- l25-list-loops */
  {
    id: 'for-each',
    term: 'for item in list',
    name: { en: 'for-each loop', he: 'לולאת for על רשימה' },
    definition: {
      en: 'A for loop that visits the items of a list one by one. Each time round, the loop variable holds the current item, not its index.',
      he: 'לולאת for שעוברת על פריטי הרשימה אחד-אחד. בכל סיבוב משתנה הלולאה מחזיק את הפריט הנוכחי, לא את האינדקס שלו.',
    },
    example: 'for color in colors:\n    print(color)',
    lessonId: 'l25-list-loops',
  },
  {
    id: 'in-operator',
    term: 'in',
    name: { en: 'in operator', he: 'האופרטור in' },
    definition: {
      en: 'A question that gives True or False: whether a value is one of the items of a list (or one of the keys of a dictionary).',
      he: 'שאלה שנותנת True או False: האם ערך הוא אחד מהפריטים של רשימה (או אחד מהמפתחות של מילון).',
    },
    example: 'if "red" in colors:',
    lessonId: 'l25-list-loops',
  },
  {
    id: 'list-modify',
    term: 'lst[i] = value',
    name: { en: 'changing a list item', he: 'שינוי פריט ברשימה' },
    definition: {
      en: 'Assigning to an index replaces the item at that position. The list keeps its length.',
      he: 'השמה לאינדקס מחליפה את הפריט שבמיקום הזה. אורך הרשימה לא משתנה.',
    },
    example: 'colors[1] = "yellow"',
    lessonId: 'l25-list-loops',
  },
  {
    id: 'remove-pop',
    term: '.remove() / .pop()',
    name: { en: 'remove and pop', he: 'remove ו-pop' },
    definition: {
      en: 'Two ways to take an item out of a list: remove(value) deletes the first item equal to the value; pop() deletes the last item and returns it.',
      he: 'שתי דרכים להוציא פריט מרשימה: `remove(value)` מוחק את הפריט הראשון ששווה לערך; `pop()` מוחק את הפריט האחרון ומחזיר אותו.',
    },
    example: 'tasks.remove("piano")\nlast = tasks.pop()',
    lessonId: 'l25-list-loops',
  },
  {
    id: 'sum-min-max',
    term: 'sum(), min(), max()',
    name: { en: 'sum, min and max', he: 'sum, min ו-max' },
    definition: {
      en: 'Built-in functions that take a list of numbers and return the total, the smallest item and the largest item.',
      he: 'פונקציות מובנות שמקבלות רשימה של מספרים ומחזירות את הסכום, את הפריט הקטן ביותר ואת הגדול ביותר.',
    },
    example: 'print(sum(scores), min(scores), max(scores))',
    lessonId: 'l25-list-loops',
  },
  {
    id: 'sorted',
    term: 'sorted()',
    name: { en: 'sorted', he: 'sorted (מיון)' },
    definition: {
      en: 'A built-in function that returns a new list with the items in order: numbers from small to large, text alphabetically. The original list is not changed.',
      he: 'פונקציה מובנית שמחזירה רשימה חדשה עם הפריטים לפי סדר: מספרים מהקטן לגדול, טקסט לפי האלף-בית. הרשימה המקורית לא משתנה.',
    },
    example: 'sorted([3, 1, 2])  # [1, 2, 3]',
    lessonId: 'l25-list-loops',
  },

  /* ---------------------------------------------------- l26-dictionaries */
  {
    id: 'dictionary',
    term: 'dict',
    name: { en: 'dictionary', he: 'מילון' },
    definition: {
      en: 'A collection of key: value pairs inside curly braces. Values are looked up by their key instead of by position.',
      he: 'אוסף של זוגות `key: value` בתוך סוגריים מסולסלים. מחפשים ערכים לפי המפתח שלהם במקום לפי מיקום.',
    },
    example: 'person = {"name": "Dana", "age": 12}',
    lessonId: 'l26-dictionaries',
  },
  {
    id: 'key-value',
    term: 'key: value',
    name: { en: 'key and value', he: 'מפתח וערך' },
    definition: {
      en: 'One entry of a dictionary: the key is the label you look up (usually a string) and the value is what is stored under it. d[key] reads a value; d[key] = value adds or replaces one.',
      he: 'רשומה אחת במילון: המפתח (key) הוא התווית שמחפשים (בדרך כלל מחרוזת), והערך (value) הוא מה ששמור תחתיה. `d[key]` קורא ערך; `d[key] = value` מוסיף או מחליף ערך.',
    },
    example: 'person["age"] = 13',
    lessonId: 'l26-dictionaries',
  },
  {
    id: 'dict-get',
    term: '.get()',
    name: { en: 'get with a default', he: 'get עם ברירת מחדל' },
    definition: {
      en: 'd.get(key, default) returns the value of the key if it exists, and otherwise the default — without stopping the program.',
      he: '`d.get(key, default)` מחזיר את הערך של המפתח אם הוא קיים, ואחרת את ברירת המחדל — בלי לעצור את התוכנית.',
    },
    example: 'person.get("city", "unknown")',
    lessonId: 'l26-dictionaries',
  },
  {
    id: 'dict-loop',
    term: 'for key, value in d.items()',
    name: { en: 'looping over a dictionary', he: 'לולאה על מילון' },
    definition: {
      en: 'for key in d visits the keys; for key, value in d.items() gives each key together with its value.',
      he: '`for key in d` עובר על המפתחות; `for key, value in d.items()` נותן כל מפתח יחד עם הערך שלו.',
    },
    example: 'for name, age in ages.items():\n    print(name, age)',
    lessonId: 'l26-dictionaries',
  },
  {
    id: 'key-error',
    term: 'KeyError',
    name: { en: 'KeyError', he: 'שגיאת KeyError' },
    definition: {
      en: 'The error Python raises when you read, with square brackets, a key that is not in the dictionary. Use .get() or the in operator when a key might be missing.',
      he: 'השגיאה שפייתון מציג כשקוראים בסוגריים מרובעים מפתח שלא נמצא במילון. השתמשו ב-`.get()` או באופרטור `in` כשייתכן שמפתח חסר.',
    },
    example: "person[\"city\"]  # KeyError: 'city'",
    lessonId: 'l26-dictionaries',
  },

  /* ---------------------------------------------------- l27-nested-data */
  {
    id: 'nested-data',
    term: 'nested data',
    name: { en: 'nested data', he: 'נתונים מקוננים' },
    definition: {
      en: 'A collection inside a collection, such as a list of dictionaries (a table of records) or a dictionary whose values are lists. Reach the inside step by step: students[0]["name"].',
      he: 'אוסף בתוך אוסף, כמו רשימה של מילונים (טבלה של רשומות) או מילון שהערכים שלו הם רשימות. מגיעים פנימה צעד אחר צעד: `students[0]["name"]`.',
    },
    example: 'students = [{"name": "Dana", "score": 91}]',
    lessonId: 'l27-nested-data',
  },
  {
    id: 'split-join',
    term: '.split() / .join()',
    name: { en: 'split and join', he: 'split ו-join' },
    definition: {
      en: 'text.split() cuts a string at the spaces into a list of words; " ".join(words) glues a list of strings back into one string with the separator between them.',
      he: '`text.split()` חותך מחרוזת ברווחים לרשימה של מילים; `" ".join(words)` מדביק רשימה של מחרוזות בחזרה למחרוזת אחת עם המפריד ביניהן.',
    },
    example: 'words = "a b c".split()\nprint("-".join(words))',
    lessonId: 'l27-nested-data',
  },
  {
    id: 'choosing-structures',
    term: 'choosing a structure',
    name: { en: 'choosing a data structure', he: 'בחירת מבנה נתונים' },
    definition: {
      en: 'A list for an ordered collection of similar things; a dictionary for labelled facts about one thing; a list of dictionaries for many things that each have labelled facts.',
      he: 'רשימה לאוסף מסודר של דברים דומים; מילון לעובדות עם תוויות על דבר אחד; רשימה של מילונים להרבה דברים שלכל אחד מהם עובדות עם תוויות.',
    },
    lessonId: 'l27-nested-data',
  },
];
