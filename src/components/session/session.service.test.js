import User from '../user/user.entities';
import {describe, expect, it, jest} from '@jest/globals';
import UserService from "./session.service.js";
import Session from "./session.entities.js";
import SessionService from "./session.service.js";

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

  const mockSession = [
    new Session('10:00:00', '19:00:00', 1, 2, 1),
    new Session('08:00:00', '19:00:00', 2, 3, 2),
    new Session('12:00:00', '19:00:00', 3, 4, 3),
    new Session('13:00:00', '19:00:00', 4, 5, 4),
  ];

  const mockSessionRepository = {
    getById: jest.fn((id) => mockSession[0]),
    getByEmail: jest.fn((email) => mockSession[0]),
    getAll: jest.fn(() => mockSession),
    deleteById: jest.fn((id) => undefined),
    deleteAll: jest.fn(() => undefined),
    create: jest.fn((session) => new Session(session.session_start, session.session_end, session.user_id, session.lens_id, session.id)),
    update: jest.fn((session) => session),
  };

  const userService = new UserService(mockUserRepository);
  const sessionService = new SessionService(mockSessionRepository);

  describe('addSession', () => {
    it('should add a session for a user', async () => {
      // GIVEN
      const userId = '4200a8f5185294c4fee1b41e'; // ID de l'utilisateur
      const startTime = new Date(); // Heure de début de la session

      const user = new User('test@example.com', 'password123', 42);

      const customMockUserRepository = {
        getById: jest.fn(() => userId),
        create: jest.fn((user) => new User(user.email, user.password, user.age, "661fa8f5185294c4fee1b41e"))
      };

      // WHEN
      await sessionService.addSession(userId);

      // THEN
      expect(customMockUserRepository.getById).toHaveBeenCalledWith(userId); // Vérifie que la méthode getById a été appelée avec le bon userId

      // Vous pouvez également vérifier d'autres aspects de la session ajoutée si nécessaire
    });

  })
  describe('UserService', () => {
    describe('startPort', () => {
      it('should start a port for a user', async () => {
        // GIVEN
        const userId = 1;
        const portStartTime = new Date();

        const session = await sessionService.getSessionByUserAndStartTime(userId, portStartTime);
        expect(session.userId).toBe(userId);
        expect(session.startTime).toEqual(portStartTime);
      });
    });

    describe('endPort', () => {
      it('should end a port for a user', async () => {
        const userId = 1;
        const sessionId = 1;
        const portEndTime = new Date();

        const updatedSession =  await sessionService.getSessionByUserAndStopTime(userId, sessionId, portStartTime);
        expect(updatedSession.endTime).toEqual(portEndTime);
      });
    });
    describe('calculateEndPortAfterStart', () => {
      it('should end a port after start for a user', async () => {
        const userId = 1;
        const customMockSessionRepository = {
          getById: jest.fn((userId) => new Session('10:00:00', '19:00:00', 1, 2, 1))
        }
        const customSessionService = new UserService(customMockSessionRepository);
        const session = await customSessionService.getSessionById(1);
        const portEndTime = session.start_time.setHours(session.start_time.getHours() + 15);

        const updatedSession =  await sessionService.calculateEndAfterStart(sessionId);
        expect(updatedSession.endTime).toEqual(portEndTime);
      });
    });

    describe('addPauseToPort', () => {
      it('should add a pause to a port for a user', async () => {
        const userId = 1;
        const sessionId = 1;
        const pauseStartTime = new Date();
        const pauseEndTime = new Date();

        await userService.addPauseToSession(userId, sessionId, pauseStartTime, pauseEndTime);

        const updatedSession = await sessionService.getSessionById(sessionId);
        const pauseAdded = updatedSession.pauses.find((pause) => pause.startTime === pauseStartTime && pause.endTime === pauseEndTime);
        expect(pauseAdded).toBeDefined();
      });
    });

    /*
    describe('getUserSessionsDashboard', () => {
      it('should get the dashboard with all sessions for a user', async () => {
        const userId = 1;

        const dashboardSessions = await dashboardService.getAllUserSessions(userId);

        const userSessions = await sessionService.getSessionsByUserId(userId);
        expect(dashboardSessions).toEqual(userSessions);
      });
    });
    */
  });
});
