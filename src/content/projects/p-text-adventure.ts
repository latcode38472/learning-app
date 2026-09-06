import type { Project } from '../schema';
import { p, code, t, outputTest, pythonTest, requires, py } from '../authoring';

const roomsBlock = py`
  rooms = {
      "hall": {
          "description": "A dusty hall.",
          "exits": {"north": "kitchen", "east": "garden"},
      },
      "kitchen": {
          "description": "A kitchen with a cold stove.",
          "exits": {"south": "hall"},
      },
      "garden": {
          "description": "A quiet garden. You found the treasure!",
          "exits": {"west": "hall"},
      },
  }
`;

const roomsWithItems = py`
  rooms = {
      "hall": {
          "description": "A dusty hall.",
          "exits": {"north": "kitchen", "east": "garden"},
          "items": [],
      },
      "kitchen": {
          "description": "A kitchen with a cold stove.",
          "exits": {"south": "hall"},
          "items": ["key"],
      },
      "garden": {
          "description": "A quiet garden. You found the treasure!",
          "exits": {"west": "hall"},
          "items": [],
      },
  }
`;

const describeBasic = py`
  def describe(room_name):
      room = rooms[room_name]
      print(room["description"])
      print("Exits: " + ", ".join(room["exits"]))
`;

const describeWithItems = py`
  def describe(room_name):
      room = rooms[room_name]
      print(room["description"])
      print("Exits: " + ", ".join(room["exits"]))
      for item in room["items"]:
          print(f"You see a {item}")
`;

const winRoute = ['north', 'take', 'south', 'east'];

