import { TestResultStatus } from "./BNF/BaseBNF";
import { toTable } from "./BNF/formatter";
import { SWISS } from "./BNF/terminal/statement";
import { vizualize, vizualizeParseTree } from "./BNF/viz";

const main = async () => {
  const bnf = SWISS;
  const input = `
const int GLOBAL_VARIABLE = 42;
const float PI = 3.1415926535;
const string HELLO_WORLD1 = 'Hello World!';
constant bool IS_PRORDUCTION = false;
let OPERATORS = 1 + 2 - 3 * 4 / 5 % 6 // 7 ** 8;
const boolean BOOLEAN_OPERATORS = NOT a > b AND c < d OR e >= f AND g <= h OR i == j AND k != l;
let ARRAY = [1, 2, 3, 'str', [10, [["x", 'y'], GLOBAL_VARIABLE], 3]];

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
`;

  console.log("start");

  const res = await bnf.test(input);
  // vizualizeParseTree(res.task.children[0]);

  if (res.status === TestResultStatus.SUCCESS) {
    console.log("[?] SUCCESS");
  } else if (res.status === TestResultStatus.FAILED) {
    console.log(`[!] Failed`);
  }

  console.log(res.range);

  toTable("symbol_table.txt", res);

  for (const b of [bnf]) {
    console.log(b.toDeclaration());
  }
  // vizualize("res", bnf);
};

main();
