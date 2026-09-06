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
  functionTest,
  requires,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l27-nested-data',
  moduleId: 'm6',
  title: t('Nested data: a table of records', 'נתונים מקוננים: טבלה של רשומות'),
  tagline: t('Lists of dictionaries, dictionaries of lists — and how to choose.', 'רשימות של מילונים, מילונים של רשימות — ואיך לבחור.'),
  estimatedMinutes: 25,
  introduces: ['nested-data', 'split-join', 'choosing-structures'],
  requires: ['list', 'dictionary', 'for-each', 'dict-loop', 'key-value', 'append', 'f-string', 'function', 'return', 'if'],
  runsInBrowser: true,

  objective: t(
    'Store many records as a list of dictionaries, put lists inside a dictionary, turn text into a list of words and back, and choose the right structure for a job.',
    'לשמור הרבה רשומות כרשימה של מילונים, להכניס רשימות לתוך מילון, להפוך טקסט לרשימת מילים ובחזרה, ולבחור את המבנה הנכון למשימה.',
  ),
  prerequisiteCheck: t(
    'You can create lists and dictionaries, loop over both, and read values by index or by key (lessons 24–26).',
    'אתם יודעים ליצור רשימות ומילונים, לעבור על שניהם בלולאה, ולקרוא ערכים לפי אינדקס או לפי מפתח (שיעורים 24–26).',
  ),

  explanation: [
    p(
      'Real information is rarely flat. A class has many students, and each student has a name and a score. One dictionary describes one student; a list keeps all the students in order. Together they form a **list of dictionaries** — a table, where each row is a dictionary and each column is a key.',
      'מידע אמיתי הוא לעיתים רחוקות שטוח. בכיתה יש הרבה תלמידים, ולכל תלמיד יש שם וציון. מילון אחד מתאר תלמיד אחד; רשימה שומרת את כל התלמידים לפי סדר. יחד הם יוצרים **רשימה של מילונים** — טבלה, שבה כל שורה היא מילון וכל עמודה היא מפתח.',
    ),
    term(
      'nested data',
      '**Nested data** means a collection inside a collection: a list of dictionaries, or a dictionary whose values are lists. You reach the inside step by step, from the outside in: first pick the item from the outer collection, then pick from the inner one.',
      '**נתונים מקוננים** (nested data) הם אוסף בתוך אוסף: רשימה של מילונים, או מילון שהערכים שלו הם רשימות. מגיעים לחלק הפנימי צעד אחר צעד, מבחוץ פנימה: קודם בוחרים את הפריט מהאוסף החיצוני, ואז מהפנימי.',
    ),
    code(py`
      students = [
          {"name": "Dana", "score": 91},
          {"name": "Omer", "score": 78},
      ]
      print(students[0]["name"])
      print(students[1]["score"])
    `, { output: 'Dana\n78' }),
    p(
      'Read `students[1]["score"]` from left to right: `students[1]` is the second dictionary, and `["score"]` picks one value out of it. Writing the list over several lines, one dictionary per line, keeps it readable.',
      'קראו את `students[1]["score"]` משמאל לימין: `students[1]` הוא המילון השני, ו-`["score"]` בוחר ממנו ערך אחד. כתיבת הרשימה על פני כמה שורות, מילון אחד בכל שורה, שומרת עליה קריאה.',
    ),
    h('Looping over records', 'לולאה על רשומות'),
    code(py`
      students = [
          {"name": "Dana", "score": 91},
          {"name": "Omer", "score": 78},
      ]
      for student in students:
          print(f"{student['name']}: {student['score']}")
    `, { output: 'Dana: 91\nOmer: 78' }),
    callout(
      'note',
      "Each time round the loop, `student` is one whole dictionary. Inside an f-string written with double quotes, write the key with single quotes — `{student['name']}` — so the two kinds of quotes do not clash.",
      "בכל סיבוב של הלולאה, `student` הוא מילון שלם אחד. בתוך f-string שנכתב עם מירכאות כפולות, כתבו את המפתח במירכאות בודדות — `{student['name']}` — כדי ששני סוגי המירכאות לא יתנגשו.",
    ),
    h('A dictionary of lists', 'מילון של רשימות'),
    p(
      'The other way round also works: a dictionary whose values are lists. `teams["blue"]` is a list, so everything you know about lists works on it — `append`, `len`, indexes.',
      'גם הכיוון ההפוך עובד: מילון שהערכים שלו הם רשימות. `teams["blue"]` הוא רשימה, ולכן כל מה שאתם יודעים על רשימות עובד עליו — `append`, `len`, אינדקסים.',
    ),
    code(py`
      teams = {"red": ["Dana", "Lia"], "blue": ["Omer"]}
      teams["blue"].append("Noa")
      print(teams["red"][0])
      for team, members in teams.items():
          print(f"{team}: {len(members)} members")
    `, { output: 'Dana\nred: 2 members\nblue: 2 members' }),
    h('From text to a list and back', 'מטקסט לרשימה ובחזרה'),
    term(
      '.split()',
      '`text.split()` cuts a string at the spaces and returns a list of the words. It is the usual way to turn one line of input into separate pieces.',
      '`text.split()` חותך מחרוזת במקומות של הרווחים ומחזיר רשימה של המילים. זו הדרך המקובלת להפוך שורת קלט אחת לחלקים נפרדים.',
    ),
    term(
      '.join()',
      '`" ".join(words)` glues a list of strings into one string, putting the separator between the items. The separator comes first, then a dot, then `join` with the list in parentheses. `"-".join(words)` would use dashes instead of spaces.',
      '`" ".join(words)` מדביק רשימה של מחרוזות למחרוזת אחת, ושם את המפריד בין הפריטים. המפריד בא ראשון, אחריו נקודה, ואז `join` עם הרשימה בסוגריים. `"-".join(words)` היה משתמש במקפים במקום ברווחים.',
    ),
    code(py`
      sentence = "the cat sat on the mat"
      words = sentence.split()
      print(words)
      print(len(words))
      print("-".join(words))
    `, { output: "['the', 'cat', 'sat', 'on', 'the', 'mat']\n6\nthe-cat-sat-on-the-mat" }),
    h('Choosing a structure', 'בחירת מבנה'),
    table(
      [['You have…', 'יש לכם…'], ['Use…', 'השתמשו ב…']],
      [
        [['an ordered collection of similar things: scores, names, tasks', 'אוסף מסודר של דברים דומים: ציונים, שמות, משימות'], ['a list', 'רשימה']],
        [['labelled facts about one thing: a person\'s name, age and city', 'עובדות עם תוויות על דבר אחד: השם, הגיל והעיר של אדם'], ['a dictionary', 'מילון']],
        [['many things, each with labelled facts: a class of students, a shop\'s products', 'הרבה דברים, לכל אחד עובדות עם תוויות: כיתה של תלמידים, המוצרים של חנות'], ['a list of dictionaries', 'רשימה של מילונים']],
        [['groups with members: teams and their players', 'קבוצות עם חברים: קבוצות והשחקנים שלהן'], ['a dictionary of lists', 'מילון של רשימות']],
      ],
    ),
    callout(
      'tip',
      'Ask two questions: do I reach things by position or by name? And is it one thing with facts, or many things? The answers point to the structure.',
      'שאלו שתי שאלות: האם אני מגיע לדברים לפי מיקום או לפי שם? והאם זה דבר אחד עם עובדות, או הרבה דברים? התשובות מצביעות על המבנה.',
    ),
  ],

  simpler: [
    p(
      'Picture a table in a notebook. Each row is one student; the column headings are "name" and "score". A list of dictionaries is exactly that table: the list holds the rows, and each dictionary is one row with its headings.',
      'דמיינו טבלה במחברת. כל שורה היא תלמיד אחד; כותרות העמודות הן "name" ו-"score". רשימה של מילונים היא בדיוק הטבלה הזאת: הרשימה מחזיקה את השורות, וכל מילון הוא שורה אחת עם הכותרות שלה.',
    ),
    p(
      '`students[0]["name"]` means: go to row 0, then look under the heading "name". Looping over the list visits row after row.',
      '`students[0]["name"]` פירושו: לכו לשורה 0, ואז הסתכלו מתחת לכותרת "name". לולאה על הרשימה עוברת שורה אחרי שורה.',
    ),
    p(
      '`split` is a pair of scissors that cuts a sentence at every space; `join` is the tape that sticks the pieces back together, with whatever you choose between them.',
      '`split` הוא מספריים שגוזרים משפט בכל רווח; `join` הוא הסלוטייפ שמדביק את החתיכות בחזרה, עם מה שתבחרו לשים ביניהן.',
    ),
    p(
      'Choosing a structure is like choosing a container: a row of boxes for similar things in order, a labelled drawer for facts about one thing, and a shelf of labelled drawers for many things.',
      'בחירת מבנה היא כמו בחירת מיכל: שורת קופסאות לדברים דומים לפי סדר, מגירה עם תוויות לעובדות על דבר אחד, ומדף של מגירות עם תוויות להרבה דברים.',
    ),
  ],

  workedExample: [
    p(
      'This program finds the average score and the best student. Press play under the code to watch `student` take each record in turn.',
      'התוכנית הזאת מוצאת את הציון הממוצע ואת התלמיד המצטיין. לחצו על כפתור ההפעלה מתחת לקוד כדי לראות את `student` מקבל כל רשומה בתורה.',
    ),
    viz(py`
      students = [
          {"name": "Dana", "score": 90},
          {"name": "Omer", "score": 78},
          {"name": "Lia", "score": 84},
      ]
      total = 0
      best_name = ""
      best_score = 0
      for student in students:
          total = total + student["score"]
          if student["score"] > best_score:
              best_score = student["score"]
              best_name = student["name"]
      print(f"Average: {total / len(students)}")
      print(f"Best: {best_name}")
    `),
    list([
      ['Lines 1–5: a list of three dictionaries. Each has the same two keys, like the columns of a table.', 'שורות 1–5: רשימה של שלושה מילונים. לכל אחד אותם שני מפתחות, כמו העמודות של טבלה.'],
      ['Lines 6–8 prepare three variables: the running total, and the best name and best score seen so far.', 'שורות 6–8 מכינות שלושה משתנים: הסכום המצטבר, והשם והציון הטובים ביותר שנראו עד כה.'],
      ['Lines 9–13: each time round, `student` is one dictionary. Its score is added to the total; if it beats the best score so far, both "best" variables are updated.', 'שורות 9–13: בכל סיבוב `student` הוא מילון אחד. הציון שלו מתווסף לסכום; אם הוא עובר את הציון הטוב ביותר עד כה, שני משתני ה"best" מתעדכנים.'],
      ['Line 14 divides the total by the number of students; line 15 prints the winner.', 'שורה 14 מחלקת את הסכום במספר התלמידים; שורה 15 מדפיסה את המנצח.'],
    ], true),
    code(py`
      Average: 84.0
      Best: Dana
    `, { lang: 'text', caption: t('Output', 'פלט'), runnable: false }),
  ],

  moreExamples: [
    [
      h('Building records from text', 'בניית רשומות מטקסט'),
      code(py`
        lines = ["Dana 91", "Omer 78"]
        students = []
        for line in lines:
            parts = line.split()
            students.append({"name": parts[0], "score": int(parts[1])})
        print(students)
      `, { output: "[{'name': 'Dana', 'score': 91}, {'name': 'Omer', 'score': 78}]" }),
      p(
        'Each line of text becomes a dictionary: `split` cuts it into a name and a score, `int` turns the score into a number, and `append` adds the new record to the list.',
        'כל שורת טקסט הופכת למילון: `split` חותך אותה לשם ולציון, `int` הופך את הציון למספר, ו-`append` מוסיף את הרשומה החדשה לרשימה.',
      ),
    ],
    [
      h('A team and its players', 'קבוצה והשחקנים שלה'),
      code(py`
        team = {"name": "Foxes", "players": ["Dana", "Omer", "Lia"]}
        names = ", ".join(team["players"])
        print(f"{team['name']}: {names}")
        print(f"Players: {len(team['players'])}")
      `, { output: 'Foxes: Dana, Omer, Lia\nPlayers: 3' }),
      p(
        'A dictionary describes one team, and one of its values is a list. `", ".join(...)` turns that list into readable text with a comma and a space between the names.',
        'מילון מתאר קבוצה אחת, ואחד הערכים שלו הוא רשימה. `", ".join(...)` הופך את הרשימה לטקסט קריא עם פסיק ורווח בין השמות.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l27-hard',
    title: ['Group by team', 'קיבוץ לפי קבוצה'],
    mode: 'write',
    instructions: [
      p(
        'Write a function `by_team(players)`. `players` is a list of dictionaries with the keys `"name"` and `"team"`. Return a dictionary from each team to the list of its player names, in the order they appear. For example, for Dana (red), Omer (blue) and Lia (red) it returns `{\'red\': [\'Dana\', \'Lia\'], \'blue\': [\'Omer\']}`.',
        'כתבו פונקציה `by_team(players)`. `players` היא רשימה של מילונים עם המפתחות `"name"` ו-`"team"`. החזירו מילון מכל קבוצה לרשימת שמות השחקנים שלה, לפי סדר ההופעה שלהם. למשל, עבור Dana (red), Omer (blue) ו-Lia (red) היא מחזירה `{\'red\': [\'Dana\', \'Lia\'], \'blue\': [\'Omer\']}`.',
      ),
    ],
    starterCode: py`
      def by_team(players):
          teams = {}
          # for each player: if the team is already a key, append the name
          # to its list; otherwise create a new list holding the name
          return teams


      print(by_team([{"name": "Dana", "team": "red"}, {"name": "Omer", "team": "blue"}]))
    `,
    check: {
      tests: [
        functionTest(
          'by_team([{"name": "Dana", "team": "red"}, {"name": "Omer", "team": "blue"}, {"name": "Lia", "team": "red"}])',
          "{'red': ['Dana', 'Lia'], 'blue': ['Omer']}",
        ),
        functionTest('by_team([{"name": "Noa", "team": "green"}])', "{'green': ['Noa']}"),
        functionTest('by_team([])', '{}'),
      ],
    },
    hints: [
      ['Loop with `for player in players:` and read the team with `team = player["team"]`.', 'עברו בלולאה `for player in players:` וקראו את הקבוצה עם `team = player["team"]`.'],
      ['Check `if team in teams:` — if so, `teams[team].append(player["name"])`.', 'בדקו `if team in teams:` — אם כן, `teams[team].append(player["name"])`.'],
      ['In the `else` branch create the list: `teams[team] = [player["name"]]`.', 'בענף ה-`else` צרו את הרשימה: `teams[team] = [player["name"]]`.'],
    ],
    solution: py`
      def by_team(players):
          teams = {}
          for player in players:
              team = player["team"]
              if team in teams:
                  teams[team].append(player["name"])
              else:
                  teams[team] = [player["name"]]
          return teams


      print(by_team([{"name": "Dana", "team": "red"}, {"name": "Omer", "team": "blue"}]))
    `,
    concepts: ['nested-data', 'dictionary', 'append', 'in-operator', 'return'],
  }),

  predict: {
    code: py`
      words = "sun moon star".split()
      print(words[1])
      print(len(words))
      data = {"nums": [4, 5, 6]}
      data["nums"].append(7)
      print(data["nums"][-1])
      print("+".join(words))
    `,
    prompt: t('What does this program print? Write all four lines.', 'מה התוכנית הזאת תדפיס? כתבו את כל ארבע השורות.'),
    answer: 'moon\n3\n7\nsun+moon+star',
    explanation: t(
      'split gives ["sun", "moon", "star"], so index 1 is "moon" and the length is 3. data["nums"] is a list; after append its last item is 7. join puts a + between the words.',
      '`split` נותן ["sun", "moon", "star"], ולכן אינדקס 1 הוא "moon" והאורך הוא 3. `data["nums"]` הוא רשימה; אחרי `append` הפריט האחרון שלה הוא 7. `join` שם + בין המילים.',
    ),
  },

  exercise: exercise({
    id: 'l27-ex',
    title: ['Top students', 'התלמידים המצטיינים'],
    mode: 'write',
    instructions: [
      p(
        'The list `students` holds four records. Print the name of every student whose score is over 80, one per line and in the order of the list, and then print `Count: N`, where N is how many such students there were. Expected output:',
        'הרשימה `students` מחזיקה ארבע רשומות. הדפיסו את השם של כל תלמיד שהציון שלו מעל 80, אחד בכל שורה ולפי סדר הרשימה, ואז הדפיסו `Count: N`, כאשר N הוא מספר התלמידים האלה. הפלט הצפוי:',
      ),
      code('Dana\nLia\nCount: 2', { lang: 'text', runnable: false }),
    ],
    starterCode: py`
      students = [
          {"name": "Dana", "score": 91},
          {"name": "Omer", "score": 78},
          {"name": "Lia", "score": 85},
          {"name": "Noa", "score": 80},
      ]

      # loop over the students, print the names with a score over 80,
      # and count them
    `,
    check: {
      tests: [outputTest('Dana\nLia\nCount: 2')],
      requires: [requires('\\bfor\\b', 'Use a for loop over the list of students.', 'השתמשו בלולאת for על רשימת התלמידים.')],
    },
    hints: [
      ['Start a counter at 0 and loop with `for student in students:`.', 'התחילו מונה מ-0 ועברו בלולאה `for student in students:`.'],
      ['Inside the loop, `student["score"]` is the score of the current record. Compare it with 80.', 'בתוך הלולאה, `student["score"]` הוא הציון של הרשומה הנוכחית. השוו אותו ל-80.'],
      ['When the score is over 80, print `student["name"]` and add 1 to the counter. After the loop print `f"Count: {count}"`.', 'כשהציון מעל 80, הדפיסו את `student["name"]` והוסיפו 1 למונה. אחרי הלולאה הדפיסו `f"Count: {count}"`.'],
    ],
    solution: py`
      students = [
          {"name": "Dana", "score": 91},
          {"name": "Omer", "score": 78},
          {"name": "Lia", "score": 85},
          {"name": "Noa", "score": 80},
      ]

      count = 0
      for student in students:
          if student["score"] > 80:
              print(student["name"])
              count = count + 1
      print(f"Count: {count}")
    `,
    concepts: ['nested-data', 'for-each', 'key-value', 'accumulator'],
  }),

  build: exercise({
    id: 'l27-build',
    title: ['Word counter', 'מונה מילים'],
    mode: 'build',
    instructions: [
      p(
        'Build a word counter. Ask for a sentence (any prompt text) and split it into words. Print `Words: N` with the number of words. Then print each different word with the number of times it appears, as `word: count`, in the order the words first appear. For the sentence `the cat and the dog` the output is:',
        'בנו מונה מילים. בקשו משפט (טקסט הבקשה חופשי) ופצלו אותו למילים. הדפיסו `Words: N` עם מספר המילים. אחר כך הדפיסו כל מילה שונה עם מספר הפעמים שהיא מופיעה, בצורה `word: count`, לפי סדר ההופעה הראשונה של המילים. עבור המשפט `the cat and the dog` הפלט הוא:',
      ),
      code('Words: 5\nthe: 2\ncat: 1\nand: 1\ndog: 1', { lang: 'text', runnable: false }),
      p(
        'The counting pattern from the previous lesson — a dictionary and `.get(word, 0)` — does most of the work.',
        'תבנית הספירה מהשיעור הקודם — מילון ו-`.get(word, 0)` — עושה את רוב העבודה.',
      ),
    ],
    starterCode: py`
      sentence = input("Sentence: ")

      # 1. split the sentence into a list of words

      # 2. print Words: N

      # 3. count each word in a dictionary, then print "word: count" for each one
    `,
    sampleStdin: ['the cat and the dog'],
    check: {
      tests: [
        outputTest('Words: 5\nthe: 2\ncat: 1\nand: 1\ndog: 1', { stdin: ['the cat and the dog'] }),
        outputTest('Words: 5\na: 3\nb: 2', { stdin: ['a b a b a'] }),
      ],
      requires: [requires('\\.split\\(', 'Cut the sentence into words with .split().', 'חתכו את המשפט למילים בעזרת `.split()`.')],
    },
    hints: [
      ['`words = sentence.split()` gives the list of words, and `len(words)` is the count for the first line.', '`words = sentence.split()` נותן את רשימת המילים, ו-`len(words)` הוא המספר לשורה הראשונה.'],
      ['Create `counts = {}` and, for each word, `counts[word] = counts.get(word, 0) + 1`.', 'צרו `counts = {}` ולכל מילה, `counts[word] = counts.get(word, 0) + 1`.'],
      ['Finally loop `for word, count in counts.items():` and print `f"{word}: {count}"`.', 'לבסוף עברו בלולאה `for word, count in counts.items():` והדפיסו `f"{word}: {count}"`.'],
    ],
    solution: py`
      sentence = input("Sentence: ")
      words = sentence.split()
      print(f"Words: {len(words)}")

      counts = {}
      for word in words:
          counts[word] = counts.get(word, 0) + 1

      for word, count in counts.items():
          print(f"{word}: {count}")
    `,
    concepts: ['split-join', 'dict-get', 'dict-loop', 'for-each'],
  }),

  check: [
    choice(
      'l27-c1',
      ['`data = [{"x": 1}, {"x": 2}]`. What is `data[1]["x"]`?', '`data = [{"x": 1}, {"x": 2}]`. מה הערך של `data[1]["x"]`?'],
      [
        opt('2', '2', {
          correct: true,
          feedback: ['Right. data[1] is the second dictionary, and its "x" is 2.', 'נכון. data[1] הוא המילון השני, וה-"x" שלו הוא 2.'],
        }),
        opt('1', '1', {
          feedback: ['Index 1 is the second dictionary, not the first. Its "x" holds 2.', 'אינדקס 1 הוא המילון השני, לא הראשון. ה-"x" שלו מחזיק 2.'],
        }),
        opt('`{"x": 2}`', '`{"x": 2}`', {
          feedback: ['That is data[1] on its own. The ["x"] afterwards goes one step further and picks the value inside.', 'זה data[1] לבדו. ה-["x"] שאחריו הולך צעד אחד נוסף ובוחר את הערך שבפנים.'],
        }),
      ],
      ['nested-data'],
    ),
    choice(
      'l27-c2',
      ['What does `"a b c".split()` return?', 'מה מחזיר `"a b c".split()`?'],
      [
        opt("`['a', 'b', 'c']`", "`['a', 'b', 'c']`", {
          correct: true,
          feedback: ['Correct. split cuts at the spaces and gives a list of the pieces.', 'נכון. split חותך ברווחים ונותן רשימה של החלקים.'],
        }),
        opt('`"abc"`', '`"abc"`', {
          feedback: ['split does not remove the spaces from a string; it cuts the string into a list. Joining with "" would give "abc".', 'split לא מסיר את הרווחים ממחרוזת; הוא חותך את המחרוזת לרשימה. איחוד עם "" היה נותן "abc".'],
        }),
        opt('`3`', '`3`', {
          feedback: ['3 is the length of the result — len("a b c".split()) — not the result itself.', '3 הוא האורך של התוצאה — len("a b c".split()) — לא התוצאה עצמה.'],
        }),
      ],
      ['split-join'],
    ),
    choice(
      'l27-c3',
      ['A shop has 30 products. For each one you need its name, price and stock. Which structure fits best?', 'לחנות יש 30 מוצרים. לכל אחד אתם צריכים את השם, המחיר והמלאי שלו. איזה מבנה מתאים הכי טוב?'],
      [
        opt('A list of dictionaries, one dictionary per product', 'רשימה של מילונים, מילון אחד לכל מוצר', {
          correct: true,
          feedback: ['Yes: many things, each with labelled facts. You can loop over the products and reach each fact by name.', 'כן: הרבה דברים, לכל אחד עובדות עם תוויות. אפשר לעבור בלולאה על המוצרים ולהגיע לכל עובדה לפי שם.'],
        }),
        opt('One dictionary with 90 keys such as "price3" and "stock3"', 'מילון אחד עם 90 מפתחות כמו "price3" ו-"stock3"', {
          feedback: ['This mixes all the products together and makes looping over them very awkward.', 'זה מערבב את כל המוצרים יחד והופך לולאה עליהם למסורבלת מאוד.'],
        }),
        opt('Three separate lists: names, prices and stocks', 'שלוש רשימות נפרדות: שמות, מחירים ומלאים', {
          feedback: ['It can work, but the facts about one product are spread over three places and can easily get out of step. A record keeps them together.', 'זה יכול לעבוד, אבל העובדות על מוצר אחד מפוזרות בשלושה מקומות ויכולות בקלות לצאת מסנכרון. רשומה שומרת אותן יחד.'],
        }),
      ],
      ['choosing-structures'],
    ),
  ],

  recap: [
    list([
      ['A list of dictionaries is a table: each dictionary is a row, each key a column. Reach inside step by step: `students[0]["name"]`.', 'רשימה של מילונים היא טבלה: כל מילון הוא שורה, כל מפתח הוא עמודה. מגיעים פנימה צעד אחר צעד: `students[0]["name"]`.'],
      ['A dictionary can hold lists as values; `teams["blue"].append(...)` works like on any list.', 'מילון יכול להחזיק רשימות כערכים; `teams["blue"].append(...)` עובד כמו על כל רשימה.'],
      ['Loop over records with `for student in students:` and use `student["key"]` inside.', 'עברו על רשומות עם `for student in students:` והשתמשו ב-`student["key"]` בפנים.'],
      ['`text.split()` turns a string into a list of words; `" ".join(words)` turns it back.', '`text.split()` הופך מחרוזת לרשימה של מילים; `" ".join(words)` הופך אותה בחזרה.'],
      ['A list for similar things in order; a dictionary for labelled facts about one thing; a list of dictionaries for many things with labelled facts.', 'רשימה לדברים דומים לפי סדר; מילון לעובדות עם תוויות על דבר אחד; רשימה של מילונים להרבה דברים עם עובדות עם תוויות.'],
    ]),
    p(
      'With these shapes you can model almost anything: a class, a shop, a game inventory. Choosing the structure well is often the biggest part of solving a problem.',
      'עם הצורות האלה אפשר לתאר כמעט הכול: כיתה, חנות, מלאי במשחק. בחירה טובה של המבנה היא לעיתים קרובות החלק הגדול ביותר בפתרון של בעיה.',
    ),
  ],
  next: t(
    'In the module project you will build a quiz game from a list of question dictionaries — and the next module shows you how to handle the errors your programs will meet.',
    'בפרויקט המודול תבנו משחק חידון מרשימה של מילוני שאלות — והמודול הבא מראה לכם איך להתמודד עם השגיאות שהתוכניות שלכם יפגשו.',
  ),
};
