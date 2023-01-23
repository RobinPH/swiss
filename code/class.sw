class Animal {
  string name;

  constructor(animalName) {
    name = animalName;
  }
}

class Cat extends Animal {
  constructor() {
    super("Mingming");
  }
}

class Dog extends Animal {
  constructor() {
    super("Blacky");
  }
}

function main() {
  const Cat cat = new Cat();
  const dog = new Dog();
}

main();