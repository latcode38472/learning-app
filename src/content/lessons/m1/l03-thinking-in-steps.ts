import type { Lesson } from '../../schema';
import {
  p,
  h,
  code,
  list,
  callout,
  term,
  t,
  opt,
  choice,
  exercise,
  outputTest,
  pythonTest,
  py,
} from '../../authoring';

export const lesson: Lesson = {
  id: 'l03-thinking-in-steps',
  moduleId: 'm1',
  title: t('Thinking in steps', 'לחשוב בצעדים'),
  tagline: t('Precise instructions, one small step at a time.', 'הוראות מדויקות, צעד קטן אחד בכל פעם.'),
  estimatedMinutes: 20,
  introduces: ['algorithm', 'precision', 'step-by-step'],
  requires: ['print-basic', 'sequence'],
  runsInBrowser: true,

  objective: t(
    'Break a task into small, precise steps that a computer could follow, and write them as a program.',
    'לפרק משימה לצעדים קטנים ומדויקים שמחשב יוכל לבצע, ולכתוב אותם בתור תוכנית.',
  ),
  prerequisiteCheck: t(
    'You can print several lines and you know they run from top to bottom (lessons 1–2).',
    'אתם יודעים להדפיס כמה שורות ויודעים שהן מתבצעות מלמעלה למטה (שיעורים 1–2).',
  ),

  explanation: [
    p(
      'Before writing any code, programmers do something that has nothing to do with computers: they break a task into steps. A precise list of steps that gets a job done is called an **algorithm**. A recipe is an algorithm. Directions to a friend\'s house are an algorithm. A program is an algorithm written in a language the computer understands.',
      'לפני שכותבים קוד, מתכנתים עושים משהו שלא קשור בכלל למחשבים: הם מפרקים משימה לצעדים. רשימה מדויקת של צעדים שמבצעת עבודה נקראת **אלגוריתם** (algorithm). מתכון הוא אלגוריתם. הסבר איך מגיעים לבית של חבר הוא אלגוריתם. תוכנית היא אלגוריתם שכתוב בשפה שהמחשב מבין.',
    ),
    term(
      'algorithm',
      'A list of steps that is precise enough to follow without thinking, and that finishes the job. Every step must be clear, and the order must be right.',
      'רשימת צעדים שמדויקת מספיק כדי לבצע אותה בלי לחשוב, ושמסיימת את העבודה. כל צעד חייב להיות ברור, והסדר חייב להיות נכון.',
    ),
    h('The very literal robot', 'הרובוט המילולי'),
    p(
      'Imagine a robot that makes sandwiches. You tell it: "Put the cheese on the bread." It puts the whole block of cheese, still wrapped, on top of the closed bag of bread. It did what you said. It did not do what you meant. To get a sandwich you would have to say: take one slice of bread out of the bag; put it on the plate; open the cheese; take one slice of cheese; put it on the bread; take a second slice of bread; put it on top.',
      'דמיינו רובוט שמכין כריכים. אתם אומרים לו: "שים את הגבינה על הלחם." הוא מניח את כל חבילת הגבינה, עדיין עטופה, על שקית הלחם הסגורה. הוא עשה מה שאמרתם. הוא לא עשה מה שהתכוונתם. כדי לקבל כריך תצטרכו להגיד: הוצא פרוסת לחם אחת מהשקית; הנח אותה על הצלחת; פתח את הגבינה; קח פרוסת גבינה אחת; שים אותה על הלחם; קח פרוסת לחם שנייה; הנח אותה מלמעלה.',
    ),
    p(
      'Computers are that robot. They need **precision**: every step spelled out, in the right order, with nothing left to guess. This is not because computers are stupid. It is because they have no idea what you meant — only what you wrote.',
      'מחשבים הם הרובוט הזה. הם צריכים **דיוק** (precision): כל צעד כתוב במפורש, בסדר הנכון, בלי שום דבר שצריך לנחש. זה לא בגלל שמחשבים טיפשים. זה בגלל שאין להם מושג למה התכוונתם — רק מה כתבתם.',
    ),
    callout(
      'why',
      'Why bother with tiny steps? Because a step that is small and clear either works or clearly fails. A step like "make it nice" cannot be followed and cannot be checked. Small steps are also easier to fix: when something goes wrong, you know which step to look at.',
      'למה לטרוח עם צעדים זעירים? כי צעד קטן וברור או שעובד או שנכשל בבירור. צעד כמו "תעשה שיהיה יפה" אי אפשר לבצע ואי אפשר לבדוק. צעדים קטנים גם קל יותר לתקן: כשמשהו משתבש, יודעים על איזה צעד להסתכל.',
      t('Why small steps?', 'למה צעדים קטנים?'),
    ),
    h('Breaking a task into steps', 'לפרק משימה לצעדים'),
    list([
      ['Say what the finished result should be. (A cup of tea on the table.)', 'אמרו מה צריכה להיות התוצאה הסופית. (כוס תה על השולחן.)'],
      ['List the steps in the order they must happen. (Boil water, put a tea bag in the cup, pour the water, wait, take the bag out.)', 'רשמו את הצעדים בסדר שבו הם חייבים לקרות. (להרתיח מים, לשים שקית תה בכוס, למזוג את המים, לחכות, להוציא את השקית.)'],
      ['Check each step: is it small enough to do without thinking? If not, split it.', 'בדקו כל צעד: האם הוא קטן מספיק כדי לבצע אותו בלי לחשוב? אם לא, פצלו אותו.'],
      ['Check the order: does any step need something that only comes later? Then move it.', 'בדקו את הסדר: האם צעד כלשהו צריך משהו שמגיע רק אחר כך? אם כן, הזיזו אותו.'],
    ], true),
    p(
      'Right now your only Python instruction is `print`, so your programs will **describe** steps rather than perform them. That is fine: the thinking is the same, and the top-to-bottom rule from lesson 2 makes the order visible.',
      'כרגע הפקודה היחידה שאתם מכירים בפייתון היא `print`, ולכן התוכניות שלכם **יתארו** צעדים במקום לבצע אותם. זה בסדר גמור: החשיבה זהה, וכלל "מלמעלה למטה" משיעור 2 הופך את הסדר לגלוי.',
    ),
    code(py`
      print("Boil water")
      print("Put a tea bag in the cup")
      print("Pour the water into the cup")
      print("Wait three minutes")
      print("Take the tea bag out")
    `, { output: 'Boil water\nPut a tea bag in the cup\nPour the water into the cup\nWait three minutes\nTake the tea bag out' }),
  ],

  simpler: [
    p(
      'Think of explaining to a small child how to brush their teeth. "Brush your teeth" is not enough. You say: take the toothbrush, put a little toothpaste on it, brush the top teeth, brush the bottom teeth, rinse your mouth. Small steps, in order.',
      'דמיינו שאתם מסבירים לילד קטן איך לצחצח שיניים. "תצחצח שיניים" לא מספיק. אתם אומרים: קח את מברשת השיניים, שים עליה קצת משחה, צחצח את השיניים העליונות, צחצח את התחתונות, שטוף את הפה. צעדים קטנים, לפי הסדר.',
    ),
    p(
      'A computer needs that kind of explanation for everything, every time. It never remembers "what you usually mean" and it never fills in a missing step.',
      'מחשב צריך הסבר כזה לכל דבר, בכל פעם. הוא אף פעם לא זוכר "למה אתם בדרך כלל מתכוונים" ואף פעם לא משלים צעד שחסר.',
    ),
    p(
      'So before you write code, write the steps in plain words. If the list would work for a very literal robot, it is ready to become a program.',
      'לכן לפני שכותבים קוד, כתבו את הצעדים במילים פשוטות. אם הרשימה תעבוד בשביל רובוט מילולי מאוד, היא מוכנה להפוך לתוכנית.',
    ),
  ],

  workedExample: [
    p(
      'Let us build the steps for crossing the street, then turn them into a program. First, in plain words:',
      'בואו נבנה את הצעדים לחציית כביש, ואז נהפוך אותם לתוכנית. קודם כול, במילים פשוטות:',
    ),
    list([
      ['Stop at the edge of the road.', 'עצרו בשפת הכביש.'],
      ['Look left, then right, then left again.', 'הסתכלו שמאלה, אחר כך ימינה, ואז שוב שמאלה.'],
      ['Wait until no cars are coming.', 'חכו עד שאף מכונית לא מתקרבת.'],
      ['Walk straight across.', 'חצו בהליכה ישר.'],
    ], true),
    p(
      'Is every step small and clear? "Look both ways" was too vague, so it became "left, then right, then left again". Is the order right? Looking comes before walking — yes. Now the program is simply those steps, one print per step:',
      'האם כל צעד קטן וברור? "הסתכלו לשני הכיוונים" היה מעורפל מדי, ולכן הוא הפך ל"שמאלה, אחר כך ימינה, ואז שוב שמאלה". האם הסדר נכון? מסתכלים לפני שהולכים — כן. עכשיו התוכנית היא פשוט הצעדים האלה, `print` אחד לכל צעד:',
    ),
    code(py`
      print("Stop at the edge of the road")
      print("Look left, then right, then left again")
      print("Wait until no cars are coming")
      print("Walk straight across")
    `, { output: 'Stop at the edge of the road\nLook left, then right, then left again\nWait until no cars are coming\nWalk straight across' }),
    p(
      'Four lines, four steps, in order. Later, when you know more Python, steps like "wait until" will become real instructions the computer can perform. The way of thinking stays the same.',
      'ארבע שורות, ארבעה צעדים, לפי הסדר. בהמשך, כשתכירו יותר פייתון, צעדים כמו "חכו עד ש" יהפכו להוראות אמיתיות שהמחשב יכול לבצע. דרך החשיבה נשארת אותו דבר.',
    ),
  ],

  moreExamples: [
    [
      h('Too vague, then precise', 'מעורפל מדי, ואז מדויק'),
      p(
        'A vague algorithm: "Make a phone call." A precise one:',
        'אלגוריתם מעורפל: "תתקשר." אלגוריתם מדויק:',
      ),
      code(py`
        print("Unlock the phone")
        print("Open the phone app")
        print("Type the number")
        print("Press the green button")
        print("Wait for an answer")
      `, { output: 'Unlock the phone\nOpen the phone app\nType the number\nPress the green button\nWait for an answer' }),
      p(
        'Each step is something you could do without thinking. That is the test of a precise step.',
        'כל צעד הוא משהו שאפשר לעשות בלי לחשוב. זה המבחן של צעד מדויק.',
      ),
    ],
    [
      h('The order can make a step impossible', 'הסדר יכול להפוך צעד לבלתי אפשרי'),
      code(py`
        print("Put on shoes")
        print("Put on socks")
      `, { output: 'Put on shoes\nPut on socks' }),
      p(
        'Both steps are precise, and the robot would do exactly this: socks over shoes. Precision is not enough; the order matters too. Move the socks line to the top and the algorithm works.',
        'שני הצעדים מדויקים, והרובוט יעשה בדיוק את זה: גרביים מעל הנעליים. דיוק לבדו לא מספיק; גם הסדר חשוב. העבירו את שורת הגרביים למעלה והאלגוריתם יעבוד.',
      ),
    ],
  ],

  harderChallenge: exercise({
    id: 'l03-hard',
    title: ['Numbered steps', 'צעדים ממוספרים'],
    mode: 'write',
    instructions: [
      p(
        'Write the steps for washing your hands as 4 to 6 lines. Each line must start with its number and a dot, like `1. Turn on the tap`, and the numbers must go in order. Somewhere in the steps, in this order, the words `tap`, `soap`, `rinse` and `dry` must appear. The first step is already written.',
        'כתבו את הצעדים לשטיפת ידיים ב-4 עד 6 שורות. כל שורה חייבת להתחיל במספר שלה ונקודה, למשל `1. Turn on the tap`, והמספרים חייבים להיות לפי הסדר. איפשהו בצעדים, ובסדר הזה, חייבות להופיע המילים `tap`, `soap`, `rinse` ו-`dry`. הצעד הראשון כבר כתוב.',
      ),
    ],
    starterCode: py`
      print("1. Turn on the tap")
    `,
    check: {
      tests: [
        pythonTest(
          py`
            lines = [l.strip() for l in stdout.strip().split("\n") if l.strip()]
            assert 4 <= len(lines) <= 6, "Print between 4 and 6 lines (you printed " + str(len(lines)) + ")."
            for i, line in enumerate(lines):
                assert line.startswith(str(i + 1) + "."), "Line " + str(i + 1) + " must start with " + str(i + 1) + ". (the number and a dot)."
            text = stdout.lower()
            pos = 0
            for word in ("tap", "soap", "rinse", "dry"):
                found = text.find(word, pos)
                assert found != -1, "The word '" + word + "' must appear after the earlier words. Order: tap, soap, rinse, dry."
                pos = found + len(word)
          `,
        ),
      ],
    },
    hints: [
      ['Water first, then soap, then rinse the soap off, then dry. Write one line for each.', 'קודם מים, אחר כך סבון, אחר כך שוטפים את הסבון, ואז מייבשים. כתבו שורה לכל אחד.'],
      ['The number and the dot are part of the text inside the quotation marks: `print("2. Wet your hands")`.', 'המספר והנקודה הם חלק מהטקסט שבתוך המירכאות: `print("2. Wet your hands")`.'],
      ['For example: `2. Wet your hands`, `3. Rub soap on your hands`, `4. Rinse the soap off`, `5. Dry your hands`.', 'למשל: `2. Wet your hands`, `3. Rub soap on your hands`, `4. Rinse the soap off`, `5. Dry your hands`.'],
    ],
    solution: py`
      print("1. Turn on the tap")
      print("2. Wet your hands")
      print("3. Rub soap on your hands")
      print("4. Rinse the soap off")
      print("5. Dry your hands with a towel")
    `,
    concepts: ['algorithm', 'precision', 'step-by-step'],
  }),

  predict: {
    code: py`
      print("Eat the toast")
      print("Put bread in the toaster")
      print("Wait one minute")
    `,
    prompt: t('What does the computer do with this program?', 'מה המחשב עושה עם התוכנית הזאת?'),
    options: [
      opt('It prints exactly these three lines, in the written order, even though eating comes first.', 'הוא מדפיס בדיוק את שלוש השורות האלה, בסדר שבו הן כתובות, למרות שהאכילה באה ראשונה.', {
        correct: true,
        feedback: ['Right. The computer follows the lines as written. Whether the order makes sense is your job.', 'נכון. המחשב מבצע את השורות כפי שהן כתובות. אם הסדר הגיוני — זה התפקיד שלכם.'],
      }),
      opt('It rearranges the lines into the sensible order and prints that.', 'הוא מסדר מחדש את השורות לסדר ההגיוני ומדפיס אותו.', {
        feedback: ['The computer has no idea what "sensible" means here. It never changes the order of your lines.', 'למחשב אין מושג מה "הגיוני" כאן. הוא אף פעם לא משנה את סדר השורות שלכם.'],
      }),
      opt('It stops with an error because the order makes no sense.', 'הוא עוצר עם שגיאה כי הסדר לא הגיוני.', {
        feedback: ['Each line is a correct print, so there is no error. Python checks spelling and symbols, not meaning.', 'כל שורה היא `print` תקין, ולכן אין שגיאה. פייתון בודק כתיב וסימנים, לא משמעות.'],
      }),
    ],
    explanation: t(
      'All three lines are valid, so Python prints them in the order written: Eat the toast, Put bread in the toaster, Wait one minute. The computer does not know that this order is silly. Getting the order right is the programmer\'s job.',
      'שלוש השורות תקינות, ולכן פייתון מדפיס אותן בסדר שבו נכתבו: Eat the toast, Put bread in the toaster, Wait one minute. המחשב לא יודע שהסדר הזה מגוחך. לדאוג לסדר הנכון זה התפקיד של המתכנת.',
    ),
  },

  exercise: exercise({
    id: 'l03-ex',
    title: ['Tea, in the right order', 'תה, בסדר הנכון'],
    mode: 'fix',
    instructions: [
      p(
        'The program below has the five steps for making tea, but the lines are in the wrong order. Move the lines (do not change their text) so that the output is exactly:',
        'בתוכנית שלמטה יש חמשת הצעדים להכנת תה, אבל השורות בסדר הלא נכון. הזיזו את השורות (בלי לשנות את הטקסט שלהן) כך שהפלט יהיה בדיוק:',
      ),
      code('Boil water\nPut a tea bag in the cup\nPour the water into the cup\nWait three minutes\nTake the tea bag out', { lang: 'text', runnable: false }),
    ],
    starterCode: py`
      print("Wait three minutes")
      print("Boil water")
      print("Take the tea bag out")
      print("Pour the water into the cup")
      print("Put a tea bag in the cup")
    `,
    check: {
      tests: [outputTest('Boil water\nPut a tea bag in the cup\nPour the water into the cup\nWait three minutes\nTake the tea bag out')],
    },
    hints: [
      ['What must happen before you can pour the water? That line has to come first.', 'מה חייב לקרות לפני שאפשר למזוג את המים? השורה הזאת צריכה להיות ראשונה.'],
      ['The order is: boil, put the bag in, pour, wait, take the bag out.', 'הסדר הוא: להרתיח, לשים את השקית, למזוג, לחכות, להוציא את השקית.'],
      ['Move `print("Boil water")` to the top and `print("Take the tea bag out")` to the bottom, then fix the middle three.', 'העבירו את `print("Boil water")` לראש התוכנית ואת `print("Take the tea bag out")` לסופה, ואז סדרו את שלוש השורות באמצע.'],
    ],
    solution: py`
      print("Boil water")
      print("Put a tea bag in the cup")
      print("Pour the water into the cup")
      print("Wait three minutes")
      print("Take the tea bag out")
    `,
    concepts: ['algorithm', 'step-by-step', 'sequence'],
  }),

  build: exercise({
    id: 'l03-build',
    title: ['Making toast', 'להכין טוסט'],
    mode: 'build',
    instructions: [
      p(
        'Write the steps for making toast as a program: 4 to 6 printed lines, one step per line, in the order a very literal robot would need them. Your steps must mention these words, in this order: `bread`, `toaster`, `wait`, `butter`. The other words are up to you (English letters). The first step is already written.',
        'כתבו את הצעדים להכנת טוסט בתור תוכנית: 4 עד 6 שורות מודפסות, צעד אחד בכל שורה, בסדר שרובוט מילולי מאוד היה צריך אותם. הצעדים שלכם חייבים להזכיר את המילים האלה, בסדר הזה: `bread`, `toaster`, `wait`, `butter`. שאר המילים לבחירתכם (באותיות אנגליות). הצעד הראשון כבר כתוב.',
      ),
    ],
    starterCode: py`
      print("Take a slice of bread")
    `,
    check: {
      tests: [
        pythonTest(
          py`
            lines = [l.strip() for l in stdout.strip().split("\n") if l.strip()]
            assert 4 <= len(lines) <= 6, "Print between 4 and 6 lines, one step per line (you printed " + str(len(lines)) + ")."
            text = stdout.lower()
            pos = 0
            for word in ("bread", "toaster", "wait", "butter"):
                found = text.find(word, pos)
                assert found != -1, "The word '" + word + "' must appear after the earlier words. Order: bread, toaster, wait, butter."
                pos = found + len(word)
          `,
        ),
      ],
    },
    hints: [
      ['Think like the robot: the bread has to go into the toaster before you can wait for it, and the butter comes last.', 'חשבו כמו הרובוט: הלחם חייב להיכנס לטוסטר לפני שאפשר לחכות לו, והחמאה באה בסוף.'],
      ['One print per step, for example `print("Put the bread in the toaster")`.', 'שורת `print` אחת לכל צעד, למשל `print("Put the bread in the toaster")`.'],
      ['A possible order: take bread, put it in the toaster, wait until it pops up, spread butter on it.', 'סדר אפשרי: לקחת לחם, לשים אותו בטוסטר, לחכות עד שהוא קופץ, למרוח עליו חמאה.'],
    ],
    solution: py`
      print("Take a slice of bread")
      print("Put the bread in the toaster")
      print("Wait until the toast pops up")
      print("Spread butter on the toast")
      print("Eat it")
    `,
    solutionNote: [
      'Any wording passes as long as the four key words appear in the right order and there are 4 to 6 lines.',
      'כל ניסוח עובר, כל עוד ארבע מילות המפתח מופיעות בסדר הנכון ויש 4 עד 6 שורות.',
    ],
    concepts: ['algorithm', 'precision', 'step-by-step'],
  }),

  check: [
    choice(
      'l03-c1',
      ['What is an algorithm?', 'מהו אלגוריתם?'],
      [
        opt('A precise list of steps that completes a task.', 'רשימה מדויקת של צעדים שמשלימה משימה.', {
          correct: true,
          feedback: ['Right. Recipes, directions and programs are all algorithms.', 'נכון. מתכונים, הוראות הגעה ותוכניות הם כולם אלגוריתמים.'],
        }),
        opt('A part inside the computer.', 'חלק בתוך המחשב.', {
          feedback: ['An algorithm is an idea, not a part. It exists on paper before any computer sees it.', 'אלגוריתם הוא רעיון, לא חלק פיזי. הוא קיים על הנייר עוד לפני שמחשב כלשהו רואה אותו.'],
        }),
        opt('Any text that a program prints.', 'כל טקסט שתוכנית מדפיסה.', {
          feedback: ['Printed text is output. The algorithm is the list of steps that produced it.', 'טקסט מודפס הוא פלט. האלגוריתם הוא רשימת הצעדים שיצרה אותו.'],
        }),
      ],
      ['algorithm'],
    ),
    choice(
      'l03-c2',
      ['You tell a very literal robot: "Put the cheese on the bread." What will it do?', 'אתם אומרים לרובוט מילולי מאוד: "שים את הגבינה על הלחם." מה הוא יעשה?'],
      [
        opt('Exactly what the words say — perhaps put the whole packet on the closed bag.', 'בדיוק מה שהמילים אומרות — אולי יניח את כל החבילה על השקית הסגורה.', {
          correct: true,
          feedback: ['Right. It follows the words, not the intention. That is why steps must be precise.', 'נכון. הוא מבצע את המילים, לא את הכוונה. לכן הצעדים חייבים להיות מדויקים.'],
        }),
        opt('Make a sandwich, because that is obviously what you meant.', 'יכין כריך, כי ברור שלזה התכוונתם.', {
          feedback: ['Nothing is obvious to the robot. It has no idea what you meant, only what you said.', 'שום דבר לא ברור לרובוט. אין לו מושג למה התכוונתם, רק מה אמרתם.'],
        }),
        opt('Ask you what you mean.', 'ישאל אתכם למה אתם מתכוונים.', {
          feedback: ['A computer never asks on its own. Some programs do ask questions, but only because a programmer wrote that step too.', 'מחשב אף פעם לא שואל מעצמו. יש תוכניות ששואלות שאלות, אבל רק כי מתכנת כתב גם את הצעד הזה.'],
        }),
      ],
      ['precision'],
    ),
    choice(
      'l03-c3',
      ['Which step is precise enough for the robot?', 'איזה צעד מדויק מספיק בשביל הרובוט?'],
      [
        opt('"Take one slice of bread out of the bag."', '"הוצא פרוסת לחם אחת מהשקית."', {
          correct: true,
          feedback: ['Right. It says what, how many, and from where. Nothing is left to guess.', 'נכון. הוא אומר מה, כמה, ומאיפה. שום דבר לא נשאר לניחוש.'],
        }),
        opt('"Get some bread ready."', '"תכין קצת לחם."', {
          feedback: ['How much is "some"? What does "ready" mean? The robot cannot follow this.', 'כמה זה "קצת"? מה זה "מוכן"? הרובוט לא יכול לבצע את זה.'],
        }),
        opt('"Do the bread part."', '"תעשה את החלק של הלחם."', {
          feedback: ['This names a goal, not a step. It must be broken into things the robot can actually do.', 'זה שם של מטרה, לא צעד. צריך לפרק אותו לדברים שהרובוט באמת יכול לעשות.'],
        }),
      ],
      ['step-by-step'],
    ),
  ],

  recap: [
    list([
      ['An algorithm is a precise list of steps that completes a task.', 'אלגוריתם הוא רשימה מדויקת של צעדים שמשלימה משימה.'],
      ['Computers do what you say, not what you mean, so every step must be spelled out.', 'מחשבים עושים מה שאתם אומרים, לא מה שאתם מתכוונים, ולכן כל צעד חייב להיות כתוב במפורש.'],
      ['Break big tasks into small steps; a good step can be done without thinking.', 'פרקו משימות גדולות לצעדים קטנים; צעד טוב אפשר לבצע בלי לחשוב.'],
      ['Precision is not enough: the order has to be right too.', 'דיוק לבדו לא מספיק: גם הסדר חייב להיות נכון.'],
    ]),
    p(
      'Writing the steps in plain words first is a habit that experienced programmers keep for their whole career. The code comes after the thinking.',
      'לכתוב קודם את הצעדים במילים פשוטות הוא הרגל שמתכנתים מנוסים שומרים עליו לאורך כל הקריירה. הקוד מגיע אחרי החשיבה.',
    ),
  ],
  next: t(
    'Next you will meet your first bug: what happens when a line is not precise enough for Python, and how to read the message it gives you.',
    'בשיעור הבא תפגשו את הבאג הראשון שלכם: מה קורה כששורה לא מדויקת מספיק בשביל פייתון, ואיך קוראים את ההודעה שהוא נותן לכם.',
  ),
};
