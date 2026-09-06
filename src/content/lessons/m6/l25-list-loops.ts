import type { Lesson } from '../../schema';
import {
  p,
  h,
  code,
  list,
  callout,
  term,
  viz,
  t,
  opt,
  choice,
  exercise,
  outputTest,
  functionTest,
  requires,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l25-list-loops',
  moduleId: 'm6',
  title: t('Loops and lists: visiting every item', 'לולאות ורשימות: לעבור על כל פריט'),
  tagline: t('Do something with each item, and let Python do the arithmetic.', 'עושים משהו עם כל פריט, ונותנים לפייתון לעשות את החשבון.'),
  estimatedMinutes: 25,
  introduces: ['for-each', 'in-operator', 'list-modify', 'remove-pop', 'sum-min-max', 'sorted'],
  requires: ['list', 'index', 'append', 'for', 'range', 'if', 'accumulator', 'f-string', 'function', 'return'],
  runsInBrowser: true,

  objective: t(
    'Loop over every item of a list, check whether a value is in a list, change and remove items, and use sum, min, max and sorted.',
    'לעבור בלולאה על כל פריט ברשימה, לבדוק אם ערך נמצא ברשימה, לשנות ולהסיר פריטים, ולהשתמש ב-sum, min, max ו-sorted.',
  ),
  prerequisiteCheck: t(
    'You can create a list and read items by index (lesson 24), and you can build a total with an accumulator inside a for loop (lesson 17).',
    'אתם יודעים ליצור רשימה ולקרוא פריטים לפי אינדקס (שיעור 24), ולבנות סכום בעזרת צובר בתוך לולאת for (שיעור 17).',
  ),

  explanation: [
    p(
      'In lesson 17 you repeated something with `for i in range(...)` and counted with `i`. With a list you usually do not care about the numbers — you want the items themselves. Python has a loop for exactly that.',
      'בשיעור 17 חזרתם על פעולה בעזרת `for i in range(...)` וספרתם עם `i`. ברשימה בדרך כלל המספרים לא מעניינים אתכם — אתם רוצים את הפריטים עצמם. לפייתון יש לולאה בדיוק בשביל זה.',
    ),
    term(
      'for item in list:',
      'A **for-each loop** takes the items of a list one at a time, from first to last. Each time round, the loop variable holds the current item — not its index. You choose the variable name; the list comes after `in`.',
      '**לולאת for על רשימה** (for-each loop) לוקחת את פריטי הרשימה אחד-אחד, מהראשון עד האחרון. בכל סיבוב משתנה הלולאה מחזיק את הפריט הנוכחי — לא את האינדקס שלו. אתם בוחרים את שם המשתנה; הרשימה באה אחרי `in`.',
    ),
    code(py`
      colors = ["red", "green", "blue"]
      for color in colors:
          print(color)
    `, { output: 'red\ngreen\nblue' }),
    p(
      'A good habit: name the list in the plural (`colors`) and the loop variable in the singular (`color`). The loop then reads almost like English: "for each color in colors".',
      'הרגל טוב: קראו לרשימה בלשון רבים (`colors`) ולמשתנה הלולאה בלשון יחיד (`color`). כך הלולאה נקראת כמעט כמו משפט באנגלית: "for each color in colors".',
    ),
    h('Is it in the list?', 'האם זה נמצא ברשימה?'),
    term(
      'in',
      'Outside a loop, `in` is a question: `"red" in colors` is `True` if some item equals `"red"`, and `False` otherwise. It is the same word as in the for loop, but here it produces a True/False value that you can use in an `if`.',
      'מחוץ ללולאה, `in` הוא שאלה: `"red" in colors` הוא `True` אם פריט כלשהו שווה ל-`"red"`, ו-`False` אחרת. זו אותה מילה כמו בלולאת for, אבל כאן היא מייצרת ערך True/False שאפשר להשתמש בו בתוך `if`.',
    ),
    code(py`
      colors = ["red", "green", "blue"]
      print("red" in colors)
      print("pink" in colors)
      if "blue" in colors:
          print("We have blue")
    `, { output: 'True\nFalse\nWe have blue' }),
    h('Changing and removing items', 'שינוי והסרה של פריטים'),
    p(
      'An index can also stand on the left of `=`. `colors[1] = "yellow"` replaces the item at index 1; the list keeps the same length.',
      'אינדקס יכול לעמוד גם משמאל ל-`=`. `colors[1] = "yellow"` מחליף את הפריט שבאינדקס 1; אורך הרשימה לא משתנה.',
    ),
    code(py`
      colors = ["red", "green", "blue"]
      colors[1] = "yellow"
      print(colors)
    `, { output: "['red', 'yellow', 'blue']" }),
    term(
      '.remove() and .pop()',
      '`tasks.remove("piano")` removes the first item that equals the value you name. `tasks.pop()` removes the **last** item and gives it back to you, so you can store it in a variable. Both make the list one item shorter.',
      '`tasks.remove("piano")` מסיר את הפריט הראשון ששווה לערך שציינתם. `tasks.pop()` מסיר את הפריט **האחרון** ומחזיר אותו אליכם, כך שאפשר לשמור אותו במשתנה. שניהם מקצרים את הרשימה בפריט אחד.',
    ),
    code(py`
      tasks = ["homework", "piano", "walk the dog"]
      tasks.remove("piano")
      last = tasks.pop()
      print(tasks)
      print(last)
    `, { output: "['homework']\nwalk the dog" }),
    h('Let Python do the arithmetic', 'תנו לפייתון לעשות את החשבון'),
    term(
      'sum(), min(), max()',
      'Three built-in functions that take a list of numbers: `sum` returns the total, `min` the smallest item and `max` the largest. They do in one call what an accumulator loop does in four lines.',
      'שלוש פונקציות מובנות שמקבלות רשימה של מספרים: `sum` מחזירה את הסכום, `min` את הפריט הקטן ביותר ו-`max` את הגדול ביותר. הן עושות בקריאה אחת מה שלולאת צובר עושה בארבע שורות.',
    ),
    code(py`
      scores = [80, 95, 70]

      total = 0
      for score in scores:
          total = total + score
      print(total)

      print(sum(scores))
      print(min(scores), max(scores))
    `, { output: '245\n245\n70 95' }),
    p(
      'Lines 3–6 are the accumulator pattern from lesson 17, now with a for-each loop. Line 8 gets the same total with `sum`. Both are correct: use the loop when you need to do something extra with each item, and `sum` when you only want the total.',
      'שורות 3–6 הן תבנית הצובר משיעור 17, הפעם עם לולאת for על הרשימה. שורה 8 מקבלת את אותו סכום עם `sum`. שתי הדרכים נכונות: השתמשו בלולאה כשאתם צריכים לעשות משהו נוסף עם כל פריט, וב-`sum` כשאתם רוצים רק את הסכום.',
    ),
    term(
      'sorted()',
      'Returns a **new** list with the same items in order: numbers from small to large, text alphabetically. The original list is not changed.',
      'מחזירה רשימה **חדשה** עם אותם פריטים לפי סדר: מספרים מהקטן לגדול, טקסט לפי סדר האלף-בית. הרשימה המקורית לא משתנה.',
    ),
    code(py`
      scores = [80, 95, 70]
      print(sorted(scores))
      print(scores)
    `, { output: '[70, 80, 95]\n[80, 95, 70]' }),
    h('When you need the position', 'כשצריך את המיקום'),
    p(
      'Sometimes you need the index as well as the item — to print a numbered list, or to change items while looping. `range(len(names))` gives every valid index, from 0 to `len(names) - 1`.',
      'לפעמים צריך גם את האינדקס וגם את הפריט — כדי להדפיס רשימה ממוספרת, או כדי לשנות פריטים תוך כדי הלולאה. `range(len(names))` נותן את כל האינדקסים החוקיים, מ-0 עד `len(names) - 1`.',
    ),
    code(py`
      names = ["Maya", "Omer", "Lia"]
      for i in range(len(names)):
          print(i + 1, names[i])
    `, { output: '1 Maya\n2 Omer\n3 Lia' }),
    callout(
      'tip',
      'Choose the for-each loop when you only need the values: it is shorter and can never go out of range. Choose `for i in range(len(lst))` only when you really need the position.',
      'בחרו בלולאת for על הרשימה כשאתם צריכים רק את הערכים: היא קצרה יותר ולעולם לא חורגת מהטווח. בחרו ב-`for i in range(len(lst))` רק כשאתם באמת צריכים את המיקום.',
    ),
  ],

  simpler: [
    p(
      'Back to the row of boxes. A for-each loop walks along the row and hands you what is inside each box, one after the other. You never have to say the box numbers.',
      'נחזור לשורת הקופסאות. לולאת for על הרשימה הולכת לאורך השורה ומושיטה לכם את מה שבתוך כל קופסה, בזו אחר זו. אתם לא צריכים לומר את מספרי הקופסאות בכלל.',
    ),
    p(
      '`"red" in colors` asks: is there a box with "red" inside? The answer is yes (`True`) or no (`False`).',
      '`"red" in colors` שואל: האם יש קופסה עם "red" בפנים? התשובה היא כן (`True`) או לא (`False`).',
    ),
    p(
      '`colors[1] = "yellow"` swaps what is inside box 1. `remove` takes one box out of the row by its contents; `pop` takes the last box and hands it to you.',
      '`colors[1] = "yellow"` מחליף את מה שבתוך קופסה 1. `remove` מוציא קופסה אחת מהשורה לפי התוכן שלה; `pop` לוקח את הקופסה האחרונה ומושיט אותה לכם.',
    ),
    p(
      '`sum`, `min` and `max` are like a calculator with a "total", a "smallest" and a "largest" button. `sorted` makes a tidy copy of the row in order and leaves the original as it was.',
      '`sum`, `min` ו-`max` הם כמו מחשבון עם כפתורי "סכום", "הכי קטן" ו"הכי גדול". `sorted` מכין עותק מסודר של השורה לפי הסדר ומשאיר את המקור כמו שהיה.',
    ),
  ],

  workedExample: [
    p(
      'Press play under the code and watch `price` take each value in turn while `total` grows.',
      'לחצו על כפתור ההפעלה מתחת לקוד וצפו ב-`price` מקבל כל ערך בתורו בזמן ש-`total` גדל.',
    ),
    viz(py`
      prices = [12, 5, 8]
      total = 0
      for price in prices:
          total = total + price
      print(total)
      print(sum(prices))
      prices[1] = 6
      print(prices)
    `),
    list([
      ['Line 1 creates a list of three prices. Line 2 starts the accumulator `total` at 0.', 'שורה 1 יוצרת רשימה של שלושה מחירים. שורה 2 מתחילה את הצובר `total` מ-0.'],
      ['Lines 3–4: the loop runs three times. `price` is 12, then 5, then 8, and each value is added to `total`.', 'שורות 3–4: הלולאה רצה שלוש פעמים. `price` הוא 12, אחר כך 5, ואז 8, וכל ערך מתווסף ל-`total`.'],
      ['Line 5 prints 25. Line 6 prints the same total, computed by `sum` in one step.', 'שורה 5 מדפיסה 25. שורה 6 מדפיסה את אותו סכום, שחושב על ידי `sum` בצעד אחד.'],
      ['Line 7 replaces the item at index 1 (the 5) with 6, and line 8 prints the changed list.', 'שורה 7 מחליפה את הפריט באינדקס 1 (ה-5) ב-6, ושורה 8 מדפיסה את הרשימה ששונתה.'],
    ], true),
    code(py`
      25
      25
      [12, 6, 8]
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('Counting with a condition', 'ספירה עם תנאי'),
      code(py`
        scores = [92, 78, 95, 60, 88]
        count = 0
        for score in scores:
            if score >= 90:
                count = count + 1
        print(f"{count} scores of 90 or more")
      `, { output: '2 scores of 90 or more' }),
      p(
        '`sum` cannot count only the high scores, so here the loop earns its place: it looks at every score and counts the ones that pass the test.',
        '`sum` לא יכול לספור רק את הציונים הגבוהים, ולכן כאן הלולאה מוכיחה את עצמה: היא מסתכלת על כל ציון וסופרת את אלה שעוברים את התנאי.',
      ),
    ],
    [
      h('A shopping list that changes', 'רשימת קניות שמשתנה'),
      code(py`
        cart = ["milk", "bread"]
        cart.append("eggs")
        if "bread" in cart:
            cart.remove("bread")
        print(cart)
        print(sorted(cart))
      `, { output: "['milk', 'eggs']\n['eggs', 'milk']" }),
      p(
        'Checking with `in` before `remove` is a good habit: removing a value that is not in the list is an error. `sorted` prints the items alphabetically without touching `cart`.',
        'בדיקה עם `in` לפני `remove` היא הרגל טוב: הסרה של ערך שלא נמצא ברשימה היא שגיאה. `sorted` מדפיס את הפריטים לפי סדר האלף-בית בלי לגעת ב-`cart`.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l25-hard',
    title: ['Second largest', 'השני בגודלו'],
    mode: 'write',
    instructions: [
      p(
        'Write a function `second_largest(numbers)` that returns the second largest number in a list of at least two numbers. For `[5, 1, 9, 7]` it returns `7`. Hint: `sorted` puts the largest number at the end — where is the second largest?',
        'כתבו פונקציה `second_largest(numbers)` שמחזירה את המספר השני בגודלו ברשימה של שני מספרים לפחות. עבור `[5, 1, 9, 7]` היא מחזירה `7`. רמז: `sorted` שם את המספר הגדול ביותר בסוף — איפה נמצא השני בגודלו?',
      ),
    ],
    starterCode: py`
      def second_largest(numbers):
          # sort the numbers, then pick the right one
          return max(numbers)


      print(second_largest([5, 1, 9, 7]))
    `,
    check: {
      tests: [
        functionTest('second_largest([5, 1, 9, 7])', '7'),
        functionTest('second_largest([3, 3, 1])', '3'),
        functionTest('second_largest([10, 20])', '10'),
      ],
    },
    hints: [
      ['`sorted(numbers)` gives the numbers from small to large. The largest is last; the second largest is just before it.', '`sorted(numbers)` נותן את המספרים מהקטן לגדול. הגדול ביותר אחרון; השני בגודלו נמצא ממש לפניו.'],
      ['Store the sorted list in a variable, then use a negative index: `-1` is the last item, `-2` the one before it.', 'שמרו את הרשימה הממוינת במשתנה, ואז השתמשו באינדקס שלילי: `-1` הוא הפריט האחרון, `-2` זה שלפניו.'],
      ['`in_order = sorted(numbers)` and then `return in_order[-2]`.', '`in_order = sorted(numbers)` ואז `return in_order[-2]`.'],
    ],
    solution: py`
      def second_largest(numbers):
          in_order = sorted(numbers)
          return in_order[-2]


      print(second_largest([5, 1, 9, 7]))
    `,
    concepts: ['sorted', 'negative-index', 'return'],
  }),

  predict: {
    code: py`
      nums = [3, 8, 1]
      nums.append(4)
      nums[0] = 10
      print(sum(nums))
      print(sorted(nums))
      print(8 in nums)
    `,
    prompt: t('What does this program print? Write all three lines.', 'מה התוכנית הזאת תדפיס? כתבו את כל שלוש השורות.'),
    answer: '23\n[1, 4, 8, 10]\nTrue',
    explanation: t(
      'After append the list is [3, 8, 1, 4]; then index 0 becomes 10, giving [10, 8, 1, 4]. The sum is 23. sorted returns a new ordered list, and 8 is still in the list, so the last line is True.',
      'אחרי `append` הרשימה היא [3, 8, 1, 4]; אחר כך אינדקס 0 הופך ל-10, ומתקבל [10, 8, 1, 4]. הסכום הוא 23. `sorted` מחזיר רשימה חדשה וממוינת, ו-8 עדיין נמצא ברשימה, ולכן השורה האחרונה היא True.',
    ),
  },

  exercise: exercise({
    id: 'l25-ex',
    title: ['A crash in the total', 'קריסה בחישוב הסכום'],
    mode: 'fix',
    instructions: [
      p(
        'This program should print the total of the scores, the lowest score and the sorted list, but it crashes with an IndexError. Read the error message, find the line, and fix it. The output should be:',
        'התוכנית הזאת אמורה להדפיס את סכום הציונים, את הציון הנמוך ביותר ואת הרשימה הממוינת, אבל היא קורסת עם IndexError. קראו את הודעת השגיאה, מצאו את השורה ותקנו אותה. הפלט צריך להיות:',
      ),
      code('Total: 310\nLowest: 65\nSorted: [65, 70, 85, 90]', { lang: 'text', runnable: false }),
    ],
    starterCode: py`
      scores = [70, 85, 90, 65]

      total = 0
      for score in scores:
          total = total + scores[score]

      print(f"Total: {total}")
      print(f"Lowest: {min(scores)}")
      print(f"Sorted: {sorted(scores)}")
    `,
    check: {
      tests: [outputTest('Total: 310\nLowest: 65\nSorted: [65, 70, 85, 90]')],
      requires: [requires('\\bfor\\b', 'Keep the for loop and fix the line inside it.', 'השאירו את לולאת ה-for ותקנו את השורה שבתוכה.')],
    },
    hints: [
      ['The error says `list index out of range`. Which line uses square brackets with an index?', 'השגיאה אומרת `list index out of range`. איזו שורה משתמשת בסוגריים מרובעים עם אינדקס?'],
      ['In a for-each loop, `score` already **is** the item: 70, then 85, and so on. `scores[70]` asks for item number 70, which does not exist.', 'בלולאת for על הרשימה, `score` כבר **הוא** הפריט: 70, אחר כך 85, וכן הלאה. `scores[70]` מבקש את פריט מספר 70, שלא קיים.'],
      ['Change the line inside the loop to `total = total + score`.', 'שנו את השורה שבתוך הלולאה ל-`total = total + score`.'],
    ],
    solution: py`
      scores = [70, 85, 90, 65]

      total = 0
      for score in scores:
          total = total + score

      print(f"Total: {total}")
      print(f"Lowest: {min(scores)}")
      print(f"Sorted: {sorted(scores)}")
    `,
    concepts: ['for-each', 'accumulator', 'sum-min-max', 'sorted'],
  }),

  build: exercise({
    id: 'l25-build',
    title: ['Score report', 'דוח ציונים'],
    mode: 'build',
    instructions: [
      p(
        'Build a small score report. Ask for 5 scores, one per line (any prompt text), turn each one into an `int` and append it to a list. Then print five lines exactly in this shape:',
        'בנו דוח ציונים קטן. בקשו 5 ציונים, אחד בכל שורה (טקסט הבקשה חופשי), הפכו כל אחד ל-`int` והוסיפו אותו לרשימה. אחר כך הדפיסו חמש שורות בדיוק בצורה הזאת:',
      ),
      code('Total: 419\nLowest: 65\nHighest: 95\nSorted: [65, 79, 88, 92, 95]\nAbove 80: 3', { lang: 'text', runnable: false }),
      p(
        'This is the output for the scores 88, 92, 79, 65, 95. "Above 80" counts the scores that are greater than 80 — you will need a loop with an `if` for that one.',
        'זה הפלט עבור הציונים 88, 92, 79, 65, 95. "Above 80" סופר את הציונים הגדולים מ-80 — בשביל השורה הזאת תצטרכו לולאה עם `if`.',
      ),
    ],
    starterCode: py`
      scores = []

      # 1. ask for 5 scores, one per line, and append each one (as int) to scores

      # 2. count how many scores are above 80

      # 3. print Total / Lowest / Highest / Sorted / Above 80
    `,
    sampleStdin: ['88', '92', '79', '65', '95'],
    check: {
      tests: [
        outputTest('Total: 419\nLowest: 65\nHighest: 95\nSorted: [65, 79, 88, 92, 95]\nAbove 80: 3', { stdin: ['88', '92', '79', '65', '95'] }),
        outputTest('Total: 342\nLowest: 30\nHighest: 100\nSorted: [30, 50, 81, 81, 100]\nAbove 80: 3', { stdin: ['50', '81', '81', '100', '30'] }),
      ],
      requires: [requires('\\.append\\(', 'Build the list with .append() inside a loop.', 'בנו את הרשימה בעזרת `.append()` בתוך לולאה.')],
    },
    hints: [
      ['Use `for i in range(5):` and inside it `scores.append(int(input("Score: ")))`.', 'השתמשו ב-`for i in range(5):` ובתוכה `scores.append(int(input("Score: ")))`.'],
      ['`sum(scores)`, `min(scores)`, `max(scores)` and `sorted(scores)` give four of the five lines directly.', '`sum(scores)`, `min(scores)`, `max(scores)` ו-`sorted(scores)` נותנים ארבע מחמש השורות ישירות.'],
      ['For the last line, start `above = 0`, loop `for score in scores:` and add 1 when `score > 80`.', 'לשורה האחרונה, התחילו עם `above = 0`, עברו בלולאה `for score in scores:` והוסיפו 1 כאשר `score > 80`.'],
    ],
    solution: py`
      scores = []
      for i in range(5):
          score = int(input("Score: "))
          scores.append(score)

      above = 0
      for score in scores:
          if score > 80:
              above = above + 1

      print(f"Total: {sum(scores)}")
      print(f"Lowest: {min(scores)}")
      print(f"Highest: {max(scores)}")
      print(f"Sorted: {sorted(scores)}")
      print(f"Above 80: {above}")
    `,
    concepts: ['for-each', 'append', 'sum-min-max', 'sorted', 'accumulator'],
  }),

  check: [
    choice(
      'l25-c1',
      ['In `for x in [3, 5, 7]:` what is `x` the second time round the loop?', 'בלולאה `for x in [3, 5, 7]:` מה הערך של `x` בסיבוב השני?'],
      [
        opt('5', '5', {
          correct: true,
          feedback: ['Right. A for-each loop hands you the items themselves: 3, then 5, then 7.', 'נכון. לולאת for על רשימה מושיטה לכם את הפריטים עצמם: 3, אחר כך 5, ואז 7.'],
        }),
        opt('1', '1', {
          feedback: ['1 would be the index of the second item. This loop gives the items, not their indexes.', '1 היה האינדקס של הפריט השני. הלולאה הזאת נותנת את הפריטים, לא את האינדקסים שלהם.'],
        }),
        opt('7', '7', {
          feedback: ['7 comes on the third time round. The second item is 5.', '7 מגיע בסיבוב השלישי. הפריט השני הוא 5.'],
        }),
      ],
      ['for-each'],
    ),
    choice(
      'l25-c2',
      ['`nums = [4, 9, 2]`, then `print(sorted(nums))` and `print(nums)`. What are the two printed lines?', '`nums = [4, 9, 2]`, ואז `print(sorted(nums))` ו-`print(nums)`. מהן שתי השורות שיודפסו?'],
      [
        opt('`[2, 4, 9]` and then `[4, 9, 2]`', '`[2, 4, 9]` ואחר כך `[4, 9, 2]`', {
          correct: true,
          feedback: ['Yes. sorted returns a new ordered list and leaves nums as it was.', 'כן. sorted מחזיר רשימה חדשה וממוינת ומשאיר את nums כמו שהיה.'],
        }),
        opt('`[2, 4, 9]` and then `[2, 4, 9]`', '`[2, 4, 9]` ואחר כך `[2, 4, 9]`', {
          feedback: ['sorted does not change the original list — it returns a sorted copy.', 'sorted לא משנה את הרשימה המקורית — הוא מחזיר עותק ממוין.'],
        }),
        opt('`[4, 9, 2]` and then `[4, 9, 2]`', '`[4, 9, 2]` ואחר כך `[4, 9, 2]`', {
          feedback: ['The first print shows the sorted copy, so it is in order: [2, 4, 9].', 'ההדפסה הראשונה מציגה את העותק הממוין, ולכן הוא מסודר: [2, 4, 9].'],
        }),
      ],
      ['sorted'],
    ),
    choice(
      'l25-c3',
      ['`letters = ["a", "b", "c"]`. Which line removes `"b"` from the list?', '`letters = ["a", "b", "c"]`. איזו שורה מסירה את `"b"` מהרשימה?'],
      [
        opt('`letters.remove("b")`', '`letters.remove("b")`', {
          correct: true,
          feedback: ['Correct. remove takes the value you want gone.', 'נכון. remove מקבל את הערך שאתם רוצים להסיר.'],
        }),
        opt('`letters.pop("b")`', '`letters.pop("b")`', {
          feedback: ['pop() removes the last item; it does not take a value to search for.', 'pop() מסיר את הפריט האחרון; הוא לא מקבל ערך לחיפוש.'],
        }),
        opt('`letters.remove(1)`', '`letters.remove(1)`', {
          feedback: ['remove looks for the value 1, which is not in the list, so this is an error. It takes a value, not an index.', 'remove מחפש את הערך 1, שלא נמצא ברשימה, ולכן זו שגיאה. הוא מקבל ערך, לא אינדקס.'],
        }),
      ],
      ['remove-pop'],
    ),
  ],

  recap: [
    list([
      ['`for item in lst:` visits every item; the loop variable holds the item, not its index.', '`for item in lst:` עובר על כל פריט; משתנה הלולאה מחזיק את הפריט, לא את האינדקס שלו.'],
      ['`value in lst` asks whether the value is in the list — True or False.', '`value in lst` שואל אם הערך נמצא ברשימה — True או False.'],
      ['`lst[i] = new` replaces an item; `lst.remove(value)` and `lst.pop()` remove items.', '`lst[i] = new` מחליף פריט; `lst.remove(value)` ו-`lst.pop()` מסירים פריטים.'],
      ['`sum`, `min` and `max` do the arithmetic of a whole list in one call; `sorted` returns an ordered copy.', '`sum`, `min` ו-`max` עושים את החשבון של רשימה שלמה בקריאה אחת; `sorted` מחזיר עותק ממוין.'],
      ['Use `for i in range(len(lst))` when you need the position as well.', 'השתמשו ב-`for i in range(len(lst))` כשאתם צריכים גם את המיקום.'],
    ]),
    p(
      'Loops and lists together let you process any amount of data with the same few lines: the program that handles 3 scores handles 3,000 without change.',
      'לולאות ורשימות יחד מאפשרות לכם לעבד כל כמות של נתונים עם אותן כמה שורות: התוכנית שמטפלת ב-3 ציונים מטפלת גם ב-3,000 בלי שום שינוי.',
    ),
  ],
  next: t(
    'Next comes a second kind of collection, the dictionary, where you look values up by a name instead of a position.',
    'בשיעור הבא מגיע סוג שני של אוסף, המילון, שבו מחפשים ערכים לפי שם במקום לפי מיקום.',
  ),
};
