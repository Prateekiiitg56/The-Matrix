export const curriculum = [
  {
    id: "module-0",
    title: "Core Protocols",
    description: "System Initialization and Basic Output",
    lessons: [
      {
        id: "py-hello",
        title: "Hello World",
        xp: 50,
        theory: "### Awakening the System\nIn Python, the first step is learning to communicate with the system interface. We use the `print()` protocol to output text to the screen.\n\n```python\nprint(\"Hello World\")\n```\n\nText must be wrapped in quotation marks to differentiate it from system commands.",
        codeExample: "# This is a comment. Python ignores lines starting with #\nprint(\"Welcome to the Construct.\")\nprint(\"Loading training programs...\")",
        task: {
          instruction: "Use the print command to output the exact phrase 'Hello Neo' to the terminal.",
          starterCode: "# Write your code here\n",
          tests: [
            { type: 'output', check: "Hello Neo", expected: true, hint: "Type exactly: print('Hello Neo') — capital H and N matter!" }
          ]
        },
        quiz: [
          {
            question: "What function is used to output text to the console in Python?",
            options: ["echo()", "console.log()", "print()", "output()"],
            answer: 2,
            explanation: "Python uses 'print()' as its standard output function."
          }
        ]
      }
    ]
  },
  {
    id: "module-1",
    title: "Memory Allocation",
    description: "Variables, Data Types, and Typecasting",
    lessons: [
      {
        id: "py-variables",
        title: "Variables & Assignment",
        xp: 75,
        theory: "### Data Containers\nA **variable** is a dynamic container that holds information in memory. The equals sign (`=`) is the assignment operator.\n\n```python\nagent_name = \"Smith\"\nclones = 100\n```\n\nYou can view a variable's value using `print()`.",
        codeExample: "agent = \"Smith\"\nlevel = 5\n\nprint(\"Agent:\", agent)\nprint(\"Level:\", level)",
        task: {
          instruction: "Create a variable called 'target' and assign it the string 'Morpheus'.",
          starterCode: "# Define your variable below\n\n",
          tests: [
            { type: 'var', check: "target", expected: "Morpheus", hint: "Make sure the capitalization is exactly right: 'Morpheus'." }
          ]
        },
        quiz: [
          {
            question: "Which symbol is used to assign a value to a variable?",
            options: ["==", "->", "=", "<-"],
            answer: 2,
            explanation: "The single equals sign (=) assigns a value. Double equals (==) checks equality."
          }
        ]
      },
      {
        id: "py-types",
        title: "Data Types & Casting",
        xp: 100,
        theory: "### The Fabric of Data\nEvery value in Python belongs to a **type**:\n- **Strings (str):** Text. `\"Matrix\"`\n- **Integers (int):** Whole numbers. `42`\n- **Floats (float):** Decimals. `3.14`\n- **Booleans (bool):** Truth values. `True` or `False`\n\nYou can convert between types with `int()`, `str()`, `float()`.",
        codeExample: "version = 2.0\nsecure = False\nprint(type(version))\nprint(type(secure))",
        task: {
          instruction: "Create an integer 'agents' set to 3. Create a boolean 'breach' set to True.",
          starterCode: "# Define agents and breach\n\n",
          tests: [
            { type: 'var', check: "agents", expected: 3, hint: "Make sure 'agents' is a number without quotes." },
            { type: 'var', check: "breach", expected: true, hint: "Booleans must start with a capital letter: True." }
          ]
        },
        quiz: [
          {
            question: "What data type is the value 42.0?",
            options: ["str", "int", "float", "bool"],
            answer: 2,
            explanation: "The decimal point makes it a float, even if the decimal part is .0."
          }
        ]
      }
    ]
  },
  {
    id: "module-2",
    title: "Branching Realities",
    description: "Conditionals and Logic Operators",
    lessons: [
      {
        id: "py-if-else",
        title: "Conditionals",
        xp: 100,
        theory: "### Routing the Flow\nPrograms must make choices. The `if` statement executes code only when a particular condition is met.\n\n```python\npower_level = 90\nif power_level > 80:\n    print(\"Critical\")\nelif power_level > 50:\n    print(\"Stable\")\nelse:\n    print(\"Failing\")\n```\n\nPython uses **indentation** (4 spaces) to mark code blocks, not curly braces.",
        codeExample: "threat = 90\nif threat > 80:\n    print(\"WARNING: Agent detected\")\nelse:\n    print(\"Sector clear\")",
        task: {
          instruction: "Write an if/else block. If 'code' equals 101, create 'status' set to 'granted'. Else, set 'status' to 'denied'.",
          starterCode: "code = 101\n\n# Write your conditional block below\n",
          tests: [
            { type: 'var', check: "status", expected: "granted", hint: "Use '==' (double equals) to compare code to 101. 'status' must be lowercase." }
          ]
        },
        quiz: [
          {
            question: "How does Python determine which code belongs inside an if statement?",
            options: ["Curly braces {}", "Indentation", "Keywords like 'end if'", "Parentheses ()"],
            answer: 1,
            explanation: "Python strictly relies on whitespace indentation to group statements into blocks."
          }
        ]
      },
      {
        id: "py-logic",
        title: "Logic Operators",
        xp: 100,
        theory: "### Combining Conditions\nYou can chain conditionals using `and`, `or`, `not`.\n\n```python\nis_plugged_in = True\nis_awake = False\n\nif is_plugged_in and not is_awake:\n    print(\"Subject is asleep in the Matrix.\")\n```",
        codeExample: "pills = 2\nchoice = \"blue\"\nif pills > 1 and choice == \"blue\":\n    print(\"User aborted awakening\")",
        task: {
          instruction: "Set boolean 'has_key' to True and 'door_locked' to False. Create variable 'enter' = True only IF has_key is True AND door_locked is False.",
          starterCode: "# Define the logic\n\n",
          tests: [
            { type: 'var', check: "enter", expected: true, hint: "enter = has_key and not door_locked" }
          ]
        },
        quiz: [
          {
            question: "What is the result of 'True and False'?",
            options: ["True", "False", "None", "Error"],
            answer: 1,
            explanation: "The 'and' operator requires BOTH sides to be True to evaluate as True."
          }
        ]
      }
    ]
  },
  {
    id: "module-3",
    title: "Infinite Recurrence",
    description: "While Loops, For Loops, Iteration",
    lessons: [
      {
        id: "py-while",
        title: "While Loops",
        xp: 125,
        theory: "### Infinite States\nA `while` loop runs as long as a condition remains true.\n\n```python\ncount = 3\nwhile count > 0:\n    print(count)\n    count -= 1  # Same as count = count - 1\n```\n\n> Warning: Forgetting to update the condition causes an infinite loop.",
        codeExample: "ammo = 3\nwhile ammo > 0:\n    print(\"Bang!\")\n    ammo -= 1\nprint(\"Reloading...\")",
        task: {
          instruction: "Set 'power' to 1. Use a while loop to multiply 'power' by 2 until it is strictly greater than 50.",
          starterCode: "power = 1\n\n# Write while loop here\n",
          tests: [
            { type: 'var', check: "power", expected: 64, hint: "Loop while power <= 50. Path: 1->2->4->8->16->32->64" }
          ]
        },
        quiz: [
          {
            question: "What happens if a while loop condition never becomes False?",
            options: ["It stops automatically", "It skips the loop", "Infinite loop (freezes program)", "Syntax error"],
            answer: 2,
            explanation: "If the condition never flips to False, the program loops forever."
          }
        ]
      },
      {
        id: "py-for",
        title: "For Loops & Range",
        xp: 125,
        theory: "### Bounded Iteration\nA `for` loop iterates over a sequence exactly.\n\n```python\nfor i in range(3):\n    print(\"Sector\", i)\n```\n\n`range(start, stop)` generates numbers from start up to, but NOT including, stop.\nIf only one argument: `range(3)` generates 0, 1, 2.",
        codeExample: "for i in range(1, 4):\n    print(\"Ping\", i)\nprint(\"Connection established.\")",
        task: {
          instruction: "Create 'total' = 0. Loop 'i' through range(1, 6) — meaning values 1,2,3,4,5. Add 'i' to 'total' each iteration.",
          starterCode: "total = 0\n\n# For loop here\n",
          tests: [
            { type: 'var', check: "total", expected: 15, hint: "range(1, 6) = 1,2,3,4,5. Sum = 15." }
          ]
        },
        quiz: [
          {
            question: "What numbers will range(2, 5) generate?",
            options: ["1, 2, 3, 4, 5", "2, 3, 4", "2, 4", "3, 4, 5"],
            answer: 1,
            explanation: "range(start, stop) generates integers from start up to, but NOT including, stop."
          }
        ]
      }
    ]
  },
  {
    id: "module-4",
    title: "Data Entities",
    description: "Lists, Tuples, and Dictionaries",
    lessons: [
      {
        id: "py-lists",
        title: "Lists (Arrays)",
        xp: 150,
        theory: "### Grouped Entities\nA List is an ordered, mutable sequence using square brackets `[]`.\n\n```python\nweapons = [\"Pistol\", \"Rifle\", \"EMP\"]\nprint(weapons[0])  # Pistol (zero-indexed!)\nweapons.append(\"Sword\")\n```\n\nYou can iterate through lists directly: `for w in weapons:`",
        codeExample: "targets = [\"Smith\", \"Brown\", \"Jones\"]\ntargets.append(\"Johnson\")\nprint(\"Total:\", len(targets))\nfor t in targets:\n    print(\"Scanning:\", t)",
        task: {
          instruction: "Create a list 'crew' containing 'Morpheus' and 'Trinity'. Then use crew.append() to add 'Neo' to the end.",
          starterCode: "# List operations\n",
          tests: [
            { type: 'var', check: "crew", expected: ["Morpheus", "Trinity", "Neo"], hint: "crew = ['Morpheus', 'Trinity']  then  crew.append('Neo')" }
          ]
        },
        quiz: [
          {
            question: "What is the index of the first item in a Python list?",
            options: ["1", "-1", "0", "null"],
            answer: 2,
            explanation: "Python lists are zero-indexed — first item is at index 0."
          }
        ]
      },
      {
        id: "py-dicts",
        title: "Dictionaries",
        xp: 150,
        theory: "### Key-Value Mappings\nA Dictionary maps unique **keys** to **values** using curly braces `{}`.\n\n```python\nagent = {\n    \"name\": \"Smith\",\n    \"speed\": 99,\n    \"active\": True\n}\nprint(agent[\"speed\"])  # 99\nagent[\"speed\"] = 100   # Modifying values\n```",
        codeExample: "ship = {\n    \"name\": \"Nebuchadnezzar\",\n    \"captain\": \"Morpheus\"\n}\nprint(ship[\"captain\"])",
        task: {
          instruction: "Create a dict 'operator' with 'name' = 'Tank' and 'level' = 4. Then add key 'awake' = True.",
          starterCode: "# Dict construction\n",
          tests: [
            { type: 'var', check: "operator", expected: { "name": "Tank", "level": 4, "awake": true }, hint: "operator = {'name': 'Tank', 'level': 4}  then  operator['awake'] = True" }
          ]
        },
        quiz: [
          {
            question: "How do you access the value for key 'speed' in dict 'agent'?",
            options: ["agent.speed", "agent{speed}", "agent['speed']", "agent->speed"],
            answer: 2,
            explanation: "Use bracket notation with a string key to access dictionary values."
          }
        ]
      }
    ]
  },
  {
    id: "module-5",
    title: "Subroutines",
    description: "Functions, Parameters, and Scope",
    lessons: [
      {
        id: "py-functions",
        title: "Defining Functions",
        xp: 200,
        theory: "### Code Reusability\nA function encapsulates a block of logic you can call repeatedly. Use the `def` keyword.\n\n```python\ndef scan_area():\n    print(\"Scanning...\")\n    return True\n\nresult = scan_area()\n```\n\nFunctions can `return` data back to the caller after completing their operation.",
        codeExample: "def hack_terminal():\n    print(\"Bypassing firewall...\")\n    return \"Access Granted\"\n\nmsg = hack_terminal()\nprint(\"Result:\", msg)",
        task: {
          instruction: "Write a function 'get_code()' with no parameters that returns the integer 404.",
          starterCode: "# Define your function below\n\n",
          tests: [
            { type: 'var', check: "get_code()", expected: 404, hint: "def get_code():\\n    return 404" }
          ]
        },
        quiz: [
          {
            question: "Which keyword is used to declare a function in Python?",
            options: ["function", "func", "def", "declare"],
            answer: 2,
            explanation: "'def' stands for define. It is followed by the function name and parentheses."
          }
        ]
      },
      {
        id: "py-params",
        title: "Parameters & Scope",
        xp: 200,
        theory: "### Injecting Variables\nFunctions accept **arguments** that customize their behaviour.\n\n```python\ndef greet(name):\n    return \"Hello, \" + name\n\nprint(greet(\"Smith\"))\n```\n\nVariables created *inside* a function are **local** — they vanish when the function returns.",
        codeExample: "def multiply(a, b):\n    result = a * b\n    return result\n\nprint(\"5 x 4 =\", multiply(5, 4))",
        task: {
          instruction: "Define a function 'add(x, y)' that returns the sum of x and y. add(10, 5) should return 15.",
          starterCode: "# Function with parameters\n",
          tests: [
            { type: 'var', check: "add(10, 5)", expected: 15, hint: "def add(x, y):\\n    return x + y" }
          ]
        },
        quiz: [
          {
            question: "Variables defined inside a function are...",
            options: ["Accessible anywhere in the program", "Accessible only inside that function", "Always global"],
            answer: 1,
            explanation: "Python enforces local scope — variables inside a function cannot be accessed from outside."
          }
        ]
      }
    ]
  },
  {
    id: "module-6",
    title: "Advanced Architecture",
    description: "Object-Oriented Programming with Classes",
    lessons: [
      {
        id: "py-classes",
        title: "Classes & Objects",
        xp: 500,
        theory: "### Creating Reality\nOOP lets you define your own complex data types using **Classes**. A class is a blueprint; an **object** is an instance of it.\n\n```python\nclass Agent:\n    def __init__(self, name):\n        self.name = name\n        self.speed = 100\n\n    def report(self):\n        return self.name + \" reporting in.\"\n\nsmith = Agent(\"Smith\")\nprint(smith.report())\n```\n\n`__init__` is the constructor — called automatically when an object is created. `self` refers to the specific instance.",
        codeExample: "class Ship:\n    def __init__(self, name):\n        self.name = name\n\n    def fly(self):\n        print(self.name, \"is flying.\")\n\nship1 = Ship(\"Nebuchadnezzar\")\nship1.fly()",
        task: {
          instruction: "Create a class 'User'. In __init__(self, name), attach name to self.name. Then create p1 = User('Neo').",
          starterCode: "class User:\n    # write __init__ function here\n    pass\n\np1 = None\n",
          tests: [
            { type: 'var', check: "p1.name", expected: "Neo", hint: "def __init__(self, name):\\n    self.name = name\\np1 = User('Neo')" }
          ]
        },
        quiz: [
          {
            question: "What is the purpose of the '__init__' method?",
            options: ["It destroys the object", "It is the constructor that initializes object state", "It prints data to the console", "It inherits from other classes"],
            answer: 1,
            explanation: "__init__ is called when a new object is instantiated, setting up its initial state."
          }
        ]
      }
    ]
  }
];
