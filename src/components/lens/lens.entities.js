
class Lens {
  constructor(user_id,name, _id = null) {
    if (_id) {
      this._id = _id;
    }
    this.user_id = user_id;
    this.name = name;

  }

  toJSON() {
    return {
      id: this._id,
      user_id: this.user_id,
      name: this.name,
    };
  }

}

export default Lens;
