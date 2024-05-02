import Session from './session.entities';

class SessionService {
  constructor(repository, user) {
    this.repository = repository;
    this.user = user;
  }

  addSession = async (userId) => {
    const existingSession = await this.repository.getById(userId);
    if (!existingSession) {
      const user = await this.user.getById(userId);
      if (user) {
        return this.repository.create(user);
      }
      throw new Error('User not found');
    } else {
      throw new Error('Session already exists');
    }
  };

  updateSession = async (session) => {
    await this.getSessionById(session._id);
    return await this.repository.update(session);
  };

  getSession = () => this.repository.getAll();

  getSessionById = async (id) => {
    const session = await this.repository.getById(id);
    if (session) {
      return session;
    }
    throw new Error('Session does not exists');
  };

  startSession = async (sessionId, startTime) => {
    const session = await this.getSessionById(sessionId);
    if (!session.startTime) {
      session.startTime = startTime;
      return this.repository.update(session);
    }
    throw new Error('Session already started');
  };

  stopSession = async (sessionId, endTime) => {
    const session = await this.getSessionById(sessionId);
    if (session.startTime && !session.endTime) {
      session.endTime = endTime;
      return this.repository.update(session);
    }
    throw new Error('Session not started or already stopped');
  };

  calculateEndAfterStart = (start) => start.plus({ hours: 15 })
    ;

  validateSessionTimes = (start, end) => start <= end;

  // TODO throw if not founded using property "deletedCount" of return value
  deleteSessionById = (id) => this.repository.deleteById(id);

  deleteSession = () => this.repository.deleteAll();

  async getSessionByUserAndStartTime(userId, portStartTime) {
    const session = await this.repository.getByUserId(userId);
    if (session) {
      await this.startSession(session.id, portStartTime);
    } else {
      throw new Error('Session does not exists');
    }
  }

  async addPauseToSession(sessionId, pauseStartTime, pauseEndTime) {
    const session = await this.repository.getById(sessionId);
    if (session) {
      session.addPause(pauseStartTime, pauseEndTime);
      await this.repository.update(session);
    } else {
      throw new Error('Session does not exist');
    }
  }

  async getSessionByUserAndStopTime(userId, sessionId, portEndTime) {
    const session = await this.repository.getByUserId(userId);
    if (session && sessionId === session.id) {
      await this.stopSession(session.id, portEndTime);
    } else {
      throw new Error('Session does not exists');
    }
  }

  async processClientData(clientData) {
    return clientData.map((dayData) => {
      return dayData.map((sessionData) => {
        const [start, end] = sessionData.split('-');
        return new Session(start, end);
      });
    });
  }
}

export default SessionService;
