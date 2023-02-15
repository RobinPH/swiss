
const float PI = 3.14159;

constant GOLDEN_RATIO = 1.618;
let a = 1.43;
constant string d = "Hello World";
let boolean e = true;
const bool g = 1;
let array arr = [1, 2, PI];


let int x = 0;
x++;


let z = x * a + PI + 2 * GOLDEN_RATIO;

function fibonacci(num) {


  if (num == 0 OR num == 1) {
    x *= 10;
    return 0;
  }

  return fibonacci(num - 1) + fibonacci(num - 2);
}

class Entity {
  int foo = 1;              


  method(a) {
    let x = 1;
  
  }
}

class HumanEntity extends Entity {}

const Entity entity = new Entity(x, z);
const human = new HumanEntity(x, z);








