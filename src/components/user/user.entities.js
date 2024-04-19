import {DateTime} from "luxon";

class User {
  constructor(email, password, age, _id = null, lastLogin = null) {
    if (_id) {
      this._id = _id;
    }
    this.email = email;
    this.password = password;
    this.age = age;
    this.lastLogin = lastLogin;
  }

  toJSON() {
    return {
      id: this._id,
      email: this.email,
      age: this.age || null,
      lastLogin: this.lastLogin ? this.lastLogin.toISO() : null,
    };
  }

  static fromDocument(doc) {
    return new User(doc.email, doc.password, doc.age, doc._id, doc.lastLogin ? DateTime.fromISO(doc.lastLogin) : null);
  }
}

export default User;
