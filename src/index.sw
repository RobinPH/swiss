const GLOBAL_VARIABLE = 1;
const SOMETHING = 1;
const foo = 'str';
let arr1 = [];
let arr2 = [[1], 2, 3, 'str', [[[[]]]]];

# comment

### 
    Multi-line Comment
###

function main() {
    const int a = 1;
    let b = 3.141519;
    constant cint = "HELLO WORLD!";
    const intc = "HELLO WORLD!";

    function functiona(a, b) { # Hi
        a++;
    }

    function func() {}

    ### 
    Multi-line Comment
    ###

    # Comment

    ++a;

    b += 1;
    const exponent = 2 * (1 + 2);
    b **= exponent;

    if (a < 1) {
        const d = 1;
    } else {
        if (b > 2) {
            # code
        } else if (d > 2) {
            # code
            a++;
        } else {
            const z = [];
        }
    }

    for (let i = 0; i < 5; i++) {
        const a = 1;

        if (a > 1) {
            b /= 1;
        }
    }

    while (b > 0) {
        # code
    }

    do {
        # code
    } while (c > 0);
}