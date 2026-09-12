import type { Project, ProjectStep } from '../schema';
import { p, code, callout, list, t, pythonTest, requires, py } from '../authoring';

/**
 * The growing project. One text adventure that starts with three printed
 * lines after lesson 5 and ends, after module 6, as a playable game with
 * rooms, a loop, choices, a counter, functions, an inventory and a locked
 * door. Every step opens when its lesson is learned (`requires`).
 *
 * Personal choices are the point: the story, room names, item names and all
 * messages are the learner's own and may be in any language. The checks look
 * at structure and behaviour only. Command words (quit, look, take, north …)
 * are fixed English words, like in most games, so the checks can play.
 *
 * Reference code is cumulative: each step's referenceCode is the whole
 * program at that point, and the final one passes every step's check.
 */

/* ------------------------------------------------------------------ reference programs */

const ref1 = py`
  # My text adventure
  print("The Lighthouse Mystery")
  print()
  print("A storm is coming. The old lighthouse on the cliff has gone dark.")
  print("Someone has to climb up and light the lamp before the ships arrive.")
  print("That someone is you.")
`;

const ref2 = py`
  # My text adventure
  title = "The Lighthouse Mystery"
  hero = "Dana"
  place = "the cliff path"
  health = 10

  print(title)
  print()
  print("A storm is coming. The old lighthouse on the cliff has gone dark.")
  print("Someone has to climb up and light the lamp before the ships arrive.")
  print("That someone is", hero)
  print("You are standing on", place)
  print("Health:", health)
`;

const ref3 = py`
  # My text adventure
  title = "The Lighthouse Mystery"
  place = "the cliff path"
  health = 10

  print(title)
  print()
  print("A storm is coming. The old lighthouse on the cliff has gone dark.")
  print("Someone has to climb up and light the lamp before the ships arrive.")
  hero = input("What is your name? ")
  print("Welcome,", hero)
  print("You are standing on", place)
  print("Health:", health)
`;

const ref4 = py`
  # My text adventure
  title = "The Lighthouse Mystery"
  place = "the cliff path"
  health = 10

  print(title)
  print()
  print("A storm is coming. The old lighthouse on the cliff has gone dark.")
  print("Someone has to climb up and light the lamp before the ships arrive.")
  hero = input("What is your name? ")
  print(f"Welcome, {hero}. You are standing on {place}.")
  print(f"You have {health} health points and a long night ahead.")
`;

const ref5 = py`
  # My text adventure
  title = "The Lighthouse Mystery"
  place = "the cliff path"
  health = 10

  print(title)
  print()
  print("A storm is coming. The old lighthouse on the cliff has gone dark.")
  print("Someone has to climb up and light the lamp before the ships arrive.")
  hero = input("What is your name? ")
  print(f"Welcome, {hero}. You are standing on {place}.")
  print(f"You have {health} health points and a long night ahead.")

  print("The path splits. Do you go left along the cliff, or right into the woods?")
  choice = input("left or right? ")
  if choice == "left":
      print("You follow the cliff. The wind nearly pushes you over, but you can see the lighthouse door.")
  else:
      print("You walk into the dark woods. Branches scratch your face. It is slower, but safer.")
`;

const ref6 = py`
  # My text adventure
  title = "The Lighthouse Mystery"
  place = "the cliff path"
  health = 10

  print(title)
  print()
  print("A storm is coming. The old lighthouse on the cliff has gone dark.")
  print("Someone has to climb up and light the lamp before the ships arrive.")
  hero = input("What is your name? ")
  print(f"Welcome, {hero}. You are standing on {place}.")
  print(f"You have {health} health points and a long night ahead.")

  print("The path splits. Do you go left along the cliff, right into the woods, or wait for the rain to pass?")
  choice = input("left, right or wait? ")
  if choice == "left":
      print("You follow the cliff. The wind nearly pushes you over, but you can see the lighthouse door.")
  elif choice == "right":
      print("You walk into the dark woods. Branches scratch your face. It is slower, but safer.")
  else:
      print("You wait under a tree. The rain does not stop, and now it is darker than before.")
`;

const loopIntro = py`
  # My text adventure
  title = "The Lighthouse Mystery"
  place = "the cliff path"
  health = 10

  print(title)
  print()
  print("A storm is coming. The old lighthouse on the cliff has gone dark.")
  print("Someone has to climb up and light the lamp before the ships arrive.")
  hero = input("What is your name? ")
  print(f"Welcome, {hero}. You are standing on {place}.")
  print(f"You have {health} health points and a long night ahead.")

  print("The path splits. Do you go left along the cliff, right into the woods, or wait for the rain to pass?")
  choice = input("left, right or wait? ")
  if choice == "left":
      print("You follow the cliff. The wind nearly pushes you over, but you can see the lighthouse door.")
  elif choice == "right":
      print("You walk into the dark woods. Branches scratch your face. It is slower, but safer.")
  else:
      print("You wait under a tree. The rain does not stop, and now it is darker than before.")
`;

const ref7 = `${loopIntro}

print("You reach the lighthouse door. Type look, or quit to give up.")
playing = True
while playing:
    command = input("> ")
    if command == "quit":
        print("You give up and walk home. The ships will have to manage.")
        playing = False
    elif command == "look":
        print("The door is heavy and covered in seaweed. There is a rusty handle.")
    else:
        print("You cannot do that here.")
`;

const ref8 = `${loopIntro}

turns = 0
print("You reach the lighthouse door. Type look, or quit to give up.")
playing = True
while playing:
    command = input("> ")
    if command != "quit":
        turns = turns + 1
    if command == "quit":
        print("You give up and walk home. The ships will have to manage.")
        playing = False
    elif command == "look":
        print("The door is heavy and covered in seaweed. There is a rusty handle.")
    else:
        print("You cannot do that here.")
print(f"Turns played: {turns}")
`;

const ref9 = `import random

${loopIntro}

turns = 0
print("You reach the lighthouse door. Type look, or quit to give up.")
playing = True
while playing:
    command = input("> ")
    if command != "quit":
        turns = turns + 1
    if command == "quit":
        print("You give up and walk home. The ships will have to manage.")
        playing = False
    elif command == "look":
        print("The door is heavy and covered in seaweed. There is a rusty handle.")
    else:
        print("You cannot do that here.")
    if playing and random.randint(1, 6) == 1:
        health = health - 1
        print(f"A gust of wind knocks you against the rocks. Health: {health}")
print(f"Turns played: {turns}")
`;

const functionsBlock = py`
  # My text adventure


  def intro(title):
      print(title)
      print()
      print("A storm is coming. The old lighthouse on the cliff has gone dark.")
      print("Someone has to climb up and light the lamp before the ships arrive.")


  def first_choice(choice):
      if choice == "left":
          print("You follow the cliff. The wind nearly pushes you over, but you can see the lighthouse door.")
      elif choice == "right":
          print("You walk into the dark woods. Branches scratch your face. It is slower, but safer.")
      else:
          print("You wait under a tree. The rain does not stop, and now it is darker than before.")
`;

const ref10 = `import random

${functionsBlock}


title = "The Lighthouse Mystery"
place = "the cliff path"
health = 10

intro(title)
hero = input("What is your name? ")
print(f"Welcome, {hero}. You are standing on {place}.")
print(f"You have {health} health points and a long night ahead.")

print("The path splits. Do you go left along the cliff, right into the woods, or wait for the rain to pass?")
choice = input("left, right or wait? ")
first_choice(choice)

turns = 0
print("You reach the lighthouse door. Type look, or quit to give up.")
playing = True
while playing:
    command = input("> ")
    if command != "quit":
        turns = turns + 1
    if command == "quit":
        print("You give up and walk home. The ships will have to manage.")
        playing = False
    elif command == "look":
        print("The door is heavy and covered in seaweed. There is a rusty handle.")
    else:
        print("You cannot do that here.")
    if playing and random.randint(1, 6) == 1:
        health = health - 1
        print(f"A gust of wind knocks you against the rocks. Health: {health}")
print(f"Turns played: {turns}")
`;

const ref11 = `import random

${functionsBlock}


def wind_damage(health):
    if random.randint(1, 6) == 1:
        print("A gust of wind knocks you against the rocks.")
        return health - 1
    return health


title = "The Lighthouse Mystery"
place = "the cliff path"
health = 10

intro(title)
hero = input("What is your name? ")
print(f"Welcome, {hero}. You are standing on {place}.")
print(f"You have {health} health points and a long night ahead.")

print("The path splits. Do you go left along the cliff, right into the woods, or wait for the rain to pass?")
choice = input("left, right or wait? ")
first_choice(choice)

turns = 0
print("You reach the lighthouse door. Type look, or quit to give up.")
playing = True
while playing:
    command = input("> ")
    if command != "quit":
        turns = turns + 1
    if command == "quit":
        print("You give up and walk home. The ships will have to manage.")
        playing = False
    elif command == "look":
        print("The door is heavy and covered in seaweed. There is a rusty handle.")
    else:
        print("You cannot do that here.")
    if playing:
        health = wind_damage(health)
print(f"Turns played: {turns}")
`;

