class Animal {
  string name;

  constructor(name) {
    this.name = name;
  }

  greet() { }
}

class Cat extends Animal {
  constructor(name) {
    super(name + "-cat");
  }

  greet() {
    print("My name is ", this.name, ", I am a cat");
  }
}

class Dog extends Animal {
  greet() {
    print("My name is ", this.name, ", I am a dog");
  }
}

function main() {
  const Cat cat = new Cat("Mingming");
  const dog = new Dog("Blacky");

  cat.greet(); # My name is Mingming-cat, I am a cat
  dog.greet(); # My name is Blacky, I am a dog
}

main();