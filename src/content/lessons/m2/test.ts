import type { Assessment } from '../../schema';
import { p, code, t, opt, choice, predictQ, codeQ, outputTest, py } from '../../authoring';

export const test: Assessment = {
  id: 'm2-test',
  kind: 'module-test',
  moduleId: 'm2',
  title: t('Module 2 test: Python basics', 'מבחן מודול 2: יסודות פייתון'),
  description: [
    p(
      'This test covers lessons 5–10: printing and strings, variables, numbers and math, data types, input, and f-strings. It mixes quick questions, "predict the output" questions and three small programs to write.',
      'המבחן הזה מכסה את שיעורים 5–10: הדפסה ומחרוזות, משתנים, מספרים וחישובים, טיפוסי נתונים, קלט ומחרוזות f. הוא משלב שאלות מהירות, שאלות "נחשו את הפלט" ושלוש תוכניות קטנות לכתיבה.',
    ),
    p(
      'You need 70% to pass. In the coding questions you may use one hint each. Any prompt text is fine for input(): only what print prints is checked.',
      'כדי לעבור צריך 70%. בשאלות הקוד מותר להשתמש ברמז אחד בכל שאלה. ב-`input()` כל טקסט הנחיה מתאים: נבדק רק מה ש-`print` מדפיס.',
    ),
  ],
  passScore: 0.7,
  hintsAllowed: 1,
  estimatedMinutes: 20,
  pools: [
    // ---------------------------------------------------------------- 1: print and strings (choice)
    {
      variants: [
        choice(
          'm2-t-q1-a',
          ['Which line prints the word Hello on the screen?', 'איזו שורה מדפיסה את המילה Hello על המסך?'],
          [
            opt('`print("Hello")`', '`print("Hello")`', {
              correct: true,
              feedback: ['Right. Text goes inside quotes, and print shows it.', 'נכון. טקסט נכתב בתוך מירכאות, ו-print מציג אותו.'],
            }),
            opt('`print(Hello)`', '`print(Hello)`', {
              feedback: ['Without quotes Python looks for a variable called Hello and stops with a NameError.', 'בלי מירכאות פייתון מחפש משתנה בשם Hello ונעצר עם NameError.'],
            }),
            opt('`# print("Hello")`', '`# print("Hello")`', {
              feedback: ['The `#` makes the whole line a comment, so nothing runs.', 'ה-`#` הופך את כל השורה להערה, ולכן שום דבר לא רץ.'],
            }),
            opt('`print "Hello"`', '`print "Hello"`', {
              feedback: ['print needs parentheses around what it shows. This is a syntax error.', '`print` צריך סוגריים סביב מה שהוא מציג. זו שגיאת תחביר.'],
            }),
          ],
          ['print', 'quotes', 'comment'],
        ),
        choice(
          'm2-t-q1-b',
          ['What does `print("Hi", "there")` show?', 'מה מציג `print("Hi", "there")`?'],
          [
            opt('`Hi there`', '`Hi there`', {
              correct: true,
              feedback: ['Right. A comma between items prints them with one space between them.', 'נכון. פסיק בין פריטים מדפיס אותם עם רווח אחד ביניהם.'],
            }),
            opt('`Hithere`', '`Hithere`', {
              feedback: ['The comma always adds a space between the items.', 'הפסיק תמיד מוסיף רווח בין הפריטים.'],
            }),
            opt('`"Hi", "there"`', '`"Hi", "there"`', {
              feedback: ['Quotes and commas belong to the code; only the text inside the quotes is shown.', 'המירכאות והפסיקים שייכים לקוד; רק הטקסט שבתוך המירכאות מוצג.'],
            }),
            opt('`Hi, there`', '`Hi, there`', {
              feedback: ['The comma separates the items; it is not printed. Only a space appears.', 'הפסיק מפריד בין הפריטים; הוא לא מודפס. מופיע רק רווח.'],
            }),
          ],
          ['print-multiple', 'quotes'],
        ),
      ],
    },
    // ---------------------------------------------------------------- 2: print, comments, quotes (predict)
    {
      variants: [
        predictQ(
          'm2-t-q2-a',
          py`
            print("a", "b")
            # print("c")
            print('d')
          `,
          'a b\nd',
          [
            'Line 1 prints two items with a space between them. Line 2 is a comment and does nothing. Line 3 prints d — single quotes make a string just like double quotes.',
            'שורה 1 מדפיסה שני פריטים עם רווח ביניהם. שורה 2 היא הערה ולא עושה כלום. שורה 3 מדפיסה d — מירכאות יחידות יוצרות מחרוזת בדיוק כמו מירכאות כפולות.',
          ],
          ['print-multiple', 'comment', 'quotes'],
          { prompt: ['What does this program print? (two lines)', 'מה התוכנית הזאת תדפיס? (שתי שורות)'] },
        ),
        predictQ(
          'm2-t-q2-b',
          py`
            print('one')
            print("two", "three")
          `,
          'one\ntwo three',
          [
            'Each print starts a new line. The second print shows two items separated by a single space.',
            'כל print מתחיל שורה חדשה. ה-print השני מציג שני פריטים מופרדים ברווח אחד.',
          ],
          ['print', 'print-multiple'],
          { prompt: ['What does this program print? (two lines)', 'מה התוכנית הזאת תדפיס? (שתי שורות)'] },
        ),
      ],
    },
    // ---------------------------------------------------------------- 3: variables and reassignment (predict)
    {
      variants: [
        predictQ(
          'm2-t-q3-a',
          py`
            x = "sun"
            y = x
            x = "moon"
            print(x, y)
          `,
          'moon sun',
          [
            'Line 2 copies the current value of x ("sun") into y. Line 3 gives x a new value, but y keeps its own copy. So x is moon and y is sun.',
            'שורה 2 מעתיקה את הערך הנוכחי של x ("sun") לתוך y. שורה 3 נותנת ל-x ערך חדש, אבל y שומר את העותק שלו. לכן x הוא moon ו-y הוא sun.',
          ],
          ['variable', 'assignment', 'reassignment'],
          { prompt: ['What does this program print?', 'מה התוכנית הזאת תדפיס?'] },
        ),
        predictQ(
          'm2-t-q3-b',
          py`
            a = "red"
            b = "blue"
            a = b
            print(a)
            print(b)
          `,
          'blue\nblue',
          [
            'Line 3 stores the value of b in a, replacing "red". Nothing changes b. Both variables now hold "blue".',
            'שורה 3 שומרת את הערך של b בתוך a, ומחליפה את "red". שום דבר לא משנה את b. שני המשתנים מחזיקים עכשיו "blue".',
          ],
          ['assignment', 'reassignment'],
          { prompt: ['What does this program print? (two lines)', 'מה התוכנית הזאת תדפיס? (שתי שורות)'] },
        ),
      ],
    },
    // ---------------------------------------------------------------- 4: naming and assignment (choice)
    {
      variants: [
        choice(
          'm2-t-q4-a',
          ['Which of these is a valid variable name?', 'איזה מהשמות האלה הוא שם חוקי למשתנה?'],
          [
            opt('`high_score`', '`high_score`', {
              correct: true,
              feedback: ['Correct. Letters and underscores are allowed.', 'נכון. אותיות וקווים תחתונים מותרים.'],
            }),
            opt('`high score` (with a space)', '`high score` (עם רווח)', {
              feedback: ['A name cannot contain a space. Use an underscore instead.', 'שם לא יכול להכיל רווח. השתמשו בקו תחתון במקום.'],
            }),
            opt('`1st_score`', '`1st_score`', {
              feedback: ['A name cannot start with a digit.', 'שם לא יכול להתחיל בספרה.'],
            }),
            opt('`high-score`', '`high-score`', {
              feedback: ['A hyphen is the minus sign, so Python would read this as high minus score.', 'מקף הוא סימן חיסור, ולכן פייתון היה קורא את זה כ-high פחות score.'],
            }),
          ],
          ['naming'],
        ),
        choice(
          'm2-t-q4-b',
          ['What does the line `count = 3` do?', 'מה עושה השורה `count = 3`?'],
          [
            opt('It stores the value 3 under the name count.', 'היא שומרת את הערך 3 תחת השם count.', {
              correct: true,
              feedback: ['Right. A single = is an instruction to remember a value.', 'נכון. סימן = יחיד הוא הוראה לזכור ערך.'],
            }),
            opt('It prints 3.', 'היא מדפיסה 3.', {
              feedback: ['Assignment prints nothing. Only print shows something on the screen.', 'השמה לא מדפיסה כלום. רק print מציג משהו על המסך.'],
            }),
            opt('It checks whether count is equal to 3.', 'היא בודקת אם count שווה ל-3.', {
              feedback: ['A single = never asks a question; it stores a value.', 'סימן = יחיד אף פעם לא שואל שאלה; הוא שומר ערך.'],
            }),
          ],
          ['assignment'],
        ),
      ],
    },
    // ---------------------------------------------------------------- 5: arithmetic (predict)
    {
      variants: [
        predictQ(
          'm2-t-q5-a',
          py`
            print(9 // 2, 9 % 2)
            print(9 / 3)
            print(2 ** 3)
          `,
          '4 1\n3.0\n8',
          [
            '9 // 2 is 4 (whole times) and 9 % 2 is 1 (the remainder). 9 / 3 is 3.0 because / always gives a float. 2 ** 3 is 2 × 2 × 2 = 8.',
            '9 // 2 הוא 4 (פעמים שלמות) ו-9 % 2 הוא 1 (השארית). 9 / 3 הוא 3.0 כי / תמיד נותן float. 2 ** 3 הוא 2 × 2 × 2 = 8.',
          ],
          ['integer-division', 'modulo', 'arithmetic', 'power'],
          { prompt: ['What does this program print? (three lines)', 'מה התוכנית הזאת תדפיס? (שלוש שורות)'] },
        ),
        predictQ(
          'm2-t-q5-b',
          py`
            print(10 % 3)
            print(10 // 3)
            print(1 + 2 * 3)
            print((1 + 2) * 3)
          `,
          '1\n3\n7\n9',
          [
            '10 % 3 is the remainder, 1. 10 // 3 is the whole part, 3. Multiplication comes before addition, so 1 + 2 * 3 is 7; the parentheses make it (1 + 2) * 3 = 9.',
            '10 % 3 הוא השארית, 1. 10 // 3 הוא החלק השלם, 3. כפל קודם לחיבור, ולכן 1 + 2 * 3 הוא 7; הסוגריים הופכים את זה ל-(1 + 2) * 3 = 9.',
          ],
          ['modulo', 'integer-division', 'precedence'],
          { prompt: ['What does this program print? (four lines)', 'מה התוכנית הזאת תדפיס? (ארבע שורות)'] },
        ),
      ],
    },
    // ---------------------------------------------------------------- 6: types (choice)
    {
      variants: [
        choice(
          'm2-t-q6-a',
          ['What does `print(type("5"))` show?', 'מה מציג `print(type("5"))`?'],
          [
            opt("`<class 'str'>`", "`<class 'str'>`", {
              correct: true,
              feedback: ['Right. Anything in quotes is a string, even digits.', 'נכון. כל מה שבמירכאות הוא מחרוזת, גם ספרות.'],
            }),
            opt("`<class 'int'>`", "`<class 'int'>`", {
              feedback: ['5 without quotes would be an int. With quotes it is text.', '5 בלי מירכאות היה int. עם מירכאות זה טקסט.'],
            }),
            opt("`<class 'float'>`", "`<class 'float'>`", {
              feedback: ['A float has a decimal point and no quotes, like 5.0. This value is a string.', 'ל-float יש נקודה עשרונית ואין מירכאות, כמו 5.0. הערך הזה הוא מחרוזת.'],
            }),
          ],
          ['type', 'string'],
        ),
        choice(
          'm2-t-q6-b',
          ['Which line prints `15`?', 'איזו שורה מדפיסה `15`?'],
          [
            opt('`print(int("10") + 5)`', '`print(int("10") + 5)`', {
              correct: true,
              feedback: ['Correct. int() converts the text to a number, and 10 + 5 is 15.', 'נכון. `int()` ממירה את הטקסט למספר, ו-10 + 5 הוא 15.'],
            }),
            opt('`print("10" + 5)`', '`print("10" + 5)`', {
              feedback: ['Text plus a number is a TypeError.', 'טקסט ועוד מספר זו שגיאת TypeError.'],
            }),
            opt('`print("10" + "5")`', '`print("10" + "5")`', {
              feedback: ['Two strings are joined together, so this prints 105.', 'שתי מחרוזות מחוברות זו לזו, ולכן זה מדפיס 105.'],
            }),
            opt('`print("10" * 5)`', '`print("10" * 5)`', {
              feedback: ['A string times a number repeats it: this prints 1010101010.', 'מחרוזת כפול מספר משכפלת אותה: זה מדפיס 1010101010.'],
            }),
          ],
          ['type-conversion', 'type-mismatch'],
        ),
      ],
    },
    // ---------------------------------------------------------------- 7: input is text (choice)
    {
      variants: [
        choice(
          'm2-t-q7-a',
          ['The user types `7` at `n = input("Number: ")`. What is stored in `n`?', 'המשתמש מקליד `7` ב-`n = input("Number: ")`. מה נשמר ב-`n`?'],
          [
            opt('The text "7" — input always gives a string.', 'הטקסט "7" — input תמיד נותנת מחרוזת.', {
              correct: true,
              feedback: ['Right. To calculate with it you would write int(n).', 'נכון. כדי לחשב איתו תכתבו `int(n)`.'],
            }),
            opt('The whole number 7.', 'המספר השלם 7.', {
              feedback: ['input() never converts. Digits arrive as text, and you convert them with int().', '`input()` אף פעם לא ממירה. ספרות מגיעות כטקסט, ואתם ממירים אותן עם `int()`.'],
            }),
            opt('The decimal number 7.0.', 'המספר העשרוני 7.0.', {
              feedback: ['input() gives text, never a number of any kind.', '`input()` נותנת טקסט, אף פעם לא מספר מאף סוג.'],
            }),
          ],
          ['input-is-text'],
        ),
        choice(
          'm2-t-q7-b',
          ['Which line reads a whole number from the user so you can add to it?', 'איזו שורה קוראת מספר שלם מהמשתמש כך שאפשר לחבר אליו?'],
          [
            opt('`n = int(input("Number: "))`', '`n = int(input("Number: "))`', {
              correct: true,
              feedback: ['Correct. input() returns text, and int() turns it into a number.', 'נכון. `input()` מחזירה טקסט, ו-`int()` הופכת אותו למספר.'],
            }),
            opt('`n = input("Number: ")`', '`n = input("Number: ")`', {
              feedback: ['This stores text. Adding a number to it causes a TypeError.', 'זה שומר טקסט. חיבור של מספר אליו גורם ל-TypeError.'],
            }),
            opt('`n = input(int("Number: "))`', '`n = input(int("Number: "))`', {
              feedback: ['This tries to convert the prompt text to a number and fails with a ValueError.', 'זה מנסה להמיר את טקסט ההנחיה למספר ונכשל עם ValueError.'],
            }),
          ],
          ['input', 'type-conversion'],
        ),
      ],
    },
    // ---------------------------------------------------------------- 8: // and % with input (code)
    {
      variants: [
        codeQ({
          id: 'm2-t-q8-a',
          title: ['Hours and minutes', 'שעות ודקות'],
          mode: 'write',
          instructions: [
            p(
              'Ask the user for a number of minutes (any prompt text). Print two lines: `Hours: ` with the whole hours in it, and `Minutes: ` with the minutes that remain. For `135` the output is:',
              'בקשו מהמשתמש מספר דקות (כל טקסט הנחיה מתאים). הדפיסו שתי שורות: `Hours: ` עם השעות השלמות שיש בו, ו-`Minutes: ` עם הדקות שנותרות. עבור `135` הפלט הוא:',
            ),
            code('Hours: 2\nMinutes: 15', { lang: 'text', runnable: false }),
          ],
          starterCode: py`
            # ask for the minutes and convert to a number

            # print Hours: and Minutes:

          `,
          sampleStdin: ['135'],
          check: {
            tests: [
              outputTest('Hours: 2\nMinutes: 15', { stdin: ['135'] }),
              outputTest('Hours: 1\nMinutes: 0', { stdin: ['60'] }),
              outputTest('Hours: 0\nMinutes: 59', { stdin: ['59'] }),
            ],
          },
          hints: [
            ['Read the answer with `int(input(...))`, then use `//` for the hours and `%` for the minutes.', 'קראו את התשובה עם `int(input(...))`, ואז השתמשו ב-`//` לשעות וב-`%` לדקות.'],
            ['`minutes // 60` is the whole hours; `minutes % 60` is what remains.', '`minutes // 60` הוא השעות השלמות; `minutes % 60` הוא מה שנשאר.'],
            ['`print("Hours:", minutes // 60)` and `print("Minutes:", minutes % 60)`.', '`print("Hours:", minutes // 60)` ו-`print("Minutes:", minutes % 60)`.'],
          ],
          solution: py`
            minutes = int(input("Minutes: "))
            print("Hours:", minutes // 60)
            print("Minutes:", minutes % 60)
          `,
          concepts: ['input', 'type-conversion', 'integer-division', 'modulo'],
        }),
        codeQ({
          id: 'm2-t-q8-b',
          title: ['Minutes and seconds', 'דקות ושניות'],
          mode: 'write',
          instructions: [
            p(
              'Ask the user for a number of seconds (any prompt text). Print two lines: `Minutes: ` with the whole minutes in it, and `Seconds: ` with the seconds that remain. For `200` the output is:',
              'בקשו מהמשתמש מספר שניות (כל טקסט הנחיה מתאים). הדפיסו שתי שורות: `Minutes: ` עם הדקות השלמות שיש בו, ו-`Seconds: ` עם השניות שנותרות. עבור `200` הפלט הוא:',
            ),
            code('Minutes: 3\nSeconds: 20', { lang: 'text', runnable: false }),
          ],
          starterCode: py`
            # ask for the seconds and convert to a number

            # print Minutes: and Seconds:

          `,
          sampleStdin: ['200'],
          check: {
            tests: [
              outputTest('Minutes: 3\nSeconds: 20', { stdin: ['200'] }),
              outputTest('Minutes: 2\nSeconds: 0', { stdin: ['120'] }),
              outputTest('Minutes: 0\nSeconds: 45', { stdin: ['45'] }),
            ],
          },
          hints: [
            ['Read the answer with `int(input(...))`, then use `//` for the minutes and `%` for the seconds.', 'קראו את התשובה עם `int(input(...))`, ואז השתמשו ב-`//` לדקות וב-`%` לשניות.'],
            ['`seconds // 60` is the whole minutes; `seconds % 60` is what remains.', '`seconds // 60` הוא הדקות השלמות; `seconds % 60` הוא מה שנשאר.'],
            ['`print("Minutes:", seconds // 60)` and `print("Seconds:", seconds % 60)`.', '`print("Minutes:", seconds // 60)` ו-`print("Seconds:", seconds % 60)`.'],
          ],
          solution: py`
            seconds = int(input("Seconds: "))
            print("Minutes:", seconds // 60)
            print("Seconds:", seconds % 60)
          `,
          concepts: ['input', 'type-conversion', 'integer-division', 'modulo'],
        }),
      ],
    },
    // ---------------------------------------------------------------- 9: input + f-strings (code)
    {
      variants: [
        codeQ({
          id: 'm2-t-q9-a',
          title: ['Name and age', 'שם וגיל'],
          mode: 'write',
          instructions: [
            p(
              'Ask for a name and then for an age (any prompts). Print two lines: `Hello, ` followed by the name and an exclamation mark, and `Next year you will be ` followed by the age plus one and a full stop. For `Maya` and `12`:',
              'בקשו שם ואחר כך גיל (כל הנחיה מתאימה). הדפיסו שתי שורות: `Hello, ` ואחריו השם וסימן קריאה, ו-`Next year you will be ` ואחריו הגיל ועוד אחד ונקודה. עבור `Maya` ו-`12`:',
            ),
            code('Hello, Maya!\nNext year you will be 13.', { lang: 'text', runnable: false }),
          ],
          starterCode: py`
            # ask for the name and the age

            # print the two lines

          `,
          sampleStdin: ['Maya', '12'],
          check: {
            tests: [
              outputTest('Hello, Maya!\nNext year you will be 13.', { stdin: ['Maya', '12'] }),
              outputTest('Hello, Ben!\nNext year you will be 41.', { stdin: ['Ben', '40'] }),
            ],
          },
          hints: [
            ['The age must be converted with int() before you can add 1 to it.', 'את הגיל צריך להמיר עם `int()` לפני שאפשר להוסיף לו 1.'],
            ['An f-string puts the values exactly where you want them: `f"Hello, {name}!"`.', 'מחרוזת f שמה את הערכים בדיוק איפה שאתם רוצים: `f"Hello, {name}!"`.'],
            ['Second line: `print(f"Next year you will be {age + 1}.")`.', 'השורה השנייה: `print(f"Next year you will be {age + 1}.")`.'],
          ],
          solution: py`
            name = input("Name: ")
            age = int(input("Age: "))
            print(f"Hello, {name}!")
            print(f"Next year you will be {age + 1}.")
          `,
          concepts: ['input', 'type-conversion', 'f-string'],
        }),
        codeQ({
          id: 'm2-t-q9-b',
          title: ['City card', 'כרטיס עיר'],
          mode: 'write',
          instructions: [
            p(
              'Ask for a name and then for a city (any prompts). Print two lines: `<name> lives in <city>.` and then the city in capital letters followed by ` has ` and the number of characters in the city and ` letters.` For `Dana` and `Haifa`:',
              'בקשו שם ואחר כך עיר (כל הנחיה מתאימה). הדפיסו שתי שורות: `<name> lives in <city>.` ואז העיר באותיות גדולות ואחריה ` has ` ומספר התווים בעיר ו-` letters.` עבור `Dana` ו-`Haifa`:',
            ),
            code('Dana lives in Haifa.\nHAIFA has 5 letters.', { lang: 'text', runnable: false }),
          ],
          starterCode: py`
            # ask for the name and the city

            # print the two lines

          `,
          sampleStdin: ['Dana', 'Haifa'],
          check: {
            tests: [
              outputTest('Dana lives in Haifa.\nHAIFA has 5 letters.', { stdin: ['Dana', 'Haifa'] }),
              outputTest('Omer lives in Tel Aviv.\nTEL AVIV has 8 letters.', { stdin: ['Omer', 'Tel Aviv'] }),
            ],
          },
          hints: [
            ['Both answers are text, so no conversion is needed. Use an f-string for each line.', 'שתי התשובות הן טקסט, ולכן לא צריך המרה. השתמשו במחרוזת f לכל שורה.'],
            ['First line: `f"{name} lives in {city}."`.', 'השורה הראשונה: `f"{name} lives in {city}."`.'],
            ['Second line: `f"{city.upper()} has {len(city)} letters."`.', 'השורה השנייה: `f"{city.upper()} has {len(city)} letters."`.'],
          ],
          solution: py`
            name = input("Name: ")
            city = input("City: ")
            print(f"{name} lives in {city}.")
            print(f"{city.upper()} has {len(city)} letters.")
          `,
          concepts: ['input', 'f-string', 'upper-lower', 'len'],
        }),
      ],
    },
    // ---------------------------------------------------------------- 10: string tools and types (code)
    {
      variants: [
        codeQ({
          id: 'm2-t-q10-a',
          title: ['Shout it', 'בקול רם'],
          mode: 'write',
          instructions: [
            p(
              'Ask the user for a word (any prompt). Print the word in capital letters, and then `Letters: ` followed by the number of characters in the word. For `hello`:',
              'בקשו מהמשתמש מילה (כל הנחיה מתאימה). הדפיסו את המילה באותיות גדולות, ואחר כך `Letters: ` ואחריו מספר התווים במילה. עבור `hello`:',
            ),
            code('HELLO\nLetters: 5', { lang: 'text', runnable: false }),
          ],
          starterCode: py`
            # ask for a word

            # print it in capitals, then its length

          `,
          sampleStdin: ['hello'],
          check: {
            tests: [
              outputTest('HELLO\nLetters: 5', { stdin: ['hello'] }),
              outputTest('PYTHON\nLetters: 6', { stdin: ['Python'] }),
            ],
          },
          hints: [
            ['`word.upper()` gives the capital version, and `len(word)` counts the characters.', '`word.upper()` נותנת את הגרסה באותיות גדולות, ו-`len(word)` סופרת את התווים.'],
            ['First line: `print(word.upper())`.', 'השורה הראשונה: `print(word.upper())`.'],
            ['Second line: `print("Letters:", len(word))` or `print(f"Letters: {len(word)}")`.', 'השורה השנייה: `print("Letters:", len(word))` או `print(f"Letters: {len(word)}")`.'],
          ],
          solution: py`
            word = input("Word: ")
            print(word.upper())
            print(f"Letters: {len(word)}")
          `,
          concepts: ['input', 'upper-lower', 'len'],
        }),
        codeQ({
          id: 'm2-t-q10-b',
          title: ['Double or repeat', 'להכפיל או לשכפל'],
          mode: 'write',
          instructions: [
            p(
              'Ask the user for a whole number (any prompt). Print two lines: `Double: ` followed by the number times two — as a real calculation — and `Repeated: ` followed by the digits written twice, as text. For `7`:',
              'בקשו מהמשתמש מספר שלם (כל הנחיה מתאימה). הדפיסו שתי שורות: `Double: ` ואחריו המספר כפול שתיים — כחישוב אמיתי — ו-`Repeated: ` ואחריו הספרות כתובות פעמיים, כטקסט. עבור `7`:',
            ),
            code('Double: 14\nRepeated: 77', { lang: 'text', runnable: false }),
          ],
          starterCode: py`
            # ask for a whole number

            # print Double: (number * 2) and Repeated: (text * 2)

          `,
          sampleStdin: ['7'],
          check: {
            tests: [
              outputTest('Double: 14\nRepeated: 77', { stdin: ['7'] }),
              outputTest('Double: 24\nRepeated: 1212', { stdin: ['12'] }),
            ],
          },
          hints: [
            ['input() gives text. Text times 2 is the text repeated; a number times 2 is doubled. You need both.', '`input()` נותנת טקסט. טקסט כפול 2 הוא הטקסט משוכפל; מספר כפול 2 הוא מוכפל. אתם צריכים את שניהם.'],
            ['Keep the answer as text in one variable and convert it with int() for the double.', 'שמרו את התשובה כטקסט במשתנה אחד והמירו אותה עם `int()` בשביל ההכפלה.'],
            ['`print("Double:", int(text) * 2)` and `print("Repeated:", text * 2)`.', '`print("Double:", int(text) * 2)` ו-`print("Repeated:", text * 2)`.'],
          ],
          solution: py`
            text = input("Number: ")
            print("Double:", int(text) * 2)
            print("Repeated:", text * 2)
          `,
          concepts: ['input-is-text', 'type-conversion', 'type'],
        }),
      ],
    },
  ],
};
