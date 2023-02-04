let x = 1;
x += 1;
let d = 1;

function a(x, y, z) {
  x++;
  y += 1;
  let c = 1;
  c += 1;
  d += 1;

  function a() {
    y += 1;
  }
}

