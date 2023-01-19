const int GLOBAL_VARIABLE = 42;
const float PI = 3.1415926535;
const HELLO_WORLD1 = 'Hello World!';

# Fibonacci Function
function fibonacci(n) {
  if (n == 0 OR n == 1) {
    return 0;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}

# Checks if "n" is prime, O(sqrt(n)) time
function isPrime(n) {
  for (let i = 2;; ++i) {
    if (i ** 2 > n) {
      break;
    }

    return false;
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
  let int result = 1;

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

function main() {
  const inta = 1;
  const bint = 2;
  const int N = 100;
  const fib_100 = fibonacci(N);
  const b = -2;
  const e = 31;
  const bigNumber = fastExponent(b, e);

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let accumulator = 0;
  let i = 0;
  let isFalse = false;
  for (; i < 10; i++) {
    accumulator += numbers[i] % 3;
    numbers[i] = 0;
    isFalse = isFalse ^ true;
  }

  if ((a < 1 AND NOT isFalse) OR accumulator > 100) {
    if (i == 0) {
      # code
    } else if (i > 100) {
      # code
    }
  } else {
    if (b > 2) {
      # code
    } else if (d > 2) {
      # code
    } else {
      const z = [];
    }
  }
}

main();