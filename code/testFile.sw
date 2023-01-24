# IDENTIFIERS
let a = 12;
let ave = 1.15;
# INVALID LINE: let 2pi = 3.14;

# KEYWORDS AND RESERVED WORDS
let isWorking = true;
let isRunning = false;
let string empty = null;
let num = 3;
let average = 1.25;
let char letter = 'a';
let phrase = 'Watch them run.';
let b = 35;

# Fibonacci Function
function fibonacci(n) {
  if (num == 0 OR num == 1) {
    return 0;
  }

  return fibonacci(num - 1) + fibonacci(num - 2);
}

# Checks if "n" is prime, O(sqrt(n)) time
function isPrime(n) {
  for (let i = 2;; ++i) {
    if (i ** 2 > n) {
      break;
    }

    if (n % i == 0) {
      return false;
    }
  }

  return true;
}

###
  Binary Exponential Function
  Time Complexity: O(log(exponent))

  Example Usage: fastExponent(2, 31)
###
function fastExponent(base, exponent) {
  let result = 1;
  let b = base;

  while (exponent > 0) {
    if (exponent & 1) {
      result *= b;
    }

    b *= b;
    exponent >>= 1;
  }

  return result;
}

# Gets Integer number from user, retries until the given input is Integer,
# and raises an error if the integer is not within the given range
function getIntegerFromUser(minimum, maximum) {
  let int result;

  do {
    const string userInput = input();

    try {
      result = parseInt(userInput);

      if (NOT (result >= minimum AND result <= maximum)) {
        raise "Integer is not within the given range: " + minimum + " to " + maximum;
      }
    } catch (error) {
      print("Invalid Input");
    } finally {
      print("Input received:", userInput);
    }
  } while (result == null);

  return result;
}

function arithmeticSymbolToString(symbol) {
  switch (symbol) {
    case "+" {
      return "ADDITION";
    }
    case "-" {
      return "SUBTRACTION";
    }
    case "*" {
      return "MULTIPLICATION";
    }
    case "/" {
      return "DIVISION";
    }
    case "%" {
      return "MODULO";
    }
    default {
      return "";
    }
  }
}
# INVALID LINE: let true = 25;
# INVALID LINE: const string for = 'This fight is for you!';

# CONSTANT VALUES
const int GLOBAL_VARIABLE = 42;
const float PI = 3.1415926535;
const string HELLO_WORLD1 = 'Hello World!';
constant bool IS_PRODUCTION = false;

# NOISE WORDS
const string hi = 'Hi!';
constant float passingGrade = 2.5;
let bool pass = true;
let boolean fail = false;

# OPERATORS: ARITHMETIC
let result = (((7 + 3 - 1) * (8 ** 2)) // 4) % 5;

# OPERATORS: BOOLEAN
const boolean BOOLEAN_OPERATORS = NOT a > b AND (c < d OR e >= f) AND g <= h OR i == j AND k != l;