const ref12 = `import random

${functionsBlock}


def wind_damage(health):
    if random.randint(1, 6) == 1:
        print("A gust of wind knocks you against the rocks.")
        return health - 1
    return health


title = "The Lighthouse Mystery"
place = "the cliff path"
health = 10
inventory = []
items_here = ["rusty key", "wet rope"]

intro(title)
hero = input("What is your name? ")
print(f"Welcome, {hero}. You are standing on {place}.")
print(f"You have {health} health points and a long night ahead.")

print("The path splits. Do you go left along the cliff, right into the woods, or wait for the rain to pass?")
choice = input("left, right or wait? ")
first_choice(choice)

turns = 0
print("You reach the lighthouse door. Type look, take, inventory, or quit to give up.")
playing = True
while playing:
    command = input("> ")
    if command != "quit":
        turns = turns + 1
    if command == "quit":
        print("You give up and walk home. The ships will have to manage.")
        playing = False
    elif command == "look":
        print("The door is heavy and covered in seaweed. There is a rusty handle.")
        for item in items_here:
            print(f"You see a {item}.")
    elif command == "take":
        if len(items_here) == 0:
            print("There is nothing left to take.")
        else:
            item = items_here.pop(0)
            inventory.append(item)
            print(f"You take the {item}.")
    elif command == "inventory":
        print("You are carrying:", inventory)
    else:
        print("You cannot do that here.")
    if playing:
        health = wind_damage(health)
print(f"Turns played: {turns}")
`;

const roomsBlock = py`
  rooms = {
      "door": {
          "description": "The lighthouse door, heavy and covered in seaweed.",
          "exits": {"north": "stairs"},
          "items": ["rusty key", "wet rope"],
      },
      "stairs": {
          "description": "A spiral staircase. Your steps echo. The wind howls above.",
          "exits": {"south": "door", "up": "lamp room"},
          "items": ["old lantern"],
      },
      "lamp room": {
          "description": "The lamp room at the top. The great lamp is dark and cold.",
          "exits": {"down": "stairs"},
          "items": [],
      },
  }
`;

const ref13 = `import random

${functionsBlock}


def wind_damage(health):
    if random.randint(1, 6) == 1:
        print("A gust of wind knocks you against the rocks.")
        return health - 1
    return health


${roomsBlock}


def describe(room_name):
    room = rooms[room_name]
    print(room["description"])
    for item in room["items"]:
        print(f"You see a {item}.")


title = "The Lighthouse Mystery"
place = "the cliff path"
health = 10
inventory = []

intro(title)
hero = input("What is your name? ")
print(f"Welcome, {hero}. You are standing on {place}.")
print(f"You have {health} health points and a long night ahead.")

print("The path splits. Do you go left along the cliff, right into the woods, or wait for the rain to pass?")
choice = input("left, right or wait? ")
first_choice(choice)

current = "door"
turns = 0
print("You reach the lighthouse. Type look, take, inventory, or quit to give up.")
describe(current)
playing = True
while playing:
    command = input("> ")
    if command != "quit":
        turns = turns + 1
    if command == "quit":
        print("You give up and walk home. The ships will have to manage.")
        playing = False
    elif command == "look":
        describe(current)
    elif command == "take":
        items_here = rooms[current]["items"]
        if len(items_here) == 0:
            print("There is nothing left to take.")
        else:
            item = items_here.pop(0)
            inventory.append(item)
            print(f"You take the {item}.")
    elif command == "inventory":
        print("You are carrying:", inventory)
    else:
        print("You cannot do that here.")
    if playing:
        health = wind_damage(health)
print(f"Turns played: {turns}")
`;

const ref14 = `import random

${functionsBlock}


def wind_damage(health):
    if random.randint(1, 6) == 1:
        print("A gust of wind knocks you against the rocks.")
        return health - 1
    return health


${roomsBlock}


def describe(room_name):
    room = rooms[room_name]
    print(room["description"])
    print("Exits:", ", ".join(room["exits"]))
    for item in room["items"]:
        print(f"You see a {item}.")


def move(room_name, direction, inventory):
    exits = rooms[room_name]["exits"]
    if direction not in exits:
        print("You cannot go that way.")
        return room_name
    if room_name == "door" and direction == "north" and "rusty key" not in inventory:
        print("The door is locked. You need a key.")
        return room_name
    return exits[direction]


title = "The Lighthouse Mystery"
place = "the cliff path"
health = 10
inventory = []

intro(title)
hero = input("What is your name? ")
print(f"Welcome, {hero}. You are standing on {place}.")
print(f"You have {health} health points and a long night ahead.")

print("The path splits. Do you go left along the cliff, right into the woods, or wait for the rain to pass?")
choice = input("left, right or wait? ")
first_choice(choice)

current = "door"
turns = 0
print("You reach the lighthouse. Type look, take, inventory, a direction, or quit to give up.")
describe(current)
playing = True
while playing:
    command = input("> ")
    if command != "quit":
        turns = turns + 1
    if command == "quit":
        print("You give up and walk home. The ships will have to manage.")
        playing = False
    elif command == "look":
        describe(current)
    elif command == "take":
        items_here = rooms[current]["items"]
        if len(items_here) == 0:
            print("There is nothing left to take.")
        else:
            item = items_here.pop(0)
            inventory.append(item)
            print(f"You take the {item}.")
    elif command == "inventory":
        print("You are carrying:", inventory)
    else:
        new_room = move(current, command, inventory)
        if new_room != current:
            current = new_room
            describe(current)
            if current == "lamp room":
                print(f"You light the lamp. Its beam cuts through the storm. The ships are safe. Well done, {hero}!")
                playing = False
    if playing:
        health = wind_damage(health)
    if health <= 0:
        print("You are too hurt to go on. The night wins this time.")
        playing = False
print(f"Turns played: {turns}")
`;

/* ------------------------------------------------------------------ shared check pieces */

/** Inputs that finish every version of the game: a name, a first choice, then a few commands and quit. */
const NAME = 'Dana';
const BASIC = [NAME, 'left', 'quit'];

const structuralNote = callout(
  'note',
  'Your story is yours: names, places, messages and items can be anything, in any language. The checks look only at the shape of the program and at how it behaves, never at your wording. Command words the player types (quit, look, take, north …) are fixed English words, like in most games, so the checks can play your game.',
  'הסיפור הוא שלכם: שמות, מקומות, הודעות וחפצים יכולים להיות כל דבר, בכל שפה. הבדיקות מסתכלות רק על הצורה של התוכנית ועל ההתנהגות שלה, אף פעם לא על הניסוח. מילות הפקודה שהשחקן מקליד (quit, look, take, north …) הן מילים קבועות באנגלית, כמו ברוב המשחקים, כדי שהבדיקות יוכלו לשחק במשחק שלכם.',
  t('Your words, fixed commands', 'המילים שלכם, פקודות קבועות'),
);

/* ------------------------------------------------------------------ steps */

