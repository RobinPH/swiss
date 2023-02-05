const a;                # ERROR
let c = 1;
const c = 2;            # ERROR
let float d = 3.0;        
let string e = 4;       # ERROR
let char f = 'ab';      # ERROR
let bool g = true;
h += 1;                 # ERROR

class MyClass {}
let MyClass i;
let YourClass j;        # ERROR


function a(a, b) {}

class Test {}

const int t = 1;
const int u = 2;
const int v = t * u + 137 / u;
const int w = x;                  # ERROR
const Test y = new Test();      
const Test z = new Test2();       # ERROR
