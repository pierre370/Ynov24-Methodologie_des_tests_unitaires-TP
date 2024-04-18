class User {
  constructor(email, password, age, _id = null) {
    if (_id) {
      this._id = _id;
    }
    this.email = email;
    this.password = password;
    this.age = age;
  }

  toJSON() {
    return {
      id: this._id,
      email: this.email,
      age: this.age || null,
    };
  }

  static fromDocument(doc) {
    return new User(doc.email, doc.password, doc.age, doc._id);
  }
}

export default User;