const steps: ProjectStep[] = [
  /* ============================================================== milestone 1: printing */
  {
    id: 'ta-1-intro',
    milestone: t('Milestone 1: the story begins', 'אבן דרך 1: הסיפור מתחיל'),
    title: t('Print the opening of your story', 'הדפיסו את הפתיחה של הסיפור שלכם'),
    requires: ['l05-print-and-strings'],
    concepts: ['print', 'string', 'sequence'],
    instructions: [
      p(
        'Every adventure starts with a title and a few lines that set the scene. Decide what your story is about: a lighthouse in a storm, a lost cat in a shopping mall, a spaceship with a broken engine, anything you like. Print the title on the first line, then an empty line, then at least three lines of story. Use a comment line at the top with your name or the name of the game.',
        'כל הרפתקה מתחילה בכותרת ובכמה שורות שמציירות את הסצנה. החליטו על מה הסיפור שלכם: מגדלור בסערה, חתול שהלך לאיבוד בקניון, חללית עם מנוע מקולקל, מה שתרצו. הדפיסו את הכותרת בשורה הראשונה, אחר כך שורה ריקה, ואז לפחות שלוש שורות של סיפור. הוסיפו בראש הקובץ שורת הערה עם השם שלכם או שם המשחק.',
      ),
      structuralNote,
      code({ en: 'The Lighthouse Mystery\n\nA storm is coming. The old lighthouse on the cliff has gone dark.\nSomeone has to climb up and light the lamp before the ships arrive.\nThat someone is you.', he: 'תעלומת המגדלור\n\nסערה מתקרבת. המגדלור הישן על הצוק כבה.\nמישהו חייב לטפס ולהדליק את המנורה לפני שהספינות יגיעו.\nהמישהו הזה הוא אתם.' }, { lang: 'text', runnable: false, caption: t('An example opening. Yours will be different.', 'פתיחה לדוגמה. שלכם תהיה שונה.') }),
    ],
    check: {
      tests: [
        pythonTest(
          py`
            lines = stdout.split("\n")
            while lines and lines[-1].strip() == "":
                lines.pop()
            assert len(lines) >= 5, M("Print a title, an empty line and at least three story lines (5 lines in total).", "הדפיסו כותרת, שורה ריקה ולפחות שלוש שורות סיפור (5 שורות בסך הכול).")
            assert lines[0].strip() != "", M("The first line must be the title of your story.", "השורה הראשונה חייבת להיות כותרת הסיפור.")
            assert lines[1].strip() == "", M("The second line must be empty: print() with nothing inside.", "השורה השנייה חייבת להיות ריקה: print() בלי כלום בפנים.")
            story = [l for l in lines[2:] if l.strip()]
            assert len(story) >= 3, M("Print at least three lines of story after the empty line.", "הדפיסו לפחות שלוש שורות סיפור אחרי השורה הריקה.")
            assert any(l.lstrip().startswith("#") for l in source.split("\n")), M("Add a comment line (starting with #) at the top.", "הוסיפו שורת הערה (שמתחילה ב-#) למעלה.")
          `,
          { stdin: BASIC, name: ['Title, empty line, story', 'כותרת, שורה ריקה, סיפור'] },
        ),
      ],
    },
    hints: [
      t('One print per line. The first print is the title.', 'שורת `print` אחת לכל שורה. ה-`print` הראשון הוא הכותרת.'),
      t('`print()` with nothing inside gives the empty line.', '`print()` בלי כלום בפנים נותן את השורה הריקה.'),
      t('Three more prints with your story, and `# my game` on line 1.', 'עוד שלושה `print` עם הסיפור שלכם, ו-`# המשחק שלי` בשורה 1.'),
    ],
    referenceCode: ref1,
  },

  /* ============================================================== milestone 2: the player */
  {
    id: 'ta-2-variables',
    milestone: t('Milestone 2: the player', 'אבן דרך 2: השחקן'),
    title: t('Remember the hero in variables', 'זכרו את הגיבור במשתנים'),
    requires: ['l06-variables'],
    concepts: ['variable', 'assignment', 'print-multiple'],
    instructions: [
      p(
        'Give the game a memory. Create at least three variables before the story is printed: the hero\'s name, the place where the story starts, and a number for health (or coins, or fuel). Then use the variables in your prints, for example `print("That someone is", hero)`. Printing a variable shows its value, so the text changes when the variable changes.',
        'תנו למשחק זיכרון. צרו לפחות שלושה משתנים לפני שהסיפור מודפס: שם הגיבור, המקום שבו הסיפור מתחיל, ומספר לבריאות (או מטבעות, או דלק). אחר כך השתמשו במשתנים בתוך ההדפסות, למשל `print("המישהו הזה הוא", hero)`. הדפסת משתנה מציגה את הערך שלו, ולכן הטקסט משתנה כשהמשתנה משתנה.',
      ),
      p(
        'Keep the title, the empty line and the story lines from step 1: the finished game still needs them.',
        'שמרו על הכותרת, השורה הריקה ושורות הסיפור משלב 1: המשחק המוגמר עדיין צריך אותן.',
      ),
    ],
    check: {
      tests: [
        pythonTest(
          py`
            names = [k for k, v in ns.items() if not k.startswith("_") and isinstance(v, str) and not callable(v)]
            numbers = [k for k, v in ns.items() if not k.startswith("_") and isinstance(v, (int, float)) and not isinstance(v, bool)]
            assert len(names) >= 2, M("Create at least two text variables (for example the hero and the place).", "צרו לפחות שני משתני טקסט (למשל הגיבור והמקום).")
            assert len(numbers) >= 1, M("Create at least one number variable (for example health = 10).", "צרו לפחות משתנה מספרי אחד (למשל health = 10).")
            used = [k for k in names if ns[k].strip() and ns[k].strip() in stdout]
            assert len(used) >= 2, M("Print at least two of your text variables so their values appear in the output.", "הדפיסו לפחות שניים ממשתני הטקסט שלכם כך שהערכים שלהם יופיעו בפלט.")
            assert any(str(ns[k]) in stdout for k in numbers), M("Print your number variable too, for example print(\"Health:\", health).", "הדפיסו גם את המשתנה המספרי, למשל print(\"בריאות:\", health).")
          `,
          { stdin: BASIC, name: ['Variables are created and printed', 'המשתנים נוצרים ומודפסים'] },
        ),
      ],
    },
    hints: [
      t('`hero = "Dana"`, `place = "the cliff path"`, `health = 10` at the top, after the comment.', '`hero = "דנה"`, `place = "שביל הצוק"`, `health = 10` למעלה, אחרי ההערה.'),
      t('Use the variable inside print with a comma: `print("You are standing on", place)`.', 'השתמשו במשתנה בתוך `print` עם פסיק: `print("אתם עומדים על", place)`.'),
      t('Print the number the same way: `print("Health:", health)`.', 'הדפיסו את המספר באותה דרך: `print("בריאות:", health)`.'),
    ],
    referenceCode: ref2,
  },
  {
    id: 'ta-3-input',
    title: t('Ask the player for their name', 'שאלו את השחקן לשמו'),
    requires: ['l09-input'],
    concepts: ['input', 'variable'],
    instructions: [
      p(
        'Instead of choosing the hero\'s name yourself, ask the player. Replace the line that sets the hero variable with `hero = input("What is your name? ")` (the prompt text is yours). Then greet the player by name in a print. The name must be asked after the title and story lines are printed, and the greeting must show the name the player typed.',
        'במקום לבחור את שם הגיבור בעצמכם, שאלו את השחקן. החליפו את השורה שקובעת את משתנה הגיבור ב-`hero = input("מה שמך? ")` (טקסט הבקשה לבחירתכם). אחר כך ברכו את השחקן בשמו בתוך `print`. השאלה חייבת לבוא אחרי הדפסת הכותרת ושורות הסיפור, והברכה חייבת להציג את השם שהשחקן הקליד.',
      ),
      callout(
        'tip',
        'During a check, the typed answers come from the check itself and are not shown in the output, so only what print shows counts.',
        'במהלך בדיקה, התשובות המוקלדות מגיעות מהבדיקה עצמה ולא מוצגות בפלט, ולכן רק מה ש-`print` מציג נספר.',
        t('How input works in checks', 'איך input עובד בבדיקות'),
      ),
    ],
    check: {
      tests: [
        pythonTest(
          py`
            assert "input(" in source, M("Use input() to ask for the name.", "השתמשו ב-input() כדי לשאול לשם.")
            out = run(["Dana", "left", "quit"])
            assert "Dana" in out, M("Greet the player with the name they typed (the check typed Dana).", "ברכו את השחקן בשם שהוא הקליד (הבדיקה הקלידה Dana).")
            other = run(["Noa", "left", "quit"])
            assert "Noa" in other and "Dana" not in other, M("The greeting must use the typed name, not a fixed one.", "הברכה חייבת להשתמש בשם שהוקלד, לא בשם קבוע.")
            title_line = out.split("\n")[0]
            assert title_line.strip() != "" and "Dana" not in title_line, M("Keep the title as the first printed line; ask for the name after the story.", "שמרו על הכותרת כשורה המודפסת הראשונה; שאלו לשם אחרי הסיפור.")
          `,
          { stdin: BASIC, name: ['The typed name appears in the greeting', 'השם שהוקלד מופיע בברכה'] },
        ),
      ],
    },
    hints: [
      t('`hero = input("What is your name? ")` replaces `hero = "Dana"`.', '`hero = input("מה שמך? ")` מחליף את `hero = "דנה"`.'),
      t('The greeting: `print("Welcome,", hero)`.', 'הברכה: `print("ברוכים הבאים,", hero)`.'),
      t('Order matters: title, empty line, story lines, then the question, then the greeting.', 'הסדר חשוב: כותרת, שורה ריקה, שורות סיפור, ואז השאלה, ואז הברכה.'),
    ],
    referenceCode: ref3,
  },
  {
    id: 'ta-4-fstrings',
    title: t('Build sentences with f-strings', 'בנו משפטים עם f-strings'),
    requires: ['l10-fstrings'],
    concepts: ['f-string', 'variable'],
    instructions: [
      p(
        'Make the greeting and the status line read naturally with f-strings: a string that starts with `f` and has variables inside curly braces, like `f"Welcome, {hero}. You are standing on {place}."`. Use at least two f-strings, and put both the name and your number variable inside f-strings somewhere.',
        'הפכו את הברכה ואת שורת המצב למשפטים טבעיים בעזרת f-strings: מחרוזת שמתחילה ב-`f` ויש בה משתנים בתוך סוגריים מסולסלים, כמו `f"ברוכים הבאים, {hero}. אתם עומדים על {place}."`. השתמשו לפחות בשני f-strings, ושימו גם את השם וגם את המשתנה המספרי בתוך f-strings איפשהו.',
      ),
    ],
    check: {
      tests: [
        pythonTest(
          py`
            import re
            fstrings = re.findall(r"""\bf["']""", source)
            assert len(fstrings) >= 2, M("Use at least two f-strings (strings that start with f).", "השתמשו לפחות בשני f-strings (מחרוזות שמתחילות ב-f).")
            assert re.search(r"""\bf["'][^"'\n]*\{""", source), M("Put a variable inside curly braces in an f-string, like f\"Hello, {hero}\".", "שימו משתנה בתוך סוגריים מסולסלים ב-f-string, למשל f\"שלום, {hero}\".")
            out = run(["Dana", "left", "quit"])
            assert "Dana" in out, M("The greeting must still show the typed name.", "הברכה עדיין חייבת להציג את השם שהוקלד.")
            numbers = [v for k, v in ns.items() if not k.startswith("_") and isinstance(v, (int, float)) and not isinstance(v, bool)]
            assert numbers and any(str(n) in out for n in numbers), M("Your number variable must appear in the output (inside an f-string).", "המשתנה המספרי חייב להופיע בפלט (בתוך f-string).")
          `,
          { stdin: BASIC, name: ['Two f-strings with variables inside', 'שני f-strings עם משתנים בפנים'] },
        ),
      ],
    },
    hints: [
      t('An f-string starts with the letter f right before the opening quote: `f"..."`.', 'f-string מתחיל באות f ממש לפני המירכאה הפותחת: `f"..."`.'),
      t('`print(f"Welcome, {hero}. You are standing on {place}.")`', '`print(f"ברוכים הבאים, {hero}. אתם עומדים על {place}.")`'),
      t('`print(f"You have {health} health points.")` puts the number in.', '`print(f"יש לכם {health} נקודות בריאות.")` מכניס את המספר.'),
    ],
    referenceCode: ref4,
  },

  /* ============================================================== milestone 3: choices */
  {
    id: 'ta-5-if',
    milestone: t('Milestone 3: choices', 'אבן דרך 3: בחירות'),
    title: t('The first choice', 'הבחירה הראשונה'),
    requires: ['l12-if-else'],
    concepts: ['if', 'else', 'input', 'comparison'],
    instructions: [
      p(
        'After the greeting, offer the player a choice between two paths. Ask with input() and expect the word `left` or `right`. With `if choice == "left":` print one outcome, and with `else:` print a different one. Each outcome must print something, and the two outcomes must differ. The story text is yours; the two command words are fixed.',
        'אחרי הברכה, הציעו לשחקן בחירה בין שני מסלולים. שאלו עם `input()` וצפו למילה `left` או `right`. עם `if choice == "left":` הדפיסו תוצאה אחת, ועם `else:` הדפיסו תוצאה אחרת. כל תוצאה חייבת להדפיס משהו, ושתי התוצאות חייבות להיות שונות. טקסט הסיפור שלכם; שתי מילות הפקודה קבועות.',
      ),
    ],
    check: {
      requires: [requires('\\bif\\b[^\\n]*:', 'Use an if statement for the choice.', 'השתמשו במשפט if בשביל הבחירה.'), requires('\\belse\\s*:', 'Use else for the other path.', 'השתמשו ב-else בשביל המסלול השני.')],
      tests: [
        pythonTest(
          py`
            left = run(["Dana", "left", "quit"])
            right = run(["Dana", "right", "quit"])
            assert left.strip() and right.strip(), M("Both paths must print something.", "שני המסלולים חייבים להדפיס משהו.")
            assert left != right, M("Typing left and typing right must lead to different printed outcomes.", "הקלדת left והקלדת right חייבות להוביל לתוצאות מודפסות שונות.")
            assert "Dana" in left, M("Keep the greeting with the typed name before the choice.", "שמרו על הברכה עם השם שהוקלד לפני הבחירה.")
          `,
          { stdin: BASIC, name: ['left and right lead to different outcomes', 'left ו-right מובילים לתוצאות שונות'] },
        ),
      ],
    },
    hints: [
      t('`choice = input("left or right? ")` after the greeting.', '`choice = input("left או right? ")` אחרי הברכה.'),
      t('`if choice == "left":` then an indented print; `else:` then another indented print.', '`if choice == "left":` ואז `print` מוזח; `else:` ואז `print` מוזח אחר.'),
      t('Remember the colon at the end of the if and else lines, and four spaces of indentation.', 'זכרו את הנקודתיים בסוף שורות ה-if וה-else, וארבעה רווחים של הזחה.'),
    ],
    referenceCode: ref5,
  },
  {
    id: 'ta-6-elif',
    title: t('Three ways to go', 'שלוש דרכים ללכת'),
    requires: ['l13-elif'],
    concepts: ['elif', 'condition-order'],
    instructions: [
      p(
        'Add a third option to the choice with `elif`: `left`, `right`, or `wait`. Each of the three must print its own outcome. Any other answer counts as the last option (that is what `else` is for).',
        'הוסיפו אפשרות שלישית לבחירה עם `elif`: `left`, `right` או `wait`. כל אחת מהשלוש חייבת להדפיס תוצאה משלה. כל תשובה אחרת נחשבת כאפשרות האחרונה (בשביל זה קיים `else`).',
      ),
    ],
    check: {
      requires: [requires('\\belif\\b', 'Use elif for the middle option.', 'השתמשו ב-elif בשביל האפשרות האמצעית.')],
      tests: [
        pythonTest(
          py`
            outs = [run(["Dana", word, "quit"]) for word in ("left", "right", "wait")]
            assert all(o.strip() for o in outs), M("All three options must print something.", "כל שלוש האפשרויות חייבות להדפיס משהו.")
            assert len(set(outs)) == 3, M("left, right and wait must each lead to a different outcome.", "left, right ו-wait חייבים להוביל כל אחד לתוצאה שונה.")
          `,
          { stdin: BASIC, name: ['Three different outcomes', 'שלוש תוצאות שונות'] },
        ),
      ],
    },
    hints: [
      t('Between the if and the else, add `elif choice == "right":` with its own print.', 'בין ה-if ל-else, הוסיפו `elif choice == "right":` עם `print` משלו.'),
      t('The else branch now handles wait (and anything else the player types).', 'ענף ה-else מטפל עכשיו ב-wait (ובכל דבר אחר שהשחקן מקליד).'),
      t('Test all three by running three times with different answers.', 'בדקו את שלושתן על ידי הרצה שלוש פעמים עם תשובות שונות.'),
    ],
    referenceCode: ref6,
  },

  /* ============================================================== milestone 4: turns */
  {
    id: 'ta-7-loop',
    milestone: t('Milestone 4: turns', 'אבן דרך 4: תורות'),
    title: t('The game loop', 'לולאת המשחק'),
    requires: ['l15-while'],
    concepts: ['while', 'loop-condition'],
    instructions: [
      p(
        'Real adventures keep going until the player stops. After the first choice, create `playing = True` and start a loop with `while playing:` that reads a command each turn. If the command is `quit`, print a goodbye line and set `playing = False`, so the loop condition becomes false and the loop ends. If it is `look`, print a description of where the player is. Anything else prints a message such as "You cannot do that here."',
        'הרפתקאות אמיתיות נמשכות עד שהשחקן עוצר. אחרי הבחירה הראשונה, צרו `playing = True` והתחילו לולאה עם `while playing:` שקוראת פקודה בכל תור. אם הפקודה היא `quit`, הדפיסו שורת פרידה וקבעו `playing = False`, כך שתנאי הלולאה הופך לשקר והלולאה מסתיימת. אם היא `look`, הדפיסו תיאור של המקום שבו השחקן נמצא. כל דבר אחר מדפיס הודעה כמו "אי אפשר לעשות את זה כאן."',
      ),
    ],
    check: {
      requires: [requires('\\bwhile\\b', 'Use a while loop for the turns.', 'השתמשו בלולאת while בשביל התורות.')],
      tests: [
        pythonTest(
          py`
            short = run_all(["Dana", "left", "quit"])
            assert short["needInput"] is None, M("Typing quit must end the game (the program asked for more input).", "הקלדת quit חייבת לסיים את המשחק (התוכנית ביקשה עוד קלט).")
            one = run(["Dana", "left", "look", "quit"])
            three = run(["Dana", "left", "look", "look", "look", "quit"])
            assert one.count("\n") < three.count("\n"), M("Each look command must print something, so three looks print more than one look.", "כל פקודת look חייבת להדפיס משהו, ולכן שלוש פעמים look מדפיסות יותר מפעם אחת.")
            unknown = run(["Dana", "left", "dance", "quit"])
            assert unknown != short["stdout"], M("An unknown command (the check typed dance) must print a message.", "פקודה לא מוכרת (הבדיקה הקלידה dance) חייבת להדפיס הודעה.")
          `,
          { stdin: [NAME, 'left', 'look', 'quit'], name: ['look repeats, quit ends the game', 'look חוזר, quit מסיים את המשחק'] },
        ),
      ],
    },
    hints: [
      t('`playing = True`, then `while playing:` and inside it `command = input("> ")`.', '`playing = True`, ואז `while playing:` ובתוכה `command = input("> ")`.'),
      t('`if command == "quit":` print goodbye and set `playing = False`; `elif command == "look":` print the description; `else:` print the cannot-do message.', '`if command == "quit":` הדפיסו פרידה וקבעו `playing = False`; `elif command == "look":` הדפיסו את התיאור; `else:` הדפיסו את הודעת "אי אפשר".'),
      t('Everything inside the loop is indented under the while line.', 'כל מה שבתוך הלולאה מוזח מתחת לשורת ה-while.'),
    ],
    referenceCode: ref7,
  },
  {
    id: 'ta-8-counter',
    title: t('Count the turns', 'ספרו את התורות'),
    requires: ['l17-accumulators'],
    concepts: ['accumulator', 'counter', 'f-string'],
    instructions: [
      p(
        'Keep score of how long the adventure took. Create a counter variable before the loop (`turns = 0`), add one to it for every command except quit, and after the loop print a final line that contains the number of turns, for example `Turns played: 3`. The check types 3 commands and then quit, and expects the number 3 on the last printed line.',
        'עקבו אחרי אורך ההרפתקה. צרו משתנה מונה לפני הלולאה (`turns = 0`), הוסיפו לו אחד על כל פקודה חוץ מ-quit, ואחרי הלולאה הדפיסו שורה אחרונה שמכילה את מספר התורות, למשל `תורות: 3`. הבדיקה מקלידה 3 פקודות ואז quit, ומצפה למספר 3 בשורה המודפסת האחרונה.',
      ),
    ],
    check: {
      tests: [
        pythonTest(
          py`
            import re
            def last_line(text):
                lines = [l for l in text.split("\n") if l.strip()]
                return lines[-1] if lines else ""
            three = run(["Dana", "left", "look", "look", "look", "quit"])
            one = run(["Dana", "left", "look", "quit"])
            zero = run(["Dana", "left", "quit"])
            assert re.search(r"\b3\b", last_line(three)), M("After three commands and quit, the last printed line must contain the number 3.", "אחרי שלוש פקודות ו-quit, השורה המודפסת האחרונה חייבת להכיל את המספר 3.")
            assert re.search(r"\b1\b", last_line(one)), M("After one command and quit, the last line must contain 1.", "אחרי פקודה אחת ו-quit, השורה האחרונה חייבת להכיל 1.")
            assert re.search(r"\b0\b", last_line(zero)), M("Quitting at once must report 0 turns.", "יציאה מיידית חייבת לדווח על 0 תורות.")
          `,
          { stdin: [NAME, 'left', 'look', 'look', 'look', 'quit'], name: ['The last line reports the number of turns', 'השורה האחרונה מדווחת על מספר התורות'] },
        ),
      ],
    },
    hints: [
      t('`turns = 0` before `while playing:`.', '`turns = 0` לפני `while playing:`.'),
      t('At the top of the loop body: `if command != "quit": turns = turns + 1`, so quit itself is not counted.', 'בראש גוף הלולאה: `if command != "quit": turns = turns + 1`, כדי ש-quit עצמו לא ייספר.'),
      t('After the loop (no indentation): `print(f"Turns played: {turns}")`.', 'אחרי הלולאה (בלי הזחה): `print(f"תורות: {turns}")`.'),
    ],
    referenceCode: ref8,
  },
  {
    id: 'ta-9-random',
    title: t('Something unexpected', 'משהו לא צפוי'),
    requires: ['l19-random'],
    concepts: ['import', 'random-randint', 'if'],
    instructions: [
      p(
        'Add chance. Put `import random` on the first line. Inside the loop, after handling the command, roll a die with `random.randint(1, 6)`; if it shows 1, something happens: a gust of wind, a rat, a falling stone. Print a message and lower the health variable by one. The game must still end on quit and still count turns.',
        'הוסיפו מזל. שימו `import random` בשורה הראשונה. בתוך הלולאה, אחרי הטיפול בפקודה, הטילו קובייה עם `random.randint(1, 6)`; אם יוצא 1, משהו קורה: משב רוח, חולדה, אבן שנופלת. הדפיסו הודעה והורידו את משתנה הבריאות באחד. המשחק עדיין חייב להסתיים ב-quit ועדיין לספור תורות.',
      ),
      callout(
        'note',
        'Chance means the check cannot know what will happen; it only checks that random is used and that the game still finishes properly.',
        'מזל אומר שהבדיקה לא יכולה לדעת מה יקרה; היא בודקת רק ש-random בשימוש ושהמשחק עדיין מסתיים כמו שצריך.',
      ),
    ],
    check: {
      requires: [requires('^\\s*import\\s+random\\b', 'Import the random module at the top.', 'ייבאו את המודול random למעלה.'), requires('random\\.(randint|choice|random)\\(', 'Use random.randint (or random.choice) inside the loop.', 'השתמשו ב-random.randint (או random.choice) בתוך הלולאה.')],
      tests: [
        pythonTest(
          py`
            import re
            res = run_all(["Dana", "left", "look", "look", "look", "quit"])
            assert res["error"] is None, M("The game must run without errors.", "המשחק חייב לרוץ בלי שגיאות.")
            assert res["needInput"] is None, M("The game must still end on quit.", "המשחק עדיין חייב להסתיים ב-quit.")
            lines = [l for l in res["stdout"].split("\n") if l.strip()]
            assert re.search(r"\b3\b", lines[-1]), M("The turn count must still be reported on the last line.", "מספר התורות עדיין חייב להיות מדווח בשורה האחרונה.")
          `,
          { stdin: [NAME, 'left', 'look', 'quit'], name: ['Random is used and the game still ends', 'random בשימוש והמשחק עדיין מסתיים'] },
        ),
      ],
    },
    hints: [
      t('`import random` must be the very first line.', '`import random` חייב להיות השורה הראשונה ממש.'),
      t('At the end of the loop body: `if random.randint(1, 6) == 1:` then the event.', 'בסוף גוף הלולאה: `if random.randint(1, 6) == 1:` ואז האירוע.'),
      t('Inside the event: `health = health - 1` and a print that shows the new health.', 'בתוך האירוע: `health = health - 1` ו-`print` שמציג את הבריאות החדשה.'),
    ],
    referenceCode: ref9,
  },

  /* ============================================================== milestone 5: scenes as functions */
  {
    id: 'ta-10-functions',
    milestone: t('Milestone 5: scenes as functions', 'אבן דרך 5: סצנות כפונקציות'),
    title: t('Put scenes into functions', 'הכניסו סצנות לפונקציות'),
    requires: ['l21-parameters'],
    concepts: ['function', 'def', 'parameter', 'call'],
    instructions: [
      p(
        'The program is getting long. Move the opening into a function `intro(title)` that prints the title and the story lines, and the first choice into a function `first_choice(choice)` that contains the if / elif / else. Define both at the top (after the import) and call them from the main part. Each function must take at least one parameter. The game must behave exactly as before.',
        'התוכנית מתארכת. העבירו את הפתיחה לפונקציה `intro(title)` שמדפיסה את הכותרת ואת שורות הסיפור, ואת הבחירה הראשונה לפונקציה `first_choice(choice)` שמכילה את ה-if / elif / else. הגדירו את שתיהן למעלה (אחרי ה-import) וקראו להן מהחלק הראשי. כל פונקציה חייבת לקבל לפחות פרמטר אחד. המשחק חייב להתנהג בדיוק כמו קודם.',
      ),
    ],
    check: {
      requires: [requires('\\bdef\\s+\\w+\\s*\\([^)]+\\)\\s*:', 'Define a function with at least one parameter.', 'הגדירו פונקציה עם לפחות פרמטר אחד.')],
      tests: [
        pythonTest(
          py`
            funcs = [v for k, v in ns.items() if type(v).__name__ == "function"]
            with_params = [f for f in funcs if f.__code__.co_argcount >= 1]
            assert len(funcs) >= 2, M("Define at least two functions (for example intro and first_choice).", "הגדירו לפחות שתי פונקציות (למשל intro ו-first_choice).")
            assert len(with_params) >= 2, M("Each of your functions should take at least one parameter.", "כל אחת מהפונקציות שלכם צריכה לקבל לפחות פרמטר אחד.")
            outs = [run(["Dana", word, "quit"]) for word in ("left", "right", "wait")]
            assert len(set(outs)) == 3 and all("Dana" in o for o in outs), M("The game must still greet by name and offer three different outcomes.", "המשחק עדיין חייב לברך בשם ולהציע שלוש תוצאות שונות.")
          `,
          { stdin: BASIC, name: ['Two functions with parameters, same behaviour', 'שתי פונקציות עם פרמטרים, אותה התנהגות'] },
        ),
      ],
    },
    hints: [
      t('`def intro(title):` with the prints indented under it; then call `intro(title)` where the prints used to be.', '`def intro(title):` עם ההדפסות מוזחות מתחתיה; ואז קראו `intro(title)` במקום שבו ההדפסות היו.'),
      t('`def first_choice(choice):` holds the if / elif / else; call it with `first_choice(choice)` after the input.', '`def first_choice(choice):` מחזיקה את ה-if / elif / else; קראו לה עם `first_choice(choice)` אחרי ה-input.'),
      t('Functions must be defined above the line that calls them.', 'פונקציות חייבות להיות מוגדרות מעל השורה שקוראת להן.'),
    ],
    referenceCode: ref10,
  },
  {
    id: 'ta-11-return',
    title: t('A function that gives something back', 'פונקציה שמחזירה משהו'),
    requires: ['l22-return'],
    concepts: ['return', 'return-value'],
    instructions: [
      p(
        'Turn the random event into a function `wind_damage(health)` (or a name that fits your story) that rolls the die, prints the event when it happens, and **returns** the new health. In the loop, write `health = wind_damage(health)`. This is the difference between printing and returning: the function hands a value back, and the main program decides what to do with it.',
        'הפכו את האירוע האקראי לפונקציה `wind_damage(health)` (או שם שמתאים לסיפור שלכם) שמטילה את הקובייה, מדפיסה את האירוע כשהוא קורה, ו**מחזירה** את הבריאות החדשה. בלולאה כתבו `health = wind_damage(health)`. זה ההבדל בין להדפיס לבין להחזיר: הפונקציה מוסרת ערך בחזרה, והתוכנית הראשית מחליטה מה לעשות איתו.',
      ),
    ],
    check: {
      requires: [requires('\\breturn\\b', 'Use return inside a function.', 'השתמשו ב-return בתוך פונקציה.')],
      tests: [
        pythonTest(
          py`
            funcs = [v for k, v in ns.items() if type(v).__name__ == "function"]
            assert len(funcs) >= 3, M("Define at least three functions now.", "הגדירו עכשיו לפחות שלוש פונקציות.")
            returning = []
            for f in funcs:
                if f.__code__.co_argcount == 1:
                    try:
                        value = f(10)
                    except Exception:
                        continue
                    if isinstance(value, (int, float)) and not isinstance(value, bool):
                        returning.append(f.__name__)
            assert returning, M("One function that takes the health number must return a number (the new health).", "פונקציה אחת שמקבלת את מספר הבריאות חייבת להחזיר מספר (הבריאות החדשה).")
            res = run_all(["Dana", "left", "look", "quit"])
            assert res["error"] is None and res["needInput"] is None, M("The game must still run and end on quit.", "המשחק עדיין חייב לרוץ ולהסתיים ב-quit.")
          `,
          { stdin: BASIC, name: ['A function returns the new health', 'פונקציה מחזירה את הבריאות החדשה'] },
        ),
      ],
    },
    hints: [
      t('`def wind_damage(health):` — inside, roll the die; if it is 1, print the event and `return health - 1`.', '`def wind_damage(health):` — בפנים, הטילו את הקובייה; אם יצא 1, הדפיסו את האירוע ו-`return health - 1`.'),
      t('After the if, `return health` so nothing changes on the other rolls.', 'אחרי ה-if, `return health` כדי ששום דבר לא ישתנה בהטלות האחרות.'),
      t('In the loop: `health = wind_damage(health)` replaces the old event code.', 'בלולאה: `health = wind_damage(health)` מחליף את קוד האירוע הישן.'),
    ],
    referenceCode: ref11,
  },

  /* ============================================================== milestone 6: inventory and rooms */
  {
    id: 'ta-12-inventory',
    milestone: t('Milestone 6: inventory and rooms', 'אבן דרך 6: תיק חפצים וחדרים'),
    title: t('An inventory list', 'רשימת חפצים'),
    requires: ['l25-list-loops'],
    concepts: ['list', 'append', 'remove-pop', 'for-each'],
    instructions: [
      p(
        'Give the player a bag. At the top level (not inside a function) create `inventory = []` and a list of things lying around, for example `items_here = ["rusty key", "wet rope"]` (your own items, any language). Add two commands to the loop: `take` moves the first item from the room list into the inventory and prints what was taken (if nothing is left, say so); `inventory` prints what the player carries. Also make `look` list the items still lying around.',
        'תנו לשחקן תיק. ברמה העליונה (לא בתוך פונקציה) צרו `inventory = []` ורשימה של דברים שמונחים בסביבה, למשל `items_here = ["מפתח חלוד", "חבל רטוב"]` (חפצים משלכם, בכל שפה). הוסיפו שתי פקודות ללולאה: `take` מעבירה את הפריט הראשון מרשימת החדר לתיק ומדפיסה מה נלקח (אם לא נשאר כלום, אמרו זאת); `inventory` מדפיסה מה השחקן נושא. גרמו גם ל-`look` להציג את הפריטים שעדיין מונחים בסביבה.',
      ),
    ],
    check: {
      tests: [
        pythonTest(
          py`
            assert isinstance(ns.get("inventory"), list), M("Create a list called inventory at the top level.", "צרו רשימה בשם inventory ברמה העליונה.")
            before = run_all(["Dana", "left", "quit"])
            assert len(before["ns"]["inventory"]) == 0, M("The inventory must start empty.", "התיק חייב להתחיל ריק.")
            after = run_all(["Dana", "left", "take", "quit"])
            assert len(after["ns"]["inventory"]) == 1, M("After the take command, the inventory must hold one item.", "אחרי פקודת take, התיק חייב להכיל פריט אחד.")
            twice = run_all(["Dana", "left", "take", "take", "quit"])
            assert len(twice["ns"]["inventory"]) == 2, M("Taking twice must move two items into the inventory.", "לקיחה פעמיים חייבה להעביר שני פריטים לתיק.")
            shown = run(["Dana", "left", "take", "inventory", "quit"])
            item = after["ns"]["inventory"][0]
            assert shown.count(str(item)) >= 2, M("The inventory command must print the items the player carries.", "פקודת inventory חייבת להדפיס את הפריטים שהשחקן נושא.")
          `,
          { stdin: [NAME, 'left', 'take', 'inventory', 'quit'], name: ['take fills the inventory, inventory shows it', 'take ממלא את התיק, inventory מציג אותו'] },
        ),
      ],
    },
    hints: [
      t('`inventory = []` and `items_here = ["rusty key", "wet rope"]` near the other variables.', '`inventory = []` ו-`items_here = ["מפתח חלוד", "חבל רטוב"]` ליד המשתנים האחרים.'),
      t('`elif command == "take":` — if `len(items_here) == 0` print a message, else `item = items_here.pop(0)`, `inventory.append(item)` and print it.', '`elif command == "take":` — אם `len(items_here) == 0` הדפיסו הודעה, אחרת `item = items_here.pop(0)`, `inventory.append(item)` והדפיסו אותו.'),
      t('`elif command == "inventory": print("You are carrying:", inventory)`; in look, `for item in items_here: print(...)`.', '`elif command == "inventory": print("אתם נושאים:", inventory)`; ב-look, `for item in items_here: print(...)`.'),
    ],
    referenceCode: ref12,
  },
  {
    id: 'ta-13-rooms',
    title: t('Rooms in a dictionary', 'חדרים במילון'),
    requires: ['l27-nested-data'],
    concepts: ['dictionary', 'key-value', 'dict-get', 'nested-data'],
    instructions: [
      p(
        'Replace the single place with a world. Create a dictionary called `rooms` with at least three rooms. Each key is a room name and each value is another dictionary with a `"description"` and an `"items"` list (the room names, descriptions and items are yours). Keep the current room name in a variable, for example `current = "door"`. Write a function `describe(room_name)` that prints the description and the items of that room, and use it for `look`. The `take` command now takes from `rooms[current]["items"]`.',
        'החליפו את המקום היחיד בעולם שלם. צרו מילון בשם `rooms` עם לפחות שלושה חדרים. כל מפתח הוא שם חדר וכל ערך הוא מילון נוסף עם `"description"` ורשימת `"items"` (שמות החדרים, התיאורים והחפצים שלכם). שמרו את שם החדר הנוכחי במשתנה, למשל `current = "door"`. כתבו פונקציה `describe(room_name)` שמדפיסה את התיאור ואת החפצים של החדר, והשתמשו בה ב-`look`. פקודת `take` לוקחת עכשיו מ-`rooms[current]["items"]`.',
      ),
    ],
    check: {
      tests: [
        pythonTest(
          py`
            rooms = ns.get("rooms")
            assert isinstance(rooms, dict) and len(rooms) >= 3, M("Create a dictionary called rooms with at least three rooms.", "צרו מילון בשם rooms עם לפחות שלושה חדרים.")
            for name, room in rooms.items():
                assert isinstance(room, dict), M("Each room must be a dictionary with a description and items.", "כל חדר חייב להיות מילון עם תיאור וחפצים.")
                assert "description" in room and "items" in room, M("Each room needs a \"description\" and an \"items\" list.", "כל חדר צריך \"description\" ורשימת \"items\".")
                assert isinstance(room["items"], list), M("\"items\" must be a list.", "\"items\" חייב להיות רשימה.")
            assert "describe" in ns and callable(ns["describe"]), M("Define a function describe(room_name).", "הגדירו פונקציה describe(room_name).")
            out = run(["Dana", "left", "look", "quit"])
            described = any(str(room["description"]).strip() and str(room["description"]).strip() in out for room in rooms.values())
            assert described, M("look must print the description of the current room from the rooms dictionary.", "look חייב להדפיס את התיאור של החדר הנוכחי מתוך המילון rooms.")
            res = run_all(["Dana", "left", "take", "quit"])
            assert len(res["ns"]["inventory"]) == 1, M("take must still move an item into the inventory (from the current room).", "take עדיין חייב להעביר פריט לתיק (מהחדר הנוכחי).")
          `,
          { stdin: [NAME, 'left', 'look', 'quit'], name: ['A rooms dictionary drives look and take', 'מילון החדרים מפעיל את look ואת take'] },
        ),
      ],
    },
    hints: [
      t('`rooms = { "door": {"description": "...", "items": ["rusty key"]}, "stairs": {...}, "lamp room": {...} }` at the top level.', '`rooms = { "door": {"description": "...", "items": ["מפתח חלוד"]}, "stairs": {...}, "lamp room": {...} }` ברמה העליונה.'),
      t('`def describe(room_name): room = rooms[room_name]; print(room["description"]); for item in room["items"]: print(...)`.', 'כתבו `def describe(room_name): room = rooms[room_name]; print(room["description"]); for item in room["items"]: print(...)`.'),
      t('In the loop, `describe(current)` for look, and `items_here = rooms[current]["items"]` before taking.', 'בלולאה, `describe(current)` בשביל look, ו-`items_here = rooms[current]["items"]` לפני הלקיחה.'),
    ],
    referenceCode: ref13,
  },
  {
    id: 'ta-14-exits',
    title: t('Exits, a locked door and a way to win', 'יציאות, דלת נעולה ודרך לנצח'),
    requires: ['l27-nested-data'],
    concepts: ['nested-data', 'in-operator', 'function', 'return', 'while'],
    instructions: [
      p(
        'Connect the rooms. Give every room an `"exits"` dictionary from a direction word (`north`, `south`, `east`, `west`, `up`, `down`) to a room name. Write `move(room_name, direction, inventory)` that returns the new room name, or the same room (after printing a message) when the direction does not exist. Make one door locked: moving through it is allowed only if a certain item is in the inventory. Choose one room as the goal: entering it prints a winning message and ends the game. Print the exits in `describe` so the player knows where they can go.',
        'חברו את החדרים. תנו לכל חדר מילון `"exits"` ממילת כיוון (`north`, `south`, `east`, `west`, `up`, `down`) לשם חדר. כתבו `move(room_name, direction, inventory)` שמחזירה את שם החדר החדש, או את אותו החדר (אחרי הדפסת הודעה) כשהכיוון לא קיים. הפכו דלת אחת לנעולה: המעבר דרכה מותר רק אם חפץ מסוים נמצא בתיק. בחרו חדר אחד בתור היעד: כניסה אליו מדפיסה הודעת ניצחון ומסיימת את המשחק. הדפיסו את היציאות ב-`describe` כדי שהשחקן ידע לאן אפשר ללכת.',
      ),
      p(
        'This is the finished game. The check plays it: it takes the key, walks to the goal and expects the game to end without asking for more commands; it also checks that the locked door refuses without the key and that unknown directions are rejected.',
        'זה המשחק המוגמר. הבדיקה משחקת בו: היא לוקחת את המפתח, הולכת ליעד ומצפה שהמשחק יסתיים בלי לבקש עוד פקודות; היא גם בודקת שהדלת הנעולה מסרבת בלי המפתח ושכיוונים לא מוכרים נדחים.',
      ),
    ],
    check: {
      tests: [
        pythonTest(
          py`
            rooms = ns["rooms"]
            for name, room in rooms.items():
                assert isinstance(room.get("exits"), dict), M("Every room needs an \"exits\" dictionary.", "כל חדר צריך מילון \"exits\".")
                for direction, target in room["exits"].items():
                    assert target in rooms, M("An exit points to a room that does not exist: " + str(target), "יציאה מצביעה על חדר שלא קיים: " + str(target))
            assert any(room["exits"] for room in rooms.values()), M("At least one room must have an exit.", "לפחות לחדר אחד חייבת להיות יציאה.")
            assert "move" in ns and callable(ns["move"]), M("Define a function move(room_name, direction, inventory).", "הגדירו פונקציה move(room_name, direction, inventory).")
            start = ns.get("current")
            assert isinstance(start, str) and start in rooms, M("Keep the starting room name in a variable called current.", "שמרו את שם חדר ההתחלה במשתנה בשם current.")

            # Find the goal and the key by exploring with the reference route: a door that refuses first, opens after take.
            first_dir = next(iter(rooms[start]["exits"]))
            blocked = run_all(["Dana", "left", first_dir, "quit"])
            assert blocked["needInput"] is None, M("Moving must not break the loop: the game must still end on quit.", "תנועה לא יכולה לשבור את הלולאה: המשחק עדיין חייב להסתיים ב-quit.")
            unknown = run(["Dana", "left", "sideways", "quit"])
            assert unknown != run(["Dana", "left", "quit"]), M("An unknown direction must print a message.", "כיוון לא מוכר חייב להדפיס הודעה.")

            # The check walks the reference route: take the key at the start, go through every exit in order until the game ends.
            route = ["Dana", "left", "take"]
            visited = [start]
            here = start
            for _ in range(len(rooms) + 2):
                exits = list(rooms[here]["exits"])
                nxt = None
                for d in exits:
                    if rooms[here]["exits"][d] not in visited:
                        nxt = d
                        break
                if nxt is None:
                    break
                route.append(nxt)
                here = rooms[here]["exits"][nxt]
                visited.append(here)
            win = run_all(route + ["quit", "quit", "quit"])
            assert win["error"] is None, M("The game raised an error while playing: " + str(win["error"]["type"]), "המשחק זרק שגיאה בזמן המשחק: " + str(win["error"]["type"]))
            lines = [l for l in win["stdout"].split("\n") if l.strip()]
            assert len(visited) >= 3, M("The route from the start must reach at least three rooms through exits.", "המסלול מההתחלה חייב להגיע לפחות לשלושה חדרים דרך יציאות.")
            assert win["needInput"] is None, M("Reaching the goal room must end the game.", "הגעה לחדר היעד חייבת לסיים את המשחק.")
            without_key = run_all(["Dana", "left"] + route[3:] + ["quit", "quit", "quit"])
            assert without_key["stdout"] != win["stdout"], M("Without taking the key, the locked door must stop the player, so the game plays differently.", "בלי לקחת את המפתח, הדלת הנעולה חייבת לעצור את השחקן, ולכן המשחק מתנהל אחרת.")
          `,
          { stdin: [NAME, 'left', 'take', 'north', 'up', 'quit'], name: ['Exits connect rooms, a locked door needs the key, the goal ends the game', 'יציאות מחברות חדרים, דלת נעולה דורשת מפתח, היעד מסיים את המשחק'] },
        ),
      ],
    },
    hints: [
      t('Add `"exits": {"north": "stairs"}` to each room, and print them in describe with `", ".join(room["exits"])`.', 'הוסיפו `"exits": {"north": "stairs"}` לכל חדר, והדפיסו אותן ב-describe עם `", ".join(room["exits"])`.'),
      t('`def move(room_name, direction, inventory):` returns `room_name` (after a message) when the direction is missing or the door is locked, otherwise `rooms[room_name]["exits"][direction]`.', '`def move(room_name, direction, inventory):` מחזירה `room_name` (אחרי הודעה) כשהכיוון חסר או הדלת נעולה, אחרת `rooms[room_name]["exits"][direction]`.'),
      t('In the else branch of the loop: `new_room = move(current, command, inventory)`; if it changed, update `current`, describe it, and set `playing = False` with a winning message when it is the goal room.', 'בענף ה-else של הלולאה: `new_room = move(current, command, inventory)`; אם השתנה, עדכנו את `current`, תארו אותו, וקבעו `playing = False` עם הודעת ניצחון כשזה חדר היעד.'),
    ],
    referenceCode: ref14,
  },
  {
    id: 'ta-15-extend',
    title: t('Make it yours: an independent extension', 'הפכו אותו לשלכם: הרחבה עצמאית'),
    requires: ['l27-nested-data'],
    concepts: ['program-structure'],
    instructions: [
      p(
        'The game is playable. Now add one feature of your own without instructions. Pick one from the list below or invent one, plan it in plain words first (lesson 3), build it one line at a time, and test it by playing. There is no automatic check for this step: mark it done when your extension works and you can explain to someone else what each new line does.',
        'המשחק ניתן למשחק. עכשיו הוסיפו תכונה משלכם בלי הוראות. בחרו אחת מהרשימה שלמטה או המציאו אחת, תכננו אותה קודם במילים פשוטות (שיעור 3), בנו אותה שורה אחר שורה, ובדקו אותה על ידי משחק. לצעד הזה אין בדיקה אוטומטית: סמנו אותו כהושלם כשההרחבה עובדת ואתם יכולים להסביר למישהו אחר מה כל שורה חדשה עושה.',
      ),
      list([
        ['A fourth room with its own item and a second locked door.', 'חדר רביעי עם חפץ משלו ודלת נעולה שנייה.'],
        ['A `help` command that lists the commands, and `.lower()` so `Look` works like `look`.', 'פקודת `help` שמציגה את הפקודות, ו-`.lower()` כדי ש-`Look` יעבוד כמו `look`.'],
        ['A turn limit: the storm arrives after 12 turns and the player loses.', 'מגבלת תורות: הסערה מגיעה אחרי 12 תורות והשחקן מפסיד.'],
        ['A character in one room who asks a riddle; the right answer gives an item.', 'דמות באחד החדרים ששואלת חידה; התשובה הנכונה נותנת חפץ.'],
        ['A score printed at the end, based on turns and health.', 'ניקוד שמודפס בסוף, לפי תורות ובריאות.'],
      ]),
      callout(
        'tip',
        'Download your finished game (the Download button above the editor, or the Continue-locally page) and run it with Python on your own computer: it works exactly the same outside the browser.',
        'הורידו את המשחק המוגמר (כפתור ההורדה מעל העורך, או עמוד "המשך במחשב שלכם") והריצו אותו עם פייתון במחשב שלכם: הוא עובד בדיוק אותו דבר מחוץ לדפדפן.',
      ),
    ],
    hints: [
      t('Start with the smallest version of the idea: one new elif in the loop, one print.', 'התחילו מהגרסה הקטנה ביותר של הרעיון: elif חדש אחד בלולאה, print אחד.'),
      t('Run after every line you add; when something breaks, the error message names the line.', 'הריצו אחרי כל שורה שאתם מוסיפים; כשמשהו נשבר, הודעת השגיאה מציינת את השורה.'),
    ],
  },
];

