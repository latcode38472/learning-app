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
  id: 'l11-comparisons',
  moduleId: 'm3',
  title: t('Comparisons: asking yes-or-no questions', 'השוואות: שאלות של כן או לא'),
  tagline: t('True, False, and the six ways to compare two values.', 'True, False ושש דרכים להשוות בין שני ערכים.'),
  estimatedMinutes: 20,
  introduces: ['comparison', 'boolean', 'equality'],
  requires: ['print', 'variable', 'int', 'string', 'input', 'type-conversion'],
  runsInBrowser: true,

  objective: t(
    'Compare two values with ==, !=, <, >, <= and >=, read the True/False answer, and store it in a variable.',
    'להשוות בין שני ערכים בעזרת `==`, `!=`, `<`, `>`, `<=` ו-`>=`, להבין את התשובה `True` או `False`, ולשמור אותה במשתנה.',
  ),
  prerequisiteCheck: t(
    'You can create variables, work with numbers and text, and read a number with int(input(...)) (lessons 6–9).',
    'אתם יודעים ליצור משתנים, לעבוד עם מספרים וטקסט, ולקרוא מספר בעזרת `int(input(...))` (שיעורים 6–9).',
  ),

  explanation: [
    p(
      'So far every program did exactly the same thing each time it ran. To make a decision, a program first has to ask a question: is the age at least 18? Is the guess equal to the password? Such a question is called a **comparison**, and Python answers it with one of two special values: `True` or `False`.',
      'עד עכשיו כל תוכנית עשתה בדיוק אותו דבר בכל הרצה. כדי לקבל החלטה, תוכנית צריכה קודם לשאול שאלה: האם הגיל הוא לפחות 18? האם הניחוש שווה לסיסמה? שאלה כזאת נקראת **השוואה** (comparison), ופייתון עונה עליה באחד משני ערכים מיוחדים: `True` (אמת) או `False` (שקר).',
    ),
    term(
      'True / False',
      'These two values are called **booleans**, and their type is `bool`. A boolean is a new kind of value, next to numbers and strings, and it can only ever be one of these two. Write them with a capital first letter and **no quotes**: `True` is a value, `"True"` is just text.',
      'שני הערכים האלה נקראים **ערכים בוליאניים** (boolean), והטיפוס שלהם הוא `bool`. ערך בוליאני הוא סוג חדש של ערך, לצד מספרים ומחרוזות, והוא יכול להיות רק אחד מהשניים. כותבים אותם באות גדולה בהתחלה ו**בלי מירכאות**: `True` הוא ערך, ואילו `"True"` הוא סתם טקסט.',
    ),
    code(py`
      print(5 > 3)
      print(5 < 3)
    `, { output: 'True\nFalse' }),
    p(
      'Line 1 asks "is 5 greater than 3?" — yes, so Python prints `True`. Line 2 asks "is 5 less than 3?" — no, so it prints `False`. A comparison is an expression, just like `2 + 3`: Python works it out and gets a value.',
      'שורה 1 שואלת "האם 5 גדול מ-3?" — כן, ולכן פייתון מדפיס `True`. שורה 2 שואלת "האם 5 קטן מ-3?" — לא, ולכן מודפס `False`. השוואה היא ביטוי, בדיוק כמו `2 + 3`: פייתון מחשב אותו ומקבל ערך.',
    ),
    h('The six comparison operators', 'ששת אופרטורי ההשוואה'),
    term(
      '==',
      'Two equals signs ask **"are these two values equal?"**. This is the **equality** check, and it is one of the most used comparisons in programming.',
      'שני סימני שווה שואלים **"האם שני הערכים האלה שווים?"**. זו בדיקת **שוויון** (equality), ואחת ההשוואות הנפוצות ביותר בתכנות.',
    ),
    term(
      '!=',
      'An exclamation mark followed by an equals sign asks "are these **not** equal?". It always gives the opposite answer of `==`.',
      'סימן קריאה ואחריו סימן שווה שואלים "האם הערכים **לא** שווים?". התשובה תמיד הפוכה מזו של `==`.',
    ),
    term(
      '<= and >=',
      '`<` and `>` mean "less than" and "greater than". Adding `=` turns them into "less than **or equal**" (`<=`) and "greater than **or equal**" (`>=`). The `=` always comes second: write `>=`, never `=>`.',
      '`<` ו-`>` פירושם "קטן מ-" ו"גדול מ-". הוספת `=` הופכת אותם ל"קטן **או שווה**" (`<=`) ו"גדול **או שווה**" (`>=`). סימן ה-`=` תמיד בא שני: כתבו `>=`, אף פעם לא `=>`.',
    ),
    table(
      [['Operator', 'אופרטור'], ['Question', 'השאלה'], ['Example', 'דוגמה'], ['Result', 'תוצאה']],
      [
        [['`==`', '`==`'], ['equal to', 'שווה ל-'], ['`5 == 5`', '`5 == 5`'], ['`True`', '`True`']],
        [['`!=`', '`!=`'], ['not equal to', 'שונה מ-'], ['`5 != 5`', '`5 != 5`'], ['`False`', '`False`']],
        [['`<`', '`<`'], ['less than', 'קטן מ-'], ['`3 < 5`', '`3 < 5`'], ['`True`', '`True`']],
        [['`>`', '`>`'], ['greater than', 'גדול מ-'], ['`3 > 5`', '`3 > 5`'], ['`False`', '`False`']],
        [['`<=`', '`<=`'], ['less than or equal to', 'קטן או שווה ל-'], ['`5 <= 5`', '`5 <= 5`'], ['`True`', '`True`']],
        [['`>=`', '`>=`'], ['greater than or equal to', 'גדול או שווה ל-'], ['`4 >= 5`', '`4 >= 5`'], ['`False`', '`False`']],
      ],
    ),
    callout(
      'warning',
      'This is the most common mix-up in beginner code. `x = 5` is an **instruction**: store 5 in `x`. It prints nothing and asks nothing. `x == 5` is a **question**: is `x` equal to 5? It gives `True` or `False` and changes nothing.',
      'זהו הבלבול הנפוץ ביותר בקוד של מתחילים. `x = 5` הוא **הוראה**: שמור 5 בתוך `x`. הוא לא מדפיס כלום ולא שואל כלום. `x == 5` הוא **שאלה**: האם `x` שווה ל-5? הוא מחזיר `True` או `False` ולא משנה שום דבר.',
      t('One = stores, two == compare', 'סימן = אחד שומר, שני == משווים'),
    ),
    code(py`
      x = 5
      print(x == 5)
      print(x == 7)
      print(x)
    `, { output: 'True\nFalse\n5' }),
    h('Comparing text', 'השוואת טקסט'),
    p(
      'Strings can be compared with `==` and `!=` too. Two strings are equal only when every character matches, so **capital letters matter**: `"Yes"` and `"yes"` are different. If you want to ignore case, turn both sides into lowercase with `.lower()` first.',
      'גם מחרוזות אפשר להשוות בעזרת `==` ו-`!=`. שתי מחרוזות שוות רק כשכל תו מתאים, ולכן **אותיות גדולות וקטנות משנות**: `"Yes"` ו-`"yes"` הן מחרוזות שונות. אם רוצים להתעלם מגודל האותיות, הפכו קודם את שני הצדדים לאותיות קטנות בעזרת `.lower()`.',
    ),
    code(py`
      answer = "Yes"
      print(answer == "yes")
      print(answer.lower() == "yes")
    `, { output: 'False\nTrue' }),
    h('Storing the answer', 'שמירת התשובה'),
    p(
      'Because a comparison produces a value, you can store that value in a variable, exactly like a number or a string. The variable then holds `True` or `False`. Choose a name that reads like a question: `is_adult`, `has_won`, `is_empty`.',
      'מכיוון שהשוואה מייצרת ערך, אפשר לשמור את הערך הזה במשתנה, בדיוק כמו מספר או מחרוזת. המשתנה יחזיק אז `True` או `False`. בחרו שם שנקרא כמו שאלה: `is_adult`, `has_won`, `is_empty`.',
    ),
    code(py`
      age = 20
      is_adult = age >= 18
      print(is_adult)
      print(type(is_adult))
    `, { output: "True\n<class 'bool'>" }),
    callout(
      'tip',
      'Python works out arithmetic before comparing, so `a == b + 7` first computes `b + 7` and only then checks equality. And remember that `input()` gives text: `"18" == 18` is `False`, because a string is never equal to a number. Convert with `int()` before comparing numbers.',
      'פייתון מחשב קודם את החשבון ורק אז משווה, ולכן `a == b + 7` מחשב קודם את `b + 7` ורק אז בודק שוויון. וזכרו ש-`input()` מחזיר טקסט: `"18" == 18` הוא `False`, כי מחרוזת אף פעם לא שווה למספר. המירו בעזרת `int()` לפני שאתם משווים מספרים.',
    ),
  ],

  simpler: [
    p(
      'A comparison is a question that has only two possible answers: yes or no. Python says `True` for yes and `False` for no.',
      'השוואה היא שאלה שיש לה רק שתי תשובות אפשריות: כן או לא. פייתון אומר `True` במקום כן ו-`False` במקום לא.',
    ),
    p(
      '`age >= 18` is the question "is the age 18 or more?". If `age` holds 20 the answer is `True`; if it holds 12 the answer is `False`.',
      '`age >= 18` היא השאלה "האם הגיל הוא 18 או יותר?". אם `age` מחזיק 20 התשובה היא `True`; אם הוא מחזיק 12 התשובה היא `False`.',
    ),
    p(
      'Think of the jar from the variables lesson. One equals sign (`=`) **puts** something in the jar. Two equals signs (`==`) look at two jars and ask "is the same thing inside both?"',
      'חשבו על הצנצנת משיעור המשתנים. סימן שווה אחד (`=`) **מכניס** משהו לצנצנת. שני סימני שווה (`==`) מסתכלים על שתי צנצנות ושואלים "האם יש בשתיהן אותו דבר?"',
    ),
    p(
      'You can write the answer on a sticky note and keep it: `is_adult = age >= 18`. Later, the note still says `True` or `False`.',
      'אפשר לכתוב את התשובה על פתק ולשמור אותו: `is_adult = age >= 18`. גם מאוחר יותר הפתק עדיין אומר `True` או `False`.',
    ),
  ],

  workedExample: [
    p(
      'Read this program line by line, then press the play button under the code and watch the value of `passed` change.',
      'קראו את התוכנית שורה אחר שורה, ואז לחצו על כפתור ההפעלה מתחת לקוד וצפו בערך של `passed` משתנה.',
    ),
    viz(py`
      score = 72
      passed = score >= 60
      print(passed)
      score = 40
      passed = score >= 60
      print(passed)
    `),
    list([
      ['Line 1: `score` holds 72.', 'שורה 1: `score` מחזיק 72.'],
      ['Line 2: Python asks "is 72 at least 60?" — yes — and stores `True` in `passed`. Line 3 prints `True`.', 'שורה 2: פייתון שואל "האם 72 הוא לפחות 60?" — כן — ושומר `True` בתוך `passed`. שורה 3 מדפיסה `True`.'],
      ['Line 4 changes `score` to 40. Notice that `passed` does **not** change by itself: it still holds the old answer. A stored comparison is a snapshot from the moment it was computed.', 'שורה 4 משנה את `score` ל-40. שימו לב ש-`passed` **לא** משתנה מעצמו: הוא עדיין מחזיק את התשובה הישנה. השוואה שנשמרה היא תמונת מצב מהרגע שבו חושבה.'],
      ['Line 5 asks the question again with the new score and stores `False`. Line 6 prints `False`.', 'שורה 5 שואלת את השאלה שוב עם הציון החדש ושומרת `False`. שורה 6 מדפיסה `False`.'],
    ], true),
    code(py`
      True
      False
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('Text compares too, and case matters', 'גם טקסט משווים, וגודל האותיות משנה'),
      code(py`
        password = "sesame"
        guess = "Sesame"
        print(guess == password)
        print(guess.lower() == password)
        print(len(guess) == len(password))
      `, { output: 'False\nTrue\nTrue' }),
      p(
        'Line 3 is `False` because of the capital S. Line 4 lowercases the guess first, so the letters match. Line 5 compares two numbers — the lengths, 6 and 6 — so it is `True`.',
        'שורה 3 היא `False` בגלל ה-S הגדולה. שורה 4 הופכת קודם את הניחוש לאותיות קטנות, ואז האותיות מתאימות. שורה 5 משווה שני מספרים — האורכים, 6 ו-6 — ולכן היא `True`.',
      ),
    ],
    [
      h('Is the number even?', 'האם המספר זוגי?'),
      code(py`
        n = 10
        print(n % 2 == 0)
        n = 7
        print(n % 2 == 0)
      `, { output: 'True\nFalse' }),
      p(
        '`n % 2` is the remainder after dividing by 2: it is 0 for even numbers and 1 for odd ones. So `n % 2 == 0` is the question "is n even?". You will use this trick a lot.',
        '`n % 2` הוא השארית מחלוקה ב-2: היא 0 למספרים זוגיים ו-1 למספרים אי-זוגיים. לכן `n % 2 == 0` היא השאלה "האם n זוגי?". תשתמשו בטריק הזה הרבה.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l11-hard',
    title: ['Two words', 'שתי מילים'],
    mode: 'write',
    instructions: [
      p(
        'Ask for two words, one after the other (any prompt text — prompts are not checked). Then print two lines: `Same length:` followed by `True` or `False` — whether both words have the same number of letters — and `Same word:` followed by whether the two words are the same when capital letters are ignored. Tip: `print("Same length:", len(a) == len(b))` prints the label, a space and the answer.',
        'בקשו שתי מילים, בזו אחר זו (טקסט הבקשה חופשי — הוא לא נבדק). אחר כך הדפיסו שתי שורות: `Same length:` ואחריו `True` או `False` — האם לשתי המילים יש אותו מספר אותיות — ו-`Same word:` ואחריו האם שתי המילים זהות כשמתעלמים מאותיות גדולות. טיפ: `print("Same length:", len(a) == len(b))` מדפיס את התווית, רווח ואת התשובה.',
      ),
      code('Same length: True\nSame word: False', { lang: 'text', caption: t('Output for Hello and world', 'הפלט עבור Hello ו-world'), runnable: false }),
    ],
    starterCode: py`
      first = input("First word: ")
      second = input("Second word: ")
      # print "Same length:" and whether the two lengths are equal

      # print "Same word:" and whether the words are equal, ignoring case

    `,
    sampleStdin: ['Hello', 'world'],
    check: {
      tests: [
        outputTest('Same length: True\nSame word: False', { stdin: ['Hello', 'world'] }),
        outputTest('Same length: True\nSame word: True', { stdin: ['Python', 'python'] }),
        outputTest('Same length: False\nSame word: False', { stdin: ['cat', 'horse'] }),
      ],
    },
    hints: [
      ['`len(first)` gives the number of letters in the first word. Compare it with `==` to the length of the second word.', '`len(first)` נותן את מספר האותיות במילה הראשונה. השוו אותו בעזרת `==` לאורך של המילה השנייה.'],
      ['To ignore capital letters, compare `first.lower()` with `second.lower()`.', 'כדי להתעלם מאותיות גדולות, השוו את `first.lower()` עם `second.lower()`.'],
      ['Two print lines: `print("Same length:", len(first) == len(second))` and `print("Same word:", first.lower() == second.lower())`.', 'שתי שורות הדפסה: `print("Same length:", len(first) == len(second))` ו-`print("Same word:", first.lower() == second.lower())`.'],
    ],
    solution: py`
      first = input("First word: ")
      second = input("Second word: ")
      print("Same length:", len(first) == len(second))
      print("Same word:", first.lower() == second.lower())
    `,
    concepts: ['comparison', 'equality', 'boolean', 'len', 'upper-lower'],
  }),

  predict: {
    code: py`
      a = 10
      b = 3
      print(a > b)
      print(a == b + 7)
      print(a != 10)
    `,
    prompt: t('What does this program print? (three lines)', 'מה התוכנית הזאת תדפיס? (שלוש שורות)'),
    answer: 'True\nTrue\nFalse',
    explanation: t(
      '10 > 3 is True. On line 4 Python first computes b + 7, which is 10, and 10 == 10 is True. On line 5, a is 10, so "a is not 10" is False.',
      '10 > 3 הוא True. בשורה 4 פייתון מחשב קודם את b + 7, שהוא 10, ו-10 == 10 הוא True. בשורה 5, a הוא 10, ולכן "a שונה מ-10" הוא False.',
    ),
  },

  exercise: exercise({
    id: 'l11-ex',
    title: ['Number facts', 'עובדות על מספר'],
    mode: 'write',
    instructions: [
      p(
        'Ask for a whole number (any prompt text) and convert it with `int()`. Then print three lines: `Positive:` followed by whether the number is greater than 0, `Even:` followed by whether it is even (`n % 2 == 0`), and `Big:` followed by whether it is at least 100. For the input `12` the output is:',
        'בקשו מספר שלם (טקסט הבקשה חופשי) והמירו אותו בעזרת `int()`. אחר כך הדפיסו שלוש שורות: `Positive:` ואחריו האם המספר גדול מ-0, `Even:` ואחריו האם הוא זוגי (`n % 2 == 0`), ו-`Big:` ואחריו האם הוא לפחות 100. עבור הקלט `12` הפלט הוא:',
      ),
      code('Positive: True\nEven: True\nBig: False', { lang: 'text', runnable: false }),
      p(
        'During checking the prompt text is not shown, so the expected output contains only these three lines.',
        'בזמן הבדיקה טקסט הבקשה לא מוצג, ולכן הפלט הצפוי מכיל רק את שלוש השורות האלה.',
      ),
    ],
    starterCode: py`
      # 1. ask for a whole number and convert it to int

      # 2. print "Positive:" and whether it is greater than 0

      # 3. print "Even:" and whether it is even

      # 4. print "Big:" and whether it is at least 100

    `,
    sampleStdin: ['12'],
    check: {
      tests: [
        outputTest('Positive: True\nEven: True\nBig: False', { stdin: ['12'] }),
        outputTest('Positive: False\nEven: False\nBig: False', { stdin: ['-3'] }),
        outputTest('Positive: True\nEven: True\nBig: True', { stdin: ['250'] }),
        outputTest('Positive: False\nEven: True\nBig: False', { stdin: ['0'] }),
        outputTest('Positive: True\nEven: False\nBig: True', { stdin: ['101'] }),
      ],
    },
    hints: [
      ['Start with `n = int(input("Number: "))` so that `n` is a number, not text.', 'התחילו ב-`n = int(input("Number: "))` כדי ש-`n` יהיה מספר ולא טקסט.'],
      ['A print can show a label and a comparison together: `print("Positive:", n > 0)`.', 'הדפסה יכולה להציג תווית והשוואה יחד: `print("Positive:", n > 0)`.'],
      ['The other two lines are `print("Even:", n % 2 == 0)` and `print("Big:", n >= 100)`.', 'שתי השורות האחרות הן `print("Even:", n % 2 == 0)` ו-`print("Big:", n >= 100)`.'],
    ],
    solution: py`
      n = int(input("Number: "))
      print("Positive:", n > 0)
      print("Even:", n % 2 == 0)
      print("Big:", n >= 100)
    `,
    concepts: ['comparison', 'boolean', 'input', 'type-conversion'],
  }),

  build: exercise({
    id: 'l11-build',
    title: ['A one-question quiz', 'חידון של שאלה אחת'],
    mode: 'build',
    instructions: [
      p(
        'Build a tiny quiz. The question is already stored in `question`. Store the correct answer, `mars`, in a variable called `correct`. Ask the question with `input()`, then print two lines: `You said:` followed by exactly what the player typed, and `Correct:` followed by `True` or `False`. Capital letters must not matter: `Mars`, `MARS` and `mars` are all correct.',
        'בנו חידון זעיר. השאלה כבר שמורה במשתנה `question`. שמרו את התשובה הנכונה, `mars`, במשתנה בשם `correct`. שאלו את השאלה בעזרת `input()`, ואז הדפיסו שתי שורות: `You said:` ואחריו בדיוק מה שהשחקן הקליד, ו-`Correct:` ואחריו `True` או `False`. גודל האותיות לא אמור לשנות: `Mars`, `MARS` ו-`mars` נחשבים כולם נכונים.',
      ),
      code('You said: Mars\nCorrect: True', { lang: 'text', caption: t('Output when the player types Mars', 'הפלט כשהשחקן מקליד Mars'), runnable: false }),
    ],
    starterCode: py`
      question = "Which planet is known as the Red Planet?"
      # store the correct answer (mars) in a variable called correct

      # ask the question and store the reply

      # print "You said:" and the reply

      # print "Correct:" and whether the reply matches, ignoring case

    `,
    sampleStdin: ['Mars'],
    check: {
      tests: [
        outputTest('You said: Mars\nCorrect: True', { stdin: ['Mars'] }),
        outputTest('You said: venus\nCorrect: False', { stdin: ['venus'] }),
        outputTest('You said: MARS\nCorrect: True', { stdin: ['MARS'] }),
        pythonTest(`assert 'correct' in ns and isinstance(ns['correct'], str), "Store the correct answer in a variable called correct."\nassert ns['correct'].lower() == 'mars', "The variable correct should hold mars."`, { stdin: ['Mars'] }),
      ],
    },
    hints: [
      ['Use the question as the prompt: `reply = input(question)`.', 'השתמשו בשאלה כטקסט הבקשה: `reply = input(question)`.'],
      ['Print the reply after a label: `print("You said:", reply)`.', 'הדפיסו את התשובה אחרי תווית: `print("You said:", reply)`.'],
      ['Compare in lowercase: `print("Correct:", reply.lower() == correct)`.', 'השוו באותיות קטנות: `print("Correct:", reply.lower() == correct)`.'],
    ],
    solution: py`
      question = "Which planet is known as the Red Planet?"
      correct = "mars"
      reply = input(question + " ")
      print("You said:", reply)
      print("Correct:", reply.lower() == correct)
    `,
    solutionNote: [
      'Any prompt text works. The important part is comparing the lowercase reply with the stored answer.',
      'כל טקסט בקשה מתאים. החלק החשוב הוא ההשוואה בין התשובה באותיות קטנות לבין התשובה השמורה.',
    ],
    concepts: ['comparison', 'equality', 'boolean', 'input', 'upper-lower'],
  }),

  check: [
    choice(
      'l11-c1',
      ['`x` holds 5. What does the line `print(x == 3)` do?', '`x` מחזיק 5. מה עושה השורה `print(x == 3)`?'],
      [
        opt('It asks whether x equals 3 and prints False.', 'היא שואלת אם x שווה ל-3 ומדפיסה False.', {
          correct: true,
          feedback: ['Right. Two equals signs ask a question, and the answer here is False.', 'נכון. שני סימני שווה שואלים שאלה, והתשובה כאן היא False.'],
        }),
        opt('It stores 3 in x.', 'היא שומרת 3 בתוך x.', {
          feedback: ['Storing uses a single =. Two equals signs never change a variable.', 'שמירה משתמשת ב-= יחיד. שני סימני שווה אף פעם לא משנים משתנה.'],
        }),
        opt('It prints 3.', 'היא מדפיסה 3.', {
          feedback: ['The value printed is the answer to the question, True or False, not the number.', 'הערך שמודפס הוא התשובה לשאלה, True או False, ולא המספר.'],
        }),
        opt('It causes an error.', 'היא גורמת לשגיאה.', {
          feedback: ['Comparing a variable with a number is completely normal Python.', 'השוואה בין משתנה למספר היא פייתון רגיל לגמרי.'],
        }),
      ],
      ['equality', 'comparison'],
    ),
    choice(
      'l11-c2',
      ['Which of these comparisons is True?', 'איזו מההשוואות האלה היא True?'],
      [
        opt('`5 >= 5`', '`5 >= 5`', {
          correct: true,
          feedback: ['Correct. "Greater than or equal" includes the equal case.', 'נכון. "גדול או שווה" כולל גם את מקרה השוויון.'],
        }),
        opt('`"Hi" == "hi"`', '`"Hi" == "hi"`', {
          feedback: ['Capital letters matter when comparing text, so these two strings are different.', 'אותיות גדולות וקטנות משנות בהשוואת טקסט, ולכן שתי המחרוזות האלה שונות.'],
        }),
        opt('`"5" == 5`', '`"5" == 5`', {
          feedback: ['The left side is text and the right side is a number. A string is never equal to a number.', 'הצד השמאלי הוא טקסט והצד הימני מספר. מחרוזת אף פעם לא שווה למספר.'],
        }),
        opt('`3 != 3`', '`3 != 3`', {
          feedback: ['`!=` asks "not equal?". 3 is equal to 3, so the answer is False.', '`!=` שואל "לא שווה?". 3 שווה ל-3, ולכן התשובה היא False.'],
        }),
      ],
      ['comparison', 'equality'],
    ),
    choice(
      'l11-c3',
      ['After `is_adult = age >= 18`, what type of value does `is_adult` hold?', 'אחרי `is_adult = age >= 18`, מאיזה טיפוס הערך ש-`is_adult` מחזיק?'],
      [
        opt('`bool` — it holds True or False', '`bool` — הוא מחזיק True או False', {
          correct: true,
          feedback: ['Yes. A comparison always produces a boolean, and the variable stores that boolean.', 'כן. השוואה תמיד מייצרת ערך בוליאני, והמשתנה שומר את הערך הזה.'],
        }),
        opt('`int` — it holds the age', '`int` — הוא מחזיק את הגיל', {
          feedback: ['The age stays in age. is_adult receives only the answer to the question.', 'הגיל נשאר ב-age. is_adult מקבל רק את התשובה לשאלה.'],
        }),
        opt('`str` — it holds the text "True"', '`str` — הוא מחזיק את הטקסט "True"', {
          feedback: ['True without quotes is a boolean value, not text.', 'True בלי מירכאות הוא ערך בוליאני, לא טקסט.'],
        }),
      ],
      ['boolean'],
    ),
  ],

  recap: [
    list([
      ['A comparison asks a yes-or-no question and gives `True` or `False` — a value of type `bool`.', 'השוואה שואלת שאלה של כן או לא ומחזירה `True` או `False` — ערך מטיפוס `bool`.'],
      ['`==` equal, `!=` not equal, `<` and `>` less or greater, `<=` and `>=` less or greater **or equal**.', '`==` שווה, `!=` שונה, `<` ו-`>` קטן או גדול, `<=` ו-`>=` קטן או גדול **או שווה**.'],
      ['One `=` stores a value; two `==` compare values.', 'סימן `=` אחד שומר ערך; שני סימני `==` משווים ערכים.'],
      ['Text comparisons are exact: capital letters matter. Use `.lower()` to ignore case.', 'השוואות טקסט הן מדויקות: אותיות גדולות וקטנות משנות. השתמשו ב-`.lower()` כדי להתעלם מגודל האותיות.'],
      ['A comparison can be stored in a variable: `is_adult = age >= 18`.', 'אפשר לשמור השוואה במשתנה: `is_adult = age >= 18`.'],
    ]),
    p(
      'Comparisons are the questions a program asks. So far the program only prints the answers; in the next lesson it will act on them.',
      'השוואות הן השאלות שתוכנית שואלת. עד עכשיו התוכנית רק מדפיסה את התשובות; בשיעור הבא היא תפעל לפיהן.',
    ),
  ],
  next: t(
    'Next you will use if and else to run some lines only when a comparison is True — the moment your programs start making decisions.',
    'בשיעור הבא תשתמשו ב-`if` וב-`else` כדי להריץ שורות מסוימות רק כשהשוואה היא `True` — הרגע שבו התוכניות שלכם מתחילות לקבל החלטות.',
  ),
};
