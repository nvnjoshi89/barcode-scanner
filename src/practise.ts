class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const user = new User('name');
console.log(user);
