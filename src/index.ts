const world = "world";

export function hello(who: string = world): string {
  return `Hello ${who}! 1xsx`;
}

console.log(hello());
