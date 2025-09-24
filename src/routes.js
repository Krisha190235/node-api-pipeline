const router = require('express').Router();
const items = require('./controllers/items.controller');

router.get('/items', items.list);
router.get('/items/:id', items.get);
router.post('/items', items.create);
router.put('/items/:id', items.update);
router.delete('/items/:id', items.remove);

module.exports = router;