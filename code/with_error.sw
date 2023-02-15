
const float PI = 3.14159;
PI += 1;                        # ERROR

constant GOLDEN_RATIO = 1.618;
const int z;                    # ERROR
let a = 1.43;
const a = 1;                    # ERROR
let int b = 2.41;               # ERROR
let char c = "Hello World";     # ERROR
constant string d = "Hello World";
let boolean e = true;
const bool g = 1;
let int f = true;               # ERROR
let array arr = [1, 2, PI];
let array arr2 = 1;             # ERROR


let int x = 0;
x++;

y++;                            # ERROR

let z = x * a + PI + 2 * GOLDEN_RATIO;
z += y;                         # ERROR

function fibonacci(num) {
  x += var_not_defined;         # ERROR

  if (num == 0 OR num == 1) {
    x *= 10;
    return 0;
  }

  return fibonacci(num - 1) + fibonacci(num - 2);
}

class Entity {
  int foo = 1;              
  int foo;                                    # ERROR

  method(a) {
    let x = 1;
    let a = 1;                                # ERROR
  }
}

class HumanEntity extends Entity {}
class MonsterEntity extends x {}              # ERROR

const Entity entity = new Entity(x, z);
const human = new HumanEntity(x, z);
let PetEntity pet = new PetEntity(x, z);      # ERROR