export const project: Project = {
  id: 'p-text-adventure',
  moduleId: 'm7',
  growing: true,
  title: t('Your text adventure', 'הרפתקת הטקסט שלכם'),
  tagline: t('One game that grows with every module: from three printed lines to rooms, choices, turns, functions and an inventory.', 'משחק אחד שגדל עם כל מודול: משלוש שורות מודפסות ועד חדרים, בחירות, תורות, פונקציות ותיק חפצים.'),
  description: [
    p(
      'This project runs alongside the lessons. You start it right after lesson 5, with nothing but print, and you keep coming back: each new idea you learn (variables, input, if, loops, functions, lists, dictionaries) adds one milestone to the same game. By the end of module 6 it is a playable text adventure with rooms, a locked door, an inventory and a way to win, written entirely by you.',
      'הפרויקט הזה רץ לצד השיעורים. מתחילים אותו מיד אחרי שיעור 5, עם `print` בלבד, וחוזרים אליו שוב ושוב: כל רעיון חדש שאתם לומדים (משתנים, קלט, if, לולאות, פונקציות, רשימות, מילונים) מוסיף אבן דרך לאותו משחק. בסוף מודול 6 זו הרפתקת טקסט שאפשר לשחק בה, עם חדרים, דלת נעולה, תיק חפצים ודרך לנצח, שכתובה כולה על ידיכם.',
    ),
    p(
      'Steps unlock as you finish the lessons they need; a locked step tells you which lesson to do first. The story, the names and the messages are your own choices, in any language. The first five lessons get you to the first milestone only; the rest of the game needs modules 2 to 6.',
      'הצעדים נפתחים כשאתם מסיימים את השיעורים שהם צריכים; צעד נעול אומר לכם איזה שיעור לעשות קודם. הסיפור, השמות וההודעות הם בחירות שלכם, בכל שפה. חמשת השיעורים הראשונים מביאים אתכם רק לאבן הדרך הראשונה; שאר המשחק דורש את מודולים 2 עד 6.',
    ),
    structuralNote,
  ],
  finishedDescription: t(
    'A playable text adventure: the player types their name, makes a choice, walks between rooms with north / south / up / down, picks up items, gets past a locked door with the right item, survives random events, and wins by reaching the goal room. The game reports the number of turns at the end.',
    'הרפתקת טקסט שאפשר לשחק בה: השחקן מקליד את שמו, בוחר בחירה, הולך בין חדרים עם north / south / up / down, אוסף חפצים, עובר דלת נעולה עם החפץ הנכון, שורד אירועים אקראיים, ומנצח כשהוא מגיע לחדר היעד. בסוף המשחק מדווח על מספר התורות.',
  ),
  prerequisites: ['l05-print-and-strings'],
  estimatedMinutes: 180,
  starterCode: py`
    # My text adventure
    # Milestone 1: print a title, an empty line, and at least three lines of story.

  `,
  sampleStdin: [NAME, 'left', 'look', 'take', 'north', 'up', 'quit'],
  steps,
  extensions: [
    t('Save and load: at the end print a code the player can type next time to start in the same room with the same items.', 'שמירה וטעינה: בסוף הדפיסו קוד שהשחקן יכול להקליד בפעם הבאה כדי להתחיל באותו חדר עם אותם חפצים.'),
    t('Two endings: a good one and a bad one, depending on health and on which items the player carries.', 'שני סיומים: טוב ורע, לפי הבריאות ולפי החפצים שהשחקן נושא.'),
    t('Move the rooms into a separate list of dictionaries and generate the map description automatically.', 'העבירו את החדרים לרשימה נפרדת של מילונים וייצרו את תיאור המפה אוטומטית.'),
    t('Add a monster that moves between rooms each turn.', 'הוסיפו מפלצת שזזה בין חדרים בכל תור.'),
  ],
  concepts: [
    'print',
    'string',
    'variable',
    'input',
    'f-string',
    'if',
    'elif',
    'else',
    'while',
    'break',
    'accumulator',
    'random-randint',
    'function',
    'parameter',
    'return',
    'list',
    'append',
    'dictionary',
    'nested-data',
    'in-operator',
  ],
};
