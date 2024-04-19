import {DateTime} from "luxon";

class LensService {
  constructor(repository) {
    this.repository = repository;
  }

  addLens = async (lens) => {
    if (await this.repository.getByName(lens.name) == null) {
      return this.repository.create(lens);
    } else {
      throw new Error('Lens already exists');
    }
  };

  updateLens = async (lens) => {
    await this.getLensById(lens._id); // Alternatively you can create with put if it does not exist
    return await this.repository.update(lens);
  };


  getLens = () => this.repository.getAll();

  getLensById = async (id) => {
    const lens = await this.repository.getById(id);
    if (lens) {
      return lens
    } else {
      throw new Error('Lens does not exists');
    }
  };

  // TODO throw if not founded using property "deletedCount" of return value
  deleteLensById = (id) => this.repository.deleteById(id);

  deleteLens = () => this.repository.deleteAll();

}

export default LensService;
