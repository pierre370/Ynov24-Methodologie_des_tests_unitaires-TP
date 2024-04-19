import User from './user.entities';
import {describe, expect, it, jest} from '@jest/globals';
import UserService from "./user.service.js";

describe('UserService', () => {

  const mockUsers = [
    new User("42@email.com", "42", 42, "4200a8f5185294c4fee1b41e"),
    new User("user1@example.com", "password", 30, "661fa8f5185294c4fee1b41e"),
    new User("user2@example.com", "password", 31, "001fa8f5185294c4fee1b41e"),
    new User("user3@example.com", "password", 32, "111fa8f5185294c4fee1b41e")
  ];

  const mockUserRepository = {
    getById: jest.fn((id) => mockUsers[0]),
    getByEmail: jest.fn((email) => mockUsers[0]),
    getAll: jest.fn(() => mockUsers),
    deleteById: jest.fn((id) => undefined),
    deleteAll: jest.fn(() => undefined),
    create: jest.fn((user) => new User(user.email, user.password, user.age, "661fa8f5185294c4fee1b41e")),
    update: jest.fn((user) => user),
  };

  const userService = new UserService(mockUserRepository);

  describe('addUser', () => {
    it('should start a session for a user', async () => {
      // GIVEN
      const userId = '4200a8f5185294c4fee1b41e'; // ID de l'utilisateur
      const startTime = new Date(); // Heure de début de la session
      const expectedSession = /* Session attendue après le démarrage */;

      // WHEN
      await userService.startSession(userId, startTime);

      // THEN
      const user = await userService.getUserById(userId);
      expect(user.sessions.length).toBe(1); // Vérifie qu'une session a été ajoutée à l'utilisateur
      const session = user.sessions[0];
      expect(session.startTime).toEqual(startTime); // Vérifie que l'heure de début de la session est correcte
      // Vous pouvez ajouter d'autres assertions pour vérifier d'autres propriétés de la session si nécessaire
    });
});
