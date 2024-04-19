import db from "../../mongo/db.js";
import {ObjectId} from "mongodb";
import Lens from "./lens.entities.js";

class LensRepository {
  constructor() {
    this.collection = db.collection("lens");
  }

  async getById(id) {
    const query = this.createBsonId(id);
    return Lens.fromDocument(await this.collection.findOne(query));
  }

  async getByName(name) {
    let query = {name: name};
    const document = await this.collection.findOne(query);
    if (!document) {
      return undefined
    }
    return Lens.fromDocument(document);
  }

  getAll = async () => {
    const documents = await this.collection.find({}).toArray();
    return documents.map(doc => Lens.fromDocument(doc));
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
        user_id: document.user_id,
        name: document.name
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

export default LensRepository;
