import {DateTime} from "luxon";

class UserService {
  constructor(repository) {
    this.repository = repository;
  }

  addUser = async (user) => {
    if (await this.repository.getByEmail(user.email) == null) {
      return this.repository.create(user);
    } else {
      throw new Error('User already exists');
    }
  };

  updateUser = async (user) => {
    await this.getUserById(user._id); // Alternatively you can create with put if it does not exist
    return await this.repository.update(user);
  };


  getUsers = () => this.repository.getAll();

  getUserById = async (id) => {
    const user = await this.repository.getById(id);
    if (user) {
      return user
    } else {
      throw new Error('User does not exists');
    }
  };

  // TODO throw if not founded using property "deletedCount" of return value
  deleteUserById = (id) => this.repository.deleteById(id);

  deleteUsers = () => this.repository.deleteAll();

  login = async (email, password) => {
    const user = await this.repository.getByEmail(email);
    if (!user || user.password !== password) {
      throw new Error('Invalid Login');
    } else {
      user.lastLogin = DateTime.local(); // Set lastLogin to the current time
      this.repository.update(user); // Update the user's lastLogin in the repository
      return user;
    }
  };
}

export default UserService;