export const project: Project = {
  id: 'p-text-adventure',
  moduleId: 'm7',
  title: t('Text adventure', 'הרפתקת טקסט'),
  tagline: t('Rooms, a locked gate, a key and a treasure, all built from a dictionary and a loop.', 'חדרים, שער נעול, מפתח ואוצר, והכול בנוי ממילון ולולאה.'),
  description: [
    p(
      'In a text adventure the player reads a description of where they are and types commands: `north`, `east`, `take`, `quit`. There are no graphics; the whole world lives in your data. You will build one with three rooms, a treasure in the garden, and a gate that only opens with a key from the kitchen.',
      'בהרפתקת טקסט השחקן קורא תיאור של המקום שבו הוא נמצא ומקליד פקודות: `north`, `east`, `take`, `quit`. אין גרפיקה; כל העולם חי בתוך הנתונים שלכם. תבנו הרפתקה כזאת עם שלושה חדרים, אוצר בגינה, ושער שנפתח רק עם מפתח מהמטבח.',
    ),
    p(
      'You grow the program in six steps: the rooms and a describe function, the game loop, a win condition, a move counter, an inventory with a locked gate, and finally a clean structure with functions and `main()`. Every message the game prints is given exactly, because the checks look for it.',
      'תבנו את התוכנית בשישה שלבים: החדרים ופונקציית תיאור, לולאת המשחק, תנאי ניצחון, מונה מהלכים, תיק חפצים עם שער נעול, ולבסוף מבנה מסודר עם פונקציות ו-`main()`. כל הודעה שהמשחק מדפיס נתונה במדויק, כי הבדיקות מחפשות אותה.',
    ),
    p(
      'Everything you need is already in your hands: nested dictionaries (lesson 27), `while True` with `break` (lesson 15), `in` for lists and dictionaries (lessons 25–26), functions with parameters and return values (module 5), and the habit of checking a value before using it (module 7).',
      'כל מה שצריך כבר בידיים שלכם: מילונים מקוננים (שיעור 27), `while True` עם `break` (שיעור 15), `in` לרשימות ולמילונים (שיעורים 25–26), פונקציות עם פרמטרים וערכי החזרה (מודול 5), וההרגל לבדוק ערך לפני שמשתמשים בו (מודול 7).',
    ),
  ],
  prerequisites: ['l26-dictionaries', 'l27-nested-data', 'l23-scope', 'l29-try-except'],
  estimatedMinutes: 60,
  starterCode: py`
    # A text adventure. The player moves between rooms by typing directions.
    # Keep the room names and texts exactly as they are: the checks rely on them.

    rooms = {
        "hall": {
            "description": "A dusty hall.",
            "exits": {"north": "kitchen", "east": "garden"},
        },
        "kitchen": {
            "description": "A kitchen with a cold stove.",
            "exits": {"south": "hall"},
        },
        "garden": {
            "description": "A quiet garden. You found the treasure!",
            "exits": {"west": "hall"},
        },
    }


    # Step 1: write describe(room_name) here

  `,
  sampleStdin: winRoute,
  steps: [
    {
      id: 'p-text-adventure-s1',
      title: t('Rooms and a describe function', 'חדרים ופונקציית describe'),
      instructions: [
        p(
          'The world of the game is the dictionary `rooms`. Each room name maps to another dictionary with a `"description"` (text) and `"exits"` (a dictionary from a direction to the name of the room in that direction). The starter code already contains the three rooms. Keep their names and texts exactly as they are, because the checks rely on them.',
          'העולם של המשחק הוא המילון `rooms`. כל שם חדר מוביל למילון נוסף עם `"description"` (טקסט) ו-`"exits"` (מילון מכיוון לשם החדר שנמצא בכיוון הזה). קוד ההתחלה כבר מכיל את שלושת החדרים. שמרו על השמות והטקסטים שלהם בדיוק כפי שהם, כי הבדיקות מסתמכות עליהם.',
        ),
        p(
          'Write a function `describe(room_name)` that prints the description of that room on one line, and on the next line `Exits: ` followed by the directions separated by a comma and a space, in the order they appear in the dictionary. For the hall that is:',
          'כתבו פונקציה `describe(room_name)` שמדפיסה את תיאור החדר בשורה אחת, ובשורה הבאה `Exits: ` ואחריו הכיוונים מופרדים בפסיק ורווח, בסדר שבו הם מופיעים במילון. עבור האולם זה:',
        ),
        code('A dusty hall.\nExits: north, east', { lang: 'text', runnable: false }),
        p(
          'Tip: `", ".join(room["exits"])` joins the keys of the exits dictionary, in order, into one string. At the end of the file call `describe("hall")` and `describe("kitchen")` to see it work.',
          'טיפ: `", ".join(room["exits"])` מחבר את המפתחות של מילון היציאות, לפי הסדר, למחרוזת אחת. בסוף הקובץ קראו ל-`describe("hall")` ול-`describe("kitchen")` כדי לראות שזה עובד.',
        ),
      ],
      check: {
        tests: [
          outputTest('A dusty hall.\nExits: north, east', { stdin: ['quit'], match: 'contains', name: ['The hall is described', 'האולם מתואר'] }),
          pythonTest(
            py`
              import io
              import sys
              assert "rooms" in ns, "Keep the dictionary called rooms."
              rooms = ns["rooms"]
              assert isinstance(rooms, dict), "rooms must be a dictionary."
              for name in ("hall", "kitchen", "garden"):
                  assert name in rooms, "rooms needs a room called " + name + "."
                  assert "description" in rooms[name] and "exits" in rooms[name], "Each room needs a description and exits."
              assert "describe" in ns and callable(ns["describe"]), "Define a function called describe(room_name)."
              def capture(room_name):
                  buffer = io.StringIO()
                  saved = sys.stdout
                  sys.stdout = buffer
                  try:
                      ns["describe"](room_name)
                  finally:
                      sys.stdout = saved
                  return buffer.getvalue()
              assert capture("hall").startswith("A dusty hall.\nExits: north, east"), "describe('hall') must print the description, then Exits: north, east"
              assert capture("kitchen").startswith("A kitchen with a cold stove.\nExits: south"), "describe('kitchen') must print the description, then Exits: south"
              assert capture("garden").startswith("A quiet garden. You found the treasure!\nExits: west"), "describe('garden') must print the description, then Exits: west"
            `,
            { stdin: ['quit'], name: ['describe works for every room', 'describe עובדת לכל חדר'] },
          ),
        ],
      },
      hints: [
        t('Start with `room = rooms[room_name]`, then print `room["description"]`.', 'התחילו עם `room = rooms[room_name]`, ואז הדפיסו את `room["description"]`.'),
        t('The exits are the keys of `room["exits"]`. `", ".join(...)` turns them into one string such as `north, east`.', 'היציאות הן המפתחות של `room["exits"]`. `", ".join(...)` הופך אותם למחרוזת אחת כמו `north, east`.'),
        t('Two prints: `print(room["description"])` and `print("Exits: " + ", ".join(room["exits"]))`.', 'שתי הדפסות: `print(room["description"])` ו-`print("Exits: " + ", ".join(room["exits"]))`.'),
      ],
      referenceCode: `${roomsBlock}


${describeBasic}


describe("hall")
describe("kitchen")
`,
    },
    {
      id: 'p-text-adventure-s2',
      title: t('The game loop', 'לולאת המשחק'),
      instructions: [
        p(
          'Replace the two test calls with the game itself. Start in `"hall"` and describe it. Then repeat forever: read a command with `input()` (any prompt text). If the command is `quit`, print exactly `Goodbye` and stop. If the command is one of the exits of the current room, move there and describe the new room. Otherwise print exactly `You can\'t go that way`.',
          'החליפו את שתי קריאות הבדיקה במשחק עצמו. התחילו ב-`"hall"` ותארו אותו. אחר כך חזרו לנצח: קראו פקודה עם `input()` (טקסט הבקשה חופשי). אם הפקודה היא `quit`, הדפיסו בדיוק `Goodbye` ועצרו. אם הפקודה היא אחת היציאות של החדר הנוכחי, עברו לשם ותארו את החדר החדש. אחרת הדפיסו בדיוק `You can\'t go that way`.',
        ),
        p(
          'Keep the name of the current room in a variable, for example `current`. The exits of the current room are `rooms[current]["exits"]`; `command in exits` tells you whether the direction is allowed, and `exits[command]` is the name of the room it leads to.',
          'שמרו את שם החדר הנוכחי במשתנה, למשל `current`. היציאות של החדר הנוכחי הן `rooms[current]["exits"]`; `command in exits` אומר לכם אם הכיוון מותר, ו-`exits[command]` הוא שם החדר שאליו הוא מוביל.',
        ),
      ],
      check: {
        tests: [
          outputTest("You can't go that way\nGoodbye", { stdin: ['up', 'quit'], match: 'contains', name: ['Unknown direction, then quit', 'כיוון לא מוכר, ואז quit'] }),
          outputTest('A kitchen with a cold stove.\nExits: south', { stdin: ['north', 'quit'], match: 'contains', name: ['Going north reaches the kitchen', 'הליכה צפונה מגיעה למטבח'] }),
          pythonTest(
            py`
              out = run(["north", "south", "quit"])
              assert out.count("A dusty hall.") == 2, "After going north and then south, the hall must be described again."
              assert out.count("A kitchen with a cold stove.") == 1, "Going north from the hall must describe the kitchen once."
              assert "Goodbye" in out, "Typing quit must print Goodbye."
              first = run(["quit"])
              assert first.strip().startswith("A dusty hall."), "The game must start by describing the hall."
            `,
            { stdin: ['quit'], name: ['Moving back and forth', 'הלוך ושוב'] },
          ),
        ],
      },
      hints: [
        t('`while True:` with `break` when the command is `quit` is the shape of the loop.', '`while True:` עם `break` כשהפקודה היא `quit` היא הצורה של הלולאה.'),
        t('Look up `exits = rooms[current]["exits"]` each time round the loop, because `current` changes.', 'שלפו `exits = rooms[current]["exits"]` בכל סיבוב של הלולאה, כי `current` משתנה.'),
        t('On a valid direction: `current = exits[command]` and then `describe(current)`.', 'בכיוון תקין: `current = exits[command]` ואז `describe(current)`.'),
      ],
      referenceCode: `${roomsBlock}


${describeBasic}


current = "hall"
describe(current)
while True:
    command = input("> ")
    exits = rooms[current]["exits"]
    if command == "quit":
        print("Goodbye")
        break
    elif command in exits:
        current = exits[command]
        describe(current)
    else:
        print("You can't go that way")
`,
    },
    {
      id: 'p-text-adventure-s3',
      title: t('Winning', 'ניצחון'),
      instructions: [
        p(
          'The treasure is in the garden. After moving into a room, check whether `current` is `"garden"`. If it is, print exactly `You win!` and end the game by leaving the loop. The garden is still described first, then the win message.',
          'האוצר נמצא בגינה. אחרי מעבר לחדר, בדקו אם `current` הוא `"garden"`. אם כן, הדפיסו בדיוק `You win!` וסיימו את המשחק ביציאה מהלולאה. הגינה עדיין מתוארת קודם, ורק אז הודעת הניצחון.',
        ),
        p(
          'Try it: `east` from the hall leads straight to the garden. (Later a locked gate will make that harder, so the checks use the route `north`, `take`, `south`, `east`, which works in every version of the game.)',
          'נסו: `east` מהאולם מוביל ישר לגינה. (בהמשך שער נעול יקשה על זה, ולכן הבדיקות משתמשות במסלול `north`, `take`, `south`, `east`, שעובד בכל גרסה של המשחק.)',
        ),
      ],
      check: {
        tests: [
          outputTest('You win!', { stdin: winRoute, match: 'contains', name: ['Reaching the garden wins', 'הגעה לגינה מנצחת'] }),
          pythonTest(
            py`
              out = run(["north", "take", "south", "east"])
              assert "You found the treasure!" in out, "Describe the garden before announcing the win."
              assert "You win!" in out, "Entering the garden must print You win!"
              assert out.index("You found the treasure!") < out.index("You win!"), "Describe the garden first, then print You win!"
              assert "Goodbye" not in out, "After winning, the game must end without asking for more commands."
            `,
            { stdin: ['quit'], name: ['The win ends the game', 'הניצחון מסיים את המשחק'] },
          ),
        ],
      },
      hints: [
        t('Right after `describe(current)`, add `if current == "garden":`.', 'מיד אחרי `describe(current)`, הוסיפו `if current == "garden":`.'),
        t('Inside it print `You win!` and use `break` to leave the loop.', 'בתוכו הדפיסו `You win!` והשתמשו ב-`break` כדי לצאת מהלולאה.'),
        t('Make sure this check happens only after a successful move, inside the branch that changes `current`.', 'ודאו שהבדיקה הזאת קורית רק אחרי מעבר מוצלח, בתוך הענף שמשנה את `current`.'),
      ],
      referenceCode: `${roomsBlock}


${describeBasic}


current = "hall"
describe(current)
while True:
    command = input("> ")
    exits = rooms[current]["exits"]
    if command == "quit":
        print("Goodbye")
        break
    elif command in exits:
        current = exits[command]
        describe(current)
        if current == "garden":
            print("You win!")
            break
    else:
        print("You can't go that way")
`,
    },
    {
      id: 'p-text-adventure-s4',
      title: t('Counting moves', 'ספירת מהלכים'),
      instructions: [
        p(
          'Count how many times the player successfully moved to another room. A rejected direction does not count. When the game ends, by winning or by typing `quit`, print exactly `Moves: ` followed by the number, for example `Moves: 3`.',
          'ספרו כמה פעמים השחקן עבר בהצלחה לחדר אחר. כיוון שנדחה לא נספר. כשהמשחק מסתיים, בניצחון או בהקלדת `quit`, הדפיסו בדיוק `Moves: ` ואחריו המספר, למשל `Moves: 3`.',
        ),
      ],
      check: {
        tests: [
          outputTest('Goodbye\nMoves: 0', { stdin: ['quit'], match: 'contains', name: ['Quit at once: zero moves', 'יציאה מיידית: אפס מהלכים'] }),
          outputTest('Moves: 2', { stdin: ['north', 'south', 'quit'], match: 'contains', name: ['Two moves', 'שני מהלכים'] }),
          outputTest('Moves: 1', { stdin: ['up', 'north', 'quit'], match: 'contains', name: ['A rejected direction is not a move', 'כיוון שנדחה אינו מהלך'] }),
          outputTest('You win!\nMoves: 3', { stdin: winRoute, match: 'contains', name: ['Moves are printed after the win', 'המהלכים מודפסים אחרי הניצחון'] }),
        ],
      },
      hints: [
        t('Create `moves = 0` before the loop and add 1 only where `current` changes.', 'צרו `moves = 0` לפני הלולאה והוסיפו 1 רק במקום שבו `current` משתנה.'),
        t('Both `break`s lead to the same place: the first line after the loop. Print the count there, once.', 'שני ה-`break` מובילים לאותו מקום: השורה הראשונה אחרי הלולאה. הדפיסו שם את המונה, פעם אחת.'),
        t('`print(f"Moves: {moves}")` after the loop.', '`print(f"Moves: {moves}")` אחרי הלולאה.'),
      ],
      referenceCode: `${roomsBlock}


${describeBasic}


current = "hall"
moves = 0
describe(current)
while True:
    command = input("> ")
    exits = rooms[current]["exits"]
    if command == "quit":
        print("Goodbye")
        break
    elif command in exits:
        current = exits[command]
        moves = moves + 1
        describe(current)
        if current == "garden":
            print("You win!")
            break
    else:
        print("You can't go that way")
print(f"Moves: {moves}")
`,
    },
    {
      id: 'p-text-adventure-s5',
      title: t('A key and a locked gate', 'מפתח ושער נעול'),
      instructions: [
        p(
          'Give every room a list called `"items"`: the kitchen has `["key"]`, the other two rooms have `[]`. In `describe`, after the exits line, print `You see a ` followed by the item name for each item in the room, so the kitchen shows `You see a key`.',
          'תנו לכל חדר רשימה בשם `"items"`: למטבח יש `["key"]`, לשני החדרים האחרים יש `[]`. ב-`describe`, אחרי שורת היציאות, הדפיסו `You see a ` ואחריו שם החפץ עבור כל חפץ בחדר, כך שהמטבח מציג `You see a key`.',
        ),
        p(
          'Add an `inventory` list for the player and a new command `take`. If the current room has an item, remove it from the room, add it to the inventory and print `You took the ` followed by the item name, so `You took the key`. If there is nothing to take, print exactly `Nothing to take`. Taking is not a move.',
          'הוסיפו רשימה `inventory` לשחקן ופקודה חדשה `take`. אם בחדר הנוכחי יש חפץ, הסירו אותו מהחדר, הוסיפו אותו לתיק החפצים והדפיסו `You took the ` ואחריו שם החפץ, כלומר `You took the key`. אם אין מה לקחת, הדפיסו בדיוק `Nothing to take`. לקיחה אינה מהלך.',
        ),
        p(
          'Finally, the gate: going `east` from the hall is allowed only if `"key"` is in the inventory. Otherwise print exactly `The gate is locked` and stay in the hall; this does not count as a move.',
          'ולבסוף השער: ללכת `east` מהאולם מותר רק אם `"key"` נמצא בתיק החפצים. אחרת הדפיסו בדיוק `The gate is locked` והישארו באולם; זה לא נספר כמהלך.',
        ),
      ],
      check: {
        tests: [
          outputTest('Exits: south\nYou see a key', { stdin: ['north', 'quit'], match: 'contains', name: ['The kitchen shows the key', 'המטבח מציג את המפתח'] }),
          outputTest('You took the key', { stdin: winRoute, match: 'contains', name: ['Taking the key', 'לקיחת המפתח'] }),
          outputTest('The gate is locked', { stdin: ['east', 'quit'], match: 'contains', name: ['The gate is locked without the key', 'השער נעול בלי המפתח'] }),
          outputTest('Moves: 0', { stdin: ['east', 'quit'], match: 'contains', name: ['A locked gate is not a move', 'שער נעול אינו מהלך'] }),
          outputTest('You win!\nMoves: 3', { stdin: winRoute, match: 'contains', name: ['With the key, the garden is reachable', 'עם המפתח אפשר להגיע לגינה'] }),
          outputTest('Nothing to take', { stdin: ['take', 'quit'], match: 'contains', name: ['Nothing to take in the hall', 'אין מה לקחת באולם'] }),
          pythonTest(
            py`
              out = run(["north", "take", "take", "quit"])
              assert out.count("You took the key") == 1, "The key can be taken only once."
              assert "Nothing to take" in out, "Taking again in an empty room must print Nothing to take."
              again = run(["north", "take", "south", "north", "quit"])
              assert again.count("You see a key") == 1, "After the key is taken, the kitchen must not show it any more."
              assert "Moves: 3" in again, "Taking is not a move: north, south, north are three moves."
            `,
            { stdin: ['quit'], name: ['The key can be taken once', 'אפשר לקחת את המפתח פעם אחת'] },
          ),
        ],
      },
      hints: [
        t('A room dictionary can have a third key: `"items": ["key"]`. In `describe`, loop with `for item in room["items"]:`.', 'למילון של חדר יכול להיות מפתח שלישי: `"items": ["key"]`. ב-`describe`, עברו בלולאה עם `for item in room["items"]:`.'),
        t('Handle `take` before the directions: `items = rooms[current]["items"]`; if it is empty print the message, otherwise `item = items.pop(0)` and `inventory.append(item)`.', 'טפלו ב-`take` לפני הכיוונים: `items = rooms[current]["items"]`; אם היא ריקה הדפיסו את ההודעה, אחרת `item = items.pop(0)` ו-`inventory.append(item)`.'),
        t('Before moving, check `if current == "hall" and command == "east" and "key" not in inventory:` and print the locked message instead of moving.', 'לפני המעבר, בדקו `if current == "hall" and command == "east" and "key" not in inventory:` והדפיסו את הודעת הנעילה במקום לעבור.'),
      ],
      referenceCode: `${roomsWithItems}


${describeWithItems}


current = "hall"
inventory = []
moves = 0
describe(current)
while True:
    command = input("> ")
    exits = rooms[current]["exits"]
    if command == "quit":
        print("Goodbye")
        break
    elif command == "take":
        items = rooms[current]["items"]
        if len(items) == 0:
            print("Nothing to take")
        else:
            item = items.pop(0)
            inventory.append(item)
            print(f"You took the {item}")
    elif command in exits:
        if current == "hall" and command == "east" and "key" not in inventory:
            print("The gate is locked")
        else:
            current = exits[command]
            moves = moves + 1
            describe(current)
            if current == "garden":
                print("You win!")
                break
    else:
        print("You can't go that way")
print(f"Moves: {moves}")
`,
    },
    {
      id: 'p-text-adventure-s6',
      title: t('Organise into functions', 'ארגון בפונקציות'),
      instructions: [
        p(
          'The loop has grown. Split the program into functions and a `main()`. Keep `rooms` and `describe` at the top. Add `take(room_name, inventory)` for the take command, and `move(room_name, direction, inventory)` that prints `You can\'t go that way` or `The gate is locked` when needed and returns the name of the room the player is in afterwards. `main()` holds `current`, `inventory` and `moves`, runs the loop, and is called on the last line of the file. The game must behave exactly as before.',
          'הלולאה גדלה. פצלו את התוכנית לפונקציות ול-`main()`. השאירו את `rooms` ואת `describe` למעלה. הוסיפו `take(room_name, inventory)` לפקודת take, ו-`move(room_name, direction, inventory)` שמדפיסה `You can\'t go that way` או `The gate is locked` כשצריך ומחזירה את שם החדר שבו השחקן נמצא אחר כך. `main()` מחזיקה את `current`, `inventory` ו-`moves`, מריצה את הלולאה, ונקראת בשורה האחרונה של הקובץ. המשחק חייב להתנהג בדיוק כמו קודם.',
        ),
        p(
          'Tip: if `move` returns the same room name, the move failed; if it returns a different one, count the move, describe the new room and check for the win.',
          'טיפ: אם `move` מחזירה את אותו שם חדר, המעבר נכשל; אם היא מחזירה שם אחר, ספרו את המהלך, תארו את החדר החדש ובדקו ניצחון.',
        ),
      ],
      check: {
        tests: [
          outputTest('Goodbye\nMoves: 0', { stdin: ['quit'], match: 'contains', name: ['main() runs the game', 'main() מריצה את המשחק'] }),
          pythonTest(
            py`
              assert "main" in ns and callable(ns["main"]), "Define a function called main() that runs the game."
              functions = [name for name, value in ns.items() if type(value).__name__ == "function"]
              assert len(functions) >= 3, "Split the game into at least three functions, for example describe, move and main."
              out = run(["north", "take", "south", "east"])
              assert "You took the key" in out and "You win!" in out and "Moves: 3" in out, "The game must still work exactly as before."
              locked = run(["east", "quit"])
              assert "The gate is locked" in locked and "Moves: 0" in locked, "The locked gate must still work."
              lost = run(["up", "quit"])
              assert "You can't go that way" in lost, "Unknown directions must still be rejected."
            `,
            { stdin: ['quit'], name: ['Functions and main()', 'פונקציות ו-main()'] },
          ),
        ],
        requires: [
          requires('\\bdef\\s+main\\s*\\(', 'Define a function called main() that runs the game.', 'הגדירו פונקציה בשם main() שמריצה את המשחק.'),
        ],
      },
      hints: [
        t('Move the code of the take branch into `def take(room_name, inventory):` and call it from the loop.', 'העבירו את הקוד של ענף ה-take לתוך `def take(room_name, inventory):` וקראו לה מהלולאה.'),
        t('`move` should `return room_name` unchanged when the direction is invalid or the gate is locked, and `return exits[direction]` otherwise.', '`move` צריכה להחזיר את `room_name` ללא שינוי כשהכיוון לא תקין או כשהשער נעול, ו-`return exits[direction]` אחרת.'),
        t('In `main()`: `new_room = move(current, command, inventory)`; if `new_room != current`, update `current`, add 1 to `moves`, describe, and check for the win.', 'ב-`main()`: `new_room = move(current, command, inventory)`; אם `new_room != current`, עדכנו את `current`, הוסיפו 1 ל-`moves`, תארו, ובדקו ניצחון.'),
      ],
      referenceCode: `${roomsWithItems}


${describeWithItems}


def take(room_name, inventory):
    items = rooms[room_name]["items"]
    if len(items) == 0:
        print("Nothing to take")
    else:
        item = items.pop(0)
        inventory.append(item)
        print(f"You took the {item}")


def move(room_name, direction, inventory):
    exits = rooms[room_name]["exits"]
    if direction not in exits:
        print("You can't go that way")
        return room_name
    if room_name == "hall" and direction == "east" and "key" not in inventory:
        print("The gate is locked")
        return room_name
    return exits[direction]


def main():
    current = "hall"
    inventory = []
    moves = 0
    describe(current)
    while True:
        command = input("> ")
        if command == "quit":
            print("Goodbye")
            break
        elif command == "take":
            take(current, inventory)
        else:
            new_room = move(current, command, inventory)
            if new_room != current:
                current = new_room
                moves = moves + 1
                describe(current)
                if current == "garden":
                    print("You win!")
                    break
    print(f"Moves: {moves}")


main()
`,
    },
  ],
  extensions: [
    t('Add a fourth room, for example a cellar under the kitchen, with an item of its own.', 'הוסיפו חדר רביעי, למשל מרתף מתחת למטבח, עם חפץ משלו.'),
    t('Add a `look` command that describes the current room again, and an `inventory` command that lists what you carry.', 'הוסיפו פקודה `look` שמתארת את החדר הנוכחי שוב, ופקודה `inventory` שמציגה מה אתם נושאים.'),
    t('Accept commands in any capitalisation with `.lower()`, and treat an empty line as "nothing happened".', 'קבלו פקודות בכל צורת אותיות בעזרת `.lower()`, והתייחסו לשורה ריקה כאל "לא קרה כלום".'),
    t('Add a second locked door that needs a different item, and a message that tells the player which item is missing.', 'הוסיפו דלת נעולה שנייה שדורשת חפץ אחר, והודעה שאומרת לשחקן איזה חפץ חסר.'),
    t('Limit the game to 10 moves: when the limit is reached, print a losing message and end.', 'הגבילו את המשחק ל-10 מהלכים: כשמגיעים לגבול, הדפיסו הודעת הפסד וסיימו.'),
  ],
  concepts: [
    'dictionary',
    'nested-data',
    'key-value',
    'dict-loop',
    'while',
    'break',
    'if',
    'elif',
    'in-operator',
    'list',
    'append',
    'remove-pop',
    'function',
    'parameter',
    'return',
    'scope',
    'program-structure',
    'split-join',
    'input',
    'f-string',
  ],
};
