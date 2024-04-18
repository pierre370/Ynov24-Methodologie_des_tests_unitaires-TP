import User from './user.entities.js';
import e from "express";

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  createUser = async (req, res) => {
    this.userService.addUser(new User(req.body.email, req.body.password, req.body.age))
        .then(createdUser => res.status(201).send(createdUser.toJSON()))
        .catch(err => res.status(403).send(err.message))
  };

  updateUser = async (req, res) => {
    this.userService.updateUser(new User(req.body.email, req.body.password, req.body.age, req.body.id))
        .then(createdUser => res.status(200).send(createdUser.toJSON()))
        .catch(err => res.status(404).send(err.message))
  };

  getUsers = async (_, res) => {
    const users = await this.userService.getUsers();
    const usersJSON = users.map(user => user.toJSON());
    res.status(200).send(usersJSON);
  };

  getUserById = async (req, res) => {
    const { id } = req.params;
    this.userService.getUserById(id)
        .then(createdUser => res.status(200).send(createdUser))
        .catch(err => res.status(404).send(err.message))
  };

  // FIXME just a promise & no check on id path
  deleteUserById = (req, res) => {
    const { id } = req.params;
    res.status(200).send(this.userService.deleteUserById(id));
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    this.userService.login(email, password)
        .then(createdUser => res.status(201).send(createdUser))
        .catch(err => res.status(401).send(err.message))
  };

  // just a promise
  deleteUsers = (_, res) => res.status(200).send(this.userService.deleteUsers());
}

export default UserController;
