import type { Lesson } from '../../schema';
import {
  p,
  h,
  code,
  list,
  term,
  table,
  viz,
  t,
  opt,
  choice,
  exercise,
  outputTest,
  functionTest,
  pythonTest,
  requires,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l26-dictionaries',
  moduleId: 'm6',
  title: t('Dictionaries: values with labels', 'מילונים: ערכים עם תוויות'),
  tagline: t('Look things up by name, not by position.', 'מחפשים לפי שם, לא לפי מיקום.'),
  estimatedMinutes: 25,
  introduces: ['dictionary', 'key-value', 'dict-get', 'dict-loop', 'key-error'],
  requires: ['list', 'for-each', 'in-operator', 'variable', 'string', 'int', 'f-string', 'if', 'function', 'return'],
  runsInBrowser: true,

  objective: t(
    'Create a dictionary, read and change values by their key, avoid a KeyError, and loop over keys and values.',
    'ליצור מילון, לקרוא ולשנות ערכים לפי המפתח שלהם, להימנע משגיאת KeyError, ולעבור בלולאה על מפתחות וערכים.',
  ),
  prerequisiteCheck: t(
    'You can create a list, loop over it with a for-each loop and check membership with in (lessons 24–25).',
    'אתם יודעים ליצור רשימה, לעבור עליה בלולאת for ולבדוק אם ערך נמצא בה בעזרת `in` (שיעורים 24–25).',
  ),

  explanation: [
    p(
      'A list is perfect when the items are alike and their order matters. But look at the facts about one person: a name, an age, a city. Each fact has a **label**, and asking for "item number 2" makes no sense. A **dictionary** stores pairs: a **key** (the label) and a **value**.',
      'רשימה מושלמת כשהפריטים דומים זה לזה והסדר שלהם חשוב. אבל הסתכלו על העובדות על אדם אחד: שם, גיל, עיר. לכל עובדה יש **תווית**, ולבקש את "פריט מספר 2" לא הגיוני. **מילון** (dictionary) שומר זוגות: **מפתח** (key) — התווית — ו**ערך** (value).',
    ),
    term(
      '{}',
      'Curly braces create a dictionary. Inside, each entry is written as `key: value`, and entries are separated by commas. `{}` with nothing inside is an empty dictionary.',
      'סוגריים מסולסלים יוצרים מילון. בפנים, כל רשומה נכתבת כ-`key: value`, והרשומות מופרדות בפסיקים. `{}` בלי שום דבר בפנים הוא מילון ריק.',
    ),
    term(
      ':',
      'Inside a dictionary the colon separates a key from its value: `"age": 12` means the key `"age"` holds the value `12`. Keys are usually strings; values can be anything — text, numbers, even lists.',
      'בתוך מילון הנקודתיים מפרידות בין מפתח לערך שלו: `"age": 12` פירושו שהמפתח `"age"` מחזיק את הערך `12`. המפתחות הם בדרך כלל מחרוזות; הערכים יכולים להיות כל דבר — טקסט, מספרים, אפילו רשימות.',
    ),
    code(py`
      person = {"name": "Dana", "age": 12}
      print(person["name"])
      print(person["age"] + 1)
    `, { output: 'Dana\n13' }),
    p(
      'To read a value, write the dictionary name and the key in square brackets — the same brackets as a list index, but with a label instead of a position. `person["age"]` is the number 12, so adding 1 to it works.',
      'כדי לקרוא ערך, כתבו את שם המילון ואת המפתח בסוגריים מרובעים — אותם סוגריים כמו באינדקס של רשימה, אבל עם תווית במקום מיקום. `person["age"]` הוא המספר 12, ולכן אפשר להוסיף לו 1.',
    ),
    h('Adding and changing entries', 'הוספה ושינוי של רשומות'),
    p(
      'Assigning to a key that does not exist yet **adds** an entry. Assigning to a key that already exists **replaces** its value. `len` counts the entries.',
      'השמה למפתח שעדיין לא קיים **מוסיפה** רשומה. השמה למפתח שכבר קיים **מחליפה** את הערך שלו. `len` סופר את הרשומות.',
    ),
    code(py`
      person = {"name": "Dana", "age": 12}
      person["city"] = "Haifa"
      person["age"] = 13
      print(person)
      print(len(person))
    `, { output: "{'name': 'Dana', 'age': 13, 'city': 'Haifa'}\n3" }),
    h('A key that does not exist', 'מפתח שלא קיים'),
    p(
      'Reading a key that is not in the dictionary stops the program, just like an index that is too big:',
      'קריאה של מפתח שלא נמצא במילון עוצרת את התוכנית, בדיוק כמו אינדקס גדול מדי:',
    ),
    code(py`
      person = {"name": "Dana", "age": 12}
      city = person["city"]
    `),
    code(
      "Traceback (most recent call last):\n  File \"main.py\", line 2, in <module>\n    city = person[\"city\"]\n           ~~~~~~^^^^^^^^\nKeyError: 'city'",
      { lang: 'text', runnable: false, caption: t('The error message', 'הודעת השגיאה') },
    ),
    term(
      '.get()',
      '`person.get("city", "unknown")` returns the value of `"city"` if the key exists, and otherwise the default you give (`"unknown"`). Nothing crashes. Use it whenever a key might be missing.',
      '`person.get("city", "unknown")` מחזיר את הערך של `"city"` אם המפתח קיים, ואחרת את ברירת המחדל שנתתם (`"unknown"`). שום דבר לא קורס. השתמשו בו בכל פעם שייתכן שמפתח חסר.',
    ),
    p(
      'The `in` operator also works on dictionaries. It checks the **keys**, not the values: `"age" in person` is `True`, while `12 in person` is `False`.',
      'האופרטור `in` עובד גם על מילונים. הוא בודק את **המפתחות**, לא את הערכים: `"age" in person` הוא `True`, ואילו `12 in person` הוא `False`.',
    ),
    code(py`
      person = {"name": "Dana", "age": 12}
      print(person.get("city", "unknown"))
      print("age" in person)
      if "city" in person:
          print(person["city"])
      else:
          print("No city")
    `, { output: 'unknown\nTrue\nNo city' }),
    h('Looping over a dictionary', 'לולאה על מילון'),
    term(
      '.items()',
      'A for-each loop over a dictionary gives the **keys**. To get each key together with its value, loop over `d.items()` with two loop variables separated by a comma: `for name, age in ages.items():`.',
      'לולאת for על מילון נותנת את **המפתחות**. כדי לקבל כל מפתח יחד עם הערך שלו, עברו בלולאה על `d.items()` עם שני משתני לולאה מופרדים בפסיק: `for name, age in ages.items():`.',
    ),
    code(py`
      ages = {"Dana": 12, "Omer": 15}
      for name in ages:
          print(name)
      for name, age in ages.items():
          print(f"{name} is {age}")
    `, { output: 'Dana\nOmer\nDana is 12\nOmer is 15' }),
    h('List or dictionary?', 'רשימה או מילון?'),
    table(
      [['Use a list when…', 'השתמשו ברשימה כאשר…'], ['Use a dictionary when…', 'השתמשו במילון כאשר…']],
      [
        [['the items are alike and their order matters: scores, names, tasks', 'הפריטים דומים זה לזה והסדר שלהם חשוב: ציונים, שמות, משימות'], ['each value has its own label: name, age, city', 'לכל ערך יש תווית משלו: שם, גיל, עיר']],
        [['you reach an item by its position: `scores[0]`', 'מגיעים לפריט לפי המיקום שלו: `scores[0]`'], ['you reach a value by its key: `person["age"]`', 'מגיעים לערך לפי המפתח שלו: `person["age"]`']],
        [['you add to the end and loop over everything', 'מוסיפים לסוף ועוברים בלולאה על הכול'], ['you look one thing up by name', 'מחפשים דבר אחד לפי שם']],
      ],
    ),
  ],

  simpler: [
    p(
      'Think of the contacts in a phone. You look up a **name** and get a **number**. You never say "give me contact number 7". The name is the key, the number is the value.',
      'חשבו על אנשי הקשר בטלפון. אתם מחפשים **שם** ומקבלים **מספר**. אתם אף פעם לא אומרים "תנו לי את איש קשר מספר 7". השם הוא המפתח, המספר הוא הערך.',
    ),
    p(
      '`{}` is an empty contacts book. `book["Dana"] = "052-1234"` writes a new entry; writing it again with a different number replaces the old one.',
      '`{}` הוא ספר אנשי קשר ריק. `book["Dana"] = "052-1234"` כותב רשומה חדשה; כתיבה חוזרת עם מספר אחר מחליפה את הישן.',
    ),
    p(
      'Looking up a name that is not in the book is the KeyError. `book.get("Noa", "no number")` is the polite version: if Noa is missing you get "no number" instead of a crash.',
      'חיפוש של שם שלא נמצא בספר הוא שגיאת KeyError. `book.get("Noa", "no number")` היא הגרסה המנומסת: אם Noa חסרה, מקבלים "no number" במקום קריסה.',
    ),
    p(
      'Looping with `.items()` is like reading the book from the first page to the last: each time you get a name and its number together.',
      'לולאה עם `.items()` היא כמו לקרוא את הספר מהעמוד הראשון עד האחרון: בכל פעם מקבלים שם ואת המספר שלו יחד.',
    ),
  ],

  workedExample: [
    p(
      'A small shop keeps its stock in a dictionary. Press play under the code to watch the entries change.',
      'חנות קטנה שומרת את המלאי שלה במילון. לחצו על כפתור ההפעלה מתחת לקוד כדי לראות את הרשומות משתנות.',
    ),
    viz(py`
      stock = {"apple": 3, "pear": 0}
      stock["apple"] = stock["apple"] - 1
      stock["plum"] = 5
      for fruit, amount in stock.items():
          print(fruit, amount)
      print(len(stock))
    `),
    list([
      ['Line 1: `stock` has two entries. The key `"apple"` holds 3 and `"pear"` holds 0.', 'שורה 1: ל-`stock` יש שתי רשומות. המפתח `"apple"` מחזיק 3 ו-`"pear"` מחזיק 0.'],
      ['Line 2 reads the value of `"apple"`, subtracts 1, and stores the result back under the same key — the same read-then-write pattern as `total = total + 1`.', 'שורה 2 קוראת את הערך של `"apple"`, מחסירה 1, ושומרת את התוצאה בחזרה תחת אותו מפתח — אותה תבנית של קריאה-ואז-כתיבה כמו `total = total + 1`.'],
      ['Line 3 adds a new key `"plum"` with the value 5. The dictionary now has three entries.', 'שורה 3 מוסיפה מפתח חדש `"plum"` עם הערך 5. עכשיו במילון שלוש רשומות.'],
      ['Lines 4–5 loop over `items()`: each time round, `fruit` is a key and `amount` is its value. Line 6 prints the number of entries.', 'שורות 4–5 עוברות בלולאה על `items()`: בכל סיבוב `fruit` הוא מפתח ו-`amount` הוא הערך שלו. שורה 6 מדפיסה את מספר הרשומות.'],
    ], true),
    code(py`
      apple 2
      pear 0
      plum 5
      3
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('Counting votes', 'ספירת קולות'),
      code(py`
        votes = ["cat", "dog", "cat", "bird", "cat"]
        count = {}
        for animal in votes:
            count[animal] = count.get(animal, 0) + 1
        print(count)
      `, { output: "{'cat': 3, 'dog': 1, 'bird': 1}" }),
      p(
        'This is one of the most useful dictionary patterns. `count.get(animal, 0)` gives the count so far, or 0 the first time an animal appears; adding 1 and storing the result back updates the entry.',
        'זו אחת התבניות השימושיות ביותר של מילונים. `count.get(animal, 0)` נותן את הספירה עד כה, או 0 בפעם הראשונה שחיה מופיעה; הוספת 1 ושמירת התוצאה בחזרה מעדכנות את הרשומה.',
      ),
    ],
    [
      h('A price list and a shopping cart', 'מחירון וסל קניות'),
      code(py`
        prices = {"apple": 2, "bread": 5, "milk": 4}
        cart = ["apple", "milk", "apple"]
        total = 0
        for item in cart:
            total = total + prices[item]
        print(f"Total: {total}")
      `, { output: 'Total: 8' }),
      p(
        'The list holds what was bought (in order, with repeats); the dictionary holds the price of each product. The loop takes each item from the list and looks its price up in the dictionary.',
        'הרשימה מחזיקה מה נקנה (לפי סדר, עם חזרות); המילון מחזיק את המחיר של כל מוצר. הלולאה לוקחת כל פריט מהרשימה ומחפשת את המחיר שלו במילון.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l26-hard',
    title: ['The oldest', 'הכי מבוגר'],
    mode: 'write',
    instructions: [
      p(
        'Write a function `oldest(ages)` where `ages` is a dictionary from names to ages, such as `{"Dana": 12, "Omer": 15, "Lia": 9}`. It returns the name with the largest age — here `"Omer"`. Keep the best name and the best age seen so far while looping over `ages.items()`.',
        'כתבו פונקציה `oldest(ages)` כאשר `ages` הוא מילון משמות לגילאים, למשל `{"Dana": 12, "Omer": 15, "Lia": 9}`. היא מחזירה את השם עם הגיל הגדול ביותר — כאן `"Omer"`. שמרו את השם הטוב ביותר ואת הגיל הטוב ביותר שראיתם עד כה בזמן הלולאה על `ages.items()`.',
      ),
    ],
    starterCode: py`
      def oldest(ages):
          # keep the best name and age seen so far,
          # then loop over ages.items() and update them
          best_name = ""
          best_age = 0
          return best_name


      print(oldest({"Dana": 12, "Omer": 15, "Lia": 9}))
    `,
    check: {
      tests: [
        functionTest('oldest({"Dana": 12, "Omer": 15, "Lia": 9})', "'Omer'"),
        functionTest('oldest({"Ann": 40})', "'Ann'"),
        functionTest('oldest({"a": 1, "b": 3, "c": 2})', "'b'"),
      ],
    },
    hints: [
      ['Loop with `for name, age in ages.items():` so you see the name and the age together.', 'עברו בלולאה `for name, age in ages.items():` כדי לראות את השם ואת הגיל יחד.'],
      ['Inside the loop: `if age > best_age:` — then update both `best_age` and `best_name`.', 'בתוך הלולאה: `if age > best_age:` — ואז עדכנו גם את `best_age` וגם את `best_name`.'],
      ['Inside the `if`: `best_age = age` and then `best_name = name`. The `return best_name` after the loop is already there.', 'בתוך ה-`if`: `best_age = age` ואז `best_name = name`. ה-`return best_name` שאחרי הלולאה כבר נמצא בקוד.'],
    ],
    solution: py`
      def oldest(ages):
          best_name = ""
          best_age = 0
          for name, age in ages.items():
              if age > best_age:
                  best_age = age
                  best_name = name
          return best_name


      print(oldest({"Dana": 12, "Omer": 15, "Lia": 9}))
    `,
    concepts: ['dictionary', 'dict-loop', 'if', 'return'],
  }),

  predict: {
    code: py`
      pet = {"name": "Rex", "legs": 4}
      pet["sound"] = "woof"
      pet["legs"] = 3
      print(pet["name"])
      print(pet.get("color", "none"))
      print(len(pet))
      print("sound" in pet)
    `,
    prompt: t('What does this program print? Write all four lines.', 'מה התוכנית הזאת תדפיס? כתבו את כל ארבע השורות.'),
    answer: 'Rex\nnone\n3\nTrue',
    explanation: t(
      '`pet["name"]` is "Rex". There is no key "color", so get returns the default "none". Adding "sound" made 3 entries (changing "legs" does not add one). "sound" is a key, so in gives True.',
      '`pet["name"]` הוא "Rex". אין מפתח "color", ולכן `get` מחזיר את ברירת המחדל "none". הוספת "sound" יצרה 3 רשומות (שינוי של "legs" לא מוסיף רשומה). "sound" הוא מפתח, ולכן `in` נותן True.',
    ),
  },

  exercise: exercise({
    id: 'l26-ex',
    title: ['Contact book', 'ספר אנשי קשר'],
    mode: 'modify',
    instructions: [
      p(
        'This program works, but it only prints one number. Change it so that it adds `"Lia"` with the number `"050-5555"`, changes the number of `"Omer"` to `"054-0000"`, prints every contact as `NAME: NUMBER` using a loop over `.items()`, and finally prints `Contacts: 3`. The output should be:',
        'התוכנית הזאת עובדת, אבל היא מדפיסה רק מספר אחד. שנו אותה כך שתוסיף את `"Lia"` עם המספר `"050-5555"`, תשנה את המספר של `"Omer"` ל-`"054-0000"`, תדפיס כל איש קשר בצורה `NAME: NUMBER` בעזרת לולאה על `.items()`, ולבסוף תדפיס `Contacts: 3`. הפלט צריך להיות:',
      ),
      code('Dana: 052-1234\nOmer: 054-0000\nLia: 050-5555\nContacts: 3', { lang: 'text', runnable: false }),
    ],
    starterCode: py`
      book = {"Dana": "052-1234", "Omer": "054-9876"}

      print(book["Dana"])
    `,
    check: {
      tests: [
        outputTest('Dana: 052-1234\nOmer: 054-0000\nLia: 050-5555\nContacts: 3'),
        pythonTest(
          `assert ns.get("book") == {"Dana": "052-1234", "Omer": "054-0000", "Lia": "050-5555"}, "book should end up with Dana, Omer (054-0000) and Lia (050-5555)."`,
        ),
      ],
      requires: [requires('\\.items\\(\\)', 'Loop over book.items() to print the contacts.', 'עברו בלולאה על `book.items()` כדי להדפיס את אנשי הקשר.')],
    },
    hints: [
      ['Add and change with square brackets: `book["Lia"] = "050-5555"` adds an entry, `book["Omer"] = "054-0000"` replaces one.', 'הוסיפו ושנו בעזרת סוגריים מרובעים: `book["Lia"] = "050-5555"` מוסיף רשומה, `book["Omer"] = "054-0000"` מחליף אחת.'],
      ['Loop with `for name, number in book.items():` and print `f"{name}: {number}"`.', 'עברו בלולאה `for name, number in book.items():` והדפיסו `f"{name}: {number}"`.'],
      ['The last line is `print(f"Contacts: {len(book)}")`.', 'השורה האחרונה היא `print(f"Contacts: {len(book)}")`.'],
    ],
    solution: py`
      book = {"Dana": "052-1234", "Omer": "054-9876"}
      book["Lia"] = "050-5555"
      book["Omer"] = "054-0000"

      for name, number in book.items():
          print(f"{name}: {number}")
      print(f"Contacts: {len(book)}")
    `,
    concepts: ['dictionary', 'key-value', 'dict-loop'],
  }),

  build: exercise({
    id: 'l26-build',
    title: ['Price checker', 'בודק מחירים'],
    mode: 'build',
    instructions: [
      p(
        'Build a price checker for a small shop. Keep the price list from the starter code. Ask for three product names, one per line (any prompt text). For each one print `apple costs 2` if the product is in the price list, or `We do not sell banana` if it is not. Keep a running total of the prices that were found and print `Total: 6` at the end. For the inputs apple, milk and banana the output is:',
        'בנו בודק מחירים לחנות קטנה. השאירו את המחירון מקוד ההתחלה. בקשו שלושה שמות של מוצרים, אחד בכל שורה (טקסט הבקשה חופשי). לכל מוצר הדפיסו `apple costs 2` אם הוא נמצא במחירון, או `We do not sell banana` אם לא. שמרו סכום מצטבר של המחירים שנמצאו והדפיסו `Total: 6` בסוף. עבור הקלטים apple, milk ו-banana הפלט הוא:',
      ),
      code('apple costs 2\nmilk costs 4\nWe do not sell banana\nTotal: 6', { lang: 'text', runnable: false }),
    ],
    starterCode: py`
      prices = {"apple": 2, "bread": 5, "milk": 4}
      total = 0

      # ask for three products, one per line
      # print "X costs N" or "We do not sell X", and add found prices to total

      # print the total
    `,
    sampleStdin: ['apple', 'milk', 'banana'],
    check: {
      tests: [
        outputTest('apple costs 2\nmilk costs 4\nWe do not sell banana\nTotal: 6', { stdin: ['apple', 'milk', 'banana'] }),
        outputTest('bread costs 5\nbread costs 5\nWe do not sell pear\nTotal: 10', { stdin: ['bread', 'bread', 'pear'] }),
      ],
    },
    hints: [
      ['Repeat three times with `for i in range(3):` and read a product with `input` inside the loop.', 'חזרו שלוש פעמים עם `for i in range(3):` וקראו מוצר בעזרת `input` בתוך הלולאה.'],
      ['`if product in prices:` tells you whether the shop sells it. The price is `prices[product]`.', '`if product in prices:` אומר לכם אם החנות מוכרת אותו. המחיר הוא `prices[product]`.'],
      ['Inside the if, print `f"{product} costs {prices[product]}"` and add the price to `total`; in the else print `f"We do not sell {product}"`.', 'בתוך ה-if הדפיסו `f"{product} costs {prices[product]}"` והוסיפו את המחיר ל-`total`; ב-else הדפיסו `f"We do not sell {product}"`.'],
    ],
    solution: py`
      prices = {"apple": 2, "bread": 5, "milk": 4}
      total = 0

      for i in range(3):
          product = input("Product: ")
          if product in prices:
              print(f"{product} costs {prices[product]}")
              total = total + prices[product]
          else:
              print(f"We do not sell {product}")

      print(f"Total: {total}")
    `,
    concepts: ['dictionary', 'in-operator', 'key-value', 'accumulator'],
  }),

  check: [
    choice(
      'l26-c1',
      ['`d = {"a": 1, "b": 2}`. What is `d["b"]`?', '`d = {"a": 1, "b": 2}`. מה הערך של `d["b"]`?'],
      [
        opt('2', '2', {
          correct: true,
          feedback: ['Right. "b" is a key, and its value is 2.', 'נכון. "b" הוא מפתח, והערך שלו הוא 2.'],
        }),
        opt('1', '1', {
          feedback: ['1 is the value of the key "a". Look up the key "b".', '1 הוא הערך של המפתח "a". חפשו את המפתח "b".'],
        }),
        opt('An error, because dictionaries are read by position', 'שגיאה, כי מילונים נקראים לפי מיקום', {
          feedback: ['Dictionaries are read by key, not by position, and "b" is a key here.', 'מילונים נקראים לפי מפתח, לא לפי מיקום, ו-"b" הוא מפתח כאן.'],
        }),
      ],
      ['key-value'],
    ),
    choice(
      'l26-c2',
      ['`d = {"a": 1}`. What happens when Python runs `print(d["z"])`?', '`d = {"a": 1}`. מה קורה כשפייתון מריץ `print(d["z"])`?'],
      [
        opt('The program stops with `KeyError: \'z\'`', 'התוכנית נעצרת עם `KeyError: \'z\'`', {
          correct: true,
          feedback: ['Yes. Reading a key that is not there stops the program. Use d.get("z", default) or "z" in d when a key might be missing.', 'כן. קריאה של מפתח שלא קיים עוצרת את התוכנית. השתמשו ב-d.get("z", default) או ב-"z" in d כשייתכן שמפתח חסר.'],
        }),
        opt('It prints None', 'מודפס None', {
          feedback: ['d.get("z") without a default would give None, but square brackets stop the program with a KeyError.', 'd.get("z") בלי ברירת מחדל היה נותן None, אבל סוגריים מרובעים עוצרים את התוכנית עם KeyError.'],
        }),
        opt('It adds "z" to the dictionary with an empty value', 'המפתח "z" מתווסף למילון עם ערך ריק', {
          feedback: ['Reading never adds an entry. Only an assignment such as d["z"] = 0 adds one.', 'קריאה אף פעם לא מוסיפה רשומה. רק השמה כמו d["z"] = 0 מוסיפה אחת.'],
        }),
      ],
      ['key-error'],
    ),
    choice(
      'l26-c3',
      ['Which loop gives you each key **and** its value together?', 'איזו לולאה נותנת לכם כל מפתח **וגם** את הערך שלו יחד?'],
      [
        opt('`for k, v in d.items():`', '`for k, v in d.items():`', {
          correct: true,
          feedback: ['Correct. items() hands out key-value pairs, and the two loop variables receive them.', 'נכון. items() מוסר זוגות מפתח-ערך, ושני משתני הלולאה מקבלים אותם.'],
        }),
        opt('`for k in d:`', '`for k in d:`', {
          feedback: ['This gives only the keys. You would need d[k] inside the loop to reach each value.', 'זה נותן רק את המפתחות. הייתם צריכים d[k] בתוך הלולאה כדי להגיע לכל ערך.'],
        }),
        opt('`for k, v in d:`', '`for k, v in d:`', {
          feedback: ['Without items() each round gives only the key, not a pair, so there is no value for v; Python tries to split the key string itself — for keys like these that is an error.', 'בלי items() כל סיבוב נותן רק את המפתח, לא זוג, ולכן אין ערך ל-v; פייתון מנסה לפצל את המחרוזת של המפתח עצמו — עבור מפתחות כמו אלה זו שגיאה.'],
        }),
      ],
      ['dict-loop'],
    ),
  ],

  recap: [
    list([
      ['A dictionary stores `key: value` pairs inside `{}`; you look a value up by its key: `person["age"]`.', 'מילון שומר זוגות `key: value` בתוך `{}`; מחפשים ערך לפי המפתח שלו: `person["age"]`.'],
      ['`d[key] = value` adds a new entry or replaces an existing one; `len(d)` counts the entries.', '`d[key] = value` מוסיף רשומה חדשה או מחליף קיימת; `len(d)` סופר את הרשומות.'],
      ['A missing key stops the program with `KeyError`; `d.get(key, default)` and `key in d` are the safe ways.', 'מפתח חסר עוצר את התוכנית עם `KeyError`; `d.get(key, default)` ו-`key in d` הן הדרכים הבטוחות.'],
      ['`for key in d:` gives the keys; `for key, value in d.items():` gives both.', '`for key in d:` נותן את המפתחות; `for key, value in d.items():` נותן את שניהם.'],
      ['Use a list for similar items in order, and a dictionary for labelled facts.', 'השתמשו ברשימה לפריטים דומים לפי סדר, ובמילון לעובדות עם תוויות.'],
    ]),
    p(
      'Dictionaries are how programs represent "a thing with properties": a user, a product, a settings screen. Most of the data you will meet on the web is shaped exactly like this.',
      'מילונים הם הדרך שבה תוכניות מייצגות "דבר עם תכונות": משתמש, מוצר, מסך הגדרות. רוב הנתונים שתפגשו ברשת בנויים בדיוק כך.',
    ),
  ],
  next: t(
    'Next you will combine the two: lists of dictionaries and dictionaries of lists, to describe a whole class of students or a whole shop.',
    'בשיעור הבא תשלבו בין השניים: רשימות של מילונים ומילונים של רשימות, כדי לתאר כיתה שלמה של תלמידים או חנות שלמה.',
  ),
};
