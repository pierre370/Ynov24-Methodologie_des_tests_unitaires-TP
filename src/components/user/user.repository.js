import db from "../../mongo/db.js";
import {ObjectId} from "mongodb";
import User from "./user.entities.js";

class UserRepository {
    constructor() {
        this.collection = db.collection("users");
    }

    async getById(id) {
        const query = this.createBsonId(id);
        return User.fromDocument(await this.collection.findOne(query));
    }

    async getByEmail(email) {
        let query = {email: email};
        const document = await this.collection.findOne(query);
        if (!document) {
            return undefined
        }
        return User.fromDocument(document);
    }

    getAll = async () => {
        const documents = await this.collection.find({}).toArray();
        return documents.map(doc => User.fromDocument(doc));
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
                email: document.email,
                password: document.password,
                age: document.age,
                lastLogin: document.lastLogin
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

export default UserRepository;
