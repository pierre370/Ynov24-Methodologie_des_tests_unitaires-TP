import e from 'express';
import Session from './session.entities.js';

class SessionController {
  constructor(sessionService) {
    this.sessionService = sessionService;
  }

  createSession = async (req, res) => {
    this.sessionService.addSession(new Session(req.body.session_start, req.body.session_end, req.body.user_id, req.body.lens_id))
      .then((createdSession) => res.status(201).send(createdSession.toJSON()))
      .catch((err) => res.status(403).send(err.message));
  };

  updateSession = async (req, res) => {
    this.sessionService.updateSession(new Session(req.body.session_start, req.body.session_end, req.body.user_id, req.body.lens_id))
      .then((createdSession) => res.status(200).send(createdSession.toJSON()))
      .catch((err) => res.status(404).send(err.message));
  };

  getSession = async (_, res) => {
    const session = await this.sessionService.getSession();
    const sessionJSON = session.map((ses) => ses.toJSON());
    res.status(200).send(sessionJSON);
  };

  getSessionById = async (req, res) => {
    const { id } = req.params;
    this.sessionService.getSessionById(id)
      .then((createdSession) => res.status(200).send(createdSession))
      .catch((err) => res.status(404).send(err.message));
  };

  // FIXME just a promise & no check on id path
  deleteSessionById = (req, res) => {
    const { id } = req.params;
    res.status(200).send(this.sessionService.deleteSessionById(id));
  };


  getAllSessionsByUser = async (req, res) => {
    const { userId } = req.params;
    const sessions = await this.sessionService.getAllSessionsByUser(userId);
    res.status(200).send(sessions);
  };

  getSessionsByLens = async (req, res) => {
    const { lensId } = req.params;
    const sessions = await this.sessionService.getSessionsByLens(lensId);
    res.status(200).send(sessions);
  };

  getSessionDuration = async (_, res) => {
    const duration = await this.sessionService.getSessionDuration();
    res.status(200).send({ duration });
  };

  getSessionsByUser = async (req, res) => {
    const { userId } = req.params;
    const sessions = await this.sessionService.getSessionsByUser(userId);
    res.status(200).send(sessions);
  };


  deleteSession = (_, res) => res.status(200).send(this.sessionService.deleteSession());
}

export default SessionController;
