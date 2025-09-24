const svc = require('../services/items.service');

exports.list = (req, res) => res.json(svc.list());
exports.get = (req, res) => {
  const item = svc.get(req.params.id);
  return item ? res.json(item) : res.status(404).json({error:'Not found'});
};
exports.create = (req, res) => res.status(201).json(svc.create(req.body));
exports.update = (req, res) => {
  const updated = svc.update(req.params.id, req.body);
  return updated ? res.json(updated) : res.status(404).json({error:'Not found'});
};
exports.remove = (req, res) => {
  const ok = svc.remove(req.params.id);
  return ok ? res.status(204).send() : res.status(404).json({error:'Not found'});
};