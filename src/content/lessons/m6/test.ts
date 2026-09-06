import type { Assessment } from '../../schema';
import { p, code, t, opt, choice, predictQ, codeQ, functionTest, py } from '../../authoring';

export const test: Assessment = {
  id: 'm6-test',
  kind: 'module-test',
  moduleId: 'm6',
  title: t('Module 6 test: lists and dictionaries', 'מבחן מודול 6: רשימות ומילונים'),
  description: [
    p(
      'This test covers lists, indexes and append, loops over lists, dictionaries, nested data, and split and join. It mixes questions, output predictions and three small functions. You may use one hint per coding task.',
      'המבחן הזה מכסה רשימות, אינדקסים ו-`append`, לולאות על רשימות, מילונים, נתונים מקוננים, ו-`split` ו-`join`. הוא משלב שאלות, חיזוי פלט ושלוש פונקציות קטנות. מותר להשתמש ברמז אחד לכל משימת קוד.',
    ),
  ],
  passScore: 0.7,
  hintsAllowed: 1,
  estimatedMinutes: 25,
  pools: [
    /* ---------------------------------------------------- 1. lists & indexes (choice) */
    {
      variants: [
        choice(
          'm6-t-q1-a',
          ['`names = ["Ana", "Ben", "Cal"]`. What is `names[1]`?', '`names = ["Ana", "Ben", "Cal"]`. מה הערך של `names[1]`?'],
          [
            opt('`"Ben"`', '`"Ben"`', {
              correct: true,
              feedback: ['Right. Indexes start at 0, so index 1 is the second item.', 'נכון. האינדקסים מתחילים מ-0, ולכן אינדקס 1 הוא הפריט השני.'],
            }),
            opt('`"Ana"`', '`"Ana"`', {
              feedback: ['"Ana" is at index 0. Counting starts at 0, not 1.', '"Ana" נמצא באינדקס 0. הספירה מתחילה מ-0, לא מ-1.'],
            }),
            opt('`"Cal"`', '`"Cal"`', {
              feedback: ['"Cal" is the third item, at index 2.', '"Cal" הוא הפריט השלישי, באינדקס 2.'],
            }),
          ],
          ['index', 'list'],
        ),
        choice(
          'm6-t-q1-b',
          ['`nums = [10, 20, 30]`. What is `len(nums)`, and what is the biggest index you may use?', '`nums = [10, 20, 30]`. מה הערך של `len(nums)`, ומהו האינדקס הגדול ביותר שמותר להשתמש בו?'],
          [
            opt('3 and 2', '3 ו-2', {
              correct: true,
              feedback: ['Correct. Three items have the indexes 0, 1 and 2; the last index is always len - 1.', 'נכון. לשלושה פריטים יש האינדקסים 0, 1 ו-2; האינדקס האחרון הוא תמיד len - 1.'],
            }),
            opt('3 and 3', '3 ו-3', {
              feedback: ['nums[3] would be a fourth item, which does not exist — an IndexError. The last index is 2.', 'nums[3] היה פריט רביעי, שלא קיים — שגיאת IndexError. האינדקס האחרון הוא 2.'],
            }),
            opt('2 and 2', '2 ו-2', {
              feedback: ['len counts the items, and there are three. Only the indexes start at 0.', 'len סופר את הפריטים, ויש שלושה. רק האינדקסים מתחילים מ-0.'],
            }),
          ],
          ['index', 'index-error'],
        ),
      ],
    },
    /* ---------------------------------------------------- 2. append & negative index (predict) */
    {
      variants: [
        predictQ(
          'm6-t-q2-a',
          py`
            items = ["pen"]
            items.append("cup")
            items.append("key")
            print(items[-1])
            print(len(items))
            print(items)
          `,
          "key\n3\n['pen', 'cup', 'key']",
          ['Two appends make three items. [-1] is the last one, "key". Printing the list shows brackets and single quotes.', 'שני `append` יוצרים שלושה פריטים. `[-1]` הוא האחרון, "key". הדפסת הרשימה מציגה סוגריים ומירכאות בודדות.'],
          ['append', 'negative-index', 'list'],
          { prompt: ['What does this program print? Write all three lines.', 'מה התוכנית הזאת תדפיס? כתבו את כל שלוש השורות.'] },
        ),
        predictQ(
          'm6-t-q2-b',
          py`
            nums = [5, 9]
            nums.append(2)
            print(nums[0] + nums[-1])
            print(nums[1])
            print(len(nums) - 1)
          `,
          '7\n9\n2',
          ['After append the list is [5, 9, 2]. 5 + 2 is 7; index 1 holds 9; the list has 3 items so len - 1 is 2 — the last valid index.', 'אחרי `append` הרשימה היא [5, 9, 2]. 5 + 2 הוא 7; אינדקס 1 מחזיק 9; ברשימה 3 פריטים ולכן len - 1 הוא 2 — האינדקס החוקי האחרון.'],
          ['append', 'negative-index', 'index'],
          { prompt: ['What does this program print? Write all three lines.', 'מה התוכנית הזאת תדפיס? כתבו את כל שלוש השורות.'] },
        ),
      ],
    },
    /* ---------------------------------------------------- 3. for-each & sorted (choice) */
    {
      variants: [
        choice(
          'm6-t-q3-a',
          ['In `for score in scores:` what does `score` hold each time round the loop?', 'בלולאה `for score in scores:` מה מחזיק `score` בכל סיבוב?'],
          [
            opt('The current item of the list', 'הפריט הנוכחי של הרשימה', {
              correct: true,
              feedback: ['Right. A for-each loop hands you the items themselves, first to last.', 'נכון. לולאת for על רשימה מושיטה לכם את הפריטים עצמם, מהראשון עד האחרון.'],
            }),
            opt('The index of the current item', 'האינדקס של הפריט הנוכחי', {
              feedback: ['For indexes you would write for i in range(len(scores)). This loop gives the items.', 'לאינדקסים הייתם כותבים for i in range(len(scores)). הלולאה הזאת נותנת את הפריטים.'],
            }),
            opt('The whole list', 'הרשימה כולה', {
              feedback: ['The list is scores; the loop variable takes one item from it at a time.', 'הרשימה היא scores; משתנה הלולאה לוקח ממנה פריט אחד בכל פעם.'],
            }),
          ],
          ['for-each'],
        ),
        choice(
          'm6-t-q3-b',
          ['`nums = [3, 1, 2]` and then `ordered = sorted(nums)`. What is `nums` afterwards?', '`nums = [3, 1, 2]` ואז `ordered = sorted(nums)`. מה הערך של `nums` אחר כך?'],
          [
            opt('`[3, 1, 2]`', '`[3, 1, 2]`', {
              correct: true,
              feedback: ['Correct. sorted returns a new ordered list and leaves the original untouched.', 'נכון. sorted מחזיר רשימה חדשה וממוינת ומשאיר את המקור ללא שינוי.'],
            }),
            opt('`[1, 2, 3]`', '`[1, 2, 3]`', {
              feedback: ['That is ordered, the new list. nums itself is not changed by sorted.', 'זה ordered, הרשימה החדשה. nums עצמו לא משתנה על ידי sorted.'],
            }),
            opt('An error, because sorted needs numbers in order', 'שגיאה, כי sorted צריך מספרים לפי סדר', {
              feedback: ['sorted works on any list of numbers; putting them in order is exactly its job.', 'sorted עובד על כל רשימה של מספרים; לסדר אותם זו בדיוק העבודה שלו.'],
            }),
          ],
          ['sorted'],
        ),
      ],
    },
    /* ---------------------------------------------------- 4. list changes & built-ins (predict) */
    {
      variants: [
        predictQ(
          'm6-t-q4-a',
          py`
            scores = [4, 9, 2]
            scores[2] = 7
            scores.append(1)
            print(sum(scores))
            print(max(scores), min(scores))
            print(sorted(scores))
          `,
          '21\n9 1\n[1, 4, 7, 9]',
          ['Index 2 becomes 7 and then 1 is appended: [4, 9, 7, 1]. The sum is 21, the largest 9, the smallest 1, and sorted gives [1, 4, 7, 9].', 'אינדקס 2 הופך ל-7 ואז 1 מתווסף: [4, 9, 7, 1]. הסכום הוא 21, הגדול ביותר 9, הקטן ביותר 1, ו-sorted נותן [1, 4, 7, 9].'],
          ['list-modify', 'sum-min-max', 'sorted'],
          { prompt: ['What does this program print? Write all three lines.', 'מה התוכנית הזאת תדפיס? כתבו את כל שלוש השורות.'] },
        ),
        predictQ(
          'm6-t-q4-b',
          py`
            tasks = ["a", "b", "c", "d"]
            tasks.remove("b")
            last = tasks.pop()
            print(tasks)
            print(last)
            print("d" in tasks)
          `,
          "['a', 'c']\nd\nFalse",
          ['remove takes out "b"; pop takes out the last item "d" and stores it in last. What is left is ["a", "c"], so "d" in tasks is False.', 'remove מוציא את "b"; pop מוציא את הפריט האחרון "d" ושומר אותו ב-last. מה שנשאר הוא ["a", "c"], ולכן "d" in tasks הוא False.'],
          ['remove-pop', 'in-operator'],
          { prompt: ['What does this program print? Write all three lines.', 'מה התוכנית הזאת תדפיס? כתבו את כל שלוש השורות.'] },
        ),
      ],
    },
    /* ---------------------------------------------------- 5. dictionaries: KeyError, get, in (choice) */
    {
      variants: [
        choice(
          'm6-t-q5-a',
          ['`ages = {"Dana": 12}`. Which of these lines runs without stopping the program?', '`ages = {"Dana": 12}`. איזו מהשורות האלה רצה בלי לעצור את התוכנית?'],
          [
            opt('`print(ages.get("Omer", 0))`', '`print(ages.get("Omer", 0))`', {
              correct: true,
              feedback: ['Right. "Omer" is missing, so get returns the default 0 and prints it.', 'נכון. "Omer" חסר, ולכן get מחזיר את ברירת המחדל 0 ומדפיס אותה.'],
            }),
            opt('`print(ages["Omer"])`', '`print(ages["Omer"])`', {
              feedback: ['Square brackets with a missing key stop the program with a KeyError.', 'סוגריים מרובעים עם מפתח חסר עוצרים את התוכנית עם KeyError.'],
            }),
            opt('`print(ages[0])`', '`print(ages[0])`', {
              feedback: ['Dictionaries are not read by position. 0 is not a key here, so this is a KeyError.', 'מילונים לא נקראים לפי מיקום. 0 אינו מפתח כאן, ולכן זו שגיאת KeyError.'],
            }),
          ],
          ['key-error', 'dict-get'],
        ),
        choice(
          'm6-t-q5-b',
          ['`person = {"name": "Dana", "age": 12}`. What does `"age" in person` check?', '`person = {"name": "Dana", "age": 12}`. מה בודק `"age" in person`?'],
          [
            opt('Whether "age" is one of the keys — here True', 'האם "age" הוא אחד המפתחות — כאן True', {
              correct: true,
              feedback: ['Correct. in looks at the keys of a dictionary.', 'נכון. in מסתכל על המפתחות של מילון.'],
            }),
            opt('Whether "age" is one of the values — here False', 'האם "age" הוא אחד הערכים — כאן False', {
              feedback: ['in checks keys, not values. "age" is a key, so the result is True.', 'in בודק מפתחות, לא ערכים. "age" הוא מפתח, ולכן התוצאה היא True.'],
            }),
            opt('Whether the value of "age" is bigger than 0', 'האם הערך של "age" גדול מ-0', {
              feedback: ['in never looks at the size of a value; it only asks whether the key exists.', 'in אף פעם לא מסתכל על גודל של ערך; הוא רק שואל אם המפתח קיים.'],
            }),
          ],
          ['in-operator', 'dictionary'],
        ),
      ],
    },
    /* ---------------------------------------------------- 6. dictionary loops (predict) */
    {
      variants: [
        predictQ(
          'm6-t-q6-a',
          py`
            stock = {"pen": 3, "cup": 0}
            stock["cup"] = 5
            stock["key"] = 1
            for item, amount in stock.items():
                print(item, amount)
            print(len(stock))
          `,
          'pen 3\ncup 5\nkey 1\n3',
          ['"cup" is changed to 5 (no new entry) and "key" is added. items() gives each key with its value in order, and len counts three entries.', '"cup" משתנה ל-5 (בלי רשומה חדשה) ו-"key" מתווסף. items() נותן כל מפתח עם הערך שלו לפי הסדר, ו-len סופר שלוש רשומות.'],
          ['dict-loop', 'key-value'],
          { prompt: ['What does this program print? Write all four lines.', 'מה התוכנית הזאת תדפיס? כתבו את כל ארבע השורות.'] },
        ),
        predictQ(
          'm6-t-q6-b',
          py`
            count = {}
            for word in ["a", "b", "a", "a"]:
                count[word] = count.get(word, 0) + 1
            print(count)
            print(count["a"])
            print("c" in count)
          `,
          "{'a': 3, 'b': 1}\n3\nFalse",
          ['get(word, 0) starts every word at 0 and adds 1 on each appearance: "a" three times, "b" once. "c" was never added, so in gives False.', 'get(word, 0) מתחיל כל מילה מ-0 ומוסיף 1 בכל הופעה: "a" שלוש פעמים, "b" פעם אחת. "c" מעולם לא נוסף, ולכן in נותן False.'],
          ['dict-get', 'dictionary', 'in-operator'],
          { prompt: ['What does this program print? Write all three lines.', 'מה התוכנית הזאת תדפיס? כתבו את כל שלוש השורות.'] },
        ),
      ],
    },
    /* ---------------------------------------------------- 7. nested data & choosing (choice) */
    {
      variants: [
        choice(
          'm6-t-q7-a',
          ['`people = [{"name": "Dana", "age": 12}, {"name": "Omer", "age": 15}]`. What is `people[1]["age"]`?', '`people = [{"name": "Dana", "age": 12}, {"name": "Omer", "age": 15}]`. מה הערך של `people[1]["age"]`?'],
          [
            opt('15', '15', {
              correct: true,
              feedback: ['Right. people[1] is the second dictionary (Omer), and its "age" is 15.', 'נכון. people[1] הוא המילון השני (Omer), וה-"age" שלו הוא 15.'],
            }),
            opt('12', '12', {
              feedback: ['12 belongs to people[0]. Index 1 is the second record.', '12 שייך ל-people[0]. אינדקס 1 הוא הרשומה השנייה.'],
            }),
            opt('`{"name": "Omer", "age": 15}`', '`{"name": "Omer", "age": 15}`', {
              feedback: ['That is people[1] alone. The ["age"] afterwards picks one value out of that dictionary.', 'זה people[1] לבדו. ה-["age"] שאחריו בוחר ערך אחד מתוך המילון הזה.'],
            }),
          ],
          ['nested-data'],
        ),
        choice(
          'm6-t-q7-b',
          ['You want to store one student: their name, their class, and their three test scores. Which structure fits best?', 'אתם רוצים לשמור תלמיד אחד: השם שלו, הכיתה שלו ושלושת ציוני המבחנים שלו. איזה מבנה מתאים הכי טוב?'],
          [
            opt('A dictionary with the keys "name", "class" and "scores", where "scores" holds a list', 'מילון עם המפתחות "name", "class" ו-"scores", כאשר "scores" מחזיק רשימה', {
              correct: true,
              feedback: ['Yes: labelled facts about one thing, and the fact that is a collection of similar values is a list inside it.', 'כן: עובדות עם תוויות על דבר אחד, והעובדה שהיא אוסף של ערכים דומים היא רשימה בתוכו.'],
            }),
            opt('One list with five values: name, class and the three scores', 'רשימה אחת עם חמישה ערכים: שם, כיתה ושלושת הציונים', {
              feedback: ['It works, but nothing says what each position means, and the scores are mixed with other facts. Labels are clearer.', 'זה עובד, אבל שום דבר לא אומר מה כל מיקום מייצג, והציונים מעורבבים עם עובדות אחרות. תוויות ברורות יותר.'],
            }),
            opt('Five separate variables', 'חמישה משתנים נפרדים', {
              feedback: ['Fine for one student, but you cannot pass them around or loop over them as one thing. A dictionary keeps the facts together.', 'בסדר לתלמיד אחד, אבל אי אפשר להעביר אותם או לעבור עליהם בלולאה כדבר אחד. מילון שומר את העובדות יחד.'],
            }),
          ],
          ['choosing-structures', 'nested-data'],
        ),
      ],
    },
    /* ---------------------------------------------------- 8. code: counting in a list */
    {
      variants: [
        codeQ({
          id: 'm6-t-q8-a',
          title: ['Count the even numbers', 'ספירת המספרים הזוגיים'],
          mode: 'write',
          instructions: [
            p(
              'Write a function `count_even(numbers)` that returns how many items of the list are even. A number is even when `number % 2 == 0`. For an empty list return 0.',
              'כתבו פונקציה `count_even(numbers)` שמחזירה כמה מהפריטים ברשימה הם זוגיים. מספר הוא זוגי כאשר `number % 2 == 0`. עבור רשימה ריקה החזירו 0.',
            ),
            code('count_even([1, 2, 3, 4])  # 2\ncount_even([7, 9])        # 0', { lang: 'text', runnable: false }),
          ],
          starterCode: py`
            def count_even(numbers):
                # loop over the numbers and count the even ones
                return 0
          `,
          check: {
            tests: [
              functionTest('count_even([1, 2, 3, 4])', '2'),
              functionTest('count_even([7, 9])', '0'),
              functionTest('count_even([])', '0'),
              functionTest('count_even([2, 4, 6, 8, 10])', '5'),
            ],
          },
          hints: [
            ['Start a counter at 0, loop with `for number in numbers:` and add 1 when the number is even.', 'התחילו מונה מ-0, עברו בלולאה `for number in numbers:` והוסיפו 1 כשהמספר זוגי.'],
            ['`if number % 2 == 0:` is the test for even. Return the counter after the loop, not inside it.', '`if number % 2 == 0:` הוא הבדיקה לזוגיות. החזירו את המונה אחרי הלולאה, לא בתוכה.'],
            ['`count = 0` / `for number in numbers:` / `if number % 2 == 0: count = count + 1` / `return count`.', '`count = 0` / `for number in numbers:` / `if number % 2 == 0: count = count + 1` / `return count`.'],
          ],
          solution: py`
            def count_even(numbers):
                count = 0
                for number in numbers:
                    if number % 2 == 0:
                        count = count + 1
                return count
          `,
          concepts: ['for-each', 'accumulator', 'return', 'list'],
        }),
        codeQ({
          id: 'm6-t-q8-b',
          title: ['Count above a limit', 'ספירה מעל גבול'],
          mode: 'write',
          instructions: [
            p(
              'Write a function `count_above(numbers, limit)` that returns how many items of the list are greater than `limit`. For an empty list return 0.',
              'כתבו פונקציה `count_above(numbers, limit)` שמחזירה כמה מהפריטים ברשימה גדולים מ-`limit`. עבור רשימה ריקה החזירו 0.',
            ),
            code('count_above([5, 10, 15], 7)  # 2\ncount_above([8, 8, 9], 8)    # 1', { lang: 'text', runnable: false }),
          ],
          starterCode: py`
            def count_above(numbers, limit):
                # loop over the numbers and count the ones greater than limit
                return 0
          `,
          check: {
            tests: [
              functionTest('count_above([5, 10, 15], 7)', '2'),
              functionTest('count_above([8, 8, 9], 8)', '1'),
              functionTest('count_above([1, 2], 5)', '0'),
              functionTest('count_above([], 3)', '0'),
            ],
          },
          hints: [
            ['Start a counter at 0 and loop with `for number in numbers:`.', 'התחילו מונה מ-0 ועברו בלולאה `for number in numbers:`.'],
            ['Inside the loop, `if number > limit:` — greater than, not greater or equal.', 'בתוך הלולאה, `if number > limit:` — גדול מ, לא גדול או שווה.'],
            ['Add 1 to the counter inside the if, and `return count` after the loop.', 'הוסיפו 1 למונה בתוך ה-if, ו-`return count` אחרי הלולאה.'],
          ],
          solution: py`
            def count_above(numbers, limit):
                count = 0
                for number in numbers:
                    if number > limit:
                        count = count + 1
                return count
          `,
          concepts: ['for-each', 'accumulator', 'return', 'list'],
        }),
      ],
    },
    /* ---------------------------------------------------- 9. code: longest word / total price */
    {
      variants: [
        codeQ({
          id: 'm6-t-q9-a',
          title: ['The longest word', 'המילה הארוכה ביותר'],
          mode: 'write',
          instructions: [
            p(
              'Write a function `longest_word(words)` that returns the longest string in a non-empty list. If two words have the same length, return the one that comes first in the list.',
              'כתבו פונקציה `longest_word(words)` שמחזירה את המחרוזת הארוכה ביותר ברשימה לא ריקה. אם לשתי מילים אותו אורך, החזירו את זו שמופיעה ראשונה ברשימה.',
            ),
            code('longest_word(["hi", "hello", "hey"])  # "hello"\nlongest_word(["cat", "dog"])          # "cat"', { lang: 'text', runnable: false }),
          ],
          starterCode: py`
            def longest_word(words):
                # keep the longest word seen so far while looping
                return ""
          `,
          check: {
            tests: [
              functionTest('longest_word(["hi", "hello", "hey"])', "'hello'"),
              functionTest('longest_word(["cat", "dog"])', "'cat'"),
              functionTest('longest_word(["sun", "planet", "moon"])', "'planet'"),
              functionTest('longest_word(["a"])', "'a'"),
            ],
          },
          hints: [
            ['Start with `best = words[0]` and loop over the list.', 'התחילו עם `best = words[0]` ועברו בלולאה על הרשימה.'],
            ['Compare lengths with `len`: `if len(word) > len(best):` — strictly greater, so the first of equal words stays.', 'השוו אורכים עם `len`: `if len(word) > len(best):` — גדול ממש, כך שהראשונה מבין מילים שוות נשארת.'],
            ['Inside the if, `best = word`. After the loop, `return best`.', 'בתוך ה-if, `best = word`. אחרי הלולאה, `return best`.'],
          ],
          solution: py`
            def longest_word(words):
                best = words[0]
                for word in words:
                    if len(word) > len(best):
                        best = word
                return best
          `,
          concepts: ['for-each', 'index', 'return', 'list'],
        }),
        codeQ({
          id: 'm6-t-q9-b',
          title: ['Total price', 'מחיר כולל'],
          mode: 'write',
          instructions: [
            p(
              'Write a function `total_price(cart)` where `cart` is a dictionary from product names to prices, such as `{"apple": 2, "bread": 5}`. Return the sum of all the prices. For an empty dictionary return 0.',
              'כתבו פונקציה `total_price(cart)` כאשר `cart` הוא מילון משמות מוצרים למחירים, למשל `{"apple": 2, "bread": 5}`. החזירו את סכום כל המחירים. עבור מילון ריק החזירו 0.',
            ),
            code('total_price({"apple": 2, "bread": 5})  # 7\ntotal_price({})                        # 0', { lang: 'text', runnable: false }),
          ],
          starterCode: py`
            def total_price(cart):
                # add up the prices (the values) of the dictionary
                return 0
          `,
          check: {
            tests: [
              functionTest('total_price({"apple": 2, "bread": 5})', '7'),
              functionTest('total_price({"milk": 4})', '4'),
              functionTest('total_price({})', '0'),
              functionTest('total_price({"a": 1, "b": 2, "c": 3})', '6'),
            ],
          },
          hints: [
            ['Start `total = 0` and loop over the entries with `for product, price in cart.items():`.', 'התחילו `total = 0` ועברו על הרשומות עם `for product, price in cart.items():`.'],
            ['Inside the loop add the price: `total = total + price`.', 'בתוך הלולאה הוסיפו את המחיר: `total = total + price`.'],
            ['After the loop, `return total`. An empty dictionary never enters the loop, so 0 is returned.', 'אחרי הלולאה, `return total`. מילון ריק אף פעם לא נכנס ללולאה, ולכן מוחזר 0.'],
          ],
          solution: py`
            def total_price(cart):
                total = 0
                for product, price in cart.items():
                    total = total + price
                return total
          `,
          concepts: ['dict-loop', 'accumulator', 'return', 'dictionary'],
        }),
      ],
    },
    /* ---------------------------------------------------- 10. code: nested data / split */
    {
      variants: [
        codeQ({
          id: 'm6-t-q10-a',
          title: ['Names over an age', 'שמות מעל גיל'],
          mode: 'write',
          instructions: [
            p(
              'Write a function `names_over(people, age)`. `people` is a list of dictionaries with the keys `"name"` and `"age"`. Return a **list** of the names of the people whose age is greater than `age`, in the order they appear. Return an empty list when nobody qualifies.',
              'כתבו פונקציה `names_over(people, age)`. `people` היא רשימה של מילונים עם המפתחות `"name"` ו-`"age"`. החזירו **רשימה** של השמות של האנשים שהגיל שלהם גדול מ-`age`, לפי סדר ההופעה שלהם. החזירו רשימה ריקה כשאף אחד לא מתאים.',
            ),
            code('people = [{"name": "Dana", "age": 12}, {"name": "Omer", "age": 15}]\nnames_over(people, 13)  # ["Omer"]', { lang: 'text', runnable: false }),
          ],
          starterCode: py`
            def names_over(people, age):
                # build a list of the matching names
                return []
          `,
          check: {
            tests: [
              functionTest('names_over([{"name": "Dana", "age": 12}, {"name": "Omer", "age": 15}, {"name": "Lia", "age": 20}], 13)', "['Omer', 'Lia']"),
              functionTest('names_over([{"name": "Dana", "age": 12}, {"name": "Omer", "age": 15}], 30)', '[]'),
              functionTest('names_over([], 5)', '[]'),
              functionTest('names_over([{"name": "A", "age": 10}], 9)', "['A']"),
            ],
          },
          hints: [
            ['Start with an empty list `result = []` and loop with `for person in people:`.', 'התחילו מרשימה ריקה `result = []` ועברו בלולאה `for person in people:`.'],
            ['`person["age"]` is the age of the current record. Compare it: `if person["age"] > age:`.', '`person["age"]` הוא הגיל של הרשומה הנוכחית. השוו אותו: `if person["age"] > age:`.'],
            ['Inside the if, `result.append(person["name"])`. After the loop, `return result`.', 'בתוך ה-if, `result.append(person["name"])`. אחרי הלולאה, `return result`.'],
          ],
          solution: py`
            def names_over(people, age):
                result = []
                for person in people:
                    if person["age"] > age:
                        result.append(person["name"])
                return result
          `,
          concepts: ['nested-data', 'for-each', 'append', 'return'],
        }),
        codeQ({
          id: 'm6-t-q10-b',
          title: ['Word count', 'ספירת מילים'],
          mode: 'write',
          instructions: [
            p(
              'Write a function `word_count(sentence)` that splits the sentence into words and returns a dictionary from each word to the number of times it appears. For an empty sentence return an empty dictionary.',
              'כתבו פונקציה `word_count(sentence)` שמפצלת את המשפט למילים ומחזירה מילון מכל מילה למספר הפעמים שהיא מופיעה. עבור משפט ריק החזירו מילון ריק.',
            ),
            code('word_count("a b a")  # {"a": 2, "b": 1}\nword_count("")       # {}', { lang: 'text', runnable: false }),
          ],
          starterCode: py`
            def word_count(sentence):
                # split the sentence, then count each word in a dictionary
                return {}
          `,
          check: {
            tests: [
              functionTest('word_count("a b a")', "{'a': 2, 'b': 1}"),
              functionTest('word_count("the cat the dog the")', "{'the': 3, 'cat': 1, 'dog': 1}"),
              functionTest('word_count("x")', "{'x': 1}"),
              functionTest('word_count("")', '{}'),
            ],
          },
          hints: [
            ['`words = sentence.split()` gives the list of words; an empty sentence gives an empty list.', '`words = sentence.split()` נותן את רשימת המילים; משפט ריק נותן רשימה ריקה.'],
            ['Create `counts = {}` and loop `for word in words:`.', 'צרו `counts = {}` ועברו בלולאה `for word in words:`.'],
            ['Inside the loop, `counts[word] = counts.get(word, 0) + 1`. After the loop, `return counts`.', 'בתוך הלולאה, `counts[word] = counts.get(word, 0) + 1`. אחרי הלולאה, `return counts`.'],
          ],
          solution: py`
            def word_count(sentence):
                words = sentence.split()
                counts = {}
                for word in words:
                    counts[word] = counts.get(word, 0) + 1
                return counts
          `,
          concepts: ['split-join', 'dict-get', 'for-each', 'return'],
        }),
      ],
    },
  ],
};
