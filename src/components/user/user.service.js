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

  login = (email, password) => {
    const user = this.repository.getByEmail(email);
    if (!user || user.password !== password) {
      throw new Error('Invalid Login');
    } else {
      return user;
    }
  };
}

export default UserService;
