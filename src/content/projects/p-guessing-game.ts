import type { Project } from '../schema';
import { p, code, callout, t, outputTest, pythonTest, requires, py } from '../authoring';

/**
 * Input lines that finish any game regardless of the secret number: guess
 * 1, 2, 3, … 100 (one of them is right), then answer "no" to "play again".
 */
const ascending = Array.from({ length: 100 }, (_, i) => String(i + 1));
const finishAnyGame = [...ascending, 'no'];

export const project: Project = {
  id: 'p-guessing-game',
  moduleId: 'm4',
  title: t('The number guessing game', 'משחק ניחוש המספר'),
  tagline: t('The computer picks a secret number; you find it with as few guesses as you can.', 'המחשב בוחר מספר סודי; אתם מוצאים אותו בכמה שפחות ניחושים.'),
  description: [
    p(
      'You will build the classic guessing game. The computer secretly picks a number from 1 to 100. The player types guesses; after each one the computer says whether the guess is too low, too high or correct, and at the end it reports how many guesses were needed. A game might look like this:',
      'תבנו את משחק הניחושים הקלאסי. המחשב בוחר בסתר מספר מ-1 עד 100. השחקן מקליד ניחושים; אחרי כל ניחוש המחשב אומר אם הוא נמוך מדי, גבוה מדי או נכון, ובסוף הוא מדווח כמה ניחושים נדרשו. משחק יכול להיראות כך:',
    ),
    code(
      'I am thinking of a number between 1 and 100.\nYour guess: 50\nToo low\nYour guess: 75\nToo high\nYour guess: 62\nCorrect!\nYou got it in 3 guesses',
      { lang: 'text', runnable: false, caption: t('A sample game (the lines the player typed are shown after the prompts).', 'משחק לדוגמה (השורות שהשחקן הקליד מוצגות אחרי הבקשות).') },
    ),
    p(
      'You build the game in six steps. Each step adds one feature and has its own check, and the checks stay in force: the finished game must still pass every earlier step. Because the secret number is random, the checks play the game for you by guessing 1, 2, 3 … and 100, 99, 98 … and look at what your program answers.',
      'אתם בונים את המשחק בשישה שלבים. כל שלב מוסיף תכונה אחת ויש לו בדיקה משלו, והבדיקות נשארות בתוקף: המשחק המוגמר חייב עדיין לעבור כל שלב קודם. מכיוון שהמספר הסודי אקראי, הבדיקות משחקות את המשחק בשבילכם על ידי ניחוש 1, 2, 3 … ו-100, 99, 98 … ומסתכלות מה התוכנית שלכם עונה.',
    ),
    callout(
      'note',
      'The exact English messages matter, because the checks look for them: I am thinking of a number between 1 and 100. / Too low / Too high / Correct! / You got it in N guesses / Please guess between 1 and 100. The prompt texts of input() are up to you.',
      'ההודעות המדויקות באנגלית חשובות, כי הבדיקות מחפשות אותן: `I am thinking of a number between 1 and 100.` / `Too low` / `Too high` / `Correct!` / `You got it in N guesses` / `Please guess between 1 and 100`. טקסטי הבקשה של `input()` לבחירתכם.',
      t('Exact messages', 'הודעות מדויקות'),
    ),
  ],
  prerequisites: ['l15-while', 'l16-for-range', 'l17-accumulators', 'l19-random'],
  estimatedMinutes: 45,
  starterCode: py`
    # The number guessing game
    # Step 1: import random, pick a secret number from 1 to 100,
    #         and print the opening line

  `,
  sampleStdin: ['50', '75', '62', '68', '65', '66', '67'],
  steps: [
    /* ------------------------------------------------------------ step 1 */
    {
      id: 'step-1',
      title: t('Pick a secret number', 'בחירת מספר סודי'),
      instructions: [
        p(
          'Write `import random` at the top. Store a random whole number from 1 to 100 in a variable, for example `secret`, using `random.randint(1, 100)`. Then print exactly this line:',
          'כתבו `import random` בראש התוכנית. שמרו מספר שלם אקראי מ-1 עד 100 במשתנה, למשל `secret`, בעזרת `random.randint(1, 100)`. אחר כך הדפיסו בדיוק את השורה הזאת:',
        ),
        code('I am thinking of a number between 1 and 100.', { lang: 'text', runnable: false }),
        p(
          'Do not print the secret itself — that would spoil the game. If you want to peek while developing, print it on a separate line and remove that line before you finish.',
          'אל תדפיסו את המספר הסודי עצמו — זה יהרוס את המשחק. אם אתם רוצים להציץ בזמן הפיתוח, הדפיסו אותו בשורה נפרדת והסירו את השורה לפני שתסיימו.',
        ),
      ],
      check: {
        tests: [
          outputTest('I am thinking of a number between 1 and 100.', { stdin: finishAnyGame, match: 'contains' }),
          pythonTest(
            py`
              found = False
              for name, value in ns.items():
                  if name.startswith("_"):
                      continue
                  if isinstance(value, int) and not isinstance(value, bool) and 1 <= value <= 100:
                      found = True
              assert found, "Store the secret number in a variable, for example secret = random.randint(1, 100)."
            `,
            { stdin: finishAnyGame },
          ),
        ],
        requires: [
          requires('\\bimport\\s+random\\b', 'Start with import random.', 'התחילו ב-`import random`.'),
          requires('random\\.randint\\(\\s*1\\s*,\\s*100\\s*\\)', 'Pick the secret with random.randint(1, 100).', 'בחרו את המספר הסודי עם `random.randint(1, 100)`.'),
        ],
      },
      hints: [
        t('The import line comes first, then the variable, then the print.', 'שורת ה-import באה קודם, אחר כך המשתנה, ואז ה-print.'),
        t('`secret = random.randint(1, 100)` picks the number; both 1 and 100 are possible.', '`secret = random.randint(1, 100)` בוחר את המספר; גם 1 וגם 100 אפשריים.'),
        t('Copy the opening line exactly, including the full stop at the end.', 'העתיקו את שורת הפתיחה בדיוק, כולל הנקודה בסוף.'),
      ],
      referenceCode: py`
        import random

        secret = random.randint(1, 100)
        print("I am thinking of a number between 1 and 100.")
      `,
    },
    /* ------------------------------------------------------------ step 2 */
    {
      id: 'step-2',
      title: t('One guess', 'ניחוש אחד'),
      instructions: [
        p(
          'Read one guess from the player with `input()` (any prompt text) and turn it into a number with `int()`. Compare it with the secret and print exactly one of these: `Too low` if the guess is smaller than the secret, `Too high` if it is bigger, and `Correct!` if they are equal.',
          'קראו ניחוש אחד מהשחקן בעזרת `input()` (טקסט הבקשה חופשי) והפכו אותו למספר בעזרת `int()`. השוו אותו למספר הסודי והדפיסו בדיוק אחת מהאפשרויות: `Too low` אם הניחוש קטן מהמספר הסודי, `Too high` אם הוא גדול ממנו, ו-`Correct!` אם הם שווים.',
        ),
        p(
          'For now the game ends after a single guess; the loop comes in the next step.',
          'בינתיים המשחק מסתיים אחרי ניחוש יחיד; הלולאה מגיעה בשלב הבא.',
        ),
      ],
      check: {
        tests: [
          pythonTest(
            py`
              out = run(["1"])
              assert ("Too low" in out) or ("Correct!" in out), "For the guess 1, print Too low (or Correct! when the secret is 1)."
              assert "Too high" not in out, "A guess of 1 can never be too high."
              assert out.count("Too low") + out.count("Too high") + out.count("Correct!") == 1, "Print exactly one of Too low, Too high or Correct! for a guess."
              out = run(["100"])
              assert ("Too high" in out) or ("Correct!" in out), "For the guess 100, print Too high (or Correct! when the secret is 100)."
              assert "Too low" not in out, "A guess of 100 can never be too low."
              candidates = sorted({v for k, v in ns.items() if not k.startswith("_") and isinstance(v, int) and not isinstance(v, bool) and 1 <= v <= 100})
              assert any("Correct!" in run([str(c)]) for c in candidates), "When the guess equals the secret number, print Correct!."
            `,
            { stdin: finishAnyGame },
          ),
        ],
      },
      hints: [
        t('`guess = int(input("Your guess: "))` reads the guess as a number.', '`guess = int(input("Your guess: "))` קורא את הניחוש כמספר.'),
        t('Three cases need if, elif and else: smaller, bigger, equal.', 'שלושה מקרים דורשים if, elif ו-else: קטן יותר, גדול יותר, שווה.'),
        t('`if guess < secret:` print Too low; `elif guess > secret:` print Too high; `else:` print Correct!.', '`if guess < secret:` הדפיסו Too low; `elif guess > secret:` הדפיסו Too high; `else:` הדפיסו Correct!.'),
      ],
      referenceCode: py`
        import random

        secret = random.randint(1, 100)
        print("I am thinking of a number between 1 and 100.")

        guess = int(input("Your guess: "))
        if guess < secret:
            print("Too low")
        elif guess > secret:
            print("Too high")
        else:
            print("Correct!")
      `,
    },
    /* ------------------------------------------------------------ step 3 */
    {
      id: 'step-3',
      title: t('Keep guessing', 'להמשיך לנחש'),
      instructions: [
        p(
          'Wrap the guessing in a loop so the player can guess again and again until the guess is correct. A clean way: put the reading and the comparison inside `while True:`, and in the `Correct!` branch add `break` to leave the loop. Every guess gets exactly one answer.',
          'עטפו את הניחוש בלולאה כדי שהשחקן יוכל לנחש שוב ושוב עד שהניחוש נכון. דרך נקייה: שימו את הקריאה וההשוואה בתוך `while True:`, ובענף של `Correct!` הוסיפו `break` כדי לצאת מהלולאה. כל ניחוש מקבל בדיוק תשובה אחת.',
        ),
        p(
          'The check guesses 1, 2, 3 … and expects only `Too low` answers before `Correct!`; then it guesses 100, 99, 98 … and expects only `Too high` answers.',
          'הבדיקה מנחשת 1, 2, 3 … ומצפה רק לתשובות `Too low` לפני `Correct!`; אחר כך היא מנחשת 100, 99, 98 … ומצפה רק לתשובות `Too high`.',
        ),
      ],
      check: {
        tests: [
          pythonTest(
            py`
              asc = [str(i) for i in range(1, 101)]
              desc = [str(i) for i in range(100, 0, -1)]
              up = run(asc + ["no"])
              assert "Correct!" in up, "Guessing 1, 2, 3, ... must eventually reach the secret and print Correct!."
              assert "Too high" not in up, "Guessing upwards from 1 should never be too high."
              assert up.count("Correct!") == 1, "Stop asking once the guess is correct."
              down = run(desc + ["no"])
              assert "Correct!" in down, "Guessing 100, 99, 98, ... must eventually reach the secret and print Correct!."
              assert "Too low" not in down, "Guessing downwards from 100 should never be too low."
              assert up.count("Too low") + down.count("Too high") == 99, "Compare every new guess with the same secret and answer each guess exactly once."
            `,
            { stdin: finishAnyGame },
          ),
        ],
        requires: [requires('\\bwhile\\b', 'Use a while loop to keep asking.', 'השתמשו בלולאת while כדי להמשיך לשאול.')],
      },
      hints: [
        t('Everything from reading the guess to printing the answer goes inside the loop block.', 'כל מה שבין קריאת הניחוש להדפסת התשובה נכנס לתוך בלוק הלולאה.'),
        t('With `while True:` the loop only ends through `break`; put the `break` right after `print("Correct!")`.', 'עם `while True:` הלולאה מסתיימת רק דרך `break`; שימו את ה-`break` מיד אחרי `print("Correct!")`.'),
        t('Another correct shape: read the first guess before the loop and write `while guess != secret:`, reading the next guess at the end of the block.', 'צורה נכונה נוספת: קראו את הניחוש הראשון לפני הלולאה וכתבו `while guess != secret:`, עם קריאת הניחוש הבא בסוף הבלוק.'),
      ],
      referenceCode: py`
        import random

        secret = random.randint(1, 100)
        print("I am thinking of a number between 1 and 100.")

        while True:
            guess = int(input("Your guess: "))
            if guess < secret:
                print("Too low")
            elif guess > secret:
                print("Too high")
            else:
                print("Correct!")
                break
      `,
    },
    /* ------------------------------------------------------------ step 4 */
    {
      id: 'step-4',
      title: t('Count the guesses', 'ספירת הניחושים'),
      instructions: [
        p(
          'Count how many guesses the player needed. Create a counter before the loop, add one to it every time a guess is read, and after the loop print exactly `You got it in N guesses`, where N is the counter. The correct guess counts too, so a first-try win prints `You got it in 1 guesses`.',
          'ספרו כמה ניחושים השחקן צריך. צרו מונה לפני הלולאה, הוסיפו לו אחד בכל פעם שניחוש נקרא, ואחרי הלולאה הדפיסו בדיוק `You got it in N guesses`, כאשר N הוא המונה. גם הניחוש הנכון נספר, ולכן ניצחון בניסיון הראשון מדפיס `You got it in 1 guesses`.',
        ),
      ],
      check: {
        tests: [
          pythonTest(
            py`
              import re
              asc = [str(i) for i in range(1, 101)]
              desc = [str(i) for i in range(100, 0, -1)]
              up = run(asc + ["no"])
              m = re.search(r"You got it in (\d+) guesses", up)
              assert m, "After Correct!, print 'You got it in N guesses' with the number of guesses."
              assert up.index("Correct!") < up.index("You got it in"), "Print Correct! first and the guess count after it."
              assert int(m.group(1)) == up.count("Too low") + 1, "N must count every guess, including the correct one."
              down = run(desc + ["no"])
              m2 = re.search(r"You got it in (\d+) guesses", down)
              assert m2, "After Correct!, print 'You got it in N guesses'."
              assert int(m2.group(1)) == down.count("Too high") + 1, "N must count every guess, including the correct one."
            `,
            { stdin: finishAnyGame },
          ),
        ],
      },
      hints: [
        t('`guesses = 0` before the loop, `guesses += 1` right after reading each guess.', '`guesses = 0` לפני הלולאה, `guesses += 1` מיד אחרי קריאת כל ניחוש.'),
        t('The final message is printed once, after the loop, so it must not be indented inside the loop.', 'ההודעה הסופית מודפסת פעם אחת, אחרי הלולאה, ולכן היא לא יכולה להיות מוזחת בתוך הלולאה.'),
        t('The last line is `print(f"You got it in {guesses} guesses")`.', 'השורה האחרונה היא `print(f"You got it in {guesses} guesses")`.'),
      ],
      referenceCode: py`
        import random

        secret = random.randint(1, 100)
        print("I am thinking of a number between 1 and 100.")

        guesses = 0
        while True:
            guess = int(input("Your guess: "))
            guesses += 1
            if guess < secret:
                print("Too low")
            elif guess > secret:
                print("Too high")
            else:
                print("Correct!")
                break
        print(f"You got it in {guesses} guesses")
      `,
    },
    /* ------------------------------------------------------------ step 5 */
    {
      id: 'step-5',
      title: t('Only fair guesses', 'רק ניחושים הוגנים'),
      instructions: [
        p(
          'A guess like 0 or 150 makes no sense. If the guess is smaller than 1 or bigger than 100, print exactly `Please guess between 1 and 100`, do not say too low or too high, and do not count that guess. Then ask again. A `continue` right after the message skips the rest of the round.',
          'ניחוש כמו 0 או 150 לא הגיוני. אם הניחוש קטן מ-1 או גדול מ-100, הדפיסו בדיוק `Please guess between 1 and 100`, אל תגידו נמוך מדי או גבוה מדי, ואל תספרו את הניחוש הזה. אחר כך שאלו שוב. `continue` מיד אחרי ההודעה מדלג על שאר הסיבוב.',
        ),
        p(
          'Make sure the counting happens after the range check, so that only fair guesses are counted.',
          'ודאו שהספירה מתבצעת אחרי בדיקת הטווח, כך שרק ניחושים הוגנים נספרים.',
        ),
      ],
      check: {
        tests: [
          pythonTest(
            py`
              import re
              asc = [str(i) for i in range(1, 101)]
              out = run(["0", "150"] + asc + ["no"])
              assert out.count("Please guess between 1 and 100") == 2, "Print 'Please guess between 1 and 100' for each guess outside 1-100 (here 0 and 150)."
              assert "Too high" not in out, "Do not print Too high for a guess outside the range."
              m = re.search(r"You got it in (\d+) guesses", out)
              assert m, "Keep printing 'You got it in N guesses' at the end."
              assert int(m.group(1)) == out.count("Too low") + 1, "Guesses outside 1-100 must not be counted."
              only = run(["0"])
              assert "Please guess between 1 and 100" in only, "For the guess 0 print 'Please guess between 1 and 100'."
              assert "Too low" not in only and "Too high" not in only, "For a guess outside the range print only the 'Please guess' message."
            `,
            { stdin: finishAnyGame },
          ),
        ],
      },
      hints: [
        t('Check the range first, right after reading the guess: `if guess < 1 or guess > 100:`.', 'בדקו את הטווח קודם, מיד אחרי קריאת הניחוש: `if guess < 1 or guess > 100:`.'),
        t('Inside that if: print the message, then `continue`. The counter line must come after this if.', 'בתוך ה-if הזה: הדפיסו את ההודעה, ואז `continue`. שורת המונה חייבת לבוא אחרי ה-if הזה.'),
        t('Order inside the loop: read, range check with continue, `guesses += 1`, then the low / high / correct comparison.', 'הסדר בתוך הלולאה: קריאה, בדיקת טווח עם continue, `guesses += 1`, ואז ההשוואה נמוך / גבוה / נכון.'),
      ],
      referenceCode: py`
        import random

        secret = random.randint(1, 100)
        print("I am thinking of a number between 1 and 100.")

        guesses = 0
        while True:
            guess = int(input("Your guess: "))
            if guess < 1 or guess > 100:
                print("Please guess between 1 and 100")
                continue
            guesses += 1
            if guess < secret:
                print("Too low")
            elif guess > secret:
                print("Too high")
            else:
                print("Correct!")
                break
        print(f"You got it in {guesses} guesses")
      `,
    },
    /* ------------------------------------------------------------ step 6 */
    {
      id: 'step-6',
      title: t('Bonus: play again', 'בונוס: לשחק שוב'),
      instructions: [
        p(
          'After the win, ask the player whether to play again (any prompt text, for example `Play again? (yes/no)`). If the answer is exactly `yes`, start a whole new game: a new secret, the opening line again, and the guess counter back to 0. For any other answer print exactly `Goodbye` and stop.',
          'אחרי הניצחון, שאלו את השחקן אם לשחק שוב (טקסט הבקשה חופשי, למשל `Play again? (yes/no)`). אם התשובה היא בדיוק `yes`, התחילו משחק חדש לגמרי: מספר סודי חדש, שורת הפתיחה שוב, ומונה הניחושים חוזר ל-0. לכל תשובה אחרת הדפיסו בדיוק `Goodbye` ועצרו.',
        ),
        p(
          'This means an outer loop around the whole game: a loop inside a loop, exactly like the rows and columns of lesson 18.',
          'זה אומר לולאה חיצונית סביב כל המשחק: לולאה בתוך לולאה, בדיוק כמו השורות והעמודות של שיעור 18.',
        ),
      ],
      check: {
        tests: [
          pythonTest(
            py`
              import re
              asc = [str(i) for i in range(1, 101)]
              one = run(asc + ["no"])
              assert one.count("Correct!") == 1 and "Goodbye" in one, "After the win ask whether to play again; for an answer other than yes print Goodbye."
              assert one.strip().endswith("Goodbye"), "Goodbye must be the last line."
              n = one.count("Too low") + 1
              two = run(asc[:n] + ["yes"] + asc + ["no"])
              assert two.count("I am thinking of a number between 1 and 100.") == 2, "After yes, start a new game and print the opening line again."
              assert two.count("Correct!") == 2, "After yes, play a whole new round until the new secret is guessed."
              assert two.count("Goodbye") == 1, "Print Goodbye once, when the player does not answer yes."
              ms = re.findall(r"You got it in (\d+) guesses", two)
              assert len(ms) == 2, "Print 'You got it in N guesses' after each round."
              assert int(ms[1]) == two.count("Too low") - (int(ms[0]) - 1) + 1, "Reset the guess counter to 0 when a new game starts."
            `,
            { stdin: finishAnyGame },
          ),
        ],
      },
      hints: [
        t('Put the whole game (secret, opening line, counter, guessing loop, final message) inside another `while True:`.', 'שימו את כל המשחק (מספר סודי, שורת פתיחה, מונה, לולאת הניחושים, הודעה סופית) בתוך `while True:` נוסף.'),
        t('At the end of the outer block: `again = input("Play again? (yes/no) ")`, then `if again != "yes":` print Goodbye and `break`.', 'בסוף הבלוק החיצוני: `again = input("Play again? (yes/no) ")`, ואז `if again != "yes":` הדפיסו Goodbye ו-`break`.'),
        t('Because the secret and the counter are created inside the outer loop, every new round starts fresh automatically.', 'מכיוון שהמספר הסודי והמונה נוצרים בתוך הלולאה החיצונית, כל סיבוב חדש מתחיל נקי באופן אוטומטי.'),
      ],
      referenceCode: py`
        import random

        while True:
            secret = random.randint(1, 100)
            print("I am thinking of a number between 1 and 100.")

            guesses = 0
            while True:
                guess = int(input("Your guess: "))
                if guess < 1 or guess > 100:
                    print("Please guess between 1 and 100")
                    continue
                guesses += 1
                if guess < secret:
                    print("Too low")
                elif guess > secret:
                    print("Too high")
                else:
                    print("Correct!")
                    break
            print(f"You got it in {guesses} guesses")

            again = input("Play again? (yes/no) ")
            if again != "yes":
                print("Goodbye")
                break
      `,
    },
  ],
  extensions: [
    t(
      'Limit the player to 7 guesses. If they run out, print the secret and end the game. (Seven is enough to find any number from 1 to 100 if you always guess the middle — try it.)',
      'הגבילו את השחקן ל-7 ניחושים. אם הם נגמרים, הדפיסו את המספר הסודי וסיימו את המשחק. (שבעה מספיקים כדי למצוא כל מספר מ-1 עד 100 אם תמיד מנחשים את האמצע — נסו.)',
    ),
    t(
      'Add a hint: when the guess is within 5 of the secret, print "Very close" in addition to Too low or Too high.',
      'הוסיפו רמז: כשהניחוש במרחק של עד 5 מהמספר הסודי, הדפיסו "Very close" בנוסף ל-Too low או Too high.',
    ),
    t(
      'Let the player choose the range at the start, for example 1 to 1000, and use it in the opening line and the range check.',
      'תנו לשחקן לבחור את הטווח בהתחלה, למשל 1 עד 1000, והשתמשו בו בשורת הפתיחה ובבדיקת הטווח.',
    ),
    t(
      'Keep a best score across rounds: remember the smallest number of guesses so far and print it after every game.',
      'שמרו שיא לאורך הסיבובים: זכרו את מספר הניחושים הקטן ביותר עד כה והדפיסו אותו אחרי כל משחק.',
    ),
    t(
      'Reverse the roles: you think of a number and the computer guesses, always picking the middle of what is still possible while you answer "low", "high" or "yes".',
      'הפכו את התפקידים: אתם חושבים על מספר והמחשב מנחש, תמיד בוחר את האמצע של מה שעדיין אפשרי בזמן שאתם עונים "low", "high" או "yes".',
    ),
  ],
  concepts: [
    'import',
    'random-randint',
    'input',
    'type-conversion',
    'if',
    'elif',
    'else',
    'comparison',
    'or',
    'while',
    'break',
    'continue',
    'counter',
    'nested-loop',
    'f-string',
    'print',
    'variable',
  ],
};
