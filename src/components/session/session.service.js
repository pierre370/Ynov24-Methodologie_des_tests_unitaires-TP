import {DateTime} from "luxon";

class SessionService {
  constructor(repository) {
    this.repository = repository;
  }

  addSession = async (session) => {
    if (await this.repository.getById(session.id) == null) {
      return this.repository.create(session);
    } else {
      throw new Error('Session already exists');
    }
  };

  updateSession = async (session) => {
    await this.getSessionById(session._id); // Alternatively you can create with put if it does not exist
    return await this.repository.update(session);
  };

  getSession = () => this.repository.getAll();

  getSessionById = async (id) => {
    const session = await this.repository.getById(id);
    if (session) {
      return session
    } else {
      throw new Error('Session does not exists');
    }
  };

  startSession = async (sessionId, startTime) => {
    const session = await this.getSessionById(sessionId);
    if (!session.startTime) {
      session.startTime = startTime;
      return this.repository.update(session);
    } else {
      throw new Error('Session already started');
    }
  };

  stopSession = async (sessionId, endTime) => {
    const session = await this.getSessionById(sessionId);
    if (session.startTime && !session.endTime) {
      session.endTime = endTime;
      return this.repository.update(session);
    } else {
      throw new Error('Session not started or already stopped');
    }
  };

  calculateEndAfterStart = (start, duration) => {
    return start.plus({ hours: duration });
  };

  validateSessionTimes = (start, end) => {
    return start <= end;
  };


  // TODO throw if not founded using property "deletedCount" of return value
  deleteSessionById = (id) => this.repository.deleteById(id);

  deleteSession = () => this.repository.deleteAll();

}

export default SessionService;
