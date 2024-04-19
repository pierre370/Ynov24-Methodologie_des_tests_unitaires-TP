
class Session {
  constructor(session_start,session_end,user_id, lens_id,  _id = null) {
    if (_id) {
      this._id = _id;
    }
    this.session_start = session_start;
    this.session_end = session_end;
    this.user_id = user_id;
    this.lens_id = lens_id

  }

  toJSON() {
    return {
      id: this._id,
      session_start: this.session_start,
      session_end: this.session_end,
      user_id: this.user_id,
      lens_id: this.lens_id,
    };
  }

}

export default Lens;
