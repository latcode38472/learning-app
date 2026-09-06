import type { Lesson } from '../../schema';
import {
  p,
  h,
  code,
  list,
  callout,
  term,
  table,
  viz,
  t,
  opt,
  choice,
  exercise,
  outputTest,
  pythonTest,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l08-data-types',
  moduleId: 'm2',
  title: t('Data types: int, float and str', 'טיפוסי נתונים: int, float ו-str'),
  tagline: t('Every value has a type, and the type decides what you can do with it.', 'לכל ערך יש טיפוס, והטיפוס קובע מה אפשר לעשות איתו.'),
  estimatedMinutes: 20,
  introduces: ['type', 'type-conversion', 'type-mismatch'],
  requires: ['print', 'string', 'variable', 'int', 'float', 'arithmetic'],
  runsInBrowser: true,

  objective: t(
    'Find out the type of a value with type(), convert between text and numbers with int(), float() and str(), and understand why "1" + 1 is an error.',
    'לגלות את הטיפוס של ערך בעזרת `type()`, להמיר בין טקסט למספרים בעזרת `int()`, `float()` ו-`str()`, ולהבין למה `"1" + 1` הוא שגיאה.',
  ),
  prerequisiteCheck: t(
    'You can print strings, store values in variables, and calculate with ints and floats (lessons 5–7).',
    'אתם יודעים להדפיס מחרוזות, לשמור ערכים במשתנים ולחשב עם int ו-float (שיעורים 5–7).',
  ),

  explanation: [
    p(
      'You now know three kinds of values: whole numbers like `5`, decimals like `2.5`, and text like `"hello"`. Python calls each kind a **type** (a data type). The type decides what Python can do with a value: numbers can be added and multiplied, text can be printed and repeated — and some mixes are simply not allowed.',
      'אתם כבר מכירים שלושה סוגי ערכים: מספרים שלמים כמו `5`, מספרים עשרוניים כמו `2.5`, וטקסט כמו `"hello"`. פייתון קורא לכל סוג כזה **טיפוס** (type, או data type — טיפוס נתונים). הטיפוס קובע מה פייתון יכול לעשות עם הערך: מספרים אפשר לחבר ולהכפיל, טקסט אפשר להדפיס ולשכפל — וחלק מהשילובים פשוט אסורים.',
    ),
    term(
      'type()',
      'Tells you the type of a value: `type(5)` is int, `type(2.5)` is float, `type("hi")` is str — short for string. Use it whenever you are not sure what kind of value a variable holds.',
      'מגלה את הטיפוס של ערך: `type(5)` הוא int, `type(2.5)` הוא float, `type("hi")` הוא str — קיצור של string. השתמשו בה בכל פעם שאתם לא בטוחים איזה סוג ערך המשתנה מחזיק.',
    ),
    code(py`
      print(type(5))
      print(type(2.5))
      print(type("hello"))
    `, { output: "<class 'int'>\n<class 'float'>\n<class 'str'>" }),
    p(
      'Read `<class \'int\'>` simply as "this is an int". The three types you know so far:',
      'קראו את `<class \'int\'>` פשוט כ"זה int". שלושת הטיפוסים שאתם מכירים עד עכשיו:',
    ),
    table(
      [['Type', 'טיפוס'], ['Example', 'דוגמה'], ['Used for', 'משמש ל']],
      [
        [['int', 'int'], ['`42`', '`42`'], ['counting: people, points, days', 'ספירה: אנשים, נקודות, ימים']],
        [['float', 'float'], ['`3.14`', '`3.14`'], ['measuring: prices, weights, temperatures', 'מדידה: מחירים, משקלים, טמפרטורות']],
        [['str', 'str'], ['`"42"`', '`"42"`'], ['text — even when it looks like a number', 'טקסט — גם כשהוא נראה כמו מספר']],
      ],
    ),
    h('When the types do not match', 'כשהטיפוסים לא מתאימים'),
    p(
      '`"1"` is a string with one character. It looks like a number, but it is text, so Python cannot add a number to it. Trying stops the program with a **TypeError**:',
      '`"1"` היא מחרוזת עם תו אחד. היא נראית כמו מספר, אבל היא טקסט, ולכן פייתון לא יכול לחבר אליה מספר. הניסיון עוצר את התוכנית עם **TypeError**:',
    ),
    code(
      'age = "1"\nprint(age + 1)\n\nTraceback (most recent call last):\n  File "main.py", line 2, in <module>\n    print(age + 1)\n          ~~~~^~~\nTypeError: can only concatenate str (not "int") to str',
      { lang: 'text', runnable: false, caption: t('The program and the error it causes', 'התוכנית והשגיאה שהיא גורמת') },
    ),
    term(
      'TypeError',
      'An error that means: this operation does not fit these types — a **type mismatch**. The message says Python can only "concatenate" (glue) a string to another string, not to an int. The fix is to convert one side so that both sides have the same type.',
      'שגיאה שפירושה: הפעולה הזאת לא מתאימה לטיפוסים האלה — **אי-התאמת טיפוסים** (type mismatch). ההודעה אומרת שפייתון יכול רק "לשרשר" (concatenate, להדביק) מחרוזת למחרוזת אחרת, לא ל-int. התיקון הוא להמיר צד אחד כך ששני הצדדים יהיו מאותו טיפוס.',
    ),
    term(
      'int()  float()  str()',
      'The three converters. `int("12")` turns the text into the whole number 12. `float("2.5")` turns text into a decimal. `str(7)` turns a number into the text `"7"`. The original value does not change; you get a new value of the new type. This is called **type conversion**.',
      'שלוש פונקציות ההמרה. `int("12")` הופכת את הטקסט למספר השלם 12. `float("2.5")` הופכת טקסט למספר עשרוני. `str(7)` הופכת מספר לטקסט `"7"`. הערך המקורי לא משתנה; מקבלים ערך חדש מהטיפוס החדש. לזה קוראים **המרת טיפוסים** (type conversion).',
    ),
    code(py`
      age = "1"
      print(int(age) + 1)
      print(age + str(1))
    `, { output: '2\n11' }),
    p(
      'Line 2 converts the text to a number, so `+` adds: `2`. Line 3 converts the number to text, so `+` glues the two strings together: `11`. Between strings, `+` means "join" — you will use that a lot in lesson 10. Both lines are valid; which one you want depends on what you mean.',
      'שורה 2 ממירה את הטקסט למספר, ולכן `+` מחבר: `2`. שורה 3 ממירה את המספר לטקסט, ולכן `+` מדביק את שתי המחרוזות זו לזו: `11`. בין מחרוזות, `+` פירושו "לחבר יחד" — תשתמשו בזה הרבה בשיעור 10. שתי השורות תקינות; מה שאתם רוצים תלוי במה שאתם מתכוונים.',
    ),
    callout(
      'warning',
      '`int()` of a decimal simply drops everything after the point: `int(3.9)` is `3`, not 4. And `int("3.5")` fails with a ValueError, because that text does not look like a whole number — use `float("3.5")` for it.',
      '`int()` של מספר עשרוני פשוט זורק את כל מה שאחרי הנקודה: `int(3.9)` הוא `3`, לא 4. ו-`int("3.5")` נכשל עם ValueError, כי הטקסט הזה לא נראה כמו מספר שלם — השתמשו בשבילו ב-`float("3.5")`.',
    ),
    h('A fun one: text times a number', 'משהו משעשע: טקסט כפול מספר'),
    code(py`
      print("3" * 2)
      print(3 * 2)
      print("ab" * 3)
    `, { output: '33\n6\nababab' }),
    p(
      'A string times a whole number repeats the string. `"3" * 2` is `"33"` — Python did exactly what the types told it to do. This is a classic surprise: a number that arrived as text gets repeated instead of multiplied. When a result looks strange, check the types with `type()`.',
      'מחרוזת כפול מספר שלם משכפלת את המחרוזת. `"3" * 2` הוא `"33"` — פייתון עשה בדיוק מה שהטיפוסים אמרו לו. זו הפתעה קלאסית: מספר שהגיע כטקסט משוכפל במקום להיות מוכפל. כשתוצאה נראית מוזרה, בדקו את הטיפוסים עם `type()`.',
    ),
    callout(
      'why',
      'Why does Python insist on types? Because the same symbol means different things: `+` adds numbers but joins text, and `*` multiplies numbers but repeats text. The type tells Python which meaning you want — and when it cannot tell, it stops with an error instead of guessing.',
      'למה פייתון מתעקש על טיפוסים? כי אותו סימן אומר דברים שונים: `+` מחבר מספרים אבל מדביק טקסט, ו-`*` מכפיל מספרים אבל משכפל טקסט. הטיפוס אומר לפייתון לאיזו משמעות אתם מתכוונים — וכשהוא לא יכול לדעת, הוא נעצר עם שגיאה במקום לנחש.',
      t('Why types?', 'למה טיפוסים?'),
    ),
  ],

  simpler: [
    p(
      'Think of values as things in different containers: a jar of coins (numbers) and an envelope with a written note (text). You can add up coins. You cannot add a note to coins — what would the result even be? Python asks the same question, and refuses.',
      'חשבו על ערכים כעל דברים במכלים שונים: צנצנת מטבעות (מספרים) ומעטפה עם פתק כתוב (טקסט). מטבעות אפשר לחבר. אי אפשר לחבר פתק למטבעות — מה בכלל תהיה התוצאה? פייתון שואל את אותה שאלה, ומסרב.',
    ),
    p(
      '`type()` is like reading the label on the container: coins (int), measurements (float), or a note (str).',
      '`type()` הוא כמו לקרוא את התווית על המכל: מטבעות (int), מדידות (float), או פתק (str).',
    ),
    p(
      '`int()`, `float()` and `str()` are converters. `int("12")` reads the note that says 12 and gives you 12 real coins. `str(12)` writes the number 12 down on a note.',
      '`int()`, `float()` ו-`str()` הם ממירים. `int("12")` קורא את הפתק שכתוב עליו 12 ונותן לכם 12 מטבעות אמיתיים. `str(12)` כותב את המספר 12 על פתק.',
    ),
    p(
      'Careful: `"3" * 2` does not multiply. It copies the note twice: `"33"`.',
      'זהירות: `"3" * 2` לא מכפיל. הוא מעתיק את הפתק פעמיים: `"33"`.',
    ),
  ],

  workedExample: [
    p(
      'The number of tickets arrived as text (as it would from a form). Watch how the type of `tickets` changes, and how that makes the calculation possible.',
      'מספר הכרטיסים הגיע כטקסט (כפי שהיה מגיע מטופס). שימו לב איך הטיפוס של `tickets` משתנה, ואיך זה מאפשר את החישוב.',
    ),
    viz(py`
      tickets = "4"
      price = 12.5
      print(type(tickets))
      tickets = int(tickets)
      print(type(tickets))
      total = tickets * price
      print("Total:", total)
      print(type(total))
    `),
    list([
      ['Line 1 stores the text `"4"`. Line 3 confirms it: str.', 'שורה 1 שומרת את הטקסט `"4"`. שורה 3 מאשרת את זה: str.'],
      ['Line 4 converts the text to the number 4 and stores it back under the same name. From here on, `tickets` is an int, as line 5 shows.', 'שורה 4 ממירה את הטקסט למספר 4 ושומרת אותו מחדש תחת אותו שם. מכאן והלאה `tickets` הוא int, כמו ששורה 5 מראה.'],
      ['Line 6 multiplies an int by a float: `4 * 12.5`. With the text `"4"` this line would have been an error (text cannot be multiplied by a decimal); with the number it is real multiplication.', 'שורה 6 מכפילה int ב-float: `4 * 12.5`. עם הטקסט `"4"` השורה הזאת הייתה שגיאה (אי אפשר להכפיל טקסט במספר עשרוני); עם המספר זה כפל אמיתי.'],
      ['Lines 7–8 print the total and its type: mixing int and float gives a float.', 'שורות 7–8 מדפיסות את הסכום ואת הטיפוס שלו: שילוב של int ו-float נותן float.'],
    ], true),
    code(py`
      <class 'str'>
      <class 'int'>
      Total: 50.0
      <class 'float'>
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('Why the multiplication went wrong', 'למה הכפל השתבש'),
      code(py`
        count = "3"
        print(count * 2)
        count = int(count)
        print(count * 2)
      `, { output: '33\n6' }),
      p(
        'Same variable, same `* 2`, different result. The only thing that changed is the type. When a program prints something like `33` where you expected `6`, a string has sneaked in.',
        'אותו משתנה, אותו `* 2`, תוצאה שונה. הדבר היחיד שהשתנה הוא הטיפוס. כשתוכנית מדפיסה משהו כמו `33` במקום `6` שציפיתם לו, מחרוזת הסתננה פנימה.',
      ),
    ],
    [
      h('int and float together', 'int ו-float יחד'),
      code(py`
        print(2 + 3.0)
        print(type(2 + 3.0))
        print(int(7.8))
        print(float(7))
      `, { output: "5.0\n<class 'float'>\n7\n7.0" }),
      p(
        'Mixing an int with a float gives a float. `int()` drops the fraction, and `float()` adds a `.0`. Converting between the two number types is always allowed; converting text works only when the text really looks like a number.',
        'שילוב של int עם float נותן float. `int()` זורק את השבר, ו-`float()` מוסיף `.0`. המרה בין שני טיפוסי המספרים תמיד מותרת; המרה של טקסט עובדת רק כשהטקסט באמת נראה כמו מספר.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l08-hard',
    title: ['A rectangle from text', 'מלבן מתוך טקסט'],
    mode: 'write',
    instructions: [
      p(
        'The width and height of a rectangle arrived as text: `width = "8"` and `height = "2.5"`. Keep those two lines exactly as they are. Convert the values to numbers and print two lines: `Area: ` with width × height, and `Perimeter: ` with 2 × (width + height).',
        'הרוחב והגובה של מלבן הגיעו כטקסט: `width = "8"` ו-`height = "2.5"`. השאירו את שתי השורות האלה בדיוק כפי שהן. המירו את הערכים למספרים והדפיסו שתי שורות: `Area: ` עם רוחב × גובה, ו-`Perimeter: ` עם 2 × (רוחב + גובה).',
      ),
      code('Area: 20.0\nPerimeter: 21.0', { lang: 'text', runnable: false, caption: t('Expected output', 'הפלט הצפוי') }),
    ],
    starterCode: py`
      width = "8"
      height = "2.5"
      # convert, calculate and print the two lines
    `,
    check: {
      tests: [
        outputTest('Area: 20.0\nPerimeter: 21.0'),
        pythonTest(py`
          assert 'width = "8"' in source, 'Keep the line width = "8" exactly as it is and convert the value below it.'
          assert 'height = "2.5"' in source, 'Keep the line height = "2.5" exactly as it is and convert the value below it.'
        `),
      ],
    },
    hints: [
      ['`"8"` is text. `int(width)` gives the number 8. `"2.5"` has a point, so it needs `float(height)`.', '`"8"` הוא טקסט. `int(width)` נותן את המספר 8. ל-`"2.5"` יש נקודה, ולכן צריך `float(height)`.'],
      ['Store the converted values in new variables, for example `w = int(width)` and `h = float(height)`.', 'שמרו את הערכים המומרים במשתנים חדשים, למשל `w = int(width)` ו-`h = float(height)`.'],
      ['Then `print("Area:", w * h)` and `print("Perimeter:", 2 * (w + h))`. The parentheses matter.', 'אחר כך `print("Area:", w * h)` ו-`print("Perimeter:", 2 * (w + h))`. הסוגריים חשובים.'],
    ],
    solution: py`
      width = "8"
      height = "2.5"
      w = int(width)
      h = float(height)
      print("Area:", w * h)
      print("Perimeter:", 2 * (w + h))
    `,
    concepts: ['type-conversion', 'arithmetic', 'float'],
  }),

  predict: {
    code: py`
      n = "7"
      print(n * 2)
      print(int(n) * 2)
      print(type(n))
    `,
    prompt: t('What does this program print? (three lines)', 'מה התוכנית הזאת תדפיס? (שלוש שורות)'),
    answer: "77\n14\n<class 'str'>",
    explanation: t(
      '`n` holds the text "7". Text times 2 is the text repeated: 77. `int(n)` converts it to the number 7, and 7 times 2 is 14. The conversion does not change `n` itself, so its type is still str.',
      '`n` מחזיק את הטקסט "7". טקסט כפול 2 הוא הטקסט משוכפל: 77. `int(n)` ממיר אותו למספר 7, ו-7 כפול 2 הוא 14. ההמרה לא משנה את `n` עצמו, ולכן הטיפוס שלו עדיין str.',
    ),
  },

  exercise: exercise({
    id: 'l08-ex',
    title: ['Fix the types', 'תקנו את הטיפוסים'],
    mode: 'fix',
    instructions: [
      p(
        'This program should print `8` and then `5.0`. Instead, it crashes — and after you fix the first print, the second one prints something strange. Lines 1, 2 and 5 must stay as they are (imagine the text arrived from somewhere else). Fix the two print lines with conversions.',
        'התוכנית הזאת אמורה להדפיס `8` ואז `5.0`. במקום זה היא קורסת — ואחרי שתתקנו את ה-`print` הראשון, השני ידפיס משהו מוזר. שורות 1, 2 ו-5 חייבות להישאר כפי שהן (דמיינו שהטקסט הגיע ממקום אחר). תקנו את שתי שורות ה-`print` בעזרת המרות.',
      ),
    ],
    starterCode: py`
      apples = "5"
      more = 3
      print(apples + more)

      price = "2.5"
      print(price * 2)
    `,
    check: {
      tests: [
        outputTest('8\n5.0'),
        pythonTest(py`
          assert 'apples = "5"' in source, 'Keep the line apples = "5" as it is; convert the value where you use it.'
          assert 'price = "2.5"' in source, 'Keep the line price = "2.5" as it is; convert the value where you use it.'
        `),
      ],
    },
    hints: [
      ['The error says Python cannot add an int to a str. `apples` is text — turn it into a number before adding.', 'השגיאה אומרת שפייתון לא יכול לחבר int ל-str. `apples` הוא טקסט — הפכו אותו למספר לפני החיבור.'],
      ['`int(apples) + more` gives 8. For the price, `"2.5" * 2` repeats the text; you need `float(price)`.', '`int(apples) + more` נותן 8. במחיר, `"2.5" * 2` משכפל את הטקסט; אתם צריכים `float(price)`.'],
      ['The two fixed lines: `print(int(apples) + more)` and `print(float(price) * 2)`.', 'שתי השורות המתוקנות: `print(int(apples) + more)` ו-`print(float(price) * 2)`.'],
    ],
    solution: py`
      apples = "5"
      more = 3
      print(int(apples) + more)

      price = "2.5"
      print(float(price) * 2)
    `,
    concepts: ['type-conversion', 'type-mismatch'],
  }),

  build: exercise({
    id: 'l08-build',
    title: ['A score card from text', 'כרטיס ניקוד מתוך טקסט'],
    mode: 'build',
    instructions: [
      p(
        'A player\'s data arrived as text, the way it would from a web form: a name, whole-number points, and a decimal bonus. Build a card that prints four lines: `Player: ` with the name, `Points: ` with the points, `Bonus: ` with the bonus, and `Total: ` with points plus bonus — calculated as numbers. Choose your own name and values, but write points and bonus **in quotes**, as text, and convert them for the total.',
        'הנתונים של שחקן הגיעו כטקסט, כפי שהיו מגיעים מטופס באינטרנט: שם, נקודות (מספר שלם) ובונוס (מספר עשרוני). בנו כרטיס שמדפיס ארבע שורות: `Player: ` עם השם, `Points: ` עם הנקודות, `Bonus: ` עם הבונוס, ו-`Total: ` עם הנקודות ועוד הבונוס — מחושב כמספרים. בחרו שם וערכים משלכם, אבל כתבו את הנקודות והבונוס **במירכאות**, כטקסט, והמירו אותם בשביל הסכום.',
      ),
      code('Player: Dana\nPoints: 37\nBonus: 2.5\nTotal: 39.5', { lang: 'text', runnable: false, caption: t('Example output', 'דוגמה לפלט') }),
    ],
    starterCode: py`
      # the data arrives as text
      name = "Dana"
      points = "37"
      bonus = "2.5"

      # print the four lines of the card
    `,
    check: {
      tests: [
        pythonTest(
          py`
            import re
            m_name = re.search(r"^\s*name\s*=\s*['\"]([^'\"]+)['\"]", source, re.M)
            m_points = re.search(r"^\s*points\s*=\s*['\"](\d+)['\"]", source, re.M)
            m_bonus = re.search(r"^\s*bonus\s*=\s*['\"](\d+\.\d+)['\"]", source, re.M)
            assert m_name, "Create name as text in quotes, for example name = \"Dana\"."
            assert m_points, "Create points as a whole number written in quotes, for example points = \"37\"."
            assert m_bonus, "Create bonus as a decimal number written in quotes, for example bonus = \"2.5\"."
            name = m_name.group(1)
            points = m_points.group(1)
            bonus = m_bonus.group(1)
            total = int(points) + float(bonus)
            lines = [l.strip() for l in stdout.strip().split("\n") if l.strip()]
            assert len(lines) == 4, "Print exactly four lines: Player, Points, Bonus, Total."
            assert lines[0] == "Player: " + name, "Line 1 must be 'Player: ' followed by the name."
            assert lines[1] == "Points: " + points, "Line 2 must be 'Points: ' followed by the points."
            assert lines[2] == "Bonus: " + bonus, "Line 3 must be 'Bonus: ' followed by the bonus."
            assert lines[3] == "Total: " + str(total), "Line 4 must be 'Total: ' followed by points + bonus, converted to numbers first."
          `,
        ),
      ],
    },
    hints: [
      ['The first three lines are simple prints with a label and a variable: `print("Player:", name)`.', 'שלוש השורות הראשונות הן הדפסות פשוטות עם תווית ומשתנה: `print("Player:", name)`.'],
      ['For the total, `points + bonus` would glue the two texts together. Convert first: `int(points)` and `float(bonus)`.', 'בשביל הסכום, `points + bonus` היה מדביק את שני הטקסטים. המירו קודם: `int(points)` ו-`float(bonus)`.'],
      ['The last line: `print("Total:", int(points) + float(bonus))`.', 'השורה האחרונה: `print("Total:", int(points) + float(bonus))`.'],
    ],
    solution: py`
      # the data arrives as text
      name = "Dana"
      points = "37"
      bonus = "2.5"

      print("Player:", name)
      print("Points:", points)
      print("Bonus:", bonus)
      print("Total:", int(points) + float(bonus))
    `,
    solutionNote: [
      'Any name and values work, as long as points and bonus are written as text and converted for the total.',
      'כל שם וערכים מתאימים, כל עוד הנקודות והבונוס כתובים כטקסט ומומרים בשביל הסכום.',
    ],
    concepts: ['type-conversion', 'type', 'print-multiple'],
  }),

  check: [
    choice(
      'l08-c1',
      ['What does `print(type("3.5"))` show?', 'מה מציג `print(type("3.5"))`?'],
      [
        opt("`<class 'str'>`", "`<class 'str'>`", {
          correct: true,
          feedback: ['Right. The quotes make it text, no matter what is written inside them.', 'נכון. המירכאות הופכות את זה לטקסט, לא משנה מה כתוב בתוכן.'],
        }),
        opt("`<class 'float'>`", "`<class 'float'>`", {
          feedback: ['`3.5` without quotes would be a float. With quotes it is a string.', '`3.5` בלי מירכאות היה float. עם מירכאות זו מחרוזת.'],
        }),
        opt("`<class 'int'>`", "`<class 'int'>`", {
          feedback: ['It is neither a whole number nor a number at all — the quotes make it text.', 'זה לא מספר שלם ובכלל לא מספר — המירכאות הופכות את זה לטקסט.'],
        }),
      ],
      ['type', 'string'],
    ),
    choice(
      'l08-c2',
      ['`print("10" + 5)` causes a TypeError. Which line prints `15` instead?', '`print("10" + 5)` גורם ל-TypeError. איזו שורה מדפיסה `15` במקום זה?'],
      [
        opt('`print(int("10") + 5)`', '`print(int("10") + 5)`', {
          correct: true,
          feedback: ['Correct. Converting the text to a number makes both sides ints, and `+` adds.', 'נכון. המרת הטקסט למספר הופכת את שני הצדדים ל-int, ו-`+` מחבר.'],
        }),
        opt('`print("10" + "5")`', '`print("10" + "5")`', {
          feedback: ['No error, but two strings are glued together: this prints 105.', 'אין שגיאה, אבל שתי מחרוזות מודבקות זו לזו: זה מדפיס 105.'],
        }),
        opt('`print(str("10") + 5)`', '`print(str("10") + 5)`', {
          feedback: ['`"10"` is already a string, so nothing changed — still a string plus an int, still a TypeError.', '`"10"` כבר מחרוזת, ולכן שום דבר לא השתנה — עדיין מחרוזת ועוד int, עדיין TypeError.'],
        }),
      ],
      ['type-conversion', 'type-mismatch'],
    ),
    choice(
      'l08-c3',
      ['What does `print("ab" * 2)` show?', 'מה מציג `print("ab" * 2)`?'],
      [
        opt('`abab`', '`abab`', {
          correct: true,
          feedback: ['Yes. A string times a whole number is the string repeated.', 'כן. מחרוזת כפול מספר שלם היא המחרוזת משוכפלת.'],
        }),
        opt('A TypeError', 'שגיאת TypeError', {
          feedback: ['Repeating text with `*` is allowed. It is adding text to a number that is not.', 'שכפול טקסט עם `*` מותר. מה שאסור הוא לחבר טקסט למספר.'],
        }),
        opt('`ab2`', '`ab2`', {
          feedback: ['`*` never glues; it repeats. The text appears twice.', '`*` אף פעם לא מדביק; הוא משכפל. הטקסט מופיע פעמיים.'],
        }),
      ],
      ['type', 'type-mismatch'],
    ),
  ],

  recap: [
    list([
      ['Every value has a type: int (whole number), float (decimal) or str (text). `type()` shows it.', 'לכל ערך יש טיפוס: int (מספר שלם), float (מספר עשרוני) או str (טקסט). `type()` מציג אותו.'],
      ['`"1"` is text, not a number. `"1" + 1` is a TypeError: the types do not match.', '`"1"` הוא טקסט, לא מספר. `"1" + 1` הוא TypeError: הטיפוסים לא מתאימים.'],
      ['`int()`, `float()` and `str()` convert between types and give you a new value.', '`int()`, `float()` ו-`str()` ממירים בין טיפוסים ונותנים ערך חדש.'],
      ['`+` joins strings and `*` repeats them: `"3" * 2` is `"33"`.', '`+` מחבר מחרוזות ו-`*` משכפל אותן: `"3" * 2` הוא `"33"`.'],
    ]),
    p(
      'Types are behind most of the confusing moments beginners meet: an error that mentions str and int, or a 33 where a 6 was expected. Now you know how to read those moments and how to fix them.',
      'טיפוסים עומדים מאחורי רוב הרגעים המבלבלים שמתחילים נתקלים בהם: שגיאה שמזכירה str ו-int, או 33 במקום 6 שציפיתם לו. עכשיו אתם יודעים לקרוא את הרגעים האלה ולתקן אותם.',
    ),
  ],
  next: t(
    'Next your programs will ask the user questions with input() — and because every answer arrives as text, the conversions you just learned will be used right away.',
    'בשיעור הבא התוכניות שלכם ישאלו את המשתמש שאלות בעזרת `input()` — ומכיוון שכל תשובה מגיעה כטקסט, ההמרות שלמדתם עכשיו ישמשו אתכם מיד.',
  ),
};
