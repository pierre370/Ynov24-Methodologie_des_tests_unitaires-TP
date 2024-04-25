import {DateTime} from "luxon";

class Session {
  constructor(session_start,session_end,user_id, lens_id,  id = null) {
    if (id) {
      this.id = id;
    }
    this.session_start = session_start;
    this.session_end = session_end;
    this.user_id = user_id;
    this.lens_id = lens_id

  }

  toJSON() {
    return {
      id: this.id,
      session_start: this.session_start,
      session_end: this.session_end,
      user_id: this.user_id,
      lens_id: this.lens_id,
    };
  }

  static fromDocument(doc) {
    return new Session(doc.session_start, doc.session_end, doc.user_id, doc.lens_id, doc.id);
  }

}

export default Session;
