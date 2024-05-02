import {
  describe, expect, it, jest,
} from '@jest/globals';
import User from '../user/user.entities';
import UserService from './session.service.js';
import Session from './session.entities.js';
import SessionService from './session.service.js';
import { DateTime } from 'luxon';

describe('UserService', () => {
  const mockUsers = [
    new User('42@email.com', '42', 42, '4200a8f5185294c4fee1b41e'),
    new User('user1@example.com', 'password', 30, '661fa8f5185294c4fee1b41e'),
    new User('user2@example.com', 'password', 31, '001fa8f5185294c4fee1b41e'),
    new User('user3@example.com', 'password', 32, '111fa8f5185294c4fee1b41e'),
  ];


  const mockUserRepository = {
    getById: jest.fn((id) => mockUsers[0]),
    getByEmail: jest.fn((email) => mockUsers[0]),
    getAll: jest.fn(() => mockUsers),
    deleteById: jest.fn((id) => undefined),
    deleteAll: jest.fn(() => undefined),
    create: jest.fn((user) => new User(user.email, user.password, user.age, '661fa8f5185294c4fee1b41e')),
    update: jest.fn((user) => user),
    //addPauseToSession
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

      // WHEN
      await sessionService.addSession(userId);

      // THEN
      expect(mockSessionRepository.getById).toHaveBeenCalledWith(userId); // Vérifie que la méthode getById a été appelée avec le bon userId
    });
  });

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
        const portStartTime = new Date();
        const portEndTime = new Date();

        const customMockSessionRepository = {
          getByUserId: jest.fn().mockResolvedValue(new Session('10:00:00', '19:00:00', 1, 2, 1)), // Mock de la méthode getByUserId
          getSessionById: jest.fn().mockResolvedValue(new Session(new Date('2024-05-01T10:00:00'), new Date('2024-05-01T19:00:00'), 1, 2, 1)),
          endPortForUser: jest.fn().mockResolvedValue(), // Ajout d'un mock pour stopSession
          getById: jest.fn((userId) => new Session(new Date('2024-05-01T10:00:00'), new Date('2024-05-01T19:00:00'), 1, 2, 1)),
        };

        const customSessionService = new SessionService(customMockSessionRepository);

        // Vérification que stopSession a été appelé avec les bons arguments
       await expect(customSessionService.endPortForUser(userId, sessionId, portEndTime)).rejects.toThrow('Session not started or already stopped');;
      });

    });

    describe('calculateEndPortAfterStart', () => {
      it('should end a port after start for a user', async () => {
        const userId = 1;

        const customMockSessionRepository = {
          getById: jest.fn((userId) => new Session(
            DateTime.fromISO('10:00:00').toUTC(),
            DateTime.fromISO('19:00:00').toUTC(),
            1,
            2,
            1
          )),
        };
        const customSessionService = new UserService(customMockSessionRepository);
        const session = await customSessionService.getSessionById(1);
        const portEndTime = session.session_start.plus({ hours: 15 }).toUTC();

        const updatedSession = await customSessionService.calculateEndAfterStart(session.session_start);
        expect(updatedSession.toISO()).toEqual(portEndTime.toISO());
      });
    });

    describe('addPauseToPort', () => {
      it('should add a pause to a port for a user', async () => {
        const sessionId = 1;
        const pauseStartTime = DateTime.local();
        const pauseEndTime = DateTime.local().plus({ minutes: 30 });

        await sessionService.addPauseToSession(sessionId, pauseStartTime, pauseEndTime);

        const updatedSession = await sessionService.getSessionById(sessionId);
        const pauseAdded = updatedSession.pauses.find((pause) => {
          return pause.startTime.equals(pauseStartTime) && pause.endTime.equals(pauseEndTime);
        });
        expect(pauseAdded).toBeDefined();
      });
    });
    describe('getSessionByUserAndStopTime', () => {
      it('should throw an error if session does not started', async () => {
        // Création d'un mock pour le repository
        const mockRepository = {
          getByUserId: jest.fn().mockResolvedValue(new Session('10:00:00', '19:00:00', 1, 2, 1)), // Mock de la méthode getByUserId
          stopSession: jest.fn(), // Mock de la méthode stopSession
          getById: jest.fn((userId) => new Session(new Date('2024-05-01T10:00:00'), new Date('2024-05-01T19:00:00'), 1, 2, 1)),
        };

        // Création du service avec le mock repository
        const userService = new UserService(mockRepository);

        // Appel de la méthode à tester
        const userId = 1;
        const sessionId = 1;
        const portEndTime = new Date('2024-05-01T10:00:00');
        await expect(userService.getSessionByUserAndStopTime(userId, sessionId, portEndTime)).rejects.toThrow('Session not started or already stopped');

      });

      it('should throw an error if session does not exist', async () => {
        // Création d'un mock pour le repository
        const mockRepository = {
          getByUserId: jest.fn().mockResolvedValue(null), // Mock de la méthode getByUserId qui retourne null
        };

        // Création du service avec le mock repository
        const userService = new UserService(mockRepository);

        // Appel de la méthode à tester
        const userId = 1;
        const sessionId = 1;
        const portEndTime = new Date('2024-05-01T10:00:00');

        // Vérification que l'appel à getSessionByUserAndStopTime lance une erreur
        await expect(userService.getSessionByUserAndStopTime(userId, sessionId, portEndTime)).rejects.toThrow('Session does not exist');
      });
    });

    describe('startSession', () => {
      it('should start session if session exists and is not already started', async () => {
        // Création d'un mock pour le repository
        const mockRepository = {
          getSessionById: jest.fn().mockResolvedValue(new Session('10:00:00', '19:00:00', 1, 2, 1)), // Mock de la méthode getSessionById
          update: jest.fn(), // Mock de la méthode update
          getById: jest.fn((userId) => new Session(new Date('2024-05-01T10:00:00'), new Date('2024-05-01T19:00:00'), 1, 2, 1)),
        };

        // Création du service avec le mock repository
        const userService = new UserService(mockRepository);

        // Appel de la méthode à tester
        const sessionId = 1;
        const startTime = new Date('2024-05-01T10:00:00');
        await userService.startSession(sessionId, startTime);

        // Vérification que getSessionById a été appelé avec les bons arguments
        //expect(mockRepository.getSessionById).toHaveBeenCalledWith(sessionId);

        // Vérification que update a été appelé avec les bons arguments
        const updatedSession = new Session('10:00:00', '19:00:00', 1, 2, 1);
        updatedSession.startTime = startTime;
        //expect(mockRepository.update).toHaveBeenCalledWith(updatedSession);
      });

      it('should throw an error if session is already started', async () => {
        // Création d'un mock pour le repository
        const mockRepository = {
          getSessionById: jest.fn().mockResolvedValue(new Session(new Date('2024-05-01T10:00:00'), '19:00:00', 1, 2, 1)), // Mock de la méthode getSessionById
          getById: jest.fn((userId) => new Session(new Date('2024-05-01T10:00:00'), new Date('2024-05-01T19:00:00'), 1, 2, 1)),
          update: jest.fn((session) => session),
        };

        // Création du service avec le mock repository
        const userService = new UserService(mockRepository);

        // Appel de la méthode à tester
        const sessionId = 1;
        const startTime = new Date('2024-05-01T11:00:00');

        // Vérification que l'appel à startSession lance une erreur
        await expect(userService.startSession(sessionId, startTime)).rejects.toThrow('Session already started');
      });
    });

    describe('addSession', () => {
      it('should add session if user does not already have a session', async () => {
        // Création d'un mock pour le repository
        const mockRepository = {
          getById: jest.fn((userId) => new Session(new Date('2024-05-01T10:00:00'), new Date('2024-05-01T19:00:00'), 1, 2, 1)),
          create: jest.fn(), // Mock de la méthode create
        };

        // Création du service avec le mock repository
        const sessionService = new SessionService(mockRepository);

        // Appel de la méthode à tester
        const userId = 1;
        await sessionService.addSession(userId);

        // Vérification que getById a été appelé avec les bons arguments
        expect(mockRepository.getById).toHaveBeenCalledWith(userId);

        // Vérification que create a été appelé avec les bons arguments
        const newSession = new Session(); // Vous devez passer les bonnes valeurs pour créer une nouvelle session
        expect(mockRepository.create).toHaveBeenCalledWith(newSession);
      });

      it('should throw an error if user already has a session', async () => {
        // Création d'un mock pour le repository
        const mockRepository = {
          getById: jest.fn().mockResolvedValue(new Session()), // Mock de la méthode getById qui retourne une session
        };

        // Création du service avec le mock repository
        const userService = new UserService(mockRepository);

        // Appel de la méthode à tester
        const userId = 1;

        // Vérification que l'appel à addSession lance une erreur
        await expect(userService.addSession(userId)).rejects.toThrow('Session already exists');
      });
    });

    /*
    describe('getUserSessionsDashboard', () => {
      it('should get the dashboard with all sessions for a user', async () => {
        const userId = 1;

    describe('Données pour l\'Agence de Santé', () => {
      describe('calculatePortStatistics', () => {
        const calculatePortStatistics = (sessions) => {
          let totalUsers = 0;
          let totalDuration = 0;
          let minDuration = Infinity;
          let maxDuration = -Infinity;

          sessions.forEach((session) => {
            totalUsers++;
            totalDuration += session.duration;
            minDuration = Math.min(minDuration, session.duration);
            maxDuration = Math.max(maxDuration, session.duration);
          });

          const avgDuration = totalDuration / totalUsers;

          return {
            totalUsers,
            avgDuration,
            minDuration,
            maxDuration
          };
        };

        it('should calculate port duration statistics for all users', async () => {
          // GIVEN
          const mockSessions = [
            { userId: 1, duration: 3600 },
            { userId: 2, duration: 7200 },
            { userId: 3, duration: 5400 },
          ];

          const portStatistics = calculatePortStatistics(mockSessions);

          expect(portStatistics.totalUsers).toBe(3);
          expect(portStatistics.avgDuration).toBe(5400);
          expect(portStatistics.minDuration).toBe(3600);
          expect(portStatistics.maxDuration).toBe(7200);
        });
      });
    });



    describe('SessionService', () => {
      describe('processClientData', () => {
        it('should process client data correctly', () => {
          // GIVEN
          const clientData = [
            ['10h30-17h', '23h30-11h'],
            ['16h45-23h45'],
            ['1h30-7h', '13h-23h15'],
          ];

          const expectedSessions = [
            [
              new Session('10h30', '17h'),
              new Session('23h30', '11h')
            ],
            [
              new Session('16h45', '23h45')
            ],
            [
              new Session('1h30', '7h'),
              new Session('13h', '23h15')
            ],
          ];

          // WHEN
          const processedSessions = sessionService.processClientData(clientData);

          // THEN
          expect(processedSessions).toEqual(expectedSessions);
        });
      });
    });


  });
});
