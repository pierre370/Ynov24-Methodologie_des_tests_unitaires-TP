import db from "../../mongo/db.js";
import {ObjectId} from "mongodb";
import Session from "./session.entities.js";

class SessionRepository {
  constructor() {
    this.collection = db.collection("session");
  }

  async getById(id) {
    const query = this.createBsonId(id);
    return Session.fromDocument(await this.collection.findOne(query));
  }


  getAll = async () => {
    const documents = await this.collection.find({}).toArray();
    return documents.map((doc) => Session.fromDocument(doc));
  };

  deleteAll = async () => await this.collection.deleteMany({});

  async create(document) {
    const res = await this.collection.insertOne(document);
    document.id = res.insertedId.toString()
    return document;
  };

  async update(document) {
    const filter = this.createBsonId(document._id);
    const updateDocument = {
      $set: {
        session_start: document.session_start,
        session_end: document.session_end,
        user_id: document.user_id,
        lens_id: document.lens_id
      }
    };
    await this.collection.updateOne(filter, updateDocument);
    return await this.getById(document._id);
  }


  async deleteById(id) {
    const query = this.createBsonId(id)
    return await this.collection.deleteOne(query);
  }

  createBsonId(id) {
    let query;
    try {
      query = {_id: new ObjectId(id)};
    } catch (err) {
      throw new Error('Invalid id');
    }
    return query;
  }
}

export default SessionRepository;
