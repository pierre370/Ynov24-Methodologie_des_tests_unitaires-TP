import e from 'express';
import Lens from './lens.entities.js';

class LensController {
  constructor(lensService) {
    this.lensService = lensService;
  }

  createLens = async (req, res) => {
    this.lensService.addLens(new Lens(req.body.user_id, req.body.name))
      .then((createdLens) => res.status(201).send(createdLens.toJSON()))
      .catch((err) => res.status(403).send(err.message));
  };

  updateLens = async (req, res) => {
    this.lensService.updateLens(new Lens(req.body.user_id, req.body.name))
      .then((createdLens) => res.status(200).send(createdLens.toJSON()))
      .catch((err) => res.status(404).send(err.message));
  };

  getLens = async (_, res) => {
    const lens = await this.lensService.getLens();
    const lensJSON = lens.map((len) => len.toJSON());
    res.status(200).send(lensJSON);
  };

  getLensById = async (req, res) => {
    const { id } = req.params;
    this.lensService.getLensById(id)
      .then((createdLens) => res.status(200).send(createdLens))
      .catch((err) => res.status(404).send(err.message));
  };

  // FIXME just a promise & no check on id path
  deleteLensById = (req, res) => {
    const { id } = req.params;
    res.status(200).send(this.lensService.deleteLensById(id));
  };

  deleteLens = (_, res) => res.status(200).send(this.lensService.deleteLens());
}

export default LensController;
